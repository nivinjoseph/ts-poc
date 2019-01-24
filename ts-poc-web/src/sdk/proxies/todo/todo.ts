export interface Todo
{
    id: string;
    title: string;
    description: string | null;
    isCompleted: boolean;
    isDeleted: boolean;
    
    
    update(title: string, description: string): Promise<void>;
    complete(): Promise<void>;
    delete(): Promise<void>;
}