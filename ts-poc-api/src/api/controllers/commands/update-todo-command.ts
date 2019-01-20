import { Controller, command, route } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { TodoRepository } from "../../../domain/repositories/todo-repository";
import { given } from "@nivinjoseph/n-defensive";
import { Validator, strval } from "@nivinjoseph/n-validate";
import { ValidationException } from "../../exceptions/validation-exception";
import { UnitOfWork } from "@nivinjoseph/n-data";


@route(Routes.command.updateTodo)
@command
@inject("TodoRepository", "UnitOfWork")
export class UpdateTodoController extends Controller
{
    private readonly _todoRepository: TodoRepository;
    private readonly _unitOfWork: UnitOfWork;


    public constructor(todoRepository: TodoRepository, unitOfWork: UnitOfWork)
    {
        super();

        given(todoRepository, "todoRepository").ensureHasValue().ensureIsObject();
        this._todoRepository = todoRepository;

        given(unitOfWork, "unitOfWork").ensureHasValue().ensureIsObject();
        this._unitOfWork = unitOfWork;
    }


    public async execute(model: Model): Promise<void>
    {
        given(model, "model").ensureHasValue().ensureIsObject();

        this.validateModel(model);

        const todo = await this._todoRepository.get(model.id);
        todo.updateTitle(model.title);
        todo.updateDescription(model.description || null);
        
        try 
        {
            await this._todoRepository.save(todo);
            await this._unitOfWork.commit();
        }
        catch (error)
        {
            await this._unitOfWork.rollback();
            throw error;
        }
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