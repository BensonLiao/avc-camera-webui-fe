/* eslint-disable no-undef */
describe('notification card page route back test', () => {
  const account = 'admin';
  const password = 'Fae12345-';
  beforeEach(() => {
    // login before each test
    cy.login(account, password);
  });

  const repeatTimes = 100;

  const routes = [
    {
      route: '/notification/smtp',
      action: () => {
        cy.wait(2000);
      },
      validation: index => {
        cy.location().should(loc => {
          expect(loc.pathname).to.eq(routes[index].route);
        });
      }
    },
    {
      route: '/app/com.avc.app.wiegandservice/',
      action: () => {
        cy.get('input[name="username"]').type(account);
        cy.get('input[name="password"]').type(password);
        cy.get('button[onclick="login()"]').click();
        cy.wait(2000);
        cy.go('back');
      },
      validation: index => {
        cy.location().should(loc => {
          expect(loc.pathname).to.eq(routes[index].route);
        });
      }
    }
  ];

  it(`go to each route and validate navigated, run action per route, go back to first route, repeat ${repeatTimes} times`, () => {
    for (let i = 0; i < repeatTimes; i++) {
      routes.forEach((route, index) => {
        cy.visit(route.route);
        route.validation(index);
        if (route.action) {
          route.action();
        }
      });
    }
  });
});

