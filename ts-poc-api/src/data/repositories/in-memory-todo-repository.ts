import { TodoRepository } from "../../domain/repositories/todo-repository";
import { given } from "@nivinjoseph/n-defensive";
import { Todo } from "../../domain/aggregates/todo/todo";
import { TodoNotFoundException } from "../../domain/exceptions/todo-not-found-exception";
import { inject } from "@nivinjoseph/n-ject";
import { DomainContext } from "@nivinjoseph/n-domain";


@inject("DomainContext")
export class InMemoryTodoRepository implements TodoRepository
{
    private readonly _domainContext: DomainContext;
    private readonly _todos: { [index: string]: StorageModel };
    
    
    public constructor(domainContext: DomainContext)
    {
        given(domainContext, "domainContext").ensureHasValue().ensureIsObject();
        this._domainContext = domainContext;
        
        this._todos = {};
    }
    
    
    public getAll(): Promise<ReadonlyArray<Todo>>
    {
        const result = new Array<Todo>();

        for (const key in this._todos)
        {
            result.push(Todo.deserialize(this._domainContext, this._todos[key].data));
        }

        return Promise.resolve(result.orderByDesc(t => t.updatedAt));
    }
    
    public get(id: string): Promise<Todo>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        
        if (!this._todos[id])
            return Promise.reject(new TodoNotFoundException(id));
        
        const result = Todo.deserialize(this._domainContext, this._todos[id].data);
        return Promise.resolve(result);
    }
    
    public save(todo: Todo): Promise<void>
    {
        given(todo, "todo").ensureHasValue().ensureIsType(Todo);

        const data: any = todo.serialize();

        const storageEntity: StorageModel = {
            id: todo.id,
            version: todo.currentVersion,
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