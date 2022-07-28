/// <reference types="cypress" />
const {faker} = require('@faker-js/faker')
const { DashboardPage } = require('../PageObjects/DashboardPage')
const { JacketDetailPage } = require('../PageObjects/JacketPages/JacketDetailPage')
const { JacketSidebar } = require('../PageObjects/JacketPages/JacketSidebar')
const { NewJacketPage } = require('../PageObjects/JacketPages/NewJacketPage')
const { UnreportedJacketsPage } = require('../PageObjects/JacketPages/UnreportedJacketPage')

const text1 = faker.random.alphaNumeric(6)

const dashboard = new DashboardPage() 
const newJacketPage = new NewJacketPage() 
const jacketDetailPage = new JacketDetailPage()
const jacketSidebar = new JacketSidebar()
const unreportedJacketsPage = new UnreportedJacketsPage()

beforeEach(function() {
  cy.fixture('data').then((data) => {
    this.data = data
  })
    cy.login()
})
  
  describe('Basic Test Jacket, CPL', () => {
   
    it('Create Jackets', function () {
        cy.wait(2000)
        dashboard.goToJackets()
        newJacketPage.createNewJacket("J-test" + "-" +text1)
        jacketDetailPage.selectCounty()
        jacketDetailPage.selectCity()
        jacketDetailPage.selectDate()
        jacketDetailPage.addJacketPolicy('Owners Policy', '150300')
        jacketDetailPage.validatePolicies(0, 2,'$150,300.00')
        jacketDetailPage.saveJacket()
        cy.wait(2000)
        jacketSidebar.goToUnreportedJackets()
        unreportedJacketsPage.validateJackets(0,0,"J-test" + "-" +text1)
    })
  })