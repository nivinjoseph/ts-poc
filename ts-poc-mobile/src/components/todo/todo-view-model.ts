import { ComponentViewModel, template, element, bind, NavigationService } from "@nivinjoseph/n-app";
import "./todo-view.scss";
import { Todo } from "../../models/todo";
import { inject } from "@nivinjoseph/n-ject";
import { TodoService } from "../../services/todo/todo-service";
import { given } from "@nivinjoseph/n-defensive";
import * as Routes from "../../pages/routes";


@template(require("./todo-view.html"))
@element("todo")
@bind("value") 
@inject("TodoService", "NavigationService")
export class TodoViewModel extends ComponentViewModel
{
    private readonly _todoService: TodoService;
    private readonly _navigationService: NavigationService;
    
    
    public get todo(): Todo { return this.getBound<Todo>("value"); }
    
    
    public constructor(todoService: TodoService, navigationService: NavigationService)
    {
        super();
        given(todoService, "todoService").ensureHasValue().ensureIsObject();
        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        this._todoService = todoService;
        this._navigationService = navigationService;
    }
    
    
    public completeTodo(): void
    {
        this._todoService.markTodoAsCompleted(this.todo.id)
            .then(() => this.todo.isCompleted = true)
            .catch(e => console.log(e));
    }
    
    public editTodo(): void
    {
        this._navigationService.navigate(Routes.manageTodo, { id: this.todo.id });
    }
    
    public deleteTodo(): void
    {
        this._todoService.deleteTodo(this.todo.id)
            .then(() => this.todo.isDeleted = true)
            .catch(e => console.log(e));
    }
}