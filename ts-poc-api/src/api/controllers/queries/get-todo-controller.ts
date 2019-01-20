import { Controller, route, query } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { TodoRepository } from "../../../domain/repositories/todo-repository";
import { given } from "@nivinjoseph/n-defensive";


@route(Routes.query.getTodo)
@query
@inject("TodoRepository")
export class GetTodoController extends Controller
{
    private readonly _todoRepository: TodoRepository;


    public constructor(todoRepository: TodoRepository)
    {
        super();
        given(todoRepository, "todoRepository").ensureHasValue().ensureIsObject();
        this._todoRepository = todoRepository;
    }


    public async execute(id: string): Promise<object>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        
        const todo = await this._todoRepository.get(id, true);
        
        return {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            isCompleted: todo.isCompleted
        };
    }
}