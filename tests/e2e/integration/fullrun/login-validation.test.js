/* eslint-disable no-undef */
describe('/login page validation test', () => {
  const account = 'admin';
  const password = 'Fae12345-';

  it('check if username and password fields have error validation, and hidden on input, then should arrive at home', () => {
    cy.intercept('GET', '/api/snapshot').as('getSnapshot');

    cy.visit('/login')
      .get('[data-test="submit"]').as('loginBtn')
      .click()
      .get('[data-test="username-validate"]').as('usernameError')
      .should('be.visible')
      .get('[data-test="password-validate"]').as('passwordError')
      .should('be.visible');

    cy.get('[data-test="username"]').as('usernameField')
      .type(' ')
      .get('@usernameError')
      .should('have.text', 'This field cannot contain these symbols: #, %, &, `, ", \\, /, <, >, and space.')
      .get('@usernameField')
      .clear()
      .type(account)
      .get('@usernameError')
      .should('not.exist')
      .get('[data-test="password"]').as('passwordField')
      .type(password)
      .get('@passwordError')
      .should('not.exist')
      .get('@loginBtn')
      .click()
      .location().should(loc => {
        expect(loc.pathname).to.eq('/');
      })
      .wait('@getSnapshot')
      .get('img.img-fluid')
      .click();
  });
});

