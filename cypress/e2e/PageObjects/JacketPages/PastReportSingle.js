export class PastReportSingle{

validateAgentFile(expectedValue){
    cy.get('.agent-file-number').should('contain',expectedValue)
}
}