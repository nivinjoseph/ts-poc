import { Controller, command, route } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { TodoRepository } from "../../../domain/repositories/todo-repository";
import { given } from "@nivinjoseph/n-defensive";
import { Validator } from "@nivinjoseph/n-validate";
import { ValidationException } from "../../exceptions/validation-exception";
import { UnitOfWork } from "@nivinjoseph/n-data";


@route(Routes.command.deleteTodo)
@command
@inject("TodoRepository", "UnitOfWork")
export class DeleteTodoController extends Controller
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

        // here we are passing in the unitOfWork simply as an example. This is not a practical use case.
        try 
        {
            await this._todoRepository.delete(model.id, this._unitOfWork);    
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

        validator.validate(model);

        if (validator.hasErrors)
            throw new ValidationException(validator.errors);
    }
}


interface Model
{
    id: string;
}