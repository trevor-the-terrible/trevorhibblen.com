describe('Experience page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4321/experience').wait(1000);
  });

  it('loads successfully', () => {
    cy.get('.xp-page')
      .find('[role="tablist"]')
      .find('button[data-state="active"]')
      .should('contain', 'Experience');
  });

  it('loads skills', () => {
    cy.get('#xp').should('be.visible');
    cy.get('#xp').find('.card-header')
      .should('contain', 'Experience')
      .should('be.visible');

    cy.get('[data-test="xp-skills-table"]')
      .find('table')
      .should('be.visible');

    cy.get('[data-test="xp-skills-table"]')
      .find('table')
      .should('contain', 'React')
      .should('contain', 'Astro')
      .should('contain', 'Tailwind')
      .should('contain', 'Typescript')
      .should('contain', 'Javascript')

    cy.get('[data-test="xp-skills-table"]')
      .find('input[type="search"]')
      .type('react')
      .then(() => {
        cy.get('[data-test="xp-skills-table"]')
        .find('table')
        .should('contain', 'React')
        .should('not.contain', 'Astro')
        .should('not.contain', 'Tailwind')
        .should('not.contain', 'Typescript')
        .should('not.contain', 'Javascript');
      });
  });

  it('loads work history', () => {
    cy.get('.xp-page')
      .find('[role="tablist"]')
      .find('button[role="tab"]')
      .contains('Work History')
      .click()
      .click()
      .wait(100);

    cy.get('#history')
      .should('be.visible');

    cy.get('#history')
      .find('h2')
      .should('contain', 'Work History')
      .should('be.visible');
  });
});
