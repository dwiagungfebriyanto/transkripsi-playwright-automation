import { BasePage } from './base-page';
import { baseURL } from '../../playwright.config';

class TransactionHistoryPage extends BasePage {
    constructor(page) {
        super(page);
        this.url = `${baseURL}/dashboard/riwayat-pembelian`;
        // Locators for the elements on the trasaction history page
        this.cancelPaymentBtn = page.locator('#cancelPaymentTrigger');
        this.canceledPaymentToast = page.locator('text=Transaksi berhasil dibatalkan');
        this.latestTransactionID = page.locator('.flex-1.inline-flex.justify-start.gap-4.items-center').nth(0);
        this.secondLatestTransactionID = page.locator('.flex-1.inline-flex.justify-start.gap-4.items-center').nth(1);
        this.latestTransactionStatus = page.locator('.rounded-xl.px-3.py-1.text-xs.font-medium').nth(0);
        this.secondLatestTransactionStatus = page.locator('.rounded-xl.px-3.py-1.text-xs.font-medium').nth(1);
        this.latestInvoiceStatus = page.locator('.rounded-xl.px-3.py-1.text-xs.font-medium').nth(10);
        this.latestInvoiceID = page.locator('.h4.text-primary').nth(0);
        this.latestInvoiceBtn = page.locator('#showInvoiceTrigger').nth(0);
    }

    /**
     * Clicks the cancel payment button in the transaction history page.
     */
    async clickCancelPaymentBtn() {
        await this.click(this.cancelPaymentBtn);
    }

    /**
     * Clicks the "Lihat Invoice" button for the latest transaction.
     */
    async clickLatestInvoiceBtn() {
        await this.click(this.latestInvoiceBtn);
    }

    /**
     * Retrieves the ID of the latest transaction.
     * @param {boolean} isViewInvoice - If true, it will be checked again if there is a transaction that is still pending, if so, it will return the ID of the second latest transaction because the latest transaction has no option to view the invoice.
     * @return {string} - The transaction ID.
     */
    async getLatestTransactionID(isViewInvoice) {
        if (isViewInvoice) {
            if (await this.cancelPaymentBtnVisible()) {
                return await this.secondLatestTransactionID.innerText();
            }
        }
        return await this.latestTransactionID.innerText();
    }

    /**
     * Retrieves the status of the latest transaction.
     * - If the cancel payment button is visible, it will return the status of the second latest transaction.
     * @return {string} - The transaction status.
     */
    async getLatestTransactionStatus() {
        if (await this.cancelPaymentBtnVisible()) {
            return await this.secondLatestTransactionStatus.innerText();
        }
        return await this.latestTransactionStatus.innerText();
    }

    /**
     * Retrieves the status of the latest invoice.
     * @return {string} - The invoice status.
     */
    async getLatestInvoiceStatus() {
        return await this.latestInvoiceStatus.innerText();
    }

    /**
     * Retrieves the ID of the latest invoice.
     * @return {string} - The invoice ID.
     */
    async getLatestInvoiceID() {
        return await this.latestInvoiceID.innerText();
    }

    /**
     * Asserts that the canceled payment toast message is visible.
     */
    async canceledPaymentToastVisible() {
        await this.expectVisible(this.canceledPaymentToast);
    }

    /**
     * Waits for the "Batalkan" button to become visible and then returns a boolean indicating its visibility.
     * @return {boolean} - True if the "Batalkan" button is visible, false otherwise.
     */
    async cancelPaymentBtnVisible() {
        await this.waitForTimeout(2000);
        return await this.isVisible(this.cancelPaymentBtn);
    }

    /**
     * Asserts that the "Batalkan" button is not visible on the page.
     */
    async cancelPaymentBtnIsNotVisible() {
        await this.waitForTimeout(2000);
        await this.isNotVisible(this.cancelPaymentBtn);
    }
}

export { TransactionHistoryPage };
