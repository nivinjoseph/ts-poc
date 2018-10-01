import { given } from "@nivinjoseph/n-defensive";
import * as Moment from "moment";
import "@nivinjoseph/n-ext";


export class Todo
{
    private readonly _id: string;
    private readonly _createdAt: number;
    private _title: string;
    private _description: string;
    private _isCompleted: boolean;
    private _updatedAt: number;
    
    
    public get id(): string { return this._id; }
    public get createdAt(): number { return this._createdAt; }
    public get title(): string { return this._title; }
    public get description(): string { return this._description; }
    public get isCompleted(): boolean { return this._isCompleted; }
    public get updatedAt(): number { return this._updatedAt; }
    
    
    public constructor(id: string, createdAt: number, title: string, description: string, isCompleted: boolean, updatedAt: number)
    {
        given(id, "id").ensureHasValue().ensureIsString();
        given(createdAt, "createdAt").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        given(title, "title").ensureHasValue().ensureIsString();
        given(description, "description").ensureIsString();
        given(isCompleted, "isCompleted").ensureHasValue().ensureIsBoolean();
        given(updatedAt, "updatedAt").ensureHasValue().ensureIsNumber();
        
        this._id = id;
        this._createdAt = createdAt;
        this._title = title;
        this._description = description;
        this._isCompleted = isCompleted;
        this._updatedAt = updatedAt;
    }
    
    
    public updateTitle(title: string): void
    {
        given(title, "title").ensureHasValue().ensureIsString();

        this._title = title.trim();
        this.updateUpdatedAt();
    }

    public updateDescription(description: string): void
    {
        given(description, "description").ensureIsString();
        
        this._description = description && !description.isEmptyOrWhiteSpace() ? description.trim() : null;
        this.updateUpdatedAt();
    }

    public markAsCompleted(): void
    {
        this._isCompleted = true;
        this.updateUpdatedAt();
    }


    private updateUpdatedAt()
    {
        this._updatedAt = Moment().valueOf();
    }
}