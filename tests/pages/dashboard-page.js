import { BasePage } from './base-page';
import { baseURL } from '../../playwright.config';

class DashboardPage extends BasePage {
    constructor(page) {
        super(page);
        this.url = `${baseURL}/dashboard`;
        // Locators for the elements on the dashboard page
        this.fileUploadBtn = page.locator('#uploadFileButton')
        this.googleDriveBtn = page.locator('#googleDriveButton');
        this.fileUploadInput= page.locator('[name="file-upload"]');
        this.transcriptNameInput = page.locator('[placeholder="contoh: Rapat dengan stakeholder"]');
        this.transcriptLanguageIdBtn = page.locator('#set-language-id').locator('text=Indonesia');
        this.transcriptLanguageEnBtn = page.locator('#set-language-en').locator('text=English');
        this.uploadAndTranscriptBtn = page.locator('#upload-and-transcript');
        this.googleDriveLinkInput = page.locator('[placeholder="pastikan akses link Anda publik"]');
        this.transcriptGoogleDriveLinkBtn = page.locator('#transcript-gdrive-link');
        this.progressBar = page.locator('[role="progressbar"]');
        this.unsupportedFileError = page.locator('text=Format file tidak didukung');
        this.invalidLinkError = page.locator('text=Link Google Drive Invalid');
        this.restrictedLinkError = page.locator('text=Link Privat');
        this.transcriptWillBeProcessedToast = page.locator("text=Transkripsi akan segera diproses. Anda dapat memantau prosesnya di tab 'Riwayat Transkripsi'");
        this.voiceDetectionResult = page.locator('text=% file tidak berisi suara')
        this.largeSizeFileWarning = page.locator('text=File besar memerlukan waktu lebih lama')
    }

    /**
     * Click on the Google Drive button to select the file source from Google Drive.
     */
    async clickGoogleDriveBtn() {
        await this.click(this.googleDriveBtn);
    }

    /**
     * Uploads a file using the file input element.
     * @param {string} filePath - The path to the file to upload.
     */
    async uploadFile(filePath) {
        await this.setInputFiles(this.fileUploadInput, filePath);
    }

    /**
     * Fills the Google Drive link input field with the provided link.
     * @param {string} link - The Google Drive link to fill in the input.
     */
    async fillGoogleDriveLink(link) {
        await this.fill(this.googleDriveLinkInput, link);
    }

    /**
     * Sets the transcript name by filling in the transcript name input field.
     * @param {string} name - The name of the transcript.
     */
    async setTranscriptName(name) {
        await this.fill(this.transcriptNameInput, name);
    }

    /**
     * Selects "Indonesia" as the transcription language.
     */
    async setTranscriptLanguageId() {
        await this.click(this.transcriptLanguageIdBtn);
    }

    /**
     * Selects "English" as the transcription language.
     */
    async setTranscriptLanguageEn() {
        await this.click(this.transcriptLanguageEnBtn);
    }

    /**
     * Clicks the "Unggah dan Transkrip" button and waits for 10 seconds for processing.
     */
    async clickUploadAndTranscriptBtn() {
        await this.click(this.uploadAndTranscriptBtn);
        await this.waitForTimeout(10000);
    }

    /**
     * Clicks the "Transkrip Google Drive Link" button and waits for 3 seconds for processing.
     */
    async clickTranscriptGoogleDriveLinkBtn() {
        await this.click(this.transcriptGoogleDriveLinkBtn);
        await this.waitForTimeout(3000);
    }

    /**
     * Waits for 3 seconds and checks if the voice detection result message is visible.
     */
    async voiceDetectionResultVisible() {
        await this.waitForTimeout(3000);
        await this.isVisible(this.voiceDetectionResult);
    }

    /**
     * Waits for 10 seconds and checks if the large file warning message is visible.
     */
    async largeSizeFileWarningVisible() {
        await this.waitForTimeout(10000);
        await this.isVisible(this.largeSizeFileWarning);
    }

    /**
     * Waits for the appropriate warnings (no voice or large file) to be visible based on the provided warning type.
     * @param {string} warningType - The type of warning to check for ('no voice', 'large file', 'large file and no voice').
     * @throws {Error} If an invalid warning type is provided.
     */
    async largeNoVoiceWarningVisible(warningType) {
        switch (warningType) {
            case 'no voice':
                await this.voiceDetectionResultVisible();
                break;
            case 'large file':
                await this.largeSizeFileWarningVisible();
                break;
            case 'large file no voice':
                await this.voiceDetectionResultVisible();
                await this.largeSizeFileWarningVisible();
                break;
            default:
                throw new Error('Invalid warning type');
        }
    }

    /**
     * Asserts that the unsupported file error toast message is visible.
     */
    async unsupportedFileErrorVisible() {
        await this.expectVisible(this.unsupportedFileError);
    }

    /**
     * Asserts that the invalid Google Drive link error message is visible.
     */
    async invalidLinkErrorVisible() {
        await this.expectVisible(this.invalidLinkError);
    }

    /**
     * Asserts that the restricted Google Drive link error toast message is visible.
     */
    async restrictedLinkErrorVisible() {
        await this.expectVisible(this.restrictedLinkError);
    }

    /**
     * Asserts that the appropriate Google Drive link error message is visible based on the provided warning type.
     * @param {string} warningType - The type of error to check for ('invalid' or 'restricted').
     * @throws {Error} If an invalid warning type is provided.
     */
    async googleDriveLinkErrorVisible(warningType) {
        switch (warningType) {
            case 'invalid':
                await this.invalidLinkErrorVisible();
                break;
            case 'restricted':
                await this.restrictedLinkErrorVisible();
                break;
            default:
                throw new Error('Invalid warning type');
        }
    }

    /**
     * Asserts that the transcript will be processed toast message is visible.
     */
    async transcriptWillBeProcessedVisible() {
        await this.expectVisible(this.transcriptWillBeProcessedToast);
    }

    /**
     * Asserts that the "Unggah dan Transkrip" button is disabled.
     */
    async disabledUploadAndTranscriptBtn() {
        await this.expectDisabled(this.uploadAndTranscriptBtn);
    }

    /**
     * Chooses the transcription language (either 'Indonesia' or 'English').
     * @param {string} language - The language to set for transcription.
     */
    async chooseTranscriptionLanguage(language) {
        if (language === 'Indonesia') {
            await this.setTranscriptLanguageId();
        } else {
            await this.setTranscriptLanguageEn();
        }
    }
}

export { DashboardPage };
