const axios = require('axios')

let baseUrl = 'http://localhost:4001/users/'

const Redis = require('ioredis')

const redis = new Redis({

    password: '1W1RRYKu3f7UhmZH3Ho4WSgmILEwI4Sc',
    host: 'redis-19467.c295.ap-southeast-1-1.ec2.cloud.redislabs.com',
    port: 19467

})

class UserController {
    static async findAllUser(req, res) {
        try {
            let resData

            let cache = await redis.get('users')

            if (!cache) {
                let { data } = await axios.get(baseUrl)
                resData = data
                await redis.set('users', JSON.stringify(data))
            } else {
                resData = JSON.parse(cache)
            }

            res.json(resData)

        } catch (error) {
            res.status(error.response.status).json(error.response.data)
        }
    }
    static async findUserById(req, res) {
        try {
            let resData

            let cache = await redis.get(`user/${req.params.id}`)

            if (!cache) {
                let { data } = await axios.get(baseUrl + req.params.id)
                resData = data
                await redis.set(`user/${req.params.id}`, JSON.stringify(data))
            } else {
                resData = JSON.parse(cache)
            }

            res.json(resData)

        } catch (error) {
            res.status(error.response.status).json(error.response.data)
        }
    }
    static async addNewUSer(req, res) {
        try {
            let { data } = await axios.post(baseUrl, req.body)
            await redis.del('users')
            res.status(201).json(data)

        } catch (error) {
            res.status(error.response.status).json(error.response.data)
        }
    }
    static async deleteUser(req, res) {
        try {
            let { data } = await axios.delete(baseUrl + req.params.id)
            await redis.del('users')
            await redis.del(`user/${req.params.id}`)
            res.json(data)

        } catch (error) {
            res.status(error.response.status).json(error.response.data)
        }
    }
}

module.exports = UserController