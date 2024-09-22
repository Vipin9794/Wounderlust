const express = require("express");
const router = express.Router();


//Posts
//Index
router.get("/ " , (req , res ) => {
    res.send("GET for posts");
});

//Show 
router.get(" /:id" , (req , res ) => {
    res.send("GET fo Show posts id");

});

// Post 
router.post("/" , (req , res ) => {
    res.send("POST for posts");
});


//DELETE 
router.delete("/:id" , (req , res ) => {
    res.send("DELETE for posts id");
});

module.exports = router;