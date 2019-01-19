import { given } from "@nivinjoseph/n-defensive";
import "@nivinjoseph/n-ext";
import { TodoState } from "./todo-state";
import { TodoMarkedAsCompleted } from "./events/todo-marked-as-completed";
import { AggregateRoot, DomainContext, DomainEvent, AggregateState, DomainEventData } from "@nivinjoseph/n-domain";
import { TodoTitleUpdated } from "./events/todo-title-updated";
import { TodoDescriptionUpdated } from "./events/todo-description-updated";
import { TodoCreated } from "./events/todo-created";
import { NotImplementedException } from "@nivinjoseph/n-exception";


export class Todo extends AggregateRoot<TodoState>
{
    public get title(): string { return this.state.title; }
    public get description(): string | null { return this.state.description; }
    public get isCompleted(): boolean { return this.state.isCompleted; }

    
    public constructor(domainContext: DomainContext, events: ReadonlyArray<DomainEvent<TodoState>>)
    {
        super(domainContext, events, { isCompleted: false });
    }
    
    
    public static deserialize(domainContext: DomainContext, eventData: ReadonlyArray<DomainEventData>): Todo
    {
        const eventTypes = [
            TodoCreated,
            TodoTitleUpdated,
            TodoDescriptionUpdated,
            TodoMarkedAsCompleted
        ];

        return AggregateRoot.deserializeFromEvents(domainContext, Todo, eventTypes, eventData) as Todo;
    }

    
    public snapshot(): AggregateState & object
    {
        throw new NotImplementedException();
    }

    public updateTitle(title: string): void
    {
        given(title, "title").ensureHasValue().ensureIsString();

        title = title.trim();

        this.applyEvent(new TodoTitleUpdated({}, title));
    }

    public updateDescription(description: string | null): void
    {
        given(description, "description").ensureIsString();

        description = description && !description.isEmptyOrWhiteSpace() ? description.trim() : null as any;
        
        this.applyEvent(new TodoDescriptionUpdated({}, description));
    }

    public markAsCompleted(): void
    {
        this.applyEvent(new TodoMarkedAsCompleted({}));
    }
}














// https://thinkbeforecoding.com/post/2013/07/28/Event-Sourcing-vs-Command-Sourcing

// Decide:
// Command -> State -> Event list
// ApplyStateChange:
// State -> Event -> State