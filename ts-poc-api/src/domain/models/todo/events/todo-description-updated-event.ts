import { TodoState } from "../todo-state";
import { given } from "@nivinjoseph/n-defensive";
import { SerializedDomainEvent, DomainEvent } from "@nivinjoseph/n-domain";


export class TodoDescriptionUpdatedEvent extends DomainEvent<TodoState>
{
    private readonly _description: string;


    public constructor(occurredAt: number, version: number, description: string)
    {
        super(occurredAt, version);
        given(description, "description").ensureIsString();
        this._description = description;
    }

    public static deserializeEvent(data: SerializedDomainEvent & Serialized): TodoDescriptionUpdatedEvent
    {
        given(data, "data").ensureHasValue()
            .ensureHasStructure({
                $name: "string",
                $occurredAt: "number",
                $version: "number",
                "description?": "string"
            });

        return new TodoDescriptionUpdatedEvent(data.$occurredAt, data.$version, data.description);
    }


    protected serializeEvent(): Serialized
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


interface Serialized
{
    description: string;
}