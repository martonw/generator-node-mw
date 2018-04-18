const path = require('path');
const should = require('should');

const logging = require(path.join(process.cwd(), './lib/logging'));
const loggingMocked = require(path.join(process.cwd(), './lib/logging.mockup'));
const <%= className %> = require('./<%= fileName %>');

describe ('<%= className %>', function () {

  var fakeLogger = loggingMocked.getLogger();

  function _getOptions() {
    return {
      logger: loggingMocked.getLogger(),
    };
  }


  it('should ...', function (done) {

    // create the object
    var o = _getOptions();
    var <%= className.toLowerCase() %> = new <%= className %>(o);

    // call method
    var res = <%= className.toLowerCase() %>.methodToTest();

    // assert
    should.exists(res);


    done();
  })

});
