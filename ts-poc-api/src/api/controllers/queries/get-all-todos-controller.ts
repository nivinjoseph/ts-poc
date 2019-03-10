import { Controller, route, query } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { TodoRepository } from "../../../domain/todo/repositories/todo-repository";
import { given } from "@nivinjoseph/n-defensive";


@route(Routes.query.getAllTodos)
@query
@inject("TodoRepository")    
export class GetAllTodosController extends Controller
{
    private readonly _todoRepository: TodoRepository;
    
    
    public constructor(todoRepository: TodoRepository)
    {
        super();
        given(todoRepository, "todoRepository").ensureHasValue().ensureIsObject();
        this._todoRepository = todoRepository;
    }
    
    
    public async execute(): Promise<ReadonlyArray<object>>
    {
        const todos = await this._todoRepository.getAll(true);
        return todos.map(t =>
            ({
                id: t.id,
                title: t.title,
                description: t.description,
                isCompleted: t.isCompleted
            }));
    }
}