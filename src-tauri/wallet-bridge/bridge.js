(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all3) => {
    for (var name in all3)
      __defProp(target, name, { get: all3[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/base64-js/index.js
  var require_base64_js = __commonJS({
    "node_modules/base64-js/index.js"(exports) {
      "use strict";
      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }
      var i;
      var len;
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1) validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i2;
        for (i2 = 0; i2 < len2; i2 += 4) {
          tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i2 = start; i2 < end; i2 += 3) {
          tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
          );
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
          );
        }
        return parts.join("");
      }
    }
  });

  // node_modules/jsontokens/lib/base64Url.js
  var require_base64Url = __commonJS({
    "node_modules/jsontokens/lib/base64Url.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.decode = exports.encode = exports.unescape = exports.escape = exports.pad = void 0;
      var base64_js_1 = require_base64_js();
      function pad(base64) {
        return `${base64}${"=".repeat(4 - (base64.length % 4 || 4))}`;
      }
      exports.pad = pad;
      function escape(base64) {
        return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      }
      exports.escape = escape;
      function unescape2(base64Url) {
        return pad(base64Url).replace(/-/g, "+").replace(/_/g, "/");
      }
      exports.unescape = unescape2;
      function encode3(base64) {
        return escape((0, base64_js_1.fromByteArray)(new TextEncoder().encode(base64)));
      }
      exports.encode = encode3;
      function decode(base64Url) {
        return new TextDecoder().decode((0, base64_js_1.toByteArray)(pad(unescape2(base64Url))));
      }
      exports.decode = decode;
    }
  });

  // node_modules/@noble/hashes/crypto.js
  var require_crypto = __commonJS({
    "node_modules/@noble/hashes/crypto.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.crypto = void 0;
      exports.crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
    }
  });

  // node_modules/@noble/hashes/utils.js
  var require_utils = __commonJS({
    "node_modules/@noble/hashes/utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.wrapXOFConstructorWithOpts = exports.wrapConstructorWithOpts = exports.wrapConstructor = exports.Hash = exports.nextTick = exports.swap32IfBE = exports.byteSwapIfBE = exports.swap8IfBE = exports.isLE = void 0;
      exports.isBytes = isBytes;
      exports.anumber = anumber;
      exports.abytes = abytes;
      exports.ahash = ahash;
      exports.aexists = aexists;
      exports.aoutput = aoutput;
      exports.u8 = u8;
      exports.u32 = u32;
      exports.clean = clean;
      exports.createView = createView;
      exports.rotr = rotr;
      exports.rotl = rotl;
      exports.byteSwap = byteSwap;
      exports.byteSwap32 = byteSwap32;
      exports.bytesToHex = bytesToHex;
      exports.hexToBytes = hexToBytes;
      exports.asyncLoop = asyncLoop;
      exports.utf8ToBytes = utf8ToBytes;
      exports.bytesToUtf8 = bytesToUtf8;
      exports.toBytes = toBytes;
      exports.kdfInputToBytes = kdfInputToBytes;
      exports.concatBytes = concatBytes;
      exports.checkOpts = checkOpts;
      exports.createHasher = createHasher;
      exports.createOptHasher = createOptHasher;
      exports.createXOFer = createXOFer;
      exports.randomBytes = randomBytes;
      var crypto_1 = require_crypto();
      function isBytes(a) {
        return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
      }
      function anumber(n) {
        if (!Number.isSafeInteger(n) || n < 0)
          throw new Error("positive integer expected, got " + n);
      }
      function abytes(b2, ...lengths) {
        if (!isBytes(b2))
          throw new Error("Uint8Array expected");
        if (lengths.length > 0 && !lengths.includes(b2.length))
          throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b2.length);
      }
      function ahash(h) {
        if (typeof h !== "function" || typeof h.create !== "function")
          throw new Error("Hash should be wrapped by utils.createHasher");
        anumber(h.outputLen);
        anumber(h.blockLen);
      }
      function aexists(instance, checkFinished = true) {
        if (instance.destroyed)
          throw new Error("Hash instance has been destroyed");
        if (checkFinished && instance.finished)
          throw new Error("Hash#digest() has already been called");
      }
      function aoutput(out, instance) {
        abytes(out);
        const min = instance.outputLen;
        if (out.length < min) {
          throw new Error("digestInto() expects output buffer of length at least " + min);
        }
      }
      function u8(arr) {
        return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
      }
      function u32(arr) {
        return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
      }
      function clean(...arrays) {
        for (let i = 0; i < arrays.length; i++) {
          arrays[i].fill(0);
        }
      }
      function createView(arr) {
        return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
      }
      function rotr(word, shift) {
        return word << 32 - shift | word >>> shift;
      }
      function rotl(word, shift) {
        return word << shift | word >>> 32 - shift >>> 0;
      }
      exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
      function byteSwap(word) {
        return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
      }
      exports.swap8IfBE = exports.isLE ? (n) => n : (n) => byteSwap(n);
      exports.byteSwapIfBE = exports.swap8IfBE;
      function byteSwap32(arr) {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = byteSwap(arr[i]);
        }
        return arr;
      }
      exports.swap32IfBE = exports.isLE ? (u) => u : byteSwap32;
      var hasHexBuiltin = /* @__PURE__ */ (() => (
        // @ts-ignore
        typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
      ))();
      var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
      function bytesToHex(bytes) {
        abytes(bytes);
        if (hasHexBuiltin)
          return bytes.toHex();
        let hex = "";
        for (let i = 0; i < bytes.length; i++) {
          hex += hexes[bytes[i]];
        }
        return hex;
      }
      var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
      function asciiToBase16(ch2) {
        if (ch2 >= asciis._0 && ch2 <= asciis._9)
          return ch2 - asciis._0;
        if (ch2 >= asciis.A && ch2 <= asciis.F)
          return ch2 - (asciis.A - 10);
        if (ch2 >= asciis.a && ch2 <= asciis.f)
          return ch2 - (asciis.a - 10);
        return;
      }
      function hexToBytes(hex) {
        if (typeof hex !== "string")
          throw new Error("hex string expected, got " + typeof hex);
        if (hasHexBuiltin)
          return Uint8Array.fromHex(hex);
        const hl = hex.length;
        const al = hl / 2;
        if (hl % 2)
          throw new Error("hex string expected, got unpadded hex of length " + hl);
        const array2 = new Uint8Array(al);
        for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
          const n1 = asciiToBase16(hex.charCodeAt(hi));
          const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
          if (n1 === void 0 || n2 === void 0) {
            const char = hex[hi] + hex[hi + 1];
            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
          }
          array2[ai] = n1 * 16 + n2;
        }
        return array2;
      }
      var nextTick = async () => {
      };
      exports.nextTick = nextTick;
      async function asyncLoop(iters, tick, cb) {
        let ts = Date.now();
        for (let i = 0; i < iters; i++) {
          cb(i);
          const diff = Date.now() - ts;
          if (diff >= 0 && diff < tick)
            continue;
          await (0, exports.nextTick)();
          ts += diff;
        }
      }
      function utf8ToBytes(str) {
        if (typeof str !== "string")
          throw new Error("string expected");
        return new Uint8Array(new TextEncoder().encode(str));
      }
      function bytesToUtf8(bytes) {
        return new TextDecoder().decode(bytes);
      }
      function toBytes(data) {
        if (typeof data === "string")
          data = utf8ToBytes(data);
        abytes(data);
        return data;
      }
      function kdfInputToBytes(data) {
        if (typeof data === "string")
          data = utf8ToBytes(data);
        abytes(data);
        return data;
      }
      function concatBytes(...arrays) {
        let sum = 0;
        for (let i = 0; i < arrays.length; i++) {
          const a = arrays[i];
          abytes(a);
          sum += a.length;
        }
        const res = new Uint8Array(sum);
        for (let i = 0, pad = 0; i < arrays.length; i++) {
          const a = arrays[i];
          res.set(a, pad);
          pad += a.length;
        }
        return res;
      }
      function checkOpts(defaults2, opts) {
        if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
          throw new Error("options should be object or undefined");
        const merged = Object.assign(defaults2, opts);
        return merged;
      }
      var Hash2 = class {
      };
      exports.Hash = Hash2;
      function createHasher(hashCons) {
        const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
        const tmp = hashCons();
        hashC.outputLen = tmp.outputLen;
        hashC.blockLen = tmp.blockLen;
        hashC.create = () => hashCons();
        return hashC;
      }
      function createOptHasher(hashCons) {
        const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
        const tmp = hashCons({});
        hashC.outputLen = tmp.outputLen;
        hashC.blockLen = tmp.blockLen;
        hashC.create = (opts) => hashCons(opts);
        return hashC;
      }
      function createXOFer(hashCons) {
        const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
        const tmp = hashCons({});
        hashC.outputLen = tmp.outputLen;
        hashC.blockLen = tmp.blockLen;
        hashC.create = (opts) => hashCons(opts);
        return hashC;
      }
      exports.wrapConstructor = createHasher;
      exports.wrapConstructorWithOpts = createOptHasher;
      exports.wrapXOFConstructorWithOpts = createXOFer;
      function randomBytes(bytesLength = 32) {
        if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
          return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
        }
        if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
          return Uint8Array.from(crypto_1.crypto.randomBytes(bytesLength));
        }
        throw new Error("crypto.getRandomValues must be defined");
      }
    }
  });

  // node_modules/@noble/hashes/hmac.js
  var require_hmac = __commonJS({
    "node_modules/@noble/hashes/hmac.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.hmac = exports.HMAC = void 0;
      var utils_ts_1 = require_utils();
      var HMAC = class extends utils_ts_1.Hash {
        constructor(hash, _key) {
          super();
          this.finished = false;
          this.destroyed = false;
          (0, utils_ts_1.ahash)(hash);
          const key = (0, utils_ts_1.toBytes)(_key);
          this.iHash = hash.create();
          if (typeof this.iHash.update !== "function")
            throw new Error("Expected instance of class which extends utils.Hash");
          this.blockLen = this.iHash.blockLen;
          this.outputLen = this.iHash.outputLen;
          const blockLen = this.blockLen;
          const pad = new Uint8Array(blockLen);
          pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
          for (let i = 0; i < pad.length; i++)
            pad[i] ^= 54;
          this.iHash.update(pad);
          this.oHash = hash.create();
          for (let i = 0; i < pad.length; i++)
            pad[i] ^= 54 ^ 92;
          this.oHash.update(pad);
          (0, utils_ts_1.clean)(pad);
        }
        update(buf) {
          (0, utils_ts_1.aexists)(this);
          this.iHash.update(buf);
          return this;
        }
        digestInto(out) {
          (0, utils_ts_1.aexists)(this);
          (0, utils_ts_1.abytes)(out, this.outputLen);
          this.finished = true;
          this.iHash.digestInto(out);
          this.oHash.update(out);
          this.oHash.digestInto(out);
          this.destroy();
        }
        digest() {
          const out = new Uint8Array(this.oHash.outputLen);
          this.digestInto(out);
          return out;
        }
        _cloneInto(to) {
          to || (to = Object.create(Object.getPrototypeOf(this), {}));
          const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
          to = to;
          to.finished = finished;
          to.destroyed = destroyed;
          to.blockLen = blockLen;
          to.outputLen = outputLen;
          to.oHash = oHash._cloneInto(to.oHash);
          to.iHash = iHash._cloneInto(to.iHash);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
        destroy() {
          this.destroyed = true;
          this.oHash.destroy();
          this.iHash.destroy();
        }
      };
      exports.HMAC = HMAC;
      var hmac = (hash, key, message2) => new HMAC(hash, key).update(message2).digest();
      exports.hmac = hmac;
      exports.hmac.create = (hash, key) => new HMAC(hash, key);
    }
  });

  // node_modules/@noble/hashes/_md.js
  var require_md = __commonJS({
    "node_modules/@noble/hashes/_md.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SHA512_IV = exports.SHA384_IV = exports.SHA224_IV = exports.SHA256_IV = exports.HashMD = void 0;
      exports.setBigUint64 = setBigUint64;
      exports.Chi = Chi;
      exports.Maj = Maj;
      var utils_ts_1 = require_utils();
      function setBigUint64(view, byteOffset, value, isLE) {
        if (typeof view.setBigUint64 === "function")
          return view.setBigUint64(byteOffset, value, isLE);
        const _32n = BigInt(32);
        const _u32_max = BigInt(4294967295);
        const wh = Number(value >> _32n & _u32_max);
        const wl = Number(value & _u32_max);
        const h = isLE ? 4 : 0;
        const l = isLE ? 0 : 4;
        view.setUint32(byteOffset + h, wh, isLE);
        view.setUint32(byteOffset + l, wl, isLE);
      }
      function Chi(a, b2, c) {
        return a & b2 ^ ~a & c;
      }
      function Maj(a, b2, c) {
        return a & b2 ^ a & c ^ b2 & c;
      }
      var HashMD = class extends utils_ts_1.Hash {
        constructor(blockLen, outputLen, padOffset, isLE) {
          super();
          this.finished = false;
          this.length = 0;
          this.pos = 0;
          this.destroyed = false;
          this.blockLen = blockLen;
          this.outputLen = outputLen;
          this.padOffset = padOffset;
          this.isLE = isLE;
          this.buffer = new Uint8Array(blockLen);
          this.view = (0, utils_ts_1.createView)(this.buffer);
        }
        update(data) {
          (0, utils_ts_1.aexists)(this);
          data = (0, utils_ts_1.toBytes)(data);
          (0, utils_ts_1.abytes)(data);
          const { view, buffer, blockLen } = this;
          const len = data.length;
          for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            if (take === blockLen) {
              const dataView = (0, utils_ts_1.createView)(data);
              for (; blockLen <= len - pos; pos += blockLen)
                this.process(dataView, pos);
              continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
              this.process(view, 0);
              this.pos = 0;
            }
          }
          this.length += data.length;
          this.roundClean();
          return this;
        }
        digestInto(out) {
          (0, utils_ts_1.aexists)(this);
          (0, utils_ts_1.aoutput)(out, this);
          this.finished = true;
          const { buffer, view, blockLen, isLE } = this;
          let { pos } = this;
          buffer[pos++] = 128;
          (0, utils_ts_1.clean)(this.buffer.subarray(pos));
          if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
          }
          for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
          setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
          this.process(view, 0);
          const oview = (0, utils_ts_1.createView)(out);
          const len = this.outputLen;
          if (len % 4)
            throw new Error("_sha2: outputLen should be aligned to 32bit");
          const outLen = len / 4;
          const state = this.get();
          if (outLen > state.length)
            throw new Error("_sha2: outputLen bigger than state");
          for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
        }
        digest() {
          const { buffer, outputLen } = this;
          this.digestInto(buffer);
          const res = buffer.slice(0, outputLen);
          this.destroy();
          return res;
        }
        _cloneInto(to) {
          to || (to = new this.constructor());
          to.set(...this.get());
          const { blockLen, buffer, length, finished, destroyed, pos } = this;
          to.destroyed = destroyed;
          to.finished = finished;
          to.length = length;
          to.pos = pos;
          if (length % blockLen)
            to.buffer.set(buffer);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
      };
      exports.HashMD = HashMD;
      exports.SHA256_IV = Uint32Array.from([
        1779033703,
        3144134277,
        1013904242,
        2773480762,
        1359893119,
        2600822924,
        528734635,
        1541459225
      ]);
      exports.SHA224_IV = Uint32Array.from([
        3238371032,
        914150663,
        812702999,
        4144912697,
        4290775857,
        1750603025,
        1694076839,
        3204075428
      ]);
      exports.SHA384_IV = Uint32Array.from([
        3418070365,
        3238371032,
        1654270250,
        914150663,
        2438529370,
        812702999,
        355462360,
        4144912697,
        1731405415,
        4290775857,
        2394180231,
        1750603025,
        3675008525,
        1694076839,
        1203062813,
        3204075428
      ]);
      exports.SHA512_IV = Uint32Array.from([
        1779033703,
        4089235720,
        3144134277,
        2227873595,
        1013904242,
        4271175723,
        2773480762,
        1595750129,
        1359893119,
        2917565137,
        2600822924,
        725511199,
        528734635,
        4215389547,
        1541459225,
        327033209
      ]);
    }
  });

  // node_modules/@noble/hashes/_u64.js
  var require_u64 = __commonJS({
    "node_modules/@noble/hashes/_u64.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.toBig = exports.shrSL = exports.shrSH = exports.rotrSL = exports.rotrSH = exports.rotrBL = exports.rotrBH = exports.rotr32L = exports.rotr32H = exports.rotlSL = exports.rotlSH = exports.rotlBL = exports.rotlBH = exports.add5L = exports.add5H = exports.add4L = exports.add4H = exports.add3L = exports.add3H = void 0;
      exports.add = add;
      exports.fromBig = fromBig;
      exports.split = split;
      var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
      var _32n = /* @__PURE__ */ BigInt(32);
      function fromBig(n, le = false) {
        if (le)
          return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
        return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
      }
      function split(lst, le = false) {
        const len = lst.length;
        let Ah = new Uint32Array(len);
        let Al = new Uint32Array(len);
        for (let i = 0; i < len; i++) {
          const { h, l } = fromBig(lst[i], le);
          [Ah[i], Al[i]] = [h, l];
        }
        return [Ah, Al];
      }
      var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
      exports.toBig = toBig;
      var shrSH = (h, _l, s) => h >>> s;
      exports.shrSH = shrSH;
      var shrSL = (h, l, s) => h << 32 - s | l >>> s;
      exports.shrSL = shrSL;
      var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
      exports.rotrSH = rotrSH;
      var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
      exports.rotrSL = rotrSL;
      var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
      exports.rotrBH = rotrBH;
      var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
      exports.rotrBL = rotrBL;
      var rotr32H = (_h, l) => l;
      exports.rotr32H = rotr32H;
      var rotr32L = (h, _l) => h;
      exports.rotr32L = rotr32L;
      var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
      exports.rotlSH = rotlSH;
      var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
      exports.rotlSL = rotlSL;
      var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
      exports.rotlBH = rotlBH;
      var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
      exports.rotlBL = rotlBL;
      function add(Ah, Al, Bh, Bl) {
        const l = (Al >>> 0) + (Bl >>> 0);
        return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
      }
      var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
      exports.add3L = add3L;
      var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
      exports.add3H = add3H;
      var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
      exports.add4L = add4L;
      var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
      exports.add4H = add4H;
      var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
      exports.add5L = add5L;
      var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
      exports.add5H = add5H;
      var u64 = {
        fromBig,
        split,
        toBig,
        shrSH,
        shrSL,
        rotrSH,
        rotrSL,
        rotrBH,
        rotrBL,
        rotr32H,
        rotr32L,
        rotlSH,
        rotlSL,
        rotlBH,
        rotlBL,
        add,
        add3L,
        add3H,
        add4L,
        add4H,
        add5H,
        add5L
      };
      exports.default = u64;
    }
  });

  // node_modules/@noble/hashes/sha2.js
  var require_sha2 = __commonJS({
    "node_modules/@noble/hashes/sha2.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.sha512_224 = exports.sha512_256 = exports.sha384 = exports.sha512 = exports.sha224 = exports.sha256 = exports.SHA512_256 = exports.SHA512_224 = exports.SHA384 = exports.SHA512 = exports.SHA224 = exports.SHA256 = void 0;
      var _md_ts_1 = require_md();
      var u64 = require_u64();
      var utils_ts_1 = require_utils();
      var SHA256_K = /* @__PURE__ */ Uint32Array.from([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ]);
      var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
      var SHA256 = class extends _md_ts_1.HashMD {
        constructor(outputLen = 32) {
          super(64, outputLen, 8, false);
          this.A = _md_ts_1.SHA256_IV[0] | 0;
          this.B = _md_ts_1.SHA256_IV[1] | 0;
          this.C = _md_ts_1.SHA256_IV[2] | 0;
          this.D = _md_ts_1.SHA256_IV[3] | 0;
          this.E = _md_ts_1.SHA256_IV[4] | 0;
          this.F = _md_ts_1.SHA256_IV[5] | 0;
          this.G = _md_ts_1.SHA256_IV[6] | 0;
          this.H = _md_ts_1.SHA256_IV[7] | 0;
        }
        get() {
          const { A: A2, B, C: C2, D: D2, E, F: F2, G: G2, H } = this;
          return [A2, B, C2, D2, E, F2, G2, H];
        }
        // prettier-ignore
        set(A2, B, C2, D2, E, F2, G2, H) {
          this.A = A2 | 0;
          this.B = B | 0;
          this.C = C2 | 0;
          this.D = D2 | 0;
          this.E = E | 0;
          this.F = F2 | 0;
          this.G = G2 | 0;
          this.H = H | 0;
        }
        process(view, offset) {
          for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
          for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W22 = SHA256_W[i - 2];
            const s0 = (0, utils_ts_1.rotr)(W15, 7) ^ (0, utils_ts_1.rotr)(W15, 18) ^ W15 >>> 3;
            const s1 = (0, utils_ts_1.rotr)(W22, 17) ^ (0, utils_ts_1.rotr)(W22, 19) ^ W22 >>> 10;
            SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
          }
          let { A: A2, B, C: C2, D: D2, E, F: F2, G: G2, H } = this;
          for (let i = 0; i < 64; i++) {
            const sigma12 = (0, utils_ts_1.rotr)(E, 6) ^ (0, utils_ts_1.rotr)(E, 11) ^ (0, utils_ts_1.rotr)(E, 25);
            const T1 = H + sigma12 + (0, _md_ts_1.Chi)(E, F2, G2) + SHA256_K[i] + SHA256_W[i] | 0;
            const sigma02 = (0, utils_ts_1.rotr)(A2, 2) ^ (0, utils_ts_1.rotr)(A2, 13) ^ (0, utils_ts_1.rotr)(A2, 22);
            const T2 = sigma02 + (0, _md_ts_1.Maj)(A2, B, C2) | 0;
            H = G2;
            G2 = F2;
            F2 = E;
            E = D2 + T1 | 0;
            D2 = C2;
            C2 = B;
            B = A2;
            A2 = T1 + T2 | 0;
          }
          A2 = A2 + this.A | 0;
          B = B + this.B | 0;
          C2 = C2 + this.C | 0;
          D2 = D2 + this.D | 0;
          E = E + this.E | 0;
          F2 = F2 + this.F | 0;
          G2 = G2 + this.G | 0;
          H = H + this.H | 0;
          this.set(A2, B, C2, D2, E, F2, G2, H);
        }
        roundClean() {
          (0, utils_ts_1.clean)(SHA256_W);
        }
        destroy() {
          this.set(0, 0, 0, 0, 0, 0, 0, 0);
          (0, utils_ts_1.clean)(this.buffer);
        }
      };
      exports.SHA256 = SHA256;
      var SHA224 = class extends SHA256 {
        constructor() {
          super(28);
          this.A = _md_ts_1.SHA224_IV[0] | 0;
          this.B = _md_ts_1.SHA224_IV[1] | 0;
          this.C = _md_ts_1.SHA224_IV[2] | 0;
          this.D = _md_ts_1.SHA224_IV[3] | 0;
          this.E = _md_ts_1.SHA224_IV[4] | 0;
          this.F = _md_ts_1.SHA224_IV[5] | 0;
          this.G = _md_ts_1.SHA224_IV[6] | 0;
          this.H = _md_ts_1.SHA224_IV[7] | 0;
        }
      };
      exports.SHA224 = SHA224;
      var K512 = /* @__PURE__ */ (() => u64.split([
        "0x428a2f98d728ae22",
        "0x7137449123ef65cd",
        "0xb5c0fbcfec4d3b2f",
        "0xe9b5dba58189dbbc",
        "0x3956c25bf348b538",
        "0x59f111f1b605d019",
        "0x923f82a4af194f9b",
        "0xab1c5ed5da6d8118",
        "0xd807aa98a3030242",
        "0x12835b0145706fbe",
        "0x243185be4ee4b28c",
        "0x550c7dc3d5ffb4e2",
        "0x72be5d74f27b896f",
        "0x80deb1fe3b1696b1",
        "0x9bdc06a725c71235",
        "0xc19bf174cf692694",
        "0xe49b69c19ef14ad2",
        "0xefbe4786384f25e3",
        "0x0fc19dc68b8cd5b5",
        "0x240ca1cc77ac9c65",
        "0x2de92c6f592b0275",
        "0x4a7484aa6ea6e483",
        "0x5cb0a9dcbd41fbd4",
        "0x76f988da831153b5",
        "0x983e5152ee66dfab",
        "0xa831c66d2db43210",
        "0xb00327c898fb213f",
        "0xbf597fc7beef0ee4",
        "0xc6e00bf33da88fc2",
        "0xd5a79147930aa725",
        "0x06ca6351e003826f",
        "0x142929670a0e6e70",
        "0x27b70a8546d22ffc",
        "0x2e1b21385c26c926",
        "0x4d2c6dfc5ac42aed",
        "0x53380d139d95b3df",
        "0x650a73548baf63de",
        "0x766a0abb3c77b2a8",
        "0x81c2c92e47edaee6",
        "0x92722c851482353b",
        "0xa2bfe8a14cf10364",
        "0xa81a664bbc423001",
        "0xc24b8b70d0f89791",
        "0xc76c51a30654be30",
        "0xd192e819d6ef5218",
        "0xd69906245565a910",
        "0xf40e35855771202a",
        "0x106aa07032bbd1b8",
        "0x19a4c116b8d2d0c8",
        "0x1e376c085141ab53",
        "0x2748774cdf8eeb99",
        "0x34b0bcb5e19b48a8",
        "0x391c0cb3c5c95a63",
        "0x4ed8aa4ae3418acb",
        "0x5b9cca4f7763e373",
        "0x682e6ff3d6b2b8a3",
        "0x748f82ee5defb2fc",
        "0x78a5636f43172f60",
        "0x84c87814a1f0ab72",
        "0x8cc702081a6439ec",
        "0x90befffa23631e28",
        "0xa4506cebde82bde9",
        "0xbef9a3f7b2c67915",
        "0xc67178f2e372532b",
        "0xca273eceea26619c",
        "0xd186b8c721c0c207",
        "0xeada7dd6cde0eb1e",
        "0xf57d4f7fee6ed178",
        "0x06f067aa72176fba",
        "0x0a637dc5a2c898a6",
        "0x113f9804bef90dae",
        "0x1b710b35131c471b",
        "0x28db77f523047d84",
        "0x32caab7b40c72493",
        "0x3c9ebe0a15c9bebc",
        "0x431d67c49c100d4c",
        "0x4cc5d4becb3e42b6",
        "0x597f299cfc657e2a",
        "0x5fcb6fab3ad6faec",
        "0x6c44198c4a475817"
      ].map((n) => BigInt(n))))();
      var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
      var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
      var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
      var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
      var SHA512 = class extends _md_ts_1.HashMD {
        constructor(outputLen = 64) {
          super(128, outputLen, 16, false);
          this.Ah = _md_ts_1.SHA512_IV[0] | 0;
          this.Al = _md_ts_1.SHA512_IV[1] | 0;
          this.Bh = _md_ts_1.SHA512_IV[2] | 0;
          this.Bl = _md_ts_1.SHA512_IV[3] | 0;
          this.Ch = _md_ts_1.SHA512_IV[4] | 0;
          this.Cl = _md_ts_1.SHA512_IV[5] | 0;
          this.Dh = _md_ts_1.SHA512_IV[6] | 0;
          this.Dl = _md_ts_1.SHA512_IV[7] | 0;
          this.Eh = _md_ts_1.SHA512_IV[8] | 0;
          this.El = _md_ts_1.SHA512_IV[9] | 0;
          this.Fh = _md_ts_1.SHA512_IV[10] | 0;
          this.Fl = _md_ts_1.SHA512_IV[11] | 0;
          this.Gh = _md_ts_1.SHA512_IV[12] | 0;
          this.Gl = _md_ts_1.SHA512_IV[13] | 0;
          this.Hh = _md_ts_1.SHA512_IV[14] | 0;
          this.Hl = _md_ts_1.SHA512_IV[15] | 0;
        }
        // prettier-ignore
        get() {
          const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
          return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
        }
        // prettier-ignore
        set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
          this.Ah = Ah | 0;
          this.Al = Al | 0;
          this.Bh = Bh | 0;
          this.Bl = Bl | 0;
          this.Ch = Ch | 0;
          this.Cl = Cl | 0;
          this.Dh = Dh | 0;
          this.Dl = Dl | 0;
          this.Eh = Eh | 0;
          this.El = El | 0;
          this.Fh = Fh | 0;
          this.Fl = Fl | 0;
          this.Gh = Gh | 0;
          this.Gl = Gl | 0;
          this.Hh = Hh | 0;
          this.Hl = Hl | 0;
        }
        process(view, offset) {
          for (let i = 0; i < 16; i++, offset += 4) {
            SHA512_W_H[i] = view.getUint32(offset);
            SHA512_W_L[i] = view.getUint32(offset += 4);
          }
          for (let i = 16; i < 80; i++) {
            const W15h = SHA512_W_H[i - 15] | 0;
            const W15l = SHA512_W_L[i - 15] | 0;
            const s0h = u64.rotrSH(W15h, W15l, 1) ^ u64.rotrSH(W15h, W15l, 8) ^ u64.shrSH(W15h, W15l, 7);
            const s0l = u64.rotrSL(W15h, W15l, 1) ^ u64.rotrSL(W15h, W15l, 8) ^ u64.shrSL(W15h, W15l, 7);
            const W2h = SHA512_W_H[i - 2] | 0;
            const W2l = SHA512_W_L[i - 2] | 0;
            const s1h = u64.rotrSH(W2h, W2l, 19) ^ u64.rotrBH(W2h, W2l, 61) ^ u64.shrSH(W2h, W2l, 6);
            const s1l = u64.rotrSL(W2h, W2l, 19) ^ u64.rotrBL(W2h, W2l, 61) ^ u64.shrSL(W2h, W2l, 6);
            const SUMl = u64.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
            const SUMh = u64.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
            SHA512_W_H[i] = SUMh | 0;
            SHA512_W_L[i] = SUMl | 0;
          }
          let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
          for (let i = 0; i < 80; i++) {
            const sigma1h = u64.rotrSH(Eh, El, 14) ^ u64.rotrSH(Eh, El, 18) ^ u64.rotrBH(Eh, El, 41);
            const sigma1l = u64.rotrSL(Eh, El, 14) ^ u64.rotrSL(Eh, El, 18) ^ u64.rotrBL(Eh, El, 41);
            const CHIh = Eh & Fh ^ ~Eh & Gh;
            const CHIl = El & Fl ^ ~El & Gl;
            const T1ll = u64.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
            const T1h = u64.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
            const T1l = T1ll | 0;
            const sigma0h = u64.rotrSH(Ah, Al, 28) ^ u64.rotrBH(Ah, Al, 34) ^ u64.rotrBH(Ah, Al, 39);
            const sigma0l = u64.rotrSL(Ah, Al, 28) ^ u64.rotrBL(Ah, Al, 34) ^ u64.rotrBL(Ah, Al, 39);
            const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
            const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
            Hh = Gh | 0;
            Hl = Gl | 0;
            Gh = Fh | 0;
            Gl = Fl | 0;
            Fh = Eh | 0;
            Fl = El | 0;
            ({ h: Eh, l: El } = u64.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
            Dh = Ch | 0;
            Dl = Cl | 0;
            Ch = Bh | 0;
            Cl = Bl | 0;
            Bh = Ah | 0;
            Bl = Al | 0;
            const All = u64.add3L(T1l, sigma0l, MAJl);
            Ah = u64.add3H(All, T1h, sigma0h, MAJh);
            Al = All | 0;
          }
          ({ h: Ah, l: Al } = u64.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
          ({ h: Bh, l: Bl } = u64.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
          ({ h: Ch, l: Cl } = u64.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
          ({ h: Dh, l: Dl } = u64.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
          ({ h: Eh, l: El } = u64.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
          ({ h: Fh, l: Fl } = u64.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
          ({ h: Gh, l: Gl } = u64.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
          ({ h: Hh, l: Hl } = u64.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
          this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
        }
        roundClean() {
          (0, utils_ts_1.clean)(SHA512_W_H, SHA512_W_L);
        }
        destroy() {
          (0, utils_ts_1.clean)(this.buffer);
          this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
      };
      exports.SHA512 = SHA512;
      var SHA384 = class extends SHA512 {
        constructor() {
          super(48);
          this.Ah = _md_ts_1.SHA384_IV[0] | 0;
          this.Al = _md_ts_1.SHA384_IV[1] | 0;
          this.Bh = _md_ts_1.SHA384_IV[2] | 0;
          this.Bl = _md_ts_1.SHA384_IV[3] | 0;
          this.Ch = _md_ts_1.SHA384_IV[4] | 0;
          this.Cl = _md_ts_1.SHA384_IV[5] | 0;
          this.Dh = _md_ts_1.SHA384_IV[6] | 0;
          this.Dl = _md_ts_1.SHA384_IV[7] | 0;
          this.Eh = _md_ts_1.SHA384_IV[8] | 0;
          this.El = _md_ts_1.SHA384_IV[9] | 0;
          this.Fh = _md_ts_1.SHA384_IV[10] | 0;
          this.Fl = _md_ts_1.SHA384_IV[11] | 0;
          this.Gh = _md_ts_1.SHA384_IV[12] | 0;
          this.Gl = _md_ts_1.SHA384_IV[13] | 0;
          this.Hh = _md_ts_1.SHA384_IV[14] | 0;
          this.Hl = _md_ts_1.SHA384_IV[15] | 0;
        }
      };
      exports.SHA384 = SHA384;
      var T224_IV = /* @__PURE__ */ Uint32Array.from([
        2352822216,
        424955298,
        1944164710,
        2312950998,
        502970286,
        855612546,
        1738396948,
        1479516111,
        258812777,
        2077511080,
        2011393907,
        79989058,
        1067287976,
        1780299464,
        286451373,
        2446758561
      ]);
      var T256_IV = /* @__PURE__ */ Uint32Array.from([
        573645204,
        4230739756,
        2673172387,
        3360449730,
        596883563,
        1867755857,
        2520282905,
        1497426621,
        2519219938,
        2827943907,
        3193839141,
        1401305490,
        721525244,
        746961066,
        246885852,
        2177182882
      ]);
      var SHA512_224 = class extends SHA512 {
        constructor() {
          super(28);
          this.Ah = T224_IV[0] | 0;
          this.Al = T224_IV[1] | 0;
          this.Bh = T224_IV[2] | 0;
          this.Bl = T224_IV[3] | 0;
          this.Ch = T224_IV[4] | 0;
          this.Cl = T224_IV[5] | 0;
          this.Dh = T224_IV[6] | 0;
          this.Dl = T224_IV[7] | 0;
          this.Eh = T224_IV[8] | 0;
          this.El = T224_IV[9] | 0;
          this.Fh = T224_IV[10] | 0;
          this.Fl = T224_IV[11] | 0;
          this.Gh = T224_IV[12] | 0;
          this.Gl = T224_IV[13] | 0;
          this.Hh = T224_IV[14] | 0;
          this.Hl = T224_IV[15] | 0;
        }
      };
      exports.SHA512_224 = SHA512_224;
      var SHA512_256 = class extends SHA512 {
        constructor() {
          super(32);
          this.Ah = T256_IV[0] | 0;
          this.Al = T256_IV[1] | 0;
          this.Bh = T256_IV[2] | 0;
          this.Bl = T256_IV[3] | 0;
          this.Ch = T256_IV[4] | 0;
          this.Cl = T256_IV[5] | 0;
          this.Dh = T256_IV[6] | 0;
          this.Dl = T256_IV[7] | 0;
          this.Eh = T256_IV[8] | 0;
          this.El = T256_IV[9] | 0;
          this.Fh = T256_IV[10] | 0;
          this.Fl = T256_IV[11] | 0;
          this.Gh = T256_IV[12] | 0;
          this.Gl = T256_IV[13] | 0;
          this.Hh = T256_IV[14] | 0;
          this.Hl = T256_IV[15] | 0;
        }
      };
      exports.SHA512_256 = SHA512_256;
      exports.sha256 = (0, utils_ts_1.createHasher)(() => new SHA256());
      exports.sha224 = (0, utils_ts_1.createHasher)(() => new SHA224());
      exports.sha512 = (0, utils_ts_1.createHasher)(() => new SHA512());
      exports.sha384 = (0, utils_ts_1.createHasher)(() => new SHA384());
      exports.sha512_256 = (0, utils_ts_1.createHasher)(() => new SHA512_256());
      exports.sha512_224 = (0, utils_ts_1.createHasher)(() => new SHA512_224());
    }
  });

  // node_modules/@noble/hashes/sha256.js
  var require_sha256 = __commonJS({
    "node_modules/@noble/hashes/sha256.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.sha224 = exports.SHA224 = exports.sha256 = exports.SHA256 = void 0;
      var sha2_ts_1 = require_sha2();
      exports.SHA256 = sha2_ts_1.SHA256;
      exports.sha256 = sha2_ts_1.sha256;
      exports.SHA224 = sha2_ts_1.SHA224;
      exports.sha224 = sha2_ts_1.sha224;
    }
  });

  // (disabled):crypto
  var require_crypto2 = __commonJS({
    "(disabled):crypto"() {
    }
  });

  // node_modules/@noble/secp256k1/lib/index.js
  var require_lib = __commonJS({
    "node_modules/@noble/secp256k1/lib/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.utils = exports.schnorr = exports.verify = exports.signSync = exports.sign = exports.getSharedSecret = exports.recoverPublicKey = exports.getPublicKey = exports.hexToBytes = exports.bytesToHex = exports.Signature = exports.Point = exports.CURVE = void 0;
      var nodeCrypto = require_crypto2();
      var _0n = BigInt(0);
      var _1n = BigInt(1);
      var _2n = BigInt(2);
      var _3n = BigInt(3);
      var _8n = BigInt(8);
      var CURVE = Object.freeze({
        a: _0n,
        b: BigInt(7),
        P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
        n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
        h: _1n,
        Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
        Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
        beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
      });
      exports.CURVE = CURVE;
      var divNearest = (a, b2) => (a + b2 / _2n) / b2;
      var endo = {
        beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
        splitScalar(k) {
          const { n } = CURVE;
          const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
          const b1 = -_1n * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
          const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
          const b2 = a1;
          const POW_2_128 = BigInt("0x100000000000000000000000000000000");
          const c1 = divNearest(b2 * k, n);
          const c2 = divNearest(-b1 * k, n);
          let k1 = mod(k - c1 * a1 - c2 * a2, n);
          let k2 = mod(-c1 * b1 - c2 * b2, n);
          const k1neg = k1 > POW_2_128;
          const k2neg = k2 > POW_2_128;
          if (k1neg)
            k1 = n - k1;
          if (k2neg)
            k2 = n - k2;
          if (k1 > POW_2_128 || k2 > POW_2_128) {
            throw new Error("splitScalarEndo: Endomorphism failed, k=" + k);
          }
          return { k1neg, k1, k2neg, k2 };
        }
      };
      var fieldLen = 32;
      var groupLen = 32;
      var hashLen = 32;
      var compressedLen = fieldLen + 1;
      var uncompressedLen = 2 * fieldLen + 1;
      function weierstrass(x) {
        const { a, b: b2 } = CURVE;
        const x2 = mod(x * x);
        const x3 = mod(x2 * x);
        return mod(x3 + a * x + b2);
      }
      var USE_ENDOMORPHISM = CURVE.a === _0n;
      var ShaError = class extends Error {
        constructor(message2) {
          super(message2);
        }
      };
      function assertJacPoint(other) {
        if (!(other instanceof JacobianPoint))
          throw new TypeError("JacobianPoint expected");
      }
      var JacobianPoint = class _JacobianPoint {
        constructor(x, y, z) {
          this.x = x;
          this.y = y;
          this.z = z;
        }
        static fromAffine(p) {
          if (!(p instanceof Point)) {
            throw new TypeError("JacobianPoint#fromAffine: expected Point");
          }
          if (p.equals(Point.ZERO))
            return _JacobianPoint.ZERO;
          return new _JacobianPoint(p.x, p.y, _1n);
        }
        static toAffineBatch(points) {
          const toInv = invertBatch(points.map((p) => p.z));
          return points.map((p, i) => p.toAffine(toInv[i]));
        }
        static normalizeZ(points) {
          return _JacobianPoint.toAffineBatch(points).map(_JacobianPoint.fromAffine);
        }
        equals(other) {
          assertJacPoint(other);
          const { x: X1, y: Y1, z: Z1 } = this;
          const { x: X2, y: Y2, z: Z2 } = other;
          const Z1Z1 = mod(Z1 * Z1);
          const Z2Z2 = mod(Z2 * Z2);
          const U1 = mod(X1 * Z2Z2);
          const U2 = mod(X2 * Z1Z1);
          const S1 = mod(mod(Y1 * Z2) * Z2Z2);
          const S2 = mod(mod(Y2 * Z1) * Z1Z1);
          return U1 === U2 && S1 === S2;
        }
        negate() {
          return new _JacobianPoint(this.x, mod(-this.y), this.z);
        }
        double() {
          const { x: X1, y: Y1, z: Z1 } = this;
          const A2 = mod(X1 * X1);
          const B = mod(Y1 * Y1);
          const C2 = mod(B * B);
          const x1b = X1 + B;
          const D2 = mod(_2n * (mod(x1b * x1b) - A2 - C2));
          const E = mod(_3n * A2);
          const F2 = mod(E * E);
          const X3 = mod(F2 - _2n * D2);
          const Y3 = mod(E * (D2 - X3) - _8n * C2);
          const Z3 = mod(_2n * Y1 * Z1);
          return new _JacobianPoint(X3, Y3, Z3);
        }
        add(other) {
          assertJacPoint(other);
          const { x: X1, y: Y1, z: Z1 } = this;
          const { x: X2, y: Y2, z: Z2 } = other;
          if (X2 === _0n || Y2 === _0n)
            return this;
          if (X1 === _0n || Y1 === _0n)
            return other;
          const Z1Z1 = mod(Z1 * Z1);
          const Z2Z2 = mod(Z2 * Z2);
          const U1 = mod(X1 * Z2Z2);
          const U2 = mod(X2 * Z1Z1);
          const S1 = mod(mod(Y1 * Z2) * Z2Z2);
          const S2 = mod(mod(Y2 * Z1) * Z1Z1);
          const H = mod(U2 - U1);
          const r = mod(S2 - S1);
          if (H === _0n) {
            if (r === _0n) {
              return this.double();
            } else {
              return _JacobianPoint.ZERO;
            }
          }
          const HH = mod(H * H);
          const HHH = mod(H * HH);
          const V2 = mod(U1 * HH);
          const X3 = mod(r * r - HHH - _2n * V2);
          const Y3 = mod(r * (V2 - X3) - S1 * HHH);
          const Z3 = mod(Z1 * Z2 * H);
          return new _JacobianPoint(X3, Y3, Z3);
        }
        subtract(other) {
          return this.add(other.negate());
        }
        multiplyUnsafe(scalar) {
          const P0 = _JacobianPoint.ZERO;
          if (typeof scalar === "bigint" && scalar === _0n)
            return P0;
          let n = normalizeScalar(scalar);
          if (n === _1n)
            return this;
          if (!USE_ENDOMORPHISM) {
            let p = P0;
            let d2 = this;
            while (n > _0n) {
              if (n & _1n)
                p = p.add(d2);
              d2 = d2.double();
              n >>= _1n;
            }
            return p;
          }
          let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
          let k1p = P0;
          let k2p = P0;
          let d = this;
          while (k1 > _0n || k2 > _0n) {
            if (k1 & _1n)
              k1p = k1p.add(d);
            if (k2 & _1n)
              k2p = k2p.add(d);
            d = d.double();
            k1 >>= _1n;
            k2 >>= _1n;
          }
          if (k1neg)
            k1p = k1p.negate();
          if (k2neg)
            k2p = k2p.negate();
          k2p = new _JacobianPoint(mod(k2p.x * endo.beta), k2p.y, k2p.z);
          return k1p.add(k2p);
        }
        precomputeWindow(W3) {
          const windows = USE_ENDOMORPHISM ? 128 / W3 + 1 : 256 / W3 + 1;
          const points = [];
          let p = this;
          let base = p;
          for (let window2 = 0; window2 < windows; window2++) {
            base = p;
            points.push(base);
            for (let i = 1; i < 2 ** (W3 - 1); i++) {
              base = base.add(p);
              points.push(base);
            }
            p = base.double();
          }
          return points;
        }
        wNAF(n, affinePoint) {
          if (!affinePoint && this.equals(_JacobianPoint.BASE))
            affinePoint = Point.BASE;
          const W3 = affinePoint && affinePoint._WINDOW_SIZE || 1;
          if (256 % W3) {
            throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
          }
          let precomputes = affinePoint && pointPrecomputes.get(affinePoint);
          if (!precomputes) {
            precomputes = this.precomputeWindow(W3);
            if (affinePoint && W3 !== 1) {
              precomputes = _JacobianPoint.normalizeZ(precomputes);
              pointPrecomputes.set(affinePoint, precomputes);
            }
          }
          let p = _JacobianPoint.ZERO;
          let f = _JacobianPoint.BASE;
          const windows = 1 + (USE_ENDOMORPHISM ? 128 / W3 : 256 / W3);
          const windowSize = 2 ** (W3 - 1);
          const mask = BigInt(2 ** W3 - 1);
          const maxNumber = 2 ** W3;
          const shiftBy = BigInt(W3);
          for (let window2 = 0; window2 < windows; window2++) {
            const offset = window2 * windowSize;
            let wbits = Number(n & mask);
            n >>= shiftBy;
            if (wbits > windowSize) {
              wbits -= maxNumber;
              n += _1n;
            }
            const offset1 = offset;
            const offset2 = offset + Math.abs(wbits) - 1;
            const cond1 = window2 % 2 !== 0;
            const cond2 = wbits < 0;
            if (wbits === 0) {
              f = f.add(constTimeNegate(cond1, precomputes[offset1]));
            } else {
              p = p.add(constTimeNegate(cond2, precomputes[offset2]));
            }
          }
          return { p, f };
        }
        multiply(scalar, affinePoint) {
          let n = normalizeScalar(scalar);
          let point;
          let fake;
          if (USE_ENDOMORPHISM) {
            const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
            let { p: k1p, f: f1p } = this.wNAF(k1, affinePoint);
            let { p: k2p, f: f2p } = this.wNAF(k2, affinePoint);
            k1p = constTimeNegate(k1neg, k1p);
            k2p = constTimeNegate(k2neg, k2p);
            k2p = new _JacobianPoint(mod(k2p.x * endo.beta), k2p.y, k2p.z);
            point = k1p.add(k2p);
            fake = f1p.add(f2p);
          } else {
            const { p, f } = this.wNAF(n, affinePoint);
            point = p;
            fake = f;
          }
          return _JacobianPoint.normalizeZ([point, fake])[0];
        }
        toAffine(invZ) {
          const { x, y, z } = this;
          const is0 = this.equals(_JacobianPoint.ZERO);
          if (invZ == null)
            invZ = is0 ? _8n : invert(z);
          const iz1 = invZ;
          const iz2 = mod(iz1 * iz1);
          const iz3 = mod(iz2 * iz1);
          const ax = mod(x * iz2);
          const ay = mod(y * iz3);
          const zz = mod(z * iz1);
          if (is0)
            return Point.ZERO;
          if (zz !== _1n)
            throw new Error("invZ was invalid");
          return new Point(ax, ay);
        }
      };
      JacobianPoint.BASE = new JacobianPoint(CURVE.Gx, CURVE.Gy, _1n);
      JacobianPoint.ZERO = new JacobianPoint(_0n, _1n, _0n);
      function constTimeNegate(condition, item) {
        const neg = item.negate();
        return condition ? neg : item;
      }
      var pointPrecomputes = /* @__PURE__ */ new WeakMap();
      var Point = class _Point {
        constructor(x, y) {
          this.x = x;
          this.y = y;
        }
        _setWindowSize(windowSize) {
          this._WINDOW_SIZE = windowSize;
          pointPrecomputes.delete(this);
        }
        hasEvenY() {
          return this.y % _2n === _0n;
        }
        static fromCompressedHex(bytes) {
          const isShort = bytes.length === 32;
          const x = bytesToNumber(isShort ? bytes : bytes.subarray(1));
          if (!isValidFieldElement(x))
            throw new Error("Point is not on curve");
          const y2 = weierstrass(x);
          let y = sqrtMod(y2);
          const isYOdd = (y & _1n) === _1n;
          if (isShort) {
            if (isYOdd)
              y = mod(-y);
          } else {
            const isFirstByteOdd = (bytes[0] & 1) === 1;
            if (isFirstByteOdd !== isYOdd)
              y = mod(-y);
          }
          const point = new _Point(x, y);
          point.assertValidity();
          return point;
        }
        static fromUncompressedHex(bytes) {
          const x = bytesToNumber(bytes.subarray(1, fieldLen + 1));
          const y = bytesToNumber(bytes.subarray(fieldLen + 1, fieldLen * 2 + 1));
          const point = new _Point(x, y);
          point.assertValidity();
          return point;
        }
        static fromHex(hex) {
          const bytes = ensureBytes(hex);
          const len = bytes.length;
          const header = bytes[0];
          if (len === fieldLen)
            return this.fromCompressedHex(bytes);
          if (len === compressedLen && (header === 2 || header === 3)) {
            return this.fromCompressedHex(bytes);
          }
          if (len === uncompressedLen && header === 4)
            return this.fromUncompressedHex(bytes);
          throw new Error(`Point.fromHex: received invalid point. Expected 32-${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes, not ${len}`);
        }
        static fromPrivateKey(privateKey) {
          return _Point.BASE.multiply(normalizePrivateKey(privateKey));
        }
        static fromSignature(msgHash, signature, recovery) {
          const { r, s } = normalizeSignature(signature);
          if (![0, 1, 2, 3].includes(recovery))
            throw new Error("Cannot recover: invalid recovery bit");
          const h = truncateHash(ensureBytes(msgHash));
          const { n } = CURVE;
          const radj = recovery === 2 || recovery === 3 ? r + n : r;
          const rinv = invert(radj, n);
          const u1 = mod(-h * rinv, n);
          const u2 = mod(s * rinv, n);
          const prefix = recovery & 1 ? "03" : "02";
          const R = _Point.fromHex(prefix + numTo32bStr(radj));
          const Q2 = _Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
          if (!Q2)
            throw new Error("Cannot recover signature: point at infinify");
          Q2.assertValidity();
          return Q2;
        }
        toRawBytes(isCompressed = false) {
          return hexToBytes(this.toHex(isCompressed));
        }
        toHex(isCompressed = false) {
          const x = numTo32bStr(this.x);
          if (isCompressed) {
            const prefix = this.hasEvenY() ? "02" : "03";
            return `${prefix}${x}`;
          } else {
            return `04${x}${numTo32bStr(this.y)}`;
          }
        }
        toHexX() {
          return this.toHex(true).slice(2);
        }
        toRawX() {
          return this.toRawBytes(true).slice(1);
        }
        assertValidity() {
          const msg = "Point is not on elliptic curve";
          const { x, y } = this;
          if (!isValidFieldElement(x) || !isValidFieldElement(y))
            throw new Error(msg);
          const left = mod(y * y);
          const right = weierstrass(x);
          if (mod(left - right) !== _0n)
            throw new Error(msg);
        }
        equals(other) {
          return this.x === other.x && this.y === other.y;
        }
        negate() {
          return new _Point(this.x, mod(-this.y));
        }
        double() {
          return JacobianPoint.fromAffine(this).double().toAffine();
        }
        add(other) {
          return JacobianPoint.fromAffine(this).add(JacobianPoint.fromAffine(other)).toAffine();
        }
        subtract(other) {
          return this.add(other.negate());
        }
        multiply(scalar) {
          return JacobianPoint.fromAffine(this).multiply(scalar, this).toAffine();
        }
        multiplyAndAddUnsafe(Q2, a, b2) {
          const P = JacobianPoint.fromAffine(this);
          const aP = a === _0n || a === _1n || this !== _Point.BASE ? P.multiplyUnsafe(a) : P.multiply(a);
          const bQ = JacobianPoint.fromAffine(Q2).multiplyUnsafe(b2);
          const sum = aP.add(bQ);
          return sum.equals(JacobianPoint.ZERO) ? void 0 : sum.toAffine();
        }
      };
      exports.Point = Point;
      Point.BASE = new Point(CURVE.Gx, CURVE.Gy);
      Point.ZERO = new Point(_0n, _0n);
      function sliceDER(s) {
        return Number.parseInt(s[0], 16) >= 8 ? "00" + s : s;
      }
      function parseDERInt(data) {
        if (data.length < 2 || data[0] !== 2) {
          throw new Error(`Invalid signature integer tag: ${bytesToHex(data)}`);
        }
        const len = data[1];
        const res = data.subarray(2, len + 2);
        if (!len || res.length !== len) {
          throw new Error(`Invalid signature integer: wrong length`);
        }
        if (res[0] === 0 && res[1] <= 127) {
          throw new Error("Invalid signature integer: trailing length");
        }
        return { data: bytesToNumber(res), left: data.subarray(len + 2) };
      }
      function parseDERSignature(data) {
        if (data.length < 2 || data[0] != 48) {
          throw new Error(`Invalid signature tag: ${bytesToHex(data)}`);
        }
        if (data[1] !== data.length - 2) {
          throw new Error("Invalid signature: incorrect length");
        }
        const { data: r, left: sBytes } = parseDERInt(data.subarray(2));
        const { data: s, left: rBytesLeft } = parseDERInt(sBytes);
        if (rBytesLeft.length) {
          throw new Error(`Invalid signature: left bytes after parsing: ${bytesToHex(rBytesLeft)}`);
        }
        return { r, s };
      }
      var Signature = class _Signature {
        constructor(r, s) {
          this.r = r;
          this.s = s;
          this.assertValidity();
        }
        static fromCompact(hex) {
          const arr = isBytes(hex);
          const name = "Signature.fromCompact";
          if (typeof hex !== "string" && !arr)
            throw new TypeError(`${name}: Expected string or Uint8Array`);
          const str = arr ? bytesToHex(hex) : hex;
          if (str.length !== 128)
            throw new Error(`${name}: Expected 64-byte hex`);
          return new _Signature(hexToNumber(str.slice(0, 64)), hexToNumber(str.slice(64, 128)));
        }
        static fromDER(hex) {
          const arr = isBytes(hex);
          if (typeof hex !== "string" && !arr)
            throw new TypeError(`Signature.fromDER: Expected string or Uint8Array`);
          const { r, s } = parseDERSignature(arr ? hex : hexToBytes(hex));
          return new _Signature(r, s);
        }
        static fromHex(hex) {
          return this.fromDER(hex);
        }
        assertValidity() {
          const { r, s } = this;
          if (!isWithinCurveOrder(r))
            throw new Error("Invalid Signature: r must be 0 < r < n");
          if (!isWithinCurveOrder(s))
            throw new Error("Invalid Signature: s must be 0 < s < n");
        }
        hasHighS() {
          const HALF = CURVE.n >> _1n;
          return this.s > HALF;
        }
        normalizeS() {
          return this.hasHighS() ? new _Signature(this.r, mod(-this.s, CURVE.n)) : this;
        }
        toDERRawBytes() {
          return hexToBytes(this.toDERHex());
        }
        toDERHex() {
          const sHex = sliceDER(numberToHexUnpadded(this.s));
          const rHex = sliceDER(numberToHexUnpadded(this.r));
          const sHexL = sHex.length / 2;
          const rHexL = rHex.length / 2;
          const sLen = numberToHexUnpadded(sHexL);
          const rLen = numberToHexUnpadded(rHexL);
          const length = numberToHexUnpadded(rHexL + sHexL + 4);
          return `30${length}02${rLen}${rHex}02${sLen}${sHex}`;
        }
        toRawBytes() {
          return this.toDERRawBytes();
        }
        toHex() {
          return this.toDERHex();
        }
        toCompactRawBytes() {
          return hexToBytes(this.toCompactHex());
        }
        toCompactHex() {
          return numTo32bStr(this.r) + numTo32bStr(this.s);
        }
      };
      exports.Signature = Signature;
      function isBytes(a) {
        return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
      }
      function abytes(item) {
        if (!isBytes(item))
          throw new Error("Uint8Array expected");
      }
      function concatBytes(...arrays) {
        arrays.every(abytes);
        if (arrays.length === 1)
          return arrays[0];
        const length = arrays.reduce((a, arr) => a + arr.length, 0);
        const result = new Uint8Array(length);
        for (let i = 0, pad = 0; i < arrays.length; i++) {
          const arr = arrays[i];
          result.set(arr, pad);
          pad += arr.length;
        }
        return result;
      }
      var hexes = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
      function bytesToHex(bytes) {
        abytes(bytes);
        let hex = "";
        for (let i = 0; i < bytes.length; i++) {
          hex += hexes[bytes[i]];
        }
        return hex;
      }
      exports.bytesToHex = bytesToHex;
      var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
      function asciiToBase16(ch2) {
        if (ch2 >= asciis._0 && ch2 <= asciis._9)
          return ch2 - asciis._0;
        if (ch2 >= asciis.A && ch2 <= asciis.F)
          return ch2 - (asciis.A - 10);
        if (ch2 >= asciis.a && ch2 <= asciis.f)
          return ch2 - (asciis.a - 10);
        return;
      }
      function hexToBytes(hex) {
        if (typeof hex !== "string")
          throw new Error("hex string expected, got " + typeof hex);
        const hl = hex.length;
        const al = hl / 2;
        if (hl % 2)
          throw new Error("hex string expected, got unpadded hex of length " + hl);
        const array2 = new Uint8Array(al);
        for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
          const n1 = asciiToBase16(hex.charCodeAt(hi));
          const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
          if (n1 === void 0 || n2 === void 0) {
            const char = hex[hi] + hex[hi + 1];
            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
          }
          array2[ai] = n1 * 16 + n2;
        }
        return array2;
      }
      exports.hexToBytes = hexToBytes;
      var POW_2_256 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
      function numTo32bStr(num) {
        if (typeof num !== "bigint")
          throw new Error("Expected bigint");
        if (!(_0n <= num && num < POW_2_256))
          throw new Error("Expected number 0 <= n < 2^256");
        return num.toString(16).padStart(64, "0");
      }
      function numTo32b(num) {
        const b2 = hexToBytes(numTo32bStr(num));
        if (b2.length !== 32)
          throw new Error("Error: expected 32 bytes");
        return b2;
      }
      function numberToHexUnpadded(num) {
        const hex = num.toString(16);
        return hex.length & 1 ? `0${hex}` : hex;
      }
      function hexToNumber(hex) {
        if (typeof hex !== "string") {
          throw new TypeError("hexToNumber: expected string, got " + typeof hex);
        }
        return BigInt(`0x${hex}`);
      }
      function bytesToNumber(bytes) {
        return hexToNumber(bytesToHex(bytes));
      }
      function ensureBytes(hex) {
        return isBytes(hex) ? Uint8Array.from(hex) : hexToBytes(hex);
      }
      function normalizeScalar(num) {
        if (typeof num === "number" && Number.isSafeInteger(num) && num > 0)
          return BigInt(num);
        if (typeof num === "bigint" && isWithinCurveOrder(num))
          return num;
        throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
      }
      function mod(a, b2 = CURVE.P) {
        const result = a % b2;
        return result >= _0n ? result : b2 + result;
      }
      function pow2(x, power) {
        const { P } = CURVE;
        let res = x;
        while (power-- > _0n) {
          res *= res;
          res %= P;
        }
        return res;
      }
      function sqrtMod(x) {
        const { P } = CURVE;
        const _6n = BigInt(6);
        const _11n = BigInt(11);
        const _22n = BigInt(22);
        const _23n = BigInt(23);
        const _44n = BigInt(44);
        const _88n = BigInt(88);
        const b2 = x * x * x % P;
        const b3 = b2 * b2 * x % P;
        const b6 = pow2(b3, _3n) * b3 % P;
        const b9 = pow2(b6, _3n) * b3 % P;
        const b11 = pow2(b9, _2n) * b2 % P;
        const b22 = pow2(b11, _11n) * b11 % P;
        const b44 = pow2(b22, _22n) * b22 % P;
        const b88 = pow2(b44, _44n) * b44 % P;
        const b176 = pow2(b88, _88n) * b88 % P;
        const b220 = pow2(b176, _44n) * b44 % P;
        const b223 = pow2(b220, _3n) * b3 % P;
        const t1 = pow2(b223, _23n) * b22 % P;
        const t2 = pow2(t1, _6n) * b2 % P;
        const rt = pow2(t2, _2n);
        const xc = rt * rt % P;
        if (xc !== x)
          throw new Error("Cannot find square root");
        return rt;
      }
      function invert(number2, modulo = CURVE.P) {
        if (number2 === _0n || modulo <= _0n) {
          throw new Error(`invert: expected positive integers, got n=${number2} mod=${modulo}`);
        }
        let a = mod(number2, modulo);
        let b2 = modulo;
        let x = _0n, y = _1n, u = _1n, v = _0n;
        while (a !== _0n) {
          const q2 = b2 / a;
          const r = b2 % a;
          const m2 = x - u * q2;
          const n = y - v * q2;
          b2 = a, a = r, x = u, y = v, u = m2, v = n;
        }
        const gcd = b2;
        if (gcd !== _1n)
          throw new Error("invert: does not exist");
        return mod(x, modulo);
      }
      function invertBatch(nums, p = CURVE.P) {
        const scratch = new Array(nums.length);
        const lastMultiplied = nums.reduce((acc, num, i) => {
          if (num === _0n)
            return acc;
          scratch[i] = acc;
          return mod(acc * num, p);
        }, _1n);
        const inverted = invert(lastMultiplied, p);
        nums.reduceRight((acc, num, i) => {
          if (num === _0n)
            return acc;
          scratch[i] = mod(acc * scratch[i], p);
          return mod(acc * num, p);
        }, inverted);
        return scratch;
      }
      function bits2int_2(bytes) {
        const delta = bytes.length * 8 - groupLen * 8;
        const num = bytesToNumber(bytes);
        return delta > 0 ? num >> BigInt(delta) : num;
      }
      function truncateHash(hash, truncateOnly = false) {
        const h = bits2int_2(hash);
        if (truncateOnly)
          return h;
        const { n } = CURVE;
        return h >= n ? h - n : h;
      }
      var _sha256Sync;
      var _hmacSha256Sync;
      var HmacDrbg = class {
        constructor(hashLen2, qByteLen) {
          this.hashLen = hashLen2;
          this.qByteLen = qByteLen;
          if (typeof hashLen2 !== "number" || hashLen2 < 2)
            throw new Error("hashLen must be a number");
          if (typeof qByteLen !== "number" || qByteLen < 2)
            throw new Error("qByteLen must be a number");
          this.v = new Uint8Array(hashLen2).fill(1);
          this.k = new Uint8Array(hashLen2).fill(0);
          this.counter = 0;
        }
        hmac(...values) {
          return exports.utils.hmacSha256(this.k, ...values);
        }
        hmacSync(...values) {
          return _hmacSha256Sync(this.k, ...values);
        }
        checkSync() {
          if (typeof _hmacSha256Sync !== "function")
            throw new ShaError("hmacSha256Sync needs to be set");
        }
        incr() {
          if (this.counter >= 1e3)
            throw new Error("Tried 1,000 k values for sign(), all were invalid");
          this.counter += 1;
        }
        async reseed(seed = new Uint8Array()) {
          this.k = await this.hmac(this.v, Uint8Array.from([0]), seed);
          this.v = await this.hmac(this.v);
          if (seed.length === 0)
            return;
          this.k = await this.hmac(this.v, Uint8Array.from([1]), seed);
          this.v = await this.hmac(this.v);
        }
        reseedSync(seed = new Uint8Array()) {
          this.checkSync();
          this.k = this.hmacSync(this.v, Uint8Array.from([0]), seed);
          this.v = this.hmacSync(this.v);
          if (seed.length === 0)
            return;
          this.k = this.hmacSync(this.v, Uint8Array.from([1]), seed);
          this.v = this.hmacSync(this.v);
        }
        async generate() {
          this.incr();
          let len = 0;
          const out = [];
          while (len < this.qByteLen) {
            this.v = await this.hmac(this.v);
            const sl = this.v.slice();
            out.push(sl);
            len += this.v.length;
          }
          return concatBytes(...out);
        }
        generateSync() {
          this.checkSync();
          this.incr();
          let len = 0;
          const out = [];
          while (len < this.qByteLen) {
            this.v = this.hmacSync(this.v);
            const sl = this.v.slice();
            out.push(sl);
            len += this.v.length;
          }
          return concatBytes(...out);
        }
      };
      function isWithinCurveOrder(num) {
        return _0n < num && num < CURVE.n;
      }
      function isValidFieldElement(num) {
        return _0n < num && num < CURVE.P;
      }
      function kmdToSig(kBytes, m2, d, lowS = true) {
        const { n } = CURVE;
        const k = truncateHash(kBytes, true);
        if (!isWithinCurveOrder(k))
          return;
        const kinv = invert(k, n);
        const q2 = Point.BASE.multiply(k);
        const r = mod(q2.x, n);
        if (r === _0n)
          return;
        const s = mod(kinv * mod(m2 + d * r, n), n);
        if (s === _0n)
          return;
        let sig = new Signature(r, s);
        let recovery = (q2.x === sig.r ? 0 : 2) | Number(q2.y & _1n);
        if (lowS && sig.hasHighS()) {
          sig = sig.normalizeS();
          recovery ^= 1;
        }
        return { sig, recovery };
      }
      function normalizePrivateKey(key) {
        let num;
        if (typeof key === "bigint") {
          num = key;
        } else if (typeof key === "number" && Number.isSafeInteger(key) && key > 0) {
          num = BigInt(key);
        } else if (typeof key === "string") {
          if (key.length !== 2 * groupLen)
            throw new Error("Expected 32 bytes of private key");
          num = hexToNumber(key);
        } else if (isBytes(key)) {
          if (key.length !== groupLen)
            throw new Error("Expected 32 bytes of private key");
          num = bytesToNumber(key);
        } else {
          throw new TypeError("Expected valid private key");
        }
        if (!isWithinCurveOrder(num))
          throw new Error("Expected private key: 0 < key < n");
        return num;
      }
      function normalizePublicKey(publicKey) {
        if (publicKey instanceof Point) {
          publicKey.assertValidity();
          return publicKey;
        } else {
          return Point.fromHex(publicKey);
        }
      }
      function normalizeSignature(signature) {
        if (signature instanceof Signature) {
          signature.assertValidity();
          return signature;
        }
        try {
          return Signature.fromDER(signature);
        } catch (error) {
          return Signature.fromCompact(signature);
        }
      }
      function getPublicKey(privateKey, isCompressed = false) {
        return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
      }
      exports.getPublicKey = getPublicKey;
      function recoverPublicKey(msgHash, signature, recovery, isCompressed = false) {
        return Point.fromSignature(msgHash, signature, recovery).toRawBytes(isCompressed);
      }
      exports.recoverPublicKey = recoverPublicKey;
      function isProbPub(item) {
        const arr = isBytes(item);
        const str = typeof item === "string";
        const len = (arr || str) && item.length;
        if (arr)
          return len === compressedLen || len === uncompressedLen;
        if (str)
          return len === compressedLen * 2 || len === uncompressedLen * 2;
        if (item instanceof Point)
          return true;
        return false;
      }
      function getSharedSecret(privateA, publicB, isCompressed = false) {
        if (isProbPub(privateA))
          throw new TypeError("getSharedSecret: first arg must be private key");
        if (!isProbPub(publicB))
          throw new TypeError("getSharedSecret: second arg must be public key");
        const b2 = normalizePublicKey(publicB);
        b2.assertValidity();
        return b2.multiply(normalizePrivateKey(privateA)).toRawBytes(isCompressed);
      }
      exports.getSharedSecret = getSharedSecret;
      function bits2int(bytes) {
        const slice = bytes.length > fieldLen ? bytes.slice(0, fieldLen) : bytes;
        return bytesToNumber(slice);
      }
      function bits2octets(bytes) {
        const z1 = bits2int(bytes);
        const z2 = mod(z1, CURVE.n);
        return int2octets(z2 < _0n ? z1 : z2);
      }
      function int2octets(num) {
        return numTo32b(num);
      }
      function initSigArgs(msgHash, privateKey, extraEntropy) {
        if (msgHash == null)
          throw new Error(`sign: expected valid message hash, not "${msgHash}"`);
        const h1 = ensureBytes(msgHash);
        const d = normalizePrivateKey(privateKey);
        const seedArgs = [int2octets(d), bits2octets(h1)];
        if (extraEntropy != null) {
          if (extraEntropy === true)
            extraEntropy = exports.utils.randomBytes(fieldLen);
          const e = ensureBytes(extraEntropy);
          if (e.length !== fieldLen)
            throw new Error(`sign: Expected ${fieldLen} bytes of extra data`);
          seedArgs.push(e);
        }
        const seed = concatBytes(...seedArgs);
        const m2 = bits2int(h1);
        return { seed, m: m2, d };
      }
      function finalizeSig(recSig, opts) {
        const { sig, recovery } = recSig;
        const { der, recovered } = Object.assign({ canonical: true, der: true }, opts);
        const hashed = der ? sig.toDERRawBytes() : sig.toCompactRawBytes();
        return recovered ? [hashed, recovery] : hashed;
      }
      async function sign(msgHash, privKey, opts = {}) {
        const { seed, m: m2, d } = initSigArgs(msgHash, privKey, opts.extraEntropy);
        const drbg = new HmacDrbg(hashLen, groupLen);
        await drbg.reseed(seed);
        let sig;
        while (!(sig = kmdToSig(await drbg.generate(), m2, d, opts.canonical)))
          await drbg.reseed();
        return finalizeSig(sig, opts);
      }
      exports.sign = sign;
      function signSync(msgHash, privKey, opts = {}) {
        const { seed, m: m2, d } = initSigArgs(msgHash, privKey, opts.extraEntropy);
        const drbg = new HmacDrbg(hashLen, groupLen);
        drbg.reseedSync(seed);
        let sig;
        while (!(sig = kmdToSig(drbg.generateSync(), m2, d, opts.canonical)))
          drbg.reseedSync();
        return finalizeSig(sig, opts);
      }
      exports.signSync = signSync;
      var vopts = { strict: true };
      function verify(signature, msgHash, publicKey, opts = vopts) {
        let sig;
        try {
          sig = normalizeSignature(signature);
          msgHash = ensureBytes(msgHash);
        } catch (error) {
          return false;
        }
        const { r, s } = sig;
        if (opts.strict && sig.hasHighS())
          return false;
        const h = truncateHash(msgHash);
        let P;
        try {
          P = normalizePublicKey(publicKey);
        } catch (error) {
          return false;
        }
        const { n } = CURVE;
        const sinv = invert(s, n);
        const u1 = mod(h * sinv, n);
        const u2 = mod(r * sinv, n);
        const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2);
        if (!R)
          return false;
        const v = mod(R.x, n);
        return v === r;
      }
      exports.verify = verify;
      function schnorrChallengeFinalize(ch2) {
        return mod(bytesToNumber(ch2), CURVE.n);
      }
      var SchnorrSignature = class _SchnorrSignature {
        constructor(r, s) {
          this.r = r;
          this.s = s;
          this.assertValidity();
        }
        static fromHex(hex) {
          const bytes = ensureBytes(hex);
          if (bytes.length !== 64)
            throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${bytes.length}`);
          const r = bytesToNumber(bytes.subarray(0, 32));
          const s = bytesToNumber(bytes.subarray(32, 64));
          return new _SchnorrSignature(r, s);
        }
        assertValidity() {
          const { r, s } = this;
          if (!isValidFieldElement(r) || !isWithinCurveOrder(s))
            throw new Error("Invalid signature");
        }
        toHex() {
          return numTo32bStr(this.r) + numTo32bStr(this.s);
        }
        toRawBytes() {
          return hexToBytes(this.toHex());
        }
      };
      function schnorrGetPublicKey(privateKey) {
        return Point.fromPrivateKey(privateKey).toRawX();
      }
      var InternalSchnorrSignature = class {
        constructor(message2, privateKey, auxRand = exports.utils.randomBytes()) {
          if (message2 == null)
            throw new TypeError(`sign: Expected valid message, not "${message2}"`);
          this.m = ensureBytes(message2);
          const { x, scalar } = this.getScalar(normalizePrivateKey(privateKey));
          this.px = x;
          this.d = scalar;
          this.rand = ensureBytes(auxRand);
          if (this.rand.length !== 32)
            throw new TypeError("sign: Expected 32 bytes of aux randomness");
        }
        getScalar(priv) {
          const point = Point.fromPrivateKey(priv);
          const scalar = point.hasEvenY() ? priv : CURVE.n - priv;
          return { point, scalar, x: point.toRawX() };
        }
        initNonce(d, t0h) {
          return numTo32b(d ^ bytesToNumber(t0h));
        }
        finalizeNonce(k0h) {
          const k0 = mod(bytesToNumber(k0h), CURVE.n);
          if (k0 === _0n)
            throw new Error("sign: Creation of signature failed. k is zero");
          const { point: R, x: rx, scalar: k } = this.getScalar(k0);
          return { R, rx, k };
        }
        finalizeSig(R, k, e, d) {
          return new SchnorrSignature(R.x, mod(k + e * d, CURVE.n)).toRawBytes();
        }
        error() {
          throw new Error("sign: Invalid signature produced");
        }
        async calc() {
          const { m: m2, d, px, rand } = this;
          const tag = exports.utils.taggedHash;
          const t = this.initNonce(d, await tag(TAGS.aux, rand));
          const { R, rx, k } = this.finalizeNonce(await tag(TAGS.nonce, t, px, m2));
          const e = schnorrChallengeFinalize(await tag(TAGS.challenge, rx, px, m2));
          const sig = this.finalizeSig(R, k, e, d);
          if (!await schnorrVerify(sig, m2, px))
            this.error();
          return sig;
        }
        calcSync() {
          const { m: m2, d, px, rand } = this;
          const tag = exports.utils.taggedHashSync;
          const t = this.initNonce(d, tag(TAGS.aux, rand));
          const { R, rx, k } = this.finalizeNonce(tag(TAGS.nonce, t, px, m2));
          const e = schnorrChallengeFinalize(tag(TAGS.challenge, rx, px, m2));
          const sig = this.finalizeSig(R, k, e, d);
          if (!schnorrVerifySync(sig, m2, px))
            this.error();
          return sig;
        }
      };
      async function schnorrSign(msg, privKey, auxRand) {
        return new InternalSchnorrSignature(msg, privKey, auxRand).calc();
      }
      function schnorrSignSync(msg, privKey, auxRand) {
        return new InternalSchnorrSignature(msg, privKey, auxRand).calcSync();
      }
      function initSchnorrVerify(signature, message2, publicKey) {
        const raw = signature instanceof SchnorrSignature;
        const sig = raw ? signature : SchnorrSignature.fromHex(signature);
        if (raw)
          sig.assertValidity();
        return {
          ...sig,
          m: ensureBytes(message2),
          P: normalizePublicKey(publicKey)
        };
      }
      function finalizeSchnorrVerify(r, P, s, e) {
        const R = Point.BASE.multiplyAndAddUnsafe(P, normalizePrivateKey(s), mod(-e, CURVE.n));
        if (!R || !R.hasEvenY() || R.x !== r)
          return false;
        return true;
      }
      async function schnorrVerify(signature, message2, publicKey) {
        try {
          const { r, s, m: m2, P } = initSchnorrVerify(signature, message2, publicKey);
          const e = schnorrChallengeFinalize(await exports.utils.taggedHash(TAGS.challenge, numTo32b(r), P.toRawX(), m2));
          return finalizeSchnorrVerify(r, P, s, e);
        } catch (error) {
          return false;
        }
      }
      function schnorrVerifySync(signature, message2, publicKey) {
        try {
          const { r, s, m: m2, P } = initSchnorrVerify(signature, message2, publicKey);
          const e = schnorrChallengeFinalize(exports.utils.taggedHashSync(TAGS.challenge, numTo32b(r), P.toRawX(), m2));
          return finalizeSchnorrVerify(r, P, s, e);
        } catch (error) {
          if (error instanceof ShaError)
            throw error;
          return false;
        }
      }
      exports.schnorr = {
        Signature: SchnorrSignature,
        getPublicKey: schnorrGetPublicKey,
        sign: schnorrSign,
        verify: schnorrVerify,
        signSync: schnorrSignSync,
        verifySync: schnorrVerifySync
      };
      Point.BASE._setWindowSize(8);
      var crypto2 = {
        node: nodeCrypto,
        web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
      };
      var TAGS = {
        challenge: "BIP0340/challenge",
        aux: "BIP0340/aux",
        nonce: "BIP0340/nonce"
      };
      var TAGGED_HASH_PREFIXES = {};
      exports.utils = {
        bytesToHex,
        hexToBytes,
        concatBytes,
        mod,
        invert,
        isValidPrivateKey(privateKey) {
          try {
            normalizePrivateKey(privateKey);
            return true;
          } catch (error) {
            return false;
          }
        },
        _bigintTo32Bytes: numTo32b,
        _normalizePrivateKey: normalizePrivateKey,
        hashToPrivateKey: (hash) => {
          hash = ensureBytes(hash);
          const minLen = groupLen + 8;
          if (hash.length < minLen || hash.length > 1024) {
            throw new Error(`Expected valid bytes of private key as per FIPS 186`);
          }
          const num = mod(bytesToNumber(hash), CURVE.n - _1n) + _1n;
          return numTo32b(num);
        },
        randomBytes: (bytesLength = 32) => {
          if (crypto2.web) {
            return crypto2.web.getRandomValues(new Uint8Array(bytesLength));
          } else if (crypto2.node) {
            const { randomBytes } = crypto2.node;
            return Uint8Array.from(randomBytes(bytesLength));
          } else {
            throw new Error("The environment doesn't have randomBytes function");
          }
        },
        randomPrivateKey: () => exports.utils.hashToPrivateKey(exports.utils.randomBytes(groupLen + 8)),
        precompute(windowSize = 8, point = Point.BASE) {
          const cached = point === Point.BASE ? point : new Point(point.x, point.y);
          cached._setWindowSize(windowSize);
          cached.multiply(_3n);
          return cached;
        },
        sha256: async (...messages) => {
          if (crypto2.web) {
            const buffer = await crypto2.web.subtle.digest("SHA-256", concatBytes(...messages));
            return new Uint8Array(buffer);
          } else if (crypto2.node) {
            const { createHash: createHash2 } = crypto2.node;
            const hash = createHash2("sha256");
            messages.forEach((m2) => hash.update(m2));
            return Uint8Array.from(hash.digest());
          } else {
            throw new Error("The environment doesn't have sha256 function");
          }
        },
        hmacSha256: async (key, ...messages) => {
          if (crypto2.web) {
            const ckey = await crypto2.web.subtle.importKey("raw", key, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
            const message2 = concatBytes(...messages);
            const buffer = await crypto2.web.subtle.sign("HMAC", ckey, message2);
            return new Uint8Array(buffer);
          } else if (crypto2.node) {
            const { createHmac } = crypto2.node;
            const hash = createHmac("sha256", key);
            messages.forEach((m2) => hash.update(m2));
            return Uint8Array.from(hash.digest());
          } else {
            throw new Error("The environment doesn't have hmac-sha256 function");
          }
        },
        sha256Sync: void 0,
        hmacSha256Sync: void 0,
        taggedHash: async (tag, ...messages) => {
          let tagP = TAGGED_HASH_PREFIXES[tag];
          if (tagP === void 0) {
            const tagH = await exports.utils.sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
            tagP = concatBytes(tagH, tagH);
            TAGGED_HASH_PREFIXES[tag] = tagP;
          }
          return exports.utils.sha256(tagP, ...messages);
        },
        taggedHashSync: (tag, ...messages) => {
          if (typeof _sha256Sync !== "function")
            throw new ShaError("sha256Sync is undefined, you need to set it");
          let tagP = TAGGED_HASH_PREFIXES[tag];
          if (tagP === void 0) {
            const tagH = _sha256Sync(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
            tagP = concatBytes(tagH, tagH);
            TAGGED_HASH_PREFIXES[tag] = tagP;
          }
          return _sha256Sync(tagP, ...messages);
        },
        _JacobianPoint: JacobianPoint
      };
      Object.defineProperties(exports.utils, {
        sha256Sync: {
          configurable: false,
          get() {
            return _sha256Sync;
          },
          set(val) {
            if (!_sha256Sync)
              _sha256Sync = val;
          }
        },
        hmacSha256Sync: {
          configurable: false,
          get() {
            return _hmacSha256Sync;
          },
          set(val) {
            if (!_hmacSha256Sync)
              _hmacSha256Sync = val;
          }
        }
      });
    }
  });

  // node_modules/jsontokens/lib/ecdsaSigFormatter.js
  var require_ecdsaSigFormatter = __commonJS({
    "node_modules/jsontokens/lib/ecdsaSigFormatter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.joseToDer = exports.derToJose = void 0;
      var base64_js_1 = require_base64_js();
      var base64Url_1 = require_base64Url();
      function getParamSize(keySize) {
        return (keySize / 8 | 0) + (keySize % 8 === 0 ? 0 : 1);
      }
      var paramBytesForAlg = {
        ES256: getParamSize(256),
        ES384: getParamSize(384),
        ES512: getParamSize(521)
      };
      function getParamBytesForAlg(alg) {
        const paramBytes = paramBytesForAlg[alg];
        if (paramBytes) {
          return paramBytes;
        }
        throw new Error(`Unknown algorithm "${alg}"`);
      }
      var MAX_OCTET = 128;
      var CLASS_UNIVERSAL = 0;
      var PRIMITIVE_BIT = 32;
      var TAG_SEQ = 16;
      var TAG_INT = 2;
      var ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | CLASS_UNIVERSAL << 6;
      var ENCODED_TAG_INT = TAG_INT | CLASS_UNIVERSAL << 6;
      function signatureAsBytes(signature) {
        if (signature instanceof Uint8Array) {
          return signature;
        } else if ("string" === typeof signature) {
          return (0, base64_js_1.toByteArray)((0, base64Url_1.pad)(signature));
        }
        throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
      }
      function derToJose(signature, alg) {
        const signatureBytes = signatureAsBytes(signature);
        const paramBytes = getParamBytesForAlg(alg);
        const maxEncodedParamLength = paramBytes + 1;
        const inputLength = signatureBytes.length;
        let offset = 0;
        if (signatureBytes[offset++] !== ENCODED_TAG_SEQ) {
          throw new Error('Could not find expected "seq"');
        }
        let seqLength = signatureBytes[offset++];
        if (seqLength === (MAX_OCTET | 1)) {
          seqLength = signatureBytes[offset++];
        }
        if (inputLength - offset < seqLength) {
          throw new Error(`"seq" specified length of "${seqLength}", only "${inputLength - offset}" remaining`);
        }
        if (signatureBytes[offset++] !== ENCODED_TAG_INT) {
          throw new Error('Could not find expected "int" for "r"');
        }
        const rLength = signatureBytes[offset++];
        if (inputLength - offset - 2 < rLength) {
          throw new Error(`"r" specified length of "${rLength}", only "${inputLength - offset - 2}" available`);
        }
        if (maxEncodedParamLength < rLength) {
          throw new Error(`"r" specified length of "${rLength}", max of "${maxEncodedParamLength}" is acceptable`);
        }
        const rOffset = offset;
        offset += rLength;
        if (signatureBytes[offset++] !== ENCODED_TAG_INT) {
          throw new Error('Could not find expected "int" for "s"');
        }
        const sLength = signatureBytes[offset++];
        if (inputLength - offset !== sLength) {
          throw new Error(`"s" specified length of "${sLength}", expected "${inputLength - offset}"`);
        }
        if (maxEncodedParamLength < sLength) {
          throw new Error(`"s" specified length of "${sLength}", max of "${maxEncodedParamLength}" is acceptable`);
        }
        const sOffset = offset;
        offset += sLength;
        if (offset !== inputLength) {
          throw new Error(`Expected to consume entire array, but "${inputLength - offset}" bytes remain`);
        }
        const rPadding = paramBytes - rLength;
        const sPadding = paramBytes - sLength;
        const dst = new Uint8Array(rPadding + rLength + sPadding + sLength);
        for (offset = 0; offset < rPadding; ++offset) {
          dst[offset] = 0;
        }
        dst.set(signatureBytes.subarray(rOffset + Math.max(-rPadding, 0), rOffset + rLength), offset);
        offset = paramBytes;
        for (const o = offset; offset < o + sPadding; ++offset) {
          dst[offset] = 0;
        }
        dst.set(signatureBytes.subarray(sOffset + Math.max(-sPadding, 0), sOffset + sLength), offset);
        return (0, base64Url_1.escape)((0, base64_js_1.fromByteArray)(dst));
      }
      exports.derToJose = derToJose;
      function countPadding(buf, start, stop) {
        let padding = 0;
        while (start + padding < stop && buf[start + padding] === 0) {
          ++padding;
        }
        const needsSign = buf[start + padding] >= MAX_OCTET;
        if (needsSign) {
          --padding;
        }
        return padding;
      }
      function joseToDer(signature, alg) {
        signature = signatureAsBytes(signature);
        const paramBytes = getParamBytesForAlg(alg);
        const signatureBytes = signature.length;
        if (signatureBytes !== paramBytes * 2) {
          throw new TypeError(`"${alg}" signatures must be "${paramBytes * 2}" bytes, saw "${signatureBytes}"`);
        }
        const rPadding = countPadding(signature, 0, paramBytes);
        const sPadding = countPadding(signature, paramBytes, signature.length);
        const rLength = paramBytes - rPadding;
        const sLength = paramBytes - sPadding;
        const rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;
        const shortLength = rsBytes < MAX_OCTET;
        const dst = new Uint8Array((shortLength ? 2 : 3) + rsBytes);
        let offset = 0;
        dst[offset++] = ENCODED_TAG_SEQ;
        if (shortLength) {
          dst[offset++] = rsBytes;
        } else {
          dst[offset++] = MAX_OCTET | 1;
          dst[offset++] = rsBytes & 255;
        }
        dst[offset++] = ENCODED_TAG_INT;
        dst[offset++] = rLength;
        if (rPadding < 0) {
          dst[offset++] = 0;
          dst.set(signature.subarray(0, paramBytes), offset);
          offset += paramBytes;
        } else {
          dst.set(signature.subarray(rPadding, paramBytes), offset);
          offset += paramBytes - rPadding;
        }
        dst[offset++] = ENCODED_TAG_INT;
        dst[offset++] = sLength;
        if (sPadding < 0) {
          dst[offset++] = 0;
          dst.set(signature.subarray(paramBytes), offset);
        } else {
          dst.set(signature.subarray(paramBytes + sPadding), offset);
        }
        return dst;
      }
      exports.joseToDer = joseToDer;
    }
  });

  // node_modules/jsontokens/lib/errors.js
  var require_errors = __commonJS({
    "node_modules/jsontokens/lib/errors.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.InvalidTokenError = exports.MissingParametersError = void 0;
      var MissingParametersError = class extends Error {
        constructor(message2) {
          super();
          this.name = "MissingParametersError";
          this.message = message2 || "";
        }
      };
      exports.MissingParametersError = MissingParametersError;
      var InvalidTokenError = class extends Error {
        constructor(message2) {
          super();
          this.name = "InvalidTokenError";
          this.message = message2 || "";
        }
      };
      exports.InvalidTokenError = InvalidTokenError;
    }
  });

  // node_modules/jsontokens/lib/cryptoClients/secp256k1.js
  var require_secp256k1 = __commonJS({
    "node_modules/jsontokens/lib/cryptoClients/secp256k1.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SECP256K1Client = void 0;
      var hmac_1 = require_hmac();
      var sha256_1 = require_sha256();
      var secp = require_lib();
      var ecdsaSigFormatter_1 = require_ecdsaSigFormatter();
      var errors_1 = require_errors();
      var utils_1 = require_utils();
      secp.utils.hmacSha256Sync = (key, ...msgs) => {
        const h = hmac_1.hmac.create(sha256_1.sha256, key);
        msgs.forEach((msg) => h.update(msg));
        return h.digest();
      };
      var SECP256K1Client = class {
        static derivePublicKey(privateKey, compressed = true) {
          if (privateKey.length === 66) {
            privateKey = privateKey.slice(0, 64);
          }
          if (privateKey.length < 64) {
            privateKey = privateKey.padStart(64, "0");
          }
          return (0, utils_1.bytesToHex)(secp.getPublicKey(privateKey, compressed));
        }
        static signHash(signingInputHash, privateKey, format = "jose") {
          if (!signingInputHash || !privateKey) {
            throw new errors_1.MissingParametersError("a signing input hash and private key are all required");
          }
          const derSignature = secp.signSync(signingInputHash, privateKey.slice(0, 64), {
            der: true,
            canonical: false
          });
          if (format === "der")
            return (0, utils_1.bytesToHex)(derSignature);
          if (format === "jose")
            return (0, ecdsaSigFormatter_1.derToJose)(derSignature, "ES256");
          throw Error("Invalid signature format");
        }
        static loadSignature(joseSignature) {
          return (0, ecdsaSigFormatter_1.joseToDer)(joseSignature, "ES256");
        }
        static verifyHash(signingInputHash, derSignatureBytes, publicKey) {
          if (!signingInputHash || !derSignatureBytes || !publicKey) {
            throw new errors_1.MissingParametersError("a signing input hash, der signature, and public key are all required");
          }
          return secp.verify(derSignatureBytes, signingInputHash, publicKey, { strict: false });
        }
      };
      exports.SECP256K1Client = SECP256K1Client;
      SECP256K1Client.algorithmName = "ES256K";
    }
  });

  // node_modules/jsontokens/lib/cryptoClients/index.js
  var require_cryptoClients = __commonJS({
    "node_modules/jsontokens/lib/cryptoClients/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.cryptoClients = exports.SECP256K1Client = void 0;
      var secp256k1_1 = require_secp256k1();
      Object.defineProperty(exports, "SECP256K1Client", { enumerable: true, get: function() {
        return secp256k1_1.SECP256K1Client;
      } });
      var cryptoClients = {
        ES256K: secp256k1_1.SECP256K1Client
      };
      exports.cryptoClients = cryptoClients;
    }
  });

  // node_modules/jsontokens/lib/cryptoClients/sha256.js
  var require_sha2562 = __commonJS({
    "node_modules/jsontokens/lib/cryptoClients/sha256.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.hashSha256Async = exports.hashSha256 = void 0;
      var sha256_1 = require_sha256();
      function hashSha256(input) {
        return (0, sha256_1.sha256)(input);
      }
      exports.hashSha256 = hashSha256;
      function hashSha256Async(input) {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const isSubtleCryptoAvailable = typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined";
            if (isSubtleCryptoAvailable) {
              const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
              const hash = yield crypto.subtle.digest("SHA-256", bytes);
              return new Uint8Array(hash);
            } else {
              const nodeCrypto = require_crypto2();
              if (!nodeCrypto.createHash) {
                throw new Error("`crypto` module does not contain `createHash`");
              }
              return Promise.resolve(nodeCrypto.createHash("sha256").update(input).digest());
            }
          } catch (error) {
            console.log(error);
            console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.');
            return Promise.resolve(hashSha256(input));
          }
        });
      }
      exports.hashSha256Async = hashSha256Async;
    }
  });

  // node_modules/jsontokens/lib/signer.js
  var require_signer = __commonJS({
    "node_modules/jsontokens/lib/signer.js"(exports) {
      "use strict";
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TokenSigner = exports.createUnsecuredToken = void 0;
      var base64url = require_base64Url();
      var cryptoClients_1 = require_cryptoClients();
      var errors_1 = require_errors();
      var sha256_1 = require_sha2562();
      function createSigningInput(payload, header) {
        const tokenParts = [];
        const encodedHeader = base64url.encode(JSON.stringify(header));
        tokenParts.push(encodedHeader);
        const encodedPayload = base64url.encode(JSON.stringify(payload));
        tokenParts.push(encodedPayload);
        const signingInput = tokenParts.join(".");
        return signingInput;
      }
      function createUnsecuredToken9(payload) {
        const header = { typ: "JWT", alg: "none" };
        return createSigningInput(payload, header) + ".";
      }
      exports.createUnsecuredToken = createUnsecuredToken9;
      var TokenSigner = class {
        constructor(signingAlgorithm, rawPrivateKey) {
          if (!(signingAlgorithm && rawPrivateKey)) {
            throw new errors_1.MissingParametersError("a signing algorithm and private key are required");
          }
          if (typeof signingAlgorithm !== "string") {
            throw new Error("signing algorithm parameter must be a string");
          }
          signingAlgorithm = signingAlgorithm.toUpperCase();
          if (!cryptoClients_1.cryptoClients.hasOwnProperty(signingAlgorithm)) {
            throw new Error("invalid signing algorithm");
          }
          this.tokenType = "JWT";
          this.cryptoClient = cryptoClients_1.cryptoClients[signingAlgorithm];
          this.rawPrivateKey = rawPrivateKey;
        }
        header(header = {}) {
          const defaultHeader = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
          return Object.assign({}, defaultHeader, header);
        }
        sign(payload, expanded = false, customHeader = {}) {
          const header = this.header(customHeader);
          const signingInput = createSigningInput(payload, header);
          const signingInputHash = (0, sha256_1.hashSha256)(signingInput);
          return this.createWithSignedHash(payload, expanded, header, signingInput, signingInputHash);
        }
        signAsync(payload, expanded = false, customHeader = {}) {
          return __awaiter(this, void 0, void 0, function* () {
            const header = this.header(customHeader);
            const signingInput = createSigningInput(payload, header);
            const signingInputHash = yield (0, sha256_1.hashSha256Async)(signingInput);
            return this.createWithSignedHash(payload, expanded, header, signingInput, signingInputHash);
          });
        }
        createWithSignedHash(payload, expanded, header, signingInput, signingInputHash) {
          const signature = this.cryptoClient.signHash(signingInputHash, this.rawPrivateKey);
          if (expanded) {
            const signedToken = {
              header: [base64url.encode(JSON.stringify(header))],
              payload: JSON.stringify(payload),
              signature: [signature]
            };
            return signedToken;
          } else {
            return [signingInput, signature].join(".");
          }
        }
      };
      exports.TokenSigner = TokenSigner;
    }
  });

  // node_modules/jsontokens/lib/verifier.js
  var require_verifier = __commonJS({
    "node_modules/jsontokens/lib/verifier.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TokenVerifier = void 0;
      var base64url = require_base64Url();
      var cryptoClients_1 = require_cryptoClients();
      var errors_1 = require_errors();
      var sha256_1 = require_sha2562();
      var TokenVerifier = class {
        constructor(signingAlgorithm, rawPublicKey) {
          if (!(signingAlgorithm && rawPublicKey)) {
            throw new errors_1.MissingParametersError("a signing algorithm and public key are required");
          }
          if (typeof signingAlgorithm !== "string") {
            throw "signing algorithm parameter must be a string";
          }
          signingAlgorithm = signingAlgorithm.toUpperCase();
          if (!cryptoClients_1.cryptoClients.hasOwnProperty(signingAlgorithm)) {
            throw "invalid signing algorithm";
          }
          this.tokenType = "JWT";
          this.cryptoClient = cryptoClients_1.cryptoClients[signingAlgorithm];
          this.rawPublicKey = rawPublicKey;
        }
        verify(token2) {
          if (typeof token2 === "string") {
            return this.verifyCompact(token2, false);
          } else if (typeof token2 === "object") {
            return this.verifyExpanded(token2, false);
          } else {
            return false;
          }
        }
        verifyAsync(token2) {
          if (typeof token2 === "string") {
            return this.verifyCompact(token2, true);
          } else if (typeof token2 === "object") {
            return this.verifyExpanded(token2, true);
          } else {
            return Promise.resolve(false);
          }
        }
        verifyCompact(token2, async) {
          const tokenParts = token2.split(".");
          const signingInput = tokenParts[0] + "." + tokenParts[1];
          const performVerify = (signingInputHash) => {
            const derSignatureBytes = this.cryptoClient.loadSignature(tokenParts[2]);
            return this.cryptoClient.verifyHash(signingInputHash, derSignatureBytes, this.rawPublicKey);
          };
          if (async) {
            return (0, sha256_1.hashSha256Async)(signingInput).then((signingInputHash) => performVerify(signingInputHash));
          } else {
            const signingInputHash = (0, sha256_1.hashSha256)(signingInput);
            return performVerify(signingInputHash);
          }
        }
        verifyExpanded(token2, async) {
          const signingInput = [token2["header"].join("."), base64url.encode(token2["payload"])].join(".");
          let verified = true;
          const performVerify = (signingInputHash) => {
            token2["signature"].map((signature) => {
              const derSignatureBytes = this.cryptoClient.loadSignature(signature);
              const signatureVerified = this.cryptoClient.verifyHash(signingInputHash, derSignatureBytes, this.rawPublicKey);
              if (!signatureVerified) {
                verified = false;
              }
            });
            return verified;
          };
          if (async) {
            return (0, sha256_1.hashSha256Async)(signingInput).then((signingInputHash) => performVerify(signingInputHash));
          } else {
            const signingInputHash = (0, sha256_1.hashSha256)(signingInput);
            return performVerify(signingInputHash);
          }
        }
      };
      exports.TokenVerifier = TokenVerifier;
    }
  });

  // node_modules/jsontokens/lib/decode.js
  var require_decode = __commonJS({
    "node_modules/jsontokens/lib/decode.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.decodeToken = void 0;
      var base64url = require_base64Url();
      function decodeToken(token2) {
        if (typeof token2 === "string") {
          const tokenParts = token2.split(".");
          const header = JSON.parse(base64url.decode(tokenParts[0]));
          const payload = JSON.parse(base64url.decode(tokenParts[1]));
          const signature = tokenParts[2];
          return {
            header,
            payload,
            signature
          };
        } else if (typeof token2 === "object") {
          if (typeof token2.payload !== "string") {
            throw new Error("Expected token payload to be a base64 or json string");
          }
          let payload = token2.payload;
          if (token2.payload[0] !== "{") {
            payload = base64url.decode(payload);
          }
          const allHeaders = [];
          token2.header.map((headerValue) => {
            const header = JSON.parse(base64url.decode(headerValue));
            allHeaders.push(header);
          });
          return {
            header: allHeaders,
            payload: JSON.parse(payload),
            signature: token2.signature
          };
        }
      }
      exports.decodeToken = decodeToken;
    }
  });

  // node_modules/jsontokens/lib/index.js
  var require_lib2 = __commonJS({
    "node_modules/jsontokens/lib/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m2, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m2, k);
        if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m2[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      }) : (function(o, m2, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m2[k];
      }));
      var __exportStar = exports && exports.__exportStar || function(m2, exports2) {
        for (var p in m2) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m2, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_signer(), exports);
      __exportStar(require_verifier(), exports);
      __exportStar(require_decode(), exports);
      __exportStar(require_errors(), exports);
      __exportStar(require_cryptoClients(), exports);
    }
  });

  // node_modules/bech32/dist/index.js
  var require_dist = __commonJS({
    "node_modules/bech32/dist/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.bech32m = exports.bech32 = void 0;
      var ALPHABET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
      var ALPHABET_MAP = {};
      for (let z = 0; z < ALPHABET.length; z++) {
        const x = ALPHABET.charAt(z);
        ALPHABET_MAP[x] = z;
      }
      function polymodStep(pre) {
        const b2 = pre >> 25;
        return (pre & 33554431) << 5 ^ -(b2 >> 0 & 1) & 996825010 ^ -(b2 >> 1 & 1) & 642813549 ^ -(b2 >> 2 & 1) & 513874426 ^ -(b2 >> 3 & 1) & 1027748829 ^ -(b2 >> 4 & 1) & 705979059;
      }
      function prefixChk(prefix) {
        let chk = 1;
        for (let i = 0; i < prefix.length; ++i) {
          const c = prefix.charCodeAt(i);
          if (c < 33 || c > 126)
            return "Invalid prefix (" + prefix + ")";
          chk = polymodStep(chk) ^ c >> 5;
        }
        chk = polymodStep(chk);
        for (let i = 0; i < prefix.length; ++i) {
          const v = prefix.charCodeAt(i);
          chk = polymodStep(chk) ^ v & 31;
        }
        return chk;
      }
      function convert(data, inBits, outBits, pad) {
        let value = 0;
        let bits = 0;
        const maxV = (1 << outBits) - 1;
        const result = [];
        for (let i = 0; i < data.length; ++i) {
          value = value << inBits | data[i];
          bits += inBits;
          while (bits >= outBits) {
            bits -= outBits;
            result.push(value >> bits & maxV);
          }
        }
        if (pad) {
          if (bits > 0) {
            result.push(value << outBits - bits & maxV);
          }
        } else {
          if (bits >= inBits)
            return "Excess padding";
          if (value << outBits - bits & maxV)
            return "Non-zero padding";
        }
        return result;
      }
      function toWords(bytes) {
        return convert(bytes, 8, 5, true);
      }
      function fromWordsUnsafe(words) {
        const res = convert(words, 5, 8, false);
        if (Array.isArray(res))
          return res;
      }
      function fromWords(words) {
        const res = convert(words, 5, 8, false);
        if (Array.isArray(res))
          return res;
        throw new Error(res);
      }
      function getLibraryFromEncoding(encoding) {
        let ENCODING_CONST;
        if (encoding === "bech32") {
          ENCODING_CONST = 1;
        } else {
          ENCODING_CONST = 734539939;
        }
        function encode3(prefix, words, LIMIT) {
          LIMIT = LIMIT || 90;
          if (prefix.length + 7 + words.length > LIMIT)
            throw new TypeError("Exceeds length limit");
          prefix = prefix.toLowerCase();
          let chk = prefixChk(prefix);
          if (typeof chk === "string")
            throw new Error(chk);
          let result = prefix + "1";
          for (let i = 0; i < words.length; ++i) {
            const x = words[i];
            if (x >> 5 !== 0)
              throw new Error("Non 5-bit word");
            chk = polymodStep(chk) ^ x;
            result += ALPHABET.charAt(x);
          }
          for (let i = 0; i < 6; ++i) {
            chk = polymodStep(chk);
          }
          chk ^= ENCODING_CONST;
          for (let i = 0; i < 6; ++i) {
            const v = chk >> (5 - i) * 5 & 31;
            result += ALPHABET.charAt(v);
          }
          return result;
        }
        function __decode(str, LIMIT) {
          LIMIT = LIMIT || 90;
          if (str.length < 8)
            return str + " too short";
          if (str.length > LIMIT)
            return "Exceeds length limit";
          const lowered = str.toLowerCase();
          const uppered = str.toUpperCase();
          if (str !== lowered && str !== uppered)
            return "Mixed-case string " + str;
          str = lowered;
          const split = str.lastIndexOf("1");
          if (split === -1)
            return "No separator character for " + str;
          if (split === 0)
            return "Missing prefix for " + str;
          const prefix = str.slice(0, split);
          const wordChars = str.slice(split + 1);
          if (wordChars.length < 6)
            return "Data too short";
          let chk = prefixChk(prefix);
          if (typeof chk === "string")
            return chk;
          const words = [];
          for (let i = 0; i < wordChars.length; ++i) {
            const c = wordChars.charAt(i);
            const v = ALPHABET_MAP[c];
            if (v === void 0)
              return "Unknown character " + c;
            chk = polymodStep(chk) ^ v;
            if (i + 6 >= wordChars.length)
              continue;
            words.push(v);
          }
          if (chk !== ENCODING_CONST)
            return "Invalid checksum for " + str;
          return { prefix, words };
        }
        function decodeUnsafe(str, LIMIT) {
          const res = __decode(str, LIMIT);
          if (typeof res === "object")
            return res;
        }
        function decode(str, LIMIT) {
          const res = __decode(str, LIMIT);
          if (typeof res === "object")
            return res;
          throw new Error(res);
        }
        return {
          decodeUnsafe,
          decode,
          encode: encode3,
          toWords,
          fromWordsUnsafe,
          fromWords
        };
      }
      exports.bech32 = getLibraryFromEncoding("bech32");
      exports.bech32m = getLibraryFromEncoding("bech32m");
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      exports.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m2;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m2 = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m2 = m2 * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m2 ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m2 = m2 + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m2 * Math.pow(2, e - mLen);
      };
      exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m2, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m2 = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m2 = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m2 = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m2 = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m2 & 255, i += d, m2 /= 256, mLen -= 8) {
        }
        e = e << mLen | m2;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s * 128;
      };
    }
  });

  // node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "node_modules/buffer/index.js"(exports) {
      "use strict";
      var base64 = require_base64_js();
      var ieee754 = require_ieee754();
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer3;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new Uint8Array(1);
          const proto = { foo: function() {
            return 42;
          } };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      Object.defineProperty(Buffer3.prototype, "parent", {
        enumerable: true,
        get: function() {
          if (!Buffer3.isBuffer(this)) return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer3.prototype, "offset", {
        enumerable: true,
        get: function() {
          if (!Buffer3.isBuffer(this)) return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf = new Uint8Array(length);
        Object.setPrototypeOf(buf, Buffer3.prototype);
        return buf;
      }
      function Buffer3(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      Buffer3.poolSize = 8192;
      function from(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
          );
        }
        if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer3.from(valueOf, encodingOrOffset, length);
        }
        const b2 = fromObject(value);
        if (b2) return b2;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      Buffer3.from = function(value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer3, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      Buffer3.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      Buffer3.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer3.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string2, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength(string2, encoding) | 0;
        let buf = createBuffer(length);
        const actual = buf.write(string2, encoding);
        if (actual !== length) {
          buf = buf.slice(0, actual);
        }
        return buf;
      }
      function fromArrayLike(array2) {
        const length = array2.length < 0 ? 0 : checked(array2.length) | 0;
        const buf = createBuffer(length);
        for (let i = 0; i < length; i += 1) {
          buf[i] = array2[i] & 255;
        }
        return buf;
      }
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
          const copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      function fromArrayBuffer(array2, byteOffset, length) {
        if (byteOffset < 0 || array2.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array2.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf;
        if (byteOffset === void 0 && length === void 0) {
          buf = new Uint8Array(array2);
        } else if (length === void 0) {
          buf = new Uint8Array(array2, byteOffset);
        } else {
          buf = new Uint8Array(array2, byteOffset, length);
        }
        Object.setPrototypeOf(buf, Buffer3.prototype);
        return buf;
      }
      function fromObject(obj) {
        if (Buffer3.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf = createBuffer(len);
          if (buf.length === 0) {
            return buf;
          }
          obj.copy(buf, 0, 0, len);
          return buf;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer3.alloc(+length);
      }
      Buffer3.isBuffer = function isBuffer2(b2) {
        return b2 != null && b2._isBuffer === true && b2 !== Buffer3.prototype;
      };
      Buffer3.compare = function compare(a, b2) {
        if (isInstance(a, Uint8Array)) a = Buffer3.from(a, a.offset, a.byteLength);
        if (isInstance(b2, Uint8Array)) b2 = Buffer3.from(b2, b2.offset, b2.byteLength);
        if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b2)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b2) return 0;
        let x = a.length;
        let y = b2.length;
        for (let i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b2[i]) {
            x = a[i];
            y = b2[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer3.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      Buffer3.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer3.alloc(0);
        }
        let i;
        if (length === void 0) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }
        const buffer = Buffer3.allocUnsafe(length);
        let pos = 0;
        for (i = 0; i < list.length; ++i) {
          let buf = list[i];
          if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
              if (!Buffer3.isBuffer(buf)) buf = Buffer3.from(buf);
              buf.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(
                buffer,
                buf,
                pos
              );
            }
          } else if (!Buffer3.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf.copy(buffer, pos);
          }
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string2, encoding) {
        if (Buffer3.isBuffer(string2)) {
          return string2.length;
        }
        if (ArrayBuffer.isView(string2) || isInstance(string2, ArrayBuffer)) {
          return string2.byteLength;
        }
        if (typeof string2 !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string2
          );
        }
        const len = string2.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0) return 0;
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string2).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string2).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string2).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer3.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding) encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer3.prototype._isBuffer = true;
      function swap(b2, n, m2) {
        const i = b2[n];
        b2[n] = b2[m2];
        b2[m2] = i;
      }
      Buffer3.prototype.swap16 = function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      };
      Buffer3.prototype.swap32 = function swap322() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer3.prototype.swap64 = function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer3.prototype.toString = function toString3() {
        const length = this.length;
        if (length === 0) return "";
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
      Buffer3.prototype.equals = function equals(b2) {
        if (!Buffer3.isBuffer(b2)) throw new TypeError("Argument must be a Buffer");
        if (this === b2) return true;
        return Buffer3.compare(this, b2) === 0;
      };
      Buffer3.prototype.inspect = function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max) str += " ... ";
        return "<Buffer " + str + ">";
      };
      if (customInspectSymbol) {
        Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
      }
      Buffer3.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer3.from(target, target.offset, target.byteLength);
        }
        if (!Buffer3.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0) return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0;
          else return -1;
        }
        if (typeof val === "string") {
          val = Buffer3.from(val, encoding);
        }
        if (Buffer3.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i2) {
          if (indexSize === 1) {
            return buf[i2];
          } else {
            return buf.readUInt16BE(i2 * indexSize);
          }
        }
        let i;
        if (dir) {
          let foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i;
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j2 = 0; j2 < valLength; j2++) {
              if (read(arr, i + j2) !== read(val, j2)) {
                found = false;
                break;
              }
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };
      Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string2, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string2.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i;
        for (i = 0; i < length; ++i) {
          const parsed = parseInt(string2.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string2, offset, length) {
        return blitBuffer(utf8ToBytes(string2, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string2, offset, length) {
        return blitBuffer(asciiToBytes(string2), buf, offset, length);
      }
      function base64Write(buf, string2, offset, length) {
        return blitBuffer(base64ToBytes(string2), buf, offset, length);
      }
      function ucs2Write(buf, string2, offset, length) {
        return blitBuffer(utf16leToBytes(string2, buf.length - offset), buf, offset, length);
      }
      Buffer3.prototype.write = function write(string2, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0) encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining) length = remaining;
        if (string2.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding) encoding = "utf8";
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string2, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string2, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string2, offset, length);
            case "base64":
              return base64Write(this, string2, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string2, offset, length);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };
      Buffer3.prototype.toJSON = function toJSON2() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        const res = [];
        let i = start;
        while (i < end) {
          const firstByte = buf[i];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      function asciiSlice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 127);
        }
        return ret;
      }
      function latin1Slice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }
        return ret;
      }
      function hexSlice(buf, start, end) {
        const len = buf.length;
        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;
        let out = "";
        for (let i = start; i < end; ++i) {
          out += hexSliceLookupTable[buf[i]];
        }
        return out;
      }
      function utf16leSlice(buf, start, end) {
        const bytes = buf.slice(start, end);
        let res = "";
        for (let i = 0; i < bytes.length - 1; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }
      Buffer3.prototype.slice = function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start) end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer3.prototype);
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        return val;
      };
      Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length);
        }
        let val = this[offset + --byteLength2];
        let mul = 1;
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul;
        }
        return val;
      };
      Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      };
      Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      });
      Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      });
      Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let i = byteLength2;
        let mul = 1;
        let val = this[offset + --i];
        while (i > 0 && (mul *= 256)) {
          val += this[offset + --i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128)) return this[offset];
        return (255 - this[offset] + 1) * -1;
      };
      Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      });
      Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first << 24) + // Overflow
        this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      });
      Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer3.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let mul = 1;
        let i = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      };
      Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      function wrtBigUInt64LE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        return offset;
      }
      function wrtBigUInt64BE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset + 7] = lo;
        lo = lo >> 8;
        buf[offset + 6] = lo;
        lo = lo >> 8;
        buf[offset + 5] = lo;
        lo = lo >> 8;
        buf[offset + 4] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset + 3] = hi;
        hi = hi >> 8;
        buf[offset + 2] = hi;
        hi = hi >> 8;
        buf[offset + 1] = hi;
        hi = hi >> 8;
        buf[offset] = hi;
        return offset + 8;
      }
      Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
        if (value < 0) value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      };
      Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0) value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer3.isBuffer(target)) throw new TypeError("argument should be a Buffer");
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start;
        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        if (end > this.length) end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      };
      Buffer3.prototype.fill = function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
              val = code;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val) val = 0;
        let i;
        if (typeof val === "number") {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }
        return this;
      };
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = class NodeError extends Base {
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        };
      }
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(name) {
          if (name) {
            return `${name} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function(name, actual) {
          return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function(str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      function checkBounds(buf, offset, byteLength2) {
        validateNumber(offset, "offset");
        if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
          boundsError(offset, buf.length - (byteLength2 + 1));
        }
      }
      function checkIntBI(value, min, max, buf, offset, byteLength2) {
        if (value > max || value < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength2 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf, offset, byteLength2);
      }
      function validateNumber(value, name) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
        }
      }
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value
        );
      }
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      function utf8ToBytes(string2, units) {
        units = units || Infinity;
        let codePoint;
        const length = string2.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i = 0; i < length; ++i) {
          codePoint = string2.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              } else if (i + 1 === length) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          byteArray.push(str.charCodeAt(i) & 255);
        }
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        let i;
        for (i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      var hexSliceLookupTable = (function() {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i = 0; i < 16; ++i) {
          const i16 = i * 16;
          for (let j2 = 0; j2 < 16; ++j2) {
            table[i16 + j2] = alphabet[i] + alphabet[j2];
          }
        }
        return table;
      })();
      function defineBigIntMethod(fn2) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn2;
      }
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
    }
  });

  // node_modules/valibot/dist/index.js
  var store;
  // @__NO_SIDE_EFFECTS__
  function getGlobalConfig(config2) {
    return {
      lang: config2?.lang ?? store?.lang,
      message: config2?.message,
      abortEarly: config2?.abortEarly ?? store?.abortEarly,
      abortPipeEarly: config2?.abortPipeEarly ?? store?.abortPipeEarly
    };
  }
  var store2;
  // @__NO_SIDE_EFFECTS__
  function getGlobalMessage(lang) {
    return store2?.get(lang);
  }
  var store3;
  // @__NO_SIDE_EFFECTS__
  function getSchemaMessage(lang) {
    return store3?.get(lang);
  }
  var store4;
  // @__NO_SIDE_EFFECTS__
  function getSpecificMessage(reference, lang) {
    return store4?.get(reference)?.get(lang);
  }
  // @__NO_SIDE_EFFECTS__
  function _stringify(input) {
    const type = typeof input;
    if (type === "string") {
      return `"${input}"`;
    }
    if (type === "number" || type === "bigint" || type === "boolean") {
      return `${input}`;
    }
    if (type === "object" || type === "function") {
      return (input && Object.getPrototypeOf(input)?.constructor?.name) ?? "null";
    }
    return type;
  }
  function _addIssue(context, label, dataset, config2, other) {
    const input = other && "input" in other ? other.input : dataset.value;
    const expected = other?.expected ?? context.expects ?? null;
    const received = other?.received ?? /* @__PURE__ */ _stringify(input);
    const issue = {
      kind: context.kind,
      type: context.type,
      input,
      expected,
      received,
      message: `Invalid ${label}: ${expected ? `Expected ${expected} but r` : "R"}eceived ${received}`,
      requirement: context.requirement,
      path: other?.path,
      issues: other?.issues,
      lang: config2.lang,
      abortEarly: config2.abortEarly,
      abortPipeEarly: config2.abortPipeEarly
    };
    const isSchema = context.kind === "schema";
    const message2 = other?.message ?? context.message ?? /* @__PURE__ */ getSpecificMessage(context.reference, issue.lang) ?? (isSchema ? /* @__PURE__ */ getSchemaMessage(issue.lang) : null) ?? config2.message ?? /* @__PURE__ */ getGlobalMessage(issue.lang);
    if (message2 !== void 0) {
      issue.message = typeof message2 === "function" ? (
        // @ts-expect-error
        message2(issue)
      ) : message2;
    }
    if (isSchema) {
      dataset.typed = false;
    }
    if (dataset.issues) {
      dataset.issues.push(issue);
    } else {
      dataset.issues = [issue];
    }
  }
  // @__NO_SIDE_EFFECTS__
  function _getStandardProps(context) {
    return {
      version: 1,
      vendor: "valibot",
      validate(value2) {
        return context["~run"]({ value: value2 }, /* @__PURE__ */ getGlobalConfig());
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function _isValidObjectKey(object2, key) {
    return Object.hasOwn(object2, key) && key !== "__proto__" && key !== "prototype" && key !== "constructor";
  }
  // @__NO_SIDE_EFFECTS__
  function _joinExpects(values2, separator) {
    const list = [...new Set(values2)];
    if (list.length > 1) {
      return `(${list.join(` ${separator} `)})`;
    }
    return list[0] ?? "never";
  }
  // @__NO_SIDE_EFFECTS__
  function check(requirement, message2) {
    return {
      kind: "validation",
      type: "check",
      reference: check,
      async: false,
      expects: null,
      requirement,
      message: message2,
      "~run"(dataset, config2) {
        if (dataset.typed && !this.requirement(dataset.value)) {
          _addIssue(this, "input", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function maxLength(requirement, message2) {
    return {
      kind: "validation",
      type: "max_length",
      reference: maxLength,
      async: false,
      expects: `<=${requirement}`,
      requirement,
      message: message2,
      "~run"(dataset, config2) {
        if (dataset.typed && dataset.value.length > this.requirement) {
          _addIssue(this, "length", dataset, config2, {
            received: `${dataset.value.length}`
          });
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function minLength(requirement, message2) {
    return {
      kind: "validation",
      type: "min_length",
      reference: minLength,
      async: false,
      expects: `>=${requirement}`,
      requirement,
      message: message2,
      "~run"(dataset, config2) {
        if (dataset.typed && dataset.value.length < this.requirement) {
          _addIssue(this, "length", dataset, config2, {
            received: `${dataset.value.length}`
          });
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function getFallback(schema, dataset, config2) {
    return typeof schema.fallback === "function" ? (
      // @ts-expect-error
      schema.fallback(dataset, config2)
    ) : (
      // @ts-expect-error
      schema.fallback
    );
  }
  // @__NO_SIDE_EFFECTS__
  function getDefault(schema, dataset, config2) {
    return typeof schema.default === "function" ? (
      // @ts-expect-error
      schema.default(dataset, config2)
    ) : (
      // @ts-expect-error
      schema.default
    );
  }
  // @__NO_SIDE_EFFECTS__
  function is(schema, input) {
    return !schema["~run"]({ value: input }, { abortEarly: true }).issues;
  }
  // @__NO_SIDE_EFFECTS__
  function array(item, message2) {
    return {
      kind: "schema",
      type: "array",
      reference: array,
      expects: "Array",
      async: false,
      item,
      message: message2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        const input = dataset.value;
        if (Array.isArray(input)) {
          dataset.typed = true;
          dataset.value = [];
          for (let key = 0; key < input.length; key++) {
            const value2 = input[key];
            const itemDataset = this.item["~run"]({ value: value2 }, config2);
            if (itemDataset.issues) {
              const pathItem = {
                type: "array",
                origin: "value",
                input,
                key,
                value: value2
              };
              for (const issue of itemDataset.issues) {
                if (issue.path) {
                  issue.path.unshift(pathItem);
                } else {
                  issue.path = [pathItem];
                }
                dataset.issues?.push(issue);
              }
              if (!dataset.issues) {
                dataset.issues = itemDataset.issues;
              }
              if (config2.abortEarly) {
                dataset.typed = false;
                break;
              }
            }
            if (!itemDataset.typed) {
              dataset.typed = false;
            }
            dataset.value.push(itemDataset.value);
          }
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function boolean(message2) {
    return {
      kind: "schema",
      type: "boolean",
      reference: boolean,
      expects: "boolean",
      async: false,
      message: message2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (typeof dataset.value === "boolean") {
          dataset.typed = true;
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function enum_(enum__, message2) {
    const options = [];
    for (const key in enum__) {
      if (`${+key}` !== key || typeof enum__[key] !== "string" || !Object.is(enum__[enum__[key]], +key)) {
        options.push(enum__[key]);
      }
    }
    return {
      kind: "schema",
      type: "enum",
      reference: enum_,
      expects: /* @__PURE__ */ _joinExpects(options.map(_stringify), "|"),
      async: false,
      enum: enum__,
      options,
      message: message2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (this.options.includes(dataset.value)) {
          dataset.typed = true;
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function literal(literal_, message2) {
    return {
      kind: "schema",
      type: "literal",
      reference: literal,
      expects: /* @__PURE__ */ _stringify(literal_),
      async: false,
      literal: literal_,
      message: message2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (dataset.value === this.literal) {
          dataset.typed = true;
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function looseObject(entries2, message2) {
    return {
      kind: "schema",
      type: "loose_object",
      reference: looseObject,
      expects: "Object",
      async: false,
      entries: entries2,
      message: message2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        const input = dataset.value;
        if (input && typeof input === "object") {
          dataset.typed = true;
          dataset.value = {};
          for (const key in this.entries) {
            const valueSchema = this.entries[key];
            if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && // @ts-expect-error
            valueSchema.default !== void 0) {
              const value2 = key in input ? (
                // @ts-expect-error
                input[key]
              ) : /* @__PURE__ */ getDefault(valueSchema);
              const valueDataset = valueSchema["~run"]({ value: value2 }, config2);
              if (valueDataset.issues) {
                const pathItem = {
                  type: "object",
                  origin: "value",
                  input,
                  key,
                  value: value2
                };
                for (const issue of valueDataset.issues) {
                  if (issue.path) {
                    issue.path.unshift(pathItem);
                  } else {
                    issue.path = [pathItem];
                  }
                  dataset.issues?.push(issue);
                }
                if (!dataset.issues) {
                  dataset.issues = valueDataset.issues;
                }
                if (config2.abortEarly) {
                  dataset.typed = false;
                  break;
                }
              }
              if (!valueDataset.typed) {
                dataset.typed = false;
              }
              dataset.value[key] = valueDataset.value;
            } else if (valueSchema.fallback !== void 0) {
              dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
            } else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
              _addIssue(this, "key", dataset, config2, {
                input: void 0,
                expected: `"${key}"`,
                path: [
                  {
                    type: "object",
                    origin: "key",
                    input,
                    key,
                    // @ts-expect-error
                    value: input[key]
                  }
                ]
              });
              if (config2.abortEarly) {
                break;
              }
            }
          }
          if (!dataset.issues || !config2.abortEarly) {
            for (const key in input) {
              if (/* @__PURE__ */ _isValidObjectKey(input, key) && !(key in this.entries)) {
                dataset.value[key] = input[key];
              }
            }
          }
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function nonOptional(wrapped, message2) {
    return {
      kind: "schema",
      type: "non_optional",
      reference: nonOptional,
      expects: "!undefined",
      async: false,
      wrapped,
      message: message2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (dataset.value !== void 0) {
          dataset = this.wrapped["~run"](dataset, config2);
        }
        if (dataset.value === void 0) {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function null_(message2) {
    return {
      kind: "schema",
      type: "null",
      reference: null_,
      expects: "null",
      async: false,
      message: message2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (dataset.value === null) {
          dataset.typed = true;
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function nullish(wrapped, default_) {
    return {
      kind: "schema",
      type: "nullish",
      reference: nullish,
      expects: `(${wrapped.expects} | null | undefined)`,
      async: false,
      wrapped,
      default: default_,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (dataset.value === null || dataset.value === void 0) {
          if (this.default !== void 0) {
            dataset.value = /* @__PURE__ */ getDefault(this, dataset, config2);
          }
          if (dataset.value === null || dataset.value === void 0) {
            dataset.typed = true;
            return dataset;
          }
        }
        return this.wrapped["~run"](dataset, config2);
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function number(message2) {
    return {
      kind: "schema",
      type: "number",
      reference: number,
      expects: "number",
      async: false,
      message: message2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (typeof dataset.value === "number" && !isNaN(dataset.value)) {
          dataset.typed = true;
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function object(entries2, message2) {
    return {
      kind: "schema",
      type: "object",
      reference: object,
      expects: "Object",
      async: false,
      entries: entries2,
      message: message2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        const input = dataset.value;
        if (input && typeof input === "object") {
          dataset.typed = true;
          dataset.value = {};
          for (const key in this.entries) {
            const valueSchema = this.entries[key];
            if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && // @ts-expect-error
            valueSchema.default !== void 0) {
              const value2 = key in input ? (
                // @ts-expect-error
                input[key]
              ) : /* @__PURE__ */ getDefault(valueSchema);
              const valueDataset = valueSchema["~run"]({ value: value2 }, config2);
              if (valueDataset.issues) {
                const pathItem = {
                  type: "object",
                  origin: "value",
                  input,
                  key,
                  value: value2
                };
                for (const issue of valueDataset.issues) {
                  if (issue.path) {
                    issue.path.unshift(pathItem);
                  } else {
                    issue.path = [pathItem];
                  }
                  dataset.issues?.push(issue);
                }
                if (!dataset.issues) {
                  dataset.issues = valueDataset.issues;
                }
                if (config2.abortEarly) {
                  dataset.typed = false;
                  break;
                }
              }
              if (!valueDataset.typed) {
                dataset.typed = false;
              }
              dataset.value[key] = valueDataset.value;
            } else if (valueSchema.fallback !== void 0) {
              dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
            } else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
              _addIssue(this, "key", dataset, config2, {
                input: void 0,
                expected: `"${key}"`,
                path: [
                  {
                    type: "object",
                    origin: "key",
                    input,
                    key,
                    // @ts-expect-error
                    value: input[key]
                  }
                ]
              });
              if (config2.abortEarly) {
                break;
              }
            }
          }
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function optional(wrapped, default_) {
    return {
      kind: "schema",
      type: "optional",
      reference: optional,
      expects: `(${wrapped.expects} | undefined)`,
      async: false,
      wrapped,
      default: default_,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (dataset.value === void 0) {
          if (this.default !== void 0) {
            dataset.value = /* @__PURE__ */ getDefault(this, dataset, config2);
          }
          if (dataset.value === void 0) {
            dataset.typed = true;
            return dataset;
          }
        }
        return this.wrapped["~run"](dataset, config2);
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function picklist(options, message2) {
    return {
      kind: "schema",
      type: "picklist",
      reference: picklist,
      expects: /* @__PURE__ */ _joinExpects(options.map(_stringify), "|"),
      async: false,
      options,
      message: message2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (this.options.includes(dataset.value)) {
          dataset.typed = true;
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function record(key, value2, message2) {
    return {
      kind: "schema",
      type: "record",
      reference: record,
      expects: "Object",
      async: false,
      key,
      value: value2,
      message: message2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        const input = dataset.value;
        if (input && typeof input === "object") {
          dataset.typed = true;
          dataset.value = {};
          for (const entryKey in input) {
            if (/* @__PURE__ */ _isValidObjectKey(input, entryKey)) {
              const entryValue = input[entryKey];
              const keyDataset = this.key["~run"]({ value: entryKey }, config2);
              if (keyDataset.issues) {
                const pathItem = {
                  type: "object",
                  origin: "key",
                  input,
                  key: entryKey,
                  value: entryValue
                };
                for (const issue of keyDataset.issues) {
                  issue.path = [pathItem];
                  dataset.issues?.push(issue);
                }
                if (!dataset.issues) {
                  dataset.issues = keyDataset.issues;
                }
                if (config2.abortEarly) {
                  dataset.typed = false;
                  break;
                }
              }
              const valueDataset = this.value["~run"](
                { value: entryValue },
                config2
              );
              if (valueDataset.issues) {
                const pathItem = {
                  type: "object",
                  origin: "value",
                  input,
                  key: entryKey,
                  value: entryValue
                };
                for (const issue of valueDataset.issues) {
                  if (issue.path) {
                    issue.path.unshift(pathItem);
                  } else {
                    issue.path = [pathItem];
                  }
                  dataset.issues?.push(issue);
                }
                if (!dataset.issues) {
                  dataset.issues = valueDataset.issues;
                }
                if (config2.abortEarly) {
                  dataset.typed = false;
                  break;
                }
              }
              if (!keyDataset.typed || !valueDataset.typed) {
                dataset.typed = false;
              }
              if (keyDataset.typed) {
                dataset.value[keyDataset.value] = valueDataset.value;
              }
            }
          }
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function string(message2) {
    return {
      kind: "schema",
      type: "string",
      reference: string,
      expects: "string",
      async: false,
      message: message2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (typeof dataset.value === "string") {
          dataset.typed = true;
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function _subIssues(datasets) {
    let issues;
    if (datasets) {
      for (const dataset of datasets) {
        if (issues) {
          issues.push(...dataset.issues);
        } else {
          issues = dataset.issues;
        }
      }
    }
    return issues;
  }
  // @__NO_SIDE_EFFECTS__
  function union(options, message2) {
    return {
      kind: "schema",
      type: "union",
      reference: union,
      expects: /* @__PURE__ */ _joinExpects(
        options.map((option) => option.expects),
        "|"
      ),
      async: false,
      options,
      message: message2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        let validDataset;
        let typedDatasets;
        let untypedDatasets;
        for (const schema of this.options) {
          const optionDataset = schema["~run"]({ value: dataset.value }, config2);
          if (optionDataset.typed) {
            if (optionDataset.issues) {
              if (typedDatasets) {
                typedDatasets.push(optionDataset);
              } else {
                typedDatasets = [optionDataset];
              }
            } else {
              validDataset = optionDataset;
              break;
            }
          } else {
            if (untypedDatasets) {
              untypedDatasets.push(optionDataset);
            } else {
              untypedDatasets = [optionDataset];
            }
          }
        }
        if (validDataset) {
          return validDataset;
        }
        if (typedDatasets) {
          if (typedDatasets.length === 1) {
            return typedDatasets[0];
          }
          _addIssue(this, "type", dataset, config2, {
            issues: /* @__PURE__ */ _subIssues(typedDatasets)
          });
          dataset.typed = true;
        } else if (untypedDatasets?.length === 1) {
          return untypedDatasets[0];
        } else {
          _addIssue(this, "type", dataset, config2, {
            issues: /* @__PURE__ */ _subIssues(untypedDatasets)
          });
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function unknown() {
    return {
      kind: "schema",
      type: "unknown",
      reference: unknown,
      expects: "unknown",
      async: false,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset) {
        dataset.typed = true;
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function variant(key, options, message2) {
    return {
      kind: "schema",
      type: "variant",
      reference: variant,
      expects: "Object",
      async: false,
      key,
      options,
      message: message2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        const input = dataset.value;
        if (input && typeof input === "object") {
          let outputDataset;
          let maxDiscriminatorPriority = 0;
          let invalidDiscriminatorKey = this.key;
          let expectedDiscriminators = [];
          const parseOptions = (variant2, allKeys) => {
            for (const schema of variant2.options) {
              if (schema.type === "variant") {
                parseOptions(schema, new Set(allKeys).add(schema.key));
              } else {
                let keysAreValid = true;
                let currentPriority = 0;
                for (const currentKey of allKeys) {
                  const discriminatorSchema = schema.entries[currentKey];
                  if (currentKey in input ? discriminatorSchema["~run"](
                    // @ts-expect-error
                    { typed: false, value: input[currentKey] },
                    { abortEarly: true }
                  ).issues : discriminatorSchema.type !== "exact_optional" && discriminatorSchema.type !== "optional" && discriminatorSchema.type !== "nullish") {
                    keysAreValid = false;
                    if (invalidDiscriminatorKey !== currentKey && (maxDiscriminatorPriority < currentPriority || maxDiscriminatorPriority === currentPriority && currentKey in input && !(invalidDiscriminatorKey in input))) {
                      maxDiscriminatorPriority = currentPriority;
                      invalidDiscriminatorKey = currentKey;
                      expectedDiscriminators = [];
                    }
                    if (invalidDiscriminatorKey === currentKey) {
                      expectedDiscriminators.push(
                        schema.entries[currentKey].expects
                      );
                    }
                    break;
                  }
                  currentPriority++;
                }
                if (keysAreValid) {
                  const optionDataset = schema["~run"]({ value: input }, config2);
                  if (!outputDataset || !outputDataset.typed && optionDataset.typed) {
                    outputDataset = optionDataset;
                  }
                }
              }
              if (outputDataset && !outputDataset.issues) {
                break;
              }
            }
          };
          parseOptions(this, /* @__PURE__ */ new Set([this.key]));
          if (outputDataset) {
            return outputDataset;
          }
          _addIssue(this, "type", dataset, config2, {
            // @ts-expect-error
            input: input[invalidDiscriminatorKey],
            expected: /* @__PURE__ */ _joinExpects(expectedDiscriminators, "|"),
            path: [
              {
                type: "object",
                origin: "value",
                input,
                key: invalidDiscriminatorKey,
                // @ts-expect-error
                value: input[invalidDiscriminatorKey]
              }
            ]
          });
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function omit(schema, keys) {
    const entries2 = {
      ...schema.entries
    };
    for (const key of keys) {
      delete entries2[key];
    }
    return {
      ...schema,
      entries: entries2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function pipe(...pipe2) {
    return {
      ...pipe2[0],
      pipe: pipe2,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        for (const item of pipe2) {
          if (item.kind !== "metadata") {
            if (dataset.issues && (item.kind === "schema" || item.kind === "transformation")) {
              dataset.typed = false;
              break;
            }
            if (!dataset.issues || !config2.abortEarly && !config2.abortPipeEarly) {
              dataset = item["~run"](dataset, config2);
            }
          }
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function unwrap(schema) {
    return schema.wrapped;
  }

  // node_modules/@sats-connect/core/dist/index.mjs
  var import_jsontokens = __toESM(require_lib2(), 1);

  // node_modules/axios/lib/helpers/bind.js
  function bind(fn2, thisArg) {
    return function wrap() {
      return fn2.apply(thisArg, arguments);
    };
  }

  // node_modules/axios/lib/utils.js
  var { toString } = Object.prototype;
  var { getPrototypeOf } = Object;
  var { iterator, toStringTag } = Symbol;
  var kindOf = /* @__PURE__ */ ((cache2) => (thing) => {
    const str = toString.call(thing);
    return cache2[str] || (cache2[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  var kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type;
  };
  var typeOfTest = (type) => (thing) => typeof thing === type;
  var { isArray } = Array;
  var isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  var isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  var isString = typeOfTest("string");
  var isFunction = typeOfTest("function");
  var isNumber = typeOfTest("number");
  var isObject = (thing) => thing !== null && typeof thing === "object";
  var isBoolean = (thing) => thing === true || thing === false;
  var isPlainObject = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype3 = getPrototypeOf(val);
    return (prototype3 === null || prototype3 === Object.prototype || Object.getPrototypeOf(prototype3) === null) && !(toStringTag in val) && !(iterator in val);
  };
  var isEmptyObject = (val) => {
    if (!isObject(val) || isBuffer(val)) {
      return false;
    }
    try {
      return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
    } catch (e) {
      return false;
    }
  };
  var isDate = kindOfTest("Date");
  var isFile = kindOfTest("File");
  var isBlob = kindOfTest("Blob");
  var isFileList = kindOfTest("FileList");
  var isStream = (val) => isObject(val) && isFunction(val.pipe);
  var isFormData = (thing) => {
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
  };
  var isURLSearchParams = kindOfTest("URLSearchParams");
  var [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
  var trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function forEach(obj, fn2, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i = 0, l = obj.length; i < l; i++) {
        fn2.call(null, obj[i], i, obj);
      }
    } else {
      if (isBuffer(obj)) {
        return;
      }
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        fn2.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    if (isBuffer(obj)) {
      return null;
    }
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  var _global = (() => {
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  var isContextDefined = (context) => !isUndefined(context) && context !== _global;
  function merge() {
    const { caseless, skipUndefined } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else {
        if (!skipUndefined || !isUndefined(val)) {
          result[targetKey] = val;
        }
      }
    };
    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
  }
  var extend = (a, b2, thisArg, { allOwnKeys } = {}) => {
    forEach(b2, (val, key) => {
      if (thisArg && isFunction(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, { allOwnKeys });
    return a;
  };
  var stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  var inherits = (constructor, superConstructor, props, descriptors2) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };
  var toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null) return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  var endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  var toArray = (thing) => {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  var isTypedArray = /* @__PURE__ */ ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  var forEachEntry = (obj, fn2) => {
    const generator = obj && obj[iterator];
    const _iterator = generator.call(obj);
    let result;
    while ((result = _iterator.next()) && !result.done) {
      const pair = result.value;
      fn2.call(obj, pair[0], pair[1]);
    }
  };
  var matchAll = (regExp, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  var isHTMLForm = kindOfTest("HTMLFormElement");
  var toCamelCase = (str) => {
    return str.toLowerCase().replace(
      /[-_\s]([a-z\d])(\w*)/g,
      function replacer(m2, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };
  var hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  var isRegExp = kindOfTest("RegExp");
  var reduceDescriptors = (obj, reducer) => {
    const descriptors2 = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors2, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  var freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
        return false;
      }
      const value = obj[name];
      if (!isFunction(value)) return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name + "'");
        };
      }
    });
  };
  var toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  var noop = () => {
  };
  var toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
  }
  var toJSONObject = (obj) => {
    const stack = new Array(10);
    const visit = (source, i) => {
      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }
        if (isBuffer(source)) {
          return source;
        }
        if (!("toJSON" in source)) {
          stack[i] = source;
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          stack[i] = void 0;
          return target;
        }
      }
      return source;
    };
    return visit(obj, 0);
  };
  var isAsyncFn = kindOfTest("AsyncFunction");
  var isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
  var _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token2, callbacks) => {
      _global.addEventListener("message", ({ source, data }) => {
        if (source === _global && data === token2) {
          callbacks.length && callbacks.shift()();
        }
      }, false);
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token2, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(
    typeof setImmediate === "function",
    isFunction(_global.postMessage)
  );
  var asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  var isIterable = (thing) => thing != null && isFunction(thing[iterator]);
  var utils_default = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isEmptyObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap,
    isIterable
  };

  // node_modules/axios/lib/core/AxiosError.js
  function AxiosError(message2, code, config, request2, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message2;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request2 && (this.request = request2);
    if (response) {
      this.response = response;
      this.status = response.status ? response.status : null;
    }
  }
  utils_default.inherits(AxiosError, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils_default.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  var prototype = AxiosError.prototype;
  var descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
    // eslint-disable-next-line func-names
  ].forEach((code) => {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError, descriptors);
  Object.defineProperty(prototype, "isAxiosError", { value: true });
  AxiosError.from = (error, code, config, request2, response, customProps) => {
    const axiosError = Object.create(prototype);
    utils_default.toFlatObject(error, axiosError, function filter2(obj) {
      return obj !== Error.prototype;
    }, (prop) => {
      return prop !== "isAxiosError";
    });
    const msg = error && error.message ? error.message : "Error";
    const errCode = code == null && error ? error.code : code;
    AxiosError.call(axiosError, msg, errCode, config, request2, response);
    if (error && axiosError.cause == null) {
      Object.defineProperty(axiosError, "cause", { value: error, configurable: true });
    }
    axiosError.name = error && error.name || "Error";
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  var AxiosError_default = AxiosError;

  // node_modules/axios/lib/helpers/null.js
  var null_default = null;

  // node_modules/axios/lib/helpers/toFormData.js
  function isVisitable(thing) {
    return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
  }
  function removeBrackets(key) {
    return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token2, i) {
      token2 = removeBrackets(token2);
      return !dots && i ? "[" + token2 + "]" : token2;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils_default.isArray(arr) && !arr.some(isVisitable);
  }
  var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData(obj, formData, options) {
    if (!utils_default.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new (null_default || FormData)();
    options = utils_default.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      return !utils_default.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
    if (!utils_default.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null) return "";
      if (utils_default.isDate(value)) {
        return value.toISOString();
      }
      if (utils_default.isBoolean(value)) {
        return value.toString();
      }
      if (!useBlob && utils_default.isBlob(value)) {
        throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
      }
      if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (value && !path && typeof value === "object") {
        if (utils_default.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils_default.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build(value, path) {
      if (utils_default.isUndefined(value)) return;
      if (stack.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils_default.forEach(value, function each(el, key) {
        const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(
          formData,
          el,
          utils_default.isString(key) ? key.trim() : key,
          path,
          exposedHelpers
        );
        if (result === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });
      stack.pop();
    }
    if (!utils_default.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
  }
  var toFormData_default = toFormData;

  // node_modules/axios/lib/helpers/AxiosURLSearchParams.js
  function encode(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData_default(params, this, options);
  }
  var prototype2 = AxiosURLSearchParams.prototype;
  prototype2.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype2.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode);
    } : encode;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  var AxiosURLSearchParams_default = AxiosURLSearchParams;

  // node_modules/axios/lib/helpers/buildURL.js
  function encode2(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
  }
  function buildURL(url, params, options) {
    if (!params) {
      return url;
    }
    const _encode = options && options.encode || encode2;
    if (utils_default.isFunction(options)) {
      options = {
        serialize: options
      };
    }
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }

  // node_modules/axios/lib/core/InterceptorManager.js
  var InterceptorManager = class {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn2) {
      utils_default.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn2(h);
        }
      });
    }
  };
  var InterceptorManager_default = InterceptorManager;

  // node_modules/axios/lib/defaults/transitional.js
  var transitional_default = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };

  // node_modules/axios/lib/platform/browser/classes/URLSearchParams.js
  var URLSearchParams_default = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams_default;

  // node_modules/axios/lib/platform/browser/classes/FormData.js
  var FormData_default = typeof FormData !== "undefined" ? FormData : null;

  // node_modules/axios/lib/platform/browser/classes/Blob.js
  var Blob_default = typeof Blob !== "undefined" ? Blob : null;

  // node_modules/axios/lib/platform/browser/index.js
  var browser_default = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams_default,
      FormData: FormData_default,
      Blob: Blob_default
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };

  // node_modules/axios/lib/platform/common/utils.js
  var utils_exports = {};
  __export(utils_exports, {
    hasBrowserEnv: () => hasBrowserEnv,
    hasStandardBrowserEnv: () => hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
    navigator: () => _navigator,
    origin: () => origin
  });
  var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  var _navigator = typeof navigator === "object" && navigator || void 0;
  var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
  var hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  var origin = hasBrowserEnv && window.location.href || "http://localhost";

  // node_modules/axios/lib/platform/index.js
  var platform_default = {
    ...utils_exports,
    ...browser_default
  };

  // node_modules/axios/lib/helpers/toURLEncodedForm.js
  function toURLEncodedForm(data, options) {
    return toFormData_default(data, new platform_default.classes.URLSearchParams(), {
      visitor: function(value, key, path, helpers) {
        if (platform_default.isNode && utils_default.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      },
      ...options
    });
  }

  // node_modules/axios/lib/helpers/formDataToJSON.js
  function parsePropPath(name) {
    return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
      return match[0] === "[]" ? "" : match[1] || match[0];
    });
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name = path[index++];
      if (name === "__proto__") return true;
      const isNumericKey = Number.isFinite(+name);
      const isLast = index >= path.length;
      name = !name && utils_default.isArray(target) ? target.length : name;
      if (isLast) {
        if (utils_default.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }
        return !isNumericKey;
      }
      if (!target[name] || !utils_default.isObject(target[name])) {
        target[name] = [];
      }
      const result = buildPath(path, value, target[name], index);
      if (result && utils_default.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }
      return !isNumericKey;
    }
    if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
      const obj = {};
      utils_default.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  var formDataToJSON_default = formDataToJSON;

  // node_modules/axios/lib/defaults/index.js
  function stringifySafely(rawValue, parser, encoder) {
    if (utils_default.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils_default.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  var defaults = {
    transitional: transitional_default,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [function transformRequest(data, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils_default.isObject(data);
      if (isObjectPayload && utils_default.isHTMLForm(data)) {
        data = new FormData(data);
      }
      const isFormData2 = utils_default.isFormData(data);
      if (isFormData2) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
      }
      if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data) || utils_default.isReadableStream(data)) {
        return data;
      }
      if (utils_default.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils_default.isURLSearchParams(data)) {
        headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
        return data.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }
        if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
          const _FormData = this.env && this.env.FormData;
          return toFormData_default(
            isFileList2 ? { "files[]": data } : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      const transitional2 = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (utils_default.isResponse(data) || utils_default.isReadableStream(data)) {
        return data;
      }
      if (data && utils_default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
        const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data, this.parseReviver);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }
      return data;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform_default.classes.FormData,
      Blob: platform_default.classes.Blob
    },
    validateStatus: function validateStatus(status2) {
      return status2 >= 200 && status2 < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils_default.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults.headers[method] = {};
  });
  var defaults_default = defaults;

  // node_modules/axios/lib/helpers/parseHeaders.js
  var ignoreDuplicateOf = utils_default.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]);
  var parseHeaders_default = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
      i = line.indexOf(":");
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };

  // node_modules/axios/lib/core/AxiosHeaders.js
  var $internals = /* @__PURE__ */ Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils_default.isArray(value) ? value.map(normalizeValue) : String(value);
  }
  function parseTokens(str) {
    const tokens = /* @__PURE__ */ Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
    if (utils_default.isFunction(filter2)) {
      return filter2.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils_default.isString(value)) return;
    if (utils_default.isString(filter2)) {
      return value.indexOf(filter2) !== -1;
    }
    if (utils_default.isRegExp(filter2)) {
      return filter2.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w2, char, str) => {
      return char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils_default.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  var AxiosHeaders = class {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils_default.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils_default.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders_default(header), valueOrRewrite);
      } else if (utils_default.isObject(header) && utils_default.isIterable(header)) {
        let obj = {}, dest, key;
        for (const entry of header) {
          if (!utils_default.isArray(entry)) {
            throw TypeError("Object iterator must return a key-value pair");
          }
          obj[key = entry[0]] = (dest = obj[key]) ? utils_default.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
        }
        setHeaders(obj, valueOrRewrite);
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils_default.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils_default.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils_default.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils_default.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils_default.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils_default.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;
      while (i--) {
        const key = keys[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils_default.forEach(this, (value, header) => {
        const key = utils_default.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = /* @__PURE__ */ Object.create(null);
      utils_default.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed = new this(first);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype3 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype3, _header);
          accessors[lHeader] = true;
        }
      }
      utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  };
  AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
  utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils_default.freezeMethods(AxiosHeaders);
  var AxiosHeaders_default = AxiosHeaders;

  // node_modules/axios/lib/core/transformData.js
  function transformData(fns, response) {
    const config = this || defaults_default;
    const context = response || config;
    const headers = AxiosHeaders_default.from(context.headers);
    let data = context.data;
    utils_default.forEach(fns, function transform(fn2) {
      data = fn2.call(config, data, headers.normalize(), response ? response.status : void 0);
    });
    headers.normalize();
    return data;
  }

  // node_modules/axios/lib/cancel/isCancel.js
  function isCancel(value) {
    return !!(value && value.__CANCEL__);
  }

  // node_modules/axios/lib/cancel/CanceledError.js
  function CanceledError(message2, config, request2) {
    AxiosError_default.call(this, message2 == null ? "canceled" : message2, AxiosError_default.ERR_CANCELED, config, request2);
    this.name = "CanceledError";
  }
  utils_default.inherits(CanceledError, AxiosError_default, {
    __CANCEL__: true
  });
  var CanceledError_default = CanceledError;

  // node_modules/axios/lib/core/settle.js
  function settle(resolve, reject, response) {
    const validateStatus2 = response.config.validateStatus;
    if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError_default(
        "Request failed with status code " + response.status,
        [AxiosError_default.ERR_BAD_REQUEST, AxiosError_default.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }

  // node_modules/axios/lib/helpers/parseProtocol.js
  function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
  }

  // node_modules/axios/lib/helpers/speedometer.js
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== void 0 ? min : 1e3;
    return function push(chunkLength) {
      const now = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now;
      let i = tail;
      let bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now - firstSampleTS < min) {
        return;
      }
      const passed = startedAt && now - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  var speedometer_default = speedometer;

  // node_modules/axios/lib/helpers/throttle.js
  function throttle(fn2, freq) {
    let timestamp = 0;
    let threshold = 1e3 / freq;
    let lastArgs;
    let timer;
    const invoke = (args, now = Date.now()) => {
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn2(...args);
    };
    const throttled = (...args) => {
      const now = Date.now();
      const passed = now - timestamp;
      if (passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };
    const flush = () => lastArgs && invoke(lastArgs);
    return [throttled, flush];
  }
  var throttle_default = throttle;

  // node_modules/axios/lib/helpers/progressEventReducer.js
  var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer_default(50, 250);
    return throttle_default((e) => {
      const loaded = e.loaded;
      const total = e.lengthComputable ? e.total : void 0;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;
      bytesNotified = loaded;
      const data = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
        event: e,
        lengthComputable: total != null,
        [isDownloadStream ? "download" : "upload"]: true
      };
      listener(data);
    }, freq);
  };
  var progressEventDecorator = (total, throttled) => {
    const lengthComputable = total != null;
    return [(loaded) => throttled[0]({
      lengthComputable,
      total,
      loaded
    }), throttled[1]];
  };
  var asyncDecorator = (fn2) => (...args) => utils_default.asap(() => fn2(...args));

  // node_modules/axios/lib/helpers/isURLSameOrigin.js
  var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
    url = new URL(url, platform_default.origin);
    return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
  })(
    new URL(platform_default.origin),
    platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)
  ) : () => true;

  // node_modules/axios/lib/helpers/cookies.js
  var cookies_default = platform_default.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure) {
        const cookie = [name + "=" + encodeURIComponent(value)];
        utils_default.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
        utils_default.isString(path) && cookie.push("path=" + path);
        utils_default.isString(domain) && cookie.push("domain=" + domain);
        secure === true && cookie.push("secure");
        document.cookie = cookie.join("; ");
      },
      read(name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );

  // node_modules/axios/lib/helpers/isAbsoluteURL.js
  function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }

  // node_modules/axios/lib/helpers/combineURLs.js
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }

  // node_modules/axios/lib/core/buildFullPath.js
  function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
    let isRelativeUrl = !isAbsoluteURL(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }

  // node_modules/axios/lib/core/mergeConfig.js
  var headersToObject = (thing) => thing instanceof AxiosHeaders_default ? { ...thing } : thing;
  function mergeConfig(config1, config2) {
    config2 = config2 || {};
    const config = {};
    function getMergedValue(target, source, prop, caseless) {
      if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
        return utils_default.merge.call({ caseless }, target, source);
      } else if (utils_default.isPlainObject(source)) {
        return utils_default.merge({}, source);
      } else if (utils_default.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a, b2, prop, caseless) {
      if (!utils_default.isUndefined(b2)) {
        return getMergedValue(a, b2, prop, caseless);
      } else if (!utils_default.isUndefined(a)) {
        return getMergedValue(void 0, a, prop, caseless);
      }
    }
    function valueFromConfig2(a, b2) {
      if (!utils_default.isUndefined(b2)) {
        return getMergedValue(void 0, b2);
      }
    }
    function defaultToConfig2(a, b2) {
      if (!utils_default.isUndefined(b2)) {
        return getMergedValue(void 0, b2);
      } else if (!utils_default.isUndefined(a)) {
        return getMergedValue(void 0, a);
      }
    }
    function mergeDirectKeys(a, b2, prop) {
      if (prop in config2) {
        return getMergedValue(a, b2);
      } else if (prop in config1) {
        return getMergedValue(void 0, a);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b2, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b2), prop, true)
    };
    utils_default.forEach(Object.keys({ ...config1, ...config2 }), function computeConfigValue(prop) {
      const merge2 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge2(config1[prop], config2[prop], prop);
      utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  }

  // node_modules/axios/lib/helpers/resolveConfig.js
  var resolveConfig_default = (config) => {
    const newConfig = mergeConfig({}, config);
    let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
    newConfig.headers = headers = AxiosHeaders_default.from(headers);
    newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
    if (auth) {
      headers.set(
        "Authorization",
        "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
      );
    }
    if (utils_default.isFormData(data)) {
      if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(void 0);
      } else if (utils_default.isFunction(data.getHeaders)) {
        const formHeaders = data.getHeaders();
        const allowedHeaders = ["content-type", "content-length"];
        Object.entries(formHeaders).forEach(([key, val]) => {
          if (allowedHeaders.includes(key.toLowerCase())) {
            headers.set(key, val);
          }
        });
      }
    }
    if (platform_default.hasStandardBrowserEnv) {
      withXSRFToken && utils_default.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
      if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin_default(newConfig.url)) {
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }
    return newConfig;
  };

  // node_modules/axios/lib/adapters/xhr.js
  var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  var xhr_default = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig_default(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders_default.from(_config.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
        _config.signal && _config.signal.removeEventListener("abort", onCanceled);
      }
      let request2 = new XMLHttpRequest();
      request2.open(_config.method.toUpperCase(), _config.url, true);
      request2.timeout = _config.timeout;
      function onloadend() {
        if (!request2) {
          return;
        }
        const responseHeaders = AxiosHeaders_default.from(
          "getAllResponseHeaders" in request2 && request2.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request2.responseText : request2.response;
        const response = {
          data: responseData,
          status: request2.status,
          statusText: request2.statusText,
          headers: responseHeaders,
          config,
          request: request2
        };
        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);
        request2 = null;
      }
      if ("onloadend" in request2) {
        request2.onloadend = onloadend;
      } else {
        request2.onreadystatechange = function handleLoad() {
          if (!request2 || request2.readyState !== 4) {
            return;
          }
          if (request2.status === 0 && !(request2.responseURL && request2.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request2.onabort = function handleAbort() {
        if (!request2) {
          return;
        }
        reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request2));
        request2 = null;
      };
      request2.onerror = function handleError(event) {
        const msg = event && event.message ? event.message : "Network Error";
        const err = new AxiosError_default(msg, AxiosError_default.ERR_NETWORK, config, request2);
        err.event = event || null;
        reject(err);
        request2 = null;
      };
      request2.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional2 = _config.transitional || transitional_default;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(new AxiosError_default(
          timeoutErrorMessage,
          transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
          config,
          request2
        ));
        request2 = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request2) {
        utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request2.setRequestHeader(key, val);
        });
      }
      if (!utils_default.isUndefined(_config.withCredentials)) {
        request2.withCredentials = !!_config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request2.responseType = _config.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request2.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request2.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request2.upload.addEventListener("progress", uploadThrottled);
        request2.upload.addEventListener("loadend", flushUpload);
      }
      if (_config.cancelToken || _config.signal) {
        onCanceled = (cancel) => {
          if (!request2) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError_default(null, config, request2) : cancel);
          request2.abort();
          request2 = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config.url);
      if (protocol && platform_default.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config));
        return;
      }
      request2.send(requestData || null);
    });
  };

  // node_modules/axios/lib/helpers/composeSignals.js
  var composeSignals = (signals, timeout) => {
    const { length } = signals = signals ? signals.filter(Boolean) : [];
    if (timeout || length) {
      let controller = new AbortController();
      let aborted;
      const onabort = function(reason) {
        if (!aborted) {
          aborted = true;
          unsubscribe();
          const err = reason instanceof Error ? reason : this.reason;
          controller.abort(err instanceof AxiosError_default ? err : new CanceledError_default(err instanceof Error ? err.message : err));
        }
      };
      let timer = timeout && setTimeout(() => {
        timer = null;
        onabort(new AxiosError_default(`timeout ${timeout} of ms exceeded`, AxiosError_default.ETIMEDOUT));
      }, timeout);
      const unsubscribe = () => {
        if (signals) {
          timer && clearTimeout(timer);
          timer = null;
          signals.forEach((signal2) => {
            signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
          });
          signals = null;
        }
      };
      signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
      const { signal } = controller;
      signal.unsubscribe = () => utils_default.asap(unsubscribe);
      return signal;
    }
  };
  var composeSignals_default = composeSignals;

  // node_modules/axios/lib/helpers/trackStream.js
  var streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;
    if (!chunkSize || len < chunkSize) {
      yield chunk;
      return;
    }
    let pos = 0;
    let end;
    while (pos < len) {
      end = pos + chunkSize;
      yield chunk.slice(pos, end);
      pos = end;
    }
  };
  var readBytes = async function* (iterable, chunkSize) {
    for await (const chunk of readStream(iterable)) {
      yield* streamChunk(chunk, chunkSize);
    }
  };
  var readStream = async function* (stream) {
    if (stream[Symbol.asyncIterator]) {
      yield* stream;
      return;
    }
    const reader = stream.getReader();
    try {
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        yield value;
      }
    } finally {
      await reader.cancel();
    }
  };
  var trackStream = (stream, chunkSize, onProgress, onFinish) => {
    const iterator2 = readBytes(stream, chunkSize);
    let bytes = 0;
    let done;
    let _onFinish = (e) => {
      if (!done) {
        done = true;
        onFinish && onFinish(e);
      }
    };
    return new ReadableStream({
      async pull(controller) {
        try {
          const { done: done2, value } = await iterator2.next();
          if (done2) {
            _onFinish();
            controller.close();
            return;
          }
          let len = value.byteLength;
          if (onProgress) {
            let loadedBytes = bytes += len;
            onProgress(loadedBytes);
          }
          controller.enqueue(new Uint8Array(value));
        } catch (err) {
          _onFinish(err);
          throw err;
        }
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator2.return();
      }
    }, {
      highWaterMark: 2
    });
  };

  // node_modules/axios/lib/adapters/fetch.js
  var DEFAULT_CHUNK_SIZE = 64 * 1024;
  var { isFunction: isFunction2 } = utils_default;
  var globalFetchAPI = (({ fetch: fetch2, Request, Response }) => ({
    fetch: fetch2,
    Request,
    Response
  }))(utils_default.global);
  var {
    ReadableStream: ReadableStream2,
    TextEncoder: TextEncoder2
  } = utils_default.global;
  var test = (fn2, ...args) => {
    try {
      return !!fn2(...args);
    } catch (e) {
      return false;
    }
  };
  var factory = (env) => {
    const { fetch: fetch2, Request, Response } = Object.assign({}, globalFetchAPI, env);
    const isFetchSupported = isFunction2(fetch2);
    const isRequestSupported = isFunction2(Request);
    const isResponseSupported = isFunction2(Response);
    if (!isFetchSupported) {
      return false;
    }
    const isReadableStreamSupported = isFetchSupported && isFunction2(ReadableStream2);
    const encodeText = isFetchSupported && (typeof TextEncoder2 === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder2()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
    const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
      let duplexAccessed = false;
      const hasContentType = new Request(platform_default.origin, {
        body: new ReadableStream2(),
        method: "POST",
        get duplex() {
          duplexAccessed = true;
          return "half";
        }
      }).headers.has("Content-Type");
      return duplexAccessed && !hasContentType;
    });
    const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils_default.isReadableStream(new Response("").body));
    const resolvers = {
      stream: supportsResponseStream && ((res) => res.body)
    };
    isFetchSupported && (() => {
      ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
        !resolvers[type] && (resolvers[type] = (res, config) => {
          let method = res && res[type];
          if (method) {
            return method.call(res);
          }
          throw new AxiosError_default(`Response type '${type}' is not supported`, AxiosError_default.ERR_NOT_SUPPORT, config);
        });
      });
    })();
    const getBodyLength = async (body) => {
      if (body == null) {
        return 0;
      }
      if (utils_default.isBlob(body)) {
        return body.size;
      }
      if (utils_default.isSpecCompliantForm(body)) {
        const _request = new Request(platform_default.origin, {
          method: "POST",
          body
        });
        return (await _request.arrayBuffer()).byteLength;
      }
      if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) {
        return body.byteLength;
      }
      if (utils_default.isURLSearchParams(body)) {
        body = body + "";
      }
      if (utils_default.isString(body)) {
        return (await encodeText(body)).byteLength;
      }
    };
    const resolveBodyLength = async (headers, body) => {
      const length = utils_default.toFiniteNumber(headers.getContentLength());
      return length == null ? getBodyLength(body) : length;
    };
    return async (config) => {
      let {
        url,
        method,
        data,
        signal,
        cancelToken,
        timeout,
        onDownloadProgress,
        onUploadProgress,
        responseType,
        headers,
        withCredentials = "same-origin",
        fetchOptions
      } = resolveConfig_default(config);
      responseType = responseType ? (responseType + "").toLowerCase() : "text";
      let composedSignal = composeSignals_default([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
      let request2 = null;
      const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
        composedSignal.unsubscribe();
      });
      let requestContentLength;
      try {
        if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
          let _request = new Request(url, {
            method: "POST",
            body: data,
            duplex: "half"
          });
          let contentTypeHeader;
          if (utils_default.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
            headers.setContentType(contentTypeHeader);
          }
          if (_request.body) {
            const [onProgress, flush] = progressEventDecorator(
              requestContentLength,
              progressEventReducer(asyncDecorator(onUploadProgress))
            );
            data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
          }
        }
        if (!utils_default.isString(withCredentials)) {
          withCredentials = withCredentials ? "include" : "omit";
        }
        const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
        const resolvedOptions = {
          ...fetchOptions,
          signal: composedSignal,
          method: method.toUpperCase(),
          headers: headers.normalize().toJSON(),
          body: data,
          duplex: "half",
          credentials: isCredentialsSupported ? withCredentials : void 0
        };
        request2 = isRequestSupported && new Request(url, resolvedOptions);
        let response = await (isRequestSupported ? fetch2(request2, fetchOptions) : fetch2(url, resolvedOptions));
        const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
        if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
          const options = {};
          ["status", "statusText", "headers"].forEach((prop) => {
            options[prop] = response[prop];
          });
          const responseContentLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
          const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
            responseContentLength,
            progressEventReducer(asyncDecorator(onDownloadProgress), true)
          ) || [];
          response = new Response(
            trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
              flush && flush();
              unsubscribe && unsubscribe();
            }),
            options
          );
        }
        responseType = responseType || "text";
        let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](response, config);
        !isStreamResponse && unsubscribe && unsubscribe();
        return await new Promise((resolve, reject) => {
          settle(resolve, reject, {
            data: responseData,
            headers: AxiosHeaders_default.from(response.headers),
            status: response.status,
            statusText: response.statusText,
            config,
            request: request2
          });
        });
      } catch (err) {
        unsubscribe && unsubscribe();
        if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
          throw Object.assign(
            new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request2),
            {
              cause: err.cause || err
            }
          );
        }
        throw AxiosError_default.from(err, err && err.code, config, request2);
      }
    };
  };
  var seedCache = /* @__PURE__ */ new Map();
  var getFetch = (config) => {
    let env = utils_default.merge.call({
      skipUndefined: true
    }, globalFetchAPI, config ? config.env : null);
    const { fetch: fetch2, Request, Response } = env;
    const seeds = [
      Request,
      Response,
      fetch2
    ];
    let len = seeds.length, i = len, seed, target, map = seedCache;
    while (i--) {
      seed = seeds[i];
      target = map.get(seed);
      target === void 0 && map.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
      map = target;
    }
    return target;
  };
  var adapter = getFetch();

  // node_modules/axios/lib/adapters/adapters.js
  var knownAdapters = {
    http: null_default,
    xhr: xhr_default,
    fetch: {
      get: getFetch
    }
  };
  utils_default.forEach(knownAdapters, (fn2, value) => {
    if (fn2) {
      try {
        Object.defineProperty(fn2, "name", { value });
      } catch (e) {
      }
      Object.defineProperty(fn2, "adapterName", { value });
    }
  });
  var renderReason = (reason) => `- ${reason}`;
  var isResolvedHandle = (adapter2) => utils_default.isFunction(adapter2) || adapter2 === null || adapter2 === false;
  var adapters_default = {
    getAdapter: (adapters, config) => {
      adapters = utils_default.isArray(adapters) ? adapters : [adapters];
      const { length } = adapters;
      let nameOrAdapter;
      let adapter2;
      const rejectedReasons = {};
      for (let i = 0; i < length; i++) {
        nameOrAdapter = adapters[i];
        let id;
        adapter2 = nameOrAdapter;
        if (!isResolvedHandle(nameOrAdapter)) {
          adapter2 = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
          if (adapter2 === void 0) {
            throw new AxiosError_default(`Unknown adapter '${id}'`);
          }
        }
        if (adapter2 && (utils_default.isFunction(adapter2) || (adapter2 = adapter2.get(config)))) {
          break;
        }
        rejectedReasons[id || "#" + i] = adapter2;
      }
      if (!adapter2) {
        const reasons = Object.entries(rejectedReasons).map(
          ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
        );
        let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
        throw new AxiosError_default(
          `There is no suitable adapter to dispatch the request ` + s,
          "ERR_NOT_SUPPORT"
        );
      }
      return adapter2;
    },
    adapters: knownAdapters
  };

  // node_modules/axios/lib/core/dispatchRequest.js
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError_default(null, config);
    }
  }
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = AxiosHeaders_default.from(config.headers);
    config.data = transformData.call(
      config,
      config.transformRequest
    );
    if (["post", "put", "patch"].indexOf(config.method) !== -1) {
      config.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter2 = adapters_default.getAdapter(config.adapter || defaults_default.adapter, config);
    return adapter2(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData.call(
        config,
        config.transformResponse,
        response
      );
      response.headers = AxiosHeaders_default.from(response.headers);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    });
  }

  // node_modules/axios/lib/env/data.js
  var VERSION = "1.12.0";

  // node_modules/axios/lib/helpers/validator.js
  var validators = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
    validators[type] = function validator(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  var deprecatedWarnings = {};
  validators.transitional = function transitional(validator, version, message2) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message2 ? ". " + message2 : "");
    }
    return (value, opt, opts) => {
      if (validator === false) {
        throw new AxiosError_default(
          formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
          AxiosError_default.ERR_DEPRECATED
        );
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version + " and will be removed in the near future"
          )
        );
      }
      return validator ? validator(value, opt, opts) : true;
    };
  };
  validators.spelling = function spelling(correctSpelling) {
    return (value, opt) => {
      console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
      return true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator = schema[opt];
      if (validator) {
        const value = options[opt];
        const result = value === void 0 || validator(value, opt, options);
        if (result !== true) {
          throw new AxiosError_default("option " + opt + " must be " + result, AxiosError_default.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
      }
    }
  }
  var validator_default = {
    assertOptions,
    validators
  };

  // node_modules/axios/lib/core/Axios.js
  var validators2 = validator_default.validators;
  var Axios = class {
    constructor(instanceConfig) {
      this.defaults = instanceConfig || {};
      this.interceptors = {
        request: new InterceptorManager_default(),
        response: new InterceptorManager_default()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    async request(configOrUrl, config) {
      try {
        return await this._request(configOrUrl, config);
      } catch (err) {
        if (err instanceof Error) {
          let dummy = {};
          Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
          const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
          try {
            if (!err.stack) {
              err.stack = stack;
            } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
              err.stack += "\n" + stack;
            }
          } catch (e) {
          }
        }
        throw err;
      }
    }
    _request(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig(this.defaults, config);
      const { transitional: transitional2, paramsSerializer, headers } = config;
      if (transitional2 !== void 0) {
        validator_default.assertOptions(transitional2, {
          silentJSONParsing: validators2.transitional(validators2.boolean),
          forcedJSONParsing: validators2.transitional(validators2.boolean),
          clarifyTimeoutError: validators2.transitional(validators2.boolean)
        }, false);
      }
      if (paramsSerializer != null) {
        if (utils_default.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator_default.assertOptions(paramsSerializer, {
            encode: validators2.function,
            serialize: validators2.function
          }, true);
        }
      }
      if (config.allowAbsoluteUrls !== void 0) {
      } else if (this.defaults.allowAbsoluteUrls !== void 0) {
        config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
      } else {
        config.allowAbsoluteUrls = true;
      }
      validator_default.assertOptions(config, {
        baseUrl: validators2.spelling("baseURL"),
        withXsrfToken: validators2.spelling("withXSRFToken")
      }, true);
      config.method = (config.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils_default.merge(
        headers.common,
        headers[config.method]
      );
      headers && utils_default.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        }
      );
      config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      let promise;
      let i = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift(...requestInterceptorChain);
        chain.push(...responseInterceptorChain);
        len = chain.length;
        promise = Promise.resolve(config);
        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }
        return promise;
      }
      len = requestInterceptorChain.length;
      let newConfig = config;
      i = 0;
      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected.call(this, error);
          break;
        }
      }
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      i = 0;
      len = responseInterceptorChain.length;
      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }
      return promise;
    }
    getUri(config) {
      config = mergeConfig(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  };
  utils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils_default.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data
        }));
      };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  var Axios_default = Axios;

  // node_modules/axios/lib/cancel/CancelToken.js
  var CancelToken = class _CancelToken {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      const token2 = this;
      this.promise.then((cancel) => {
        if (!token2._listeners) return;
        let i = token2._listeners.length;
        while (i-- > 0) {
          token2._listeners[i](cancel);
        }
        token2._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise = new Promise((resolve) => {
          token2.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token2.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message2, config, request2) {
        if (token2.reason) {
          return;
        }
        token2.reason = new CanceledError_default(message2, config, request2);
        resolvePromise(token2.reason);
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }
    toAbortSignal() {
      const controller = new AbortController();
      const abort = (err) => {
        controller.abort(err);
      };
      this.subscribe(abort);
      controller.signal.unsubscribe = () => this.unsubscribe(abort);
      return controller.signal;
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token2 = new _CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token2,
        cancel
      };
    }
  };
  var CancelToken_default = CancelToken;

  // node_modules/axios/lib/helpers/spread.js
  function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }

  // node_modules/axios/lib/helpers/isAxiosError.js
  function isAxiosError(payload) {
    return utils_default.isObject(payload) && payload.isAxiosError === true;
  }

  // node_modules/axios/lib/helpers/HttpStatusCode.js
  var HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
  };
  Object.entries(HttpStatusCode).forEach(([key, value]) => {
    HttpStatusCode[value] = key;
  });
  var HttpStatusCode_default = HttpStatusCode;

  // node_modules/axios/lib/axios.js
  function createInstance(defaultConfig) {
    const context = new Axios_default(defaultConfig);
    const instance = bind(Axios_default.prototype.request, context);
    utils_default.extend(instance, Axios_default.prototype, context, { allOwnKeys: true });
    utils_default.extend(instance, context, null, { allOwnKeys: true });
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance;
  }
  var axios = createInstance(defaults_default);
  axios.Axios = Axios_default;
  axios.CanceledError = CanceledError_default;
  axios.CancelToken = CancelToken_default;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION;
  axios.toFormData = toFormData_default;
  axios.AxiosError = AxiosError_default;
  axios.Cancel = axios.CanceledError;
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;
  axios.isAxiosError = isAxiosError;
  axios.mergeConfig = mergeConfig;
  axios.AxiosHeaders = AxiosHeaders_default;
  axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters_default.getAdapter;
  axios.HttpStatusCode = HttpStatusCode_default;
  axios.default = axios;
  var axios_default = axios;

  // node_modules/axios/index.js
  var {
    Axios: Axios2,
    AxiosError: AxiosError2,
    CanceledError: CanceledError2,
    isCancel: isCancel2,
    CancelToken: CancelToken2,
    VERSION: VERSION2,
    all: all2,
    Cancel,
    isAxiosError: isAxiosError2,
    spread: spread2,
    toFormData: toFormData2,
    AxiosHeaders: AxiosHeaders2,
    HttpStatusCode: HttpStatusCode2,
    formToJSON,
    getAdapter,
    mergeConfig: mergeConfig2
  } = axios_default;

  // node_modules/base58-js/base58_chars.js
  var base58_chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  var base58_chars_default = base58_chars;

  // node_modules/base58-js/base58_to_binary.js
  function base58_to_binary(base58String) {
    if (!base58String || typeof base58String !== "string")
      throw new Error(`Expected base58 string but got \u201C${base58String}\u201D`);
    if (base58String.match(/[IOl0]/gmu))
      throw new Error(
        `Invalid base58 character \u201C${base58String.match(/[IOl0]/gmu)}\u201D`
      );
    const lz = base58String.match(/^1+/gmu);
    const psz = lz ? lz[0].length : 0;
    const size = (base58String.length - psz) * (Math.log(58) / Math.log(256)) + 1 >>> 0;
    return new Uint8Array([
      ...new Uint8Array(psz),
      ...base58String.match(/.{1}/gmu).map((i) => base58_chars_default.indexOf(i)).reduce((acc, i) => {
        acc = acc.map((j2) => {
          const x = j2 * 58 + i;
          i = x >> 8;
          return x;
        });
        return acc;
      }, new Uint8Array(size)).reverse().filter(
        /* @__PURE__ */ ((lastValue) => (value) => (
          // @ts-ignore
          lastValue = lastValue || value
        ))(false)
      )
    ]);
  }
  var base58_to_binary_default = base58_to_binary;

  // node_modules/bitcoin-address-validation/dist/index.js
  var import_bech32 = __toESM(require_dist(), 1);

  // node_modules/sha256-uint8array/dist/sha256-uint8array.mjs
  var K = [
    1116352408 | 0,
    1899447441 | 0,
    3049323471 | 0,
    3921009573 | 0,
    961987163 | 0,
    1508970993 | 0,
    2453635748 | 0,
    2870763221 | 0,
    3624381080 | 0,
    310598401 | 0,
    607225278 | 0,
    1426881987 | 0,
    1925078388 | 0,
    2162078206 | 0,
    2614888103 | 0,
    3248222580 | 0,
    3835390401 | 0,
    4022224774 | 0,
    264347078 | 0,
    604807628 | 0,
    770255983 | 0,
    1249150122 | 0,
    1555081692 | 0,
    1996064986 | 0,
    2554220882 | 0,
    2821834349 | 0,
    2952996808 | 0,
    3210313671 | 0,
    3336571891 | 0,
    3584528711 | 0,
    113926993 | 0,
    338241895 | 0,
    666307205 | 0,
    773529912 | 0,
    1294757372 | 0,
    1396182291 | 0,
    1695183700 | 0,
    1986661051 | 0,
    2177026350 | 0,
    2456956037 | 0,
    2730485921 | 0,
    2820302411 | 0,
    3259730800 | 0,
    3345764771 | 0,
    3516065817 | 0,
    3600352804 | 0,
    4094571909 | 0,
    275423344 | 0,
    430227734 | 0,
    506948616 | 0,
    659060556 | 0,
    883997877 | 0,
    958139571 | 0,
    1322822218 | 0,
    1537002063 | 0,
    1747873779 | 0,
    1955562222 | 0,
    2024104815 | 0,
    2227730452 | 0,
    2361852424 | 0,
    2428436474 | 0,
    2756734187 | 0,
    3204031479 | 0,
    3329325298 | 0
  ];
  var algorithms = {
    sha256: 1
  };
  function createHash(algorithm) {
    if (algorithm && !algorithms[algorithm] && !algorithms[algorithm.toLowerCase()]) {
      throw new Error("Digest method not supported");
    }
    return new Hash();
  }
  var Hash = class {
    constructor() {
      this.A = 1779033703 | 0;
      this.B = 3144134277 | 0;
      this.C = 1013904242 | 0;
      this.D = 2773480762 | 0;
      this.E = 1359893119 | 0;
      this.F = 2600822924 | 0;
      this.G = 528734635 | 0;
      this.H = 1541459225 | 0;
      this._size = 0;
      this._sp = 0;
      if (!sharedBuffer || sharedOffset >= 8e3) {
        sharedBuffer = new ArrayBuffer(
          8e3
          /* N.allocTotal */
        );
        sharedOffset = 0;
      }
      this._byte = new Uint8Array(
        sharedBuffer,
        sharedOffset,
        80
        /* N.allocBytes */
      );
      this._word = new Int32Array(
        sharedBuffer,
        sharedOffset,
        20
        /* N.allocWords */
      );
      sharedOffset += 80;
    }
    update(data) {
      if ("string" === typeof data) {
        return this._utf8(data);
      }
      if (data == null) {
        throw new TypeError("Invalid type: " + typeof data);
      }
      const byteOffset = data.byteOffset;
      const length = data.byteLength;
      let blocks = length / 64 | 0;
      let offset = 0;
      if (blocks && !(byteOffset & 3) && !(this._size % 64)) {
        const block = new Int32Array(
          data.buffer,
          byteOffset,
          blocks * 16
          /* N.inputWords */
        );
        while (blocks--) {
          this._int32(block, offset >> 2);
          offset += 64;
        }
        this._size += offset;
      }
      const BYTES_PER_ELEMENT = data.BYTES_PER_ELEMENT;
      if (BYTES_PER_ELEMENT !== 1 && data.buffer) {
        const rest = new Uint8Array(data.buffer, byteOffset + offset, length - offset);
        return this._uint8(rest);
      }
      if (offset === length)
        return this;
      return this._uint8(data, offset);
    }
    _uint8(data, offset) {
      const { _byte, _word } = this;
      const length = data.length;
      offset = offset | 0;
      while (offset < length) {
        const start = this._size % 64;
        let index = start;
        while (offset < length && index < 64) {
          _byte[index++] = data[offset++];
        }
        if (index >= 64) {
          this._int32(_word);
        }
        this._size += index - start;
      }
      return this;
    }
    _utf8(text) {
      const { _byte, _word } = this;
      const length = text.length;
      let surrogate = this._sp;
      for (let offset = 0; offset < length; ) {
        const start = this._size % 64;
        let index = start;
        while (offset < length && index < 64) {
          let code = text.charCodeAt(offset++) | 0;
          if (code < 128) {
            _byte[index++] = code;
          } else if (code < 2048) {
            _byte[index++] = 192 | code >>> 6;
            _byte[index++] = 128 | code & 63;
          } else if (code < 55296 || code > 57343) {
            _byte[index++] = 224 | code >>> 12;
            _byte[index++] = 128 | code >>> 6 & 63;
            _byte[index++] = 128 | code & 63;
          } else if (surrogate) {
            code = ((surrogate & 1023) << 10) + (code & 1023) + 65536;
            _byte[index++] = 240 | code >>> 18;
            _byte[index++] = 128 | code >>> 12 & 63;
            _byte[index++] = 128 | code >>> 6 & 63;
            _byte[index++] = 128 | code & 63;
            surrogate = 0;
          } else {
            surrogate = code;
          }
        }
        if (index >= 64) {
          this._int32(_word);
          _word[0] = _word[
            16
            /* N.inputWords */
          ];
        }
        this._size += index - start;
      }
      this._sp = surrogate;
      return this;
    }
    _int32(data, offset) {
      let { A: A2, B, C: C2, D: D2, E, F: F2, G: G2, H } = this;
      let i = 0;
      offset = offset | 0;
      while (i < 16) {
        W[i++] = swap32(data[offset++]);
      }
      for (i = 16; i < 64; i++) {
        W[i] = gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16] | 0;
      }
      for (i = 0; i < 64; i++) {
        const T1 = H + sigma1(E) + ch(E, F2, G2) + K[i] + W[i] | 0;
        const T2 = sigma0(A2) + maj(A2, B, C2) | 0;
        H = G2;
        G2 = F2;
        F2 = E;
        E = D2 + T1 | 0;
        D2 = C2;
        C2 = B;
        B = A2;
        A2 = T1 + T2 | 0;
      }
      this.A = A2 + this.A | 0;
      this.B = B + this.B | 0;
      this.C = C2 + this.C | 0;
      this.D = D2 + this.D | 0;
      this.E = E + this.E | 0;
      this.F = F2 + this.F | 0;
      this.G = G2 + this.G | 0;
      this.H = H + this.H | 0;
    }
    digest(encoding) {
      const { _byte, _word } = this;
      let i = this._size % 64 | 0;
      _byte[i++] = 128;
      while (i & 3) {
        _byte[i++] = 0;
      }
      i >>= 2;
      if (i > 14) {
        while (i < 16) {
          _word[i++] = 0;
        }
        i = 0;
        this._int32(_word);
      }
      while (i < 16) {
        _word[i++] = 0;
      }
      const bits64 = this._size * 8;
      const low32 = (bits64 & 4294967295) >>> 0;
      const high32 = (bits64 - low32) / 4294967296;
      if (high32)
        _word[
          14
          /* N.highIndex */
        ] = swap32(high32);
      if (low32)
        _word[
          15
          /* N.lowIndex */
        ] = swap32(low32);
      this._int32(_word);
      return encoding === "hex" ? this._hex() : this._bin();
    }
    _hex() {
      const { A: A2, B, C: C2, D: D2, E, F: F2, G: G2, H } = this;
      return hex32(A2) + hex32(B) + hex32(C2) + hex32(D2) + hex32(E) + hex32(F2) + hex32(G2) + hex32(H);
    }
    _bin() {
      const { A: A2, B, C: C2, D: D2, E, F: F2, G: G2, H, _byte, _word } = this;
      _word[0] = swap32(A2);
      _word[1] = swap32(B);
      _word[2] = swap32(C2);
      _word[3] = swap32(D2);
      _word[4] = swap32(E);
      _word[5] = swap32(F2);
      _word[6] = swap32(G2);
      _word[7] = swap32(H);
      return _byte.slice(0, 32);
    }
  };
  var W = new Int32Array(
    64
    /* N.workWords */
  );
  var sharedBuffer;
  var sharedOffset = 0;
  var hex32 = (num) => (num + 4294967296).toString(16).substr(-8);
  var swapLE = ((c) => c << 24 & 4278190080 | c << 8 & 16711680 | c >> 8 & 65280 | c >> 24 & 255);
  var swapBE = ((c) => c);
  var swap32 = isBE() ? swapBE : swapLE;
  var ch = (x, y, z) => z ^ x & (y ^ z);
  var maj = (x, y, z) => x & y | z & (x | y);
  var sigma0 = (x) => (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10);
  var sigma1 = (x) => (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7);
  var gamma0 = (x) => (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ x >>> 3;
  var gamma1 = (x) => (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ x >>> 10;
  function isBE() {
    const buf = new Uint8Array(new Uint16Array([65279]).buffer);
    return buf[0] === 254;
  }

  // node_modules/bitcoin-address-validation/dist/index.js
  var sha256 = (payload) => createHash().update(payload).digest();
  var Network;
  (function(Network2) {
    Network2["mainnet"] = "mainnet";
    Network2["testnet"] = "testnet";
    Network2["regtest"] = "regtest";
    Network2["signet"] = "signet";
  })(Network || (Network = {}));
  var AddressType;
  (function(AddressType3) {
    AddressType3["p2pkh"] = "p2pkh";
    AddressType3["p2sh"] = "p2sh";
    AddressType3["p2wpkh"] = "p2wpkh";
    AddressType3["p2wsh"] = "p2wsh";
    AddressType3["p2tr"] = "p2tr";
  })(AddressType || (AddressType = {}));
  var addressTypes = {
    0: {
      type: AddressType.p2pkh,
      network: Network.mainnet
    },
    111: {
      type: AddressType.p2pkh,
      network: Network.testnet
    },
    5: {
      type: AddressType.p2sh,
      network: Network.mainnet
    },
    196: {
      type: AddressType.p2sh,
      network: Network.testnet
    }
  };
  function castTestnetTo(fromNetwork, toNetwork) {
    if (!toNetwork) {
      return fromNetwork;
    }
    if (fromNetwork === Network.mainnet) {
      throw new Error("Cannot cast mainnet to non-mainnet");
    }
    return toNetwork;
  }
  var normalizeAddressInfo = (addressInfo, options) => {
    return {
      ...addressInfo,
      network: castTestnetTo(addressInfo.network, options?.castTestnetTo)
    };
  };
  var parseBech32 = (address, options) => {
    let decoded;
    try {
      if (address.startsWith("bc1p") || address.startsWith("tb1p") || address.startsWith("bcrt1p")) {
        decoded = import_bech32.bech32m.decode(address);
      } else {
        decoded = import_bech32.bech32.decode(address);
      }
    } catch (error) {
      throw new Error("Invalid address");
    }
    const mapPrefixToNetwork = {
      bc: Network.mainnet,
      tb: Network.testnet,
      bcrt: Network.regtest
    };
    const network = mapPrefixToNetwork[decoded.prefix];
    if (network === void 0) {
      throw new Error("Invalid address");
    }
    const witnessVersion = decoded.words[0];
    if (witnessVersion === void 0 || witnessVersion < 0 || witnessVersion > 16) {
      throw new Error("Invalid address");
    }
    const data = import_bech32.bech32.fromWords(decoded.words.slice(1));
    let type;
    if (data.length === 20) {
      type = AddressType.p2wpkh;
    } else if (witnessVersion === 1) {
      type = AddressType.p2tr;
    } else {
      type = AddressType.p2wsh;
    }
    return normalizeAddressInfo({
      bech32: true,
      network,
      address,
      type
    }, options);
  };
  var getAddressInfo = (address, options) => {
    let decoded;
    const prefix = address.slice(0, 2).toLowerCase();
    if (prefix === "bc" || prefix === "tb") {
      return parseBech32(address, options);
    }
    try {
      decoded = base58_to_binary_default(address);
    } catch (error) {
      throw new Error("Invalid address");
    }
    const { length } = decoded;
    if (length !== 25) {
      throw new Error("Invalid address");
    }
    const version = decoded[0];
    const checksum = decoded.slice(length - 4, length);
    const body = decoded.slice(0, length - 4);
    const expectedChecksum = sha256(sha256(body)).slice(0, 4);
    if (checksum.some((value, index) => value !== expectedChecksum[index])) {
      throw new Error("Invalid address");
    }
    const validVersions = Object.keys(addressTypes).map(Number);
    if (version === void 0 || !validVersions.includes(version)) {
      throw new Error("Invalid address");
    }
    const addressType = addressTypes[version];
    if (!addressType) {
      throw new Error("Invalid address");
    }
    return normalizeAddressInfo({
      ...addressType,
      address,
      bech32: false
    }, options);
  };

  // node_modules/@sats-connect/core/dist/index.mjs
  var import_buffer = __toESM(require_buffer(), 1);
  var import_jsontokens2 = __toESM(require_lib2(), 1);
  var import_jsontokens3 = __toESM(require_lib2(), 1);
  var import_jsontokens4 = __toESM(require_lib2(), 1);
  var import_jsontokens5 = __toESM(require_lib2(), 1);
  var import_jsontokens6 = __toESM(require_lib2(), 1);
  var import_jsontokens7 = __toESM(require_lib2(), 1);
  var import_jsontokens8 = __toESM(require_lib2(), 1);
  var walletTypes = ["software", "ledger", "keystone"];
  var walletTypeSchema = picklist(walletTypes);
  var AddressPurpose = /* @__PURE__ */ ((AddressPurpose2) => {
    AddressPurpose2["Ordinals"] = "ordinals";
    AddressPurpose2["Payment"] = "payment";
    AddressPurpose2["Stacks"] = "stacks";
    AddressPurpose2["Starknet"] = "starknet";
    AddressPurpose2["Spark"] = "spark";
    return AddressPurpose2;
  })(AddressPurpose || {});
  var AddressType2 = /* @__PURE__ */ ((AddressType3) => {
    AddressType3["p2pkh"] = "p2pkh";
    AddressType3["p2sh"] = "p2sh";
    AddressType3["p2wpkh"] = "p2wpkh";
    AddressType3["p2wsh"] = "p2wsh";
    AddressType3["p2tr"] = "p2tr";
    AddressType3["stacks"] = "stacks";
    AddressType3["starknet"] = "starknet";
    AddressType3["spark"] = "spark";
    return AddressType3;
  })(AddressType2 || {});
  var addressSchema = object({
    address: string(),
    publicKey: string(),
    purpose: enum_(AddressPurpose),
    addressType: enum_(AddressType2),
    walletType: walletTypeSchema
  });
  var BitcoinNetworkType = /* @__PURE__ */ ((BitcoinNetworkType2) => {
    BitcoinNetworkType2["Mainnet"] = "Mainnet";
    BitcoinNetworkType2["Testnet"] = "Testnet";
    BitcoinNetworkType2["Testnet4"] = "Testnet4";
    BitcoinNetworkType2["Signet"] = "Signet";
    BitcoinNetworkType2["Regtest"] = "Regtest";
    return BitcoinNetworkType2;
  })(BitcoinNetworkType || {});
  var StacksNetworkType = /* @__PURE__ */ ((StacksNetworkType2) => {
    StacksNetworkType2["Mainnet"] = "mainnet";
    StacksNetworkType2["Testnet"] = "testnet";
    return StacksNetworkType2;
  })(StacksNetworkType || {});
  var StarknetNetworkType = /* @__PURE__ */ ((StarknetNetworkType2) => {
    StarknetNetworkType2["Mainnet"] = "mainnet";
    StarknetNetworkType2["Sepolia"] = "sepolia";
    return StarknetNetworkType2;
  })(StarknetNetworkType || {});
  var SparkNetworkType = /* @__PURE__ */ ((SparkNetworkType2) => {
    SparkNetworkType2["Mainnet"] = "mainnet";
    SparkNetworkType2["Regtest"] = "regtest";
    return SparkNetworkType2;
  })(SparkNetworkType || {});
  var RpcIdSchema = optional(union([string(), number(), null_()]));
  var rpcRequestMessageSchema = object({
    jsonrpc: literal("2.0"),
    method: string(),
    params: optional(
      union([
        array(unknown()),
        looseObject({}),
        // Note: This is to support current incorrect usage of RPC 2.0. Params need
        // to be either an array or an object when provided. Changing this now would
        // be a breaking change, so accepting null values for now. Tracking in
        // https://linear.app/xverseapp/issue/ENG-4538.
        null_()
      ])
    ),
    id: unwrap(RpcIdSchema)
  });
  var RpcErrorCode = /* @__PURE__ */ ((RpcErrorCode2) => {
    RpcErrorCode2[RpcErrorCode2["PARSE_ERROR"] = -32700] = "PARSE_ERROR";
    RpcErrorCode2[RpcErrorCode2["INVALID_REQUEST"] = -32600] = "INVALID_REQUEST";
    RpcErrorCode2[RpcErrorCode2["METHOD_NOT_FOUND"] = -32601] = "METHOD_NOT_FOUND";
    RpcErrorCode2[RpcErrorCode2["INVALID_PARAMS"] = -32602] = "INVALID_PARAMS";
    RpcErrorCode2[RpcErrorCode2["INTERNAL_ERROR"] = -32603] = "INTERNAL_ERROR";
    RpcErrorCode2[RpcErrorCode2["USER_REJECTION"] = -32e3] = "USER_REJECTION";
    RpcErrorCode2[RpcErrorCode2["METHOD_NOT_SUPPORTED"] = -32001] = "METHOD_NOT_SUPPORTED";
    RpcErrorCode2[RpcErrorCode2["ACCESS_DENIED"] = -32002] = "ACCESS_DENIED";
    return RpcErrorCode2;
  })(RpcErrorCode || {});
  var rpcSuccessResponseMessageSchema = object({
    jsonrpc: literal("2.0"),
    result: nonOptional(unknown()),
    id: RpcIdSchema
  });
  var rpcErrorResponseMessageSchema = object({
    jsonrpc: literal("2.0"),
    error: nonOptional(unknown()),
    id: RpcIdSchema
  });
  var rpcResponseMessageSchema = union([
    rpcSuccessResponseMessageSchema,
    rpcErrorResponseMessageSchema
  ]);
  var accountChangeEventName = "accountChange";
  var accountChangeSchema = object({
    type: literal(accountChangeEventName),
    addresses: optional(array(addressSchema))
  });
  var networkChangeEventName = "networkChange";
  var networkChangeSchema = object({
    type: literal(networkChangeEventName),
    bitcoin: object({
      name: enum_(BitcoinNetworkType)
    }),
    stacks: object({
      name: string()
    }),
    addresses: optional(array(addressSchema))
  });
  var disconnectEventName = "disconnect";
  var disconnectSchema = object({
    type: literal(disconnectEventName)
  });
  var walletEventSchema = variant("type", [
    accountChangeSchema,
    networkChangeSchema,
    disconnectSchema
  ]);
  function getProviderById(providerId) {
    return providerId?.split(".").reduce((acc, part) => acc?.[part], window);
  }
  function isProviderInstalled(providerId) {
    return !!getProviderById(providerId);
  }
  function setDefaultProvider(providerId) {
    localStorage.setItem("sats-connect_defaultProvider", providerId);
  }
  function getDefaultProvider() {
    return localStorage.getItem("sats-connect_defaultProvider");
  }
  function removeDefaultProvider() {
    localStorage.removeItem("sats-connect_defaultProvider");
  }
  function getSupportedWallets() {
    const wallets = Object.values(DefaultAdaptersInfo).map((provider) => {
      {
        return {
          ...provider,
          isInstalled: isProviderInstalled(provider.id)
        };
      }
    });
    return wallets;
  }
  var sanitizeRequest = (method, params, providerInfo) => {
    try {
      const [major, minor, patch] = providerInfo.version.split(".").map((part) => parseInt(part, 10));
      const platform = providerInfo.platform;
      if (
        // platform is missing for versions < 1.5.0 on web and < 1.55.0 on mobile
        !platform || platform === "web" && major <= 1 && minor <= 4 || platform === "mobile" && major <= 1 && minor <= 54
      ) {
        const v1Sanitized = sanitizeAddressPurposeRequest(method, params);
        method = v1Sanitized.method;
        params = v1Sanitized.params;
      }
    } catch {
    }
    return { method, params };
  };
  var sanitizeAddressPurposeRequest = (method, params) => {
    const filterPurposes = (purposes) => purposes?.filter(
      (purpose) => purpose !== "spark" && purpose !== "starknet"
      /* Starknet */
    );
    if (method === "wallet_connect") {
      const typedParams = params;
      if (!typedParams) {
        return { method, params };
      }
      const { addresses, ...rest } = typedParams;
      const overrideParams = {
        ...rest,
        addresses: filterPurposes(addresses)
      };
      return { method, params: overrideParams };
    }
    if (method === "getAccounts") {
      const typedParams = params;
      const { purposes, ...rest } = typedParams;
      const overrideParams = { ...rest, purposes: filterPurposes(purposes) };
      return { method, params: overrideParams };
    }
    if (method === "getAddresses") {
      const typedParams = params;
      const { purposes, ...rest } = typedParams;
      const overrideParams = { ...rest, purposes: filterPurposes(purposes) };
      return { method, params: overrideParams };
    }
    return { method, params };
  };
  var accountActionsSchema = object({
    read: optional(boolean())
  });
  var walletActionsSchema = object({
    readNetwork: optional(boolean())
  });
  var accountPermissionSchema = object({
    type: literal("account"),
    resourceId: string(),
    clientId: string(),
    actions: accountActionsSchema
  });
  var walletPermissionSchema = object({
    type: literal("wallet"),
    resourceId: string(),
    clientId: string(),
    actions: walletActionsSchema
  });
  var PermissionRequestParams = variant("type", [
    object({
      ...omit(accountPermissionSchema, ["clientId"]).entries
    }),
    object({
      ...omit(walletPermissionSchema, ["clientId"]).entries
    })
  ]);
  var permission = variant("type", [accountPermissionSchema, walletPermissionSchema]);
  var requestPermissionsMethodName = "wallet_requestPermissions";
  var requestPermissionsParamsSchema = nullish(array(PermissionRequestParams));
  var requestPermissionsResultSchema = literal(true);
  var requestPermissionsRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(requestPermissionsMethodName),
      params: requestPermissionsParamsSchema,
      id: string()
    }).entries
  });
  var renouncePermissionsMethodName = "wallet_renouncePermissions";
  var renouncePermissionsParamsSchema = nullish(null_());
  var renouncePermissionsResultSchema = nullish(null_());
  var renouncePermissionsRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(renouncePermissionsMethodName),
      params: renouncePermissionsParamsSchema,
      id: string()
    }).entries
  });
  var disconnectMethodName = "wallet_disconnect";
  var disconnectParamsSchema = nullish(null_());
  var disconnectResultSchema = nullish(null_());
  var disconnectRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(disconnectMethodName),
      params: disconnectParamsSchema,
      id: string()
    }).entries
  });
  var getWalletTypeMethodName = "wallet_getWalletType";
  var getWalletTypeParamsSchema = nullish(null_());
  var getWalletTypeRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(getWalletTypeMethodName),
      params: getWalletTypeParamsSchema,
      id: string()
    }).entries
  });
  var getCurrentPermissionsMethodName = "wallet_getCurrentPermissions";
  var getCurrentPermissionsParamsSchema = nullish(null_());
  var getCurrentPermissionsResultSchema = array(permission);
  var getCurrentPermissionsRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(getCurrentPermissionsMethodName),
      params: getCurrentPermissionsParamsSchema,
      id: string()
    }).entries
  });
  var getNetworkMethodName = "wallet_getNetwork";
  var getNetworkParamsSchema = nullish(null_());
  var getNetworkResultSchema = object({
    bitcoin: object({
      name: enum_(BitcoinNetworkType)
    }),
    stacks: object({
      name: enum_(StacksNetworkType)
    }),
    spark: object({
      name: enum_(SparkNetworkType)
    })
  });
  var getNetworkRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(getNetworkMethodName),
      params: getNetworkParamsSchema,
      id: string()
    }).entries
  });
  var changeNetworkMethodName = "wallet_changeNetwork";
  var changeNetworkParamsSchema = object({
    name: enum_(BitcoinNetworkType)
  });
  var changeNetworkResultSchema = nullish(null_());
  var changeNetworkRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(changeNetworkMethodName),
      params: changeNetworkParamsSchema,
      id: string()
    }).entries
  });
  var changeNetworkByIdMethodName = "wallet_changeNetworkById";
  var changeNetworkByIdParamsSchema = object({
    id: string()
  });
  var changeNetworkByIdResultSchema = nullish(null_());
  var changeNetworkByIdRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(changeNetworkByIdMethodName),
      params: changeNetworkByIdParamsSchema,
      id: string()
    }).entries
  });
  var getAccountMethodName = "wallet_getAccount";
  var getAccountParamsSchema = nullish(null_());
  var getAccountResultSchema = object({
    id: string(),
    addresses: array(addressSchema),
    walletType: walletTypeSchema,
    network: getNetworkResultSchema
  });
  var getAccountRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(getAccountMethodName),
      params: getAccountParamsSchema,
      id: string()
    }).entries
  });
  var connectMethodName = "wallet_connect";
  var connectParamsSchema = nullish(
    object({
      permissions: optional(array(PermissionRequestParams)),
      addresses: optional(array(enum_(AddressPurpose))),
      message: optional(
        pipe(string(), maxLength(80, "The message must not exceed 80 characters."))
      ),
      network: optional(enum_(BitcoinNetworkType))
    })
  );
  var connectResultSchema = object({
    id: string(),
    addresses: array(addressSchema),
    walletType: walletTypeSchema,
    network: getNetworkResultSchema
  });
  var connectRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(connectMethodName),
      params: connectParamsSchema,
      id: string()
    }).entries
  });
  var addNetworkMethodName = "wallet_addNetwork";
  var addNetworkParamsSchema = variant("chain", [
    object({
      chain: literal("bitcoin"),
      type: enum_(BitcoinNetworkType),
      name: string(),
      rpcUrl: string(),
      rpcFallbackUrl: optional(string()),
      indexerUrl: optional(string()),
      blockExplorerUrl: optional(string()),
      switch: optional(boolean())
    }),
    object({
      chain: literal("stacks"),
      name: string(),
      type: enum_(StacksNetworkType),
      rpcUrl: string(),
      blockExplorerUrl: optional(string()),
      switch: optional(boolean())
    }),
    object({
      chain: literal("starknet"),
      name: string(),
      type: enum_(StarknetNetworkType),
      rpcUrl: string(),
      blockExplorerUrl: optional(string()),
      switch: optional(boolean())
    })
  ]);
  var addNetworkRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(addNetworkMethodName),
      params: addNetworkParamsSchema,
      id: string()
    }).entries
  });
  var addNetworkResultSchema = object({
    id: string()
  });
  var ProviderPlatform = /* @__PURE__ */ ((ProviderPlatform2) => {
    ProviderPlatform2["Web"] = "web";
    ProviderPlatform2["Mobile"] = "mobile";
    return ProviderPlatform2;
  })(ProviderPlatform || {});
  var getInfoMethodName = "getInfo";
  var getInfoParamsSchema = nullish(null_());
  var getInfoResultSchema = object({
    /**
     * Version of the wallet.
     */
    version: string(),
    /**
     * The platform the wallet is running on (web or mobile).
     */
    platform: optional(enum_(ProviderPlatform)),
    /**
     * [WBIP](https://wbips.netlify.app/wbips/WBIP002) methods supported by the wallet.
     */
    methods: optional(array(string())),
    /**
     * List of WBIP standards supported by the wallet. Not currently used.
     */
    supports: array(string())
  });
  var getInfoRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(getInfoMethodName),
      params: getInfoParamsSchema,
      id: string()
    }).entries
  });
  var getAddressesMethodName = "getAddresses";
  var getAddressesParamsSchema = object({
    /**
     * The purposes for which to generate addresses. See
     * {@linkcode AddressPurpose} for available purposes.
     */
    purposes: array(enum_(AddressPurpose)),
    /**
     * A message to be displayed to the user in the request prompt.
     */
    message: optional(string())
  });
  var getAddressesResultSchema = object({
    /**
     * The addresses generated for the given purposes.
     */
    addresses: array(addressSchema),
    network: getNetworkResultSchema
  });
  var getAddressesRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(getAddressesMethodName),
      params: getAddressesParamsSchema,
      id: string()
    }).entries
  });
  var signMessageMethodName = "signMessage";
  var MessageSigningProtocols = /* @__PURE__ */ ((MessageSigningProtocols2) => {
    MessageSigningProtocols2["ECDSA"] = "ECDSA";
    MessageSigningProtocols2["BIP322"] = "BIP322";
    return MessageSigningProtocols2;
  })(MessageSigningProtocols || {});
  var signMessageParamsSchema = object({
    /**
     * The address used for signing.
     **/
    address: string(),
    /**
     * The message to sign.
     **/
    message: string(),
    /**
     * The protocol to use for signing the message.
     */
    protocol: optional(enum_(MessageSigningProtocols))
  });
  var signMessageResultSchema = object({
    /**
     * The signature of the message.
     */
    signature: string(),
    /**
     * hash of the message.
     */
    messageHash: string(),
    /**
     * The address used for signing.
     */
    address: string(),
    /**
     * The protocol to use for signing the message.
     */
    protocol: enum_(MessageSigningProtocols)
  });
  var signMessageRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(signMessageMethodName),
      params: signMessageParamsSchema,
      id: string()
    }).entries
  });
  var sendTransferMethodName = "sendTransfer";
  var sendTransferParamsSchema = object({
    /**
     * Array of recipients to send to.
     * The amount to send to each recipient is in satoshis.
     */
    recipients: array(
      object({
        address: string(),
        amount: number()
      })
    )
  });
  var sendTransferResultSchema = object({
    /**
     * The transaction id as a hex-encoded string.
     */
    txid: string()
  });
  var sendTransferRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(sendTransferMethodName),
      params: sendTransferParamsSchema,
      id: string()
    }).entries
  });
  var signPsbtMethodName = "signPsbt";
  var signPsbtParamsSchema = object({
    /**
     * The base64 encoded PSBT to sign.
     */
    psbt: string(),
    /**
     * The inputs to sign.
     * The key is the address and the value is an array of indexes of the inputs to sign.
     */
    signInputs: optional(record(string(), array(number()))),
    /**
     * Whether to broadcast the transaction after signing.
     **/
    broadcast: optional(boolean())
  });
  var signPsbtResultSchema = object({
    /**
     * The base64 encoded PSBT after signing.
     */
    psbt: string(),
    /**
     * The transaction id as a hex-encoded string.
     * This is only returned if the transaction was broadcast.
     **/
    txid: optional(string())
  });
  var signPsbtRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(signPsbtMethodName),
      params: signPsbtParamsSchema,
      id: string()
    }).entries
  });
  var getAccountsMethodName = "getAccounts";
  var getAccountsParamsSchema = object({
    /**
     * The purposes for which to generate addresses. See
     * {@linkcode AddressPurpose} for available purposes.
     */
    purposes: array(enum_(AddressPurpose)),
    /**
     * A message to be displayed to the user in the request prompt.
     */
    message: optional(string())
  });
  var getAccountsResultSchema = array(
    object({
      ...addressSchema.entries,
      ...object({
        walletType: walletTypeSchema
      }).entries
    })
  );
  var getAccountsRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(getAccountsMethodName),
      params: getAccountsParamsSchema,
      id: string()
    }).entries
  });
  var getBalanceMethodName = "getBalance";
  var getBalanceParamsSchema = nullish(null_());
  var getBalanceResultSchema = object({
    /**
     * The confirmed balance of the wallet in sats. Using a string due to chrome
     * messages not supporting bigint
     * (https://issues.chromium.org/issues/40116184).
     */
    confirmed: string(),
    /**
     * The unconfirmed balance of the wallet in sats. Using a string due to chrome
     * messages not supporting bigint
     * (https://issues.chromium.org/issues/40116184).
     */
    unconfirmed: string(),
    /**
     * The total balance (both confirmed and unconfrimed UTXOs) of the wallet in
     * sats. Using a string due to chrome messages not supporting bigint
     * (https://issues.chromium.org/issues/40116184).
     */
    total: string()
  });
  var getBalanceRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(getBalanceMethodName),
      id: string()
    }).entries
  });
  var getInscriptionsMethodName = "ord_getInscriptions";
  var getInscriptionsParamsSchema = object({
    offset: number(),
    limit: number()
  });
  var getInscriptionsResultSchema = object({
    total: number(),
    limit: number(),
    offset: number(),
    inscriptions: array(
      object({
        inscriptionId: string(),
        inscriptionNumber: string(),
        address: string(),
        collectionName: optional(string()),
        postage: string(),
        contentLength: string(),
        contentType: string(),
        timestamp: number(),
        offset: number(),
        genesisTransaction: string(),
        output: string()
      })
    )
  });
  var getInscriptionsRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(getInscriptionsMethodName),
      params: getInscriptionsParamsSchema,
      id: string()
    }).entries
  });
  var sendInscriptionsMethodName = "ord_sendInscriptions";
  var sendInscriptionsParamsSchema = object({
    transfers: array(
      object({
        address: string(),
        inscriptionId: string()
      })
    )
  });
  var sendInscriptionsResultSchema = object({
    txid: string()
  });
  var sendInscriptionsRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(sendInscriptionsMethodName),
      params: sendInscriptionsParamsSchema,
      id: string()
    }).entries
  });
  var runesEtchMethodName = "runes_etch";
  var etchTermsSchema = object({
    amount: string(),
    cap: string(),
    heightStart: optional(string()),
    heightEnd: optional(string()),
    offsetStart: optional(string()),
    offsetEnd: optional(string())
  });
  var inscriptionDetailsSchema = object({
    contentType: string(),
    contentBase64: string()
  });
  var runesEtchParamsSchema = object({
    runeName: string(),
    divisibility: optional(number()),
    symbol: optional(string()),
    premine: optional(string()),
    isMintable: boolean(),
    delegateInscriptionId: optional(string()),
    destinationAddress: string(),
    refundAddress: string(),
    feeRate: number(),
    appServiceFee: optional(number()),
    appServiceFeeAddress: optional(string()),
    terms: optional(etchTermsSchema),
    inscriptionDetails: optional(inscriptionDetailsSchema),
    network: optional(enum_(BitcoinNetworkType))
  });
  var runesEtchResultSchema = object({
    orderId: string(),
    fundTransactionId: string(),
    fundingAddress: string()
  });
  var runesEtchRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(runesEtchMethodName),
      params: runesEtchParamsSchema,
      id: string()
    }).entries
  });
  var runesGetBalanceMethodName = "runes_getBalance";
  var runesGetBalanceParamsSchema = nullish(null_());
  var runesGetBalanceResultSchema = object({
    balances: array(
      object({
        runeName: string(),
        amount: string(),
        divisibility: number(),
        symbol: string(),
        inscriptionId: nullish(string()),
        spendableBalance: string()
      })
    )
  });
  var runesGetBalanceRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(runesGetBalanceMethodName),
      params: runesGetBalanceParamsSchema,
      id: string()
    }).entries
  });
  var runesMintMethodName = "runes_mint";
  var runesMintParamsSchema = object({
    appServiceFee: optional(number()),
    appServiceFeeAddress: optional(string()),
    destinationAddress: string(),
    feeRate: number(),
    refundAddress: string(),
    repeats: number(),
    runeName: string(),
    network: optional(enum_(BitcoinNetworkType))
  });
  var runesMintResultSchema = object({
    orderId: string(),
    fundTransactionId: string(),
    fundingAddress: string()
  });
  var runesMintRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(runesMintMethodName),
      params: runesMintParamsSchema,
      id: string()
    }).entries
  });
  var runesTransferMethodName = "runes_transfer";
  var runesTransferParamsSchema = object({
    recipients: array(
      object({
        runeName: string(),
        amount: string(),
        address: string()
      })
    )
  });
  var runesTransferResultSchema = object({
    txid: string()
  });
  var runesTransferRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(runesTransferMethodName),
      params: runesTransferParamsSchema,
      id: string()
    }).entries
  });
  var sparkFlashnetGetJwtMethodName = "spark_flashnet_getJwt";
  var sparkFlashnetGetJwtParamsSchema = null_();
  var sparkFlashnetGetJwtResultSchema = object({
    /**
     * The JWT token for authenticated requests to the Flashnet API.
     */
    jwt: string()
  });
  var sparkFlashnetGetJwtRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(sparkFlashnetGetJwtMethodName),
      params: sparkFlashnetGetJwtParamsSchema,
      id: string()
    }).entries
  });
  var sparkFlashnetAddLiquidityIntentSchema = object({
    type: literal("addLiquidity"),
    data: object({
      userPublicKey: string(),
      poolId: string(),
      assetAAmount: string(),
      assetBAmount: string(),
      assetAMinAmountIn: string(),
      assetBMinAmountIn: string(),
      assetATransferId: string(),
      assetBTransferId: string(),
      nonce: string()
    })
  });
  var sparkFlashnetClawbackIntentSchema = object({
    type: literal("clawback"),
    data: object({
      senderPublicKey: string(),
      sparkTransferId: string(),
      lpIdentityPublicKey: string(),
      nonce: string()
    })
  });
  var sparkFlashnetConfirmInitialDepositIntentSchema = object({
    type: literal("confirmInitialDeposit"),
    data: object({
      poolId: string(),
      assetASparkTransferId: string(),
      poolOwnerPublicKey: string(),
      nonce: string()
    })
  });
  var sparkFlashnetCreateConstantProductPoolIntentSchema = object({
    type: literal("createConstantProductPool"),
    data: object({
      poolOwnerPublicKey: string(),
      assetAAddress: string(),
      assetBAddress: string(),
      lpFeeRateBps: union([number(), string()]),
      totalHostFeeRateBps: union([number(), string()]),
      nonce: string()
    })
  });
  var sparkFlashnetCreateSingleSidedPoolIntentSchema = object({
    type: literal("createSingleSidedPool"),
    data: object({
      assetAAddress: string(),
      assetBAddress: string(),
      assetAInitialReserve: string(),
      virtualReserveA: union([number(), string()]),
      virtualReserveB: union([number(), string()]),
      threshold: union([number(), string()]),
      lpFeeRateBps: union([number(), string()]),
      totalHostFeeRateBps: union([number(), string()]),
      poolOwnerPublicKey: string(),
      nonce: string()
    })
  });
  var sparkFlashnetRemoveLiquidityIntentSchema = object({
    type: literal("removeLiquidity"),
    data: object({
      userPublicKey: string(),
      poolId: string(),
      lpTokensToRemove: string(),
      nonce: string()
    })
  });
  var sparkFlashnetRouteSwapIntentSchema = object({
    type: literal("executeRouteSwap"),
    data: object({
      userPublicKey: string(),
      initialSparkTransferId: string(),
      hops: array(
        object({
          poolId: string(),
          inputAssetAddress: string(),
          outputAssetAddress: string(),
          hopIntegratorFeeRateBps: optional(union([number(), string()]))
        })
      ),
      inputAmount: string(),
      maxRouteSlippageBps: union([number(), string()]),
      minAmountOut: string(),
      defaultIntegratorFeeRateBps: optional(union([number(), string()])),
      nonce: string()
    })
  });
  var sparkFlashnetSwapIntentSchema = object({
    type: literal("executeSwap"),
    data: object({
      userPublicKey: string(),
      poolId: string(),
      transferId: string(),
      assetInAddress: string(),
      assetOutAddress: string(),
      amountIn: string(),
      maxSlippageBps: union([number(), string()]),
      minAmountOut: string(),
      totalIntegratorFeeRateBps: optional(union([number(), string()])),
      nonce: string()
    })
  });
  var sparkFlashnetSignIntentMethodName = "spark_flashnet_signIntent";
  var sparkFlashnetSignIntentParamsSchema = union([
    sparkFlashnetSwapIntentSchema,
    sparkFlashnetRouteSwapIntentSchema,
    sparkFlashnetAddLiquidityIntentSchema,
    sparkFlashnetClawbackIntentSchema,
    sparkFlashnetConfirmInitialDepositIntentSchema,
    sparkFlashnetCreateConstantProductPoolIntentSchema,
    sparkFlashnetCreateSingleSidedPoolIntentSchema,
    sparkFlashnetRemoveLiquidityIntentSchema
  ]);
  var sparkFlashnetSignIntentResultSchema = object({
    /**
     * The signed intent as a hex string.
     */
    signature: string()
  });
  var sparkFlashnetSignIntentRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(sparkFlashnetSignIntentMethodName),
      params: sparkFlashnetSignIntentParamsSchema,
      id: string()
    }).entries
  });
  var sparkFlashnetSignStructuredMessageMethodName = "spark_flashnet_signStructuredMessage";
  var sparkFlashnetSignStructuredMessageParamsSchema = object({
    message: string()
  });
  var sparkFlashnetSignStructuredMessageResultSchema = object({
    message: string(),
    signature: string()
  });
  var sparkFlashnetSignStructuredMessageRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(sparkFlashnetSignStructuredMessageMethodName),
      params: sparkFlashnetSignStructuredMessageParamsSchema,
      id: string()
    }).entries
  });
  var sparkGetAddressesMethodName = "spark_getAddresses";
  var sparkGetAddressesParamsSchema = nullish(
    object({
      /**
       * A message to be displayed to the user in the request prompt.
       */
      message: optional(string())
    })
  );
  var sparkGetAddressesResultSchema = object({
    /**
     * The addresses generated for the given purposes.
     */
    addresses: array(addressSchema),
    network: getNetworkResultSchema
  });
  var sparkGetAddressesRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(sparkGetAddressesMethodName),
      params: sparkGetAddressesParamsSchema,
      id: string()
    }).entries
  });
  var sparkGetBalanceMethodName = "spark_getBalance";
  var sparkGetBalanceParamsSchema = nullish(null_());
  var sparkGetBalanceResultSchema = object({
    /**
     * The Spark Bitcoin address balance in sats in string form.
     */
    balance: string(),
    tokenBalances: array(
      object({
        /* The address balance of the token in string form as it can overflow a js number */
        balance: string(),
        tokenMetadata: object({
          tokenIdentifier: string(),
          tokenName: string(),
          tokenTicker: string(),
          decimals: number(),
          maxSupply: string()
        })
      })
    )
  });
  var sparkGetBalanceRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(sparkGetBalanceMethodName),
      params: sparkGetBalanceParamsSchema,
      id: string()
    }).entries
  });
  var sparkSignMessageMethodName = "spark_signMessage";
  var sparkSignMessageParamsSchema = object({
    /**
     * The message to sign. The message should only consist of valid UTF-8 characters.
     */
    message: string()
  });
  var sparkSignMessageResultSchema = object({
    /**
     * The signature, encoded in base64, of the message hash.
     *
     * Note: When signing, the message is decoded into a byte array,
     * and the resulting byte array is hashed with SHA256 before signing
     * with the private key.
     */
    signature: string()
  });
  var sparkSignMessageRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(sparkSignMessageMethodName),
      params: sparkSignMessageParamsSchema,
      id: string()
    }).entries
  });
  var sparkTransferMethodName = "spark_transfer";
  var sparkTransferParamsSchema = object({
    /**
     * Amount of SATS to transfer as a string or number.
     */
    amountSats: union([number(), string()]),
    /**
     * The recipient's spark address.
     */
    receiverSparkAddress: string()
  });
  var sparkTransferResultSchema = object({
    /**
     * The ID of the transaction.
     */
    id: string()
  });
  var sparkTransferRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(sparkTransferMethodName),
      params: sparkTransferParamsSchema,
      id: string()
    }).entries
  });
  var sparkTransferTokenMethodName = "spark_transferToken";
  var sparkTransferTokenParamsSchema = object({
    /**
     * Amount of units of the token to transfer as a string or number.
     */
    tokenAmount: union([number(), string()]),
    /**
     * The Bech32m token identifier.
     */
    tokenIdentifier: string(),
    /**
     * The recipient's spark address.
     */
    receiverSparkAddress: string()
  });
  var sparkTransferTokenResultSchema = object({
    /**
     * The ID of the transaction.
     */
    id: string()
  });
  var sparkTransferTokenRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(sparkTransferTokenMethodName),
      params: sparkTransferTokenParamsSchema,
      id: string()
    }).entries
  });
  var stxCallContractMethodName = "stx_callContract";
  var stxCallContractParamsSchema = object({
    /**
     * The contract principal.
     *
     * E.g. `"SPKE...GD5C.my-contract"`
     */
    contract: string(),
    /**
     * The name of the function to call.
     *
     * Note: spec changes ongoing,
     * https://github.com/stacksgov/sips/pull/166#pullrequestreview-1914236999
     */
    functionName: string(),
    /**
     * @deprecated in favor of `functionArgs` for @stacks/connect compatibility
     */
    arguments: optional(array(string())),
    /**
     * The function's arguments. The arguments are expected to be hex-encoded
     * strings of Clarity values.
     *
     * To convert Clarity values to their hex representation, the `cvToHex`
     * helper from the `@stacks/transactions` package may be helpful.
     *
     * ```js
     * import { cvToHex } from '@stacks/transactions';
     *
     * const functionArgs = [someClarityValue1, someClarityValue2];
     * const hexArgs = functionArgs.map(cvToHex);
     * ```
     */
    functionArgs: optional(array(string())),
    /**
     * The post conditions to apply to the contract call.
     */
    postConditions: optional(array(string())),
    /**
     * The mode to apply to the post conditions.
     */
    postConditionMode: optional(union([literal("allow"), literal("deny")]))
  });
  var stxCallContractResultSchema = object({
    /**
     * The ID of the transaction.
     */
    txid: string(),
    /**
     * A Stacks transaction as a hex-encoded string.
     */
    transaction: string()
  });
  var stxCallContractRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(stxCallContractMethodName),
      params: stxCallContractParamsSchema,
      id: string()
    }).entries
  });
  var stxDeployContractMethodName = "stx_deployContract";
  var stxDeployContractParamsSchema = object({
    /**
     * Name of the contract.
     */
    name: string(),
    /**
     * The source code of the Clarity contract.
     */
    clarityCode: string(),
    /**
     * The version of the Clarity contract.
     */
    clarityVersion: optional(number()),
    /**
     * The post conditions to apply to the contract call.
     */
    postConditions: optional(array(string())),
    /**
     * The mode to apply to the post conditions.
     */
    postConditionMode: optional(union([literal("allow"), literal("deny")]))
  });
  var stxDeployContractResultSchema = object({
    /**
     * The ID of the transaction.
     */
    txid: string(),
    /**
     * A Stacks transaction as a hex-encoded string.
     */
    transaction: string()
  });
  var stxDeployContractRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(stxDeployContractMethodName),
      params: stxDeployContractParamsSchema,
      id: string()
    }).entries
  });
  var stxGetAccountsMethodName = "stx_getAccounts";
  var stxGetAccountsParamsSchema = nullish(null_());
  var stxGetAccountsResultSchema = object({
    /**
     * The addresses generated for the given purposes.
     */
    addresses: array(
      object({
        address: string(),
        publicKey: string(),
        gaiaHubUrl: string(),
        gaiaAppKey: string()
      })
    ),
    network: getNetworkResultSchema
  });
  var stxGetAccountsRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(stxGetAccountsMethodName),
      params: stxGetAccountsParamsSchema,
      id: string()
    }).entries
  });
  var stxGetAddressesMethodName = "stx_getAddresses";
  var stxGetAddressesParamsSchema = nullish(
    object({
      /**
       * A message to be displayed to the user in the request prompt.
       */
      message: optional(string())
    })
  );
  var stxGetAddressesResultSchema = object({
    /**
     * The addresses generated for the given purposes.
     */
    addresses: array(addressSchema),
    network: getNetworkResultSchema
  });
  var stxGetAddressesRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(stxGetAddressesMethodName),
      params: stxGetAddressesParamsSchema,
      id: string()
    }).entries
  });
  var stxSignMessageMethodName = "stx_signMessage";
  var stxSignMessageParamsSchema = object({
    /**
     * The message to sign.
     */
    message: string()
  });
  var stxSignMessageResultSchema = object({
    /**
     * The signature of the message.
     */
    signature: string(),
    /**
     * The public key used to sign the message.
     */
    publicKey: string()
  });
  var stxSignMessageRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(stxSignMessageMethodName),
      params: stxSignMessageParamsSchema,
      id: string()
    }).entries
  });
  var stxSignStructuredMessageMethodName = "stx_signStructuredMessage";
  var stxSignStructuredMessageParamsSchema = object({
    /**
     * The domain to be signed.
     */
    domain: string(),
    /**
     * Message payload to be signed.
     */
    message: string(),
    /**
     * The public key to sign the message with.
     */
    publicKey: optional(string())
  });
  var stxSignStructuredMessageResultSchema = object({
    /**
     * Signature of the message.
     */
    signature: string(),
    /**
     * Public key as hex-encoded string.
     */
    publicKey: string()
  });
  var stxSignStructuredMessageRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(stxSignStructuredMessageMethodName),
      params: stxSignStructuredMessageParamsSchema,
      id: string()
    }).entries
  });
  var stxSignTransactionMethodName = "stx_signTransaction";
  var stxSignTransactionParamsSchema = object({
    /**
     * The transaction to sign as a hex-encoded string.
     */
    transaction: string(),
    /**
     * The public key to sign the transaction with. The wallet may use any key
     * when not provided.
     */
    pubkey: optional(string()),
    /**
     * Whether to broadcast the transaction after signing. Defaults to `true`.
     */
    broadcast: optional(boolean())
  });
  var stxSignTransactionResultSchema = object({
    /**
     * The signed transaction as a hex-encoded string.
     */
    transaction: string()
  });
  var stxSignTransactionRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(stxSignTransactionMethodName),
      params: stxSignTransactionParamsSchema,
      id: string()
    }).entries
  });
  var stxSignTransactionsMethodName = "stx_signTransactions";
  var stxSignTransactionsParamsSchema = object({
    /**
     * The transactions to sign as hex-encoded strings.
     */
    transactions: pipe(
      array(
        pipe(
          string(),
          check((hex) => {
            return true;
          }, "Invalid hex-encoded Stacks transaction.")
        )
      ),
      minLength(1)
    ),
    /**
     * Whether the signed transactions should be broadcast after signing. Defaults
     * to `true`.
     */
    broadcast: optional(boolean())
  });
  var stxSignTransactionsResultSchema = object({
    /**
     * The signed transactions as hex-encoded strings, in the same order as in the
     * sign request.
     */
    transactions: array(string())
  });
  var stxSignTransactionsRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(stxSignTransactionsMethodName),
      params: stxSignTransactionsParamsSchema,
      id: string()
    }).entries
  });
  var stxTransferStxMethodName = "stx_transferStx";
  var stxTransferStxParamsSchema = object({
    /**
     * Amount of STX tokens to transfer in microstacks as a string. Anything
     * parseable by `BigInt` is acceptable.
     *
     * Example,
     *
     * ```js
     * const amount1 = 1234;
     * const amount2 = 1234n;
     * const amount3 = '1234';
     * ```
     */
    amount: union([number(), string()]),
    /**
     * The recipient's principal.
     */
    recipient: string(),
    /**
     * A string representing the memo.
     */
    memo: optional(string()),
    /**
     * Version of parameter format.
     */
    version: optional(string()),
    /**
     * The mode of the post conditions.
     */
    postConditionMode: optional(number()),
    /**
     * A hex-encoded string representing the post conditions.
     *
     * A post condition may be converted to it's hex representation using the `serializePostCondition` helper from the `@stacks/transactions` package,
     *
     * ```js
     * import { serializePostCondition } from '@stacks/transactions';
     *
     * const postCondition = somePostCondition;
     * const hexPostCondition = serializePostCondition(postCondition).toString('hex');
     * ```
     */
    postConditions: optional(array(string())),
    /**
     * The public key to sign the transaction with. The wallet may use any key
     * when not provided.
     */
    pubkey: optional(string())
  });
  var stxTransferStxResultSchema = object({
    /**
     * The ID of the transaction.
     */
    txid: string(),
    /**
     * A Stacks transaction as a hex-encoded string.
     */
    transaction: string()
  });
  var stxTransferStxRequestMessageSchema = object({
    ...rpcRequestMessageSchema.entries,
    ...object({
      method: literal(stxTransferStxMethodName),
      params: stxTransferStxParamsSchema,
      id: string()
    }).entries
  });
  var cache = {};
  var requestInternal = async (provider, method, params) => {
    const response = await provider.request(method, params);
    if (is(rpcErrorResponseMessageSchema, response)) {
      return {
        status: "error",
        error: response.error
      };
    }
    if (is(rpcSuccessResponseMessageSchema, response)) {
      return {
        status: "success",
        result: response.result
      };
    }
    return {
      status: "error",
      error: {
        code: -32603,
        message: "Received unknown response from provider.",
        data: response
      }
    };
  };
  var request = async (method, params, providerId) => {
    let provider = window.XverseProviders?.BitcoinProvider || window.BitcoinProvider;
    if (providerId) {
      provider = await getProviderById(providerId);
    }
    if (!provider) {
      throw new Error("no wallet provider was found");
    }
    if (!method) {
      throw new Error("A wallet method is required");
    }
    if (!cache.providerInfo) {
      const infoResult = await requestInternal(provider, "getInfo", null);
      if (infoResult.status === "success") {
        cache.providerInfo = infoResult.result;
      }
    }
    if (cache.providerInfo) {
      if (method === "getInfo") {
        return {
          status: "success",
          result: cache.providerInfo
        };
      }
      const sanitized = sanitizeRequest(method, params, cache.providerInfo);
      if (sanitized.overrideResponse) {
        return sanitized.overrideResponse;
      }
      method = sanitized.method;
      params = sanitized.params;
    }
    return requestInternal(provider, method, params);
  };
  var addListener = (...rawArgs) => {
    const [listenerInfo, providerId] = (() => {
      if (rawArgs.length === 1) {
        return [rawArgs[0], void 0];
      }
      if (rawArgs.length === 2) {
        if (typeof rawArgs[1] === "function") {
          return [
            {
              eventName: rawArgs[0],
              cb: rawArgs[1]
            },
            void 0
          ];
        } else {
          return rawArgs;
        }
      }
      if (rawArgs.length === 3) {
        return [
          {
            eventName: rawArgs[0],
            cb: rawArgs[1]
          },
          rawArgs[2]
        ];
      }
      throw new Error("Unexpected number of arguments. Expecting 2 (or 3 for legacy requests).", {
        cause: rawArgs
      });
    })();
    let provider = window.XverseProviders?.BitcoinProvider || window.BitcoinProvider;
    if (providerId) {
      provider = getProviderById(providerId);
    }
    if (!provider) {
      throw new Error("no wallet provider was found");
    }
    if (!provider.addListener) {
      console.error(
        `The wallet provider you are using does not support the addListener method. Please update your wallet provider.`
      );
      return () => {
      };
    }
    return provider.addListener(listenerInfo);
  };
  var urlNetworkSuffix = {
    [
      "Mainnet"
      /* Mainnet */
    ]: "",
    [
      "Testnet"
      /* Testnet */
    ]: "-testnet",
    [
      "Testnet4"
      /* Testnet4 */
    ]: "-testnet4",
    [
      "Signet"
      /* Signet */
    ]: "-signet"
  };
  var ORDINALS_API_BASE_URL = (network = "Mainnet") => {
    if (network === "Regtest") {
      throw new Error(`Ordinals API does not support ${network} network`);
    }
    return `https://ordinals${urlNetworkSuffix[network]}.xverse.app/v1`;
  };
  var RunesApi = class {
    constructor(network) {
      __publicField(this, "client");
      __publicField(this, "parseError", (error) => {
        return {
          code: error.response?.status,
          message: JSON.stringify(error.response?.data)
        };
      });
      __publicField(this, "estimateMintCost", async (mintParams) => {
        try {
          const response = await this.client.post("/runes/mint/estimate", {
            ...mintParams
          });
          return {
            data: response.data
          };
        } catch (error) {
          const err = error;
          return {
            error: this.parseError(err)
          };
        }
      });
      __publicField(this, "estimateEtchCost", async (etchParams) => {
        try {
          const response = await this.client.post("/runes/etch/estimate", {
            ...etchParams
          });
          return {
            data: response.data
          };
        } catch (error) {
          const err = error;
          return {
            error: this.parseError(err)
          };
        }
      });
      __publicField(this, "createMintOrder", async (mintOrderParams) => {
        try {
          const response = await this.client.post("/runes/mint/orders", {
            ...mintOrderParams
          });
          return {
            data: response.data
          };
        } catch (error) {
          const err = error;
          return {
            error: this.parseError(err)
          };
        }
      });
      __publicField(this, "createEtchOrder", async (etchOrderParams) => {
        try {
          const response = await this.client.post("/runes/etch/orders", {
            ...etchOrderParams
          });
          return {
            data: response.data
          };
        } catch (error) {
          const err = error;
          return {
            error: this.parseError(err)
          };
        }
      });
      __publicField(this, "executeMint", async (orderId, fundTransactionId) => {
        try {
          const response = await this.client.post(`/runes/mint/orders/${orderId}/execute`, {
            fundTransactionId
          });
          return {
            data: response.data
          };
        } catch (error) {
          const err = error;
          return {
            error: this.parseError(err)
          };
        }
      });
      __publicField(this, "executeEtch", async (orderId, fundTransactionId) => {
        try {
          const response = await this.client.post(`/runes/etch/orders/${orderId}/execute`, {
            fundTransactionId
          });
          return {
            data: response.data
          };
        } catch (error) {
          const err = error;
          return {
            error: this.parseError(err)
          };
        }
      });
      __publicField(this, "getOrder", async (orderId) => {
        try {
          const response = await this.client.get(`/orders/${orderId}`);
          return {
            data: response.data
          };
        } catch (error) {
          const err = error;
          return {
            error: this.parseError(err)
          };
        }
      });
      __publicField(this, "rbfOrder", async (rbfRequest) => {
        const { orderId, newFeeRate } = rbfRequest;
        try {
          const response = await this.client.post(`/orders/${orderId}/rbf-estimate`, {
            newFeeRate
          });
          return {
            data: response.data
          };
        } catch (error) {
          const err = error;
          return {
            error: this.parseError(err)
          };
        }
      });
      this.client = axios_default.create({
        baseURL: ORDINALS_API_BASE_URL(network)
      });
    }
  };
  var clients = {};
  var getRunesApiClient = (network = "Mainnet") => {
    if (!clients[network]) {
      clients[network] = new RunesApi(network);
    }
    return clients[network];
  };
  var SatsConnectAdapter = class {
    async mintRunes(params) {
      try {
        const walletInfo = await this.requestInternal("getInfo", null).catch(() => null);
        if (walletInfo && walletInfo.status === "success") {
          const isMintSupported = walletInfo.result.methods?.includes("runes_mint");
          if (isMintSupported) {
            const response = await this.requestInternal("runes_mint", params);
            if (response) {
              if (response.status === "success") {
                return response;
              }
              if (response.status === "error" && response.error.code !== -32601) {
                return response;
              }
            }
          }
        }
        const mintRequest = {
          destinationAddress: params.destinationAddress,
          feeRate: params.feeRate,
          refundAddress: params.refundAddress,
          repeats: params.repeats,
          runeName: params.runeName,
          appServiceFee: params.appServiceFee,
          appServiceFeeAddress: params.appServiceFeeAddress
        };
        const orderResponse = await new RunesApi(params.network).createMintOrder(mintRequest);
        if (!orderResponse.data) {
          return {
            status: "error",
            error: {
              code: orderResponse.error.code === 400 ? -32600 : -32603,
              message: orderResponse.error.message
            }
          };
        }
        const paymentResponse = await this.requestInternal("sendTransfer", {
          recipients: [
            {
              address: orderResponse.data.fundAddress,
              amount: orderResponse.data.fundAmount
            }
          ]
        });
        if (paymentResponse.status !== "success") {
          return paymentResponse;
        }
        await new RunesApi(params.network).executeMint(
          orderResponse.data.orderId,
          paymentResponse.result.txid
        );
        return {
          status: "success",
          result: {
            orderId: orderResponse.data.orderId,
            fundTransactionId: paymentResponse.result.txid,
            fundingAddress: orderResponse.data.fundAddress
          }
        };
      } catch (error) {
        return {
          status: "error",
          error: {
            code: -32603,
            message: error.message
          }
        };
      }
    }
    async etchRunes(params) {
      const etchRequest = {
        destinationAddress: params.destinationAddress,
        refundAddress: params.refundAddress,
        feeRate: params.feeRate,
        runeName: params.runeName,
        divisibility: params.divisibility,
        symbol: params.symbol,
        premine: params.premine,
        isMintable: params.isMintable,
        terms: params.terms,
        inscriptionDetails: params.inscriptionDetails,
        delegateInscriptionId: params.delegateInscriptionId,
        appServiceFee: params.appServiceFee,
        appServiceFeeAddress: params.appServiceFeeAddress
      };
      try {
        const walletInfo = await this.requestInternal("getInfo", null).catch(() => null);
        if (walletInfo && walletInfo.status === "success") {
          const isEtchSupported = walletInfo.result.methods?.includes("runes_etch");
          if (isEtchSupported) {
            const response = await this.requestInternal("runes_etch", params);
            if (response) {
              if (response.status === "success") {
                return response;
              }
              if (response.status === "error" && response.error.code !== -32601) {
                return response;
              }
            }
          }
        }
        const orderResponse = await new RunesApi(params.network).createEtchOrder(etchRequest);
        if (!orderResponse.data) {
          return {
            status: "error",
            error: {
              code: orderResponse.error.code === 400 ? -32600 : -32603,
              message: orderResponse.error.message
            }
          };
        }
        const paymentResponse = await this.requestInternal("sendTransfer", {
          recipients: [
            {
              address: orderResponse.data.fundAddress,
              amount: orderResponse.data.fundAmount
            }
          ]
        });
        if (paymentResponse.status !== "success") {
          return paymentResponse;
        }
        await new RunesApi(params.network).executeEtch(
          orderResponse.data.orderId,
          paymentResponse.result.txid
        );
        return {
          status: "success",
          result: {
            orderId: orderResponse.data.orderId,
            fundTransactionId: paymentResponse.result.txid,
            fundingAddress: orderResponse.data.fundAddress
          }
        };
      } catch (error) {
        return {
          status: "error",
          error: {
            code: -32603,
            message: error.message
          }
        };
      }
    }
    async estimateMint(params) {
      const estimateMintRequest = {
        destinationAddress: params.destinationAddress,
        feeRate: params.feeRate,
        repeats: params.repeats,
        runeName: params.runeName,
        appServiceFee: params.appServiceFee,
        appServiceFeeAddress: params.appServiceFeeAddress
      };
      const response = await getRunesApiClient(
        params.network
      ).estimateMintCost(estimateMintRequest);
      if (response.data) {
        return {
          status: "success",
          result: response.data
        };
      }
      return {
        status: "error",
        error: {
          code: response.error.code === 400 ? -32600 : -32603,
          message: response.error.message
        }
      };
    }
    async estimateEtch(params) {
      const estimateEtchRequest = {
        destinationAddress: params.destinationAddress,
        feeRate: params.feeRate,
        runeName: params.runeName,
        divisibility: params.divisibility,
        symbol: params.symbol,
        premine: params.premine,
        isMintable: params.isMintable,
        terms: params.terms,
        inscriptionDetails: params.inscriptionDetails,
        delegateInscriptionId: params.delegateInscriptionId,
        appServiceFee: params.appServiceFee,
        appServiceFeeAddress: params.appServiceFeeAddress
      };
      const response = await getRunesApiClient(params.network).estimateEtchCost(estimateEtchRequest);
      if (response.data) {
        return {
          status: "success",
          result: response.data
        };
      }
      return {
        status: "error",
        error: {
          code: response.error.code === 400 ? -32600 : -32603,
          message: response.error.message
        }
      };
    }
    async getOrder(params) {
      const response = await getRunesApiClient(params.network).getOrder(params.id);
      if (response.data) {
        return {
          status: "success",
          result: response.data
        };
      }
      return {
        status: "error",
        error: {
          code: response.error.code === 400 || response.error.code === 404 ? -32600 : -32603,
          message: response.error.message
        }
      };
    }
    async estimateRbfOrder(params) {
      const rbfOrderRequest = {
        newFeeRate: params.newFeeRate,
        orderId: params.orderId
      };
      const response = await getRunesApiClient(params.network).rbfOrder(rbfOrderRequest);
      if (response.data) {
        return {
          status: "success",
          result: {
            fundingAddress: response.data.fundingAddress,
            rbfCost: response.data.rbfCost
          }
        };
      }
      return {
        status: "error",
        error: {
          code: response.error.code === 400 || response.error.code === 404 ? -32600 : -32603,
          message: response.error.message
        }
      };
    }
    async rbfOrder(params) {
      try {
        const rbfOrderRequest = {
          newFeeRate: params.newFeeRate,
          orderId: params.orderId
        };
        const orderResponse = await getRunesApiClient(params.network).rbfOrder(rbfOrderRequest);
        if (!orderResponse.data) {
          return {
            status: "error",
            error: {
              code: orderResponse.error.code === 400 || orderResponse.error.code === 404 ? -32600 : -32603,
              message: orderResponse.error.message
            }
          };
        }
        const paymentResponse = await this.requestInternal("sendTransfer", {
          recipients: [
            {
              address: orderResponse.data.fundingAddress,
              amount: orderResponse.data.rbfCost
            }
          ]
        });
        if (paymentResponse.status !== "success") {
          return paymentResponse;
        }
        return {
          status: "success",
          result: {
            fundingAddress: orderResponse.data.fundingAddress,
            orderId: rbfOrderRequest.orderId,
            fundRBFTransactionId: paymentResponse.result.txid
          }
        };
      } catch (error) {
        return {
          status: "error",
          error: {
            code: -32603,
            message: error.message
          }
        };
      }
    }
    async request(method, params) {
      switch (method) {
        case "runes_mint":
          return this.mintRunes(params);
        case "runes_etch":
          return this.etchRunes(params);
        case "runes_estimateMint":
          return this.estimateMint(params);
        case "runes_estimateEtch":
          return this.estimateEtch(params);
        case "runes_getOrder": {
          return this.getOrder(params);
        }
        case "runes_estimateRbfOrder": {
          return this.estimateRbfOrder(params);
        }
        case "runes_rbfOrder": {
          return this.rbfOrder(params);
        }
        default:
          return this.requestInternal(method, params);
      }
    }
  };
  var XverseAdapter = class extends SatsConnectAdapter {
    constructor() {
      super(...arguments);
      __publicField(this, "id", DefaultAdaptersInfo.xverse.id);
      __publicField(this, "requestInternal", async (method, params) => {
        return request(method, params, this.id);
      });
      __publicField(this, "addListener", (listenerInfo) => {
        return addListener(listenerInfo, this.id);
      });
    }
  };
  function convertSignInputsToInputType(signInputs) {
    let result = [];
    if (!signInputs) {
      return result;
    }
    for (let address in signInputs) {
      let indexes = signInputs[address];
      for (let index of indexes) {
        result.push({
          index,
          address
        });
      }
    }
    return result;
  }
  var UnisatAdapter = class extends SatsConnectAdapter {
    constructor() {
      super(...arguments);
      __publicField(this, "id", DefaultAdaptersInfo.unisat.id);
      __publicField(this, "requestInternal", async (method, params) => {
        try {
          switch (method) {
            case "getAccounts": {
              const response = await this.getAccounts(
                params
              );
              return {
                status: "success",
                result: response
              };
            }
            case "sendTransfer": {
              const response = await this.sendTransfer(params);
              return {
                status: "success",
                result: response
              };
            }
            case "signMessage": {
              const response = await this.signMessage(params);
              return {
                status: "success",
                result: response
              };
            }
            case "signPsbt": {
              const response = await this.signPsbt(params);
              return {
                status: "success",
                result: response
              };
            }
            default: {
              const error = {
                code: -32001,
                message: "Method not supported by the selected wallet"
              };
              console.error("Error calling the method", error);
              return {
                status: "error",
                error
              };
            }
          }
        } catch (error) {
          console.error("Error calling the method", error);
          return {
            status: "error",
            error: {
              code: error.code === 4001 ? -32e3 : -32603,
              message: error.message ? error.message : "Wallet method call error",
              data: error
            }
          };
        }
      });
      __publicField(this, "addListener", ({ eventName, cb }) => {
        switch (eventName) {
          case "accountChange": {
            const handler = () => {
              cb({ type: "accountChange" });
            };
            window.unisat.on("accountsChanged", handler);
            return () => {
              window.unisat.removeListener("accountsChanged", handler);
            };
          }
          case "networkChange": {
            const handler = () => {
              cb({ type: "networkChange" });
            };
            window.unisat.on("networkChanged", handler);
            return () => {
              window.unisat.removeListener("networkChanged", handler);
            };
          }
          default: {
            console.error("Event not supported by the selected wallet");
            return () => {
            };
          }
        }
      });
    }
    async getAccounts(params) {
      const { purposes } = params;
      if (purposes.includes(
        "stacks"
        /* Stacks */
      ) || purposes.includes(
        "starknet"
        /* Starknet */
      ) || purposes.includes(
        "spark"
        /* Spark */
      )) {
        throw new Error("Only bitcoin addresses are supported");
      }
      const accounts = await window.unisat.requestAccounts();
      const publicKey = await window.unisat.getPublicKey();
      const address = accounts[0];
      const addressType = getAddressInfo(accounts[0]).type;
      const pk = addressType === AddressType.p2tr ? publicKey.slice(2) : publicKey;
      const paymentAddress = {
        address,
        publicKey: pk,
        addressType,
        purpose: "payment",
        walletType: "software"
      };
      const ordinalsAddress = {
        address,
        publicKey: pk,
        addressType,
        purpose: "ordinals",
        walletType: "software"
      };
      const response = [];
      if (purposes.includes(
        "payment"
        /* Payment */
      )) {
        response.push({ ...paymentAddress, walletType: "software" });
      }
      if (purposes.includes(
        "ordinals"
        /* Ordinals */
      )) {
        response.push({ ...ordinalsAddress, walletType: "software" });
      }
      return response;
    }
    async signMessage(params) {
      const { message: message2, address } = params;
      const addressType = getAddressInfo(address).type;
      const Bip322supportedTypes = [AddressType.p2wpkh, AddressType.p2tr];
      if (Bip322supportedTypes.includes(addressType)) {
        const response2 = await window.unisat.signMessage(message2, "bip322-simple");
        return {
          address,
          messageHash: "",
          signature: response2,
          protocol: "BIP322"
          /* BIP322 */
        };
      }
      const response = await window.unisat.signMessage(message2, "ecdsa");
      return {
        address,
        messageHash: "",
        signature: response,
        protocol: "ECDSA"
        /* ECDSA */
      };
    }
    async sendTransfer(params) {
      const { recipients } = params;
      if (recipients.length > 1) {
        throw new Error("Only one recipient is supported by this wallet provider");
      }
      const txid = await window.unisat.sendBitcoin(recipients[0].address, recipients[0].amount);
      return {
        txid
      };
    }
    async signPsbt(params) {
      const { psbt, signInputs, broadcast } = params;
      const psbtHex = import_buffer.Buffer.from(psbt, "base64").toString("hex");
      const signedPsbt = await window.unisat.signPsbt(psbtHex, {
        autoFinalized: broadcast,
        toSignInputs: convertSignInputsToInputType(signInputs)
      });
      const signedPsbtBase64 = import_buffer.Buffer.from(signedPsbt, "hex").toString("base64");
      let txid;
      if (broadcast) {
        txid = await window.unisat.pushPsbt(signedPsbt);
      }
      return {
        psbt: signedPsbtBase64,
        txid
      };
    }
  };
  var FordefiAdapter = class extends SatsConnectAdapter {
    constructor() {
      super(...arguments);
      __publicField(this, "id", DefaultAdaptersInfo.fordefi.id);
      __publicField(this, "requestInternal", async (method, params) => {
        const provider = getProviderById(this.id);
        if (!provider) {
          throw new Error("no wallet provider was found");
        }
        if (!method) {
          throw new Error("A wallet method is required");
        }
        return await provider.request(method, params);
      });
      __publicField(this, "addListener", ({ eventName, cb }) => {
        const provider = getProviderById(this.id);
        if (!provider) {
          throw new Error("no wallet provider was found");
        }
        if (!provider.addListener) {
          console.error(
            `The wallet provider you are using does not support the addListener method. Please update your wallet provider.`
          );
          return () => {
          };
        }
        return provider.addListener(eventName, cb);
      });
    }
  };
  var BaseAdapter = class extends SatsConnectAdapter {
    constructor(providerId) {
      super();
      __publicField(this, "id", "");
      __publicField(this, "requestInternal", async (method, params) => {
        return request(method, params, this.id);
      });
      __publicField(this, "addListener", (..._args) => {
        throw new Error("Method not supported for `BaseAdapter`.");
      });
      this.id = providerId;
    }
  };
  var DefaultAdaptersInfo = {
    fordefi: {
      id: "FordefiProviders.UtxoProvider",
      name: "Fordefi",
      webUrl: "https://www.fordefi.com/",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/fordefi/hcmehenccjdmfbojapcbcofkgdpbnlle",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzEzNDk0XzY2MjU0KSI+CjxwYXRoIGQ9Ik0xMC44NzY5IDE1LjYzNzhIMS41VjE4LjM5OUMxLjUgMTkuODAxMyAyLjYzNDQ3IDIwLjkzOCA0LjAzMzkyIDIwLjkzOEg4LjI0OTkyTDEwLjg3NjkgMTUuNjM3OFoiIGZpbGw9IiM3OTk0RkYiLz4KPHBhdGggZD0iTTEuNSA5Ljc3NTUxSDE5LjA1MTZMMTcuMDEzOSAxMy44NzExSDEuNVY5Ljc3NTUxWiIgZmlsbD0iIzQ4NkRGRiIvPgo8cGF0aCBkPSJNNy42NTk5NiAzSDEuNTI0NDFWOC4wMDcwNEgyMi40NjEyVjNIMTYuMzI1NlY2LjczOTQ0SDE1LjA2MDZWM0g4LjkyNTAyVjYuNzM5NDRINy42NTk5NlYzWiIgZmlsbD0iIzVDRDFGQSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzEzNDk0XzY2MjU0Ij4KPHJlY3Qgd2lkdGg9IjIxIiBoZWlnaHQ9IjE4IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS41IDMpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg=="
    },
    xverse: {
      id: "XverseProviders.BitcoinProvider",
      name: "Xverse",
      webUrl: "https://www.xverse.app/",
      googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse",
      iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyIiBoZWlnaHQ9IjEwMiIgdmlld0JveD0iMCAwIDEwMiAxMDIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJJY29uX0FydCAoRWRpdCBNZSkiPgo8cmVjdCB3aWR0aD0iMTAyIiBoZWlnaHQ9IjEwMiIgZmlsbD0iIzE4MTgxOCIvPgo8ZyBpZD0iTG9nby9FbWJsZW0iIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8yMF8xMjIzKSI+CjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik03NC42NTQyIDczLjg4ODNWNjUuMjMxMkM3NC42NTQyIDY0Ljg4OCA3NC41MTc3IDY0LjU2MDYgNzQuMjc0NSA2NC4zMTc0TDM3LjQzOTcgMjcuNDgyNUMzNy4xOTY1IDI3LjIzOTIgMzYuODY5MSAyNy4xMDI4IDM2LjUyNTggMjcuMTAyOEgyNy44NjlDMjcuNDQxNiAyNy4xMDI4IDI3LjA5MzggMjcuNDUwNiAyNy4wOTM4IDI3Ljg3OFYzNS45MjExQzI3LjA5MzggMzYuMjY0NCAyNy4yMzAyIDM2LjU5MTcgMjcuNDczNCAzNi44MzVMNDAuNjk1MiA1MC4wNTY3QzQwLjk5NzUgNTAuMzU5MSA0MC45OTc1IDUwLjg1MDEgNDAuNjk1MiA1MS4xNTI0TDI3LjMyMTEgNjQuNTI2NUMyNy4xNzU2IDY0LjY3MiAyNy4wOTM4IDY0Ljg2OTggMjcuMDkzOCA2NS4wNzQ0VjczLjg4ODNDMjcuMDkzOCA3NC4zMTUzIDI3LjQ0MTYgNzQuNjYzNSAyNy44NjkgNzQuNjYzNUg0Mi4zMzQyQzQyLjc2MTYgNzQuNjYzNSA0My4xMDk0IDc0LjMxNTMgNDMuMTA5NCA3My44ODgzVjY4LjY5NThDNDMuMTA5NCA2OC40OTEyIDQzLjE5MTIgNjguMjkzNSA0My4zMzY4IDY4LjE0NzlMNTAuNTExNCA2MC45NzMzQzUwLjgxMzggNjAuNjcwOSA1MS4zMDQ4IDYwLjY3MDkgNTEuNjA3MiA2MC45NzMzTDY0LjkxOTggNzQuMjg2MUM2NS4xNjMxIDc0LjUyOTMgNjUuNDkwNCA3NC42NjU4IDY1LjgzMzcgNzQuNjY1OEg3My44NzY3Qzc0LjMwNDIgNzQuNjY1OCA3NC42NTE5IDc0LjMxNzYgNzQuNjUxOSA3My44OTA2TDc0LjY1NDIgNzMuODg4M1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGlkPSJWZWN0b3JfMiIgZD0iTTU1LjM1OCAzOC41NjcySDYyLjYwMzFDNjMuMDMyOCAzOC41NjcyIDYzLjM4MjkgMzguOTE3MyA2My4zODI5IDM5LjM0NjlWNDYuNTkyMUM2My4zODI5IDQ3LjI4NzcgNjQuMjI0IDQ3LjYzNTUgNjQuNzE1MSA0Ny4xNDIyTDc0LjY1NDEgMzcuMTg3M0M3NC43OTk0IDM3LjA0MTggNzQuODgxNiAzNi44NDQgNzQuODgxNiAzNi42MzcxVjI3LjkxODlDNzQuODgxNiAyNy40ODkyIDc0LjUzMzQgMjcuMTM5MSA3NC4xMDE3IDI3LjEzOTFMNjUuMjUzOCAyNy4xMjc3QzY1LjA0NyAyNy4xMjc3IDY0Ljg0OTIgMjcuMjA5NiA2NC43MDE0IDI3LjM1NTFMNTQuODA1NiAzNy4yMzVDNTQuMzE0NSAzNy43MjYgNTQuNjYyMyAzOC41NjcyIDU1LjM1NTcgMzguNTY3Mkg1NS4zNThaIiBmaWxsPSIjRUU3QTMwIi8+CjwvZz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8yMF8xMjIzIj4KPHJlY3Qgd2lkdGg9IjQ3LjgxMjUiIGhlaWdodD0iNDcuODEyNSIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI3LjA5MzggMjcuMDkzOCkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K"
    },
    unisat: {
      id: "unisat",
      name: "Unisat",
      webUrl: "https://unisat.io/",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE4MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiBmaWxsPSJibGFjayIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMTAwNTBfNDE3MSkiPgo8cGF0aCBkPSJNMTEzLjY2IDI5LjI4OTdMMTQzLjk3IDU5LjMwOTdDMTQ2LjU1IDYxLjg1OTcgMTQ3LjgyIDY0LjQzOTcgMTQ3Ljc4IDY3LjAzOTdDMTQ3Ljc0IDY5LjYzOTcgMTQ2LjYzIDcyLjAwOTcgMTQ0LjQ2IDc0LjE1OTdDMTQyLjE5IDc2LjQwOTcgMTM5Ljc0IDc3LjU0OTcgMTM3LjEyIDc3LjU5OTdDMTM0LjUgNzcuNjM5NyAxMzEuOSA3Ni4zNzk3IDEyOS4zMiA3My44Mjk3TDk4LjMxOTkgNDMuMTI5N0M5NC43OTk5IDM5LjYzOTcgOTEuMzk5OSAzNy4xNjk3IDg4LjEyOTkgMzUuNzE5N0M4NC44NTk5IDM0LjI2OTcgODEuNDE5OSAzNC4wMzk3IDc3LjgxOTkgMzUuMDM5N0M3NC4yMDk5IDM2LjAyOTcgNzAuMzM5OSAzOC41Nzk3IDY2LjE4OTkgNDIuNjc5N0M2MC40Njk5IDQ4LjM0OTcgNTcuNzM5OSA1My42Njk3IDU4LjAxOTkgNTguNjM5N0M1OC4yOTk5IDYzLjYwOTcgNjEuMTM5OSA2OC43Njk3IDY2LjUyOTkgNzQuMDk5N0w5Ny43Nzk5IDEwNS4wNkMxMDAuMzkgMTA3LjY0IDEwMS42NyAxMTAuMjIgMTAxLjYzIDExMi43OEMxMDEuNTkgMTE1LjM1IDEwMC40NyAxMTcuNzIgOTguMjU5OSAxMTkuOTFDOTYuMDU5OSAxMjIuMDkgOTMuNjI5OSAxMjMuMjMgOTAuOTg5OSAxMjMuMzJDODguMzQ5OSAxMjMuNDEgODUuNzE5OSAxMjIuMTYgODMuMTE5OSAxMTkuNThMNTIuODA5OSA4OS41NTk3QzQ3Ljg3OTkgODQuNjc5NyA0NC4zMTk5IDgwLjA1OTcgNDIuMTI5OSA3NS42OTk3QzM5LjkzOTkgNzEuMzM5NyAzOS4xMTk5IDY2LjQwOTcgMzkuNjg5OSA2MC45MDk3QzQwLjE5OTkgNTYuMTk5NyA0MS43MDk5IDUxLjYzOTcgNDQuMjI5OSA0Ny4yMTk3QzQ2LjczOTkgNDIuNzk5NyA1MC4zMzk5IDM4LjI3OTcgNTUuMDA5OSAzMy42NDk3QzYwLjU2OTkgMjguMTM5NyA2NS44Nzk5IDIzLjkxOTcgNzAuOTM5OSAyMC45Nzk3Qzc1Ljk4OTkgMTguMDM5NyA4MC44Nzk5IDE2LjQwOTcgODUuNTk5OSAxNi4wNjk3QzkwLjMyOTkgMTUuNzI5NyA5NC45ODk5IDE2LjY2OTcgOTkuNTk5OSAxOC44ODk3QzEwNC4yMSAyMS4xMDk3IDEwOC44OSAyNC41Njk3IDExMy42NSAyOS4yODk3SDExMy42NloiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xMDA1MF80MTcxKSIvPgo8cGF0aCBkPSJNNjYuMTA5OSAxNTAuNDJMMzUuODA5OSAxMjAuNEMzMy4yMjk5IDExNy44NCAzMS45NTk5IDExNS4yNyAzMS45OTk5IDExMi42N0MzMi4wMzk5IDExMC4wNyAzMy4xNDk5IDEwNy43IDM1LjMxOTkgMTA1LjU1QzM3LjU4OTkgMTAzLjMgNDAuMDM5OSAxMDIuMTYgNDIuNjU5OSAxMDIuMTFDNDUuMjc5OSAxMDIuMDcgNDcuODc5OSAxMDMuMzIgNTAuNDU5OSAxMDUuODhMODEuNDQ5OSAxMzYuNThDODQuOTc5OSAxNDAuMDcgODguMzY5OSAxNDIuNTQgOTEuNjM5OSAxNDMuOTlDOTQuOTA5OSAxNDUuNDQgOTguMzQ5OSAxNDUuNjYgMTAxLjk2IDE0NC42N0MxMDUuNTcgMTQzLjY4IDEwOS40NCAxNDEuMTMgMTEzLjU5IDEzNy4wMkMxMTkuMzEgMTMxLjM1IDEyMi4wNCAxMjYuMDMgMTIxLjc2IDEyMS4wNkMxMjEuNDggMTE2LjA5IDExOC42NCAxMTAuOTMgMTEzLjI1IDEwNS41OUw5Ni41OTk5IDg5LjI0MDFDOTMuOTg5OSA4Ni42NjAxIDkyLjcwOTkgODQuMDgwMSA5Mi43NDk5IDgxLjUyMDFDOTIuNzg5OSA3OC45NTAxIDkzLjkwOTkgNzYuNTgwMSA5Ni4xMTk5IDc0LjM5MDFDOTguMzE5OSA3Mi4yMTAxIDEwMC43NSA3MS4wNzAxIDEwMy4zOSA3MC45ODAxQzEwNi4wMyA3MC44OTAxIDEwOC42NiA3Mi4xNDAxIDExMS4yNiA3NC43MjAxTDEyNi45NiA5MC4xMzAxQzEzMS44OSA5NS4wMTAxIDEzNS40NSA5OS42MzAxIDEzNy42NCAxMDMuOTlDMTM5LjgzIDEwOC4zNSAxNDAuNjUgMTEzLjI4IDE0MC4wOCAxMTguNzhDMTM5LjU3IDEyMy40OSAxMzguMDYgMTI4LjA1IDEzNS41NCAxMzIuNDdDMTMzLjAzIDEzNi44OSAxMjkuNDMgMTQxLjQxIDEyNC43NiAxNDYuMDRDMTE5LjIgMTUxLjU1IDExMy44OSAxNTUuNzcgMTA4LjgzIDE1OC43MUMxMDMuNzcgMTYxLjY1IDk4Ljg3OTkgMTYzLjI5IDk0LjE0OTkgMTYzLjYzQzg5LjQxOTkgMTYzLjk3IDg0Ljc1OTkgMTYzLjAzIDgwLjE0OTkgMTYwLjgxQzc1LjUzOTkgMTU4LjU5IDcwLjg1OTkgMTU1LjEzIDY2LjA5OTkgMTUwLjQxTDY2LjEwOTkgMTUwLjQyWiIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzEwMDUwXzQxNzEpIi8+CjxwYXRoIGQ9Ik04NS4wMDk5IDcyLjk1OTJDOTEuMTU2OCA3Mi45NTkyIDk2LjEzOTkgNjcuOTc2MSA5Ni4xMzk5IDYxLjgyOTJDOTYuMTM5OSA1NS42ODIzIDkxLjE1NjggNTAuNjk5MiA4NS4wMDk5IDUwLjY5OTJDNzguODYzIDUwLjY5OTIgNzMuODc5OSA1NS42ODIzIDczLjg3OTkgNjEuODI5MkM3My44Nzk5IDY3Ljk3NjEgNzguODYzIDcyLjk1OTIgODUuMDA5OSA3Mi45NTkyWiIgZmlsbD0idXJsKCNwYWludDJfcmFkaWFsXzEwMDUwXzQxNzEpIi8+CjwvZz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8xMDA1MF80MTcxIiB4MT0iMTM4Ljk4NSIgeTE9IjQ2Ljc3OTUiIHgyPSI0NS4wNTI5IiB5Mj0iODguNTIzMyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMjAxQzFCIi8+CjxzdG9wIG9mZnNldD0iMC4zNiIgc3RvcC1jb2xvcj0iIzc3MzkwRCIvPgo8c3RvcCBvZmZzZXQ9IjAuNjciIHN0b3AtY29sb3I9IiNFQTgxMDEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRjRCODUyIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8xMDA1MF80MTcxIiB4MT0iNDMuMzgxMiIgeTE9IjEzNC4xNjciIHgyPSIxNTIuMjMxIiB5Mj0iMTAxLjc3MSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMUYxRDFDIi8+CjxzdG9wIG9mZnNldD0iMC4zNyIgc3RvcC1jb2xvcj0iIzc3MzkwRCIvPgo8c3RvcCBvZmZzZXQ9IjAuNjciIHN0b3AtY29sb3I9IiNFQTgxMDEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRjRGQjUyIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQyX3JhZGlhbF8xMDA1MF80MTcxIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDg1LjAwOTkgNjEuODM5Mikgc2NhbGUoMTEuMTMpIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0Y0Qjg1MiIvPgo8c3RvcCBvZmZzZXQ9IjAuMzMiIHN0b3AtY29sb3I9IiNFQTgxMDEiLz4KPHN0b3Agb2Zmc2V0PSIwLjY0IiBzdG9wLWNvbG9yPSIjNzczOTBEIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzIxMUMxRCIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzEwMDUwXzQxNzEiPgo8cmVjdCB3aWR0aD0iMTE1Ljc3IiBoZWlnaHQ9IjE0Ny43IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzIgMTYpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg=="
    }
  };
  var defaultAdapters = {
    [DefaultAdaptersInfo.fordefi.id]: FordefiAdapter,
    [DefaultAdaptersInfo.xverse.id]: XverseAdapter,
    [DefaultAdaptersInfo.unisat.id]: UnisatAdapter
  };

  // node_modules/sats-connect/node_modules/@sats-connect/make-default-provider-config/node_modules/@sats-connect/ui/dist/index.js
  var Ot = [
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "disabled",
    "formnovalidate",
    "hidden",
    "indeterminate",
    "inert",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "seamless",
    "selected"
  ];
  var jt = /* @__PURE__ */ new Set([
    "className",
    "value",
    "readOnly",
    "formNoValidate",
    "isMap",
    "noModule",
    "playsInline",
    ...Ot
  ]);

  // node_modules/bowser/bowser.mjs
  var BROWSER_ALIASES_MAP = {
    AmazonBot: "amazonbot",
    "Amazon Silk": "amazon_silk",
    "Android Browser": "android",
    BaiduSpider: "baiduspider",
    Bada: "bada",
    BingCrawler: "bingcrawler",
    Brave: "brave",
    BlackBerry: "blackberry",
    "ChatGPT-User": "chatgpt_user",
    Chrome: "chrome",
    ClaudeBot: "claudebot",
    Chromium: "chromium",
    Diffbot: "diffbot",
    DuckDuckBot: "duckduckbot",
    DuckDuckGo: "duckduckgo",
    Electron: "electron",
    Epiphany: "epiphany",
    FacebookExternalHit: "facebookexternalhit",
    Firefox: "firefox",
    Focus: "focus",
    Generic: "generic",
    "Google Search": "google_search",
    Googlebot: "googlebot",
    GPTBot: "gptbot",
    "HeyTap Browser": "heytap",
    "Internet Explorer": "ie",
    InternetArchiveCrawler: "internetarchivecrawler",
    "K-Meleon": "k_meleon",
    Ladybird: "ladybird",
    LibreWolf: "librewolf",
    Linespider: "linespider",
    Maxthon: "maxthon",
    "Meta-ExternalAds": "meta_externalads",
    "Meta-ExternalAgent": "meta_externalagent",
    "Meta-ExternalFetcher": "meta_externalfetcher",
    "Meta-WebIndexer": "meta_webindexer",
    "Microsoft Edge": "edge",
    "MZ Browser": "mz",
    "NAVER Whale Browser": "naver",
    "OAI-SearchBot": "oai_searchbot",
    Omgilibot: "omgilibot",
    Opera: "opera",
    "Opera Coast": "opera_coast",
    "Pale Moon": "pale_moon",
    PerplexityBot: "perplexitybot",
    "Perplexity-User": "perplexity_user",
    PhantomJS: "phantomjs",
    PingdomBot: "pingdombot",
    Puffin: "puffin",
    QQ: "qq",
    QQLite: "qqlite",
    QupZilla: "qupzilla",
    Roku: "roku",
    Safari: "safari",
    Sailfish: "sailfish",
    "Samsung Internet for Android": "samsung_internet",
    SlackBot: "slackbot",
    SeaMonkey: "seamonkey",
    Sleipnir: "sleipnir",
    "Sogou Browser": "sogou",
    Swing: "swing",
    Tizen: "tizen",
    "UC Browser": "uc",
    "Vivo Browser": "vivo",
    Vivaldi: "vivaldi",
    "WebOS Browser": "webos",
    WeChat: "wechat",
    YahooSlurp: "yahooslurp",
    "Yandex Browser": "yandex",
    YandexBot: "yandexbot",
    YouBot: "youbot"
  };
  var BROWSER_MAP = {
    amazonbot: "AmazonBot",
    amazon_silk: "Amazon Silk",
    android: "Android Browser",
    baiduspider: "BaiduSpider",
    bada: "Bada",
    bingcrawler: "BingCrawler",
    blackberry: "BlackBerry",
    brave: "Brave",
    chatgpt_user: "ChatGPT-User",
    chrome: "Chrome",
    claudebot: "ClaudeBot",
    chromium: "Chromium",
    diffbot: "Diffbot",
    duckduckbot: "DuckDuckBot",
    duckduckgo: "DuckDuckGo",
    edge: "Microsoft Edge",
    electron: "Electron",
    epiphany: "Epiphany",
    facebookexternalhit: "FacebookExternalHit",
    firefox: "Firefox",
    focus: "Focus",
    generic: "Generic",
    google_search: "Google Search",
    googlebot: "Googlebot",
    gptbot: "GPTBot",
    heytap: "HeyTap Browser",
    ie: "Internet Explorer",
    internetarchivecrawler: "InternetArchiveCrawler",
    k_meleon: "K-Meleon",
    ladybird: "Ladybird",
    librewolf: "LibreWolf",
    linespider: "Linespider",
    maxthon: "Maxthon",
    meta_externalads: "Meta-ExternalAds",
    meta_externalagent: "Meta-ExternalAgent",
    meta_externalfetcher: "Meta-ExternalFetcher",
    meta_webindexer: "Meta-WebIndexer",
    mz: "MZ Browser",
    naver: "NAVER Whale Browser",
    oai_searchbot: "OAI-SearchBot",
    omgilibot: "Omgilibot",
    opera: "Opera",
    opera_coast: "Opera Coast",
    pale_moon: "Pale Moon",
    perplexitybot: "PerplexityBot",
    perplexity_user: "Perplexity-User",
    phantomjs: "PhantomJS",
    pingdombot: "PingdomBot",
    puffin: "Puffin",
    qq: "QQ Browser",
    qqlite: "QQ Browser Lite",
    qupzilla: "QupZilla",
    roku: "Roku",
    safari: "Safari",
    sailfish: "Sailfish",
    samsung_internet: "Samsung Internet for Android",
    seamonkey: "SeaMonkey",
    slackbot: "SlackBot",
    sleipnir: "Sleipnir",
    sogou: "Sogou Browser",
    swing: "Swing",
    tizen: "Tizen",
    uc: "UC Browser",
    vivo: "Vivo Browser",
    vivaldi: "Vivaldi",
    webos: "WebOS Browser",
    wechat: "WeChat",
    yahooslurp: "YahooSlurp",
    yandex: "Yandex Browser",
    yandexbot: "YandexBot",
    youbot: "YouBot"
  };
  var PLATFORMS_MAP = {
    bot: "bot",
    desktop: "desktop",
    mobile: "mobile",
    tablet: "tablet",
    tv: "tv"
  };
  var OS_MAP = {
    Android: "Android",
    Bada: "Bada",
    BlackBerry: "BlackBerry",
    ChromeOS: "Chrome OS",
    HarmonyOS: "HarmonyOS",
    iOS: "iOS",
    Linux: "Linux",
    MacOS: "macOS",
    PlayStation4: "PlayStation 4",
    Roku: "Roku",
    Tizen: "Tizen",
    WebOS: "WebOS",
    Windows: "Windows",
    WindowsPhone: "Windows Phone"
  };
  var ENGINE_MAP = {
    Blink: "Blink",
    EdgeHTML: "EdgeHTML",
    Gecko: "Gecko",
    LibWeb: "LibWeb",
    Presto: "Presto",
    Trident: "Trident",
    WebKit: "WebKit"
  };
  var Utils = /* @__PURE__ */ (function() {
    function Utils2() {
    }
    Utils2.getFirstMatch = function getFirstMatch(regexp, ua) {
      var match = ua.match(regexp);
      return match && match.length > 0 && match[1] || "";
    };
    Utils2.getSecondMatch = function getSecondMatch(regexp, ua) {
      var match = ua.match(regexp);
      return match && match.length > 1 && match[2] || "";
    };
    Utils2.matchAndReturnConst = function matchAndReturnConst(regexp, ua, _const) {
      if (regexp.test(ua)) return _const;
    };
    Utils2.isFirefoxOnIpad = function isFirefoxOnIpad(ua) {
      var macIndex = ua.indexOf("Macintosh");
      if (macIndex === -1) return false;
      var fxiosIndex = ua.indexOf(" FxiOS", macIndex + 9);
      return fxiosIndex !== -1 && ua.indexOf("/", fxiosIndex + 6) !== -1;
    };
    Utils2.getWindowsVersionName = function getWindowsVersionName(version) {
      switch (version) {
        case "NT":
          return "NT";
        case "XP":
          return "XP";
        case "NT 5.0":
          return "2000";
        case "NT 5.1":
          return "XP";
        case "NT 5.2":
          return "2003";
        case "NT 6.0":
          return "Vista";
        case "NT 6.1":
          return "7";
        case "NT 6.2":
          return "8";
        case "NT 6.3":
          return "8.1";
        case "NT 10.0":
          return "10";
        default:
          return;
      }
    };
    Utils2.getMacOSVersionName = function getMacOSVersionName(version) {
      var v = version.split(".").splice(0, 2).map(function(s) {
        return parseInt(s, 10) || 0;
      });
      v.push(0);
      var major = v[0];
      var minor = v[1];
      if (major === 10) switch (minor) {
        case 5:
          return "Leopard";
        case 6:
          return "Snow Leopard";
        case 7:
          return "Lion";
        case 8:
          return "Mountain Lion";
        case 9:
          return "Mavericks";
        case 10:
          return "Yosemite";
        case 11:
          return "El Capitan";
        case 12:
          return "Sierra";
        case 13:
          return "High Sierra";
        case 14:
          return "Mojave";
        case 15:
          return "Catalina";
        default:
          return;
      }
      switch (major) {
        case 11:
          return "Big Sur";
        case 12:
          return "Monterey";
        case 13:
          return "Ventura";
        case 14:
          return "Sonoma";
        case 15:
          return "Sequoia";
        default:
          return;
      }
    };
    Utils2.getAndroidVersionName = function getAndroidVersionName(version) {
      var v = version.split(".").splice(0, 2).map(function(s) {
        return parseInt(s, 10) || 0;
      });
      v.push(0);
      if (v[0] === 1 && v[1] < 5) return void 0;
      if (v[0] === 1 && v[1] < 6) return "Cupcake";
      if (v[0] === 1 && v[1] >= 6) return "Donut";
      if (v[0] === 2 && v[1] < 2) return "Eclair";
      if (v[0] === 2 && v[1] === 2) return "Froyo";
      if (v[0] === 2 && v[1] > 2) return "Gingerbread";
      if (v[0] === 3) return "Honeycomb";
      if (v[0] === 4 && v[1] < 1) return "Ice Cream Sandwich";
      if (v[0] === 4 && v[1] < 4) return "Jelly Bean";
      if (v[0] === 4 && v[1] >= 4) return "KitKat";
      if (v[0] === 5) return "Lollipop";
      if (v[0] === 6) return "Marshmallow";
      if (v[0] === 7) return "Nougat";
      if (v[0] === 8) return "Oreo";
      if (v[0] === 9) return "Pie";
    };
    Utils2.getVersionPrecision = function getVersionPrecision(version) {
      return version.split(".").length;
    };
    Utils2.compareVersions = function compareVersions(versionA, versionB, isLoose) {
      if (isLoose === void 0) isLoose = false;
      var versionAPrecision = Utils2.getVersionPrecision(versionA);
      var versionBPrecision = Utils2.getVersionPrecision(versionB);
      var precision = Math.max(versionAPrecision, versionBPrecision);
      var lastPrecision = 0;
      var chunks = Utils2.map([versionA, versionB], function(version) {
        var delta = precision - Utils2.getVersionPrecision(version);
        var _version = version + new Array(delta + 1).join(".0");
        return Utils2.map(_version.split("."), function(chunk) {
          return new Array(20 - chunk.length).join("0") + chunk;
        }).reverse();
      });
      if (isLoose) lastPrecision = precision - Math.min(versionAPrecision, versionBPrecision);
      precision -= 1;
      while (precision >= lastPrecision) {
        if (chunks[0][precision] > chunks[1][precision]) return 1;
        if (chunks[0][precision] === chunks[1][precision]) {
          if (precision === lastPrecision) return 0;
          precision -= 1;
        } else if (chunks[0][precision] < chunks[1][precision]) return -1;
      }
    };
    Utils2.map = function map(arr, iterator2) {
      var result = [];
      var i;
      if (Array.prototype.map) return Array.prototype.map.call(arr, iterator2);
      for (i = 0; i < arr.length; i += 1) result.push(iterator2(arr[i]));
      return result;
    };
    Utils2.find = function find(arr, predicate) {
      var i;
      var l;
      if (Array.prototype.find) return Array.prototype.find.call(arr, predicate);
      for (i = 0, l = arr.length; i < l; i += 1) {
        var value = arr[i];
        if (predicate(value, i)) return value;
      }
    };
    Utils2.assign = function assign(obj) {
      var result = obj;
      var i;
      var l;
      for (var _len = arguments.length, assigners = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) assigners[_key - 1] = arguments[_key];
      if (Object.assign) return Object.assign.apply(Object, [obj].concat(assigners));
      var _loop = function _loop2() {
        var assigner = assigners[i];
        if (typeof assigner === "object" && assigner !== null) Object.keys(assigner).forEach(function(key) {
          result[key] = assigner[key];
        });
      };
      for (i = 0, l = assigners.length; i < l; i += 1) _loop();
      return obj;
    };
    Utils2.getBrowserAlias = function getBrowserAlias(browserName) {
      return BROWSER_ALIASES_MAP[browserName];
    };
    Utils2.getBrowserTypeByAlias = function getBrowserTypeByAlias(browserAlias) {
      return BROWSER_MAP[browserAlias] || "";
    };
    return Utils2;
  })();
  var commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;
  var browsersList = [{
    test: [/gptbot/i],
    describe: function describe(ua) {
      var browser = {
        name: "GPTBot"
      };
      var version = Utils.getFirstMatch(/gptbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/chatgpt-user/i],
    describe: function describe2(ua) {
      var browser = {
        name: "ChatGPT-User"
      };
      var version = Utils.getFirstMatch(/chatgpt-user\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/oai-searchbot/i],
    describe: function describe3(ua) {
      var browser = {
        name: "OAI-SearchBot"
      };
      var version = Utils.getFirstMatch(/oai-searchbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/claudebot/i, /claude-web/i, /claude-user/i, /claude-searchbot/i],
    describe: function describe4(ua) {
      var browser = {
        name: "ClaudeBot"
      };
      var version = Utils.getFirstMatch(/(?:claudebot|claude-web|claude-user|claude-searchbot)\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/omgilibot/i, /webzio-extended/i],
    describe: function describe5(ua) {
      var browser = {
        name: "Omgilibot"
      };
      var version = Utils.getFirstMatch(/(?:omgilibot|webzio-extended)\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/diffbot/i],
    describe: function describe6(ua) {
      var browser = {
        name: "Diffbot"
      };
      var version = Utils.getFirstMatch(/diffbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/perplexitybot/i],
    describe: function describe7(ua) {
      var browser = {
        name: "PerplexityBot"
      };
      var version = Utils.getFirstMatch(/perplexitybot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/perplexity-user/i],
    describe: function describe8(ua) {
      var browser = {
        name: "Perplexity-User"
      };
      var version = Utils.getFirstMatch(/perplexity-user\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/youbot/i],
    describe: function describe9(ua) {
      var browser = {
        name: "YouBot"
      };
      var version = Utils.getFirstMatch(/youbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/meta-webindexer/i],
    describe: function describe10(ua) {
      var browser = {
        name: "Meta-WebIndexer"
      };
      var version = Utils.getFirstMatch(/meta-webindexer\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/meta-externalads/i],
    describe: function describe11(ua) {
      var browser = {
        name: "Meta-ExternalAds"
      };
      var version = Utils.getFirstMatch(/meta-externalads\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/meta-externalagent/i],
    describe: function describe12(ua) {
      var browser = {
        name: "Meta-ExternalAgent"
      };
      var version = Utils.getFirstMatch(/meta-externalagent\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/meta-externalfetcher/i],
    describe: function describe13(ua) {
      var browser = {
        name: "Meta-ExternalFetcher"
      };
      var version = Utils.getFirstMatch(/meta-externalfetcher\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/googlebot/i],
    describe: function describe14(ua) {
      var browser = {
        name: "Googlebot"
      };
      var version = Utils.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/linespider/i],
    describe: function describe15(ua) {
      var browser = {
        name: "Linespider"
      };
      var version = Utils.getFirstMatch(/(?:linespider)(?:-[-\w]{1,64})?[\s/](\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/amazonbot/i],
    describe: function describe16(ua) {
      var browser = {
        name: "AmazonBot"
      };
      var version = Utils.getFirstMatch(/amazonbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/bingbot/i],
    describe: function describe17(ua) {
      var browser = {
        name: "BingCrawler"
      };
      var version = Utils.getFirstMatch(/bingbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/baiduspider/i],
    describe: function describe18(ua) {
      var browser = {
        name: "BaiduSpider"
      };
      var version = Utils.getFirstMatch(/baiduspider\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/duckduckbot/i],
    describe: function describe19(ua) {
      var browser = {
        name: "DuckDuckBot"
      };
      var version = Utils.getFirstMatch(/duckduckbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/ia_archiver/i],
    describe: function describe20(ua) {
      var browser = {
        name: "InternetArchiveCrawler"
      };
      var version = Utils.getFirstMatch(/ia_archiver\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/facebookexternalhit/i, /facebookcatalog/i],
    describe: function describe21() {
      return {
        name: "FacebookExternalHit"
      };
    }
  }, {
    test: [/slackbot/i, /slack-imgProxy/i],
    describe: function describe22(ua) {
      var browser = {
        name: "SlackBot"
      };
      var version = Utils.getFirstMatch(/(?:slackbot|slack-imgproxy)(?:-[-\w]{1,64})?[\s/](\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/yahoo!?[\s/]*slurp/i],
    describe: function describe23() {
      return {
        name: "YahooSlurp"
      };
    }
  }, {
    test: [/yandexbot/i, /yandexmobilebot/i],
    describe: function describe24() {
      return {
        name: "YandexBot"
      };
    }
  }, {
    test: [/pingdom/i],
    describe: function describe25() {
      return {
        name: "PingdomBot"
      };
    }
  }, {
    test: [/opera/i],
    describe: function describe26(ua) {
      var browser = {
        name: "Opera"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/opr\/|opios/i],
    describe: function describe27(ua) {
      var browser = {
        name: "Opera"
      };
      var version = Utils.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/SamsungBrowser/i],
    describe: function describe28(ua) {
      var browser = {
        name: "Samsung Internet for Android"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/Whale/i],
    describe: function describe29(ua) {
      var browser = {
        name: "NAVER Whale Browser"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/PaleMoon/i],
    describe: function describe30(ua) {
      var browser = {
        name: "Pale Moon"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:PaleMoon)[\s/](\d+(?:\.\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/HeyTapBrowser/i],
    describe: function describe31(ua) {
      var browser = {
        name: "HeyTap Browser"
      };
      var version = Utils.getFirstMatch(/(?:HeyTapBrowser)[\s/](\d+(?:\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/VivoBrowser/i],
    describe: function describe32(ua) {
      var browser = {
        name: "Vivo Browser"
      };
      var version = Utils.getFirstMatch(/(?:VivoBrowser)[\s/](\d+(?:\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/MZBrowser/i],
    describe: function describe33(ua) {
      var browser = {
        name: "MZ Browser"
      };
      var version = Utils.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/focus/i],
    describe: function describe34(ua) {
      var browser = {
        name: "Focus"
      };
      var version = Utils.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/swing/i],
    describe: function describe35(ua) {
      var browser = {
        name: "Swing"
      };
      var version = Utils.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/coast/i],
    describe: function describe36(ua) {
      var browser = {
        name: "Opera Coast"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/opt\/\d+(?:.?_?\d+)+/i],
    describe: function describe37(ua) {
      var browser = {
        name: "Opera Touch"
      };
      var version = Utils.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/yabrowser/i],
    describe: function describe38(ua) {
      var browser = {
        name: "Yandex Browser"
      };
      var version = Utils.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/ucbrowser/i],
    describe: function describe39(ua) {
      var browser = {
        name: "UC Browser"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/Maxthon|mxios/i],
    describe: function describe40(ua) {
      var browser = {
        name: "Maxthon"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/epiphany/i],
    describe: function describe41(ua) {
      var browser = {
        name: "Epiphany"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/puffin/i],
    describe: function describe42(ua) {
      var browser = {
        name: "Puffin"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/sleipnir/i],
    describe: function describe43(ua) {
      var browser = {
        name: "Sleipnir"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/k-meleon/i],
    describe: function describe44(ua) {
      var browser = {
        name: "K-Meleon"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/micromessenger/i],
    describe: function describe45(ua) {
      var browser = {
        name: "WeChat"
      };
      var version = Utils.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/qqbrowser/i],
    describe: function describe46(ua) {
      var browser = {
        name: /qqbrowserlite/i.test(ua) ? "QQ Browser Lite" : "QQ Browser"
      };
      var version = Utils.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/msie|trident/i],
    describe: function describe47(ua) {
      var browser = {
        name: "Internet Explorer"
      };
      var version = Utils.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/\sedg\//i],
    describe: function describe48(ua) {
      var browser = {
        name: "Microsoft Edge"
      };
      var version = Utils.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/edg([ea]|ios)\//i],
    describe: function describe49(ua) {
      var browser = {
        name: "Microsoft Edge"
      };
      var version = Utils.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: function test2(parser) {
      if (parser.hasBrand("Vivaldi")) return true;
      return parser.test(/vivaldi/i);
    },
    describe: function describe50(ua, parser) {
      var browser = {
        name: "Vivaldi"
      };
      if (parser) {
        var hintsVersion = parser.getBrandVersion("Vivaldi");
        if (hintsVersion) {
          browser.version = hintsVersion;
          return browser;
        }
      }
      var version = Utils.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/seamonkey/i],
    describe: function describe51(ua) {
      var browser = {
        name: "SeaMonkey"
      };
      var version = Utils.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/sailfish/i],
    describe: function describe52(ua) {
      var browser = {
        name: "Sailfish"
      };
      var version = Utils.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/silk/i],
    describe: function describe53(ua) {
      var browser = {
        name: "Amazon Silk"
      };
      var version = Utils.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/phantom/i],
    describe: function describe54(ua) {
      var browser = {
        name: "PhantomJS"
      };
      var version = Utils.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/slimerjs/i],
    describe: function describe55(ua) {
      var browser = {
        name: "SlimerJS"
      };
      var version = Utils.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
    describe: function describe56(ua) {
      var browser = {
        name: "BlackBerry"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/(web|hpw)[o0]s/i],
    describe: function describe57(ua) {
      var browser = {
        name: "WebOS Browser"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/bada/i],
    describe: function describe58(ua) {
      var browser = {
        name: "Bada"
      };
      var version = Utils.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/tizen/i],
    describe: function describe59(ua) {
      var browser = {
        name: "Tizen"
      };
      var version = Utils.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/qupzilla/i],
    describe: function describe60(ua) {
      var browser = {
        name: "QupZilla"
      };
      var version = Utils.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/librewolf/i],
    describe: function describe61(ua) {
      var browser = {
        name: "LibreWolf"
      };
      var version = Utils.getFirstMatch(/(?:librewolf)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/firefox|iceweasel|fxios/i],
    describe: function describe62(ua) {
      var browser = {
        name: "Firefox"
      };
      var version = Utils.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/electron/i],
    describe: function describe63(ua) {
      var browser = {
        name: "Electron"
      };
      var version = Utils.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/sogoumobilebrowser/i, /metasr/i, /se 2\.[x]/i],
    describe: function describe64(ua) {
      var browser = {
        name: "Sogou Browser"
      };
      var sogouMobileVersion = Utils.getFirstMatch(/(?:sogoumobilebrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
      var chromiumVersion = Utils.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua);
      var seVersion = Utils.getFirstMatch(/se ([\d.]+)x/i, ua);
      var version = sogouMobileVersion || chromiumVersion || seVersion;
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/MiuiBrowser/i],
    describe: function describe65(ua) {
      var browser = {
        name: "Miui"
      };
      var version = Utils.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: function test3(parser) {
      if (parser.hasBrand("DuckDuckGo")) return true;
      return parser.test(/\sDdg\/[\d.]+$/i);
    },
    describe: function describe66(ua, parser) {
      var browser = {
        name: "DuckDuckGo"
      };
      if (parser) {
        var hintsVersion = parser.getBrandVersion("DuckDuckGo");
        if (hintsVersion) {
          browser.version = hintsVersion;
          return browser;
        }
      }
      var uaVersion = Utils.getFirstMatch(/\sDdg\/([\d.]+)$/i, ua);
      if (uaVersion) browser.version = uaVersion;
      return browser;
    }
  }, {
    test: function test4(parser) {
      return parser.hasBrand("Brave");
    },
    describe: function describe67(ua, parser) {
      var browser = {
        name: "Brave"
      };
      if (parser) {
        var hintsVersion = parser.getBrandVersion("Brave");
        if (hintsVersion) {
          browser.version = hintsVersion;
          return browser;
        }
      }
      return browser;
    }
  }, {
    test: [/chromium/i],
    describe: function describe68(ua) {
      var browser = {
        name: "Chromium"
      };
      var version = Utils.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/ladybird/i],
    describe: function describe69(ua) {
      var browser = {
        name: "Ladybird"
      };
      var version = Utils.getFirstMatch(/ladybird\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/chrome|crios|crmo/i],
    describe: function describe70(ua) {
      var browser = {
        name: "Chrome"
      };
      var version = Utils.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/GSA/i],
    describe: function describe71(ua) {
      var browser = {
        name: "Google Search"
      };
      var version = Utils.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: function test5(parser) {
      var notLikeAndroid = !parser.test(/like android/i);
      var butAndroid = parser.test(/android/i);
      return notLikeAndroid && butAndroid;
    },
    describe: function describe72(ua) {
      var browser = {
        name: "Android Browser"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/playstation 4/i],
    describe: function describe73(ua) {
      var browser = {
        name: "PlayStation 4"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/safari|applewebkit/i],
    describe: function describe74(ua) {
      var browser = {
        name: "Safari"
      };
      var version = Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) browser.version = version;
      return browser;
    }
  }, {
    test: [/.*/i],
    describe: function describe75(ua) {
      var regexp = ua.search("\\(") !== -1 ? /^(.*)\/([^/]*)[ \t]\((.*)/ : /^(.*)\/([^/]*) /;
      return {
        name: Utils.getFirstMatch(regexp, ua),
        version: Utils.getSecondMatch(regexp, ua)
      };
    }
  }];
  var parser_os_default = [{
    test: [/Roku\/DVP/],
    describe: function describe76(ua) {
      var version = Utils.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, ua);
      return {
        name: OS_MAP.Roku,
        version
      };
    }
  }, {
    test: [/windows phone/i],
    describe: function describe77(ua) {
      var version = Utils.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.WindowsPhone,
        version
      };
    }
  }, {
    test: [/windows /i],
    describe: function describe78(ua) {
      var version = Utils.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, ua);
      var versionName = Utils.getWindowsVersionName(version);
      return {
        name: OS_MAP.Windows,
        version,
        versionName
      };
    }
  }, {
    test: function test6(parser) {
      return Utils.isFirefoxOnIpad(parser.getUA());
    },
    describe: function describe79(ua) {
      var result = {
        name: OS_MAP.iOS
      };
      var version = Utils.getSecondMatch(/(Version\/)(\d[\d.]+)/, ua);
      if (version) result.version = version;
      return result;
    }
  }, {
    test: [/macintosh/i],
    describe: function describe80(ua) {
      var version = Utils.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, ua).replace(/[_\s]/g, ".");
      var versionName = Utils.getMacOSVersionName(version);
      var os = {
        name: OS_MAP.MacOS,
        version
      };
      if (versionName) os.versionName = versionName;
      return os;
    }
  }, {
    test: [/(ipod|iphone|ipad)/i],
    describe: function describe81(ua) {
      var version = Utils.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, ua).replace(/[_\s]/g, ".");
      return {
        name: OS_MAP.iOS,
        version
      };
    }
  }, {
    test: [/OpenHarmony/i],
    describe: function describe82(ua) {
      var version = Utils.getFirstMatch(/OpenHarmony\s+(\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.HarmonyOS,
        version
      };
    }
  }, {
    test: function test7(parser) {
      var notLikeAndroid = !parser.test(/like android/i);
      var butAndroid = parser.test(/android/i);
      return notLikeAndroid && butAndroid;
    },
    describe: function describe83(ua) {
      var version = Utils.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, ua);
      var versionName = Utils.getAndroidVersionName(version);
      var os = {
        name: OS_MAP.Android,
        version
      };
      if (versionName) os.versionName = versionName;
      return os;
    }
  }, {
    test: [/(web|hpw)[o0]s/i],
    describe: function describe84(ua) {
      var version = Utils.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, ua);
      var os = {
        name: OS_MAP.WebOS
      };
      if (version && version.length) os.version = version;
      return os;
    }
  }, {
    test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
    describe: function describe85(ua) {
      var version = Utils.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, ua) || Utils.getFirstMatch(/\bbb(\d+)/i, ua);
      return {
        name: OS_MAP.BlackBerry,
        version
      };
    }
  }, {
    test: [/bada/i],
    describe: function describe86(ua) {
      var version = Utils.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.Bada,
        version
      };
    }
  }, {
    test: [/tizen/i],
    describe: function describe87(ua) {
      var version = Utils.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.Tizen,
        version
      };
    }
  }, {
    test: [/linux/i],
    describe: function describe88() {
      return {
        name: OS_MAP.Linux
      };
    }
  }, {
    test: [/CrOS/],
    describe: function describe89() {
      return {
        name: OS_MAP.ChromeOS
      };
    }
  }, {
    test: [/PlayStation 4/],
    describe: function describe90(ua) {
      var version = Utils.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.PlayStation4,
        version
      };
    }
  }];
  var parser_platforms_default = [{
    test: [/googlebot/i],
    describe: function describe91() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Google"
      };
    }
  }, {
    test: [/linespider/i],
    describe: function describe92() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Line"
      };
    }
  }, {
    test: [/amazonbot/i],
    describe: function describe93() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Amazon"
      };
    }
  }, {
    test: [/gptbot/i],
    describe: function describe94() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "OpenAI"
      };
    }
  }, {
    test: [/chatgpt-user/i],
    describe: function describe95() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "OpenAI"
      };
    }
  }, {
    test: [/oai-searchbot/i],
    describe: function describe96() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "OpenAI"
      };
    }
  }, {
    test: [/baiduspider/i],
    describe: function describe97() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Baidu"
      };
    }
  }, {
    test: [/bingbot/i],
    describe: function describe98() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Bing"
      };
    }
  }, {
    test: [/duckduckbot/i],
    describe: function describe99() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "DuckDuckGo"
      };
    }
  }, {
    test: [/claudebot/i, /claude-web/i, /claude-user/i, /claude-searchbot/i],
    describe: function describe100() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Anthropic"
      };
    }
  }, {
    test: [/omgilibot/i, /webzio-extended/i],
    describe: function describe101() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Webz.io"
      };
    }
  }, {
    test: [/diffbot/i],
    describe: function describe102() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Diffbot"
      };
    }
  }, {
    test: [/perplexitybot/i],
    describe: function describe103() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Perplexity AI"
      };
    }
  }, {
    test: [/perplexity-user/i],
    describe: function describe104() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Perplexity AI"
      };
    }
  }, {
    test: [/youbot/i],
    describe: function describe105() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "You.com"
      };
    }
  }, {
    test: [/ia_archiver/i],
    describe: function describe106() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Internet Archive"
      };
    }
  }, {
    test: [/meta-webindexer/i],
    describe: function describe107() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Meta"
      };
    }
  }, {
    test: [/meta-externalads/i],
    describe: function describe108() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Meta"
      };
    }
  }, {
    test: [/meta-externalagent/i],
    describe: function describe109() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Meta"
      };
    }
  }, {
    test: [/meta-externalfetcher/i],
    describe: function describe110() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Meta"
      };
    }
  }, {
    test: [/facebookexternalhit/i, /facebookcatalog/i],
    describe: function describe111() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Meta"
      };
    }
  }, {
    test: [/slackbot/i, /slack-imgProxy/i],
    describe: function describe112() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Slack"
      };
    }
  }, {
    test: [/yahoo/i],
    describe: function describe113() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Yahoo"
      };
    }
  }, {
    test: [/yandexbot/i, /yandexmobilebot/i],
    describe: function describe114() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Yandex"
      };
    }
  }, {
    test: [/pingdom/i],
    describe: function describe115() {
      return {
        type: PLATFORMS_MAP.bot,
        vendor: "Pingdom"
      };
    }
  }, {
    test: [/huawei/i],
    describe: function describe116(ua) {
      var model = Utils.getFirstMatch(/(can-l01)/i, ua) && "Nova";
      var platform = {
        type: PLATFORMS_MAP.mobile,
        vendor: "Huawei"
      };
      if (model) platform.model = model;
      return platform;
    }
  }, {
    test: [/nexus\s*(?:7|8|9|10).*/i],
    describe: function describe117() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Nexus"
      };
    }
  }, {
    test: [/ipad/i],
    describe: function describe118() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Apple",
        model: "iPad"
      };
    }
  }, {
    test: function test8(parser) {
      return Utils.isFirefoxOnIpad(parser.getUA());
    },
    describe: function describe119() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Apple",
        model: "iPad"
      };
    }
  }, {
    test: [/kftt build/i],
    describe: function describe120() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Amazon",
        model: "Kindle Fire HD 7"
      };
    }
  }, {
    test: [/silk/i],
    describe: function describe121() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Amazon"
      };
    }
  }, {
    test: [/tablet(?! pc)/i],
    describe: function describe122() {
      return {
        type: PLATFORMS_MAP.tablet
      };
    }
  }, {
    test: function test9(parser) {
      var iDevice = parser.test(/ipod|iphone/i);
      var likeIDevice = parser.test(/like (ipod|iphone)/i);
      return iDevice && !likeIDevice;
    },
    describe: function describe123(ua) {
      var model = Utils.getFirstMatch(/(ipod|iphone)/i, ua);
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "Apple",
        model
      };
    }
  }, {
    test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
    describe: function describe124() {
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "Nexus"
      };
    }
  }, {
    test: [/Nokia/i],
    describe: function describe125(ua) {
      var model = Utils.getFirstMatch(/Nokia\s+([0-9]+(\.[0-9]+)?)/i, ua);
      var platform = {
        type: PLATFORMS_MAP.mobile,
        vendor: "Nokia"
      };
      if (model) platform.model = model;
      return platform;
    }
  }, {
    test: [/[^-]mobi/i],
    describe: function describe126() {
      return {
        type: PLATFORMS_MAP.mobile
      };
    }
  }, {
    test: function test10(parser) {
      return parser.getBrowserName(true) === "blackberry";
    },
    describe: function describe127() {
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "BlackBerry"
      };
    }
  }, {
    test: function test11(parser) {
      return parser.getBrowserName(true) === "bada";
    },
    describe: function describe128() {
      return {
        type: PLATFORMS_MAP.mobile
      };
    }
  }, {
    test: function test12(parser) {
      return parser.getBrowserName() === "windows phone";
    },
    describe: function describe129() {
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "Microsoft"
      };
    }
  }, {
    test: function test13(parser) {
      var osMajorVersion = Number(String(parser.getOSVersion()).split(".")[0]);
      return parser.getOSName(true) === "android" && osMajorVersion >= 3;
    },
    describe: function describe130() {
      return {
        type: PLATFORMS_MAP.tablet
      };
    }
  }, {
    test: function test14(parser) {
      return parser.getOSName(true) === "android";
    },
    describe: function describe131() {
      return {
        type: PLATFORMS_MAP.mobile
      };
    }
  }, {
    test: [/smart-?tv|smarttv/i],
    describe: function describe132() {
      return {
        type: PLATFORMS_MAP.tv
      };
    }
  }, {
    test: [/netcast/i],
    describe: function describe133() {
      return {
        type: PLATFORMS_MAP.tv
      };
    }
  }, {
    test: function test15(parser) {
      return parser.getOSName(true) === "macos";
    },
    describe: function describe134() {
      return {
        type: PLATFORMS_MAP.desktop,
        vendor: "Apple"
      };
    }
  }, {
    test: function test16(parser) {
      return parser.getOSName(true) === "windows";
    },
    describe: function describe135() {
      return {
        type: PLATFORMS_MAP.desktop
      };
    }
  }, {
    test: function test17(parser) {
      return parser.getOSName(true) === "linux";
    },
    describe: function describe136() {
      return {
        type: PLATFORMS_MAP.desktop
      };
    }
  }, {
    test: function test18(parser) {
      return parser.getOSName(true) === "playstation 4";
    },
    describe: function describe137() {
      return {
        type: PLATFORMS_MAP.tv
      };
    }
  }, {
    test: function test19(parser) {
      return parser.getOSName(true) === "roku";
    },
    describe: function describe138() {
      return {
        type: PLATFORMS_MAP.tv
      };
    }
  }];
  var parser_engines_default = [{
    test: function test20(parser) {
      return parser.getBrowserName(true) === "microsoft edge";
    },
    describe: function describe139(ua) {
      if (/\sedg\//i.test(ua)) return {
        name: ENGINE_MAP.Blink
      };
      var version = Utils.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, ua);
      return {
        name: ENGINE_MAP.EdgeHTML,
        version
      };
    }
  }, {
    test: function test21(parser) {
      return parser.getBrowserName(true) === "ladybird";
    },
    describe: function describe140() {
      return {
        name: ENGINE_MAP.LibWeb
      };
    }
  }, {
    test: [/trident/i],
    describe: function describe141(ua) {
      var engine = {
        name: ENGINE_MAP.Trident
      };
      var version = Utils.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) engine.version = version;
      return engine;
    }
  }, {
    test: function test22(parser) {
      return parser.test(/presto/i);
    },
    describe: function describe142(ua) {
      var engine = {
        name: ENGINE_MAP.Presto
      };
      var version = Utils.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) engine.version = version;
      return engine;
    }
  }, {
    test: function test23(parser) {
      var isGecko = parser.test(/gecko/i);
      var likeGecko = parser.test(/like gecko/i);
      return isGecko && !likeGecko;
    },
    describe: function describe143(ua) {
      var engine = {
        name: ENGINE_MAP.Gecko
      };
      var version = Utils.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) engine.version = version;
      return engine;
    }
  }, {
    test: [/(apple)?webkit\/537\.36/i],
    describe: function describe144() {
      return {
        name: ENGINE_MAP.Blink
      };
    }
  }, {
    test: [/(apple)?webkit/i],
    describe: function describe145(ua) {
      var engine = {
        name: ENGINE_MAP.WebKit
      };
      var version = Utils.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) engine.version = version;
      return engine;
    }
  }];
  var Parser = /* @__PURE__ */ (function() {
    function Parser2(UA, skipParsingOrHints, clientHints) {
      if (skipParsingOrHints === void 0) skipParsingOrHints = false;
      if (clientHints === void 0) clientHints = null;
      if (UA === void 0 || UA === null || UA === "") throw new Error("UserAgent parameter can't be empty");
      this._ua = UA;
      var skipParsing = false;
      if (typeof skipParsingOrHints === "boolean") {
        skipParsing = skipParsingOrHints;
        this._hints = clientHints;
      } else if (skipParsingOrHints != null && typeof skipParsingOrHints === "object") this._hints = skipParsingOrHints;
      else this._hints = null;
      this.parsedResult = {};
      if (skipParsing !== true) this.parse();
    }
    var _proto = Parser2.prototype;
    _proto.getHints = function getHints() {
      return this._hints;
    };
    _proto.hasBrand = function hasBrand(brandName) {
      if (!this._hints || !Array.isArray(this._hints.brands)) return false;
      var brandLower = brandName.toLowerCase();
      return this._hints.brands.some(function(b2) {
        return b2.brand && b2.brand.toLowerCase() === brandLower;
      });
    };
    _proto.getBrandVersion = function getBrandVersion(brandName) {
      if (!this._hints || !Array.isArray(this._hints.brands)) return;
      var brandLower = brandName.toLowerCase();
      var brand = Utils.find(this._hints.brands, function(b2) {
        return b2.brand && b2.brand.toLowerCase() === brandLower;
      });
      return brand ? brand.version : void 0;
    };
    _proto.getUA = function getUA() {
      return this._ua;
    };
    _proto.test = function test24(regex) {
      return regex.test(this._ua);
    };
    _proto.parseBrowser = function parseBrowser() {
      var _this = this;
      this.parsedResult.browser = {};
      var browserDescriptor = Utils.find(browsersList, function(_browser) {
        if (typeof _browser.test === "function") return _browser.test(_this);
        if (Array.isArray(_browser.test)) return _browser.test.some(function(condition) {
          return _this.test(condition);
        });
        throw new Error("Browser's test function is not valid");
      });
      if (browserDescriptor) this.parsedResult.browser = browserDescriptor.describe(this.getUA(), this);
      return this.parsedResult.browser;
    };
    _proto.getBrowser = function getBrowser() {
      if (this.parsedResult.browser) return this.parsedResult.browser;
      return this.parseBrowser();
    };
    _proto.getBrowserName = function getBrowserName(toLowerCase) {
      if (toLowerCase) return String(this.getBrowser().name).toLowerCase() || "";
      return this.getBrowser().name || "";
    };
    _proto.getBrowserVersion = function getBrowserVersion() {
      return this.getBrowser().version;
    };
    _proto.getOS = function getOS() {
      if (this.parsedResult.os) return this.parsedResult.os;
      return this.parseOS();
    };
    _proto.parseOS = function parseOS() {
      var _this2 = this;
      this.parsedResult.os = {};
      var os = Utils.find(parser_os_default, function(_os) {
        if (typeof _os.test === "function") return _os.test(_this2);
        if (Array.isArray(_os.test)) return _os.test.some(function(condition) {
          return _this2.test(condition);
        });
        throw new Error("Browser's test function is not valid");
      });
      if (os) this.parsedResult.os = os.describe(this.getUA());
      return this.parsedResult.os;
    };
    _proto.getOSName = function getOSName(toLowerCase) {
      var name = this.getOS().name;
      if (toLowerCase) return String(name).toLowerCase() || "";
      return name || "";
    };
    _proto.getOSVersion = function getOSVersion() {
      return this.getOS().version;
    };
    _proto.getPlatform = function getPlatform() {
      if (this.parsedResult.platform) return this.parsedResult.platform;
      return this.parsePlatform();
    };
    _proto.getPlatformType = function getPlatformType(toLowerCase) {
      if (toLowerCase === void 0) toLowerCase = false;
      var type = this.getPlatform().type;
      if (toLowerCase) return String(type).toLowerCase() || "";
      return type || "";
    };
    _proto.parsePlatform = function parsePlatform() {
      var _this3 = this;
      this.parsedResult.platform = {};
      var platform = Utils.find(parser_platforms_default, function(_platform) {
        if (typeof _platform.test === "function") return _platform.test(_this3);
        if (Array.isArray(_platform.test)) return _platform.test.some(function(condition) {
          return _this3.test(condition);
        });
        throw new Error("Browser's test function is not valid");
      });
      if (platform) this.parsedResult.platform = platform.describe(this.getUA());
      return this.parsedResult.platform;
    };
    _proto.getEngine = function getEngine() {
      if (this.parsedResult.engine) return this.parsedResult.engine;
      return this.parseEngine();
    };
    _proto.getEngineName = function getEngineName(toLowerCase) {
      if (toLowerCase) return String(this.getEngine().name).toLowerCase() || "";
      return this.getEngine().name || "";
    };
    _proto.parseEngine = function parseEngine() {
      var _this4 = this;
      this.parsedResult.engine = {};
      var engine = Utils.find(parser_engines_default, function(_engine) {
        if (typeof _engine.test === "function") return _engine.test(_this4);
        if (Array.isArray(_engine.test)) return _engine.test.some(function(condition) {
          return _this4.test(condition);
        });
        throw new Error("Browser's test function is not valid");
      });
      if (engine) this.parsedResult.engine = engine.describe(this.getUA());
      return this.parsedResult.engine;
    };
    _proto.parse = function parse2() {
      this.parseBrowser();
      this.parseOS();
      this.parsePlatform();
      this.parseEngine();
      return this;
    };
    _proto.getResult = function getResult() {
      return Utils.assign({}, this.parsedResult);
    };
    _proto.satisfies = function satisfies(checkTree) {
      var _this5 = this;
      var platformsAndOSes = {};
      var platformsAndOSCounter = 0;
      var browsers = {};
      var browsersCounter = 0;
      Object.keys(checkTree).forEach(function(key) {
        var currentDefinition = checkTree[key];
        if (typeof currentDefinition === "string" || Array.isArray(currentDefinition)) {
          browsers[key] = currentDefinition;
          browsersCounter += 1;
        } else if (typeof currentDefinition === "object") {
          platformsAndOSes[key] = currentDefinition;
          platformsAndOSCounter += 1;
        }
      });
      if (platformsAndOSCounter > 0) {
        var platformsAndOSNames = Object.keys(platformsAndOSes);
        var OSMatchingDefinition = Utils.find(platformsAndOSNames, function(name) {
          return _this5.isOS(name);
        });
        if (OSMatchingDefinition) {
          var osResult = this.satisfies(platformsAndOSes[OSMatchingDefinition]);
          if (osResult !== void 0) return osResult;
        }
        var platformMatchingDefinition = Utils.find(platformsAndOSNames, function(name) {
          return _this5.isPlatform(name);
        });
        if (platformMatchingDefinition) {
          var platformResult = this.satisfies(platformsAndOSes[platformMatchingDefinition]);
          if (platformResult !== void 0) return platformResult;
        }
      }
      if (browsersCounter > 0) {
        var browserNames = Object.keys(browsers);
        var matchingDefinition = Utils.find(browserNames, function(name) {
          return _this5.isBrowser(name, true);
        });
        if (matchingDefinition !== void 0) return this.compareVersions(browsers[matchingDefinition]);
      }
    };
    _proto.isBrowser = function isBrowser(browserName, includingAlias) {
      if (includingAlias === void 0) includingAlias = false;
      var defaultBrowserName = this.getBrowserName().toLowerCase();
      var browserNameLower = browserName.toLowerCase();
      var alias = Utils.getBrowserTypeByAlias(browserNameLower);
      if (includingAlias && alias) browserNameLower = alias.toLowerCase();
      return browserNameLower === defaultBrowserName;
    };
    _proto.compareVersions = function compareVersions(versionsOrVersion) {
      var _this6 = this;
      if (typeof versionsOrVersion === "string") return this.compareVersion(versionsOrVersion);
      return versionsOrVersion.some(function(version) {
        return _this6.compareVersion(version);
      });
    };
    _proto.compareVersion = function compareVersion(version) {
      var expectedResults = [0];
      var comparableVersion = version;
      var isLoose = false;
      var currentBrowserVersion = this.getBrowserVersion();
      if (typeof currentBrowserVersion !== "string") return;
      if (version[0] === ">" || version[0] === "<") {
        comparableVersion = version.substr(1);
        if (version[1] === "=") {
          isLoose = true;
          comparableVersion = version.substr(2);
        } else expectedResults = [];
        if (version[0] === ">") expectedResults.push(1);
        else expectedResults.push(-1);
      } else if (version[0] === "=") comparableVersion = version.substr(1);
      else if (version[0] === "~") {
        isLoose = true;
        comparableVersion = version.substr(1);
      }
      return expectedResults.indexOf(Utils.compareVersions(currentBrowserVersion, comparableVersion, isLoose)) > -1;
    };
    _proto.isOS = function isOS(osName) {
      return this.getOSName(true) === String(osName).toLowerCase();
    };
    _proto.isPlatform = function isPlatform(platformType) {
      return this.getPlatformType(true) === String(platformType).toLowerCase();
    };
    _proto.isEngine = function isEngine(engineName) {
      return this.getEngineName(true) === String(engineName).toLowerCase();
    };
    _proto.is = function is2(anything, includingAlias) {
      if (includingAlias === void 0) includingAlias = false;
      return this.isBrowser(anything, includingAlias) || this.isOS(anything) || this.isPlatform(anything);
    };
    _proto.some = function some(anythings) {
      var _this7 = this;
      if (anythings === void 0) anythings = [];
      return anythings.some(function(anything) {
        return _this7.is(anything);
      });
    };
    return Parser2;
  })();
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
      writable: false
    }), e;
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  var Bowser = /* @__PURE__ */ (function() {
    function Bowser2() {
    }
    Bowser2.getParser = function getParser2(UA, skipParsingOrHints, clientHints) {
      if (skipParsingOrHints === void 0) skipParsingOrHints = false;
      if (clientHints === void 0) clientHints = null;
      if (typeof UA !== "string") throw new Error("UserAgent should be a string");
      return new Parser(UA, skipParsingOrHints, clientHints);
    };
    Bowser2.parse = function parse2(UA, clientHints) {
      if (clientHints === void 0) clientHints = null;
      return new Parser(UA, clientHints).getResult();
    };
    return _createClass(Bowser2, null, [{
      key: "BROWSER_MAP",
      get: function get() {
        return BROWSER_MAP;
      }
    }, {
      key: "ENGINE_MAP",
      get: function get() {
        return ENGINE_MAP;
      }
    }, {
      key: "OS_MAP",
      get: function get() {
        return OS_MAP;
      }
    }, {
      key: "PLATFORMS_MAP",
      get: function get() {
        return PLATFORMS_MAP;
      }
    }]);
  })();
  var parse = Bowser.parse;
  var getParser = Bowser.getParser;

  // node_modules/sats-connect/node_modules/@sats-connect/make-default-provider-config/dist/isXverseInAppBrowser.js
  function isXverseInAppBrowser() {
    return typeof window.ReactNativeWebView !== "undefined";
  }

  // node_modules/sats-connect/node_modules/@sats-connect/make-default-provider-config/dist/index.js
  function appStoreUrl(p) {
    const browser = Bowser.getParser(window.navigator.userAgent);
    if (browser.satisfies({
      desktop: {
        chrome: ">=1"
      }
    })) {
      return p.chromeWebStoreUrl;
    }
    if (browser.satisfies({
      desktop: {
        firefox: ">=1"
      }
    })) {
      return p.mozillaAddOnsUrl;
    }
    if (browser.satisfies({
      android: {
        chrome: ">=1",
        safari: ">=1"
      }
    })) {
      return p.googlePlayStoreUrl;
    }
    if (browser.satisfies({
      ios: {
        chrome: ">=1",
        safari: ">=1"
      }
    })) {
      return p.iOSAppStoreUrl;
    }
  }
  function getInstallPrompt(provider) {
    const url = appStoreUrl(provider);
    if (url)
      return { installPrompt: { url } };
    console.error(`[makeDefaultConfig]: No app store URL found for ${provider.name}.`);
    return {};
  }
  function makeDefaultConfig(providers) {
    const config = { options: [] };
    const xverseProvider = providers.find((provider) => provider.id === DefaultAdaptersInfo.xverse.id);
    config.options.push(xverseProvider ? xverseProvider : {
      ...DefaultAdaptersInfo.xverse,
      ...getInstallPrompt(DefaultAdaptersInfo.xverse)
    });
    if (isXverseInAppBrowser()) {
      return config;
    }
    const unisatProvider = providers.find((provider) => provider.id === "unisat");
    if (unisatProvider && unisatProvider.isInstalled) {
      config.options.push(unisatProvider);
    }
    config.options = config.options.concat(providers.filter((provider) => {
      return provider.id !== DefaultAdaptersInfo.xverse.id && provider.id !== "unisat";
    }).map((provider) => {
      return {
        ...provider,
        ...provider.isInstalled ? {} : getInstallPrompt(provider)
      };
    }));
    return config;
  }

  // node_modules/@sats-connect/ui/dist/index.js
  function st(e) {
    return Object.keys(e).reduce((n, i) => {
      const r = e[i];
      return n[i] = Object.assign({}, r), ze(r.value) && !ut(r.value) && !Array.isArray(r.value) && (n[i].value = Object.assign({}, r.value)), Array.isArray(r.value) && (n[i].value = r.value.slice(0)), n;
    }, {});
  }
  function ot(e) {
    return e ? Object.keys(e).reduce((n, i) => {
      const r = e[i];
      return n[i] = ze(r) && "value" in r ? r : {
        value: r
      }, n[i].attribute || (n[i].attribute = ct(i)), n[i].parse = "parse" in n[i] ? n[i].parse : typeof n[i].value != "string", n;
    }, {}) : {};
  }
  function lt(e) {
    return Object.keys(e).reduce((n, i) => (n[i] = e[i].value, n), {});
  }
  function at(e, t) {
    const n = st(t);
    return Object.keys(t).forEach((r) => {
      const s = n[r], l = e.getAttribute(s.attribute), o = e[r];
      l && (s.value = s.parse ? Ne(l) : l), o != null && (s.value = Array.isArray(o) ? o.slice(0) : o), s.reflect && $e(e, s.attribute, s.value), Object.defineProperty(e, r, {
        get() {
          return s.value;
        },
        set(c) {
          const f = s.value;
          s.value = c, s.reflect && $e(this, s.attribute, s.value);
          for (let a = 0, u = this.__propertyChangedCallbacks.length; a < u; a++)
            this.__propertyChangedCallbacks[a](r, c, f);
        },
        enumerable: true,
        configurable: true
      });
    }), n;
  }
  function Ne(e) {
    if (e)
      try {
        return JSON.parse(e);
      } catch {
        return e;
      }
  }
  function $e(e, t, n) {
    if (n == null || n === false)
      return e.removeAttribute(t);
    let i = JSON.stringify(n);
    e.__updating[t] = true, i === "true" && (i = ""), e.setAttribute(t, i), Promise.resolve().then(() => delete e.__updating[t]);
  }
  function ct(e) {
    return e.replace(/\.?([A-Z]+)/g, (t, n) => "-" + n.toLowerCase()).replace("_", "-").replace(/^-/, "");
  }
  function ze(e) {
    return e != null && (typeof e == "object" || typeof e == "function");
  }
  function ut(e) {
    return Object.prototype.toString.call(e) === "[object Function]";
  }
  function dt(e) {
    return typeof e == "function" && e.toString().indexOf("class") === 0;
  }
  var ue;
  function ft(e, t) {
    const n = Object.keys(t);
    return class extends e {
      static get observedAttributes() {
        return n.map((r) => t[r].attribute);
      }
      constructor() {
        super(), this.__initialized = false, this.__released = false, this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = {};
      }
      connectedCallback() {
        if (this.__initialized)
          return;
        this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = at(this, t);
        const r = lt(this.props), s = this.Component, l = ue;
        try {
          ue = this, this.__initialized = true, dt(s) ? new s(r, {
            element: this
          }) : s(r, {
            element: this
          });
        } finally {
          ue = l;
        }
      }
      async disconnectedCallback() {
        if (await Promise.resolve(), this.isConnected)
          return;
        this.__propertyChangedCallbacks.length = 0;
        let r = null;
        for (; r = this.__releaseCallbacks.pop(); )
          r(this);
        delete this.__initialized, this.__released = true;
      }
      attributeChangedCallback(r, s, l) {
        if (this.__initialized && !this.__updating[r] && (r = this.lookupProp(r), r in t)) {
          if (l == null && !this[r])
            return;
          this[r] = t[r].parse ? Ne(l) : l;
        }
      }
      lookupProp(r) {
        if (t)
          return n.find((s) => r === s || r === t[s].attribute);
      }
      get renderRoot() {
        return this.shadowRoot || this.attachShadow({
          mode: "open"
        });
      }
      addReleaseCallback(r) {
        this.__releaseCallbacks.push(r);
      }
      addPropertyChangedCallback(r) {
        this.__propertyChangedCallbacks.push(r);
      }
    };
  }
  function ht(e, t = {}, n = {}) {
    const {
      BaseElement: i = HTMLElement,
      extension: r
    } = n;
    return (s) => {
      if (!e)
        throw new Error("tag is required to register a Component");
      let l = customElements.get(e);
      return l ? (l.prototype.Component = s, l) : (l = ft(i, ot(t)), l.prototype.Component = s, l.prototype.registeredTag = e, customElements.define(e, l, r), l);
    };
  }
  var pt = (e, t) => e === t;
  var me = /* @__PURE__ */ Symbol("solid-proxy");
  var yt = /* @__PURE__ */ Symbol("solid-track");
  var J = {
    equals: pt
  };
  var Re = De;
  var M = 1;
  var Q = 2;
  var Ie = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var w = null;
  var de = null;
  var m = null;
  var S = null;
  var I = null;
  var ne = 0;
  function Z(e, t) {
    const n = m, i = w, r = e.length === 0, s = t === void 0 ? i : t, l = r ? Ie : {
      owned: null,
      cleanups: null,
      context: s ? s.context : null,
      owner: s
    }, o = r ? e : () => e(() => T(() => ie(l)));
    w = l, m = null;
    try {
      return V(o, true);
    } finally {
      m = n, w = i;
    }
  }
  function j(e, t) {
    t = t ? Object.assign({}, J, t) : J;
    const n = {
      value: e,
      observers: null,
      observerSlots: null,
      comparator: t.equals || void 0
    }, i = (r) => (typeof r == "function" && (r = r(n.value)), Be(n, r));
    return [Ke.bind(n), i];
  }
  function A(e, t, n) {
    const i = _e(e, t, false, M);
    q(i);
  }
  function Fe(e, t, n) {
    Re = Ct;
    const i = _e(e, t, false, M);
    (!n || !n.render) && (i.user = true), I ? I.push(i) : q(i);
  }
  function F(e, t, n) {
    n = n ? Object.assign({}, J, n) : J;
    const i = _e(e, t, true, 0);
    return i.observers = null, i.observerSlots = null, i.comparator = n.equals || void 0, q(i), Ke.bind(i);
  }
  function mt(e) {
    return V(e, false);
  }
  function T(e) {
    if (m === null)
      return e();
    const t = m;
    m = null;
    try {
      return e();
    } finally {
      m = t;
    }
  }
  function bt(e) {
    Fe(() => T(e));
  }
  function Me(e) {
    return w === null || (w.cleanups === null ? w.cleanups = [e] : w.cleanups.push(e)), e;
  }
  function wt(e) {
    const t = F(e), n = F(() => be(t()));
    return n.toArray = () => {
      const i = n();
      return Array.isArray(i) ? i : i != null ? [i] : [];
    }, n;
  }
  function Ke() {
    if (this.sources && this.state)
      if (this.state === M)
        q(this);
      else {
        const e = S;
        S = null, V(() => te(this), false), S = e;
      }
    if (m) {
      const e = this.observers ? this.observers.length : 0;
      m.sources ? (m.sources.push(this), m.sourceSlots.push(e)) : (m.sources = [this], m.sourceSlots = [e]), this.observers ? (this.observers.push(m), this.observerSlots.push(m.sources.length - 1)) : (this.observers = [m], this.observerSlots = [m.sources.length - 1]);
    }
    return this.value;
  }
  function Be(e, t, n) {
    let i = e.value;
    return (!e.comparator || !e.comparator(i, t)) && (e.value = t, e.observers && e.observers.length && V(() => {
      for (let r = 0; r < e.observers.length; r += 1) {
        const s = e.observers[r], l = de && de.running;
        l && de.disposed.has(s), (l ? !s.tState : !s.state) && (s.pure ? S.push(s) : I.push(s), s.observers && Ue(s)), l || (s.state = M);
      }
      if (S.length > 1e6)
        throw S = [], new Error();
    }, false)), t;
  }
  function q(e) {
    if (!e.fn)
      return;
    ie(e);
    const t = ne;
    vt(
      e,
      e.value,
      t
    );
  }
  function vt(e, t, n) {
    let i;
    const r = w, s = m;
    m = w = e;
    try {
      i = e.fn(t);
    } catch (l) {
      return e.pure && (e.state = M, e.owned && e.owned.forEach(ie), e.owned = null), e.updatedAt = n + 1, We(l);
    } finally {
      m = s, w = r;
    }
    (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? Be(e, i) : e.value = i, e.updatedAt = n);
  }
  function _e(e, t, n, i = M, r) {
    const s = {
      fn: e,
      state: i,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: t,
      owner: w,
      context: w ? w.context : null,
      pure: n
    };
    return w === null || w !== Ie && (w.owned ? w.owned.push(s) : w.owned = [s]), s;
  }
  function ee(e) {
    if (e.state === 0)
      return;
    if (e.state === Q)
      return te(e);
    if (e.suspense && T(e.suspense.inFallback))
      return e.suspense.effects.push(e);
    const t = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < ne); )
      e.state && t.push(e);
    for (let n = t.length - 1; n >= 0; n--)
      if (e = t[n], e.state === M)
        q(e);
      else if (e.state === Q) {
        const i = S;
        S = null, V(() => te(e, t[0]), false), S = i;
      }
  }
  function V(e, t) {
    if (S)
      return e();
    let n = false;
    t || (S = []), I ? n = true : I = [], ne++;
    try {
      const i = e();
      return xt(n), i;
    } catch (i) {
      n || (I = null), S = null, We(i);
    }
  }
  function xt(e) {
    if (S && (De(S), S = null), e)
      return;
    const t = I;
    I = null, t.length && V(() => Re(t), false);
  }
  function De(e) {
    for (let t = 0; t < e.length; t++)
      ee(e[t]);
  }
  function Ct(e) {
    let t, n = 0;
    for (t = 0; t < e.length; t++) {
      const i = e[t];
      i.user ? e[n++] = i : ee(i);
    }
    for (t = 0; t < n; t++)
      ee(e[t]);
  }
  function te(e, t) {
    e.state = 0;
    for (let n = 0; n < e.sources.length; n += 1) {
      const i = e.sources[n];
      if (i.sources) {
        const r = i.state;
        r === M ? i !== t && (!i.updatedAt || i.updatedAt < ne) && ee(i) : r === Q && te(i, t);
      }
    }
  }
  function Ue(e) {
    for (let t = 0; t < e.observers.length; t += 1) {
      const n = e.observers[t];
      n.state || (n.state = Q, n.pure ? S.push(n) : I.push(n), n.observers && Ue(n));
    }
  }
  function ie(e) {
    let t;
    if (e.sources)
      for (; e.sources.length; ) {
        const n = e.sources.pop(), i = e.sourceSlots.pop(), r = n.observers;
        if (r && r.length) {
          const s = r.pop(), l = n.observerSlots.pop();
          i < r.length && (s.sourceSlots[l] = i, r[i] = s, n.observerSlots[i] = l);
        }
      }
    if (e.owned) {
      for (t = e.owned.length - 1; t >= 0; t--)
        ie(e.owned[t]);
      e.owned = null;
    }
    if (e.cleanups) {
      for (t = e.cleanups.length - 1; t >= 0; t--)
        e.cleanups[t]();
      e.cleanups = null;
    }
    e.state = 0;
  }
  function Pt(e) {
    return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
      cause: e
    });
  }
  function We(e, t = w) {
    throw Pt(e);
  }
  function be(e) {
    if (typeof e == "function" && !e.length)
      return be(e());
    if (Array.isArray(e)) {
      const t = [];
      for (let n = 0; n < e.length; n++) {
        const i = be(e[n]);
        Array.isArray(i) ? t.push.apply(t, i) : t.push(i);
      }
      return t;
    }
    return e;
  }
  var St = /* @__PURE__ */ Symbol("fallback");
  function Ae(e) {
    for (let t = 0; t < e.length; t++)
      e[t]();
  }
  function _t(e, t, n = {}) {
    let i = [], r = [], s = [], l = 0, o = t.length > 1 ? [] : null;
    return Me(() => Ae(s)), () => {
      let c = e() || [], f, a;
      return c[yt], T(() => {
        let d = c.length, h, v, y, z, $, P, _, E, R;
        if (d === 0)
          l !== 0 && (Ae(s), s = [], i = [], r = [], l = 0, o && (o = [])), n.fallback && (i = [St], r[0] = Z((se) => (s[0] = se, n.fallback())), l = 1);
        else if (l === 0) {
          for (r = new Array(d), a = 0; a < d; a++)
            i[a] = c[a], r[a] = Z(u);
          l = d;
        } else {
          for (y = new Array(d), z = new Array(d), o && ($ = new Array(d)), P = 0, _ = Math.min(l, d); P < _ && i[P] === c[P]; P++)
            ;
          for (_ = l - 1, E = d - 1; _ >= P && E >= P && i[_] === c[E]; _--, E--)
            y[E] = r[_], z[E] = s[_], o && ($[E] = o[_]);
          for (h = /* @__PURE__ */ new Map(), v = new Array(E + 1), a = E; a >= P; a--)
            R = c[a], f = h.get(R), v[a] = f === void 0 ? -1 : f, h.set(R, a);
          for (f = P; f <= _; f++)
            R = i[f], a = h.get(R), a !== void 0 && a !== -1 ? (y[a] = r[f], z[a] = s[f], o && ($[a] = o[f]), a = v[a], h.set(R, a)) : s[f]();
          for (a = P; a < d; a++)
            a in y ? (r[a] = y[a], s[a] = z[a], o && (o[a] = $[a], o[a](a))) : r[a] = Z(u);
          r = r.slice(0, l = d), i = c.slice(0);
        }
        return r;
      });
      function u(d) {
        if (s[a] = d, o) {
          const [h, v] = j(a);
          return o[a] = v, t(c[a], h);
        }
        return t(c[a]);
      }
    };
  }
  function g(e, t) {
    return T(() => e(t || {}));
  }
  function Y() {
    return true;
  }
  var Et = {
    get(e, t, n) {
      return t === me ? n : e.get(t);
    },
    has(e, t) {
      return t === me ? true : e.has(t);
    },
    set: Y,
    deleteProperty: Y,
    getOwnPropertyDescriptor(e, t) {
      return {
        configurable: true,
        enumerable: true,
        get() {
          return e.get(t);
        },
        set: Y,
        deleteProperty: Y
      };
    },
    ownKeys(e) {
      return e.keys();
    }
  };
  function fe(e) {
    return (e = typeof e == "function" ? e() : e) ? e : {};
  }
  function kt() {
    for (let e = 0, t = this.length; e < t; ++e) {
      const n = this[e]();
      if (n !== void 0)
        return n;
    }
  }
  function $t(...e) {
    let t = false;
    for (let l = 0; l < e.length; l++) {
      const o = e[l];
      t = t || !!o && me in o, e[l] = typeof o == "function" ? (t = true, F(o)) : o;
    }
    if (t)
      return new Proxy(
        {
          get(l) {
            for (let o = e.length - 1; o >= 0; o--) {
              const c = fe(e[o])[l];
              if (c !== void 0)
                return c;
            }
          },
          has(l) {
            for (let o = e.length - 1; o >= 0; o--)
              if (l in fe(e[o]))
                return true;
            return false;
          },
          keys() {
            const l = [];
            for (let o = 0; o < e.length; o++)
              l.push(...Object.keys(fe(e[o])));
            return [...new Set(l)];
          }
        },
        Et
      );
    const n = {}, i = /* @__PURE__ */ Object.create(null);
    for (let l = e.length - 1; l >= 0; l--) {
      const o = e[l];
      if (!o)
        continue;
      const c = Object.getOwnPropertyNames(o);
      for (let f = c.length - 1; f >= 0; f--) {
        const a = c[f];
        if (a === "__proto__" || a === "constructor")
          continue;
        const u = Object.getOwnPropertyDescriptor(o, a);
        if (!i[a])
          i[a] = u.get ? {
            enumerable: true,
            configurable: true,
            get: kt.bind(n[a] = [u.get.bind(o)])
          } : u.value !== void 0 ? u : void 0;
        else {
          const d = n[a];
          d && (u.get ? d.push(u.get.bind(o)) : u.value !== void 0 && d.push(() => u.value));
        }
      }
    }
    const r = {}, s = Object.keys(i);
    for (let l = s.length - 1; l >= 0; l--) {
      const o = s[l], c = i[o];
      c && c.get ? Object.defineProperty(r, o, c) : r[o] = c ? c.value : void 0;
    }
    return r;
  }
  var Ve = (e) => `Stale read from <${e}>.`;
  function At(e) {
    const t = "fallback" in e && {
      fallback: () => e.fallback
    };
    return F(_t(() => e.each, e.children, t || void 0));
  }
  function he(e) {
    const t = e.keyed, n = F(() => e.when, void 0, {
      equals: (i, r) => t ? i === r : !i == !r
    });
    return F(
      () => {
        const i = n();
        if (i) {
          const r = e.children;
          return typeof r == "function" && r.length > 0 ? T(
            () => r(
              t ? i : () => {
                if (!T(n))
                  throw Ve("Show");
                return e.when;
              }
            )
          ) : r;
        }
        return e.fallback;
      },
      void 0,
      void 0
    );
  }
  function Lt(e) {
    let t = false;
    const n = (s, l) => (t ? s[1] === l[1] : !s[1] == !l[1]) && s[2] === l[2], i = wt(() => e.children), r = F(
      () => {
        let s = i();
        Array.isArray(s) || (s = [s]);
        for (let l = 0; l < s.length; l++) {
          const o = s[l].when;
          if (o)
            return t = !!s[l].keyed, [l, o, s[l]];
        }
        return [-1];
      },
      void 0,
      {
        equals: n
      }
    );
    return F(
      () => {
        const [s, l, o] = r();
        if (s < 0)
          return e.fallback;
        const c = o.children;
        return typeof c == "function" && c.length > 0 ? T(
          () => c(
            t ? l : () => {
              if (T(r)[0] !== s)
                throw Ve("Match");
              return o.when;
            }
          )
        ) : c;
      },
      void 0,
      void 0
    );
  }
  function pe(e) {
    return e;
  }
  var Ot2 = [
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "disabled",
    "formnovalidate",
    "hidden",
    "indeterminate",
    "inert",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "seamless",
    "selected"
  ];
  var jt2 = /* @__PURE__ */ new Set([
    "className",
    "value",
    "readOnly",
    "formNoValidate",
    "isMap",
    "noModule",
    "playsInline",
    ...Ot2
  ]);
  var Tt = /* @__PURE__ */ new Set([
    "innerHTML",
    "textContent",
    "innerText",
    "children"
  ]);
  var Nt = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
    className: "class",
    htmlFor: "for"
  });
  var zt = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
    class: "className",
    formnovalidate: {
      $: "formNoValidate",
      BUTTON: 1,
      INPUT: 1
    },
    ismap: {
      $: "isMap",
      IMG: 1
    },
    nomodule: {
      $: "noModule",
      SCRIPT: 1
    },
    playsinline: {
      $: "playsInline",
      VIDEO: 1
    },
    readonly: {
      $: "readOnly",
      INPUT: 1,
      TEXTAREA: 1
    }
  });
  function Rt(e, t) {
    const n = zt[e];
    return typeof n == "object" ? n[t] ? n.$ : void 0 : n;
  }
  var It = /* @__PURE__ */ new Set([
    "beforeinput",
    "click",
    "dblclick",
    "contextmenu",
    "focusin",
    "focusout",
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "pointerdown",
    "pointermove",
    "pointerout",
    "pointerover",
    "pointerup",
    "touchend",
    "touchmove",
    "touchstart"
  ]);
  var Ft = {
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace"
  };
  function Mt(e, t, n) {
    let i = n.length, r = t.length, s = i, l = 0, o = 0, c = t[r - 1].nextSibling, f = null;
    for (; l < r || o < s; ) {
      if (t[l] === n[o]) {
        l++, o++;
        continue;
      }
      for (; t[r - 1] === n[s - 1]; )
        r--, s--;
      if (r === l) {
        const a = s < i ? o ? n[o - 1].nextSibling : n[s - o] : c;
        for (; o < s; )
          e.insertBefore(n[o++], a);
      } else if (s === o)
        for (; l < r; )
          (!f || !f.has(t[l])) && t[l].remove(), l++;
      else if (t[l] === n[s - 1] && n[o] === t[r - 1]) {
        const a = t[--r].nextSibling;
        e.insertBefore(n[o++], t[l++].nextSibling), e.insertBefore(n[--s], a), t[r] = n[s];
      } else {
        if (!f) {
          f = /* @__PURE__ */ new Map();
          let u = o;
          for (; u < s; )
            f.set(n[u], u++);
        }
        const a = f.get(t[l]);
        if (a != null)
          if (o < a && a < s) {
            let u = l, d = 1, h;
            for (; ++u < r && u < s && !((h = f.get(t[u])) == null || h !== a + d); )
              d++;
            if (d > a - o) {
              const v = t[l];
              for (; o < a; )
                e.insertBefore(n[o++], v);
            } else
              e.replaceChild(n[o++], t[l++]);
          } else
            l++;
        else
          t[l++].remove();
      }
    }
  }
  var Le = "_$DX_DELEGATE";
  function C(e, t, n) {
    let i;
    const r = () => {
      const l = document.createElement("template");
      return l.innerHTML = e, n ? l.content.firstChild.firstChild : l.content.firstChild;
    }, s = t ? () => T(() => document.importNode(i || (i = r()), true)) : () => (i || (i = r())).cloneNode(true);
    return s.cloneNode = s, s;
  }
  function Kt(e, t = window.document) {
    const n = t[Le] || (t[Le] = /* @__PURE__ */ new Set());
    for (let i = 0, r = e.length; i < r; i++) {
      const s = e[i];
      n.has(s) || (n.add(s), t.addEventListener(s, Ht));
    }
  }
  function N(e, t, n) {
    n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
  }
  function Bt(e, t, n, i) {
    i == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, i);
  }
  function Dt(e, t) {
    t == null ? e.removeAttribute("class") : e.className = t;
  }
  function Ut(e, t, n, i) {
    if (i)
      Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
    else if (Array.isArray(n)) {
      const r = n[0];
      e.addEventListener(t, n[0] = (s) => r.call(e, n[1], s));
    } else
      e.addEventListener(t, n);
  }
  function Wt(e, t, n = {}) {
    const i = Object.keys(t || {}), r = Object.keys(n);
    let s, l;
    for (s = 0, l = r.length; s < l; s++) {
      const o = r[s];
      !o || o === "undefined" || t[o] || (Oe(e, o, false), delete n[o]);
    }
    for (s = 0, l = i.length; s < l; s++) {
      const o = i[s], c = !!t[o];
      !o || o === "undefined" || n[o] === c || !c || (Oe(e, o, true), n[o] = c);
    }
    return n;
  }
  function L(e, t, n) {
    if (!t)
      return n ? N(e, "style") : t;
    const i = e.style;
    if (typeof t == "string")
      return i.cssText = t;
    typeof n == "string" && (i.cssText = n = void 0), n || (n = {}), t || (t = {});
    let r, s;
    for (s in n)
      t[s] == null && i.removeProperty(s), delete n[s];
    for (s in t)
      r = t[s], r !== n[s] && (i.setProperty(s, r), n[s] = r);
    return n;
  }
  function Vt(e, t = {}, n, i) {
    const r = {};
    return i || A(
      () => r.children = U(e, t.children, r.children)
    ), A(() => t.ref && t.ref(e)), A(() => Xt(e, t, n, true, r, true)), r;
  }
  function ye(e, t, n) {
    return T(() => e(t, n));
  }
  function b(e, t, n, i) {
    if (n !== void 0 && !i && (i = []), typeof t != "function")
      return U(e, t, i, n);
    A((r) => U(e, t(), r, n), i);
  }
  function Xt(e, t, n, i, r = {}, s = false) {
    t || (t = {});
    for (const l in r)
      if (!(l in t)) {
        if (l === "children")
          continue;
        r[l] = je(e, l, null, r[l], n, s);
      }
    for (const l in t) {
      if (l === "children") {
        i || U(e, t.children);
        continue;
      }
      const o = t[l];
      r[l] = je(e, l, o, r[l], n, s);
    }
  }
  function qt(e) {
    return e.toLowerCase().replace(/-([a-z])/g, (t, n) => n.toUpperCase());
  }
  function Oe(e, t, n) {
    const i = t.trim().split(/\s+/);
    for (let r = 0, s = i.length; r < s; r++)
      e.classList.toggle(i[r], n);
  }
  function je(e, t, n, i, r, s) {
    let l, o, c, f, a;
    if (t === "style")
      return L(e, n, i);
    if (t === "classList")
      return Wt(e, n, i);
    if (n === i)
      return i;
    if (t === "ref")
      s || n(e);
    else if (t.slice(0, 3) === "on:") {
      const u = t.slice(3);
      i && e.removeEventListener(u, i), n && e.addEventListener(u, n);
    } else if (t.slice(0, 10) === "oncapture:") {
      const u = t.slice(10);
      i && e.removeEventListener(u, i, true), n && e.addEventListener(u, n, true);
    } else if (t.slice(0, 2) === "on") {
      const u = t.slice(2).toLowerCase(), d = It.has(u);
      if (!d && i) {
        const h = Array.isArray(i) ? i[0] : i;
        e.removeEventListener(u, h);
      }
      (d || n) && (Ut(e, u, n, d), d && Kt([u]));
    } else if (t.slice(0, 5) === "attr:")
      N(e, t.slice(5), n);
    else if ((a = t.slice(0, 5) === "prop:") || (c = Tt.has(t)) || !r && ((f = Rt(t, e.tagName)) || (o = jt2.has(t))) || (l = e.nodeName.includes("-")))
      a && (t = t.slice(5), o = true), t === "class" || t === "className" ? Dt(e, n) : l && !o && !c ? e[qt(t)] = n : e[f || t] = n;
    else {
      const u = r && t.indexOf(":") > -1 && Ft[t.split(":")[0]];
      u ? Bt(e, u, t, n) : N(e, Nt[t] || t, n);
    }
    return n;
  }
  function Ht(e) {
    const t = `$$${e.type}`;
    let n = e.composedPath && e.composedPath()[0] || e.target;
    for (e.target !== n && Object.defineProperty(e, "target", {
      configurable: true,
      value: n
    }), Object.defineProperty(e, "currentTarget", {
      configurable: true,
      get() {
        return n || document;
      }
    }); n; ) {
      const i = n[t];
      if (i && !n.disabled) {
        const r = n[`${t}Data`];
        if (r !== void 0 ? i.call(n, r, e) : i.call(n, e), e.cancelBubble)
          return;
      }
      n = n._$host || n.parentNode || n.host;
    }
  }
  function U(e, t, n, i, r) {
    for (; typeof n == "function"; )
      n = n();
    if (t === n)
      return n;
    const s = typeof t, l = i !== void 0;
    if (e = l && n[0] && n[0].parentNode || e, s === "string" || s === "number")
      if (s === "number" && (t = t.toString()), l) {
        let o = n[0];
        o && o.nodeType === 3 ? o.data !== t && (o.data = t) : o = document.createTextNode(t), n = D(e, n, i, o);
      } else
        n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
    else if (t == null || s === "boolean")
      n = D(e, n, i);
    else {
      if (s === "function")
        return A(() => {
          let o = t();
          for (; typeof o == "function"; )
            o = o();
          n = U(e, o, n, i);
        }), () => n;
      if (Array.isArray(t)) {
        const o = [], c = n && Array.isArray(n);
        if (we(o, t, n, r))
          return A(() => n = U(e, o, n, i, true)), () => n;
        if (o.length === 0) {
          if (n = D(e, n, i), l)
            return n;
        } else
          c ? n.length === 0 ? Te(e, o, i) : Mt(e, n, o) : (n && D(e), Te(e, o));
        n = o;
      } else if (t.nodeType) {
        if (Array.isArray(n)) {
          if (l)
            return n = D(e, n, i, t);
          D(e, n, null, t);
        } else
          n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
        n = t;
      }
    }
    return n;
  }
  function we(e, t, n, i) {
    let r = false;
    for (let s = 0, l = t.length; s < l; s++) {
      let o = t[s], c = n && n[e.length], f;
      if (!(o == null || o === true || o === false))
        if ((f = typeof o) == "object" && o.nodeType)
          e.push(o);
        else if (Array.isArray(o))
          r = we(e, o, c) || r;
        else if (f === "function")
          if (i) {
            for (; typeof o == "function"; )
              o = o();
            r = we(
              e,
              Array.isArray(o) ? o : [o],
              Array.isArray(c) ? c : [c]
            ) || r;
          } else
            e.push(o), r = true;
        else {
          const a = String(o);
          c && c.nodeType === 3 && c.data === a ? e.push(c) : e.push(document.createTextNode(a));
        }
    }
    return r;
  }
  function Te(e, t, n = null) {
    for (let i = 0, r = t.length; i < r; i++)
      e.insertBefore(t[i], n);
  }
  function D(e, t, n, i) {
    if (n === void 0)
      return e.textContent = "";
    const r = i || document.createTextNode("");
    if (t.length) {
      let s = false;
      for (let l = t.length - 1; l >= 0; l--) {
        const o = t[l];
        if (r !== o) {
          const c = o.parentNode === e;
          !s && !l ? c ? e.replaceChild(r, o) : e.insertBefore(r, n) : c && o.remove();
        } else
          s = true;
      }
    } else
      e.insertBefore(r, n);
    return [r];
  }
  function Yt(e) {
    const t = Object.keys(e), n = {};
    for (let i = 0; i < t.length; i++) {
      const [r, s] = j(e[t[i]]);
      Object.defineProperty(n, t[i], {
        get: r,
        set(l) {
          s(() => l);
        }
      });
    }
    return n;
  }
  function Gt(e) {
    if (e.assignedSlot && e.assignedSlot._$owner)
      return e.assignedSlot._$owner;
    let t = e.parentNode;
    for (; t && !t._$owner && !(t.assignedSlot && t.assignedSlot._$owner); )
      t = t.parentNode;
    return t && t.assignedSlot ? t.assignedSlot._$owner : e._$owner;
  }
  function Zt(e) {
    return (t, n) => {
      const { element: i } = n;
      return Z((r) => {
        const s = Yt(t);
        i.addPropertyChangedCallback((o, c) => s[o] = c), i.addReleaseCallback(() => {
          i.renderRoot.textContent = "", r();
        });
        const l = e(s, n);
        return b(i.renderRoot, l);
      }, Gt(i));
    };
  }
  function Jt(e, t, n) {
    return arguments.length === 2 && (n = t, t = {}), ht(e, t)(Zt(n));
  }
  var ve = "sats-connect_wallet-provider-selector_select";
  var xe = "sats-connect_wallet-provider-selector_cancel";
  var Ce = "sats-connect_wallet-provider-selector_open";
  var Pe = "sats-connect_wallet-provider-selector_close";
  var Xe = "sats-connect_wallet-provider-selector_walletOpen";
  var qe = "sats-connect_wallet-provider-selector_walletClose";
  var re = {
    color: "#181818",
    "font-size": "18px",
    "font-weight": "700",
    "line-height": "1.4"
  };
  var W2 = {
    color: "#181818",
    "font-size": "14px",
    "font-weight": "400",
    "line-height": "1.4"
  };
  var Qt = {
    color: "#181818",
    "font-size": "14px",
    "font-weight": "500"
  };
  var en = /* @__PURE__ */ C('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><g id=XCircle><path id=Vector d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96451 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.745 9.41566 20.7162 6.93859 18.8888 5.11118C17.0614 3.28378 14.5843 2.25496 12 2.25ZM15.5344 14.4656C15.6752 14.6078 15.7542 14.7999 15.7542 15C15.7542 15.2001 15.6752 15.3922 15.5344 15.5344C15.391 15.673 15.1994 15.7505 15 15.7505C14.8006 15.7505 14.609 15.673 14.4656 15.5344L12 13.0594L9.53438 15.5344C9.39102 15.673 9.19942 15.7505 9 15.7505C8.80059 15.7505 8.60898 15.673 8.46563 15.5344C8.32479 15.3922 8.24578 15.2001 8.24578 15C8.24578 14.7999 8.32479 14.6078 8.46563 14.4656L10.9406 12L8.46563 9.53437C8.34603 9.38865 8.28491 9.20366 8.29416 9.01537C8.30341 8.82708 8.38236 8.64896 8.51566 8.51566C8.64896 8.38236 8.82708 8.3034 9.01537 8.29416C9.20366 8.28491 9.38866 8.34603 9.53438 8.46563L12 10.9406L14.4656 8.46563C14.6114 8.34603 14.7963 8.28491 14.9846 8.29416C15.1729 8.3034 15.351 8.38236 15.4843 8.51566C15.6176 8.64896 15.6966 8.82708 15.7058 9.01537C15.7151 9.20366 15.654 9.38865 15.5344 9.53437L13.0594 12L15.5344 14.4656Z"fill=black fill-opacity=0.3>');
  var tn = /* @__PURE__ */ C(`<style>
          .close-selector-button:focus-visible {
            outline: 2px solid #181818;
            outline-offset: -0.25px;
          }
        `);
  var nn = /* @__PURE__ */ C("<div role=button tabindex=0 class=close-selector-button>");
  function rn(e) {
    return (() => {
      var t = en();
      return t.style.setProperty("display", "block"), Vt(t, e, true, true), t;
    })();
  }
  function sn(e) {
    function t(n) {
      (n.key === "Enter" || n.key === " ") && e.onClose();
    }
    return [tn(), (() => {
      var n = nn();
      return n.style.setProperty("position", "absolute"), n.style.setProperty("top", "16px"), n.style.setProperty("right", "16px"), n.style.setProperty("background", "none"), n.style.setProperty("border", "none"), n.style.setProperty("cursor", "pointer"), n.style.setProperty("padding", "0"), n.style.setProperty("margin", "0"), n.style.setProperty("border-radius", "50%"), n.addEventListener("click", e.onClose), n.addEventListener("keydown", t), b(n, g(rn, {})), n;
    })()];
  }
  var on = /* @__PURE__ */ C(`<style>
/*! modern-normalize v2.0.0 | MIT License | https://github.com/sindresorhus/modern-normalize */

/*
Document
========
*/

/**
Use a better box model (opinionated).
*/

*,
::before,
::after {
	box-sizing: border-box;
	margin: 0; /* Remove all margins from everywhere. */
}

:host {
	/* Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3) */
	font-family:
		'DM Sans', /* Note: not part of modern-normalize, added specifically for this project. */
		system-ui,
		'Segoe UI',
		Roboto,
		Helvetica,
		Arial,
		sans-serif,
		'Apple Color Emoji',
		'Segoe UI Emoji';
	line-height: 1.15; /* 1. Correct the line height in all browsers. */
	-webkit-text-size-adjust: 100%; /* 2. Prevent adjustments of font size after orientation changes in iOS. */
	-moz-tab-size: 4; /* 3. Use a more readable tab size (opinionated). */
	tab-size: 4; /* 3 */
}

/*
Sections
========
*/

:host {
	margin: 0; /* Remove the margin in all browsers. */
}

/*
Grouping content
================
*/

/**
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
*/

hr {
	height: 0; /* 1 */
	color: inherit; /* 2 */
}

/*
Text-level semantics
====================
*/

/**
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr[title] {
	text-decoration: underline dotted;
}

/**
Add the correct font weight in Edge and Safari.
*/

b,
strong {
	font-weight: bolder;
}

/**
1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
2. Correct the odd 'em' font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
	font-family:
		ui-monospace,
		SFMono-Regular,
		Consolas,
		'Liberation Mono',
		Menlo,
		monospace; /* 1 */
	font-size: 1em; /* 2 */
}

/**
Add the correct font size in all browsers.
*/

small {
	font-size: 80%;
}

/**
Prevent 'sub' and 'sup' elements from affecting the line height in all browsers.
*/

sub,
sup {
	font-size: 75%;
	line-height: 0;
	position: relative;
	vertical-align: baseline;
}

sub {
	bottom: -0.25em;
}

sup {
	top: -0.5em;
}

/*
Tabular data
============
*/

/**
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
*/

table {
	text-indent: 0; /* 1 */
	border-color: inherit; /* 2 */
}

/*
Forms
=====
*/

/**
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
*/

button,
input,
optgroup,
select,
textarea {
	font-family: inherit; /* 1 */
	font-size: 100%; /* 1 */
	line-height: 1.15; /* 1 */
	margin: 0; /* 2 */
}

/**
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
	text-transform: none;
}

/**
Correct the inability to style clickable types in iOS and Safari.
*/

button,
[type='button'],
[type='reset'],
[type='submit'] {
	-webkit-appearance: button;
}

/**
Remove the inner border and padding in Firefox.
*/

::-moz-focus-inner {
	border-style: none;
	padding: 0;
}

/**
Restore the focus styles unset by the previous rule.
*/

:-moz-focusring {
	outline: 1px dotted ButtonText;
}

/**
Remove the additional ':invalid' styles in Firefox.
See: https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737
*/

:-moz-ui-invalid {
	box-shadow: none;
}

/**
Remove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.
*/

legend {
	padding: 0;
}

/**
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
	vertical-align: baseline;
}

/**
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
	height: auto;
}

/**
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
	-webkit-appearance: textfield; /* 1 */
	outline-offset: -2px; /* 2 */
}

/**
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
	-webkit-appearance: none;
}

/**
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to 'inherit' in Safari.
*/

::-webkit-file-upload-button {
	-webkit-appearance: button; /* 1 */
	font: inherit; /* 2 */
}

/*
Interactive
===========
*/

/*
Add the correct display in Chrome and Safari.
*/

summary {
	display: list-item;
}
`);
  function ln() {
    return on();
  }
  var an = /* @__PURE__ */ C("<div class=divider><div>");
  function cn() {
    return (() => {
      var e = an(), t = e.firstChild;
      return t.style.setProperty("height", "100%"), t.style.setProperty("width", "1px"), t.style.setProperty("background", "#dcdcdc"), e;
    })();
  }
  var un = /* @__PURE__ */ C("<div>");
  function dn(e) {
    return (() => {
      var t = un();
      return t.style.setProperty("padding", "24px"), t.style.setProperty("height", "100%"), b(t, () => e.children), t;
    })();
  }
  var fn = /* @__PURE__ */ C("<div>");
  function hn(e) {
    return (() => {
      var t = fn();
      return t.style.setProperty("display", "flex"), t.style.setProperty("flex-direction", "column"), t.style.setProperty("justify-content", "center"), t.style.setProperty("align-items", "center"), t.style.setProperty("height", "100%"), b(t, () => e.children), t;
    })();
  }
  var pn = /* @__PURE__ */ C("<div><div>\u{1F914}</div><div>What is a wallet?</div><p>Wallets let you send, receive, store and display digital assets like Bitcoin, Stacks, Ordinals & NFTs.</p><p>Explore Bitcoin apps by connecting your wallet.");
  function yn() {
    return (() => {
      var e = pn(), t = e.firstChild, n = t.nextSibling, i = n.nextSibling, r = i.nextSibling;
      return e.style.setProperty("display", "flex"), e.style.setProperty("flex-direction", "column"), e.style.setProperty("row-gap", "8px"), e.style.setProperty("justify-content", "center"), e.style.setProperty("align-items", "center"), t.style.setProperty("font-size", "50px"), t.style.setProperty("line-height", "140%"), A((s) => {
        var l = re, o = W2, c = W2;
        return s.e = L(n, l, s.e), s.t = L(i, o, s.t), s.a = L(r, c, s.a), s;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), e;
    })();
  }
  function Se(e) {
    var n;
    const t = (n = e.installPrompt) == null ? void 0 : n.url;
    if (!t) {
      console.error("No install prompt URL found for", e.id);
      return;
    }
    window.open(t, "_blank");
  }
  var gn = /* @__PURE__ */ C(`<style>
          .install-prompt-button:focus-visible {
            outline: 2px solid #181818;
            outline-offset: 2px;
          }
        `);
  var mn = /* @__PURE__ */ C("<div><img><h1>Don't have <!>?</h1><p>Download it on the Chrome web store.</p><div class=install-prompt-button role=button tabindex=0>Get");
  function bn(e) {
    function t(i) {
      (i.key === "Enter" || i.key === " ") && Se(e.option);
    }
    function n() {
      Se(e.option);
    }
    return [gn(), (() => {
      var i = mn(), r = i.firstChild, s = r.nextSibling, l = s.firstChild, o = l.nextSibling;
      o.nextSibling;
      var c = s.nextSibling, f = c.nextSibling;
      return i.style.setProperty("display", "flex"), i.style.setProperty("flex-direction", "column"), i.style.setProperty("align-items", "center"), i.style.setProperty("row-gap", "16px"), r.style.setProperty("border-radius", "12px"), r.style.setProperty("height", "64px"), r.style.setProperty("width", "64px"), r.style.setProperty("object-fit", "cover"), b(s, () => e.option.name, o), f.addEventListener("click", n), f.addEventListener("keydown", t), A((a) => {
        var u = e.option.icon, d = e.option.name, h = {
          ...re,
          "text-align": "center"
        }, v = W2, y = {
          ...Qt,
          cursor: "pointer",
          "border-radius": "12px",
          background: "#181818",
          color: "white",
          padding: "12px 16px"
        };
        return u !== a.e && N(r, "src", a.e = u), d !== a.t && N(r, "alt", a.t = d), a.a = L(s, h, a.a), a.o = L(c, v, a.o), a.i = L(f, y, a.i), a;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), i;
    })()];
  }
  var wn = /* @__PURE__ */ C('<svg width=20 height=20 viewBox="0 0 20 20"xmlns=http://www.w3.org/2000/svg><circle cx=10 cy=10 r=9.05 stroke=black stroke-width=1.9 fill=none stroke-dasharray="42.65 14.22"stroke-dashoffset=0><animateTransform attributeName=transform attributeType=XML type=rotate from="0 10 10"to="360 10 10"dur=0.75s repeatCount=indefinite>');
  var vn = /* @__PURE__ */ C("<div>");
  var xn = () => wn();
  function Cn() {
    return (() => {
      var e = vn();
      return e.style.setProperty("display", "flex"), e.style.setProperty("justify-content", "center"), e.style.setProperty("align-items", "center"), e.style.setProperty("height", "100%"), e.style.setProperty("animation", "spin 1s linear infinite"), b(e, g(xn, {})), e;
    })();
  }
  var Pn = /* @__PURE__ */ C("<div><img><h1>Opening <!>...</h1><p>Confirm the operation in ");
  function Sn(e) {
    return (() => {
      var t = Pn(), n = t.firstChild, i = n.nextSibling, r = i.firstChild, s = r.nextSibling;
      s.nextSibling;
      var l = i.nextSibling;
      return l.firstChild, t.style.setProperty("display", "flex"), t.style.setProperty("flex-direction", "column"), t.style.setProperty("align-items", "center"), t.style.setProperty("row-gap", "16px"), n.style.setProperty("border-radius", "12px"), n.style.setProperty("height", "64px"), n.style.setProperty("width", "64px"), n.style.setProperty("object-fit", "cover"), b(i, () => e.option.name, s), b(l, () => e.option.name, null), b(t, g(Cn, {}), null), A((o) => {
        var c = e.option.icon, f = e.option.name, a = {
          ...re,
          "text-align": "center"
        }, u = W2;
        return c !== o.e && N(n, "src", o.e = c), f !== o.t && N(n, "alt", o.t = f), o.a = L(i, a, o.a), o.o = L(l, u, o.o), o;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), t;
    })();
  }
  var _n = /* @__PURE__ */ C("<div><div tabindex=0><img><div>");
  function En(e) {
    function t() {
      e.onProviderSelected(e.id);
    }
    const n = F(() => ke(e) ? "button" : "link");
    function i(u) {
      if (n() === "link") {
        u.key === "Enter" && t();
        return;
      }
      if (n() === "button") {
        (u.key === "Enter" || u.key === " ") && t();
        return;
      }
    }
    const [r, s] = j(false), [l, o] = j(false), c = () => r() || l(), f = "rgba(24, 24, 24, 0.20)", a = "rgba(24, 24, 24, 0.60)";
    return (() => {
      var u = _n(), d = u.firstChild, h = d.firstChild, v = h.nextSibling;
      return u.style.setProperty("aspect-ratio", "1 / 1"), u.style.setProperty("overflow", "hidden"), d.style.setProperty("display", "flex"), d.style.setProperty("flex-direction", "column"), d.style.setProperty("row-gap", "12px"), d.style.setProperty("align-items", "center"), d.style.setProperty("cursor", "pointer"), d.style.setProperty("outline", "none"), d.style.setProperty("padding-top", "10px"), d.addEventListener("click", t), d.addEventListener("keydown", i), d.addEventListener("mouseenter", () => s(true)), d.addEventListener("mouseleave", () => s(false)), d.addEventListener("focus", () => o(true)), d.addEventListener("blur", () => o(false)), h.style.setProperty("width", "56px"), h.style.setProperty("height", "56px"), h.style.setProperty("object-fit", "cover"), h.style.setProperty("border-radius", "12px"), b(v, () => e.name), A((y) => {
        var z = n(), $ = c() ? `6px solid ${f}` : "none", P = e.icon, _ = e.name, E = {
          ...W2,
          color: c() ? a : void 0,
          "text-align": "center"
        };
        return z !== y.e && N(d, "role", y.e = z), $ !== y.t && ((y.t = $) != null ? h.style.setProperty("outline", $) : h.style.removeProperty("outline")), P !== y.a && N(h, "src", y.a = P), _ !== y.o && N(h, "alt", y.o = _), y.i = L(v, E, y.i), y;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), u;
    })();
  }
  var kn = /* @__PURE__ */ C('<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&amp;display=swap"rel=stylesheet>');
  var $n = /* @__PURE__ */ C("<div class=side-panel>");
  var An = /* @__PURE__ */ C('<div><div></div><div><div class=card-width-container><div class=card-height-container><div class=card><div class=card-grid><div class=main-panel><div></div><div></div><div class=wallets-grid-container data-desc="wallet grid container for padding"><div class=wallets-grid data-desc="wallet grid container">');
  var Ln = /* @__PURE__ */ C(`<div><style>
        @keyframes wallet-selector-fade-in {
          from {opacity: 0; transform: translateY(40px);}
          to {opacity: 1; transform: translateY(0);}
        }

        @keyframes wallet-selector-fade-out {
          from {opacity: 1; transform: translateY(0);}
          to {opacity: 0; transform: translateY(40px);}
        }
        @keyframes wallet-selector-blur-in {
          from {opacity: 0; backdrop-filter: blur(0px);}
          to {opacity: 1; backdrop-filter: blur(10px);}
        }

        @keyframes wallet-selector-blur-out {
          from {opacity: 1; backdrop-filter: blur(10px);}
          to {opacity: 0; backdrop-filter: blur(0px);}
        }
      </style><style>`);
  var G = "24px";
  function On() {
    const [e, t] = j(), [n, i] = j(), [r, s] = j();
    function l() {
      const p = e(), x = r();
      return !(!p || !x || !p.contains(x) || getComputedStyle(x).display === "none");
    }
    const [o, c] = j(false), [f, a] = j(false), [u, d] = j([]), [h, v] = j({
      type: "none"
    }), y = () => u().some((p) => jn(p)), z = () => c(false);
    function $() {
      const p = new CustomEvent(xe, {
        bubbles: true,
        composed: true
      });
      window.dispatchEvent(p), z();
    }
    function P(p) {
      p.key === "Escape" && $();
    }
    Fe(() => {
      if (o()) {
        window.addEventListener("keydown", P);
        return;
      }
      window.removeEventListener("keydown", P);
    });
    function _(p) {
      const x = u().find((K2) => K2.id === p);
      if (ke(x)) {
        l() ? v({
          type: "install-wallet-prompt",
          option: x
        }) : Se(x);
        return;
      }
      const O = new CustomEvent(ve, {
        detail: p,
        bubbles: true,
        composed: true
      });
      window.dispatchEvent(O);
    }
    function E(p) {
      mt(() => {
        c(true), a(true);
        const x = p.detail.options;
        d(x), x.some((O) => !O.installPrompt) ? v({
          type: "explainer"
        }) : v({
          type: "none"
        });
      });
    }
    function R() {
      c(false);
    }
    const se = () => {
      o() || a(false);
    };
    function Ye(p) {
      const x = p.detail;
      v({
        type: "opening-wallet",
        option: u().find((O) => O.id === x)
      });
    }
    function Ge() {
      v({
        type: "explainer"
      });
    }
    bt(() => {
      window.addEventListener(Ce, E), window.addEventListener(Pe, R), window.addEventListener(Xe, Ye), window.addEventListener(qe, Ge), document.head.appendChild(kn());
    }), Me(() => {
      window.removeEventListener(Ce, E), window.removeEventListener(Pe, R);
    });
    function Ze(p) {
      const x = p.target;
      if (!x)
        return;
      const O = n();
      O && (O.contains(x) || $());
    }
    return (() => {
      var p = Ln(), x = p.firstChild, O = x.nextSibling;
      return ye(t, p), p.style.setProperty("inset", "0"), p.addEventListener("click", Ze), p.addEventListener("keydown", () => {
        console.log("Inside root keydown");
      }), b(p, g(ln, {}), x), b(O, () => `
        .card-width-container {
          container: card-width-container / inline-size;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 740px;
        }

        .card-height-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          height: 100%;
          width: 100%;
        }

        .card {
          min-height: 340px;
          max-height: calc(100vh - 8rem);
          width: 100%;
          border-top-left-radius: ${G};
          border-top-right-radius: ${G};

          background: rgb(196, 177, 217);
          overflow: hidden;

          display: flex;
          flex-direction: column;

          position: "relative"; /* For the close button */
          background-color: #ffffff;
          display: ${f() ? "block" : "none"};

          box-shadow: 0px 8px 64px 0px rgba(0, 0, 0, 0.25);
          animation: ${o() ? "wallet-selector-fade-in 0.4s cubic-bezier(.05, .7, .1, 1) forwards" : "wallet-selector-fade-out 0.2s cubic-bezier(.3, 0, .8, .15) forwards"};
        }

        .card-grid {
          flex-grow: 1;
          height: 100%;
          
          display: grid;
          grid-template-columns: 1fr;
          grid-template-areas: "mainPanel";
        }

        .main-panel {
          height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          grid-area: mainPanel;
        }

        .wallets-grid-container {
          overflow: auto;
          flex-grow: 1;
        }

        .wallets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          align-content: start;

          padding-left: 24px;
          padding-right: 24px;
          padding-bottom: 40px;
        }

        .divider {
          display: none;
          grid-area: divider;
        }

        .side-panel {
          display: none;
          grid-area: sidePanel;
        }

        @container card-width-container (width > 400px) {
          .card-height-container {
            justify-content: center;
          }

          .card {
            max-width: calc(100vw - 2rem);
            max-height: 460px;
            ${y() ? "" : "width: 360px;"}
            border-bottom-left-radius: ${G};
            border-bottom-right-radius: ${G};
          }

          .card-grid {
            grid-template-columns: ${y() ? "5fr auto 4fr" : "1fr"};
            grid-template-areas: ${y() ? '"mainPanel divider sidePanel"' : '"mainPanel"'};
          }

          .divider {
            display: block;
          }

          .side-panel {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        }
      `), b(p, g(he, {
        get when() {
          return f();
        },
        get children() {
          var K2 = An(), B = K2.firstChild, X = B.nextSibling, Je = X.firstChild, Qe = Je.firstChild, H = Qe.firstChild, oe = H.firstChild, et = oe.firstChild, le = et.firstChild, ae = le.nextSibling, tt = ae.nextSibling, nt = tt.firstChild;
          return K2.style.setProperty("position", "fixed"), K2.style.setProperty("inset", "0"), B.style.setProperty("background-color", "#FFFFFF80"), B.style.setProperty("position", "absolute"), B.style.setProperty("inset", "0"), X.style.setProperty("display", "flex"), X.style.setProperty("justify-content", "center"), X.style.setProperty("align-items", "center"), X.style.setProperty("height", "100%"), ye(i, H), H.addEventListener("animationend", se), b(le, () => y() ? "Choose wallet to connect" : "Don't have a wallet?"), b(ae, () => y() ? "Start by selecting one of the wallets below and confirming the connection." : "Start by installing one of the wallets below."), b(nt, g(At, {
            get each() {
              return u();
            },
            children: (k) => g(En, $t(k, {
              onProviderSelected: _
            }))
          })), b(oe, g(he, {
            get when() {
              return h().type !== "none";
            },
            get children() {
              return g(cn, {});
            }
          }), null), b(oe, g(he, {
            get when() {
              return h().type !== "none";
            },
            get children() {
              var k = $n();
              return ye(s, k), b(k, g(dn, {
                get children() {
                  return g(hn, {
                    get children() {
                      return g(Lt, {
                        fallback: null,
                        get children() {
                          return [g(pe, {
                            get when() {
                              return h().type === "install-wallet-prompt";
                            },
                            get children() {
                              return g(bn, {
                                get option() {
                                  return h().option;
                                }
                              });
                            }
                          }), g(pe, {
                            get when() {
                              return h().type === "explainer";
                            },
                            get children() {
                              return g(yn, {});
                            }
                          }), g(pe, {
                            get when() {
                              return h().type === "opening-wallet";
                            },
                            get children() {
                              return g(Sn, {
                                get option() {
                                  return h().option;
                                }
                              });
                            }
                          })];
                        }
                      });
                    }
                  });
                }
              })), k;
            }
          }), null), b(H, g(sn, {
            onClose: $
          }), null), A((k) => {
            var ce = o() ? "wallet-selector-blur-in 0.2s cubic-bezier(.05, .7, .1, 1) forwards" : "wallet-selector-blur-out 0.2s cubic-bezier(.3, 0, .8, .15) forwards", it = {
              ...re,
              margin: "0",
              "padding-top": "24px",
              "padding-left": "24px",
              "padding-right": "24px",
              "padding-bottom": "16px"
            }, rt = {
              ...W2,
              "padding-left": "24px",
              "padding-right": "24px",
              "padding-bottom": "30px"
            };
            return ce !== k.e && ((k.e = ce) != null ? B.style.setProperty("animation", ce) : B.style.removeProperty("animation")), k.t = L(le, it, k.t), k.a = L(ae, rt, k.a), k;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), K2;
        }
      }), null), A(() => (f() ? "fixed" : "static") != null ? p.style.setProperty("position", f() ? "fixed" : "static") : p.style.removeProperty("position")), p;
    })();
  }
  var Ee = "sats-connect-wallet-provider-selector";
  var ge = Ee;
  function He() {
    return document.getElementById(Ee);
  }
  function Nn() {
    if (customElements.get(ge))
      return;
    Jt(ge, On);
    const e = document.createElement(ge);
    e.id = Ee, e.style.position = "relative", e.style.zIndex = "999999", document.body.appendChild(e);
  }
  function ke(e) {
    return !!e.installPrompt;
  }
  function jn(e) {
    return !ke(e);
  }
  function Rn(e) {
    return new Promise((t, n) => {
      if (!He()) {
        n("Failed to detect the wallet provider selector.");
        return;
      }
      function r() {
        window.removeEventListener(ve, s), window.removeEventListener(xe, l);
      }
      function s(c) {
        t(c.detail), r();
      }
      function l() {
        n(), r();
      }
      window.addEventListener(ve, s), window.addEventListener(xe, l);
      const o = new CustomEvent(Ce, {
        detail: e
      });
      window.dispatchEvent(o);
    });
  }
  function In(e) {
    const t = new CustomEvent(Xe, {
      detail: e
    });
    window.dispatchEvent(t);
  }
  function Fn() {
    const e = new CustomEvent(qe);
    window.dispatchEvent(e);
  }
  function Mn() {
    const e = new CustomEvent(Pe);
    window.dispatchEvent(e);
  }

  // node_modules/sats-connect/dist/index.mjs
  var Wallet = class {
    constructor() {
      __publicField(this, "providerId");
      __publicField(this, "defaultAdapters", defaultAdapters);
      __publicField(this, "createCustomConfig");
      __publicField(this, "addListener", (...rawArgs) => {
        const listenerInfo = (() => {
          if (rawArgs.length === 1) return rawArgs[0];
          const actualArgs = rawArgs;
          return {
            eventName: actualArgs[0],
            cb: actualArgs[1]
          };
        })();
        const defaultProvider = getDefaultProvider();
        if (!this.isProviderSet() && defaultProvider) {
          this.providerId = defaultProvider;
        }
        if (!this.isProviderSet()) {
          console.error(
            "No wallet provider selected. The user must first select a wallet before adding listeners to wallet events."
          );
          return () => {
          };
        }
        const adapter2 = this.defaultAdapters[this.providerId];
        if (!adapter2 || !new adapter2().addListener) {
          console.error(
            `The wallet provider you are using does not support the addListener method. Please update your wallet provider.`
          );
          return () => {
          };
        }
        return new adapter2().addListener(listenerInfo);
      });
    }
    isProviderSet() {
      return !!this.providerId;
    }
    setCreateCustomConfig(createCustomConfig) {
      this.createCustomConfig = createCustomConfig;
    }
    async selectProvider() {
      const providers = getSupportedWallets();
      if (providers.length === 0) {
        throw new Error("No wallets detected, may want to prompt user to install a wallet.");
      }
      const selectorConfig = this.createCustomConfig ? this.createCustomConfig(providers) : makeDefaultConfig(providers);
      const nextProviderId = await Rn(selectorConfig);
      this.providerId = nextProviderId;
    }
    async disconnect() {
      await this.request("wallet_renouncePermissions", void 0);
      this.providerId = void 0;
      removeDefaultProvider();
    }
    async request(method, params) {
      Nn();
      const defaultProvider = getDefaultProvider();
      if (!this.isProviderSet()) {
        if (defaultProvider) {
          this.providerId = defaultProvider;
        } else {
          try {
            await this.selectProvider();
          } catch {
            return {
              status: "error",
              error: {
                code: RpcErrorCode.INTERNAL_ERROR,
                message: "Failed to select the provider. User may have cancelled the selection prompt."
              }
            };
          }
        }
      }
      const adapter2 = this.defaultAdapters[this.providerId];
      In(this.providerId);
      const response = adapter2 ? await new adapter2().request(method, params) : await new BaseAdapter(this.providerId).request(method, params);
      Fn();
      if (response?.status === "error" && response.error?.code === RpcErrorCode.USER_REJECTION) {
        if (!defaultProvider) {
          this.providerId = void 0;
        }
      } else {
        setDefaultProvider(this.providerId);
      }
      Mn();
      if (!response) {
        return {
          status: "error",
          error: {
            code: RpcErrorCode.INTERNAL_ERROR,
            message: "Wallet Error processing the request"
          }
        };
      }
      return response;
    }
  };
  var index_default = new Wallet();

  // src/xverseBridge.ts
  var button = document.getElementById("import");
  var status = document.getElementById("status");
  var token = location.hash.slice(1);
  history.replaceState(null, "", "/");
  function message(s) {
    status.textContent = s;
  }
  function errorText(e) {
    return e instanceof Error ? e.message : String(e);
  }
  button.onclick = async () => {
    button.disabled = true;
    try {
      if (!/^[a-f0-9-]{36}$/.test(token)) throw new Error("Import session expired. Restart from Studio.");
      message("Connecting to Xverse...");
      const connected = await request("wallet_connect", {
        addresses: [AddressPurpose.Ordinals, AddressPurpose.Payment],
        message: "OrdiFi Studio: one-time, read-only import"
      });
      if (connected.status !== "success") throw new Error(connected.error?.message ?? "Connection declined");
      const accounts = connected.result.addresses;
      const ordinal = accounts.find((a) => a.purpose === AddressPurpose.Ordinals);
      if (!ordinal?.address) throw new Error("No Ordinals address was returned");
      const network = connected.result.network?.bitcoin?.name ?? "Mainnet";
      if (String(network).toLowerCase() !== "mainnet") throw new Error("Only Bitcoin mainnet is supported");
      const items = [];
      let total = 0;
      let offset = 0;
      do {
        message(`Reading wallet inscriptions: ${items.length}${total ? " / " + total : ""}`);
        const response = await request("ord_getInscriptions", { limit: 100, offset });
        if (response.status !== "success") throw new Error(response.error?.message ?? "Read failed");
        total = Number(response.result.total);
        if (!Number.isSafeInteger(total) || total < 0 || total > 1e5) throw new Error("Invalid wallet count");
        const page = response.result.inscriptions;
        if (!Array.isArray(page) || page.length === 0 && items.length < total) throw new Error("Incomplete wallet response");
        items.push(...page);
        offset += page.length;
        if (items.length > total) throw new Error("Wallet changed during import. Retry from Studio.");
      } while (items.length < total);
      const payload = {
        schema: "ordifi-xverse-import",
        version: 1,
        blockchain: "bitcoin",
        walletAddress: ordinal.address,
        network: "Mainnet",
        exportedAt: Date.now(),
        total,
        inscriptions: items.map((item) => ({
          inscriptionId: item.inscriptionId,
          inscriptionNumber: item.inscriptionNumber,
          collectionName: item.collectionName ?? null,
          contentType: item.contentType,
          address: item.address,
          output: item.output,
          offset: item.offset,
          postage: item.postage
        }))
      };
      message(`Sending ${total} inscriptions to Studio...`);
      const transfer = await fetch("/import", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-OrdiFi-Token": token },
        body: JSON.stringify(payload),
        cache: "no-store"
      });
      if (!transfer.ok) throw new Error(`Studio did not accept data: HTTP ${transfer.status}`);
      message(`${total} inscriptions sent successfully. Return to Studio to review and confirm the import. You can close this tab.`);
    } catch (e) {
      message(`Import unsuccessful: ${errorText(e)}
Return to Studio and restart the import.`);
    } finally {
      button.disabled = false;
    }
  };
})();
/*! Bundled license information:

@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/secp256k1/lib/index.js:
  (*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) *)

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

bowser/bowser.mjs:
  (*!
   * Bowser - a browser detector
   * https://github.com/lancedikson/bowser
   * MIT License | (c) Dustin Diaz 2012-2015
   * MIT License | (c) Denis Demchenko 2015-2026
   *)
  (*!
  * Bowser - a browser detector
  * https://github.com/bowser-js/bowser
  * MIT License | (c) Dustin Diaz 2012-2015
  * MIT License | (c) Denis Demchenko 2015-2026
  *)
*/
