import { PageViewModel, template, route } from "@nivinjoseph/n-app";
import * as Routes from "../routes";
import "./list-todos-view.scss";
import { inject } from "@nivinjoseph/n-ject";
import { TodoService } from "../../services/todo/todo-service";
import { given } from "@nivinjoseph/n-defensive";
import { Todo } from "../../models/todo";


@template(require("./list-todos-view.html"))
@route(Routes.listTodos)
@inject("TodoService")    
export class ListTodosViewModel extends PageViewModel
{
    private readonly _todoService: TodoService;
    private _todos: ReadonlyArray<Todo>;
    
    
    public get todos(): ReadonlyArray<Todo> { return this._todos; }
    
    
    public constructor(todoService: TodoService)
    {
        super();
        given(todoService, "todoService").ensureHasValue().ensureIsObject();
        this._todoService = todoService;
        this._todos = [];
    }
    
    
    protected onEnter(): void
    {
        this._todoService.getTodos()
            .then(t => this._todos = t)
            .catch(e => console.log(e));
    }
}