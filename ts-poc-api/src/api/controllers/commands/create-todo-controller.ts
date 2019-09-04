import { Controller, command, route } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { TodoFactory } from "../../../domain/todo/factories/todo-factory";
import { Validator, strval } from "@nivinjoseph/n-validate";
import { ValidationException } from "../../exceptions/validation-exception";
import { TodoRepository } from "../../../domain/todo/repositories/todo-repository";


@route(Routes.command.createTodo)
@command
@inject("TodoFactory", "TodoRepository") 
export class CreateTodoController extends Controller
{
    private readonly _todoFactory: TodoFactory;
    private readonly _todoRepository: TodoRepository;


    public constructor(todoFactory: TodoFactory, todoRepository: TodoRepository)
    {
        super();
        
        given(todoFactory, "todoFactory").ensureHasValue().ensureIsObject();
        this._todoFactory = todoFactory;
        
        given(todoRepository, "todoRepository").ensureHasValue().ensureIsObject();
        this._todoRepository = todoRepository;
    }
    
    
    public async execute(model: Model): Promise<object>
    {
        given(model, "model").ensureHasValue().ensureIsObject();

        this.validateModel(model);
        
        const todoId = await this._todoFactory.create(model.title, model.description || null);  
        const todo = await this._todoRepository.get(todoId, true);
        
        return {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            isCompleted: todo.isCompleted
        };
    }
    
    
    private validateModel(model: Model): void
    {
        let validator = new Validator<Model>();

        validator.for<string>("title")
            .isRequired()
            .isString()
            .useValidationRule(strval.hasMaxLength(128));

        validator.for<string>("description")
            .isOptional()
            .isString()
            .useValidationRule(strval.hasMaxLength(500));

        validator.validate(model);

        if (validator.hasErrors)
            throw new ValidationException(validator.errors);
    }
}


interface Model
{
    title: string;
    description?: string;
}