import { EndorsementsPage } from "./EndorsmetsPage"

const endorsmentsPage = new EndorsementsPage()

export class PolicyInformationPage{

    getEndorsmentButton(){
        cy.get('button').contains('Edit Endorsements').click()
    }

    savePolicy(){
        cy.get('button').contains('Save Policy').click()
    }
    checkRateType(){
        cy.get('input[name=stateRateTypeCode]').eq(0).next().click()
    }

    addEndorsment(endorsmentName){
        cy.get('button').contains('Edit Endorsements').click()
        endorsmentsPage.selectEndorsment(endorsmentName)
        endorsmentsPage.saveEndorsments()
    }

}