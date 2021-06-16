const { gql, ApolloServer } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')
const { ApolloGateway } = require('@apollo/gateway')
const fetch = require('node-fetch')

const services = [
  {
    name: 'serviceA',
    url: 'http://localhost:9993/graphql',
    typeDefs: gql(`
    interface Node {
      id: ID!
    }

    interface Role {
      name: String!
    }

    type Talent implements Role & Node @key(fields: "id") {
      id: ID!
      name: String!
      talentField: String!
    }

    type Staff implements Role & Node @key(fields: "id") {
      id: ID!
      name: String!
      staffField: String!
    }

    type Query {
      testField1: [Node]
    }
    `),
    resolvers: {
      Query: {
        testField1() {
          return [
            { id: '1', name: 'John Doe', talentField: 'talent', type: 'Talent' },
            { id: '2', name: 'Jane Doe', staffField: 'staff', type: 'Staff' }
          ]
        }
      },
      Node: {
        __resolveType: ({ type }) => type
      }
    }
  },
  {
    name: "serviceB",
    url: 'http://localhost:9994/graphql',
    typeDefs: gql(`
    interface Node {
      id: ID!
    }

    type SomethingElse implements Node @key(fields: "id") {
      id: ID!
      otherField: String!
    }
    `),
    resolvers: {}
  }
]

const servers = services.map(({ url, typeDefs, resolvers }) => {
  const port = parseInt(new URL(url).port)
  const schema = buildFederatedSchema([{ typeDefs, resolvers }])
  return new ApolloServer( { schema }).listen(port)
})

const gateway = new ApolloGateway({ localServiceList: services })
const gatewayServer = new ApolloServer({ gateway, subscriptions: false })

const query = `
    query TestQuery {
      testField1 {
        ...TestField1Node
      }
    }

    fragment TestField1Node on Node {
      __typename
      id
    }
    `
const runningServers = []

Promise
  .all(servers)
  .then((serverList) => {
    serverList.forEach(({ server }) => runningServers.push(server))
    return gatewayServer.listen(3000)
  })
  .then(({ server }) => {
    runningServers.push(server)
    return fetch("http://localhost:3000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, operationName: 'TestQuery' })
    })
  })
  .then((res) => res.json())
  .then((body) => {
    console.log(JSON.stringify(body, null, 2))
  })
  .then(() => {
    return Promise.all(runningServers.map((s) => s.stop()))
  })
