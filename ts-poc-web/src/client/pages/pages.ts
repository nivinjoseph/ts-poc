import { ListTodosViewModel } from "./list-todos/list-todos-view-model";
import { ManageTodoViewModel } from "./manage-todo/manage-todo-view-model";


export const pages: Array<Function> = [
    ListTodosViewModel,
    ManageTodoViewModel
];