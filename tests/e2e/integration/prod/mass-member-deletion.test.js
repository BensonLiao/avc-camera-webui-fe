/* eslint-disable no-undef */
describe('license page test', () => {
  const account = 'admin';
  const password = 'Fae12345-';
  beforeEach(() => {
    // login before each test
    cy.login(account, password);
  });

  it('check if login success', () => {
    cy.visit('/');
    cy.get('div.video-wrapper').click();
    cy.get('div.left-navigation').should('be.visible');
  });

  it('mass registers members', () => {
    const repeatTimes = 100;
    for (let i = 0; i < repeatTimes; i++) {
      cy.visit('/users/members');
      cy.get('table > tbody > tr:last-child > td.text-left.group-btn > button > i').click();
      cy.get('body > div.fade.modal.show > div > div > div.flex-column.modal-footer > div > button').click();
      cy.wait(3000);
    }
  });
});

