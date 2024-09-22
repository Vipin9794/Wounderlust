
const express = require("express");
const router = express.Router();
//Index- Users
router.get("/ " , (req , res ) => {
    res.send("GET for users");
});

//Show - Users
router.get(" /:id" , (req , res ) => {
    res.send("GET fo Show users");

});

// Post - users
router.post("/" , (req , res ) => {
    res.send("POST for users");
});


//DELETE - users
router.delete("/:id" , (req , res ) => {
    res.send("DELETE for users");
});

module.exports = router;