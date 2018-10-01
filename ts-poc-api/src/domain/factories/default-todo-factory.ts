import { TodoFactory } from "./todo-factory";
import { Todo } from "../models/todo";
import { given } from "@nivinjoseph/n-defensive";
import { Uuid } from "@nivinjoseph/n-sec";
import * as Moment from "moment";


export class DefaultTodoFactory implements TodoFactory
{
    public create(title: string, description: string): Promise<Todo>
    {
        given(title, "title").ensureHasValue().ensureIsString();
        given(description, "description").ensureIsString();
        
        const id = Uuid.create();
        const createdAt = Moment().valueOf();
        title = title.trim();
        description = description && !description.isEmptyOrWhiteSpace() ? description.trim() : null;
        const todo = new Todo(id, createdAt, title, description, false, createdAt);
        return Promise.resolve(todo);
    }
}