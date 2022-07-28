export class ConfirmCplPage{

    getRadioButton(rowIndex){
        cy.get(`table.o-form-table > :nth-child(${rowIndex + 1}) .radio`).click()
    }
    getNextButton(){
        cy.get('button').contains('Next').click()
    }
}