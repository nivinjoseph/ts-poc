import { ComponentViewModel, template, element, bind, NavigationService } from "@nivinjoseph/n-app";
import "./todo-view.scss";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import * as Routes from "../../pages/routes";
import { Todo } from "../../../sdk/proxies/todo/todo";


@template(require("./todo-view.html"))
@element("todo")
@bind("value") 
@inject("NavigationService")
export class TodoViewModel extends ComponentViewModel
{
    private readonly _navigationService: NavigationService;
    
    
    public get todo(): Todo { return this.getBound<Todo>("value"); }
    
    
    public constructor(navigationService: NavigationService)
    {
        super();
        
        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        this._navigationService = navigationService;
    }
    
    
    public completeTodo(): void
    {
        this.todo.complete()
            // .then(() => this.todo.isCompleted = true)
            .catch(e => console.log(e));
    }
    
    public editTodo(): void
    {
        this._navigationService.navigate(Routes.manageTodo, { id: this.todo.id });
    }
    
    public deleteTodo(): void
    {
        this.todo.delete()
            // .then(() => this.todo.isDeleted = true)
            .catch(e => console.log(e));
    }
}