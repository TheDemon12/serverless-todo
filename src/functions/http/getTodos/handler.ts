import "source-map-support/register";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyHandler } from "aws-lambda";
import { getAllTodos } from "@businessLogic/todos";

const getTodos: APIGatewayProxyHandler = async () => {
	const todos = await getAllTodos();
	return formatJSONResponse({ items: todos }, 200);
};

export const main = middyfy(getTodos);
