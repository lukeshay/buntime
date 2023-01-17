import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";

export const handler = (event: APIGatewayProxyEventV2, context: Context): APIGatewayProxyStructuredResultV2 => {
	console.log("event", event);
	console.log("context", context);

	return {
		statusCode: 200,
		headers: {
			"Content-Type": "text/html",
		},
		body: "Hello from Buntime!",
	};
};
