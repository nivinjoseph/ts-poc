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
        const sql = `
            create table todos
            (
                id varchar (48) primary key,
                version int not null,
                created_at bigint not null,
                updated_at bigint not null,
                data jsonb not null
            );
            
            
            create table todo_events
            (
                id varchar (50) primary key,
                todo_id varchar (32) not null,
                data jsonb not null
            );
            
            create table todo_snaps 
            (
                id varchar (32) primary key,
                data jsonb not null
            );
        `;

        try 
        {
            await this._db.executeCommand(sql);
            await this._db.executeCommand(`create index concurrently idx_todo_events__todo_id on todo_events(todo_id);`);
        }
        catch (error)
        {
            console.log("Tables creation failed!!", error);
            throw error;
        }
    }

    public async drop(): Promise<void>
    {
        const sql = `
            drop table todos;

            drop table todo_events;
            
            drop table todo_snaps;
        `;

        try 
        {
            await this._db.executeCommand(`drop index concurrently idx_todo_events__todo_id;`);
            await this._db.executeCommand(sql);
        }
        catch (error)
        {
            console.log("Tables drop failed!!", error);
            throw error;
        }
    }
}