"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@babel/polyfill");
require("onsenui/css/onsenui.css");
require("onsenui/css/onsen-css-components.css");
const n_app_1 = require("@nivinjoseph/n-app");
const VueOnsen = require("vue-onsenui");
const Routes = require("./pages/routes");
const services_installer_1 = require("./services/services-installer");
const components_1 = require("./components/components");
const pages_1 = require("./pages/pages");
n_app_1.Vue.use(VueOnsen);
const client = new n_app_1.ClientApp("#app")
    .useInstaller(new services_installer_1.ServicesInstaller())
    .useAccentColor("#93C5FC")
    .registerComponents(...components_1.components)
    .registerPages(...pages_1.pages)
    .useAsInitialRoute(Routes.listTodos)
    .useAsUnknownRoute(Routes.listTodos)
    .useHistoryModeRouting();
client.bootstrap();
//# sourceMappingURL=app.js.map