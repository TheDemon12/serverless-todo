import "source-map-support/register";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import { updateTodo } from "@businessLogic/todos";

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	const todoId = event.pathParameters.todoId;
	const userId = "1234";

	const updatedTodo = await updateTodo(todoId, userId, event.body);

	return formatJSONResponse(
		{
			item: updatedTodo,
		},
		200
	);
};

export const main = middyfy(handler);
