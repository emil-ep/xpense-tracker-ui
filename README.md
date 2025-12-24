## Getting started (15-minute setup)

### Prerequisites

- Docker
- Docker Compose

### Run locally

```bash
git clone https://github.com/emil-ep/xpense-tracker-ui.git
cd xpense-tracker-ui
docker-compose up
```

If you want to clear the local volume and storage, simply run

`docker-compose down -v`

# 📖 Financial Diary

### A local-first expense tracker powered by bank statements

> **This is not a typical expense tracker.**  
> It’s a personal diary written in transactions — designed for people who don’t want their financial data living in someone else’s cloud.

---

## Why this exists

Most expense trackers work like this:

- Connect your bank account
- Grant read access
- Trust a third-party server with your financial history

This project takes a different approach.

**Your bank statement is the source of truth.**

- You download the statement from net banking
- Upload it to the app
- Everything runs locally
- No bank credentials
- No third-party APIs
- No SaaS lock-in

Security is a design decision here, not a promise.

---

## What it does

- 📄 **Parses bank statements** (downloaded from your bank)
- 🧠 **Automatically categorizes expenses**
- 🏷 **Smart tagging**
  - Tag a transaction once
  - Similar transactions are auto-tagged
- 📝 **Add notes & context** to any transaction
- 📎 **Attach documents**
  - Bills
  - Medical reports
  - Receipts
- 🔍 **Powerful search**
  - By transaction
  - By tag
  - By custom notes
- 💰 **Track salary, rent, insurance & recurring expenses**
- 🧾 **Makes tax calculation easier** by keeping everything structured

Over time, this becomes less of an expense list and more of a **financial timeline of your life**.

---

## Local-first & self-hosted

You can run the entire application **on-prem**.

- Single `docker-compose` command
- No internet dependency after setup
- No data transmitted to a SaaS server
- Your financial data stays with you

If you care about ownership, this matters.

---
