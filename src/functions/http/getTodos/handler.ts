import "source-map-support/register";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyHandler } from "aws-lambda";
import { getAllTodos } from "@businessLogic/todos";

const getTodos: APIGatewayProxyHandler = async () => {
	const userId = "1234";
	const todos = await getAllTodos(userId);
	return formatJSONResponse({ items: todos }, 200);
};

export const main = middyfy(getTodos);
