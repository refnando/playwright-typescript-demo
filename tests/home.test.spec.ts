import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage/HomePage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { NUMBERS } from '../utils/constants/values';

const user = process.env.USER_NAME as string;
const pwd = process.env.PASSWORD as string;

test.beforeEach(async ({ page }) => {
  const loginpage = new LoginPage(page);
  await loginpage.validLogin(user, pwd);
});

test('Add product into Shopping cart', async ({ page }) => {
  const inventory = new HomePage(page);
  await inventory.addProductToCart('Sauce Labs Backpack');
  await expect(inventory.shoppingCartButton).toHaveText(NUMBERS.ONE.toString());
});


