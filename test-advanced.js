// test-advanced.js
var utils = require('utils');

var resources = [];

casper.options.onResourceRequested = function(C, requestData, request) {
  resources.push(requestData.url);
};

casper.test.begin('Demo contains correct Data Layer', 12, function suite(test) {

  casper.start('http://demo.demogram.cz/', function() {
  
    test.comment('Testing http://demo.demogram.cz/...');
  
    test.assertEvalEquals(function(){return typeof digitalData}, 'object', 'digitalData is an object.');
    test.assertEval(function(){return digitalData instanceof Object}, 'digitalData is an instance of Object.');

    this.wait(1000, function() {
      var gaRequested,
          gaParams,
          match,
          pl,
          search,
          decode,
          query;
      
      this.echo("I've waited for 1000 miliseconds.");
      gaRequested = false;
      
      for (var i = 0; i < resources.length; i++) {
        if (resources[i].match('www.google-analytics.com/r/collect') !== null) {
          gaRequested = true;
          pl     = /\+/g,  // Regex for replacing addition symbol with a space
          search = /([^&=]+)=?([^&]*)/g,
          decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
          query  = resources[i].split("?")[1];
      
          gaParams = {};
          while (match = search.exec(query)) {
            gaParams[decode(match[1])] = decode(match[2]);
          }
          this.echo("Google Analytics beacon params: \n" + JSON.stringify(gaParams, null, 2));
        }
      }
      test.assertEquals(gaRequested, true, 'Google Analytics beacon requested.');
      test.assertEquals(gaParams.dt, 'Demo', 'Page Title "Demo" correctly sent to Google Analytics.');
    });

    
    this.fill('form#loginForm', {username: 'test'}, true);
    test.assertEvalEquals(function(){return digitalData.userId}, 'HRlc3R0ZXN', 'digitalData.userId equals "HRlc3R0ZXN".');
  });

  casper.thenOpen('http://demo.demogram.cz/lead.html', function() {
  
    test.comment('Testing http://demo.demogram.cz/lead.html...');

    test.assertEvalEquals(function(){return typeof digitalData}, 'object', 'digitalData is an object.');
    test.assertEval(function(){return digitalData instanceof Object}, 'digitalData is an instance of Object.');
    test.assertEvalEquals(function(){return typeof digitalData.product}, 'string', 'digitalData.product is a string.');
    test.assertEvalEquals(function(){return digitalData.product}, 'Product 3', 'digitalData.product equals "Product 3".');

    this.fill('form#leadForm', {contact: 'test@test.cz'}, true);
    test.assertEvalEquals(function(){return digitalData.event}, 'leadSent', 'digitalData.event equals "leadSent".');
    test.assertEvalEquals(function(){return digitalData.contact}, 'test@test.cz', 'digitalData.contact equals "test@test.cz".');
    test.assertEvalEquals(function(){return digitalData.formId}, 'leadForm', 'digitalData.formId equals "leadForm".');
  });

  casper.run(function() {
    test.done();
  });
});
