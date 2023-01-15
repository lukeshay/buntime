# Buntime

An AWS Lambda runtime for [Bun](https://bun.sh/)

This exposes the same API as the Node.js runtime. If you are looking how to handle different events, you can refer to AWS documentation. The only difference is we do not support callbacks and the following properties on the context object:

- `context.callbackWaitsForEmptyEventLoop`
- `context.done`
- `context.fail`
- `context.succeed`

## Getting Started

This is currently a manual process that we are looking to automate in the future.

1. Clone or fork this repository
2. 

## Example

```ts
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";

export default {
  handler(
    event: APIGatewayProxyEventV2,
    context: Context
  ): APIGatewayProxyResultV2 {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: "Hello from Buntime!",
    };
  },
};
```

## Tips

### Getting the trace id

We dynamically set the trace id environment variable so you _**MUST**_ access it using `process.env._X_AMZN_TRACE_ID`. `Bun.env._X_AMZN_TRACE_ID` will not work.

## Resources

- <https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html>
