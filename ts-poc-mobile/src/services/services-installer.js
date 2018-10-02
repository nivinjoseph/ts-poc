"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const remote_todo_service_1 = require("./todo/remote-todo-service");
class ServicesInstaller {
    install(registry) {
        registry.registerSingleton("TodoService", remote_todo_service_1.RemoteTodoService);
    }
}
exports.ServicesInstaller = ServicesInstaller;
//# sourceMappingURL=services-installer.js.map