import { Todo } from "../aggregates/todo/todo";


export interface TodoFactory
{
    create(title: string, description: string | null): Promise<Todo>;
}