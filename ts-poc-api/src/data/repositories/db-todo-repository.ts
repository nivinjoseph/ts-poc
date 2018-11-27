import { TodoRepository } from "../../domain/repositories/todo-repository";
import { Db } from "@nivinjoseph/n-data";
import { given } from "@nivinjoseph/n-defensive";
import { inject } from "@nivinjoseph/n-ject";
import { Todo } from "../../domain/aggregates/todo/todo";
import { DomainContext } from "@nivinjoseph/n-domain";
import { TodoNotFoundException } from "../../domain/exceptions/todo-not-found-exception";


@inject("Db", "DomainContext")
export class DbTodoRepository implements TodoRepository
{
    private readonly _db: Db;
    private readonly _domainContext: DomainContext;


    public constructor(db: Db, domainContext: DomainContext)
    {
        given(db, "db").ensureHasValue().ensureIsObject();
        this._db = db;
        
        given(domainContext, "domainContext").ensureHasValue().ensureIsObject();
        this._domainContext = domainContext;
    }


    public async getAll(): Promise<ReadonlyArray<Todo>>
    {
        const sql = `select data from todos order by created_at;`;
        const queryResult = await this._db.executeQuery<any>(sql);
        return queryResult.rows.map(t => Todo.deserialize(this._domainContext, t.data));
    }
    
    public async get(id: string): Promise<Todo>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        id = id.trim();
        const sql = `select data from todos where id = ?;`;
        const result = await this._db.executeQuery<any>(sql, id);
        if (result.rows.length === 0)
            throw new TodoNotFoundException(id);
        
        return Todo.deserialize(this._domainContext, result.rows[0].data);
    }

    public async save(todo: Todo): Promise<void>
    {
        given(todo, "todo").ensureHasValue().ensureIsType(Todo);

        const exists = await this.checkIfTodoExists(todo.id);
        if (exists && todo.hasChanges)
        {
            const sql = `update todos 
                            set version = ?, updated_at = ?, data = ? 
                            where id = ? and version = ?;`;

            const params = [todo.currentVersion, todo.updatedAt, todo.serialize(), todo.id, todo.retroVersion];

            await this._db.executeCommand(sql, ...params);
        }
        else
        {
            const sql = `insert into todos 
                            (id, version, created_at, updated_at, data) 
                            values(?, ?, ?, ?, ?);`;

            const params = [todo.id, todo.version, todo.createdAt, todo.updatedAt, todo.serialize()];

            await this._db.executeCommand(sql, ...params);
        }
    }

    public async delete(id: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        id = id.trim();
        const exists = await this.checkIfTodoExists(id);
        if (!exists)
            return;
        
        const sql = `delete from todos where id = ?;`;

        await this._db.executeCommand(sql, id);
    }


    private async checkIfTodoExists(id: string): Promise<boolean>
    {
        const sql = `select exists (select 1 from todos where id = ?);`;

        const result = await this._db.executeQuery<any>(sql, id);
        return result.rows[0].exists;
    }
}