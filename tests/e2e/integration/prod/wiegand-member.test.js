/* eslint-disable no-undef */
describe('notification card page route back test', () => {
  const account = 'admin';
  const password = 'Fae12345-';
  let wiegandPort = 4663;
  let firstRunThrough = true;
  // Functions for login and validation
  const validatePath = index => {
    cy.location('pathname', {timeout: 10000}).should('eq', routes[index].route);
  };

  const wiegandLogin = () => {
    cy.get('input[name="username"]').type(account);
    cy.get('input[name="password"]').type(password);
    cy.get('button[onclick="login()"]').click();
    cy.wait(2000);
  };

  const avLogin = () => {
    if (firstRunThrough) {
      cy.get('input[name="account"]').type(account);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
      cy.wait(2000);
      firstRunThrough = false;
    }
  };

  // Times to repeat entire process
  const repeatTimes = 250;

  // Objs are objects containing route and action and validation
  const wiegandLoginObj = {
    route: '/app/com.avc.app.wiegandservice/',
    action: () => {
      wiegandLogin();
    },
    validation: index => validatePath(index)
  };

  const avLoginObj = {
    route: '/',
    action: () => {
      avLogin();
    },
    validation: index => validatePath(index)
  };

  const wiegandRouteUris = [
    '/media/stream',
    '/audio',
    '/notification/smtp'
  ];

  const avMemberRegisterObj = {
    route: '/users/members',
    action: () => {
      cy.wait(2000);
    },
    validation: index => validatePath(index)
  };

  const avMemberRegisterNewObj = {
    route: '/users/members/new',
    action: () => {
      cy.get('#photo-wrapper input')
        .attachFile('avc_member.jpeg')
        .wait(5000)
        .get('.edit-modal .btn-primary')
        .click()
        .wait(5000)
        .get('.member-modal input[name="name"]')
        .type('Hin Guy')
        .get('.member-modal .btn-primary')
        .click()
        .wait(10000);
      cy.get('table > tbody > tr:last-child > td.text-left.group-btn > button > i').click();
      cy.get('body > div.fade.modal.show > div > div > div.flex-column.modal-footer > div > button').click();
      cy.wait(5000);
    },
    validation: index => validatePath(index)
  };

  const accountsAddAndRemoveObj = {
    route: '/notification/cards',
    action: () => {
      cy.get('div.fixed-actions-section.fixed-bottom.text-center.pb-5 > button').click();
      cy.get('body > div.fade.notification-card.modal.show > div > div > form > div.modal-body.d-flex.justify-content-between.align-content-center.pb-2 > div.d-flex.align-content-center > div > div > div > div > p')
        .clear()
        .type('card title');
      cy.get('body > div.fade.notification-card.modal.show > div > div > form > div:nth-child(4) > div > button').click();
      cy.wait(5000);
      cy.get('#root > div:nth-child(6) > div > div > div.card-container.mb-4 > div > div.card-body > button').invoke('show').click();
      cy.wait(2000);
    },
    validation: index => validatePath(index)
  };

  const wiegandLoginAndEditObj = {
    route: '/app/com.avc.app.wiegandservice/',
    action: () => {
      wiegandLogin();
      cy.get('#port').clear().type(wiegandPort + 1);
      cy.get('#layout_setting > form:nth-child(2) > div:nth-child(3) > button:nth-child(2)').click();
    },
    validation: index => validatePath(index)
  };

  // Order of operations
  const routes = [];
  routes.push(wiegandLoginObj);
  routes.push(avLoginObj);
  wiegandRouteUris.forEach(uri => {
    routes.push({
      route: uri,
      action: () => cy.wait(3000),
      validation: index => validatePath(index)
    });
  });
  routes.push(avMemberRegisterObj);
  routes.push(avMemberRegisterNewObj);
  routes.push(avMemberRegisterObj);
  routes.push(accountsAddAndRemoveObj);
  routes.push(wiegandLoginAndEditObj);

  // Test logic
  it(`go to each route and validate navigated, run action per route, go back to first route, repeat ${repeatTimes} times`, () => {
    for (let i = 0; i < repeatTimes; i++) {
      routes.forEach((route, index) => {
        cy.visit(route.route);
        route.validation(index);
        if (route.action) {
          route.action();
        }

        if (index === routes.length - 1) {
          for (let i = routes.length - 1; i > 0; i--) {
            route.validation(i);
            cy.wait(3000);
            cy.go('back');
          }
        }
      });
    }
  });
});

