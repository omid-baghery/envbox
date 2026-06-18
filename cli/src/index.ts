#!/usr/bin/env node
import { Command } from "commander";
import { writeFileSync, existsSync, readFileSync, appendFileSync } from "fs";
import { resolve } from "path";

const program = new Command();
const CONFIG_FILE = ".envboxrc";
const VALID_ENVS = ["dev", "staging", "prod"] as const;

function addToGitignore() {
  const gitignorePath = resolve(process.cwd(), ".gitignore");
  const entry = CONFIG_FILE; // ".envboxrc"

  if (!existsSync(gitignorePath)) {
    // .gitignore وجود نداره — بسازش
    writeFileSync(gitignorePath, `${entry}\n`);
    console.log("📝 Created .gitignore and added .envboxrc");
    return;
  }

  const content = readFileSync(gitignorePath, "utf-8");
  const lines = content.split("\n");

  if (lines.some((line) => line.trim() === entry)) {
    // از قبل هست — هیچی نکن
    return;
  }

  // اضافه کن
  appendFileSync(gitignorePath, `\n${entry}\n`);
  console.log("📝 Added .envboxrc to .gitignore");
}

// ═══════════════════════════════════════════
// ذخیره و خوندن تنظیمات
// ═══════════════════════════════════════════
function saveConfig(data: { apiKey: string; url: string }) {
  const configPath = resolve(process.cwd(), CONFIG_FILE);
  writeFileSync(configPath, JSON.stringify(data, null, 2));
}

function loadConfig(): { apiKey: string; url: string } | null {
  const configPath = resolve(process.cwd(), CONFIG_FILE);
  if (!existsSync(configPath)) return null;
  return JSON.parse(readFileSync(configPath, "utf-8"));
}

function validateEnv(env: string) {
  if (!VALID_ENVS.includes(env as (typeof VALID_ENVS)[number])) {
    console.error(
      `❌ Invalid environment "${env}". Must be one of: ${VALID_ENVS.join(", ")}`,
    );
    process.exit(1);
  }
}

// ═══════════════════════════════════════════
// منطق Pull (یه تابع مشترک)
// ═══════════════════════════════════════════
async function doPull(env: string, key: string, url: string) {
  console.log(`📦 Pulling variables for "${env}"...`);

  const response = await fetch(`${url}/api/v1/pull?env=${env}`, {
    headers: { Authorization: `Bearer ${key}` },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(`❌ Error: ${error.error || "Unknown error"}`);
    process.exit(1);
  }

  const variables = await response.json();
  const count = Object.keys(variables).length;

  if (count === 0) {
    console.log("⚠️  No variables found for this environment.");
    return;
  }

  const envPath = resolve(process.cwd(), ".env");
  const newLines = Object.entries(variables).map(
    ([k, v]) => `${k}=${v as string}`,
  );

  if (existsSync(envPath)) {
    const existing = readFileSync(envPath, "utf-8").split("\n");
    const newKeys = new Set(Object.keys(variables));
    const merged = [
      ...existing.filter(
        (line) => !line.includes("=") || !newKeys.has(line.split("=")[0]),
      ),
      ...newLines,
    ].join("\n");
    writeFileSync(envPath, merged);
    console.log(`✅ Updated .env (merged ${count} variables)`);
  } else {
    writeFileSync(envPath, newLines.join("\n"));
    console.log(`✅ Created .env with ${count} variables`);
  }
}

// ═══════════════════════════════════════════
// برنامه اصلی
// ═══════════════════════════════════════════
program
  .name("envbox")
  .description("Pull environment variables from EnvBox")
  .version("0.1.0");

// کامند join — مسیر اصلی برای developer تازه‌دعوت‌شده.
// یک invite token یک‌بارمصرف (که مدیر از تب Members ساخته) می‌گیرد، آن را به
// /api/v1/join می‌فرستد، و سرور در ازایش یک api_key تازه برمی‌گرداند که اینجا
// در .envboxrc ذخیره می‌شود. بعد از این، دیگر همین token کار نمی‌کند (یک‌بارمصرف).
program
  .command("join")
  .description("Join a project using a one-time invite token")
  .argument("<token>", "Invite token from your project admin")
  .option("--url <url>", "EnvBox API URL", "https://envbox.vercel.app")
  .action(async (token, options) => {
    const url = options.url;
    console.log("🔗 Joining project...");

    const response = await fetch(`${url}/api/v1/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).catch(() => null);

    if (!response) {
      console.error(`❌ Couldn't reach ${url}. Is the server running?`);
      process.exit(1);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error(
        `❌ ${error.error || "This invite link is invalid or has expired."}`,
      );
      process.exit(1);
    }

    const { apiKey } = await response.json();

    saveConfig({ apiKey, url });
    addToGitignore();

    console.log("✅ Joined! Your API key has been saved to .envboxrc");
    console.log("   Now you can run:");
    console.log("   npx envbox-cli pull dev");
    console.log("   npx envbox-cli pull staging");
    console.log("   npx envbox-cli pull prod");
  });

// کامند init — برای وقتی که کلید از یک مسیر دیگر (نه invite token تازه) به
// دست developer رسیده، مثلاً از یک secret manager یا CI/CD. این کامند کلیدی
// نمی‌سازد، فقط یک کلید موجود را روی این دستگاه ذخیره می‌کند.
program
  .command("init")
  .description("Save an existing API key on this machine (no invite needed)")
  .requiredOption("--key <apiKey>", "API key from EnvBox dashboard")
  .option("--url <url>", "EnvBox API URL", "https://envbox.vercel.app")
  .action((options) => {
    saveConfig({ apiKey: options.key, url: options.url });
    addToGitignore();
    console.log("✅ Config saved. Now you can run:");
    console.log("   npx envbox-cli pull dev");
    console.log("   npx envbox-cli pull staging");
    console.log("   npx envbox-cli pull prod");
  });

// کامند pull
program
  .command("pull")
  .description("Pull variables and write to .env")
  .argument("<environment>", "Target environment: dev, staging, or prod")
  .option("--key <apiKey>", "API key (reads from .envboxrc if not provided)")
  .option("--url <url>", "EnvBox API URL")
  .action(async (environment, options) => {
    validateEnv(environment);

    const config = loadConfig();

    // اولویت: flag > config > default
    const key = options.key || config?.apiKey;
    const url = options.url || config?.url || "https://envbox.vercel.app";

    if (!key) {
      console.error("❌ No API key found.");
      console.error("   Run: npx envbox-cli join <token>");
      console.error("   or:  npx envbox-cli init --key evb_sk_xxx");
      process.exit(1);
    }

    await doPull(environment, key, url);
  });

program.parse();

// bash _next.js/envbox :
// $ pnpm tsx cli/src/index.ts join evb_invite_xxx
// $ pnpm tsx cli/src/index.ts pull dev
