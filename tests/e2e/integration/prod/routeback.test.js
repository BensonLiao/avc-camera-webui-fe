/* eslint-disable no-undef */
describe('notification card page route back test', () => {
  const account = 'admin';
  const password = 'Fae12345-';

  const routeUri = [
    '/',
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

  const routes = [
    {
      route: '/login',
      action: () => {
        avLogin();
      },
      validation: index => {
        validatePath(index);
      }
    }
  ];
  routeUri.forEach(uri => {
    routes.push({
      route: uri,
      action: () => cy.wait(3000),
      validation: index => validatePath(index)
    });
  });

  routes.push(
    {
      route: '/app/com.avc.app.wiegandservice/',
      action: () => {
        wiegandLogin();
      },
      validation: index => {
        validatePath(index);
      }
    });
  const repeatTimes = 100;

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

  const validatePath = index => {
    cy.location('pathname', {timeout: 10000}).should('eq', routes[index].route);
  };

  it(`go to each route and validate navigated, run action per route, go back to first route, repeat ${repeatTimes} times`, () => {
    for (let i = 0; i < repeatTimes; i++) {
      routes.forEach((route, index) => {
        cy.visit(route.route);
        route.validation(index);
        if (route.action) {
          route.action();
        }

        if (index === routes.length - 1) {
          for (let i = routes.length - 1; i >= 0; i--) {
            route.validation(i);

            cy.go('back');
          }
        }
      });
    }
  });
});

