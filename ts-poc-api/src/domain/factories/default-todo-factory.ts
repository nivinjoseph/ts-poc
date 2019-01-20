import { TodoFactory } from "./todo-factory";
import { given } from "@nivinjoseph/n-defensive";
import "@nivinjoseph/n-ext";
import { Todo } from "../aggregates/todo/todo";
import { inject } from "@nivinjoseph/n-ject";
import { DomainContext, DomainHelper } from "@nivinjoseph/n-domain";
import { TodoCreated } from "../aggregates/todo/events/todo-created";
import { TodoRepository } from "../repositories/todo-repository";
import { UnitOfWork } from "@nivinjoseph/n-data";


@inject("DomainContext", "TodoRepository", "UnitOfWork")
export class DefaultTodoFactory implements TodoFactory
{
    private readonly _domainContext: DomainContext;
    private readonly _todoRepo: TodoRepository;
    private readonly _unitOfWork: UnitOfWork;
    
    
    public constructor(domainContext: DomainContext, todoRepo: TodoRepository, unitOfWork: UnitOfWork)
    {
        given(domainContext, "domainContext").ensureHasValue().ensureIsObject();
        this._domainContext = domainContext;
        
        given(todoRepo, "todoRepo").ensureHasValue().ensureIsObject();
        this._todoRepo = todoRepo;
        
        given(unitOfWork, "unitOfWork").ensureHasValue().ensureIsObject();
        this._unitOfWork = unitOfWork;
    }
    
    
    public async create(title: string, description: string | null): Promise<Todo>
    {
        given(title, "title").ensureHasValue().ensureIsString();
        given(description, "description").ensureIsString();
        
        title = title.trim();
        description = description && !description.isEmptyOrWhiteSpace() ? description.trim() : null;
        const event = new TodoCreated({$isCreatedEvent: true}, DomainHelper.generateId(), title, description);
        const todo = new Todo(this._domainContext, [event]);
        
        try 
        {
            await this._todoRepo.save(todo);  
            await this._unitOfWork.commit();
        }
        catch (error)
        {
            await this._unitOfWork.rollback();
            throw error;
        }
        
        return await this._todoRepo.get(todo.id);
    }
}