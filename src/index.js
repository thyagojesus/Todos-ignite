const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

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
        id: new uuidv4(),
        name: name,
        username: username,
        todos: [],
    };

    users.push(user);

    return response.status(201).send({ message: "user created successfully!" });
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
        id: uuidv4(),
        title: title,
        done: false,
        deadline: new Date(deadline),
        created_at: new Date(),
    };
    user.todos.push(todo);

    return response.status(201).json({ message: "task created successfully" });
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
    // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
    // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
    // Complete aqui
});

module.exports = app;