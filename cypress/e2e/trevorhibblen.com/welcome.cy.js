describe('Welcome page', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://www.google.com/recaptcha/api.js*', {
      statusCode: 200,
      body: '',
    });
    cy.visit('http://localhost:4321/', {
      onBeforeLoad(window) {
        window.grecaptcha = {
          render(container, options) {
            const iframe = window.document.createElement('iframe');
            iframe.title = 'reCAPTCHA test checkbox';
            container.append(iframe);

            iframe.addEventListener('click', () => {
              const challenge = window.document.createElement('button');
              challenge.setAttribute(
                'aria-label',
                'Solve reCAPTCHA test challenge',
              );
              challenge.title = 'recaptcha challenge expires in two minutes';
              challenge.style.height = '40px';
              challenge.style.left = '10px';
              challenge.style.position = 'fixed';
              challenge.style.top = '10px';
              challenge.style.width = '40px';
              challenge.style.zIndex = '2147483647';
              challenge.addEventListener('click', () => {
                challenge.style.visibility = 'hidden';
                options.callback('test-token');
              });
              window.document.body.append(challenge);
            });
            return 0;
          },
          reset() {
            window.document
              .querySelector('[aria-label="Solve reCAPTCHA test challenge"]')
              ?.remove();
          },
        };
      },
    });
    cy.get('[data-test="feedback"] astro-island')
      .should('not.have.attr', 'ssr');
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
    cy.get('[data-test="feedback"]').should('exist');
    cy.get('[data-test="feedback"]')
      .find('button')
      .contains('Feedback')
      .should('be.visible')
      .click();
    cy.wait(100);
    cy.get('div[role="dialog"]').should('be.visible');
    cy.get('[data-test="title"]').should(($title) => {
      expect($title[0].closest('[aria-hidden="true"]')).not.to.be.null;
    });
    cy.get('[data-test="title"]')
      .invoke('attr', 'tabindex', '-1')
      .focus();
    cy.focused().should('not.have.attr', 'data-test', 'title');
    cy.get('[data-test="feedback-overlay"]').click(20, 20, { force: true });
    cy.wait(100);
    cy.get('div[role="dialog"]').should('not.exist');
    cy.get('body').should('not.have.css', 'pointer-events', 'none');
  });

  it('validates the optional contact email', () => {
    cy.get('[data-test="feedback"]')
      .find('button')
      .contains('Feedback')
      .click();

    cy.get('#isemail').click();
    cy.get('#email').type('not-an-email').blur();
    cy.contains('Please enter your email. Or uncheck "Want to reach out?"')
      .should('be.visible');

    cy.get('#isemail').click();
    cy.get('#email').should('not.exist');
  });

  it('limits feedback notes to 1000 characters', () => {
    cy.get('[data-test="feedback"]')
      .find('button')
      .contains('Feedback')
      .click();

    cy.get('#feedback')
      .type('a'.repeat(1001), { delay: 0 })
      .should('have.value', 'a'.repeat(1000));
  });

  it('closes feedback with Escape', () => {
    cy.get('[data-test="feedback"]')
      .find('button')
      .contains('Feedback')
      .click();

    cy.get('div[role="dialog"]').should('be.visible');
    cy.get('body').type('{esc}');
    cy.get('div[role="dialog"]').should('not.exist');
    cy.get('body').should('not.have.css', 'pointer-events', 'none');
  });

  it('updates ratings and requires a completed captcha before sending', () => {
    cy.get('[data-test="feedback"]')
      .find('button')
      .contains('Feedback')
      .click();

    cy.get('input[name="design"][value="3"]')
      .check({ force: true })
      .should('be.checked');
    cy.get('input[name="design"][value="1"]').should('not.be.checked');
    cy.get('button[type="submit"]').contains('Send').should('be.disabled');
    cy.get('iframe[title="reCAPTCHA test checkbox"]').click();

    cy.get('[aria-label="Solve reCAPTCHA test challenge"]')
      .should(($challenge) => {
        expect($challenge[0].closest('[aria-hidden="true"]')).to.be.null;
      })
      .click();
    cy.get('div[role="dialog"]').should('exist');
    cy.get('button[type="submit"]').contains('Send').should('not.be.disabled');
    cy.get('[aria-label="Solve reCAPTCHA test challenge"]')
      .should('have.css', 'visibility', 'hidden')
      .invoke('css', 'visibility', 'visible');
    cy.get('body').should('not.have.css', 'pointer-events', 'none');
    cy.get('[aria-label="Solve reCAPTCHA test challenge"]')
      .invoke('css', 'visibility', 'hidden');
    cy.get('body').should('have.css', 'pointer-events', 'none');

    cy.get('div[role="dialog"] button').contains('Nevermind').click();
    cy.get('div[role="dialog"]').should('not.exist');
    cy.get('body').should('not.have.css', 'pointer-events', 'none');

    cy.get('[data-test="feedback"] button').contains('Feedback').click();
    cy.get('iframe[title="reCAPTCHA test checkbox"]').click();
    cy.get('[aria-label="Solve reCAPTCHA test challenge"]').should('exist');
    cy.get('div[role="dialog"] button').contains('Nevermind').click();
    cy.get('div[role="dialog"]').should('not.exist');
    cy.get('body').should('not.have.css', 'pointer-events', 'none');
  });
});
