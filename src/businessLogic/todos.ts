import { CreateTodoRequest } from "./../requests/CreateTodoRequest";
import { TodoAccess } from "@dataLayer/todoAccess";
import { TodoItem } from "@models/TodoItem";
import * as uuid from "uuid";

const todoAccess = new TodoAccess();

export async function getAllTodos(): Promise<TodoItem[]> {
	return todoAccess.getAllTodos();
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
		userId: "",
		todoId,
		createdAt: new Date().toISOString(),
		attachmentUrl: `https://${attachmentsBucket}.s3.amazonaws.com/${todoId}`,
		done: false,
		...createTodoRequest,
	};

	return todoAccess.createTodo(newTodo);
}
