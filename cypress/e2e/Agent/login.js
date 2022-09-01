/// <reference types="cypress" />

const { DashboardPage } = require("../PageObjects/DashboardPage")
const { LoginPage } = require("../PageObjects/loginPage")

const loginPage = new LoginPage()
const dashboard = new DashboardPage()

beforeEach(function() {
  cy.visit('/')
})

describe('Log in to application', () => {
  it('1.1.7 Succesfull login', () => {
    loginPage.validateLoginTitle('Agent Services Login')
    loginPage.login(Cypress.env('clientUser'), Cypress.env('clientPassword'))
    dashboard.validateUrl()
    dashboard.validateUsername()
  })
})
