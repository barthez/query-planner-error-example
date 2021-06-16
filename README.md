To run the script execute:

```bash
docker run --rm  -ti -v $PWD:/app -w /app --entrypoint /app/entrypoint.sh node:16 node index.js
```


Excepted output:
```json
{
  "errors": [
    {
      "message": "400: Bad Request",
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
        "response": {
          "url": "http://localhost:9993/graphql",
          "status": 400,
          "statusText": "Bad Request",
          "body": {
            "errors": [
              {
                "message": "Unknown type \"SomethingElse\".",
                "locations": [
                  {
                    "line": 1,
                    "column": 30
                  }
                ],
                "extensions": {
                  "code": "GRAPHQL_VALIDATION_FAILED",
                  "exception": {
                    "stacktrace": [
                      "GraphQLError: Unknown type \"SomethingElse\".",
                      "    at Object.NamedType (/app/node_modules/graphql/validation/rules/KnownTypeNamesRule.js:57:29)",
                      "    at Object.enter (/app/node_modules/graphql/language/visitor.js:323:29)",
                      "    at Object.enter (/app/node_modules/graphql/utilities/TypeInfo.js:370:25)",
                      "    at visit (/app/node_modules/graphql/language/visitor.js:243:26)",
                      "    at Object.validate (/app/node_modules/graphql/validation/validate.js:69:24)",
                      "    at validate (/app/node_modules/apollo-server-core/dist/requestPipeline.js:233:34)",
                      "    at Object.<anonymous> (/app/node_modules/apollo-server-core/dist/requestPipeline.js:119:42)",
                      "    at Generator.next (<anonymous>)",
                      "    at fulfilled (/app/node_modules/apollo-server-core/dist/requestPipeline.js:5:58)",
                      "    at processTicksAndRejections (node:internal/process/task_queues:96:5)"
                    ]
                  }
                }
              }
            ]
          }
        },
        "exception": {
          "stacktrace": [
            "Error: 400: Bad Request",
            "    at RemoteGraphQLDataSource.errorFromResponse (/app/node_modules/@apollo/gateway/dist/datasources/RemoteGraphQLDataSource.js:116:21)",
            "    at RemoteGraphQLDataSource.sendRequest (/app/node_modules/@apollo/gateway/dist/datasources/RemoteGraphQLDataSource.js:78:34)",
            "    at processTicksAndRejections (node:internal/process/task_queues:96:5)",
            "    at async RemoteGraphQLDataSource.process (/app/node_modules/@apollo/gateway/dist/datasources/RemoteGraphQLDataSource.js:58:26)",
            "    at async sendOperation (/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:173:26)",
            "    at async executeFetch (/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:123:41)",
            "    at async executeNode (/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:88:17)",
            "    at async Object.executeQueryPlan (/app/node_modules/@apollo/gateway/dist/executeQueryPlan.js:24:27)",
            "    at async Object.ApolloGateway.executor (/app/node_modules/@apollo/gateway/dist/index.js:102:30)"
          ]
        }
      }
    }
  ],
  "data": {
    "testField1": null
  }
}
```
