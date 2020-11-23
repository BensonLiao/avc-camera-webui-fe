/* eslint-disable no-undef */
describe('login to weigand first then access web ui to do some action', () => {
  const account = 'admin';
  const password = 'Fae12345-';

  const avLogin = () => {
    cy.get('input[name="account"]').type(account);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
  };

  const wiegandLogin = () => {
    cy.get('input[name="username"]').type(account);
    cy.get('input[name="password"]').type(password);
    cy.get('button[onclick="login()"]').click();
    cy.wait(2000);
  };

  const routeUri = [
    '/media/stream',
    '/media/rtsp',
    '/media/hdmi',
    '/media/osd',
    '/media/privacy-mask',
    '/audio',
    '/notification/smtp',
    '/notification/io',
    '/notification/cards',
    '/users/members',
    '/users/accounts',
    '/users/events',
    '/analytic/face-recognition',
    '/analytic/motion-detection',
    '/analytic/license',
    '/network/settings',
    '/network/tcp-ip',
    '/network/https',
    '/system/datetime',
    '/system/maintain',
    '/system/upgrade',
    '/system/log',
    '/system/information',
    '/sd-card'
  ];

  const validatePath = index => {
    cy.location('pathname', {timeout: 10000}).should('eq', routes[index].route);
  };

  const routes = [
    {
      route: '/app/com.avc.app.wiegandservice/',
      action: () => {
        wiegandLogin();
      },
      validation: index => validatePath(index)
    },
    {
      route: '/',
      action: () => {
        avLogin();
      },
      validation: index => validatePath(index)
    }
  ];

  routeUri.forEach(uri => {
    routes.push({
      route: uri,
      action: () => cy.wait(3000),
      validation: index => validatePath(index)
    });
  });

  const repeatTimes = 100;
  it(`login to weigand first then route every web ui then register a member, test ${repeatTimes} times`, () => {
    routes.forEach((route, index) => {
      cy.visit(route.route);
      route.validation(index);
      if (route.action) {
        route.action();
      }
    });
    cy.visit('/users/members/new')
      .get('#photo-wrapper input')
      .attachFile('avc_member.jpeg')
      .get('.edit-modal .btn-primary')
      .click()
      .get('.member-modal input[name="name"]')
      .type('test')
      .get('.member-modal .btn-primary')
      .click();
  });
});

