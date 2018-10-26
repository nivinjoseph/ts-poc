import { DbConnectionFactory, KnexPgDbConnectionFactory } from "@nivinjoseph/n-data";
import { ConfigurationManager } from "@nivinjoseph/n-config";


export class DefaultDbConnectionFactory implements DbConnectionFactory
{
    private _dbConnectionFactory: DbConnectionFactory;


    public async create(): Promise<object>
    {
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