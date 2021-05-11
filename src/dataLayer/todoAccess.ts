import { UpdateTodoRequest } from "./../requests/UpdateTodoRequest";
import { TodoItem } from "@models/TodoItem";
import * as AWS from "aws-sdk";

export class TodoAccess {
	constructor(
		private readonly docClient = new AWS.DynamoDB.DocumentClient(),
		private readonly todosTable = process.env.TODOS_TABLE,
		private readonly s3 = new AWS.S3({
			signatureVersion: "v4",
		}),
		private readonly attachmentsBucket: string = process.env.ATTACHMENTS_BUCKET
	) {}

	async getAllTodos() {
		console.log("Getting all Todos");

		const result = await this.docClient
			.scan({
				TableName: this.todosTable,
			})
			.promise();

		return result.Items as TodoItem[];
	}

	async getAttachmentUploadUrl(todoId: string): Promise<string> {
		return this.s3.getSignedUrl("putObject", {
			Bucket: this.attachmentsBucket,
			Key: todoId,
			Expires: 3000,
		});
	}

	async createTodo(todo: TodoItem): Promise<TodoItem> {
		console.log("Creating a todo with id: ", todo.todoId);

		await this.docClient
			.put({
				TableName: this.todosTable,
				Item: todo,
			})
			.promise();

		return todo;
	}

	async updateTodo(
		todoId: string,
		userId: string,
		updateTodo: UpdateTodoRequest
	): Promise<TodoItem> {
		console.log("Updating a todo with id: ", todoId);

		const result = await this.docClient
			.update({
				TableName: this.todosTable,
				Key: { todoId, userId },
				UpdateExpression: "set dueDate=:dueDate, done=:done, #NameField=:name",
				ExpressionAttributeNames: {
					"#NameField": "name",
				},
				ExpressionAttributeValues: {
					":dueDate": updateTodo.dueDate,
					":done": updateTodo.done,
					":name": updateTodo.name,
				},
				ReturnValues: "ALL_NEW",
			})
			.promise();

		return result.Attributes as TodoItem;
	}
}
