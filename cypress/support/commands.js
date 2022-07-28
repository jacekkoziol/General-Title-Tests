// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

const { CurrentPremiumRaport } = require("../e2e/PageObjects/JacketPages/CurrentPremiumRaport")
const { LoginPage } = require("../e2e/PageObjects/loginPage")

const loginPage = new LoginPage()
const currentPremiumRaport = new CurrentPremiumRaport()

Cypress.Commands.add('getToken',function() { 
     
    cy.window().then(win=> {
        const token = win.localStorage.getItem('GT-Auth_session').slice(0, -85).replace('{"token":"', "")
        cy.wrap(token).as('token')
      })
})

Cypress.Commands.add('login',function() { 
        cy.visit('/')
        loginPage.login(Cypress.env('clientUser'), Cypress.env('clientPassword'))
    })

Cypress.Commands.add('apiLogin', function(){
    cy.request({
        method: 'POST',
        url : 'https://generaltitlewebexternalapi-stage.azurewebsites.net/api/Auth',
        headers: {
           'content-type':  'application/x-www-form-urlencoded'
        },
        body: {
            username: 'TestClient',
            password: 'password'
        }
  }).then((resp) =>{
   window.localStorage.setItem('GT-Auth_session',JSON.stringify(resp.body.data))
    })
    cy.visit('./#/dashboard/agent/')
})
Cypress.Commands.add('apiCreateCpl', function(cplName){
    cy.getToken()
    cy.get('@token').then(token => {
        cy.request({
        method: 'POST',
        url : 'https://generaltitlewebexternalapi-stage.azurewebsites.net/api/cpl',
        headers: {
            Authorization : token
        },
        body: {
            "externalReferenceNumber":  'C-test-'+cplName,
            "effectiveDate": "2022-04-23T12:36:00.637Z",
            "loanNumber": null,
            "isOver500k": false,
            "borrowerName": "Cypress-Borrower",
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
            ]
        }
        }).then(resp =>{
            cy.wrap(resp.body.data.cplId).as('cplId')
        })
    })
})


Cypress.Commands.add('logout',() => { 
    cy.get('.o-initials__with-text').click()
    cy.get('ul.o-menu > :nth-child(2)').click()
    })

Cypress.Commands.add('createCPL',(text)=>{
    cy.get('.header__menu-item-link').contains('CPLs').click()
        cy.get('#input_agentFileNumber').type("C-test-" +  text)
        cy.get('button').contains('Create CPL').click()
        cy.wait(3000)
        cy.get('app-form-radio[name="over500k"]').click()
        cy.get('#input_borrowerName').type('Cypress-Borrower')
        cy.get('button').contains('Add Covered Party ').click()
        cy.get('button').contains('Pick From Lenders').click({force: true})
        cy.get('.options-list__group-list>:nth-child(1)').click()
        cy.get('form[name="editCoveredParty"]').submit()
        cy.get('.o-table-list').find('tr').should('have.length',2)
        cy.get('button').contains('Save CPL').click()      
})

Cypress.Commands.add('apiCreateJacket',(text)=>{
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    cy.window().then(win=> {
        let tempToken = win.localStorage.getItem('GT-Auth_session')
        let token = tempToken.slice(0, -85).replace('{"token":"', "")
        cy.request({
            method: 'POST',
            url : 'https://generaltitlewebexternalapi-stage.azurewebsites.net/api/policyJacket',
            headers: {
            Authorization : token
            },
            body: {
                "externalReferenceNumber": text,
                "borrowerName": "Tester",
                "recordingDate": tomorrow,
                "propertyAddress": {
                  "address1": "string",
                  "address2": "string",
                  "address3": "string",
                  "county": "Adams  ",
                  "city": "Rome",
                  "state": "OH",
                  "zipCode": "string",
                  "contact": "string",
                  "email": "string",
                  "phoneNumber": "string",
                  "faxNumber": "string"
                },
                "appliedJackets": [
                    {
                      "coverageAmount": 150300,
                      "appliedJacketType": "OP"
                    }
                  ]
            }
        }).then(resp =>{
            cy.wrap(resp.body.data.policyJacketId).as('jacketId')
            })
    })  
})

Cypress.Commands.add('cleanCurrentPremiumRaport',()=>{
    cy.visit('/#/dashboard/agent/jackets/current-report')
    cy.wait(2000)
    currentPremiumRaport.generatePolicyReport()
})

//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
