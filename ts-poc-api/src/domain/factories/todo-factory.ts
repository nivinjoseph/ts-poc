export interface TodoFactory
{
    create(title: string, description: string | null): Promise<string>;
}