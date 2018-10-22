import { TodoSourcedEvent } from "./todo-sourced-event";
import { TodoState } from "../todo-state";
import { given } from "@nivinjoseph/n-defensive";


export class TodoDescriptionUpdatedEvent extends TodoSourcedEvent
{
    private readonly _description: string;


    public constructor(occurredAt: number, version: number, description: string)
    {
        super(occurredAt, version);
        given(description, "description").ensureIsString();
        this._description = description;
    }

    public static deserializeEvent(data: any | object): TodoDescriptionUpdatedEvent
    {
        given(data, "data").ensureHasValue()
            .ensureHasStructure({
                $occurredAt: "number",
                $version: "number",
                "description?": "string"
            });

        return new TodoDescriptionUpdatedEvent(data.$occurredAt, data.$version, data.description);
    }


    protected serializeEvent(): object
    {
        return {
            description: this._description
        };
    }

    protected applyEvent(state: TodoState): void
    {
        state.description = this._description;
    }
}