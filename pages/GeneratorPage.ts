import { expect, Page } from "@playwright/test";


export default class GeneratorPage{

    private readonly titlename="#title-name"
    private readonly subtitle="#subtitle"
    
    private readonly projectWork = "#currentWork"
    private readonly linktoWork = "#currentWork-link"
    private readonly collabProject = "#collaborateOn"
    private readonly collabLink = "#collaborateOn-link"
    
    //checkboxes with skills
    private readonly typescryptcheck = 'label[for="typescript"]'
    private readonly javacheck = 'label[for="java"]'
    private readonly reactcheck = 'label[for="react"]'
    private readonly css3check = 'label[for="css3"]'
    private readonly fluttercheck = 'label[for="flutter"]'
    private readonly dartcheck = 'label[for="dart"]'

    private readonly githubUsername= "#github"
    //Top skill Add-On
    private readonly skillsAddOn = 'label[for="top-languages"]'
    private readonly btnTopSkills= "#top-languages-open-btn"
    private readonly titleColor = "#top-lang-title-color"

    private readonly generatedMarkdown = "#markdown-content"
    private readonly starsNumber = 'a[aria-label*="Star rahuldkjain/github-profile-readme-generator"] span.github-count'
    //upload json file related paths
    private readonly filePath="data/data.json"
    private readonly uploadFile= 'input[name="vacancyImageFiles"]'
    private readonly btnRestore='button:has-text("Restore")'

    private readonly funFactLabel="#funFact-prefix"

    constructor(private page: Page){}

    async navigateToGeneratorPage (){
        await this.page.goto("/gh-profile-readme-generator/", {
            timeout: 60000,  // 60 seconds
            waitUntil: 'domcontentloaded'
        });
    }

    async enterTitleName(title) {
        await this.page.locator(this.titlename).fill(title)
    }

    async editSubtitle(subtitleText){
        await this.page.fill(this.subtitle, subtitleText)
    }

    async fillCurrentWork(work, link){
        
        await this.page.fill(this.projectWork,work)
        await this.page.fill(this.linktoWork,link)
    }

    async fillCollaborateOn(collab, link){

        await this.page.fill(this.collabProject,collab)
        await this.page.fill(this.collabLink,link)
    }

    async selectSkills(){

        await this.page.click(this.typescryptcheck)
        await this.page.click(this.javacheck)
        await this.page.check(this.reactcheck)
        await this.page.check(this.css3check)
        await this.page.check(this.fluttercheck)
        await this.page.check(this.dartcheck)  
    }

    async addSocial(gitUser){
        await this.page.fill(this.githubUsername,gitUser)
    }

    async displayTopSkills(color){
        await this.page.click(this.skillsAddOn)
        await this.page.click(this.btnTopSkills)
        await this.page.fill(this.titleColor,color)
    }

    async clickGenerateReadme(){
        await this.page.click('text="Generate README"');
    }

    async getMarkdown(){
        await this.page.waitForSelector(this.generatedMarkdown, { state: "visible" });
        return this.page.locator(this.generatedMarkdown)
    }

    async getStarsRepoNumber(){
        await this.page.waitForLoadState("networkidle")
        await this.page.waitForSelector(this.starsNumber)
        const starsContent = await this.page.locator(this.starsNumber).textContent() ?? ""
        return parseFloat(starsContent.replace(/[^\d.]/g, ''))//remove any text not wanted to get a full number
    }

    async navigateToGithub(){
        await this.page.waitForSelector(this.starsNumber)
        await this.page.locator(this.starsNumber).click()
    }

    async uploadJsonFile(){
        await this.page.setInputFiles(this.uploadFile, this.filePath); 
    }

    async clickRestore(){
        await this.page.locator(this.btnRestore).click();
    }

    async getFunFactLabel(){
        return await this.page.locator(this.funFactLabel).inputValue()
    }

    async getCurrentWorkField(){
        await this.page.waitForSelector(this.projectWork)
        return await this.page.locator(this.projectWork).inputValue()
    }

}