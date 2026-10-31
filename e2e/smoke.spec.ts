import { mkdir } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const sampleId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1";

test("หน้าแรก เกี่ยวกับ และเส้นทางไป Shopee", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
  await expect(page.getByRole("heading", { level: 1, name: "รวมดีลอุปกรณ์เกมและการ์ด" })).toBeVisible();
  await expect(page.getByText("สินค้าตัวอย่าง").first()).toBeVisible();
  await expect(page.getByText("ตัวอย่าง รอใส่ข้อมูลจริง").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "อื่นๆ" })).toBeVisible();
  await expect(page.getByText("ยังไม่มีสินค้าในหมวดนี้")).toBeVisible();

  const shopeeLink = page.getByRole("link", { name: "ดูที่ Shopee" }).first();
  await expect(shopeeLink).toHaveAttribute("rel", "sponsored nofollow noopener");
  await expect(shopeeLink).toHaveAttribute("target", "_blank");
  await expect(shopeeLink).toHaveAttribute("href", `/go/${sampleId}`);

  await page.goto("/about");
  await expect(page.locator('a[href="https://www.tiktok.com/@songsoul44"]')).toHaveCount(2);
  await expect(page.locator('a[href="https://www.youtube.com/@songsoul_game"]')).toHaveCount(2);
  await expect(page.getByText(/ค่าคอมมิชชัน/).first()).toBeVisible();

  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "ยังไม่ได้เชื่อม Supabase" })).toBeVisible();

  const redirect = await request.get(`/go/${sampleId}`, { maxRedirects: 0 });
  expect(redirect.status()).toBe(302);
  expect(redirect.headers().location).toMatch(/^https:\/\/shopee\.co\.th\/?$/);

  const missing = await request.get("/go/not-a-product", { maxRedirects: 0 });
  expect(missing.status()).toBe(404);

  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("/admin");
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/about");
});

test("การ์ดสูงเท่ากันที่ 375, 768 และ 1280", async ({ page }) => {
  await mkdir("/opt/cursor/artifacts", { recursive: true });

  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    const cards = page.locator("#sleeves-boxes article");
    await expect(cards).toHaveCount(2);
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(Math.abs(first!.height - second!.height)).toBeLessThan(2);

    const image = await cards.nth(0).locator("img").boundingBox();
    expect(image!.width / image!.height).toBeCloseTo(4 / 3, 1);

    const buttonA = await cards.nth(0).getByRole("link", { name: "ดูที่ Shopee" }).boundingBox();
    const buttonB = await cards.nth(1).getByRole("link", { name: "ดูที่ Shopee" }).boundingBox();
    const slack = (card: NonNullable<typeof first>, button: NonNullable<typeof buttonA>) =>
      card.y + card.height - (button.y + button.height);
    expect(slack(first!, buttonA!)).toBeGreaterThanOrEqual(12);
    expect(slack(first!, buttonA!)).toBeLessThanOrEqual(20);
    expect(slack(second!, buttonB!)).toBeGreaterThanOrEqual(12);
    expect(slack(second!, buttonB!)).toBeLessThanOrEqual(20);

    if (width >= 768) {
      expect(Math.abs(first!.y - second!.y)).toBeLessThan(2);
      expect(Math.abs(buttonA!.y - buttonB!.y)).toBeLessThan(2);
    }

    await page.screenshot({
      path: `/opt/cursor/artifacts/home-${width}.png`,
      fullPage: true,
    });
  }

  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/about");
  await page.screenshot({
    path: "/opt/cursor/artifacts/about-375.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/admin");
  await page.screenshot({
    path: "/opt/cursor/artifacts/admin-768.png",
    fullPage: true,
  });
});
