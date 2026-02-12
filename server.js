jared@solution5410:~/ai-demo$ cat server.js
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/create-agent", async (req, res) => {
  try {
    const userTask = req.body.task;

    if (!userTask) {
      return res.status(400).json({ error: "task is required" });
    }

    const response = await axios.post("http://localhost:11435/api/generate", {
      model: "llama3.2:3b",
      prompt: `Write a professional marketing email for: ${userTask}`,
      stream: false
    });

    res.json({ email: response.data.response });

  } catch (error) {
    console.error("AI ERROR:", error.message);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(3001, () => {
  console.log("AI Server running on port 3001");
});
jared@solution5410:~/ai-demo$
