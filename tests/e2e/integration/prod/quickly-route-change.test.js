/* eslint-disable no-undef */
describe('page quickly route back and forward test', () => {
  const account = 'admin';
  const password = 'Fae12345-';
  beforeEach(() => {
    // login before each test
    cy.login(account, password);
  });

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
    '/users/members/new-group',
    '/users/members/new',
    '/users/accounts',
    '/users/accounts/new',
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

  const repeatTimes = 10;
  const routeChangeDuration = 200;
  it(`go to each route then go back and forward 3 pages in ${routeChangeDuration}ms per page, repeat ${repeatTimes} times`, () => {
    routeUri.forEach((route, index) => {
      cy.visit(route).wait(1000);

      if (index === routeUri.length - 1) {
        for (let j = 0; j < repeatTimes; j++) {
          cy.go('back')
            .wait(routeChangeDuration)
            .go('back')
            .wait(routeChangeDuration)
            .go('back')
            .wait(routeChangeDuration)
            .go('forward')
            .wait(routeChangeDuration)
            .go('forward')
            .wait(routeChangeDuration)
            .go('forward')
            .wait(routeChangeDuration);
        }
      }
    });
  });
});

