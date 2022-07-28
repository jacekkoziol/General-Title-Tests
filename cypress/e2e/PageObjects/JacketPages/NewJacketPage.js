export class NewJacketPage {
    createNewJacket(name){
        cy.get('#input_agentFileNumber').type(name)
        cy.intercept('https://generaltitlewebapi-stage.azurewebsites.net/api/PolicyJackets').as('jackets')
        cy.get('button').contains('Create Jacket').click()
        cy.wait('@jackets')
    }
}