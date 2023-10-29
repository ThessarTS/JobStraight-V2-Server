const axios = require('axios')
const redis = require('../config/redis')
let baseUrl = 'http://service-app:4002/jobs/' || process.env.JOB_URL

const typeDefs = `#graphql
type Company {
    id: ID
    name: String
    description: String
    location: String
    email: String
    companyLogo: String
    createdAt: String
    updatedAt: String

}
type Skill {
    id: ID
    jobId: Int
    name: String
    level: String
    createdAt: String
    updatedAt: String
}
type User {
    _id: String
    username: String
    email: String
    role: String
    phoneNumber: String
    address: String
}
type Job {
    id: ID
    title: String
    description: String
    salary: Int
    jobType: String
    mongoId: String
    createdAt: String
    updatedAt: String
    companyId: Int
    Company: Company
    Skills: [Skill]
    User: User
}

input SkillInput{
    name: String
    level: String
}

input JobInput{
    title: String!
    description: String!
    salary: Int
    jobType: String!
    companyId: Int!
    skills: [SkillInput]

}

type Message{
    message: String
}

type Query {
    getJobs: [Job]
    getJob(id:ID): Job
}
type Mutation {
    addJob(job: JobInput): Message
    editJob(job: JobInput, id:ID): Message
    deleteJob(id:ID): Message
}
`;

const resolvers = {
    Query: {
        getJobs: async () => {
            try {
                let cache = await redis.get('jobs')
                let resData
                if (!cache) {
                    let { data } = await axios.get(baseUrl)
                    await redis.set('jobs', JSON.stringify(data))
                    resData = data
                } else {
                    resData = JSON.parse(cache)
                }
                return resData

            } catch (error) {
                throw error
            }
        },

        getJob: async (_, args) => {
            try {
                let cache = await redis.get(`job/${args.id}`)
                let resData
                if (!cache) {
                    let response = await axios.get(baseUrl + args.id)
                    let job = response.data
                    let { data } = await axios.get('http://service-users:4001/users/' + job.mongoId)
                    job.User = data
                    resData = job
                    await redis.set(`job/${args.id}`, JSON.stringify(job))
                } else {
                    resData = JSON.parse(cache)
                }

                return resData

            } catch (error) {
                throw error
            }
        }

    },
    Mutation: {
        addJob: async (_, args) => {
            try {
                let input = args.job

                input.mongoId = "652cb70c0e9df6fc7849206d"

                let { data } = await axios.post(baseUrl, input)
                await redis.del("jobs")
                return data
            } catch (error) {
                throw error
            }
        },
        editJob: async (_, args) => {
            try {
                let { data } = await axios.put(baseUrl + args.id, args.job)
                await redis.del("jobs")
                await redis.del(`job/${args.id}`)
                return data

            } catch (error) {
                throw error
            }
        },
        deleteJob: async (_, args) => {
            try {
                let { data } = await axios.delete(baseUrl + args.id)
                await redis.del("jobs")
                await redis.del(`job/${args.id}`)
                return data

            } catch (error) {
                throw error
            }
        }

    }
}

module.exports = {
    typeDefs,
    resolvers
}