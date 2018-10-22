import { given } from "@nivinjoseph/n-defensive";
import { TodoState } from "../todo-state";
import { TodoSourcedEvent } from "./todo-sourced-event";


export class TodoTitleUpdatedEvent extends TodoSourcedEvent
{
    private readonly _title: string;


    public constructor(occurredAt: number, version: number, title: string)
    {
        super(occurredAt, version);
        given(title, "title").ensureHasValue().ensureIsString();
        this._title = title;
    }

    public static deserializeEvent(data: object | any): TodoTitleUpdatedEvent
    {
        given(data, "data").ensureHasValue()
            .ensureHasStructure({
                $occurredAt: "number",
                $version: "number"
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