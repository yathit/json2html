
goog.require('templ.ydn.json2html.test1');
goog.require('templ.ydn.json2html.test2');
goog.require('ydn.jshtml.Transformer');

var debug_console = new goog.debug.Console();
debug_console.setCapturing(true);
goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.FINEST);

var options = {
  'excludeHead': true
};

var setUp = function() {

};


var test_toJson_test_1 = function() {
  var html = templ.ydn.json2html.test1.render();
  //console.log(html);
  var tf = new ydn.jshtml.Transformer(options);
  var json = tf.toJson(html);

  assertNotNullNorUndefined(json);
  //console.log(body);
  assertNotNullNorUndefined('has HTML', json.html);
  assertNotNullNorUndefined('has body', json.html.body);
  assertNotNullNorUndefined('has p', json.html.body.p);
  assertEquals('text content', 'Testing', json.html.body.p.textContent);
};



var test_toJson_test_2 = function() {
  var html = templ.ydn.json2html.test2.render();
  //console.log(html);
  var tf = new ydn.jshtml.Transformer(options);
  var json = tf.toJson(html);
  //console.log(json);
  assertNotNullNorUndefined(json);

  assertNotNullNorUndefined('has HTML', json.html);
  assertNotNullNorUndefined('has body', json.html.body);
  var body = json.html.body;
  //console.log(body);
  assertEquals('has 2 p', 2, body.length);
  assertNotNullNorUndefined('has p 1', body[0].p);
  assertEquals('p 1', 'Paragraph 1', body[0].p.textContent);
  assertNotNullNorUndefined('has p 2', body[1].p);
  assertEquals('p 2', 'Paragraph 2', body[1].p.textContent);
  console.log(JSON.stringify(json, null, 2));

};