/* eslint-disable max-nested-callbacks */
/* eslint-disable no-undef */
describe('member/group correspondence test', () => {
  const account = 'admin';
  const password = 'Fae12345-';
  beforeEach(() => {
    // login before each test
    cy.login(account, password);
  });
  it('should arrive at members page, check if each group has corresponding members', () => {
    cy.intercept({
      method: 'GET',
      url: '/api/members'
    }).as('getMembers');
    cy.intercept({
      method: 'GET',
      url: '/api/groups'
    }).as('getGroups');

    cy.visit('/users/members')
      .wait(['@getMembers', '@getGroups']).then(res => {
        // members that have a group
        const membersWithGroup = [];
        // group Ids with members in them
        const groupIds = [];

        const members = res[0].response.body;
        const groups = res[1].response.body;
        // make sure groups and members are not empty
        if (groups && groups.items.length && members && members.items.length) {
          groups.items.forEach(group => {
            members.items.forEach(member => {
              if (member.groupId === group.id) {
                member.groupName = group.name;
                membersWithGroup.push(member);
              }
            });
          });
          groups.items.forEach(group => {
            const member = membersWithGroup.find(m => m.groupId === group.id);
            if (member) {
              groupIds.push(member.groupId);
            }
          });

          // repeat validation for each group
          for (let i = 0; i < groupIds.length; i++) {
            // current group to verify
            let currentGroupId = groupIds[i];
            cy.visit(`/users/members?group=${currentGroupId}`);
            cy.get('[data-test="member-name"]', {timeout: 20000}).then($el => {
              const membersInCurrGroup = membersWithGroup.filter(member => member.groupId === currentGroupId);
              for (let i = 0; i < membersInCurrGroup.length; i++) {
                cy.wrap($el[i]).should('have.text', membersInCurrGroup[i].name);
              }
            });
          }
        } else {
          cy.contains('Groups or Members is empty').should('not.exist');
        }
      });
  });
});

