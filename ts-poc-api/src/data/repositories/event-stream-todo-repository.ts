import { TodoRepository } from "../../domain/todo/repositories/todo-repository";
import { Db, UnitOfWork } from "@nivinjoseph/n-data";
import { given } from "@nivinjoseph/n-defensive";
import { inject } from "@nivinjoseph/n-ject";
import { Todo } from "../../domain/todo/todo";
import { DomainContext, DomainEventData } from "@nivinjoseph/n-domain";
import { TodoNotFoundException } from "../../domain/todo/exceptions/todo-not-found-exception";
import { Disposable } from "@nivinjoseph/n-util";
import { Logger } from "@nivinjoseph/n-log";
import { EventBus } from "@nivinjoseph/n-eda";


@inject("Db", "DomainContext", "UnitOfWork", "Logger", "EventBus")
export class EventStreamTodoRepository implements TodoRepository, Disposable
{
    private readonly _db: Db;
    private readonly _domainContext: DomainContext;
    private readonly _unitOfWork: UnitOfWork;
    private readonly _logger: Logger;
    private readonly _eventBus: EventBus;
    private _isDisposed = false;
    
    
    protected get db(): Db { return this._db; }
    protected get domainContext(): DomainContext { return this._domainContext; }
    protected get unitOfWork(): UnitOfWork { return this._unitOfWork; }
    protected get logger(): Logger { return this._logger; }
    protected get isDisposed(): boolean { return this._isDisposed; }


    public constructor(db: Db, domainContext: DomainContext, unitOfWork: UnitOfWork, logger: Logger, eventBus: EventBus)
    {
        given(db, "db").ensureHasValue().ensureIsObject();
        this._db = db;

        given(domainContext, "domainContext").ensureHasValue().ensureIsObject();
        this._domainContext = domainContext;
        
        given(unitOfWork, "unitOfWork").ensureHasValue().ensureIsObject();
        this._unitOfWork = unitOfWork;
        
        given(logger, "logger").ensureHasValue().ensureIsObject();
        this._logger = logger;
        
        given(eventBus, "eventBus").ensureHasValue().ensureIsObject();
        this._eventBus = eventBus;
    }


    public async getAll(): Promise<ReadonlyArray<Todo>>
    {
        const sql = `select data from todo_events;`;
        const queryResult = await this._db.executeQuery<any>(sql);
        if (queryResult.rows.length === 0)
            return [];

        return queryResult.rows.map(t => t.data as DomainEventData)
            .groupBy(t => t.$aggregateId as string)
            .map(t => Todo.deserializeEvents(this._domainContext, t.values));
    }

    public async get(id: string): Promise<Todo>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        id = id.trim();
        const sql = `select data from todo_events where aggregate_id = ?;`;
        const result = await this._db.executeQuery<any>(sql, id);
        if (result.rows.length === 0)
            throw new TodoNotFoundException(id);

        return Todo.deserializeEvents(this._domainContext, result.rows.map(t => t.data));
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
            const events = todo.isNew ? todo.events : todo.currentEvents;
            await events.forEachAsync(async t =>
            {
                const sql = `insert into todo_events 
                            (id, aggregate_id, data) 
                            values(?, ?, ?);`;

                const params = [t.id, t.aggregateId, t.serialize()];

                await this._db.executeCommandWithinUnitOfWork(unitOfWork || this._unitOfWork, sql, ...params);
            }, 1);
            
            await events.forEachAsync(t => this._eventBus.publish(t), 1);
            
            if (!unitOfWork)
                await this._unitOfWork.commit();
        }
        catch (error)
        {
            if (!unitOfWork)
                await this._unitOfWork.rollback();

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

        const sql = `delete from todo_events where aggregate_id = ?;`;

        try 
        {
            await this._db.executeCommandWithinUnitOfWork(unitOfWork || this._unitOfWork, sql, id);    
            
            if (!unitOfWork)
                await this._unitOfWork.commit();
        }
        catch (error)
        {
            if (!unitOfWork)
                await this._unitOfWork.rollback();

            throw error;   
        }
    }
    
    public async dispose(): Promise<void>
    {
        if (this._isDisposed)
            return;
        
        this._isDisposed = true;
        
        await this._logger.logWarning(`${(<Object>this).getTypeName()} being disposed.`);
    }


    // protected async checkIfTodoExists(id: string): Promise<boolean>
    // {
    //     const sql = `select exists (select 1 from todo_events where aggregate_id = ?);`;

    //     const result = await this._db.executeQuery<any>(sql, id);
    //     return result.rows[0].exists;
    // }
}