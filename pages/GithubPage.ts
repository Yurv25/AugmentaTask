import { Page } from "@playwright/test";

export default class GithubPage{

    constructor(private page: Page) {}

    private readonly starsNumber="#repo-stars-counter-star";

    async navigateToGithub(){

    }
    async getStarsNumber(){
        const starsText = await this.page.locator(this.starsNumber).textContent() ?? ""
        const cleanText = starsText.replace(/[^\d.k]/g, '');
        return parseFloat(cleanText.replace('k', ''));
    }
    
}