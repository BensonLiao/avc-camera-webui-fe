/* eslint-disable no-undef */
describe('/login page validation test', () => {
  const account = 'admin';
  const password = 'wrongPassword';

  it('check if username and password fields have error validation, and hidden on input', () => {
    cy.visit('/login')
      .get('[data-test="submit"]').as('loginBtn')
      .click()
      .get('[data-test="username-validate"]').as('usernameError')
      .should('be.visible')
      .get('[data-test="password-validate"]').as('passwordError')
      .should('be.visible');

    cy.get('[data-test="username"]').as('usernameField')
      .type(account)
      .get('@usernameError')
      .should('not.be.visible')
      .get('[data-test="password"]').as('passwordField')
      .type(password)
      .get('@passwordError')
      .should('not.be.visible');
  });
});

