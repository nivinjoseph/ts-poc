import { TodoService } from "./todo-service";
import { Todo } from "../../models/todo";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import * as Axios from "axios";
import { given } from "@nivinjoseph/n-defensive";
import "@nivinjoseph/n-ext";
import { inject } from "@nivinjoseph/n-ject";
import { DialogService } from "@nivinjoseph/n-app";


@inject("DialogService")
export class RemoteTodoService implements TodoService
{
    private readonly _dialogService: DialogService;
    private readonly _api: Axios.AxiosInstance;
    
    
    public constructor(dialogService: DialogService)
    {
        given(dialogService, "dialogService").ensureHasValue().ensureIsObject();
        
        this._dialogService = dialogService;
        
        let apiUrl = ConfigurationManager.getConfig<string>("apiUrl").trim();
        if (!apiUrl.endsWith("/"))
            apiUrl += "/";
        
        this._api = Axios.default.create({
            timeout: 60000,
            baseURL: apiUrl
        });
    }
    
    
    public async getTodos(): Promise<ReadonlyArray<Todo>>
    {
        this._dialogService.showLoadingScreen();
        try 
        {
            const response = await this._api.get<ReadonlyArray<Todo>>("api/query/getAllTodos");
            return response.data.map(t =>
            {
                t.isDeleted = false;
                return t;
            });
        }
        catch (error)
        {
            this.showErrorMessage(error.response.status);
            throw error;
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }
    }
    
    public async getTodo(id: string): Promise<Todo>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        
        this._dialogService.showLoadingScreen();
        try 
        {
            const response = await this._api.get(`api/query/getTodo/${id.trim().toLowerCase()}`);
            const todo: Todo = response.data;
            todo.isDeleted = false;
            return todo;
        }
        catch (error)
        {
            this.showErrorMessage(error.response.status);
            throw error;
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }        
    }
    
    public async createTodo(title: string, description: string): Promise<Todo>
    {
        given(title, "title").ensureHasValue().ensureIsString();
        given(description, "description").ensureIsString();
        
        const command = {
            title: title.trim(),
            description: description ? description.trim() : ""
        };
        
        this._dialogService.showLoadingScreen();
        try
        {
            const response = await this._api.post("api/command/createTodo", command);
            this._dialogService.showSuccessMessage("Successfully created Todo.");
            const todo: Todo = response.data;
            todo.isDeleted = false;
            return todo;
        }
        catch (error)
        {
            this.showErrorMessage(error.response.status);
            throw error;
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }
    }
    
    public async updateTodo(id: string, title: string, description: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        given(title, "title").ensureHasValue().ensureIsString();
        given(description, "description").ensureIsString();
        
        const command = {
            id: id.trim().toLowerCase(),
            title: title.trim(),
            description: description ? description.trim() : ""
        };
        
        this._dialogService.showLoadingScreen();
        try 
        {
            // @ts-ignore
            const response = await this._api.post("api/command/updateTodo", command);
            this._dialogService.showSuccessMessage("Successfully updated Todo.");
        }
        catch (error)
        {
            this.showErrorMessage(error.response.status);
            throw error;
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }
    }
    
    public async markTodoAsCompleted(id: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        
        const command = {
            id: id.trim().toLowerCase()
        };
        
        this._dialogService.showLoadingScreen();
        try 
        {
            // @ts-ignore
            const response = await this._api.post("api/command/markTodoAsCompleted", command);
            this._dialogService.showSuccessMessage("Successfully marked Todo as complete.");
        }
        catch (error)
        {
            this.showErrorMessage(error.response.status);
            throw error;
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }
    }
    
    public async deleteTodo(id: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        
        const command = {
            id: id.trim().toLowerCase()
        };
        
        this._dialogService.showLoadingScreen();
        try 
        {
            // @ts-ignore
            const response = await this._api.post("api/command/deleteTodo", command);
            this._dialogService.showSuccessMessage("Successfully deleted Todo.");
        }
        catch (error)
        {
            this.showErrorMessage(error.response.status);
            throw error;
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }
    }
    
    
    private showErrorMessage(status: number): void
    {
        this._dialogService.showErrorMessage(`There was an error while processing your request. Code ${status}.`);
    }
}