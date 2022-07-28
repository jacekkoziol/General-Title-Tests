import { MoveToRaportPage } from "./MoveToRaportPage"

const moveToRaportPage = new MoveToRaportPage()

export class UnreportedJacketsPage {
    validateJackets(rowIndex, cellIndex, expectedValue){
        cy.get(`tbody > :nth-child(${rowIndex + 1}) > :nth-child(${cellIndex + 1})`).should('have.text', expectedValue)
    }

    getUnreportedJacket(rowIndex){
        cy.get(`tbody > :nth-child(${rowIndex + 1})`).within (()=>{
            cy.get(':nth-child(7)').click()
         })
    }
    getMoveToReportButton(rowIndex){
        cy.get(`tbody > :nth-child(${rowIndex + 1}) > :nth-child(8)`).click()
    }
    editJacket(id){
        cy.visit('/#/dashboard/agent/jackets/detail/'+id)
    }
    reportJacket(rowIndex){
        cy.get(`tbody > :nth-child(${rowIndex + 1}) > :nth-child(8)`).click()
        cy.wait(2000)
        moveToRaportPage.getYesReportTheseJacketsButton()
    }
}
