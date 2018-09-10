'use strict'

const chai = require('chai')
const server = require('../server')
const chaiHttp = require('chai-http')
const { readFileSync } = require('fs')

chai.use(chaiHttp)

describe('File Handle Unit Test', () => {

  let fileroute = 'test/file_test.jpg'

  it('File Upload', () => {
    chai.request(server)
      .post('/fileupload')
      .attach("files", readFileSync(fileroute), fileroute)
      .end((err, res) => {
        if (err) done(err)
        res.should.have.status(200)
        done()
      })
  })

})