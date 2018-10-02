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
require("./list-todos-view.scss");
const n_ject_1 = require("@nivinjoseph/n-ject");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
let ListTodosViewModel = class ListTodosViewModel extends n_app_1.PageViewModel {
    constructor(todoService) {
        super();
        n_defensive_1.given(todoService, "todoService").ensureHasValue().ensureIsObject();
        this._todoService = todoService;
        this._todos = [];
    }
    get todos() { return this._todos; }
    onEnter() {
        this._todoService.getTodos()
            .then(t => this._todos = t)
            .catch(e => console.log(e));
    }
};
ListTodosViewModel = __decorate([
    n_app_1.template(require("./list-todos-view.html")),
    n_app_1.route(Routes.listTodos),
    n_ject_1.inject("TodoService"),
    __metadata("design:paramtypes", [Object])
], ListTodosViewModel);
exports.ListTodosViewModel = ListTodosViewModel;
//# sourceMappingURL=list-todos-view-model.js.map