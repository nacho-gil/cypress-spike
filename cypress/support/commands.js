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

/**
 * Uploads file(s) to an input
 * @memberOf Cypress.Chainable#
 * @name uploadImage
 * @function
 * @param {String} selector - element to target
 * @param {Array<String>} fileUrls - Arguments containing each file url to upload
 */
Cypress.Commands.add('uploadImage', (selector, ...fileUrls) => {
  const dataTransfer = new DataTransfer();

  return cy.wrap(fileUrls).each(fileUrl => {
    return cy.fixture(`files/${fileUrl}`, 'base64')
      .then(Cypress.Blob.base64StringToBlob)
      .then(blob => {
        const nameSegments = fileUrl.split('/');
        const name = nameSegments[nameSegments.length - 1];
        const type = `image/${name.split('.').pop()}`;
        const testFile = new File([blob], name, { type });
        dataTransfer.items.add(testFile);
      });
  })
  .then(() => cy.get(selector))
  .then(subject => {
    const el = subject[0];
    el.files = dataTransfer.files;
    return subject;
  });
});

/**
 * Drops file(s) to a drop area
 * @memberOf Cypress.Chainable#
 * @name dropImage
 * @function
 * @param {String} selector - element to target
 * @param {Array<String>} fileUrls - Arguments containing each file url to upload
 */
Cypress.Commands.add('dropImage', (selector, ...fileUrls) => {
  // recreate a FileList object
  const fileList = [];
  fileList.item = index => fileList[index];
  const event = { dataTransfer: { files: fileList } };

  return cy.wrap(fileUrls).each(fileUrl => {
    return cy.fixture(`files/${fileUrl}`, 'base64')
      .then(Cypress.Blob.base64StringToBlob)
      .then(blob => {
        const nameSegments = fileUrl.split('/');
        const name = nameSegments[nameSegments.length - 1];
        const type = `image/${name.split('.').pop()}`;
        const testFile = new File([blob], name, { type });
        fileList.push(testFile);
      });
  })
  .then(() => cy.get(selector).trigger('drop', event));
});


