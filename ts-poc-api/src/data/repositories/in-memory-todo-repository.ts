import { TodoRepository } from "../../domain/repositories/todo-repository";
import { Todo } from "../../domain/models/todo/todo";
import { given } from "@nivinjoseph/n-defensive";
import { TodoNotFoundException } from "../exceptions/todo-not-found-exception";


export class InMemoryTodoRepository implements TodoRepository
{
    private readonly _todos: { [index: string]: StorageModel };
    
    
    public constructor()
    {
        this._todos = {};
    }
    
    
    public getAll(): Promise<ReadonlyArray<Todo>>
    {
        const result = new Array<Todo>();

        for (let key in this._todos)
        {
            result.push(Todo.deserialize(this._todos[key].data));
        }

        return Promise.resolve(result.orderByDesc(t => t.updatedAt));
    }
    
    public get(id: string): Promise<Todo>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        
        if (!this._todos[id])
            return Promise.reject(new TodoNotFoundException(id));
        
        const result = Todo.deserialize(this._todos[id].data);
        return Promise.resolve(result);
    }
    
    public save(todo: Todo): Promise<void>
    {
        given(todo, "todo").ensureHasValue().ensureIsType(Todo);

        const data: any = todo.serialize();

        const storageEntity: StorageModel = {
            id: todo.id,
            version: todo.version,
            updatedAt: todo.updatedAt,
            data,
            query: data.$state
        };

        console.log(JSON.stringify(storageEntity));
        
        this._todos[todo.id] = storageEntity;
        
        return Promise.resolve();
    }
    
    public  delete(id: string): Promise<void>
    {
        given(id, "string").ensureHasValue().ensureIsString();

        if (this._todos[id])
            delete this._todos[id];
        
        return Promise.resolve();
    }
}

interface StorageModel
{
    id: string;
    version: number;
    updatedAt: number;
    data: object;
    query: object;
}