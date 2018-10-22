import { TodoSourcedEvent } from "./todo-sourced-event";
import { TodoState } from "../todo-state";
import { given } from "@nivinjoseph/n-defensive";


export class TodoMarkedAsCompletedEvent extends TodoSourcedEvent
{
    public static deserializeEvent(data: any | object): TodoMarkedAsCompletedEvent
    {
        given(data, "data").ensureHasValue()
            .ensureHasStructure({
                $occurredAt: "number",
                $version: "number"
            });

        return new TodoMarkedAsCompletedEvent(data.$occurredAt, data.$version);
    }


    protected serializeEvent(): object
    {
        return {};
    }

    protected applyEvent(state: TodoState): void
    {
        state.isCompleted = true;
    }
}