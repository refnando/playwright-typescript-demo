import { expect, type Locator, type Page } from "@playwright/test"


export class LoginPage {
    readonly page: Page;
    readonly userNameTextField: Locator;
    readonly passwordTextField: Locator;
    readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userNameTextField = page.locator('[data-test="username"]');
    this.passwordTextField = page.locator('[data-test="password"]');
    this.loginButton = page.locator("#login-button");
  }

    async validLogin(username: string, password: string) {
    const url = process.env.BASE_URL || ("" as string);
    await this.page.goto(url);
    await this.userNameTextField.fill(username);
    await this.passwordTextField.fill(password);
    await this.loginButton.click();
  }

  
}