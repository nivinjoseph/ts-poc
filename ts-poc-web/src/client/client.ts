import "@babel/polyfill";
import "material-design-icons/iconfont/material-icons.css";
import "./styles/main.scss";
import { ClientApp } from "@nivinjoseph/n-app";
import * as Routes from "./pages/routes";
import { components } from "./components/components";
import { pages } from "./pages/pages";
import { ComponentInstaller, Registry } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { RemoteTodoService } from "../sdk/services/todo-service/remote-todo-service";


class Installer implements ComponentInstaller
{
    public install(registry: Registry): void
    {
        given(registry, "registry").ensureHasValue().ensureIsObject();
        
        registry.registerSingleton("TodoService", RemoteTodoService);
    }
}


const client = new ClientApp("#app")
    .useInstaller(new Installer())
    .useAccentColor("#93C5FC")
    .registerComponents(...components)
    .registerPages(...pages)
    .useAsInitialRoute(Routes.listTodos)
    .useAsUnknownRoute(Routes.listTodos)
    .useHistoryModeRouting();

client.bootstrap();