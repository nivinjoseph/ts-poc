import { DomainEvent } from "@nivinjoseph/n-domain";
import { TodoState } from "../todo-state";


export abstract class TodoDomainEvent extends DomainEvent<TodoState>
{ }