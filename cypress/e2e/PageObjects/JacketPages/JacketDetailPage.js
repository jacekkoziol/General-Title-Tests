export class JacketDetailPage{

    selectCounty(){
        cy.get('#input_input_county').click()
        cy.get('.options-list__item').first().click()
    }

    selectCity(){
        cy.get('#input_input_city').click()
        cy.get('.options-list__item').first().click()
    }

    selectDate(){
        cy.get('.form-control').click()
        cy.get('.today').next().click()
    }

    getAddJacketButton(){
        cy.get('button').contains('Add A Jacket ').click()
    }
    getEditPolicyJacketButton(rowIndex){
        cy.get(`tbody > :nth-child(${rowIndex + 1}) > :nth-child(6)`).click()
    }

    validatePolicies(rowIndex, cellIndex, expectedValue){
        cy.get(`tbody > :nth-child(${rowIndex + 1}) > :nth-child(${cellIndex + 1})`).should('have.text', expectedValue)
    }
    cancelJacketPolicy(rowIndex){
        cy.get(`tbody > :nth-child(${rowIndex + 1}) > :nth-child(8) button`).click()
        cy.get('h2').should('contain', 'Cancel This Jacket?')
        cy.get('button').contains('Yes, cancel Jacket').click()
    }

    saveJacket(){
        cy.get('button').contains('Save Jacket').click()
    }
    getRaportButton(){
        cy.get('button').contains('Yes, Report these Jackets').click()
    }

//Add Policy Modal
    getFormTypeDropdown(){
        cy.get('#input_input_formType').click()
    }

    getPolicyModalCancelButton(){
        cy.get('footer button').contains('Cancel').click()
    }

    addJacketPolicy(policyName, amount){
        cy.get('button').contains('Add A Jacket ').click()
        cy.get('#input_input_formType').click()
        cy.get('li').contains(policyName).click()
        cy.get('#input_coverageAmount').type(amount)
        cy.get('button').contains('Assign Policy #').click()
    }


}