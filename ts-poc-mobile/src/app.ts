import "@babel/polyfill";
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";
// import "./styles/main.scss";
import { ClientApp, Vue } from "@nivinjoseph/n-app";
// @ts-ignore
import * as VueOnsen from "vue-onsenui";
import * as Routes from "./pages/routes";
import { ServicesInstaller } from "./services/services-installer";
import { components } from "./components/components";
import { pages } from "./pages/pages";


Vue.use(VueOnsen);

const client = new ClientApp("#app")
    .useInstaller(new ServicesInstaller())
    .useAccentColor("#93C5FC")
    .registerComponents(...components)
    .registerPages(...pages)
    .useAsInitialRoute(Routes.listTodos)
    .useAsUnknownRoute(Routes.listTodos)
    .useHistoryModeRouting();

client.bootstrap();