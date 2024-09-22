const express = require("express");
const app = express();
const posts = require("./routes/Post.js");
const users = require("./routes/User.js");
const session = require("express-session");
const flash = require("connect-flash");
const { name } = require("ejs");
const path = require("path");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
  };


app.use( session(sessionOptions));
app.use(flash());

app.get("/register" , (req , res ) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    req.flash("success" , "user registered successfully !");
    
    res.redirect("/hello");
}) ;

app.get("/hello" , (req , res  ) => {
    res.locals.messages =  req.flash("success");
    res.render("page.ejs" , {name : req.session.name });
});

// app.get("/recount", (req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//   res.send(`You send a request ${req.session.count} times`);
// });

// app.get("/test" , (req, res ) => {
//     res.send("test successful");
// });

app.listen(8000, () => {
  console.log("Server is listening to 8000");
});
