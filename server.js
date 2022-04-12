const express = require("express");
const bodyParser = require("body-parser");
const kenx = require("knex");
const db = kenx({
client: "pg",
connection: {
host: "localhost",
user: "postgres",
password: "Yashika@123",
database: "mydatabase",
port:4433
}
});
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
// res.render
app.get("/", (req, res) => {
    console.log("working");
db.select("*").from("task").then(data => {
res.render("index.ejs", { todos: data });
}).catch(err => res.status(200).json(err));
console.log("end");
});
// create new task
app.post("/addTask", (req, res) => {
const { textTodo } = req.body;
db("task").insert({ task: textTodo }).returning("*")
.then(todo => {res.redirect("/")}).catch(err => {
res.status(400).json({ message: "unable to create a new task" });
});
});
app.put("/moveTaskDone", (req, res) => {
const { name, id } = req.body;
if (name === "todo") {
db("task")
.where("id", "=", id).update("status", 1)
.returning("status").then(task => {res.json(task[0])})}
 else {
db("task").where("id", "=", id).update("status", 0)
.returning("status")
.then(task => {res.json(task[0])});
}
});
  const port= process.env.port|| 4433;
app.listen(port, () => console.log("app is running on port ${port}"));