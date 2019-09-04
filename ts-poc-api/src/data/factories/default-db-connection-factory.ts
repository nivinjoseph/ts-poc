import { DbConnectionFactory, KnexPgDbConnectionFactory, DbConnectionConfig } from "@nivinjoseph/n-data";
import { ConfigurationManager } from "@nivinjoseph/n-config";


export class DefaultDbConnectionFactory implements DbConnectionFactory
{
    private readonly _dbConnectionFactory: DbConnectionFactory;
    
    public constructor()
    {
        if (ConfigurationManager.getConfig<string>("env") === "dev")
        {
            const host = ConfigurationManager.getConfig<string>("db-host");
            const port = ConfigurationManager.getConfig<number>("db-port");
            const database = ConfigurationManager.getConfig<string>("db-database");
            const username = ConfigurationManager.getConfig<string>("db-username");
            const password = ConfigurationManager.getConfig<string>("db-password");

            const config: DbConnectionConfig = {
                host,
                port: port.toString(),
                database,
                username,
                password
            };

            this._dbConnectionFactory = new KnexPgDbConnectionFactory(config);
        }
        else
        {
            const connectionString = ConfigurationManager.getConfig<string>("DATABASE_URL");

            this._dbConnectionFactory = new KnexPgDbConnectionFactory(connectionString);
        }
    }


    public async create(): Promise<object>
    {
        return this._dbConnectionFactory.create();
    }


    public async dispose(): Promise<void>
    {
        return this._dbConnectionFactory.dispose();
    }
}