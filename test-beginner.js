// test-beginner.js
casper.test.begin('Demo contains correct Data Layer', 2, function suite(test) {
//   casper.options.viewportSize = {
//     width: 1920,
//     height: 1080
//   };
//   casper.start();
//   casper.userAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36');
// 
//   casper.thenOpen('http://mcftw.cz/', function() {
  
  casper.start('http://demo.demogram.cz/', function() {
    test.comment('Testing http://demo.demogram.cz/...');
  
    test.assertEvalEquals(function(){return typeof digitalData}, 'object', 'digitalData is an object.');
    test.assertEval(function(){return digitalData instanceof Object}, 'digitalData is an instance of Object.');
  });
  
  casper.run(function() {
    test.done();
  });
});
