import { Controller, command, route } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { TodoRepository } from "../../../domain/repositories/todo-repository";
import { given } from "@nivinjoseph/n-defensive";
import { Validator } from "@nivinjoseph/n-validate";
import { ValidationException } from "../../exceptions/validation-exception";


@route(Routes.command.markTodoAsCompleted)
@command
@inject("TodoRepository")
export class MarkTodoAsCompletedController extends Controller
{
    private readonly _todoRepository: TodoRepository;


    public constructor(todoRepository: TodoRepository)
    {
        super();
        
        given(todoRepository, "todoRepository").ensureHasValue().ensureIsObject();
        this._todoRepository = todoRepository;
    }

    
    public async execute(model: Model): Promise<void>
    {
        given(model, "model").ensureHasValue().ensureIsObject();

        this.validateModel(model);

        const todo = await this._todoRepository.get(model.id);
        todo.markAsCompleted();
        await this._todoRepository.save(todo);
    }
    
    
    private validateModel(model: Model): void
    {
        let validator = new Validator<Model>();

        validator.for<string>("id")
            .isRequired()
            .ensureIsString();

        validator.validate(model);

        if (validator.hasErrors)
            throw new ValidationException(validator.errors);
    }
}


interface Model
{
    id: string;
}