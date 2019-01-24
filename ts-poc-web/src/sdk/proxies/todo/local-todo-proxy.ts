import { Todo } from "./todo";
import { given } from "@nivinjoseph/n-defensive";


export class LocalTodoProxy implements Todo
{
    private readonly _id: string;
    private _title: string;
    private _description: string | null;
    private _isCompleted: boolean;
    private _isDeleted: boolean;


    public get id(): string { return this._id; }
    public get title(): string { return this._title; }
    public get description(): string | null { return this._description; }
    public get isCompleted(): boolean { return this._isCompleted; }
    public get isDeleted(): boolean { return this._isDeleted; }


    public constructor(id: string, title: string, description?: string)
    {
        given(id, "id").ensureHasValue().ensureIsString();
        this._id = id.trim();
        
        given(title, "title").ensureHasValue().ensureIsString();
        this._title = title;
        
        given(description, "description").ensureIsString();
        this._description = description || null;
        
        this._isCompleted = false;
        this._isDeleted = false;
    }


    public async update(title: string, description?: string): Promise<void>
    {
        given(title, "title").ensureHasValue().ensureIsString();    
        given(description, "description").ensureIsString();
        
        this._title = title.trim();
        this._description = description ? description.trim() : null as any;
    }

    public async complete(): Promise<void>
    {
        given(this, "this").ensure(t => !t._isCompleted, "completing Todo that is already complete");
        
        this._isCompleted = true;
    }

    public async delete(): Promise<void>
    {
        given(this, "this").ensure(t => !t._isDeleted, "deleting Todo that is already deleted");
        
        this._isDeleted = true;
    }
}