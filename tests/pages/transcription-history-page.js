import { expect } from '@playwright/test';
import { BasePage } from './base-page';
import { detect  } from 'langdetect';
import { baseURL } from '../../playwright.config';

class TranscriptionHistoryPage extends BasePage {
    constructor(page) {
        super(page);
        this.url = `${baseURL}/dashboard/riwayat`;
        // Locators for the elements on the transcription history page
        this.succesStatus = page.locator('.px-2.py-1.bg-green-600.rounded-full.text-white');
        this.searchInput = page.locator('[placeholder="Search"]');
        this.creditReturnedToast = page.locator('text=Kredit anda sudah dipulihkan');
        this.closeTranscriptBtn = page.locator('[aria-label="Close"]');
        this.summaryBtn = page.locator('//button[text()="Ringkasan"]');
        this.summary = page.locator('.text-sm.text-start.whitespace-pre-line');
        this.ratingBtn = page.locator('text=Beri Nilai');
        this.downloadBtn = page.locator('#downloadTrigger').locator('text=Download');
        this.downloadPdfBtn = page.locator('#downloadPdfTrigger');
        this.downloadDocxBtn = page.locator('#downloadDocxTrigger');
        this.downloadAudioBtn = page.locator('#downloadAudioTrigger');
        this.downloadProgressModal = page.locator('text=Downloading File...');
        this.submitRatingBtn = page.locator('#submitRatingTrigger');
        this.ratingSentModal = page.locator('text=Berhasil Mengirim Rating');
        this.audioPlayBtn = page.locator('#playPauseTrigger');
        this.searchResultContainer = page.locator('.flex.px-2.flex-col.gap-\\[16px\\].pb-16.md\\:pb-6');
        this.firstTranscriptionBtn = page.locator("//div[contains(@class, 'flex') and contains(@class, 'px-2') and contains(@class, 'flex-col') and contains(@class, 'gap-[16px]') and contains(@class, 'pb-16') and contains(@class, 'md:pb-6')]//button[1]");
        this.creditReturnBadge = this.firstTranscriptionBtn.locator('div.relative p:text("Tekan transkrip untuk memulihkan kredit")');
    }

    /**
     * Asserts that a transcription title is visible on the page.
     * @param {string} title - The transcription title to check.
     */
    async transcriptionTitleVisible(title) {
        const transcriptionTitle = this.page.locator(`h3:has-text("${title}")`);
        await this.expectVisible(transcriptionTitle);
    }

    /**
     * Asserts that the "Berhasil" status element is visible on the page.
     */
    async succesStatusVisible() {
        await this.expectVisible(this.succesStatus);
    }

    /**
     * Asserts that the credit return badge is visible.
     */
    async creditReturnBadgeVisible() {
        await this.expectVisible(this.creditReturnBadge);
    }

    /**
     * Clicks on the first transcription button to trigger credit return.
     */
    async clickCreditReturnBadge() {
        await this.click(this.firstTranscriptionBtn);
    }

    /**
     * Asserts that the credit returned toast message is visible.
     */
    async creditReturnedToastVisible() {
        await this.expectVisible(this.creditReturnedToast);
    }

    /**
     * Clicks the "Beri Nilai" button for the transcription.
     */
    async clickRatingBtn() {
        await this.click(this.ratingBtn);
    }

    /**
     * Clicks the "Ringkasan" button to view transcription summary.
     */
    async clickSummaryBtn() {
        await this.click(this.summaryBtn);
    }

    /**
     * Clicks the "Submit" button to submit the rating for the transcription.
     */
    async clickSubmitRatingBtn() {
        await this.click(this.submitRatingBtn);
    }

    /**
     * Closes the transcription panel.
     */
    async clickCloseTranscriptBtn() {
        await this.click(this.closeTranscriptBtn);
    }

    /**
     * Asserts that the rating sent modal is visible after submission.
     */
    async ratingSentModalVisible() {
        await this.expectVisible(this.ratingSentModal);
    }

    /**
     * Clicks the "Download" button to download the transcription file.
     */
    async clickDownloadBtn() {
        await this.click(this.downloadBtn);
    }

    /**
     * Retrieves the transcription summary text.
     * @return {Promise<string>} - The transcription summary text.
     */
    async getSummaryText() {
        return await this.summary.innerText();
    }

    /**
     * Validates the detected language of the transcription summary.
     * @param {string} summary - The transcription summary text.
     * @param {string} expectedLanguage - The expected language ('English' or 'Indonesia').
     * @throws {Error} If an invalid language is provided.
     */
    async validateSummaryLanguage(summary, expectedLanguage) {
        const detectedLanguage = detect(summary)[0].lang;
        console.log('detectedLanguage:', detectedLanguage);

        if (expectedLanguage === 'English') {
            expect(detectedLanguage).toBe('en');
        } else if (expectedLanguage === 'Indonesia') {
            expect(detectedLanguage).toBe('id');
        } else {
            throw new Error('Invalid language specified. Expected "English" or "Indonesia".');
        }
    }

    /**
     * Asserts that the download progress modal is visible while downloading.
     */
    async downloadProgressModalVisible() {
        await this.expectVisible(this.downloadProgressModal);
    }

    /**
     * Downloads the transcription file based on the specified file type.
     * @param {string} fileType - The type of file to download ('pdf', 'docx', or 'audio').
     */
    async downloadFile(fileType) {
        const downloadPromise = this.page.waitForEvent('download');
        switch (fileType) {
            case 'pdf':
                await this.click(this.downloadPdfBtn);
                await this.downloadProgressModalVisible();
                break;
            case 'docx':
                await this.click(this.downloadDocxBtn);
                await this.downloadProgressModalVisible();
                break;
            case 'audio':
                await this.click(this.downloadAudioBtn);
                break;
            default:
                throw new Error('Invalid file type specified. Expected "pdf", "docx", or "audio"');
        }

        const download = await downloadPromise;
        await download.saveAs('./downloaded-files/' + download.suggestedFilename());
    }

     /**
     * Clicks the play button to start playing the transcription audio.
     */
    async clickAudioPlayBtn() {
        await this.waitForTimeout(2000);
        await this.click(this.audioPlayBtn);
    }

    /**
     * Checks if the audio is currently playing.
     * @return {Promise<boolean>} - True if the audio is playing, false otherwise.
     */
    async isAudioPlaying() {   
        // Wait for some time until audio is played
        await this.waitForTimeout(2000);
        // Check if the audio is playing
        const isPlaying = await this.page.evaluate(() => {
            const audioElement = document.querySelector('audio');
            return audioElement ? !audioElement.paused : false;
        });

        return isPlaying;
    }

     /**
     * Fills the search input field with a keyword.
     * @param {string} keyword - The search keyword to enter.
     */
    async fillSearchInput(keyword) {
        await this.fill(this.searchInput, keyword);
    }

    /**
     * Checks if the search result contains the specified keyword.
     * @param {string} keyword - The keyword to search for in the results.
     * @return {Promise<boolean>} - True if the keyword is found, false otherwise.
     */
    async getSearchResult(keyword) {
        await this.waitForTimeout(2000);
        const resultsText = await this.searchResultContainer.innerText();

        // Check if the results contain the keyword
        let isKeywordFound = false;
        if (resultsText.toLowerCase().includes(keyword.toLowerCase())) {
            isKeywordFound = true;
        }

        return isKeywordFound;
    }
}

export { TranscriptionHistoryPage };
