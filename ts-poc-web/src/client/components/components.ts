import { TodoViewModel } from "./todo/todo-view-model";
import { ShellViewModel } from "./shell/shell-view-model";


export const components: Array<Function> = [
    ShellViewModel,
    TodoViewModel
];