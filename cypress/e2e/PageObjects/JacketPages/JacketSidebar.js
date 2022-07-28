export class JacketSidebar{

    goToUnreportedJackets(){
        cy.get('a.aside-menu__link').contains('Unreported Jackets').click()
    }

    goToCurrentPremiumRaport(){
        cy.get('ul.aside-menu__ul>:nth-child(4)').click()
    }
}