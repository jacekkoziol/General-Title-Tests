/// <reference types="cypress" />
const {faker} = require('@faker-js/faker')



const cplName = faker.random.alphaNumeric(7)
const cplName2 = faker.random.alphaNumeric(7)

before(function(){
  cy.fixture('data').then((data) => {
    this.data = data})
})
beforeEach(() => {
   cy.login()
})
  
describe('API Tests - CPL errors', () => {
    context('Create errors',()=> {
        it('4.1.1 CPL alrady exist - ERR-CPL-A01', function ()  {
            cy.wait(3000)
            cy.window().then(win=> {
                const tempToken = win.localStorage.getItem('GT-Auth_session')
                const token = tempToken.slice(0, -63).replace('{"token":"', "")
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
            cy.get('.header__menu-item-link').contains('CPLs').click()
            cy.get('#input_agentFileNumber').type('API-C-test-'+cplName)
            cy.get('button').contains('Create CPL').click()
            cy.get('.o-information__content-main').should('have.text', 'Cannot Create New CPL.An existing CPL has been issued under the same Agent File Number.') 
        }) 
        it('4.1.2 AFN already in use by reported Policy Jacket. - ERR-CPL-A03', function ()  {
            cy.wait(3000)
            cy.get('.header__menu-item-link').contains('JACKETS').click()
            cy.get('a.aside-menu__link').contains('Past Reports').click()
            cy.get('tbody > :nth-child(1) > :nth-child(1)').click()
           
            cy.get('.agent-file-number').invoke('text').as('tempCPLName')
            cy.wait(2000)
            cy.get('.header__menu-item-link').contains('CPLs').click()
            cy.get('@tempCPLName').then(tempName =>{
                cy.get('#input_agentFileNumber').type(tempName)
                cy.get('button').contains('Create CPL').click()
                cy.get('.o-information__content-main').should('have.text', 'Cannot Create New CPL.A reported Transaction with the same Agent File Number already exists.') 
                cy.window().then(win=> {
                    const tempToken = win.localStorage.getItem('GT-Auth_session')
                    const token = tempToken.slice(0, -63).replace('{"token":"', "")
                    cy.request({
                      method: 'POST',
                      url : 'https://generaltitlewebexternalapi-stage.azurewebsites.net/api/cpl',
                      failOnStatusCode: false,
                      headers: {
                        Authorization : token
                      },
                      body: {
                        "externalReferenceNumber":  tempName,
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
                          }
                        ]
                      }
                    }).then(resp =>{
                      console.log(resp)
                        expect(resp.body.info[0]).to.include({'code' : 'ERR-CPL-A01'} )
                      })
                 
                  })
            })

        }) 
    })
})