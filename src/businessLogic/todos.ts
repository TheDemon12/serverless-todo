import { UpdateTodoRequest } from "./../requests/UpdateTodoRequest";
import { CreateTodoRequest } from "./../requests/CreateTodoRequest";
import { TodoAccess } from "@dataLayer/todoAccess";
import { TodoItem } from "@models/TodoItem";
import * as uuid from "uuid";

const todoAccess = new TodoAccess();

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
	return todoAccess.getAllTodos(userId);
}
export async function getAttachmentUploadUrl(todoId: string): Promise<string> {
	return todoAccess.getAttachmentUploadUrl(todoId);
}

export async function createTodo(
	createTodoRequest: CreateTodoRequest
): Promise<TodoItem> {
	const todoId = uuid.v4();
	const attachmentsBucket = process.env.ATTACHMENTS_BUCKET;

	const newTodo: TodoItem = {
		userId: "1234", //TODO: Get User Id from JWT
		todoId,
		createdAt: new Date().toISOString(),
		attachmentUrl: `https://${attachmentsBucket}.s3.amazonaws.com/${todoId}`,
		done: false,
		...createTodoRequest,
	};

	return todoAccess.createTodo(newTodo);
}

export async function updateTodo(
	todoId: string,
	userId: string,
	updateTodoRequest: UpdateTodoRequest
): Promise<TodoItem> {
	return todoAccess.updateTodo(todoId, userId, updateTodoRequest);
}

export async function deleteTodo(
	todoId: string,
	userId: string
): Promise<TodoItem> {
	return todoAccess.deleteTodo(todoId, userId);
}
