/* eslint-disable no-undef */
describe('license page test', () => {
  it('site renders without crashing', () => {
    cy.visit('/');
  });

  it('should redirect to login page', () => {
    cy.get('div.bg-secondary').should('have.class', 'page-login');
  });

  it('perform login', () => {
    cy.get('input[type="text"]').type('admin');
    cy.get('input[type="password"]').type('Fae12345-');
    cy.get('form').submit();
  });

  it('check if login success', () => {
    cy.location('pathname', {timeout: 10000}).should('eq', '/');
    cy.get('div.video-wrapper').click();
    cy.get('div.left-navigation').should('be.visible');
  });
});

