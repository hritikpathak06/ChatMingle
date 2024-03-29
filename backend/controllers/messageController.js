const Message = require("../models/messageSchema");
const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");
const Chat = require("../models/chatSchema");

// Send Message Controller
exports.sendMessage = asyncHandler(async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      return res.status(400).json({
        success: false,
        message: "Invalid Data",
      });
    }
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


// Get My Message with a specific Chat Controller
exports.getSingleMessage = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
