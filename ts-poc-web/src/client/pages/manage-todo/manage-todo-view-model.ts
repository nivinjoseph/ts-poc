import { PageViewModel, template, route, NavigationService } from "@nivinjoseph/n-app";
import * as Routes from "../routes";
import "./manage-todo-view.scss";
import { inject } from "@nivinjoseph/n-ject";
import { TodoService } from "../../services/todo/todo-service";
import { given } from "@nivinjoseph/n-defensive";
import { Validator, strval } from "@nivinjoseph/n-validate";


@template(require("./manage-todo-view.html"))
@route(Routes.manageTodo)
@inject("TodoService", "NavigationService")
export class ManageTodoViewModel extends PageViewModel
{
    private readonly _todoService: TodoService;
    private readonly _navigationService: NavigationService;
    private _operation: string;
    private _id: string | null;
    private _title: string;
    private _description: string;
    private readonly _validator: Validator<this>;

    
    public get operation(): string { return this._operation; }

    public get title(): string { return this._title; }
    public set title(value: string) { this._title = value; }

    public get description(): string { return this._description; }
    public set description(value: string) { this._description = value; }
    
    public get hasErrors(): boolean { return !this.validate(); }
    public get errors(): Object { return this._validator.errors; }


    public constructor(todoService: TodoService, navigationService: NavigationService)
    {
        super();
        given(todoService, "todoService").ensureHasValue().ensureIsObject();
        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        
        this._todoService = todoService;
        this._navigationService = navigationService;
        this._operation = "";
        this._id = null; 
        this._title = "";
        this._description = "";
        this._validator = this.createValidator();
    }

    
    public save(): void
    {
        this._validator.enable();
        if (!this.validate())
            return;
        
        const savePromise: Promise<any> = this._id
            ? this._todoService.updateTodo(this._id, this._title, this._description)
            : this._todoService.createTodo(this._title, this._description);

        savePromise
            .then(() => this._navigationService.navigate(Routes.listTodos, {}))
            .catch(e => console.log(e));
    }
    
    
    protected onEnter(id?: string): void
    {
        if (id && !id.isEmptyOrWhiteSpace())
        {
            this._operation = "Update";
            
            this._todoService.getTodo(id)
                .then(t =>
                {
                    this._id = t.id;
                    this._title = t.title;
                    this._description = t.description;
                })
                .catch(e => console.log(e));
        }
        else
        {
            this._operation = "Add";
        }
    }
    
    
    private validate(): boolean
    {
        this._validator.validate(this);
        return this._validator.isValid;
    }
    
    private createValidator(): Validator<this>
    {
        const validator = new Validator<this>(false);

        validator
            .for<string>("title")
            .isRequired().withMessage("The title field is required.")
            .ensureIsString()
            .useValidationRule(strval.hasMaxLength(50));

        validator
            .for<string>("description")
            .isOptional()
            .ensureIsString()
            .useValidationRule(strval.hasMaxLength(500));

        return validator;
    }
}