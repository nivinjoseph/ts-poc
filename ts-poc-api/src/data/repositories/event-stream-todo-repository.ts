import { TodoRepository } from "../../domain/repositories/todo-repository";
import { Db, UnitOfWork } from "@nivinjoseph/n-data";
import { given } from "@nivinjoseph/n-defensive";
import { inject } from "@nivinjoseph/n-ject";
import { Todo } from "../../domain/aggregates/todo/todo";
import { DomainContext, DomainEventData } from "@nivinjoseph/n-domain";
import { TodoNotFoundException } from "../../domain/exceptions/todo-not-found-exception";


@inject("Db", "DomainContext", "UnitOfWork")
export class EventStreamTodoRepository implements TodoRepository
{
    private readonly _db: Db;
    private readonly _domainContext: DomainContext;
    private readonly _unitOfWork: UnitOfWork;
    
    
    protected get db(): Db { return this._db; }
    protected get domainContext(): DomainContext { return this._domainContext; }
    protected get unitOfWork(): UnitOfWork { return this._unitOfWork; }


    public constructor(db: Db, domainContext: DomainContext, unitOfWork: UnitOfWork)
    {
        given(db, "db").ensureHasValue().ensureIsObject();
        this._db = db;

        given(domainContext, "domainContext").ensureHasValue().ensureIsObject();
        this._domainContext = domainContext;
        
        given(unitOfWork, "unitOfWork").ensureHasValue().ensureIsObject();
        this._unitOfWork = unitOfWork;
    }


    public async getAll(): Promise<ReadonlyArray<Todo>>
    {
        const sql = `select data from todo_events;`;
        const queryResult = await this._db.executeQuery<any>(sql);
        const groupedEventData = queryResult.rows.map(t => t.data as DomainEventData).groupBy(t => t.$aggregateId as string);
        return Object.keys(groupedEventData).map(t => Todo.deserializeEvents(this._domainContext, groupedEventData[t]));
    }

    public async get(id: string): Promise<Todo>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        id = id.trim();
        const sql = `select data from todo_events where todo_id = ?;`;
        const result = await this._db.executeQuery<any>(sql, id);
        if (result.rows.length === 0)
            throw new TodoNotFoundException(id);

        return Todo.deserializeEvents(this._domainContext, result.rows.map(t => t.data));
    }

    public async save(todo: Todo): Promise<void>
    {
        given(todo, "todo").ensureHasValue().ensureIsType(Todo);

        const exists = await this.checkIfTodoExists(todo.id);
        if (exists && !todo.hasChanges)
            return;
    
        const events = exists ? todo.currentEvents : todo.events;
        
        await events.forEachAsync(async t =>
        {
            const sql = `insert into todo_events 
                            (id, todo_id, data) 
                            values(?, ?, ?);`;

            const params = [t.id, t.aggregateId, t.serialize()];

            await this._db.executeCommandWithinUnitOfWork(this._unitOfWork, sql, ...params);
        }, 1);
    }

    public async delete(id: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        id = id.trim();
        const exists = await this.checkIfTodoExists(id);
        if (!exists)
            return;

        const sql = `delete from todo_events where todo_id = ?;`;

        await this._db.executeCommandWithinUnitOfWork(this._unitOfWork, sql, id);
    }


    protected async checkIfTodoExists(id: string): Promise<boolean>
    {
        const sql = `select exists (select 1 from todo_events where todo_id = ?);`;

        const result = await this._db.executeQuery<any>(sql, id);
        return result.rows[0].exists;
    }
}