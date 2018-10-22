import { DomainEvent } from "../base/domain-event";
import { TodoState } from "../todo-state";


export abstract class TodoSourcedEvent extends DomainEvent<TodoState>
{ }