/* eslint-disable max-nested-callbacks */
/* eslint-disable no-undef */
describe('license page test', () => {
  const account = 'admin';
  const password = 'Fae12345-';
  beforeEach(() => {
    // login before each test
    cy.login(account, password);
  });

  it.skip('should arrive at members page, checks to see if members can be filtered by mystic arts group', () => {
    cy.server()
      .route('GET', '/api/members', 'fixture:members.json').as('getMembers')
      .route('GET', '/api/groups', 'fixture:groups.json').as('getGroups');
    // using deprecated cy.route due to this issue: *unable to override with new route*
    // https://github.com/cypress-io/cypress/issues/9302

    cy.visit('/users/members')
      .wait('@getMembers')
      .wait('@getGroups').then(res => {
        const groups = res.response.body;
        const groupId = groups.items[2].id;
        cy.get('[data-test="member-name"]').as('allMembers');
        cy.server()
          .route('GET', `/api/members?group=${groupId}`, 'fixture:membersMysticArts.json')
          .as('getMembersMysticArts');
        cy.get(`a.w-100[href="#${groupId}"]`)
          .click()
          .wait('@getMembersMysticArts').then(({response}) => {
            const mysticArtsMembers = response.body.items;
            mysticArtsMembers.forEach(member => {
              cy.get('@allMembers').each($el => {
                if ($el[0].innerText === member.name) {
                  cy.wrap($el).should('have.text', member.name);
                }
              });
            });
          });
      });
  });

  it('should arrive at members page, checks to see if members can be filtered by Asgard group', () => {
    cy.server()
      .route('GET', '/api/members', 'fixture:members.json').as('getMembers')
      .route('GET', '/api/groups', 'fixture:groups.json').as('getGroups');
    // using deprecated cy.route due to this issue: *unable to override with new route*
    // https://github.com/cypress-io/cypress/issues/9302

    cy.visit('/users/members')
      .wait('@getMembers')
      .wait('@getGroups').then(res => {
        const groups = res.response.body;
        const groupId = groups.items[3].id;
        cy.get('[data-test="member-name"]').as('allMembers');
        cy.server()
          .route('GET', `/api/members?group=${groupId}`, 'fixture:membersAsgard.json')
          .as('getMembersAsgard');
        cy.get(`a.w-100[href="#${groupId}"]`)
          .click()
          .wait('@getMembersAsgard').then(({response}) => {
            const asgardMembers = response.body.items;
            asgardMembers.forEach(member => {
              cy.get('@allMembers').each($el => {
                if ($el[0].innerText === member.name) {
                  cy.wrap($el).should('have.text', member.name);
                }
              });
            });
          });
      });
  });
});

