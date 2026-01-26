const express = require("express");
const { sendEvent } = require("./kafka");

const app = express();
app.use(express.json());

app.post("/login", async (req, res) => {
  const event = {
    user_id: Math.floor(Math.random() * 1000),
    event_type: "login",
    timestamp: new Date().toISOString(),
    latency: Math.floor(Math.random() * 200),
  };

  await sendEvent(event);
  res.json({ status: "event sent", event });
});

app.listen(3001, () => {
  console.log("Event Producer running on port 3001");
});
