/// <reference types="cypress" />
const {faker} = require('@faker-js/faker')
const { CplDetailpage } = require('../PageObjects/CplPages/CplDetailPage')
const { UnreportedCplsPage } = require('../PageObjects/CplPages/UnreportedCplsPage')
const { DashboardPage } = require('../PageObjects/DashboardPage')


const cplName = faker.random.alphaNumeric(7)
const dashboard = new DashboardPage()
const unreportedCplsPage = new UnreportedCplsPage()

const cplDetailPage = new CplDetailpage()
//creaate CPL and logout
before(function() {
    cy.apiLogin()
    cy.wait(3000)
    cy.apiCreateCpl(cplName)
    cy.logout()
  })
  
beforeEach(() => {
   cy.apiLogin()
})
  
describe('CPL', () => {
  
  it('1.4.1 Edit CPL, Add covered party and delete ', () => {
      cy.wait(2000)
      dashboard.visitUnreportedCpls()
      unreportedCplsPage.validateCpl(0,0,"C-test-" +cplName)
      unreportedCplsPage.getUnreportedCpl(0)
      cy.wait(2000)
      cplDetailPage.getCoveredPartyButton().click()
      cplDetailPage.getAutofilFromCplButton().click()
      cplDetailPage.getModalSubmitButton().click()
      cy.get('tbody>tr').should('have.length',2)
      cplDetailPage.validateCoveredparties(1,0,'Buyer/Borrower')
      cplDetailPage.validateCoveredparties(1,1,'Cypress-Borrower')
      cplDetailPage.getCoveredPartiesDeleteButton(1).click()
      cplDetailPage.getYesDeletePartyButton().click()
      cy.get('tbody>tr').should('have.length',1)
      cplDetailPage.saveCpl()
  })

  it.skip('1.4.2 CPL letter ', () => {
    cy.wait(2000)
    dashboard.visitUnreportedCpls()
    unreportedCplsPage.getUnreportedCpl(0)
    cy.wait(2000)
  
    cy.url().then(url => {
      const currentURL = url.split('/');
      const id = currentURL[8]
      cy.intercept({
        method: 'GET',
        url: 'https://generaltitlewebexternalapi-stage.azurewebsites.net/api/cpl/'+ id + '/letter' //edit url when new API implemented on staging
        }).as('letter')
        cy.get('button').contains('View CPL Letter ').click()
        cy.wait('@letter').its('response').then((res) => {
          expect(res.headers).to.include({
            'content-type': 'application/pdf'
          
          })                //to be edited (what should response iclude)
      })
    })
  })
})