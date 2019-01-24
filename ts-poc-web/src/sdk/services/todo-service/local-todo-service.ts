import { TodoService } from "./todo-service";
import { given } from "@nivinjoseph/n-defensive";
import { LocalTodoProxy } from "../../proxies/todo/local-todo-proxy";
import { Todo } from "../../proxies/todo/todo";


export class LocalTodoService implements TodoService
{
    private readonly _todos: Array<LocalTodoProxy>;
    private _counter: number;
    
    
    public constructor()
    {
        const todos = new Array<LocalTodoProxy>();
        const count = 10;
        
        for (let i = 0; i < count; i++)
            todos.push(new LocalTodoProxy("id" + i, "title" + i, "description" + i));
        
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
        
        return Promise.resolve(this._todos.find(t => t.id === id) as Todo);
    }
    
    public createTodo(title: string, description: string): Promise<Todo>
    {
        given(title, "title").ensureHasValue().ensureIsString();
        given(description, "description").ensureIsString();
        
        const todo = new LocalTodoProxy("id" + this._counter++, title.trim(), description);
        this._todos.push(todo);
        return Promise.resolve(todo);
    }
}