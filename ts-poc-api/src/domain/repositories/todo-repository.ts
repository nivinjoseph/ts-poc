import { Todo } from "../aggregates/todo/todo";


export interface TodoRepository
{
    getAll(fromSnapshot?: boolean): Promise<ReadonlyArray<Todo>>;
    get(id: string, fromSnapshot?: boolean): Promise<Todo>;
    save(todo: Todo): Promise<void>;
    delete(id: string): Promise<void>;
}