
jade = (function(exports){
/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }
}

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    ac = ac.filter(nulls);
    bc = bc.filter(nulls);
    a['class'] = ac.concat(bc).join(' ');
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function nulls(val) {
  return val != null;
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj, escaped){
  var buf = []
    , terse = obj.terse;

  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;

  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
        buf.push(key + "='" + JSON.stringify(val) + "'");
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else if (escaped && escaped[key]) {
        buf.push(key + '="' + exports.escape(val) + '"');
      } else {
        buf.push(key + '="' + val + '"');
      }
    }
  }

  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = require('fs').readFileSync(filename, 'utf8')
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

  return exports;

})({});

jade.templates = {};
jade.render = function(node, template, data) {
  var tmp = jade.templates[template](data);
  node.innerHTML = tmp;
};

jade.templates["thumb"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var modal_mixin = function(content,id){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
buf.push('<div');
buf.push(attrs({ 'id':(id?id:''), "class": ('modal') + ' ' + ('container') }, {"id":true}));
buf.push('><div class="modal-wrapper valign-container"><div class="valign-content"><div class="modal-content"><div class="content">');
var __val__ = content
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div><a class="modal-close btn btn-big btn-round">x</a></div></div></div></div>');
};
var img_mixin = function(src,title,width,height,classes,realSrc){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
 var style = (width ? 'width:'+width+'px;' : '') + (height ? 'height:'+height+'px;' : '')+(!realSrc ? 'background-image:url("'+src+'");':'');
if ( !title)
{
 title = src.split('.');
 title.pop();
 title = title.join('.');
}
buf.push('<span');
buf.push(attrs({ 'title':(title), 'data-src':(src), "class": ('image') + ' ' + ((classes||'')+(!realSrc?' loaded':'')) }, {"class":true,"title":true,"data-src":true}));
buf.push('></span>');
};
var js_mixin = function(s,external){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
buf.push('<script');
buf.push(attrs({ 'type':("text/javascript"), 'src':(s+".js") }, {"type":true,"src":true}));
buf.push('></script>');
};
var css_mixin = function(c){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
buf.push('<link');
buf.push(attrs({ 'rel':('stylesheet'), 'type':('text/css'), 'href':(c+".css") }, {"rel":true,"type":true,"href":true}));
buf.push('/>');
};
var thumb_image_mixin = function(item,isThumb,classes,id){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
 var itemImage = isThumb ? "4.jpg" : "7.jpg"
 var width = isThumb ? "176" : "360";
 var height = isThumb ? "132" : "204";
 var className = (isThumb ? 'small' : 'big');
 var src = 'http://cinemoz.com/media/cinemoz/'+item.id+'/'+itemImage;
buf.push('<a');
buf.push(attrs({ 'href':('#movie:'+item.id), "class": ('thumb-link') + ' ' + ('thumb-link-image-'+className) }, {"class":true,"href":true}));
buf.push('>');
img_mixin(src,item.title,width,height,'thumb-image-'+className,1);
buf.push('</a>');
};
var thumb_mixin = function(item,i,count){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
 var genre,n;
 for(n in item.genre){
 	genre = item.genre[n];
 	break;}
buf.push('<div');
buf.push(attrs({ 'id':(item.id+'-item'), "class": ('thumb-container') + ' ' + ('container') + ' ' + ('wrapper') + ' ' + ("item-"+i+" item-"+(i==0? 'first' : (i==count-1)? 'last' : 'middle')) }, {"class":true,"id":true}));
buf.push('><div class="thumb-content"><div class="thumb-media">');
if ( item.media)
{
thumb_image_mixin(item,0);
thumb_image_mixin(item,1);
}
buf.push('</div><div class="thumb-info"><div class="thumb-title">');
var __val__ = item.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div><div class="thumb-details">');
if ( item.video.length)
{
buf.push('<div class="length-container tag-container"><span class="length tag">');
var __val__ = item.video.length
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></div>');
}
buf.push('<div class="category-container tag-container">');
if ( item.category)
{
// iterate item.category
;(function(){
  if ('number' == typeof item.category.length) {
    for (var $index = 0, $$l = item.category.length; $index < $$l; $index++) {
      var c = item.category[$index];

buf.push('<span');
buf.push(attrs({ "class": ('category') + ' ' + ('tag') + ' ' + (c) }, {"class":true}));
buf.push('>');
var __val__ = c
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
    }
  } else {
    for (var $index in item.category) {
      var c = item.category[$index];

buf.push('<span');
buf.push(attrs({ "class": ('category') + ' ' + ('tag') + ' ' + (c) }, {"class":true}));
buf.push('>');
var __val__ = c
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
   }
  }
}).call(this);

}
buf.push('</div><div class="genre-container tag-container">');
if ( item.genre)
{
// iterate item.genre
;(function(){
  if ('number' == typeof item.genre.length) {
    for (var $index = 0, $$l = item.genre.length; $index < $$l; $index++) {
      var g = item.genre[$index];

buf.push('<span');
buf.push(attrs({ "class": ('genre') + ' ' + ('tag') + ' ' + (g) }, {"class":true}));
buf.push('>');
var __val__ = g
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
    }
  } else {
    for (var $index in item.genre) {
      var g = item.genre[$index];

buf.push('<span');
buf.push(attrs({ "class": ('genre') + ' ' + ('tag') + ' ' + (g) }, {"class":true}));
buf.push('>');
var __val__ = g
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
   }
  }
}).call(this);

}
buf.push('</div><div class="country-container tag-container">');
if ( item.country)
{
buf.push('<span class="country tag">');
var __val__ = item.country
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
}
buf.push('</div><div class="actor-container tag-container">');
if ( item.actor)
{
// iterate item.actor
;(function(){
  if ('number' == typeof item.actor.length) {
    for (var $index = 0, $$l = item.actor.length; $index < $$l; $index++) {
      var a = item.actor[$index];

buf.push('<span class="actor tag">');
var __val__ = a
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
    }
  } else {
    for (var $index in item.actor) {
      var a = item.actor[$index];

buf.push('<span class="actor tag">');
var __val__ = a
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
   }
  }
}).call(this);

}
buf.push('</div><div class="director-container tag-container">');
if ( item.director)
{
// iterate item.director
;(function(){
  if ('number' == typeof item.director.length) {
    for (var $index = 0, $$l = item.director.length; $index < $$l; $index++) {
      var d = item.director[$index];

buf.push('<span class="director tag">');
var __val__ = d
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
    }
  } else {
    for (var $index in item.director) {
      var d = item.director[$index];

buf.push('<span class="director tag">');
var __val__ = d
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
   }
  }
}).call(this);

}
buf.push('</div>');
if ( item.serie)
{
buf.push('<div class="series-container tag-container"><span class="series tag">');
var __val__ = item.serie
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></div>');
}
if ( item.year)
{
buf.push('<div class="year-container tag-container"><span class="year tag">');
var __val__ = item.year
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></div>');
}
buf.push('</div>');
if ( item.synopsis)
{
buf.push('<div class="synopsis tag">');
var __val__ = item.synopsis
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div>');
}
buf.push('</div><a');
buf.push(attrs({ 'href':('#movie:'+item.id), "class": ('thumb-link') + ' ' + ('thumb-button') }, {"href":true}));
buf.push('></a></div></div>');
};
}
return buf.join("");
}