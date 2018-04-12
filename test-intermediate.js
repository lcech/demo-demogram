// test-intermediate.js
casper.test.begin('Demo contains correct Data Layer', 10, function suite(test) {

  casper.start('http://demo.demogram.cz/', function() {
  
    test.comment('Testing http://demo.demogram.cz/...');
  
    test.assertEvalEquals(function(){return typeof digitalData}, 'object', 'digitalData is an object.');
    test.assertEval(function(){return digitalData instanceof Object}, 'digitalData is an instance of Object.');
    
    this.fill('form#loginForm', {username: 'test'}, true);
    test.assertEvalEquals(function(){return digitalData.userId}, 'ùaksjdfhlkasdjfb', 'digitalData.userId equals "HRlc3R0ZXN".');
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
