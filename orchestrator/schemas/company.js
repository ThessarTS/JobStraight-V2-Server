const axios = require('axios')
const redis = require('../config/redis')
let baseUrl = 'http://service-app:4002/companies/' || process.env.COMPANY_URL

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


type Query {
    getCompanies: [Company]
    getCompany(id:ID): Company
}
`;

const resolvers = {
    Query: {
        getCompanies: async () => {
            try {
                let cache = await redis.get('companies')
                let resData
                if (!cache) {
                    let { data } = await axios.get(baseUrl)
                    await redis.set('companies', JSON.stringify(data))
                    resData = data
                } else {
                    resData = JSON.parse(cache)
                }

                return resData

            } catch (error) {
                throw error
            }
        },

        getCompany: async (_, args) => {
            try {
                let cache = await redis.get(`company/${args.id}`)
                let resData
                if (!cache) {
                    let { data } = await axios.get(baseUrl + args.id)
                    resData = data
                    await redis.set(`company/${args.id}`, JSON.stringify(data))
                } else {
                    resData = JSON.parse(cache)
                }

                return resData

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