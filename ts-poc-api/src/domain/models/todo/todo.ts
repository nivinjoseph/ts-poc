import { given } from "@nivinjoseph/n-defensive";
import "@nivinjoseph/n-ext";
import { TodoState } from "./todo-state";
import { TodoMarkedAsCompletedEvent } from "./events/todo-marked-as-completed-event";
import { AggregateRoot } from "./base/aggregate-root";
import { TodoTitleUpdatedEvent } from "./events/todo-title-updated-event";
import { TodoDescriptionUpdatedEvent } from "./events/todo-description-updated-event";
import { TodoCreatedEvent } from "./events/todo-created-event";


export class Todo extends AggregateRoot<TodoState>
{
    public get id(): string { return this.state.id; }
    public get createdAt(): number { return this.events.find(t => t.name === (<Object>TodoCreatedEvent).getTypeName()).occurredAt; }
    public get title(): string { return this.state.title; }
    public get description(): string { return this.state.description; }
    public get isCompleted(): boolean { return this.state.isCompleted; }


    // public constructor(id: string, createdAt: number, title: string, description: string, isCompleted: boolean, updatedAt: number)
    // {
    //     given(id, "id").ensureHasValue().ensureIsString();
    //     given(createdAt, "createdAt").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
    //     given(title, "title").ensureHasValue().ensureIsString();
    //     given(description, "description").ensureIsString();
    //     given(isCompleted, "isCompleted").ensureHasValue().ensureIsBoolean();
    //     given(updatedAt, "updatedAt").ensureHasValue().ensureIsNumber();

    //     this._id = id;
    //     this._createdAt = createdAt;
    //     this._title = title;
    //     this._description = description;
    //     this._isCompleted = isCompleted;
    //     this._updatedAt = updatedAt;
    // }


    // public constructor(events: ReadonlyArray<SourcedEvent>)
    // {
    //     given(events, "events").ensureHasValue().ensureIsArray().ensure(t => t.length > 0);

    //     events.forEach(t => this.applyEvent(t));
    // }

    public static deserialize(data: object): Todo
    {
        const eventTypes = [
            TodoCreatedEvent,
            TodoTitleUpdatedEvent,
            TodoDescriptionUpdatedEvent,
            TodoMarkedAsCompletedEvent
        ];

        return AggregateRoot.deserialize(Todo, eventTypes, data) as Todo;
    }


    public updateTitle(title: string): void
    {
        given(title, "title").ensureHasValue().ensureIsString();

        title = title.trim();

        this.applyEvent(new TodoTitleUpdatedEvent(Date.now(), 0, title));
    }

    public updateDescription(description: string): void
    {
        given(description, "description").ensureIsString();

        description = description && !description.isEmptyOrWhiteSpace() ? description.trim() : null;
        
        this.applyEvent(new TodoDescriptionUpdatedEvent(Date.now(), 0, description));
    }

    public markAsCompleted(): void
    {
        this.applyEvent(new TodoMarkedAsCompletedEvent(Date.now(), 0));
    }
}














// https://thinkbeforecoding.com/post/2013/07/28/Event-Sourcing-vs-Command-Sourcing

// Decide:
// Command -> State -> Event list
// ApplyStateChange:
// State -> Event -> State