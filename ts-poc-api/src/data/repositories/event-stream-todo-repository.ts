import { TodoRepository } from "../../domain/repositories/todo-repository";
import { Db, KnexPgUnitOfWork, DbConnectionFactory } from "@nivinjoseph/n-data";
import { given } from "@nivinjoseph/n-defensive";
import { inject } from "@nivinjoseph/n-ject";
import { Todo } from "../../domain/aggregates/todo/todo";
import { DomainContext, DomainEventData } from "@nivinjoseph/n-domain";
import { TodoNotFoundException } from "../../domain/exceptions/todo-not-found-exception";


@inject("Db", "DomainContext", "DbConnectionFactory")
export class EventStreamTodoRepository implements TodoRepository
{
    private readonly _db: Db;
    private readonly _domainContext: DomainContext;
    private readonly _dbConnectionFactory: DbConnectionFactory;


    public constructor(db: Db, domainContext: DomainContext, dbConnectionFactory: DbConnectionFactory)
    {
        given(db, "db").ensureHasValue().ensureIsObject();
        this._db = db;

        given(domainContext, "domainContext").ensureHasValue().ensureIsObject();
        this._domainContext = domainContext;
        
        given(dbConnectionFactory, "dbConnectionFactory").ensureHasValue().ensureIsObject();
        this._dbConnectionFactory = dbConnectionFactory;
    }


    public async getAll(): Promise<ReadonlyArray<Todo>>
    {
        const sql = `select data from event_stream;`;
        const queryResult = await this._db.executeQuery<any>(sql);
        const eventData = queryResult.rows.map(t => t.data as DomainEventData);
        const groupedEventData = eventData.reduce((acc: any, t) =>
        {
            if (!acc[t.$aggregateId as any])
                acc[t.$aggregateId as any] = [];
            
            acc[t.$aggregateId as any].push(t);
            return acc;
        }, {});
        
        return Object.keys(groupedEventData).map(t => Todo.deserialize(this._domainContext, groupedEventData[t]));
    }

    public async get(id: string): Promise<Todo>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        id = id.trim();
        const sql = `select data from event_stream where agg_id = ?;`;
        const result = await this._db.executeQuery<any>(sql, id);
        if (result.rows.length === 0)
            throw new TodoNotFoundException(id);

        return Todo.deserialize(this._domainContext, result.rows.map(t => t.data));
    }

    public async save(todo: Todo): Promise<void>
    {
        given(todo, "todo").ensureHasValue().ensureIsType(Todo);

        const exists = await this.checkIfTodoExists(todo.id);
        if (exists && !todo.hasChanges)
            return;
    
        const events = exists ? todo.currentEvents : todo.events;
        const unitOfWork = new KnexPgUnitOfWork(this._dbConnectionFactory);
        
        try 
        {
            await events.forEachAsync(async t =>
            {
                const sql = `insert into event_stream 
                            (id, agg_id, data) 
                            values(?, ?, ?);`;

                const params = [t.id, t.aggregateId, t.serialize()];

                await this._db.executeCommandWithinUnitOfWork(unitOfWork, sql, ...params);
            }, 1);

            await unitOfWork.commit();
        }
        catch (error)
        {
            await unitOfWork.rollback();
            throw error;
        }
    }

    public async delete(id: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        id = id.trim();
        const exists = await this.checkIfTodoExists(id);
        if (!exists)
            return;

        const sql = `delete from event_stream where agg_id = ?;`;

        await this._db.executeCommand(sql, id);
    }


    private async checkIfTodoExists(id: string): Promise<boolean>
    {
        const sql = `select exists (select 1 from event_stream where agg_id = ?);`;

        const result = await this._db.executeQuery<any>(sql, id);
        return result.rows[0].exists;
    }
}