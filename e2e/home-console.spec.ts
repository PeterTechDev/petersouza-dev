import { expect, test } from "@playwright/test";

test("home page renders the QA role without console errors", async ({ page }) => {
  const errors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  await page.goto("/");
  await expect(page).toHaveTitle("Peter Souza — QA Automation & AI Testing Engineer");
  await expect(page.getByRole("heading", { level: 1, name: "Peter Souza" })).toBeVisible();
  await expect(page.getByText("QA Automation & AI Testing Engineer").first()).toBeVisible();
  await expect(page.getByText("Open to remote QA/SDET roles")).toBeVisible();
  await expect(page.getByText("peterleite.dev@gmail.com").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Download CV" }).first()).toHaveAttribute(
    "href",
    "/cv-peter-v2.pdf",
  );
  await expect(page.getByRole("heading", { name: "Hiring?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "AutoVendas" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Vover" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Mind Palace" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "OpenClaw Multi-Agent System" })).toHaveCount(0);

  // Let the particle field run a few frames so a NaN bounding sphere would log.
  await page.waitForTimeout(1500);

  expect(errors, errors.join("\n")).toEqual([]);
});

test("blog document title is not doubled", async ({ page }) => {
  await page.goto("/blog/");
  await expect(page).toHaveTitle("Blog — Peter Souza");
});
