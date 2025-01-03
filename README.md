# Transkripsi.id Playwright Automation

This project automates the testing of the [Transkripsi.id](https://transkripsi.id/) web application using [Playwright](https://playwright.dev/) and BDD (Behavior Driven Development) with [`playwright-bdd`](https://vitalets.github.io/playwright-bdd/#/).

## Requirements

Before running the tests, make sure you have the following installed:
- **Node.js**
- **npm**

Additionally, you will need a Google account. The first time you run the tests, a global setup will be executed to save your login information.

## Setup Instructions

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/dwiagungfebriyanto/transkripsi-playwright-automation.git
   cd transkripsi-playwright-automation
   ```
2. Install the dependencies
    ```bash
    npm install
    ```

## Setting Up the Test Credentials

After cloning the repository, you need to create a `test-user.js` file that contains your test credentials. 

1. Copy `test-user.example.js` to `test-user.js`.
2. Open `test-user.js` and replace the `userLogin` with your Google email and `userPass` with your Google password.
    ```javascript
    // Replace these with your actual credentials
    const userLogin = 'your-login-here';
    const userPass = 'your-password-here';

    // Export the test user credentials for use in tests
    const testUser = {
        login: userLogin,
        password: userPass,
    };

    export { testUser };
    ```

## Running the Tests
- To run the tests in **headless** mode:
    ```bash
    npm run test
    ```
- To run the tests in **headed** mode:
    ```bash
    npm run test-h
    ```
- To run the tests by reusing signed in state (**skipping authentication step**):
    ```bash
    $env:SKIP_AUTH = "true"
    npm run test
    ```

## Authentication Process
1. The authentication process, powered by the Playwright `stealth` plugin, is executed before the tests begin. This process is managed via the `globalSetup` option in the `playwright.config.js` file. The authentication script is located in `lib/global-setup.js` and requires the user's login credentials (username and password).
2. Once authenticated, the signed-in session is saved in the `setup/storage-state.json` file.
3. After successful authentication, the tests will run and utilize the saved signed-in state to avoid re-authenticating on every test execution.
4. To speed up future test runs, you can skip the authentication process by setting the `SKIP_AUTH=true` option in the CLI. This option will work if the signed-in state file (`setup/storage-state.json`) already exists.
5. To re-run the authentication process, set `SKIP_AUTH=false`. This will force the system to go through the authentication process again before running the tests.

The authentication process implemented in this project is based on the work done by [adequatica/ui-testing-auth](https://github.com/adequatica/ui-testing-auth).

### Additional Information
- To test in a different environment, modify the `baseURL` in the `playwright.config.js` file.
- Ensure that the account used for testing has at least 25 credits available to run the tests.
- The voucher codes might need to be updated as they could be tied to specific accounts.
- To run a specific scenario or feature, the `@only` tag can be used to target it. For example:
    ```gherkin
    @only
    Scenario: Successful login using Google Account
        Given User is on the landing page
        When User login using Google Account
        Then User should be redirected to dashboard page
    ```
    Similarly, to skip a specific scenario or feature, the `@skip` tag can be used:
    ```gherkin
    @skip
    Feature: Login

    This feature ensures that users can log in to the application using 
    their Google account.

    Scenario: Successful login using Google Account
        Given User is on the landing page
        When User login using Google Account
        Then User should be redirected to dashboard page
    ```
    For more information about tags, click [here](https://vitalets.github.io/playwright-bdd/#/writing-features/special-tags).
