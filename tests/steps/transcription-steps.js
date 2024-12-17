import { createBdd } from "playwright-bdd";
import { test } from '../fixtures/fixture';
import { expect } from '@playwright/test';
import userCredit from './user-credit';

const { setCredit, creditPlusOne, creditMinusOne, resetCredit, getCredit } = userCredit;
const { Given, When, Then } = createBdd(test);

Given('User has one successful transcription', async ({ dashboardPage, transcriptionHistoryPage, navbar }) => {
    const fileLink = 'https://drive.google.com/file/d/1E4h2nJE0w_Nd-9A7ttLbHBiSjTMcI_gZ/view?usp=sharing'
    const title = 'Test Transkripsi';
    // Navigate to the dashboard page
    await dashboardPage.navigateTo(dashboardPage.url);
    await dashboardPage.hasUrl(dashboardPage.url);
    // Upload a file via Google Drive link
    await dashboardPage.clickGoogleDriveBtn();
    await dashboardPage.waitOneSec();
    await dashboardPage.fillGoogleDriveLink(fileLink);
    await dashboardPage.waitOneSec();
    await dashboardPage.setTranscriptName(title);
    // Save the current credit
    setCredit(await navbar.getUserCredit());
    // Process the transcription
    await dashboardPage.clickTranscriptGoogleDriveLinkBtn();
    await dashboardPage.transcriptWillBeProcessedVisible();
    // Check if the file is transcribed successfully
    await transcriptionHistoryPage.waitUntilRedirect();
    await transcriptionHistoryPage.hasUrl(transcriptionHistoryPage.url);
    await transcriptionHistoryPage.transcriptionTitleVisible(title);
    await transcriptionHistoryPage.succesStatusVisible();
    // Deduct 1 credit
    creditMinusOne();
    // Check if the credit is deducted by 1
    await expect(await navbar.getUserCredit()).toBe(getCredit());
});

When('User uploads a Google Drive link', async ({ dashboardPage }) => {
    // Unsupported file type
    const pdfLink = 'https://drive.google.com/file/d/1ys1ZLxX_aXmACeRb_FoTWOkDS4_jM9Mp/view?usp=sharing'
    // Upload a file via Google Drive link
    await dashboardPage.clickGoogleDriveBtn();
    await dashboardPage.waitOneSec();
    await dashboardPage.fillGoogleDriveLink(pdfLink);
    await dashboardPage.waitOneSec();
    await dashboardPage.setTranscriptName('Test GDrive Failed Expected');
});

When('User downloads the file', async ({ transcriptionHistoryPage }) => {
    // Click the download button
    await transcriptionHistoryPage.clickDownloadBtn();
});

When('User submits a rating', async ({ transcriptionHistoryPage }) => {
    // Submit a rating
    await transcriptionHistoryPage.clickRatingBtn();
    await transcriptionHistoryPage.clickSubmitRatingBtn();
});

When('User clicks the play button', async ({ transcriptionHistoryPage }) => {
    // Play audio
    await transcriptionHistoryPage.clickAudioPlayBtn();
});

When('User searches a keyword: {string}', async ({ transcriptionHistoryPage }, keyword) => {
    // Search for a keyword
    await transcriptionHistoryPage.fillSearchInput(keyword);
});

When('User closes the transcription result', async ({ transcriptionHistoryPage }) => {
    // Close the transcription result panel
    await transcriptionHistoryPage.clickCloseTranscriptBtn();
});

// And User choose "<language>" as the transcription result language
When('User choose {string} as the transcription result language', async ({ dashboardPage }, language) => {
    // Select the transcription language
    await dashboardPage.chooseTranscriptionLanguage(language);
});

Then('Uploaded file should be transcribed with {string} as the title', async ({ dashboardPage, transcriptionHistoryPage, navbar }, title) => {
    // Check if the file succesfully uploaded
    await dashboardPage.transcriptWillBeProcessedVisible();
    await transcriptionHistoryPage.waitUntilRedirect();
    await transcriptionHistoryPage.hasUrl(transcriptionHistoryPage.url);
    // Deduct 1 credit
    creditMinusOne();
    // Check if the credit is deducted by 1
    await expect(await navbar.getUserCredit()).toBe(getCredit());
    // Check if the file is transcribed successfully
    await transcriptionHistoryPage.transcriptionTitleVisible(title);
    await transcriptionHistoryPage.succesStatusVisible();
});

Then('File failed to be transcribed', async ({ transcriptionHistoryPage, navbar }) => {
    // Check if the file succesfully uploaded
    await transcriptionHistoryPage.waitUntilRedirect();
    await transcriptionHistoryPage.hasUrl(transcriptionHistoryPage.url);
    // Check if the file failed to be transcribed
    await transcriptionHistoryPage.creditReturnBadgeVisible();
    // Deduct 1 credit
    creditMinusOne();
    // Check if the credit is deducted by 1
    await expect(await navbar.getUserCredit()).toBe(getCredit());
});

Then('The {string} file should be downloaded', async ({ transcriptionHistoryPage }, fileType) => {
    // Download the file
    await transcriptionHistoryPage.downloadFile(fileType);
});

Then('The rating should be submitted', async ({ transcriptionHistoryPage }) => {
    // Check if the rating is submitted
    await transcriptionHistoryPage.ratingSentModalVisible();
});

Then('The audio file should be played', async ({ transcriptionHistoryPage }) => {
    // Check if the audio is playing
    await expect(await transcriptionHistoryPage.isAudioPlaying()).toBeTruthy();
});

Then('The audio should be paused', async ({ transcriptionHistoryPage }) => {
    // Check if the audio is paused
    await expect(await transcriptionHistoryPage.isAudioPlaying()).toBeFalsy();
});

Then('Is the keyword: {string} searched appears: {string}', async ({ transcriptionHistoryPage }, keyword, result) => {
    // Check if the keyword is found or not
    const isKeywordFound = await transcriptionHistoryPage.getSearchResult(keyword);
    // Convert "true" or "false" string to a boolean
    const expectedResult = result.toLowerCase() === 'true';
    // Compare the boolean result of searchResult with the expected boolean value
    await expect(isKeywordFound).toBe(expectedResult);
});

// And The summary should be in "<language>"
Then('The summary should be in {string}', async ({ transcriptionHistoryPage }, language) => {
    // Check if the summary is in the selected language
    await transcriptionHistoryPage.clickSummaryBtn();
    const summaryText = await transcriptionHistoryPage.getSummaryText();
    await transcriptionHistoryPage.validateSummaryLanguage(summaryText, language);
});

// And The credit should be returned
Then('The credit should be returned', async ({ transcriptionHistoryPage, navbar }) => {
    // Click the card to return the credit
    await transcriptionHistoryPage.clickCreditReturnBadge();
    await transcriptionHistoryPage.creditReturnedToastVisible();
    // Add 1 credit
    creditPlusOne();
    await transcriptionHistoryPage.waitOneSec();
    // Check if the credit is added by 1
    await expect(await navbar.getUserCredit()).toBe(getCredit());
});
