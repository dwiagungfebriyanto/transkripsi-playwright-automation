import { expect } from '@playwright/test';

class BasePage {
    constructor(page) {
        this.page = page;
        // Locator for the WhatsApp group modal
        this.waGroupModal = page.locator('text=Gabung grup untuk dapatkan voucher');
        this.waGroupModalCloseBtn = page.locator('#laterButton');
    }

    /**
     * Clicks on the specified locator.
     * @param {Locator} locator - The locator of the element to click.
     */
    async click(locator) {
        await locator.click();
    }

    /**
     * Fills the specified locator with the provided text.
     * @param {Locator} locator - The locator of the element to fill.
     * @param {string} text - The text to enter in the input field.
     */
    async fill(locator, text) {
        await locator.fill(text);
    }

    /**
     * Sets input files for the specified locator.
     * @param {Locator} locator - The locator of the file input element.
     * @param {string} filePath - The path to the file to upload.
     */
    async setInputFiles(locator, filePath) {
        await locator.setInputFiles(filePath);
    }

    /**
     * Checks if the specified locator is visible.
     * @param {Locator} locator - The locator of the element to check.
     * @return {Promise<boolean>} - True if the element is visible, false otherwise.
     */
    async isVisible(locator) {
        return await locator.isVisible();
    }

    /**
     * Checks if the specified locator is not visible (i.e., has no matching elements).
     * @param {Locator} locator - The locator of the element to check.
     */
    async isNotVisible(locator) {
        return await expect(locator).toHaveCount(0);
    }

    /**
     * Waits for a specified amount of time (in milliseconds).
     * @param {number} ms - The amount of time to wait, in milliseconds.
     */
    async waitForTimeout(ms) {
        await this.page.waitForTimeout(ms);
    }

    /**
     * Waits for 1 second.
     */
    async waitOneSec() {
        await this.waitForTimeout(1000);
    }

    /**
     * Waits for 10 seconds to allow for redirects.
     */
    async waitUntilRedirect() {
        await this.waitForTimeout(10000);
    }

    /**
     * Waits for the page to reach a specific load state (e.g., 'load', 'domcontentloaded', etc.).
     * @param {string} [state='load'] - The state to wait for.
     */
    async waitForLoadState(state = 'load') {
        await this.page.waitForLoadState(state);
    }

    /**
     * Waits for an element to be visible and asserts that it is visible.
     * @param {Locator} locator - The locator of the element to check.
     */
    async expectVisible(locator) {
        await locator.waitFor({ state: 'visible', timeout: 120000 });
        await expect(locator).toBeVisible();
    }

    /**
     * Asserts that the specified locator is disabled.
     * @param {Locator} locator - The locator of the element to check.
     */
    async expectDisabled(locator) {
        await expect(locator).toBeDisabled();
    }

    /**
     * Asserts that the specified locator is enabled.
     * @param {Locator} locator - The locator of the element to check.
     */
    async expectEnabled(locator) {
        await expect(locator).toBeEnabled();
    }

    /**
     * Navigates to the specified URL and closes the WhatsApp group modal if it appears.
     * @param {string} url - The URL to navigate to.
     */
    async navigateTo(url) {
        await this.page.goto(url, { waitUntil: 'load' });
        try {
            const waGroupModalVisible = await this.waGroupModal?.isVisible();
            if (waGroupModalVisible) {
                await this.waGroupModalCloseBtn?.click();
            }
        } catch (error) {
            console.log('No modal appeared.');
        }
    }

    /**
     * Asserts that the page URL matches the specified URL after navigation.
     * Also closes the WhatsApp group modal if it appears.
     * @param {string} url - The URL to check the page against.
     */
    async hasUrl(url) {
        await this.waitForLoadState();
        await expect(this.page).toHaveURL(url);
        try {
            const waGroupModalVisible = await this.waGroupModal?.isVisible();
            if (waGroupModalVisible) {
                await this.waGroupModalCloseBtn?.click();
            }
        } catch (error) {
            console.log('No modal appeared.');
        }
    }
}

export { BasePage };
