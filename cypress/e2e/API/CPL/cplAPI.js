/// <reference types="cypress" />
const {faker} = require('@faker-js/faker')
const { CplDetailpage } = require('../../PageObjects/CplPages/CplDetailPage')
const { UnreportedCplsPage } = require('../../PageObjects/CplPages/UnreportedCplsPage')
const { DashboardPage } = require('../../PageObjects/DashboardPage')

const dashboard = new DashboardPage()
const unreportedCplsPage = new UnreportedCplsPage()
const cplDetailPage = new CplDetailpage()

const cplName = faker.random.alphaNumeric(7)


before(function(){
  cy.apiLogin()
  cy.wait(3000)
  cy.getToken()
  cy.get('@token').then(token => {
    cy.request({
      method: 'POST',
      url : 'https://generaltitlewebexternalapi-stage.azurewebsites.net/api/cpl',
      headers: {
        Authorization : token
      },
      body: {
        "externalReferenceNumber":  'API-C-test-'+cplName,
        "effectiveDate": "2022-04-23T12:36:00.637Z",
        "loanNumber": null,
        "isOver500k": false,
        "borrowerName": "Tester",
        "propertyAddress": {
          "description": "Additional Address",
          "address1": " Address 1 ",
          "address2": "Address 2",
          "address3": null,
          "county": " Adams",
          "city": "Rome",
          "state": "OH",
          "zipCode": "12345",
          "contact": null,
          "email": null,
          "phoneNumber": null,
          "faxNumber": null,
          "isPrimary": false
        },
        "coveredParties": [
          {
            "coverageType": "Lender",
            "address1": "Address 1",
            "address2": " Address 2",
            "name": " Tester ",
            "city": "Rome",
            "state": "OH",
            "zipCode": "12345",
            "relatedLenderId": 0
          },
          {
            "coverageType": "Buyer/Borrower",
            "address1": "Address 1",
            "address2": "Address 2",
            "name": "Tester2",
            "city": "Rome",
            "state": "OH",
            "zipCode": "12345",
            "relatedLenderId": 0
          }
        ]
      }
    }).then(resp =>{
      cy.wrap(resp.body.data.cplId).as('cplId')
      })
    })
  cy.logout()
})
beforeEach(() => {
   cy.apiLogin()
})
  
describe('API Tests - CPL', () => {

  it('3.1.1 Create - check if CPL was created propperly', function ()  {
    cy.wait(3000)
    dashboard.visitUnreportedCpls()
    unreportedCplsPage.validateCpl(0,0,"API-C-test-" +cplName)
    unreportedCplsPage.getUnreportedCpl(0)
    cy.wait(2000)
    cy.get('tbody > tr').should('have.length', 2)
    cy.get('#input_borrowerName').should('have.value', 'Tester')
  //Get CPL id
    cy.url().invoke('split','/').its(8).as('urlId')
    cy.get('@urlId').then(id => expect(id).contain(this.cplId))
        
  })
  it('3.1.2 Update , Get ', function () {
    cy.wait(3000)
    cy.getToken()
    cy.get('@token').then(token => {
      cy.request({
        method: 'PUT',
        url : 'https://generaltitlewebexternalapi-stage.azurewebsites.net/api/cpl/'+this.cplId,
        headers: {
          Authorization : token
        },
        body: {
        "externalReferenceNumber":  'API-C-test-'+cplName,
        "effectiveDate": "2022-04-23T12:36:00.637Z",
        "loanNumber": null,
        "isOver500k": false,
        "borrowerName": "API Tester",
        "propertyAddress": {
          "description": "Additional Address",
          "address1": " Address 1 ",
          "address2": "Address 2",
          "address3": null,
          "county": " Adams",
          "city": "Rome",
          "state": "OH",
          "zipCode": "12345",
          "contact": null,
          "email": null,
          "phoneNumber": null,
          "faxNumber": null,
          "isPrimary": false
        },
        "coveredParties": [
          {
            "coverageType": "Lender",
            "address1": "Address 1",
            "address2": " Address 2",
            "name": " New ",
            "city": "Rome",
            "state": "OH",
            "zipCode": "12345",
            "relatedLenderId": 0
          },
          {
            "coverageType": "Buyer/Borrower",
            "address1": "Address 1",
            "address2": "Address 2",
            "name": "New2",
            "city": "Rome",
            "state": "OH",
            "zipCode": "12345",
            "relatedLenderId": 0
          }
        ]
        }
      })
//Get CPL data (API)
      cy.request({
        method: 'GET',
        url : 'https://generaltitlewebexternalapi-stage.azurewebsites.net/api/cpl/'+this.cplId,
        headers: {
          Authorization : token
        }
      }).then(
        (response) => {
          expect(response.body.data).to.have.property('externalReferenceNumber',  'API-C-test-'+cplName)
          expect(response.body.data).to.have.property('borrowerName',  'API Tester')
          
        })
      })//end get(@token)
    dashboard.visitUnreportedCpls()
    cy.wait(2000)
    unreportedCplsPage.getUnreportedCpl(0)
    cy.wait(2000)
    cy.get('#input_borrowerName').should('have.value', 'API Tester') 
    cplDetailPage.saveCpl()
  })
  it('3.1.2 CPL letter ', function() {
    cy.wait(2000)
    cy.getToken()
    cy.get('@token').then(token => {
      cy.request({
        method: 'GET',
        url: 'https://generaltitlewebexternalapi-stage.azurewebsites.net/api/cpl/'+this.cplId+'/letter', 
        headers: {
          Authorization : token
        }
      }).then((resp) => {
          expect(resp).to.include({
            'status': 200
          }) 
          expect(resp.body).to.include({'status' : 'success'} )               //to be edited (what should response iclude)
      })
    })//end get(@token)
  })

  it('3.1.3 Cancel', function () {  
    cy.wait(2000)
    cy.getToken()
    cy.get('@token').then(token => {  
      cy.request({
            method: 'PUT',
            url : 'https://generaltitlewebexternalapi-stage.azurewebsites.net/api/cpl/'+this.cplId+'/cancel',
            headers: {
            Authorization : token
            }
      })  
    })
    dashboard.visitFindCpl()
    cy.wait(2000)
    cy.get('tbody > :nth-child(1)' ).within (()=>{
      cy.get(':nth-child(5)').should('have.text', 'Cancelled')
      cy.get(':nth-child(7) > button').should('be.disabled')
    })
    
  }) 
})