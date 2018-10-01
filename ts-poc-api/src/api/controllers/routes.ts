const queryPrefix = "/api/query/";

export const query = {
    getAllTodos: queryPrefix + "getAllTodos",
    getTodo: queryPrefix + "getTodo/{id: string}"
};


const commandPrefix = "/api/command/";

export const command = {
    createTodo: commandPrefix + "createTodo",
    updateTodo: commandPrefix + "updateTodo",
    markTodoAsCompleted: commandPrefix + "markTodoAsCompleted",
    deleteTodo: commandPrefix + "deleteTodo"
};