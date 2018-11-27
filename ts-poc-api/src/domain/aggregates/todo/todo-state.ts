import { AggregateState } from "@nivinjoseph/n-domain";


export interface TodoState extends AggregateState
{
    title: string;
    description: string;
    isCompleted: boolean;
}