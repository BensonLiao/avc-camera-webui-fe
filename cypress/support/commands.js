/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import 'cypress-file-upload'; // cypress-file-upload extends Cypress' cy command.
const COMMAND_DELAY = Cypress.env('COMMAND_DELAY') || 0;
if (COMMAND_DELAY > 0) {
  for (const command of ['visit', 'click', 'trigger', 'type', 'clear', 'reload', 'contains']) {
    Cypress.Commands.overwrite(command, (originalFn, ...args) => {
      const origVal = originalFn(...args);

      return new Promise(resolve => {
        setTimeout(() => {
          resolve(origVal);
        }, COMMAND_DELAY);
      });
    });
  }
}

Cypress.Commands.add('login', (account, password) => {
  Cypress.log({
    name: 'login',
    message: `${account} | ${password}`
  });

  return cy.request({
    method: 'POST',
    url: '/api/account/_login',
    body: {
      account,
      password,
      maxAge: 300000 // will deprecated in the future
    }
  });
});
