import { Controller, command, route } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { TodoRepository } from "../../../domain/repositories/todo-repository";
import { given } from "@nivinjoseph/n-defensive";
import { Validator, strval } from "@nivinjoseph/n-validate";
import { ValidationException } from "../../exceptions/validation-exception";


@route(Routes.command.updateTodo)
@command
@inject("TodoRepository")
export class UpdateTodoController extends Controller
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
        todo.updateTitle(model.title);
        todo.updateDescription(model.description);
        await this._todoRepository.save(todo);
    }


    private validateModel(model: Model): void
    {
        let validator = new Validator<Model>();

        validator.for<string>("id")
            .isRequired()
            .ensureIsString();
        
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
    id: string;
    title: string;
    description?: string;
}