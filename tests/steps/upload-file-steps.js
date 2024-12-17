import { createBdd } from "playwright-bdd";
import { test } from '../fixtures/fixture';
import { expect } from '@playwright/test';
import userCredit from './user-credit';

const { setCredit, creditPlusOne, creditMinusOne, resetCredit, getCredit } = userCredit;
const { Given, When, Then } = createBdd(test);

Given('User is on the dashboard page', async ({ dashboardPage, navbar }) => {
    // Navigate to the dashboard page
    await dashboardPage.navigateTo(dashboardPage.url);
    await dashboardPage.hasUrl(dashboardPage.url);
});
  
When('User uploads a file: {string} with {string} as the title', async ({ dashboardPage }, filePath, title) => {
    // Select a file
    await dashboardPage.uploadFile(filePath);
    await dashboardPage.waitOneSec();
    // Set the title
    await dashboardPage.setTranscriptName(title);
});

When('User uploads a large file', async ({ dashboardPage }) => {
    // Select a large file
    await dashboardPage.uploadFile('./test-assets/Large-File.mp3');
    // Set the title
    await dashboardPage.setTranscriptName('Test Large File');
});

When('User chose a {string} for transcription result', async ({ dashboardPage }, language) => {
    // Select the transcription language
    await dashboardPage.chooseTranscriptionLanguage(language);
});

When('User does not upload a file', async ({}) => {
    // No action needed
});

When('User uploads a Google Drive link: {string} with {string} as the title', async ({ dashboardPage }, link, title) => {
    // Upload a file via Google Drive link
    await dashboardPage.clickGoogleDriveBtn();
    await dashboardPage.waitOneSec();
    await dashboardPage.fillGoogleDriveLink(link);
    await dashboardPage.waitOneSec();
    // Set the title
    await dashboardPage.setTranscriptName(title);
});

When('User uploads an restricted Google Drive link', async ({ dashboardPage }) => {
    const restrictedLink = 'https://drive.google.com/file/d/1J2nhPtNbwWb_qNmu7qMntj7xT1_X-pNq/view?usp=sharing';
    // Upload a restricted Google Drive link
    await dashboardPage.clickGoogleDriveBtn();
    await dashboardPage.fillGoogleDriveLink(restrictedLink);
});

// And User clicks upload button
When('User clicks upload button', async ({ dashboardPage, navbar }) => {
    await dashboardPage.waitOneSec();
    // Save the current credit
    setCredit(await navbar.getUserCredit());
    // Click Unggah dan Transkrip button
    await dashboardPage.clickUploadAndTranscriptBtn();
});

// And User clicks Google Drive upload button
When('User clicks Google Drive upload button', async ({ dashboardPage, navbar }) => {
    // Save the current credit
    setCredit(await navbar.getUserCredit());
    // Click the Transkrip Link Google Drive button
    await dashboardPage.clickTranscriptGoogleDriveLinkBtn();
});

Then('User should be redirected to transcript history page', async ({ dashboardPage, transcriptionHistoryPage }) => {
    // Check if the file is successfully uploaded
    await dashboardPage.transcriptWillBeProcessedVisible();
    await dashboardPage.waitUntilRedirect();
    // Check if the URL is correct
    await transcriptionHistoryPage.hasUrl(transcriptionHistoryPage.url);
});
  
Then('User should see an error message', async ({ dashboardPage }) => {
    // Check if the error message is visible
    await dashboardPage.unsupportedFileErrorVisible();
});

Then('User should see a {string} Google Drive link warning message', async ({ dashboardPage }, warningType) => {
    // Check if the correct warning message is visible
    await dashboardPage.googleDriveLinkErrorVisible(warningType);
});
  
Then('The upload button should be disabled', async ({ dashboardPage }) => {
    // Check if the Unggah dan Transkrip button is disabled
    await dashboardPage.disabledUploadAndTranscriptBtn();
});

Then('User should see a {string} warning message', async ({ dashboardPage }, warningType) => {
    // Check if the correct warning message is visible
    await dashboardPage.largeNoVoiceWarningVisible(warningType);
});

// And The title should be displayed in the transcript history page
Then('The {string} should be displayed in the transcript history page', async ({ transcriptionHistoryPage, navbar }, title) => {
    // Check if the title is visible
    await transcriptionHistoryPage.transcriptionTitleVisible(title);
    // Deduct 1 credit
    creditMinusOne();
    // Check if the credit is deducted by 1
    await expect(await navbar.getUserCredit()).toBe(getCredit());
});
