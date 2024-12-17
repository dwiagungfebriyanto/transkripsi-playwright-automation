import { expect } from '@playwright/test';
import { BasePage } from './base-page';

class MidtransModal extends BasePage {
    constructor(page) {
        super(page);
        // Locators for the elements on the Midtrans modal
        this.midtransModal = page.locator('.merchant-name');
        this.virtualAccountPayment = page.locator('text=Virtual account');
        this.shopeePayment = page.locator('text=ShopeePay/SPayLater');
        this.qrisPayment = page.locator('text=QRIS');
        this.closeBtn = page.locator('div.close-snap-button.clickable');
    }

    /**
     * Asserts that the Midtrans modal is visible.
     */
    async midtransModalVisible() {
        await this.isVisible(this.midtransModal);
    }

    /**
     * Compares the price displayed in the Midtrans modal with the expected price.
     * @param {string} price - The expected price text.
     */
    async samePrice(price) {
        const iframe = this.page.frameLocator('iframe');
        const priceText = await iframe.locator('.header-amount').textContent();
        expect(priceText).toBe(price);
    }

    /**
     * Extracts and returns the order ID from the Midtrans modal.
     * @return {string|null} - The extracted order ID or null if not found.
     */
    async getOrderID() {
        const iframe = this.page.frameLocator('iframe');
        const orderId = await iframe.locator('.header-order-id').textContent();
        // Process and extract the order ID
        const match = orderId.match(/#\s*(\S+)/); // Match the order ID after "#"
        return match ? match[1] : null;
    }

    /**
     * Asserts that the Virtual Account payment method is visible.
     */
    async virtualAccountPaymentVisible() {
        await this.isVisible(this.virtualAccountPayment);
    }

    /**
     * Asserts that the ShopeePay/SPayLater payment method is visible.
     */
    async shopeePaymentVisible() {
        await this.isVisible(this.shopeePayment);
    }

    /**
     * Asserts that the QRIS payment method is visible.
     */
    async qrisPaymentVisible() {
        await this.isVisible(this.qrisPayment);
    }

    /**
     * Clicks on the QRIS payment method inside the iframe.
     */
    async clickQrisPayment() {
        const iframe = this.page.frameLocator('iframe');
        await this.click(await iframe.locator(this.qrisPayment));
    }

    /**
     * Determines and verifies which payment methods are suitable based on the price.
     * - If the price is less than Rp20.000, Virtual Account will be hidden.
     * - If the price is greater or equal to Rp20.000, all payment methods will be visible.
     * @param {string} price - The price to check for suitability.
     */
    async suitablePaymentMethod(price) {
        const priceInt = parseInt(price.replace(/[^\d]/g, ''), 10);
        if (priceInt < 20000) {
            // For prices less than Rp20.000, Virtual Account is hidden, others are visible
            await this.isNotVisible(this.virtualAccountPayment);
            await this.isVisible(this.shopeePayment);
            await this.isVisible(this.qrisPayment);
        } else {
            // For prices greater than or equal to Rp20.000, all methods should be visible
            await this.isVisible(this.virtualAccountPayment);
            await this.isVisible(this.shopeePayment);
            await this.isVisible(this.qrisPayment);
        }
    }

    /**
     * Clicks the close button in the Midtrans modal inside the Midtrans modal.
     */
    async clickCloseBtn() {
        const iframe = this.page.frameLocator('iframe');
        await this.click(await iframe.locator(this.closeBtn));
    }
}

export { MidtransModal };
