import { TodoService } from "./todo-service";
import { Todo } from "../../models/todo";
import { given } from "@nivinjoseph/n-defensive";


export class LocalTodoService implements TodoService
{
    private readonly _todos: Array<Todo>;
    private _counter: number;
    
    
    public constructor()
    {
        const todos = new Array<Todo>();
        const count = 10;
        
        for (let i = 0; i < count; i++)
        {
            todos.push({
                id: "id" + i,
                title: "title" + i,
                description: "description" + i,
                isCompleted: false,
                isDeleted: false
            });
        }
        
        this._todos = todos;
        this._counter = count;
    }
    
    
    public getTodos(): Promise<ReadonlyArray<Todo>>
    {
        return Promise.resolve(this._todos);
    }
    
    public getTodo(id: string): Promise<Todo>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        
        return Promise.resolve(this._todos.find(t => t.id === id));
    }
    
    public createTodo(title: string, description: string): Promise<Todo>
    {
        given(title, "title").ensureHasValue().ensureIsString();
        given(description, "description").ensureIsString();
        
        const todo: Todo = {
            id: "id" + this._counter,
            title: title,
            description: description,
            isCompleted: false,
            isDeleted: false
        };
        
        this._todos.push(todo);
        return Promise.resolve(todo);
    }
    
    public updateTodo(id: string, title: string, description: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        given(title, "title").ensureHasValue().ensureIsString();
        given(description, "description").ensureIsString();
        
        const todo = this._todos.find(t => t.id === id);
        todo.title = title;
        todo.description = description;
        
        return Promise.resolve();
    }
    
    public markTodoAsCompleted(id: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        
        const todo = this._todos.find(t => t.id === id);
        todo.isCompleted = true;
        
        return Promise.resolve();
    }
    
    public deleteTodo(id: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        
        const todo = this._todos.find(t => t.id === id);
        todo.isDeleted = true;

        return Promise.resolve();
    }
}