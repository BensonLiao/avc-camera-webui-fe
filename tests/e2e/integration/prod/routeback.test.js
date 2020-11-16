/* eslint-disable no-undef */
describe('notification card page route back test', () => {
  const account = 'admin';
  const password = 'Fae12345-';
  beforeEach(() => {
    // login before each test
    cy.login(account, password);
  });

  const repeatTimes = 100;
  it(`go to notification card page then go back to previous url, test ${repeatTimes} times`, () => {
    cy.visit('/notification/smtp');
    for (let i = 0; i < repeatTimes; i++) {
      cy.wait(3000)
        .get('a[href="/notification/cards"]')
        .click()
        .get('div.filter')
        .then(el => {
          if (el) {
            cy.go('back');
          }
        });
    }
  });
});

