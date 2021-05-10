import "source-map-support/register";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import { createTodo } from "@businessLogic/todos";

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	const todo = await createTodo(event.body);

	return formatJSONResponse(
		{
			item: todo,
		},
		201
	);
};

export const main = middyfy(handler);
