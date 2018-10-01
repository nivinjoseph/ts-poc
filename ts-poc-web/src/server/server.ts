import { WebApp } from "@nivinjoseph/n-web";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import { IndexController } from "./controllers/index/index-controller";


const server = new WebApp(ConfigurationManager.getConfig<number>("PORT"))
    .enableWebPackDevMiddleware()
    .registerStaticFilePath("client/dist", true)
    .registerControllers(IndexController);

server.bootstrap();