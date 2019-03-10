import { WebApp } from "@nivinjoseph/n-web";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import { controllers } from "./controllers/controllers";
import { AppExceptionHandler } from "./exceptions/app-exception-handler";
import { edaConfig } from "../eda/eda-config";
import { AppComponentInstaller } from "./app-component-installer";





const server = new WebApp(ConfigurationManager.getConfig<number>("PORT"))
    .useInstaller(new AppComponentInstaller())
    .registerControllers(...controllers)
    .enableEda(edaConfig)
    .registerExceptionHandler(AppExceptionHandler)
    .enableCors();

server.bootstrap();