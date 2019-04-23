// test-advanced.js
var utils = require('utils');

var adobeAnalyticsBeacons = [];

casper.options.onResourceReceived = function(C, requestData, request) {
  if (requestData.status == "200" && requestData.stage == "end") {
    resources.push(requestData);
  }
};

casper.test.begin('Demo contains correct Data Layer', 12, function suite(test) {

  casper.start('https://demo.demogram.cz/', function() {
  
    test.comment('Testing https://demo.demogram.cz/...');
  
    test.assertEvalEquals(function(){return typeof digitalData}, 'object', 'digitalData is an object.');
    test.assertEval(function(){return digitalData instanceof Object}, 'digitalData is an instance of Object.');

    //load.finished
    this.wait(1000, function() {
      var aaRequested,
          aaParams,
          match,
          pl,
          search,
          decode,
          query;
      
      this.echo("I've waited for 1000 miliseconds.");
      aaRequested = false;

      for (var i = 0; i < resources.length; i++) {
        if (resources[i].url.match('https://etnetera.d2.sc.omtrdc.net/b/ss/etnfinancial/') !== null) {
          aaRequested = true;
          pl     = /\+/g,  // Regex for replacing addition symbol with a space
          search = /([^&=]+)=?([^&]*)/g,
          decode = function (s) {
            return decodeURIComponent(s.replace(pl, " "));
          },
          query  = resources[i].url.split("?")[1];
      
          aaParams = {};
          while (match = search.exec(query)) {
            aaParams[decode(match[1])] = decode(match[2]);
          }
          this.echo("Adobe Analytics beacon params: \n" + JSON.stringify(aaParams, null, 2));
        }
      }
      test.assertEquals(aaRequested, true, 'Adobe Analytics beacon requested.');
      test.assertEquals(aaParams.pageName, 'Demo: homepage', 'Page Name "Demo: homepage" correctly sent to Adobe Analytics.');

      this.fill('form#loginForm', {username: 'test'}, true);
      test.assertEvalEquals(function(){return digitalData.userId}, 'HRlc3R0ZXN', 'digitalData.userId equals "HRlc3R0ZXN".');
      });
  });

  casper.thenOpen('https://demo.demogram.cz/lead.html', function() {
  
    test.comment('Testing https://demo.demogram.cz/lead.html...');

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
