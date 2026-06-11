#!/usr/bin/env node
import { Command } from "commander";
import { writeFileSync, existsSync, readFileSync, appendFileSync } from "fs";
import { resolve } from "path";

const program = new Command();
const CONFIG_FILE = ".envboxrc";

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

// کامند init
program
  .command("init")
  .description("Initialize EnvBox in this project (run once)")
  .requiredOption("--key <apiKey>", "API key from EnvBox dashboard")
  .option("--url <url>", "EnvBox API URL", "http://localhost:3000")
  .action((options) => {
    saveConfig({ apiKey: options.key, url: options.url });
    addToGitignore();
    console.log("✅ Config saved. Now you can run:");
    console.log("   npx envbox pull --env staging");
    console.log("   npx envbox pull --env production");
  });

// کامند pull
program
  .command("pull")
  .description("Pull variables and write to .env")
  .requiredOption(
    "--env <environment>",
    "Target environment (development, staging, production)",
  )
  .option("--key <apiKey>", "API key (reads from .envboxrc if not provided)")
  .option("--url <url>", "EnvBox API URL")
  .action(async (options) => {
    const config = loadConfig();

    // اولویت: flag > config > default
    const key = options.key || config?.apiKey;
    const url = options.url || config?.url || "http://localhost:3000";

    if (!key) {
      console.error("❌ No API key found.");
      console.error("   Run: npx envbox init --key=envbox_sk_xxx");
      process.exit(1);
    }

    await doPull(options.env, key, url);
  });

program.parse();

// bash _next.js/envbox/cli :
// $ pnpm dev init --key envbox_sk_2ab
// $ pnpm dev pull --env staging/development/production

// bash _next.js/envbox :
// $ pnpm tsx cli/src/index.ts init --key envbox_sk_2ab
// $ pnpm tsx cli/src/index.ts pull --env staging/development/production
