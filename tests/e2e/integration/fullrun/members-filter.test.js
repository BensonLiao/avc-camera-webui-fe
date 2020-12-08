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
    cy.server()
      .route('GET', '/api/members', 'fixture:members.json').as('getMembers')
      .route('GET', '/api/groups', 'fixture:groups.json').as('getGroups');
    // using deprecated cy.route due to this issue: *unable to override with new route*
    // https://github.com/cypress-io/cypress/issues/9302

    cy.visit('/users/members')
      .wait('@getGroups').then(res => {
        const groups = res.response.body;
        console.log('groups', groups);
        const groupId = groups.items[2].id;
        cy.server()
          .route('GET', `/api/members?group=${groupId}`, 'fixture:membersMysticArts.json')
          .as('getMembersMysticArts');
        cy.get(`a.w-100[href="#${groupId}"]`).click().wait('@getMembersMysticArts');
        cy.wait('@getMembers').then(res => {
          const members = res.response.body;
          console.log(members);
          let mysticArtsMembers = [];
          members.items.forEach(member => {
            if (member.groupId === groupId) {
              mysticArtsMembers.push(member);
            }
          });
        });
      });
  });
});

