export class CplSidebar{

    goToUnreportedCpls(){
        cy.get('a.aside-menu__link').contains('Unreported CPLs').click()
    }
}