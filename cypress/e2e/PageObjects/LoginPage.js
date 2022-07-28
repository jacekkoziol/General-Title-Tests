export class LoginPage {
    validateLoginTitle(expectedTitle) {
        cy.get('.c-login__title').should('have.text', expectedTitle)
    }
    login(usenrame,password){
        cy.get('#username').type(usenrame)
        cy.get('#password').type(password)
        cy.get('.c-login__button').click()
    }
    
}