import { TodoService } from "./todo-service";
import { given } from "@nivinjoseph/n-defensive";
import "@nivinjoseph/n-ext";
import { Todo } from "../../proxies/todo/todo";
import { RpcClient } from "../../common/comms/rpc-client";
import { RemoteTodoProxy } from "../../proxies/todo/remote-todo-proxy";


export class RemoteTodoService implements TodoService
{
    private readonly _client: RpcClient;
    
    
    public constructor()
    {
        this._client = new RpcClient();
    }
    
    
    public async getTodos(): Promise<ReadonlyArray<Todo>>
    {
        const response = await this._client.query<ReadonlyArray<object>>("/api/query/getAllTodos");
        return response.map(t => new RemoteTodoProxy(t));
    }
    
    public async getTodo(id: string): Promise<Todo>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        id = id.trim().toLowerCase();
        
        const response = await this._client.query<object>(`/api/query/getTodo/${id}`);
        return new RemoteTodoProxy(response);       
    }
    
    public async createTodo(title: string, description: string): Promise<Todo>
    {
        given(title, "title").ensureHasValue().ensureIsString();
        given(description, "description").ensureIsString();
        
        const command = {
            title: title.trim(),
            description: description ? description.trim() : ""
        };
        
        const response = await this._client.command<object>("/api/command/createTodo", command);
        return new RemoteTodoProxy(response);
    }
}