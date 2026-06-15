#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_1 = require("fs");
const path_1 = require("path");
const program = new commander_1.Command();
const CONFIG_FILE = ".envboxrc";
function addToGitignore() {
    const gitignorePath = (0, path_1.resolve)(process.cwd(), ".gitignore");
    const entry = CONFIG_FILE; // ".envboxrc"
    if (!(0, fs_1.existsSync)(gitignorePath)) {
        // .gitignore وجود نداره — بسازش
        (0, fs_1.writeFileSync)(gitignorePath, `${entry}\n`);
        console.log("📝 Created .gitignore and added .envboxrc");
        return;
    }
    const content = (0, fs_1.readFileSync)(gitignorePath, "utf-8");
    const lines = content.split("\n");
    if (lines.some((line) => line.trim() === entry)) {
        // از قبل هست — هیچی نکن
        return;
    }
    // اضافه کن
    (0, fs_1.appendFileSync)(gitignorePath, `\n${entry}\n`);
    console.log("📝 Added .envboxrc to .gitignore");
}
// ═══════════════════════════════════════════
// ذخیره و خوندن تنظیمات
// ═══════════════════════════════════════════
function saveConfig(data) {
    const configPath = (0, path_1.resolve)(process.cwd(), CONFIG_FILE);
    (0, fs_1.writeFileSync)(configPath, JSON.stringify(data, null, 2));
}
function loadConfig() {
    const configPath = (0, path_1.resolve)(process.cwd(), CONFIG_FILE);
    if (!(0, fs_1.existsSync)(configPath))
        return null;
    return JSON.parse((0, fs_1.readFileSync)(configPath, "utf-8"));
}
// ═══════════════════════════════════════════
// منطق Pull (یه تابع مشترک)
// ═══════════════════════════════════════════
async function doPull(env, key, url) {
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
    const envPath = (0, path_1.resolve)(process.cwd(), ".env");
    const newLines = Object.entries(variables).map(([k, v]) => `${k}=${v}`);
    if ((0, fs_1.existsSync)(envPath)) {
        const existing = (0, fs_1.readFileSync)(envPath, "utf-8").split("\n");
        const newKeys = new Set(Object.keys(variables));
        const merged = [
            ...existing.filter((line) => !line.includes("=") || !newKeys.has(line.split("=")[0])),
            ...newLines,
        ].join("\n");
        (0, fs_1.writeFileSync)(envPath, merged);
        console.log(`✅ Updated .env (merged ${count} variables)`);
    }
    else {
        (0, fs_1.writeFileSync)(envPath, newLines.join("\n"));
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
    .requiredOption("--env <environment>", "Target environment (development, staging, production)")
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
