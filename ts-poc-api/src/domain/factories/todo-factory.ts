import { Todo } from "../models/todo";


export interface TodoFactory
{
    create(title: string, description: string): Promise<Todo>;
}