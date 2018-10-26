import { TodoFactory } from "./todo-factory";
import { Todo } from "../models/todo/todo";
import { given } from "@nivinjoseph/n-defensive";
import { Uuid } from "@nivinjoseph/n-sec";
import * as Moment from "moment";
import { TodoCreatedEvent } from "../models/todo/events/todo-created-event";
import "@nivinjoseph/n-ext";


export class DefaultTodoFactory implements TodoFactory
{
    public create(title: string, description: string): Promise<Todo>
    {
        given(title, "title").ensureHasValue().ensureIsString();
        given(description, "description").ensureIsString();
        
        const id = Uuid.create().replaceAll("-", "");
        // const createdAt = Moment().valueOf();
        title = title.trim();
        description = description && !description.isEmptyOrWhiteSpace() ? description.trim() : null;
        const event = new TodoCreatedEvent(Moment().valueOf(), 0, id, title, description);
        // const todo = new Todo(id, createdAt, title, description, false, createdAt);
        const todo = new Todo([event]);
        return Promise.resolve(todo);
    }
}