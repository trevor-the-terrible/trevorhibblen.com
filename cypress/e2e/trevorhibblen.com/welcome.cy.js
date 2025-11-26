describe('Welcome page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4321/');
  });

  it('loads successfully', () => {
    cy.get('[data-test="title"]')
      .should('contain', 'Hi.')
  });

  it('has navigation links', () => {
    cy.get('[data-test="navigation-links"]').should('exist');
    cy.get('[data-test="navigation-links"] a:first')
    .should('be.visible')
      .should('contain', 'Experience')
      .should('have.attr', 'href', '/experience');
    cy.get('[data-test="navigation-links"] a:last')
      .should('be.visible')
      .should('contain', 'LinkedIn')
      .should('have.attr', 'href', 'https://www.linkedin.com/in/trevor-hibblen-53b9b3a');
    cy.get('[data-test="navigation-links"] [data-site=gh]')
      .should('be.visible')
      .should('contain', 'GitHub')
      .should('have.attr', 'href', 'https://github.com/trevor-the-terrible/trevorhibblen.com');
  });

  it('is responsive', () => {
    // Test mobile viewport
    cy.viewport('iphone-6');
    cy.get('[data-test="navigation-links"]').should('be.visible');
    cy.get('[data-test="title"]').should('be.visible');

    // Test desktop viewport
    cy.viewport('macbook-13');
    cy.get('[data-test="navigation-links"]').should('be.visible');
    cy.get('[data-test="title"]').should('be.visible');
  });

  it('has a feedback section', () => {
    cy.wait(500);
    cy.get('[data-test="feedback"]').should('exist');
    cy.get('[data-test="feedback"]')
      .find('button')
      .contains('Feedback')
      .should('be.visible')
      .click();
    cy.wait(100);
    cy.get('div[role="dialog"]').should('be.visible');
    cy.get('div[role="dialog"] button').contains('Nevermind').click();
    cy.wait(100);
    cy.get('div[role="dialog"]').should('not.exist');
  });
});
