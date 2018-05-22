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
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


// This is a synthetic drag and drop command that runs a script in the context of the app
Cypress.Commands.add('dragAndDrop', (selectorDraggable, selectorDroppable) => {
  return cy.window()
    .then(win => {
      return cy.readFile('node_modules/html-dnd/dist/html_dnd.js')
        .then(file => {
          const script = `
            (function(selectorDraggable, selectorDroppable) {
              ${file}
              
              const draggable = document.querySelector(selectorDraggable);
              const droppable = document.querySelector(selectorDroppable);

              dnd.simulate(draggable, droppable);
            })(\`${selectorDraggable}\`, \`${selectorDroppable}\`);
          `;
          // page window object eval
          return win.eval(script);
        });
    });
});
