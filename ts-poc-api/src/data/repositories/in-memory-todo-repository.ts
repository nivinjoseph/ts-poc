import { TodoRepository } from "../../domain/repositories/todo-repository";
import { Todo } from "../../domain/models/todo";
import { given } from "@nivinjoseph/n-defensive";
import { TodoNotFoundException } from "../exceptions/todo-not-found-exception";


export class InMemoryTodoRepository implements TodoRepository
{
    private readonly _todos: Array<Todo>;
    
    
    public constructor()
    {
        this._todos = new Array<Todo>();
    }
    
    
    public getAll(): Promise<ReadonlyArray<Todo>>
    {
        return Promise.resolve(this._todos);
    }
    
    public get(id: string): Promise<Todo>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        
        const todo = this._todos.find(t => t.id === id);
        if (!todo)
            return Promise.reject(new TodoNotFoundException(id));
        
        return Promise.resolve(todo);
    }
    
    public save(todo: Todo): Promise<void>
    {
        given(todo, "todo").ensureHasValue().ensureIsType(Todo);
        
        const oldTodo = this._todos.find(t => t.id === todo.id);
        if (oldTodo)
            this._todos.remove(oldTodo);
        
        this._todos.push(todo);
        
        return Promise.resolve();
    }
    
    public  delete(id: string): Promise<void>
    {
        given(id, "string").ensureHasValue().ensureIsString();
        
        const todo = this._todos.find(t => t.id === id);
        if (todo)
            this._todos.remove(todo);
        
        return Promise.resolve();
    }
}