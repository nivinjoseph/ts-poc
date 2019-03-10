import { EdaEventHandler, event } from "@nivinjoseph/n-eda";
import { TodoCreated } from "../../domain/todo/events/todo-created";
import { inject } from "@nivinjoseph/n-ject";
import { Logger } from "@nivinjoseph/n-log";
import { given } from "@nivinjoseph/n-defensive";


@event(TodoCreated)
@inject("Logger")
export class TodoCreatedHandler implements EdaEventHandler<TodoCreated>
{
    private readonly _logger: Logger;
    
    
    public constructor(logger: Logger)
    {
        given(logger, "logger").ensureHasValue().ensureIsObject();
        this._logger = logger;
    }
    
    
    public async handle(event: TodoCreated): Promise<void>
    {
        given(event, "event").ensureHasValue().ensureIsType(TodoCreated);
        
        await this._logger.logInfo(`Todo with id ${event.aggregateId} created`);
    }
}