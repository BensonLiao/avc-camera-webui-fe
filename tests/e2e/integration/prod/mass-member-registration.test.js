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
      cy.visit('/users/members/new');
      cy.get('#photo-wrapper input')
        .attachFile('avc_member.jpeg')
        .wait(3000)
        .get('.edit-modal .btn-primary')
        .click()
        .wait(3000)
        .get('.member-modal input[name="name"]')
        .type(`Guy${i}`)
        .get('.member-modal .btn-primary')
        .click()
        .wait(5000);
    }
  });
});

