export class MoveToRaportPage{

    getYesReportTheseJacketsButton(){
        cy.get('button').contains('Yes, Report these Jackets').click()
    }
}