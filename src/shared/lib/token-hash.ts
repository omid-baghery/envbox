import { createHash, randomBytes } from "crypto";

/**
 * هش یک‌طرفه برای ای‌پی‌ای-کی و اینوایت‌توکن.
 *
 * چرا SHA-256 و نه bcrypt/argon2؟
 * این مقادیر، بر خلاف پسورد، از قبل رشته‌های تصادفی با آنتروپی بالا هستند
 * (نه چیزی که انسان تایپ کرده و قابل brute-force با دیکشنری باشد)،
 * پس نیازی به الگوریتم کند و salt-per-row نیست؛ یک هش سریع و یکتا کافی است
 * و برای verify هم فقط باید با مقدار ورودی دوباره hash بگیریم و با ستون
 * tokenHash / keyHash در دیتابیس مقایسه کنیم (lookup مستقیم، نه bcrypt.compare).
 */
export function hashSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

/**
 * یک رشته‌ی تصادفی امن برای ای‌پی‌ای-کی یا اینوایت‌توکن می‌سازد.
 * prefix فقط برای خوانایی و تشخیص نوع کلید در لاگ‌ها/UI استفاده می‌شود.
 */
export function generateSecret(prefix: string, byteLength = 24): string {
  return `${prefix}_${randomBytes(byteLength).toString("hex")}`;
}

/**
 * برای نمایش امن در UI، مثل: evb_sk_xK9m...3pQr
 * فقط چند کاراکتر اول و آخر نشان داده می‌شود.
 */
export function previewSecret(secret: string): string {
  if (secret.length <= 12) return secret;
  return `${secret.slice(0, 10)}…${secret.slice(-4)}`;
}
