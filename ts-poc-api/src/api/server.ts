import { WebApp } from "@nivinjoseph/n-web";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import { controllers } from "./controllers/controllers";
import { AppExceptionHandler } from "./exceptions/app-exception-handler";
import { edaConfig } from "../eda/eda-config";
import { AppComponentInstaller } from "./app-component-installer";
import { EdaManager } from "@nivinjoseph/n-eda";



const edaManager = new EdaManager(edaConfig);
edaManager.bootstrap();

const server = new WebApp(Number.parseInt(ConfigurationManager.getConfig<number>("PORT") as any)); 
server
    .useInstaller(new AppComponentInstaller())
    .registerControllers(...controllers)
    .registerExceptionHandler(AppExceptionHandler)
    .enableCors()
    .registerDisposeAction(() => edaManager.dispose())
    .containerRegistry.registerInstance(EdaManager.eventBusKey, edaManager.serviceLocator.resolve(EdaManager.eventBusKey));

server.bootstrap();