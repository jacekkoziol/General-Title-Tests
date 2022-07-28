export class NewCplPage {
    createNewCPL(name){
        cy.get('#input_agentFileNumber').type(name)
        cy.intercept('https://generaltitlewebapi-stage.azurewebsites.net/api/CPLs').as('cpl')
        cy.get('button').contains('Create CPL').click()
        cy.wait('@cpl')
    }
}