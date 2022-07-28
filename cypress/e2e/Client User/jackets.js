/// <reference types="cypress" />

const {faker} = require('@faker-js/faker')
const { CurrentPremiumRaport } = require('../PageObjects/JacketPages/CurrentPremiumRaport')
const { DashboardPage } = require('../PageObjects/DashboardPage')
const { UnreportedJacketsPage } = require('../PageObjects/JacketPages/UnreportedJacketPage')
const { JacketDetailPage } = require('../PageObjects/JacketPages/JacketDetailPage')
const { ConfirmCplPage } = require('../PageObjects/JacketPages/ConfirmCplPage')
const { PolicyInformationPage } = require('../PageObjects/JacketPages/PolicyInformationPage')
const { PastReportsPage } = require('../PageObjects/JacketPages/PastReportsPage')
const { PastReportSingle } = require('../PageObjects/JacketPages/PastReportSingle')
const { CplDetailpage } = require('../PageObjects/CplPages/CplDetailPage')



const jacketName1 = faker.random.alphaNumeric(6) //for Jacket name
let jacketName2 = faker.random.alphaNumeric(6) //for second Jacket name

const dashboard = new DashboardPage()
const unreportedJacketsPage = new UnreportedJacketsPage()
const jacketDetailPage = new JacketDetailPage()
const confirmCplPage = new ConfirmCplPage()
const policyInformationPage = new PolicyInformationPage()
const currentPremiumRaport = new CurrentPremiumRaport()
const pastRepoortsPage = new PastReportsPage()
const pastReportSingle = new PastReportSingle()
const cplDetailPage = new CplDetailpage()

//make sure the current raport is empty then
//create Jacket and logout
before(function (){
    cy.apiLogin()
    cy.wait(2000)
    cy.cleanCurrentPremiumRaport()
    
//Create new Jacket
    cy.apiCreateJacket("J-test" + "-" + jacketName1)
    cy.logout()
  })
  
  beforeEach(() => {
    cy.apiLogin()
    
   
  })
  
  describe('Jackets - policies', () => {
  
    it('1.3.1 Edit Jackets, only one owner policy allowed, only two different policies ', () => {
    //Edit Jacket
        cy.wait(2000)
        cy.get('@jacketId').then((jacketId) =>{
        unreportedJacketsPage.editJacket(jacketId)
        })
        cy.get('h2').should('contain', 'Edit')
    //Cancel Jacket
        jacketDetailPage.getAddJacketButton()
        jacketDetailPage.getFormTypeDropdown()
        cy.get('ul.options-list__group-list>:first-child').should('have.class', 'is-disabled')
        jacketDetailPage.getPolicyModalCancelButton()
        jacketDetailPage.cancelJacketPolicy(0)
        cy.get('tbody>tr>:nth-child(4)').should('have.text', "Cancelled")
    //Add Homeowner nad Loan policy
        jacketDetailPage.addJacketPolicy('Homeowners Policy', '200000')
        cy.get('tbody>tr').should('have.length',2)
        jacketDetailPage.addJacketPolicy('Loan Policy', '100000')
        cy.get('tbody>tr').should('have.length',3)
        jacketDetailPage.validatePolicies(1, 0, 'Homeowners Policy')
        jacketDetailPage.validatePolicies(1, 2, '$200,000.00')
        jacketDetailPage.validatePolicies(1, 3, 'Issued')

        jacketDetailPage.validatePolicies(2, 0, 'Loan Policy')
        jacketDetailPage.validatePolicies(2, 2, '$100,000.00')
        jacketDetailPage.validatePolicies(2, 3, 'Issued')
        jacketDetailPage.getAddJacketButton()
        cy.get('.o-information__content-main').should('contain', 'Not possible to add more Jackets.')
        jacketDetailPage.getFormTypeDropdown()
        cy.get('ul.options-list__group-list > li').each(($li, index, array)=>{
            cy.wrap($li).should('have.class', 'is-disabled')
        })
        jacketDetailPage.getPolicyModalCancelButton()
        jacketDetailPage.getEditPolicyJacketButton(1)
        cy.get('div.modal form input').clear().type("150000{enter}")
        jacketDetailPage.validatePolicies(1,2,'$150,000.00')  
   })
   it('1.3.2 Add Jacket to report, no CPL, add endorsments ', () => {
    
    //Add to report
        cy.wait(2000)
        dashboard.visitUnreportedJackets()
        cy.wait(2000)
        unreportedJacketsPage.reportJacket(0)
        cy.get('table.o-table-information > :nth-child(1) > .o-table-information__value').should('have.text',"J-test" + "-" +jacketName1)
    //Select "No CPL"

        confirmCplPage.getRadioButton(0)
        confirmCplPage.getNextButton()
        cy.wait(3000)
    //Add Endorsment
        policyInformationPage.addEndorsment('CPLB')
        cy.wait(2000)
        
    //Save policy
        policyInformationPage.checkRateType()
        policyInformationPage.savePolicy()
        currentPremiumRaport.validatePolicyCount("1")
        currentPremiumRaport.generatePolicyReport()
        cy.wait(2000)
        pastRepoortsPage.getPastRepor(0)
        pastReportSingle.validateAgentFile("J-test" + "-" +jacketName1)
   })    
   it('1.3.3 Create new Jacket, Add new CPL, Generate Report ', () => {

//check if first unreported jacket is created by APi from before hook. 
//In case this test is run solo, there is no need to create additional jacket  
        
        cy.wait(2000)        
        dashboard.visitUnreportedJackets()   
        cy.wait(2000)
        cy.get(`tbody > :nth-child(1) > :nth-child(1)`).invoke('text').then((text) => {

        if(text!== ("J-test" + "-" +jacketName1)){
            cy.apiCreateJacket("J-test" + "-" + jacketName2)
            cy.wait(2000)
        } else {
            jacketName2 = jacketName1
        }   
// Add to report
        cy.reload()
        cy.wait(2000)
        unreportedJacketsPage.reportJacket(0)
        cy.get('table.o-table-information > :nth-child(1) > .o-table-information__value').should('have.text',"J-test" + "-" +jacketName2)
//Add new CPL
        confirmCplPage.getRadioButton(1)
        confirmCplPage.getNextButton()
        cy.wait(2000)
        cplDetailPage.selectOver500_No()
        cplDetailPage.borowerName('Cypress-Borrower')
        cplDetailPage.selectDate()
        cplDetailPage.addCoveredParty_fromLenders()
        cy.wait(2000)
        cy.get('.o-table-list').find('tr').should('have.length',2)
        cplDetailPage.getFinalizeButton()
        cy.wait(5000)
        cy.get('table').eq(1).within(()=>{
        cy.get(':nth-child(3) > :nth-child(2)').should('contain','$150,300.00')
        }) 
        policyInformationPage.checkRateType()
        policyInformationPage.savePolicy()
        currentPremiumRaport.validatePolicyCount("1")
        currentPremiumRaport.generatePolicyReport()
        cy.wait(2000)
        pastRepoortsPage.getPastRepor(0)  
        pastReportSingle.validateAgentFile("J-test" + "-" +jacketName2)
        })
    })    
})