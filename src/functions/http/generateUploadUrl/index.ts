import { handlerPath } from "@libs/handlerResolver";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: "post",
				path: "todos/{todoId}/attachment",
				cors: true,
				authorizer: "auth",
			},
		},
	],
};
