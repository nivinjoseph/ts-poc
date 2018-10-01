import { PageViewModel, template, route, NavigationService } from "@nivinjoseph/n-app";
import * as Routes from "../routes";
import "./manage-todo-view.scss";
import { inject } from "@nivinjoseph/n-ject";
import { TodoService } from "../../services/todo/todo-service";
import { given } from "@nivinjoseph/n-defensive";


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

    
    public get operation(): string { return this._operation; }

    public get title(): string { return this._title; }
    public set title(value: string) { this._title = value; }

    public get description(): string { return this._description; }
    public set description(value: string) { this._description = value; }


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
    }


    public save(): void
    {
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
}