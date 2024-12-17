import { BasePage } from './base-page';

class Navbar extends BasePage{
    constructor(page) {
        super(page);
        // Locators for the elements on the navbar
        this.topUpBtn = page.locator('#topUpButton');
        this.credit = page.locator('.text-sm.font-bold.text-blue-600');
        this.menuBtn = page.locator('[aria-haspopup="dialog"]');
        this.transactionHistoryBtn = page.locator('text=Riwayat Beli');
    }

    /**
     * Retrieves the user's credit balance as an integer from the navigation bar.
     * @return {number} - The user's credit balance.
     */
    async getUserCredit() {
        const text = await this.credit.textContent();
        const userCredit = parseInt(text.trim(), 10);
        return userCredit;
    }

    /**
     * Clicks the "Top Up" button in the navigation bar.
     */
    async clickTopUpBtn() {
        await this.click(this.topUpBtn);
    }

    /**
     * Clicks the menu button (profile icon) in the navigation bar, which opens a menu dialog.
     */
    async clickMenuBtn() {
        await this.click(this.menuBtn);
    }

    /**
     * Clicks the "Riwayat Beli" button in the navigation bar.
     */
    async clickTransactionHistoryBtn() {
        await this.click(this.transactionHistoryBtn);
    }

    /**
     * Asserts that the user's credit balance is visible in the navigation bar.
     */
    async creditVisible() {
        await this.isVisible(this.credit);
    }

    /**
     * Asserts that the menu button (profile icon) is visible in the navigation bar.
     */
    async menuBtnVisible() {
        await this.isVisible(this.menuBtn);
    }
}

export { Navbar };
