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
const Routes = require("../routes");
require("./manage-todo-view.scss");
const n_ject_1 = require("@nivinjoseph/n-ject");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
let ManageTodoViewModel = class ManageTodoViewModel extends n_app_1.PageViewModel {
    constructor(todoService, navigationService) {
        super();
        n_defensive_1.given(todoService, "todoService").ensureHasValue().ensureIsObject();
        n_defensive_1.given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        this._todoService = todoService;
        this._navigationService = navigationService;
        this._operation = "";
        this._id = null;
        this._title = "";
        this._description = "";
    }
    get operation() { return this._operation; }
    get title() { return this._title; }
    set title(value) { this._title = value; }
    get description() { return this._description; }
    set description(value) { this._description = value; }
    save() {
        const savePromise = this._id
            ? this._todoService.updateTodo(this._id, this._title, this._description)
            : this._todoService.createTodo(this._title, this._description);
        savePromise
            .then(() => this._navigationService.navigate(Routes.listTodos, {}))
            .catch(e => console.log(e));
    }
    onEnter(id) {
        if (id && !id.isEmptyOrWhiteSpace()) {
            this._operation = "Update";
            this._todoService.getTodo(id)
                .then(t => {
                this._id = t.id;
                this._title = t.title;
                this._description = t.description;
            })
                .catch(e => console.log(e));
        }
        else {
            this._operation = "Add";
        }
    }
};
ManageTodoViewModel = __decorate([
    n_app_1.template(require("./manage-todo-view.html")),
    n_app_1.route(Routes.manageTodo),
    n_ject_1.inject("TodoService", "NavigationService"),
    __metadata("design:paramtypes", [Object, Object])
], ManageTodoViewModel);
exports.ManageTodoViewModel = ManageTodoViewModel;
//# sourceMappingURL=manage-todo-view-model.js.map