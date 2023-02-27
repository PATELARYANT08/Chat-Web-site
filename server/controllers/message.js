const Message = require("../model/message");

exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: "message added successfully." });
    return res.json({ msg: "Message Failed" });
  } catch (error) {
    next(error);
  }
};

exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Message.find({ users: { $all: [from, to] } }).sort({
      updatedAt: 1,
    });
    const projectmessage = messages.map((msg)=>{
        return {
            fromSelf:msg.sender.toString() === from,
            message: msg.message.text,
        }
    })
    res.json(projectmessage)
  } catch (error) {
    next(error);
  }
};
