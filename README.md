## n8n Docker Setup

```bash
mkdir -p ~/n8n-data
sudo chown -R 1000:1000 ~/n8n-data
sudo docker run -d \
--name n8n \
-p 5678:5678 \
-v ~/n8n-data:/home/node/.n8n \
-e N8N_SECURE_COOKIE=false \
n8nio/n8n


Explanation:

sudo docker run -d → Run container in background

--name n8n → Name the container n8n

-p 5678:5678 → Map local port 5678 → container port 5678 (n8n UI)

-v ~/n8n-data:/home/node/.n8n → Mount local folder to container folder for persistent data

-e N8N_SECURE_COOKIE=false → Turn off secure cookies (development mode)

n8nio/n8n → Docker image name

Result: You can now access the n8n UI at:

http://localhost:5678
<img width="1919" height="968" alt="image" src="https://github.com/user-attachments/assets/31db40ce-3f06-4df6-a12d-00e027a8610c" />


2️⃣ Node.js Project Setup
sudo apt install nodejs npm -y


Installs Node.js and npm

mkdir ai-demo
cd ai-demo
npm init -y


Creates a project folder ai-demo

Run a new Ollama container
docker run -d \
--name demo_ollama_1 \
-p 11435:11434 \
ollama/ollama


Explanation:

-d → Run in background (detached mode)

--name demo_ollama_1 → Name your container

-p 11435:11434 → Map host port 11435 → container port 11434 (for browser access)

ollama/ollama → Docker image

Access in browser: http://localhost:11435 → should show “Ollama is running”

2️⃣ Start container (if stopped)
docker start demo_ollama_1

3️⃣ Stop container
docker stop demo_ollama_1

4️⃣ Restart container
docker restart demo_ollama_1

5️⃣ Check logs
docker logs -f demo_ollama_1


-f → follow logs live

Run new container: docker run -d --name demo_ollama_1 -p 11435:11434 ollama/ollama

Start / Stop / Restart: use docker start|stop|restart demo_ollama_1

View logs: docker logs -f demo_ollama_1

Initializes a Node.js project (creates package.json)

npm install express axios body-parser


Express → Web server framework

Axios → HTTP requests

Body-parser → Parses incoming request bodies

Meaning: This sets up a backend where you can create APIs and logic for your app.


jared@solution5410:~/ai-demo$ ll
total 56
drwxr-xr-x  3 jared jared  4096 Feb 11 09:24 ./
drwxr-x--- 13 jared jared  4096 Feb 12 05:47 ../
drwxr-xr-x 76 jared jared  4096 Feb 11 04:50 node_modules/
-rw-r--r--  1 jared jared 31887 Feb 11 09:19 package-lock.json
-rw-r--r--  1 jared jared   323 Feb 11 04:50 package.json
-rw-r--r--  1 root  root    766 Feb 11 09:24 server.js
-rw-r--r--  1 jared jared   606 Feb 11 07:37 server.jsesoo
jared@solution5410:~/ai-demo$ pwd
/home/jared/ai-demo
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


#open another terminal the dont close that terminal
jared@solution5410:~/ai-demo$ node server.js
AI Server running on port 3001              #keep it open 

sudo docker ps 
a032eeb63cb6   ollama/ollama   "/bin/ollama serve"      21 hours ago   Up 21 hours   0.0.0.0:11435->11434/tcp, [::]:11435->11434/tcp              demo_ollama_1
e6c44b3ead24   n8nio/n8n       "tini -- /docker-ent…"   26 hours ago   Up 21 hours   0.0.0.0:5678->5678/tcp, [::]:5678->5678/tcp                  n8n
#open browser use below link to visit n8n ui and  create new workflow
http://localhost:5678

<img width="1280" height="600" alt="image" src="https://github.com/user-attachments/assets/5fcb7f17-fc6e-4185-8840-69768e01793c" />

Manual Trigger
        ↓
HTTP Request → AI server → email

Sabse common problem:

❌ localhost please dont use 

Always use:

host.docker.internal
jared@solution5410:~$ ip addr show docker0
3: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 2e:0c:6c:31:44:ac brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::2c0c:6cff:fe31:44ac/64 scope link
       valid_lft forever preferred_lft forever
jared@solution5410:~$ ping -c 3 172.17.0.1
PING 172.17.0.1 (172.17.0.1) 56(84) bytes of data.
64 bytes from 172.17.0.1: icmp_seq=1 ttl=64 time=0.310 ms
64 bytes from 172.17.0.1: icmp_seq=2 ttl=64 time=0.043 ms
64 bytes from 172.17.0.1: icmp_seq=3 ttl=64 time=0.039 ms

--- 172.17.0.1 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2028ms
rtt min/avg/max/mdev = 0.039/0.130/0.310/0.126 ms
jared@solution5410:~$

#so my http url will be this http://172.17.0.1:3001/create-agent
n8n container → Docker gateway → host → server.js

HTTP AGENT PARAMETERS use below
Method
POST
URL
http://172.17.0.1:3001/create-agent
Authentication
None
Send Query Parameters

Send Headers

Send Body

Body Content Type
JSON
Specify Body
Using JSON
JSON
{
  "task": "AI software launch"
}

 
{   "task": "AI software launch" }
Options
No properties

#SEND MAIL PARAMETERS
Parameters
Settings
Credential to connect with
SMTP account
Operation
Send
From Email
rajaramees005@gmail.com  #if you set here another parent mail then you need to create new credentials for that mail that is app password
To Email
rajaramees001@gmail.com,readyairesources@gmail.com,rajaramees005@gmail.com  #here you can put multiple mails
Subject
Ready AI Resources — Engineering Intelligence. Scaling the Future.
Email Format
Text
Text
Welcome Ready AI Resources,

Engineering Intelligence. Scaling the Future.

Ready AI Resources delivers enterprise-grade artificial intelligence, custom software, and high-impact digital solutions for organizations that refuse to fall behind.

Trusted by founders, executives, and operators across technology, restoration, insurance, logistics, and emerging markets — we engineer intelligence directly into the core of your business.

Core Capabilities

AI Consulting
Strategic AI implementation designed to increase efficiency, reduce cost, and unlock new revenue.
• AI strategy & roadmap
• Workflow automation
• Predictive analytics
• Private AI systems

Software Development
Enterprise-grade systems built for scale, security, and longevity.
 
Welcome Ready AI Resources, Engineering Intelligence. Scaling the Future. Ready AI Resources delivers enterprise-grade artificial intelligence, custom software, and high-impact digital solutions for organizations that refuse to fall behind. Trusted by founders, executives, and operators across technology, restoration, insurance, logistics, and emerging markets — we engineer intelligence directly into the core of your business. Core Capabilities AI Consulting Strategic AI implementation designed to increase efficiency, reduce cost, and unlock new revenue. • AI strategy & roadmap • Workflow automation • Predictive analytics • Private AI systems Software Development Enterprise-grade systems built for scale, security, and longevity. • Custom platforms • SaaS products • Internal tools • System integrations App Development High-performance mobile and web applications designed for real-world use. • iOS / Android • Web applications • Field-use systems • Secure user portals Digital Architecture We design systems that don’t break when you grow. • Cloud infrastructure • Security-first design • Scalable backend systems • Future-proof architecture We Don’t Build Experiments — We Build Assets. • Enterprise mindset • Owner-level thinking • Security and compliance focused • Built for longevity, not trends Executive Feedback “Ready AI Resources operates at a level most firms only talk about — strategic, disciplined, and execution-driven.” “Jared didn’t just deliver technology — he helped architect an entire business with clarity and direction.” “This is not a development shop. This is a technology partner that builds real-world scalable systems.” Organizations working with Ready AI Resources gain more than tools — they gain engineered intelligence, operational leverage, and systems built to last. Ready to build something that scales? Schedule a confidential strategy session and explore what enterprise-grade AI and software architecture can unlock for your organization. Book a Strategy Call Best regards, Ready AI Resources Elite AI Consulting • Software Engineering • App Development • Digital Transformation © 2026 Ready AI Resources. All rights reserved.
Options
No properties



