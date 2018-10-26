import { given } from "@nivinjoseph/n-defensive";
import { TodoState } from "../todo-state";
import { TodoDomainEvent } from "./todo-domain-event";
import { SerializedDomainEvent } from "@nivinjoseph/n-domain";


export class TodoTitleUpdatedEvent extends TodoDomainEvent
{
    private readonly _title: string;


    public constructor(occurredAt: number, version: number, title: string)
    {
        super(occurredAt, version);
        given(title, "title").ensureHasValue().ensureIsString();
        this._title = title;
    }

    public static deserializeEvent(data: SerializedDomainEvent | any): TodoTitleUpdatedEvent
    {
        given(data, "data").ensureHasValue()
            .ensureHasStructure({
                $name: "string",
                $occurredAt: "number",
                $version: "number",
                title: "string"
            });

        return new TodoTitleUpdatedEvent(data.$occurredAt, data.$version, data.title);
    }

    
    protected serializeEvent(): object
    {
        return {
            title: this._title
        };
    }

    protected applyEvent(state: TodoState): void
    {
        state.title = this._title;
    }
}