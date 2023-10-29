const axios = require('axios')

let baseUrl = 'http://localhost:4002/jobs/'

const Redis = require('ioredis')

const redis = new Redis({

    password: '1W1RRYKu3f7UhmZH3Ho4WSgmILEwI4Sc',
    host: 'redis-19467.c295.ap-southeast-1-1.ec2.cloud.redislabs.com',
    port: 19467

})

class JobController {
    static async findAllJob(req, res) {
        try {
            let resData

            let cache = await redis.get('jobs')

            if (!cache) {
                let { data } = await axios.get(baseUrl)
                resData = data
                await redis.set('jobs', JSON.stringify(data))
            } else {
                resData = JSON.parse(cache)
            }

            res.json(resData)

        } catch (error) {
            res.status(error.response.status).json(error.response.data)
        }
    }
    static async findJobById(req, res) {
        try {
            let resData

            let cache = await redis.get(`job/${req.params.id}`)

            if (!cache) {
                let response = await axios.get(baseUrl + req.params.id)
                let job = response.data
                let { data } = await axios.get('http://localhost:4001/users/' + job.mongoId)
                job.User = data
                resData = job
                await redis.set(`job/${req.params.id}`, JSON.stringify(job))
            } else {
                resData = JSON.parse(cache)
            }

            res.json(resData)

        } catch (error) {
            res.status(error.response.status).json(error.response.data)
        }
    }
    static async addNewJob(req, res) {
        try {
            let input = req.body
            input.mongoId = "6526ad6f3fffb6c2e34d3f6d"

            let { data } = await axios.post(baseUrl, input)
            await redis.del("jobs")
            res.status(201).json(data)

        } catch (error) {
            res.status(error.response.status).json(error.response.data)
        }
    }
    static async editJob(req, res) {
        try {
            let { data } = await axios.put(baseUrl + req.params.id, req.body)
            await redis.del("jobs")
            await redis.del(`job/${req.params.id}`)
            res.json(data)

        } catch (error) {
            res.status(error.response.status).json(error.response.data)
        }
    }
    static async deleteJob(req, res) {
        try {
            let { data } = await axios.delete(baseUrl + req.params.id)
            await redis.del("jobs")
            await redis.del(`job/${req.params.id}`)
            res.json(data)

        } catch (error) {
            res.status(error.response.status).json(error.response.data)
        }
    }
}

module.exports = JobController