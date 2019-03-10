import { DbConnectionFactory, KnexPgDbConnectionFactory } from "@nivinjoseph/n-data";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import { ObjectDisposedException } from "@nivinjoseph/n-exception";


export class DefaultDbConnectionFactory implements DbConnectionFactory
{
    private _isDisposed = false;
    private _dbConnectionFactory: DbConnectionFactory | null = null;


    public async create(): Promise<object>
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        
        if (!this._dbConnectionFactory)
        {
            let dbConfig = ConfigurationManager.getConfig<DbConfig>("dbConfig");
            this._dbConnectionFactory = new KnexPgDbConnectionFactory(dbConfig.host, dbConfig.port.toString(),
                dbConfig.database, dbConfig.username, dbConfig.password);
        }

        return await this._dbConnectionFactory.create();
    }


    public async dispose(): Promise<void>
    {
        if (this._isDisposed)
            return;
        
        this._isDisposed = true;
        
        if (this._dbConnectionFactory)
        {
            let dbConnectionFactory = this._dbConnectionFactory;
            this._dbConnectionFactory = null;
            await dbConnectionFactory.dispose();
        }
    }
}


interface DbConfig
{
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}