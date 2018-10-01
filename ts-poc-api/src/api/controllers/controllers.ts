import { GetAllTodosController } from "./queries/get-all-todos-controller";
import { GetTodoController } from "./queries/get-todo-controller";
import { CreateTodoController } from "./commands/create-todo-controller";
import { UpdateTodoController } from "./commands/update-todo-command";
import { MarkTodoAsCompletedController } from "./commands/mark-todo-as-completed";
import { DeleteTodoController } from "./commands/delete-todo-controller";


export const controllers: Array<Function> = [
    GetAllTodosController,
    GetTodoController,
    CreateTodoController,
    UpdateTodoController,
    MarkTodoAsCompletedController,
    DeleteTodoController
];