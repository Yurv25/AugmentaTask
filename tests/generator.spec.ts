/***
 * Augmenta Task - Test readme generator page
 * Author: Yuri Valverde
 * Date: 09/11/2024
 * Various test that verify functionality of the github profile readme generator
 * The test can be run in Chrome and Firefox, store the test data under a data directory, some helper function
 * under the helpers directory and the actions within the pages is under the directory pages.
 * Used a Page Object Model approach.
 */

import test, { expect } from "@playwright/test";
import GeneratorPage from "../pages/GeneratorPage";
import GithubPage from "../pages/GithubPage";
import { abbreviateNumber } from "../helpers/helperFunctions";
import testData from "../data/generator_data.json"


test("Generate readme file", async ({page})=>{

    const generatorPage =  new GeneratorPage(page)
    
    await generatorPage.navigateToGeneratorPage();
    await generatorPage.enterTitleName(testData.title)
    await generatorPage.editSubtitle(testData.subtitle)

    await generatorPage.fillCurrentWork(testData.currentWork,testData.linkWork)
    await generatorPage.fillCollaborateOn(testData.collaborateOn,testData.collabLink)

    await generatorPage.selectSkills()

    await generatorPage.addSocial(testData.social)
    await generatorPage.displayTopSkills(testData.color)

    await generatorPage.clickGenerateReadme()

    //verify generated readme markup
    page.waitForLoadState('domcontentloaded')
    const markdown = await generatorPage.getMarkdown()
    await expect(markdown).toContainText("A passionate QA Engineer from Canada")
    await expect(markdown).toContainText('alt="flutter"')


});

test("Validate github repository stars", async ({page})=>{

    //****NOTE****
    //For all my testing it was all working fine and looks like the page reached the limit
    // of API calls to GitHub which is the one that displays the number of stars in the repo.
    // If that api responds 403 (reached the limit) the number displayed will be 0 on the generator website
    // making this test to fail.

    const generatorPage =  new GeneratorPage(page)

    await generatorPage.navigateToGeneratorPage();
    let starsNumGenerator = await generatorPage.getStarsRepoNumber()
    starsNumGenerator = abbreviateNumber(starsNumGenerator) //let's shorten the number to make sure it's the same as in GitHub 
    
    //Wait for the new tab to be generated and also that we are taken to the GitHub page
    const [githubPageTab] = await Promise.all([
        page.waitForEvent("popup"),
        generatorPage.navigateToGithub()
    ])
    
    await githubPageTab.waitForLoadState()
    await expect(githubPageTab).toHaveTitle("GitHub - rahuldkjain/github-profile-readme-generator: 🚀 Generate GitHub profile README easily with the latest add-ons like visitors count, GitHub stats, etc using minimal UI.")
    const githubPage = new GithubPage(githubPageTab)
    const starsNumGithub = await githubPage.getStarsNumber()

    expect(starsNumGenerator).toBeCloseTo(starsNumGithub,1)
});

test("Upload json file", async ({page})=>{

    const generatorPage =  new GeneratorPage(page)
   
    await generatorPage.navigateToGeneratorPage();
    await generatorPage.uploadJsonFile()
    await generatorPage.clickRestore()
    page.waitForLoadState('domcontentloaded')

    const projName= await generatorPage.getCurrentWorkField()
    const funFactLabel = await generatorPage.getFunFactLabel()

    expect(projName).toEqual("project name")
    expect(funFactLabel).toEqual("⚡ Modified Facts")
});