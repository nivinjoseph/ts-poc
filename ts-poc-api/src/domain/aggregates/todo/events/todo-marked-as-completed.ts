import { TodoState } from "../todo-state";
import { given } from "@nivinjoseph/n-defensive";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";


export class TodoMarkedAsCompleted extends DomainEvent<TodoState>
{
    public static deserializeEvent(data: DomainEventData): TodoMarkedAsCompleted
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new TodoMarkedAsCompleted(data);
    }


    protected serializeEvent(): object
    {
        return {};
    }

    protected applyEvent(state: TodoState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();
        
        state.isCompleted = true;
    }
}