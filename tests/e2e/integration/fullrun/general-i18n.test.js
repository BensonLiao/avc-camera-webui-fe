/* eslint-disable no-undef */
describe('license page test', () => {
  const account = 'admin';
  const password = 'Fae12345-';
  beforeEach(() => {
    // login before each test
    cy.login(account, password);
  });

  it('should arrive at homepage, wait for apis to load before navigating again', () => {
    cy.visit('/');
    cy.intercept('GET', '/api/system/information').as('getInformation');
    cy.intercept('GET', '/api/system/network').as('getNetworkSettings');
    cy.intercept('GET', '/api/video/settings').as('getSettings');
  });
});

