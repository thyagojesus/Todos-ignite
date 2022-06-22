const express = require("express");
const cors = require("cors");

const { v4: uuidv4, stringify } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// function checksExistsTodos(request, response, next) {
//     const um = true;
//     if (!um) {
//         return response.status(404).send("error");
//     }
//     checksExistsUserAccount();
//     const { user } = request;
//     const { id } = request.params;
//     const todo = user.todos.find((todo) => todo.id === id);

//     if (!todo) {
//         return response.status(404).json({ error: "task does not exist " });
//     }

//     return next();
// }

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

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
    // Complete aqui
    const { user } = request;
    const { id } = request.params;
    const { title, deadline } = request.body;

    const todo = user.todos.find((todo) => todo.id === id);
    if (!todo) {
        return response.status(404).json({ error: "task does not exist " });
    }
    todo.title = title;
    todo.deadline = new Date(deadline);

    return response.status(201).json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
    // Complete aqui
    const { user } = request;
    const { id } = request.params;
    const todo = user.todos.find((todo) => todo.id === id);

    if (!todo) {
        return response.status(404).json({ error: "task does not exist " });
    }

    todo.done = true;

    return response.status(201).json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
    const { user } = request;
    const { id } = request.params;
    const todo = user.todos.find((todo) => todo.id === id);
    const index = user.todos.indexOf(todo);

    if (!todo) {
        return response.status(404).json({ error: "task does not exist " });
    }

    user.todos.splice(index, 1);

    return response.status(204).json({ message: "teste" });
});

module.exports = app;