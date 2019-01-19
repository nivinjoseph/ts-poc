import { DbTables } from "./db-tables";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import { KnexPgDb } from "@nivinjoseph/n-data";
import { DefaultDbConnectionFactory } from "./factories/default-db-connection-factory";
import { DbData } from "./db-data";
import { ApplicationException } from "@nivinjoseph/n-exception";


async function dbScript(): Promise<void>
{
    const mode = ConfigurationManager.getConfig<string>("dbScriptMode");
    const dbConnectionFactory = new DefaultDbConnectionFactory();
    const db = new KnexPgDb(dbConnectionFactory);
    const dbTables = new DbTables(db);
    const dbData = new DbData(db);

    try 
    {
        let promise: Promise<void> = null as any;

        switch (mode)
        {
            case "createTable":
                promise = dbTables.create();
                break;
            case "dropTable":
                promise = dbTables.drop();
                break;
            case "createData":
                promise = dbData.create();
                break;
            case "dropData":
                promise = dbData.drop();
                break;
            default:
                throw new ApplicationException(`Unrecognized mode flag '${mode}'.`);
        }

        await promise;
    }
    catch (error)
    {
        console.log(error);
        throw error;
    }
    finally
    {
        await dbConnectionFactory.dispose();
    }
}


dbScript()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));

