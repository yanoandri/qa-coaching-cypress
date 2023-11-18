/// <reference types="Cypress" />

const login = (username, password) => {
  cy.visit('https://www.saucedemo.com', { timeout: 30000, failOnStatusCode: false })
  cy.get('[data-test=username]').type(username)
  cy.get('[data-test=password]').type(password)
  cy.get('[data-test=login-button]').click()
}

const addItemToCart = (itemName) => {
  const itemCartTag = itemName.split(' ').join('-').toLowerCase();
  cy.get(`[data-test="add-to-cart-${itemCartTag}"]`).click({ force: true})
  verifyTotalItemInCart(1)
}

const verifyTotalItemInCart = (totalItem) => {
  if (totalItem == 0) {
    cy.get('.shopping_cart_badge').should('not.exist')
  } else {
    cy.get('.shopping_cart_badge').contains(totalItem)
  }
}

const viewItem = (pointer, itemName) => {
  // select item
  cy.get(`#item_${pointer}_title_link > .inventory_item_name`).contains(itemName).click({force: true})
}

const verifyItem = (name, description, price, type) => {
  cy.get(`.inventory_${type}_name`).contains(name)
  cy.get(`.inventory_${type}_desc`).contains(description)
  cy.get(`.inventory_${type}_price`).contains(price)
}

describe('Saucelab UI E2E Test', () => {
  let password;
  before(() => {
    password = Cypress.env('SAUCE_LAB_STANDARD_USER_PASSWORD')
  })

  it('Able to login to store', () => {
    cy.fixture('saucelab').then((data) => {
      login(data.credentials.username, password)

      cy.wait(1000)
    })
  })

  // Add to cart
  it('Able view the item detail and price', () => {
    cy.fixture('saucelab').then((data) => {
      login(data.credentials.username, password)

      viewItem(2, data.item.name) // if you want to view other item, change the pointer in gherkins var
      verifyItem(data.item.name, data.item.description, data.item.price, "details")

      cy.wait(1000)
    })
  })

  // add item to cart
  it('Able to add item to the cart from list', () => {
    cy.fixture('saucelab').then((data) => {
      login(data.credentials.username, password)

      addItemToCart(data.item.name)

      cy.wait(1000)
    })
  })

  it('Able to add item to the cart from detail page', () => {
    cy.fixture('saucelab').then((data) => {
      login(data.credentials.username, password)

      viewItem(2, data.item.name)
      addItemToCart(data.item.name)

      cy.wait(1000)
    })
  })

  it('Able to add item to the cart and verify cart', () => {
    cy.fixture('saucelab').then((data) => {
      login(data.credentials.username, password)

      addItemToCart(data.item.name)

      cy.get('.shopping_cart_link').click()

      verifyItem(data.item.name, data.item.description, data.item.price, "item")

      cy.wait(1000)
    })
  })

  it('Able to do a checkout', () => {
    cy.fixture('saucelab').then((data) => {
      login(data.credentials.username, password)

      addItemToCart(data.item.name)

      cy.get('.shopping_cart_link').click()

      verifyItem(data.item.name, data.item.description, data.item.price, "item")
      cy.get('[data-test=checkout]').click()

      cy.get('[data-test=firstName]').type(data.form.firstName)
      cy.get('[data-test=lastName]').type(data.form.lastName)
      cy.get('[data-test=postalCode]').type(data.form.postalCode)

      cy.get('[data-test="continue"]').click()

      verifyItem(data.item.name, data.item.description, data.item.price, "item")

      cy.get('[data-test="finish"]').click()

      cy.get('.complete-header').contains('Thank you for your order!')
      cy.get('.complete-text').contains('Your order has been dispatched, and will arrive just as fast as the pony can get there!')

      cy.get('[data-test="back-to-products"]').click()

      verifyTotalItemInCart(0)

      cy.wait(1000)
    })
  })
})