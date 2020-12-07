/* eslint-disable max-nested-callbacks */
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
    }, {fixture: 'members.json'}).as('getMembers');
    cy.intercept({
      method: 'GET',
      url: '/api/groups'
    }, {fixture: 'groups.json'}).as('getGroups');
    cy.visit('/users/members')
      .wait('@getMembers')
      .wait('@getGroups');
    cy.fixture('groups.json').then($group => {
      cy.fixture('members.json').then($members => {
        const groupMembers = $members.items.filter(member => member.groupId === $group.items[0].id);
        console.log('🚀 ~ file: members-filter.test.js ~ line 26 ~ cy.fixture ~ groupMembers', groupMembers);
        // cy.intercept({
        //   method: 'GET',
        //   url: `/api/members?group=${$group.items[0].id}`
        // }, {
        //   index: 0,
        //   items: groupMembers,
        //   size: 10,
        //   total: 7
        // }).as(`get${$group.items[0].name}`);
      });
    });
  });
});

