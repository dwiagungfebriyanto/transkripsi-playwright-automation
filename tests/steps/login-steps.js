import { createBdd } from "playwright-bdd";
import { test } from '../fixtures/fixture';

const { Given, When, Then } = createBdd(test);

Given('User is on the landing page', async ({ landingPage }) => {
    // Navigate to the landing page
    await landingPage.navigateTo('/');
    // Check if the URL is correct
    await landingPage.hasUrl(landingPage.url);
});
  
When('User login using Google Account', async ({ landingPage }) => {
    // Click on the Masuk dengan Google button
    await landingPage.clickGoogleSignInBtn();
});
  
Then('User should be redirected to dashboard page', async ({ dashboardPage, navbar }) => {
    // Check if the URL is correct
    await dashboardPage.hasUrl(dashboardPage.url);
    // Check if the navbar elements are visible
    await navbar.creditVisible();
    await navbar.menuBtnVisible();
});
