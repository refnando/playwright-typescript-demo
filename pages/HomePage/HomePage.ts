import { Locator, Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  readonly appLogo: Locator;
  readonly shoppingCartButton: Locator;
  readonly shoppingCartBadge: Locator;

  readonly productsLabel: Locator;
  readonly sortDropdown: Locator;

  readonly inventoryItems: Locator;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    this.page = page;

    this.appLogo = page.locator(".app_logo");
    this.shoppingCartButton = page
      .locator("#shopping_cart_container")
      .getByRole("link");
    this.shoppingCartBadge = this.page.locator(".shopping_cart_badge");
    

    this.productsLabel = page.getByText("Products", { exact: true });
    this.sortDropdown = page.locator(".select.product_sort_container");

    this.inventoryItems = page.locator(".inventory_item");
    this.inventoryItemNames = page.locator(".inventory_item_name");
    this.inventoryItemPrices = page.locator(".inventory_item_price");
    this.addToCartButtons = page.locator("button.btn_primary.btn_inventory");
  }

  async selectSortOption(option: string) {
    await this.sortDropdown.selectOption({ label: option });
  }

  getProductByName(name: string): Locator {
    return this.inventoryItems.filter({
      has: this.inventoryItemNames.filter({ hasText: name }),
    });
  }

  async addProductToCart(name: string) {
    const product = this.getProductByName(name);
    await product.locator("button.btn_inventory").click();
  } 

  async getProductPrice(name: string): Promise<string> {
    const product = this.getProductByName(name);
    return await product.locator(".inventory_item_price").innerText();
  }
}
