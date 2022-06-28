const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');
//models
const TodoTask = require("./models/TodoTask");
const url = '/';
dotenv.config();
const path = require('path');
// const PORT = process.env.PORT || 5000;

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));
// Urlencoded will allow us to extract the data from the form by 
// adding to the body property of the request.


    // connection to Mongodb
    
   
    mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");

    // app.listen(PORT, () => console.log("Server Up and running"));
    });

    app.listen(process.env.PORT || 5000, function(){
        console.log("Express server listening on port %d in %s mode");
      });



// view engine configuration
app.set("view engine", "ejs");

//GET METHOD
// app.get('/', (req, res) => {
//     res.render('todo.ejs');
// });


// GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => 
    {
    res.render("todo.ejs", { todoTasks: tasks });
 });
});
    

// POST METHOD
// app.post('/',(req, res) => {
//     console.log(req.body);
//     });
    

//POST METHOD
app.post('/',async (req, res) => {
    const todoTask = new TodoTask
    ({
    content: req.body.content
});
    try {
    await todoTask.save();
    res.redirect("/");
} catch (err) {
    res.redirect("/");
}
});
    
// UPDATE
//UPDATE
app
.route("/edit/:id")
.get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
});
})
.post((req, res) => {
const id = req.params.id;

TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/");
});
});

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    
TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
});
});





