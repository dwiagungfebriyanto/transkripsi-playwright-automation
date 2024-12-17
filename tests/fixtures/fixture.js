/**
 * This code extends the base test functionality provided by Playwright BDD
 * by creating custom test functions that initialize page objects for different
 * pages and modals in the application.
 * 
 * It imports page objects from a `Pages` module and uses them to create 
 * instances of these page objects in the test context. Each page object is 
 * associated with a specific part of the application, like the landing page, 
 * dashboard page, and modals.
 * 
 * The `createTestFunction` helper function is used to initialize each page 
 * class with the current `page` object from Playwright and pass it to the 
 * `use` function, allowing the test to access the corresponding page object 
 * during the test execution.
 */

import { test as base } from 'playwright-bdd';
import * as Pages from './pages';

// Destructure the individual page objects from the Pages module.
const { 
    LandingPage, 
    DashboardPage, 
    TranscriptionHistoryPage,
    TopUpModal,
    TransactionHistoryPage,
    Navbar,
    MidtransModal
} = Pages;

/**
 * Helper function to create a custom test function that initializes a 
 * page object for a given page class.
 * @param {class} PageClass - The page class to instantiate.
 * @returns {function} A test function that initializes the page object.
 */
const createTestFunction = (PageClass) => async ({page}, use) => {
    // Instantiate the page object and pass it to the test context.
    await use(new PageClass(page));
}

// Extend the base Playwright BDD test with custom page objects.
export const test = base.extend({
    landingPage: createTestFunction(LandingPage),
    dashboardPage: createTestFunction(DashboardPage),
    transcriptionHistoryPage: createTestFunction(TranscriptionHistoryPage),
    topUpModal: createTestFunction(TopUpModal),
    transactionHistoryPage: createTestFunction(TransactionHistoryPage),
    navbar: createTestFunction(Navbar),
    midtransModal: createTestFunction(MidtransModal)
});
