import { TodoSourcedEvent } from "./todo-sourced-event";
import { TodoState } from "../todo-state";
import { given } from "@nivinjoseph/n-defensive";


export class TodoCreatedEvent extends TodoSourcedEvent
{
    private readonly _id: string;
    private readonly _title: string;
    private readonly _description: string;


    public constructor(occurredAt: number, version: number, id: string, title: string, description: string)
    {
        super(occurredAt, version);

        given(id, "id").ensureHasValue().ensureIsString();
        this._id = id;

        given(title, "title").ensureHasValue().ensureIsString();
        this._title = title;

        given(description, "description").ensureIsString();
        this._description = description;
    }

    public static deserializeEvent(data: object | any): TodoCreatedEvent
    {
        given(data, "data").ensureHasValue()
            .ensureHasStructure({
                $occurredAt: "number",
                $version: "number",
                id: "string",
                title: "string",
                "description?": "string"
            });

        return new TodoCreatedEvent(data.$occurredAt, data.$version, data.id, data.title, data.description);
    }


    protected serializeEvent(): object
    {
        return {
            id: this._id,
            title: this._title,
            description: this._description
        };
    }

    protected applyEvent(state: TodoState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();

        state.id = this._id;
        state.title = this._title;
        state.description = this._description;
    }
}