import { ComponentInstaller, Registry } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { DomainContext } from "@nivinjoseph/n-domain";
import { ConsoleLogger } from "@nivinjoseph/n-log";
import { DefaultDbConnectionFactory } from "../data/factories/default-db-connection-factory";
import { KnexPgDb, KnexPgUnitOfWork } from "@nivinjoseph/n-data";
import { SnapshotTodoRepository } from "../data/repositories/snapshot-todo-repository";
import { DefaultTodoFactory } from "../domain/todo/factories/default-todo-factory";


export class AppComponentInstaller implements ComponentInstaller
{
    public install(registry: Registry): void
    {
        given(registry, "registry").ensureHasValue().ensureIsObject();

        const domainContext: DomainContext = {
            userId: "system"
        };

        registry
            .registerInstance("DomainContext", domainContext)
            .registerSingleton("Logger", ConsoleLogger)

            .registerSingleton("DbConnectionFactory", DefaultDbConnectionFactory)
            .registerSingleton("Db", KnexPgDb)
            .registerScoped("UnitOfWork", KnexPgUnitOfWork)

            // .registerSingleton("TodoRepository", InMemoryTodoRepository)
            // .registerScoped("TodoRepository", DbTodoRepository)
            // .registerScoped("TodoRepository", EventStreamTodoRepository)
            .registerScoped("TodoRepository", SnapshotTodoRepository)
            .registerScoped("TodoFactory", DefaultTodoFactory)
            ;
    }
}