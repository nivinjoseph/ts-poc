import { TodoRepository } from "../../domain/repositories/todo-repository";
import { Todo } from "../../domain/models/todo/todo";
import { Db } from "@nivinjoseph/n-data";
import { given } from "@nivinjoseph/n-defensive";
import { TodoNotFoundException } from "../exceptions/todo-not-found-exception";
import { inject } from "@nivinjoseph/n-ject";

@inject("Db")
export class DbTodoRepository implements TodoRepository
{
    private readonly _db: Db;


    public constructor(db: Db)
    {
        given(db, "db").ensureHasValue().ensureIsObject();

        this._db = db;
    }


    public async getAll(): Promise<ReadonlyArray<Todo>>
    {
        const sql = `select data from todos order by created_at;`;
        const queryResult = await this._db.executeQuery<any>(sql);
        return queryResult.rows.map(t => Todo.deserialize(t.data));
    }
    
    public async get(id: string): Promise<Todo>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        id = id.trim();
        const sql = `select data from todos where id = ?;`;
        const result = await this._db.executeQuery<any>(sql, id);
        if (result.rows.length === 0)
            throw new TodoNotFoundException(id);
        
        return Todo.deserialize(result.rows[0].data);
    }

    public async save(todo: Todo): Promise<void>
    {
        given(todo, "todo").ensureHasValue().ensureIsType(Todo);

        const exists = await this.checkIfTodoExists(todo.id);
        if (exists)
        {
            const sql = `update todos 
                            set version = ?, updated_at = ?, data = ? 
                            where id = ? and version = ?;`;

            let params = [todo.currentVersion, todo.updatedAt, todo.serialize(), todo.id, todo.retroVersion];

            await this._db.executeCommand(sql, ...params);
        }
        else
        {
            let sql = `insert into todos 
                            (id, version, created_at, updated_at, data) 
                            values(?, ?, ?, ?, ?);`;

            let params = [todo.id, todo.version, todo.createdAt, todo.updatedAt, todo.serialize()];

            await this._db.executeCommand(sql, ...params);
        }
    }

    public async delete(id: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        id = id.trim();
        let exists = await this.checkIfTodoExists(id);
        if (!exists)
            return;
        
        const sql = `delete from todos where id = ?;`;

        await this._db.executeCommand(sql, id);
    }


    private async checkIfTodoExists(id: string): Promise<boolean>
    {
        let sql = `select exists (select 1 from todos where id = ?);`;

        let result = await this._db.executeQuery<any>(sql, id);
        return result.rows[0].exists;
    }
}