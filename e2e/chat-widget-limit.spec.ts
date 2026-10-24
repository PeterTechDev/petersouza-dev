import { expect, test, type Page, type Route } from "@playwright/test";

const OPEN_CHAT = "Open Ask Me Anything chat";
const SEND_MESSAGE = "Send message";
const MOCK_REPLY = "Fixed mock reply.";
const CLIENT_LIMIT = "Rate limit reached. Refresh to start a new conversation.";
const MAX_CLIENT_MESSAGES = 10;

async function openChat(page: Page) {
  await page.goto("/");
  const opener = page.getByRole("button", { name: OPEN_CHAT });
  await expect(opener).toBeVisible({ timeout: 15_000 });
  await opener.click();
  await expect(page.getByRole("textbox")).toBeVisible();
}

test("the widget stops after 10 messages and does not post an 11th", async ({ page }) => {
  let posts = 0;
  await page.route(/\/api\/chat\/?$/, async (route: Route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    posts += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ reply: MOCK_REPLY }),
    });
  });

  await openChat(page);
  const textbox = page.getByRole("textbox");
  const send = page.getByRole("button", { name: SEND_MESSAGE });

  for (let index = 1; index <= MAX_CLIENT_MESSAGES; index += 1) {
    await textbox.fill(`Question ${index}`);
    await send.click();
    await expect(page.getByText(MOCK_REPLY)).toHaveCount(index);
  }

  await expect(page.getByText("10/10 messages")).toBeVisible();
  await expect(page.getByText(CLIENT_LIMIT)).toBeVisible();
  await expect(textbox).toBeDisabled();
  await expect(send).toBeDisabled();
  expect(posts).toBe(MAX_CLIENT_MESSAGES);
});
