import { EventStreamTodoRepository } from "./event-stream-todo-repository";
import { Todo } from "../../domain/todo/todo";
import { given } from "@nivinjoseph/n-defensive";
import { TodoNotFoundException } from "../../domain/todo/exceptions/todo-not-found-exception";
import { inject } from "@nivinjoseph/n-ject";
import { UnitOfWork } from "@nivinjoseph/n-data";


@inject("Db", "DomainContext", "UnitOfWork", "Logger", "EventBus")
export class SnapshotTodoRepository extends EventStreamTodoRepository
{
    public async getAll(fromSnapshot?: boolean | undefined): Promise<ReadonlyArray<Todo>>
    {
        given(fromSnapshot as boolean, "fromSnapshot").ensureIsBoolean();
        
        if (!fromSnapshot)
            return await super.getAll();
        
        const sql = `select data from todo_snaps;`;
        const queryResult = await this.db.executeQuery<any>(sql);
        return queryResult.rows.map(t => Todo.deserializeSnapshot(this.domainContext, t.data));
    }
    
    public async get(id: string, fromSnapshot?: boolean | undefined): Promise<Todo>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        given(fromSnapshot as boolean, "fromSnapshot").ensureIsBoolean();
        
        if (!fromSnapshot)
            return await super.get(id);
        
        id = id.trim();
        const sql = `select data from todo_snaps where id = ?;`;
        const result = await this.db.executeQuery<any>(sql, id);
        if (result.rows.length === 0)
            throw new TodoNotFoundException(id);

        return Todo.deserializeSnapshot(this.domainContext, result.rows[0].data);
    }
    
    public async save(todo: Todo, unitOfWork?: UnitOfWork): Promise<void>
    {
        given(todo, "todo").ensureHasValue().ensureIsType(Todo);
        given(unitOfWork as object, "unitOfWork").ensureIsObject();

        // const exists = await this.checkIfTodoExists(todo.id);
        if (!todo.isNew && !todo.hasChanges)
            return;
        
        try 
        {
            await super.save(todo, unitOfWork || this.unitOfWork);

            let sql = "";
            const params = [];
            
            if (todo.isNew)
            {
                sql = `insert into todo_snaps 
                            (id, data) 
                            values(?, ?);`;

                params.push(todo.id, todo.snapshot());
            }
            else
            {
                sql = `update todo_snaps 
                            set data = ? 
                            where id = ?`;

                params.push(todo.snapshot(), todo.id);
            }
            
            await this.db.executeCommandWithinUnitOfWork(unitOfWork || this.unitOfWork, sql, ...params);
            
            if (!unitOfWork)
                await this.unitOfWork.commit();
        }
        catch (error)
        {
            if (!unitOfWork)
                await this.unitOfWork.rollback();

            throw error;   
        }
    }
    
    public async delete(id: string, unitOfWork?: UnitOfWork): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        given(unitOfWork as object, "unitOfWork").ensureIsObject();

        id = id.trim();
        // const exists = await this.checkIfTodoExists(id);
        // if (!exists)
        //     return;
        
        try 
        {
            await super.delete(id, unitOfWork || this.unitOfWork);
            const sql = `delete from todo_snaps where id = ?;`;
            await this.db.executeCommandWithinUnitOfWork(unitOfWork || this.unitOfWork, sql, id);
            
            if (!unitOfWork)
                await this.unitOfWork.commit();
        }
        catch (error)
        {
            if (!unitOfWork)
                await this.unitOfWork.rollback();

            throw error;   
        }
    }
}