import { Todo } from "../../models/todo";


export interface TodoService
{
    getTodos(): Promise<ReadonlyArray<Todo>>;
    getTodo(id: string): Promise<Todo>;
    createTodo(title: string, description: string): Promise<Todo>;
    updateTodo(id: string, title: string, description: string): Promise<void>;
    markTodoAsCompleted(id: string): Promise<void>;
    deleteTodo(id: string): Promise<void>;
}