/**
 * @fileoverview Convert JSON to HTML.
 */


goog.provide('ydn.jshtml.Transformer');
goog.require('goog.dom.xml');


/**
 * 
 * @param {Object=} options
 * @constructor
 */
ydn.jshtml.Transformer = function(options) {
  options = options || {};
  this.exclude_head_ = !!options['excludeHead'];
};


ydn.jshtml.Transformer.prototype.exclude_head_ = false;


/**
 * @protected
 * @type {!Array.<string>}
 */
ydn.jshtml.Transformer.prototype.attributes = ['title', 'class'];


/**
 * @protected
 * @type {!Array.<string>}
 */
ydn.jshtml.Transformer.prototype.tags = [
  'a', 'body',
  'div',
  'h1', 'head',
  'p', 'span'];


/**
 *
 * @param {!Object} json
 * @return {string} HTML text
 */
ydn.jshtml.Transformer.prototype.toHtml = function(json) {
  return '';
};


/**
 *
 * @param {string} html
 * @return {Object} given HTML in JSON format.
 */
ydn.jshtml.Transformer.prototype.toJson = function(html) {

  var me = this;

  /**
   *
   * @param {Element} ele
   * @return {!Object|Array}
   */
  var getHtml = function(ele) {
    if (me.tags.indexOf(ele.tagName) == -1) {
       return {};
    }
    var out;
    var att = [];
    var att_values = [];

    /**
     *
     * @param {Object} el
     */
    var putAtts = function(el) {
      for (var i = 0; i < att.length; i++) {
        el[att[i]] = att_values[i];
      }
      if (goog.isString(ele.textContent)) {
        el['textContent'] = ele.textContent;
      }
    };

    for (var i = 0; i < me.attributes.length; i++) {
      var value = ele.getAttribute(me.attributes[i]);
      if (goog.isString(value)) {
        att.push(me.attributes[i]);
        att_values.push(value);
      }
    }
    var n_child = ele.childElementCount;
    if (n_child == 0) {
      out = {};
      putAtts(out);
    } else if (n_child == 1) {
      out = getHtml(ele.firstElementChild);
      if (goog.isArray(out)) {
        out = {
          'innerHTML': out
        }
      }
      putAtts(out);
    } else {
      var children_placeholder;
      if (att.length == 0) {
        out = [];
        children_placeholder = out;
      } else {
        out = {};
        putAtts(out);
        out['innerHTML'] = [];
        children_placeholder = out['innerHTML'];
      }
      var child = ele.firstElementChild;
      do {
        if (me.tags.indexOf(child.tagName) >= 0) {
          children_placeholder.push(getHtml(child));
        }
      } while (child = child.nextElementSibling)
    }
    var json = {};
    json[ele.tagName] = out;
    return json;
  };

  /**
   * @type {Document}
   */
  var doc = goog.dom.xml.loadXml(html);
  var ele = doc.documentElement;
  var body_ele = ele.getElementsByTagName('body')[0];
  var html_out = {};
  if (this.exclude_head_) {
    html_out['html'] = getHtml(body_ele);
  } else {
    var head = getHtml(ele.getElementsByTagName('head')[0]);
    html_out['html'] = [head, getHtml(body_ele)];
  }
  return html_out;
};