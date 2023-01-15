import type { Context } from "aws-lambda";

const buntimeDebug = Bun.env.BUNTIME_DEBUG === "true";

const log = (...args: any[]) =>
  buntimeDebug && console.log("[Buntime]", ...args);

const [handlerFilePath, ...handlerFunc] = String(Bun.env._HANDLER).split(".");

const source = await import(`${Bun.env.LAMBDA_TASK_ROOT!}/${handlerFilePath}`);

let handler = source;

handlerFunc.forEach((key) => {
  handler = handler[key];
});

const invocationUrl = `http://${Bun.env
  .AWS_LAMBDA_RUNTIME_API!}/2018-06-01/runtime/invocation`;
const nextUrl = `${invocationUrl}/next`;

const tryJson = (headers: Headers, key: string) => {
  try {
    return JSON.parse(headers.get(key) ?? "");
  } catch {
    return undefined;
  }
};

const notImplemented = () => {
  throw new Error("Not implemented");
};

const buildContext = (next: Response, requestId: string): Context => {
  const traceId = next.headers.get("lambda-runtime-trace-id") ?? undefined;

  process.env._X_AMZN_TRACE_ID = traceId;

  return {
    functionName: String(Bun.env.AWS_LAMBDA_FUNCTION_NAME),
    functionVersion: String(Bun.env.AWS_LAMBDA_FUNCTION_VERSION),
    invokedFunctionArn: String(
      next.headers.get("lambda-runtime-invoked-function-arn")
    ),
    memoryLimitInMB: String(Bun.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE),
    awsRequestId: requestId,
    logGroupName: String(Bun.env.AWS_LAMBDA_LOG_GROUP_NAME),
    logStreamName: String(Bun.env.AWS_LAMBDA_LOG_STREAM_NAME),
    identity: tryJson(next.headers, "lambda-runtime-cognito-identity"),
    clientContext: tryJson(next.headers, "lambda-runtime-client-context"),
    getRemainingTimeInMillis: () =>
      Number(next.headers.get("lambda-runtime-deadline-ms")) - Date.now(),
    callbackWaitsForEmptyEventLoop: true,
    done: notImplemented,
    fail: notImplemented,
    succeed: notImplemented,
  };
};

log(JSON.stringify({ invocationUrl, nextUrl }));

log("Buntime starting in debug mode...");
log(`Loading handler ${Bun.env._HANDLER}`);
log("Starting event loop...");

while (true) {
  const next = await fetch(nextUrl);

  log("Got event data:", next);

  const requestId = String(next.headers.get("Lambda-Runtime-Aws-Request-Id"));
  const context = buildContext(next, requestId);
  const event = await next.json();

  let res: Response;

  try {
    const body = await handler(event, context);

    log("Sending body:", body);

    res = await fetch(`${invocationUrl}/${requestId}/response`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  } catch (error) {
    log("Error:", error);

    const { message, name } = error as Error;

    res = await fetch(`${invocationUrl}/${requestId}/error`, {
      method: "POST",
      body: JSON.stringify({
        errorMessage: message,
        errorType: name,
      }),
    });
  }

  await res.blob();
}
