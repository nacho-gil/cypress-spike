describe('Login', () => {
  before(() => {
    cy.clearCookie('AUTH');
    cy.clearCookie('aUsername');
  });

  beforeEach(() => {
    // before each test, we can automatically preserve the
    // 'AUTH' and 'aUsername' cookies. this means they
    // will NOT be cleared before the NEXT test starts.
    Cypress.Cookies.preserveOnce('AUTH', 'aUsername');
  });

  it('should login', () => {
    // https://on.cypress.io/visit
    cy.visit('http://local.pcms.sky.com/editor/');

    // Cypress has a default command timeout (4s) 
    // and e.g. we can use that to wait for a selector to be present
    cy.get('.login');
    cy.screenshot('login');

    cy.get('[type="email"]').type('root@pcms.uk', { delay: 0 });
    cy.get('[type="password"]').type('admin', { delay: 0 });
    cy.get('[type="submit"]').click();

    cy.get('.dashboard');
    cy.screenshot('login-succeed');
  });

  it('should create a static collection', () => {
    // Select navigation
    cy.get('.nav__burger-icon').click();

    // wait for nav to be opened and clickable (this may not be needed)
    // cy.get('.md-open-menu-container.md-active.md-clickable');

    // select by containing text
    cy.get('.md-open-menu-container').contains('EDITORIAL').click();
    // submenu
    cy.get('.nav__level__collection-items').contains('MOVIES').click();

    // create new dropdown
    cy.get('.atom-section-page__new-dropdown').click();

    // New static collection
    cy.get('.md-select-menu-container.md-active.md-clickable md-option').contains('New static collection').click();

    // Content selector
    // cy.get('.md-dialog-fullscreen:not(.md-transition-in-add)');
    cy.get('button').contains('Select').click();

    // Wait for static collection navigation
    // cy.get('.static-collection-curation');

    // English tab
    cy.get('.tabs__selector').contains('English').click();
    cy.get('[name="en::Title"]').type('Testing Cypress');

    // Spanish tab
    cy.get('.tabs__selector').contains('Spanish').click();
    cy.get('[name="es::Title"]').type('Testing Cypress');

    // Items tab
    cy.get('.tabs__selector').contains('Items').click();

    // Collection Search
    cy.get('[type="search"]').type('*').type('{enter}').blur({force: true});

    // wait for search results
    cy.get('.search-result-split-view__collection-content--search li[draggable]');

    cy.screenshot('drag-drop-before');

    // simulate drag and drop
    // cy.get('.search-result-split-view__collection-content--search li[draggable]:first-child')
    //     .trigger('mousedown', { which: 1 })
    //     .trigger('mousemove', { clientX: 550, clientY: 330 })
    //     .trigger('mouseup', {force: true});

    // cy.get('.search-result-split-view__collection-content--search li[draggable]:first-child').trigger('dragstart');
    // cy.get('.search-result-split-view__collection-content--curation [dnd-drop]').trigger('dragover').trigger('drop');
    // cy.get('.search-result-split-view__collection-content--search li[draggable]:first-child').trigger('dragend');

    // custom command: drag and drop simulation
    cy.dragAndDrop('.search-result-split-view__collection-content--search li[draggable]:first-child', '.search-result-split-view__collection-content--curation [dnd-drop]');

    // dropped element visible
    cy.get('.search-result-split-view__collection-content--curation li[draggable]');

    cy.screenshot('drag-drop-after');

    // save collection
    cy.get('button').contains('Save').click();

    cy.url().should('not.contain', 'curate-static-collection/new');

    cy.get('h1').contains('Testing Cypress');

  });


  it('should upload an image', () => {
    // Select navigation
    cy.get('.nav__burger-icon').click();
    // select menu by containing text
    cy.get('.md-open-menu-container').contains('IMAGE LIBRARY').click();

    // Both `uploadImage` and `dropImage` commands may be used
    // cy.uploadImage('input[type="file"]', 'cinema-pass.png', 'now-tv.jpg');
    cy.dropImage('[ngf-drop]', 'cinema-pass.png', 'now-tv.jpg');

    cy.get(`image-editor:not(.upload-images__inactive) [name="contentProvider"]`).type('Movies');
    cy.get(`image-editor:not(.upload-images__inactive) [name="copyright"]`).type('Sky');

    cy.get('.upload-images__list-image').eq(1).click();

    cy.get(`image-editor:not(.upload-images__inactive) [name="contentProvider"]`).type('Movies');
    cy.get(`image-editor:not(.upload-images__inactive) [name="copyright"]`).type('Sky');

    cy.get('button').contains('Save image(s) to library').click();

    cy.get('.image-library__masonry-image', {timeout: 30000})
        // .should('have.length', 2);

    cy.wait(2000);
    cy.screenshot('image-uploaded');
  });


});