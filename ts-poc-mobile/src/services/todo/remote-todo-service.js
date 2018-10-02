"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const n_config_1 = require("@nivinjoseph/n-config");
const Axios = require("axios");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
require("@nivinjoseph/n-ext");
const n_ject_1 = require("@nivinjoseph/n-ject");
let RemoteTodoService = class RemoteTodoService {
    constructor(dialogService) {
        n_defensive_1.given(dialogService, "dialogService").ensureHasValue().ensureIsObject();
        this._dialogService = dialogService;
        let apiUrl = n_config_1.ConfigurationManager.getConfig("apiUrl").trim();
        if (!apiUrl.endsWith("/"))
            apiUrl += "/";
        this._api = Axios.default.create({
            timeout: 60000,
            baseURL: apiUrl
        });
    }
    getTodos() {
        return __awaiter(this, void 0, void 0, function* () {
            this._dialogService.showLoadingScreen();
            try {
                const response = yield this._api.get("api/query/getAllTodos");
                return response.data.map(t => {
                    t.isDeleted = false;
                    return t;
                });
            }
            catch (error) {
                this.showErrorMessage(error.response.status);
                throw error;
            }
            finally {
                this._dialogService.hideLoadingScreen();
            }
        });
    }
    getTodo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            n_defensive_1.given(id, "id").ensureHasValue().ensureIsString();
            this._dialogService.showLoadingScreen();
            try {
                const response = yield this._api.get(`api/query/getTodo/${id.trim().toLowerCase()}`);
                const todo = response.data;
                todo.isDeleted = false;
                return todo;
            }
            catch (error) {
                this.showErrorMessage(error.response.status);
                throw error;
            }
            finally {
                this._dialogService.hideLoadingScreen();
            }
        });
    }
    createTodo(title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            n_defensive_1.given(title, "title").ensureHasValue().ensureIsString();
            n_defensive_1.given(description, "description").ensureIsString();
            const command = {
                title: title.trim(),
                description: description ? description.trim() : ""
            };
            this._dialogService.showLoadingScreen();
            try {
                const response = yield this._api.post("api/command/createTodo", command);
                this._dialogService.showSuccessMessage("Successfully created Todo.");
                const todo = response.data;
                todo.isDeleted = false;
                return todo;
            }
            catch (error) {
                this.showErrorMessage(error.response.status);
                throw error;
            }
            finally {
                this._dialogService.hideLoadingScreen();
            }
        });
    }
    updateTodo(id, title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            n_defensive_1.given(id, "id").ensureHasValue().ensureIsString();
            n_defensive_1.given(title, "title").ensureHasValue().ensureIsString();
            n_defensive_1.given(description, "description").ensureIsString();
            const command = {
                id: id.trim().toLowerCase(),
                title: title.trim(),
                description: description ? description.trim() : ""
            };
            this._dialogService.showLoadingScreen();
            try {
                const response = yield this._api.post("api/command/updateTodo", command);
                this._dialogService.showSuccessMessage("Successfully updated Todo.");
            }
            catch (error) {
                this.showErrorMessage(error.response.status);
                throw error;
            }
            finally {
                this._dialogService.hideLoadingScreen();
            }
        });
    }
    markTodoAsCompleted(id) {
        return __awaiter(this, void 0, void 0, function* () {
            n_defensive_1.given(id, "id").ensureHasValue().ensureIsString();
            const command = {
                id: id.trim().toLowerCase()
            };
            this._dialogService.showLoadingScreen();
            try {
                const response = yield this._api.post("api/command/markTodoAsCompleted", command);
                this._dialogService.showSuccessMessage("Successfully marked Todo as complete.");
            }
            catch (error) {
                this.showErrorMessage(error.response.status);
                throw error;
            }
            finally {
                this._dialogService.hideLoadingScreen();
            }
        });
    }
    deleteTodo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            n_defensive_1.given(id, "id").ensureHasValue().ensureIsString();
            const command = {
                id: id.trim().toLowerCase()
            };
            this._dialogService.showLoadingScreen();
            try {
                const response = yield this._api.post("api/command/deleteTodo", command);
                this._dialogService.showSuccessMessage("Successfully deleted Todo.");
            }
            catch (error) {
                this.showErrorMessage(error.response.status);
                throw error;
            }
            finally {
                this._dialogService.hideLoadingScreen();
            }
        });
    }
    showErrorMessage(status) {
        this._dialogService.showErrorMessage(`There was an error while processing your request. Code ${status}.`);
    }
};
RemoteTodoService = __decorate([
    n_ject_1.inject("DialogService"),
    __metadata("design:paramtypes", [Object])
], RemoteTodoService);
exports.RemoteTodoService = RemoteTodoService;
//# sourceMappingURL=remote-todo-service.js.map