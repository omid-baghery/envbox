# EnvBox

> Stop sharing .env files in Slack. Two commands, zero complexity.

[![Live](https://img.shields.io/badge/Live-envbox.omidbagheri.com-blue)](https://envbox.omidbagheri.com)
[![npm](https://img.shields.io/npm/v/envbox-cli?label=npm)](https://www.npmjs.com/package/envbox-cli)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

![home-page](https://envbox.omidbagheri.com/readme/1-home-page.png)

<br>

## 🔐 What is EnvBox?

EnvBox keeps your team's environment variables **encrypted, organized, and accessible** with a single command. No more copy-pasting `.env` files in Slack or Telegram.

| Instead of this                  | Do this                                |
| -------------------------------- | -------------------------------------- |
| "Hey, can you send me the .env?" | ✅ `npx envbox-cli pull dev`           |
| "Is this the latest version?"    | ✅ Always pulls from source            |
| "Who has production access?"     | ✅ Invite tokens with env restrictions |

<br>

## 📸 How It Works

<div align="center">
  <table>
    <tr>
      <td width="50%">
        <img src="https://envbox.omidbagheri.com/readme/2-verifyEmail.png" alt="Email Verification" />
      </td>
      <td width="50%">
        <h3>✉️ Sign Up & Verify Email</h3>
        <p>Create an account and verify your email address to get started securely.</p>
      </td>
    </tr>
    <tr>
      <td width="50%">
        <img src="https://envbox.omidbagheri.com/readme/3-dashboard.png" alt="Dashboard" />
      </td>
      <td width="50%">
        <h3>📊 Dashboard</h3>
        <p>Create projects, add environment variables, and manage everything from one place.</p>
      </td>
    </tr>
    <tr>
      <td width="50%">
        <img src="https://envbox.omidbagheri.com/readme/4-join-code.png" alt="Invite Members" />
      </td>
      <td width="50%">
        <h3>👥 Invite Members</h3>
        <p>Generate one-time tokens with environment restrictions. Share via Slack, email, or smoke signals.</p>
      </td>
    </tr>
    <tr>
      <td width="50%">
        <img src="https://envbox.omidbagheri.com/readme/5-join-command.png" alt="Join Command" />
      </td>
      <td width="50%">
        <h3>💻 One Command to Join</h3>
        <p>Your team runs a single command in their terminal. No install, no setup.</p>
      </td>
    </tr>
  </table>
</div>

<br>

## ⚡ How It Works (for your team)

When a team member joins, EnvBox creates a `.envboxrc` file containing their API key and server URL. This file is **automatically added to `.gitignore`** — no manual setup needed.

After joining, team members can pull variables for any environment they have permission to access:

```bash
npx envbox-cli pull dev
npx envbox-cli pull staging  
npx envbox-cli pull prod
```

Three environments available: `dev`, `staging`, and `prod`.

<br>

## 🔒 Security

| Feature                   | Implementation                             |
| ------------------------- | ------------------------------------------ |
| **Encryption at rest**    | AES-256-GCM — key never stored in database |
| **API keys**              | SHA-256 hashed — like passwords            |
| **Invite tokens**         | One-time use + expiration (1h, 6h, 24h)    |
| **Environment isolation** | Members only access approved environments  |
| **Revoke**                | Per-key or per-member, instant             |

<br>

## 🛠 Tech Stack

**Frontend:** Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, react-hook-form, Zod

**Backend:** Next.js API Routes, Better-Auth, Drizzle ORM, PostgreSQL (Neon)

**CLI:** Commander.js, published on npm

**Security:** AES-256-GCM, SHA-256, Resend (emails)

**Deployment:** Vercel (dashboard), Neon (database), npm (CLI)

<br>

## 📦 CLI

```bash
# Install globally
npm install -g envbox-cli

# Already have an API key? Use it on another machine:
npx envbox-cli init --key <your-api-key>

# Join a project (no install needed):
npx envbox-cli join <token>

# Pull variables:
npx envbox-cli pull dev
```

[![npm](https://img.shields.io/npm/v/envbox-cli?label=envbox-cli)](https://www.npmjs.com/package/envbox-cli)

<br>

## 🧪 Testing

17 unit tests with Vitest covering encryption, token hashing, and API key generation.

```bash
pnpm test
```

<br>

## 👤 Author

Built by **Omid Bagheri** — Full-stack developer from Iran. Learned React during internet blackouts. Building secure tools for teams.

- [LinkedIn](https://www.linkedin.com/in/omid-baghery/)
- [GitHub](https://github.com/omid-baghery)
- [Portfolio](https://b-square.vercel.app/team/omid)

<br>

## 📄 License

MIT © 2026 Omid Bagheri