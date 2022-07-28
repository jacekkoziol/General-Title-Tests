export class EndorsementsPage {

    selectEndorsment(name){
        cy.get('tbody > tr >').contains(name).click()
    }

    saveEndorsments(){
        cy.get('button').contains('Save Endorsements').click()
    }
}