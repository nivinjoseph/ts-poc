import { Todo } from "./todo";
import { given } from "@nivinjoseph/n-defensive";
import { BaseModel } from "../../common/models/base-model";
import { RpcClient } from "../../common/comms/rpc-client";


export class RemoteTodoProxy extends BaseModel implements Todo
{
    private readonly _client: RpcClient;
    private _isDeleted: boolean;
    
    
    public get id(): string { return this.dto.id; }
    public get title(): string { return this.dto.title; }
    public get description(): string { return this.dto.description; }
    public get isCompleted(): boolean { return this.dto.isCompleted; }
    public get isDeleted(): boolean { return this._isDeleted; }
    
    
    public constructor(dto: object)
    {
        super(dto, {
            id: "string",
            title: "string",
            "description?": "string",
            isCompleted: "boolean"
        });
        
        this._client = new RpcClient();
        this._isDeleted = false;
    }
    
    
    public async update(title: string, description: string): Promise<void>
    {
        given(title, "title").ensureHasValue().ensureIsString();
        title = title.trim();
        
        given(description, "description").ensureIsString();
        description = description ? description.trim() : "";
        
        const command = {
            id: this.id,
            title,
            description
        };
        
        await this._client.command<void>("/api/command/updateTodo", command);
        
        this.dto.title = title;
        this.dto.description = description;
    }
    
    public async complete(): Promise<void>
    {
        given(this, "this").ensure(t => !t.isCompleted, "completing Todo that is already complete");
        
        const command = {
            id: this.id
        };
        
        await this._client.command<void>("/api/command/markTodoAsCompleted", command);
        
        this.dto.isCompleted = true;
    }
    
    public async delete(): Promise<void>
    {
        given(this, "this").ensure(t => !t._isDeleted, "deleting Todo that is already deleted");
        
        const command = {
            id: this.id
        };

        await this._client.command<void>("/api/command/deleteTodo", command);

        this._isDeleted = true;
    }    
}