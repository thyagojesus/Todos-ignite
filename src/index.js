const express = require("express");
const cors = require("cors");

const { v4: uuidv4, stringify } = require("uuid");
const { request } = require("express");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsTodos(request, response, next) {
    const { id } = request.params;
    const { user } = request;
    const todos = user.todos;
    const todo = todos.find((todo) => todo.id === id);

    if (!todo) {
        console.log("ENTROU NO IF");
        return response.status(404).json({ error: "task does not exist " });
    }
    request.todo = todo;

    return next();
}

function checksExistsUserAccount(request, response, next) {
    // Complete aqui
    const { username } = request.headers;
    const user = users.find((user) => user.username === username);
    if (!user) {
        return response.status(400).send({ error: "User not found" });
    }
    request.user = user;

    return next();
}

app.post("/users", (request, response) => {
    // Complete aqui
    const { name, username } = request.body;

    const alreadyExists = users.some((user) => user.username === username);

    if (alreadyExists) {
        return response.status(400).send({ error: "user already exists" });
    }

    const user = {
        id: uuidv4(),
        name: name,
        username: username,
        todos: [],
    };

    users.push(user);

    return response.status(201).send(user);
});

app.get("/users", (request, response) => {
    const { username } = request.headers;

    const alreadyExists = users.some((user) => user.username === username);

    if (!alreadyExists) {
        return response.status(400).send({ error: "user already exists" });
    }

    const user = users.find((user) => user.username === username);

    return response.status(201).send(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
    // Complete aqui
    const { user } = request;
    return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
    // Complete aqui
    const { user } = request;
    const { title, deadline } = request.body;

    const todo = {
        created_at: new Date(),
        deadline: new Date(deadline),
        done: false,
        id: uuidv4(),
        title: title,
    };
    user.todos.push(todo);

    return response.status(201).json(todo);
});

app.put(
    "/todos/:id",
    checksExistsUserAccount,
    checksExistsTodos,
    (request, response) => {
        const { todo } = request;
        const { title, deadline } = request.body;

        todo.title = title;
        todo.deadline = new Date(deadline);

        return response.status(201).json(todo);
    }
);

app.patch(
    "/todos/:id/done",
    checksExistsUserAccount,
    checksExistsTodos,
    (request, response) => {
        const { todo } = request;
        todo.done = true;

        return response.status(201).json(todo);
    }
);

app.delete(
    "/todos/:id",
    checksExistsUserAccount,
    checksExistsTodos,
    (request, response) => {
        const { user, todo } = request;

        const index = user.todos.indexOf(todo);

        user.todos.splice(index, 1);

        return response.status(204).json({ message: "teste" });
    }
);

module.exports = app;