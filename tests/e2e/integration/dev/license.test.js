/* eslint-disable no-undef */
describe('license page test', () => {
  it('site renders without crashing', () => {
    cy.visit('/');
  });

  it('check for validation on form', () => {
    cy.visit('/analytic/license');
    cy.get('input[type="text"]').focus();
    cy.get('button').contains('Activate').click();
    cy.get('div.invalid-feedback').should('have.text', 'This field is required.');
  });

  it('visit /analytic/license, enter false license, expect error', () => {
    cy.visit('/analytic/license');
    cy.get('input[type="text"]').type('test');
    cy.get('button').contains('Activate').click();
    cy.get('div > strong').then(el => {
      expect(el).to.contain('Error 500');
    });
  });

  it('visit /analytic/license, enter correct license, expect success message', () => {
    cy.visit('/analytic/license');
    cy.get('input[type="text"]').type('1');
    cy.get('button').contains('Activate').click();
    cy.get('div > strong').then(el => {
      expect(el).to.contain('Activated Success');
    });
  });
});
