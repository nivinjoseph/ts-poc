import { WebApp } from "@nivinjoseph/n-web";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import { controllers } from "./controllers/controllers";
import { ComponentInstaller, Registry } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { InMemoryTodoRepository } from "../data/repositories/in-memory-todo-repository";
import { DefaultTodoFactory } from "../domain/factories/default-todo-factory";
import { ConsoleLogger } from "@nivinjoseph/n-log";
import { AppExceptionHandler } from "./exceptions/app-exception-handler";


class Installer implements ComponentInstaller
{
    public install(registry: Registry): void
    {
        given(registry, "registry").ensureHasValue().ensureIsObject();
        
        registry
            .registerSingleton("TodoRepository", InMemoryTodoRepository)
            .registerSingleton("TodoFactory", DefaultTodoFactory)
            .registerSingleton("Logger", ConsoleLogger);
    }
}


const server = new WebApp(ConfigurationManager.getConfig<number>("PORT"))
    .useInstaller(new Installer())
    .registerControllers(...controllers)
    .registerExceptionHandler(AppExceptionHandler);

server.bootstrap();