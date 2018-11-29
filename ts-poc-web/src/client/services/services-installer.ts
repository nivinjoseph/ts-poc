import { ComponentInstaller, Registry } from "@nivinjoseph/n-ject";
// import { LocalTodoService } from "./todo/local-todo-service";
import { RemoteTodoService } from "./todo/remote-todo-service";


export class ServicesInstaller implements ComponentInstaller
{
    public install(registry: Registry): void
    {
        // registry.registerSingleton("TodoService", LocalTodoService);
        registry.registerSingleton("TodoService", RemoteTodoService);
    }
}