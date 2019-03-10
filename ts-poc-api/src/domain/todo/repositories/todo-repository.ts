import { Todo } from "../todo";
import { UnitOfWork } from "@nivinjoseph/n-data";


export interface TodoRepository
{
    getAll(fromSnapshot?: boolean): Promise<ReadonlyArray<Todo>>;
    get(id: string, fromSnapshot?: boolean): Promise<Todo>;
    save(todo: Todo, unitOfWork?: UnitOfWork): Promise<void>;
    delete(id: string, unitOfWork?: UnitOfWork): Promise<void>;
}