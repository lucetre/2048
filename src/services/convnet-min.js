/* eslint-disable */
export var convnetjs = convnetjs || { REVISION: "ALPHA" };
(function (d) {
  var k = false;
  var e = 0;
  var l = function () {
    if (k) {
      k = false;
      return e;
    }
    var q = 2 * Math.random() - 1;
    var p = 2 * Math.random() - 1;
    var s = q * q + p * p;
    if (s == 0 || s > 1) {
      return l();
    }
    var t = Math.sqrt((-2 * Math.log(s)) / s);
    e = p * t;
    k = true;
    return q * t;
  };
  var i = function (q, p) {
    return Math.random() * (p - q) + q;
  };
  var g = function (q, p) {
    return Math.floor(Math.random() * (p - q) + q);
  };
  var c = function (q, p) {
    return q + l() * p;
  };
  var f = function (r) {
    if (typeof r === "undefined" || isNaN(r)) {
      return [];
    }
    if (typeof ArrayBuffer === "undefined") {
      var p = new Array(r);
      for (var q = 0; q < r; q++) {
        p[q] = 0;
      }
      return p;
    } else {
      return new Float64Array(r);
    }
  };
  var n = function (p, q) {
    for (var r = 0, s = p.length; r < s; r++) {
      if (p[r] === q) {
        return true;
      }
    }
    return false;
  };
  var o = function (q) {
    var p = [];
    for (var r = 0, s = q.length; r < s; r++) {
      if (!n(p, q[r])) {
        p.push(q[r]);
      }
    }
    return p;
  };
  var b = function (q) {
    if (q.length === 0) {
      return {};
    }
    var p = q[0];
    var s = q[0];
    var r = 0;
    var u = 0;
    var v = q.length;
    for (var t = 1; t < v; t++) {
      if (q[t] > p) {
        p = q[t];
        r = t;
      }
      if (q[t] < s) {
        s = q[t];
        u = t;
      }
    }
    return { maxi: r, maxv: p, mini: u, minv: s, dv: p - s };
  };
  var j = function (v) {
    var s = v,
      r = 0,
      p;
    var u = [];
    for (var t = 0; t < v; t++) {
      u[t] = t;
    }
    while (s--) {
      r = Math.floor(Math.random() * (s + 1));
      p = u[s];
      u[s] = u[r];
      u[r] = p;
    }
    return u;
  };
  var h = function (q, v) {
    var t = i(0, 1);
    var s = 0;
    for (var r = 0, u = q.length; r < u; r++) {
      s += v[r];
      if (t < s) {
        return q[r];
      }
    }
  };
  var m = function (s, t, p) {
    if (typeof t === "string") {
      return typeof s[t] !== "undefined" ? s[t] : p;
    } else {
      var q = p;
      for (var r = 0; r < t.length; r++) {
        var u = t[r];
        if (typeof s[u] !== "undefined") {
          q = s[u];
        }
      }
      return q;
    }
  };
  function a(q, p) {
    if (!q) {
      p = p || "Assertion failed";
      if (typeof Error !== "undefined") {
        throw new Error(p);
      }
      throw p;
    }
  }
  d.randf = i;
  d.randi = g;
  d.randn = c;
  d.zeros = f;
  d.maxmin = b;
  d.randperm = j;
  d.weightedSample = h;
  d.arrUnique = o;
  d.arrContains = n;
  d.getopt = m;
  d.assert = a;
})(convnetjs);
(function (b) {
  var a = function (k, g, f, j) {
    if (Object.prototype.toString.call(k) === "[object Array]") {
      this.sx = 1;
      this.sy = 1;
      this.depth = k.length;
      this.w = b.zeros(this.depth);
      this.dw = b.zeros(this.depth);
      for (var d = 0; d < this.depth; d++) {
        this.w[d] = k[d];
      }
    } else {
      this.sx = k;
      this.sy = g;
      this.depth = f;
      var h = k * g * f;
      this.w = b.zeros(h);
      this.dw = b.zeros(h);
      if (typeof j === "undefined") {
        var e = Math.sqrt(1 / (k * g * f));
        for (var d = 0; d < h; d++) {
          this.w[d] = b.randn(0, e);
        }
      } else {
        for (var d = 0; d < h; d++) {
          this.w[d] = j;
        }
      }
    }
  };
  a.prototype = {
    get: function (c, g, f) {
      var e = (this.sx * g + c) * this.depth + f;
      return this.w[e];
    },
    set: function (c, h, g, f) {
      var e = (this.sx * h + c) * this.depth + g;
      this.w[e] = f;
    },
    add: function (c, h, g, f) {
      var e = (this.sx * h + c) * this.depth + g;
      this.w[e] += f;
    },
    get_grad: function (c, g, f) {
      var e = (this.sx * g + c) * this.depth + f;
      return this.dw[e];
    },
    set_grad: function (c, h, g, f) {
      var e = (this.sx * h + c) * this.depth + g;
      this.dw[e] = f;
    },
    add_grad: function (c, h, g, f) {
      var e = (this.sx * h + c) * this.depth + g;
      this.dw[e] += f;
    },
    cloneAndZero: function () {
      return new a(this.sx, this.sy, this.depth, 0);
    },
    clone: function () {
      var c = new a(this.sx, this.sy, this.depth, 0);
      var e = this.w.length;
      for (var d = 0; d < e; d++) {
        c.w[d] = this.w[d];
      }
      return c;
    },
    addFrom: function (c) {
      for (var d = 0; d < this.w.length; d++) {
        this.w[d] += c.w[d];
      }
    },
    addFromScaled: function (d, c) {
      for (var e = 0; e < this.w.length; e++) {
        this.w[e] += c * d.w[e];
      }
    },
    setConst: function (c) {
      for (var d = 0; d < this.w.length; d++) {
        this.w[d] = c;
      }
    },
    toJSON: function () {
      var c = {};
      c.sx = this.sx;
      c.sy = this.sy;
      c.depth = this.depth;
      c.w = this.w;
      return c;
    },
    fromJSON: function (d) {
      this.sx = d.sx;
      this.sy = d.sy;
      this.depth = d.depth;
      var e = this.sx * this.sy * this.depth;
      this.w = b.zeros(e);
      this.dw = b.zeros(e);
      for (var c = 0; c < e; c++) {
        this.w[c] = d.w[c];
      }
    },
  };
  b.Vol = a;
})(convnetjs);
(function (c) {
  var a = c.Vol;
  var b = function (f, h, n, m, g) {
    if (typeof g === "undefined") {
      var g = false;
    }
    if (typeof n === "undefined") {
      var n = c.randi(0, f.sx - h);
    }
    if (typeof m === "undefined") {
      var m = c.randi(0, f.sy - h);
    }
    var e;
    if (h !== f.sx || n !== 0 || m !== 0) {
      e = new a(h, h, f.depth, 0);
      for (var l = 0; l < h; l++) {
        for (var k = 0; k < h; k++) {
          if (l + n < 0 || l + n >= f.sx || k + m < 0 || k + m >= f.sy) {
            continue;
          }
          for (var j = 0; j < f.depth; j++) {
            e.set(l, k, j, f.get(l + n, k + m, j));
          }
        }
      }
    } else {
      e = f;
    }
    if (g) {
      var i = e.cloneAndZero();
      for (var l = 0; l < e.sx; l++) {
        for (var k = 0; k < e.sy; k++) {
          for (var j = 0; j < e.depth; j++) {
            i.set(l, k, j, e.get(e.sx - l - 1, k, j));
          }
        }
      }
      e = i;
    }
    return e;
  };
  var d = function (o, n) {
    if (typeof n === "undefined") {
      var n = false;
    }
    var h = document.createElement("canvas");
    h.width = o.width;
    h.height = o.height;
    var u = h.getContext("2d");
    try {
      u.drawImage(o, 0, 0);
    } catch (q) {
      if (q.name === "NS_ERROR_NOT_AVAILABLE") {
        return false;
      } else {
        throw q;
      }
    }
    try {
      var v = u.getImageData(0, 0, h.width, h.height);
    } catch (q) {
      if (q.name === "IndexSizeError") {
        return false;
      } else {
        throw q;
      }
    }
    var g = v.data;
    var k = o.width;
    var s = o.height;
    var t = [];
    for (var m = 0; m < g.length; m++) {
      t.push(g[m] / 255 - 0.5);
    }
    var r = new a(k, s, 4, 0);
    r.w = t;
    if (n) {
      var f = new a(k, s, 1, 0);
      for (var m = 0; m < k; m++) {
        for (var l = 0; l < s; l++) {
          f.set(m, l, 0, r.get(m, l, 0));
        }
      }
      r = f;
    }
    return r;
  };
  c.augment = b;
  c.img_to_vol = d;
})(convnetjs);
(function (c) {
  var a = c.Vol;
  var d = function (g) {
    var g = g || {};
    this.out_depth = g.filters;
    this.sx = g.sx;
    this.in_depth = g.in_depth;
    this.in_sx = g.in_sx;
    this.in_sy = g.in_sy;
    this.sy = typeof g.sy !== "undefined" ? g.sy : this.sx;
    this.stride = typeof g.stride !== "undefined" ? g.stride : 1;
    this.pad = typeof g.pad !== "undefined" ? g.pad : 0;
    this.l1_decay_mul =
      typeof g.l1_decay_mul !== "undefined" ? g.l1_decay_mul : 0;
    this.l2_decay_mul =
      typeof g.l2_decay_mul !== "undefined" ? g.l2_decay_mul : 1;
    this.out_sx = Math.floor(
      (this.in_sx + this.pad * 2 - this.sx) / this.stride + 1
    );
    this.out_sy = Math.floor(
      (this.in_sy + this.pad * 2 - this.sy) / this.stride + 1
    );
    this.layer_type = "conv";
    var e = typeof g.bias_pref !== "undefined" ? g.bias_pref : 0;
    this.filters = [];
    for (var f = 0; f < this.out_depth; f++) {
      this.filters.push(new a(this.sx, this.sy, this.in_depth));
    }
    this.biases = new a(1, 1, this.out_depth, e);
  };
  d.prototype = {
    forward: function (h, k) {
      this.in_act = h;
      var q = new a(this.out_sx | 0, this.out_sy | 0, this.out_depth | 0, 0);
      var w = h.sx | 0;
      var u = h.sy | 0;
      var r = this.stride | 0;
      for (var t = 0; t < this.out_depth; t++) {
        var s = this.filters[t];
        var n = -this.pad | 0;
        var l = -this.pad | 0;
        for (var m = 0; m < this.out_sy; l += r, m++) {
          n = -this.pad | 0;
          for (var o = 0; o < this.out_sx; n += r, o++) {
            var v = 0;
            for (var e = 0; e < s.sy; e++) {
              var i = l + e;
              for (var g = 0; g < s.sx; g++) {
                var j = n + g;
                if (i >= 0 && i < u && j >= 0 && j < w) {
                  for (var p = 0; p < s.depth; p++) {
                    v +=
                      s.w[(s.sx * e + g) * s.depth + p] *
                      h.w[(w * i + j) * h.depth + p];
                  }
                }
              }
            }
            v += this.biases.w[t];
            q.set(o, m, t, v);
          }
        }
      }
      this.out_act = q;
      return this.out_act;
    },
    backward: function () {
      var i = this.in_act;
      i.dw = c.zeros(i.w.length);
      var w = i.sx | 0;
      var v = i.sy | 0;
      var q = this.stride | 0;
      for (var t = 0; t < this.out_depth; t++) {
        var r = this.filters[t];
        var n = -this.pad | 0;
        var l = -this.pad | 0;
        for (var m = 0; m < this.out_sy; l += q, m++) {
          n = -this.pad | 0;
          for (var o = 0; o < this.out_sx; n += q, o++) {
            var e = this.out_act.get_grad(o, m, t);
            for (var g = 0; g < r.sy; g++) {
              var j = l + g;
              for (var h = 0; h < r.sx; h++) {
                var k = n + h;
                if (j >= 0 && j < v && k >= 0 && k < w) {
                  for (var p = 0; p < r.depth; p++) {
                    var u = (w * j + k) * i.depth + p;
                    var s = (r.sx * g + h) * r.depth + p;
                    r.dw[s] += i.w[u] * e;
                    i.dw[u] += r.w[s] * e;
                  }
                }
              }
            }
            this.biases.dw[t] += e;
          }
        }
      }
    },
    getParamsAndGrads: function () {
      var e = [];
      for (var f = 0; f < this.out_depth; f++) {
        e.push({
          params: this.filters[f].w,
          grads: this.filters[f].dw,
          l2_decay_mul: this.l2_decay_mul,
          l1_decay_mul: this.l1_decay_mul,
        });
      }
      e.push({
        params: this.biases.w,
        grads: this.biases.dw,
        l1_decay_mul: 0,
        l2_decay_mul: 0,
      });
      return e;
    },
    toJSON: function () {
      var f = {};
      f.sx = this.sx;
      f.sy = this.sy;
      f.stride = this.stride;
      f.in_depth = this.in_depth;
      f.out_depth = this.out_depth;
      f.out_sx = this.out_sx;
      f.out_sy = this.out_sy;
      f.layer_type = this.layer_type;
      f.l1_decay_mul = this.l1_decay_mul;
      f.l2_decay_mul = this.l2_decay_mul;
      f.pad = this.pad;
      f.filters = [];
      for (var e = 0; e < this.filters.length; e++) {
        f.filters.push(this.filters[e].toJSON());
      }
      f.biases = this.biases.toJSON();
      return f;
    },
    fromJSON: function (g) {
      this.out_depth = g.out_depth;
      this.out_sx = g.out_sx;
      this.out_sy = g.out_sy;
      this.layer_type = g.layer_type;
      this.sx = g.sx;
      this.sy = g.sy;
      this.stride = g.stride;
      this.in_depth = g.in_depth;
      this.filters = [];
      this.l1_decay_mul =
        typeof g.l1_decay_mul !== "undefined" ? g.l1_decay_mul : 1;
      this.l2_decay_mul =
        typeof g.l2_decay_mul !== "undefined" ? g.l2_decay_mul : 1;
      this.pad = typeof g.pad !== "undefined" ? g.pad : 0;
      for (var f = 0; f < g.filters.length; f++) {
        var e = new a(0, 0, 0, 0);
        e.fromJSON(g.filters[f]);
        this.filters.push(e);
      }
      this.biases = new a(0, 0, 0, 0);
      this.biases.fromJSON(g.biases);
    },
  };
  var b = function (g) {
    var g = g || {};
    this.out_depth =
      typeof g.num_neurons !== "undefined" ? g.num_neurons : g.filters;
    this.l1_decay_mul =
      typeof g.l1_decay_mul !== "undefined" ? g.l1_decay_mul : 0;
    this.l2_decay_mul =
      typeof g.l2_decay_mul !== "undefined" ? g.l2_decay_mul : 1;
    this.num_inputs = g.in_sx * g.in_sy * g.in_depth;
    this.out_sx = 1;
    this.out_sy = 1;
    this.layer_type = "fc";
    var e = typeof g.bias_pref !== "undefined" ? g.bias_pref : 0;
    this.filters = [];
    for (var f = 0; f < this.out_depth; f++) {
      this.filters.push(new a(1, 1, this.num_inputs));
    }
    this.biases = new a(1, 1, this.out_depth, e);
  };
  b.prototype = {
    forward: function (h, l) {
      this.in_act = h;
      var f = new a(1, 1, this.out_depth, 0);
      var k = h.w;
      for (var j = 0; j < this.out_depth; j++) {
        var g = 0;
        var e = this.filters[j].w;
        for (var m = 0; m < this.num_inputs; m++) {
          g += k[m] * e[m];
        }
        g += this.biases.w[j];
        f.w[j] = g;
      }
      this.out_act = f;
      return this.out_act;
    },
    backward: function () {
      var e = this.in_act;
      e.dw = c.zeros(e.w.length);
      for (var f = 0; f < this.out_depth; f++) {
        var h = this.filters[f];
        var g = this.out_act.dw[f];
        for (var j = 0; j < this.num_inputs; j++) {
          e.dw[j] += h.w[j] * g;
          h.dw[j] += e.w[j] * g;
        }
        this.biases.dw[f] += g;
      }
    },
    getParamsAndGrads: function () {
      var e = [];
      for (var f = 0; f < this.out_depth; f++) {
        e.push({
          params: this.filters[f].w,
          grads: this.filters[f].dw,
          l1_decay_mul: this.l1_decay_mul,
          l2_decay_mul: this.l2_decay_mul,
        });
      }
      e.push({
        params: this.biases.w,
        grads: this.biases.dw,
        l1_decay_mul: 0,
        l2_decay_mul: 0,
      });
      return e;
    },
    toJSON: function () {
      var f = {};
      f.out_depth = this.out_depth;
      f.out_sx = this.out_sx;
      f.out_sy = this.out_sy;
      f.layer_type = this.layer_type;
      f.num_inputs = this.num_inputs;
      f.l1_decay_mul = this.l1_decay_mul;
      f.l2_decay_mul = this.l2_decay_mul;
      f.filters = [];
      for (var e = 0; e < this.filters.length; e++) {
        f.filters.push(this.filters[e].toJSON());
      }
      f.biases = this.biases.toJSON();
      return f;
    },
    fromJSON: function (g) {
      this.out_depth = g.out_depth;
      this.out_sx = g.out_sx;
      this.out_sy = g.out_sy;
      this.layer_type = g.layer_type;
      this.num_inputs = g.num_inputs;
      this.l1_decay_mul =
        typeof g.l1_decay_mul !== "undefined" ? g.l1_decay_mul : 1;
      this.l2_decay_mul =
        typeof g.l2_decay_mul !== "undefined" ? g.l2_decay_mul : 1;
      this.filters = [];
      for (var f = 0; f < g.filters.length; f++) {
        var e = new a(0, 0, 0, 0);
        e.fromJSON(g.filters[f]);
        this.filters.push(e);
      }
      this.biases = new a(0, 0, 0, 0);
      this.biases.fromJSON(g.biases);
    },
  };
  c.ConvLayer = d;
  c.FullyConnLayer = b;
})(convnetjs);
(function (c) {
  var a = c.Vol;
  var b = function (d) {
    var d = d || {};
    this.sx = d.sx;
    this.in_depth = d.in_depth;
    this.in_sx = d.in_sx;
    this.in_sy = d.in_sy;
    this.sy = typeof d.sy !== "undefined" ? d.sy : this.sx;
    this.stride = typeof d.stride !== "undefined" ? d.stride : 2;
    this.pad = typeof d.pad !== "undefined" ? d.pad : 0;
    this.out_depth = this.in_depth;
    this.out_sx = Math.floor(
      (this.in_sx + this.pad * 2 - this.sx) / this.stride + 1
    );
    this.out_sy = Math.floor(
      (this.in_sy + this.pad * 2 - this.sy) / this.stride + 1
    );
    this.layer_type = "pool";
    this.switchx = c.zeros(this.out_sx * this.out_sy * this.out_depth);
    this.switchy = c.zeros(this.out_sx * this.out_sy * this.out_depth);
  };
  b.prototype = {
    forward: function (l, u) {
      this.in_act = l;
      var h = new a(this.out_sx, this.out_sy, this.out_depth, 0);
      var i = 0;
      for (var p = 0; p < this.out_depth; p++) {
        var s = -this.pad;
        var q = -this.pad;
        for (var e = 0; e < this.out_sx; s += this.stride, e++) {
          q = -this.pad;
          for (var w = 0; w < this.out_sy; q += this.stride, w++) {
            var r = -99999;
            var o = -1,
              k = -1;
            for (var m = 0; m < this.sx; m++) {
              for (var j = 0; j < this.sy; j++) {
                var f = q + j;
                var g = s + m;
                if (f >= 0 && f < l.sy && g >= 0 && g < l.sx) {
                  var t = l.get(g, f, p);
                  if (t > r) {
                    r = t;
                    o = g;
                    k = f;
                  }
                }
              }
            }
            this.switchx[i] = o;
            this.switchy[i] = k;
            i++;
            h.set(e, w, p, r);
          }
        }
      }
      this.out_act = h;
      return this.out_act;
    },
    backward: function () {
      var h = this.in_act;
      h.dw = c.zeros(h.w.length);
      var f = this.out_act;
      var g = 0;
      for (var j = 0; j < this.out_depth; j++) {
        var l = -this.pad;
        var k = -this.pad;
        for (var e = 0; e < this.out_sx; l += this.stride, e++) {
          k = -this.pad;
          for (var m = 0; m < this.out_sy; k += this.stride, m++) {
            var i = this.out_act.get_grad(e, m, j);
            h.add_grad(this.switchx[g], this.switchy[g], j, i);
            g++;
          }
        }
      }
    },
    getParamsAndGrads: function () {
      return [];
    },
    toJSON: function () {
      var d = {};
      d.sx = this.sx;
      d.sy = this.sy;
      d.stride = this.stride;
      d.in_depth = this.in_depth;
      d.out_depth = this.out_depth;
      d.out_sx = this.out_sx;
      d.out_sy = this.out_sy;
      d.layer_type = this.layer_type;
      d.pad = this.pad;
      return d;
    },
    fromJSON: function (d) {
      this.out_depth = d.out_depth;
      this.out_sx = d.out_sx;
      this.out_sy = d.out_sy;
      this.layer_type = d.layer_type;
      this.sx = d.sx;
      this.sy = d.sy;
      this.stride = d.stride;
      this.in_depth = d.in_depth;
      this.pad = typeof d.pad !== "undefined" ? d.pad : 0;
      this.switchx = c.zeros(this.out_sx * this.out_sy * this.out_depth);
      this.switchy = c.zeros(this.out_sx * this.out_sy * this.out_depth);
    },
  };
  c.PoolLayer = b;
})(convnetjs);
(function (c) {
  var a = c.Vol;
  var d = c.getopt;
  var b = function (e) {
    var e = e || {};
    this.out_depth = d(e, ["out_depth", "depth"], 0);
    this.out_sx = d(e, ["out_sx", "sx", "width"], 1);
    this.out_sy = d(e, ["out_sy", "sy", "height"], 1);
    this.layer_type = "input";
  };
  b.prototype = {
    forward: function (e, f) {
      this.in_act = e;
      this.out_act = e;
      return this.out_act;
    },
    backward: function () {},
    getParamsAndGrads: function () {
      return [];
    },
    toJSON: function () {
      var e = {};
      e.out_depth = this.out_depth;
      e.out_sx = this.out_sx;
      e.out_sy = this.out_sy;
      e.layer_type = this.layer_type;
      return e;
    },
    fromJSON: function (e) {
      this.out_depth = e.out_depth;
      this.out_sx = e.out_sx;
      this.out_sy = e.out_sy;
      this.layer_type = e.layer_type;
    },
  };
  c.InputLayer = b;
})(convnetjs);
(function (e) {
  var a = e.Vol;
  var c = function (f) {
    var f = f || {};
    this.num_inputs = f.in_sx * f.in_sy * f.in_depth;
    this.out_depth = this.num_inputs;
    this.out_sx = 1;
    this.out_sy = 1;
    this.layer_type = "softmax";
  };
  c.prototype = {
    forward: function (h, o) {
      this.in_act = h;
      var f = new a(1, 1, this.out_depth, 0);
      var j = h.w;
      var k = h.w[0];
      for (var l = 1; l < this.out_depth; l++) {
        if (j[l] > k) {
          k = j[l];
        }
      }
      var n = e.zeros(this.out_depth);
      var g = 0;
      for (var l = 0; l < this.out_depth; l++) {
        var m = Math.exp(j[l] - k);
        g += m;
        n[l] = m;
      }
      for (var l = 0; l < this.out_depth; l++) {
        n[l] /= g;
        f.w[l] = n[l];
      }
      this.es = n;
      this.out_act = f;
      return this.out_act;
    },
    backward: function (k) {
      var f = this.in_act;
      f.dw = e.zeros(f.w.length);
      for (var h = 0; h < this.out_depth; h++) {
        var g = h === k ? 1 : 0;
        var j = -(g - this.es[h]);
        f.dw[h] = j;
      }
      return -Math.log(this.es[k]);
    },
    getParamsAndGrads: function () {
      return [];
    },
    toJSON: function () {
      var f = {};
      f.out_depth = this.out_depth;
      f.out_sx = this.out_sx;
      f.out_sy = this.out_sy;
      f.layer_type = this.layer_type;
      f.num_inputs = this.num_inputs;
      return f;
    },
    fromJSON: function (f) {
      this.out_depth = f.out_depth;
      this.out_sx = f.out_sx;
      this.out_sy = f.out_sy;
      this.layer_type = f.layer_type;
      this.num_inputs = f.num_inputs;
    },
  };
  var d = function (f) {
    var f = f || {};
    this.num_inputs = f.in_sx * f.in_sy * f.in_depth;
    this.out_depth = this.num_inputs;
    this.out_sx = 1;
    this.out_sy = 1;
    this.layer_type = "regression";
  };
  d.prototype = {
    forward: function (f, g) {
      this.in_act = f;
      this.out_act = f;
      return f;
    },
    backward: function (l) {
      var f = this.in_act;
      f.dw = e.zeros(f.w.length);
      var k = 0;
      if (l instanceof Array || l instanceof Float64Array) {
        for (var j = 0; j < this.out_depth; j++) {
          var g = f.w[j] - l[j];
          f.dw[j] = g;
          k += 0.5 * g * g;
        }
      } else {
        if (typeof l === "number") {
          var g = f.w[0] - l;
          f.dw[0] = g;
          k += 0.5 * g * g;
        } else {
          var j = l.dim;
          var h = l.val;
          var g = f.w[j] - h;
          f.dw[j] = g;
          k += 0.5 * g * g;
        }
      }
      return k;
    },
    getParamsAndGrads: function () {
      return [];
    },
    toJSON: function () {
      var f = {};
      f.out_depth = this.out_depth;
      f.out_sx = this.out_sx;
      f.out_sy = this.out_sy;
      f.layer_type = this.layer_type;
      f.num_inputs = this.num_inputs;
      return f;
    },
    fromJSON: function (f) {
      this.out_depth = f.out_depth;
      this.out_sx = f.out_sx;
      this.out_sy = f.out_sy;
      this.layer_type = f.layer_type;
      this.num_inputs = f.num_inputs;
    },
  };
  var b = function (f) {
    var f = f || {};
    this.num_inputs = f.in_sx * f.in_sy * f.in_depth;
    this.out_depth = this.num_inputs;
    this.out_sx = 1;
    this.out_sy = 1;
    this.layer_type = "svm";
  };
  b.prototype = {
    forward: function (f, g) {
      this.in_act = f;
      this.out_act = f;
      return f;
    },
    backward: function (m) {
      var g = this.in_act;
      g.dw = e.zeros(g.w.length);
      var f = g.w[m];
      var k = 1;
      var j = 0;
      for (var h = 0; h < this.out_depth; h++) {
        if (m === h) {
          continue;
        }
        var l = -f + g.w[h] + k;
        if (l > 0) {
          g.dw[h] += 1;
          g.dw[m] -= 1;
          j += l;
        }
      }
      return j;
    },
    getParamsAndGrads: function () {
      return [];
    },
    toJSON: function () {
      var f = {};
      f.out_depth = this.out_depth;
      f.out_sx = this.out_sx;
      f.out_sy = this.out_sy;
      f.layer_type = this.layer_type;
      f.num_inputs = this.num_inputs;
      return f;
    },
    fromJSON: function (f) {
      this.out_depth = f.out_depth;
      this.out_sx = f.out_sx;
      this.out_sy = f.out_sy;
      this.layer_type = f.layer_type;
      this.num_inputs = f.num_inputs;
    },
  };
  e.RegressionLayer = d;
  e.SoftmaxLayer = c;
  e.SVMLayer = b;
})(convnetjs);
(function (d) {
  var a = d.Vol;
  var e = function (h) {
    var h = h || {};
    this.out_sx = h.in_sx;
    this.out_sy = h.in_sy;
    this.out_depth = h.in_depth;
    this.layer_type = "relu";
  };
  e.prototype = {
    forward: function (j, l) {
      this.in_act = j;
      var h = j.clone();
      var m = j.w.length;
      var n = h.w;
      for (var k = 0; k < m; k++) {
        if (n[k] < 0) {
          n[k] = 0;
        }
      }
      this.out_act = h;
      return this.out_act;
    },
    backward: function () {
      var j = this.in_act;
      var h = this.out_act;
      var l = j.w.length;
      j.dw = d.zeros(l);
      for (var k = 0; k < l; k++) {
        if (h.w[k] <= 0) {
          j.dw[k] = 0;
        } else {
          j.dw[k] = h.dw[k];
        }
      }
    },
    getParamsAndGrads: function () {
      return [];
    },
    toJSON: function () {
      var h = {};
      h.out_depth = this.out_depth;
      h.out_sx = this.out_sx;
      h.out_sy = this.out_sy;
      h.layer_type = this.layer_type;
      return h;
    },
    fromJSON: function (h) {
      this.out_depth = h.out_depth;
      this.out_sx = h.out_sx;
      this.out_sy = h.out_sy;
      this.layer_type = h.layer_type;
    },
  };
  var g = function (h) {
    var h = h || {};
    this.out_sx = h.in_sx;
    this.out_sy = h.in_sy;
    this.out_depth = h.in_depth;
    this.layer_type = "sigmoid";
  };
  g.prototype = {
    forward: function (j, m) {
      this.in_act = j;
      var h = j.cloneAndZero();
      var n = j.w.length;
      var o = h.w;
      var l = j.w;
      for (var k = 0; k < n; k++) {
        o[k] = 1 / (1 + Math.exp(-l[k]));
      }
      this.out_act = h;
      return this.out_act;
    },
    backward: function () {
      var j = this.in_act;
      var h = this.out_act;
      var m = j.w.length;
      j.dw = d.zeros(m);
      for (var k = 0; k < m; k++) {
        var l = h.w[k];
        j.dw[k] = l * (1 - l) * h.dw[k];
      }
    },
    getParamsAndGrads: function () {
      return [];
    },
    toJSON: function () {
      var h = {};
      h.out_depth = this.out_depth;
      h.out_sx = this.out_sx;
      h.out_sy = this.out_sy;
      h.layer_type = this.layer_type;
      return h;
    },
    fromJSON: function (h) {
      this.out_depth = h.out_depth;
      this.out_sx = h.out_sx;
      this.out_sy = h.out_sy;
      this.layer_type = h.layer_type;
    },
  };
  var f = function (h) {
    var h = h || {};
    this.group_size = typeof h.group_size !== "undefined" ? h.group_size : 2;
    this.out_sx = h.in_sx;
    this.out_sy = h.in_sy;
    this.out_depth = Math.floor(h.in_depth / this.group_size);
    this.layer_type = "maxout";
    this.switches = d.zeros(this.out_sx * this.out_sy * this.out_depth);
  };
  f.prototype = {
    forward: function (l, w) {
      this.in_act = l;
      var q = this.out_depth;
      var v = new a(this.out_sx, this.out_sy, this.out_depth, 0);
      if (this.out_sx === 1 && this.out_sy === 1) {
        for (var p = 0; p < q; p++) {
          var m = p * this.group_size;
          var u = l.w[m];
          var r = 0;
          for (var o = 1; o < this.group_size; o++) {
            var h = l.w[m + o];
            if (h > u) {
              u = h;
              r = o;
            }
          }
          v.w[p] = u;
          this.switches[p] = m + r;
        }
      } else {
        var k = 0;
        for (var t = 0; t < l.sx; t++) {
          for (var s = 0; s < l.sy; s++) {
            for (var p = 0; p < q; p++) {
              var m = p * this.group_size;
              var u = l.get(t, s, m);
              var r = 0;
              for (var o = 1; o < this.group_size; o++) {
                var h = l.get(t, s, m + o);
                if (h > u) {
                  u = h;
                  r = o;
                }
              }
              v.set(t, s, p, u);
              this.switches[k] = m + r;
              k++;
            }
          }
        }
      }
      this.out_act = v;
      return this.out_act;
    },
    backward: function () {
      var k = this.in_act;
      var j = this.out_act;
      var o = this.out_depth;
      k.dw = d.zeros(k.w.length);
      if (this.out_sx === 1 && this.out_sy === 1) {
        for (var l = 0; l < o; l++) {
          var m = j.dw[l];
          k.dw[this.switches[l]] = m;
        }
      } else {
        var q = 0;
        for (var h = 0; h < j.sx; h++) {
          for (var p = 0; p < j.sy; p++) {
            for (var l = 0; l < o; l++) {
              var m = j.get_grad(h, p, l);
              k.set_grad(h, p, this.switches[q], m);
              q++;
            }
          }
        }
      }
    },
    getParamsAndGrads: function () {
      return [];
    },
    toJSON: function () {
      var h = {};
      h.out_depth = this.out_depth;
      h.out_sx = this.out_sx;
      h.out_sy = this.out_sy;
      h.layer_type = this.layer_type;
      h.group_size = this.group_size;
      return h;
    },
    fromJSON: function (h) {
      this.out_depth = h.out_depth;
      this.out_sx = h.out_sx;
      this.out_sy = h.out_sy;
      this.layer_type = h.layer_type;
      this.group_size = h.group_size;
      this.switches = d.zeros(this.group_size);
    },
  };
  function c(h) {
    var i = Math.exp(2 * h);
    return (i - 1) / (i + 1);
  }
  var b = function (h) {
    var h = h || {};
    this.out_sx = h.in_sx;
    this.out_sy = h.in_sy;
    this.out_depth = h.in_depth;
    this.layer_type = "tanh";
  };
  b.prototype = {
    forward: function (j, l) {
      this.in_act = j;
      var h = j.cloneAndZero();
      var m = j.w.length;
      for (var k = 0; k < m; k++) {
        h.w[k] = c(j.w[k]);
      }
      this.out_act = h;
      return this.out_act;
    },
    backward: function () {
      var j = this.in_act;
      var h = this.out_act;
      var m = j.w.length;
      j.dw = d.zeros(m);
      for (var k = 0; k < m; k++) {
        var l = h.w[k];
        j.dw[k] = (1 - l * l) * h.dw[k];
      }
    },
    getParamsAndGrads: function () {
      return [];
    },
    toJSON: function () {
      var h = {};
      h.out_depth = this.out_depth;
      h.out_sx = this.out_sx;
      h.out_sy = this.out_sy;
      h.layer_type = this.layer_type;
      return h;
    },
    fromJSON: function (h) {
      this.out_depth = h.out_depth;
      this.out_sx = h.out_sx;
      this.out_sy = h.out_sy;
      this.layer_type = h.layer_type;
    },
  };
  d.TanhLayer = b;
  d.MaxoutLayer = f;
  d.ReluLayer = e;
  d.SigmoidLayer = g;
})(convnetjs);
(function (c) {
  var a = c.Vol;
  var b = function (d) {
    var d = d || {};
    this.out_sx = d.in_sx;
    this.out_sy = d.in_sy;
    this.out_depth = d.in_depth;
    this.layer_type = "dropout";
    this.drop_prob = typeof d.drop_prob !== "undefined" ? d.drop_prob : 0.5;
    this.dropped = c.zeros(this.out_sx * this.out_sy * this.out_depth);
  };
  b.prototype = {
    forward: function (e, g) {
      this.in_act = e;
      if (typeof g === "undefined") {
        g = false;
      }
      var d = e.clone();
      var h = e.w.length;
      if (g) {
        for (var f = 0; f < h; f++) {
          if (Math.random() < this.drop_prob) {
            d.w[f] = 0;
            this.dropped[f] = true;
          } else {
            this.dropped[f] = false;
          }
        }
      } else {
        for (var f = 0; f < h; f++) {
          d.w[f] *= this.drop_prob;
        }
      }
      this.out_act = d;
      return this.out_act;
    },
    backward: function () {
      var d = this.in_act;
      var f = this.out_act;
      var g = d.w.length;
      d.dw = c.zeros(g);
      for (var e = 0; e < g; e++) {
        if (!this.dropped[e]) {
          d.dw[e] = f.dw[e];
        }
      }
    },
    getParamsAndGrads: function () {
      return [];
    },
    toJSON: function () {
      var d = {};
      d.out_depth = this.out_depth;
      d.out_sx = this.out_sx;
      d.out_sy = this.out_sy;
      d.layer_type = this.layer_type;
      d.drop_prob = this.drop_prob;
      return d;
    },
    fromJSON: function (d) {
      this.out_depth = d.out_depth;
      this.out_sx = d.out_sx;
      this.out_sy = d.out_sy;
      this.layer_type = d.layer_type;
      this.drop_prob = d.drop_prob;
    },
  };
  c.DropoutLayer = b;
})(convnetjs);
(function (c) {
  var a = c.Vol;
  var b = function (d) {
    var d = d || {};
    this.k = d.k;
    this.n = d.n;
    this.alpha = d.alpha;
    this.beta = d.beta;
    this.out_sx = d.in_sx;
    this.out_sy = d.in_sy;
    this.out_depth = d.in_depth;
    this.layer_type = "lrn";
    if (this.n % 2 === 0) {
      console.log("WARNING n should be odd for LRN layer");
    }
  };
  b.prototype = {
    forward: function (f, p) {
      this.in_act = f;
      var e = f.cloneAndZero();
      this.S_cache_ = f.cloneAndZero();
      var k = Math.floor(this.n / 2);
      for (var n = 0; n < f.sx; n++) {
        for (var m = 0; m < f.sy; m++) {
          for (var h = 0; h < f.depth; h++) {
            var l = f.get(n, m, h);
            var o = 0;
            for (
              var g = Math.max(0, h - k);
              g <= Math.min(h + k, f.depth - 1);
              g++
            ) {
              var d = f.get(n, m, g);
              o += d * d;
            }
            o *= this.alpha / this.n;
            o += this.k;
            this.S_cache_.set(n, m, h, o);
            o = Math.pow(o, this.beta);
            e.set(n, m, h, l / o);
          }
        }
      }
      this.out_act = e;
      return this.out_act;
    },
    backward: function () {
      var f = this.in_act;
      f.dw = c.zeros(f.w.length);
      var d = this.out_act;
      var n = Math.floor(this.n / 2);
      for (var r = 0; r < f.sx; r++) {
        for (var q = 0; q < f.sy; q++) {
          for (var l = 0; l < f.depth; l++) {
            var p = this.out_act.get_grad(r, q, l);
            var k = this.S_cache_.get(r, q, l);
            var e = Math.pow(k, this.beta);
            var s = e * e;
            for (
              var h = Math.max(0, l - n);
              h <= Math.min(l + n, f.depth - 1);
              h++
            ) {
              var o = f.get(r, q, h);
              var m =
                ((-o * this.beta * Math.pow(k, this.beta - 1) * this.alpha) /
                  this.n) *
                2 *
                o;
              if (h === l) {
                m += e;
              }
              m /= s;
              m *= p;
              f.add_grad(r, q, h, m);
            }
          }
        }
      }
    },
    getParamsAndGrads: function () {
      return [];
    },
    toJSON: function () {
      var d = {};
      d.k = this.k;
      d.n = this.n;
      d.alpha = this.alpha;
      d.beta = this.beta;
      d.out_sx = this.out_sx;
      d.out_sy = this.out_sy;
      d.out_depth = this.out_depth;
      d.layer_type = this.layer_type;
      return d;
    },
    fromJSON: function (d) {
      this.k = d.k;
      this.n = d.n;
      this.alpha = d.alpha;
      this.beta = d.beta;
      this.out_sx = d.out_sx;
      this.out_sy = d.out_sy;
      this.out_depth = d.out_depth;
      this.layer_type = d.layer_type;
    },
  };
  c.LocalResponseNormalizationLayer = b;
})(convnetjs);
(function (d) {
  var a = d.Vol;
  var b = d.assert;
  var c = function (e) {
    this.layers = [];
  };
  c.prototype = {
    makeLayers: function (e) {
      b(
        e.length >= 2,
        "Error! At least one input layer and one loss layer are required."
      );
      b(
        e[0].type === "input",
        "Error! First layer must be the input layer, to declare size of inputs"
      );
      var f = function () {
        var m = [];
        for (var l = 0; l < e.length; l++) {
          var n = e[l];
          if (n.type === "softmax" || n.type === "svm") {
            m.push({ type: "fc", num_neurons: n.num_classes });
          }
          if (n.type === "regression") {
            m.push({ type: "fc", num_neurons: n.num_neurons });
          }
          if (
            (n.type === "fc" || n.type === "conv") &&
            typeof n.bias_pref === "undefined"
          ) {
            n.bias_pref = 0;
            if (
              typeof n.activation !== "undefined" &&
              n.activation === "relu"
            ) {
              n.bias_pref = 0.1;
            }
          }
          m.push(n);
          if (typeof n.activation !== "undefined") {
            if (n.activation === "relu") {
              m.push({ type: "relu" });
            } else {
              if (n.activation === "sigmoid") {
                m.push({ type: "sigmoid" });
              } else {
                if (n.activation === "tanh") {
                  m.push({ type: "tanh" });
                } else {
                  if (n.activation === "maxout") {
                    var k = n.group_size !== "undefined" ? n.group_size : 2;
                    m.push({ type: "maxout", group_size: k });
                  } else {
                    console.log("ERROR unsupported activation " + n.activation);
                  }
                }
              }
            }
          }
          if (typeof n.drop_prob !== "undefined" && n.type !== "dropout") {
            m.push({ type: "dropout", drop_prob: n.drop_prob });
          }
        }
        return m;
      };
      e = f(e);
      this.layers = [];
      for (var g = 0; g < e.length; g++) {
        var j = e[g];
        if (g > 0) {
          var h = this.layers[g - 1];
          j.in_sx = h.out_sx;
          j.in_sy = h.out_sy;
          j.in_depth = h.out_depth;
        }
        switch (j.type) {
          case "fc":
            this.layers.push(new d.FullyConnLayer(j));
            break;
          case "lrn":
            this.layers.push(new d.LocalResponseNormalizationLayer(j));
            break;
          case "dropout":
            this.layers.push(new d.DropoutLayer(j));
            break;
          case "input":
            this.layers.push(new d.InputLayer(j));
            break;
          case "softmax":
            this.layers.push(new d.SoftmaxLayer(j));
            break;
          case "regression":
            this.layers.push(new d.RegressionLayer(j));
            break;
          case "conv":
            this.layers.push(new d.ConvLayer(j));
            break;
          case "pool":
            this.layers.push(new d.PoolLayer(j));
            break;
          case "relu":
            this.layers.push(new d.ReluLayer(j));
            break;
          case "sigmoid":
            this.layers.push(new d.SigmoidLayer(j));
            break;
          case "tanh":
            this.layers.push(new d.TanhLayer(j));
            break;
          case "maxout":
            this.layers.push(new d.MaxoutLayer(j));
            break;
          case "svm":
            this.layers.push(new d.SVMLayer(j));
            break;
          default:
            console.log("ERROR: UNRECOGNIZED LAYER TYPE: " + j.type);
        }
      }
    },
    forward: function (f, h) {
      if (typeof h === "undefined") {
        h = false;
      }
      var e = this.layers[0].forward(f, h);
      for (var g = 1; g < this.layers.length; g++) {
        e = this.layers[g].forward(e, h);
      }
      return e;
    },
    getCostLoss: function (e, h) {
      this.forward(e, false);
      var g = this.layers.length;
      var f = this.layers[g - 1].backward(h);
      return f;
    },
    backward: function (h) {
      var g = this.layers.length;
      var f = this.layers[g - 1].backward(h);
      for (var e = g - 2; e >= 0; e--) {
        this.layers[e].backward();
      }
      return f;
    },
    getParamsAndGrads: function () {
      var e = [];
      for (var g = 0; g < this.layers.length; g++) {
        var h = this.layers[g].getParamsAndGrads();
        for (var f = 0; f < h.length; f++) {
          e.push(h[f]);
        }
      }
      return e;
    },
    getPrediction: function () {
      var h = this.layers[this.layers.length - 1];
      b(
        h.layer_type === "softmax",
        "getPrediction function assumes softmax as last layer of the net!"
      );
      var j = h.out_act.w;
      var e = j[0];
      var f = 0;
      for (var g = 1; g < j.length; g++) {
        if (j[g] > e) {
          e = j[g];
          f = g;
        }
      }
      return f;
    },
    toJSON: function () {
      var f = {};
      f.layers = [];
      for (var e = 0; e < this.layers.length; e++) {
        f.layers.push(this.layers[e].toJSON());
      }
      return f;
    },
    fromJSON: function (j) {
      this.layers = [];
      for (var h = 0; h < j.layers.length; h++) {
        var f = j.layers[h];
        var g = f.layer_type;
        var e;
        if (g === "input") {
          e = new d.InputLayer();
        }
        if (g === "relu") {
          e = new d.ReluLayer();
        }
        if (g === "sigmoid") {
          e = new d.SigmoidLayer();
        }
        if (g === "tanh") {
          e = new d.TanhLayer();
        }
        if (g === "dropout") {
          e = new d.DropoutLayer();
        }
        if (g === "conv") {
          e = new d.ConvLayer();
        }
        if (g === "pool") {
          e = new d.PoolLayer();
        }
        if (g === "lrn") {
          e = new d.LocalResponseNormalizationLayer();
        }
        if (g === "softmax") {
          e = new d.SoftmaxLayer();
        }
        if (g === "regression") {
          e = new d.RegressionLayer();
        }
        if (g === "fc") {
          e = new d.FullyConnLayer();
        }
        if (g === "maxout") {
          e = new d.MaxoutLayer();
        }
        if (g === "svm") {
          e = new d.SVMLayer();
        }
        e.fromJSON(f);
        this.layers.push(e);
      }
    },
  };
  d.Net = c;
})(convnetjs);
(function (b) {
  var a = b.Vol;
  var c = function (e, d) {
    this.net = e;
    var d = d || {};
    this.learning_rate =
      typeof d.learning_rate !== "undefined" ? d.learning_rate : 0.01;
    this.l1_decay = typeof d.l1_decay !== "undefined" ? d.l1_decay : 0;
    this.l2_decay = typeof d.l2_decay !== "undefined" ? d.l2_decay : 0;
    this.batch_size = typeof d.batch_size !== "undefined" ? d.batch_size : 1;
    this.method = typeof d.method !== "undefined" ? d.method : "sgd";
    this.momentum = typeof d.momentum !== "undefined" ? d.momentum : 0.9;
    this.ro = typeof d.ro !== "undefined" ? d.ro : 0.95;
    this.eps = typeof d.eps !== "undefined" ? d.eps : 0.000001;
    this.k = 0;
    this.gsum = [];
    this.xsum = [];
  };
  c.prototype = {
    train: function (s, r) {
      var h = new Date().getTime();
      this.net.forward(s, true);
      var f = new Date().getTime();
      var q = f - h;
      var h = new Date().getTime();
      var A = this.net.backward(r);
      var k = 0;
      var d = 0;
      var f = new Date().getTime();
      var G = f - h;
      this.k++;
      if (this.k % this.batch_size === 0) {
        var e = this.net.getParamsAndGrads();
        if (
          this.gsum.length === 0 &&
          (this.method !== "sgd" || this.momentum > 0)
        ) {
          for (var E = 0; E < e.length; E++) {
            this.gsum.push(b.zeros(e[E].params.length));
            if (this.method === "adadelta") {
              this.xsum.push(b.zeros(e[E].params.length));
            } else {
              this.xsum.push([]);
            }
          }
        }
        for (var E = 0; E < e.length; E++) {
          var H = e[E];
          var w = H.params;
          var F = H.grads;
          var z = typeof H.l2_decay_mul !== "undefined" ? H.l2_decay_mul : 1;
          var I = typeof H.l1_decay_mul !== "undefined" ? H.l1_decay_mul : 1;
          var l = this.l2_decay * z;
          var n = this.l1_decay * I;
          var u = w.length;
          for (var B = 0; B < u; B++) {
            k += (l * w[B] * w[B]) / 2;
            d += n * Math.abs(w[B]);
            var D = n * (w[B] > 0 ? 1 : -1);
            var o = l * w[B];
            var t = (o + D + F[B]) / this.batch_size;
            var m = this.gsum[E];
            var C = this.xsum[E];
            if (this.method === "adagrad") {
              m[B] = m[B] + t * t;
              var v = (-this.learning_rate / Math.sqrt(m[B] + this.eps)) * t;
              w[B] += v;
            } else {
              if (this.method === "windowgrad") {
                m[B] = this.ro * m[B] + (1 - this.ro) * t * t;
                var v = (-this.learning_rate / Math.sqrt(m[B] + this.eps)) * t;
                w[B] += v;
              } else {
                if (this.method === "adadelta") {
                  m[B] = this.ro * m[B] + (1 - this.ro) * t * t;
                  var v = -Math.sqrt((C[B] + this.eps) / (m[B] + this.eps)) * t;
                  C[B] = this.ro * C[B] + (1 - this.ro) * v * v;
                  w[B] += v;
                } else {
                  if (this.method === "nesterov") {
                    var v = m[B];
                    m[B] = m[B] * this.momentum + this.learning_rate * t;
                    v = this.momentum * v - (1 + this.momentum) * m[B];
                    w[B] += v;
                  } else {
                    if (this.momentum > 0) {
                      var v = this.momentum * m[B] - this.learning_rate * t;
                      m[B] = v;
                      w[B] += v;
                    } else {
                      w[B] += -this.learning_rate * t;
                    }
                  }
                }
              }
            }
            F[B] = 0;
          }
        }
      }
      return {
        fwd_time: q,
        bwd_time: G,
        l2_decay_loss: k,
        l1_decay_loss: d,
        cost_loss: A,
        softmax_loss: A,
        loss: A + d + k,
      };
    },
  };
  b.Trainer = c;
  b.SGDTrainer = c;
})(convnetjs);
(function (c) {
  var e = c.randf;
  var d = c.randi;
  var j = c.Net;
  var g = c.Trainer;
  var b = c.maxmin;
  var h = c.randperm;
  var f = c.weightedSample;
  var i = c.getopt;
  var k = c.arrUnique;
  var a = function (m, n, l) {
    var l = l || {};
    if (typeof m === "undefined") {
      m = [];
    }
    if (typeof n === "undefined") {
      n = [];
    }
    this.data = m;
    this.labels = n;
    this.train_ratio = i(l, "train_ratio", 0.7);
    this.num_folds = i(l, "num_folds", 10);
    this.num_candidates = i(l, "num_candidates", 50);
    this.num_epochs = i(l, "num_epochs", 50);
    this.ensemble_size = i(l, "ensemble_size", 10);
    this.batch_size_min = i(l, "batch_size_min", 10);
    this.batch_size_max = i(l, "batch_size_max", 300);
    this.l2_decay_min = i(l, "l2_decay_min", -4);
    this.l2_decay_max = i(l, "l2_decay_max", 2);
    this.learning_rate_min = i(l, "learning_rate_min", -4);
    this.learning_rate_max = i(l, "learning_rate_max", 0);
    this.momentum_min = i(l, "momentum_min", 0.9);
    this.momentum_max = i(l, "momentum_max", 0.9);
    this.neurons_min = i(l, "neurons_min", 5);
    this.neurons_max = i(l, "neurons_max", 30);
    this.folds = [];
    this.candidates = [];
    this.evaluated_candidates = [];
    this.unique_labels = k(n);
    this.iter = 0;
    this.foldix = 0;
    this.finish_fold_callback = null;
    this.finish_batch_callback = null;
    if (this.data.length > 0) {
      this.sampleFolds();
      this.sampleCandidates();
    }
  };
  a.prototype = {
    sampleFolds: function () {
      var o = this.data.length;
      var m = Math.floor(this.train_ratio * o);
      this.folds = [];
      for (var l = 0; l < this.num_folds; l++) {
        var n = h(o);
        this.folds.push({ train_ix: n.slice(0, m), test_ix: n.slice(m, o) });
      }
    },
    sampleCandidate: function () {
      var A = this.data[0].w.length;
      var z = this.unique_labels.length;
      var s = [];
      s.push({ type: "input", out_sx: 1, out_sy: 1, out_depth: A });
      var l = f([0, 1, 2, 3], [0.2, 0.3, 0.3, 0.2]);
      for (var m = 0; m < l; m++) {
        var n = d(this.neurons_min, this.neurons_max);
        var v = ["tanh", "maxout", "relu"][d(0, 3)];
        if (e(0, 1) < 0.5) {
          var r = Math.random();
          s.push({ type: "fc", num_neurons: n, activation: v, drop_prob: r });
        } else {
          s.push({ type: "fc", num_neurons: n, activation: v });
        }
      }
      s.push({ type: "softmax", num_classes: z });
      var x = new j();
      x.makeLayers(s);
      var C = d(this.batch_size_min, this.batch_size_max);
      var o = Math.pow(10, e(this.l2_decay_min, this.l2_decay_max));
      var t = Math.pow(10, e(this.learning_rate_min, this.learning_rate_max));
      var p = e(this.momentum_min, this.momentum_max);
      var y = e(0, 1);
      var u;
      if (y < 0.33) {
        u = { method: "adadelta", batch_size: C, l2_decay: o };
      } else {
        if (y < 0.66) {
          u = {
            method: "adagrad",
            learning_rate: t,
            batch_size: C,
            l2_decay: o,
          };
        } else {
          u = {
            method: "sgd",
            learning_rate: t,
            momentum: p,
            batch_size: C,
            l2_decay: o,
          };
        }
      }
      var B = new g(x, u);
      var w = {};
      w.acc = [];
      w.accv = 0;
      w.layer_defs = s;
      w.trainer_def = u;
      w.net = x;
      w.trainer = B;
      return w;
    },
    sampleCandidates: function () {
      this.candidates = [];
      for (var l = 0; l < this.num_candidates; l++) {
        var m = this.sampleCandidate();
        this.candidates.push(m);
      }
    },
    step: function () {
      this.iter++;
      var r = this.folds[this.foldix];
      var p = r.train_ix[d(0, r.train_ix.length)];
      for (var q = 0; q < this.candidates.length; q++) {
        var u = this.data[p];
        var o = this.labels[p];
        this.candidates[q].trainer.train(u, o);
      }
      var n = this.num_epochs * r.train_ix.length;
      if (this.iter >= n) {
        var m = this.evalValErrors();
        for (var q = 0; q < this.candidates.length; q++) {
          var s = this.candidates[q];
          s.acc.push(m[q]);
          s.accv += m[q];
        }
        this.iter = 0;
        this.foldix++;
        if (this.finish_fold_callback !== null) {
          this.finish_fold_callback();
        }
        if (this.foldix >= this.folds.length) {
          for (var q = 0; q < this.candidates.length; q++) {
            this.evaluated_candidates.push(this.candidates[q]);
          }
          this.evaluated_candidates.sort(function (w, l) {
            return w.accv / w.acc.length > l.accv / l.acc.length ? -1 : 1;
          });
          if (this.evaluated_candidates.length > 3 * this.ensemble_size) {
            this.evaluated_candidates = this.evaluated_candidates.slice(
              0,
              3 * this.ensemble_size
            );
          }
          if (this.finish_batch_callback !== null) {
            this.finish_batch_callback();
          }
          this.sampleCandidates();
          this.foldix = 0;
        } else {
          for (var q = 0; q < this.candidates.length; q++) {
            var s = this.candidates[q];
            var t = new j();
            t.makeLayers(s.layer_defs);
            var v = new g(t, s.trainer_def);
            s.net = t;
            s.trainer = v;
          }
        }
      }
    },
    evalValErrors: function () {
      var t = [];
      var r = this.folds[this.foldix];
      for (var p = 0; p < this.candidates.length; p++) {
        var s = this.candidates[p].net;
        var w = 0;
        for (var m = 0; m < r.test_ix.length; m++) {
          var u = this.data[r.test_ix[m]];
          var o = this.labels[r.test_ix[m]];
          s.forward(u);
          var n = s.getPrediction();
          w += n === o ? 1 : 0;
        }
        w /= r.test_ix.length;
        t.push(w);
      }
      return t;
    },
    predict_soft: function (q) {
      var o = [];
      var r = 0;
      if (this.evaluated_candidates.length === 0) {
        r = this.candidates.length;
        o = this.candidates;
      } else {
        r = Math.min(this.ensemble_size, this.evaluated_candidates.length);
        o = this.evaluated_candidates;
      }
      var l, m;
      for (var p = 0; p < r; p++) {
        var t = o[p].net;
        var u = t.forward(q);
        if (p === 0) {
          l = u;
          m = u.w.length;
        } else {
          for (var s = 0; s < m; s++) {
            l.w[s] += u.w[s];
          }
        }
      }
      for (var s = 0; s < m; s++) {
        l.w[s] /= r;
      }
      return l;
    },
    predict: function (n) {
      var m = this.predict_soft(n);
      if (m.w.length !== 0) {
        var l = b(m.w);
        var o = l.maxi;
      } else {
        var o = -1;
      }
      return o;
    },
    toJSON: function () {
      var l = Math.min(this.ensemble_size, this.evaluated_candidates.length);
      var n = {};
      n.nets = [];
      for (var m = 0; m < l; m++) {
        n.nets.push(this.evaluated_candidates[m].net.toJSON());
      }
      return n;
    },
    fromJSON: function (m) {
      this.ensemble_size = m.nets.length;
      this.evaluated_candidates = [];
      for (var l = 0; l < this.ensemble_size; l++) {
        var n = new j();
        n.fromJSON(m.nets[l]);
        var o = {};
        o.net = n;
        this.evaluated_candidates.push(o);
      }
    },
    onFinishFold: function (l) {
      this.finish_fold_callback = l;
    },
    onFinishBatch: function (l) {
      this.finish_batch_callback = l;
    },
  };
  c.MagicNet = a;
})(convnetjs);
(function (a) {
  if (typeof module === "undefined" || typeof module.exports === "undefined") {
    window.jsfeat = a;
  } else {
    module.exports = a;
  }
})(convnetjs);
