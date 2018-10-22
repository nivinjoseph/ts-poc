import { Todo } from "../models/todo/todo";


export interface TodoFactory
{
    create(title: string, description: string): Promise<Todo>;
}