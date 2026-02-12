# 🌐 Ready AI Resources — N8N AI Email Workflow

This project demonstrates how to set up **n8n** with **Docker** and **Node.js backend** to automate sending professional AI-generated emails.  
Follow the steps below carefully — sequence matters to avoid confusion.

---

## 🐳 1️⃣ N8N Docker Setup

```bash
mkdir -p ~/n8n-data
sudo chown -R 1000:1000 ~/n8n-data
mkdir -p ~/n8n-data → Creates a folder n8n-data in your home directory to store workflows, credentials, etc.

sudo chown -R 1000:1000 ~/n8n-data → Changes folder owner so the n8n container can read/write.

sudo docker run -d \
--name n8n \
-p 5678:5678 \
-v ~/n8n-data:/home/node/.n8n \
-e N8N_SECURE_COOKIE=false \
n8nio/n8n
Explanation:

sudo docker run -d → Run container in background

--name n8n → Container name

-p 5678:5678 → Access n8n UI on host port 5678

-v ~/n8n-data:/home/node/.n8n → Persist data

-e N8N_SECURE_COOKIE=false → Development mode

n8nio/n8n → Docker image

Access n8n UI: http://localhost:5678

💻 2️⃣ Node.js Project Setup
sudo apt install nodejs npm -y
mkdir ai-demo
cd ai-demo
npm init -y
Installs Node.js + npm

Creates project folder ai-demo

📦 Install Dependencies
npm install express axios body-parser
Express → Web server framework

Axios → HTTP requests

Body-parser → Parses incoming request bodies

🐳 3️⃣ Ollama Container Setup
docker run -d \
--name demo_ollama_1 \
-p 11435:11434 \
ollama/ollama
-d → Run in background

--name demo_ollama_1 → Container name

-p 11435:11434 → Host port → Container port

ollama/ollama → Docker image

Access in browser: http://localhost:11435 → Should show “Ollama is running”

⏯ Start / Stop / Restart / Logs
docker start demo_ollama_1
docker stop demo_ollama_1
docker restart demo_ollama_1
docker logs -f demo_ollama_1
🚀 4️⃣ Node.js Backend API
Create server.js:

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/create-agent", async (req, res) => {
  try {
    const userTask = req.body.task;

    if (!userTask) return res.status(400).json({ error: "task is required" });

    const response = await axios.post("http://host.docker.internal:11435/api/generate", {
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

app.listen(3001, () => console.log("AI Server running on port 3001"));
Note:

Keep this terminal open → node server.js

Use host.docker.internal inside Docker to reach your host from n8n

Check URL: http://host.docker.internal:3001/create-agent

⚙ 5️⃣ N8N Workflow
Workflow Steps:

Manual Trigger → Start workflow

HTTP Request Node → Call AI backend

HTTP Request Node Settings:

Method: POST

URL: http://host.docker.internal:3001/create-agent

Body Content Type: JSON

Body:

{
  "task": "AI software launch"
}
📧 Send Email Node
Parameters:

Credential: SMTP account

Operation: Send

From Email: rajaramees005@gmail.com

To Emails: rajaramees001@gmail.com,readyairesources@gmail.com,rajaramees005@gmail.com

Subject: Ready AI Resources — Engineering Intelligence. Scaling the Future.

Email Format: Text

Email Body Example:

Welcome Ready AI Resources,

Engineering Intelligence. Scaling the Future.

Ready AI Resources delivers enterprise-grade artificial intelligence, custom software, and high-impact digital solutions for organizations that refuse to fall behind.

Core Capabilities:

AI Consulting
• AI strategy & roadmap
• Workflow automation
• Predictive analytics
• Private AI systems

Software Development
• Custom platforms
• SaaS products
• Internal tools
• System integrations

App Development
• iOS / Android
• Web applications
• Field-use systems
• Secure user portals

Digital Architecture
• Cloud infrastructure
• Security-first design
• Scalable backend systems
• Future-proof architecture

We Don’t Build Experiments — We Build Assets.

Executive Feedback
“Ready AI Resources operates at a level most firms only talk about — strategic, disciplined, and execution-driven.”

Schedule a confidential strategy session and explore what enterprise-grade AI and software architecture can unlock for your organization.

Book a Strategy Call

Best regards,
Ready AI Resources
Elite AI Consulting • Software Engineering • App Development • Digital Transformation
© 2026 Ready AI Resources. All rights reserved.
⚠ Common Problems
❌ localhost issue: Do not use localhost in n8n HTTP Request Node
✅ Use host.docker.internal or Docker Gateway IP

Check Docker Gateway IP:

ip addr show docker0
Test ping:

ping -c 3 172.17.0.1
🎯 Result
Workflow triggers AI → generates email → sends automatically via SMTP

Works worldwide with fixed greeting and dynamic recipients

📌 Keep terminals open:

node server.js → AI backend

Docker n8n UI → workflow execution

Ollama container → AI model server

