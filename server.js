const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://admin:Ilia_155154@cluster0.r5axfz4.mongodb.net/clicker?appName=Cluster0");

const UserSchema = new mongoose.Schema({
  telegramId: String,
  score: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  multiplier: { type: Number, default: 1 }
});

const User = mongoose.model("User", UserSchema);

app.post("/click", async (req, res) => {
  const { telegramId } = req.body;

  let user = await User.findOne({ telegramId });

  if (!user) {
    user = new User({ telegramId });
  }

  user.score += user.multiplier;
  await user.save();

  res.json(user);
});

app.get("/leaderboard", async (req, res) => {
  const top = await User.find().sort({ score: -1 }).limit(10);
  res.json(top);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server started on port " + PORT));

