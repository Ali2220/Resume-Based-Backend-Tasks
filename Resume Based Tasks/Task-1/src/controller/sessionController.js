const Session = require("../models/Session");

const joinSession = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.user;

    // ATOMIC OPERATION: Room tabhi milega agar wo active ho aur count < 10 ho
    const session = await Session.findOneAndUpdate(
      {
        roomId,
        status: "active",
        participantCount: { $lt: 10 },
        "participants.userId": { $ne: userId }, // Prevent duplicate join
      },
      {
        $push: { participants: { userId, role: "editor" } },
        $inc: { participantCount: 1 },
        $set: { lastActivity: new Date() },
      },
      { new: true },
    );

    if (!session) {
      return res.status(400).json({
        error: "Room full, session ended, or you already joined.",
      });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
