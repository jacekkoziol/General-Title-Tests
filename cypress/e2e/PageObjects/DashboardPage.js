export class DashboardPage {
    validateUrl(){
        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/#/dashboard/agent')
    }

    validateUsername(){
        cy.get('.o-initials__text').should('have.text', 'TestClient')
    }

    goToJackets(){
        cy.get('.header__menu-item-link').contains('JACKETS').click()
    }

    goToCPLs(){
        cy.get('.header__menu-item-link').contains('CPLs').click()
    }
    visitUnreportedJackets(){
        cy.visit('/#/dashboard/agent/jackets/unreported')
    }

    visitUnreportedCpls(){
        cy.visit('#/dashboard/agent/cpls/unreported')
    }

    visitFindCpl(){
        cy.visit('#/dashboard/agent/cpls/find')
    }

}