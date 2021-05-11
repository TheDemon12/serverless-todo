import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { deleteTodo } from "@businessLogic/todos";

const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
	const todoId = event.pathParameters.todoId;
	const userId = "1234";

	const deletedTodo = await deleteTodo(todoId, userId);

	return formatJSONResponse(
		{
			item: deletedTodo,
		},
		200
	);
};

export const main = middyfy(handler);
