import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage/LoginPage';

const user = process.env.USER_NAME as string;
const pwd = process.env.PASSWORD as string;

test.beforeEach(async ({ page }) => {
  const loginpage = new LoginPage(page);
  await loginpage.validLogin(user, pwd);
});

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});


