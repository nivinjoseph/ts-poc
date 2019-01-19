import { Db } from "@nivinjoseph/n-data";
import { given } from "@nivinjoseph/n-defensive";
import { DomainContext } from "@nivinjoseph/n-domain";
import { Logger, ConsoleLogger, LogDateTimeZone } from "@nivinjoseph/n-log";

// Database seeding is done here
export class DbData
{
    private readonly _db: Db;
    // @ts-ignore
    private readonly _domainContext: DomainContext;
    private readonly _logger: Logger;



    public constructor(db: Db)
    {
        given(db, "db").ensureHasValue().ensureIsObject();
        this._db = db;
        this._domainContext = { userId: "anonymous" };
        this._logger = new ConsoleLogger(LogDateTimeZone.est);
    }


    public async create(): Promise<void>
    {
        await this._logger.logInfo("No data to create.");
    }

    public async drop(): Promise<void>
    {
        const sql = `
            delete from todos;
            delete from event_stream;
        `;

        try 
        {
            await this._db.executeCommand(sql);
        }
        catch (error)
        {
            await this._logger.logWarning("Data drop failed!!");
            await this._logger.logError(error);
            throw error;
        }
    }
}