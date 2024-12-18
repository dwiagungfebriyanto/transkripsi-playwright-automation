import { BasePage } from './base-page';

class TopUpModal extends BasePage {
    constructor(page) {
        super(page);
        // Locators for the elements on the top-up modal
        this.TopUpModal = page.locator('text=Selesaikan pembayaran untuk mendapatkan transkripsi');
        this.fiveTranscriptPrice = page.locator('//h3[contains(text(), "5 kali Transkrip")]');
        this.threeTranscriptPrice = page.locator('//h3[contains(text(), "3 kali Transkrip")]');
        this.oneTranscriptPrice = page.locator('//h3[contains(text(), "1 kali Transkrip")]');
        this.voucherCodeInput = page.locator('[placeholder="Masukkan kode voucher disini"]');
        this.reedemVoucherBtn = page.locator('#redeemVoucherButton');
        this.invalidVoucherError = page.locator('//p[contains(@class, "text-red-500")]');
        this.voucherApplied = page.locator('//div[contains(@class, "flex") and contains(@class, "justify-between") and contains(@class, "gap-3") and contains(@class, "items-center") and contains(@class, "p-3") and contains(@class, "rounded-lg") and contains(@class, "bg-gradient-to-r") and contains(@class, "from-[#2595FF]") and contains(@class, "to-[#014381]")]');
        this.buyNowBtn = page.locator('#buyNowButton');
        this.packageNotChosenToast = page.locator('text=Pilih dari salah satu paket di atas terlebih dahulu');
        this.pendingPaymentModal = page.locator('text=Anda memiliki status pembayaran tertunda');
        this.pendingPaymentModalCancelBtn = page.locator('#closePendingModal');
        this.pendingPaymentModalContinueBtn = page.locator('#continuePendingModal');
    }

    /**
     * Asserts that the Top-Up modal is visible.
     */
    async topUpModalVisible() {
        await this.isVisible(this.TopUpModal);
    }

    /**
     * Selects a transcript package based on the given package type.
     * @param {string} transcriptPackage - The type of transcript package ('1', '3', or '5').
     * @throws {Error} - Will throw an error if the package type is invalid.
     */
    async selectPackage(transcriptPackage) {
        switch (transcriptPackage) {
            case '5':
                await this.click(this.fiveTranscriptPrice);
                break;
            case '3':
                await this.click(this.threeTranscriptPrice);
                break;
            case '1':
                await this.click(this.oneTranscriptPrice);
                break;
            default:
                throw new Error('Invalid package');
        }
    }

    /**
     * Inputs a voucher code into the corresponding field.
     * @param {string} voucherCode - The voucher code to input.
     */
    async inputVoucherCode(voucherCode) {
        await this.fill(this.voucherCodeInput, voucherCode);
    }

    /**
     * Asserts that the voucher code input field is visible.
     */
    async inputVoucherCodeVisible() {
        await this.isVisible(this.voucherCodeInput);
    }

    /**
     * Clicks the "Gunakan Voucher" button to apply the voucher code.
     */
    async clickRedeemVoucherBtn() {
        await this.click(this.reedemVoucherBtn);
        await this.waitForTimeout(2000);
    }

    /**
     * Asserts that the invalid voucher error message is visible.
     */
    async invalidVoucherErrorVisible() {
        await this.isVisible(this.invalidVoucherError);
    }

    /**
     * Asserts that the invalid voucher error message is not visible.
     */
    async invalidVoucherErrorIsNotVisible() {
        await this.isNotVisible(this.invalidVoucherError);
    }

    /**
     * Asserts that the voucher applied success message is visible.
     */
    async voucherAppliedVisible() {
        await this.isVisible(this.voucherApplied);
    }

    /**
     * Asserts that the voucher applied success message is not visible.
     */
    async voucherAppliedIsNotVisible() {
        await this.isNotVisible(this.voucherApplied);
    }

    /**
     * Clicks the "Bayar Sekarang" button to proceed with the top-up purchase.
     */
    async clickBuyNowBtn() {
        await this.click(this.buyNowBtn);
    }

    /**
     * Asserts that the package not chosen toast message is visible.
     */
    async packageNotChosenToastVisible() {
        await this.isVisible(this.packageNotChosenToast);
    }

    /**
     * Asserts that the pending payment modal is visible.
     */
    async pendingPaymentModalVisible() {
        await this.waitForTimeout(1000);
        await this.isVisible(this.pendingPaymentModal);
    }

    /**
     * Clicks the cancel payment button on the pending payment modal.
     */
    async clickPendingPaymentModalCancelBtn() {
        await this.click(this.pendingPaymentModalCancelBtn);
    }

    /**
     * Clicks the continue button on the pending payment modal to proceed with payment.
     */
    async clickPendingPaymentModalContinueBtn() {
        await this.click(this.pendingPaymentModalContinueBtn);
    }
}

export { TopUpModal };
