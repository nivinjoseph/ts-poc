"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n_defensive_1 = require("@nivinjoseph/n-defensive");
class LocalTodoService {
    constructor() {
        const todos = new Array();
        const count = 10;
        for (let i = 0; i < count; i++) {
            todos.push({
                id: "id" + i,
                title: "title" + i,
                description: "description" + i,
                isCompleted: false,
                isDeleted: false
            });
        }
        this._todos = todos;
        this._counter = count;
    }
    getTodos() {
        return Promise.resolve(this._todos);
    }
    getTodo(id) {
        n_defensive_1.given(id, "id").ensureHasValue().ensureIsString();
        return Promise.resolve(this._todos.find(t => t.id === id));
    }
    createTodo(title, description) {
        n_defensive_1.given(title, "title").ensureHasValue().ensureIsString();
        n_defensive_1.given(description, "description").ensureIsString();
        const todo = {
            id: "id" + this._counter,
            title: title,
            description: description,
            isCompleted: false,
            isDeleted: false
        };
        this._todos.push(todo);
        return Promise.resolve(todo);
    }
    updateTodo(id, title, description) {
        n_defensive_1.given(id, "id").ensureHasValue().ensureIsString();
        n_defensive_1.given(title, "title").ensureHasValue().ensureIsString();
        n_defensive_1.given(description, "description").ensureIsString();
        const todo = this._todos.find(t => t.id === id);
        todo.title = title;
        todo.description = description;
        return Promise.resolve();
    }
    markTodoAsCompleted(id) {
        n_defensive_1.given(id, "id").ensureHasValue().ensureIsString();
        const todo = this._todos.find(t => t.id === id);
        todo.isCompleted = true;
        return Promise.resolve();
    }
    deleteTodo(id) {
        n_defensive_1.given(id, "id").ensureHasValue().ensureIsString();
        const todo = this._todos.find(t => t.id === id);
        todo.isDeleted = true;
        return Promise.resolve();
    }
}
exports.LocalTodoService = LocalTodoService;
//# sourceMappingURL=local-todo-service.js.map