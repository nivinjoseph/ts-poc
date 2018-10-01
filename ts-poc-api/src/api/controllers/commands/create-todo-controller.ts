import { Controller, command, route } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { TodoRepository } from "../../../domain/repositories/todo-repository";
import { given } from "@nivinjoseph/n-defensive";
import { TodoFactory } from "../../../domain/factories/todo-factory";
import { Validator, strval } from "@nivinjoseph/n-validate";
import { ValidationException } from "../../exceptions/validation-exception";


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
        given(todoRepository, "todoRepository").ensureHasValue().ensureIsObject();
        this._todoFactory = todoFactory;
        this._todoRepository = todoRepository;
    }
    
    
    public async execute(model: Model): Promise<object>
    {
        given(model, "model").ensureHasValue().ensureIsObject();

        this.validateModel(model);
        
        const todo = await this._todoFactory.create(model.title, model.description);
        await this._todoRepository.save(todo);
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
            .ensureIsString()
            .useValidationRule(strval.hasMaxLength(128));

        validator.for<string>("description")
            .isOptional()
            .ensureIsString()
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