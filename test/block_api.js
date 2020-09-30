const config = require('../config');
const supertest = require ('supertest');

var server = supertest.agent(config.LOCAL_SERVER);

describe("test get block api",function(){

  it("true case",function(done){
    server
    .get("/block/1100")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.success.should.equal(true);
      res.body.data.block_id.should.equal(1100);
      res.body.data.timestamp.should.equal("2019-08-13T02:52:55.545870862Z");
      done();
    });
  });

  it("block number lower than 0",function(done){
    server
    .get("/block/-5")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.success.should.equal(false);
      res.body.error.should.equal('MUST_BE_INTEGER_EXCEPT_0');
      done();
    });
  });

  it("block number equal 0",function(done){
    server
    .get("/block/0")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.success.should.equal(false);
      res.body.error.should.equal('MUST_BE_INTEGER_EXCEPT_0');
      done();
    });
  });

  it("block number doesn't exist",function(done){
    server
    .get("/block/99999999999")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.success.should.equal(false);
      res.body.error.should.equal('INVALID_HEIGHT');
      done();
    });
  });

  it("invalid block number",function(done){
    server
    .get("/block/9a*")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.success.should.equal(false);
      res.body.error.should.equal('MUST_BE_INTEGER_EXCEPT_0');
      done();
    });
  });

  it("empty block number",function(done){
    server
    .get("/block/")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(404);
      done();
    });
  });
});
