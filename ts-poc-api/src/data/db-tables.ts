import { Db } from "@nivinjoseph/n-data";
import { given } from "@nivinjoseph/n-defensive";


export class DbTables
{
    private readonly _db: Db;


    public constructor(db: Db)
    {
        given(db, "db").ensureHasValue().ensureIsObject();
        this._db = db;
    }


    public async create(): Promise<void>
    {
        try 
        {
            await this.createTodoTables();
        }
        catch (error)
        {
            console.log("Tables creation failed!!", error);
            throw error;
        }
    }

    public async drop(): Promise<void>
    {
        try 
        {
            await this.dropTodoTables();
        }
        catch (error)
        {
            console.log("Tables drop failed!!", error);
            throw error;
        }
    }
    
    private async createTodoTables(): Promise<void>
    {
        await this._db.executeCommand(`
            create table todos
            (
                id varchar(48) primary key,
                version int not null,
                created_at bigint not null,
                updated_at bigint not null,
                data jsonb not null
            );
        `);
        
            
        await this._db.executeCommand(`
            create table todo_events
            (
                id varchar(50) primary key,
                aggregate_id varchar(32) not null,
                data jsonb not null
            );
        `);
        await this._db.executeCommand(`
            create index concurrently idx_todo_events__aggregate_id on todo_events(aggregate_id);
        `);
            
        
        await this._db.executeCommand(`
            create table todo_snaps 
            (
                id varchar(32) primary key,
                data jsonb not null
            );
        `);
    }
    
    private async dropTodoTables(): Promise<void>
    {
        await this._db.executeCommand(`
            drop table todos;
        `);

        
        await this._db.executeCommand(`drop index idx_todo_events__aggregate_id;`);
        await this._db.executeCommand(`
            drop table todo_events;
        `);
        
            
        await this._db.executeCommand(`
            drop table todo_snaps;
        `);
    }
}