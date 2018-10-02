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
Object.defineProperty(exports, "__esModule", { value: true });
const n_app_1 = require("@nivinjoseph/n-app");
require("./todo-view.scss");
const n_ject_1 = require("@nivinjoseph/n-ject");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const Routes = require("../../pages/routes");
let TodoViewModel = class TodoViewModel extends n_app_1.ComponentViewModel {
    constructor(todoService, navigationService) {
        super();
        n_defensive_1.given(todoService, "todoService").ensureHasValue().ensureIsObject();
        n_defensive_1.given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        this._todoService = todoService;
        this._navigationService = navigationService;
    }
    get todo() { return this.getBound("value"); }
    completeTodo() {
        this._todoService.markTodoAsCompleted(this.todo.id)
            .then(() => this.todo.isCompleted = true)
            .catch(e => console.log(e));
    }
    editTodo() {
        this._navigationService.navigate(Routes.manageTodo, { id: this.todo.id });
    }
    deleteTodo() {
        this._todoService.deleteTodo(this.todo.id)
            .then(() => this.todo.isDeleted = true)
            .catch(e => console.log(e));
    }
};
TodoViewModel = __decorate([
    n_app_1.template(require("./todo-view.html")),
    n_app_1.element("todo"),
    n_app_1.bind("value"),
    n_ject_1.inject("TodoService", "NavigationService"),
    __metadata("design:paramtypes", [Object, Object])
], TodoViewModel);
exports.TodoViewModel = TodoViewModel;
//# sourceMappingURL=todo-view-model.js.map