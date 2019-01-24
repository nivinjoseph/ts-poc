import { TodoFactory } from "./todo-factory";
import { given } from "@nivinjoseph/n-defensive";
import "@nivinjoseph/n-ext";
import { Todo } from "../aggregates/todo/todo";
import { inject } from "@nivinjoseph/n-ject";
import { DomainContext, DomainHelper } from "@nivinjoseph/n-domain";
import { TodoCreated } from "../aggregates/todo/events/todo-created";
import { TodoRepository } from "../repositories/todo-repository";


@inject("DomainContext", "TodoRepository")
export class DefaultTodoFactory implements TodoFactory
{
    private readonly _domainContext: DomainContext;
    private readonly _todoRepo: TodoRepository;
    
    
    public constructor(domainContext: DomainContext, todoRepo: TodoRepository)
    {
        given(domainContext, "domainContext").ensureHasValue().ensureIsObject();
        this._domainContext = domainContext;
        
        given(todoRepo, "todoRepo").ensureHasValue().ensureIsObject();
        this._todoRepo = todoRepo;
    }
    
    
    public async create(title: string, description: string | null): Promise<string>
    {
        given(title, "title").ensureHasValue().ensureIsString();
        given(description, "description").ensureIsString();
        
        title = title.trim();
        description = description && !description.isEmptyOrWhiteSpace() ? description.trim() : null;
        const event = new TodoCreated({$isCreatedEvent: true}, DomainHelper.generateId(), title, description);
        const todo = new Todo(this._domainContext, [event]);
        await this._todoRepo.save(todo);
        return todo.id;
    }
}