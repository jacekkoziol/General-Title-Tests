export class CurrentPremiumRaport {
    generatePolicyReport(){
        cy.get("body").then($body => {
            if ($body.find('button.o-btn--red').length > 0) {   
                cy.get('button').contains('Generate Policy Report').click()
                cy.get('#checkbox_confirm').click()
                cy.get('button').contains('Generate Final Report').click()
                cy.wait(2000)
            }
        })
    }
    validatePolicyCount(policiesCount){
        cy.get('table.o-table-summary >:nth-child(1)').find('.o-summary__value').eq(0).should('have.text',policiesCount)

    }
}