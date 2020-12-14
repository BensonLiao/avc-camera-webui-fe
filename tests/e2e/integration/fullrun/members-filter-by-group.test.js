/* eslint-disable max-nested-callbacks */
/* eslint-disable no-undef */
describe('license page test', () => {
  const account = 'admin';
  const password = 'Fae12345-';
  beforeEach(() => {
    // login before each test
    cy.login(account, password);
  });

  it('should arrive at members page, then check if there are groups', () => {
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
        const membersInGroup = [];
        const members = res[0].response.body;
        const groups = res[1].response.body;
        if (groups && groups.items.length) {
          groups.items.forEach(group => {
            members.items.forEach(member => {
              if (member.groupId === group.id) {
                member.groupName = group.name;
                membersInGroup.push(member);
              }
            });
          });
          cy.server()
            .route('GET', `/api/members?group=${membersInGroup[0].groupId}`)
            .as('getFirstGroupsMember');
          cy.get(`a.w-100[href="#${membersInGroup[0].groupId}"]`)
            .click()
            .wait('@getFirstGroupsMember').then(res => {
              res.response.body.items.forEach(member => {
                cy.wait(3000);
                console.log(member);
              });
            });
        } else {
          console.log(members);
        }
      });
  });
});

