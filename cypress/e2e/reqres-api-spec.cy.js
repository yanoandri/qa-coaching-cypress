/// <reference types="Cypress" />
describe('Reqres API E2E Test', () => {
  let apiUrl;
  before(() => {
    apiUrl = Cypress.env('REQRES_API_URL')
  })

  it('Able to create new user', () => {
    cy.fixture('reqres').then((data) => {
      cy.request('POST', `${apiUrl}/users`, { name: data.request.name, job: data.request.job })
        .then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body).to.have.property('id')
          expect(response.body).to.have.property('createdAt')
        })
    })
  })

  it('Able to get specific user', () => {
    cy.fixture('reqres').then((data) => {
      cy.request(`${apiUrl}/users/1`)
        .then((response) => {
          expect(response.status).to.eq(200)

          expect(response.body).to.have.property('data')
          expect(response.body).to.have.property('support')

          const {data: responseData, support} = response.body

          // data attribute
          expect(responseData).to.have.property('id', data.response.data.id)
          expect(responseData).to.have.property('email', data.response.data.email)
          expect(responseData).to.have.property('first_name', data.response.data.first_name)
          expect(responseData).to.have.property('last_name', data.response.data.last_name)
          expect(responseData).to.have.property('avatar', data.response.data.avatar)

          // support attribute
          expect(support).to.have.property('url', data.response.support.url)
          expect(support).to.have.property('text', data.response.support.text)
        })
    })
  })
})