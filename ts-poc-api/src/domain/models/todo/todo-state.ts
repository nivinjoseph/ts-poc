import { AggregateState } from "./base/aggregate-state";


export interface TodoState extends AggregateState
{
    title: string;
    description: string;
    isCompleted: boolean;
}