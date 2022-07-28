export class PastReportsPage{
    getPastRepor(rawIndex){
        cy.get(`tbody > :nth-child(${rawIndex+1}) > :nth-child(1)`).click()
    }
}