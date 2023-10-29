require('dotenv').config()
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { typeDefs: userTypeDefs, resolvers: userResolvers } = require('./schemas/user')
const { typeDefs: jobTypeDefs, resolvers: jobResolvers } = require('./schemas/job')
const { typeDefs: companyTypeDefs, resolvers: companyResolvers } = require('./schemas/company')

const server = new ApolloServer({
  typeDefs: [userTypeDefs, jobTypeDefs, companyTypeDefs],
  resolvers: [userResolvers, jobResolvers, companyResolvers],
  introspection: true
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
})
  .then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  })

