import type { Context } from "aws-lambda";
import { handler } from "./handler.js";

const notImplemented = () => {
	throw new Error("Not implemented");
};

const buildContext = (req: Request): Context => {
	const traceId = req.headers.get("lambda-runtime-trace-id") ?? undefined;

	process.env._X_AMZN_TRACE_ID = traceId;

	return {
		functionName: "",
		functionVersion: "",
		invokedFunctionArn: "",
		memoryLimitInMB: "",
		awsRequestId: String(req.headers.get("x-request-id")),
		logGroupName: "",
		logStreamName: "",
		identity: undefined,
		clientContext: undefined,
		getRemainingTimeInMillis: () => Number(req.headers.get("lambda-runtime-deadline-ms")) - Date.now(),
		callbackWaitsForEmptyEventLoop: true,
		done: notImplemented,
		fail: notImplemented,
		succeed: notImplemented,
	};
};

export default {
	port: Number(process.env.PORT ?? 3000),
	fetch: async (request: Request) => {
		const context = buildContext(request);
		const url = new URL(request.url);

		const result = await handler(
			{
				headers: Object.fromEntries(request.headers.entries()),
				isBase64Encoded: false,
				rawPath: url.pathname,
				rawQueryString: url.search,
				requestContext: {} as any,
				routeKey: request.method,
				body: await request.text(),
				queryStringParameters: Object.fromEntries(url.searchParams.entries()),
				version: "1",
				stageVariables: process.env,
			},
			context,
		);

		const headers = new Headers();

		Object.entries(result.headers ?? []).forEach(([key, value]) => {
			headers.set(key, String(value));
		});

		return new Response(result.body, {
			headers,
			status: result.statusCode,
		});
	},
};
