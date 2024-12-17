import { BasePage } from './base-page';
import { baseURL } from '../../playwright.config';

class LandingPage extends BasePage {
    constructor(page) {
        super(page);
        this.url = `${baseURL}/`;
        // Locator for the Google Sign-In button on the landing page
        this.googleSignInBtn = page.locator('text=Masuk dengan Google');
    }

    /**
     * Clicks the "Masuk dengan Google" (Sign in with Google) button.
     */
    async clickGoogleSignInBtn() {
        await this.click(this.googleSignInBtn);
    }
}

export { LandingPage };
