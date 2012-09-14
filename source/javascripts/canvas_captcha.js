CanvasCaptcha = function(els, opts) {
  var d = document,
      b = d.body,
      c = d.createElement("canvas"),
      ctx = c.getContext("2d");
  var methods = {
    extend: function(obj, extender) {
      for (var k in extender) {
        if (k in obj) {
          if (typeof obj[k] === "object") {
            obj[k] = methods._extend(obj[k], extender[k]);
          }
          else { obj[k] = extender[k]; }
        }
      }
      return obj;
    },
    each: function(arr, cb) { Array.prototype.forEach.call(arr, cb); },
    closest: function(node, el) {
      var p = el.parentNode,
          found;
      if ((new RegExp(node, "i")).test(p.nodeName)) {
        found = p;
      }
      else { found = methods.closest(node, p); }
      return found;
    },
    attr: function(el, obj) {
      for (var v in obj) { el.setAttribute(v, obj[v]); }
    },
    randomString: function() {
      var s = [];
      for (var i = 0; i < opts.character_count; i++) {
        s.push(opts.characters[~~(Math.random() * opts.characters.length)]);
      }
      return s.join("");
    },
    draw: function(img, str) {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = opts.background;
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = opts.color;
      ctx.font = opts.font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(str, c.width / 2, c.height / 2);
      img.src = c.toDataURL();
    },
    sendCaptcha: function(el, str) {
      var f = methods.closest("form", el);
      f.addEventListener("submit", function(e) {
        var captcha_status = f.querySelector('[name="' + opts.name + '"]');
        if (!captcha_status) { captcha_status = d.createElement("input"); }
        methods.attr(captcha_status, {
          type: "hidden",
          name: opts.name,
          value: el.value === str
        });
        f.appendChild(captcha_status);
      }, false);
    },
    create: function(el) {
      var img = d.createElement("img"),
          str = methods.randomString();
      img.width = c.width = opts.width;
      img.height = c.height = opts.height;
      img.className = "captcha";
      el.parentNode.insertBefore(img, el);
      methods.draw(img, str);
      methods.sendCaptcha(el, str);
    },
    generate: function() {
      methods.each(els, methods.create);
    }
  };

  if (!els || /Object|String|Number|Array/.test(els.constructor.toString())) {
    if (els && /O/.test(els.constructor.toString())) {
      opts = els;
      els = undefined;
    }
    els = d.querySelectorAll(els || "input.captcha");
  }
  else {
    if (els.jquery) { els = els[0]; }
  }
  if (!/NodeList/.test(els.constructor.toString())) { els = [els]; }
  if (opts) {
    opts = methods.extend(CanvasCaptcha.defaults, opts);
  }
  else { opts = CanvasCaptcha.defaults; }
  methods.generate();
}

CanvasCaptcha.defaults = {
  name: "captcha",
  width: 200,
  height: 80,
  background: "#ffcccc",
  font: "normal 18px Helvetica, Arial, sans-serif",
  color: "#333333",
  character_count: 6,
  // Overwriting this array entirely is not recommended. Instead,
  // push additional characters not included into the array with
  // CanvasCaptcha.characters.push("Â")
  characters: (function() {
    var chars = [];
    for (var i = 49; i < 58; i++) {
      // 1-9
      chars.push(String.fromCharCode(i));
    }
    for (i = 65; i < 91; i++) {
      // A-Z, excl. O, Q
      if (i !== 79 && i !== 81) {
        chars.push(String.fromCharCode(i));
      }
    }
    for (i = 97; i < 123; i++) {
      // a-z, excl. o
      if (i !== 111) { chars.push(String.fromCharCode(i)); }
    }
    return chars;
  })()
};
