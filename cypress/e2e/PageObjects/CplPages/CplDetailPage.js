export class CplDetailpage {

    selectOver500_No(){
        cy.get('app-form-radio[name="over500k"]').click()
    }

    borowerName(name){
        cy.get('#input_borrowerName').type(name)
    }
    getCoveredPartyButton(){
       return cy.get('button').contains('Add Covered Party ')
    }
    getModalSubmitButton(){
        return cy.get('button[type="submit"]')
    }
    addCoveredParty_fromLenders(){
        cy.get('button').contains('Add Covered Party ').click()
        cy.get('button').contains('Pick From Lenders').click({force: true})
        cy.get('.options-list__group-list>:nth-child(1)').click()
        cy.get('form[name="editCoveredParty"]').submit()
    }
    getAutofilFromCplButton(){
        return cy.get('button').contains('Autofill From CPL')
    }
    validateCoveredparties(rowIndex,cellIndex,expectedValue){
        cy.get(`tbody > :nth-child(${rowIndex + 1}) > :nth-child(${cellIndex + 1})`).should('have.text', expectedValue)
    }
    getCoveredPartiesDeleteButton(rowIndex){
        return cy.get(`tbody > :nth-child(${rowIndex + 1}) > :nth-child(5)`)
    }
    getYesDeletePartyButton(){
        return  cy.get('button').contains('Yes, Delete Party')
    }

    saveCpl(){
        cy.get('button').contains('Save CPL').click()
    }
    selectDate(){
        cy.get('.form-control').click()
        cy.get('.today').next().click()
    }
    getFinalizeButton(){
        cy.get('button').contains('Finalize Move To Report').click()
    }
}