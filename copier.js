// phantomjs script to build screenshots
var page = require('webpage').create();
var args = require('system').args;

page.open(args[1], function(status) {
  console.log('Status: ' + status);
  page.render('render/p.png');
  phantom.exit();
});
