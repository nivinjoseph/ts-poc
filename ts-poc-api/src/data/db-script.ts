import { KnexPgDb } from "@nivinjoseph/n-data";
import { DefaultDbConnectionFactory } from "./factories/default-db-connection-factory";


const db = new KnexPgDb(new DefaultDbConnectionFactory());

const sql = `
    create table todos
    (
        id varchar (48) primary key,
        version int not null,
        created_at bigint not null,
        updated_at bigint not null,
        data jsonb not null
    );
`;

db.executeCommand(sql)
    .then(() =>
    {
        console.log("DB created!!");
        process.exit(0);
    })
    .catch((e) =>
    {
        console.log("DB creation failed!!", e);
        process.exit(1);
    });