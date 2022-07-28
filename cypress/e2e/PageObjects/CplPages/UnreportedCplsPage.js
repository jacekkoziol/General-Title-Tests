export class UnreportedCplsPage {

    validateCpl(rowIndex, cellIndex, expectedValue){
        cy.get(`tbody > :nth-child(${rowIndex + 1}) > :nth-child(${cellIndex + 1})`).should('have.text', expectedValue)
    }

    getUnreportedCpl(rowIndex){
        cy.get(`tbody > :nth-child(${rowIndex + 1})`).within (()=>{
            cy.get(':nth-child(7)').click()
         })
    }
}