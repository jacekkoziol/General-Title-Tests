/// <reference types="cypress" />
const {faker} = require('@faker-js/faker')
const { CplDetailpage } = require('../PageObjects/CplPages/CplDetailPage')
const { CplSidebar } = require('../PageObjects/CplPages/CplSidebar')
const { DashboardPage } = require('../PageObjects/DashboardPage')
const { NewCplPage } = require('../PageObjects/CplPages/NewCplPage')
const { UnreportedCplsPage } = require('../PageObjects/CplPages/UnreportedCplsPage')



const text1 = faker.random.alphaNumeric(6)


const dashboard = new DashboardPage() 
const newCplPage =  new NewCplPage()
const cplDetailPage = new CplDetailpage()
const cplSidebar = new CplSidebar()
const unReportedCplsPage = new UnreportedCplsPage()

beforeEach(function() {
    cy.login()
})
  
  describe('Basic Test Jacket, CPL', () => {
  
    it('Create CPL', () =>{
        cy.wait(2000)
        dashboard.goToCPLs()
        newCplPage.createNewCPL("C-test" + "-" +text1)
        cplDetailPage.selectOver500_No()
        cplDetailPage.borowerName('Cypress-Borrower')
        cplDetailPage.addCoveredParty_fromLenders()
        cy.get('.o-table-list').find('tr').should('have.length',2)
        cplDetailPage.saveCpl()
        cplSidebar.goToUnreportedCpls()
        unReportedCplsPage.validateCpl(0,0,"C-test" + "-" +text1) 
    })
    
  })