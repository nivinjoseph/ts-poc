import { EdaConfig, InMemoryEventBus, InMemoryEventSubMgr } from "@nivinjoseph/n-eda";
import { TodoCreatedHandler } from "./event-handlers/todo-created-handler";
import { AppComponentInstaller } from "../api/app-component-installer";


const eventHandlers: ReadonlyArray<Function> = [
    TodoCreatedHandler
];


export const edaConfig: EdaConfig = {
    eventBus: InMemoryEventBus,
    eventSubMgr: InMemoryEventSubMgr,
    eventHandlerClasses: eventHandlers,
    iocInstaller: new AppComponentInstaller()
};