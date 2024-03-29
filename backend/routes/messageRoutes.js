const express = require("express");
const isAuthenticated = require("../middlewares/auth");
const { sendMessage, getSingleMessage } = require("../controllers/messageController");
const router = express.Router();


// Get Message
router.route("/:chatId").get(isAuthenticated,getSingleMessage)

// send message
router.route("/send").post(isAuthenticated,sendMessage);



module.exports = router;
