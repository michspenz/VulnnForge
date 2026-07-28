# VulnnForge




A modern, Dockerized web application security training platform for learning, exploiting, understanding, and fixing real-world vulnerabilities.

</p>

<p align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-22-339933)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

---

## About

VulnnForge is an open-source platform designed to help developers, students, and security professionals understand web application security through hands-on practice.

Instead of isolated examples, every challenge is built around a realistic vulnerable application that teaches:

- how the vulnerability works
- how attackers exploit it
- why it exists
- how to remediate it
- how to write secure code

---

## Features

- Dockerized vulnerable labs
- React frontend
- Express API
- PostgreSQL + Prisma
- Authentication
- Guided challenge writeups
- Secure remediation examples
- OWASP Top 10 coverage
- Modular challenge system

---

## Included Challenges

| Challenge | Category |
|-----------|----------|
| Reflected XSS | XSS |
| SQL Injection Login | SQL Injection |
| XXE Document Parser | XXE |
| SSRF Image Fetcher | SSRF |
| JWT alg:none | JWT |
| CSRF Email Change | CSRF |
| IDOR Profile Viewer | Access Control |
| Command Injection | RCE |
| Unrestricted File Upload | File Upload |
| Misconfigured CORS API | CORS |

---

## Quick Start

```bash
git clone https://github.com/michspenz/VulnnForge.git

cd VulnnForge

cp .env.example .env

docker compose up --build
```

Open:

```
http://localhost:5173
```



