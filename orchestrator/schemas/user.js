const axios = require('axios')
const redis = require('../config/redis')
let baseUrl = 'http://service-users:4001/users/' || process.env.USER_URL

const typeDefs = `#graphql
type User {
    _id: String
    username: String
    email: String
    role: String
    phoneNumber: String
    address: String
}
input UserInput {
    username: String
    email: String
    password: String
    phoneNumber: String
    address: String
}
type Message{
    message: String
}

type Query {
    getUsers: [User]
    getUser(id: String): User
}

type Mutation {
    addUser(user: UserInput): Message
    deleteUser(id: String): Message
}
`;

const resolvers = {
    Query: {
        getUsers: async () => {
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

                return resData

            } catch (error) {
                throw error
            }
        },
        getUser: async (_, args) => {
            try {
                let resData

                let cache = await redis.get(`user/${args.id}`)

                if (!cache) {
                    let { data } = await axios.get(baseUrl + args.id)
                    resData = data
                    await redis.set(`user/${args.id}`, JSON.stringify(data))
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
        addUser: async (_, args) => {
            try {
                let { data } = await axios.post(baseUrl, args.user)
                await redis.del('users')
                return data

            } catch (error) {
                throw error
            }
        },
        deleteUser: async (_, args) => {
            try {
                let { data } = await axios.delete(baseUrl + args.id)
                await redis.del('users')
                await redis.del(`user/${args.id}`)
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