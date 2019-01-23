import { EventStreamTodoRepository } from "./event-stream-todo-repository";
import { Todo } from "../../domain/aggregates/todo/todo";
import { given } from "@nivinjoseph/n-defensive";
import { TodoNotFoundException } from "../../domain/exceptions/todo-not-found-exception";
import { inject } from "@nivinjoseph/n-ject";


@inject("Db", "DomainContext", "UnitOfWork")
export class SnapshotTodoRepository extends EventStreamTodoRepository
{
    public async getAll(fromSnapshot?: boolean | undefined): Promise<ReadonlyArray<Todo>>
    {
        given(fromSnapshot, "fromSnapshot").ensureIsBoolean();
        
        if (!fromSnapshot)
            return await super.getAll();
        
        const sql = `select data from todo_snaps;`;
        const queryResult = await this.db.executeQuery<any>(sql);
        return queryResult.rows.map(t => Todo.deserializeSnapshot(this.domainContext, t.data));
    }
    
    public async get(id: string, fromSnapshot?: boolean | undefined): Promise<Todo>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        given(fromSnapshot, "fromSnapshot").ensureIsBoolean();
        
        if (!fromSnapshot)
            return await super.get(id);
        
        id = id.trim();
        const sql = `select data from todo_snaps where id = ?;`;
        const result = await this.db.executeQuery<any>(sql, id);
        if (result.rows.length === 0)
            throw new TodoNotFoundException(id);

        return Todo.deserializeSnapshot(this.domainContext, result.rows[0].data);
    }
    
    public async save(todo: Todo): Promise<void>
    {
        given(todo, "todo").ensureHasValue().ensureIsType(Todo);

        // const exists = await this.checkIfTodoExists(todo.id);
        if (!todo.isNew && !todo.hasChanges)
            return;
        
        await super.save(todo);
         
        if (todo.isNew)
        {
            const sql = `insert into todo_snaps 
                            (id, data) 
                            values(?, ?);`;

            const params = [todo.id, todo.snapshot()];

            await this.db.executeCommandWithinUnitOfWork(this.unitOfWork, sql, ...params);
        }
        else
        {
            const sql = `update todo_snaps 
                            set data = ? 
                            where id = ?`;

            const params = [todo.snapshot(), todo.id];

            await this.db.executeCommandWithinUnitOfWork(this.unitOfWork, sql, ...params);
        }
    }
    
    public async delete(id: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        id = id.trim();
        // const exists = await this.checkIfTodoExists(id);
        // if (!exists)
        //     return;
        
        await super.delete(id);
        
        const sql = `delete from todo_snaps where id = ?;`;

        await this.db.executeCommandWithinUnitOfWork(this.unitOfWork, sql, id);
    }
}