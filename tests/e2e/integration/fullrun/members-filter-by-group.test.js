/* eslint-disable no-undef */
describe('license page test', () => {
  const account = 'admin';
  const password = 'Fae12345-';
  beforeEach(() => {
    // login before each test
    cy.login(account, password);
  });

  it('should arrive at members page, checks to see if members can be filtered by group', () => {
    cy.intercept({
      method: 'GET',
      url: '/api/members'
    }).as('getMembers');
    cy.intercept({
      method: 'GET',
      url: '/api/groups'
    }).as('getGroups');

    cy.visit('/users/members')
      .wait('@getMembers').then(res => {
        const members = res.response.body;
        console.log(members);
      })
      .wait('@getGroups').then(res => {
        const groups = res.response.body;
        console.log('groups', groups);
        // const id = groups.items[2].id;
      });
  });
});

