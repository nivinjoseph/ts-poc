import { TodoDomainEvent } from "./todo-domain-event";
import { TodoState } from "../todo-state";
import { given } from "@nivinjoseph/n-defensive";
import { SerializedDomainEvent } from "@nivinjoseph/n-domain";


export class TodoMarkedAsCompletedEvent extends TodoDomainEvent
{
    public static deserializeEvent(data: SerializedDomainEvent): TodoMarkedAsCompletedEvent
    {
        given(data, "data").ensureHasValue()
            .ensureHasStructure({
                $name: "string",
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