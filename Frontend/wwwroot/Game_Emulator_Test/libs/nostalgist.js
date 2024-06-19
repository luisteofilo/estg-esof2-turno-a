(function (global2, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : ((global2 =
        typeof globalThis !== "undefined" ? globalThis : global2 || self),
      (global2.Nostalgist = factory()));
})(this, function () {
  "use strict";
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) =>
    key in obj
      ? __defProp(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      : (obj[key] = value);
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  function _mergeNamespaces(n, m) {
    for (var i = 0; i < m.length; i++) {
      const e = m[i];
      if (typeof e !== "string" && !Array.isArray(e)) {
        for (const k in e) {
          if (k !== "default" && !(k in n)) {
            const d = Object.getOwnPropertyDescriptor(e, k);
            if (d) {
              Object.defineProperty(
                n,
                k,
                d.get
                  ? d
                  : {
                      enumerable: true,
                      get: () => e[k],
                    }
              );
            }
          }
        }
      }
    }
    return Object.freeze(
      Object.defineProperty(n, Symbol.toStringTag, { value: "Module" })
    );
  }
  const systemCoreMap = {
    gb: "mgba",
    gba: "mgba",
    gbc: "mgba",
    megadrive: "genesis_plus_gx",
    nes: "fceumm",
    snes: "snes9x",
  };
  var commonjsGlobal =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
      ? global
      : typeof self !== "undefined"
      ? self
      : {};
  function getDefaultExportFromCjs(x) {
    return x &&
      x.__esModule &&
      Object.prototype.hasOwnProperty.call(x, "default")
      ? x["default"]
      : x;
  }
  const { hasOwnProperty } = Object.prototype;
  const encode = (obj, opt = {}) => {
    if (typeof opt === "string") {
      opt = { section: opt };
    }
    opt.align = opt.align === true;
    opt.newline = opt.newline === true;
    opt.sort = opt.sort === true;
    opt.whitespace = opt.whitespace === true || opt.align === true;
    opt.platform =
      opt.platform || (typeof process !== "undefined" && process.platform);
    opt.bracketedArray = opt.bracketedArray !== false;
    const eol = opt.platform === "win32" ? "\r\n" : "\n";
    const separator = opt.whitespace ? " = " : "=";
    const children = [];
    const keys = opt.sort ? Object.keys(obj).sort() : Object.keys(obj);
    let padToChars = 0;
    if (opt.align) {
      padToChars = safe(
        keys
          .filter(
            (k) =>
              obj[k] === null ||
              Array.isArray(obj[k]) ||
              typeof obj[k] !== "object"
          )
          .map((k) => (Array.isArray(obj[k]) ? `${k}[]` : k))
          .concat([""])
          .reduce((a, b) => (safe(a).length >= safe(b).length ? a : b))
      ).length;
    }
    let out = "";
    const arraySuffix = opt.bracketedArray ? "[]" : "";
    for (const k of keys) {
      const val = obj[k];
      if (val && Array.isArray(val)) {
        for (const item of val) {
          out +=
            safe(`${k}${arraySuffix}`).padEnd(padToChars, " ") +
            separator +
            safe(item) +
            eol;
        }
      } else if (val && typeof val === "object") {
        children.push(k);
      } else {
        out += safe(k).padEnd(padToChars, " ") + separator + safe(val) + eol;
      }
    }
    if (opt.section && out.length) {
      out =
        "[" + safe(opt.section) + "]" + (opt.newline ? eol + eol : eol) + out;
    }
    for (const k of children) {
      const nk = splitSections(k, ".").join("\\.");
      const section = (opt.section ? opt.section + "." : "") + nk;
      const child = encode(obj[k], {
        ...opt,
        section,
      });
      if (out.length && child.length) {
        out += eol;
      }
      out += child;
    }
    return out;
  };
  function splitSections(str, separator) {
    var lastMatchIndex = 0;
    var lastSeparatorIndex = 0;
    var nextIndex = 0;
    var sections = [];
    do {
      nextIndex = str.indexOf(separator, lastMatchIndex);
      if (nextIndex !== -1) {
        lastMatchIndex = nextIndex + separator.length;
        if (nextIndex > 0 && str[nextIndex - 1] === "\\") {
          continue;
        }
        sections.push(str.slice(lastSeparatorIndex, nextIndex));
        lastSeparatorIndex = nextIndex + separator.length;
      }
    } while (nextIndex !== -1);
    sections.push(str.slice(lastSeparatorIndex));
    return sections;
  }
  const decode = (str, opt = {}) => {
    opt.bracketedArray = opt.bracketedArray !== false;
    const out = /* @__PURE__ */ Object.create(null);
    let p = out;
    let section = null;
    const re = /^\[([^\]]*)\]\s*$|^([^=]+)(=(.*))?$/i;
    const lines = str.split(/[\r\n]+/g);
    const duplicates = {};
    for (const line of lines) {
      if (!line || line.match(/^\s*[;#]/) || line.match(/^\s*$/)) {
        continue;
      }
      const match = line.match(re);
      if (!match) {
        continue;
      }
      if (match[1] !== void 0) {
        section = unsafe(match[1]);
        if (section === "__proto__") {
          p = /* @__PURE__ */ Object.create(null);
          continue;
        }
        p = out[section] = out[section] || /* @__PURE__ */ Object.create(null);
        continue;
      }
      const keyRaw = unsafe(match[2]);
      let isArray;
      if (opt.bracketedArray) {
        isArray = keyRaw.length > 2 && keyRaw.slice(-2) === "[]";
      } else {
        duplicates[keyRaw] =
          ((duplicates == null ? void 0 : duplicates[keyRaw]) || 0) + 1;
        isArray = duplicates[keyRaw] > 1;
      }
      const key = isArray ? keyRaw.slice(0, -2) : keyRaw;
      if (key === "__proto__") {
        continue;
      }
      const valueRaw = match[3] ? unsafe(match[4]) : true;
      const value =
        valueRaw === "true" || valueRaw === "false" || valueRaw === "null"
          ? JSON.parse(valueRaw)
          : valueRaw;
      if (isArray) {
        if (!hasOwnProperty.call(p, key)) {
          p[key] = [];
        } else if (!Array.isArray(p[key])) {
          p[key] = [p[key]];
        }
      }
      if (Array.isArray(p[key])) {
        p[key].push(value);
      } else {
        p[key] = value;
      }
    }
    const remove = [];
    for (const k of Object.keys(out)) {
      if (
        !hasOwnProperty.call(out, k) ||
        typeof out[k] !== "object" ||
        Array.isArray(out[k])
      ) {
        continue;
      }
      const parts = splitSections(k, ".");
      p = out;
      const l = parts.pop();
      const nl = l.replace(/\\\./g, ".");
      for (const part of parts) {
        if (part === "__proto__") {
          continue;
        }
        if (!hasOwnProperty.call(p, part) || typeof p[part] !== "object") {
          p[part] = /* @__PURE__ */ Object.create(null);
        }
        p = p[part];
      }
      if (p === out && nl === l) {
        continue;
      }
      p[nl] = out[k];
      remove.push(k);
    }
    for (const del of remove) {
      delete out[del];
    }
    return out;
  };
  const isQuoted = (val) => {
    return (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    );
  };
  const safe = (val) => {
    if (
      typeof val !== "string" ||
      val.match(/[=\r\n]/) ||
      val.match(/^\[/) ||
      (val.length > 1 && isQuoted(val)) ||
      val !== val.trim()
    ) {
      return JSON.stringify(val);
    }
    return val.split(";").join("\\;").split("#").join("\\#");
  };
  const unsafe = (val) => {
    val = (val || "").trim();
    if (isQuoted(val)) {
      if (val.charAt(0) === "'") {
        val = val.slice(1, -1);
      }
      try {
        val = JSON.parse(val);
      } catch {}
    } else {
      let esc = false;
      let unesc = "";
      for (let i = 0, l = val.length; i < l; i++) {
        const c = val.charAt(i);
        if (esc) {
          if ("\\;#".indexOf(c) !== -1) {
            unesc += c;
          } else {
            unesc += "\\" + c;
          }
          esc = false;
        } else if (";#".indexOf(c) !== -1) {
          break;
        } else if (c === "\\") {
          esc = true;
        } else {
          unesc += c;
        }
      }
      if (esc) {
        unesc += "\\";
      }
      return unesc.trim();
    }
    return val;
  };
  var ini = {
    parse: decode,
    decode,
    stringify: encode,
    encode,
    safe,
    unsafe,
  };
  const ini$1 = /* @__PURE__ */ getDefaultExportFromCjs(ini);
  const coreInfoMap = {
    81: { corename: "81", savestate: true },
    2048: { corename: "2048", savestate: true, supportsNoGame: true },
    "3dengine": { corename: "3DEngine" },
    "4do": { corename: "4DO", savestate: true },
    a5200: { corename: "a5200", savestate: true },
    advanced_tests: { corename: "Advanced Test", supportsNoGame: true },
    ardens: { corename: "Ardens", savestate: true },
    arduous: { corename: "Arduous" },
    atari800: { corename: "Atari800", savestate: true },
    bk: { corename: "bk", savestate: true },
    blastem: { corename: "BlastEm", savestate: true },
    bluemsx: { corename: "blueMSX", savestate: true },
    bnes: { corename: "bnes/higan", savestate: true },
    boom3: { corename: "boom3" },
    boom3_xp: { corename: "boom3_xp" },
    bsnes_cplusplus98: {
      cheats: true,
      corename: "bsnes C++98 (v085)",
      savestate: true,
    },
    bsnes_hd_beta: { corename: "bsnes-hd beta", savestate: true },
    bsnes: { corename: "bsnes", savestate: true },
    bsnes_mercury_accuracy: {
      cheats: true,
      corename: "bsnes-mercury Accuracy",
      savestate: true,
    },
    bsnes_mercury_balanced: {
      cheats: true,
      corename: "bsnes-mercury Balanced",
      savestate: true,
    },
    bsnes_mercury_performance: {
      cheats: true,
      corename: "bsnes-mercury Performance",
      savestate: true,
    },
    bsnes2014_accuracy: {
      cheats: true,
      corename: "bsnes 2014 Accuracy",
      savestate: true,
    },
    bsnes2014_balanced: {
      cheats: true,
      corename: "bsnes 2014 Balanced",
      savestate: true,
    },
    bsnes2014_performance: {
      cheats: true,
      corename: "bsnes 2014 Performance",
      savestate: true,
    },
    cannonball: { corename: "Cannonball", supportsNoGame: true },
    cap32: { corename: "Caprice32", savestate: true, supportsNoGame: true },
    cdi2015: { corename: "Philips CDi 2015" },
    chailove: { cheats: true, corename: "ChaiLove", savestate: true },
    chimerasnes: { cheats: true, corename: "ChimeraSNES", savestate: true },
    citra_canary: { corename: "Citra Canary/Experimental" },
    citra: { corename: "Citra", savestate: true },
    citra2018: { corename: "Citra 2018" },
    craft: { corename: "Craft", supportsNoGame: true },
    crocods: { corename: "CrocoDS", savestate: true },
    cruzes: { corename: "Cruzes", supportsNoGame: true },
    daphne: { corename: "Daphne" },
    desmume: { cheats: true, corename: "DeSmuME", savestate: true },
    desmume2015: { cheats: true, corename: "DeSmuME 2015", savestate: true },
    dinothawr: { corename: "Dinothawr", supportsNoGame: true },
    directxbox: { corename: "DirectXBox" },
    dirksimple: { corename: "DirkSimple", savestate: true },
    dolphin_launcher: { corename: "Dolphin Launcher", supportsNoGame: true },
    dolphin: { corename: "Dolphin", savestate: true },
    dosbox_core: { corename: "DOSBox-core", supportsNoGame: true },
    dosbox: { corename: "DOSBox", supportsNoGame: true },
    dosbox_pure: {
      cheats: true,
      corename: "DOSBox-pure",
      savestate: true,
      supportsNoGame: true,
    },
    dosbox_svn_ce: { corename: "DOSBox-SVN CE", supportsNoGame: true },
    dosbox_svn: { corename: "DOSBox-SVN", supportsNoGame: true },
    duckstation: { corename: "DuckStation", savestate: true },
    easyrpg: { corename: "EasyRPG Player" },
    ecwolf: { corename: "ECWolf", savestate: true },
    emuscv: { corename: "EmuSCV", supportsNoGame: true },
    emux_chip8: { corename: "Emux CHIP-8" },
    emux_gb: { corename: "Emux GB" },
    emux_nes: { corename: "Emux NES" },
    emux_sms: { corename: "Emux SMS" },
    ep128emu_core: {
      cheats: true,
      corename: "ep128emu-core",
      savestate: true,
      supportsNoGame: true,
    },
    fake08: { corename: "FAKE-08", savestate: true },
    fbalpha2012_cps1: { corename: "FB Alpha 2012 CPS-1", savestate: true },
    fbalpha2012_cps2: { corename: "FB Alpha 2012 CPS-2", savestate: true },
    fbalpha2012_cps3: { corename: "FB Alpha 2012 CPS-3", savestate: true },
    fbalpha2012: { corename: "FB Alpha 2012", savestate: true },
    fbalpha2012_neogeo: { corename: "FB Alpha 2012 Neo Geo", savestate: true },
    fbneo: { cheats: true, corename: "FinalBurn Neo", savestate: true },
    fceumm: { cheats: true, corename: "FCEUmm", savestate: true },
    ffmpeg: { corename: "FFmpeg" },
    fixgb: { corename: "fixGB" },
    fixnes: { corename: "fixNES" },
    flycast_gles2: { corename: "Flycast GLES2", savestate: true },
    flycast: { corename: "Flycast", savestate: true },
    fmsx: { corename: "fMSX" },
    freechaf: { corename: "FreeChaF" },
    freeintv: { corename: "FreeIntv" },
    freej2me: { corename: "FreeJ2ME" },
    frodo: { corename: "Frodo" },
    fsuae: { corename: "FS-UAE" },
    fuse: { corename: "Fuse" },
    galaksija: { corename: "galaksija", supportsNoGame: true },
    gambatte: { corename: "Gambatte", savestate: true },
    gearboy: { corename: "Gearboy" },
    gearcoleco: { corename: "Gearcoleco" },
    gearsystem: { corename: "Gearsystem" },
    genesis_plus_gx: {
      cheats: true,
      corename: "Genesis Plus GX",
      savestate: true,
    },
    genesis_plus_gx_wide: {
      cheats: true,
      corename: "Genesis Plus GX Wide",
      savestate: true,
    },
    gme: { corename: "Game Music Emu" },
    gong: { corename: "Gong", savestate: true, supportsNoGame: true },
    gpsp: { corename: "gpSP", savestate: true },
    gw: { corename: "GW" },
    handy: { corename: "Handy", savestate: true },
    hatari: { corename: "Hatari", savestate: true },
    hbmame: { corename: "HBMAME (Git)" },
    higan_sfc_balanced: {
      corename: "nSide (Super Famicom Balanced)",
      savestate: true,
    },
    higan_sfc: { corename: "nSide (Super Famicom Accuracy)", savestate: true },
    imageviewer: { corename: "Imageviewer" },
    ishiiruka: { corename: "Ishiiruka", savestate: true },
    jaxe: { corename: "JAXE" },
    jumpnbump: { corename: "jumpnbump" },
    kronos: { cheats: true, corename: "Kronos", savestate: true },
    lowresnx: { corename: "lowresnx" },
    lutro: { corename: "Lutro" },
    mame: { corename: "MAME", savestate: true },
    mame2000: { corename: "MAME 2000 (0.37b5)", savestate: true },
    mame2003: { corename: "MAME 2003 (0.78)", savestate: true },
    mame2003_midway: { corename: "MAME 2003 Midway (0.78)", savestate: true },
    mame2003_plus: { corename: "MAME 2003-Plus", savestate: true },
    mame2009: { corename: "MAME 2009 (0.135u4)" },
    mame2010: { corename: "MAME 2010 (0.139)" },
    mame2015: { corename: "MAME 2015 (0.160)" },
    mame2016: { corename: "MAME 2016 (0.174)" },
    mamearcade: { corename: "MAME (Git)" },
    mamemess: { corename: "MESS (Git)", savestate: true },
    mednafen_gba: { corename: "Beetle GBA" },
    mednafen_lynx: { corename: "Beetle Lynx" },
    mednafen_ngp: { corename: "Beetle NeoPop", savestate: true },
    mednafen_pce_fast: { corename: "Beetle PCE Fast", savestate: true },
    mednafen_pce: { corename: "Beetle PCE", savestate: true },
    mednafen_pcfx: { corename: "Beetle PC-FX" },
    mednafen_psx_hw: {
      cheats: true,
      corename: "Beetle PSX HW",
      savestate: true,
    },
    mednafen_psx: { cheats: true, corename: "Beetle PSX", savestate: true },
    mednafen_saturn: {
      cheats: true,
      corename: "Beetle Saturn",
      savestate: true,
    },
    mednafen_snes: { corename: "Beetle bsnes", savestate: true },
    mednafen_supafaust: {
      cheats: true,
      corename: "Beetle Supafaust",
      savestate: true,
    },
    mednafen_supergrafx: {
      cheats: true,
      corename: "Beetle SuperGrafx",
      savestate: true,
    },
    mednafen_vb: { corename: "Beetle VB" },
    mednafen_wswan: { corename: "Beetle WonderSwan", savestate: true },
    melonds: { corename: "melonDS" },
    mesen: { cheats: true, corename: "Mesen", savestate: true },
    "mesen-s": { corename: "Mesen-S" },
    mess2015: { corename: "MESS 2015 (0.160)" },
    meteor: { corename: "Meteor" },
    mgba: { cheats: true, corename: "mGBA", savestate: true },
    minivmac: { corename: "MinivmacII" },
    mojozork: { corename: "mojozork", savestate: true },
    moonlight: { corename: "Moonlight", supportsNoGame: true },
    mpv: { corename: "MPV" },
    mrboom: { corename: "Mr.Boom", savestate: true, supportsNoGame: true },
    mu: { corename: "Mu", supportsNoGame: true },
    mupen64plus_next_develop: {
      cheats: true,
      corename: "Mupen64Plus-Next",
      savestate: true,
    },
    mupen64plus_next_gles2: {
      cheats: true,
      corename: "Mupen64Plus-Next",
      savestate: true,
    },
    mupen64plus_next_gles3: {
      cheats: true,
      corename: "Mupen64Plus-Next",
      savestate: true,
    },
    mupen64plus_next: {
      cheats: true,
      corename: "Mupen64Plus-Next",
      savestate: true,
    },
    nekop2: { corename: "Neko Project II", savestate: true },
    neocd: { corename: "NeoCD" },
    nes: { corename: "nes", savestate: true },
    nestopia: { cheats: true, corename: "Nestopia", savestate: true },
    np2kai: { corename: "Neko Project II Kai", savestate: true },
    numero: { corename: "Numero", savestate: true, supportsNoGame: true },
    nxengine: { corename: "NXEngine", supportsNoGame: true },
    o2em: { corename: "O2EM", savestate: true },
    oberon: { corename: "Oberon" },
    openlara: { corename: "OpenLara" },
    opentyrian: { corename: "OpenTyrian", supportsNoGame: true },
    opera: { corename: "Opera", savestate: true, supportsNoGame: true },
    parallel_n64_debug: { corename: "ParaLLEl (Debug)", savestate: true },
    parallel_n64: { corename: "ParaLLEl N64", savestate: true },
    pascal_pong: { corename: "PascalPong", supportsNoGame: true },
    pcem: { corename: "PCem", supportsNoGame: true },
    pcsx_rearmed_interpreter: {
      cheats: true,
      corename: "PCSX ReARMed [Interpreter]",
      savestate: true,
    },
    pcsx_rearmed: { cheats: true, corename: "PCSX-ReARMed", savestate: true },
    pcsx_rearmed_neon: {
      cheats: true,
      corename: "PCSX ReARMed [NEON]",
      savestate: true,
    },
    pcsx1: { corename: "PCSX1" },
    pcsx2: { corename: "LRPS2", savestate: true },
    picodrive: { cheats: true, corename: "PicoDrive", savestate: true },
    play: { corename: "Play!", savestate: true },
    pocketcdg: { corename: "PocketCDG" },
    pokemini: { corename: "PokeMini", savestate: true },
    potator: { corename: "Potator", savestate: true },
    ppsspp: { corename: "PPSSPP", savestate: true },
    prboom: { cheats: true, corename: "PrBoom", savestate: true },
    prosystem: { corename: "ProSystem", savestate: true },
    puae: {
      cheats: true,
      corename: "PUAE",
      savestate: true,
      supportsNoGame: true,
    },
    puae2021: {
      cheats: true,
      corename: "PUAE 2021",
      savestate: true,
      supportsNoGame: true,
    },
    puzzlescript: { corename: "puzzlescript", savestate: true },
    px68k: { corename: "PX68k", supportsNoGame: true },
    quasi88: {
      cheats: true,
      corename: "QUASI88",
      savestate: true,
      supportsNoGame: true,
    },
    quicknes: { corename: "QuickNES", savestate: true },
    race: { corename: "RACE", savestate: true },
    redbook: { corename: "Redbook" },
    reminiscence: { corename: "REminiscence", savestate: true },
    remotejoy: { corename: "RemoteJoy", supportsNoGame: true },
    retro8: { corename: "Retro8" },
    retrodream: { corename: "RetroDream" },
    rustation: { corename: "Rustation" },
    same_cdi: { corename: "SAME CDi (Git)" },
    sameboy: { corename: "SameBoy" },
    sameduck: { corename: "SameDuck", savestate: true },
    scummvm: { corename: "ScummVM", supportsNoGame: true },
    simcp: { corename: "SimCoupe" },
    smsplus: { corename: "SMS Plus GX" },
    snes9x: { cheats: true, corename: "Snes9x", savestate: true },
    snes9x2002: { cheats: true, corename: "Snes9x 2002", savestate: true },
    snes9x2005: { cheats: true, corename: "Snes9x 2005", savestate: true },
    snes9x2005_plus: {
      cheats: true,
      corename: "Snes9x 2005 Plus",
      savestate: true,
    },
    snes9x2010: { cheats: true, corename: "Snes9x 2010", savestate: true },
    squirreljme: { corename: "SquirrelJME", supportsNoGame: true },
    stella: { corename: "Stella", savestate: true },
    stella2014: { corename: "Stella 2014", savestate: true },
    stonesoup: { corename: "Dungeon Crawl Stone Soup" },
    superbroswar: { corename: "superbroswar" },
    swanstation: { corename: "SwanStation", savestate: true },
    tempgba: { corename: "TempGBA" },
    test: { corename: "Test", supportsNoGame: true },
    test_netplay: { corename: "netplay-test", supportsNoGame: true },
    testaudio_callback: {
      corename: "TestAudio Callback",
      supportsNoGame: true,
    },
    testaudio_no_callback: {
      corename: "TestAudio NoCallback",
      supportsNoGame: true,
    },
    testaudio_playback_wav: {
      corename: "TestAudio Playback Wav",
      supportsNoGame: true,
    },
    testgl_compute_shaders: {
      corename: "TestGL ComputeShaders",
      supportsNoGame: true,
    },
    testgl_ff: { corename: "TestGL (FF)", supportsNoGame: true },
    testgl: { corename: "TestGL", supportsNoGame: true },
    testinput_buttontest: { corename: "Button Test", supportsNoGame: true },
    testretroluxury: { corename: "Test RetroLuxury", supportsNoGame: true },
    testsw: { corename: "TestSW", supportsNoGame: true },
    testsw_vram: { corename: "TestSW VRAM", supportsNoGame: true },
    testvulkan_async_compute: {
      corename: "TestVulkan AsyncCompute",
      supportsNoGame: true,
    },
    testvulkan: { corename: "TestVulkan", supportsNoGame: true },
    tgbdual: { corename: "TGB Dual", savestate: true },
    theodore: { corename: "theodore", savestate: true, supportsNoGame: true },
    thepowdertoy: {
      corename: "ThePowderToy",
      savestate: true,
      supportsNoGame: true,
    },
    tic80: { cheats: true, corename: "TIC-80", savestate: true },
    tyrquake: { cheats: true, corename: "TyrQuake" },
    uae4arm: { corename: "UAE4ARM", savestate: true },
    ume2015: { corename: "UME 2015 (0.160)" },
    uw8: { corename: "MicroW8", savestate: true },
    uzem: { corename: "uzem", savestate: true },
    vaporspec: { corename: "VaporSpec", savestate: true },
    vba_next: { corename: "VBA Next", savestate: true },
    vbam: { cheats: true, corename: "VBA-M", savestate: true },
    vecx: { corename: "vecx", savestate: true },
    vemulator: { corename: "VeMUlator" },
    vice_x128: {
      cheats: true,
      corename: "VICE x128",
      savestate: true,
      supportsNoGame: true,
    },
    vice_x64: {
      cheats: true,
      corename: "VICE x64",
      savestate: true,
      supportsNoGame: true,
    },
    vice_x64dtv: {
      cheats: true,
      corename: "VICE x64dtv",
      savestate: true,
      supportsNoGame: true,
    },
    vice_x64sc: {
      cheats: true,
      corename: "VICE x64sc",
      savestate: true,
      supportsNoGame: true,
    },
    vice_xcbm2: {
      cheats: true,
      corename: "VICE xcbm2",
      savestate: true,
      supportsNoGame: true,
    },
    vice_xcbm5x0: {
      cheats: true,
      corename: "VICE xcbm5x0",
      savestate: true,
      supportsNoGame: true,
    },
    vice_xpet: {
      cheats: true,
      corename: "VICE xpet",
      savestate: true,
      supportsNoGame: true,
    },
    vice_xplus4: {
      cheats: true,
      corename: "VICE xplus4",
      savestate: true,
      supportsNoGame: true,
    },
    vice_xscpu64: {
      cheats: true,
      corename: "VICE xscpu64",
      savestate: true,
      supportsNoGame: true,
    },
    vice_xvic: {
      cheats: true,
      corename: "VICE xvic",
      savestate: true,
      supportsNoGame: true,
    },
    vircon32: { corename: "Vircon32", supportsNoGame: true },
    virtualjaguar: { corename: "Virtual Jaguar" },
    virtualxt: { corename: "virtualxt" },
    vitaquake2: { corename: "vitaQuake 2" },
    "vitaquake2-rogue": { corename: "vitaQuake 2 [Rogue]" },
    "vitaquake2-xatrix": { corename: "vitaQuake 2 [Xatrix]" },
    "vitaquake2-zaero": { corename: "vitaQuake 2 [Zaero]" },
    vitaquake3: { corename: "vitaQuake 3" },
    vitavoyager: { corename: "vitaVoyager" },
    wasm4: { corename: "WASM-4", savestate: true },
    x1: { corename: "x1" },
    x64sdl: { corename: "VICE SDL" },
    xrick: { corename: "XRick", supportsNoGame: true },
    yabasanshiro: { cheats: true, corename: "YabaSanshiro", savestate: true },
    yabause: { cheats: true, corename: "Yabause", savestate: true },
  };
  const keyboardCodeMap = {
    left: "ArrowLeft",
    right: "ArrowRight",
    up: "ArrowUp",
    down: "ArrowDown",
    enter: "Enter",
    kp_enter: "NumpadEnter",
    tab: "Tab",
    insert: "Insert",
    del: "Delete",
    end: "End",
    home: "Home",
    shift: "ShiftLeft",
    rshift: "ShiftRight",
    ctrl: "ControlLeft",
    alt: "AltLeft",
    space: "Space",
    escape: "Escape",
    add: "NumpadAdd",
    // is this right?
    subtract: "NumpadSubtract",
    // is this right?
    kp_plus: "NumpadAdd",
    kp_minus: "NumpadSubtract",
    pageup: "PageUp",
    pagedown: "PageDown",
    period: "Period",
    capslock: "CapsLock",
    numlock: "NumLock",
    backspace: "Backspace",
    multiply: "NumpadMultiply",
    divide: "NumpadDivide",
    print_screen: "PrintScreen",
    scroll_lock: "ScrollLock",
    tilde: "",
    // what's this?
    backquote: "Backquote",
    pause: "Pause",
    quote: "Quote",
    comma: "Comma",
    minus: "Minus",
    slash: "Slash",
    semicolon: "Semicolon",
    equals: "Equal",
    leftbracket: "BracketLeft",
    // is this right?
    backslash: "",
    // what's this?
    rightbracket: "BracketRight",
    // is this right?
    kp_period: "NumpadDecimal",
    kp_equals: "NumpadEquals",
    // is this right?
    rctrl: "ControlRight",
    ralt: "AltRight",
  };
  var browserfs$2 = { exports: {} };
  (function (module2, exports2) {
    (function webpackUniversalModuleDefinition(root, factory) {
      module2.exports = factory();
    })(commonjsGlobal, function () {
      return (
        /******/
        (function (modules) {
          var installedModules = {};
          function __webpack_require__(moduleId) {
            if (installedModules[moduleId])
              return installedModules[moduleId].exports;
            var module3 = (installedModules[moduleId] = {
              /******/
              exports: {},
              /******/
              id: moduleId,
              /******/
              loaded: false,
              /******/
            });
            modules[moduleId].call(
              module3.exports,
              module3,
              module3.exports,
              __webpack_require__
            );
            module3.loaded = true;
            return module3.exports;
          }
          __webpack_require__.m = modules;
          __webpack_require__.c = installedModules;
          __webpack_require__.p = "";
          return __webpack_require__(0);
        })([
          /* 0 */
          /***/
          function (module3, exports3, __webpack_require__) {
            (function (Buffer2, global2, module4, process2) {
              Object.defineProperty(exports3, "__esModule", { value: true });
              var buffer = __webpack_require__(2);
              var path2 = __webpack_require__(9);
              var ErrorCode;
              (function (ErrorCode2) {
                ErrorCode2[(ErrorCode2["EPERM"] = 1)] = "EPERM";
                ErrorCode2[(ErrorCode2["ENOENT"] = 2)] = "ENOENT";
                ErrorCode2[(ErrorCode2["EIO"] = 5)] = "EIO";
                ErrorCode2[(ErrorCode2["EBADF"] = 9)] = "EBADF";
                ErrorCode2[(ErrorCode2["EACCES"] = 13)] = "EACCES";
                ErrorCode2[(ErrorCode2["EBUSY"] = 16)] = "EBUSY";
                ErrorCode2[(ErrorCode2["EEXIST"] = 17)] = "EEXIST";
                ErrorCode2[(ErrorCode2["ENOTDIR"] = 20)] = "ENOTDIR";
                ErrorCode2[(ErrorCode2["EISDIR"] = 21)] = "EISDIR";
                ErrorCode2[(ErrorCode2["EINVAL"] = 22)] = "EINVAL";
                ErrorCode2[(ErrorCode2["EFBIG"] = 27)] = "EFBIG";
                ErrorCode2[(ErrorCode2["ENOSPC"] = 28)] = "ENOSPC";
                ErrorCode2[(ErrorCode2["EROFS"] = 30)] = "EROFS";
                ErrorCode2[(ErrorCode2["ENOTEMPTY"] = 39)] = "ENOTEMPTY";
                ErrorCode2[(ErrorCode2["ENOTSUP"] = 95)] = "ENOTSUP";
              })(ErrorCode || (ErrorCode = {}));
              var ErrorStrings = {};
              ErrorStrings[ErrorCode.EPERM] = "Operation not permitted.";
              ErrorStrings[ErrorCode.ENOENT] = "No such file or directory.";
              ErrorStrings[ErrorCode.EIO] = "Input/output error.";
              ErrorStrings[ErrorCode.EBADF] = "Bad file descriptor.";
              ErrorStrings[ErrorCode.EACCES] = "Permission denied.";
              ErrorStrings[ErrorCode.EBUSY] = "Resource busy or locked.";
              ErrorStrings[ErrorCode.EEXIST] = "File exists.";
              ErrorStrings[ErrorCode.ENOTDIR] = "File is not a directory.";
              ErrorStrings[ErrorCode.EISDIR] = "File is a directory.";
              ErrorStrings[ErrorCode.EINVAL] = "Invalid argument.";
              ErrorStrings[ErrorCode.EFBIG] = "File is too big.";
              ErrorStrings[ErrorCode.ENOSPC] = "No space left on disk.";
              ErrorStrings[ErrorCode.EROFS] =
                "Cannot modify a read-only file system.";
              ErrorStrings[ErrorCode.ENOTEMPTY] = "Directory is not empty.";
              ErrorStrings[ErrorCode.ENOTSUP] = "Operation is not supported.";
              var ApiError = (function (Error2) {
                function ApiError2(type, message, path$$1) {
                  if (message === void 0) message = ErrorStrings[type];
                  Error2.call(this, message);
                  this.syscall = "";
                  this.errno = type;
                  this.code = ErrorCode[type];
                  this.path = path$$1;
                  this.stack = new Error2().stack;
                  this.message =
                    "Error: " +
                    this.code +
                    ": " +
                    message +
                    (this.path ? ", '" + this.path + "'" : "");
                }
                if (Error2) ApiError2.__proto__ = Error2;
                ApiError2.prototype = Object.create(Error2 && Error2.prototype);
                ApiError2.prototype.constructor = ApiError2;
                ApiError2.fromJSON = function fromJSON(json) {
                  var err = new ApiError2(0);
                  err.errno = json.errno;
                  err.code = json.code;
                  err.path = json.path;
                  err.stack = json.stack;
                  err.message = json.message;
                  return err;
                };
                ApiError2.fromBuffer = function fromBuffer(buffer$$1, i2) {
                  if (i2 === void 0) i2 = 0;
                  return ApiError2.fromJSON(
                    JSON.parse(
                      buffer$$1.toString(
                        "utf8",
                        i2 + 4,
                        i2 + 4 + buffer$$1.readUInt32LE(i2)
                      )
                    )
                  );
                };
                ApiError2.FileError = function FileError(code, p) {
                  return new ApiError2(code, ErrorStrings[code], p);
                };
                ApiError2.ENOENT = function ENOENT(path$$1) {
                  return this.FileError(ErrorCode.ENOENT, path$$1);
                };
                ApiError2.EEXIST = function EEXIST(path$$1) {
                  return this.FileError(ErrorCode.EEXIST, path$$1);
                };
                ApiError2.EISDIR = function EISDIR(path$$1) {
                  return this.FileError(ErrorCode.EISDIR, path$$1);
                };
                ApiError2.ENOTDIR = function ENOTDIR(path$$1) {
                  return this.FileError(ErrorCode.ENOTDIR, path$$1);
                };
                ApiError2.EPERM = function EPERM(path$$1) {
                  return this.FileError(ErrorCode.EPERM, path$$1);
                };
                ApiError2.ENOTEMPTY = function ENOTEMPTY(path$$1) {
                  return this.FileError(ErrorCode.ENOTEMPTY, path$$1);
                };
                ApiError2.prototype.toString = function toString() {
                  return this.message;
                };
                ApiError2.prototype.toJSON = function toJSON() {
                  return {
                    errno: this.errno,
                    code: this.code,
                    path: this.path,
                    stack: this.stack,
                    message: this.message,
                  };
                };
                ApiError2.prototype.writeToBuffer = function writeToBuffer(
                  buffer$$1,
                  i2
                ) {
                  if (buffer$$1 === void 0)
                    buffer$$1 = Buffer2.alloc(this.bufferSize());
                  if (i2 === void 0) i2 = 0;
                  var bytesWritten = buffer$$1.write(
                    JSON.stringify(this.toJSON()),
                    i2 + 4
                  );
                  buffer$$1.writeUInt32LE(bytesWritten, i2);
                  return buffer$$1;
                };
                ApiError2.prototype.bufferSize = function bufferSize() {
                  return 4 + Buffer2.byteLength(JSON.stringify(this.toJSON()));
                };
                return ApiError2;
              })(Error);
              var api_error = Object.freeze({
                get ErrorCode() {
                  return ErrorCode;
                },
                ErrorStrings,
                ApiError,
              });
              var ActionType;
              (function (ActionType2) {
                ActionType2[(ActionType2["NOP"] = 0)] = "NOP";
                ActionType2[(ActionType2["THROW_EXCEPTION"] = 1)] =
                  "THROW_EXCEPTION";
                ActionType2[(ActionType2["TRUNCATE_FILE"] = 2)] =
                  "TRUNCATE_FILE";
                ActionType2[(ActionType2["CREATE_FILE"] = 3)] = "CREATE_FILE";
              })(ActionType || (ActionType = {}));
              var FileFlag = function FileFlag2(flagStr) {
                this.flagStr = flagStr;
                if (FileFlag2.validFlagStrs.indexOf(flagStr) < 0) {
                  throw new ApiError(
                    ErrorCode.EINVAL,
                    "Invalid flag: " + flagStr
                  );
                }
              };
              FileFlag.getFileFlag = function getFileFlag(flagStr) {
                if (FileFlag.flagCache.hasOwnProperty(flagStr)) {
                  return FileFlag.flagCache[flagStr];
                }
                return (FileFlag.flagCache[flagStr] = new FileFlag(flagStr));
              };
              FileFlag.prototype.getFlagString = function getFlagString() {
                return this.flagStr;
              };
              FileFlag.prototype.isReadable = function isReadable() {
                return (
                  this.flagStr.indexOf("r") !== -1 ||
                  this.flagStr.indexOf("+") !== -1
                );
              };
              FileFlag.prototype.isWriteable = function isWriteable() {
                return (
                  this.flagStr.indexOf("w") !== -1 ||
                  this.flagStr.indexOf("a") !== -1 ||
                  this.flagStr.indexOf("+") !== -1
                );
              };
              FileFlag.prototype.isTruncating = function isTruncating() {
                return this.flagStr.indexOf("w") !== -1;
              };
              FileFlag.prototype.isAppendable = function isAppendable() {
                return this.flagStr.indexOf("a") !== -1;
              };
              FileFlag.prototype.isSynchronous = function isSynchronous() {
                return this.flagStr.indexOf("s") !== -1;
              };
              FileFlag.prototype.isExclusive = function isExclusive() {
                return this.flagStr.indexOf("x") !== -1;
              };
              FileFlag.prototype.pathExistsAction =
                function pathExistsAction() {
                  if (this.isExclusive()) {
                    return ActionType.THROW_EXCEPTION;
                  } else if (this.isTruncating()) {
                    return ActionType.TRUNCATE_FILE;
                  } else {
                    return ActionType.NOP;
                  }
                };
              FileFlag.prototype.pathNotExistsAction =
                function pathNotExistsAction() {
                  if (
                    (this.isWriteable() || this.isAppendable()) &&
                    this.flagStr !== "r+"
                  ) {
                    return ActionType.CREATE_FILE;
                  } else {
                    return ActionType.THROW_EXCEPTION;
                  }
                };
              FileFlag.flagCache = {};
              FileFlag.validFlagStrs = [
                "r",
                "r+",
                "rs",
                "rs+",
                "w",
                "wx",
                "w+",
                "wx+",
                "a",
                "ax",
                "a+",
                "ax+",
              ];
              var FileType;
              (function (FileType2) {
                FileType2[(FileType2["FILE"] = 32768)] = "FILE";
                FileType2[(FileType2["DIRECTORY"] = 16384)] = "DIRECTORY";
                FileType2[(FileType2["SYMLINK"] = 40960)] = "SYMLINK";
              })(FileType || (FileType = {}));
              var Stats = function Stats2(
                itemType,
                size,
                mode,
                atime,
                mtime,
                ctime
              ) {
                if (atime === void 0) atime = /* @__PURE__ */ new Date();
                if (mtime === void 0) mtime = /* @__PURE__ */ new Date();
                if (ctime === void 0) ctime = /* @__PURE__ */ new Date();
                this.size = size;
                this.atime = atime;
                this.mtime = mtime;
                this.ctime = ctime;
                this.dev = 0;
                this.ino = 0;
                this.rdev = 0;
                this.nlink = 1;
                this.blksize = 4096;
                this.uid = 0;
                this.gid = 0;
                this.birthtime = /* @__PURE__ */ new Date(0);
                this.fileData = null;
                if (!mode) {
                  switch (itemType) {
                    case FileType.FILE:
                      this.mode = 420;
                      break;
                    case FileType.DIRECTORY:
                    default:
                      this.mode = 511;
                  }
                } else {
                  this.mode = mode;
                }
                this.blocks = Math.ceil(size / 512);
                if (this.mode < 4096) {
                  this.mode |= itemType;
                }
              };
              Stats.fromBuffer = function fromBuffer(buffer$$1) {
                var size = buffer$$1.readUInt32LE(0),
                  mode = buffer$$1.readUInt32LE(4),
                  atime = buffer$$1.readDoubleLE(8),
                  mtime = buffer$$1.readDoubleLE(16),
                  ctime = buffer$$1.readDoubleLE(24);
                return new Stats(
                  mode & 61440,
                  size,
                  mode & 4095,
                  new Date(atime),
                  new Date(mtime),
                  new Date(ctime)
                );
              };
              Stats.prototype.toBuffer = function toBuffer() {
                var buffer$$1 = Buffer2.alloc(32);
                buffer$$1.writeUInt32LE(this.size, 0);
                buffer$$1.writeUInt32LE(this.mode, 4);
                buffer$$1.writeDoubleLE(this.atime.getTime(), 8);
                buffer$$1.writeDoubleLE(this.mtime.getTime(), 16);
                buffer$$1.writeDoubleLE(this.ctime.getTime(), 24);
                return buffer$$1;
              };
              Stats.prototype.clone = function clone() {
                return new Stats(
                  this.mode & 61440,
                  this.size,
                  this.mode & 4095,
                  this.atime,
                  this.mtime,
                  this.ctime
                );
              };
              Stats.prototype.isFile = function isFile() {
                return (this.mode & 61440) === FileType.FILE;
              };
              Stats.prototype.isDirectory = function isDirectory() {
                return (this.mode & 61440) === FileType.DIRECTORY;
              };
              Stats.prototype.isSymbolicLink = function isSymbolicLink() {
                return (this.mode & 61440) === FileType.SYMLINK;
              };
              Stats.prototype.chmod = function chmod(mode) {
                this.mode = (this.mode & 61440) | mode;
              };
              Stats.prototype.isSocket = function isSocket() {
                return false;
              };
              Stats.prototype.isBlockDevice = function isBlockDevice() {
                return false;
              };
              Stats.prototype.isCharacterDevice = function isCharacterDevice() {
                return false;
              };
              Stats.prototype.isFIFO = function isFIFO() {
                return false;
              };
              var wrapCb = function (cb, numArgs) {
                return cb;
              };
              function assertRoot(fs2) {
                if (fs2) {
                  return fs2;
                }
                throw new ApiError(
                  ErrorCode.EIO,
                  "Initialize BrowserFS with a file system using BrowserFS.initialize(filesystem)"
                );
              }
              function normalizeMode(mode, def) {
                switch (typeof mode) {
                  case "number":
                    return mode;
                  case "string":
                    var trueMode = parseInt(mode, 8);
                    if (!isNaN(trueMode)) {
                      return trueMode;
                    }
                    return def;
                  default:
                    return def;
                }
              }
              function normalizeTime(time) {
                if (time instanceof Date) {
                  return time;
                } else if (typeof time === "number") {
                  return new Date(time * 1e3);
                } else {
                  throw new ApiError(ErrorCode.EINVAL, "Invalid time.");
                }
              }
              function normalizePath(p) {
                if (p.indexOf("\0") >= 0) {
                  throw new ApiError(
                    ErrorCode.EINVAL,
                    "Path must be a string without null bytes."
                  );
                } else if (p === "") {
                  throw new ApiError(
                    ErrorCode.EINVAL,
                    "Path must not be empty."
                  );
                }
                return path2.resolve(p);
              }
              function normalizeOptions(options, defEnc, defFlag, defMode) {
                switch (typeof options) {
                  case "object":
                    return {
                      encoding:
                        typeof options["encoding"] !== "undefined"
                          ? options["encoding"]
                          : defEnc,
                      flag:
                        typeof options["flag"] !== "undefined"
                          ? options["flag"]
                          : defFlag,
                      mode: normalizeMode(options["mode"], defMode),
                    };
                  case "string":
                    return {
                      encoding: options,
                      flag: defFlag,
                      mode: defMode,
                    };
                  default:
                    return {
                      encoding: defEnc,
                      flag: defFlag,
                      mode: defMode,
                    };
                }
              }
              function nopCb() {}
              var FS = function FS2() {
                this.F_OK = 0;
                this.R_OK = 4;
                this.W_OK = 2;
                this.X_OK = 1;
                this.root = null;
                this.fdMap = {};
                this.nextFd = 100;
              };
              FS.prototype.initialize = function initialize2(rootFS) {
                if (!rootFS.constructor.isAvailable()) {
                  throw new ApiError(
                    ErrorCode.EINVAL,
                    "Tried to instantiate BrowserFS with an unavailable file system."
                  );
                }
                return (this.root = rootFS);
              };
              FS.prototype._toUnixTimestamp = function _toUnixTimestamp(time) {
                if (typeof time === "number") {
                  return time;
                } else if (time instanceof Date) {
                  return time.getTime() / 1e3;
                }
                throw new Error("Cannot parse time: " + time);
              };
              FS.prototype.getRootFS = function getRootFS() {
                if (this.root) {
                  return this.root;
                } else {
                  return null;
                }
              };
              FS.prototype.rename = function rename(oldPath, newPath, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 1);
                try {
                  assertRoot(this.root).rename(
                    normalizePath(oldPath),
                    normalizePath(newPath),
                    newCb
                  );
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.renameSync = function renameSync(oldPath, newPath) {
                assertRoot(this.root).renameSync(
                  normalizePath(oldPath),
                  normalizePath(newPath)
                );
              };
              FS.prototype.exists = function exists(path$$1, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 1);
                try {
                  return assertRoot(this.root).exists(
                    normalizePath(path$$1),
                    newCb
                  );
                } catch (e) {
                  return newCb(false);
                }
              };
              FS.prototype.existsSync = function existsSync(path$$1) {
                try {
                  return assertRoot(this.root).existsSync(
                    normalizePath(path$$1)
                  );
                } catch (e) {
                  return false;
                }
              };
              FS.prototype.stat = function stat(path$$1, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 2);
                try {
                  return assertRoot(this.root).stat(
                    normalizePath(path$$1),
                    false,
                    newCb
                  );
                } catch (e) {
                  return newCb(e);
                }
              };
              FS.prototype.statSync = function statSync(path$$1) {
                return assertRoot(this.root).statSync(
                  normalizePath(path$$1),
                  false
                );
              };
              FS.prototype.lstat = function lstat(path$$1, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 2);
                try {
                  return assertRoot(this.root).stat(
                    normalizePath(path$$1),
                    true,
                    newCb
                  );
                } catch (e) {
                  return newCb(e);
                }
              };
              FS.prototype.lstatSync = function lstatSync(path$$1) {
                return assertRoot(this.root).statSync(
                  normalizePath(path$$1),
                  true
                );
              };
              FS.prototype.truncate = function truncate(path$$1, arg2, cb) {
                if (arg2 === void 0) arg2 = 0;
                if (cb === void 0) cb = nopCb;
                var len = 0;
                if (typeof arg2 === "function") {
                  cb = arg2;
                } else if (typeof arg2 === "number") {
                  len = arg2;
                }
                var newCb = wrapCb(cb, 1);
                try {
                  if (len < 0) {
                    throw new ApiError(ErrorCode.EINVAL);
                  }
                  return assertRoot(this.root).truncate(
                    normalizePath(path$$1),
                    len,
                    newCb
                  );
                } catch (e) {
                  return newCb(e);
                }
              };
              FS.prototype.truncateSync = function truncateSync(path$$1, len) {
                if (len === void 0) len = 0;
                if (len < 0) {
                  throw new ApiError(ErrorCode.EINVAL);
                }
                return assertRoot(this.root).truncateSync(
                  normalizePath(path$$1),
                  len
                );
              };
              FS.prototype.unlink = function unlink(path$$1, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 1);
                try {
                  return assertRoot(this.root).unlink(
                    normalizePath(path$$1),
                    newCb
                  );
                } catch (e) {
                  return newCb(e);
                }
              };
              FS.prototype.unlinkSync = function unlinkSync(path$$1) {
                return assertRoot(this.root).unlinkSync(normalizePath(path$$1));
              };
              FS.prototype.open = function open(path$$1, flag, arg2, cb) {
                var this$1$1 = this;
                if (cb === void 0) cb = nopCb;
                var mode = normalizeMode(arg2, 420);
                cb = typeof arg2 === "function" ? arg2 : cb;
                var newCb = wrapCb(cb, 2);
                try {
                  assertRoot(this.root).open(
                    normalizePath(path$$1),
                    FileFlag.getFileFlag(flag),
                    mode,
                    function (e, file) {
                      if (file) {
                        newCb(e, this$1$1.getFdForFile(file));
                      } else {
                        newCb(e);
                      }
                    }
                  );
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.openSync = function openSync(path$$1, flag, mode) {
                if (mode === void 0) mode = 420;
                return this.getFdForFile(
                  assertRoot(this.root).openSync(
                    normalizePath(path$$1),
                    FileFlag.getFileFlag(flag),
                    normalizeMode(mode, 420)
                  )
                );
              };
              FS.prototype.readFile = function readFile(filename, arg2, cb) {
                if (arg2 === void 0) arg2 = {};
                if (cb === void 0) cb = nopCb;
                var options = normalizeOptions(arg2, null, "r", null);
                cb = typeof arg2 === "function" ? arg2 : cb;
                var newCb = wrapCb(cb, 2);
                try {
                  var flag = FileFlag.getFileFlag(options["flag"]);
                  if (!flag.isReadable()) {
                    return newCb(
                      new ApiError(
                        ErrorCode.EINVAL,
                        "Flag passed to readFile must allow for reading."
                      )
                    );
                  }
                  return assertRoot(this.root).readFile(
                    normalizePath(filename),
                    options.encoding,
                    flag,
                    newCb
                  );
                } catch (e) {
                  return newCb(e);
                }
              };
              FS.prototype.readFileSync = function readFileSync(
                filename,
                arg2
              ) {
                if (arg2 === void 0) arg2 = {};
                var options = normalizeOptions(arg2, null, "r", null);
                var flag = FileFlag.getFileFlag(options.flag);
                if (!flag.isReadable()) {
                  throw new ApiError(
                    ErrorCode.EINVAL,
                    "Flag passed to readFile must allow for reading."
                  );
                }
                return assertRoot(this.root).readFileSync(
                  normalizePath(filename),
                  options.encoding,
                  flag
                );
              };
              FS.prototype.writeFile = function writeFile(
                filename,
                data,
                arg3,
                cb
              ) {
                if (arg3 === void 0) arg3 = {};
                if (cb === void 0) cb = nopCb;
                var options = normalizeOptions(arg3, "utf8", "w", 420);
                cb = typeof arg3 === "function" ? arg3 : cb;
                var newCb = wrapCb(cb, 1);
                try {
                  var flag = FileFlag.getFileFlag(options.flag);
                  if (!flag.isWriteable()) {
                    return newCb(
                      new ApiError(
                        ErrorCode.EINVAL,
                        "Flag passed to writeFile must allow for writing."
                      )
                    );
                  }
                  return assertRoot(this.root).writeFile(
                    normalizePath(filename),
                    data,
                    options.encoding,
                    flag,
                    options.mode,
                    newCb
                  );
                } catch (e) {
                  return newCb(e);
                }
              };
              FS.prototype.writeFileSync = function writeFileSync(
                filename,
                data,
                arg3
              ) {
                var options = normalizeOptions(arg3, "utf8", "w", 420);
                var flag = FileFlag.getFileFlag(options.flag);
                if (!flag.isWriteable()) {
                  throw new ApiError(
                    ErrorCode.EINVAL,
                    "Flag passed to writeFile must allow for writing."
                  );
                }
                return assertRoot(this.root).writeFileSync(
                  normalizePath(filename),
                  data,
                  options.encoding,
                  flag,
                  options.mode
                );
              };
              FS.prototype.appendFile = function appendFile(
                filename,
                data,
                arg3,
                cb
              ) {
                if (cb === void 0) cb = nopCb;
                var options = normalizeOptions(arg3, "utf8", "a", 420);
                cb = typeof arg3 === "function" ? arg3 : cb;
                var newCb = wrapCb(cb, 1);
                try {
                  var flag = FileFlag.getFileFlag(options.flag);
                  if (!flag.isAppendable()) {
                    return newCb(
                      new ApiError(
                        ErrorCode.EINVAL,
                        "Flag passed to appendFile must allow for appending."
                      )
                    );
                  }
                  assertRoot(this.root).appendFile(
                    normalizePath(filename),
                    data,
                    options.encoding,
                    flag,
                    options.mode,
                    newCb
                  );
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.appendFileSync = function appendFileSync(
                filename,
                data,
                arg3
              ) {
                var options = normalizeOptions(arg3, "utf8", "a", 420);
                var flag = FileFlag.getFileFlag(options.flag);
                if (!flag.isAppendable()) {
                  throw new ApiError(
                    ErrorCode.EINVAL,
                    "Flag passed to appendFile must allow for appending."
                  );
                }
                return assertRoot(this.root).appendFileSync(
                  normalizePath(filename),
                  data,
                  options.encoding,
                  flag,
                  options.mode
                );
              };
              FS.prototype.fstat = function fstat(fd, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 2);
                try {
                  var file = this.fd2file(fd);
                  file.stat(newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.fstatSync = function fstatSync(fd) {
                return this.fd2file(fd).statSync();
              };
              FS.prototype.close = function close(fd, cb) {
                var this$1$1 = this;
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 1);
                try {
                  this.fd2file(fd).close(function (e) {
                    if (!e) {
                      this$1$1.closeFd(fd);
                    }
                    newCb(e);
                  });
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.closeSync = function closeSync(fd) {
                this.fd2file(fd).closeSync();
                this.closeFd(fd);
              };
              FS.prototype.ftruncate = function ftruncate(fd, arg2, cb) {
                if (cb === void 0) cb = nopCb;
                var length = typeof arg2 === "number" ? arg2 : 0;
                cb = typeof arg2 === "function" ? arg2 : cb;
                var newCb = wrapCb(cb, 1);
                try {
                  var file = this.fd2file(fd);
                  if (length < 0) {
                    throw new ApiError(ErrorCode.EINVAL);
                  }
                  file.truncate(length, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.ftruncateSync = function ftruncateSync(fd, len) {
                if (len === void 0) len = 0;
                var file = this.fd2file(fd);
                if (len < 0) {
                  throw new ApiError(ErrorCode.EINVAL);
                }
                file.truncateSync(len);
              };
              FS.prototype.fsync = function fsync(fd, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 1);
                try {
                  this.fd2file(fd).sync(newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.fsyncSync = function fsyncSync(fd) {
                this.fd2file(fd).syncSync();
              };
              FS.prototype.fdatasync = function fdatasync(fd, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 1);
                try {
                  this.fd2file(fd).datasync(newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.fdatasyncSync = function fdatasyncSync(fd) {
                this.fd2file(fd).datasyncSync();
              };
              FS.prototype.write = function write(
                fd,
                arg2,
                arg3,
                arg4,
                arg5,
                cb
              ) {
                if (cb === void 0) cb = nopCb;
                var buffer$$1,
                  offset,
                  length,
                  position = null;
                if (typeof arg2 === "string") {
                  var encoding = "utf8";
                  switch (typeof arg3) {
                    case "function":
                      cb = arg3;
                      break;
                    case "number":
                      position = arg3;
                      encoding = typeof arg4 === "string" ? arg4 : "utf8";
                      cb = typeof arg5 === "function" ? arg5 : cb;
                      break;
                    default:
                      cb =
                        typeof arg4 === "function"
                          ? arg4
                          : typeof arg5 === "function"
                          ? arg5
                          : cb;
                      return cb(
                        new ApiError(ErrorCode.EINVAL, "Invalid arguments.")
                      );
                  }
                  buffer$$1 = Buffer2.from(arg2, encoding);
                  offset = 0;
                  length = buffer$$1.length;
                } else {
                  buffer$$1 = arg2;
                  offset = arg3;
                  length = arg4;
                  position = typeof arg5 === "number" ? arg5 : null;
                  cb = typeof arg5 === "function" ? arg5 : cb;
                }
                var newCb = wrapCb(cb, 3);
                try {
                  var file = this.fd2file(fd);
                  if (position === void 0 || position === null) {
                    position = file.getPos();
                  }
                  file.write(buffer$$1, offset, length, position, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.writeSync = function writeSync(
                fd,
                arg2,
                arg3,
                arg4,
                arg5
              ) {
                var buffer$$1,
                  offset = 0,
                  length,
                  position;
                if (typeof arg2 === "string") {
                  position = typeof arg3 === "number" ? arg3 : null;
                  var encoding = typeof arg4 === "string" ? arg4 : "utf8";
                  offset = 0;
                  buffer$$1 = Buffer2.from(arg2, encoding);
                  length = buffer$$1.length;
                } else {
                  buffer$$1 = arg2;
                  offset = arg3;
                  length = arg4;
                  position = typeof arg5 === "number" ? arg5 : null;
                }
                var file = this.fd2file(fd);
                if (position === void 0 || position === null) {
                  position = file.getPos();
                }
                return file.writeSync(buffer$$1, offset, length, position);
              };
              FS.prototype.read = function read(
                fd,
                arg2,
                arg3,
                arg4,
                arg5,
                cb
              ) {
                if (cb === void 0) cb = nopCb;
                var position, offset, length, buffer$$1, newCb;
                if (typeof arg2 === "number") {
                  length = arg2;
                  position = arg3;
                  var encoding = arg4;
                  cb = typeof arg5 === "function" ? arg5 : cb;
                  offset = 0;
                  buffer$$1 = Buffer2.alloc(length);
                  newCb = wrapCb(function (err, bytesRead, buf) {
                    if (err) {
                      return cb(err);
                    }
                    cb(err, buf.toString(encoding), bytesRead);
                  }, 3);
                } else {
                  buffer$$1 = arg2;
                  offset = arg3;
                  length = arg4;
                  position = arg5;
                  newCb = wrapCb(cb, 3);
                }
                try {
                  var file = this.fd2file(fd);
                  if (position === void 0 || position === null) {
                    position = file.getPos();
                  }
                  file.read(buffer$$1, offset, length, position, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.readSync = function readSync(
                fd,
                arg2,
                arg3,
                arg4,
                arg5
              ) {
                var shenanigans = false;
                var buffer$$1,
                  offset,
                  length,
                  position,
                  encoding = "utf8";
                if (typeof arg2 === "number") {
                  length = arg2;
                  position = arg3;
                  encoding = arg4;
                  offset = 0;
                  buffer$$1 = Buffer2.alloc(length);
                  shenanigans = true;
                } else {
                  buffer$$1 = arg2;
                  offset = arg3;
                  length = arg4;
                  position = arg5;
                }
                var file = this.fd2file(fd);
                if (position === void 0 || position === null) {
                  position = file.getPos();
                }
                var rv = file.readSync(buffer$$1, offset, length, position);
                if (!shenanigans) {
                  return rv;
                } else {
                  return [buffer$$1.toString(encoding), rv];
                }
              };
              FS.prototype.fchown = function fchown(fd, uid, gid, callback) {
                if (callback === void 0) callback = nopCb;
                var newCb = wrapCb(callback, 1);
                try {
                  this.fd2file(fd).chown(uid, gid, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.fchownSync = function fchownSync(fd, uid, gid) {
                this.fd2file(fd).chownSync(uid, gid);
              };
              FS.prototype.fchmod = function fchmod(fd, mode, cb) {
                var newCb = wrapCb(cb, 1);
                try {
                  var numMode =
                    typeof mode === "string" ? parseInt(mode, 8) : mode;
                  this.fd2file(fd).chmod(numMode, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.fchmodSync = function fchmodSync(fd, mode) {
                var numMode =
                  typeof mode === "string" ? parseInt(mode, 8) : mode;
                this.fd2file(fd).chmodSync(numMode);
              };
              FS.prototype.futimes = function futimes(fd, atime, mtime, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 1);
                try {
                  var file = this.fd2file(fd);
                  if (typeof atime === "number") {
                    atime = new Date(atime * 1e3);
                  }
                  if (typeof mtime === "number") {
                    mtime = new Date(mtime * 1e3);
                  }
                  file.utimes(atime, mtime, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.futimesSync = function futimesSync(
                fd,
                atime,
                mtime
              ) {
                this.fd2file(fd).utimesSync(
                  normalizeTime(atime),
                  normalizeTime(mtime)
                );
              };
              FS.prototype.rmdir = function rmdir(path$$1, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 1);
                try {
                  path$$1 = normalizePath(path$$1);
                  assertRoot(this.root).rmdir(path$$1, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.rmdirSync = function rmdirSync(path$$1) {
                path$$1 = normalizePath(path$$1);
                return assertRoot(this.root).rmdirSync(path$$1);
              };
              FS.prototype.mkdir = function mkdir(path$$1, mode, cb) {
                if (cb === void 0) cb = nopCb;
                if (typeof mode === "function") {
                  cb = mode;
                  mode = 511;
                }
                var newCb = wrapCb(cb, 1);
                try {
                  path$$1 = normalizePath(path$$1);
                  assertRoot(this.root).mkdir(path$$1, mode, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.mkdirSync = function mkdirSync(path$$1, mode) {
                assertRoot(this.root).mkdirSync(
                  normalizePath(path$$1),
                  normalizeMode(mode, 511)
                );
              };
              FS.prototype.readdir = function readdir(path$$1, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 2);
                try {
                  path$$1 = normalizePath(path$$1);
                  assertRoot(this.root).readdir(path$$1, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.readdirSync = function readdirSync(path$$1) {
                path$$1 = normalizePath(path$$1);
                return assertRoot(this.root).readdirSync(path$$1);
              };
              FS.prototype.link = function link(srcpath, dstpath, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 1);
                try {
                  srcpath = normalizePath(srcpath);
                  dstpath = normalizePath(dstpath);
                  assertRoot(this.root).link(srcpath, dstpath, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.linkSync = function linkSync(srcpath, dstpath) {
                srcpath = normalizePath(srcpath);
                dstpath = normalizePath(dstpath);
                return assertRoot(this.root).linkSync(srcpath, dstpath);
              };
              FS.prototype.symlink = function symlink(
                srcpath,
                dstpath,
                arg3,
                cb
              ) {
                if (cb === void 0) cb = nopCb;
                var type = typeof arg3 === "string" ? arg3 : "file";
                cb = typeof arg3 === "function" ? arg3 : cb;
                var newCb = wrapCb(cb, 1);
                try {
                  if (type !== "file" && type !== "dir") {
                    return newCb(
                      new ApiError(ErrorCode.EINVAL, "Invalid type: " + type)
                    );
                  }
                  srcpath = normalizePath(srcpath);
                  dstpath = normalizePath(dstpath);
                  assertRoot(this.root).symlink(srcpath, dstpath, type, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.symlinkSync = function symlinkSync(
                srcpath,
                dstpath,
                type
              ) {
                if (!type) {
                  type = "file";
                } else if (type !== "file" && type !== "dir") {
                  throw new ApiError(ErrorCode.EINVAL, "Invalid type: " + type);
                }
                srcpath = normalizePath(srcpath);
                dstpath = normalizePath(dstpath);
                return assertRoot(this.root).symlinkSync(
                  srcpath,
                  dstpath,
                  type
                );
              };
              FS.prototype.readlink = function readlink(path$$1, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 2);
                try {
                  path$$1 = normalizePath(path$$1);
                  assertRoot(this.root).readlink(path$$1, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.readlinkSync = function readlinkSync(path$$1) {
                path$$1 = normalizePath(path$$1);
                return assertRoot(this.root).readlinkSync(path$$1);
              };
              FS.prototype.chown = function chown(path$$1, uid, gid, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 1);
                try {
                  path$$1 = normalizePath(path$$1);
                  assertRoot(this.root).chown(path$$1, false, uid, gid, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.chownSync = function chownSync(path$$1, uid, gid) {
                path$$1 = normalizePath(path$$1);
                assertRoot(this.root).chownSync(path$$1, false, uid, gid);
              };
              FS.prototype.lchown = function lchown(path$$1, uid, gid, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 1);
                try {
                  path$$1 = normalizePath(path$$1);
                  assertRoot(this.root).chown(path$$1, true, uid, gid, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.lchownSync = function lchownSync(path$$1, uid, gid) {
                path$$1 = normalizePath(path$$1);
                assertRoot(this.root).chownSync(path$$1, true, uid, gid);
              };
              FS.prototype.chmod = function chmod(path$$1, mode, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 1);
                try {
                  var numMode = normalizeMode(mode, -1);
                  if (numMode < 0) {
                    throw new ApiError(ErrorCode.EINVAL, "Invalid mode.");
                  }
                  assertRoot(this.root).chmod(
                    normalizePath(path$$1),
                    false,
                    numMode,
                    newCb
                  );
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.chmodSync = function chmodSync(path$$1, mode) {
                var numMode = normalizeMode(mode, -1);
                if (numMode < 0) {
                  throw new ApiError(ErrorCode.EINVAL, "Invalid mode.");
                }
                path$$1 = normalizePath(path$$1);
                assertRoot(this.root).chmodSync(path$$1, false, numMode);
              };
              FS.prototype.lchmod = function lchmod(path$$1, mode, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 1);
                try {
                  var numMode = normalizeMode(mode, -1);
                  if (numMode < 0) {
                    throw new ApiError(ErrorCode.EINVAL, "Invalid mode.");
                  }
                  assertRoot(this.root).chmod(
                    normalizePath(path$$1),
                    true,
                    numMode,
                    newCb
                  );
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.lchmodSync = function lchmodSync(path$$1, mode) {
                var numMode = normalizeMode(mode, -1);
                if (numMode < 1) {
                  throw new ApiError(ErrorCode.EINVAL, "Invalid mode.");
                }
                assertRoot(this.root).chmodSync(
                  normalizePath(path$$1),
                  true,
                  numMode
                );
              };
              FS.prototype.utimes = function utimes(path$$1, atime, mtime, cb) {
                if (cb === void 0) cb = nopCb;
                var newCb = wrapCb(cb, 1);
                try {
                  assertRoot(this.root).utimes(
                    normalizePath(path$$1),
                    normalizeTime(atime),
                    normalizeTime(mtime),
                    newCb
                  );
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.utimesSync = function utimesSync(
                path$$1,
                atime,
                mtime
              ) {
                assertRoot(this.root).utimesSync(
                  normalizePath(path$$1),
                  normalizeTime(atime),
                  normalizeTime(mtime)
                );
              };
              FS.prototype.realpath = function realpath(path$$1, arg2, cb) {
                if (cb === void 0) cb = nopCb;
                var cache = typeof arg2 === "object" ? arg2 : {};
                cb = typeof arg2 === "function" ? arg2 : nopCb;
                var newCb = wrapCb(cb, 2);
                try {
                  path$$1 = normalizePath(path$$1);
                  assertRoot(this.root).realpath(path$$1, cache, newCb);
                } catch (e) {
                  newCb(e);
                }
              };
              FS.prototype.realpathSync = function realpathSync(
                path$$1,
                cache
              ) {
                if (cache === void 0) cache = {};
                path$$1 = normalizePath(path$$1);
                return assertRoot(this.root).realpathSync(path$$1, cache);
              };
              FS.prototype.watchFile = function watchFile(
                filename,
                arg2,
                listener
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              FS.prototype.unwatchFile = function unwatchFile(
                filename,
                listener
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              FS.prototype.watch = function watch(filename, arg2, listener) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              FS.prototype.access = function access(path$$1, arg2, cb) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              FS.prototype.accessSync = function accessSync(path$$1, mode) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              FS.prototype.createReadStream = function createReadStream(
                path$$1,
                options
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              FS.prototype.createWriteStream = function createWriteStream(
                path$$1,
                options
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              FS.prototype.wrapCallbacks = function wrapCallbacks(cbWrapper) {
                wrapCb = cbWrapper;
              };
              FS.prototype.getFdForFile = function getFdForFile(file) {
                var fd = this.nextFd++;
                this.fdMap[fd] = file;
                return fd;
              };
              FS.prototype.fd2file = function fd2file(fd) {
                var rv = this.fdMap[fd];
                if (rv) {
                  return rv;
                } else {
                  throw new ApiError(
                    ErrorCode.EBADF,
                    "Invalid file descriptor."
                  );
                }
              };
              FS.prototype.closeFd = function closeFd(fd) {
                delete this.fdMap[fd];
              };
              FS.Stats = Stats;
              var fs = new FS();
              var _fsMock = {};
              var fsProto = FS.prototype;
              Object.keys(fsProto).forEach(function (key) {
                if (typeof fs[key] === "function") {
                  _fsMock[key] = function () {
                    return fs[key].apply(fs, arguments);
                  };
                } else {
                  _fsMock[key] = fs[key];
                }
              });
              _fsMock["changeFSModule"] = function (newFs) {
                fs = newFs;
              };
              _fsMock["getFSModule"] = function () {
                return fs;
              };
              _fsMock["FS"] = FS;
              function _min(d0, d1, d2, bx, ay) {
                return d0 < d1 || d2 < d1
                  ? d0 > d2
                    ? d2 + 1
                    : d0 + 1
                  : bx === ay
                  ? d1
                  : d1 + 1;
              }
              function levenshtein(a, b) {
                if (a === b) {
                  return 0;
                }
                if (a.length > b.length) {
                  var tmp = a;
                  a = b;
                  b = tmp;
                }
                var la = a.length;
                var lb = b.length;
                while (
                  la > 0 &&
                  a.charCodeAt(la - 1) === b.charCodeAt(lb - 1)
                ) {
                  la--;
                  lb--;
                }
                var offset = 0;
                while (
                  offset < la &&
                  a.charCodeAt(offset) === b.charCodeAt(offset)
                ) {
                  offset++;
                }
                la -= offset;
                lb -= offset;
                if (la === 0 || lb === 1) {
                  return lb;
                }
                var vector = new Array(la << 1);
                for (var y = 0; y < la; ) {
                  vector[la + y] = a.charCodeAt(offset + y);
                  vector[y] = ++y;
                }
                var x;
                var d0;
                var d1;
                var d2;
                var d3;
                for (x = 0; x + 3 < lb; ) {
                  var bx0 = b.charCodeAt(offset + (d0 = x));
                  var bx1 = b.charCodeAt(offset + (d1 = x + 1));
                  var bx2 = b.charCodeAt(offset + (d2 = x + 2));
                  var bx3 = b.charCodeAt(offset + (d3 = x + 3));
                  var dd$1 = (x += 4);
                  for (var y$1 = 0; y$1 < la; ) {
                    var ay = vector[la + y$1];
                    var dy = vector[y$1];
                    d0 = _min(dy, d0, d1, bx0, ay);
                    d1 = _min(d0, d1, d2, bx1, ay);
                    d2 = _min(d1, d2, d3, bx2, ay);
                    dd$1 = _min(d2, d3, dd$1, bx3, ay);
                    vector[y$1++] = dd$1;
                    d3 = d2;
                    d2 = d1;
                    d1 = d0;
                    d0 = dy;
                  }
                }
                var dd = 0;
                for (; x < lb; ) {
                  var bx0$1 = b.charCodeAt(offset + (d0 = x));
                  dd = ++x;
                  for (var y$2 = 0; y$2 < la; y$2++) {
                    var dy$1 = vector[y$2];
                    vector[y$2] = dd =
                      dy$1 < d0 || dd < d0
                        ? dy$1 > dd
                          ? dd + 1
                          : dy$1 + 1
                        : bx0$1 === vector[la + y$2]
                        ? d0
                        : d0 + 1;
                    d0 = dy$1;
                  }
                }
                return dd;
              }
              function deprecationMessage(print, fsName, opts) {
                if (print) {
                  console.warn(
                    "[" +
                      fsName +
                      "] Direct file system constructor usage is deprecated for this file system, and will be removed in the next major version. Please use the '" +
                      fsName +
                      ".Create(" +
                      JSON.stringify(opts) +
                      ", callback)' method instead. See https://github.com/jvilk/BrowserFS/issues/176 for more details."
                  );
                }
              }
              var isIE =
                typeof navigator !== "undefined" &&
                !!(
                  /(msie) ([\w.]+)/.exec(navigator.userAgent.toLowerCase()) ||
                  navigator.userAgent.indexOf("Trident") !== -1
                );
              var isWebWorker = typeof window === "undefined";
              function fail() {
                throw new Error(
                  "BFS has reached an impossible code path; please file a bug."
                );
              }
              function mkdirpSync(p, mode, fs2) {
                if (!fs2.existsSync(p)) {
                  mkdirpSync(path2.dirname(p), mode, fs2);
                  fs2.mkdirSync(p, mode);
                }
              }
              function buffer2ArrayBuffer(buff) {
                var u8 = buffer2Uint8array(buff),
                  u8offset = u8.byteOffset,
                  u8Len = u8.byteLength;
                if (u8offset === 0 && u8Len === u8.buffer.byteLength) {
                  return u8.buffer;
                } else {
                  return u8.buffer.slice(u8offset, u8offset + u8Len);
                }
              }
              function buffer2Uint8array(buff) {
                if (buff instanceof Uint8Array) {
                  return buff;
                } else {
                  return new Uint8Array(buff);
                }
              }
              function arrayish2Buffer(arr) {
                if (arr instanceof Buffer2) {
                  return arr;
                } else if (arr instanceof Uint8Array) {
                  return uint8Array2Buffer(arr);
                } else {
                  return Buffer2.from(arr);
                }
              }
              function uint8Array2Buffer(u8) {
                if (u8 instanceof Buffer2) {
                  return u8;
                } else if (
                  u8.byteOffset === 0 &&
                  u8.byteLength === u8.buffer.byteLength
                ) {
                  return arrayBuffer2Buffer(u8.buffer);
                } else {
                  return Buffer2.from(u8.buffer, u8.byteOffset, u8.byteLength);
                }
              }
              function arrayBuffer2Buffer(ab) {
                return Buffer2.from(ab);
              }
              function copyingSlice(buff, start, end) {
                if (start === void 0) start = 0;
                if (end === void 0) end = buff.length;
                if (start < 0 || end < 0 || end > buff.length || start > end) {
                  throw new TypeError(
                    "Invalid slice bounds on buffer of length " +
                      buff.length +
                      ": [" +
                      start +
                      ", " +
                      end +
                      "]"
                  );
                }
                if (buff.length === 0) {
                  return emptyBuffer();
                } else {
                  var u8 = buffer2Uint8array(buff),
                    s0 = buff[0],
                    newS0 = (s0 + 1) % 255;
                  buff[0] = newS0;
                  if (u8[0] === newS0) {
                    u8[0] = s0;
                    return uint8Array2Buffer(u8.slice(start, end));
                  } else {
                    buff[0] = s0;
                    return uint8Array2Buffer(u8.subarray(start, end));
                  }
                }
              }
              var emptyBuff = null;
              function emptyBuffer() {
                if (emptyBuff) {
                  return emptyBuff;
                }
                return (emptyBuff = Buffer2.alloc(0));
              }
              function bufferValidator(v, cb) {
                if (Buffer2.isBuffer(v)) {
                  cb();
                } else {
                  cb(
                    new ApiError(ErrorCode.EINVAL, "option must be a Buffer.")
                  );
                }
              }
              function checkOptions(fsType, opts, cb) {
                var optsInfo = fsType.Options;
                var fsName = fsType.Name;
                var pendingValidators = 0;
                var callbackCalled = false;
                var loopEnded = false;
                function validatorCallback(e) {
                  if (!callbackCalled) {
                    if (e) {
                      callbackCalled = true;
                      cb(e);
                    }
                    pendingValidators--;
                    if (pendingValidators === 0 && loopEnded) {
                      cb();
                    }
                  }
                }
                var loop = function (optName2) {
                  if (optsInfo.hasOwnProperty(optName2)) {
                    var opt = optsInfo[optName2];
                    var providedValue = opts[optName2];
                    if (providedValue === void 0 || providedValue === null) {
                      if (!opt.optional) {
                        var incorrectOptions = Object.keys(opts)
                          .filter(function (o) {
                            return !(o in optsInfo);
                          })
                          .map(function (a) {
                            return {
                              str: a,
                              distance: levenshtein(optName2, a),
                            };
                          })
                          .filter(function (o) {
                            return o.distance < 5;
                          })
                          .sort(function (a, b) {
                            return a.distance - b.distance;
                          });
                        if (callbackCalled) {
                          return {};
                        }
                        callbackCalled = true;
                        return {
                          v: cb(
                            new ApiError(
                              ErrorCode.EINVAL,
                              "[" +
                                fsName +
                                "] Required option '" +
                                optName2 +
                                "' not provided." +
                                (incorrectOptions.length > 0
                                  ? " You provided unrecognized option '" +
                                    incorrectOptions[0].str +
                                    "'; perhaps you meant to type '" +
                                    optName2 +
                                    "'."
                                  : "") +
                                "\nOption description: " +
                                opt.description
                            )
                          ),
                        };
                      }
                    } else {
                      var typeMatches = false;
                      if (Array.isArray(opt.type)) {
                        typeMatches =
                          opt.type.indexOf(typeof providedValue) !== -1;
                      } else {
                        typeMatches = typeof providedValue === opt.type;
                      }
                      if (!typeMatches) {
                        if (callbackCalled) {
                          return {};
                        }
                        callbackCalled = true;
                        return {
                          v: cb(
                            new ApiError(
                              ErrorCode.EINVAL,
                              "[" +
                                fsName +
                                "] Value provided for option " +
                                optName2 +
                                " is not the proper type. Expected " +
                                (Array.isArray(opt.type)
                                  ? "one of {" + opt.type.join(", ") + "}"
                                  : opt.type) +
                                ", but received " +
                                typeof providedValue +
                                "\nOption description: " +
                                opt.description
                            )
                          ),
                        };
                      } else if (opt.validator) {
                        pendingValidators++;
                        opt.validator(providedValue, validatorCallback);
                      }
                    }
                  }
                };
                for (var optName in optsInfo) {
                  var returned = loop(optName);
                  if (returned) return returned.v;
                }
                loopEnded = true;
                if (pendingValidators === 0 && !callbackCalled) {
                  cb();
                }
              }
              var BFSUtils = Object.freeze({
                deprecationMessage,
                isIE,
                isWebWorker,
                fail,
                mkdirpSync,
                buffer2ArrayBuffer,
                buffer2Uint8array,
                arrayish2Buffer,
                uint8Array2Buffer,
                arrayBuffer2Buffer,
                copyingSlice,
                emptyBuffer,
                bufferValidator,
                checkOptions,
              });
              var BFSEmscriptenStreamOps = function BFSEmscriptenStreamOps2(
                fs2
              ) {
                this.fs = fs2;
                this.nodefs = fs2.getNodeFS();
                this.FS = fs2.getFS();
                this.PATH = fs2.getPATH();
                this.ERRNO_CODES = fs2.getERRNO_CODES();
              };
              BFSEmscriptenStreamOps.prototype.open = function open(stream) {
                var path$$1 = this.fs.realPath(stream.node);
                var FS2 = this.FS;
                try {
                  if (FS2.isFile(stream.node.mode)) {
                    stream.nfd = this.nodefs.openSync(
                      path$$1,
                      this.fs.flagsToPermissionString(stream.flags)
                    );
                  }
                } catch (e) {
                  if (!e.code) {
                    throw e;
                  }
                  throw new FS2.ErrnoError(this.ERRNO_CODES[e.code]);
                }
              };
              BFSEmscriptenStreamOps.prototype.close = function close(stream) {
                var FS2 = this.FS;
                try {
                  if (FS2.isFile(stream.node.mode) && stream.nfd) {
                    this.nodefs.closeSync(stream.nfd);
                  }
                } catch (e) {
                  if (!e.code) {
                    throw e;
                  }
                  throw new FS2.ErrnoError(this.ERRNO_CODES[e.code]);
                }
              };
              BFSEmscriptenStreamOps.prototype.read = function read(
                stream,
                buffer$$1,
                offset,
                length,
                position
              ) {
                try {
                  return this.nodefs.readSync(
                    stream.nfd,
                    uint8Array2Buffer(buffer$$1),
                    offset,
                    length,
                    position
                  );
                } catch (e) {
                  throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
                }
              };
              BFSEmscriptenStreamOps.prototype.write = function write(
                stream,
                buffer$$1,
                offset,
                length,
                position
              ) {
                try {
                  return this.nodefs.writeSync(
                    stream.nfd,
                    uint8Array2Buffer(buffer$$1),
                    offset,
                    length,
                    position
                  );
                } catch (e) {
                  throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
                }
              };
              BFSEmscriptenStreamOps.prototype.llseek = function llseek(
                stream,
                offset,
                whence
              ) {
                var position = offset;
                if (whence === 1) {
                  position += stream.position;
                } else if (whence === 2) {
                  if (this.FS.isFile(stream.node.mode)) {
                    try {
                      var stat = this.nodefs.fstatSync(stream.nfd);
                      position += stat.size;
                    } catch (e) {
                      throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
                    }
                  }
                }
                if (position < 0) {
                  throw new this.FS.ErrnoError(this.ERRNO_CODES.EINVAL);
                }
                stream.position = position;
                return position;
              };
              var BFSEmscriptenNodeOps = function BFSEmscriptenNodeOps2(fs2) {
                this.fs = fs2;
                this.nodefs = fs2.getNodeFS();
                this.FS = fs2.getFS();
                this.PATH = fs2.getPATH();
                this.ERRNO_CODES = fs2.getERRNO_CODES();
              };
              BFSEmscriptenNodeOps.prototype.getattr = function getattr(node) {
                var path$$1 = this.fs.realPath(node);
                var stat;
                try {
                  stat = this.nodefs.lstatSync(path$$1);
                } catch (e) {
                  if (!e.code) {
                    throw e;
                  }
                  throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
                }
                return {
                  dev: stat.dev,
                  ino: stat.ino,
                  mode: stat.mode,
                  nlink: stat.nlink,
                  uid: stat.uid,
                  gid: stat.gid,
                  rdev: stat.rdev,
                  size: stat.size,
                  atime: stat.atime,
                  mtime: stat.mtime,
                  ctime: stat.ctime,
                  blksize: stat.blksize,
                  blocks: stat.blocks,
                };
              };
              BFSEmscriptenNodeOps.prototype.setattr = function setattr(
                node,
                attr
              ) {
                var path$$1 = this.fs.realPath(node);
                try {
                  if (attr.mode !== void 0) {
                    this.nodefs.chmodSync(path$$1, attr.mode);
                    node.mode = attr.mode;
                  }
                  if (attr.timestamp !== void 0) {
                    var date = new Date(attr.timestamp);
                    this.nodefs.utimesSync(path$$1, date, date);
                  }
                } catch (e) {
                  if (!e.code) {
                    throw e;
                  }
                  if (e.code !== "ENOTSUP") {
                    throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
                  }
                }
                if (attr.size !== void 0) {
                  try {
                    this.nodefs.truncateSync(path$$1, attr.size);
                  } catch (e) {
                    if (!e.code) {
                      throw e;
                    }
                    throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
                  }
                }
              };
              BFSEmscriptenNodeOps.prototype.lookup = function lookup(
                parent,
                name2
              ) {
                var path$$1 = this.PATH.join2(this.fs.realPath(parent), name2);
                var mode = this.fs.getMode(path$$1);
                return this.fs.createNode(parent, name2, mode);
              };
              BFSEmscriptenNodeOps.prototype.mknod = function mknod(
                parent,
                name2,
                mode,
                dev
              ) {
                var node = this.fs.createNode(parent, name2, mode, dev);
                var path$$1 = this.fs.realPath(node);
                try {
                  if (this.FS.isDir(node.mode)) {
                    this.nodefs.mkdirSync(path$$1, node.mode);
                  } else {
                    this.nodefs.writeFileSync(path$$1, "", { mode: node.mode });
                  }
                } catch (e) {
                  if (!e.code) {
                    throw e;
                  }
                  throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
                }
                return node;
              };
              BFSEmscriptenNodeOps.prototype.rename = function rename(
                oldNode,
                newDir,
                newName
              ) {
                var oldPath = this.fs.realPath(oldNode);
                var newPath = this.PATH.join2(
                  this.fs.realPath(newDir),
                  newName
                );
                try {
                  this.nodefs.renameSync(oldPath, newPath);
                  oldNode.name = newName;
                  oldNode.parent = newDir;
                } catch (e) {
                  if (!e.code) {
                    throw e;
                  }
                  throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
                }
              };
              BFSEmscriptenNodeOps.prototype.unlink = function unlink(
                parent,
                name2
              ) {
                var path$$1 = this.PATH.join2(this.fs.realPath(parent), name2);
                try {
                  this.nodefs.unlinkSync(path$$1);
                } catch (e) {
                  if (!e.code) {
                    throw e;
                  }
                  throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
                }
              };
              BFSEmscriptenNodeOps.prototype.rmdir = function rmdir(
                parent,
                name2
              ) {
                var path$$1 = this.PATH.join2(this.fs.realPath(parent), name2);
                try {
                  this.nodefs.rmdirSync(path$$1);
                } catch (e) {
                  if (!e.code) {
                    throw e;
                  }
                  throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
                }
              };
              BFSEmscriptenNodeOps.prototype.readdir = function readdir(node) {
                var path$$1 = this.fs.realPath(node);
                try {
                  var contents = this.nodefs.readdirSync(path$$1);
                  contents.push(".", "..");
                  return contents;
                } catch (e) {
                  if (!e.code) {
                    throw e;
                  }
                  throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
                }
              };
              BFSEmscriptenNodeOps.prototype.symlink = function symlink(
                parent,
                newName,
                oldPath
              ) {
                var newPath = this.PATH.join2(
                  this.fs.realPath(parent),
                  newName
                );
                try {
                  this.nodefs.symlinkSync(oldPath, newPath);
                } catch (e) {
                  if (!e.code) {
                    throw e;
                  }
                  throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
                }
              };
              BFSEmscriptenNodeOps.prototype.readlink = function readlink(
                node
              ) {
                var path$$1 = this.fs.realPath(node);
                try {
                  return this.nodefs.readlinkSync(path$$1);
                } catch (e) {
                  if (!e.code) {
                    throw e;
                  }
                  throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
                }
              };
              var BFSEmscriptenFS = function BFSEmscriptenFS2(
                _FS,
                _PATH,
                _ERRNO_CODES,
                nodefs
              ) {
                if (_FS === void 0) _FS = self["FS"];
                if (_PATH === void 0) _PATH = self["PATH"];
                if (_ERRNO_CODES === void 0) _ERRNO_CODES = self["ERRNO_CODES"];
                if (nodefs === void 0) nodefs = _fsMock;
                this.flagsToPermissionStringMap = {
                  0: "r",
                  1: "r+",
                  2: "r+",
                  64: "r",
                  65: "r+",
                  66: "r+",
                  129: "rx+",
                  193: "rx+",
                  514: "w+",
                  577: "w",
                  578: "w+",
                  705: "wx",
                  706: "wx+",
                  1024: "a",
                  1025: "a",
                  1026: "a+",
                  1089: "a",
                  1090: "a+",
                  1153: "ax",
                  1154: "ax+",
                  1217: "ax",
                  1218: "ax+",
                  4096: "rs",
                  4098: "rs+",
                };
                this.nodefs = nodefs;
                this.FS = _FS;
                this.PATH = _PATH;
                this.ERRNO_CODES = _ERRNO_CODES;
                this.node_ops = new BFSEmscriptenNodeOps(this);
                this.stream_ops = new BFSEmscriptenStreamOps(this);
              };
              BFSEmscriptenFS.prototype.mount = function mount(m) {
                return this.createNode(null, "/", this.getMode(m.opts.root), 0);
              };
              BFSEmscriptenFS.prototype.createNode = function createNode(
                parent,
                name2,
                mode,
                dev
              ) {
                var FS2 = this.FS;
                if (
                  !FS2.isDir(mode) &&
                  !FS2.isFile(mode) &&
                  !FS2.isLink(mode)
                ) {
                  throw new FS2.ErrnoError(this.ERRNO_CODES.EINVAL);
                }
                var node = FS2.createNode(parent, name2, mode);
                node.node_ops = this.node_ops;
                node.stream_ops = this.stream_ops;
                return node;
              };
              BFSEmscriptenFS.prototype.getMode = function getMode(path$$1) {
                var stat;
                try {
                  stat = this.nodefs.lstatSync(path$$1);
                } catch (e) {
                  if (!e.code) {
                    throw e;
                  }
                  throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
                }
                return stat.mode;
              };
              BFSEmscriptenFS.prototype.realPath = function realPath(node) {
                var parts = [];
                while (node.parent !== node) {
                  parts.push(node.name);
                  node = node.parent;
                }
                parts.push(node.mount.opts.root);
                parts.reverse();
                return this.PATH.join.apply(null, parts);
              };
              BFSEmscriptenFS.prototype.flagsToPermissionString =
                function flagsToPermissionString(flags) {
                  var parsedFlags =
                    typeof flags === "string" ? parseInt(flags, 10) : flags;
                  parsedFlags &= 8191;
                  if (parsedFlags in this.flagsToPermissionStringMap) {
                    return this.flagsToPermissionStringMap[parsedFlags];
                  } else {
                    return flags;
                  }
                };
              BFSEmscriptenFS.prototype.getNodeFS = function getNodeFS() {
                return this.nodefs;
              };
              BFSEmscriptenFS.prototype.getFS = function getFS() {
                return this.FS;
              };
              BFSEmscriptenFS.prototype.getPATH = function getPATH() {
                return this.PATH;
              };
              BFSEmscriptenFS.prototype.getERRNO_CODES =
                function getERRNO_CODES() {
                  return this.ERRNO_CODES;
                };
              var BaseFileSystem = function BaseFileSystem2() {};
              BaseFileSystem.prototype.supportsLinks =
                function supportsLinks() {
                  return false;
                };
              BaseFileSystem.prototype.diskSpace = function diskSpace(p, cb) {
                cb(0, 0);
              };
              BaseFileSystem.prototype.openFile = function openFile(
                p,
                flag,
                cb
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.createFile = function createFile(
                p,
                flag,
                mode,
                cb
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.open = function open(p, flag, mode, cb) {
                var this$1$1 = this;
                var mustBeFile = function (e, stats) {
                  if (e) {
                    switch (flag.pathNotExistsAction()) {
                      case ActionType.CREATE_FILE:
                        return this$1$1.stat(
                          path2.dirname(p),
                          false,
                          function (e2, parentStats) {
                            if (e2) {
                              cb(e2);
                            } else if (
                              parentStats &&
                              !parentStats.isDirectory()
                            ) {
                              cb(ApiError.ENOTDIR(path2.dirname(p)));
                            } else {
                              this$1$1.createFile(p, flag, mode, cb);
                            }
                          }
                        );
                      case ActionType.THROW_EXCEPTION:
                        return cb(ApiError.ENOENT(p));
                      default:
                        return cb(
                          new ApiError(
                            ErrorCode.EINVAL,
                            "Invalid FileFlag object."
                          )
                        );
                    }
                  } else {
                    if (stats && stats.isDirectory()) {
                      return cb(ApiError.EISDIR(p));
                    }
                    switch (flag.pathExistsAction()) {
                      case ActionType.THROW_EXCEPTION:
                        return cb(ApiError.EEXIST(p));
                      case ActionType.TRUNCATE_FILE:
                        return this$1$1.openFile(p, flag, function (e2, fd) {
                          if (e2) {
                            cb(e2);
                          } else if (fd) {
                            fd.truncate(0, function () {
                              fd.sync(function () {
                                cb(null, fd);
                              });
                            });
                          } else {
                            fail();
                          }
                        });
                      case ActionType.NOP:
                        return this$1$1.openFile(p, flag, cb);
                      default:
                        return cb(
                          new ApiError(
                            ErrorCode.EINVAL,
                            "Invalid FileFlag object."
                          )
                        );
                    }
                  }
                };
                this.stat(p, false, mustBeFile);
              };
              BaseFileSystem.prototype.rename = function rename(
                oldPath,
                newPath,
                cb
              ) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFileSystem.prototype.renameSync = function renameSync(
                oldPath,
                newPath
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.stat = function stat(p, isLstat, cb) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFileSystem.prototype.statSync = function statSync(
                p,
                isLstat
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.openFileSync = function openFileSync(
                p,
                flag,
                mode
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.createFileSync = function createFileSync(
                p,
                flag,
                mode
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.openSync = function openSync(
                p,
                flag,
                mode
              ) {
                var stats;
                try {
                  stats = this.statSync(p, false);
                } catch (e) {
                  switch (flag.pathNotExistsAction()) {
                    case ActionType.CREATE_FILE:
                      var parentStats = this.statSync(path2.dirname(p), false);
                      if (!parentStats.isDirectory()) {
                        throw ApiError.ENOTDIR(path2.dirname(p));
                      }
                      return this.createFileSync(p, flag, mode);
                    case ActionType.THROW_EXCEPTION:
                      throw ApiError.ENOENT(p);
                    default:
                      throw new ApiError(
                        ErrorCode.EINVAL,
                        "Invalid FileFlag object."
                      );
                  }
                }
                if (stats.isDirectory()) {
                  throw ApiError.EISDIR(p);
                }
                switch (flag.pathExistsAction()) {
                  case ActionType.THROW_EXCEPTION:
                    throw ApiError.EEXIST(p);
                  case ActionType.TRUNCATE_FILE:
                    this.unlinkSync(p);
                    return this.createFileSync(p, flag, stats.mode);
                  case ActionType.NOP:
                    return this.openFileSync(p, flag, mode);
                  default:
                    throw new ApiError(
                      ErrorCode.EINVAL,
                      "Invalid FileFlag object."
                    );
                }
              };
              BaseFileSystem.prototype.unlink = function unlink(p, cb) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFileSystem.prototype.unlinkSync = function unlinkSync(p) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.rmdir = function rmdir(p, cb) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFileSystem.prototype.rmdirSync = function rmdirSync(p) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.mkdir = function mkdir(p, mode, cb) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFileSystem.prototype.mkdirSync = function mkdirSync(p, mode) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.readdir = function readdir(p, cb) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFileSystem.prototype.readdirSync = function readdirSync(p) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.exists = function exists(p, cb) {
                this.stat(p, null, function (err) {
                  cb(!err);
                });
              };
              BaseFileSystem.prototype.existsSync = function existsSync(p) {
                try {
                  this.statSync(p, true);
                  return true;
                } catch (e) {
                  return false;
                }
              };
              BaseFileSystem.prototype.realpath = function realpath(
                p,
                cache,
                cb
              ) {
                if (this.supportsLinks()) {
                  var splitPath = p.split(path2.sep);
                  for (var i2 = 0; i2 < splitPath.length; i2++) {
                    var addPaths = splitPath.slice(0, i2 + 1);
                    splitPath[i2] = path2.join.apply(null, addPaths);
                  }
                } else {
                  this.exists(p, function (doesExist) {
                    if (doesExist) {
                      cb(null, p);
                    } else {
                      cb(ApiError.ENOENT(p));
                    }
                  });
                }
              };
              BaseFileSystem.prototype.realpathSync = function realpathSync(
                p,
                cache
              ) {
                if (this.supportsLinks()) {
                  var splitPath = p.split(path2.sep);
                  for (var i2 = 0; i2 < splitPath.length; i2++) {
                    var addPaths = splitPath.slice(0, i2 + 1);
                    splitPath[i2] = path2.join.apply(path2, addPaths);
                  }
                  return splitPath.join(path2.sep);
                } else {
                  if (this.existsSync(p)) {
                    return p;
                  } else {
                    throw ApiError.ENOENT(p);
                  }
                }
              };
              BaseFileSystem.prototype.truncate = function truncate(
                p,
                len,
                cb
              ) {
                this.open(
                  p,
                  FileFlag.getFileFlag("r+"),
                  420,
                  function (er, fd) {
                    if (er) {
                      return cb(er);
                    }
                    fd.truncate(len, function (er2) {
                      fd.close(function (er22) {
                        cb(er2 || er22);
                      });
                    });
                  }
                );
              };
              BaseFileSystem.prototype.truncateSync = function truncateSync(
                p,
                len
              ) {
                var fd = this.openSync(p, FileFlag.getFileFlag("r+"), 420);
                try {
                  fd.truncateSync(len);
                } catch (e) {
                  throw e;
                } finally {
                  fd.closeSync();
                }
              };
              BaseFileSystem.prototype.readFile = function readFile(
                fname,
                encoding,
                flag,
                cb
              ) {
                var oldCb = cb;
                this.open(fname, flag, 420, function (err, fd) {
                  if (err) {
                    return cb(err);
                  }
                  cb = function (err2, arg) {
                    fd.close(function (err22) {
                      if (!err2) {
                        err2 = err22;
                      }
                      return oldCb(err2, arg);
                    });
                  };
                  fd.stat(function (err2, stat) {
                    if (err2) {
                      return cb(err2);
                    }
                    var buf = Buffer2.alloc(stat.size);
                    fd.read(buf, 0, stat.size, 0, function (err3) {
                      if (err3) {
                        return cb(err3);
                      } else if (encoding === null) {
                        return cb(err3, buf);
                      }
                      try {
                        cb(null, buf.toString(encoding));
                      } catch (e) {
                        cb(e);
                      }
                    });
                  });
                });
              };
              BaseFileSystem.prototype.readFileSync = function readFileSync(
                fname,
                encoding,
                flag
              ) {
                var fd = this.openSync(fname, flag, 420);
                try {
                  var stat = fd.statSync();
                  var buf = Buffer2.alloc(stat.size);
                  fd.readSync(buf, 0, stat.size, 0);
                  fd.closeSync();
                  if (encoding === null) {
                    return buf;
                  }
                  return buf.toString(encoding);
                } finally {
                  fd.closeSync();
                }
              };
              BaseFileSystem.prototype.writeFile = function writeFile(
                fname,
                data,
                encoding,
                flag,
                mode,
                cb
              ) {
                var oldCb = cb;
                this.open(fname, flag, 420, function (err, fd) {
                  if (err) {
                    return cb(err);
                  }
                  cb = function (err2) {
                    fd.close(function (err22) {
                      oldCb(err2 ? err2 : err22);
                    });
                  };
                  try {
                    if (typeof data === "string") {
                      data = Buffer2.from(data, encoding);
                    }
                  } catch (e) {
                    return cb(e);
                  }
                  fd.write(data, 0, data.length, 0, cb);
                });
              };
              BaseFileSystem.prototype.writeFileSync = function writeFileSync(
                fname,
                data,
                encoding,
                flag,
                mode
              ) {
                var fd = this.openSync(fname, flag, mode);
                try {
                  if (typeof data === "string") {
                    data = Buffer2.from(data, encoding);
                  }
                  fd.writeSync(data, 0, data.length, 0);
                } finally {
                  fd.closeSync();
                }
              };
              BaseFileSystem.prototype.appendFile = function appendFile(
                fname,
                data,
                encoding,
                flag,
                mode,
                cb
              ) {
                var oldCb = cb;
                this.open(fname, flag, mode, function (err, fd) {
                  if (err) {
                    return cb(err);
                  }
                  cb = function (err2) {
                    fd.close(function (err22) {
                      oldCb(err2 ? err2 : err22);
                    });
                  };
                  if (typeof data === "string") {
                    data = Buffer2.from(data, encoding);
                  }
                  fd.write(data, 0, data.length, null, cb);
                });
              };
              BaseFileSystem.prototype.appendFileSync = function appendFileSync(
                fname,
                data,
                encoding,
                flag,
                mode
              ) {
                var fd = this.openSync(fname, flag, mode);
                try {
                  if (typeof data === "string") {
                    data = Buffer2.from(data, encoding);
                  }
                  fd.writeSync(data, 0, data.length, null);
                } finally {
                  fd.closeSync();
                }
              };
              BaseFileSystem.prototype.chmod = function chmod(
                p,
                isLchmod,
                mode,
                cb
              ) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFileSystem.prototype.chmodSync = function chmodSync(
                p,
                isLchmod,
                mode
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.chown = function chown(
                p,
                isLchown,
                uid,
                gid,
                cb
              ) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFileSystem.prototype.chownSync = function chownSync(
                p,
                isLchown,
                uid,
                gid
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.utimes = function utimes(
                p,
                atime,
                mtime,
                cb
              ) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFileSystem.prototype.utimesSync = function utimesSync(
                p,
                atime,
                mtime
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.link = function link(
                srcpath,
                dstpath,
                cb
              ) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFileSystem.prototype.linkSync = function linkSync(
                srcpath,
                dstpath
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.symlink = function symlink(
                srcpath,
                dstpath,
                type,
                cb
              ) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFileSystem.prototype.symlinkSync = function symlinkSync(
                srcpath,
                dstpath,
                type
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFileSystem.prototype.readlink = function readlink(p, cb) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFileSystem.prototype.readlinkSync = function readlinkSync(p) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              var SynchronousFileSystem = (function (BaseFileSystem2) {
                function SynchronousFileSystem2() {
                  BaseFileSystem2.apply(this, arguments);
                }
                if (BaseFileSystem2)
                  SynchronousFileSystem2.__proto__ = BaseFileSystem2;
                SynchronousFileSystem2.prototype = Object.create(
                  BaseFileSystem2 && BaseFileSystem2.prototype
                );
                SynchronousFileSystem2.prototype.constructor =
                  SynchronousFileSystem2;
                SynchronousFileSystem2.prototype.supportsSynch =
                  function supportsSynch() {
                    return true;
                  };
                SynchronousFileSystem2.prototype.rename = function rename(
                  oldPath,
                  newPath,
                  cb
                ) {
                  try {
                    this.renameSync(oldPath, newPath);
                    cb();
                  } catch (e) {
                    cb(e);
                  }
                };
                SynchronousFileSystem2.prototype.stat = function stat(
                  p,
                  isLstat,
                  cb
                ) {
                  try {
                    cb(null, this.statSync(p, isLstat));
                  } catch (e) {
                    cb(e);
                  }
                };
                SynchronousFileSystem2.prototype.open = function open(
                  p,
                  flags,
                  mode,
                  cb
                ) {
                  try {
                    cb(null, this.openSync(p, flags, mode));
                  } catch (e) {
                    cb(e);
                  }
                };
                SynchronousFileSystem2.prototype.unlink = function unlink(
                  p,
                  cb
                ) {
                  try {
                    this.unlinkSync(p);
                    cb();
                  } catch (e) {
                    cb(e);
                  }
                };
                SynchronousFileSystem2.prototype.rmdir = function rmdir(p, cb) {
                  try {
                    this.rmdirSync(p);
                    cb();
                  } catch (e) {
                    cb(e);
                  }
                };
                SynchronousFileSystem2.prototype.mkdir = function mkdir(
                  p,
                  mode,
                  cb
                ) {
                  try {
                    this.mkdirSync(p, mode);
                    cb();
                  } catch (e) {
                    cb(e);
                  }
                };
                SynchronousFileSystem2.prototype.readdir = function readdir(
                  p,
                  cb
                ) {
                  try {
                    cb(null, this.readdirSync(p));
                  } catch (e) {
                    cb(e);
                  }
                };
                SynchronousFileSystem2.prototype.chmod = function chmod(
                  p,
                  isLchmod,
                  mode,
                  cb
                ) {
                  try {
                    this.chmodSync(p, isLchmod, mode);
                    cb();
                  } catch (e) {
                    cb(e);
                  }
                };
                SynchronousFileSystem2.prototype.chown = function chown(
                  p,
                  isLchown,
                  uid,
                  gid,
                  cb
                ) {
                  try {
                    this.chownSync(p, isLchown, uid, gid);
                    cb();
                  } catch (e) {
                    cb(e);
                  }
                };
                SynchronousFileSystem2.prototype.utimes = function utimes(
                  p,
                  atime,
                  mtime,
                  cb
                ) {
                  try {
                    this.utimesSync(p, atime, mtime);
                    cb();
                  } catch (e) {
                    cb(e);
                  }
                };
                SynchronousFileSystem2.prototype.link = function link(
                  srcpath,
                  dstpath,
                  cb
                ) {
                  try {
                    this.linkSync(srcpath, dstpath);
                    cb();
                  } catch (e) {
                    cb(e);
                  }
                };
                SynchronousFileSystem2.prototype.symlink = function symlink(
                  srcpath,
                  dstpath,
                  type,
                  cb
                ) {
                  try {
                    this.symlinkSync(srcpath, dstpath, type);
                    cb();
                  } catch (e) {
                    cb(e);
                  }
                };
                SynchronousFileSystem2.prototype.readlink = function readlink(
                  p,
                  cb
                ) {
                  try {
                    cb(null, this.readlinkSync(p));
                  } catch (e) {
                    cb(e);
                  }
                };
                return SynchronousFileSystem2;
              })(BaseFileSystem);
              var BaseFile = function BaseFile2() {};
              BaseFile.prototype.sync = function sync(cb) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFile.prototype.syncSync = function syncSync() {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFile.prototype.datasync = function datasync(cb) {
                this.sync(cb);
              };
              BaseFile.prototype.datasyncSync = function datasyncSync() {
                return this.syncSync();
              };
              BaseFile.prototype.chown = function chown(uid, gid, cb) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFile.prototype.chownSync = function chownSync(uid, gid) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFile.prototype.chmod = function chmod(mode, cb) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFile.prototype.chmodSync = function chmodSync(mode) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              BaseFile.prototype.utimes = function utimes(atime, mtime, cb) {
                cb(new ApiError(ErrorCode.ENOTSUP));
              };
              BaseFile.prototype.utimesSync = function utimesSync(
                atime,
                mtime
              ) {
                throw new ApiError(ErrorCode.ENOTSUP);
              };
              var PreloadFile = (function (BaseFile$$1) {
                function PreloadFile2(_fs, _path, _flag, _stat, contents) {
                  BaseFile$$1.call(this);
                  this._pos = 0;
                  this._dirty = false;
                  this._fs = _fs;
                  this._path = _path;
                  this._flag = _flag;
                  this._stat = _stat;
                  if (contents) {
                    this._buffer = contents;
                  } else {
                    this._buffer = emptyBuffer();
                  }
                  if (
                    this._stat.size !== this._buffer.length &&
                    this._flag.isReadable()
                  ) {
                    throw new Error(
                      "Invalid buffer: Buffer is " +
                        this._buffer.length +
                        " long, yet Stats object specifies that file is " +
                        this._stat.size +
                        " long."
                    );
                  }
                }
                if (BaseFile$$1) PreloadFile2.__proto__ = BaseFile$$1;
                PreloadFile2.prototype = Object.create(
                  BaseFile$$1 && BaseFile$$1.prototype
                );
                PreloadFile2.prototype.constructor = PreloadFile2;
                PreloadFile2.prototype.getBuffer = function getBuffer() {
                  return this._buffer;
                };
                PreloadFile2.prototype.getStats = function getStats() {
                  return this._stat;
                };
                PreloadFile2.prototype.getFlag = function getFlag2() {
                  return this._flag;
                };
                PreloadFile2.prototype.getPath = function getPath() {
                  return this._path;
                };
                PreloadFile2.prototype.getPos = function getPos() {
                  if (this._flag.isAppendable()) {
                    return this._stat.size;
                  }
                  return this._pos;
                };
                PreloadFile2.prototype.advancePos = function advancePos(delta) {
                  return (this._pos += delta);
                };
                PreloadFile2.prototype.setPos = function setPos(newPos) {
                  return (this._pos = newPos);
                };
                PreloadFile2.prototype.sync = function sync(cb) {
                  try {
                    this.syncSync();
                    cb();
                  } catch (e) {
                    cb(e);
                  }
                };
                PreloadFile2.prototype.syncSync = function syncSync() {
                  throw new ApiError(ErrorCode.ENOTSUP);
                };
                PreloadFile2.prototype.close = function close(cb) {
                  try {
                    this.closeSync();
                    cb();
                  } catch (e) {
                    cb(e);
                  }
                };
                PreloadFile2.prototype.closeSync = function closeSync() {
                  throw new ApiError(ErrorCode.ENOTSUP);
                };
                PreloadFile2.prototype.stat = function stat(cb) {
                  try {
                    cb(null, this._stat.clone());
                  } catch (e) {
                    cb(e);
                  }
                };
                PreloadFile2.prototype.statSync = function statSync() {
                  return this._stat.clone();
                };
                PreloadFile2.prototype.truncate = function truncate(len, cb) {
                  try {
                    this.truncateSync(len);
                    if (
                      this._flag.isSynchronous() &&
                      !_fsMock.getRootFS().supportsSynch()
                    ) {
                      this.sync(cb);
                    }
                    cb();
                  } catch (e) {
                    return cb(e);
                  }
                };
                PreloadFile2.prototype.truncateSync = function truncateSync(
                  len
                ) {
                  this._dirty = true;
                  if (!this._flag.isWriteable()) {
                    throw new ApiError(
                      ErrorCode.EPERM,
                      "File not opened with a writeable mode."
                    );
                  }
                  this._stat.mtime = /* @__PURE__ */ new Date();
                  if (len > this._buffer.length) {
                    var buf = Buffer2.alloc(len - this._buffer.length, 0);
                    this.writeSync(buf, 0, buf.length, this._buffer.length);
                    if (
                      this._flag.isSynchronous() &&
                      _fsMock.getRootFS().supportsSynch()
                    ) {
                      this.syncSync();
                    }
                    return;
                  }
                  this._stat.size = len;
                  var newBuff = Buffer2.alloc(len);
                  this._buffer.copy(newBuff, 0, 0, len);
                  this._buffer = newBuff;
                  if (
                    this._flag.isSynchronous() &&
                    _fsMock.getRootFS().supportsSynch()
                  ) {
                    this.syncSync();
                  }
                };
                PreloadFile2.prototype.write = function write(
                  buffer$$1,
                  offset,
                  length,
                  position,
                  cb
                ) {
                  try {
                    cb(
                      null,
                      this.writeSync(buffer$$1, offset, length, position),
                      buffer$$1
                    );
                  } catch (e) {
                    cb(e);
                  }
                };
                PreloadFile2.prototype.writeSync = function writeSync(
                  buffer$$1,
                  offset,
                  length,
                  position
                ) {
                  this._dirty = true;
                  if (position === void 0 || position === null) {
                    position = this.getPos();
                  }
                  if (!this._flag.isWriteable()) {
                    throw new ApiError(
                      ErrorCode.EPERM,
                      "File not opened with a writeable mode."
                    );
                  }
                  var endFp = position + length;
                  if (endFp > this._stat.size) {
                    this._stat.size = endFp;
                    if (endFp > this._buffer.length) {
                      var newBuff = Buffer2.alloc(endFp);
                      this._buffer.copy(newBuff);
                      this._buffer = newBuff;
                    }
                  }
                  var len = buffer$$1.copy(
                    this._buffer,
                    position,
                    offset,
                    offset + length
                  );
                  this._stat.mtime = /* @__PURE__ */ new Date();
                  if (this._flag.isSynchronous()) {
                    this.syncSync();
                    return len;
                  }
                  this.setPos(position + len);
                  return len;
                };
                PreloadFile2.prototype.read = function read(
                  buffer$$1,
                  offset,
                  length,
                  position,
                  cb
                ) {
                  try {
                    cb(
                      null,
                      this.readSync(buffer$$1, offset, length, position),
                      buffer$$1
                    );
                  } catch (e) {
                    cb(e);
                  }
                };
                PreloadFile2.prototype.readSync = function readSync(
                  buffer$$1,
                  offset,
                  length,
                  position
                ) {
                  if (!this._flag.isReadable()) {
                    throw new ApiError(
                      ErrorCode.EPERM,
                      "File not opened with a readable mode."
                    );
                  }
                  if (position === void 0 || position === null) {
                    position = this.getPos();
                  }
                  var endRead = position + length;
                  if (endRead > this._stat.size) {
                    length = this._stat.size - position;
                  }
                  var rv = this._buffer.copy(
                    buffer$$1,
                    offset,
                    position,
                    position + length
                  );
                  this._stat.atime = /* @__PURE__ */ new Date();
                  this._pos = position + length;
                  return rv;
                };
                PreloadFile2.prototype.chmod = function chmod(mode, cb) {
                  try {
                    this.chmodSync(mode);
                    cb();
                  } catch (e) {
                    cb(e);
                  }
                };
                PreloadFile2.prototype.chmodSync = function chmodSync(mode) {
                  if (!this._fs.supportsProps()) {
                    throw new ApiError(ErrorCode.ENOTSUP);
                  }
                  this._dirty = true;
                  this._stat.chmod(mode);
                  this.syncSync();
                };
                PreloadFile2.prototype.isDirty = function isDirty() {
                  return this._dirty;
                };
                PreloadFile2.prototype.resetDirty = function resetDirty() {
                  this._dirty = false;
                };
                return PreloadFile2;
              })(BaseFile);
              var NoSyncFile = (function (PreloadFile2) {
                function NoSyncFile2(_fs, _path, _flag, _stat, contents) {
                  PreloadFile2.call(this, _fs, _path, _flag, _stat, contents);
                }
                if (PreloadFile2) NoSyncFile2.__proto__ = PreloadFile2;
                NoSyncFile2.prototype = Object.create(
                  PreloadFile2 && PreloadFile2.prototype
                );
                NoSyncFile2.prototype.constructor = NoSyncFile2;
                NoSyncFile2.prototype.sync = function sync(cb) {
                  cb();
                };
                NoSyncFile2.prototype.syncSync = function syncSync() {};
                NoSyncFile2.prototype.close = function close(cb) {
                  cb();
                };
                NoSyncFile2.prototype.closeSync = function closeSync() {};
                return NoSyncFile2;
              })(PreloadFile);
              var MirrorFile = (function (PreloadFile$$1) {
                function MirrorFile2(fs2, path$$1, flag, stat, data) {
                  PreloadFile$$1.call(this, fs2, path$$1, flag, stat, data);
                }
                if (PreloadFile$$1) MirrorFile2.__proto__ = PreloadFile$$1;
                MirrorFile2.prototype = Object.create(
                  PreloadFile$$1 && PreloadFile$$1.prototype
                );
                MirrorFile2.prototype.constructor = MirrorFile2;
                MirrorFile2.prototype.syncSync = function syncSync() {
                  if (this.isDirty()) {
                    this._fs._syncSync(this);
                    this.resetDirty();
                  }
                };
                MirrorFile2.prototype.closeSync = function closeSync() {
                  this.syncSync();
                };
                return MirrorFile2;
              })(PreloadFile);
              var AsyncMirror = (function (SynchronousFileSystem$$1) {
                function AsyncMirror2(sync, async, deprecateMsg) {
                  if (deprecateMsg === void 0) deprecateMsg = true;
                  SynchronousFileSystem$$1.call(this);
                  this._queue = [];
                  this._queueRunning = false;
                  this._isInitialized = false;
                  this._initializeCallbacks = [];
                  this._sync = sync;
                  this._async = async;
                  if (!sync.supportsSynch()) {
                    throw new Error(
                      "The first argument to AsyncMirror needs to be a synchronous file system."
                    );
                  }
                  deprecationMessage(deprecateMsg, AsyncMirror2.Name, {
                    sync: "sync file system instance",
                    async: "async file system instance",
                  });
                }
                if (SynchronousFileSystem$$1)
                  AsyncMirror2.__proto__ = SynchronousFileSystem$$1;
                AsyncMirror2.prototype = Object.create(
                  SynchronousFileSystem$$1 && SynchronousFileSystem$$1.prototype
                );
                AsyncMirror2.prototype.constructor = AsyncMirror2;
                AsyncMirror2.Create = function Create(opts, cb) {
                  try {
                    var fs2 = new AsyncMirror2(opts.sync, opts.async, false);
                    fs2.initialize(function (e) {
                      if (e) {
                        cb(e);
                      } else {
                        cb(null, fs2);
                      }
                    }, false);
                  } catch (e) {
                    cb(e);
                  }
                };
                AsyncMirror2.isAvailable = function isAvailable() {
                  return true;
                };
                AsyncMirror2.prototype.getName = function getName() {
                  return AsyncMirror2.Name;
                };
                AsyncMirror2.prototype._syncSync = function _syncSync(fd) {
                  this._sync.writeFileSync(
                    fd.getPath(),
                    fd.getBuffer(),
                    null,
                    FileFlag.getFileFlag("w"),
                    fd.getStats().mode
                  );
                  this.enqueueOp({
                    apiMethod: "writeFile",
                    arguments: [
                      fd.getPath(),
                      fd.getBuffer(),
                      null,
                      fd.getFlag(),
                      fd.getStats().mode,
                    ],
                  });
                };
                AsyncMirror2.prototype.initialize = function initialize2(
                  userCb,
                  deprecateMsg
                ) {
                  var this$1$1 = this;
                  if (deprecateMsg === void 0) deprecateMsg = true;
                  if (deprecateMsg) {
                    console.warn(
                      "[AsyncMirror] AsyncMirror.initialize() is deprecated and will be removed in the next major version. Please use 'AsyncMirror.Create({ sync: (sync file system instance), async: (async file system instance)}, cb)' to create and initialize AsyncMirror instances."
                    );
                  }
                  var callbacks = this._initializeCallbacks;
                  var end = function (e) {
                    this$1$1._isInitialized = !e;
                    this$1$1._initializeCallbacks = [];
                    callbacks.forEach(function (cb) {
                      return cb(e);
                    });
                  };
                  if (!this._isInitialized) {
                    if (callbacks.push(userCb) === 1) {
                      var copyDirectory = function (p, mode, cb) {
                          if (p !== "/") {
                            this$1$1._sync.mkdirSync(p, mode);
                          }
                          this$1$1._async.readdir(p, function (err, files) {
                            var i2 = 0;
                            function copyNextFile(err2) {
                              if (err2) {
                                cb(err2);
                              } else if (i2 < files.length) {
                                copyItem(
                                  path2.join(p, files[i2]),
                                  copyNextFile
                                );
                                i2++;
                              } else {
                                cb();
                              }
                            }
                            if (err) {
                              cb(err);
                            } else {
                              copyNextFile();
                            }
                          });
                        },
                        copyFile = function (p, mode, cb) {
                          this$1$1._async.readFile(
                            p,
                            null,
                            FileFlag.getFileFlag("r"),
                            function (err, data) {
                              if (err) {
                                cb(err);
                              } else {
                                try {
                                  this$1$1._sync.writeFileSync(
                                    p,
                                    data,
                                    null,
                                    FileFlag.getFileFlag("w"),
                                    mode
                                  );
                                } catch (e) {
                                  err = e;
                                } finally {
                                  cb(err);
                                }
                              }
                            }
                          );
                        },
                        copyItem = function (p, cb) {
                          this$1$1._async.stat(p, false, function (err, stats) {
                            if (err) {
                              cb(err);
                            } else if (stats.isDirectory()) {
                              copyDirectory(p, stats.mode, cb);
                            } else {
                              copyFile(p, stats.mode, cb);
                            }
                          });
                        };
                      copyDirectory("/", 0, end);
                    }
                  } else {
                    userCb();
                  }
                };
                AsyncMirror2.prototype.isReadOnly = function isReadOnly() {
                  return false;
                };
                AsyncMirror2.prototype.supportsSynch =
                  function supportsSynch() {
                    return true;
                  };
                AsyncMirror2.prototype.supportsLinks =
                  function supportsLinks() {
                    return false;
                  };
                AsyncMirror2.prototype.supportsProps =
                  function supportsProps() {
                    return (
                      this._sync.supportsProps() && this._async.supportsProps()
                    );
                  };
                AsyncMirror2.prototype.renameSync = function renameSync(
                  oldPath,
                  newPath
                ) {
                  this.checkInitialized();
                  this._sync.renameSync(oldPath, newPath);
                  this.enqueueOp({
                    apiMethod: "rename",
                    arguments: [oldPath, newPath],
                  });
                };
                AsyncMirror2.prototype.statSync = function statSync(
                  p,
                  isLstat
                ) {
                  this.checkInitialized();
                  return this._sync.statSync(p, isLstat);
                };
                AsyncMirror2.prototype.openSync = function openSync(
                  p,
                  flag,
                  mode
                ) {
                  this.checkInitialized();
                  var fd = this._sync.openSync(p, flag, mode);
                  fd.closeSync();
                  return new MirrorFile(
                    this,
                    p,
                    flag,
                    this._sync.statSync(p, false),
                    this._sync.readFileSync(p, null, FileFlag.getFileFlag("r"))
                  );
                };
                AsyncMirror2.prototype.unlinkSync = function unlinkSync(p) {
                  this.checkInitialized();
                  this._sync.unlinkSync(p);
                  this.enqueueOp({
                    apiMethod: "unlink",
                    arguments: [p],
                  });
                };
                AsyncMirror2.prototype.rmdirSync = function rmdirSync(p) {
                  this.checkInitialized();
                  this._sync.rmdirSync(p);
                  this.enqueueOp({
                    apiMethod: "rmdir",
                    arguments: [p],
                  });
                };
                AsyncMirror2.prototype.mkdirSync = function mkdirSync(p, mode) {
                  this.checkInitialized();
                  this._sync.mkdirSync(p, mode);
                  this.enqueueOp({
                    apiMethod: "mkdir",
                    arguments: [p, mode],
                  });
                };
                AsyncMirror2.prototype.readdirSync = function readdirSync(p) {
                  this.checkInitialized();
                  return this._sync.readdirSync(p);
                };
                AsyncMirror2.prototype.existsSync = function existsSync(p) {
                  this.checkInitialized();
                  return this._sync.existsSync(p);
                };
                AsyncMirror2.prototype.chmodSync = function chmodSync(
                  p,
                  isLchmod,
                  mode
                ) {
                  this.checkInitialized();
                  this._sync.chmodSync(p, isLchmod, mode);
                  this.enqueueOp({
                    apiMethod: "chmod",
                    arguments: [p, isLchmod, mode],
                  });
                };
                AsyncMirror2.prototype.chownSync = function chownSync(
                  p,
                  isLchown,
                  uid,
                  gid
                ) {
                  this.checkInitialized();
                  this._sync.chownSync(p, isLchown, uid, gid);
                  this.enqueueOp({
                    apiMethod: "chown",
                    arguments: [p, isLchown, uid, gid],
                  });
                };
                AsyncMirror2.prototype.utimesSync = function utimesSync(
                  p,
                  atime,
                  mtime
                ) {
                  this.checkInitialized();
                  this._sync.utimesSync(p, atime, mtime);
                  this.enqueueOp({
                    apiMethod: "utimes",
                    arguments: [p, atime, mtime],
                  });
                };
                AsyncMirror2.prototype.checkInitialized =
                  function checkInitialized() {
                    if (!this._isInitialized) {
                      throw new ApiError(
                        ErrorCode.EPERM,
                        "AsyncMirrorFS is not initialized. Please initialize AsyncMirrorFS using its initialize() method before using it."
                      );
                    }
                  };
                AsyncMirror2.prototype.enqueueOp = function enqueueOp(op) {
                  var this$1$1 = this;
                  this._queue.push(op);
                  if (!this._queueRunning) {
                    this._queueRunning = true;
                    var doNextOp = function (err) {
                      if (err) {
                        console.error(
                          "WARNING: File system has desynchronized. Received following error: " +
                            err +
                            "\n$"
                        );
                      }
                      if (this$1$1._queue.length > 0) {
                        var op2 = this$1$1._queue.shift(),
                          args = op2.arguments;
                        args.push(doNextOp);
                        this$1$1._async[op2.apiMethod].apply(
                          this$1$1._async,
                          args
                        );
                      } else {
                        this$1$1._queueRunning = false;
                      }
                    };
                    doNextOp();
                  }
                };
                return AsyncMirror2;
              })(SynchronousFileSystem);
              AsyncMirror.Name = "AsyncMirror";
              AsyncMirror.Options = {
                sync: {
                  type: "object",
                  description:
                    "The synchronous file system to mirror the asynchronous file system to.",
                },
                async: {
                  type: "object",
                  description: "The asynchronous file system to mirror.",
                },
              };
              function apply(func, thisArg, args) {
                switch (args.length) {
                  case 0:
                    return func.call(thisArg);
                  case 1:
                    return func.call(thisArg, args[0]);
                  case 2:
                    return func.call(thisArg, args[0], args[1]);
                  case 3:
                    return func.call(thisArg, args[0], args[1], args[2]);
                }
                return func.apply(thisArg, args);
              }
              var nativeMax = Math.max;
              function overRest$1(func, start, transform) {
                start = nativeMax(
                  start === void 0 ? func.length - 1 : start,
                  0
                );
                return function () {
                  var args = arguments,
                    index = -1,
                    length = nativeMax(args.length - start, 0),
                    array = Array(length);
                  while (++index < length) {
                    array[index] = args[start + index];
                  }
                  index = -1;
                  var otherArgs = Array(start + 1);
                  while (++index < start) {
                    otherArgs[index] = args[index];
                  }
                  otherArgs[start] = transform(array);
                  return apply(func, this, otherArgs);
                };
              }
              function identity(value) {
                return value;
              }
              function rest(func, start) {
                return overRest$1(func, start, identity);
              }
              var initialParams = function (fn) {
                return rest(function (args) {
                  var callback = args.pop();
                  fn.call(this, args, callback);
                });
              };
              function applyEach$1(eachfn) {
                return rest(function (fns, args) {
                  var go = initialParams(function (args2, callback) {
                    var that = this;
                    return eachfn(
                      fns,
                      function (fn, cb) {
                        fn.apply(that, args2.concat(cb));
                      },
                      callback
                    );
                  });
                  if (args.length) {
                    return go.apply(this, args);
                  } else {
                    return go;
                  }
                });
              }
              var freeGlobal =
                typeof global2 == "object" &&
                global2 &&
                global2.Object === Object &&
                global2;
              var freeSelf =
                typeof self == "object" &&
                self &&
                self.Object === Object &&
                self;
              var root = freeGlobal || freeSelf || Function("return this")();
              var Symbol$1 = root.Symbol;
              var objectProto = Object.prototype;
              var hasOwnProperty2 = objectProto.hasOwnProperty;
              var nativeObjectToString = objectProto.toString;
              var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
              function getRawTag(value) {
                var isOwn = hasOwnProperty2.call(value, symToStringTag$1),
                  tag = value[symToStringTag$1];
                try {
                  value[symToStringTag$1] = void 0;
                  var unmasked = true;
                } catch (e) {}
                var result = nativeObjectToString.call(value);
                if (unmasked) {
                  if (isOwn) {
                    value[symToStringTag$1] = tag;
                  } else {
                    delete value[symToStringTag$1];
                  }
                }
                return result;
              }
              var objectProto$1 = Object.prototype;
              var nativeObjectToString$1 = objectProto$1.toString;
              function objectToString(value) {
                return nativeObjectToString$1.call(value);
              }
              var nullTag = "[object Null]";
              var undefinedTag = "[object Undefined]";
              var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
              function baseGetTag(value) {
                if (value == null) {
                  return value === void 0 ? undefinedTag : nullTag;
                }
                return symToStringTag && symToStringTag in Object(value)
                  ? getRawTag(value)
                  : objectToString(value);
              }
              function isObject(value) {
                var type = typeof value;
                return (
                  value != null && (type == "object" || type == "function")
                );
              }
              var asyncTag = "[object AsyncFunction]";
              var funcTag = "[object Function]";
              var genTag = "[object GeneratorFunction]";
              var proxyTag = "[object Proxy]";
              function isFunction(value) {
                if (!isObject(value)) {
                  return false;
                }
                var tag = baseGetTag(value);
                return (
                  tag == funcTag ||
                  tag == genTag ||
                  tag == asyncTag ||
                  tag == proxyTag
                );
              }
              var MAX_SAFE_INTEGER = 9007199254740991;
              function isLength(value) {
                return (
                  typeof value == "number" &&
                  value > -1 &&
                  value % 1 == 0 &&
                  value <= MAX_SAFE_INTEGER
                );
              }
              function isArrayLike(value) {
                return (
                  value != null && isLength(value.length) && !isFunction(value)
                );
              }
              var breakLoop = {};
              function noop() {}
              function once(fn) {
                return function () {
                  if (fn === null) {
                    return;
                  }
                  var callFn = fn;
                  fn = null;
                  callFn.apply(this, arguments);
                };
              }
              var iteratorSymbol =
                typeof Symbol === "function" && Symbol.iterator;
              var getIterator = function (coll) {
                return (
                  iteratorSymbol &&
                  coll[iteratorSymbol] &&
                  coll[iteratorSymbol]()
                );
              };
              function baseTimes(n, iteratee) {
                var index = -1,
                  result = Array(n);
                while (++index < n) {
                  result[index] = iteratee(index);
                }
                return result;
              }
              function isObjectLike(value) {
                return value != null && typeof value == "object";
              }
              var argsTag = "[object Arguments]";
              function baseIsArguments(value) {
                return isObjectLike(value) && baseGetTag(value) == argsTag;
              }
              var objectProto$3 = Object.prototype;
              var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
              var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;
              var isArguments = baseIsArguments(
                /* @__PURE__ */ (function () {
                  return arguments;
                })()
              )
                ? baseIsArguments
                : function (value) {
                    return (
                      isObjectLike(value) &&
                      hasOwnProperty$2.call(value, "callee") &&
                      !propertyIsEnumerable.call(value, "callee")
                    );
                  };
              var isArray = Array.isArray;
              function stubFalse() {
                return false;
              }
              var freeExports =
                typeof exports3 == "object" &&
                exports3 &&
                !exports3.nodeType &&
                exports3;
              var freeModule =
                freeExports &&
                typeof module4 == "object" &&
                module4 &&
                !module4.nodeType &&
                module4;
              var moduleExports =
                freeModule && freeModule.exports === freeExports;
              var Buffer$1 = moduleExports ? root.Buffer : void 0;
              var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
              var isBuffer = nativeIsBuffer || stubFalse;
              var MAX_SAFE_INTEGER$1 = 9007199254740991;
              var reIsUint = /^(?:0|[1-9]\d*)$/;
              function isIndex(value, length) {
                length = length == null ? MAX_SAFE_INTEGER$1 : length;
                return (
                  !!length &&
                  (typeof value == "number" || reIsUint.test(value)) &&
                  value > -1 &&
                  value % 1 == 0 &&
                  value < length
                );
              }
              var argsTag$1 = "[object Arguments]";
              var arrayTag = "[object Array]";
              var boolTag = "[object Boolean]";
              var dateTag = "[object Date]";
              var errorTag = "[object Error]";
              var funcTag$1 = "[object Function]";
              var mapTag = "[object Map]";
              var numberTag = "[object Number]";
              var objectTag = "[object Object]";
              var regexpTag = "[object RegExp]";
              var setTag = "[object Set]";
              var stringTag = "[object String]";
              var weakMapTag = "[object WeakMap]";
              var arrayBufferTag = "[object ArrayBuffer]";
              var dataViewTag = "[object DataView]";
              var float32Tag = "[object Float32Array]";
              var float64Tag = "[object Float64Array]";
              var int8Tag = "[object Int8Array]";
              var int16Tag = "[object Int16Array]";
              var int32Tag = "[object Int32Array]";
              var uint8Tag = "[object Uint8Array]";
              var uint8ClampedTag = "[object Uint8ClampedArray]";
              var uint16Tag = "[object Uint16Array]";
              var uint32Tag = "[object Uint32Array]";
              var typedArrayTags = {};
              typedArrayTags[float32Tag] =
                typedArrayTags[float64Tag] =
                typedArrayTags[int8Tag] =
                typedArrayTags[int16Tag] =
                typedArrayTags[int32Tag] =
                typedArrayTags[uint8Tag] =
                typedArrayTags[uint8ClampedTag] =
                typedArrayTags[uint16Tag] =
                typedArrayTags[uint32Tag] =
                  true;
              typedArrayTags[argsTag$1] =
                typedArrayTags[arrayTag] =
                typedArrayTags[arrayBufferTag] =
                typedArrayTags[boolTag] =
                typedArrayTags[dataViewTag] =
                typedArrayTags[dateTag] =
                typedArrayTags[errorTag] =
                typedArrayTags[funcTag$1] =
                typedArrayTags[mapTag] =
                typedArrayTags[numberTag] =
                typedArrayTags[objectTag] =
                typedArrayTags[regexpTag] =
                typedArrayTags[setTag] =
                typedArrayTags[stringTag] =
                typedArrayTags[weakMapTag] =
                  false;
              function baseIsTypedArray(value) {
                return (
                  isObjectLike(value) &&
                  isLength(value.length) &&
                  !!typedArrayTags[baseGetTag(value)]
                );
              }
              function baseUnary(func) {
                return function (value) {
                  return func(value);
                };
              }
              var freeExports$1 =
                typeof exports3 == "object" &&
                exports3 &&
                !exports3.nodeType &&
                exports3;
              var freeModule$1 =
                freeExports$1 &&
                typeof module4 == "object" &&
                module4 &&
                !module4.nodeType &&
                module4;
              var moduleExports$1 =
                freeModule$1 && freeModule$1.exports === freeExports$1;
              var freeProcess = moduleExports$1 && freeGlobal.process;
              var nodeUtil = (function () {
                try {
                  return (
                    freeProcess &&
                    freeProcess.binding &&
                    freeProcess.binding("util")
                  );
                } catch (e) {}
              })();
              var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
              var isTypedArray = nodeIsTypedArray
                ? baseUnary(nodeIsTypedArray)
                : baseIsTypedArray;
              var objectProto$2 = Object.prototype;
              var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
              function arrayLikeKeys(value, inherited) {
                var isArr = isArray(value),
                  isArg = !isArr && isArguments(value),
                  isBuff = !isArr && !isArg && isBuffer(value),
                  isType = !isArr && !isArg && !isBuff && isTypedArray(value),
                  skipIndexes = isArr || isArg || isBuff || isType,
                  result = skipIndexes ? baseTimes(value.length, String) : [],
                  length = result.length;
                for (var key in value) {
                  if (
                    (inherited || hasOwnProperty$1.call(value, key)) &&
                    !(
                      skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
                      (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
                        (isBuff && (key == "offset" || key == "parent")) || // PhantomJS 2 has enumerable non-index properties on typed arrays.
                        (isType &&
                          (key == "buffer" ||
                            key == "byteLength" ||
                            key == "byteOffset")) || // Skip index properties.
                        isIndex(key, length))
                    )
                  ) {
                    result.push(key);
                  }
                }
                return result;
              }
              var objectProto$5 = Object.prototype;
              function isPrototype(value) {
                var Ctor = value && value.constructor,
                  proto =
                    (typeof Ctor == "function" && Ctor.prototype) ||
                    objectProto$5;
                return value === proto;
              }
              function overArg(func, transform) {
                return function (arg) {
                  return func(transform(arg));
                };
              }
              var nativeKeys = overArg(Object.keys, Object);
              var objectProto$4 = Object.prototype;
              var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
              function baseKeys(object) {
                if (!isPrototype(object)) {
                  return nativeKeys(object);
                }
                var result = [];
                for (var key in Object(object)) {
                  if (
                    hasOwnProperty$3.call(object, key) &&
                    key != "constructor"
                  ) {
                    result.push(key);
                  }
                }
                return result;
              }
              function keys(object) {
                return isArrayLike(object)
                  ? arrayLikeKeys(object)
                  : baseKeys(object);
              }
              function createArrayIterator(coll) {
                var i2 = -1;
                var len = coll.length;
                return function next() {
                  return ++i2 < len ? { value: coll[i2], key: i2 } : null;
                };
              }
              function createES2015Iterator(iterator2) {
                var i2 = -1;
                return function next() {
                  var item = iterator2.next();
                  if (item.done) {
                    return null;
                  }
                  i2++;
                  return { value: item.value, key: i2 };
                };
              }
              function createObjectIterator(obj) {
                var okeys = keys(obj);
                var i2 = -1;
                var len = okeys.length;
                return function next() {
                  var key = okeys[++i2];
                  return i2 < len ? { value: obj[key], key } : null;
                };
              }
              function iterator(coll) {
                if (isArrayLike(coll)) {
                  return createArrayIterator(coll);
                }
                var iterator2 = getIterator(coll);
                return iterator2
                  ? createES2015Iterator(iterator2)
                  : createObjectIterator(coll);
              }
              function onlyOnce(fn) {
                return function () {
                  if (fn === null) {
                    throw new Error("Callback was already called.");
                  }
                  var callFn = fn;
                  fn = null;
                  callFn.apply(this, arguments);
                };
              }
              function _eachOfLimit(limit) {
                return function (obj, iteratee, callback) {
                  callback = once(callback || noop);
                  if (limit <= 0 || !obj) {
                    return callback(null);
                  }
                  var nextElem = iterator(obj);
                  var done = false;
                  var running = 0;
                  function iterateeCallback(err, value) {
                    running -= 1;
                    if (err) {
                      done = true;
                      callback(err);
                    } else if (value === breakLoop || (done && running <= 0)) {
                      done = true;
                      return callback(null);
                    } else {
                      replenish();
                    }
                  }
                  function replenish() {
                    while (running < limit && !done) {
                      var elem = nextElem();
                      if (elem === null) {
                        done = true;
                        if (running <= 0) {
                          callback(null);
                        }
                        return;
                      }
                      running += 1;
                      iteratee(
                        elem.value,
                        elem.key,
                        onlyOnce(iterateeCallback)
                      );
                    }
                  }
                  replenish();
                };
              }
              function eachOfLimit(coll, limit, iteratee, callback) {
                _eachOfLimit(limit)(coll, iteratee, callback);
              }
              function doLimit(fn, limit) {
                return function (iterable, iteratee, callback) {
                  return fn(iterable, limit, iteratee, callback);
                };
              }
              function eachOfArrayLike(coll, iteratee, callback) {
                callback = once(callback || noop);
                var index = 0,
                  completed = 0,
                  length = coll.length;
                if (length === 0) {
                  callback(null);
                }
                function iteratorCallback(err, value) {
                  if (err) {
                    callback(err);
                  } else if (++completed === length || value === breakLoop) {
                    callback(null);
                  }
                }
                for (; index < length; index++) {
                  iteratee(coll[index], index, onlyOnce(iteratorCallback));
                }
              }
              var eachOfGeneric = doLimit(eachOfLimit, Infinity);
              var eachOf = function (coll, iteratee, callback) {
                var eachOfImplementation = isArrayLike(coll)
                  ? eachOfArrayLike
                  : eachOfGeneric;
                eachOfImplementation(coll, iteratee, callback);
              };
              function doParallel(fn) {
                return function (obj, iteratee, callback) {
                  return fn(eachOf, obj, iteratee, callback);
                };
              }
              function _asyncMap(eachfn, arr, iteratee, callback) {
                callback = callback || noop;
                arr = arr || [];
                var results = [];
                var counter = 0;
                eachfn(
                  arr,
                  function (value, _, callback2) {
                    var index = counter++;
                    iteratee(value, function (err, v) {
                      results[index] = v;
                      callback2(err);
                    });
                  },
                  function (err) {
                    callback(err, results);
                  }
                );
              }
              var map = doParallel(_asyncMap);
              applyEach$1(map);
              function doParallelLimit(fn) {
                return function (obj, limit, iteratee, callback) {
                  return fn(_eachOfLimit(limit), obj, iteratee, callback);
                };
              }
              var mapLimit = doParallelLimit(_asyncMap);
              var mapSeries = doLimit(mapLimit, 1);
              applyEach$1(mapSeries);
              rest(function (fn, args) {
                return rest(function (callArgs) {
                  return fn.apply(null, args.concat(callArgs));
                });
              });
              function arrayEach(array, iteratee) {
                var index = -1,
                  length = array == null ? 0 : array.length;
                while (++index < length) {
                  if (iteratee(array[index], index, array) === false) {
                    break;
                  }
                }
                return array;
              }
              var hasSetImmediate =
                typeof setImmediate === "function" && setImmediate;
              var hasNextTick =
                typeof process2 === "object" &&
                typeof process2.nextTick === "function";
              function fallback(fn) {
                setTimeout(fn, 0);
              }
              function wrap(defer) {
                return rest(function (fn, args) {
                  defer(function () {
                    fn.apply(null, args);
                  });
                });
              }
              var _defer;
              if (hasSetImmediate) {
                _defer = setImmediate;
              } else if (hasNextTick) {
                _defer = process2.nextTick;
              } else {
                _defer = fallback;
              }
              wrap(_defer);
              var eachOfSeries = doLimit(eachOfLimit, 1);
              function reduce(coll, memo, iteratee, callback) {
                callback = once(callback || noop);
                eachOfSeries(
                  coll,
                  function (x, i2, callback2) {
                    iteratee(memo, x, function (err, v) {
                      memo = v;
                      callback2(err);
                    });
                  },
                  function (err) {
                    callback(err, memo);
                  }
                );
              }
              var seq = rest(function seq2(functions) {
                return rest(function (args) {
                  var that = this;
                  var cb = args[args.length - 1];
                  if (typeof cb == "function") {
                    args.pop();
                  } else {
                    cb = noop;
                  }
                  reduce(
                    functions,
                    args,
                    function (newargs, fn, cb2) {
                      fn.apply(
                        that,
                        newargs.concat(
                          rest(function (err, nextargs) {
                            cb2(err, nextargs);
                          })
                        )
                      );
                    },
                    function (err, results) {
                      cb.apply(that, [err].concat(results));
                    }
                  );
                });
              });
              rest(function (args) {
                return seq.apply(null, args.reverse());
              });
              rest(function (values) {
                var args = [null].concat(values);
                return initialParams(function (ignoredArgs, callback) {
                  return callback.apply(this, args);
                });
              });
              function consoleFunc(name2) {
                return rest(function (fn, args) {
                  fn.apply(
                    null,
                    args.concat(
                      rest(function (err, args2) {
                        if (typeof console === "object") {
                          if (err) {
                            if (console.error) {
                              console.error(err);
                            }
                          } else if (console[name2]) {
                            arrayEach(args2, function (x) {
                              console[name2](x);
                            });
                          }
                        }
                      })
                    )
                  );
                });
              }
              consoleFunc("dir");
              function _withoutIndex(iteratee) {
                return function (value, index, callback) {
                  return iteratee(value, callback);
                };
              }
              function eachLimit(coll, iteratee, callback) {
                eachOf(coll, _withoutIndex(iteratee), callback);
              }
              consoleFunc("log");
              var _defer$1;
              if (hasNextTick) {
                _defer$1 = process2.nextTick;
              } else if (hasSetImmediate) {
                _defer$1 = setImmediate;
              } else {
                _defer$1 = fallback;
              }
              wrap(_defer$1);
              var errorCodeLookup;
              function constructErrorCodeLookup() {
                if (errorCodeLookup) {
                  return;
                }
                errorCodeLookup = {};
                errorCodeLookup[Dropbox.ApiError.NETWORK_ERROR] = ErrorCode.EIO;
                errorCodeLookup[Dropbox.ApiError.INVALID_PARAM] =
                  ErrorCode.EINVAL;
                errorCodeLookup[Dropbox.ApiError.INVALID_TOKEN] =
                  ErrorCode.EPERM;
                errorCodeLookup[Dropbox.ApiError.OAUTH_ERROR] = ErrorCode.EPERM;
                errorCodeLookup[Dropbox.ApiError.NOT_FOUND] = ErrorCode.ENOENT;
                errorCodeLookup[Dropbox.ApiError.INVALID_METHOD] =
                  ErrorCode.EINVAL;
                errorCodeLookup[Dropbox.ApiError.NOT_ACCEPTABLE] =
                  ErrorCode.EINVAL;
                errorCodeLookup[Dropbox.ApiError.CONFLICT] = ErrorCode.EINVAL;
                errorCodeLookup[Dropbox.ApiError.RATE_LIMITED] =
                  ErrorCode.EBUSY;
                errorCodeLookup[Dropbox.ApiError.SERVER_ERROR] =
                  ErrorCode.EBUSY;
                errorCodeLookup[Dropbox.ApiError.OVER_QUOTA] = ErrorCode.ENOSPC;
              }
              function isFileInfo(cache) {
                return cache && cache.stat.isFile;
              }
              function isDirInfo(cache) {
                return cache && cache.stat.isFolder;
              }
              function isArrayBuffer(ab) {
                return (
                  ab === null ||
                  ab === void 0 ||
                  (typeof ab === "object" &&
                    typeof ab["byteLength"] === "number")
                );
              }
              var CachedDropboxClient = function CachedDropboxClient2(client) {
                this._cache = {};
                this._client = client;
              };
              CachedDropboxClient.prototype.readdir = function readdir(p, cb) {
                var this$1$1 = this;
                var cacheInfo = this.getCachedDirInfo(p);
                this._wrap(
                  function (interceptCb) {
                    if (cacheInfo !== null && cacheInfo.contents) {
                      this$1$1._client.readdir(
                        p,
                        {
                          contentHash: cacheInfo.stat.contentHash,
                        },
                        interceptCb
                      );
                    } else {
                      this$1$1._client.readdir(p, interceptCb);
                    }
                  },
                  function (err, filenames, stat, folderEntries) {
                    if (err) {
                      if (
                        err.status === Dropbox.ApiError.NO_CONTENT &&
                        cacheInfo !== null
                      ) {
                        cb(null, cacheInfo.contents.slice(0));
                      } else {
                        cb(err);
                      }
                    } else {
                      this$1$1.updateCachedDirInfo(p, stat, filenames.slice(0));
                      folderEntries.forEach(function (entry) {
                        this$1$1.updateCachedInfo(
                          path2.join(p, entry.name),
                          entry
                        );
                      });
                      cb(null, filenames);
                    }
                  }
                );
              };
              CachedDropboxClient.prototype.remove = function remove(p, cb) {
                var this$1$1 = this;
                this._wrap(
                  function (interceptCb) {
                    this$1$1._client.remove(p, interceptCb);
                  },
                  function (err, stat) {
                    if (!err) {
                      this$1$1.updateCachedInfo(p, stat);
                    }
                    cb(err);
                  }
                );
              };
              CachedDropboxClient.prototype.move = function move(
                src,
                dest,
                cb
              ) {
                var this$1$1 = this;
                this._wrap(
                  function (interceptCb) {
                    this$1$1._client.move(src, dest, interceptCb);
                  },
                  function (err, stat) {
                    if (!err) {
                      this$1$1.deleteCachedInfo(src);
                      this$1$1.updateCachedInfo(dest, stat);
                    }
                    cb(err);
                  }
                );
              };
              CachedDropboxClient.prototype.stat = function stat(p, cb) {
                var this$1$1 = this;
                this._wrap(
                  function (interceptCb) {
                    this$1$1._client.stat(p, interceptCb);
                  },
                  function (err, stat2) {
                    if (!err) {
                      this$1$1.updateCachedInfo(p, stat2);
                    }
                    cb(err, stat2);
                  }
                );
              };
              CachedDropboxClient.prototype.readFile = function readFile(
                p,
                cb
              ) {
                var this$1$1 = this;
                var cacheInfo = this.getCachedFileInfo(p);
                if (cacheInfo !== null && cacheInfo.contents !== null) {
                  this.stat(p, function (error, stat) {
                    if (error) {
                      cb(error);
                    } else if (
                      stat.contentHash === cacheInfo.stat.contentHash
                    ) {
                      cb(error, cacheInfo.contents.slice(0), cacheInfo.stat);
                    } else {
                      this$1$1.readFile(p, cb);
                    }
                  });
                } else {
                  this._wrap(
                    function (interceptCb) {
                      this$1$1._client.readFile(
                        p,
                        { arrayBuffer: true },
                        interceptCb
                      );
                    },
                    function (err, contents, stat) {
                      if (!err) {
                        this$1$1.updateCachedInfo(p, stat, contents.slice(0));
                      }
                      cb(err, contents, stat);
                    }
                  );
                }
              };
              CachedDropboxClient.prototype.writeFile = function writeFile(
                p,
                contents,
                cb
              ) {
                var this$1$1 = this;
                this._wrap(
                  function (interceptCb) {
                    this$1$1._client.writeFile(p, contents, interceptCb);
                  },
                  function (err, stat) {
                    if (!err) {
                      this$1$1.updateCachedInfo(p, stat, contents.slice(0));
                    }
                    cb(err, stat);
                  }
                );
              };
              CachedDropboxClient.prototype.mkdir = function mkdir(p, cb) {
                var this$1$1 = this;
                this._wrap(
                  function (interceptCb) {
                    this$1$1._client.mkdir(p, interceptCb);
                  },
                  function (err, stat) {
                    if (!err) {
                      this$1$1.updateCachedInfo(p, stat, []);
                    }
                    cb(err);
                  }
                );
              };
              CachedDropboxClient.prototype._wrap = function _wrap(
                performOp,
                cb
              ) {
                var numRun = 0;
                var interceptCb = function (error) {
                  var timeoutDuration = 2;
                  if (error && 3 > ++numRun) {
                    switch (error.status) {
                      case Dropbox.ApiError.SERVER_ERROR:
                      case Dropbox.ApiError.NETWORK_ERROR:
                      case Dropbox.ApiError.RATE_LIMITED:
                        setTimeout(function () {
                          performOp(interceptCb);
                        }, timeoutDuration * 1e3);
                        break;
                      default:
                        cb.apply(null, arguments);
                        break;
                    }
                  } else {
                    cb.apply(null, arguments);
                  }
                };
                performOp(interceptCb);
              };
              CachedDropboxClient.prototype.getCachedInfo =
                function getCachedInfo(p) {
                  return this._cache[p.toLowerCase()];
                };
              CachedDropboxClient.prototype.putCachedInfo =
                function putCachedInfo(p, cache) {
                  this._cache[p.toLowerCase()] = cache;
                };
              CachedDropboxClient.prototype.deleteCachedInfo =
                function deleteCachedInfo(p) {
                  delete this._cache[p.toLowerCase()];
                };
              CachedDropboxClient.prototype.getCachedDirInfo =
                function getCachedDirInfo(p) {
                  var info = this.getCachedInfo(p);
                  if (isDirInfo(info)) {
                    return info;
                  } else {
                    return null;
                  }
                };
              CachedDropboxClient.prototype.getCachedFileInfo =
                function getCachedFileInfo(p) {
                  var info = this.getCachedInfo(p);
                  if (isFileInfo(info)) {
                    return info;
                  } else {
                    return null;
                  }
                };
              CachedDropboxClient.prototype.updateCachedDirInfo =
                function updateCachedDirInfo(p, stat, contents) {
                  if (contents === void 0) contents = null;
                  var cachedInfo = this.getCachedInfo(p);
                  if (
                    stat.contentHash !== null &&
                    (cachedInfo === void 0 ||
                      cachedInfo.stat.contentHash !== stat.contentHash)
                  ) {
                    this.putCachedInfo(p, {
                      stat,
                      contents,
                    });
                  }
                };
              CachedDropboxClient.prototype.updateCachedFileInfo =
                function updateCachedFileInfo(p, stat, contents) {
                  if (contents === void 0) contents = null;
                  var cachedInfo = this.getCachedInfo(p);
                  if (
                    stat.versionTag !== null &&
                    (cachedInfo === void 0 ||
                      cachedInfo.stat.versionTag !== stat.versionTag)
                  ) {
                    this.putCachedInfo(p, {
                      stat,
                      contents,
                    });
                  }
                };
              CachedDropboxClient.prototype.updateCachedInfo =
                function updateCachedInfo(p, stat, contents) {
                  if (contents === void 0) contents = null;
                  if (stat.isFile && isArrayBuffer(contents)) {
                    this.updateCachedFileInfo(p, stat, contents);
                  } else if (stat.isFolder && Array.isArray(contents)) {
                    this.updateCachedDirInfo(p, stat, contents);
                  }
                };
              var DropboxFile = (function (PreloadFile$$1) {
                function DropboxFile2(_fs, _path, _flag, _stat, contents) {
                  PreloadFile$$1.call(this, _fs, _path, _flag, _stat, contents);
                }
                if (PreloadFile$$1) DropboxFile2.__proto__ = PreloadFile$$1;
                DropboxFile2.prototype = Object.create(
                  PreloadFile$$1 && PreloadFile$$1.prototype
                );
                DropboxFile2.prototype.constructor = DropboxFile2;
                DropboxFile2.prototype.sync = function sync(cb) {
                  var this$1$1 = this;
                  if (this.isDirty()) {
                    var buffer$$1 = this.getBuffer(),
                      arrayBuffer = buffer2ArrayBuffer(buffer$$1);
                    this._fs._writeFileStrict(
                      this.getPath(),
                      arrayBuffer,
                      function (e) {
                        if (!e) {
                          this$1$1.resetDirty();
                        }
                        cb(e);
                      }
                    );
                  } else {
                    cb();
                  }
                };
                DropboxFile2.prototype.close = function close(cb) {
                  this.sync(cb);
                };
                return DropboxFile2;
              })(PreloadFile);
              var DropboxFileSystem = (function (BaseFileSystem$$1) {
                function DropboxFileSystem2(client, deprecateMsg) {
                  if (deprecateMsg === void 0) deprecateMsg = true;
                  BaseFileSystem$$1.call(this);
                  this._client = new CachedDropboxClient(client);
                  deprecationMessage(deprecateMsg, DropboxFileSystem2.Name, {
                    client: "authenticated dropbox client instance",
                  });
                  constructErrorCodeLookup();
                }
                if (BaseFileSystem$$1)
                  DropboxFileSystem2.__proto__ = BaseFileSystem$$1;
                DropboxFileSystem2.prototype = Object.create(
                  BaseFileSystem$$1 && BaseFileSystem$$1.prototype
                );
                DropboxFileSystem2.prototype.constructor = DropboxFileSystem2;
                DropboxFileSystem2.Create = function Create(opts, cb) {
                  cb(null, new DropboxFileSystem2(opts.client, false));
                };
                DropboxFileSystem2.isAvailable = function isAvailable() {
                  return typeof Dropbox !== "undefined";
                };
                DropboxFileSystem2.prototype.getName = function getName() {
                  return DropboxFileSystem2.Name;
                };
                DropboxFileSystem2.prototype.isReadOnly =
                  function isReadOnly() {
                    return false;
                  };
                DropboxFileSystem2.prototype.supportsSymlinks =
                  function supportsSymlinks() {
                    return false;
                  };
                DropboxFileSystem2.prototype.supportsProps =
                  function supportsProps() {
                    return false;
                  };
                DropboxFileSystem2.prototype.supportsSynch =
                  function supportsSynch() {
                    return false;
                  };
                DropboxFileSystem2.prototype.empty = function empty(mainCb) {
                  var this$1$1 = this;
                  this._client.readdir("/", function (error, files) {
                    if (error) {
                      mainCb(this$1$1.convert(error, "/"));
                    } else {
                      var deleteFile = function (file, cb) {
                        var p = path2.join("/", file);
                        this$1$1._client.remove(p, function (err) {
                          cb(err ? this$1$1.convert(err, p) : null);
                        });
                      };
                      var finished = function (err) {
                        if (err) {
                          mainCb(err);
                        } else {
                          mainCb();
                        }
                      };
                      eachLimit(files, deleteFile, finished);
                    }
                  });
                };
                DropboxFileSystem2.prototype.rename = function rename(
                  oldPath,
                  newPath,
                  cb
                ) {
                  var this$1$1 = this;
                  this._client.move(oldPath, newPath, function (error) {
                    if (error) {
                      this$1$1._client.stat(newPath, function (error2, stat) {
                        if (error2 || stat.isFolder) {
                          var missingPath =
                            error.response.error.indexOf(oldPath) > -1
                              ? oldPath
                              : newPath;
                          cb(this$1$1.convert(error, missingPath));
                        } else {
                          this$1$1._client.remove(newPath, function (error22) {
                            if (error22) {
                              cb(this$1$1.convert(error22, newPath));
                            } else {
                              this$1$1.rename(oldPath, newPath, cb);
                            }
                          });
                        }
                      });
                    } else {
                      cb();
                    }
                  });
                };
                DropboxFileSystem2.prototype.stat = function stat(
                  path$$1,
                  isLstat,
                  cb
                ) {
                  var this$1$1 = this;
                  this._client.stat(path$$1, function (error, stat2) {
                    if (error) {
                      cb(this$1$1.convert(error, path$$1));
                    } else if (stat2 && stat2.isRemoved) {
                      cb(ApiError.FileError(ErrorCode.ENOENT, path$$1));
                    } else {
                      var stats = new Stats(
                        this$1$1._statType(stat2),
                        stat2.size
                      );
                      return cb(null, stats);
                    }
                  });
                };
                DropboxFileSystem2.prototype.open = function open(
                  path$$1,
                  flags,
                  mode,
                  cb
                ) {
                  var this$1$1 = this;
                  this._client.readFile(
                    path$$1,
                    function (error, content, dbStat) {
                      if (error) {
                        if (flags.isReadable()) {
                          cb(this$1$1.convert(error, path$$1));
                        } else {
                          switch (error.status) {
                            case Dropbox.ApiError.NOT_FOUND:
                              var ab = new ArrayBuffer(0);
                              return this$1$1._writeFileStrict(
                                path$$1,
                                ab,
                                function (error2, stat) {
                                  if (error2) {
                                    cb(error2);
                                  } else {
                                    var file2 = this$1$1._makeFile(
                                      path$$1,
                                      flags,
                                      stat,
                                      arrayBuffer2Buffer(ab)
                                    );
                                    cb(null, file2);
                                  }
                                }
                              );
                            default:
                              return cb(this$1$1.convert(error, path$$1));
                          }
                        }
                      } else {
                        var buffer$$1;
                        if (content === null) {
                          buffer$$1 = emptyBuffer();
                        } else {
                          buffer$$1 = arrayBuffer2Buffer(content);
                        }
                        var file = this$1$1._makeFile(
                          path$$1,
                          flags,
                          dbStat,
                          buffer$$1
                        );
                        return cb(null, file);
                      }
                    }
                  );
                };
                DropboxFileSystem2.prototype._writeFileStrict =
                  function _writeFileStrict(p, data, cb) {
                    var this$1$1 = this;
                    var parent = path2.dirname(p);
                    this.stat(parent, false, function (error, stat) {
                      if (error) {
                        cb(ApiError.FileError(ErrorCode.ENOENT, parent));
                      } else {
                        this$1$1._client.writeFile(
                          p,
                          data,
                          function (error2, stat2) {
                            if (error2) {
                              cb(this$1$1.convert(error2, p));
                            } else {
                              cb(null, stat2);
                            }
                          }
                        );
                      }
                    });
                  };
                DropboxFileSystem2.prototype._statType = function _statType(
                  stat
                ) {
                  return stat.isFile ? FileType.FILE : FileType.DIRECTORY;
                };
                DropboxFileSystem2.prototype._makeFile = function _makeFile(
                  path$$1,
                  flag,
                  stat,
                  buffer$$1
                ) {
                  var type = this._statType(stat);
                  var stats = new Stats(type, stat.size);
                  return new DropboxFile(this, path$$1, flag, stats, buffer$$1);
                };
                DropboxFileSystem2.prototype._remove = function _remove(
                  path$$1,
                  cb,
                  isFile
                ) {
                  var this$1$1 = this;
                  this._client.stat(path$$1, function (error, stat) {
                    if (error) {
                      cb(this$1$1.convert(error, path$$1));
                    } else {
                      if (stat.isFile && !isFile) {
                        cb(ApiError.FileError(ErrorCode.ENOTDIR, path$$1));
                      } else if (!stat.isFile && isFile) {
                        cb(ApiError.FileError(ErrorCode.EISDIR, path$$1));
                      } else {
                        this$1$1._client.remove(path$$1, function (error2) {
                          if (error2) {
                            cb(this$1$1.convert(error2, path$$1));
                          } else {
                            cb(null);
                          }
                        });
                      }
                    }
                  });
                };
                DropboxFileSystem2.prototype.unlink = function unlink(
                  path$$1,
                  cb
                ) {
                  this._remove(path$$1, cb, true);
                };
                DropboxFileSystem2.prototype.rmdir = function rmdir(
                  path$$1,
                  cb
                ) {
                  this._remove(path$$1, cb, false);
                };
                DropboxFileSystem2.prototype.mkdir = function mkdir(
                  p,
                  mode,
                  cb
                ) {
                  var this$1$1 = this;
                  var parent = path2.dirname(p);
                  this._client.stat(parent, function (error, stat) {
                    if (error) {
                      cb(this$1$1.convert(error, parent));
                    } else {
                      this$1$1._client.mkdir(p, function (error2) {
                        if (error2) {
                          cb(ApiError.FileError(ErrorCode.EEXIST, p));
                        } else {
                          cb(null);
                        }
                      });
                    }
                  });
                };
                DropboxFileSystem2.prototype.readdir = function readdir(
                  path$$1,
                  cb
                ) {
                  var this$1$1 = this;
                  this._client.readdir(path$$1, function (error, files) {
                    if (error) {
                      return cb(this$1$1.convert(error));
                    } else {
                      return cb(null, files);
                    }
                  });
                };
                DropboxFileSystem2.prototype.convert = function convert(
                  err,
                  path$$1
                ) {
                  if (path$$1 === void 0) path$$1 = null;
                  var errorCode = errorCodeLookup[err.status];
                  if (errorCode === void 0) {
                    errorCode = ErrorCode.EIO;
                  }
                  if (!path$$1) {
                    return new ApiError(errorCode);
                  } else {
                    return ApiError.FileError(errorCode, path$$1);
                  }
                };
                return DropboxFileSystem2;
              })(BaseFileSystem);
              DropboxFileSystem.Name = "Dropbox";
              DropboxFileSystem.Options = {
                client: {
                  type: "object",
                  description:
                    "An *authenticated* Dropbox client. Must be from the 0.10 JS SDK.",
                  validator: function (opt, cb) {
                    if (opt.isAuthenticated && opt.isAuthenticated()) {
                      cb();
                    } else {
                      cb(
                        new ApiError(
                          ErrorCode.EINVAL,
                          "'client' option must be an authenticated Dropbox client from the v0.10 JS SDK."
                        )
                      );
                    }
                  },
                },
              };
              function convertError(e, path$$1) {
                if (path$$1 === void 0) path$$1 = "";
                var errno = e.errno;
                var parent = e.node;
                var paths = [];
                while (parent) {
                  paths.unshift(parent.name);
                  if (parent === parent.parent) {
                    break;
                  }
                  parent = parent.parent;
                }
                return new ApiError(
                  errno,
                  ErrorStrings[errno],
                  paths.length > 0 ? "/" + paths.join("/") : path$$1
                );
              }
              var EmscriptenFile = (function (BaseFile$$1) {
                function EmscriptenFile2(_fs, _FS, _path, _stream) {
                  BaseFile$$1.call(this);
                  this._fs = _fs;
                  this._FS = _FS;
                  this._path = _path;
                  this._stream = _stream;
                }
                if (BaseFile$$1) EmscriptenFile2.__proto__ = BaseFile$$1;
                EmscriptenFile2.prototype = Object.create(
                  BaseFile$$1 && BaseFile$$1.prototype
                );
                EmscriptenFile2.prototype.constructor = EmscriptenFile2;
                EmscriptenFile2.prototype.getPos = function getPos() {
                  return void 0;
                };
                EmscriptenFile2.prototype.close = function close(cb) {
                  var err = null;
                  try {
                    this.closeSync();
                  } catch (e) {
                    err = e;
                  } finally {
                    cb(err);
                  }
                };
                EmscriptenFile2.prototype.closeSync = function closeSync() {
                  try {
                    this._FS.close(this._stream);
                  } catch (e) {
                    throw convertError(e, this._path);
                  }
                };
                EmscriptenFile2.prototype.stat = function stat(cb) {
                  try {
                    cb(null, this.statSync());
                  } catch (e) {
                    cb(e);
                  }
                };
                EmscriptenFile2.prototype.statSync = function statSync() {
                  try {
                    return this._fs.statSync(this._path, false);
                  } catch (e) {
                    throw convertError(e, this._path);
                  }
                };
                EmscriptenFile2.prototype.truncate = function truncate(
                  len,
                  cb
                ) {
                  var err = null;
                  try {
                    this.truncateSync(len);
                  } catch (e) {
                    err = e;
                  } finally {
                    cb(err);
                  }
                };
                EmscriptenFile2.prototype.truncateSync = function truncateSync(
                  len
                ) {
                  try {
                    this._FS.ftruncate(this._stream.fd, len);
                  } catch (e) {
                    throw convertError(e, this._path);
                  }
                };
                EmscriptenFile2.prototype.write = function write(
                  buffer$$1,
                  offset,
                  length,
                  position,
                  cb
                ) {
                  try {
                    cb(
                      null,
                      this.writeSync(buffer$$1, offset, length, position),
                      buffer$$1
                    );
                  } catch (e) {
                    cb(e);
                  }
                };
                EmscriptenFile2.prototype.writeSync = function writeSync(
                  buffer$$1,
                  offset,
                  length,
                  position
                ) {
                  try {
                    var u8 = buffer2Uint8array(buffer$$1);
                    var emPosition = position === null ? void 0 : position;
                    return this._FS.write(
                      this._stream,
                      u8,
                      offset,
                      length,
                      emPosition
                    );
                  } catch (e) {
                    throw convertError(e, this._path);
                  }
                };
                EmscriptenFile2.prototype.read = function read(
                  buffer$$1,
                  offset,
                  length,
                  position,
                  cb
                ) {
                  try {
                    cb(
                      null,
                      this.readSync(buffer$$1, offset, length, position),
                      buffer$$1
                    );
                  } catch (e) {
                    cb(e);
                  }
                };
                EmscriptenFile2.prototype.readSync = function readSync(
                  buffer$$1,
                  offset,
                  length,
                  position
                ) {
                  try {
                    var u8 = buffer2Uint8array(buffer$$1);
                    var emPosition = position === null ? void 0 : position;
                    return this._FS.read(
                      this._stream,
                      u8,
                      offset,
                      length,
                      emPosition
                    );
                  } catch (e) {
                    throw convertError(e, this._path);
                  }
                };
                EmscriptenFile2.prototype.sync = function sync(cb) {
                  cb();
                };
                EmscriptenFile2.prototype.syncSync = function syncSync() {};
                EmscriptenFile2.prototype.chown = function chown(uid, gid, cb) {
                  var err = null;
                  try {
                    this.chownSync(uid, gid);
                  } catch (e) {
                    err = e;
                  } finally {
                    cb(err);
                  }
                };
                EmscriptenFile2.prototype.chownSync = function chownSync(
                  uid,
                  gid
                ) {
                  try {
                    this._FS.fchown(this._stream.fd, uid, gid);
                  } catch (e) {
                    throw convertError(e, this._path);
                  }
                };
                EmscriptenFile2.prototype.chmod = function chmod(mode, cb) {
                  var err = null;
                  try {
                    this.chmodSync(mode);
                  } catch (e) {
                    err = e;
                  } finally {
                    cb(err);
                  }
                };
                EmscriptenFile2.prototype.chmodSync = function chmodSync(mode) {
                  try {
                    this._FS.fchmod(this._stream.fd, mode);
                  } catch (e) {
                    throw convertError(e, this._path);
                  }
                };
                EmscriptenFile2.prototype.utimes = function utimes(
                  atime,
                  mtime,
                  cb
                ) {
                  var err = null;
                  try {
                    this.utimesSync(atime, mtime);
                  } catch (e) {
                    err = e;
                  } finally {
                    cb(err);
                  }
                };
                EmscriptenFile2.prototype.utimesSync = function utimesSync(
                  atime,
                  mtime
                ) {
                  this._fs.utimesSync(this._path, atime, mtime);
                };
                return EmscriptenFile2;
              })(BaseFile);
              var EmscriptenFileSystem = (function (SynchronousFileSystem$$1) {
                function EmscriptenFileSystem2(_FS) {
                  SynchronousFileSystem$$1.call(this);
                  this._FS = _FS;
                }
                if (SynchronousFileSystem$$1)
                  EmscriptenFileSystem2.__proto__ = SynchronousFileSystem$$1;
                EmscriptenFileSystem2.prototype = Object.create(
                  SynchronousFileSystem$$1 && SynchronousFileSystem$$1.prototype
                );
                EmscriptenFileSystem2.prototype.constructor =
                  EmscriptenFileSystem2;
                EmscriptenFileSystem2.Create = function Create(opts, cb) {
                  cb(null, new EmscriptenFileSystem2(opts.FS));
                };
                EmscriptenFileSystem2.isAvailable = function isAvailable() {
                  return true;
                };
                EmscriptenFileSystem2.prototype.getName = function getName() {
                  return this._FS.DB_NAME();
                };
                EmscriptenFileSystem2.prototype.isReadOnly =
                  function isReadOnly() {
                    return false;
                  };
                EmscriptenFileSystem2.prototype.supportsLinks =
                  function supportsLinks() {
                    return true;
                  };
                EmscriptenFileSystem2.prototype.supportsProps =
                  function supportsProps() {
                    return true;
                  };
                EmscriptenFileSystem2.prototype.supportsSynch =
                  function supportsSynch() {
                    return true;
                  };
                EmscriptenFileSystem2.prototype.renameSync =
                  function renameSync(oldPath, newPath) {
                    try {
                      this._FS.rename(oldPath, newPath);
                    } catch (e) {
                      if (e.errno === ErrorCode.ENOENT) {
                        throw convertError(
                          e,
                          this.existsSync(oldPath) ? newPath : oldPath
                        );
                      } else {
                        throw convertError(e);
                      }
                    }
                  };
                EmscriptenFileSystem2.prototype.statSync = function statSync(
                  p,
                  isLstat
                ) {
                  try {
                    var stats = isLstat ? this._FS.lstat(p) : this._FS.stat(p);
                    var itemType = this.modeToFileType(stats.mode);
                    return new Stats(
                      itemType,
                      stats.size,
                      stats.mode,
                      stats.atime,
                      stats.mtime,
                      stats.ctime
                    );
                  } catch (e) {
                    throw convertError(e, p);
                  }
                };
                EmscriptenFileSystem2.prototype.openSync = function openSync(
                  p,
                  flag,
                  mode
                ) {
                  try {
                    var stream = this._FS.open(p, flag.getFlagString(), mode);
                    if (this._FS.isDir(stream.node.mode)) {
                      this._FS.close(stream);
                      throw ApiError.EISDIR(p);
                    }
                    return new EmscriptenFile(this, this._FS, p, stream);
                  } catch (e) {
                    throw convertError(e, p);
                  }
                };
                EmscriptenFileSystem2.prototype.unlinkSync =
                  function unlinkSync(p) {
                    try {
                      this._FS.unlink(p);
                    } catch (e) {
                      throw convertError(e, p);
                    }
                  };
                EmscriptenFileSystem2.prototype.rmdirSync = function rmdirSync(
                  p
                ) {
                  try {
                    this._FS.rmdir(p);
                  } catch (e) {
                    throw convertError(e, p);
                  }
                };
                EmscriptenFileSystem2.prototype.mkdirSync = function mkdirSync(
                  p,
                  mode
                ) {
                  try {
                    this._FS.mkdir(p, mode);
                  } catch (e) {
                    throw convertError(e, p);
                  }
                };
                EmscriptenFileSystem2.prototype.readdirSync =
                  function readdirSync(p) {
                    try {
                      return this._FS.readdir(p).filter(function (p2) {
                        return p2 !== "." && p2 !== "..";
                      });
                    } catch (e) {
                      throw convertError(e, p);
                    }
                  };
                EmscriptenFileSystem2.prototype.truncateSync =
                  function truncateSync(p, len) {
                    try {
                      this._FS.truncate(p, len);
                    } catch (e) {
                      throw convertError(e, p);
                    }
                  };
                EmscriptenFileSystem2.prototype.readFileSync =
                  function readFileSync(p, encoding, flag) {
                    try {
                      var data = this._FS.readFile(p, {
                        flags: flag.getFlagString(),
                      });
                      var buff = uint8Array2Buffer(data);
                      if (encoding) {
                        return buff.toString(encoding);
                      } else {
                        return buff;
                      }
                    } catch (e) {
                      throw convertError(e, p);
                    }
                  };
                EmscriptenFileSystem2.prototype.writeFileSync =
                  function writeFileSync(p, data, encoding, flag, mode) {
                    try {
                      if (encoding) {
                        data = Buffer2.from(data, encoding);
                      }
                      var u8 = buffer2Uint8array(data);
                      this._FS.writeFile(p, u8, {
                        flags: flag.getFlagString(),
                        encoding: "binary",
                      });
                      this._FS.chmod(p, mode);
                    } catch (e) {
                      throw convertError(e, p);
                    }
                  };
                EmscriptenFileSystem2.prototype.chmodSync = function chmodSync(
                  p,
                  isLchmod,
                  mode
                ) {
                  try {
                    isLchmod
                      ? this._FS.lchmod(p, mode)
                      : this._FS.chmod(p, mode);
                  } catch (e) {
                    throw convertError(e, p);
                  }
                };
                EmscriptenFileSystem2.prototype.chownSync = function chownSync(
                  p,
                  isLchown,
                  uid,
                  gid
                ) {
                  try {
                    isLchown
                      ? this._FS.lchown(p, uid, gid)
                      : this._FS.chown(p, uid, gid);
                  } catch (e) {
                    throw convertError(e, p);
                  }
                };
                EmscriptenFileSystem2.prototype.symlinkSync =
                  function symlinkSync(srcpath, dstpath, type) {
                    try {
                      this._FS.symlink(srcpath, dstpath);
                    } catch (e) {
                      throw convertError(e);
                    }
                  };
                EmscriptenFileSystem2.prototype.readlinkSync =
                  function readlinkSync(p) {
                    try {
                      return this._FS.readlink(p);
                    } catch (e) {
                      throw convertError(e, p);
                    }
                  };
                EmscriptenFileSystem2.prototype.utimesSync =
                  function utimesSync(p, atime, mtime) {
                    try {
                      this._FS.utime(p, atime.getTime(), mtime.getTime());
                    } catch (e) {
                      throw convertError(e, p);
                    }
                  };
                EmscriptenFileSystem2.prototype.modeToFileType =
                  function modeToFileType(mode) {
                    if (this._FS.isDir(mode)) {
                      return FileType.DIRECTORY;
                    } else if (this._FS.isFile(mode)) {
                      return FileType.FILE;
                    } else if (this._FS.isLink(mode)) {
                      return FileType.SYMLINK;
                    } else {
                      throw ApiError.EPERM("Invalid mode: " + mode);
                    }
                  };
                return EmscriptenFileSystem2;
              })(SynchronousFileSystem);
              EmscriptenFileSystem.Name = "EmscriptenFileSystem";
              EmscriptenFileSystem.Options = {
                FS: {
                  type: "object",
                  description:
                    "The Emscripten file system to use (the `FS` variable)",
                },
              };
              var FolderAdapter = (function (BaseFileSystem$$1) {
                function FolderAdapter2(folder, wrapped) {
                  BaseFileSystem$$1.call(this);
                  this._folder = folder;
                  this._wrapped = wrapped;
                }
                if (BaseFileSystem$$1)
                  FolderAdapter2.__proto__ = BaseFileSystem$$1;
                FolderAdapter2.prototype = Object.create(
                  BaseFileSystem$$1 && BaseFileSystem$$1.prototype
                );
                FolderAdapter2.prototype.constructor = FolderAdapter2;
                FolderAdapter2.Create = function Create(opts, cb) {
                  cb(null, new FolderAdapter2(opts.folder, opts.wrapped));
                };
                FolderAdapter2.isAvailable = function isAvailable() {
                  return true;
                };
                FolderAdapter2.prototype.initialize = function initialize2(cb) {
                  var this$1$1 = this;
                  this._wrapped.exists(this._folder, function (exists) {
                    if (exists) {
                      cb();
                    } else if (this$1$1._wrapped.isReadOnly()) {
                      cb(ApiError.ENOENT(this$1$1._folder));
                    } else {
                      this$1$1._wrapped.mkdir(this$1$1._folder, 511, cb);
                    }
                  });
                };
                FolderAdapter2.prototype.getName = function getName() {
                  return this._wrapped.getName();
                };
                FolderAdapter2.prototype.isReadOnly = function isReadOnly() {
                  return this._wrapped.isReadOnly();
                };
                FolderAdapter2.prototype.supportsProps =
                  function supportsProps() {
                    return this._wrapped.supportsProps();
                  };
                FolderAdapter2.prototype.supportsSynch =
                  function supportsSynch() {
                    return this._wrapped.supportsSynch();
                  };
                FolderAdapter2.prototype.supportsLinks =
                  function supportsLinks() {
                    return false;
                  };
                return FolderAdapter2;
              })(BaseFileSystem);
              FolderAdapter.Name = "FolderAdapter";
              FolderAdapter.Options = {
                folder: {
                  type: "string",
                  description: "The folder to use as the root directory",
                },
                wrapped: {
                  type: "object",
                  description: "The file system to wrap",
                },
              };
              function translateError(folder, e) {
                if (e !== null && typeof e === "object") {
                  var err = e;
                  var p = err.path;
                  if (p) {
                    p = "/" + path2.relative(folder, p);
                    err.message = err.message.replace(err.path, p);
                    err.path = p;
                  }
                }
                return e;
              }
              function wrapCallback(folder, cb) {
                if (typeof cb === "function") {
                  return function (err) {
                    if (arguments.length > 0) {
                      arguments[0] = translateError(folder, err);
                    }
                    cb.apply(null, arguments);
                  };
                } else {
                  return cb;
                }
              }
              function wrapFunction(name2, wrapFirst, wrapSecond) {
                if (name2.slice(name2.length - 4) !== "Sync") {
                  return function () {
                    if (arguments.length > 0) {
                      if (wrapFirst) {
                        arguments[0] = path2.join(this._folder, arguments[0]);
                      }
                      if (wrapSecond) {
                        arguments[1] = path2.join(this._folder, arguments[1]);
                      }
                      arguments[arguments.length - 1] = wrapCallback(
                        this._folder,
                        arguments[arguments.length - 1]
                      );
                    }
                    return this._wrapped[name2].apply(this._wrapped, arguments);
                  };
                } else {
                  return function () {
                    try {
                      if (wrapFirst) {
                        arguments[0] = path2.join(this._folder, arguments[0]);
                      }
                      if (wrapSecond) {
                        arguments[1] = path2.join(this._folder, arguments[1]);
                      }
                      return this._wrapped[name2].apply(
                        this._wrapped,
                        arguments
                      );
                    } catch (e) {
                      throw translateError(this._folder, e);
                    }
                  };
                }
              }
              [
                "diskSpace",
                "stat",
                "statSync",
                "open",
                "openSync",
                "unlink",
                "unlinkSync",
                "rmdir",
                "rmdirSync",
                "mkdir",
                "mkdirSync",
                "readdir",
                "readdirSync",
                "exists",
                "existsSync",
                "realpath",
                "realpathSync",
                "truncate",
                "truncateSync",
                "readFile",
                "readFileSync",
                "writeFile",
                "writeFileSync",
                "appendFile",
                "appendFileSync",
                "chmod",
                "chmodSync",
                "chown",
                "chownSync",
                "utimes",
                "utimesSync",
                "readlink",
                "readlinkSync",
              ].forEach(function (name2) {
                FolderAdapter.prototype[name2] = wrapFunction(
                  name2,
                  true,
                  false
                );
              });
              [
                "rename",
                "renameSync",
                "link",
                "linkSync",
                "symlink",
                "symlinkSync",
              ].forEach(function (name2) {
                FolderAdapter.prototype[name2] = wrapFunction(
                  name2,
                  true,
                  true
                );
              });
              var toExport;
              if (typeof window !== "undefined") {
                toExport = window;
              } else if (typeof self !== "undefined") {
                toExport = self;
              } else {
                toExport = global2;
              }
              var global$1 = toExport;
              function isDirectoryEntry(entry) {
                return entry.isDirectory;
              }
              var _getFS =
                global$1.webkitRequestFileSystem ||
                global$1.requestFileSystem ||
                null;
              function _requestQuota(type, size, success, errorCallback) {
                if (
                  typeof navigator["webkitPersistentStorage"] !== "undefined"
                ) {
                  switch (type) {
                    case global$1.PERSISTENT:
                      navigator.webkitPersistentStorage.requestQuota(
                        size,
                        success,
                        errorCallback
                      );
                      break;
                    case global$1.TEMPORARY:
                      navigator.webkitTemporaryStorage.requestQuota(
                        size,
                        success,
                        errorCallback
                      );
                      break;
                    default:
                      errorCallback(
                        new TypeError("Invalid storage type: " + type)
                      );
                      break;
                  }
                } else {
                  global$1.webkitStorageInfo.requestQuota(
                    type,
                    size,
                    success,
                    errorCallback
                  );
                }
              }
              function _toArray(list2) {
                return Array.prototype.slice.call(list2 || [], 0);
              }
              function convertError$1(err, p, expectedDir) {
                switch (err.name) {
                  case "PathExistsError":
                    return ApiError.EEXIST(p);
                  case "QuotaExceededError":
                    return ApiError.FileError(ErrorCode.ENOSPC, p);
                  case "NotFoundError":
                    return ApiError.ENOENT(p);
                  case "SecurityError":
                    return ApiError.FileError(ErrorCode.EACCES, p);
                  case "InvalidModificationError":
                    return ApiError.FileError(ErrorCode.EPERM, p);
                  case "TypeMismatchError":
                    return ApiError.FileError(
                      expectedDir ? ErrorCode.ENOTDIR : ErrorCode.EISDIR,
                      p
                    );
                  case "EncodingError":
                  case "InvalidStateError":
                  case "NoModificationAllowedError":
                  default:
                    return ApiError.FileError(ErrorCode.EINVAL, p);
                }
              }
              var HTML5FSFile = (function (PreloadFile$$1) {
                function HTML5FSFile2(
                  fs2,
                  entry,
                  path$$1,
                  flag,
                  stat,
                  contents
                ) {
                  PreloadFile$$1.call(this, fs2, path$$1, flag, stat, contents);
                  this._entry = entry;
                }
                if (PreloadFile$$1) HTML5FSFile2.__proto__ = PreloadFile$$1;
                HTML5FSFile2.prototype = Object.create(
                  PreloadFile$$1 && PreloadFile$$1.prototype
                );
                HTML5FSFile2.prototype.constructor = HTML5FSFile2;
                HTML5FSFile2.prototype.sync = function sync(cb) {
                  var this$1$1 = this;
                  if (!this.isDirty()) {
                    return cb();
                  }
                  this._entry.createWriter(function (writer) {
                    var buffer$$1 = this$1$1.getBuffer();
                    var blob = new Blob([buffer2ArrayBuffer(buffer$$1)]);
                    var length = blob.size;
                    writer.onwriteend = function (err) {
                      writer.onwriteend = null;
                      writer.onerror = null;
                      writer.truncate(length);
                      this$1$1.resetDirty();
                      cb();
                    };
                    writer.onerror = function (err) {
                      cb(convertError$1(err, this$1$1.getPath(), false));
                    };
                    writer.write(blob);
                  });
                };
                HTML5FSFile2.prototype.close = function close(cb) {
                  this.sync(cb);
                };
                return HTML5FSFile2;
              })(PreloadFile);
              var HTML5FS = (function (BaseFileSystem$$1) {
                function HTML5FS2(size, type, deprecateMsg) {
                  if (size === void 0) size = 5;
                  if (type === void 0) type = global$1.PERSISTENT;
                  if (deprecateMsg === void 0) deprecateMsg = true;
                  BaseFileSystem$$1.call(this);
                  this.size = 1024 * 1024 * size;
                  this.type = type;
                  deprecationMessage(deprecateMsg, HTML5FS2.Name, {
                    size,
                    type,
                  });
                }
                if (BaseFileSystem$$1) HTML5FS2.__proto__ = BaseFileSystem$$1;
                HTML5FS2.prototype = Object.create(
                  BaseFileSystem$$1 && BaseFileSystem$$1.prototype
                );
                HTML5FS2.prototype.constructor = HTML5FS2;
                HTML5FS2.Create = function Create(opts, cb) {
                  var fs2 = new HTML5FS2(opts.size, opts.type, false);
                  fs2.allocate(function (e) {
                    return e ? cb(e) : cb(null, fs2);
                  }, false);
                };
                HTML5FS2.isAvailable = function isAvailable() {
                  return !!_getFS;
                };
                HTML5FS2.prototype.getName = function getName() {
                  return HTML5FS2.Name;
                };
                HTML5FS2.prototype.isReadOnly = function isReadOnly() {
                  return false;
                };
                HTML5FS2.prototype.supportsSymlinks =
                  function supportsSymlinks() {
                    return false;
                  };
                HTML5FS2.prototype.supportsProps = function supportsProps() {
                  return false;
                };
                HTML5FS2.prototype.supportsSynch = function supportsSynch() {
                  return false;
                };
                HTML5FS2.prototype.allocate = function allocate(
                  cb,
                  deprecateMsg
                ) {
                  var this$1$1 = this;
                  if (cb === void 0) cb = function () {};
                  if (deprecateMsg === void 0) deprecateMsg = true;
                  if (deprecateMsg) {
                    console.warn(
                      "[HTML5FS] HTML5FS.allocate() is deprecated and will be removed in the next major release. Please use 'HTML5FS.Create({type: " +
                        this.type +
                        ", size: " +
                        this.size +
                        "}, cb)' to create and allocate HTML5FS instances."
                    );
                  }
                  var success = function (fs2) {
                    this$1$1.fs = fs2;
                    cb();
                  };
                  var error = function (err) {
                    cb(convertError$1(err, "/", true));
                  };
                  if (this.type === global$1.PERSISTENT) {
                    _requestQuota(
                      this.type,
                      this.size,
                      function (granted) {
                        _getFS(this$1$1.type, granted, success, error);
                      },
                      error
                    );
                  } else {
                    _getFS(this.type, this.size, success, error);
                  }
                };
                HTML5FS2.prototype.empty = function empty(mainCb) {
                  this._readdir("/", function (err, entries) {
                    if (err) {
                      console.error("Failed to empty FS");
                      mainCb(err);
                    } else {
                      var finished = function (er) {
                        if (err) {
                          console.error("Failed to empty FS");
                          mainCb(err);
                        } else {
                          mainCb();
                        }
                      };
                      var deleteEntry = function (entry, cb) {
                        var succ = function () {
                          cb();
                        };
                        var error = function (err2) {
                          cb(
                            convertError$1(
                              err2,
                              entry.fullPath,
                              !entry.isDirectory
                            )
                          );
                        };
                        if (isDirectoryEntry(entry)) {
                          entry.removeRecursively(succ, error);
                        } else {
                          entry.remove(succ, error);
                        }
                      };
                      eachLimit(entries, deleteEntry, finished);
                    }
                  });
                };
                HTML5FS2.prototype.rename = function rename(
                  oldPath,
                  newPath,
                  cb
                ) {
                  var this$1$1 = this;
                  var semaphore = 2;
                  var successCount = 0;
                  var root2 = this.fs.root;
                  var currentPath = oldPath;
                  var error = function (err) {
                    if (--semaphore <= 0) {
                      cb(convertError$1(err, currentPath, false));
                    }
                  };
                  var success = function (file) {
                    if (++successCount === 2) {
                      return cb(
                        new ApiError(
                          ErrorCode.EINVAL,
                          "Something was identified as both a file and a directory. This should never happen."
                        )
                      );
                    }
                    if (oldPath === newPath) {
                      return cb();
                    }
                    currentPath = path2.dirname(newPath);
                    root2.getDirectory(
                      currentPath,
                      {},
                      function (parentDir) {
                        currentPath = path2.basename(newPath);
                        file.moveTo(
                          parentDir,
                          currentPath,
                          function (entry) {
                            cb();
                          },
                          function (err) {
                            if (file.isDirectory) {
                              currentPath = newPath;
                              this$1$1.unlink(newPath, function (e) {
                                if (e) {
                                  error(err);
                                } else {
                                  this$1$1.rename(oldPath, newPath, cb);
                                }
                              });
                            } else {
                              error(err);
                            }
                          }
                        );
                      },
                      error
                    );
                  };
                  root2.getFile(oldPath, {}, success, error);
                  root2.getDirectory(oldPath, {}, success, error);
                };
                HTML5FS2.prototype.stat = function stat(path$$1, isLstat, cb) {
                  var this$1$1 = this;
                  var opts = {
                    create: false,
                  };
                  var loadAsFile = function (entry) {
                    var fileFromEntry = function (file) {
                      var stat2 = new Stats(FileType.FILE, file.size);
                      cb(null, stat2);
                    };
                    entry.file(fileFromEntry, failedToLoad);
                  };
                  var loadAsDir = function (dir$$1) {
                    var size = 4096;
                    var stat2 = new Stats(FileType.DIRECTORY, size);
                    cb(null, stat2);
                  };
                  var failedToLoad = function (err) {
                    cb(
                      convertError$1(
                        err,
                        path$$1,
                        false
                        /* Unknown / irrelevant */
                      )
                    );
                  };
                  var failedToLoadAsFile = function () {
                    this$1$1.fs.root.getDirectory(
                      path$$1,
                      opts,
                      loadAsDir,
                      failedToLoad
                    );
                  };
                  this.fs.root.getFile(
                    path$$1,
                    opts,
                    loadAsFile,
                    failedToLoadAsFile
                  );
                };
                HTML5FS2.prototype.open = function open(p, flags, mode, cb) {
                  var this$1$1 = this;
                  var error = function (err) {
                    if (
                      err.name === "InvalidModificationError" &&
                      flags.isExclusive()
                    ) {
                      cb(ApiError.EEXIST(p));
                    } else {
                      cb(convertError$1(err, p, false));
                    }
                  };
                  this.fs.root.getFile(
                    p,
                    {
                      create:
                        flags.pathNotExistsAction() === ActionType.CREATE_FILE,
                      exclusive: flags.isExclusive(),
                    },
                    function (entry) {
                      entry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function (event) {
                          var bfsFile = this$1$1._makeFile(
                            p,
                            entry,
                            flags,
                            file,
                            reader.result
                          );
                          cb(null, bfsFile);
                        };
                        reader.onerror = function (ev) {
                          error(reader.error);
                        };
                        reader.readAsArrayBuffer(file);
                      }, error);
                    },
                    error
                  );
                };
                HTML5FS2.prototype.unlink = function unlink(path$$1, cb) {
                  this._remove(path$$1, cb, true);
                };
                HTML5FS2.prototype.rmdir = function rmdir(path$$1, cb) {
                  var this$1$1 = this;
                  this.readdir(path$$1, function (e, files) {
                    if (e) {
                      cb(e);
                    } else if (files.length > 0) {
                      cb(ApiError.ENOTEMPTY(path$$1));
                    } else {
                      this$1$1._remove(path$$1, cb, false);
                    }
                  });
                };
                HTML5FS2.prototype.mkdir = function mkdir(path$$1, mode, cb) {
                  var opts = {
                    create: true,
                    exclusive: true,
                  };
                  var success = function (dir$$1) {
                    cb();
                  };
                  var error = function (err) {
                    cb(convertError$1(err, path$$1, true));
                  };
                  this.fs.root.getDirectory(path$$1, opts, success, error);
                };
                HTML5FS2.prototype.readdir = function readdir(path$$1, cb) {
                  this._readdir(path$$1, function (e, entries) {
                    if (entries) {
                      var rv = [];
                      for (
                        var i2 = 0, list2 = entries;
                        i2 < list2.length;
                        i2 += 1
                      ) {
                        var entry = list2[i2];
                        rv.push(entry.name);
                      }
                      cb(null, rv);
                    } else {
                      return cb(e);
                    }
                  });
                };
                HTML5FS2.prototype._makeFile = function _makeFile(
                  path$$1,
                  entry,
                  flag,
                  stat,
                  data
                ) {
                  if (data === void 0) data = new ArrayBuffer(0);
                  var stats = new Stats(FileType.FILE, stat.size);
                  var buffer$$1 = arrayBuffer2Buffer(data);
                  return new HTML5FSFile(
                    this,
                    entry,
                    path$$1,
                    flag,
                    stats,
                    buffer$$1
                  );
                };
                HTML5FS2.prototype._readdir = function _readdir(path$$1, cb) {
                  var error = function (err) {
                    cb(convertError$1(err, path$$1, true));
                  };
                  this.fs.root.getDirectory(
                    path$$1,
                    { create: false },
                    function (dirEntry) {
                      var reader = dirEntry.createReader();
                      var entries = [];
                      var readEntries = function () {
                        reader.readEntries(function (results) {
                          if (results.length) {
                            entries = entries.concat(_toArray(results));
                            readEntries();
                          } else {
                            cb(null, entries);
                          }
                        }, error);
                      };
                      readEntries();
                    },
                    error
                  );
                };
                HTML5FS2.prototype._remove = function _remove(
                  path$$1,
                  cb,
                  isFile
                ) {
                  var success = function (entry) {
                    var succ = function () {
                      cb();
                    };
                    var err = function (err2) {
                      cb(convertError$1(err2, path$$1, !isFile));
                    };
                    entry.remove(succ, err);
                  };
                  var error = function (err) {
                    cb(convertError$1(err, path$$1, !isFile));
                  };
                  var opts = {
                    create: false,
                  };
                  if (isFile) {
                    this.fs.root.getFile(path$$1, opts, success, error);
                  } else {
                    this.fs.root.getDirectory(path$$1, opts, success, error);
                  }
                };
                return HTML5FS2;
              })(BaseFileSystem);
              HTML5FS.Name = "HTML5FS";
              HTML5FS.Options = {
                size: {
                  type: "number",
                  optional: true,
                  description:
                    "Storage quota to request, in megabytes. Allocated value may be less. Defaults to 5.",
                },
                type: {
                  type: "number",
                  optional: true,
                  description:
                    "window.PERSISTENT or window.TEMPORARY. Defaults to PERSISTENT.",
                },
              };
              var Inode = function Inode2(id, size, mode, atime, mtime, ctime) {
                this.id = id;
                this.size = size;
                this.mode = mode;
                this.atime = atime;
                this.mtime = mtime;
                this.ctime = ctime;
              };
              Inode.fromBuffer = function fromBuffer(buffer$$1) {
                if (buffer$$1 === void 0) {
                  throw new Error("NO");
                }
                return new Inode(
                  buffer$$1.toString("ascii", 30),
                  buffer$$1.readUInt32LE(0),
                  buffer$$1.readUInt16LE(4),
                  buffer$$1.readDoubleLE(6),
                  buffer$$1.readDoubleLE(14),
                  buffer$$1.readDoubleLE(22)
                );
              };
              Inode.prototype.toStats = function toStats() {
                return new Stats(
                  (this.mode & 61440) === FileType.DIRECTORY
                    ? FileType.DIRECTORY
                    : FileType.FILE,
                  this.size,
                  this.mode,
                  new Date(this.atime),
                  new Date(this.mtime),
                  new Date(this.ctime)
                );
              };
              Inode.prototype.getSize = function getSize() {
                return 30 + this.id.length;
              };
              Inode.prototype.toBuffer = function toBuffer(buff) {
                if (buff === void 0) buff = Buffer2.alloc(this.getSize());
                buff.writeUInt32LE(this.size, 0);
                buff.writeUInt16LE(this.mode, 4);
                buff.writeDoubleLE(this.atime, 6);
                buff.writeDoubleLE(this.mtime, 14);
                buff.writeDoubleLE(this.ctime, 22);
                buff.write(this.id, 30, this.id.length, "ascii");
                return buff;
              };
              Inode.prototype.update = function update(stats) {
                var hasChanged = false;
                if (this.size !== stats.size) {
                  this.size = stats.size;
                  hasChanged = true;
                }
                if (this.mode !== stats.mode) {
                  this.mode = stats.mode;
                  hasChanged = true;
                }
                var atimeMs = stats.atime.getTime();
                if (this.atime !== atimeMs) {
                  this.atime = atimeMs;
                  hasChanged = true;
                }
                var mtimeMs = stats.mtime.getTime();
                if (this.mtime !== mtimeMs) {
                  this.mtime = mtimeMs;
                  hasChanged = true;
                }
                var ctimeMs = stats.ctime.getTime();
                if (this.ctime !== ctimeMs) {
                  this.ctime = ctimeMs;
                  hasChanged = true;
                }
                return hasChanged;
              };
              Inode.prototype.isFile = function isFile() {
                return (this.mode & 61440) === FileType.FILE;
              };
              Inode.prototype.isDirectory = function isDirectory() {
                return (this.mode & 61440) === FileType.DIRECTORY;
              };
              var ROOT_NODE_ID = "/";
              var emptyDirNode = null;
              function getEmptyDirNode() {
                if (emptyDirNode) {
                  return emptyDirNode;
                }
                return (emptyDirNode = Buffer2.from("{}"));
              }
              function GenerateRandomID() {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                  /[xy]/g,
                  function (c) {
                    var r = (Math.random() * 16) | 0;
                    var v = c === "x" ? r : (r & 3) | 8;
                    return v.toString(16);
                  }
                );
              }
              function noError(e, cb) {
                if (e) {
                  cb(e);
                  return false;
                }
                return true;
              }
              function noErrorTx(e, tx, cb) {
                if (e) {
                  tx.abort(function () {
                    cb(e);
                  });
                  return false;
                }
                return true;
              }
              var SimpleSyncRWTransaction = function SimpleSyncRWTransaction2(
                store
              ) {
                this.store = store;
                this.originalData = {};
                this.modifiedKeys = [];
              };
              SimpleSyncRWTransaction.prototype.get = function get(key) {
                var val = this.store.get(key);
                this.stashOldValue(key, val);
                return val;
              };
              SimpleSyncRWTransaction.prototype.put = function put(
                key,
                data,
                overwrite
              ) {
                this.markModified(key);
                return this.store.put(key, data, overwrite);
              };
              SimpleSyncRWTransaction.prototype.del = function del(key) {
                this.markModified(key);
                this.store.del(key);
              };
              SimpleSyncRWTransaction.prototype.commit = function commit() {};
              SimpleSyncRWTransaction.prototype.abort = function abort() {
                var this$1$1 = this;
                for (
                  var i2 = 0, list2 = this$1$1.modifiedKeys;
                  i2 < list2.length;
                  i2 += 1
                ) {
                  var key = list2[i2];
                  var value = this$1$1.originalData[key];
                  if (!value) {
                    this$1$1.store.del(key);
                  } else {
                    this$1$1.store.put(key, value, true);
                  }
                }
              };
              SimpleSyncRWTransaction.prototype.stashOldValue =
                function stashOldValue(key, value) {
                  if (!this.originalData.hasOwnProperty(key)) {
                    this.originalData[key] = value;
                  }
                };
              SimpleSyncRWTransaction.prototype.markModified =
                function markModified(key) {
                  if (this.modifiedKeys.indexOf(key) === -1) {
                    this.modifiedKeys.push(key);
                    if (!this.originalData.hasOwnProperty(key)) {
                      this.originalData[key] = this.store.get(key);
                    }
                  }
                };
              var SyncKeyValueFile = (function (PreloadFile$$1) {
                function SyncKeyValueFile2(_fs, _path, _flag, _stat, contents) {
                  PreloadFile$$1.call(this, _fs, _path, _flag, _stat, contents);
                }
                if (PreloadFile$$1)
                  SyncKeyValueFile2.__proto__ = PreloadFile$$1;
                SyncKeyValueFile2.prototype = Object.create(
                  PreloadFile$$1 && PreloadFile$$1.prototype
                );
                SyncKeyValueFile2.prototype.constructor = SyncKeyValueFile2;
                SyncKeyValueFile2.prototype.syncSync = function syncSync() {
                  if (this.isDirty()) {
                    this._fs._syncSync(
                      this.getPath(),
                      this.getBuffer(),
                      this.getStats()
                    );
                    this.resetDirty();
                  }
                };
                SyncKeyValueFile2.prototype.closeSync = function closeSync() {
                  this.syncSync();
                };
                return SyncKeyValueFile2;
              })(PreloadFile);
              var SyncKeyValueFileSystem = (function (
                SynchronousFileSystem$$1
              ) {
                function SyncKeyValueFileSystem2(options) {
                  SynchronousFileSystem$$1.call(this);
                  this.store = options.store;
                  this.makeRootDirectory();
                }
                if (SynchronousFileSystem$$1)
                  SyncKeyValueFileSystem2.__proto__ = SynchronousFileSystem$$1;
                SyncKeyValueFileSystem2.prototype = Object.create(
                  SynchronousFileSystem$$1 && SynchronousFileSystem$$1.prototype
                );
                SyncKeyValueFileSystem2.prototype.constructor =
                  SyncKeyValueFileSystem2;
                SyncKeyValueFileSystem2.isAvailable = function isAvailable() {
                  return true;
                };
                SyncKeyValueFileSystem2.prototype.getName = function getName() {
                  return this.store.name();
                };
                SyncKeyValueFileSystem2.prototype.isReadOnly =
                  function isReadOnly() {
                    return false;
                  };
                SyncKeyValueFileSystem2.prototype.supportsSymlinks =
                  function supportsSymlinks() {
                    return false;
                  };
                SyncKeyValueFileSystem2.prototype.supportsProps =
                  function supportsProps() {
                    return false;
                  };
                SyncKeyValueFileSystem2.prototype.supportsSynch =
                  function supportsSynch() {
                    return true;
                  };
                SyncKeyValueFileSystem2.prototype.empty = function empty() {
                  this.store.clear();
                  this.makeRootDirectory();
                };
                SyncKeyValueFileSystem2.prototype.renameSync =
                  function renameSync(oldPath, newPath) {
                    var tx = this.store.beginTransaction("readwrite"),
                      oldParent = path2.dirname(oldPath),
                      oldName = path2.basename(oldPath),
                      newParent = path2.dirname(newPath),
                      newName = path2.basename(newPath),
                      oldDirNode = this.findINode(tx, oldParent),
                      oldDirList = this.getDirListing(
                        tx,
                        oldParent,
                        oldDirNode
                      );
                    if (!oldDirList[oldName]) {
                      throw ApiError.ENOENT(oldPath);
                    }
                    var nodeId = oldDirList[oldName];
                    delete oldDirList[oldName];
                    if ((newParent + "/").indexOf(oldPath + "/") === 0) {
                      throw new ApiError(ErrorCode.EBUSY, oldParent);
                    }
                    var newDirNode, newDirList;
                    if (newParent === oldParent) {
                      newDirNode = oldDirNode;
                      newDirList = oldDirList;
                    } else {
                      newDirNode = this.findINode(tx, newParent);
                      newDirList = this.getDirListing(
                        tx,
                        newParent,
                        newDirNode
                      );
                    }
                    if (newDirList[newName]) {
                      var newNameNode = this.getINode(
                        tx,
                        newPath,
                        newDirList[newName]
                      );
                      if (newNameNode.isFile()) {
                        try {
                          tx.del(newNameNode.id);
                          tx.del(newDirList[newName]);
                        } catch (e) {
                          tx.abort();
                          throw e;
                        }
                      } else {
                        throw ApiError.EPERM(newPath);
                      }
                    }
                    newDirList[newName] = nodeId;
                    try {
                      tx.put(
                        oldDirNode.id,
                        Buffer2.from(JSON.stringify(oldDirList)),
                        true
                      );
                      tx.put(
                        newDirNode.id,
                        Buffer2.from(JSON.stringify(newDirList)),
                        true
                      );
                    } catch (e) {
                      tx.abort();
                      throw e;
                    }
                    tx.commit();
                  };
                SyncKeyValueFileSystem2.prototype.statSync = function statSync(
                  p,
                  isLstat
                ) {
                  return this.findINode(
                    this.store.beginTransaction("readonly"),
                    p
                  ).toStats();
                };
                SyncKeyValueFileSystem2.prototype.createFileSync =
                  function createFileSync(p, flag, mode) {
                    var tx = this.store.beginTransaction("readwrite"),
                      data = emptyBuffer(),
                      newFile = this.commitNewFile(
                        tx,
                        p,
                        FileType.FILE,
                        mode,
                        data
                      );
                    return new SyncKeyValueFile(
                      this,
                      p,
                      flag,
                      newFile.toStats(),
                      data
                    );
                  };
                SyncKeyValueFileSystem2.prototype.openFileSync =
                  function openFileSync(p, flag) {
                    var tx = this.store.beginTransaction("readonly"),
                      node = this.findINode(tx, p),
                      data = tx.get(node.id);
                    if (data === void 0) {
                      throw ApiError.ENOENT(p);
                    }
                    return new SyncKeyValueFile(
                      this,
                      p,
                      flag,
                      node.toStats(),
                      data
                    );
                  };
                SyncKeyValueFileSystem2.prototype.unlinkSync =
                  function unlinkSync(p) {
                    this.removeEntry(p, false);
                  };
                SyncKeyValueFileSystem2.prototype.rmdirSync =
                  function rmdirSync(p) {
                    if (this.readdirSync(p).length > 0) {
                      throw ApiError.ENOTEMPTY(p);
                    } else {
                      this.removeEntry(p, true);
                    }
                  };
                SyncKeyValueFileSystem2.prototype.mkdirSync =
                  function mkdirSync(p, mode) {
                    var tx = this.store.beginTransaction("readwrite"),
                      data = Buffer2.from("{}");
                    this.commitNewFile(tx, p, FileType.DIRECTORY, mode, data);
                  };
                SyncKeyValueFileSystem2.prototype.readdirSync =
                  function readdirSync(p) {
                    var tx = this.store.beginTransaction("readonly");
                    return Object.keys(
                      this.getDirListing(tx, p, this.findINode(tx, p))
                    );
                  };
                SyncKeyValueFileSystem2.prototype._syncSync =
                  function _syncSync(p, data, stats) {
                    var tx = this.store.beginTransaction("readwrite"),
                      fileInodeId = this._findINode(
                        tx,
                        path2.dirname(p),
                        path2.basename(p)
                      ),
                      fileInode = this.getINode(tx, p, fileInodeId),
                      inodeChanged = fileInode.update(stats);
                    try {
                      tx.put(fileInode.id, data, true);
                      if (inodeChanged) {
                        tx.put(fileInodeId, fileInode.toBuffer(), true);
                      }
                    } catch (e) {
                      tx.abort();
                      throw e;
                    }
                    tx.commit();
                  };
                SyncKeyValueFileSystem2.prototype.makeRootDirectory =
                  function makeRootDirectory() {
                    var tx = this.store.beginTransaction("readwrite");
                    if (tx.get(ROOT_NODE_ID) === void 0) {
                      var currTime = /* @__PURE__ */ new Date().getTime(),
                        dirInode = new Inode(
                          GenerateRandomID(),
                          4096,
                          511 | FileType.DIRECTORY,
                          currTime,
                          currTime,
                          currTime
                        );
                      tx.put(dirInode.id, getEmptyDirNode(), false);
                      tx.put(ROOT_NODE_ID, dirInode.toBuffer(), false);
                      tx.commit();
                    }
                  };
                SyncKeyValueFileSystem2.prototype._findINode =
                  function _findINode(tx, parent, filename) {
                    var this$1$1 = this;
                    var readDirectory = function (inode) {
                      var dirList = this$1$1.getDirListing(tx, parent, inode);
                      if (dirList[filename]) {
                        return dirList[filename];
                      } else {
                        throw ApiError.ENOENT(path2.resolve(parent, filename));
                      }
                    };
                    if (parent === "/") {
                      if (filename === "") {
                        return ROOT_NODE_ID;
                      } else {
                        return readDirectory(
                          this.getINode(tx, parent, ROOT_NODE_ID)
                        );
                      }
                    } else {
                      return readDirectory(
                        this.getINode(
                          tx,
                          parent + path2.sep + filename,
                          this._findINode(
                            tx,
                            path2.dirname(parent),
                            path2.basename(parent)
                          )
                        )
                      );
                    }
                  };
                SyncKeyValueFileSystem2.prototype.findINode =
                  function findINode(tx, p) {
                    return this.getINode(
                      tx,
                      p,
                      this._findINode(tx, path2.dirname(p), path2.basename(p))
                    );
                  };
                SyncKeyValueFileSystem2.prototype.getINode = function getINode(
                  tx,
                  p,
                  id
                ) {
                  var inode = tx.get(id);
                  if (inode === void 0) {
                    throw ApiError.ENOENT(p);
                  }
                  return Inode.fromBuffer(inode);
                };
                SyncKeyValueFileSystem2.prototype.getDirListing =
                  function getDirListing(tx, p, inode) {
                    if (!inode.isDirectory()) {
                      throw ApiError.ENOTDIR(p);
                    }
                    var data = tx.get(inode.id);
                    if (data === void 0) {
                      throw ApiError.ENOENT(p);
                    }
                    return JSON.parse(data.toString());
                  };
                SyncKeyValueFileSystem2.prototype.addNewNode =
                  function addNewNode(tx, data) {
                    var retries = 0;
                    var currId;
                    while (retries < 5) {
                      try {
                        currId = GenerateRandomID();
                        tx.put(currId, data, false);
                        return currId;
                      } catch (e) {}
                    }
                    throw new ApiError(
                      ErrorCode.EIO,
                      "Unable to commit data to key-value store."
                    );
                  };
                SyncKeyValueFileSystem2.prototype.commitNewFile =
                  function commitNewFile(tx, p, type, mode, data) {
                    var parentDir = path2.dirname(p),
                      fname = path2.basename(p),
                      parentNode = this.findINode(tx, parentDir),
                      dirListing = this.getDirListing(
                        tx,
                        parentDir,
                        parentNode
                      ),
                      currTime = /* @__PURE__ */ new Date().getTime();
                    if (p === "/") {
                      throw ApiError.EEXIST(p);
                    }
                    if (dirListing[fname]) {
                      throw ApiError.EEXIST(p);
                    }
                    var fileNode;
                    try {
                      var dataId = this.addNewNode(tx, data);
                      fileNode = new Inode(
                        dataId,
                        data.length,
                        mode | type,
                        currTime,
                        currTime,
                        currTime
                      );
                      var fileNodeId = this.addNewNode(tx, fileNode.toBuffer());
                      dirListing[fname] = fileNodeId;
                      tx.put(
                        parentNode.id,
                        Buffer2.from(JSON.stringify(dirListing)),
                        true
                      );
                    } catch (e) {
                      tx.abort();
                      throw e;
                    }
                    tx.commit();
                    return fileNode;
                  };
                SyncKeyValueFileSystem2.prototype.removeEntry =
                  function removeEntry(p, isDir) {
                    var tx = this.store.beginTransaction("readwrite"),
                      parent = path2.dirname(p),
                      parentNode = this.findINode(tx, parent),
                      parentListing = this.getDirListing(
                        tx,
                        parent,
                        parentNode
                      ),
                      fileName = path2.basename(p);
                    if (!parentListing[fileName]) {
                      throw ApiError.ENOENT(p);
                    }
                    var fileNodeId = parentListing[fileName];
                    delete parentListing[fileName];
                    var fileNode = this.getINode(tx, p, fileNodeId);
                    if (!isDir && fileNode.isDirectory()) {
                      throw ApiError.EISDIR(p);
                    } else if (isDir && !fileNode.isDirectory()) {
                      throw ApiError.ENOTDIR(p);
                    }
                    try {
                      tx.del(fileNode.id);
                      tx.del(fileNodeId);
                      tx.put(
                        parentNode.id,
                        Buffer2.from(JSON.stringify(parentListing)),
                        true
                      );
                    } catch (e) {
                      tx.abort();
                      throw e;
                    }
                    tx.commit();
                  };
                return SyncKeyValueFileSystem2;
              })(SynchronousFileSystem);
              var AsyncKeyValueFile = (function (PreloadFile$$1) {
                function AsyncKeyValueFile2(
                  _fs,
                  _path,
                  _flag,
                  _stat,
                  contents
                ) {
                  PreloadFile$$1.call(this, _fs, _path, _flag, _stat, contents);
                }
                if (PreloadFile$$1)
                  AsyncKeyValueFile2.__proto__ = PreloadFile$$1;
                AsyncKeyValueFile2.prototype = Object.create(
                  PreloadFile$$1 && PreloadFile$$1.prototype
                );
                AsyncKeyValueFile2.prototype.constructor = AsyncKeyValueFile2;
                AsyncKeyValueFile2.prototype.sync = function sync(cb) {
                  var this$1$1 = this;
                  if (this.isDirty()) {
                    this._fs._sync(
                      this.getPath(),
                      this.getBuffer(),
                      this.getStats(),
                      function (e) {
                        if (!e) {
                          this$1$1.resetDirty();
                        }
                        cb(e);
                      }
                    );
                  } else {
                    cb();
                  }
                };
                AsyncKeyValueFile2.prototype.close = function close(cb) {
                  this.sync(cb);
                };
                return AsyncKeyValueFile2;
              })(PreloadFile);
              var AsyncKeyValueFileSystem = (function (BaseFileSystem$$1) {
                function AsyncKeyValueFileSystem2() {
                  BaseFileSystem$$1.apply(this, arguments);
                }
                if (BaseFileSystem$$1)
                  AsyncKeyValueFileSystem2.__proto__ = BaseFileSystem$$1;
                AsyncKeyValueFileSystem2.prototype = Object.create(
                  BaseFileSystem$$1 && BaseFileSystem$$1.prototype
                );
                AsyncKeyValueFileSystem2.prototype.constructor =
                  AsyncKeyValueFileSystem2;
                AsyncKeyValueFileSystem2.isAvailable = function isAvailable() {
                  return true;
                };
                AsyncKeyValueFileSystem2.prototype.init = function init(
                  store,
                  cb
                ) {
                  this.store = store;
                  this.makeRootDirectory(cb);
                };
                AsyncKeyValueFileSystem2.prototype.getName =
                  function getName() {
                    return this.store.name();
                  };
                AsyncKeyValueFileSystem2.prototype.isReadOnly =
                  function isReadOnly() {
                    return false;
                  };
                AsyncKeyValueFileSystem2.prototype.supportsSymlinks =
                  function supportsSymlinks() {
                    return false;
                  };
                AsyncKeyValueFileSystem2.prototype.supportsProps =
                  function supportsProps() {
                    return false;
                  };
                AsyncKeyValueFileSystem2.prototype.supportsSynch =
                  function supportsSynch() {
                    return false;
                  };
                AsyncKeyValueFileSystem2.prototype.empty = function empty(cb) {
                  var this$1$1 = this;
                  this.store.clear(function (e) {
                    if (noError(e, cb)) {
                      this$1$1.makeRootDirectory(cb);
                    }
                  });
                };
                AsyncKeyValueFileSystem2.prototype.rename = function rename(
                  oldPath,
                  newPath,
                  cb
                ) {
                  var this$1$1 = this;
                  var tx = this.store.beginTransaction("readwrite");
                  var oldParent = path2.dirname(oldPath),
                    oldName = path2.basename(oldPath);
                  var newParent = path2.dirname(newPath),
                    newName = path2.basename(newPath);
                  var inodes = {};
                  var lists = {};
                  var errorOccurred = false;
                  if ((newParent + "/").indexOf(oldPath + "/") === 0) {
                    return cb(new ApiError(ErrorCode.EBUSY, oldParent));
                  }
                  var theOleSwitcharoo = function () {
                    if (
                      errorOccurred ||
                      !lists.hasOwnProperty(oldParent) ||
                      !lists.hasOwnProperty(newParent)
                    ) {
                      return;
                    }
                    var oldParentList = lists[oldParent],
                      oldParentINode = inodes[oldParent],
                      newParentList = lists[newParent],
                      newParentINode = inodes[newParent];
                    if (!oldParentList[oldName]) {
                      cb(ApiError.ENOENT(oldPath));
                    } else {
                      var fileId = oldParentList[oldName];
                      delete oldParentList[oldName];
                      var completeRename = function () {
                        newParentList[newName] = fileId;
                        tx.put(
                          oldParentINode.id,
                          Buffer2.from(JSON.stringify(oldParentList)),
                          true,
                          function (e) {
                            if (noErrorTx(e, tx, cb)) {
                              if (oldParent === newParent) {
                                tx.commit(cb);
                              } else {
                                tx.put(
                                  newParentINode.id,
                                  Buffer2.from(JSON.stringify(newParentList)),
                                  true,
                                  function (e2) {
                                    if (noErrorTx(e2, tx, cb)) {
                                      tx.commit(cb);
                                    }
                                  }
                                );
                              }
                            }
                          }
                        );
                      };
                      if (newParentList[newName]) {
                        this$1$1.getINode(
                          tx,
                          newPath,
                          newParentList[newName],
                          function (e, inode) {
                            if (noErrorTx(e, tx, cb)) {
                              if (inode.isFile()) {
                                tx.del(inode.id, function (e2) {
                                  if (noErrorTx(e2, tx, cb)) {
                                    tx.del(
                                      newParentList[newName],
                                      function (e3) {
                                        if (noErrorTx(e3, tx, cb)) {
                                          completeRename();
                                        }
                                      }
                                    );
                                  }
                                });
                              } else {
                                tx.abort(function (e2) {
                                  cb(ApiError.EPERM(newPath));
                                });
                              }
                            }
                          }
                        );
                      } else {
                        completeRename();
                      }
                    }
                  };
                  var processInodeAndListings = function (p) {
                    this$1$1.findINodeAndDirListing(
                      tx,
                      p,
                      function (e, node, dirList) {
                        if (e) {
                          if (!errorOccurred) {
                            errorOccurred = true;
                            tx.abort(function () {
                              cb(e);
                            });
                          }
                        } else {
                          inodes[p] = node;
                          lists[p] = dirList;
                          theOleSwitcharoo();
                        }
                      }
                    );
                  };
                  processInodeAndListings(oldParent);
                  if (oldParent !== newParent) {
                    processInodeAndListings(newParent);
                  }
                };
                AsyncKeyValueFileSystem2.prototype.stat = function stat(
                  p,
                  isLstat,
                  cb
                ) {
                  var tx = this.store.beginTransaction("readonly");
                  this.findINode(tx, p, function (e, inode) {
                    if (noError(e, cb)) {
                      cb(null, inode.toStats());
                    }
                  });
                };
                AsyncKeyValueFileSystem2.prototype.createFile =
                  function createFile(p, flag, mode, cb) {
                    var this$1$1 = this;
                    var tx = this.store.beginTransaction("readwrite"),
                      data = emptyBuffer();
                    this.commitNewFile(
                      tx,
                      p,
                      FileType.FILE,
                      mode,
                      data,
                      function (e, newFile) {
                        if (noError(e, cb)) {
                          cb(
                            null,
                            new AsyncKeyValueFile(
                              this$1$1,
                              p,
                              flag,
                              newFile.toStats(),
                              data
                            )
                          );
                        }
                      }
                    );
                  };
                AsyncKeyValueFileSystem2.prototype.openFile = function openFile(
                  p,
                  flag,
                  cb
                ) {
                  var this$1$1 = this;
                  var tx = this.store.beginTransaction("readonly");
                  this.findINode(tx, p, function (e, inode) {
                    if (noError(e, cb)) {
                      tx.get(inode.id, function (e2, data) {
                        if (noError(e2, cb)) {
                          if (data === void 0) {
                            cb(ApiError.ENOENT(p));
                          } else {
                            cb(
                              null,
                              new AsyncKeyValueFile(
                                this$1$1,
                                p,
                                flag,
                                inode.toStats(),
                                data
                              )
                            );
                          }
                        }
                      });
                    }
                  });
                };
                AsyncKeyValueFileSystem2.prototype.unlink = function unlink(
                  p,
                  cb
                ) {
                  this.removeEntry(p, false, cb);
                };
                AsyncKeyValueFileSystem2.prototype.rmdir = function rmdir(
                  p,
                  cb
                ) {
                  var this$1$1 = this;
                  this.readdir(p, function (err, files) {
                    if (err) {
                      cb(err);
                    } else if (files.length > 0) {
                      cb(ApiError.ENOTEMPTY(p));
                    } else {
                      this$1$1.removeEntry(p, true, cb);
                    }
                  });
                };
                AsyncKeyValueFileSystem2.prototype.mkdir = function mkdir(
                  p,
                  mode,
                  cb
                ) {
                  var tx = this.store.beginTransaction("readwrite"),
                    data = Buffer2.from("{}");
                  this.commitNewFile(tx, p, FileType.DIRECTORY, mode, data, cb);
                };
                AsyncKeyValueFileSystem2.prototype.readdir = function readdir(
                  p,
                  cb
                ) {
                  var this$1$1 = this;
                  var tx = this.store.beginTransaction("readonly");
                  this.findINode(tx, p, function (e, inode) {
                    if (noError(e, cb)) {
                      this$1$1.getDirListing(
                        tx,
                        p,
                        inode,
                        function (e2, dirListing) {
                          if (noError(e2, cb)) {
                            cb(null, Object.keys(dirListing));
                          }
                        }
                      );
                    }
                  });
                };
                AsyncKeyValueFileSystem2.prototype._sync = function _sync(
                  p,
                  data,
                  stats,
                  cb
                ) {
                  var this$1$1 = this;
                  var tx = this.store.beginTransaction("readwrite");
                  this._findINode(
                    tx,
                    path2.dirname(p),
                    path2.basename(p),
                    function (e, fileInodeId) {
                      if (noErrorTx(e, tx, cb)) {
                        this$1$1.getINode(
                          tx,
                          p,
                          fileInodeId,
                          function (e2, fileInode) {
                            if (noErrorTx(e2, tx, cb)) {
                              var inodeChanged = fileInode.update(stats);
                              tx.put(fileInode.id, data, true, function (e3) {
                                if (noErrorTx(e3, tx, cb)) {
                                  if (inodeChanged) {
                                    tx.put(
                                      fileInodeId,
                                      fileInode.toBuffer(),
                                      true,
                                      function (e4) {
                                        if (noErrorTx(e4, tx, cb)) {
                                          tx.commit(cb);
                                        }
                                      }
                                    );
                                  } else {
                                    tx.commit(cb);
                                  }
                                }
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                };
                AsyncKeyValueFileSystem2.prototype.makeRootDirectory =
                  function makeRootDirectory(cb) {
                    var tx = this.store.beginTransaction("readwrite");
                    tx.get(ROOT_NODE_ID, function (e, data) {
                      if (e || data === void 0) {
                        var currTime = /* @__PURE__ */ new Date().getTime(),
                          dirInode = new Inode(
                            GenerateRandomID(),
                            4096,
                            511 | FileType.DIRECTORY,
                            currTime,
                            currTime,
                            currTime
                          );
                        tx.put(
                          dirInode.id,
                          getEmptyDirNode(),
                          false,
                          function (e2) {
                            if (noErrorTx(e2, tx, cb)) {
                              tx.put(
                                ROOT_NODE_ID,
                                dirInode.toBuffer(),
                                false,
                                function (e3) {
                                  if (e3) {
                                    tx.abort(function () {
                                      cb(e3);
                                    });
                                  } else {
                                    tx.commit(cb);
                                  }
                                }
                              );
                            }
                          }
                        );
                      } else {
                        tx.commit(cb);
                      }
                    });
                  };
                AsyncKeyValueFileSystem2.prototype._findINode =
                  function _findINode(tx, parent, filename, cb) {
                    var this$1$1 = this;
                    var handleDirectoryListings = function (e, inode, dirList) {
                      if (e) {
                        cb(e);
                      } else if (dirList[filename]) {
                        cb(null, dirList[filename]);
                      } else {
                        cb(ApiError.ENOENT(path2.resolve(parent, filename)));
                      }
                    };
                    if (parent === "/") {
                      if (filename === "") {
                        cb(null, ROOT_NODE_ID);
                      } else {
                        this.getINode(
                          tx,
                          parent,
                          ROOT_NODE_ID,
                          function (e, inode) {
                            if (noError(e, cb)) {
                              this$1$1.getDirListing(
                                tx,
                                parent,
                                inode,
                                function (e2, dirList) {
                                  handleDirectoryListings(e2, inode, dirList);
                                }
                              );
                            }
                          }
                        );
                      }
                    } else {
                      this.findINodeAndDirListing(
                        tx,
                        parent,
                        handleDirectoryListings
                      );
                    }
                  };
                AsyncKeyValueFileSystem2.prototype.findINode =
                  function findINode(tx, p, cb) {
                    var this$1$1 = this;
                    this._findINode(
                      tx,
                      path2.dirname(p),
                      path2.basename(p),
                      function (e, id) {
                        if (noError(e, cb)) {
                          this$1$1.getINode(tx, p, id, cb);
                        }
                      }
                    );
                  };
                AsyncKeyValueFileSystem2.prototype.getINode = function getINode(
                  tx,
                  p,
                  id,
                  cb
                ) {
                  tx.get(id, function (e, data) {
                    if (noError(e, cb)) {
                      if (data === void 0) {
                        cb(ApiError.ENOENT(p));
                      } else {
                        cb(null, Inode.fromBuffer(data));
                      }
                    }
                  });
                };
                AsyncKeyValueFileSystem2.prototype.getDirListing =
                  function getDirListing(tx, p, inode, cb) {
                    if (!inode.isDirectory()) {
                      cb(ApiError.ENOTDIR(p));
                    } else {
                      tx.get(inode.id, function (e, data) {
                        if (noError(e, cb)) {
                          try {
                            cb(null, JSON.parse(data.toString()));
                          } catch (e2) {
                            cb(ApiError.ENOENT(p));
                          }
                        }
                      });
                    }
                  };
                AsyncKeyValueFileSystem2.prototype.findINodeAndDirListing =
                  function findINodeAndDirListing(tx, p, cb) {
                    var this$1$1 = this;
                    this.findINode(tx, p, function (e, inode) {
                      if (noError(e, cb)) {
                        this$1$1.getDirListing(
                          tx,
                          p,
                          inode,
                          function (e2, listing) {
                            if (noError(e2, cb)) {
                              cb(null, inode, listing);
                            }
                          }
                        );
                      }
                    });
                  };
                AsyncKeyValueFileSystem2.prototype.addNewNode =
                  function addNewNode(tx, data, cb) {
                    var retries = 0,
                      currId;
                    var reroll = function () {
                      if (++retries === 5) {
                        cb(
                          new ApiError(
                            ErrorCode.EIO,
                            "Unable to commit data to key-value store."
                          )
                        );
                      } else {
                        currId = GenerateRandomID();
                        tx.put(currId, data, false, function (e, committed) {
                          if (e || !committed) {
                            reroll();
                          } else {
                            cb(null, currId);
                          }
                        });
                      }
                    };
                    reroll();
                  };
                AsyncKeyValueFileSystem2.prototype.commitNewFile =
                  function commitNewFile(tx, p, type, mode, data, cb) {
                    var this$1$1 = this;
                    var parentDir = path2.dirname(p),
                      fname = path2.basename(p),
                      currTime = /* @__PURE__ */ new Date().getTime();
                    if (p === "/") {
                      return cb(ApiError.EEXIST(p));
                    }
                    this.findINodeAndDirListing(
                      tx,
                      parentDir,
                      function (e, parentNode, dirListing) {
                        if (noErrorTx(e, tx, cb)) {
                          if (dirListing[fname]) {
                            tx.abort(function () {
                              cb(ApiError.EEXIST(p));
                            });
                          } else {
                            this$1$1.addNewNode(
                              tx,
                              data,
                              function (e2, dataId) {
                                if (noErrorTx(e2, tx, cb)) {
                                  var fileInode = new Inode(
                                    dataId,
                                    data.length,
                                    mode | type,
                                    currTime,
                                    currTime,
                                    currTime
                                  );
                                  this$1$1.addNewNode(
                                    tx,
                                    fileInode.toBuffer(),
                                    function (e3, fileInodeId) {
                                      if (noErrorTx(e3, tx, cb)) {
                                        dirListing[fname] = fileInodeId;
                                        tx.put(
                                          parentNode.id,
                                          Buffer2.from(
                                            JSON.stringify(dirListing)
                                          ),
                                          true,
                                          function (e4) {
                                            if (noErrorTx(e4, tx, cb)) {
                                              tx.commit(function (e5) {
                                                if (noErrorTx(e5, tx, cb)) {
                                                  cb(null, fileInode);
                                                }
                                              });
                                            }
                                          }
                                        );
                                      }
                                    }
                                  );
                                }
                              }
                            );
                          }
                        }
                      }
                    );
                  };
                AsyncKeyValueFileSystem2.prototype.removeEntry =
                  function removeEntry(p, isDir, cb) {
                    var this$1$1 = this;
                    var tx = this.store.beginTransaction("readwrite"),
                      parent = path2.dirname(p),
                      fileName = path2.basename(p);
                    this.findINodeAndDirListing(
                      tx,
                      parent,
                      function (e, parentNode, parentListing) {
                        if (noErrorTx(e, tx, cb)) {
                          if (!parentListing[fileName]) {
                            tx.abort(function () {
                              cb(ApiError.ENOENT(p));
                            });
                          } else {
                            var fileNodeId = parentListing[fileName];
                            delete parentListing[fileName];
                            this$1$1.getINode(
                              tx,
                              p,
                              fileNodeId,
                              function (e2, fileNode) {
                                if (noErrorTx(e2, tx, cb)) {
                                  if (!isDir && fileNode.isDirectory()) {
                                    tx.abort(function () {
                                      cb(ApiError.EISDIR(p));
                                    });
                                  } else if (isDir && !fileNode.isDirectory()) {
                                    tx.abort(function () {
                                      cb(ApiError.ENOTDIR(p));
                                    });
                                  } else {
                                    tx.del(fileNode.id, function (e3) {
                                      if (noErrorTx(e3, tx, cb)) {
                                        tx.del(fileNodeId, function (e4) {
                                          if (noErrorTx(e4, tx, cb)) {
                                            tx.put(
                                              parentNode.id,
                                              Buffer2.from(
                                                JSON.stringify(parentListing)
                                              ),
                                              true,
                                              function (e5) {
                                                if (noErrorTx(e5, tx, cb)) {
                                                  tx.commit(cb);
                                                }
                                              }
                                            );
                                          }
                                        });
                                      }
                                    });
                                  }
                                }
                              }
                            );
                          }
                        }
                      }
                    );
                  };
                return AsyncKeyValueFileSystem2;
              })(BaseFileSystem);
              var InMemoryStore = function InMemoryStore2() {
                this.store = {};
              };
              InMemoryStore.prototype.name = function name2() {
                return InMemoryFileSystem.Name;
              };
              InMemoryStore.prototype.clear = function clear() {
                this.store = {};
              };
              InMemoryStore.prototype.beginTransaction =
                function beginTransaction(type) {
                  return new SimpleSyncRWTransaction(this);
                };
              InMemoryStore.prototype.get = function get(key) {
                return this.store[key];
              };
              InMemoryStore.prototype.put = function put(key, data, overwrite) {
                if (!overwrite && this.store.hasOwnProperty(key)) {
                  return false;
                }
                this.store[key] = data;
                return true;
              };
              InMemoryStore.prototype.del = function del(key) {
                delete this.store[key];
              };
              var InMemoryFileSystem = (function (SyncKeyValueFileSystem$$1) {
                function InMemoryFileSystem2() {
                  SyncKeyValueFileSystem$$1.call(this, {
                    store: new InMemoryStore(),
                  });
                }
                if (SyncKeyValueFileSystem$$1)
                  InMemoryFileSystem2.__proto__ = SyncKeyValueFileSystem$$1;
                InMemoryFileSystem2.prototype = Object.create(
                  SyncKeyValueFileSystem$$1 &&
                    SyncKeyValueFileSystem$$1.prototype
                );
                InMemoryFileSystem2.prototype.constructor = InMemoryFileSystem2;
                InMemoryFileSystem2.Create = function Create(options, cb) {
                  cb(null, new InMemoryFileSystem2());
                };
                return InMemoryFileSystem2;
              })(SyncKeyValueFileSystem);
              InMemoryFileSystem.Name = "InMemory";
              InMemoryFileSystem.Options = {};
              var indexedDB =
                global$1.indexedDB ||
                global$1.mozIndexedDB ||
                global$1.webkitIndexedDB ||
                global$1.msIndexedDB;
              function convertError$2(e, message) {
                if (message === void 0) message = e.toString();
                switch (e.name) {
                  case "NotFoundError":
                    return new ApiError(ErrorCode.ENOENT, message);
                  case "QuotaExceededError":
                    return new ApiError(ErrorCode.ENOSPC, message);
                  default:
                    return new ApiError(ErrorCode.EIO, message);
                }
              }
              function onErrorHandler(cb, code, message) {
                if (code === void 0) code = ErrorCode.EIO;
                if (message === void 0) message = null;
                return function (e) {
                  e.preventDefault();
                  cb(new ApiError(code, message !== null ? message : void 0));
                };
              }
              var IndexedDBROTransaction = function IndexedDBROTransaction2(
                tx,
                store
              ) {
                this.tx = tx;
                this.store = store;
              };
              IndexedDBROTransaction.prototype.get = function get(key, cb) {
                try {
                  var r = this.store.get(key);
                  r.onerror = onErrorHandler(cb);
                  r.onsuccess = function (event) {
                    var result = event.target.result;
                    if (result === void 0) {
                      cb(null, result);
                    } else {
                      cb(null, arrayBuffer2Buffer(result));
                    }
                  };
                } catch (e) {
                  cb(convertError$2(e));
                }
              };
              var IndexedDBRWTransaction = (function (IndexedDBROTransaction2) {
                function IndexedDBRWTransaction2(tx, store) {
                  IndexedDBROTransaction2.call(this, tx, store);
                }
                if (IndexedDBROTransaction2)
                  IndexedDBRWTransaction2.__proto__ = IndexedDBROTransaction2;
                IndexedDBRWTransaction2.prototype = Object.create(
                  IndexedDBROTransaction2 && IndexedDBROTransaction2.prototype
                );
                IndexedDBRWTransaction2.prototype.constructor =
                  IndexedDBRWTransaction2;
                IndexedDBRWTransaction2.prototype.put = function put(
                  key,
                  data,
                  overwrite,
                  cb
                ) {
                  try {
                    var arraybuffer = buffer2ArrayBuffer(data);
                    var r;
                    if (overwrite) {
                      r = this.store.put(arraybuffer, key);
                    } else {
                      r = this.store.add(arraybuffer, key);
                    }
                    r.onerror = onErrorHandler(cb);
                    r.onsuccess = function (event) {
                      cb(null, true);
                    };
                  } catch (e) {
                    cb(convertError$2(e));
                  }
                };
                IndexedDBRWTransaction2.prototype.del = function del(key, cb) {
                  try {
                    var r = this.store["delete"](key);
                    r.onerror = onErrorHandler(cb);
                    r.onsuccess = function (event) {
                      cb();
                    };
                  } catch (e) {
                    cb(convertError$2(e));
                  }
                };
                IndexedDBRWTransaction2.prototype.commit = function commit(cb) {
                  setTimeout(cb, 0);
                };
                IndexedDBRWTransaction2.prototype.abort = function abort(cb) {
                  var _e = null;
                  try {
                    this.tx.abort();
                  } catch (e) {
                    _e = convertError$2(e);
                  } finally {
                    cb(_e);
                  }
                };
                return IndexedDBRWTransaction2;
              })(IndexedDBROTransaction);
              var IndexedDBStore = function IndexedDBStore2(cb, storeName) {
                var this$1$1 = this;
                if (storeName === void 0) storeName = "browserfs";
                this.storeName = storeName;
                var openReq = indexedDB.open(this.storeName, 1);
                openReq.onupgradeneeded = function (event) {
                  var db = event.target.result;
                  if (db.objectStoreNames.contains(this$1$1.storeName)) {
                    db.deleteObjectStore(this$1$1.storeName);
                  }
                  db.createObjectStore(this$1$1.storeName);
                };
                openReq.onsuccess = function (event) {
                  this$1$1.db = event.target.result;
                  cb(null, this$1$1);
                };
                openReq.onerror = onErrorHandler(cb, ErrorCode.EACCES);
              };
              IndexedDBStore.prototype.name = function name2() {
                return IndexedDBFileSystem.Name + " - " + this.storeName;
              };
              IndexedDBStore.prototype.clear = function clear(cb) {
                try {
                  var tx = this.db.transaction(this.storeName, "readwrite"),
                    objectStore = tx.objectStore(this.storeName),
                    r = objectStore.clear();
                  r.onsuccess = function (event) {
                    setTimeout(cb, 0);
                  };
                  r.onerror = onErrorHandler(cb);
                } catch (e) {
                  cb(convertError$2(e));
                }
              };
              IndexedDBStore.prototype.beginTransaction =
                function beginTransaction(type) {
                  if (type === void 0) type = "readonly";
                  var tx = this.db.transaction(this.storeName, type),
                    objectStore = tx.objectStore(this.storeName);
                  if (type === "readwrite") {
                    return new IndexedDBRWTransaction(tx, objectStore);
                  } else if (type === "readonly") {
                    return new IndexedDBROTransaction(tx, objectStore);
                  } else {
                    throw new ApiError(
                      ErrorCode.EINVAL,
                      "Invalid transaction type."
                    );
                  }
                };
              var IndexedDBFileSystem = (function (AsyncKeyValueFileSystem$$1) {
                function IndexedDBFileSystem2(cb, storeName, deprecateMsg) {
                  var this$1$1 = this;
                  if (deprecateMsg === void 0) deprecateMsg = true;
                  AsyncKeyValueFileSystem$$1.call(this);
                  this.store = new IndexedDBStore(function (e) {
                    if (e) {
                      cb(e);
                    } else {
                      this$1$1.init(this$1$1.store, function (e2) {
                        cb(e2, this$1$1);
                      });
                    }
                  }, storeName);
                  deprecationMessage(deprecateMsg, IndexedDBFileSystem2.Name, {
                    storeName,
                  });
                }
                if (AsyncKeyValueFileSystem$$1)
                  IndexedDBFileSystem2.__proto__ = AsyncKeyValueFileSystem$$1;
                IndexedDBFileSystem2.prototype = Object.create(
                  AsyncKeyValueFileSystem$$1 &&
                    AsyncKeyValueFileSystem$$1.prototype
                );
                IndexedDBFileSystem2.prototype.constructor =
                  IndexedDBFileSystem2;
                IndexedDBFileSystem2.Create = function Create(opts, cb) {
                  new IndexedDBFileSystem2(cb, opts.storeName, false);
                };
                IndexedDBFileSystem2.isAvailable = function isAvailable() {
                  try {
                    return (
                      typeof indexedDB !== "undefined" &&
                      null !== indexedDB.open("__browserfs_test__")
                    );
                  } catch (e) {
                    return false;
                  }
                };
                return IndexedDBFileSystem2;
              })(AsyncKeyValueFileSystem);
              IndexedDBFileSystem.Name = "IndexedDB";
              IndexedDBFileSystem.Options = {
                storeName: {
                  type: "string",
                  optional: true,
                  description:
                    "The name of this file system. You can have multiple IndexedDB file systems operating at once, but each must have a different name.",
                },
              };
              var supportsBinaryString = false;
              var binaryEncoding;
              try {
                global$1.localStorage.setItem(
                  "__test__",
                  String.fromCharCode(55296)
                );
                supportsBinaryString =
                  global$1.localStorage.getItem("__test__") ===
                  String.fromCharCode(55296);
              } catch (e) {
                supportsBinaryString = false;
              }
              binaryEncoding = supportsBinaryString
                ? "binary_string"
                : "binary_string_ie";
              if (!Buffer2.isEncoding(binaryEncoding)) {
                binaryEncoding = "base64";
              }
              var LocalStorageStore = function LocalStorageStore2() {};
              LocalStorageStore.prototype.name = function name2() {
                return LocalStorageFileSystem.Name;
              };
              LocalStorageStore.prototype.clear = function clear() {
                global$1.localStorage.clear();
              };
              LocalStorageStore.prototype.beginTransaction =
                function beginTransaction(type) {
                  return new SimpleSyncRWTransaction(this);
                };
              LocalStorageStore.prototype.get = function get(key) {
                try {
                  var data = global$1.localStorage.getItem(key);
                  if (data !== null) {
                    return Buffer2.from(data, binaryEncoding);
                  }
                } catch (e) {}
                return void 0;
              };
              LocalStorageStore.prototype.put = function put(
                key,
                data,
                overwrite
              ) {
                try {
                  if (
                    !overwrite &&
                    global$1.localStorage.getItem(key) !== null
                  ) {
                    return false;
                  }
                  global$1.localStorage.setItem(
                    key,
                    data.toString(binaryEncoding)
                  );
                  return true;
                } catch (e) {
                  throw new ApiError(ErrorCode.ENOSPC, "LocalStorage is full.");
                }
              };
              LocalStorageStore.prototype.del = function del(key) {
                try {
                  global$1.localStorage.removeItem(key);
                } catch (e) {
                  throw new ApiError(
                    ErrorCode.EIO,
                    "Unable to delete key " + key + ": " + e
                  );
                }
              };
              var LocalStorageFileSystem = (function (
                SyncKeyValueFileSystem$$1
              ) {
                function LocalStorageFileSystem2() {
                  SyncKeyValueFileSystem$$1.call(this, {
                    store: new LocalStorageStore(),
                  });
                }
                if (SyncKeyValueFileSystem$$1)
                  LocalStorageFileSystem2.__proto__ = SyncKeyValueFileSystem$$1;
                LocalStorageFileSystem2.prototype = Object.create(
                  SyncKeyValueFileSystem$$1 &&
                    SyncKeyValueFileSystem$$1.prototype
                );
                LocalStorageFileSystem2.prototype.constructor =
                  LocalStorageFileSystem2;
                LocalStorageFileSystem2.Create = function Create(options, cb) {
                  cb(null, new LocalStorageFileSystem2());
                };
                LocalStorageFileSystem2.isAvailable = function isAvailable() {
                  return typeof global$1.localStorage !== "undefined";
                };
                return LocalStorageFileSystem2;
              })(SyncKeyValueFileSystem);
              LocalStorageFileSystem.Name = "LocalStorage";
              LocalStorageFileSystem.Options = {};
              var MountableFileSystem = (function (BaseFileSystem$$1) {
                function MountableFileSystem2() {
                  BaseFileSystem$$1.call(this);
                  this.mountList = [];
                  this.mntMap = {};
                  this.rootFs = new InMemoryFileSystem();
                }
                if (BaseFileSystem$$1)
                  MountableFileSystem2.__proto__ = BaseFileSystem$$1;
                MountableFileSystem2.prototype = Object.create(
                  BaseFileSystem$$1 && BaseFileSystem$$1.prototype
                );
                MountableFileSystem2.prototype.constructor =
                  MountableFileSystem2;
                MountableFileSystem2.Create = function Create(opts, cb) {
                  var fs2 = new MountableFileSystem2();
                  Object.keys(opts).forEach(function (mountPoint) {
                    fs2.mount(mountPoint, opts[mountPoint]);
                  });
                  cb(null, fs2);
                };
                MountableFileSystem2.isAvailable = function isAvailable() {
                  return true;
                };
                MountableFileSystem2.prototype.mount = function mount(
                  mountPoint,
                  fs2
                ) {
                  if (mountPoint[0] !== "/") {
                    mountPoint = "/" + mountPoint;
                  }
                  mountPoint = path2.resolve(mountPoint);
                  if (this.mntMap[mountPoint]) {
                    throw new ApiError(
                      ErrorCode.EINVAL,
                      "Mount point " + mountPoint + " is already taken."
                    );
                  }
                  mkdirpSync(mountPoint, 511, this.rootFs);
                  this.mntMap[mountPoint] = fs2;
                  this.mountList.push(mountPoint);
                  this.mountList = this.mountList.sort(function (a, b) {
                    return b.length - a.length;
                  });
                };
                MountableFileSystem2.prototype.umount = function umount(
                  mountPoint
                ) {
                  var this$1$1 = this;
                  if (mountPoint[0] !== "/") {
                    mountPoint = "/" + mountPoint;
                  }
                  mountPoint = path2.resolve(mountPoint);
                  if (!this.mntMap[mountPoint]) {
                    throw new ApiError(
                      ErrorCode.EINVAL,
                      "Mount point " + mountPoint + " is already unmounted."
                    );
                  }
                  delete this.mntMap[mountPoint];
                  this.mountList.splice(this.mountList.indexOf(mountPoint), 1);
                  while (mountPoint !== "/") {
                    if (this$1$1.rootFs.readdirSync(mountPoint).length === 0) {
                      this$1$1.rootFs.rmdirSync(mountPoint);
                      mountPoint = path2.dirname(mountPoint);
                    } else {
                      break;
                    }
                  }
                };
                MountableFileSystem2.prototype._getFs = function _getFs(
                  path$$1
                ) {
                  var this$1$1 = this;
                  var mountList = this.mountList,
                    len = mountList.length;
                  for (var i2 = 0; i2 < len; i2++) {
                    var mountPoint = mountList[i2];
                    if (
                      mountPoint.length <= path$$1.length &&
                      path$$1.indexOf(mountPoint) === 0
                    ) {
                      path$$1 = path$$1.substr(
                        mountPoint.length > 1 ? mountPoint.length : 0
                      );
                      if (path$$1 === "") {
                        path$$1 = "/";
                      }
                      return { fs: this$1$1.mntMap[mountPoint], path: path$$1 };
                    }
                  }
                  return { fs: this.rootFs, path: path$$1 };
                };
                MountableFileSystem2.prototype.getName = function getName() {
                  return MountableFileSystem2.Name;
                };
                MountableFileSystem2.prototype.diskSpace = function diskSpace(
                  path$$1,
                  cb
                ) {
                  cb(0, 0);
                };
                MountableFileSystem2.prototype.isReadOnly =
                  function isReadOnly() {
                    return false;
                  };
                MountableFileSystem2.prototype.supportsLinks =
                  function supportsLinks() {
                    return false;
                  };
                MountableFileSystem2.prototype.supportsProps =
                  function supportsProps() {
                    return false;
                  };
                MountableFileSystem2.prototype.supportsSynch =
                  function supportsSynch() {
                    return true;
                  };
                MountableFileSystem2.prototype.standardizeError =
                  function standardizeError(err, path$$1, realPath) {
                    var index = err.message.indexOf(path$$1);
                    if (index !== -1) {
                      err.message =
                        err.message.substr(0, index) +
                        realPath +
                        err.message.substr(index + path$$1.length);
                      err.path = realPath;
                    }
                    return err;
                  };
                MountableFileSystem2.prototype.rename = function rename(
                  oldPath,
                  newPath,
                  cb
                ) {
                  var this$1$1 = this;
                  var fs1rv = this._getFs(oldPath);
                  var fs2rv = this._getFs(newPath);
                  if (fs1rv.fs === fs2rv.fs) {
                    return fs1rv.fs.rename(
                      fs1rv.path,
                      fs2rv.path,
                      function (e) {
                        if (e) {
                          this$1$1.standardizeError(
                            this$1$1.standardizeError(e, fs1rv.path, oldPath),
                            fs2rv.path,
                            newPath
                          );
                        }
                        cb(e);
                      }
                    );
                  }
                  return _fsMock.readFile(oldPath, function (err, data) {
                    if (err) {
                      return cb(err);
                    }
                    _fsMock.writeFile(newPath, data, function (err2) {
                      if (err2) {
                        return cb(err2);
                      }
                      _fsMock.unlink(oldPath, cb);
                    });
                  });
                };
                MountableFileSystem2.prototype.renameSync = function renameSync(
                  oldPath,
                  newPath
                ) {
                  var fs1rv = this._getFs(oldPath);
                  var fs2rv = this._getFs(newPath);
                  if (fs1rv.fs === fs2rv.fs) {
                    try {
                      return fs1rv.fs.renameSync(fs1rv.path, fs2rv.path);
                    } catch (e) {
                      this.standardizeError(
                        this.standardizeError(e, fs1rv.path, oldPath),
                        fs2rv.path,
                        newPath
                      );
                      throw e;
                    }
                  }
                  var data = _fsMock.readFileSync(oldPath);
                  _fsMock.writeFileSync(newPath, data);
                  return _fsMock.unlinkSync(oldPath);
                };
                MountableFileSystem2.prototype.readdirSync =
                  function readdirSync(p) {
                    var fsInfo = this._getFs(p);
                    var rv = null;
                    if (fsInfo.fs !== this.rootFs) {
                      try {
                        rv = this.rootFs.readdirSync(p);
                      } catch (e) {}
                    }
                    try {
                      var rv2 = fsInfo.fs.readdirSync(fsInfo.path);
                      if (rv === null) {
                        return rv2;
                      } else {
                        return rv2.concat(
                          rv.filter(function (val) {
                            return rv2.indexOf(val) === -1;
                          })
                        );
                      }
                    } catch (e) {
                      if (rv === null) {
                        throw this.standardizeError(e, fsInfo.path, p);
                      } else {
                        return rv;
                      }
                    }
                  };
                MountableFileSystem2.prototype.readdir = function readdir(
                  p,
                  cb
                ) {
                  var this$1$1 = this;
                  var fsInfo = this._getFs(p);
                  fsInfo.fs.readdir(fsInfo.path, function (err, files) {
                    if (fsInfo.fs !== this$1$1.rootFs) {
                      try {
                        var rv = this$1$1.rootFs.readdirSync(p);
                        if (files) {
                          files = files.concat(
                            rv.filter(function (val) {
                              return files.indexOf(val) === -1;
                            })
                          );
                        } else {
                          files = rv;
                        }
                      } catch (e) {
                        if (err) {
                          return cb(
                            this$1$1.standardizeError(err, fsInfo.path, p)
                          );
                        }
                      }
                    } else if (err) {
                      return cb(this$1$1.standardizeError(err, fsInfo.path, p));
                    }
                    cb(null, files);
                  });
                };
                MountableFileSystem2.prototype.rmdirSync = function rmdirSync(
                  p
                ) {
                  var fsInfo = this._getFs(p);
                  if (this._containsMountPt(p)) {
                    throw ApiError.ENOTEMPTY(p);
                  } else {
                    try {
                      fsInfo.fs.rmdirSync(fsInfo.path);
                    } catch (e) {
                      throw this.standardizeError(e, fsInfo.path, p);
                    }
                  }
                };
                MountableFileSystem2.prototype.rmdir = function rmdir(p, cb) {
                  var this$1$1 = this;
                  var fsInfo = this._getFs(p);
                  if (this._containsMountPt(p)) {
                    cb(ApiError.ENOTEMPTY(p));
                  } else {
                    fsInfo.fs.rmdir(fsInfo.path, function (err) {
                      cb(
                        err
                          ? this$1$1.standardizeError(err, fsInfo.path, p)
                          : null
                      );
                    });
                  }
                };
                MountableFileSystem2.prototype._containsMountPt =
                  function _containsMountPt(p) {
                    var mountPoints = this.mountList,
                      len = mountPoints.length;
                    for (var i2 = 0; i2 < len; i2++) {
                      var pt = mountPoints[i2];
                      if (
                        pt.length >= p.length &&
                        pt.slice(0, p.length) === p
                      ) {
                        return true;
                      }
                    }
                    return false;
                  };
                return MountableFileSystem2;
              })(BaseFileSystem);
              MountableFileSystem.Name = "MountableFileSystem";
              MountableFileSystem.Options = {};
              function defineFcn(name2, isSync, numArgs) {
                if (isSync) {
                  return function () {
                    var args = [],
                      len = arguments.length;
                    while (len--) args[len] = arguments[len];
                    var path$$1 = args[0];
                    var rv = this._getFs(path$$1);
                    args[0] = rv.path;
                    try {
                      return rv.fs[name2].apply(rv.fs, args);
                    } catch (e) {
                      this.standardizeError(e, rv.path, path$$1);
                      throw e;
                    }
                  };
                } else {
                  return function () {
                    var this$1$1 = this;
                    var args = [],
                      len = arguments.length;
                    while (len--) args[len] = arguments[len];
                    var path$$1 = args[0];
                    var rv = this._getFs(path$$1);
                    args[0] = rv.path;
                    if (typeof args[args.length - 1] === "function") {
                      var cb = args[args.length - 1];
                      args[args.length - 1] = function () {
                        var args2 = [],
                          len2 = arguments.length;
                        while (len2--) args2[len2] = arguments[len2];
                        if (args2.length > 0 && args2[0] instanceof ApiError) {
                          this$1$1.standardizeError(args2[0], rv.path, path$$1);
                        }
                        cb.apply(null, args2);
                      };
                    }
                    return rv.fs[name2].apply(rv.fs, args);
                  };
                }
              }
              var fsCmdMap = [
                // 1 arg functions
                ["exists", "unlink", "readlink"],
                // 2 arg functions
                ["stat", "mkdir", "realpath", "truncate"],
                // 3 arg functions
                ["open", "readFile", "chmod", "utimes"],
                // 4 arg functions
                ["chown"],
                // 5 arg functions
                ["writeFile", "appendFile"],
              ];
              for (var i = 0; i < fsCmdMap.length; i++) {
                var cmds = fsCmdMap[i];
                for (var i$1 = 0, list = cmds; i$1 < list.length; i$1 += 1) {
                  var fnName = list[i$1];
                  MountableFileSystem.prototype[fnName] = defineFcn(
                    fnName,
                    false
                  );
                  MountableFileSystem.prototype[fnName + "Sync"] = defineFcn(
                    fnName + "Sync",
                    true
                  );
                }
              }
              var bfsSetImmediate;
              if (typeof setImmediate !== "undefined") {
                bfsSetImmediate = setImmediate;
              } else {
                var gScope = global$1;
                var timeouts = [];
                var messageName = "zero-timeout-message";
                var canUsePostMessage = function () {
                  if (
                    typeof gScope.importScripts !== "undefined" ||
                    !gScope.postMessage
                  ) {
                    return false;
                  }
                  var postMessageIsAsync = true;
                  var oldOnMessage = gScope.onmessage;
                  gScope.onmessage = function () {
                    postMessageIsAsync = false;
                  };
                  gScope.postMessage("", "*");
                  gScope.onmessage = oldOnMessage;
                  return postMessageIsAsync;
                };
                if (canUsePostMessage()) {
                  bfsSetImmediate = function (fn) {
                    timeouts.push(fn);
                    gScope.postMessage(messageName, "*");
                  };
                  var handleMessage = function (event) {
                    if (event.source === self && event.data === messageName) {
                      if (event.stopPropagation) {
                        event.stopPropagation();
                      } else {
                        event.cancelBubble = true;
                      }
                      if (timeouts.length > 0) {
                        var fn = timeouts.shift();
                        return fn();
                      }
                    }
                  };
                  if (gScope.addEventListener) {
                    gScope.addEventListener("message", handleMessage, true);
                  } else {
                    gScope.attachEvent("onmessage", handleMessage);
                  }
                } else if (gScope.MessageChannel) {
                  var channel = new gScope.MessageChannel();
                  channel.port1.onmessage = function (event) {
                    if (timeouts.length > 0) {
                      return timeouts.shift()();
                    }
                  };
                  bfsSetImmediate = function (fn) {
                    timeouts.push(fn);
                    channel.port2.postMessage("");
                  };
                } else {
                  bfsSetImmediate = function (fn) {
                    return setTimeout(fn, 0);
                  };
                }
              }
              var setImmediate$3 = bfsSetImmediate;
              var Mutex = function Mutex2() {
                this._locked = false;
                this._waiters = [];
              };
              Mutex.prototype.lock = function lock(cb) {
                if (this._locked) {
                  this._waiters.push(cb);
                  return;
                }
                this._locked = true;
                cb();
              };
              Mutex.prototype.unlock = function unlock() {
                if (!this._locked) {
                  throw new Error("unlock of a non-locked mutex");
                }
                var next = this._waiters.shift();
                if (next) {
                  setImmediate$3(next);
                  return;
                }
                this._locked = false;
              };
              Mutex.prototype.tryLock = function tryLock() {
                if (this._locked) {
                  return false;
                }
                this._locked = true;
                return true;
              };
              Mutex.prototype.isLocked = function isLocked() {
                return this._locked;
              };
              var LockedFS = function LockedFS2(fs2) {
                this._fs = fs2;
                this._mu = new Mutex();
              };
              LockedFS.prototype.getName = function getName() {
                return "LockedFS<" + this._fs.getName() + ">";
              };
              LockedFS.prototype.getFSUnlocked = function getFSUnlocked() {
                return this._fs;
              };
              LockedFS.prototype.initialize = function initialize2(cb) {
                this._fs.initialize(cb);
              };
              LockedFS.prototype.diskSpace = function diskSpace(p, cb) {
                this._fs.diskSpace(p, cb);
              };
              LockedFS.prototype.isReadOnly = function isReadOnly() {
                return this._fs.isReadOnly();
              };
              LockedFS.prototype.supportsLinks = function supportsLinks() {
                return this._fs.supportsLinks();
              };
              LockedFS.prototype.supportsProps = function supportsProps() {
                return this._fs.supportsProps();
              };
              LockedFS.prototype.supportsSynch = function supportsSynch() {
                return this._fs.supportsSynch();
              };
              LockedFS.prototype.rename = function rename(
                oldPath,
                newPath,
                cb
              ) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.rename(oldPath, newPath, function (err) {
                    this$1$1._mu.unlock();
                    cb(err);
                  });
                });
              };
              LockedFS.prototype.renameSync = function renameSync(
                oldPath,
                newPath
              ) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.renameSync(oldPath, newPath);
              };
              LockedFS.prototype.stat = function stat(p, isLstat, cb) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.stat(p, isLstat, function (err, stat2) {
                    this$1$1._mu.unlock();
                    cb(err, stat2);
                  });
                });
              };
              LockedFS.prototype.statSync = function statSync(p, isLstat) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.statSync(p, isLstat);
              };
              LockedFS.prototype.open = function open(p, flag, mode, cb) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.open(p, flag, mode, function (err, fd) {
                    this$1$1._mu.unlock();
                    cb(err, fd);
                  });
                });
              };
              LockedFS.prototype.openSync = function openSync(p, flag, mode) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.openSync(p, flag, mode);
              };
              LockedFS.prototype.unlink = function unlink(p, cb) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.unlink(p, function (err) {
                    this$1$1._mu.unlock();
                    cb(err);
                  });
                });
              };
              LockedFS.prototype.unlinkSync = function unlinkSync(p) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.unlinkSync(p);
              };
              LockedFS.prototype.rmdir = function rmdir(p, cb) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.rmdir(p, function (err) {
                    this$1$1._mu.unlock();
                    cb(err);
                  });
                });
              };
              LockedFS.prototype.rmdirSync = function rmdirSync(p) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.rmdirSync(p);
              };
              LockedFS.prototype.mkdir = function mkdir(p, mode, cb) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.mkdir(p, mode, function (err) {
                    this$1$1._mu.unlock();
                    cb(err);
                  });
                });
              };
              LockedFS.prototype.mkdirSync = function mkdirSync(p, mode) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.mkdirSync(p, mode);
              };
              LockedFS.prototype.readdir = function readdir(p, cb) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.readdir(p, function (err, files) {
                    this$1$1._mu.unlock();
                    cb(err, files);
                  });
                });
              };
              LockedFS.prototype.readdirSync = function readdirSync(p) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.readdirSync(p);
              };
              LockedFS.prototype.exists = function exists(p, cb) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.exists(p, function (exists2) {
                    this$1$1._mu.unlock();
                    cb(exists2);
                  });
                });
              };
              LockedFS.prototype.existsSync = function existsSync(p) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.existsSync(p);
              };
              LockedFS.prototype.realpath = function realpath(p, cache, cb) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.realpath(p, cache, function (err, resolvedPath) {
                    this$1$1._mu.unlock();
                    cb(err, resolvedPath);
                  });
                });
              };
              LockedFS.prototype.realpathSync = function realpathSync(
                p,
                cache
              ) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.realpathSync(p, cache);
              };
              LockedFS.prototype.truncate = function truncate(p, len, cb) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.truncate(p, len, function (err) {
                    this$1$1._mu.unlock();
                    cb(err);
                  });
                });
              };
              LockedFS.prototype.truncateSync = function truncateSync(p, len) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.truncateSync(p, len);
              };
              LockedFS.prototype.readFile = function readFile(
                fname,
                encoding,
                flag,
                cb
              ) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.readFile(
                    fname,
                    encoding,
                    flag,
                    function (err, data) {
                      this$1$1._mu.unlock();
                      cb(err, data);
                    }
                  );
                });
              };
              LockedFS.prototype.readFileSync = function readFileSync(
                fname,
                encoding,
                flag
              ) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.readFileSync(fname, encoding, flag);
              };
              LockedFS.prototype.writeFile = function writeFile(
                fname,
                data,
                encoding,
                flag,
                mode,
                cb
              ) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.writeFile(
                    fname,
                    data,
                    encoding,
                    flag,
                    mode,
                    function (err) {
                      this$1$1._mu.unlock();
                      cb(err);
                    }
                  );
                });
              };
              LockedFS.prototype.writeFileSync = function writeFileSync(
                fname,
                data,
                encoding,
                flag,
                mode
              ) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.writeFileSync(
                  fname,
                  data,
                  encoding,
                  flag,
                  mode
                );
              };
              LockedFS.prototype.appendFile = function appendFile(
                fname,
                data,
                encoding,
                flag,
                mode,
                cb
              ) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.appendFile(
                    fname,
                    data,
                    encoding,
                    flag,
                    mode,
                    function (err) {
                      this$1$1._mu.unlock();
                      cb(err);
                    }
                  );
                });
              };
              LockedFS.prototype.appendFileSync = function appendFileSync(
                fname,
                data,
                encoding,
                flag,
                mode
              ) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.appendFileSync(
                  fname,
                  data,
                  encoding,
                  flag,
                  mode
                );
              };
              LockedFS.prototype.chmod = function chmod(p, isLchmod, mode, cb) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.chmod(p, isLchmod, mode, function (err) {
                    this$1$1._mu.unlock();
                    cb(err);
                  });
                });
              };
              LockedFS.prototype.chmodSync = function chmodSync(
                p,
                isLchmod,
                mode
              ) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.chmodSync(p, isLchmod, mode);
              };
              LockedFS.prototype.chown = function chown(
                p,
                isLchown,
                uid,
                gid,
                cb
              ) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.chown(p, isLchown, uid, gid, function (err) {
                    this$1$1._mu.unlock();
                    cb(err);
                  });
                });
              };
              LockedFS.prototype.chownSync = function chownSync(
                p,
                isLchown,
                uid,
                gid
              ) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.chownSync(p, isLchown, uid, gid);
              };
              LockedFS.prototype.utimes = function utimes(p, atime, mtime, cb) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.utimes(p, atime, mtime, function (err) {
                    this$1$1._mu.unlock();
                    cb(err);
                  });
                });
              };
              LockedFS.prototype.utimesSync = function utimesSync(
                p,
                atime,
                mtime
              ) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.utimesSync(p, atime, mtime);
              };
              LockedFS.prototype.link = function link(srcpath, dstpath, cb) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.link(srcpath, dstpath, function (err) {
                    this$1$1._mu.unlock();
                    cb(err);
                  });
                });
              };
              LockedFS.prototype.linkSync = function linkSync(
                srcpath,
                dstpath
              ) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.linkSync(srcpath, dstpath);
              };
              LockedFS.prototype.symlink = function symlink(
                srcpath,
                dstpath,
                type,
                cb
              ) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.symlink(srcpath, dstpath, type, function (err) {
                    this$1$1._mu.unlock();
                    cb(err);
                  });
                });
              };
              LockedFS.prototype.symlinkSync = function symlinkSync(
                srcpath,
                dstpath,
                type
              ) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.symlinkSync(srcpath, dstpath, type);
              };
              LockedFS.prototype.readlink = function readlink(p, cb) {
                var this$1$1 = this;
                this._mu.lock(function () {
                  this$1$1._fs.readlink(p, function (err, linkString) {
                    this$1$1._mu.unlock();
                    cb(err, linkString);
                  });
                });
              };
              LockedFS.prototype.readlinkSync = function readlinkSync(p) {
                if (this._mu.isLocked()) {
                  throw new Error("invalid sync call");
                }
                return this._fs.readlinkSync(p);
              };
              var deletionLogPath = "/.deletedFiles.log";
              function makeModeWritable(mode) {
                return 146 | mode;
              }
              function getFlag(f) {
                return FileFlag.getFileFlag(f);
              }
              var OverlayFile = (function (PreloadFile$$1) {
                function OverlayFile2(fs2, path$$1, flag, stats, data) {
                  PreloadFile$$1.call(this, fs2, path$$1, flag, stats, data);
                }
                if (PreloadFile$$1) OverlayFile2.__proto__ = PreloadFile$$1;
                OverlayFile2.prototype = Object.create(
                  PreloadFile$$1 && PreloadFile$$1.prototype
                );
                OverlayFile2.prototype.constructor = OverlayFile2;
                OverlayFile2.prototype.sync = function sync(cb) {
                  var this$1$1 = this;
                  if (!this.isDirty()) {
                    cb(null);
                    return;
                  }
                  this._fs._syncAsync(this, function (err) {
                    this$1$1.resetDirty();
                    cb(err);
                  });
                };
                OverlayFile2.prototype.syncSync = function syncSync() {
                  if (this.isDirty()) {
                    this._fs._syncSync(this);
                    this.resetDirty();
                  }
                };
                OverlayFile2.prototype.close = function close(cb) {
                  this.sync(cb);
                };
                OverlayFile2.prototype.closeSync = function closeSync() {
                  this.syncSync();
                };
                return OverlayFile2;
              })(PreloadFile);
              var UnlockedOverlayFS = (function (BaseFileSystem$$1) {
                function UnlockedOverlayFS2(writable, readable) {
                  BaseFileSystem$$1.call(this);
                  this._isInitialized = false;
                  this._initializeCallbacks = [];
                  this._deletedFiles = {};
                  this._deleteLog = "";
                  this._deleteLogUpdatePending = false;
                  this._deleteLogUpdateNeeded = false;
                  this._deleteLogError = null;
                  this._writable = writable;
                  this._readable = readable;
                  if (this._writable.isReadOnly()) {
                    throw new ApiError(
                      ErrorCode.EINVAL,
                      "Writable file system must be writable."
                    );
                  }
                }
                if (BaseFileSystem$$1)
                  UnlockedOverlayFS2.__proto__ = BaseFileSystem$$1;
                UnlockedOverlayFS2.prototype = Object.create(
                  BaseFileSystem$$1 && BaseFileSystem$$1.prototype
                );
                UnlockedOverlayFS2.prototype.constructor = UnlockedOverlayFS2;
                UnlockedOverlayFS2.isAvailable = function isAvailable() {
                  return true;
                };
                UnlockedOverlayFS2.prototype.getOverlayedFileSystems =
                  function getOverlayedFileSystems() {
                    return {
                      readable: this._readable,
                      writable: this._writable,
                    };
                  };
                UnlockedOverlayFS2.prototype._syncAsync = function _syncAsync(
                  file,
                  cb
                ) {
                  var this$1$1 = this;
                  this.createParentDirectoriesAsync(
                    file.getPath(),
                    function (err) {
                      if (err) {
                        return cb(err);
                      }
                      this$1$1._writable.writeFile(
                        file.getPath(),
                        file.getBuffer(),
                        null,
                        getFlag("w"),
                        file.getStats().mode,
                        cb
                      );
                    }
                  );
                };
                UnlockedOverlayFS2.prototype._syncSync = function _syncSync(
                  file
                ) {
                  this.createParentDirectories(file.getPath());
                  this._writable.writeFileSync(
                    file.getPath(),
                    file.getBuffer(),
                    null,
                    getFlag("w"),
                    file.getStats().mode
                  );
                };
                UnlockedOverlayFS2.prototype.getName = function getName() {
                  return OverlayFS.Name;
                };
                UnlockedOverlayFS2.prototype.initialize = function initialize2(
                  cb
                ) {
                  var this$1$1 = this;
                  var callbackArray = this._initializeCallbacks;
                  var end = function (e) {
                    this$1$1._isInitialized = !e;
                    this$1$1._initializeCallbacks = [];
                    callbackArray.forEach(function (cb2) {
                      return cb2(e);
                    });
                  };
                  if (this._isInitialized) {
                    return cb();
                  }
                  callbackArray.push(cb);
                  if (callbackArray.length !== 1) {
                    return;
                  }
                  this._writable.readFile(
                    deletionLogPath,
                    "utf8",
                    getFlag("r"),
                    function (err, data) {
                      if (err) {
                        if (err.errno !== ErrorCode.ENOENT) {
                          return end(err);
                        }
                      } else {
                        this$1$1._deleteLog = data;
                      }
                      this$1$1._reparseDeletionLog();
                      end();
                    }
                  );
                };
                UnlockedOverlayFS2.prototype.isReadOnly =
                  function isReadOnly() {
                    return false;
                  };
                UnlockedOverlayFS2.prototype.supportsSynch =
                  function supportsSynch() {
                    return (
                      this._readable.supportsSynch() &&
                      this._writable.supportsSynch()
                    );
                  };
                UnlockedOverlayFS2.prototype.supportsLinks =
                  function supportsLinks() {
                    return false;
                  };
                UnlockedOverlayFS2.prototype.supportsProps =
                  function supportsProps() {
                    return (
                      this._readable.supportsProps() &&
                      this._writable.supportsProps()
                    );
                  };
                UnlockedOverlayFS2.prototype.getDeletionLog =
                  function getDeletionLog() {
                    return this._deleteLog;
                  };
                UnlockedOverlayFS2.prototype.restoreDeletionLog =
                  function restoreDeletionLog(log) {
                    this._deleteLog = log;
                    this._reparseDeletionLog();
                    this.updateLog("");
                  };
                UnlockedOverlayFS2.prototype.rename = function rename(
                  oldPath,
                  newPath,
                  cb
                ) {
                  var this$1$1 = this;
                  if (
                    !this.checkInitAsync(cb) ||
                    this.checkPathAsync(oldPath, cb) ||
                    this.checkPathAsync(newPath, cb)
                  ) {
                    return;
                  }
                  if (
                    oldPath === deletionLogPath ||
                    newPath === deletionLogPath
                  ) {
                    return cb(ApiError.EPERM("Cannot rename deletion log."));
                  }
                  if (oldPath === newPath) {
                    return cb();
                  }
                  this.stat(oldPath, false, function (oldErr, oldStats) {
                    if (oldErr) {
                      return cb(oldErr);
                    }
                    return this$1$1.stat(
                      newPath,
                      false,
                      function (newErr, newStats) {
                        var self2 = this$1$1;
                        function copyDirContents(files) {
                          var file = files.shift();
                          if (!file) {
                            return cb();
                          }
                          var oldFile = path2.resolve(oldPath, file);
                          var newFile = path2.resolve(newPath, file);
                          self2.rename(oldFile, newFile, function (err) {
                            if (err) {
                              return cb(err);
                            }
                            copyDirContents(files);
                          });
                        }
                        var mode = 511;
                        if (oldStats.isDirectory()) {
                          if (newErr) {
                            if (newErr.errno !== ErrorCode.ENOENT) {
                              return cb(newErr);
                            }
                            return this$1$1._writable.exists(
                              oldPath,
                              function (exists) {
                                if (exists) {
                                  return this$1$1._writable.rename(
                                    oldPath,
                                    newPath,
                                    cb
                                  );
                                }
                                this$1$1._writable.mkdir(
                                  newPath,
                                  mode,
                                  function (mkdirErr) {
                                    if (mkdirErr) {
                                      return cb(mkdirErr);
                                    }
                                    this$1$1._readable.readdir(
                                      oldPath,
                                      function (err, files) {
                                        if (err) {
                                          return cb();
                                        }
                                        copyDirContents(files);
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                          mode = newStats.mode;
                          if (!newStats.isDirectory()) {
                            return cb(ApiError.ENOTDIR(newPath));
                          }
                          this$1$1.readdir(
                            newPath,
                            function (readdirErr, files) {
                              if (files && files.length) {
                                return cb(ApiError.ENOTEMPTY(newPath));
                              }
                              this$1$1._readable.readdir(
                                oldPath,
                                function (err, files2) {
                                  if (err) {
                                    return cb();
                                  }
                                  copyDirContents(files2);
                                }
                              );
                            }
                          );
                        }
                        if (newStats && newStats.isDirectory()) {
                          return cb(ApiError.EISDIR(newPath));
                        }
                        this$1$1.readFile(
                          oldPath,
                          null,
                          getFlag("r"),
                          function (err, data) {
                            if (err) {
                              return cb(err);
                            }
                            return this$1$1.writeFile(
                              newPath,
                              data,
                              null,
                              getFlag("w"),
                              oldStats.mode,
                              function (err2) {
                                if (err2) {
                                  return cb(err2);
                                }
                                return this$1$1.unlink(oldPath, cb);
                              }
                            );
                          }
                        );
                      }
                    );
                  });
                };
                UnlockedOverlayFS2.prototype.renameSync = function renameSync(
                  oldPath,
                  newPath
                ) {
                  var this$1$1 = this;
                  this.checkInitialized();
                  this.checkPath(oldPath);
                  this.checkPath(newPath);
                  if (
                    oldPath === deletionLogPath ||
                    newPath === deletionLogPath
                  ) {
                    throw ApiError.EPERM("Cannot rename deletion log.");
                  }
                  var oldStats = this.statSync(oldPath, false);
                  if (oldStats.isDirectory()) {
                    if (oldPath === newPath) {
                      return;
                    }
                    var mode = 511;
                    if (this.existsSync(newPath)) {
                      var stats = this.statSync(newPath, false);
                      mode = stats.mode;
                      if (stats.isDirectory()) {
                        if (this.readdirSync(newPath).length > 0) {
                          throw ApiError.ENOTEMPTY(newPath);
                        }
                      } else {
                        throw ApiError.ENOTDIR(newPath);
                      }
                    }
                    if (this._writable.existsSync(oldPath)) {
                      this._writable.renameSync(oldPath, newPath);
                    } else if (!this._writable.existsSync(newPath)) {
                      this._writable.mkdirSync(newPath, mode);
                    }
                    if (this._readable.existsSync(oldPath)) {
                      this._readable
                        .readdirSync(oldPath)
                        .forEach(function (name2) {
                          this$1$1.renameSync(
                            path2.resolve(oldPath, name2),
                            path2.resolve(newPath, name2)
                          );
                        });
                    }
                  } else {
                    if (
                      this.existsSync(newPath) &&
                      this.statSync(newPath, false).isDirectory()
                    ) {
                      throw ApiError.EISDIR(newPath);
                    }
                    this.writeFileSync(
                      newPath,
                      this.readFileSync(oldPath, null, getFlag("r")),
                      null,
                      getFlag("w"),
                      oldStats.mode
                    );
                  }
                  if (oldPath !== newPath && this.existsSync(oldPath)) {
                    this.unlinkSync(oldPath);
                  }
                };
                UnlockedOverlayFS2.prototype.stat = function stat(
                  p,
                  isLstat,
                  cb
                ) {
                  var this$1$1 = this;
                  if (!this.checkInitAsync(cb)) {
                    return;
                  }
                  this._writable.stat(p, isLstat, function (err, stat2) {
                    if (err && err.errno === ErrorCode.ENOENT) {
                      if (this$1$1._deletedFiles[p]) {
                        cb(ApiError.ENOENT(p));
                      }
                      this$1$1._readable.stat(
                        p,
                        isLstat,
                        function (err2, stat3) {
                          if (stat3) {
                            stat3 = stat3.clone();
                            stat3.mode = makeModeWritable(stat3.mode);
                          }
                          cb(err2, stat3);
                        }
                      );
                    } else {
                      cb(err, stat2);
                    }
                  });
                };
                UnlockedOverlayFS2.prototype.statSync = function statSync(
                  p,
                  isLstat
                ) {
                  this.checkInitialized();
                  try {
                    return this._writable.statSync(p, isLstat);
                  } catch (e) {
                    if (this._deletedFiles[p]) {
                      throw ApiError.ENOENT(p);
                    }
                    var oldStat = this._readable.statSync(p, isLstat).clone();
                    oldStat.mode = makeModeWritable(oldStat.mode);
                    return oldStat;
                  }
                };
                UnlockedOverlayFS2.prototype.open = function open(
                  p,
                  flag,
                  mode,
                  cb
                ) {
                  var this$1$1 = this;
                  if (!this.checkInitAsync(cb) || this.checkPathAsync(p, cb)) {
                    return;
                  }
                  this.stat(p, false, function (err, stats) {
                    if (stats) {
                      switch (flag.pathExistsAction()) {
                        case ActionType.TRUNCATE_FILE:
                          return this$1$1.createParentDirectoriesAsync(
                            p,
                            function (err2) {
                              if (err2) {
                                return cb(err2);
                              }
                              this$1$1._writable.open(p, flag, mode, cb);
                            }
                          );
                        case ActionType.NOP:
                          return this$1$1._writable.exists(
                            p,
                            function (exists) {
                              if (exists) {
                                this$1$1._writable.open(p, flag, mode, cb);
                              } else {
                                stats = stats.clone();
                                stats.mode = mode;
                                this$1$1._readable.readFile(
                                  p,
                                  null,
                                  getFlag("r"),
                                  function (readFileErr, data) {
                                    if (readFileErr) {
                                      return cb(readFileErr);
                                    }
                                    if (stats.size === -1) {
                                      stats.size = data.length;
                                    }
                                    var f = new OverlayFile(
                                      this$1$1,
                                      p,
                                      flag,
                                      stats,
                                      data
                                    );
                                    cb(null, f);
                                  }
                                );
                              }
                            }
                          );
                        default:
                          return cb(ApiError.EEXIST(p));
                      }
                    } else {
                      switch (flag.pathNotExistsAction()) {
                        case ActionType.CREATE_FILE:
                          return this$1$1.createParentDirectoriesAsync(
                            p,
                            function (err2) {
                              if (err2) {
                                return cb(err2);
                              }
                              return this$1$1._writable.open(p, flag, mode, cb);
                            }
                          );
                        default:
                          return cb(ApiError.ENOENT(p));
                      }
                    }
                  });
                };
                UnlockedOverlayFS2.prototype.openSync = function openSync(
                  p,
                  flag,
                  mode
                ) {
                  this.checkInitialized();
                  this.checkPath(p);
                  if (p === deletionLogPath) {
                    throw ApiError.EPERM("Cannot open deletion log.");
                  }
                  if (this.existsSync(p)) {
                    switch (flag.pathExistsAction()) {
                      case ActionType.TRUNCATE_FILE:
                        this.createParentDirectories(p);
                        return this._writable.openSync(p, flag, mode);
                      case ActionType.NOP:
                        if (this._writable.existsSync(p)) {
                          return this._writable.openSync(p, flag, mode);
                        } else {
                          var buf = this._readable.readFileSync(
                            p,
                            null,
                            getFlag("r")
                          );
                          var stats = this._readable.statSync(p, false).clone();
                          stats.mode = mode;
                          return new OverlayFile(this, p, flag, stats, buf);
                        }
                      default:
                        throw ApiError.EEXIST(p);
                    }
                  } else {
                    switch (flag.pathNotExistsAction()) {
                      case ActionType.CREATE_FILE:
                        this.createParentDirectories(p);
                        return this._writable.openSync(p, flag, mode);
                      default:
                        throw ApiError.ENOENT(p);
                    }
                  }
                };
                UnlockedOverlayFS2.prototype.unlink = function unlink(p, cb) {
                  var this$1$1 = this;
                  if (!this.checkInitAsync(cb) || this.checkPathAsync(p, cb)) {
                    return;
                  }
                  this.exists(p, function (exists) {
                    if (!exists) {
                      return cb(ApiError.ENOENT(p));
                    }
                    this$1$1._writable.exists(p, function (writableExists) {
                      if (writableExists) {
                        return this$1$1._writable.unlink(p, function (err) {
                          if (err) {
                            return cb(err);
                          }
                          this$1$1.exists(p, function (readableExists) {
                            if (readableExists) {
                              this$1$1.deletePath(p);
                            }
                            cb(null);
                          });
                        });
                      } else {
                        this$1$1.deletePath(p);
                        cb(null);
                      }
                    });
                  });
                };
                UnlockedOverlayFS2.prototype.unlinkSync = function unlinkSync(
                  p
                ) {
                  this.checkInitialized();
                  this.checkPath(p);
                  if (this.existsSync(p)) {
                    if (this._writable.existsSync(p)) {
                      this._writable.unlinkSync(p);
                    }
                    if (this.existsSync(p)) {
                      this.deletePath(p);
                    }
                  } else {
                    throw ApiError.ENOENT(p);
                  }
                };
                UnlockedOverlayFS2.prototype.rmdir = function rmdir(p, cb) {
                  var this$1$1 = this;
                  if (!this.checkInitAsync(cb)) {
                    return;
                  }
                  var rmdirLower = function () {
                    this$1$1.readdir(p, function (err, files) {
                      if (err) {
                        return cb(err);
                      }
                      if (files.length) {
                        return cb(ApiError.ENOTEMPTY(p));
                      }
                      this$1$1.deletePath(p);
                      cb(null);
                    });
                  };
                  this.exists(p, function (exists) {
                    if (!exists) {
                      return cb(ApiError.ENOENT(p));
                    }
                    this$1$1._writable.exists(p, function (writableExists) {
                      if (writableExists) {
                        this$1$1._writable.rmdir(p, function (err) {
                          if (err) {
                            return cb(err);
                          }
                          this$1$1._readable.exists(
                            p,
                            function (readableExists) {
                              if (readableExists) {
                                rmdirLower();
                              } else {
                                cb();
                              }
                            }
                          );
                        });
                      } else {
                        rmdirLower();
                      }
                    });
                  });
                };
                UnlockedOverlayFS2.prototype.rmdirSync = function rmdirSync(p) {
                  this.checkInitialized();
                  if (this.existsSync(p)) {
                    if (this._writable.existsSync(p)) {
                      this._writable.rmdirSync(p);
                    }
                    if (this.existsSync(p)) {
                      if (this.readdirSync(p).length > 0) {
                        throw ApiError.ENOTEMPTY(p);
                      } else {
                        this.deletePath(p);
                      }
                    }
                  } else {
                    throw ApiError.ENOENT(p);
                  }
                };
                UnlockedOverlayFS2.prototype.mkdir = function mkdir(
                  p,
                  mode,
                  cb
                ) {
                  var this$1$1 = this;
                  if (!this.checkInitAsync(cb)) {
                    return;
                  }
                  this.exists(p, function (exists) {
                    if (exists) {
                      return cb(ApiError.EEXIST(p));
                    }
                    this$1$1.createParentDirectoriesAsync(p, function (err) {
                      if (err) {
                        return cb(err);
                      }
                      this$1$1._writable.mkdir(p, mode, cb);
                    });
                  });
                };
                UnlockedOverlayFS2.prototype.mkdirSync = function mkdirSync(
                  p,
                  mode
                ) {
                  this.checkInitialized();
                  if (this.existsSync(p)) {
                    throw ApiError.EEXIST(p);
                  } else {
                    this.createParentDirectories(p);
                    this._writable.mkdirSync(p, mode);
                  }
                };
                UnlockedOverlayFS2.prototype.readdir = function readdir(p, cb) {
                  var this$1$1 = this;
                  if (!this.checkInitAsync(cb)) {
                    return;
                  }
                  this.stat(p, false, function (err, dirStats) {
                    if (err) {
                      return cb(err);
                    }
                    if (!dirStats.isDirectory()) {
                      return cb(ApiError.ENOTDIR(p));
                    }
                    this$1$1._writable.readdir(p, function (err2, wFiles) {
                      if (err2 && err2.code !== "ENOENT") {
                        return cb(err2);
                      } else if (err2 || !wFiles) {
                        wFiles = [];
                      }
                      this$1$1._readable.readdir(p, function (err3, rFiles) {
                        if (err3 || !rFiles) {
                          rFiles = [];
                        }
                        var seenMap = {};
                        var filtered = wFiles
                          .concat(
                            rFiles.filter(function (fPath) {
                              return !this$1$1._deletedFiles[p + "/" + fPath];
                            })
                          )
                          .filter(function (fPath) {
                            var result = !seenMap[fPath];
                            seenMap[fPath] = true;
                            return result;
                          });
                        cb(null, filtered);
                      });
                    });
                  });
                };
                UnlockedOverlayFS2.prototype.readdirSync = function readdirSync(
                  p
                ) {
                  var this$1$1 = this;
                  this.checkInitialized();
                  var dirStats = this.statSync(p, false);
                  if (!dirStats.isDirectory()) {
                    throw ApiError.ENOTDIR(p);
                  }
                  var contents = [];
                  try {
                    contents = contents.concat(this._writable.readdirSync(p));
                  } catch (e) {}
                  try {
                    contents = contents.concat(
                      this._readable.readdirSync(p).filter(function (fPath) {
                        return !this$1$1._deletedFiles[p + "/" + fPath];
                      })
                    );
                  } catch (e) {}
                  var seenMap = {};
                  return contents.filter(function (fileP) {
                    var result = !seenMap[fileP];
                    seenMap[fileP] = true;
                    return result;
                  });
                };
                UnlockedOverlayFS2.prototype.exists = function exists(p, cb) {
                  var this$1$1 = this;
                  this.checkInitialized();
                  this._writable.exists(p, function (existsWritable) {
                    if (existsWritable) {
                      return cb(true);
                    }
                    this$1$1._readable.exists(p, function (existsReadable) {
                      cb(existsReadable && this$1$1._deletedFiles[p] !== true);
                    });
                  });
                };
                UnlockedOverlayFS2.prototype.existsSync = function existsSync(
                  p
                ) {
                  this.checkInitialized();
                  return (
                    this._writable.existsSync(p) ||
                    (this._readable.existsSync(p) &&
                      this._deletedFiles[p] !== true)
                  );
                };
                UnlockedOverlayFS2.prototype.chmod = function chmod(
                  p,
                  isLchmod,
                  mode,
                  cb
                ) {
                  var this$1$1 = this;
                  if (!this.checkInitAsync(cb)) {
                    return;
                  }
                  this.operateOnWritableAsync(p, function (err) {
                    if (err) {
                      return cb(err);
                    } else {
                      this$1$1._writable.chmod(p, isLchmod, mode, cb);
                    }
                  });
                };
                UnlockedOverlayFS2.prototype.chmodSync = function chmodSync(
                  p,
                  isLchmod,
                  mode
                ) {
                  var this$1$1 = this;
                  this.checkInitialized();
                  this.operateOnWritable(p, function () {
                    this$1$1._writable.chmodSync(p, isLchmod, mode);
                  });
                };
                UnlockedOverlayFS2.prototype.chown = function chown(
                  p,
                  isLchmod,
                  uid,
                  gid,
                  cb
                ) {
                  var this$1$1 = this;
                  if (!this.checkInitAsync(cb)) {
                    return;
                  }
                  this.operateOnWritableAsync(p, function (err) {
                    if (err) {
                      return cb(err);
                    } else {
                      this$1$1._writable.chown(p, isLchmod, uid, gid, cb);
                    }
                  });
                };
                UnlockedOverlayFS2.prototype.chownSync = function chownSync(
                  p,
                  isLchown,
                  uid,
                  gid
                ) {
                  var this$1$1 = this;
                  this.checkInitialized();
                  this.operateOnWritable(p, function () {
                    this$1$1._writable.chownSync(p, isLchown, uid, gid);
                  });
                };
                UnlockedOverlayFS2.prototype.utimes = function utimes(
                  p,
                  atime,
                  mtime,
                  cb
                ) {
                  var this$1$1 = this;
                  if (!this.checkInitAsync(cb)) {
                    return;
                  }
                  this.operateOnWritableAsync(p, function (err) {
                    if (err) {
                      return cb(err);
                    } else {
                      this$1$1._writable.utimes(p, atime, mtime, cb);
                    }
                  });
                };
                UnlockedOverlayFS2.prototype.utimesSync = function utimesSync(
                  p,
                  atime,
                  mtime
                ) {
                  var this$1$1 = this;
                  this.checkInitialized();
                  this.operateOnWritable(p, function () {
                    this$1$1._writable.utimesSync(p, atime, mtime);
                  });
                };
                UnlockedOverlayFS2.prototype.deletePath = function deletePath(
                  p
                ) {
                  this._deletedFiles[p] = true;
                  this.updateLog("d" + p + "\n");
                };
                UnlockedOverlayFS2.prototype.updateLog = function updateLog(
                  addition
                ) {
                  var this$1$1 = this;
                  this._deleteLog += addition;
                  if (this._deleteLogUpdatePending) {
                    this._deleteLogUpdateNeeded = true;
                  } else {
                    this._deleteLogUpdatePending = true;
                    this._writable.writeFile(
                      deletionLogPath,
                      this._deleteLog,
                      "utf8",
                      FileFlag.getFileFlag("w"),
                      420,
                      function (e) {
                        this$1$1._deleteLogUpdatePending = false;
                        if (e) {
                          this$1$1._deleteLogError = e;
                        } else if (this$1$1._deleteLogUpdateNeeded) {
                          this$1$1._deleteLogUpdateNeeded = false;
                          this$1$1.updateLog("");
                        }
                      }
                    );
                  }
                };
                UnlockedOverlayFS2.prototype._reparseDeletionLog =
                  function _reparseDeletionLog() {
                    var this$1$1 = this;
                    this._deletedFiles = {};
                    this._deleteLog.split("\n").forEach(function (path$$1) {
                      this$1$1._deletedFiles[path$$1.slice(1)] =
                        path$$1.slice(0, 1) === "d";
                    });
                  };
                UnlockedOverlayFS2.prototype.checkInitialized =
                  function checkInitialized() {
                    if (!this._isInitialized) {
                      throw new ApiError(
                        ErrorCode.EPERM,
                        "OverlayFS is not initialized. Please initialize OverlayFS using its initialize() method before using it."
                      );
                    } else if (this._deleteLogError !== null) {
                      var e = this._deleteLogError;
                      this._deleteLogError = null;
                      throw e;
                    }
                  };
                UnlockedOverlayFS2.prototype.checkInitAsync =
                  function checkInitAsync(cb) {
                    if (!this._isInitialized) {
                      cb(
                        new ApiError(
                          ErrorCode.EPERM,
                          "OverlayFS is not initialized. Please initialize OverlayFS using its initialize() method before using it."
                        )
                      );
                      return false;
                    } else if (this._deleteLogError !== null) {
                      var e = this._deleteLogError;
                      this._deleteLogError = null;
                      cb(e);
                      return false;
                    }
                    return true;
                  };
                UnlockedOverlayFS2.prototype.checkPath = function checkPath(p) {
                  if (p === deletionLogPath) {
                    throw ApiError.EPERM(p);
                  }
                };
                UnlockedOverlayFS2.prototype.checkPathAsync =
                  function checkPathAsync(p, cb) {
                    if (p === deletionLogPath) {
                      cb(ApiError.EPERM(p));
                      return true;
                    }
                    return false;
                  };
                UnlockedOverlayFS2.prototype.createParentDirectoriesAsync =
                  function createParentDirectoriesAsync(p, cb) {
                    var parent = path2.dirname(p);
                    var toCreate = [];
                    var self2 = this;
                    this._writable.stat(parent, false, statDone);
                    function statDone(err, stat) {
                      if (err) {
                        toCreate.push(parent);
                        parent = path2.dirname(parent);
                        self2._writable.stat(parent, false, statDone);
                      } else {
                        createParents();
                      }
                    }
                    function createParents() {
                      if (!toCreate.length) {
                        return cb();
                      }
                      var dir = toCreate.pop();
                      self2._readable.stat(dir, false, function (err, stats) {
                        if (!stats) {
                          return cb();
                        }
                        self2._writable.mkdir(dir, stats.mode, function (err2) {
                          if (err2) {
                            return cb(err2);
                          }
                          createParents();
                        });
                      });
                    }
                  };
                UnlockedOverlayFS2.prototype.createParentDirectories =
                  function createParentDirectories(p) {
                    var this$1$1 = this;
                    var parent = path2.dirname(p),
                      toCreate = [];
                    while (!this._writable.existsSync(parent)) {
                      toCreate.push(parent);
                      parent = path2.dirname(parent);
                    }
                    toCreate = toCreate.reverse();
                    toCreate.forEach(function (p2) {
                      this$1$1._writable.mkdirSync(
                        p2,
                        this$1$1.statSync(p2, false).mode
                      );
                    });
                  };
                UnlockedOverlayFS2.prototype.operateOnWritable =
                  function operateOnWritable(p, f) {
                    if (this.existsSync(p)) {
                      if (!this._writable.existsSync(p)) {
                        this.copyToWritable(p);
                      }
                      f();
                    } else {
                      throw ApiError.ENOENT(p);
                    }
                  };
                UnlockedOverlayFS2.prototype.operateOnWritableAsync =
                  function operateOnWritableAsync(p, cb) {
                    var this$1$1 = this;
                    this.exists(p, function (exists) {
                      if (!exists) {
                        return cb(ApiError.ENOENT(p));
                      }
                      this$1$1._writable.exists(p, function (existsWritable) {
                        if (existsWritable) {
                          cb();
                        } else {
                          return this$1$1.copyToWritableAsync(p, cb);
                        }
                      });
                    });
                  };
                UnlockedOverlayFS2.prototype.copyToWritable =
                  function copyToWritable(p) {
                    var pStats = this.statSync(p, false);
                    if (pStats.isDirectory()) {
                      this._writable.mkdirSync(p, pStats.mode);
                    } else {
                      this.writeFileSync(
                        p,
                        this._readable.readFileSync(p, null, getFlag("r")),
                        null,
                        getFlag("w"),
                        this.statSync(p, false).mode
                      );
                    }
                  };
                UnlockedOverlayFS2.prototype.copyToWritableAsync =
                  function copyToWritableAsync(p, cb) {
                    var this$1$1 = this;
                    this.stat(p, false, function (err, pStats) {
                      if (err) {
                        return cb(err);
                      }
                      if (pStats.isDirectory()) {
                        return this$1$1._writable.mkdir(p, pStats.mode, cb);
                      }
                      this$1$1._readable.readFile(
                        p,
                        null,
                        getFlag("r"),
                        function (err2, data) {
                          if (err2) {
                            return cb(err2);
                          }
                          this$1$1.writeFile(
                            p,
                            data,
                            null,
                            getFlag("w"),
                            pStats.mode,
                            cb
                          );
                        }
                      );
                    });
                  };
                return UnlockedOverlayFS2;
              })(BaseFileSystem);
              var OverlayFS = (function (LockedFS$$1) {
                function OverlayFS2(writable, readable, deprecateMsg) {
                  if (deprecateMsg === void 0) deprecateMsg = true;
                  LockedFS$$1.call(
                    this,
                    new UnlockedOverlayFS(writable, readable)
                  );
                  deprecationMessage(deprecateMsg, OverlayFS2.Name, {
                    readable: "readable file system",
                    writable: "writable file system",
                  });
                }
                if (LockedFS$$1) OverlayFS2.__proto__ = LockedFS$$1;
                OverlayFS2.prototype = Object.create(
                  LockedFS$$1 && LockedFS$$1.prototype
                );
                OverlayFS2.prototype.constructor = OverlayFS2;
                OverlayFS2.Create = function Create(opts, cb) {
                  try {
                    var fs2 = new OverlayFS2(
                      opts.writable,
                      opts.readable,
                      false
                    );
                    fs2.initialize(function (e) {
                      cb(e, fs2);
                    }, false);
                  } catch (e) {
                    cb(e);
                  }
                };
                OverlayFS2.isAvailable = function isAvailable() {
                  return UnlockedOverlayFS.isAvailable();
                };
                OverlayFS2.prototype.initialize = function initialize2(
                  cb,
                  deprecateMsg
                ) {
                  if (deprecateMsg === void 0) deprecateMsg = true;
                  if (deprecateMsg) {
                    console.warn(
                      "[OverlayFS] OverlayFS.initialize() is deprecated and will be removed in the next major release. Please use 'OverlayFS.Create({readable: readable file system instance, writable: writable file system instance}, cb)' to create and initialize OverlayFS instances."
                    );
                  }
                  LockedFS$$1.prototype.initialize.call(this, cb);
                };
                OverlayFS2.prototype.getOverlayedFileSystems =
                  function getOverlayedFileSystems() {
                    return LockedFS$$1.prototype.getFSUnlocked
                      .call(this)
                      .getOverlayedFileSystems();
                  };
                OverlayFS2.prototype.unwrap = function unwrap() {
                  return LockedFS$$1.prototype.getFSUnlocked.call(this);
                };
                return OverlayFS2;
              })(LockedFS);
              OverlayFS.Name = "OverlayFS";
              OverlayFS.Options = {
                writable: {
                  type: "object",
                  description: "The file system to write modified files to.",
                },
                readable: {
                  type: "object",
                  description:
                    "The file system that initially populates this file system.",
                },
              };
              var SpecialArgType;
              (function (SpecialArgType2) {
                SpecialArgType2[(SpecialArgType2["CB"] = 0)] = "CB";
                SpecialArgType2[(SpecialArgType2["FD"] = 1)] = "FD";
                SpecialArgType2[(SpecialArgType2["API_ERROR"] = 2)] =
                  "API_ERROR";
                SpecialArgType2[(SpecialArgType2["STATS"] = 3)] = "STATS";
                SpecialArgType2[(SpecialArgType2["PROBE"] = 4)] = "PROBE";
                SpecialArgType2[(SpecialArgType2["FILEFLAG"] = 5)] = "FILEFLAG";
                SpecialArgType2[(SpecialArgType2["BUFFER"] = 6)] = "BUFFER";
                SpecialArgType2[(SpecialArgType2["ERROR"] = 7)] = "ERROR";
              })(SpecialArgType || (SpecialArgType = {}));
              var CallbackArgumentConverter =
                function CallbackArgumentConverter2() {
                  this._callbacks = {};
                  this._nextId = 0;
                };
              CallbackArgumentConverter.prototype.toRemoteArg =
                function toRemoteArg(cb) {
                  var id = this._nextId++;
                  this._callbacks[id] = cb;
                  return {
                    type: SpecialArgType.CB,
                    id,
                  };
                };
              CallbackArgumentConverter.prototype.toLocalArg =
                function toLocalArg(id) {
                  var cb = this._callbacks[id];
                  delete this._callbacks[id];
                  return cb;
                };
              var FileDescriptorArgumentConverter =
                function FileDescriptorArgumentConverter2() {
                  this._fileDescriptors = {};
                  this._nextId = 0;
                };
              FileDescriptorArgumentConverter.prototype.toRemoteArg =
                function toRemoteArg(fd, p, flag, cb) {
                  var id = this._nextId++;
                  var data;
                  var stat;
                  this._fileDescriptors[id] = fd;
                  fd.stat(function (err, stats) {
                    if (err) {
                      cb(err);
                    } else {
                      stat = bufferToTransferrableObject(stats.toBuffer());
                      if (flag.isReadable()) {
                        fd.read(
                          Buffer2.alloc(stats.size),
                          0,
                          stats.size,
                          0,
                          function (err2, bytesRead, buff) {
                            if (err2) {
                              cb(err2);
                            } else {
                              data = bufferToTransferrableObject(buff);
                              cb(null, {
                                type: SpecialArgType.FD,
                                id,
                                data,
                                stat,
                                path: p,
                                flag: flag.getFlagString(),
                              });
                            }
                          }
                        );
                      } else {
                        cb(null, {
                          type: SpecialArgType.FD,
                          id,
                          data: new ArrayBuffer(0),
                          stat,
                          path: p,
                          flag: flag.getFlagString(),
                        });
                      }
                    }
                  });
                };
              FileDescriptorArgumentConverter.prototype.applyFdAPIRequest =
                function applyFdAPIRequest(request, cb) {
                  var this$1$1 = this;
                  var fdArg = request.args[0];
                  this._applyFdChanges(fdArg, function (err, fd) {
                    if (err) {
                      cb(err);
                    } else {
                      fd[request.method](function (e) {
                        if (request.method === "close") {
                          delete this$1$1._fileDescriptors[fdArg.id];
                        }
                        cb(e);
                      });
                    }
                  });
                };
              FileDescriptorArgumentConverter.prototype._applyFdChanges =
                function _applyFdChanges(remoteFd, cb) {
                  var fd = this._fileDescriptors[remoteFd.id],
                    data = transferrableObjectToBuffer(remoteFd.data),
                    remoteStats = Stats.fromBuffer(
                      transferrableObjectToBuffer(remoteFd.stat)
                    );
                  var flag = FileFlag.getFileFlag(remoteFd.flag);
                  if (flag.isWriteable()) {
                    fd.write(
                      data,
                      0,
                      data.length,
                      flag.isAppendable() ? fd.getPos() : 0,
                      function (e) {
                        function applyStatChanges() {
                          fd.stat(function (e2, stats) {
                            if (e2) {
                              cb(e2);
                            } else {
                              if (stats.mode !== remoteStats.mode) {
                                fd.chmod(remoteStats.mode, function (e3) {
                                  cb(e3, fd);
                                });
                              } else {
                                cb(e2, fd);
                              }
                            }
                          });
                        }
                        if (e) {
                          cb(e);
                        } else {
                          if (!flag.isAppendable()) {
                            fd.truncate(data.length, function () {
                              applyStatChanges();
                            });
                          } else {
                            applyStatChanges();
                          }
                        }
                      }
                    );
                  } else {
                    cb(null, fd);
                  }
                };
              function apiErrorLocal2Remote(e) {
                return {
                  type: SpecialArgType.API_ERROR,
                  errorData: bufferToTransferrableObject(e.writeToBuffer()),
                };
              }
              function apiErrorRemote2Local(e) {
                return ApiError.fromBuffer(
                  transferrableObjectToBuffer(e.errorData)
                );
              }
              function errorLocal2Remote(e) {
                return {
                  type: SpecialArgType.ERROR,
                  name: e.name,
                  message: e.message,
                  stack: e.stack,
                };
              }
              function errorRemote2Local(e) {
                var cnstr = global$1[e.name];
                if (typeof cnstr !== "function") {
                  cnstr = Error;
                }
                var err = new cnstr(e.message);
                err.stack = e.stack;
                return err;
              }
              function statsLocal2Remote(stats) {
                return {
                  type: SpecialArgType.STATS,
                  statsData: bufferToTransferrableObject(stats.toBuffer()),
                };
              }
              function statsRemote2Local(stats) {
                return Stats.fromBuffer(
                  transferrableObjectToBuffer(stats.statsData)
                );
              }
              function fileFlagLocal2Remote(flag) {
                return {
                  type: SpecialArgType.FILEFLAG,
                  flagStr: flag.getFlagString(),
                };
              }
              function fileFlagRemote2Local(remoteFlag) {
                return FileFlag.getFileFlag(remoteFlag.flagStr);
              }
              function bufferToTransferrableObject(buff) {
                return buffer2ArrayBuffer(buff);
              }
              function transferrableObjectToBuffer(buff) {
                return arrayBuffer2Buffer(buff);
              }
              function bufferLocal2Remote(buff) {
                return {
                  type: SpecialArgType.BUFFER,
                  data: bufferToTransferrableObject(buff),
                };
              }
              function bufferRemote2Local(buffArg) {
                return transferrableObjectToBuffer(buffArg.data);
              }
              function isAPIRequest(data) {
                return (
                  data &&
                  typeof data === "object" &&
                  data.hasOwnProperty("browserfsMessage") &&
                  data["browserfsMessage"]
                );
              }
              function isAPIResponse(data) {
                return (
                  data &&
                  typeof data === "object" &&
                  data.hasOwnProperty("browserfsMessage") &&
                  data["browserfsMessage"]
                );
              }
              var WorkerFile = (function (PreloadFile$$1) {
                function WorkerFile2(
                  _fs,
                  _path,
                  _flag,
                  _stat,
                  remoteFdId,
                  contents
                ) {
                  PreloadFile$$1.call(this, _fs, _path, _flag, _stat, contents);
                  this._remoteFdId = remoteFdId;
                }
                if (PreloadFile$$1) WorkerFile2.__proto__ = PreloadFile$$1;
                WorkerFile2.prototype = Object.create(
                  PreloadFile$$1 && PreloadFile$$1.prototype
                );
                WorkerFile2.prototype.constructor = WorkerFile2;
                WorkerFile2.prototype.getRemoteFdId = function getRemoteFdId() {
                  return this._remoteFdId;
                };
                WorkerFile2.prototype.toRemoteArg = function toRemoteArg() {
                  return {
                    type: SpecialArgType.FD,
                    id: this._remoteFdId,
                    data: bufferToTransferrableObject(this.getBuffer()),
                    stat: bufferToTransferrableObject(
                      this.getStats().toBuffer()
                    ),
                    path: this.getPath(),
                    flag: this.getFlag().getFlagString(),
                  };
                };
                WorkerFile2.prototype.sync = function sync(cb) {
                  this._syncClose("sync", cb);
                };
                WorkerFile2.prototype.close = function close(cb) {
                  this._syncClose("close", cb);
                };
                WorkerFile2.prototype._syncClose = function _syncClose(
                  type,
                  cb
                ) {
                  var this$1$1 = this;
                  if (this.isDirty()) {
                    this._fs.syncClose(type, this, function (e) {
                      if (!e) {
                        this$1$1.resetDirty();
                      }
                      cb(e);
                    });
                  } else {
                    cb();
                  }
                };
                return WorkerFile2;
              })(PreloadFile);
              var WorkerFS = (function (BaseFileSystem$$1) {
                function WorkerFS2(worker, deprecateMsg) {
                  var this$1$1 = this;
                  if (deprecateMsg === void 0) deprecateMsg = true;
                  BaseFileSystem$$1.call(this);
                  this._callbackConverter = new CallbackArgumentConverter();
                  this._isInitialized = false;
                  this._isReadOnly = false;
                  this._supportLinks = false;
                  this._supportProps = false;
                  this._worker = worker;
                  deprecationMessage(deprecateMsg, WorkerFS2.Name, {
                    worker: "Web Worker instance",
                  });
                  this._worker.addEventListener("message", function (e) {
                    var resp = e.data;
                    if (isAPIResponse(resp)) {
                      var i2;
                      var args = resp.args;
                      var fixedArgs = new Array(args.length);
                      for (i2 = 0; i2 < fixedArgs.length; i2++) {
                        fixedArgs[i2] = this$1$1._argRemote2Local(args[i2]);
                      }
                      this$1$1._callbackConverter
                        .toLocalArg(resp.cbId)
                        .apply(null, fixedArgs);
                    }
                  });
                }
                if (BaseFileSystem$$1) WorkerFS2.__proto__ = BaseFileSystem$$1;
                WorkerFS2.prototype = Object.create(
                  BaseFileSystem$$1 && BaseFileSystem$$1.prototype
                );
                WorkerFS2.prototype.constructor = WorkerFS2;
                WorkerFS2.Create = function Create(opts, cb) {
                  var fs2 = new WorkerFS2(opts.worker, false);
                  fs2.initialize(function () {
                    cb(null, fs2);
                  });
                };
                WorkerFS2.isAvailable = function isAvailable() {
                  return (
                    typeof importScripts !== "undefined" ||
                    typeof Worker !== "undefined"
                  );
                };
                WorkerFS2.attachRemoteListener = function attachRemoteListener(
                  worker
                ) {
                  var fdConverter = new FileDescriptorArgumentConverter();
                  function argLocal2Remote(arg, requestArgs, cb) {
                    switch (typeof arg) {
                      case "object":
                        if (arg instanceof Stats) {
                          cb(null, statsLocal2Remote(arg));
                        } else if (arg instanceof ApiError) {
                          cb(null, apiErrorLocal2Remote(arg));
                        } else if (arg instanceof BaseFile) {
                          cb(
                            null,
                            fdConverter.toRemoteArg(
                              arg,
                              requestArgs[0],
                              requestArgs[1],
                              cb
                            )
                          );
                        } else if (arg instanceof FileFlag) {
                          cb(null, fileFlagLocal2Remote(arg));
                        } else if (arg instanceof Buffer2) {
                          cb(null, bufferLocal2Remote(arg));
                        } else if (arg instanceof Error) {
                          cb(null, errorLocal2Remote(arg));
                        } else {
                          cb(null, arg);
                        }
                        break;
                      default:
                        cb(null, arg);
                        break;
                    }
                  }
                  function argRemote2Local(arg, fixedRequestArgs) {
                    if (!arg) {
                      return arg;
                    }
                    switch (typeof arg) {
                      case "object":
                        if (typeof arg["type"] === "number") {
                          var specialArg = arg;
                          switch (specialArg.type) {
                            case SpecialArgType.CB:
                              var cbId = arg.id;
                              return function () {
                                var arguments$1 = arguments;
                                var i2;
                                var fixedArgs = new Array(arguments.length);
                                var message,
                                  countdown = arguments.length;
                                function abortAndSendError(err) {
                                  if (countdown > 0) {
                                    countdown = -1;
                                    message = {
                                      browserfsMessage: true,
                                      cbId,
                                      args: [apiErrorLocal2Remote(err)],
                                    };
                                    worker.postMessage(message);
                                  }
                                }
                                for (i2 = 0; i2 < arguments.length; i2++) {
                                  (function (i3, arg2) {
                                    argLocal2Remote(
                                      arg2,
                                      fixedRequestArgs,
                                      function (err, fixedArg) {
                                        fixedArgs[i3] = fixedArg;
                                        if (err) {
                                          abortAndSendError(err);
                                        } else if (--countdown === 0) {
                                          message = {
                                            browserfsMessage: true,
                                            cbId,
                                            args: fixedArgs,
                                          };
                                          worker.postMessage(message);
                                        }
                                      }
                                    );
                                  })(i2, arguments$1[i2]);
                                }
                                if (arguments.length === 0) {
                                  message = {
                                    browserfsMessage: true,
                                    cbId,
                                    args: fixedArgs,
                                  };
                                  worker.postMessage(message);
                                }
                              };
                            case SpecialArgType.API_ERROR:
                              return apiErrorRemote2Local(specialArg);
                            case SpecialArgType.STATS:
                              return statsRemote2Local(specialArg);
                            case SpecialArgType.FILEFLAG:
                              return fileFlagRemote2Local(specialArg);
                            case SpecialArgType.BUFFER:
                              return bufferRemote2Local(specialArg);
                            case SpecialArgType.ERROR:
                              return errorRemote2Local(specialArg);
                            default:
                              return arg;
                          }
                        } else {
                          return arg;
                        }
                      default:
                        return arg;
                    }
                  }
                  worker.addEventListener("message", function (e) {
                    var request = e.data;
                    if (isAPIRequest(request)) {
                      var args = request.args,
                        fixedArgs = new Array(args.length);
                      switch (request.method) {
                        case "close":
                        case "sync":
                          (function () {
                            var remoteCb = args[1];
                            fdConverter.applyFdAPIRequest(
                              request,
                              function (err) {
                                var response = {
                                  browserfsMessage: true,
                                  cbId: remoteCb.id,
                                  args: err ? [apiErrorLocal2Remote(err)] : [],
                                };
                                worker.postMessage(response);
                              }
                            );
                          })();
                          break;
                        case "probe":
                          (function () {
                            var rootFs = _fsMock.getRootFS(),
                              remoteCb = args[1],
                              probeResponse = {
                                type: SpecialArgType.PROBE,
                                isReadOnly: rootFs.isReadOnly(),
                                supportsLinks: rootFs.supportsLinks(),
                                supportsProps: rootFs.supportsProps(),
                              },
                              response = {
                                browserfsMessage: true,
                                cbId: remoteCb.id,
                                args: [probeResponse],
                              };
                            worker.postMessage(response);
                          })();
                          break;
                        default:
                          for (var i2 = 0; i2 < args.length; i2++) {
                            fixedArgs[i2] = argRemote2Local(
                              args[i2],
                              fixedArgs
                            );
                          }
                          var rootFS = _fsMock.getRootFS();
                          rootFS[request.method].apply(rootFS, fixedArgs);
                          break;
                      }
                    }
                  });
                };
                WorkerFS2.prototype.getName = function getName() {
                  return WorkerFS2.Name;
                };
                WorkerFS2.prototype.initialize = function initialize2(cb) {
                  var this$1$1 = this;
                  if (!this._isInitialized) {
                    var message = {
                      browserfsMessage: true,
                      method: "probe",
                      args: [
                        this._argLocal2Remote(emptyBuffer()),
                        this._callbackConverter.toRemoteArg(function (
                          probeResponse
                        ) {
                          this$1$1._isInitialized = true;
                          this$1$1._isReadOnly = probeResponse.isReadOnly;
                          this$1$1._supportLinks = probeResponse.supportsLinks;
                          this$1$1._supportProps = probeResponse.supportsProps;
                          cb();
                        }),
                      ],
                    };
                    this._worker.postMessage(message);
                  } else {
                    cb();
                  }
                };
                WorkerFS2.prototype.isReadOnly = function isReadOnly() {
                  return this._isReadOnly;
                };
                WorkerFS2.prototype.supportsSynch = function supportsSynch() {
                  return false;
                };
                WorkerFS2.prototype.supportsLinks = function supportsLinks() {
                  return this._supportLinks;
                };
                WorkerFS2.prototype.supportsProps = function supportsProps() {
                  return this._supportProps;
                };
                WorkerFS2.prototype.rename = function rename(
                  oldPath,
                  newPath,
                  cb
                ) {
                  this._rpc("rename", arguments);
                };
                WorkerFS2.prototype.stat = function stat(p, isLstat, cb) {
                  this._rpc("stat", arguments);
                };
                WorkerFS2.prototype.open = function open(p, flag, mode, cb) {
                  this._rpc("open", arguments);
                };
                WorkerFS2.prototype.unlink = function unlink(p, cb) {
                  this._rpc("unlink", arguments);
                };
                WorkerFS2.prototype.rmdir = function rmdir(p, cb) {
                  this._rpc("rmdir", arguments);
                };
                WorkerFS2.prototype.mkdir = function mkdir(p, mode, cb) {
                  this._rpc("mkdir", arguments);
                };
                WorkerFS2.prototype.readdir = function readdir(p, cb) {
                  this._rpc("readdir", arguments);
                };
                WorkerFS2.prototype.exists = function exists(p, cb) {
                  this._rpc("exists", arguments);
                };
                WorkerFS2.prototype.realpath = function realpath(p, cache, cb) {
                  this._rpc("realpath", arguments);
                };
                WorkerFS2.prototype.truncate = function truncate(p, len, cb) {
                  this._rpc("truncate", arguments);
                };
                WorkerFS2.prototype.readFile = function readFile(
                  fname,
                  encoding,
                  flag,
                  cb
                ) {
                  this._rpc("readFile", arguments);
                };
                WorkerFS2.prototype.writeFile = function writeFile(
                  fname,
                  data,
                  encoding,
                  flag,
                  mode,
                  cb
                ) {
                  this._rpc("writeFile", arguments);
                };
                WorkerFS2.prototype.appendFile = function appendFile(
                  fname,
                  data,
                  encoding,
                  flag,
                  mode,
                  cb
                ) {
                  this._rpc("appendFile", arguments);
                };
                WorkerFS2.prototype.chmod = function chmod(
                  p,
                  isLchmod,
                  mode,
                  cb
                ) {
                  this._rpc("chmod", arguments);
                };
                WorkerFS2.prototype.chown = function chown(
                  p,
                  isLchown,
                  uid,
                  gid,
                  cb
                ) {
                  this._rpc("chown", arguments);
                };
                WorkerFS2.prototype.utimes = function utimes(
                  p,
                  atime,
                  mtime,
                  cb
                ) {
                  this._rpc("utimes", arguments);
                };
                WorkerFS2.prototype.link = function link(srcpath, dstpath, cb) {
                  this._rpc("link", arguments);
                };
                WorkerFS2.prototype.symlink = function symlink(
                  srcpath,
                  dstpath,
                  type,
                  cb
                ) {
                  this._rpc("symlink", arguments);
                };
                WorkerFS2.prototype.readlink = function readlink(p, cb) {
                  this._rpc("readlink", arguments);
                };
                WorkerFS2.prototype.syncClose = function syncClose(
                  method,
                  fd,
                  cb
                ) {
                  this._worker.postMessage({
                    browserfsMessage: true,
                    method,
                    args: [
                      fd.toRemoteArg(),
                      this._callbackConverter.toRemoteArg(cb),
                    ],
                  });
                };
                WorkerFS2.prototype._argRemote2Local =
                  function _argRemote2Local(arg) {
                    if (!arg) {
                      return arg;
                    }
                    switch (typeof arg) {
                      case "object":
                        if (typeof arg["type"] === "number") {
                          var specialArg = arg;
                          switch (specialArg.type) {
                            case SpecialArgType.API_ERROR:
                              return apiErrorRemote2Local(specialArg);
                            case SpecialArgType.FD:
                              var fdArg = specialArg;
                              return new WorkerFile(
                                this,
                                fdArg.path,
                                FileFlag.getFileFlag(fdArg.flag),
                                Stats.fromBuffer(
                                  transferrableObjectToBuffer(fdArg.stat)
                                ),
                                fdArg.id,
                                transferrableObjectToBuffer(fdArg.data)
                              );
                            case SpecialArgType.STATS:
                              return statsRemote2Local(specialArg);
                            case SpecialArgType.FILEFLAG:
                              return fileFlagRemote2Local(specialArg);
                            case SpecialArgType.BUFFER:
                              return bufferRemote2Local(specialArg);
                            case SpecialArgType.ERROR:
                              return errorRemote2Local(specialArg);
                            default:
                              return arg;
                          }
                        } else {
                          return arg;
                        }
                      default:
                        return arg;
                    }
                  };
                WorkerFS2.prototype._rpc = function _rpc(methodName, args) {
                  var this$1$1 = this;
                  var fixedArgs = new Array(args.length);
                  for (var i2 = 0; i2 < args.length; i2++) {
                    fixedArgs[i2] = this$1$1._argLocal2Remote(args[i2]);
                  }
                  var message = {
                    browserfsMessage: true,
                    method: methodName,
                    args: fixedArgs,
                  };
                  this._worker.postMessage(message);
                };
                WorkerFS2.prototype._argLocal2Remote =
                  function _argLocal2Remote(arg) {
                    if (!arg) {
                      return arg;
                    }
                    switch (typeof arg) {
                      case "object":
                        if (arg instanceof Stats) {
                          return statsLocal2Remote(arg);
                        } else if (arg instanceof ApiError) {
                          return apiErrorLocal2Remote(arg);
                        } else if (arg instanceof WorkerFile) {
                          return arg.toRemoteArg();
                        } else if (arg instanceof FileFlag) {
                          return fileFlagLocal2Remote(arg);
                        } else if (arg instanceof Buffer2) {
                          return bufferLocal2Remote(arg);
                        } else if (arg instanceof Error) {
                          return errorLocal2Remote(arg);
                        } else {
                          return "Unknown argument";
                        }
                      case "function":
                        return this._callbackConverter.toRemoteArg(arg);
                      default:
                        return arg;
                    }
                  };
                return WorkerFS2;
              })(BaseFileSystem);
              WorkerFS.Name = "WorkerFS";
              WorkerFS.Options = {
                worker: {
                  type: "object",
                  description:
                    "The target worker that you want to connect to, or the current worker if in a worker context.",
                  validator: function (v, cb) {
                    if (v["postMessage"]) {
                      cb();
                    } else {
                      cb(
                        new ApiError(
                          ErrorCode.EINVAL,
                          "option must be a Web Worker instance."
                        )
                      );
                    }
                  },
                },
              };
              function asyncDownloadFileModern(p, type, cb) {
                var req = new XMLHttpRequest();
                req.open("GET", p, true);
                var jsonSupported = true;
                switch (type) {
                  case "buffer":
                    req.responseType = "arraybuffer";
                    break;
                  case "json":
                    try {
                      req.responseType = "json";
                      jsonSupported = req.responseType === "json";
                    } catch (e) {
                      jsonSupported = false;
                    }
                    break;
                  default:
                    return cb(
                      new ApiError(
                        ErrorCode.EINVAL,
                        "Invalid download type: " + type
                      )
                    );
                }
                req.onreadystatechange = function (e) {
                  if (req.readyState === 4) {
                    if (req.status === 200) {
                      switch (type) {
                        case "buffer":
                          return cb(
                            null,
                            req.response
                              ? Buffer2.from(req.response)
                              : emptyBuffer()
                          );
                        case "json":
                          if (jsonSupported) {
                            return cb(null, req.response);
                          } else {
                            return cb(null, JSON.parse(req.responseText));
                          }
                      }
                    } else {
                      return cb(new ApiError(req.status, "XHR error."));
                    }
                  }
                };
                req.send();
              }
              function syncDownloadFileModern(p, type) {
                var req = new XMLHttpRequest();
                req.open("GET", p, false);
                var data = null;
                var err = null;
                req.overrideMimeType("text/plain; charset=x-user-defined");
                req.onreadystatechange = function (e) {
                  if (req.readyState === 4) {
                    if (req.status === 200) {
                      switch (type) {
                        case "buffer":
                          var text = req.responseText;
                          data = Buffer2.alloc(text.length);
                          for (var i2 = 0; i2 < text.length; i2++) {
                            data[i2] = text.charCodeAt(i2);
                          }
                          return;
                        case "json":
                          data = JSON.parse(req.responseText);
                          return;
                      }
                    } else {
                      err = new ApiError(req.status, "XHR error.");
                      return;
                    }
                  }
                };
                req.send();
                if (err) {
                  throw err;
                }
                return data;
              }
              function syncDownloadFileIE10(p, type) {
                var req = new XMLHttpRequest();
                req.open("GET", p, false);
                switch (type) {
                  case "buffer":
                    req.responseType = "arraybuffer";
                    break;
                  case "json":
                    break;
                  default:
                    throw new ApiError(
                      ErrorCode.EINVAL,
                      "Invalid download type: " + type
                    );
                }
                var data;
                var err;
                req.onreadystatechange = function (e) {
                  if (req.readyState === 4) {
                    if (req.status === 200) {
                      switch (type) {
                        case "buffer":
                          data = Buffer2.from(req.response);
                          break;
                        case "json":
                          data = JSON.parse(req.response);
                          break;
                      }
                    } else {
                      err = new ApiError(req.status, "XHR error.");
                    }
                  }
                };
                req.send();
                if (err) {
                  throw err;
                }
                return data;
              }
              function getFileSize(async, p, cb) {
                var req = new XMLHttpRequest();
                req.open("HEAD", p, async);
                req.onreadystatechange = function (e) {
                  if (req.readyState === 4) {
                    if (req.status === 200) {
                      try {
                        return cb(
                          null,
                          parseInt(
                            req.getResponseHeader("Content-Length") || "-1",
                            10
                          )
                        );
                      } catch (e2) {
                        return cb(
                          new ApiError(
                            ErrorCode.EIO,
                            "XHR HEAD error: Could not read content-length."
                          )
                        );
                      }
                    } else {
                      return cb(new ApiError(req.status, "XHR HEAD error."));
                    }
                  }
                };
                req.send();
              }
              var asyncDownloadFile = asyncDownloadFileModern;
              var syncDownloadFile =
                isIE && typeof Blob !== "undefined"
                  ? syncDownloadFileIE10
                  : syncDownloadFileModern;
              function getFileSizeSync(p) {
                var rv = -1;
                getFileSize(false, p, function (err, size) {
                  if (err) {
                    throw err;
                  }
                  rv = size;
                });
                return rv;
              }
              function getFileSizeAsync(p, cb) {
                getFileSize(true, p, cb);
              }
              var FileIndex = function FileIndex2() {
                this._index = {};
                this.addPath("/", new DirInode());
              };
              FileIndex.fromListing = function fromListing(listing) {
                var idx = new FileIndex();
                var rootInode = new DirInode();
                idx._index["/"] = rootInode;
                var queue = [["", listing, rootInode]];
                while (queue.length > 0) {
                  var inode = void 0;
                  var next = queue.pop();
                  var pwd = next[0];
                  var tree = next[1];
                  var parent = next[2];
                  for (var node in tree) {
                    if (tree.hasOwnProperty(node)) {
                      var children = tree[node];
                      var name2 = pwd + "/" + node;
                      if (children) {
                        idx._index[name2] = inode = new DirInode();
                        queue.push([name2, children, inode]);
                      } else {
                        inode = new FileInode(
                          new Stats(FileType.FILE, -1, 365)
                        );
                      }
                      if (parent) {
                        parent._ls[node] = inode;
                      }
                    }
                  }
                }
                return idx;
              };
              FileIndex.prototype.fileIterator = function fileIterator(cb) {
                var this$1$1 = this;
                for (var path$$1 in this$1$1._index) {
                  if (this$1$1._index.hasOwnProperty(path$$1)) {
                    var dir = this$1$1._index[path$$1];
                    var files = dir.getListing();
                    for (
                      var i2 = 0, list2 = files;
                      i2 < list2.length;
                      i2 += 1
                    ) {
                      var file = list2[i2];
                      var item = dir.getItem(file);
                      if (isFileInode(item)) {
                        cb(item.getData());
                      }
                    }
                  }
                }
              };
              FileIndex.prototype.addPath = function addPath(path$$1, inode) {
                if (!inode) {
                  throw new Error("Inode must be specified");
                }
                if (path$$1[0] !== "/") {
                  throw new Error("Path must be absolute, got: " + path$$1);
                }
                if (this._index.hasOwnProperty(path$$1)) {
                  return this._index[path$$1] === inode;
                }
                var splitPath = this._split_path(path$$1);
                var dirpath = splitPath[0];
                var itemname = splitPath[1];
                var parent = this._index[dirpath];
                if (parent === void 0 && path$$1 !== "/") {
                  parent = new DirInode();
                  if (!this.addPath(dirpath, parent)) {
                    return false;
                  }
                }
                if (path$$1 !== "/") {
                  if (!parent.addItem(itemname, inode)) {
                    return false;
                  }
                }
                if (isDirInode(inode)) {
                  this._index[path$$1] = inode;
                }
                return true;
              };
              FileIndex.prototype.addPathFast = function addPathFast(
                path$$1,
                inode
              ) {
                var itemNameMark = path$$1.lastIndexOf("/");
                var parentPath =
                  itemNameMark === 0 ? "/" : path$$1.substring(0, itemNameMark);
                var itemName = path$$1.substring(itemNameMark + 1);
                var parent = this._index[parentPath];
                if (parent === void 0) {
                  parent = new DirInode();
                  this.addPathFast(parentPath, parent);
                }
                if (!parent.addItem(itemName, inode)) {
                  return false;
                }
                if (inode.isDir()) {
                  this._index[path$$1] = inode;
                }
                return true;
              };
              FileIndex.prototype.removePath = function removePath(path$$1) {
                var this$1$1 = this;
                var splitPath = this._split_path(path$$1);
                var dirpath = splitPath[0];
                var itemname = splitPath[1];
                var parent = this._index[dirpath];
                if (parent === void 0) {
                  return null;
                }
                var inode = parent.remItem(itemname);
                if (inode === null) {
                  return null;
                }
                if (isDirInode(inode)) {
                  var children = inode.getListing();
                  for (
                    var i2 = 0, list2 = children;
                    i2 < list2.length;
                    i2 += 1
                  ) {
                    var child = list2[i2];
                    this$1$1.removePath(path$$1 + "/" + child);
                  }
                  if (path$$1 !== "/") {
                    delete this._index[path$$1];
                  }
                }
                return inode;
              };
              FileIndex.prototype.ls = function ls(path$$1) {
                var item = this._index[path$$1];
                if (item === void 0) {
                  return null;
                }
                return item.getListing();
              };
              FileIndex.prototype.getInode = function getInode(path$$1) {
                var splitPath = this._split_path(path$$1);
                var dirpath = splitPath[0];
                var itemname = splitPath[1];
                var parent = this._index[dirpath];
                if (parent === void 0) {
                  return null;
                }
                if (dirpath === path$$1) {
                  return parent;
                }
                return parent.getItem(itemname);
              };
              FileIndex.prototype._split_path = function _split_path(p) {
                var dirpath = path2.dirname(p);
                var itemname = p.substr(
                  dirpath.length + (dirpath === "/" ? 0 : 1)
                );
                return [dirpath, itemname];
              };
              var FileInode = function FileInode2(data) {
                this.data = data;
              };
              FileInode.prototype.isFile = function isFile() {
                return true;
              };
              FileInode.prototype.isDir = function isDir() {
                return false;
              };
              FileInode.prototype.getData = function getData() {
                return this.data;
              };
              FileInode.prototype.setData = function setData(data) {
                this.data = data;
              };
              var DirInode = function DirInode2(data) {
                if (data === void 0) data = null;
                this.data = data;
                this._ls = {};
              };
              DirInode.prototype.isFile = function isFile() {
                return false;
              };
              DirInode.prototype.isDir = function isDir() {
                return true;
              };
              DirInode.prototype.getData = function getData() {
                return this.data;
              };
              DirInode.prototype.getStats = function getStats() {
                return new Stats(FileType.DIRECTORY, 4096, 365);
              };
              DirInode.prototype.getListing = function getListing() {
                return Object.keys(this._ls);
              };
              DirInode.prototype.getItem = function getItem(p) {
                var item = this._ls[p];
                return item ? item : null;
              };
              DirInode.prototype.addItem = function addItem(p, inode) {
                if (p in this._ls) {
                  return false;
                }
                this._ls[p] = inode;
                return true;
              };
              DirInode.prototype.remItem = function remItem(p) {
                var item = this._ls[p];
                if (item === void 0) {
                  return null;
                }
                delete this._ls[p];
                return item;
              };
              function isFileInode(inode) {
                return !!inode && inode.isFile();
              }
              function isDirInode(inode) {
                return !!inode && inode.isDir();
              }
              function tryToString(buff, encoding, cb) {
                try {
                  cb(null, buff.toString(encoding));
                } catch (e) {
                  cb(e);
                }
              }
              var XmlHttpRequest = (function (BaseFileSystem$$1) {
                function XmlHttpRequest2(
                  listingUrlOrObj,
                  prefixUrl,
                  deprecateMsg
                ) {
                  if (prefixUrl === void 0) prefixUrl = "";
                  if (deprecateMsg === void 0) deprecateMsg = true;
                  BaseFileSystem$$1.call(this);
                  if (!listingUrlOrObj) {
                    listingUrlOrObj = "index.json";
                  }
                  if (
                    prefixUrl.length > 0 &&
                    prefixUrl.charAt(prefixUrl.length - 1) !== "/"
                  ) {
                    prefixUrl = prefixUrl + "/";
                  }
                  this.prefixUrl = prefixUrl;
                  var listing = null;
                  if (typeof listingUrlOrObj === "string") {
                    listing = this._requestFileSync(listingUrlOrObj, "json");
                    if (!listing) {
                      throw new Error(
                        "Unable to find listing at URL: ${listingUrlOrObj}"
                      );
                    }
                  } else {
                    listing = listingUrlOrObj;
                  }
                  deprecationMessage(deprecateMsg, XmlHttpRequest2.Name, {
                    index:
                      typeof listingUrlOrObj === "string"
                        ? listingUrlOrObj
                        : "file index as an object",
                    baseUrl: prefixUrl,
                  });
                  this._index = FileIndex.fromListing(listing);
                }
                if (BaseFileSystem$$1)
                  XmlHttpRequest2.__proto__ = BaseFileSystem$$1;
                XmlHttpRequest2.prototype = Object.create(
                  BaseFileSystem$$1 && BaseFileSystem$$1.prototype
                );
                XmlHttpRequest2.prototype.constructor = XmlHttpRequest2;
                XmlHttpRequest2.Create = function Create(opts, cb) {
                  if (opts.index === void 0) {
                    opts.index = "index.json";
                  }
                  if (typeof opts.index === "string") {
                    XmlHttpRequest2.FromURL(
                      opts.index,
                      cb,
                      opts.baseUrl,
                      false
                    );
                  } else {
                    cb(
                      null,
                      new XmlHttpRequest2(opts.index, opts.baseUrl, false)
                    );
                  }
                };
                XmlHttpRequest2.isAvailable = function isAvailable() {
                  return (
                    typeof XMLHttpRequest !== "undefined" &&
                    XMLHttpRequest !== null
                  );
                };
                XmlHttpRequest2.FromURL = function FromURL(
                  url,
                  cb,
                  baseUrl,
                  deprecateMsg
                ) {
                  if (baseUrl === void 0)
                    baseUrl = url.slice(0, url.lastIndexOf("/") + 1);
                  if (deprecateMsg === void 0) deprecateMsg = true;
                  if (deprecateMsg) {
                    console.warn(
                      `[XmlHttpRequest] XmlHttpRequest.FromURL() is deprecated and will be removed in the next major release. Please use 'XmlHttpRequest.Create({ index: "` +
                        url +
                        '", baseUrl: "' +
                        baseUrl +
                        `" }, cb)' instead.`
                    );
                  }
                  asyncDownloadFile(url, "json", function (e, data) {
                    if (e) {
                      cb(e);
                    } else {
                      cb(null, new XmlHttpRequest2(data, baseUrl, false));
                    }
                  });
                };
                XmlHttpRequest2.prototype.empty = function empty() {
                  this._index.fileIterator(function (file) {
                    file.fileData = null;
                  });
                };
                XmlHttpRequest2.prototype.getName = function getName() {
                  return XmlHttpRequest2.Name;
                };
                XmlHttpRequest2.prototype.diskSpace = function diskSpace(
                  path$$1,
                  cb
                ) {
                  cb(0, 0);
                };
                XmlHttpRequest2.prototype.isReadOnly = function isReadOnly() {
                  return true;
                };
                XmlHttpRequest2.prototype.supportsLinks =
                  function supportsLinks() {
                    return false;
                  };
                XmlHttpRequest2.prototype.supportsProps =
                  function supportsProps() {
                    return false;
                  };
                XmlHttpRequest2.prototype.supportsSynch =
                  function supportsSynch() {
                    return true;
                  };
                XmlHttpRequest2.prototype.preloadFile = function preloadFile(
                  path$$1,
                  buffer$$1
                ) {
                  var inode = this._index.getInode(path$$1);
                  if (isFileInode(inode)) {
                    if (inode === null) {
                      throw ApiError.ENOENT(path$$1);
                    }
                    var stats = inode.getData();
                    stats.size = buffer$$1.length;
                    stats.fileData = buffer$$1;
                  } else {
                    throw ApiError.EISDIR(path$$1);
                  }
                };
                XmlHttpRequest2.prototype.stat = function stat(
                  path$$1,
                  isLstat,
                  cb
                ) {
                  var inode = this._index.getInode(path$$1);
                  if (inode === null) {
                    return cb(ApiError.ENOENT(path$$1));
                  }
                  var stats;
                  if (isFileInode(inode)) {
                    stats = inode.getData();
                    if (stats.size < 0) {
                      this._requestFileSizeAsync(path$$1, function (e, size) {
                        if (e) {
                          return cb(e);
                        }
                        stats.size = size;
                        cb(null, stats.clone());
                      });
                    } else {
                      cb(null, stats.clone());
                    }
                  } else if (isDirInode(inode)) {
                    stats = inode.getStats();
                    cb(null, stats);
                  } else {
                    cb(ApiError.FileError(ErrorCode.EINVAL, path$$1));
                  }
                };
                XmlHttpRequest2.prototype.statSync = function statSync(
                  path$$1,
                  isLstat
                ) {
                  var inode = this._index.getInode(path$$1);
                  if (inode === null) {
                    throw ApiError.ENOENT(path$$1);
                  }
                  var stats;
                  if (isFileInode(inode)) {
                    stats = inode.getData();
                    if (stats.size < 0) {
                      stats.size = this._requestFileSizeSync(path$$1);
                    }
                  } else if (isDirInode(inode)) {
                    stats = inode.getStats();
                  } else {
                    throw ApiError.FileError(ErrorCode.EINVAL, path$$1);
                  }
                  return stats;
                };
                XmlHttpRequest2.prototype.open = function open(
                  path$$1,
                  flags,
                  mode,
                  cb
                ) {
                  if (flags.isWriteable()) {
                    return cb(new ApiError(ErrorCode.EPERM, path$$1));
                  }
                  var self2 = this;
                  var inode = this._index.getInode(path$$1);
                  if (inode === null) {
                    return cb(ApiError.ENOENT(path$$1));
                  }
                  if (isFileInode(inode)) {
                    var stats = inode.getData();
                    switch (flags.pathExistsAction()) {
                      case ActionType.THROW_EXCEPTION:
                      case ActionType.TRUNCATE_FILE:
                        return cb(ApiError.EEXIST(path$$1));
                      case ActionType.NOP:
                        if (stats.fileData) {
                          return cb(
                            null,
                            new NoSyncFile(
                              self2,
                              path$$1,
                              flags,
                              stats.clone(),
                              stats.fileData
                            )
                          );
                        }
                        this._requestFileAsync(
                          path$$1,
                          "buffer",
                          function (err, buffer$$1) {
                            if (err) {
                              return cb(err);
                            }
                            stats.size = buffer$$1.length;
                            stats.fileData = buffer$$1;
                            return cb(
                              null,
                              new NoSyncFile(
                                self2,
                                path$$1,
                                flags,
                                stats.clone(),
                                buffer$$1
                              )
                            );
                          }
                        );
                        break;
                      default:
                        return cb(
                          new ApiError(
                            ErrorCode.EINVAL,
                            "Invalid FileMode object."
                          )
                        );
                    }
                  } else {
                    return cb(ApiError.EISDIR(path$$1));
                  }
                };
                XmlHttpRequest2.prototype.openSync = function openSync(
                  path$$1,
                  flags,
                  mode
                ) {
                  if (flags.isWriteable()) {
                    throw new ApiError(ErrorCode.EPERM, path$$1);
                  }
                  var inode = this._index.getInode(path$$1);
                  if (inode === null) {
                    throw ApiError.ENOENT(path$$1);
                  }
                  if (isFileInode(inode)) {
                    var stats = inode.getData();
                    switch (flags.pathExistsAction()) {
                      case ActionType.THROW_EXCEPTION:
                      case ActionType.TRUNCATE_FILE:
                        throw ApiError.EEXIST(path$$1);
                      case ActionType.NOP:
                        if (stats.fileData) {
                          return new NoSyncFile(
                            this,
                            path$$1,
                            flags,
                            stats.clone(),
                            stats.fileData
                          );
                        }
                        var buffer$$1 = this._requestFileSync(
                          path$$1,
                          "buffer"
                        );
                        stats.size = buffer$$1.length;
                        stats.fileData = buffer$$1;
                        return new NoSyncFile(
                          this,
                          path$$1,
                          flags,
                          stats.clone(),
                          buffer$$1
                        );
                      default:
                        throw new ApiError(
                          ErrorCode.EINVAL,
                          "Invalid FileMode object."
                        );
                    }
                  } else {
                    throw ApiError.EISDIR(path$$1);
                  }
                };
                XmlHttpRequest2.prototype.readdir = function readdir(
                  path$$1,
                  cb
                ) {
                  try {
                    cb(null, this.readdirSync(path$$1));
                  } catch (e) {
                    cb(e);
                  }
                };
                XmlHttpRequest2.prototype.readdirSync = function readdirSync(
                  path$$1
                ) {
                  var inode = this._index.getInode(path$$1);
                  if (inode === null) {
                    throw ApiError.ENOENT(path$$1);
                  } else if (isDirInode(inode)) {
                    return inode.getListing();
                  } else {
                    throw ApiError.ENOTDIR(path$$1);
                  }
                };
                XmlHttpRequest2.prototype.readFile = function readFile(
                  fname,
                  encoding,
                  flag,
                  cb
                ) {
                  var oldCb = cb;
                  this.open(fname, flag, 420, function (err, fd) {
                    if (err) {
                      return cb(err);
                    }
                    cb = function (err2, arg) {
                      fd.close(function (err22) {
                        if (!err2) {
                          err2 = err22;
                        }
                        return oldCb(err2, arg);
                      });
                    };
                    var fdCast = fd;
                    var fdBuff = fdCast.getBuffer();
                    if (encoding === null) {
                      cb(err, copyingSlice(fdBuff));
                    } else {
                      tryToString(fdBuff, encoding, cb);
                    }
                  });
                };
                XmlHttpRequest2.prototype.readFileSync = function readFileSync(
                  fname,
                  encoding,
                  flag
                ) {
                  var fd = this.openSync(fname, flag, 420);
                  try {
                    var fdCast = fd;
                    var fdBuff = fdCast.getBuffer();
                    if (encoding === null) {
                      return copyingSlice(fdBuff);
                    }
                    return fdBuff.toString(encoding);
                  } finally {
                    fd.closeSync();
                  }
                };
                XmlHttpRequest2.prototype.getXhrPath = function getXhrPath(
                  filePath
                ) {
                  if (filePath.charAt(0) === "/") {
                    filePath = filePath.slice(1);
                  }
                  return this.prefixUrl + filePath;
                };
                XmlHttpRequest2.prototype._requestFileAsync =
                  function _requestFileAsync(p, type, cb) {
                    asyncDownloadFile(this.getXhrPath(p), type, cb);
                  };
                XmlHttpRequest2.prototype._requestFileSync =
                  function _requestFileSync(p, type) {
                    return syncDownloadFile(this.getXhrPath(p), type);
                  };
                XmlHttpRequest2.prototype._requestFileSizeAsync =
                  function _requestFileSizeAsync(path$$1, cb) {
                    getFileSizeAsync(this.getXhrPath(path$$1), cb);
                  };
                XmlHttpRequest2.prototype._requestFileSizeSync =
                  function _requestFileSizeSync(path$$1) {
                    return getFileSizeSync(this.getXhrPath(path$$1));
                  };
                return XmlHttpRequest2;
              })(BaseFileSystem);
              XmlHttpRequest.Name = "XmlHttpRequest";
              XmlHttpRequest.Options = {
                index: {
                  type: ["string", "object"],
                  optional: true,
                  description:
                    "URL to a file index as a JSON file or the file index object itself, generated with the make_xhrfs_index script. Defaults to `index.json`.",
                },
                baseUrl: {
                  type: "string",
                  optional: true,
                  description:
                    "Used as the URL prefix for fetched files. Default: Fetch files relative to the index.",
                },
              };
              var ExtendedASCII = function ExtendedASCII2() {};
              ExtendedASCII.str2byte = function str2byte(str, buf) {
                var length = str.length > buf.length ? buf.length : str.length;
                for (var i2 = 0; i2 < length; i2++) {
                  var charCode = str.charCodeAt(i2);
                  if (charCode > 127) {
                    var charIdx = ExtendedASCII.extendedChars.indexOf(
                      str.charAt(i2)
                    );
                    if (charIdx > -1) {
                      charCode = charIdx + 128;
                    }
                  }
                  buf[charCode] = i2;
                }
                return length;
              };
              ExtendedASCII.byte2str = function byte2str(buff) {
                var chars = new Array(buff.length);
                for (var i2 = 0; i2 < buff.length; i2++) {
                  var charCode = buff[i2];
                  if (charCode > 127) {
                    chars[i2] = ExtendedASCII.extendedChars[charCode - 128];
                  } else {
                    chars[i2] = String.fromCharCode(charCode);
                  }
                }
                return chars.join("");
              };
              ExtendedASCII.byteLength = function byteLength(str) {
                return str.length;
              };
              ExtendedASCII.extendedChars = [
                "Ç",
                "ü",
                "é",
                "â",
                "ä",
                "à",
                "å",
                "ç",
                "ê",
                "ë",
                "è",
                "ï",
                "î",
                "ì",
                "Ä",
                "Å",
                "É",
                "æ",
                "Æ",
                "ô",
                "ö",
                "ò",
                "û",
                "ù",
                "ÿ",
                "Ö",
                "Ü",
                "ø",
                "£",
                "Ø",
                "×",
                "ƒ",
                "á",
                "í",
                "ó",
                "ú",
                "ñ",
                "Ñ",
                "ª",
                "º",
                "¿",
                "®",
                "¬",
                "½",
                "¼",
                "¡",
                "«",
                "»",
                "_",
                "_",
                "_",
                "¦",
                "¦",
                "Á",
                "Â",
                "À",
                "©",
                "¦",
                "¦",
                "+",
                "+",
                "¢",
                "¥",
                "+",
                "+",
                "-",
                "-",
                "+",
                "-",
                "+",
                "ã",
                "Ã",
                "+",
                "+",
                "-",
                "-",
                "¦",
                "-",
                "+",
                "¤",
                "ð",
                "Ð",
                "Ê",
                "Ë",
                "È",
                "i",
                "Í",
                "Î",
                "Ï",
                "+",
                "+",
                "_",
                "_",
                "¦",
                "Ì",
                "_",
                "Ó",
                "ß",
                "Ô",
                "Ò",
                "õ",
                "Õ",
                "µ",
                "þ",
                "Þ",
                "Ú",
                "Û",
                "Ù",
                "ý",
                "Ý",
                "¯",
                "´",
                "­",
                "±",
                "_",
                "¾",
                "¶",
                "§",
                "÷",
                "¸",
                "°",
                "¨",
                "·",
                "¹",
                "³",
                "²",
                "_",
                " ",
              ];
              var inflateRaw = __webpack_require__(31).inflateRaw;
              var decompressionMethods = {};
              var ExternalFileAttributeType;
              (function (ExternalFileAttributeType2) {
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["MSDOS"] = 0)
                ] = "MSDOS";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["AMIGA"] = 1)
                ] = "AMIGA";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["OPENVMS"] = 2)
                ] = "OPENVMS";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["UNIX"] = 3)
                ] = "UNIX";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["VM_CMS"] = 4)
                ] = "VM_CMS";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["ATARI_ST"] = 5)
                ] = "ATARI_ST";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["OS2_HPFS"] = 6)
                ] = "OS2_HPFS";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["MAC"] = 7)
                ] = "MAC";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["Z_SYSTEM"] = 8)
                ] = "Z_SYSTEM";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["CP_M"] = 9)
                ] = "CP_M";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["NTFS"] = 10)
                ] = "NTFS";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["MVS"] = 11)
                ] = "MVS";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["VSE"] = 12)
                ] = "VSE";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["ACORN_RISC"] = 13)
                ] = "ACORN_RISC";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["VFAT"] = 14)
                ] = "VFAT";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["ALT_MVS"] = 15)
                ] = "ALT_MVS";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["BEOS"] = 16)
                ] = "BEOS";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["TANDEM"] = 17)
                ] = "TANDEM";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["OS_400"] = 18)
                ] = "OS_400";
                ExternalFileAttributeType2[
                  (ExternalFileAttributeType2["OSX"] = 19)
                ] = "OSX";
              })(ExternalFileAttributeType || (ExternalFileAttributeType = {}));
              var CompressionMethod;
              (function (CompressionMethod2) {
                CompressionMethod2[(CompressionMethod2["STORED"] = 0)] =
                  "STORED";
                CompressionMethod2[(CompressionMethod2["SHRUNK"] = 1)] =
                  "SHRUNK";
                CompressionMethod2[(CompressionMethod2["REDUCED_1"] = 2)] =
                  "REDUCED_1";
                CompressionMethod2[(CompressionMethod2["REDUCED_2"] = 3)] =
                  "REDUCED_2";
                CompressionMethod2[(CompressionMethod2["REDUCED_3"] = 4)] =
                  "REDUCED_3";
                CompressionMethod2[(CompressionMethod2["REDUCED_4"] = 5)] =
                  "REDUCED_4";
                CompressionMethod2[(CompressionMethod2["IMPLODE"] = 6)] =
                  "IMPLODE";
                CompressionMethod2[(CompressionMethod2["DEFLATE"] = 8)] =
                  "DEFLATE";
                CompressionMethod2[(CompressionMethod2["DEFLATE64"] = 9)] =
                  "DEFLATE64";
                CompressionMethod2[(CompressionMethod2["TERSE_OLD"] = 10)] =
                  "TERSE_OLD";
                CompressionMethod2[(CompressionMethod2["BZIP2"] = 12)] =
                  "BZIP2";
                CompressionMethod2[(CompressionMethod2["LZMA"] = 14)] = "LZMA";
                CompressionMethod2[(CompressionMethod2["TERSE_NEW"] = 18)] =
                  "TERSE_NEW";
                CompressionMethod2[(CompressionMethod2["LZ77"] = 19)] = "LZ77";
                CompressionMethod2[(CompressionMethod2["WAVPACK"] = 97)] =
                  "WAVPACK";
                CompressionMethod2[(CompressionMethod2["PPMD"] = 98)] = "PPMD";
              })(CompressionMethod || (CompressionMethod = {}));
              function msdos2date(time, date) {
                var day = date & 31;
                var month = ((date >> 5) & 15) - 1;
                var year = (date >> 9) + 1980;
                var second = time & 31;
                var minute = (time >> 5) & 63;
                var hour = time >> 11;
                return new Date(year, month, day, hour, minute, second);
              }
              function safeToString(buff, useUTF8, start, length) {
                if (length === 0) {
                  return "";
                } else if (useUTF8) {
                  return buff.toString("utf8", start, start + length);
                } else {
                  return ExtendedASCII.byte2str(
                    buff.slice(start, start + length)
                  );
                }
              }
              var FileHeader = function FileHeader2(data) {
                this.data = data;
                if (data.readUInt32LE(0) !== 67324752) {
                  throw new ApiError(
                    ErrorCode.EINVAL,
                    "Invalid Zip file: Local file header has invalid signature: " +
                      this.data.readUInt32LE(0)
                  );
                }
              };
              FileHeader.prototype.versionNeeded = function versionNeeded() {
                return this.data.readUInt16LE(4);
              };
              FileHeader.prototype.flags = function flags() {
                return this.data.readUInt16LE(6);
              };
              FileHeader.prototype.compressionMethod =
                function compressionMethod() {
                  return this.data.readUInt16LE(8);
                };
              FileHeader.prototype.lastModFileTime =
                function lastModFileTime() {
                  return msdos2date(
                    this.data.readUInt16LE(10),
                    this.data.readUInt16LE(12)
                  );
                };
              FileHeader.prototype.rawLastModFileTime =
                function rawLastModFileTime() {
                  return this.data.readUInt32LE(10);
                };
              FileHeader.prototype.crc32 = function crc32() {
                return this.data.readUInt32LE(14);
              };
              FileHeader.prototype.fileNameLength = function fileNameLength() {
                return this.data.readUInt16LE(26);
              };
              FileHeader.prototype.extraFieldLength =
                function extraFieldLength() {
                  return this.data.readUInt16LE(28);
                };
              FileHeader.prototype.fileName = function fileName() {
                return safeToString(
                  this.data,
                  this.useUTF8(),
                  30,
                  this.fileNameLength()
                );
              };
              FileHeader.prototype.extraField = function extraField() {
                var start = 30 + this.fileNameLength();
                return this.data.slice(start, start + this.extraFieldLength());
              };
              FileHeader.prototype.totalSize = function totalSize() {
                return 30 + this.fileNameLength() + this.extraFieldLength();
              };
              FileHeader.prototype.useUTF8 = function useUTF8() {
                return (this.flags() & 2048) === 2048;
              };
              var FileData = function FileData2(header, record, data) {
                this.header = header;
                this.record = record;
                this.data = data;
              };
              FileData.prototype.decompress = function decompress() {
                var compressionMethod = this.header.compressionMethod();
                var fcn = decompressionMethods[compressionMethod];
                if (fcn) {
                  return fcn(
                    this.data,
                    this.record.compressedSize(),
                    this.record.uncompressedSize(),
                    this.record.flag()
                  );
                } else {
                  var name2 = CompressionMethod[compressionMethod];
                  if (!name2) {
                    name2 = "Unknown: " + compressionMethod;
                  }
                  throw new ApiError(
                    ErrorCode.EINVAL,
                    "Invalid compression method on file '" +
                      this.header.fileName() +
                      "': " +
                      name2
                  );
                }
              };
              FileData.prototype.getHeader = function getHeader() {
                return this.header;
              };
              FileData.prototype.getRecord = function getRecord() {
                return this.record;
              };
              FileData.prototype.getRawData = function getRawData() {
                return this.data;
              };
              var CentralDirectory = function CentralDirectory2(zipData, data) {
                this.zipData = zipData;
                this.data = data;
                if (this.data.readUInt32LE(0) !== 33639248) {
                  throw new ApiError(
                    ErrorCode.EINVAL,
                    "Invalid Zip file: Central directory record has invalid signature: " +
                      this.data.readUInt32LE(0)
                  );
                }
                this._filename = this.produceFilename();
              };
              CentralDirectory.prototype.versionMadeBy =
                function versionMadeBy() {
                  return this.data.readUInt16LE(4);
                };
              CentralDirectory.prototype.versionNeeded =
                function versionNeeded() {
                  return this.data.readUInt16LE(6);
                };
              CentralDirectory.prototype.flag = function flag() {
                return this.data.readUInt16LE(8);
              };
              CentralDirectory.prototype.compressionMethod =
                function compressionMethod() {
                  return this.data.readUInt16LE(10);
                };
              CentralDirectory.prototype.lastModFileTime =
                function lastModFileTime() {
                  return msdos2date(
                    this.data.readUInt16LE(12),
                    this.data.readUInt16LE(14)
                  );
                };
              CentralDirectory.prototype.rawLastModFileTime =
                function rawLastModFileTime() {
                  return this.data.readUInt32LE(12);
                };
              CentralDirectory.prototype.crc32 = function crc32() {
                return this.data.readUInt32LE(16);
              };
              CentralDirectory.prototype.compressedSize =
                function compressedSize() {
                  return this.data.readUInt32LE(20);
                };
              CentralDirectory.prototype.uncompressedSize =
                function uncompressedSize() {
                  return this.data.readUInt32LE(24);
                };
              CentralDirectory.prototype.fileNameLength =
                function fileNameLength() {
                  return this.data.readUInt16LE(28);
                };
              CentralDirectory.prototype.extraFieldLength =
                function extraFieldLength() {
                  return this.data.readUInt16LE(30);
                };
              CentralDirectory.prototype.fileCommentLength =
                function fileCommentLength() {
                  return this.data.readUInt16LE(32);
                };
              CentralDirectory.prototype.diskNumberStart =
                function diskNumberStart() {
                  return this.data.readUInt16LE(34);
                };
              CentralDirectory.prototype.internalAttributes =
                function internalAttributes() {
                  return this.data.readUInt16LE(36);
                };
              CentralDirectory.prototype.externalAttributes =
                function externalAttributes() {
                  return this.data.readUInt32LE(38);
                };
              CentralDirectory.prototype.headerRelativeOffset =
                function headerRelativeOffset() {
                  return this.data.readUInt32LE(42);
                };
              CentralDirectory.prototype.produceFilename =
                function produceFilename() {
                  var fileName = safeToString(
                    this.data,
                    this.useUTF8(),
                    46,
                    this.fileNameLength()
                  );
                  return fileName.replace(/\\/g, "/");
                };
              CentralDirectory.prototype.fileName = function fileName() {
                return this._filename;
              };
              CentralDirectory.prototype.rawFileName = function rawFileName() {
                return this.data.slice(46, 46 + this.fileNameLength());
              };
              CentralDirectory.prototype.extraField = function extraField() {
                var start = 44 + this.fileNameLength();
                return this.data.slice(start, start + this.extraFieldLength());
              };
              CentralDirectory.prototype.fileComment = function fileComment() {
                var start =
                  46 + this.fileNameLength() + this.extraFieldLength();
                return safeToString(
                  this.data,
                  this.useUTF8(),
                  start,
                  this.fileCommentLength()
                );
              };
              CentralDirectory.prototype.rawFileComment =
                function rawFileComment() {
                  var start =
                    46 + this.fileNameLength() + this.extraFieldLength();
                  return this.data.slice(
                    start,
                    start + this.fileCommentLength()
                  );
                };
              CentralDirectory.prototype.totalSize = function totalSize() {
                return (
                  46 +
                  this.fileNameLength() +
                  this.extraFieldLength() +
                  this.fileCommentLength()
                );
              };
              CentralDirectory.prototype.isDirectory = function isDirectory() {
                var fileName = this.fileName();
                return (
                  (this.externalAttributes() & 16 ? true : false) ||
                  fileName.charAt(fileName.length - 1) === "/"
                );
              };
              CentralDirectory.prototype.isFile = function isFile() {
                return !this.isDirectory();
              };
              CentralDirectory.prototype.useUTF8 = function useUTF8() {
                return (this.flag() & 2048) === 2048;
              };
              CentralDirectory.prototype.isEncrypted = function isEncrypted() {
                return (this.flag() & 1) === 1;
              };
              CentralDirectory.prototype.getFileData = function getFileData() {
                var start = this.headerRelativeOffset();
                var header = new FileHeader(this.zipData.slice(start));
                return new FileData(
                  header,
                  this,
                  this.zipData.slice(start + header.totalSize())
                );
              };
              CentralDirectory.prototype.getData = function getData() {
                return this.getFileData().decompress();
              };
              CentralDirectory.prototype.getRawData = function getRawData() {
                return this.getFileData().getRawData();
              };
              CentralDirectory.prototype.getStats = function getStats() {
                return new Stats(
                  FileType.FILE,
                  this.uncompressedSize(),
                  365,
                  /* @__PURE__ */ new Date(),
                  this.lastModFileTime()
                );
              };
              var EndOfCentralDirectory = function EndOfCentralDirectory2(
                data
              ) {
                this.data = data;
                if (this.data.readUInt32LE(0) !== 101010256) {
                  throw new ApiError(
                    ErrorCode.EINVAL,
                    "Invalid Zip file: End of central directory record has invalid signature: " +
                      this.data.readUInt32LE(0)
                  );
                }
              };
              EndOfCentralDirectory.prototype.diskNumber =
                function diskNumber() {
                  return this.data.readUInt16LE(4);
                };
              EndOfCentralDirectory.prototype.cdDiskNumber =
                function cdDiskNumber() {
                  return this.data.readUInt16LE(6);
                };
              EndOfCentralDirectory.prototype.cdDiskEntryCount =
                function cdDiskEntryCount() {
                  return this.data.readUInt16LE(8);
                };
              EndOfCentralDirectory.prototype.cdTotalEntryCount =
                function cdTotalEntryCount() {
                  return this.data.readUInt16LE(10);
                };
              EndOfCentralDirectory.prototype.cdSize = function cdSize() {
                return this.data.readUInt32LE(12);
              };
              EndOfCentralDirectory.prototype.cdOffset = function cdOffset() {
                return this.data.readUInt32LE(16);
              };
              EndOfCentralDirectory.prototype.cdZipCommentLength =
                function cdZipCommentLength() {
                  return this.data.readUInt16LE(20);
                };
              EndOfCentralDirectory.prototype.cdZipComment =
                function cdZipComment() {
                  return safeToString(
                    this.data,
                    true,
                    22,
                    this.cdZipCommentLength()
                  );
                };
              EndOfCentralDirectory.prototype.rawCdZipComment =
                function rawCdZipComment() {
                  return this.data.slice(22, 22 + this.cdZipCommentLength());
                };
              var ZipTOC = function ZipTOC2(
                index,
                directoryEntries,
                eocd,
                data
              ) {
                this.index = index;
                this.directoryEntries = directoryEntries;
                this.eocd = eocd;
                this.data = data;
              };
              var ZipFS = (function (SynchronousFileSystem$$1) {
                function ZipFS2(input, name2, deprecateMsg) {
                  if (name2 === void 0) name2 = "";
                  if (deprecateMsg === void 0) deprecateMsg = true;
                  SynchronousFileSystem$$1.call(this);
                  this.name = name2;
                  this._index = new FileIndex();
                  this._directoryEntries = [];
                  this._eocd = null;
                  deprecationMessage(deprecateMsg, ZipFS2.Name, {
                    zipData: "zip data as a Buffer",
                    name: name2,
                  });
                  if (input instanceof ZipTOC) {
                    this._index = input.index;
                    this._directoryEntries = input.directoryEntries;
                    this._eocd = input.eocd;
                    this.data = input.data;
                  } else {
                    this.data = input;
                    this.populateIndex();
                  }
                }
                if (SynchronousFileSystem$$1)
                  ZipFS2.__proto__ = SynchronousFileSystem$$1;
                ZipFS2.prototype = Object.create(
                  SynchronousFileSystem$$1 && SynchronousFileSystem$$1.prototype
                );
                ZipFS2.prototype.constructor = ZipFS2;
                ZipFS2.Create = function Create(opts, cb) {
                  try {
                    ZipFS2.computeIndex(
                      opts.zipData,
                      function (zipTOC) {
                        var fs2 = new ZipFS2(zipTOC, opts.name, false);
                        cb(null, fs2);
                      },
                      false
                    );
                  } catch (e) {
                    cb(e);
                  }
                };
                ZipFS2.isAvailable = function isAvailable() {
                  return true;
                };
                ZipFS2.RegisterDecompressionMethod =
                  function RegisterDecompressionMethod(m, fcn) {
                    decompressionMethods[m] = fcn;
                  };
                ZipFS2.computeIndex = function computeIndex(
                  data,
                  cb,
                  deprecateMsg
                ) {
                  if (deprecateMsg === void 0) deprecateMsg = true;
                  if (deprecateMsg) {
                    console.warn(
                      "[ZipFS] ZipFS.computeIndex is now deprecated, and will be removed in the next major release. Please update your code to use 'ZipFS.Create({ zipData: zip file as a Buffer}, cb)' instead."
                    );
                  }
                  var index = new FileIndex();
                  var eocd = ZipFS2.getEOCD(data);
                  if (eocd.diskNumber() !== eocd.cdDiskNumber()) {
                    throw new ApiError(
                      ErrorCode.EINVAL,
                      "ZipFS does not support spanned zip files."
                    );
                  }
                  var cdPtr = eocd.cdOffset();
                  if (cdPtr === 4294967295) {
                    throw new ApiError(
                      ErrorCode.EINVAL,
                      "ZipFS does not support Zip64."
                    );
                  }
                  var cdEnd = cdPtr + eocd.cdSize();
                  ZipFS2.computeIndexResponsive(
                    data,
                    index,
                    cdPtr,
                    cdEnd,
                    cb,
                    [],
                    eocd
                  );
                };
                ZipFS2.getEOCD = function getEOCD(data) {
                  var startOffset = 22;
                  var endOffset = Math.min(
                    startOffset + 65535,
                    data.length - 1
                  );
                  for (var i2 = startOffset; i2 < endOffset; i2++) {
                    if (data.readUInt32LE(data.length - i2) === 101010256) {
                      return new EndOfCentralDirectory(
                        data.slice(data.length - i2)
                      );
                    }
                  }
                  throw new ApiError(
                    ErrorCode.EINVAL,
                    "Invalid ZIP file: Could not locate End of Central Directory signature."
                  );
                };
                ZipFS2.addToIndex = function addToIndex(cd, index) {
                  var filename = cd.fileName();
                  if (filename.charAt(0) === "/") {
                    throw new Error("WHY IS THIS ABSOLUTE");
                  }
                  if (filename.charAt(filename.length - 1) === "/") {
                    filename = filename.substr(0, filename.length - 1);
                  }
                  if (cd.isDirectory()) {
                    index.addPathFast("/" + filename, new DirInode(cd));
                  } else {
                    index.addPathFast("/" + filename, new FileInode(cd));
                  }
                };
                ZipFS2.computeIndexResponsive = function computeIndexResponsive(
                  data,
                  index,
                  cdPtr,
                  cdEnd,
                  cb,
                  cdEntries,
                  eocd
                ) {
                  if (cdPtr < cdEnd) {
                    var count = 0;
                    while (count++ < 200 && cdPtr < cdEnd) {
                      var cd = new CentralDirectory(data, data.slice(cdPtr));
                      ZipFS2.addToIndex(cd, index);
                      cdPtr += cd.totalSize();
                      cdEntries.push(cd);
                    }
                    setImmediate$3(function () {
                      ZipFS2.computeIndexResponsive(
                        data,
                        index,
                        cdPtr,
                        cdEnd,
                        cb,
                        cdEntries,
                        eocd
                      );
                    });
                  } else {
                    cb(new ZipTOC(index, cdEntries, eocd, data));
                  }
                };
                ZipFS2.prototype.getName = function getName() {
                  return (
                    ZipFS2.Name + (this.name !== "" ? " " + this.name : "")
                  );
                };
                ZipFS2.prototype.getCentralDirectoryEntry =
                  function getCentralDirectoryEntry(path$$1) {
                    var inode = this._index.getInode(path$$1);
                    if (inode === null) {
                      throw ApiError.ENOENT(path$$1);
                    }
                    if (isFileInode(inode)) {
                      return inode.getData();
                    } else if (isDirInode(inode)) {
                      return inode.getData();
                    } else {
                      throw ApiError.EPERM("Invalid inode: " + inode);
                    }
                  };
                ZipFS2.prototype.getCentralDirectoryEntryAt =
                  function getCentralDirectoryEntryAt(index) {
                    var dirEntry = this._directoryEntries[index];
                    if (!dirEntry) {
                      throw new RangeError(
                        "Invalid directory index: " + index + "."
                      );
                    }
                    return dirEntry;
                  };
                ZipFS2.prototype.getNumberOfCentralDirectoryEntries =
                  function getNumberOfCentralDirectoryEntries() {
                    return this._directoryEntries.length;
                  };
                ZipFS2.prototype.getEndOfCentralDirectory =
                  function getEndOfCentralDirectory() {
                    return this._eocd;
                  };
                ZipFS2.prototype.diskSpace = function diskSpace(path$$1, cb) {
                  cb(this.data.length, 0);
                };
                ZipFS2.prototype.isReadOnly = function isReadOnly() {
                  return true;
                };
                ZipFS2.prototype.supportsLinks = function supportsLinks() {
                  return false;
                };
                ZipFS2.prototype.supportsProps = function supportsProps() {
                  return false;
                };
                ZipFS2.prototype.supportsSynch = function supportsSynch() {
                  return true;
                };
                ZipFS2.prototype.statSync = function statSync(
                  path$$1,
                  isLstat
                ) {
                  var inode = this._index.getInode(path$$1);
                  if (inode === null) {
                    throw ApiError.ENOENT(path$$1);
                  }
                  var stats;
                  if (isFileInode(inode)) {
                    stats = inode.getData().getStats();
                  } else if (isDirInode(inode)) {
                    stats = inode.getStats();
                  } else {
                    throw new ApiError(ErrorCode.EINVAL, "Invalid inode.");
                  }
                  return stats;
                };
                ZipFS2.prototype.openSync = function openSync(
                  path$$1,
                  flags,
                  mode
                ) {
                  if (flags.isWriteable()) {
                    throw new ApiError(ErrorCode.EPERM, path$$1);
                  }
                  var inode = this._index.getInode(path$$1);
                  if (!inode) {
                    throw ApiError.ENOENT(path$$1);
                  } else if (isFileInode(inode)) {
                    var cdRecord = inode.getData();
                    var stats = cdRecord.getStats();
                    switch (flags.pathExistsAction()) {
                      case ActionType.THROW_EXCEPTION:
                      case ActionType.TRUNCATE_FILE:
                        throw ApiError.EEXIST(path$$1);
                      case ActionType.NOP:
                        return new NoSyncFile(
                          this,
                          path$$1,
                          flags,
                          stats,
                          cdRecord.getData()
                        );
                      default:
                        throw new ApiError(
                          ErrorCode.EINVAL,
                          "Invalid FileMode object."
                        );
                    }
                  } else {
                    throw ApiError.EISDIR(path$$1);
                  }
                };
                ZipFS2.prototype.readdirSync = function readdirSync(path$$1) {
                  var inode = this._index.getInode(path$$1);
                  if (!inode) {
                    throw ApiError.ENOENT(path$$1);
                  } else if (isDirInode(inode)) {
                    return inode.getListing();
                  } else {
                    throw ApiError.ENOTDIR(path$$1);
                  }
                };
                ZipFS2.prototype.readFileSync = function readFileSync(
                  fname,
                  encoding,
                  flag
                ) {
                  var fd = this.openSync(fname, flag, 420);
                  try {
                    var fdCast = fd;
                    var fdBuff = fdCast.getBuffer();
                    if (encoding === null) {
                      return copyingSlice(fdBuff);
                    }
                    return fdBuff.toString(encoding);
                  } finally {
                    fd.closeSync();
                  }
                };
                ZipFS2.prototype.populateIndex = function populateIndex() {
                  var this$1$1 = this;
                  var eocd = (this._eocd = ZipFS2.getEOCD(this.data));
                  if (eocd.diskNumber() !== eocd.cdDiskNumber()) {
                    throw new ApiError(
                      ErrorCode.EINVAL,
                      "ZipFS does not support spanned zip files."
                    );
                  }
                  var cdPtr = eocd.cdOffset();
                  if (cdPtr === 4294967295) {
                    throw new ApiError(
                      ErrorCode.EINVAL,
                      "ZipFS does not support Zip64."
                    );
                  }
                  var cdEnd = cdPtr + eocd.cdSize();
                  while (cdPtr < cdEnd) {
                    var cd = new CentralDirectory(
                      this$1$1.data,
                      this$1$1.data.slice(cdPtr)
                    );
                    cdPtr += cd.totalSize();
                    ZipFS2.addToIndex(cd, this$1$1._index);
                    this$1$1._directoryEntries.push(cd);
                  }
                };
                return ZipFS2;
              })(SynchronousFileSystem);
              ZipFS.Name = "ZipFS";
              ZipFS.Options = {
                zipData: {
                  type: "object",
                  description: "The zip file as a Buffer object.",
                  validator: bufferValidator,
                },
                name: {
                  type: "string",
                  optional: true,
                  description: "The name of the zip file (optional).",
                },
              };
              ZipFS.CompressionMethod = CompressionMethod;
              ZipFS.RegisterDecompressionMethod(
                CompressionMethod.DEFLATE,
                function (data, compressedSize, uncompressedSize) {
                  return arrayish2Buffer(
                    inflateRaw(data.slice(0, compressedSize), {
                      chunkSize: uncompressedSize,
                    })
                  );
                }
              );
              ZipFS.RegisterDecompressionMethod(
                CompressionMethod.STORED,
                function (data, compressedSize, uncompressedSize) {
                  return copyingSlice(data, 0, uncompressedSize);
                }
              );
              var rockRidgeIdentifier = "IEEE_P1282";
              function getASCIIString(data, startIndex, length) {
                return data
                  .toString("ascii", startIndex, startIndex + length)
                  .trim();
              }
              function getJolietString(data, startIndex, length) {
                if (length === 1) {
                  return String.fromCharCode(data[startIndex]);
                }
                var pairs = Math.floor(length / 2);
                var chars = new Array(pairs);
                for (var i2 = 0; i2 < pairs; i2++) {
                  var pos = startIndex + (i2 << 1);
                  chars[i2] = String.fromCharCode(
                    data[pos + 1] | (data[pos] << 8)
                  );
                }
                return chars.join("");
              }
              function getDate(data, startIndex) {
                var year = parseInt(getASCIIString(data, startIndex, 4), 10);
                var mon = parseInt(getASCIIString(data, startIndex + 4, 2), 10);
                var day = parseInt(getASCIIString(data, startIndex + 6, 2), 10);
                var hour = parseInt(
                  getASCIIString(data, startIndex + 8, 2),
                  10
                );
                var min = parseInt(
                  getASCIIString(data, startIndex + 10, 2),
                  10
                );
                var sec = parseInt(
                  getASCIIString(data, startIndex + 12, 2),
                  10
                );
                var hundrethsSec = parseInt(
                  getASCIIString(data, startIndex + 14, 2),
                  10
                );
                return new Date(
                  year,
                  mon,
                  day,
                  hour,
                  min,
                  sec,
                  hundrethsSec * 100
                );
              }
              function getShortFormDate(data, startIndex) {
                var yearsSince1900 = data[startIndex];
                var month = data[startIndex + 1];
                var day = data[startIndex + 2];
                var hour = data[startIndex + 3];
                var minute = data[startIndex + 4];
                var second = data[startIndex + 5];
                return new Date(
                  yearsSince1900,
                  month - 1,
                  day,
                  hour,
                  minute,
                  second
                );
              }
              function constructSystemUseEntry(bigData, i2) {
                var data = bigData.slice(i2);
                var sue = new SystemUseEntry(data);
                switch (sue.signatureWord()) {
                  case 17221:
                    return new CEEntry(data);
                  case 20548:
                    return new PDEntry(data);
                  case 21328:
                    return new SPEntry(data);
                  case 21332:
                    return new STEntry(data);
                  case 17746:
                    return new EREntry(data);
                  case 17747:
                    return new ESEntry(data);
                  case 20568:
                    return new PXEntry(data);
                  case 20558:
                    return new PNEntry(data);
                  case 21324:
                    return new SLEntry(data);
                  case 20045:
                    return new NMEntry(data);
                  case 17228:
                    return new CLEntry(data);
                  case 20556:
                    return new PLEntry(data);
                  case 21061:
                    return new REEntry(data);
                  case 21574:
                    return new TFEntry(data);
                  case 21318:
                    return new SFEntry(data);
                  case 21074:
                    return new RREntry(data);
                  default:
                    return sue;
                }
              }
              function constructSystemUseEntries(data, i2, len, isoData) {
                len = len - 4;
                var entries = new Array();
                while (i2 < len) {
                  var entry = constructSystemUseEntry(data, i2);
                  var length = entry.length();
                  if (length === 0) {
                    return entries;
                  }
                  i2 += length;
                  if (entry instanceof STEntry) {
                    break;
                  }
                  if (entry instanceof CEEntry) {
                    entries = entries.concat(entry.getEntries(isoData));
                  } else {
                    entries.push(entry);
                  }
                }
                return entries;
              }
              var VolumeDescriptor = function VolumeDescriptor2(data) {
                this._data = data;
              };
              VolumeDescriptor.prototype.type = function type() {
                return this._data[0];
              };
              VolumeDescriptor.prototype.standardIdentifier =
                function standardIdentifier() {
                  return getASCIIString(this._data, 1, 5);
                };
              VolumeDescriptor.prototype.version = function version() {
                return this._data[6];
              };
              VolumeDescriptor.prototype.data = function data() {
                return this._data.slice(7, 2048);
              };
              var PrimaryOrSupplementaryVolumeDescriptor = (function (
                VolumeDescriptor2
              ) {
                function PrimaryOrSupplementaryVolumeDescriptor2(data) {
                  VolumeDescriptor2.call(this, data);
                  this._root = null;
                }
                if (VolumeDescriptor2)
                  PrimaryOrSupplementaryVolumeDescriptor2.__proto__ =
                    VolumeDescriptor2;
                PrimaryOrSupplementaryVolumeDescriptor2.prototype =
                  Object.create(
                    VolumeDescriptor2 && VolumeDescriptor2.prototype
                  );
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.constructor =
                  PrimaryOrSupplementaryVolumeDescriptor2;
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.systemIdentifier =
                  function systemIdentifier() {
                    return this._getString32(8);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.volumeIdentifier =
                  function volumeIdentifier() {
                    return this._getString32(40);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.volumeSpaceSize =
                  function volumeSpaceSize() {
                    return this._data.readUInt32LE(80);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.volumeSetSize =
                  function volumeSetSize() {
                    return this._data.readUInt16LE(120);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.volumeSequenceNumber =
                  function volumeSequenceNumber() {
                    return this._data.readUInt16LE(124);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.logicalBlockSize =
                  function logicalBlockSize() {
                    return this._data.readUInt16LE(128);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.pathTableSize =
                  function pathTableSize() {
                    return this._data.readUInt32LE(132);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.locationOfTypeLPathTable =
                  function locationOfTypeLPathTable() {
                    return this._data.readUInt32LE(140);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.locationOfOptionalTypeLPathTable =
                  function locationOfOptionalTypeLPathTable() {
                    return this._data.readUInt32LE(144);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.locationOfTypeMPathTable =
                  function locationOfTypeMPathTable() {
                    return this._data.readUInt32BE(148);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.locationOfOptionalTypeMPathTable =
                  function locationOfOptionalTypeMPathTable() {
                    return this._data.readUInt32BE(152);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.rootDirectoryEntry =
                  function rootDirectoryEntry(isoData) {
                    if (this._root === null) {
                      this._root = this._constructRootDirectoryRecord(
                        this._data.slice(156)
                      );
                      this._root.rootCheckForRockRidge(isoData);
                    }
                    return this._root;
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.volumeSetIdentifier =
                  function volumeSetIdentifier() {
                    return this._getString(190, 128);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.publisherIdentifier =
                  function publisherIdentifier() {
                    return this._getString(318, 128);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.dataPreparerIdentifier =
                  function dataPreparerIdentifier() {
                    return this._getString(446, 128);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.applicationIdentifier =
                  function applicationIdentifier() {
                    return this._getString(574, 128);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.copyrightFileIdentifier =
                  function copyrightFileIdentifier() {
                    return this._getString(702, 38);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.abstractFileIdentifier =
                  function abstractFileIdentifier() {
                    return this._getString(740, 36);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.bibliographicFileIdentifier =
                  function bibliographicFileIdentifier() {
                    return this._getString(776, 37);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.volumeCreationDate =
                  function volumeCreationDate() {
                    return getDate(this._data, 813);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.volumeModificationDate =
                  function volumeModificationDate() {
                    return getDate(this._data, 830);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.volumeExpirationDate =
                  function volumeExpirationDate() {
                    return getDate(this._data, 847);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.volumeEffectiveDate =
                  function volumeEffectiveDate() {
                    return getDate(this._data, 864);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.fileStructureVersion =
                  function fileStructureVersion() {
                    return this._data[881];
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.applicationUsed =
                  function applicationUsed() {
                    return this._data.slice(883, 883 + 512);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype.reserved =
                  function reserved() {
                    return this._data.slice(1395, 1395 + 653);
                  };
                PrimaryOrSupplementaryVolumeDescriptor2.prototype._getString32 =
                  function _getString32(idx) {
                    return this._getString(idx, 32);
                  };
                return PrimaryOrSupplementaryVolumeDescriptor2;
              })(VolumeDescriptor);
              var PrimaryVolumeDescriptor = (function (
                PrimaryOrSupplementaryVolumeDescriptor2
              ) {
                function PrimaryVolumeDescriptor2(data) {
                  PrimaryOrSupplementaryVolumeDescriptor2.call(this, data);
                  if (this.type() !== 1) {
                    throw new ApiError(
                      ErrorCode.EIO,
                      "Invalid primary volume descriptor."
                    );
                  }
                }
                if (PrimaryOrSupplementaryVolumeDescriptor2)
                  PrimaryVolumeDescriptor2.__proto__ =
                    PrimaryOrSupplementaryVolumeDescriptor2;
                PrimaryVolumeDescriptor2.prototype = Object.create(
                  PrimaryOrSupplementaryVolumeDescriptor2 &&
                    PrimaryOrSupplementaryVolumeDescriptor2.prototype
                );
                PrimaryVolumeDescriptor2.prototype.constructor =
                  PrimaryVolumeDescriptor2;
                PrimaryVolumeDescriptor2.prototype.name = function name2() {
                  return "ISO9660";
                };
                PrimaryVolumeDescriptor2.prototype._constructRootDirectoryRecord =
                  function _constructRootDirectoryRecord(data) {
                    return new ISODirectoryRecord(data, -1);
                  };
                PrimaryVolumeDescriptor2.prototype._getString =
                  function _getString(idx, len) {
                    return this._getString(idx, len);
                  };
                return PrimaryVolumeDescriptor2;
              })(PrimaryOrSupplementaryVolumeDescriptor);
              var SupplementaryVolumeDescriptor = (function (
                PrimaryOrSupplementaryVolumeDescriptor2
              ) {
                function SupplementaryVolumeDescriptor2(data) {
                  PrimaryOrSupplementaryVolumeDescriptor2.call(this, data);
                  if (this.type() !== 2) {
                    throw new ApiError(
                      ErrorCode.EIO,
                      "Invalid supplementary volume descriptor."
                    );
                  }
                  var escapeSequence = this.escapeSequence();
                  var third = escapeSequence[2];
                  if (
                    escapeSequence[0] !== 37 ||
                    escapeSequence[1] !== 47 ||
                    (third !== 64 && third !== 67 && third !== 69)
                  ) {
                    throw new ApiError(
                      ErrorCode.EIO,
                      "Unrecognized escape sequence for SupplementaryVolumeDescriptor: " +
                        escapeSequence.toString()
                    );
                  }
                }
                if (PrimaryOrSupplementaryVolumeDescriptor2)
                  SupplementaryVolumeDescriptor2.__proto__ =
                    PrimaryOrSupplementaryVolumeDescriptor2;
                SupplementaryVolumeDescriptor2.prototype = Object.create(
                  PrimaryOrSupplementaryVolumeDescriptor2 &&
                    PrimaryOrSupplementaryVolumeDescriptor2.prototype
                );
                SupplementaryVolumeDescriptor2.prototype.constructor =
                  SupplementaryVolumeDescriptor2;
                SupplementaryVolumeDescriptor2.prototype.name =
                  function name2() {
                    return "Joliet";
                  };
                SupplementaryVolumeDescriptor2.prototype.escapeSequence =
                  function escapeSequence() {
                    return this._data.slice(88, 120);
                  };
                SupplementaryVolumeDescriptor2.prototype._constructRootDirectoryRecord =
                  function _constructRootDirectoryRecord(data) {
                    return new JolietDirectoryRecord(data, -1);
                  };
                SupplementaryVolumeDescriptor2.prototype._getString =
                  function _getString(idx, len) {
                    return getJolietString(this._data, idx, len);
                  };
                return SupplementaryVolumeDescriptor2;
              })(PrimaryOrSupplementaryVolumeDescriptor);
              var DirectoryRecord = function DirectoryRecord2(
                data,
                rockRidgeOffset
              ) {
                this._suEntries = null;
                this._fileOrDir = null;
                this._data = data;
                this._rockRidgeOffset = rockRidgeOffset;
              };
              DirectoryRecord.prototype.hasRockRidge = function hasRockRidge() {
                return this._rockRidgeOffset > -1;
              };
              DirectoryRecord.prototype.getRockRidgeOffset =
                function getRockRidgeOffset() {
                  return this._rockRidgeOffset;
                };
              DirectoryRecord.prototype.rootCheckForRockRidge =
                function rootCheckForRockRidge(isoData) {
                  var dir = this.getDirectory(isoData);
                  this._rockRidgeOffset = dir
                    .getDotEntry(isoData)
                    ._getRockRidgeOffset(isoData);
                  if (this._rockRidgeOffset > -1) {
                    this._fileOrDir = null;
                  }
                };
              DirectoryRecord.prototype.length = function length() {
                return this._data[0];
              };
              DirectoryRecord.prototype.extendedAttributeRecordLength =
                function extendedAttributeRecordLength() {
                  return this._data[1];
                };
              DirectoryRecord.prototype.lba = function lba() {
                return this._data.readUInt32LE(2) * 2048;
              };
              DirectoryRecord.prototype.dataLength = function dataLength() {
                return this._data.readUInt32LE(10);
              };
              DirectoryRecord.prototype.recordingDate =
                function recordingDate() {
                  return getShortFormDate(this._data, 18);
                };
              DirectoryRecord.prototype.fileFlags = function fileFlags() {
                return this._data[25];
              };
              DirectoryRecord.prototype.fileUnitSize = function fileUnitSize() {
                return this._data[26];
              };
              DirectoryRecord.prototype.interleaveGapSize =
                function interleaveGapSize() {
                  return this._data[27];
                };
              DirectoryRecord.prototype.volumeSequenceNumber =
                function volumeSequenceNumber() {
                  return this._data.readUInt16LE(28);
                };
              DirectoryRecord.prototype.identifier = function identifier() {
                return this._getString(33, this._data[32]);
              };
              DirectoryRecord.prototype.fileName = function fileName(isoData) {
                if (this.hasRockRidge()) {
                  var fn = this._rockRidgeFilename(isoData);
                  if (fn !== null) {
                    return fn;
                  }
                }
                var ident = this.identifier();
                if (this.isDirectory(isoData)) {
                  return ident;
                }
                var versionSeparator = ident.indexOf(";");
                if (versionSeparator === -1) {
                  return ident;
                } else if (ident[versionSeparator - 1] === ".") {
                  return ident.slice(0, versionSeparator - 1);
                } else {
                  return ident.slice(0, versionSeparator);
                }
              };
              DirectoryRecord.prototype.isDirectory = function isDirectory(
                isoData
              ) {
                var rv = !!(this.fileFlags() & 2);
                if (!rv && this.hasRockRidge()) {
                  rv =
                    this.getSUEntries(isoData).filter(function (e) {
                      return e instanceof CLEntry;
                    }).length > 0;
                }
                return rv;
              };
              DirectoryRecord.prototype.isSymlink = function isSymlink(
                isoData
              ) {
                return (
                  this.hasRockRidge() &&
                  this.getSUEntries(isoData).filter(function (e) {
                    return e instanceof SLEntry;
                  }).length > 0
                );
              };
              DirectoryRecord.prototype.getSymlinkPath =
                function getSymlinkPath(isoData) {
                  var p = "";
                  var entries = this.getSUEntries(isoData);
                  var getStr = this._getGetString();
                  for (
                    var i2 = 0, list2 = entries;
                    i2 < list2.length;
                    i2 += 1
                  ) {
                    var entry = list2[i2];
                    if (entry instanceof SLEntry) {
                      var components = entry.componentRecords();
                      for (
                        var i$12 = 0, list$1 = components;
                        i$12 < list$1.length;
                        i$12 += 1
                      ) {
                        var component = list$1[i$12];
                        var flags = component.flags();
                        if (flags & 2) {
                          p += "./";
                        } else if (flags & 4) {
                          p += "../";
                        } else if (flags & 8) {
                          p += "/";
                        } else {
                          p += component.content(getStr);
                          if (!(flags & 1)) {
                            p += "/";
                          }
                        }
                      }
                      if (!entry.continueFlag()) {
                        break;
                      }
                    }
                  }
                  if (p.length > 1 && p[p.length - 1] === "/") {
                    return p.slice(0, p.length - 1);
                  } else {
                    return p;
                  }
                };
              DirectoryRecord.prototype.getFile = function getFile(isoData) {
                if (this.isDirectory(isoData)) {
                  throw new Error("Tried to get a File from a directory.");
                }
                if (this._fileOrDir === null) {
                  this._fileOrDir = isoData.slice(
                    this.lba(),
                    this.lba() + this.dataLength()
                  );
                }
                return this._fileOrDir;
              };
              DirectoryRecord.prototype.getDirectory = function getDirectory(
                isoData
              ) {
                if (!this.isDirectory(isoData)) {
                  throw new Error("Tried to get a Directory from a file.");
                }
                if (this._fileOrDir === null) {
                  this._fileOrDir = this._constructDirectory(isoData);
                }
                return this._fileOrDir;
              };
              DirectoryRecord.prototype.getSUEntries = function getSUEntries(
                isoData
              ) {
                if (!this._suEntries) {
                  this._constructSUEntries(isoData);
                }
                return this._suEntries;
              };
              DirectoryRecord.prototype._rockRidgeFilename =
                function _rockRidgeFilename(isoData) {
                  var nmEntries = this.getSUEntries(isoData).filter(function (
                    e2
                  ) {
                    return e2 instanceof NMEntry;
                  });
                  if (
                    nmEntries.length === 0 ||
                    nmEntries[0].flags() & (2 | 4)
                  ) {
                    return null;
                  }
                  var str = "";
                  var getString = this._getGetString();
                  for (
                    var i2 = 0, list2 = nmEntries;
                    i2 < list2.length;
                    i2 += 1
                  ) {
                    var e = list2[i2];
                    str += e.name(getString);
                    if (!(e.flags() & 1)) {
                      break;
                    }
                  }
                  return str;
                };
              DirectoryRecord.prototype._constructSUEntries =
                function _constructSUEntries(isoData) {
                  var i2 = 33 + this._data[32];
                  if (i2 % 2 === 1) {
                    i2++;
                  }
                  i2 += this._rockRidgeOffset;
                  this._suEntries = constructSystemUseEntries(
                    this._data,
                    i2,
                    this.length(),
                    isoData
                  );
                };
              DirectoryRecord.prototype._getRockRidgeOffset =
                function _getRockRidgeOffset(isoData) {
                  this._rockRidgeOffset = 0;
                  var suEntries = this.getSUEntries(isoData);
                  if (suEntries.length > 0) {
                    var spEntry = suEntries[0];
                    if (
                      spEntry instanceof SPEntry &&
                      spEntry.checkBytesPass()
                    ) {
                      for (var i2 = 1; i2 < suEntries.length; i2++) {
                        var entry = suEntries[i2];
                        if (
                          entry instanceof RREntry ||
                          (entry instanceof EREntry &&
                            entry.extensionIdentifier() === rockRidgeIdentifier)
                        ) {
                          return spEntry.bytesSkipped();
                        }
                      }
                    }
                  }
                  this._rockRidgeOffset = -1;
                  return -1;
                };
              var ISODirectoryRecord = (function (DirectoryRecord2) {
                function ISODirectoryRecord2(data, rockRidgeOffset) {
                  DirectoryRecord2.call(this, data, rockRidgeOffset);
                }
                if (DirectoryRecord2)
                  ISODirectoryRecord2.__proto__ = DirectoryRecord2;
                ISODirectoryRecord2.prototype = Object.create(
                  DirectoryRecord2 && DirectoryRecord2.prototype
                );
                ISODirectoryRecord2.prototype.constructor = ISODirectoryRecord2;
                ISODirectoryRecord2.prototype._getString = function _getString(
                  i2,
                  len
                ) {
                  return getASCIIString(this._data, i2, len);
                };
                ISODirectoryRecord2.prototype._constructDirectory =
                  function _constructDirectory(isoData) {
                    return new ISODirectory(this, isoData);
                  };
                ISODirectoryRecord2.prototype._getGetString =
                  function _getGetString() {
                    return getASCIIString;
                  };
                return ISODirectoryRecord2;
              })(DirectoryRecord);
              var JolietDirectoryRecord = (function (DirectoryRecord2) {
                function JolietDirectoryRecord2(data, rockRidgeOffset) {
                  DirectoryRecord2.call(this, data, rockRidgeOffset);
                }
                if (DirectoryRecord2)
                  JolietDirectoryRecord2.__proto__ = DirectoryRecord2;
                JolietDirectoryRecord2.prototype = Object.create(
                  DirectoryRecord2 && DirectoryRecord2.prototype
                );
                JolietDirectoryRecord2.prototype.constructor =
                  JolietDirectoryRecord2;
                JolietDirectoryRecord2.prototype._getString =
                  function _getString(i2, len) {
                    return getJolietString(this._data, i2, len);
                  };
                JolietDirectoryRecord2.prototype._constructDirectory =
                  function _constructDirectory(isoData) {
                    return new JolietDirectory(this, isoData);
                  };
                JolietDirectoryRecord2.prototype._getGetString =
                  function _getGetString() {
                    return getJolietString;
                  };
                return JolietDirectoryRecord2;
              })(DirectoryRecord);
              var SystemUseEntry = function SystemUseEntry2(data) {
                this._data = data;
              };
              SystemUseEntry.prototype.signatureWord =
                function signatureWord() {
                  return this._data.readUInt16BE(0);
                };
              SystemUseEntry.prototype.signatureWordString =
                function signatureWordString() {
                  return getASCIIString(this._data, 0, 2);
                };
              SystemUseEntry.prototype.length = function length() {
                return this._data[2];
              };
              SystemUseEntry.prototype.suVersion = function suVersion() {
                return this._data[3];
              };
              var CEEntry = (function (SystemUseEntry2) {
                function CEEntry2(data) {
                  SystemUseEntry2.call(this, data);
                  this._entries = null;
                }
                if (SystemUseEntry2) CEEntry2.__proto__ = SystemUseEntry2;
                CEEntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                CEEntry2.prototype.constructor = CEEntry2;
                CEEntry2.prototype.continuationLba =
                  function continuationLba() {
                    return this._data.readUInt32LE(4);
                  };
                CEEntry2.prototype.continuationLbaOffset =
                  function continuationLbaOffset() {
                    return this._data.readUInt32LE(12);
                  };
                CEEntry2.prototype.continuationLength =
                  function continuationLength() {
                    return this._data.readUInt32LE(20);
                  };
                CEEntry2.prototype.getEntries = function getEntries(isoData) {
                  if (!this._entries) {
                    var start =
                      this.continuationLba() * 2048 +
                      this.continuationLbaOffset();
                    this._entries = constructSystemUseEntries(
                      isoData,
                      start,
                      this.continuationLength(),
                      isoData
                    );
                  }
                  return this._entries;
                };
                return CEEntry2;
              })(SystemUseEntry);
              var PDEntry = (function (SystemUseEntry2) {
                function PDEntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) PDEntry2.__proto__ = SystemUseEntry2;
                PDEntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                PDEntry2.prototype.constructor = PDEntry2;
                return PDEntry2;
              })(SystemUseEntry);
              var SPEntry = (function (SystemUseEntry2) {
                function SPEntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) SPEntry2.__proto__ = SystemUseEntry2;
                SPEntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                SPEntry2.prototype.constructor = SPEntry2;
                SPEntry2.prototype.checkBytesPass = function checkBytesPass() {
                  return this._data[4] === 190 && this._data[5] === 239;
                };
                SPEntry2.prototype.bytesSkipped = function bytesSkipped() {
                  return this._data[6];
                };
                return SPEntry2;
              })(SystemUseEntry);
              var STEntry = (function (SystemUseEntry2) {
                function STEntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) STEntry2.__proto__ = SystemUseEntry2;
                STEntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                STEntry2.prototype.constructor = STEntry2;
                return STEntry2;
              })(SystemUseEntry);
              var EREntry = (function (SystemUseEntry2) {
                function EREntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) EREntry2.__proto__ = SystemUseEntry2;
                EREntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                EREntry2.prototype.constructor = EREntry2;
                EREntry2.prototype.identifierLength =
                  function identifierLength() {
                    return this._data[4];
                  };
                EREntry2.prototype.descriptorLength =
                  function descriptorLength() {
                    return this._data[5];
                  };
                EREntry2.prototype.sourceLength = function sourceLength() {
                  return this._data[6];
                };
                EREntry2.prototype.extensionVersion =
                  function extensionVersion() {
                    return this._data[7];
                  };
                EREntry2.prototype.extensionIdentifier =
                  function extensionIdentifier() {
                    return getASCIIString(
                      this._data,
                      8,
                      this.identifierLength()
                    );
                  };
                EREntry2.prototype.extensionDescriptor =
                  function extensionDescriptor() {
                    return getASCIIString(
                      this._data,
                      8 + this.identifierLength(),
                      this.descriptorLength()
                    );
                  };
                EREntry2.prototype.extensionSource =
                  function extensionSource() {
                    return getASCIIString(
                      this._data,
                      8 + this.identifierLength() + this.descriptorLength(),
                      this.sourceLength()
                    );
                  };
                return EREntry2;
              })(SystemUseEntry);
              var ESEntry = (function (SystemUseEntry2) {
                function ESEntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) ESEntry2.__proto__ = SystemUseEntry2;
                ESEntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                ESEntry2.prototype.constructor = ESEntry2;
                ESEntry2.prototype.extensionSequence =
                  function extensionSequence() {
                    return this._data[4];
                  };
                return ESEntry2;
              })(SystemUseEntry);
              var RREntry = (function (SystemUseEntry2) {
                function RREntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) RREntry2.__proto__ = SystemUseEntry2;
                RREntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                RREntry2.prototype.constructor = RREntry2;
                return RREntry2;
              })(SystemUseEntry);
              var PXEntry = (function (SystemUseEntry2) {
                function PXEntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) PXEntry2.__proto__ = SystemUseEntry2;
                PXEntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                PXEntry2.prototype.constructor = PXEntry2;
                PXEntry2.prototype.mode = function mode() {
                  return this._data.readUInt32LE(4);
                };
                PXEntry2.prototype.fileLinks = function fileLinks() {
                  return this._data.readUInt32LE(12);
                };
                PXEntry2.prototype.uid = function uid() {
                  return this._data.readUInt32LE(20);
                };
                PXEntry2.prototype.gid = function gid() {
                  return this._data.readUInt32LE(28);
                };
                PXEntry2.prototype.inode = function inode() {
                  return this._data.readUInt32LE(36);
                };
                return PXEntry2;
              })(SystemUseEntry);
              var PNEntry = (function (SystemUseEntry2) {
                function PNEntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) PNEntry2.__proto__ = SystemUseEntry2;
                PNEntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                PNEntry2.prototype.constructor = PNEntry2;
                PNEntry2.prototype.devTHigh = function devTHigh() {
                  return this._data.readUInt32LE(4);
                };
                PNEntry2.prototype.devTLow = function devTLow() {
                  return this._data.readUInt32LE(12);
                };
                return PNEntry2;
              })(SystemUseEntry);
              var SLEntry = (function (SystemUseEntry2) {
                function SLEntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) SLEntry2.__proto__ = SystemUseEntry2;
                SLEntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                SLEntry2.prototype.constructor = SLEntry2;
                SLEntry2.prototype.flags = function flags() {
                  return this._data[4];
                };
                SLEntry2.prototype.continueFlag = function continueFlag() {
                  return this.flags() & 1;
                };
                SLEntry2.prototype.componentRecords =
                  function componentRecords() {
                    var this$1$1 = this;
                    var records = new Array();
                    var i2 = 5;
                    while (i2 < this.length()) {
                      var record = new SLComponentRecord(
                        this$1$1._data.slice(i2)
                      );
                      records.push(record);
                      i2 += record.length();
                    }
                    return records;
                  };
                return SLEntry2;
              })(SystemUseEntry);
              var SLComponentRecord = function SLComponentRecord2(data) {
                this._data = data;
              };
              SLComponentRecord.prototype.flags = function flags() {
                return this._data[0];
              };
              SLComponentRecord.prototype.length = function length() {
                return 2 + this.componentLength();
              };
              SLComponentRecord.prototype.componentLength =
                function componentLength() {
                  return this._data[1];
                };
              SLComponentRecord.prototype.content = function content(
                getString
              ) {
                return getString(this._data, 2, this.componentLength());
              };
              var NMEntry = (function (SystemUseEntry2) {
                function NMEntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) NMEntry2.__proto__ = SystemUseEntry2;
                NMEntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                NMEntry2.prototype.constructor = NMEntry2;
                NMEntry2.prototype.flags = function flags() {
                  return this._data[4];
                };
                NMEntry2.prototype.name = function name2(getString) {
                  return getString(this._data, 5, this.length() - 5);
                };
                return NMEntry2;
              })(SystemUseEntry);
              var CLEntry = (function (SystemUseEntry2) {
                function CLEntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) CLEntry2.__proto__ = SystemUseEntry2;
                CLEntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                CLEntry2.prototype.constructor = CLEntry2;
                CLEntry2.prototype.childDirectoryLba =
                  function childDirectoryLba() {
                    return this._data.readUInt32LE(4);
                  };
                return CLEntry2;
              })(SystemUseEntry);
              var PLEntry = (function (SystemUseEntry2) {
                function PLEntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) PLEntry2.__proto__ = SystemUseEntry2;
                PLEntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                PLEntry2.prototype.constructor = PLEntry2;
                PLEntry2.prototype.parentDirectoryLba =
                  function parentDirectoryLba() {
                    return this._data.readUInt32LE(4);
                  };
                return PLEntry2;
              })(SystemUseEntry);
              var REEntry = (function (SystemUseEntry2) {
                function REEntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) REEntry2.__proto__ = SystemUseEntry2;
                REEntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                REEntry2.prototype.constructor = REEntry2;
                return REEntry2;
              })(SystemUseEntry);
              var TFEntry = (function (SystemUseEntry2) {
                function TFEntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) TFEntry2.__proto__ = SystemUseEntry2;
                TFEntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                TFEntry2.prototype.constructor = TFEntry2;
                TFEntry2.prototype.flags = function flags() {
                  return this._data[4];
                };
                TFEntry2.prototype.creation = function creation() {
                  if (this.flags() & 1) {
                    if (this._longFormDates()) {
                      return getDate(this._data, 5);
                    } else {
                      return getShortFormDate(this._data, 5);
                    }
                  } else {
                    return null;
                  }
                };
                TFEntry2.prototype.modify = function modify() {
                  if (this.flags() & 2) {
                    var previousDates = this.flags() & 1 ? 1 : 0;
                    if (this._longFormDates) {
                      return getDate(this._data, 5 + previousDates * 17);
                    } else {
                      return getShortFormDate(
                        this._data,
                        5 + previousDates * 7
                      );
                    }
                  } else {
                    return null;
                  }
                };
                TFEntry2.prototype.access = function access() {
                  if (this.flags() & 4) {
                    var previousDates = this.flags() & 1 ? 1 : 0;
                    previousDates += this.flags() & 2 ? 1 : 0;
                    if (this._longFormDates) {
                      return getDate(this._data, 5 + previousDates * 17);
                    } else {
                      return getShortFormDate(
                        this._data,
                        5 + previousDates * 7
                      );
                    }
                  } else {
                    return null;
                  }
                };
                TFEntry2.prototype.backup = function backup() {
                  if (this.flags() & 16) {
                    var previousDates = this.flags() & 1 ? 1 : 0;
                    previousDates += this.flags() & 2 ? 1 : 0;
                    previousDates += this.flags() & 4 ? 1 : 0;
                    if (this._longFormDates) {
                      return getDate(this._data, 5 + previousDates * 17);
                    } else {
                      return getShortFormDate(
                        this._data,
                        5 + previousDates * 7
                      );
                    }
                  } else {
                    return null;
                  }
                };
                TFEntry2.prototype.expiration = function expiration() {
                  if (this.flags() & 32) {
                    var previousDates = this.flags() & 1 ? 1 : 0;
                    previousDates += this.flags() & 2 ? 1 : 0;
                    previousDates += this.flags() & 4 ? 1 : 0;
                    previousDates += this.flags() & 16 ? 1 : 0;
                    if (this._longFormDates) {
                      return getDate(this._data, 5 + previousDates * 17);
                    } else {
                      return getShortFormDate(
                        this._data,
                        5 + previousDates * 7
                      );
                    }
                  } else {
                    return null;
                  }
                };
                TFEntry2.prototype.effective = function effective() {
                  if (this.flags() & 64) {
                    var previousDates = this.flags() & 1 ? 1 : 0;
                    previousDates += this.flags() & 2 ? 1 : 0;
                    previousDates += this.flags() & 4 ? 1 : 0;
                    previousDates += this.flags() & 16 ? 1 : 0;
                    previousDates += this.flags() & 32 ? 1 : 0;
                    if (this._longFormDates) {
                      return getDate(this._data, 5 + previousDates * 17);
                    } else {
                      return getShortFormDate(
                        this._data,
                        5 + previousDates * 7
                      );
                    }
                  } else {
                    return null;
                  }
                };
                TFEntry2.prototype._longFormDates = function _longFormDates() {
                  return !!(this.flags() && 128);
                };
                return TFEntry2;
              })(SystemUseEntry);
              var SFEntry = (function (SystemUseEntry2) {
                function SFEntry2(data) {
                  SystemUseEntry2.call(this, data);
                }
                if (SystemUseEntry2) SFEntry2.__proto__ = SystemUseEntry2;
                SFEntry2.prototype = Object.create(
                  SystemUseEntry2 && SystemUseEntry2.prototype
                );
                SFEntry2.prototype.constructor = SFEntry2;
                SFEntry2.prototype.virtualSizeHigh =
                  function virtualSizeHigh() {
                    return this._data.readUInt32LE(4);
                  };
                SFEntry2.prototype.virtualSizeLow = function virtualSizeLow() {
                  return this._data.readUInt32LE(12);
                };
                SFEntry2.prototype.tableDepth = function tableDepth() {
                  return this._data[20];
                };
                return SFEntry2;
              })(SystemUseEntry);
              var Directory = function Directory2(record, isoData) {
                var this$1$1 = this;
                this._fileList = [];
                this._fileMap = {};
                this._record = record;
                var i2 = record.lba();
                var iLimit = i2 + record.dataLength();
                if (!(record.fileFlags() & 2)) {
                  var cl = record.getSUEntries(isoData).filter(function (e) {
                    return e instanceof CLEntry;
                  })[0];
                  i2 = cl.childDirectoryLba() * 2048;
                  iLimit = Infinity;
                }
                while (i2 < iLimit) {
                  var len = isoData[i2];
                  if (len === 0) {
                    i2++;
                    continue;
                  }
                  var r = this$1$1._constructDirectoryRecord(isoData.slice(i2));
                  var fname = r.fileName(isoData);
                  if (fname !== "\0" && fname !== "") {
                    if (
                      !r.hasRockRidge() ||
                      r.getSUEntries(isoData).filter(function (e) {
                        return e instanceof REEntry;
                      }).length === 0
                    ) {
                      this$1$1._fileMap[fname] = r;
                      this$1$1._fileList.push(fname);
                    }
                  } else if (iLimit === Infinity) {
                    iLimit = i2 + r.dataLength();
                  }
                  i2 += r.length();
                }
              };
              Directory.prototype.getRecord = function getRecord(name2) {
                return this._fileMap[name2];
              };
              Directory.prototype.getFileList = function getFileList() {
                return this._fileList;
              };
              Directory.prototype.getDotEntry = function getDotEntry(isoData) {
                return this._constructDirectoryRecord(
                  isoData.slice(this._record.lba())
                );
              };
              var ISODirectory = (function (Directory2) {
                function ISODirectory2(record, isoData) {
                  Directory2.call(this, record, isoData);
                }
                if (Directory2) ISODirectory2.__proto__ = Directory2;
                ISODirectory2.prototype = Object.create(
                  Directory2 && Directory2.prototype
                );
                ISODirectory2.prototype.constructor = ISODirectory2;
                ISODirectory2.prototype._constructDirectoryRecord =
                  function _constructDirectoryRecord(data) {
                    return new ISODirectoryRecord(
                      data,
                      this._record.getRockRidgeOffset()
                    );
                  };
                return ISODirectory2;
              })(Directory);
              var JolietDirectory = (function (Directory2) {
                function JolietDirectory2(record, isoData) {
                  Directory2.call(this, record, isoData);
                }
                if (Directory2) JolietDirectory2.__proto__ = Directory2;
                JolietDirectory2.prototype = Object.create(
                  Directory2 && Directory2.prototype
                );
                JolietDirectory2.prototype.constructor = JolietDirectory2;
                JolietDirectory2.prototype._constructDirectoryRecord =
                  function _constructDirectoryRecord(data) {
                    return new JolietDirectoryRecord(
                      data,
                      this._record.getRockRidgeOffset()
                    );
                  };
                return JolietDirectory2;
              })(Directory);
              var IsoFS = (function (SynchronousFileSystem$$1) {
                function IsoFS2(data, name2, deprecateMsg) {
                  var this$1$1 = this;
                  if (name2 === void 0) name2 = "";
                  if (deprecateMsg === void 0) deprecateMsg = true;
                  SynchronousFileSystem$$1.call(this);
                  this._data = data;
                  deprecationMessage(deprecateMsg, IsoFS2.Name, {
                    data: "ISO data as a Buffer",
                    name: name2,
                  });
                  var vdTerminatorFound = false;
                  var i2 = 16 * 2048;
                  var candidateVDs = new Array();
                  while (!vdTerminatorFound) {
                    var slice = data.slice(i2);
                    var vd = new VolumeDescriptor(slice);
                    switch (vd.type()) {
                      case 1:
                        candidateVDs.push(new PrimaryVolumeDescriptor(slice));
                        break;
                      case 2:
                        candidateVDs.push(
                          new SupplementaryVolumeDescriptor(slice)
                        );
                        break;
                      case 255:
                        vdTerminatorFound = true;
                        break;
                    }
                    i2 += 2048;
                  }
                  if (candidateVDs.length === 0) {
                    throw new ApiError(
                      ErrorCode.EIO,
                      "Unable to find a suitable volume descriptor."
                    );
                  }
                  candidateVDs.forEach(function (v) {
                    if (!this$1$1._pvd || this$1$1._pvd.type() !== 2) {
                      this$1$1._pvd = v;
                    }
                  });
                  this._root = this._pvd.rootDirectoryEntry(data);
                  this._name = name2;
                }
                if (SynchronousFileSystem$$1)
                  IsoFS2.__proto__ = SynchronousFileSystem$$1;
                IsoFS2.prototype = Object.create(
                  SynchronousFileSystem$$1 && SynchronousFileSystem$$1.prototype
                );
                IsoFS2.prototype.constructor = IsoFS2;
                IsoFS2.Create = function Create(opts, cb) {
                  var fs2;
                  var e;
                  try {
                    fs2 = new IsoFS2(opts.data, opts.name, false);
                  } catch (e2) {
                    e2 = e2;
                  } finally {
                    cb(e, fs2);
                  }
                };
                IsoFS2.isAvailable = function isAvailable() {
                  return true;
                };
                IsoFS2.prototype.getName = function getName() {
                  var name2 =
                    "IsoFS" +
                    this._name +
                    (this._pvd ? "-" + this._pvd.name() : "");
                  if (this._root && this._root.hasRockRidge()) {
                    name2 += "-RockRidge";
                  }
                  return name2;
                };
                IsoFS2.prototype.diskSpace = function diskSpace(path$$1, cb) {
                  cb(this._data.length, 0);
                };
                IsoFS2.prototype.isReadOnly = function isReadOnly() {
                  return true;
                };
                IsoFS2.prototype.supportsLinks = function supportsLinks() {
                  return false;
                };
                IsoFS2.prototype.supportsProps = function supportsProps() {
                  return false;
                };
                IsoFS2.prototype.supportsSynch = function supportsSynch() {
                  return true;
                };
                IsoFS2.prototype.statSync = function statSync(p, isLstat) {
                  var record = this._getDirectoryRecord(p);
                  if (record === null) {
                    throw ApiError.ENOENT(p);
                  }
                  return this._getStats(p, record);
                };
                IsoFS2.prototype.openSync = function openSync(p, flags, mode) {
                  if (flags.isWriteable()) {
                    throw new ApiError(ErrorCode.EPERM, p);
                  }
                  var record = this._getDirectoryRecord(p);
                  if (!record) {
                    throw ApiError.ENOENT(p);
                  } else if (record.isSymlink(this._data)) {
                    return this.openSync(
                      path2.resolve(p, record.getSymlinkPath(this._data)),
                      flags,
                      mode
                    );
                  } else if (!record.isDirectory(this._data)) {
                    var data = record.getFile(this._data);
                    var stats = this._getStats(p, record);
                    switch (flags.pathExistsAction()) {
                      case ActionType.THROW_EXCEPTION:
                      case ActionType.TRUNCATE_FILE:
                        throw ApiError.EEXIST(p);
                      case ActionType.NOP:
                        return new NoSyncFile(this, p, flags, stats, data);
                      default:
                        throw new ApiError(
                          ErrorCode.EINVAL,
                          "Invalid FileMode object."
                        );
                    }
                  } else {
                    throw ApiError.EISDIR(p);
                  }
                };
                IsoFS2.prototype.readdirSync = function readdirSync(path$$1) {
                  var record = this._getDirectoryRecord(path$$1);
                  if (!record) {
                    throw ApiError.ENOENT(path$$1);
                  } else if (record.isDirectory(this._data)) {
                    return record
                      .getDirectory(this._data)
                      .getFileList()
                      .slice(0);
                  } else {
                    throw ApiError.ENOTDIR(path$$1);
                  }
                };
                IsoFS2.prototype.readFileSync = function readFileSync(
                  fname,
                  encoding,
                  flag
                ) {
                  var fd = this.openSync(fname, flag, 420);
                  try {
                    var fdCast = fd;
                    var fdBuff = fdCast.getBuffer();
                    if (encoding === null) {
                      return copyingSlice(fdBuff);
                    }
                    return fdBuff.toString(encoding);
                  } finally {
                    fd.closeSync();
                  }
                };
                IsoFS2.prototype._getDirectoryRecord =
                  function _getDirectoryRecord(path$$1) {
                    var this$1$1 = this;
                    if (path$$1 === "/") {
                      return this._root;
                    }
                    var components = path$$1.split("/").slice(1);
                    var dir = this._root;
                    for (
                      var i2 = 0, list2 = components;
                      i2 < list2.length;
                      i2 += 1
                    ) {
                      var component = list2[i2];
                      if (dir.isDirectory(this$1$1._data)) {
                        dir = dir
                          .getDirectory(this$1$1._data)
                          .getRecord(component);
                        if (!dir) {
                          return null;
                        }
                      } else {
                        return null;
                      }
                    }
                    return dir;
                  };
                IsoFS2.prototype._getStats = function _getStats(p, record) {
                  if (record.isSymlink(this._data)) {
                    var newP = path2.resolve(
                      p,
                      record.getSymlinkPath(this._data)
                    );
                    var dirRec = this._getDirectoryRecord(newP);
                    if (!dirRec) {
                      return null;
                    }
                    return this._getStats(newP, dirRec);
                  } else {
                    var len = record.dataLength();
                    var mode = 365;
                    var date = record.recordingDate();
                    var atime = date;
                    var mtime = date;
                    var ctime = date;
                    if (record.hasRockRidge()) {
                      var entries = record.getSUEntries(this._data);
                      for (
                        var i2 = 0, list2 = entries;
                        i2 < list2.length;
                        i2 += 1
                      ) {
                        var entry = list2[i2];
                        if (entry instanceof PXEntry) {
                          mode = entry.mode();
                        } else if (entry instanceof TFEntry) {
                          var flags = entry.flags();
                          if (flags & 4) {
                            atime = entry.access();
                          }
                          if (flags & 2) {
                            mtime = entry.modify();
                          }
                          if (flags & 1) {
                            ctime = entry.creation();
                          }
                        }
                      }
                    }
                    mode = mode & 365;
                    return new Stats(
                      record.isDirectory(this._data)
                        ? FileType.DIRECTORY
                        : FileType.FILE,
                      len,
                      mode,
                      atime,
                      mtime,
                      ctime
                    );
                  }
                };
                return IsoFS2;
              })(SynchronousFileSystem);
              IsoFS.Name = "IsoFS";
              IsoFS.Options = {
                data: {
                  type: "object",
                  description: "The ISO file in a buffer",
                  validator: bufferValidator,
                },
              };
              [
                AsyncMirror,
                DropboxFileSystem,
                EmscriptenFileSystem,
                FolderAdapter,
                HTML5FS,
                InMemoryFileSystem,
                IndexedDBFileSystem,
                IsoFS,
                LocalStorageFileSystem,
                MountableFileSystem,
                OverlayFS,
                WorkerFS,
                XmlHttpRequest,
                ZipFS,
              ].forEach(function (fsType) {
                var create = fsType.Create;
                fsType.Create = function (opts, cb) {
                  var oneArg = typeof opts === "function";
                  var normalizedCb = oneArg ? opts : cb;
                  var normalizedOpts = oneArg ? {} : opts;
                  function wrappedCb(e) {
                    if (e) {
                      normalizedCb(e);
                    } else {
                      create.call(fsType, normalizedOpts, normalizedCb);
                    }
                  }
                  checkOptions(fsType, normalizedOpts, wrappedCb);
                };
              });
              var Backends = {
                AsyncMirror,
                Dropbox: DropboxFileSystem,
                Emscripten: EmscriptenFileSystem,
                FolderAdapter,
                HTML5FS,
                InMemory: InMemoryFileSystem,
                IndexedDB: IndexedDBFileSystem,
                IsoFS,
                LocalStorage: LocalStorageFileSystem,
                MountableFileSystem,
                OverlayFS,
                WorkerFS,
                XmlHttpRequest,
                ZipFS,
              };
              if (process2["initializeTTYs"]) {
                process2["initializeTTYs"]();
              }
              function install(obj) {
                obj.Buffer = Buffer2;
                obj.process = process2;
                var oldRequire = obj.require ? obj.require : null;
                obj.require = function (arg) {
                  var rv = BFSRequire(arg);
                  if (!rv) {
                    return oldRequire.apply(
                      null,
                      Array.prototype.slice.call(arguments, 0)
                    );
                  } else {
                    return rv;
                  }
                };
              }
              function registerFileSystem(name2, fs2) {
                Backends[name2] = fs2;
              }
              function BFSRequire(module5) {
                switch (module5) {
                  case "fs":
                    return _fsMock;
                  case "path":
                    return path2;
                  case "buffer":
                    return buffer;
                  case "process":
                    return process2;
                  case "bfs_utils":
                    return BFSUtils;
                  default:
                    return Backends[module5];
                }
              }
              function initialize(rootfs) {
                return _fsMock.initialize(rootfs);
              }
              function configure(config, cb) {
                getFileSystem(config, function (e, fs2) {
                  if (fs2) {
                    initialize(fs2);
                    cb();
                  } else {
                    cb(e);
                  }
                });
              }
              function getFileSystem(config, cb) {
                var fsName = config["fs"];
                if (!fsName) {
                  return cb(
                    new ApiError(
                      ErrorCode.EPERM,
                      'Missing "fs" property on configuration object.'
                    )
                  );
                }
                var options = config["options"];
                var waitCount = 0;
                var called = false;
                function finish() {
                  if (!called) {
                    called = true;
                    var fsc = Backends[fsName];
                    if (!fsc) {
                      cb(
                        new ApiError(
                          ErrorCode.EPERM,
                          "File system " +
                            fsName +
                            " is not available in BrowserFS."
                        )
                      );
                    } else {
                      fsc.Create(options, cb);
                    }
                  }
                }
                if (options !== null && typeof options === "object") {
                  var finishedIterating = false;
                  var props = Object.keys(options).filter(function (k) {
                    return k !== "fs";
                  });
                  props.forEach(function (p) {
                    var d = options[p];
                    if (d !== null && typeof d === "object" && d["fs"]) {
                      waitCount++;
                      getFileSystem(d, function (e, fs2) {
                        waitCount--;
                        if (e) {
                          if (called) {
                            return;
                          }
                          called = true;
                          cb(e);
                        } else {
                          options[p] = fs2;
                          if (waitCount === 0 && finishedIterating) {
                            finish();
                          }
                        }
                      });
                    }
                  });
                  finishedIterating = true;
                }
                if (waitCount === 0) {
                  finish();
                }
              }
              if ("ab".substr(-1) !== "b") {
                String.prototype.substr = /* @__PURE__ */ (function (substr) {
                  return function (start, length) {
                    if (start < 0) {
                      start = this.length + start;
                    }
                    return substr.call(this, start, length);
                  };
                })(String.prototype.substr);
              }
              if (
                typeof ArrayBuffer !== "undefined" &&
                typeof Uint8Array !== "undefined"
              ) {
                if (!Uint8Array.prototype["slice"]) {
                  Uint8Array.prototype.slice = function (start, end) {
                    if (start === void 0) start = 0;
                    if (end === void 0) end = this.length;
                    var self2 = this;
                    if (start < 0) {
                      start = this.length + start;
                      if (start < 0) {
                        start = 0;
                      }
                    }
                    if (end < 0) {
                      end = this.length + end;
                      if (end < 0) {
                        end = 0;
                      }
                    }
                    if (end < start) {
                      end = start;
                    }
                    return new Uint8Array(
                      self2.buffer,
                      self2.byteOffset + start,
                      end - start
                    );
                  };
                }
              }
              exports3.install = install;
              exports3.registerFileSystem = registerFileSystem;
              exports3.BFSRequire = BFSRequire;
              exports3.initialize = initialize;
              exports3.configure = configure;
              exports3.getFileSystem = getFileSystem;
              exports3.EmscriptenFS = BFSEmscriptenFS;
              exports3.FileSystem = Backends;
              exports3.Errors = api_error;
              exports3.setImmediate = setImmediate$3;
            }).call(
              exports3,
              __webpack_require__(1),
              /* @__PURE__ */ (function () {
                return this;
              })(),
              __webpack_require__(5)(module3),
              __webpack_require__(6)
            );
          },
          /* 1 */
          /***/
          function (module3, exports3, __webpack_require__) {
            module3.exports = __webpack_require__(2).Buffer;
          },
          /* 2 */
          /***/
          function (module3, exports3, __webpack_require__) {
            (function (Buffer2) {
              /*!
               * The buffer module from node.js, for the browser.
               *
               * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
               * @license  MIT
               */
              var base64 = __webpack_require__(3);
              var ieee754 = __webpack_require__(4);
              exports3.Buffer = Buffer2;
              exports3.SlowBuffer = SlowBuffer;
              exports3.INSPECT_MAX_BYTES = 50;
              var K_MAX_LENGTH = 2147483647;
              exports3.kMaxLength = K_MAX_LENGTH;
              Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
              if (
                !Buffer2.TYPED_ARRAY_SUPPORT &&
                typeof console !== "undefined" &&
                typeof console.error === "function"
              ) {
                console.error(
                  "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
                );
              }
              function typedArraySupport() {
                try {
                  var arr = new Uint8Array(1);
                  arr.__proto__ = {
                    __proto__: Uint8Array.prototype,
                    foo: function () {
                      return 42;
                    },
                  };
                  return arr.foo() === 42;
                } catch (e) {
                  return false;
                }
              }
              function createBuffer(length) {
                if (length > K_MAX_LENGTH) {
                  throw new RangeError("Invalid typed array length");
                }
                var buf = new Uint8Array(length);
                buf.__proto__ = Buffer2.prototype;
                return buf;
              }
              function Buffer2(arg, encodingOrOffset, length) {
                if (typeof arg === "number") {
                  if (typeof encodingOrOffset === "string") {
                    throw new Error(
                      "If encoding is specified then the first argument must be a string"
                    );
                  }
                  return allocUnsafe(arg);
                }
                return from(arg, encodingOrOffset, length);
              }
              if (
                typeof Symbol !== "undefined" &&
                Symbol.species &&
                Buffer2[Symbol.species] === Buffer2
              ) {
                Object.defineProperty(Buffer2, Symbol.species, {
                  value: null,
                  configurable: true,
                  enumerable: false,
                  writable: false,
                });
              }
              Buffer2.poolSize = 8192;
              function from(value, encodingOrOffset, length) {
                if (typeof value === "number") {
                  throw new TypeError('"value" argument must not be a number');
                }
                if (isArrayBuffer(value)) {
                  return fromArrayBuffer(value, encodingOrOffset, length);
                }
                if (typeof value === "string") {
                  return fromString(value, encodingOrOffset);
                }
                return fromObject(value);
              }
              Buffer2.from = function (value, encodingOrOffset, length) {
                return from(value, encodingOrOffset, length);
              };
              Buffer2.prototype.__proto__ = Uint8Array.prototype;
              Buffer2.__proto__ = Uint8Array;
              function assertSize(size) {
                if (typeof size !== "number") {
                  throw new TypeError('"size" argument must be a number');
                } else if (size < 0) {
                  throw new RangeError('"size" argument must not be negative');
                }
              }
              function alloc(size, fill, encoding) {
                assertSize(size);
                if (size <= 0) {
                  return createBuffer(size);
                }
                if (fill !== void 0) {
                  return typeof encoding === "string"
                    ? createBuffer(size).fill(fill, encoding)
                    : createBuffer(size).fill(fill);
                }
                return createBuffer(size);
              }
              Buffer2.alloc = function (size, fill, encoding) {
                return alloc(size, fill, encoding);
              };
              function allocUnsafe(size) {
                assertSize(size);
                return createBuffer(size < 0 ? 0 : checked(size) | 0);
              }
              Buffer2.allocUnsafe = function (size) {
                return allocUnsafe(size);
              };
              Buffer2.allocUnsafeSlow = function (size) {
                return allocUnsafe(size);
              };
              function fromString(string, encoding) {
                if (typeof encoding !== "string" || encoding === "") {
                  encoding = "utf8";
                }
                if (!Buffer2.isEncoding(encoding)) {
                  throw new TypeError(
                    '"encoding" must be a valid string encoding'
                  );
                }
                var length = byteLength(string, encoding) | 0;
                var buf = createBuffer(length);
                var actual = buf.write(string, encoding);
                if (actual !== length) {
                  buf = buf.slice(0, actual);
                }
                return buf;
              }
              function fromArrayLike(array) {
                var length = array.length < 0 ? 0 : checked(array.length) | 0;
                var buf = createBuffer(length);
                for (var i = 0; i < length; i += 1) {
                  buf[i] = array[i] & 255;
                }
                return buf;
              }
              function fromArrayBuffer(array, byteOffset, length) {
                if (byteOffset < 0 || array.byteLength < byteOffset) {
                  throw new RangeError("'offset' is out of bounds");
                }
                if (array.byteLength < byteOffset + (length || 0)) {
                  throw new RangeError("'length' is out of bounds");
                }
                var buf;
                if (byteOffset === void 0 && length === void 0) {
                  buf = new Uint8Array(array);
                } else if (length === void 0) {
                  buf = new Uint8Array(array, byteOffset);
                } else {
                  buf = new Uint8Array(array, byteOffset, length);
                }
                buf.__proto__ = Buffer2.prototype;
                return buf;
              }
              function fromObject(obj) {
                if (Buffer2.isBuffer(obj)) {
                  var len = checked(obj.length) | 0;
                  var buf = createBuffer(len);
                  if (buf.length === 0) {
                    return buf;
                  }
                  obj.copy(buf, 0, 0, len);
                  return buf;
                }
                if (obj) {
                  if (isArrayBufferView(obj) || "length" in obj) {
                    if (
                      typeof obj.length !== "number" ||
                      numberIsNaN(obj.length)
                    ) {
                      return createBuffer(0);
                    }
                    return fromArrayLike(obj);
                  }
                  if (obj.type === "Buffer" && Array.isArray(obj.data)) {
                    return fromArrayLike(obj.data);
                  }
                }
                throw new TypeError(
                  "First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object."
                );
              }
              function checked(length) {
                if (length >= K_MAX_LENGTH) {
                  throw new RangeError(
                    "Attempt to allocate Buffer larger than maximum size: 0x" +
                      K_MAX_LENGTH.toString(16) +
                      " bytes"
                  );
                }
                return length | 0;
              }
              function SlowBuffer(length) {
                if (+length != length) {
                  length = 0;
                }
                return Buffer2.alloc(+length);
              }
              Buffer2.isBuffer = function isBuffer(b) {
                return b != null && b._isBuffer === true;
              };
              Buffer2.compare = function compare(a, b) {
                if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
                  throw new TypeError("Arguments must be Buffers");
                }
                if (a === b) return 0;
                var x = a.length;
                var y = b.length;
                for (var i = 0, len = Math.min(x, y); i < len; ++i) {
                  if (a[i] !== b[i]) {
                    x = a[i];
                    y = b[i];
                    break;
                  }
                }
                if (x < y) return -1;
                if (y < x) return 1;
                return 0;
              };
              Buffer2.isEncoding = function isEncoding(encoding) {
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
              Buffer2.concat = function concat(list, length) {
                if (!Array.isArray(list)) {
                  throw new TypeError(
                    '"list" argument must be an Array of Buffers'
                  );
                }
                if (list.length === 0) {
                  return Buffer2.alloc(0);
                }
                var i;
                if (length === void 0) {
                  length = 0;
                  for (i = 0; i < list.length; ++i) {
                    length += list[i].length;
                  }
                }
                var buffer = Buffer2.allocUnsafe(length);
                var pos = 0;
                for (i = 0; i < list.length; ++i) {
                  var buf = list[i];
                  if (!Buffer2.isBuffer(buf)) {
                    throw new TypeError(
                      '"list" argument must be an Array of Buffers'
                    );
                  }
                  buf.copy(buffer, pos);
                  pos += buf.length;
                }
                return buffer;
              };
              function byteLength(string, encoding) {
                if (Buffer2.isBuffer(string)) {
                  return string.length;
                }
                if (isArrayBufferView(string) || isArrayBuffer(string)) {
                  return string.byteLength;
                }
                if (typeof string !== "string") {
                  string = "" + string;
                }
                var len = string.length;
                if (len === 0) return 0;
                var loweredCase = false;
                for (;;) {
                  switch (encoding) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                      return len;
                    case "utf8":
                    case "utf-8":
                    case void 0:
                      return utf8ToBytes(string).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                      return len * 2;
                    case "hex":
                      return len >>> 1;
                    case "base64":
                      return base64ToBytes(string).length;
                    default:
                      if (loweredCase) return utf8ToBytes(string).length;
                      encoding = ("" + encoding).toLowerCase();
                      loweredCase = true;
                  }
                }
              }
              Buffer2.byteLength = byteLength;
              function slowToString(encoding, start, end) {
                var loweredCase = false;
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
                      if (loweredCase)
                        throw new TypeError("Unknown encoding: " + encoding);
                      encoding = (encoding + "").toLowerCase();
                      loweredCase = true;
                  }
                }
              }
              Buffer2.prototype._isBuffer = true;
              function swap(b, n, m) {
                var i = b[n];
                b[n] = b[m];
                b[m] = i;
              }
              Buffer2.prototype.swap16 = function swap16() {
                var len = this.length;
                if (len % 2 !== 0) {
                  throw new RangeError(
                    "Buffer size must be a multiple of 16-bits"
                  );
                }
                for (var i = 0; i < len; i += 2) {
                  swap(this, i, i + 1);
                }
                return this;
              };
              Buffer2.prototype.swap32 = function swap32() {
                var len = this.length;
                if (len % 4 !== 0) {
                  throw new RangeError(
                    "Buffer size must be a multiple of 32-bits"
                  );
                }
                for (var i = 0; i < len; i += 4) {
                  swap(this, i, i + 3);
                  swap(this, i + 1, i + 2);
                }
                return this;
              };
              Buffer2.prototype.swap64 = function swap64() {
                var len = this.length;
                if (len % 8 !== 0) {
                  throw new RangeError(
                    "Buffer size must be a multiple of 64-bits"
                  );
                }
                for (var i = 0; i < len; i += 8) {
                  swap(this, i, i + 7);
                  swap(this, i + 1, i + 6);
                  swap(this, i + 2, i + 5);
                  swap(this, i + 3, i + 4);
                }
                return this;
              };
              Buffer2.prototype.toString = function toString() {
                var length = this.length;
                if (length === 0) return "";
                if (arguments.length === 0) return utf8Slice(this, 0, length);
                return slowToString.apply(this, arguments);
              };
              Buffer2.prototype.equals = function equals(b) {
                if (!Buffer2.isBuffer(b))
                  throw new TypeError("Argument must be a Buffer");
                if (this === b) return true;
                return Buffer2.compare(this, b) === 0;
              };
              Buffer2.prototype.inspect = function inspect() {
                var str = "";
                var max = exports3.INSPECT_MAX_BYTES;
                if (this.length > 0) {
                  str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
                  if (this.length > max) str += " ... ";
                }
                return "<Buffer " + str + ">";
              };
              Buffer2.prototype.compare = function compare(
                target,
                start,
                end,
                thisStart,
                thisEnd
              ) {
                if (!Buffer2.isBuffer(target)) {
                  throw new TypeError("Argument must be a Buffer");
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
                if (
                  start < 0 ||
                  end > target.length ||
                  thisStart < 0 ||
                  thisEnd > this.length
                ) {
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
                var x = thisEnd - thisStart;
                var y = end - start;
                var len = Math.min(x, y);
                var thisCopy = this.slice(thisStart, thisEnd);
                var targetCopy = target.slice(start, end);
                for (var i = 0; i < len; ++i) {
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
              function bidirectionalIndexOf(
                buffer,
                val,
                byteOffset,
                encoding,
                dir
              ) {
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
                  val = Buffer2.from(val, encoding);
                }
                if (Buffer2.isBuffer(val)) {
                  if (val.length === 0) {
                    return -1;
                  }
                  return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
                } else if (typeof val === "number") {
                  val = val & 255;
                  if (typeof Uint8Array.prototype.indexOf === "function") {
                    if (dir) {
                      return Uint8Array.prototype.indexOf.call(
                        buffer,
                        val,
                        byteOffset
                      );
                    } else {
                      return Uint8Array.prototype.lastIndexOf.call(
                        buffer,
                        val,
                        byteOffset
                      );
                    }
                  }
                  return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
                }
                throw new TypeError("val must be string, number or Buffer");
              }
              function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
                var indexSize = 1;
                var arrLength = arr.length;
                var valLength = val.length;
                if (encoding !== void 0) {
                  encoding = String(encoding).toLowerCase();
                  if (
                    encoding === "ucs2" ||
                    encoding === "ucs-2" ||
                    encoding === "utf16le" ||
                    encoding === "utf-16le"
                  ) {
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
                var i;
                if (dir) {
                  var foundIndex = -1;
                  for (i = byteOffset; i < arrLength; i++) {
                    if (
                      read(arr, i) ===
                      read(val, foundIndex === -1 ? 0 : i - foundIndex)
                    ) {
                      if (foundIndex === -1) foundIndex = i;
                      if (i - foundIndex + 1 === valLength)
                        return foundIndex * indexSize;
                    } else {
                      if (foundIndex !== -1) i -= i - foundIndex;
                      foundIndex = -1;
                    }
                  }
                } else {
                  if (byteOffset + valLength > arrLength)
                    byteOffset = arrLength - valLength;
                  for (i = byteOffset; i >= 0; i--) {
                    var found = true;
                    for (var j = 0; j < valLength; j++) {
                      if (read(arr, i + j) !== read(val, j)) {
                        found = false;
                        break;
                      }
                    }
                    if (found) return i;
                  }
                }
                return -1;
              }
              Buffer2.prototype.includes = function includes(
                val,
                byteOffset,
                encoding
              ) {
                return this.indexOf(val, byteOffset, encoding) !== -1;
              };
              Buffer2.prototype.indexOf = function indexOf(
                val,
                byteOffset,
                encoding
              ) {
                return bidirectionalIndexOf(
                  this,
                  val,
                  byteOffset,
                  encoding,
                  true
                );
              };
              Buffer2.prototype.lastIndexOf = function lastIndexOf(
                val,
                byteOffset,
                encoding
              ) {
                return bidirectionalIndexOf(
                  this,
                  val,
                  byteOffset,
                  encoding,
                  false
                );
              };
              function hexWrite(buf, string, offset, length) {
                offset = Number(offset) || 0;
                var remaining = buf.length - offset;
                if (!length) {
                  length = remaining;
                } else {
                  length = Number(length);
                  if (length > remaining) {
                    length = remaining;
                  }
                }
                var strLen = string.length;
                if (strLen % 2 !== 0) throw new TypeError("Invalid hex string");
                if (length > strLen / 2) {
                  length = strLen / 2;
                }
                for (var i = 0; i < length; ++i) {
                  var parsed = parseInt(string.substr(i * 2, 2), 16);
                  if (numberIsNaN(parsed)) return i;
                  buf[offset + i] = parsed;
                }
                return i;
              }
              function utf8Write(buf, string, offset, length) {
                return blitBuffer(
                  utf8ToBytes(string, buf.length - offset),
                  buf,
                  offset,
                  length
                );
              }
              function asciiWrite(buf, string, offset, length) {
                return blitBuffer(asciiToBytes(string), buf, offset, length);
              }
              function latin1Write(buf, string, offset, length) {
                return asciiWrite(buf, string, offset, length);
              }
              function base64Write(buf, string, offset, length) {
                return blitBuffer(base64ToBytes(string), buf, offset, length);
              }
              function ucs2Write(buf, string, offset, length) {
                return blitBuffer(
                  utf16leToBytes(string, buf.length - offset),
                  buf,
                  offset,
                  length
                );
              }
              Buffer2.prototype.write = function write(
                string,
                offset,
                length,
                encoding
              ) {
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
                var remaining = this.length - offset;
                if (length === void 0 || length > remaining) length = remaining;
                if (
                  (string.length > 0 && (length < 0 || offset < 0)) ||
                  offset > this.length
                ) {
                  throw new RangeError(
                    "Attempt to write outside buffer bounds"
                  );
                }
                if (!encoding) encoding = "utf8";
                var loweredCase = false;
                for (;;) {
                  switch (encoding) {
                    case "hex":
                      return hexWrite(this, string, offset, length);
                    case "utf8":
                    case "utf-8":
                      return utf8Write(this, string, offset, length);
                    case "ascii":
                      return asciiWrite(this, string, offset, length);
                    case "latin1":
                    case "binary":
                      return latin1Write(this, string, offset, length);
                    case "base64":
                      return base64Write(this, string, offset, length);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                      return ucs2Write(this, string, offset, length);
                    default:
                      if (loweredCase)
                        throw new TypeError("Unknown encoding: " + encoding);
                      encoding = ("" + encoding).toLowerCase();
                      loweredCase = true;
                  }
                }
              };
              Buffer2.prototype.toJSON = function toJSON() {
                return {
                  type: "Buffer",
                  data: Array.prototype.slice.call(this._arr || this, 0),
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
                var res = [];
                var i = start;
                while (i < end) {
                  var firstByte = buf[i];
                  var codePoint = null;
                  var bytesPerSequence =
                    firstByte > 239
                      ? 4
                      : firstByte > 223
                      ? 3
                      : firstByte > 191
                      ? 2
                      : 1;
                  if (i + bytesPerSequence <= end) {
                    var secondByte, thirdByte, fourthByte, tempCodePoint;
                    switch (bytesPerSequence) {
                      case 1:
                        if (firstByte < 128) {
                          codePoint = firstByte;
                        }
                        break;
                      case 2:
                        secondByte = buf[i + 1];
                        if ((secondByte & 192) === 128) {
                          tempCodePoint =
                            ((firstByte & 31) << 6) | (secondByte & 63);
                          if (tempCodePoint > 127) {
                            codePoint = tempCodePoint;
                          }
                        }
                        break;
                      case 3:
                        secondByte = buf[i + 1];
                        thirdByte = buf[i + 2];
                        if (
                          (secondByte & 192) === 128 &&
                          (thirdByte & 192) === 128
                        ) {
                          tempCodePoint =
                            ((firstByte & 15) << 12) |
                            ((secondByte & 63) << 6) |
                            (thirdByte & 63);
                          if (
                            tempCodePoint > 2047 &&
                            (tempCodePoint < 55296 || tempCodePoint > 57343)
                          ) {
                            codePoint = tempCodePoint;
                          }
                        }
                        break;
                      case 4:
                        secondByte = buf[i + 1];
                        thirdByte = buf[i + 2];
                        fourthByte = buf[i + 3];
                        if (
                          (secondByte & 192) === 128 &&
                          (thirdByte & 192) === 128 &&
                          (fourthByte & 192) === 128
                        ) {
                          tempCodePoint =
                            ((firstByte & 15) << 18) |
                            ((secondByte & 63) << 12) |
                            ((thirdByte & 63) << 6) |
                            (fourthByte & 63);
                          if (
                            tempCodePoint > 65535 &&
                            tempCodePoint < 1114112
                          ) {
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
                    res.push(((codePoint >>> 10) & 1023) | 55296);
                    codePoint = 56320 | (codePoint & 1023);
                  }
                  res.push(codePoint);
                  i += bytesPerSequence;
                }
                return decodeCodePointsArray(res);
              }
              var MAX_ARGUMENTS_LENGTH = 4096;
              function decodeCodePointsArray(codePoints) {
                var len = codePoints.length;
                if (len <= MAX_ARGUMENTS_LENGTH) {
                  return String.fromCharCode.apply(String, codePoints);
                }
                var res = "";
                var i = 0;
                while (i < len) {
                  res += String.fromCharCode.apply(
                    String,
                    codePoints.slice(i, (i += MAX_ARGUMENTS_LENGTH))
                  );
                }
                return res;
              }
              function asciiSlice(buf, start, end) {
                var ret = "";
                end = Math.min(buf.length, end);
                for (var i = start; i < end; ++i) {
                  ret += String.fromCharCode(buf[i] & 127);
                }
                return ret;
              }
              function latin1Slice(buf, start, end) {
                var ret = "";
                end = Math.min(buf.length, end);
                for (var i = start; i < end; ++i) {
                  ret += String.fromCharCode(buf[i]);
                }
                return ret;
              }
              function hexSlice(buf, start, end) {
                var len = buf.length;
                if (!start || start < 0) start = 0;
                if (!end || end < 0 || end > len) end = len;
                var out = "";
                for (var i = start; i < end; ++i) {
                  out += toHex(buf[i]);
                }
                return out;
              }
              function utf16leSlice(buf, start, end) {
                var bytes = buf.slice(start, end);
                var res = "";
                for (var i = 0; i < bytes.length; i += 2) {
                  res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
                }
                return res;
              }
              Buffer2.prototype.slice = function slice(start, end) {
                var len = this.length;
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
                var newBuf = this.subarray(start, end);
                newBuf.__proto__ = Buffer2.prototype;
                return newBuf;
              };
              function checkOffset(offset, ext, length) {
                if (offset % 1 !== 0 || offset < 0)
                  throw new RangeError("offset is not uint");
                if (offset + ext > length)
                  throw new RangeError("Trying to access beyond buffer length");
              }
              Buffer2.prototype.readUIntLE = function readUIntLE(
                offset,
                byteLength2,
                noAssert
              ) {
                offset = offset >>> 0;
                byteLength2 = byteLength2 >>> 0;
                if (!noAssert) checkOffset(offset, byteLength2, this.length);
                var val = this[offset];
                var mul = 1;
                var i = 0;
                while (++i < byteLength2 && (mul *= 256)) {
                  val += this[offset + i] * mul;
                }
                return val;
              };
              Buffer2.prototype.readUIntBE = function readUIntBE(
                offset,
                byteLength2,
                noAssert
              ) {
                offset = offset >>> 0;
                byteLength2 = byteLength2 >>> 0;
                if (!noAssert) {
                  checkOffset(offset, byteLength2, this.length);
                }
                var val = this[offset + --byteLength2];
                var mul = 1;
                while (byteLength2 > 0 && (mul *= 256)) {
                  val += this[offset + --byteLength2] * mul;
                }
                return val;
              };
              Buffer2.prototype.readUInt8 = function readUInt8(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 1, this.length);
                return this[offset];
              };
              Buffer2.prototype.readUInt16LE = function readUInt16LE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 2, this.length);
                return this[offset] | (this[offset + 1] << 8);
              };
              Buffer2.prototype.readUInt16BE = function readUInt16BE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 2, this.length);
                return (this[offset] << 8) | this[offset + 1];
              };
              Buffer2.prototype.readUInt32LE = function readUInt32LE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 4, this.length);
                return (
                  (this[offset] |
                    (this[offset + 1] << 8) |
                    (this[offset + 2] << 16)) +
                  this[offset + 3] * 16777216
                );
              };
              Buffer2.prototype.readUInt32BE = function readUInt32BE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 4, this.length);
                return (
                  this[offset] * 16777216 +
                  ((this[offset + 1] << 16) |
                    (this[offset + 2] << 8) |
                    this[offset + 3])
                );
              };
              Buffer2.prototype.readIntLE = function readIntLE(
                offset,
                byteLength2,
                noAssert
              ) {
                offset = offset >>> 0;
                byteLength2 = byteLength2 >>> 0;
                if (!noAssert) checkOffset(offset, byteLength2, this.length);
                var val = this[offset];
                var mul = 1;
                var i = 0;
                while (++i < byteLength2 && (mul *= 256)) {
                  val += this[offset + i] * mul;
                }
                mul *= 128;
                if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
                return val;
              };
              Buffer2.prototype.readIntBE = function readIntBE(
                offset,
                byteLength2,
                noAssert
              ) {
                offset = offset >>> 0;
                byteLength2 = byteLength2 >>> 0;
                if (!noAssert) checkOffset(offset, byteLength2, this.length);
                var i = byteLength2;
                var mul = 1;
                var val = this[offset + --i];
                while (i > 0 && (mul *= 256)) {
                  val += this[offset + --i] * mul;
                }
                mul *= 128;
                if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
                return val;
              };
              Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 1, this.length);
                if (!(this[offset] & 128)) return this[offset];
                return (255 - this[offset] + 1) * -1;
              };
              Buffer2.prototype.readInt16LE = function readInt16LE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 2, this.length);
                var val = this[offset] | (this[offset + 1] << 8);
                return val & 32768 ? val | 4294901760 : val;
              };
              Buffer2.prototype.readInt16BE = function readInt16BE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 2, this.length);
                var val = this[offset + 1] | (this[offset] << 8);
                return val & 32768 ? val | 4294901760 : val;
              };
              Buffer2.prototype.readInt32LE = function readInt32LE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 4, this.length);
                return (
                  this[offset] |
                  (this[offset + 1] << 8) |
                  (this[offset + 2] << 16) |
                  (this[offset + 3] << 24)
                );
              };
              Buffer2.prototype.readInt32BE = function readInt32BE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 4, this.length);
                return (
                  (this[offset] << 24) |
                  (this[offset + 1] << 16) |
                  (this[offset + 2] << 8) |
                  this[offset + 3]
                );
              };
              Buffer2.prototype.readFloatLE = function readFloatLE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 4, this.length);
                return ieee754.read(this, offset, true, 23, 4);
              };
              Buffer2.prototype.readFloatBE = function readFloatBE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 4, this.length);
                return ieee754.read(this, offset, false, 23, 4);
              };
              Buffer2.prototype.readDoubleLE = function readDoubleLE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 8, this.length);
                return ieee754.read(this, offset, true, 52, 8);
              };
              Buffer2.prototype.readDoubleBE = function readDoubleBE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 8, this.length);
                return ieee754.read(this, offset, false, 52, 8);
              };
              function checkInt(buf, value, offset, ext, max, min) {
                if (!Buffer2.isBuffer(buf))
                  throw new TypeError(
                    '"buffer" argument must be a Buffer instance'
                  );
                if (value > max || value < min)
                  throw new RangeError('"value" argument is out of bounds');
                if (offset + ext > buf.length)
                  throw new RangeError("Index out of range");
              }
              Buffer2.prototype.writeUIntLE = function writeUIntLE(
                value,
                offset,
                byteLength2,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                byteLength2 = byteLength2 >>> 0;
                if (!noAssert) {
                  var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
                  checkInt(this, value, offset, byteLength2, maxBytes, 0);
                }
                var mul = 1;
                var i = 0;
                this[offset] = value & 255;
                while (++i < byteLength2 && (mul *= 256)) {
                  this[offset + i] = (value / mul) & 255;
                }
                return offset + byteLength2;
              };
              Buffer2.prototype.writeUIntBE = function writeUIntBE(
                value,
                offset,
                byteLength2,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                byteLength2 = byteLength2 >>> 0;
                if (!noAssert) {
                  var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
                  checkInt(this, value, offset, byteLength2, maxBytes, 0);
                }
                var i = byteLength2 - 1;
                var mul = 1;
                this[offset + i] = value & 255;
                while (--i >= 0 && (mul *= 256)) {
                  this[offset + i] = (value / mul) & 255;
                }
                return offset + byteLength2;
              };
              Buffer2.prototype.writeUInt8 = function writeUInt8(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
                this[offset] = value & 255;
                return offset + 1;
              };
              Buffer2.prototype.writeUInt16LE = function writeUInt16LE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
                this[offset] = value & 255;
                this[offset + 1] = value >>> 8;
                return offset + 2;
              };
              Buffer2.prototype.writeUInt16BE = function writeUInt16BE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
                this[offset] = value >>> 8;
                this[offset + 1] = value & 255;
                return offset + 2;
              };
              Buffer2.prototype.writeUInt32LE = function writeUInt32LE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
                this[offset + 3] = value >>> 24;
                this[offset + 2] = value >>> 16;
                this[offset + 1] = value >>> 8;
                this[offset] = value & 255;
                return offset + 4;
              };
              Buffer2.prototype.writeUInt32BE = function writeUInt32BE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
                this[offset] = value >>> 24;
                this[offset + 1] = value >>> 16;
                this[offset + 2] = value >>> 8;
                this[offset + 3] = value & 255;
                return offset + 4;
              };
              Buffer2.prototype.writeIntLE = function writeIntLE(
                value,
                offset,
                byteLength2,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) {
                  var limit = Math.pow(2, 8 * byteLength2 - 1);
                  checkInt(this, value, offset, byteLength2, limit - 1, -limit);
                }
                var i = 0;
                var mul = 1;
                var sub = 0;
                this[offset] = value & 255;
                while (++i < byteLength2 && (mul *= 256)) {
                  if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                    sub = 1;
                  }
                  this[offset + i] = (((value / mul) >> 0) - sub) & 255;
                }
                return offset + byteLength2;
              };
              Buffer2.prototype.writeIntBE = function writeIntBE(
                value,
                offset,
                byteLength2,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) {
                  var limit = Math.pow(2, 8 * byteLength2 - 1);
                  checkInt(this, value, offset, byteLength2, limit - 1, -limit);
                }
                var i = byteLength2 - 1;
                var mul = 1;
                var sub = 0;
                this[offset + i] = value & 255;
                while (--i >= 0 && (mul *= 256)) {
                  if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                    sub = 1;
                  }
                  this[offset + i] = (((value / mul) >> 0) - sub) & 255;
                }
                return offset + byteLength2;
              };
              Buffer2.prototype.writeInt8 = function writeInt8(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
                if (value < 0) value = 255 + value + 1;
                this[offset] = value & 255;
                return offset + 1;
              };
              Buffer2.prototype.writeInt16LE = function writeInt16LE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
                this[offset] = value & 255;
                this[offset + 1] = value >>> 8;
                return offset + 2;
              };
              Buffer2.prototype.writeInt16BE = function writeInt16BE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
                this[offset] = value >>> 8;
                this[offset + 1] = value & 255;
                return offset + 2;
              };
              Buffer2.prototype.writeInt32LE = function writeInt32LE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                  checkInt(this, value, offset, 4, 2147483647, -2147483648);
                this[offset] = value & 255;
                this[offset + 1] = value >>> 8;
                this[offset + 2] = value >>> 16;
                this[offset + 3] = value >>> 24;
                return offset + 4;
              };
              Buffer2.prototype.writeInt32BE = function writeInt32BE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                  checkInt(this, value, offset, 4, 2147483647, -2147483648);
                if (value < 0) value = 4294967295 + value + 1;
                this[offset] = value >>> 24;
                this[offset + 1] = value >>> 16;
                this[offset + 2] = value >>> 8;
                this[offset + 3] = value & 255;
                return offset + 4;
              };
              function checkIEEE754(buf, value, offset, ext, max, min) {
                if (offset + ext > buf.length)
                  throw new RangeError("Index out of range");
                if (offset < 0) throw new RangeError("Index out of range");
              }
              function writeFloat(buf, value, offset, littleEndian, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) {
                  checkIEEE754(buf, value, offset, 4);
                }
                ieee754.write(buf, value, offset, littleEndian, 23, 4);
                return offset + 4;
              }
              Buffer2.prototype.writeFloatLE = function writeFloatLE(
                value,
                offset,
                noAssert
              ) {
                return writeFloat(this, value, offset, true, noAssert);
              };
              Buffer2.prototype.writeFloatBE = function writeFloatBE(
                value,
                offset,
                noAssert
              ) {
                return writeFloat(this, value, offset, false, noAssert);
              };
              function writeDouble(buf, value, offset, littleEndian, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) {
                  checkIEEE754(buf, value, offset, 8);
                }
                ieee754.write(buf, value, offset, littleEndian, 52, 8);
                return offset + 8;
              }
              Buffer2.prototype.writeDoubleLE = function writeDoubleLE(
                value,
                offset,
                noAssert
              ) {
                return writeDouble(this, value, offset, true, noAssert);
              };
              Buffer2.prototype.writeDoubleBE = function writeDoubleBE(
                value,
                offset,
                noAssert
              ) {
                return writeDouble(this, value, offset, false, noAssert);
              };
              Buffer2.prototype.copy = function copy(
                target,
                targetStart,
                start,
                end
              ) {
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
                if (start < 0 || start >= this.length)
                  throw new RangeError("sourceStart out of bounds");
                if (end < 0) throw new RangeError("sourceEnd out of bounds");
                if (end > this.length) end = this.length;
                if (target.length - targetStart < end - start) {
                  end = target.length - targetStart + start;
                }
                var len = end - start;
                var i;
                if (
                  this === target &&
                  start < targetStart &&
                  targetStart < end
                ) {
                  for (i = len - 1; i >= 0; --i) {
                    target[i + targetStart] = this[i + start];
                  }
                } else if (len < 1e3) {
                  for (i = 0; i < len; ++i) {
                    target[i + targetStart] = this[i + start];
                  }
                } else {
                  Uint8Array.prototype.set.call(
                    target,
                    this.subarray(start, start + len),
                    targetStart
                  );
                }
                return len;
              };
              Buffer2.prototype.fill = function fill(
                val,
                start,
                end,
                encoding
              ) {
                if (typeof val === "string") {
                  if (typeof start === "string") {
                    encoding = start;
                    start = 0;
                    end = this.length;
                  } else if (typeof end === "string") {
                    encoding = end;
                    end = this.length;
                  }
                  if (val.length === 1) {
                    var code = val.charCodeAt(0);
                    if (code < 256) {
                      val = code;
                    }
                  }
                  if (encoding !== void 0 && typeof encoding !== "string") {
                    throw new TypeError("encoding must be a string");
                  }
                  if (
                    typeof encoding === "string" &&
                    !Buffer2.isEncoding(encoding)
                  ) {
                    throw new TypeError("Unknown encoding: " + encoding);
                  }
                } else if (typeof val === "number") {
                  val = val & 255;
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
                var i;
                if (typeof val === "number") {
                  for (i = start; i < end; ++i) {
                    this[i] = val;
                  }
                } else {
                  var bytes = Buffer2.isBuffer(val)
                    ? val
                    : new Buffer2(val, encoding);
                  var len = bytes.length;
                  for (i = 0; i < end - start; ++i) {
                    this[i + start] = bytes[i % len];
                  }
                }
                return this;
              };
              var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
              function base64clean(str) {
                str = str.trim().replace(INVALID_BASE64_RE, "");
                if (str.length < 2) return "";
                while (str.length % 4 !== 0) {
                  str = str + "=";
                }
                return str;
              }
              function toHex(n) {
                if (n < 16) return "0" + n.toString(16);
                return n.toString(16);
              }
              function utf8ToBytes(string, units) {
                units = units || Infinity;
                var codePoint;
                var length = string.length;
                var leadSurrogate = null;
                var bytes = [];
                for (var i = 0; i < length; ++i) {
                  codePoint = string.charCodeAt(i);
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
                    codePoint =
                      (((leadSurrogate - 55296) << 10) | (codePoint - 56320)) +
                      65536;
                  } else if (leadSurrogate) {
                    if ((units -= 3) > -1) bytes.push(239, 191, 189);
                  }
                  leadSurrogate = null;
                  if (codePoint < 128) {
                    if ((units -= 1) < 0) break;
                    bytes.push(codePoint);
                  } else if (codePoint < 2048) {
                    if ((units -= 2) < 0) break;
                    bytes.push((codePoint >> 6) | 192, (codePoint & 63) | 128);
                  } else if (codePoint < 65536) {
                    if ((units -= 3) < 0) break;
                    bytes.push(
                      (codePoint >> 12) | 224,
                      ((codePoint >> 6) & 63) | 128,
                      (codePoint & 63) | 128
                    );
                  } else if (codePoint < 1114112) {
                    if ((units -= 4) < 0) break;
                    bytes.push(
                      (codePoint >> 18) | 240,
                      ((codePoint >> 12) & 63) | 128,
                      ((codePoint >> 6) & 63) | 128,
                      (codePoint & 63) | 128
                    );
                  } else {
                    throw new Error("Invalid code point");
                  }
                }
                return bytes;
              }
              function asciiToBytes(str) {
                var byteArray = [];
                for (var i = 0; i < str.length; ++i) {
                  byteArray.push(str.charCodeAt(i) & 255);
                }
                return byteArray;
              }
              function utf16leToBytes(str, units) {
                var c, hi, lo;
                var byteArray = [];
                for (var i = 0; i < str.length; ++i) {
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
                for (var i = 0; i < length; ++i) {
                  if (i + offset >= dst.length || i >= src.length) break;
                  dst[i + offset] = src[i];
                }
                return i;
              }
              function isArrayBuffer(obj) {
                return (
                  obj instanceof ArrayBuffer ||
                  (obj != null &&
                    obj.constructor != null &&
                    obj.constructor.name === "ArrayBuffer" &&
                    typeof obj.byteLength === "number")
                );
              }
              function isArrayBufferView(obj) {
                return (
                  typeof ArrayBuffer.isView === "function" &&
                  ArrayBuffer.isView(obj)
                );
              }
              function numberIsNaN(obj) {
                return obj !== obj;
              }
            }).call(exports3, __webpack_require__(1));
          },
          /* 3 */
          /***/
          function (module3, exports3) {
            exports3.byteLength = byteLength;
            exports3.toByteArray = toByteArray;
            exports3.fromByteArray = fromByteArray;
            var lookup = [];
            var revLookup = [];
            var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
            var code =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for (var i = 0, len = code.length; i < len; ++i) {
              lookup[i] = code[i];
              revLookup[code.charCodeAt(i)] = i;
            }
            revLookup["-".charCodeAt(0)] = 62;
            revLookup["_".charCodeAt(0)] = 63;
            function placeHoldersCount(b64) {
              var len2 = b64.length;
              if (len2 % 4 > 0) {
                throw new Error(
                  "Invalid string. Length must be a multiple of 4"
                );
              }
              return b64[len2 - 2] === "=" ? 2 : b64[len2 - 1] === "=" ? 1 : 0;
            }
            function byteLength(b64) {
              return (b64.length * 3) / 4 - placeHoldersCount(b64);
            }
            function toByteArray(b64) {
              var i2, j, l, tmp, placeHolders, arr;
              var len2 = b64.length;
              placeHolders = placeHoldersCount(b64);
              arr = new Arr((len2 * 3) / 4 - placeHolders);
              l = placeHolders > 0 ? len2 - 4 : len2;
              var L = 0;
              for (i2 = 0, j = 0; i2 < l; i2 += 4, j += 3) {
                tmp =
                  (revLookup[b64.charCodeAt(i2)] << 18) |
                  (revLookup[b64.charCodeAt(i2 + 1)] << 12) |
                  (revLookup[b64.charCodeAt(i2 + 2)] << 6) |
                  revLookup[b64.charCodeAt(i2 + 3)];
                arr[L++] = (tmp >> 16) & 255;
                arr[L++] = (tmp >> 8) & 255;
                arr[L++] = tmp & 255;
              }
              if (placeHolders === 2) {
                tmp =
                  (revLookup[b64.charCodeAt(i2)] << 2) |
                  (revLookup[b64.charCodeAt(i2 + 1)] >> 4);
                arr[L++] = tmp & 255;
              } else if (placeHolders === 1) {
                tmp =
                  (revLookup[b64.charCodeAt(i2)] << 10) |
                  (revLookup[b64.charCodeAt(i2 + 1)] << 4) |
                  (revLookup[b64.charCodeAt(i2 + 2)] >> 2);
                arr[L++] = (tmp >> 8) & 255;
                arr[L++] = tmp & 255;
              }
              return arr;
            }
            function tripletToBase64(num) {
              return (
                lookup[(num >> 18) & 63] +
                lookup[(num >> 12) & 63] +
                lookup[(num >> 6) & 63] +
                lookup[num & 63]
              );
            }
            function encodeChunk(uint8, start, end) {
              var tmp;
              var output = [];
              for (var i2 = start; i2 < end; i2 += 3) {
                tmp = (uint8[i2] << 16) + (uint8[i2 + 1] << 8) + uint8[i2 + 2];
                output.push(tripletToBase64(tmp));
              }
              return output.join("");
            }
            function fromByteArray(uint8) {
              var tmp;
              var len2 = uint8.length;
              var extraBytes = len2 % 3;
              var output = "";
              var parts = [];
              var maxChunkLength = 16383;
              for (
                var i2 = 0, len22 = len2 - extraBytes;
                i2 < len22;
                i2 += maxChunkLength
              ) {
                parts.push(
                  encodeChunk(
                    uint8,
                    i2,
                    i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength
                  )
                );
              }
              if (extraBytes === 1) {
                tmp = uint8[len2 - 1];
                output += lookup[tmp >> 2];
                output += lookup[(tmp << 4) & 63];
                output += "==";
              } else if (extraBytes === 2) {
                tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
                output += lookup[tmp >> 10];
                output += lookup[(tmp >> 4) & 63];
                output += lookup[(tmp << 2) & 63];
                output += "=";
              }
              parts.push(output);
              return parts.join("");
            }
          },
          /* 4 */
          /***/
          function (module3, exports3) {
            exports3.read = function (buffer, offset, isLE, mLen, nBytes) {
              var e, m;
              var eLen = nBytes * 8 - mLen - 1;
              var eMax = (1 << eLen) - 1;
              var eBias = eMax >> 1;
              var nBits = -7;
              var i = isLE ? nBytes - 1 : 0;
              var d = isLE ? -1 : 1;
              var s = buffer[offset + i];
              i += d;
              e = s & ((1 << -nBits) - 1);
              s >>= -nBits;
              nBits += eLen;
              for (
                ;
                nBits > 0;
                e = e * 256 + buffer[offset + i], i += d, nBits -= 8
              ) {}
              m = e & ((1 << -nBits) - 1);
              e >>= -nBits;
              nBits += mLen;
              for (
                ;
                nBits > 0;
                m = m * 256 + buffer[offset + i], i += d, nBits -= 8
              ) {}
              if (e === 0) {
                e = 1 - eBias;
              } else if (e === eMax) {
                return m ? NaN : (s ? -1 : 1) * Infinity;
              } else {
                m = m + Math.pow(2, mLen);
                e = e - eBias;
              }
              return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
            };
            exports3.write = function (
              buffer,
              value,
              offset,
              isLE,
              mLen,
              nBytes
            ) {
              var e, m, c;
              var eLen = nBytes * 8 - mLen - 1;
              var eMax = (1 << eLen) - 1;
              var eBias = eMax >> 1;
              var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
              var i = isLE ? 0 : nBytes - 1;
              var d = isLE ? 1 : -1;
              var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;
              value = Math.abs(value);
              if (isNaN(value) || value === Infinity) {
                m = isNaN(value) ? 1 : 0;
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
                  m = 0;
                  e = eMax;
                } else if (e + eBias >= 1) {
                  m = (value * c - 1) * Math.pow(2, mLen);
                  e = e + eBias;
                } else {
                  m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                  e = 0;
                }
              }
              for (
                ;
                mLen >= 8;
                buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8
              ) {}
              e = (e << mLen) | m;
              eLen += mLen;
              for (
                ;
                eLen > 0;
                buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8
              ) {}
              buffer[offset + i - d] |= s * 128;
            };
          },
          /* 5 */
          /***/
          function (module3, exports3) {
            module3.exports = function (module4) {
              if (!module4.webpackPolyfill) {
                module4.deprecate = function () {};
                module4.paths = [];
                module4.children = [];
                module4.webpackPolyfill = 1;
              }
              return module4;
            };
          },
          /* 6 */
          /***/
          function (module3, exports3, __webpack_require__) {
            var Process = __webpack_require__(7);
            var process2 = new Process(),
              processProxy = {};
            function defineKey(key2) {
              if (processProxy[key2]) {
                return;
              }
              if (typeof process2[key2] === "function") {
                processProxy[key2] = function () {
                  return process2[key2].apply(process2, arguments);
                };
              } else {
                processProxy[key2] = process2[key2];
              }
            }
            for (var key in process2) {
              defineKey(key);
            }
            processProxy.initializeTTYs = function () {
              if (process2.stdin === null) {
                process2.initializeTTYs();
                processProxy.stdin = process2.stdin;
                processProxy.stdout = process2.stdout;
                processProxy.stderr = process2.stderr;
              }
            };
            process2.nextTick(function () {
              processProxy.initializeTTYs();
            });
            module3.exports = processProxy;
          },
          /* 7 */
          /***/
          function (module3, exports3, __webpack_require__) {
            (function (__dirname) {
              var __extends =
                (this && this.__extends) ||
                function (d, b) {
                  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype =
                    b === null
                      ? Object.create(b)
                      : ((__.prototype = b.prototype), new __());
                };
              var events = __webpack_require__(8);
              var path2 = null;
              var Item = (function () {
                function Item2(fun, array) {
                  this.fun = fun;
                  this.array = array;
                }
                Item2.prototype.run = function () {
                  this.fun.apply(null, this.array);
                };
                return Item2;
              })();
              var NextTickQueue = (function () {
                function NextTickQueue2() {
                  this._queue = [];
                  this._draining = false;
                  this._currentQueue = null;
                  this._queueIndex = -1;
                }
                NextTickQueue2.prototype.push = function (item) {
                  var _this = this;
                  if (this._queue.push(item) === 1 && !this._draining) {
                    setTimeout(function () {
                      return _this._drainQueue();
                    }, 0);
                  }
                };
                NextTickQueue2.prototype._cleanUpNextTick = function () {
                  this._draining = false;
                  if (this._currentQueue && this._currentQueue.length) {
                    this._queue = this._currentQueue.concat(this._queue);
                  } else {
                    this._queueIndex = -1;
                  }
                  if (this._queue.length) {
                    this._drainQueue();
                  }
                };
                NextTickQueue2.prototype._drainQueue = function () {
                  var _this = this;
                  if (this._draining) {
                    return;
                  }
                  var timeout = setTimeout(function () {
                    return _this._cleanUpNextTick();
                  });
                  this._draining = true;
                  var len = this._queue.length;
                  while (len) {
                    this._currentQueue = this._queue;
                    this._queue = [];
                    while (++this._queueIndex < len) {
                      if (this._currentQueue) {
                        this._currentQueue[this._queueIndex].run();
                      }
                    }
                    this._queueIndex = -1;
                    len = this._queue.length;
                  }
                  this._currentQueue = null;
                  this._draining = false;
                  clearTimeout(timeout);
                };
                return NextTickQueue2;
              })();
              var Process = (function (_super) {
                __extends(Process2, _super);
                function Process2() {
                  _super.apply(this, arguments);
                  this.startTime = Date.now();
                  this._cwd = "/";
                  this.platform = "browser";
                  this.argv = [];
                  this.execArgv = [];
                  this.stdout = null;
                  this.stderr = null;
                  this.stdin = null;
                  this.domain = null;
                  this._queue = new NextTickQueue();
                  this.execPath = __dirname;
                  this.env = {};
                  this.exitCode = 0;
                  this._gid = 1;
                  this._uid = 1;
                  this.version = "v5.0";
                  this.versions = {
                    http_parser: "0.0",
                    node: "5.0",
                    v8: "0.0",
                    uv: "0.0",
                    zlib: "0.0",
                    ares: "0.0",
                    icu: "0.0",
                    modules: "0",
                    openssl: "0.0",
                  };
                  this.config = {
                    target_defaults: {
                      cflags: [],
                      default_configuration: "Release",
                      defines: [],
                      include_dirs: [],
                      libraries: [],
                    },
                    variables: {
                      clang: 0,
                      host_arch: "x32",
                      node_install_npm: false,
                      node_install_waf: false,
                      node_prefix: "",
                      node_shared_cares: false,
                      node_shared_http_parser: false,
                      node_shared_libuv: false,
                      node_shared_zlib: false,
                      node_shared_v8: false,
                      node_use_dtrace: false,
                      node_use_etw: false,
                      node_use_openssl: false,
                      node_shared_openssl: false,
                      strict_aliasing: false,
                      target_arch: "x32",
                      v8_use_snapshot: false,
                      v8_no_strict_aliasing: 0,
                      visibility: "",
                    },
                  };
                  this.pid = (Math.random() * 1e3) | 0;
                  this.title = "node";
                  this.arch = "x32";
                  this._mask = 18;
                  this.connected = void 0;
                }
                Process2.prototype.chdir = function (dir) {
                  if (path2 === null) {
                    path2 = __webpack_require__(9);
                  }
                  this._cwd = path2.resolve(dir);
                };
                Process2.prototype.cwd = function () {
                  return this._cwd;
                };
                Process2.prototype.uptime = function () {
                  return ((Date.now() - this.startTime) / 1e3) | 0;
                };
                Process2.prototype.nextTick = function (fun) {
                  var args = [];
                  for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                  }
                  this._queue.push(new Item(fun, args));
                };
                Process2.prototype.abort = function () {
                  this.emit("abort");
                };
                Process2.prototype.exit = function (code) {
                  this.exitCode = code;
                  this.emit("exit", [code]);
                };
                Process2.prototype.getgid = function () {
                  return this._gid;
                };
                Process2.prototype.setgid = function (gid) {
                  if (typeof gid === "number") {
                    this._gid = gid;
                  } else {
                    this._gid = 1;
                  }
                };
                Process2.prototype.getuid = function () {
                  return this._uid;
                };
                Process2.prototype.setuid = function (uid) {
                  if (typeof uid === "number") {
                    this._uid = uid;
                  } else {
                    this._uid = 1;
                  }
                };
                Process2.prototype.kill = function (pid, signal) {
                  this.emit("kill", [pid, signal]);
                };
                Process2.prototype.memoryUsage = function () {
                  return { rss: 0, heapTotal: 0, heapUsed: 0 };
                };
                Process2.prototype.umask = function (mask) {
                  if (mask === void 0) {
                    mask = this._mask;
                  }
                  var oldMask = this._mask;
                  this._mask = mask;
                  this.emit("umask", [mask]);
                  return oldMask;
                };
                Process2.prototype.hrtime = function () {
                  var timeinfo;
                  if (typeof performance !== "undefined") {
                    timeinfo = performance.now();
                  } else if (Date["now"]) {
                    timeinfo = Date.now();
                  } else {
                    timeinfo = /* @__PURE__ */ new Date().getTime();
                  }
                  var secs = (timeinfo / 1e3) | 0;
                  timeinfo -= secs * 1e3;
                  timeinfo = (timeinfo * 1e6) | 0;
                  return [secs, timeinfo];
                };
                Process2.prototype.initializeTTYs = function () {
                  if (this.stdout === null) {
                    var TTY = __webpack_require__(10);
                    this.stdout = new TTY();
                    this.stderr = new TTY();
                    this.stdin = new TTY();
                  }
                };
                Process2.prototype.disconnect = function () {};
                return Process2;
              })(events.EventEmitter);
              module3.exports = Process;
            }).call(exports3, "/");
          },
          /* 8 */
          /***/
          function (module3, exports3) {
            function EventEmitter() {
              this._events = this._events || {};
              this._maxListeners = this._maxListeners || void 0;
            }
            module3.exports = EventEmitter;
            EventEmitter.EventEmitter = EventEmitter;
            EventEmitter.prototype._events = void 0;
            EventEmitter.prototype._maxListeners = void 0;
            EventEmitter.defaultMaxListeners = 10;
            EventEmitter.prototype.setMaxListeners = function (n) {
              if (!isNumber(n) || n < 0 || isNaN(n))
                throw TypeError("n must be a positive number");
              this._maxListeners = n;
              return this;
            };
            EventEmitter.prototype.emit = function (type) {
              var er, handler, len, args, i, listeners;
              if (!this._events) this._events = {};
              if (type === "error") {
                if (
                  !this._events.error ||
                  (isObject(this._events.error) && !this._events.error.length)
                ) {
                  er = arguments[1];
                  if (er instanceof Error) {
                    throw er;
                  } else {
                    var err = new Error(
                      'Uncaught, unspecified "error" event. (' + er + ")"
                    );
                    err.context = er;
                    throw err;
                  }
                }
              }
              handler = this._events[type];
              if (isUndefined(handler)) return false;
              if (isFunction(handler)) {
                switch (arguments.length) {
                  case 1:
                    handler.call(this);
                    break;
                  case 2:
                    handler.call(this, arguments[1]);
                    break;
                  case 3:
                    handler.call(this, arguments[1], arguments[2]);
                    break;
                  default:
                    args = Array.prototype.slice.call(arguments, 1);
                    handler.apply(this, args);
                }
              } else if (isObject(handler)) {
                args = Array.prototype.slice.call(arguments, 1);
                listeners = handler.slice();
                len = listeners.length;
                for (i = 0; i < len; i++) listeners[i].apply(this, args);
              }
              return true;
            };
            EventEmitter.prototype.addListener = function (type, listener) {
              var m;
              if (!isFunction(listener))
                throw TypeError("listener must be a function");
              if (!this._events) this._events = {};
              if (this._events.newListener)
                this.emit(
                  "newListener",
                  type,
                  isFunction(listener.listener) ? listener.listener : listener
                );
              if (!this._events[type]) this._events[type] = listener;
              else if (isObject(this._events[type]))
                this._events[type].push(listener);
              else this._events[type] = [this._events[type], listener];
              if (isObject(this._events[type]) && !this._events[type].warned) {
                if (!isUndefined(this._maxListeners)) {
                  m = this._maxListeners;
                } else {
                  m = EventEmitter.defaultMaxListeners;
                }
                if (m && m > 0 && this._events[type].length > m) {
                  this._events[type].warned = true;
                  console.error(
                    "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
                    this._events[type].length
                  );
                  if (typeof console.trace === "function") {
                    console.trace();
                  }
                }
              }
              return this;
            };
            EventEmitter.prototype.on = EventEmitter.prototype.addListener;
            EventEmitter.prototype.once = function (type, listener) {
              if (!isFunction(listener))
                throw TypeError("listener must be a function");
              var fired = false;
              function g() {
                this.removeListener(type, g);
                if (!fired) {
                  fired = true;
                  listener.apply(this, arguments);
                }
              }
              g.listener = listener;
              this.on(type, g);
              return this;
            };
            EventEmitter.prototype.removeListener = function (type, listener) {
              var list, position, length, i;
              if (!isFunction(listener))
                throw TypeError("listener must be a function");
              if (!this._events || !this._events[type]) return this;
              list = this._events[type];
              length = list.length;
              position = -1;
              if (
                list === listener ||
                (isFunction(list.listener) && list.listener === listener)
              ) {
                delete this._events[type];
                if (this._events.removeListener)
                  this.emit("removeListener", type, listener);
              } else if (isObject(list)) {
                for (i = length; i-- > 0; ) {
                  if (
                    list[i] === listener ||
                    (list[i].listener && list[i].listener === listener)
                  ) {
                    position = i;
                    break;
                  }
                }
                if (position < 0) return this;
                if (list.length === 1) {
                  list.length = 0;
                  delete this._events[type];
                } else {
                  list.splice(position, 1);
                }
                if (this._events.removeListener)
                  this.emit("removeListener", type, listener);
              }
              return this;
            };
            EventEmitter.prototype.removeAllListeners = function (type) {
              var key, listeners;
              if (!this._events) return this;
              if (!this._events.removeListener) {
                if (arguments.length === 0) this._events = {};
                else if (this._events[type]) delete this._events[type];
                return this;
              }
              if (arguments.length === 0) {
                for (key in this._events) {
                  if (key === "removeListener") continue;
                  this.removeAllListeners(key);
                }
                this.removeAllListeners("removeListener");
                this._events = {};
                return this;
              }
              listeners = this._events[type];
              if (isFunction(listeners)) {
                this.removeListener(type, listeners);
              } else if (listeners) {
                while (listeners.length)
                  this.removeListener(type, listeners[listeners.length - 1]);
              }
              delete this._events[type];
              return this;
            };
            EventEmitter.prototype.listeners = function (type) {
              var ret;
              if (!this._events || !this._events[type]) ret = [];
              else if (isFunction(this._events[type]))
                ret = [this._events[type]];
              else ret = this._events[type].slice();
              return ret;
            };
            EventEmitter.prototype.listenerCount = function (type) {
              if (this._events) {
                var evlistener = this._events[type];
                if (isFunction(evlistener)) return 1;
                else if (evlistener) return evlistener.length;
              }
              return 0;
            };
            EventEmitter.listenerCount = function (emitter, type) {
              return emitter.listenerCount(type);
            };
            function isFunction(arg) {
              return typeof arg === "function";
            }
            function isNumber(arg) {
              return typeof arg === "number";
            }
            function isObject(arg) {
              return typeof arg === "object" && arg !== null;
            }
            function isUndefined(arg) {
              return arg === void 0;
            }
          },
          /* 9 */
          /***/
          function (module3, exports3, __webpack_require__) {
            (function (process2) {
              var splitPathRe =
                /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
              function posixSplitPath(filename) {
                var out = splitPathRe.exec(filename);
                out.shift();
                return out;
              }
              var path2 = (function () {
                function path3() {}
                path3.normalize = function (p) {
                  if (p === "") {
                    p = ".";
                  }
                  var absolute = p.charAt(0) === path3.sep;
                  p = path3._removeDuplicateSeps(p);
                  var components = p.split(path3.sep);
                  var goodComponents = [];
                  for (var idx = 0; idx < components.length; idx++) {
                    var c = components[idx];
                    if (c === ".") {
                      continue;
                    } else if (
                      c === ".." &&
                      (absolute ||
                        (!absolute &&
                          goodComponents.length > 0 &&
                          goodComponents[0] !== ".."))
                    ) {
                      goodComponents.pop();
                    } else {
                      goodComponents.push(c);
                    }
                  }
                  if (!absolute && goodComponents.length < 2) {
                    switch (goodComponents.length) {
                      case 1:
                        if (goodComponents[0] === "") {
                          goodComponents.unshift(".");
                        }
                        break;
                      default:
                        goodComponents.push(".");
                    }
                  }
                  p = goodComponents.join(path3.sep);
                  if (absolute && p.charAt(0) !== path3.sep) {
                    p = path3.sep + p;
                  }
                  return p;
                };
                path3.join = function () {
                  var paths = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                    paths[_i - 0] = arguments[_i];
                  }
                  var processed = [];
                  for (var i = 0; i < paths.length; i++) {
                    var segment = paths[i];
                    if (typeof segment !== "string") {
                      throw new TypeError(
                        "Invalid argument type to path.join: " + typeof segment
                      );
                    } else if (segment !== "") {
                      processed.push(segment);
                    }
                  }
                  return path3.normalize(processed.join(path3.sep));
                };
                path3.resolve = function () {
                  var paths = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                    paths[_i - 0] = arguments[_i];
                  }
                  var processed = [];
                  for (var i = 0; i < paths.length; i++) {
                    var p = paths[i];
                    if (typeof p !== "string") {
                      throw new TypeError(
                        "Invalid argument type to path.join: " + typeof p
                      );
                    } else if (p !== "") {
                      if (p.charAt(0) === path3.sep) {
                        processed = [];
                      }
                      processed.push(p);
                    }
                  }
                  var resolved = path3.normalize(processed.join(path3.sep));
                  if (
                    resolved.length > 1 &&
                    resolved.charAt(resolved.length - 1) === path3.sep
                  ) {
                    return resolved.substr(0, resolved.length - 1);
                  }
                  if (resolved.charAt(0) !== path3.sep) {
                    if (
                      resolved.charAt(0) === "." &&
                      (resolved.length === 1 ||
                        resolved.charAt(1) === path3.sep)
                    ) {
                      resolved =
                        resolved.length === 1 ? "" : resolved.substr(2);
                    }
                    var cwd = process2.cwd();
                    if (resolved !== "") {
                      resolved = this.normalize(
                        cwd + (cwd !== "/" ? path3.sep : "") + resolved
                      );
                    } else {
                      resolved = cwd;
                    }
                  }
                  return resolved;
                };
                path3.relative = function (from, to) {
                  var i;
                  from = path3.resolve(from);
                  to = path3.resolve(to);
                  var fromSegs = from.split(path3.sep);
                  var toSegs = to.split(path3.sep);
                  toSegs.shift();
                  fromSegs.shift();
                  var upCount = 0;
                  var downSegs = [];
                  for (i = 0; i < fromSegs.length; i++) {
                    var seg = fromSegs[i];
                    if (seg === toSegs[i]) {
                      continue;
                    }
                    upCount = fromSegs.length - i;
                    break;
                  }
                  downSegs = toSegs.slice(i);
                  if (fromSegs.length === 1 && fromSegs[0] === "") {
                    upCount = 0;
                  }
                  if (upCount > fromSegs.length) {
                    upCount = fromSegs.length;
                  }
                  var rv = "";
                  for (i = 0; i < upCount; i++) {
                    rv += "../";
                  }
                  rv += downSegs.join(path3.sep);
                  if (rv.length > 1 && rv.charAt(rv.length - 1) === path3.sep) {
                    rv = rv.substr(0, rv.length - 1);
                  }
                  return rv;
                };
                path3.dirname = function (p) {
                  p = path3._removeDuplicateSeps(p);
                  var absolute = p.charAt(0) === path3.sep;
                  var sections = p.split(path3.sep);
                  if (sections.pop() === "" && sections.length > 0) {
                    sections.pop();
                  }
                  if (
                    sections.length > 1 ||
                    (sections.length === 1 && !absolute)
                  ) {
                    return sections.join(path3.sep);
                  } else if (absolute) {
                    return path3.sep;
                  } else {
                    return ".";
                  }
                };
                path3.basename = function (p, ext) {
                  if (ext === void 0) {
                    ext = "";
                  }
                  if (p === "") {
                    return p;
                  }
                  p = path3.normalize(p);
                  var sections = p.split(path3.sep);
                  var lastPart = sections[sections.length - 1];
                  if (lastPart === "" && sections.length > 1) {
                    return sections[sections.length - 2];
                  }
                  if (ext.length > 0) {
                    var lastPartExt = lastPart.substr(
                      lastPart.length - ext.length
                    );
                    if (lastPartExt === ext) {
                      return lastPart.substr(0, lastPart.length - ext.length);
                    }
                  }
                  return lastPart;
                };
                path3.extname = function (p) {
                  p = path3.normalize(p);
                  var sections = p.split(path3.sep);
                  p = sections.pop();
                  if (p === "" && sections.length > 0) {
                    p = sections.pop();
                  }
                  if (p === "..") {
                    return "";
                  }
                  var i = p.lastIndexOf(".");
                  if (i === -1 || i === 0) {
                    return "";
                  }
                  return p.substr(i);
                };
                path3.isAbsolute = function (p) {
                  return p.length > 0 && p.charAt(0) === path3.sep;
                };
                path3._makeLong = function (p) {
                  return p;
                };
                path3.parse = function (p) {
                  var allParts = posixSplitPath(p);
                  return {
                    root: allParts[0],
                    dir: allParts[0] + allParts[1].slice(0, -1),
                    base: allParts[2],
                    ext: allParts[3],
                    name: allParts[2].slice(
                      0,
                      allParts[2].length - allParts[3].length
                    ),
                  };
                };
                path3.format = function (pathObject) {
                  if (pathObject === null || typeof pathObject !== "object") {
                    throw new TypeError(
                      "Parameter 'pathObject' must be an object, not " +
                        typeof pathObject
                    );
                  }
                  var root = pathObject.root || "";
                  if (typeof root !== "string") {
                    throw new TypeError(
                      "'pathObject.root' must be a string or undefined, not " +
                        typeof pathObject.root
                    );
                  }
                  var dir = pathObject.dir ? pathObject.dir + path3.sep : "";
                  var base = pathObject.base || "";
                  return dir + base;
                };
                path3._removeDuplicateSeps = function (p) {
                  p = p.replace(this._replaceRegex, this.sep);
                  return p;
                };
                path3.sep = "/";
                path3._replaceRegex = new RegExp("//+", "g");
                path3.delimiter = ":";
                path3.posix = path3;
                path3.win32 = path3;
                return path3;
              })();
              module3.exports = path2;
            }).call(exports3, __webpack_require__(6));
          },
          /* 10 */
          /***/
          function (module3, exports3, __webpack_require__) {
            (function (Buffer2) {
              var __extends =
                (this && this.__extends) ||
                function (d, b) {
                  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype =
                    b === null
                      ? Object.create(b)
                      : ((__.prototype = b.prototype), new __());
                };
              var stream = __webpack_require__(11);
              var TTY = (function (_super) {
                __extends(TTY2, _super);
                function TTY2() {
                  _super.call(this);
                  this.isRaw = false;
                  this.columns = 80;
                  this.rows = 120;
                  this.isTTY = true;
                  this._bufferedWrites = [];
                  this._waitingForWrites = false;
                }
                TTY2.prototype.setRawMode = function (mode) {
                  if (this.isRaw !== mode) {
                    this.isRaw = mode;
                    this.emit("modeChange");
                  }
                };
                TTY2.prototype.changeColumns = function (columns) {
                  if (columns !== this.columns) {
                    this.columns = columns;
                    this.emit("resize");
                  }
                };
                TTY2.prototype.changeRows = function (rows) {
                  if (rows !== this.rows) {
                    this.rows = rows;
                    this.emit("resize");
                  }
                };
                TTY2.isatty = function (fd) {
                  return fd && fd instanceof TTY2;
                };
                TTY2.prototype._write = function (chunk, encoding, cb) {
                  var error;
                  try {
                    var data;
                    if (typeof chunk === "string") {
                      data = new Buffer2(chunk, encoding);
                    } else {
                      data = chunk;
                    }
                    this._bufferedWrites.push(data);
                    if (this._waitingForWrites) {
                      this._read(1024);
                    }
                  } catch (e) {
                    error = e;
                  } finally {
                    cb(error);
                  }
                };
                TTY2.prototype._read = function (size) {
                  if (this._bufferedWrites.length === 0) {
                    this._waitingForWrites = true;
                  } else {
                    while (this._bufferedWrites.length > 0) {
                      this._waitingForWrites = this.push(
                        this._bufferedWrites.shift()
                      );
                      if (!this._waitingForWrites) {
                        break;
                      }
                    }
                  }
                };
                return TTY2;
              })(stream.Duplex);
              module3.exports = TTY;
            }).call(exports3, __webpack_require__(1));
          },
          /* 11 */
          /***/
          function (module3, exports3, __webpack_require__) {
            module3.exports = Stream;
            var EE = __webpack_require__(8).EventEmitter;
            var inherits = __webpack_require__(12);
            inherits(Stream, EE);
            Stream.Readable = __webpack_require__(13);
            Stream.Writable = __webpack_require__(27);
            Stream.Duplex = __webpack_require__(28);
            Stream.Transform = __webpack_require__(29);
            Stream.PassThrough = __webpack_require__(30);
            Stream.Stream = Stream;
            function Stream() {
              EE.call(this);
            }
            Stream.prototype.pipe = function (dest, options) {
              var source = this;
              function ondata(chunk) {
                if (dest.writable) {
                  if (false === dest.write(chunk) && source.pause) {
                    source.pause();
                  }
                }
              }
              source.on("data", ondata);
              function ondrain() {
                if (source.readable && source.resume) {
                  source.resume();
                }
              }
              dest.on("drain", ondrain);
              if (!dest._isStdio && (!options || options.end !== false)) {
                source.on("end", onend);
                source.on("close", onclose);
              }
              var didOnEnd = false;
              function onend() {
                if (didOnEnd) return;
                didOnEnd = true;
                dest.end();
              }
              function onclose() {
                if (didOnEnd) return;
                didOnEnd = true;
                if (typeof dest.destroy === "function") dest.destroy();
              }
              function onerror(er) {
                cleanup();
                if (EE.listenerCount(this, "error") === 0) {
                  throw er;
                }
              }
              source.on("error", onerror);
              dest.on("error", onerror);
              function cleanup() {
                source.removeListener("data", ondata);
                dest.removeListener("drain", ondrain);
                source.removeListener("end", onend);
                source.removeListener("close", onclose);
                source.removeListener("error", onerror);
                dest.removeListener("error", onerror);
                source.removeListener("end", cleanup);
                source.removeListener("close", cleanup);
                dest.removeListener("close", cleanup);
              }
              source.on("end", cleanup);
              source.on("close", cleanup);
              dest.on("close", cleanup);
              dest.emit("pipe", source);
              return dest;
            };
          },
          /* 12 */
          /***/
          function (module3, exports3) {
            if (typeof Object.create === "function") {
              module3.exports = function inherits(ctor, superCtor) {
                ctor.super_ = superCtor;
                ctor.prototype = Object.create(superCtor.prototype, {
                  constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true,
                  },
                });
              };
            } else {
              module3.exports = function inherits(ctor, superCtor) {
                ctor.super_ = superCtor;
                var TempCtor = function () {};
                TempCtor.prototype = superCtor.prototype;
                ctor.prototype = new TempCtor();
                ctor.prototype.constructor = ctor;
              };
            }
          },
          /* 13 */
          /***/
          function (module3, exports3, __webpack_require__) {
            (function (process2) {
              var Stream = (function () {
                try {
                  return __webpack_require__(11);
                } catch (_) {}
              })();
              exports3 = module3.exports = __webpack_require__(14);
              exports3.Stream = Stream || exports3;
              exports3.Readable = exports3;
              exports3.Writable = __webpack_require__(22);
              exports3.Duplex = __webpack_require__(21);
              exports3.Transform = __webpack_require__(25);
              exports3.PassThrough = __webpack_require__(26);
              if (
                !process2.browser &&
                process2.env.READABLE_STREAM === "disable" &&
                Stream
              ) {
                module3.exports = Stream;
              }
            }).call(exports3, __webpack_require__(6));
          },
          /* 14 */
          /***/
          function (module3, exports3, __webpack_require__) {
            (function (process2) {
              module3.exports = Readable;
              var processNextTick = __webpack_require__(15);
              var isArray = __webpack_require__(16);
              var Duplex;
              Readable.ReadableState = ReadableState;
              __webpack_require__(8).EventEmitter;
              var EElistenerCount = function (emitter, type) {
                return emitter.listeners(type).length;
              };
              var Stream;
              (function () {
                try {
                  Stream = __webpack_require__(11);
                } catch (_) {
                } finally {
                  if (!Stream) Stream = __webpack_require__(8).EventEmitter;
                }
              })();
              var Buffer2 = __webpack_require__(2).Buffer;
              var bufferShim = __webpack_require__(17);
              var util = __webpack_require__(18);
              util.inherits = __webpack_require__(12);
              var debugUtil = __webpack_require__(19);
              var debug = void 0;
              if (debugUtil && debugUtil.debuglog) {
                debug = debugUtil.debuglog("stream");
              } else {
                debug = function () {};
              }
              var BufferList = __webpack_require__(20);
              var StringDecoder;
              util.inherits(Readable, Stream);
              function prependListener(emitter, event, fn) {
                if (typeof emitter.prependListener === "function") {
                  return emitter.prependListener(event, fn);
                } else {
                  if (!emitter._events || !emitter._events[event])
                    emitter.on(event, fn);
                  else if (isArray(emitter._events[event]))
                    emitter._events[event].unshift(fn);
                  else emitter._events[event] = [fn, emitter._events[event]];
                }
              }
              function ReadableState(options, stream) {
                Duplex = Duplex || __webpack_require__(21);
                options = options || {};
                this.objectMode = !!options.objectMode;
                if (stream instanceof Duplex)
                  this.objectMode =
                    this.objectMode || !!options.readableObjectMode;
                var hwm = options.highWaterMark;
                var defaultHwm = this.objectMode ? 16 : 16 * 1024;
                this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
                this.highWaterMark = ~~this.highWaterMark;
                this.buffer = new BufferList();
                this.length = 0;
                this.pipes = null;
                this.pipesCount = 0;
                this.flowing = null;
                this.ended = false;
                this.endEmitted = false;
                this.reading = false;
                this.sync = true;
                this.needReadable = false;
                this.emittedReadable = false;
                this.readableListening = false;
                this.resumeScheduled = false;
                this.defaultEncoding = options.defaultEncoding || "utf8";
                this.ranOut = false;
                this.awaitDrain = 0;
                this.readingMore = false;
                this.decoder = null;
                this.encoding = null;
                if (options.encoding) {
                  if (!StringDecoder)
                    StringDecoder = __webpack_require__(24).StringDecoder;
                  this.decoder = new StringDecoder(options.encoding);
                  this.encoding = options.encoding;
                }
              }
              function Readable(options) {
                Duplex = Duplex || __webpack_require__(21);
                if (!(this instanceof Readable)) return new Readable(options);
                this._readableState = new ReadableState(options, this);
                this.readable = true;
                if (options && typeof options.read === "function")
                  this._read = options.read;
                Stream.call(this);
              }
              Readable.prototype.push = function (chunk, encoding) {
                var state = this._readableState;
                if (!state.objectMode && typeof chunk === "string") {
                  encoding = encoding || state.defaultEncoding;
                  if (encoding !== state.encoding) {
                    chunk = bufferShim.from(chunk, encoding);
                    encoding = "";
                  }
                }
                return readableAddChunk(this, state, chunk, encoding, false);
              };
              Readable.prototype.unshift = function (chunk) {
                var state = this._readableState;
                return readableAddChunk(this, state, chunk, "", true);
              };
              Readable.prototype.isPaused = function () {
                return this._readableState.flowing === false;
              };
              function readableAddChunk(
                stream,
                state,
                chunk,
                encoding,
                addToFront
              ) {
                var er = chunkInvalid(state, chunk);
                if (er) {
                  stream.emit("error", er);
                } else if (chunk === null) {
                  state.reading = false;
                  onEofChunk(stream, state);
                } else if (state.objectMode || (chunk && chunk.length > 0)) {
                  if (state.ended && !addToFront) {
                    var e = new Error("stream.push() after EOF");
                    stream.emit("error", e);
                  } else if (state.endEmitted && addToFront) {
                    var _e = new Error("stream.unshift() after end event");
                    stream.emit("error", _e);
                  } else {
                    var skipAdd;
                    if (state.decoder && !addToFront && !encoding) {
                      chunk = state.decoder.write(chunk);
                      skipAdd = !state.objectMode && chunk.length === 0;
                    }
                    if (!addToFront) state.reading = false;
                    if (!skipAdd) {
                      if (state.flowing && state.length === 0 && !state.sync) {
                        stream.emit("data", chunk);
                        stream.read(0);
                      } else {
                        state.length += state.objectMode ? 1 : chunk.length;
                        if (addToFront) state.buffer.unshift(chunk);
                        else state.buffer.push(chunk);
                        if (state.needReadable) emitReadable(stream);
                      }
                    }
                    maybeReadMore(stream, state);
                  }
                } else if (!addToFront) {
                  state.reading = false;
                }
                return needMoreData(state);
              }
              function needMoreData(state) {
                return (
                  !state.ended &&
                  (state.needReadable ||
                    state.length < state.highWaterMark ||
                    state.length === 0)
                );
              }
              Readable.prototype.setEncoding = function (enc) {
                if (!StringDecoder)
                  StringDecoder = __webpack_require__(24).StringDecoder;
                this._readableState.decoder = new StringDecoder(enc);
                this._readableState.encoding = enc;
                return this;
              };
              var MAX_HWM = 8388608;
              function computeNewHighWaterMark(n) {
                if (n >= MAX_HWM) {
                  n = MAX_HWM;
                } else {
                  n--;
                  n |= n >>> 1;
                  n |= n >>> 2;
                  n |= n >>> 4;
                  n |= n >>> 8;
                  n |= n >>> 16;
                  n++;
                }
                return n;
              }
              function howMuchToRead(n, state) {
                if (n <= 0 || (state.length === 0 && state.ended)) return 0;
                if (state.objectMode) return 1;
                if (n !== n) {
                  if (state.flowing && state.length)
                    return state.buffer.head.data.length;
                  else return state.length;
                }
                if (n > state.highWaterMark)
                  state.highWaterMark = computeNewHighWaterMark(n);
                if (n <= state.length) return n;
                if (!state.ended) {
                  state.needReadable = true;
                  return 0;
                }
                return state.length;
              }
              Readable.prototype.read = function (n) {
                debug("read", n);
                n = parseInt(n, 10);
                var state = this._readableState;
                var nOrig = n;
                if (n !== 0) state.emittedReadable = false;
                if (
                  n === 0 &&
                  state.needReadable &&
                  (state.length >= state.highWaterMark || state.ended)
                ) {
                  debug("read: emitReadable", state.length, state.ended);
                  if (state.length === 0 && state.ended) endReadable(this);
                  else emitReadable(this);
                  return null;
                }
                n = howMuchToRead(n, state);
                if (n === 0 && state.ended) {
                  if (state.length === 0) endReadable(this);
                  return null;
                }
                var doRead = state.needReadable;
                debug("need readable", doRead);
                if (
                  state.length === 0 ||
                  state.length - n < state.highWaterMark
                ) {
                  doRead = true;
                  debug("length less than watermark", doRead);
                }
                if (state.ended || state.reading) {
                  doRead = false;
                  debug("reading or ended", doRead);
                } else if (doRead) {
                  debug("do read");
                  state.reading = true;
                  state.sync = true;
                  if (state.length === 0) state.needReadable = true;
                  this._read(state.highWaterMark);
                  state.sync = false;
                  if (!state.reading) n = howMuchToRead(nOrig, state);
                }
                var ret;
                if (n > 0) ret = fromList(n, state);
                else ret = null;
                if (ret === null) {
                  state.needReadable = true;
                  n = 0;
                } else {
                  state.length -= n;
                }
                if (state.length === 0) {
                  if (!state.ended) state.needReadable = true;
                  if (nOrig !== n && state.ended) endReadable(this);
                }
                if (ret !== null) this.emit("data", ret);
                return ret;
              };
              function chunkInvalid(state, chunk) {
                var er = null;
                if (
                  !Buffer2.isBuffer(chunk) &&
                  typeof chunk !== "string" &&
                  chunk !== null &&
                  chunk !== void 0 &&
                  !state.objectMode
                ) {
                  er = new TypeError("Invalid non-string/buffer chunk");
                }
                return er;
              }
              function onEofChunk(stream, state) {
                if (state.ended) return;
                if (state.decoder) {
                  var chunk = state.decoder.end();
                  if (chunk && chunk.length) {
                    state.buffer.push(chunk);
                    state.length += state.objectMode ? 1 : chunk.length;
                  }
                }
                state.ended = true;
                emitReadable(stream);
              }
              function emitReadable(stream) {
                var state = stream._readableState;
                state.needReadable = false;
                if (!state.emittedReadable) {
                  debug("emitReadable", state.flowing);
                  state.emittedReadable = true;
                  if (state.sync) processNextTick(emitReadable_, stream);
                  else emitReadable_(stream);
                }
              }
              function emitReadable_(stream) {
                debug("emit readable");
                stream.emit("readable");
                flow(stream);
              }
              function maybeReadMore(stream, state) {
                if (!state.readingMore) {
                  state.readingMore = true;
                  processNextTick(maybeReadMore_, stream, state);
                }
              }
              function maybeReadMore_(stream, state) {
                var len = state.length;
                while (
                  !state.reading &&
                  !state.flowing &&
                  !state.ended &&
                  state.length < state.highWaterMark
                ) {
                  debug("maybeReadMore read 0");
                  stream.read(0);
                  if (len === state.length) break;
                  else len = state.length;
                }
                state.readingMore = false;
              }
              Readable.prototype._read = function (n) {
                this.emit("error", new Error("_read() is not implemented"));
              };
              Readable.prototype.pipe = function (dest, pipeOpts) {
                var src = this;
                var state = this._readableState;
                switch (state.pipesCount) {
                  case 0:
                    state.pipes = dest;
                    break;
                  case 1:
                    state.pipes = [state.pipes, dest];
                    break;
                  default:
                    state.pipes.push(dest);
                    break;
                }
                state.pipesCount += 1;
                debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
                var doEnd =
                  (!pipeOpts || pipeOpts.end !== false) &&
                  dest !== process2.stdout &&
                  dest !== process2.stderr;
                var endFn = doEnd ? onend : cleanup;
                if (state.endEmitted) processNextTick(endFn);
                else src.once("end", endFn);
                dest.on("unpipe", onunpipe);
                function onunpipe(readable) {
                  debug("onunpipe");
                  if (readable === src) {
                    cleanup();
                  }
                }
                function onend() {
                  debug("onend");
                  dest.end();
                }
                var ondrain = pipeOnDrain(src);
                dest.on("drain", ondrain);
                var cleanedUp = false;
                function cleanup() {
                  debug("cleanup");
                  dest.removeListener("close", onclose);
                  dest.removeListener("finish", onfinish);
                  dest.removeListener("drain", ondrain);
                  dest.removeListener("error", onerror);
                  dest.removeListener("unpipe", onunpipe);
                  src.removeListener("end", onend);
                  src.removeListener("end", cleanup);
                  src.removeListener("data", ondata);
                  cleanedUp = true;
                  if (
                    state.awaitDrain &&
                    (!dest._writableState || dest._writableState.needDrain)
                  )
                    ondrain();
                }
                var increasedAwaitDrain = false;
                src.on("data", ondata);
                function ondata(chunk) {
                  debug("ondata");
                  increasedAwaitDrain = false;
                  var ret = dest.write(chunk);
                  if (false === ret && !increasedAwaitDrain) {
                    if (
                      ((state.pipesCount === 1 && state.pipes === dest) ||
                        (state.pipesCount > 1 &&
                          indexOf(state.pipes, dest) !== -1)) &&
                      !cleanedUp
                    ) {
                      debug(
                        "false write response, pause",
                        src._readableState.awaitDrain
                      );
                      src._readableState.awaitDrain++;
                      increasedAwaitDrain = true;
                    }
                    src.pause();
                  }
                }
                function onerror(er) {
                  debug("onerror", er);
                  unpipe();
                  dest.removeListener("error", onerror);
                  if (EElistenerCount(dest, "error") === 0)
                    dest.emit("error", er);
                }
                prependListener(dest, "error", onerror);
                function onclose() {
                  dest.removeListener("finish", onfinish);
                  unpipe();
                }
                dest.once("close", onclose);
                function onfinish() {
                  debug("onfinish");
                  dest.removeListener("close", onclose);
                  unpipe();
                }
                dest.once("finish", onfinish);
                function unpipe() {
                  debug("unpipe");
                  src.unpipe(dest);
                }
                dest.emit("pipe", src);
                if (!state.flowing) {
                  debug("pipe resume");
                  src.resume();
                }
                return dest;
              };
              function pipeOnDrain(src) {
                return function () {
                  var state = src._readableState;
                  debug("pipeOnDrain", state.awaitDrain);
                  if (state.awaitDrain) state.awaitDrain--;
                  if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
                    state.flowing = true;
                    flow(src);
                  }
                };
              }
              Readable.prototype.unpipe = function (dest) {
                var state = this._readableState;
                if (state.pipesCount === 0) return this;
                if (state.pipesCount === 1) {
                  if (dest && dest !== state.pipes) return this;
                  if (!dest) dest = state.pipes;
                  state.pipes = null;
                  state.pipesCount = 0;
                  state.flowing = false;
                  if (dest) dest.emit("unpipe", this);
                  return this;
                }
                if (!dest) {
                  var dests = state.pipes;
                  var len = state.pipesCount;
                  state.pipes = null;
                  state.pipesCount = 0;
                  state.flowing = false;
                  for (var i = 0; i < len; i++) {
                    dests[i].emit("unpipe", this);
                  }
                  return this;
                }
                var index = indexOf(state.pipes, dest);
                if (index === -1) return this;
                state.pipes.splice(index, 1);
                state.pipesCount -= 1;
                if (state.pipesCount === 1) state.pipes = state.pipes[0];
                dest.emit("unpipe", this);
                return this;
              };
              Readable.prototype.on = function (ev, fn) {
                var res = Stream.prototype.on.call(this, ev, fn);
                if (ev === "data") {
                  if (this._readableState.flowing !== false) this.resume();
                } else if (ev === "readable") {
                  var state = this._readableState;
                  if (!state.endEmitted && !state.readableListening) {
                    state.readableListening = state.needReadable = true;
                    state.emittedReadable = false;
                    if (!state.reading) {
                      processNextTick(nReadingNextTick, this);
                    } else if (state.length) {
                      emitReadable(this);
                    }
                  }
                }
                return res;
              };
              Readable.prototype.addListener = Readable.prototype.on;
              function nReadingNextTick(self2) {
                debug("readable nexttick read 0");
                self2.read(0);
              }
              Readable.prototype.resume = function () {
                var state = this._readableState;
                if (!state.flowing) {
                  debug("resume");
                  state.flowing = true;
                  resume(this, state);
                }
                return this;
              };
              function resume(stream, state) {
                if (!state.resumeScheduled) {
                  state.resumeScheduled = true;
                  processNextTick(resume_, stream, state);
                }
              }
              function resume_(stream, state) {
                if (!state.reading) {
                  debug("resume read 0");
                  stream.read(0);
                }
                state.resumeScheduled = false;
                state.awaitDrain = 0;
                stream.emit("resume");
                flow(stream);
                if (state.flowing && !state.reading) stream.read(0);
              }
              Readable.prototype.pause = function () {
                debug("call pause flowing=%j", this._readableState.flowing);
                if (false !== this._readableState.flowing) {
                  debug("pause");
                  this._readableState.flowing = false;
                  this.emit("pause");
                }
                return this;
              };
              function flow(stream) {
                var state = stream._readableState;
                debug("flow", state.flowing);
                while (state.flowing && stream.read() !== null) {}
              }
              Readable.prototype.wrap = function (stream) {
                var state = this._readableState;
                var paused = false;
                var self2 = this;
                stream.on("end", function () {
                  debug("wrapped end");
                  if (state.decoder && !state.ended) {
                    var chunk = state.decoder.end();
                    if (chunk && chunk.length) self2.push(chunk);
                  }
                  self2.push(null);
                });
                stream.on("data", function (chunk) {
                  debug("wrapped data");
                  if (state.decoder) chunk = state.decoder.write(chunk);
                  if (state.objectMode && (chunk === null || chunk === void 0))
                    return;
                  else if (!state.objectMode && (!chunk || !chunk.length))
                    return;
                  var ret = self2.push(chunk);
                  if (!ret) {
                    paused = true;
                    stream.pause();
                  }
                });
                for (var i in stream) {
                  if (this[i] === void 0 && typeof stream[i] === "function") {
                    this[i] = /* @__PURE__ */ (function (method) {
                      return function () {
                        return stream[method].apply(stream, arguments);
                      };
                    })(i);
                  }
                }
                var events = ["error", "close", "destroy", "pause", "resume"];
                forEach(events, function (ev) {
                  stream.on(ev, self2.emit.bind(self2, ev));
                });
                self2._read = function (n) {
                  debug("wrapped _read", n);
                  if (paused) {
                    paused = false;
                    stream.resume();
                  }
                };
                return self2;
              };
              Readable._fromList = fromList;
              function fromList(n, state) {
                if (state.length === 0) return null;
                var ret;
                if (state.objectMode) ret = state.buffer.shift();
                else if (!n || n >= state.length) {
                  if (state.decoder) ret = state.buffer.join("");
                  else if (state.buffer.length === 1)
                    ret = state.buffer.head.data;
                  else ret = state.buffer.concat(state.length);
                  state.buffer.clear();
                } else {
                  ret = fromListPartial(n, state.buffer, state.decoder);
                }
                return ret;
              }
              function fromListPartial(n, list, hasStrings) {
                var ret;
                if (n < list.head.data.length) {
                  ret = list.head.data.slice(0, n);
                  list.head.data = list.head.data.slice(n);
                } else if (n === list.head.data.length) {
                  ret = list.shift();
                } else {
                  ret = hasStrings
                    ? copyFromBufferString(n, list)
                    : copyFromBuffer(n, list);
                }
                return ret;
              }
              function copyFromBufferString(n, list) {
                var p = list.head;
                var c = 1;
                var ret = p.data;
                n -= ret.length;
                while ((p = p.next)) {
                  var str = p.data;
                  var nb = n > str.length ? str.length : n;
                  if (nb === str.length) ret += str;
                  else ret += str.slice(0, n);
                  n -= nb;
                  if (n === 0) {
                    if (nb === str.length) {
                      ++c;
                      if (p.next) list.head = p.next;
                      else list.head = list.tail = null;
                    } else {
                      list.head = p;
                      p.data = str.slice(nb);
                    }
                    break;
                  }
                  ++c;
                }
                list.length -= c;
                return ret;
              }
              function copyFromBuffer(n, list) {
                var ret = bufferShim.allocUnsafe(n);
                var p = list.head;
                var c = 1;
                p.data.copy(ret);
                n -= p.data.length;
                while ((p = p.next)) {
                  var buf = p.data;
                  var nb = n > buf.length ? buf.length : n;
                  buf.copy(ret, ret.length - n, 0, nb);
                  n -= nb;
                  if (n === 0) {
                    if (nb === buf.length) {
                      ++c;
                      if (p.next) list.head = p.next;
                      else list.head = list.tail = null;
                    } else {
                      list.head = p;
                      p.data = buf.slice(nb);
                    }
                    break;
                  }
                  ++c;
                }
                list.length -= c;
                return ret;
              }
              function endReadable(stream) {
                var state = stream._readableState;
                if (state.length > 0)
                  throw new Error('"endReadable()" called on non-empty stream');
                if (!state.endEmitted) {
                  state.ended = true;
                  processNextTick(endReadableNT, state, stream);
                }
              }
              function endReadableNT(state, stream) {
                if (!state.endEmitted && state.length === 0) {
                  state.endEmitted = true;
                  stream.readable = false;
                  stream.emit("end");
                }
              }
              function forEach(xs, f) {
                for (var i = 0, l = xs.length; i < l; i++) {
                  f(xs[i], i);
                }
              }
              function indexOf(xs, x) {
                for (var i = 0, l = xs.length; i < l; i++) {
                  if (xs[i] === x) return i;
                }
                return -1;
              }
            }).call(exports3, __webpack_require__(6));
          },
          /* 15 */
          /***/
          function (module3, exports3, __webpack_require__) {
            (function (process2) {
              if (
                !process2.version ||
                process2.version.indexOf("v0.") === 0 ||
                (process2.version.indexOf("v1.") === 0 &&
                  process2.version.indexOf("v1.8.") !== 0)
              ) {
                module3.exports = nextTick;
              } else {
                module3.exports = process2.nextTick;
              }
              function nextTick(fn, arg1, arg2, arg3) {
                if (typeof fn !== "function") {
                  throw new TypeError('"callback" argument must be a function');
                }
                var len = arguments.length;
                var args, i;
                switch (len) {
                  case 0:
                  case 1:
                    return process2.nextTick(fn);
                  case 2:
                    return process2.nextTick(function afterTickOne() {
                      fn.call(null, arg1);
                    });
                  case 3:
                    return process2.nextTick(function afterTickTwo() {
                      fn.call(null, arg1, arg2);
                    });
                  case 4:
                    return process2.nextTick(function afterTickThree() {
                      fn.call(null, arg1, arg2, arg3);
                    });
                  default:
                    args = new Array(len - 1);
                    i = 0;
                    while (i < args.length) {
                      args[i++] = arguments[i];
                    }
                    return process2.nextTick(function afterTick() {
                      fn.apply(null, args);
                    });
                }
              }
            }).call(exports3, __webpack_require__(6));
          },
          /* 16 */
          /***/
          function (module3, exports3) {
            var toString = {}.toString;
            module3.exports =
              Array.isArray ||
              function (arr) {
                return toString.call(arr) == "[object Array]";
              };
          },
          /* 17 */
          /***/
          function (module3, exports3, __webpack_require__) {
            (function (global2) {
              var buffer = __webpack_require__(2);
              var Buffer2 = buffer.Buffer;
              var SlowBuffer = buffer.SlowBuffer;
              var MAX_LEN = buffer.kMaxLength || 2147483647;
              exports3.alloc = function alloc(size, fill, encoding) {
                if (typeof Buffer2.alloc === "function") {
                  return Buffer2.alloc(size, fill, encoding);
                }
                if (typeof encoding === "number") {
                  throw new TypeError("encoding must not be number");
                }
                if (typeof size !== "number") {
                  throw new TypeError("size must be a number");
                }
                if (size > MAX_LEN) {
                  throw new RangeError("size is too large");
                }
                var enc = encoding;
                var _fill = fill;
                if (_fill === void 0) {
                  enc = void 0;
                  _fill = 0;
                }
                var buf = new Buffer2(size);
                if (typeof _fill === "string") {
                  var fillBuf = new Buffer2(_fill, enc);
                  var flen = fillBuf.length;
                  var i = -1;
                  while (++i < size) {
                    buf[i] = fillBuf[i % flen];
                  }
                } else {
                  buf.fill(_fill);
                }
                return buf;
              };
              exports3.allocUnsafe = function allocUnsafe(size) {
                if (typeof Buffer2.allocUnsafe === "function") {
                  return Buffer2.allocUnsafe(size);
                }
                if (typeof size !== "number") {
                  throw new TypeError("size must be a number");
                }
                if (size > MAX_LEN) {
                  throw new RangeError("size is too large");
                }
                return new Buffer2(size);
              };
              exports3.from = function from(value, encodingOrOffset, length) {
                if (
                  typeof Buffer2.from === "function" &&
                  (!global2.Uint8Array || Uint8Array.from !== Buffer2.from)
                ) {
                  return Buffer2.from(value, encodingOrOffset, length);
                }
                if (typeof value === "number") {
                  throw new TypeError('"value" argument must not be a number');
                }
                if (typeof value === "string") {
                  return new Buffer2(value, encodingOrOffset);
                }
                if (
                  typeof ArrayBuffer !== "undefined" &&
                  value instanceof ArrayBuffer
                ) {
                  var offset = encodingOrOffset;
                  if (arguments.length === 1) {
                    return new Buffer2(value);
                  }
                  if (typeof offset === "undefined") {
                    offset = 0;
                  }
                  var len = length;
                  if (typeof len === "undefined") {
                    len = value.byteLength - offset;
                  }
                  if (offset >= value.byteLength) {
                    throw new RangeError("'offset' is out of bounds");
                  }
                  if (len > value.byteLength - offset) {
                    throw new RangeError("'length' is out of bounds");
                  }
                  return new Buffer2(value.slice(offset, offset + len));
                }
                if (Buffer2.isBuffer(value)) {
                  var out = new Buffer2(value.length);
                  value.copy(out, 0, 0, value.length);
                  return out;
                }
                if (value) {
                  if (
                    Array.isArray(value) ||
                    (typeof ArrayBuffer !== "undefined" &&
                      value.buffer instanceof ArrayBuffer) ||
                    "length" in value
                  ) {
                    return new Buffer2(value);
                  }
                  if (value.type === "Buffer" && Array.isArray(value.data)) {
                    return new Buffer2(value.data);
                  }
                }
                throw new TypeError(
                  "First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object."
                );
              };
              exports3.allocUnsafeSlow = function allocUnsafeSlow(size) {
                if (typeof Buffer2.allocUnsafeSlow === "function") {
                  return Buffer2.allocUnsafeSlow(size);
                }
                if (typeof size !== "number") {
                  throw new TypeError("size must be a number");
                }
                if (size >= MAX_LEN) {
                  throw new RangeError("size is too large");
                }
                return new SlowBuffer(size);
              };
            }).call(
              exports3,
              /* @__PURE__ */ (function () {
                return this;
              })()
            );
          },
          /* 18 */
          /***/
          function (module3, exports3, __webpack_require__) {
            (function (Buffer2) {
              function isArray(arg) {
                if (Array.isArray) {
                  return Array.isArray(arg);
                }
                return objectToString(arg) === "[object Array]";
              }
              exports3.isArray = isArray;
              function isBoolean(arg) {
                return typeof arg === "boolean";
              }
              exports3.isBoolean = isBoolean;
              function isNull(arg) {
                return arg === null;
              }
              exports3.isNull = isNull;
              function isNullOrUndefined(arg) {
                return arg == null;
              }
              exports3.isNullOrUndefined = isNullOrUndefined;
              function isNumber(arg) {
                return typeof arg === "number";
              }
              exports3.isNumber = isNumber;
              function isString(arg) {
                return typeof arg === "string";
              }
              exports3.isString = isString;
              function isSymbol(arg) {
                return typeof arg === "symbol";
              }
              exports3.isSymbol = isSymbol;
              function isUndefined(arg) {
                return arg === void 0;
              }
              exports3.isUndefined = isUndefined;
              function isRegExp(re) {
                return objectToString(re) === "[object RegExp]";
              }
              exports3.isRegExp = isRegExp;
              function isObject(arg) {
                return typeof arg === "object" && arg !== null;
              }
              exports3.isObject = isObject;
              function isDate(d) {
                return objectToString(d) === "[object Date]";
              }
              exports3.isDate = isDate;
              function isError(e) {
                return (
                  objectToString(e) === "[object Error]" || e instanceof Error
                );
              }
              exports3.isError = isError;
              function isFunction(arg) {
                return typeof arg === "function";
              }
              exports3.isFunction = isFunction;
              function isPrimitive(arg) {
                return (
                  arg === null ||
                  typeof arg === "boolean" ||
                  typeof arg === "number" ||
                  typeof arg === "string" ||
                  typeof arg === "symbol" || // ES6 symbol
                  typeof arg === "undefined"
                );
              }
              exports3.isPrimitive = isPrimitive;
              exports3.isBuffer = Buffer2.isBuffer;
              function objectToString(o) {
                return Object.prototype.toString.call(o);
              }
            }).call(exports3, __webpack_require__(1));
          },
          /* 19 */
          /***/
          function (module3, exports3) {},
          /* 20 */
          /***/
          function (module3, exports3, __webpack_require__) {
            __webpack_require__(2).Buffer;
            var bufferShim = __webpack_require__(17);
            module3.exports = BufferList;
            function BufferList() {
              this.head = null;
              this.tail = null;
              this.length = 0;
            }
            BufferList.prototype.push = function (v) {
              var entry = { data: v, next: null };
              if (this.length > 0) this.tail.next = entry;
              else this.head = entry;
              this.tail = entry;
              ++this.length;
            };
            BufferList.prototype.unshift = function (v) {
              var entry = { data: v, next: this.head };
              if (this.length === 0) this.tail = entry;
              this.head = entry;
              ++this.length;
            };
            BufferList.prototype.shift = function () {
              if (this.length === 0) return;
              var ret = this.head.data;
              if (this.length === 1) this.head = this.tail = null;
              else this.head = this.head.next;
              --this.length;
              return ret;
            };
            BufferList.prototype.clear = function () {
              this.head = this.tail = null;
              this.length = 0;
            };
            BufferList.prototype.join = function (s) {
              if (this.length === 0) return "";
              var p = this.head;
              var ret = "" + p.data;
              while ((p = p.next)) {
                ret += s + p.data;
              }
              return ret;
            };
            BufferList.prototype.concat = function (n) {
              if (this.length === 0) return bufferShim.alloc(0);
              if (this.length === 1) return this.head.data;
              var ret = bufferShim.allocUnsafe(n >>> 0);
              var p = this.head;
              var i = 0;
              while (p) {
                p.data.copy(ret, i);
                i += p.data.length;
                p = p.next;
              }
              return ret;
            };
          },
          /* 21 */
          /***/
          function (module3, exports3, __webpack_require__) {
            var objectKeys =
              Object.keys ||
              function (obj) {
                var keys2 = [];
                for (var key in obj) {
                  keys2.push(key);
                }
                return keys2;
              };
            module3.exports = Duplex;
            var processNextTick = __webpack_require__(15);
            var util = __webpack_require__(18);
            util.inherits = __webpack_require__(12);
            var Readable = __webpack_require__(14);
            var Writable = __webpack_require__(22);
            util.inherits(Duplex, Readable);
            var keys = objectKeys(Writable.prototype);
            for (var v = 0; v < keys.length; v++) {
              var method = keys[v];
              if (!Duplex.prototype[method])
                Duplex.prototype[method] = Writable.prototype[method];
            }
            function Duplex(options) {
              if (!(this instanceof Duplex)) return new Duplex(options);
              Readable.call(this, options);
              Writable.call(this, options);
              if (options && options.readable === false) this.readable = false;
              if (options && options.writable === false) this.writable = false;
              this.allowHalfOpen = true;
              if (options && options.allowHalfOpen === false)
                this.allowHalfOpen = false;
              this.once("end", onend);
            }
            function onend() {
              if (this.allowHalfOpen || this._writableState.ended) return;
              processNextTick(onEndNT, this);
            }
            function onEndNT(self2) {
              self2.end();
            }
          },
          /* 22 */
          /***/
          function (module3, exports3, __webpack_require__) {
            (function (process2) {
              module3.exports = Writable;
              var processNextTick = __webpack_require__(15);
              var asyncWrite =
                !process2.browser &&
                ["v0.10", "v0.9."].indexOf(process2.version.slice(0, 5)) > -1
                  ? setImmediate
                  : processNextTick;
              var Duplex;
              Writable.WritableState = WritableState;
              var util = __webpack_require__(18);
              util.inherits = __webpack_require__(12);
              var internalUtil = {
                deprecate: __webpack_require__(23),
              };
              var Stream;
              (function () {
                try {
                  Stream = __webpack_require__(11);
                } catch (_) {
                } finally {
                  if (!Stream) Stream = __webpack_require__(8).EventEmitter;
                }
              })();
              var Buffer2 = __webpack_require__(2).Buffer;
              var bufferShim = __webpack_require__(17);
              util.inherits(Writable, Stream);
              function nop() {}
              function WriteReq(chunk, encoding, cb) {
                this.chunk = chunk;
                this.encoding = encoding;
                this.callback = cb;
                this.next = null;
              }
              function WritableState(options, stream) {
                Duplex = Duplex || __webpack_require__(21);
                options = options || {};
                this.objectMode = !!options.objectMode;
                if (stream instanceof Duplex)
                  this.objectMode =
                    this.objectMode || !!options.writableObjectMode;
                var hwm = options.highWaterMark;
                var defaultHwm = this.objectMode ? 16 : 16 * 1024;
                this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
                this.highWaterMark = ~~this.highWaterMark;
                this.needDrain = false;
                this.ending = false;
                this.ended = false;
                this.finished = false;
                var noDecode = options.decodeStrings === false;
                this.decodeStrings = !noDecode;
                this.defaultEncoding = options.defaultEncoding || "utf8";
                this.length = 0;
                this.writing = false;
                this.corked = 0;
                this.sync = true;
                this.bufferProcessing = false;
                this.onwrite = function (er) {
                  onwrite(stream, er);
                };
                this.writecb = null;
                this.writelen = 0;
                this.bufferedRequest = null;
                this.lastBufferedRequest = null;
                this.pendingcb = 0;
                this.prefinished = false;
                this.errorEmitted = false;
                this.bufferedRequestCount = 0;
                this.corkedRequestsFree = new CorkedRequest(this);
              }
              WritableState.prototype.getBuffer = function getBuffer() {
                var current = this.bufferedRequest;
                var out = [];
                while (current) {
                  out.push(current);
                  current = current.next;
                }
                return out;
              };
              (function () {
                try {
                  Object.defineProperty(WritableState.prototype, "buffer", {
                    get: internalUtil.deprecate(function () {
                      return this.getBuffer();
                    }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead."),
                  });
                } catch (_) {}
              })();
              var realHasInstance;
              if (
                typeof Symbol === "function" &&
                Symbol.hasInstance &&
                typeof Function.prototype[Symbol.hasInstance] === "function"
              ) {
                realHasInstance = Function.prototype[Symbol.hasInstance];
                Object.defineProperty(Writable, Symbol.hasInstance, {
                  value: function (object) {
                    if (realHasInstance.call(this, object)) return true;
                    return (
                      object && object._writableState instanceof WritableState
                    );
                  },
                });
              } else {
                realHasInstance = function (object) {
                  return object instanceof this;
                };
              }
              function Writable(options) {
                Duplex = Duplex || __webpack_require__(21);
                if (
                  !realHasInstance.call(Writable, this) &&
                  !(this instanceof Duplex)
                ) {
                  return new Writable(options);
                }
                this._writableState = new WritableState(options, this);
                this.writable = true;
                if (options) {
                  if (typeof options.write === "function")
                    this._write = options.write;
                  if (typeof options.writev === "function")
                    this._writev = options.writev;
                }
                Stream.call(this);
              }
              Writable.prototype.pipe = function () {
                this.emit("error", new Error("Cannot pipe, not readable"));
              };
              function writeAfterEnd(stream, cb) {
                var er = new Error("write after end");
                stream.emit("error", er);
                processNextTick(cb, er);
              }
              function validChunk(stream, state, chunk, cb) {
                var valid = true;
                var er = false;
                if (chunk === null) {
                  er = new TypeError("May not write null values to stream");
                } else if (
                  typeof chunk !== "string" &&
                  chunk !== void 0 &&
                  !state.objectMode
                ) {
                  er = new TypeError("Invalid non-string/buffer chunk");
                }
                if (er) {
                  stream.emit("error", er);
                  processNextTick(cb, er);
                  valid = false;
                }
                return valid;
              }
              Writable.prototype.write = function (chunk, encoding, cb) {
                var state = this._writableState;
                var ret = false;
                var isBuf = Buffer2.isBuffer(chunk);
                if (typeof encoding === "function") {
                  cb = encoding;
                  encoding = null;
                }
                if (isBuf) encoding = "buffer";
                else if (!encoding) encoding = state.defaultEncoding;
                if (typeof cb !== "function") cb = nop;
                if (state.ended) writeAfterEnd(this, cb);
                else if (isBuf || validChunk(this, state, chunk, cb)) {
                  state.pendingcb++;
                  ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
                }
                return ret;
              };
              Writable.prototype.cork = function () {
                var state = this._writableState;
                state.corked++;
              };
              Writable.prototype.uncork = function () {
                var state = this._writableState;
                if (state.corked) {
                  state.corked--;
                  if (
                    !state.writing &&
                    !state.corked &&
                    !state.finished &&
                    !state.bufferProcessing &&
                    state.bufferedRequest
                  )
                    clearBuffer(this, state);
                }
              };
              Writable.prototype.setDefaultEncoding =
                function setDefaultEncoding(encoding) {
                  if (typeof encoding === "string")
                    encoding = encoding.toLowerCase();
                  if (
                    !(
                      [
                        "hex",
                        "utf8",
                        "utf-8",
                        "ascii",
                        "binary",
                        "base64",
                        "ucs2",
                        "ucs-2",
                        "utf16le",
                        "utf-16le",
                        "raw",
                      ].indexOf((encoding + "").toLowerCase()) > -1
                    )
                  )
                    throw new TypeError("Unknown encoding: " + encoding);
                  this._writableState.defaultEncoding = encoding;
                  return this;
                };
              function decodeChunk(state, chunk, encoding) {
                if (
                  !state.objectMode &&
                  state.decodeStrings !== false &&
                  typeof chunk === "string"
                ) {
                  chunk = bufferShim.from(chunk, encoding);
                }
                return chunk;
              }
              function writeOrBuffer(
                stream,
                state,
                isBuf,
                chunk,
                encoding,
                cb
              ) {
                if (!isBuf) {
                  chunk = decodeChunk(state, chunk, encoding);
                  if (Buffer2.isBuffer(chunk)) encoding = "buffer";
                }
                var len = state.objectMode ? 1 : chunk.length;
                state.length += len;
                var ret = state.length < state.highWaterMark;
                if (!ret) state.needDrain = true;
                if (state.writing || state.corked) {
                  var last = state.lastBufferedRequest;
                  state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
                  if (last) {
                    last.next = state.lastBufferedRequest;
                  } else {
                    state.bufferedRequest = state.lastBufferedRequest;
                  }
                  state.bufferedRequestCount += 1;
                } else {
                  doWrite(stream, state, false, len, chunk, encoding, cb);
                }
                return ret;
              }
              function doWrite(
                stream,
                state,
                writev,
                len,
                chunk,
                encoding,
                cb
              ) {
                state.writelen = len;
                state.writecb = cb;
                state.writing = true;
                state.sync = true;
                if (writev) stream._writev(chunk, state.onwrite);
                else stream._write(chunk, encoding, state.onwrite);
                state.sync = false;
              }
              function onwriteError(stream, state, sync, er, cb) {
                --state.pendingcb;
                if (sync) processNextTick(cb, er);
                else cb(er);
                stream._writableState.errorEmitted = true;
                stream.emit("error", er);
              }
              function onwriteStateUpdate(state) {
                state.writing = false;
                state.writecb = null;
                state.length -= state.writelen;
                state.writelen = 0;
              }
              function onwrite(stream, er) {
                var state = stream._writableState;
                var sync = state.sync;
                var cb = state.writecb;
                onwriteStateUpdate(state);
                if (er) onwriteError(stream, state, sync, er, cb);
                else {
                  var finished = needFinish(state);
                  if (
                    !finished &&
                    !state.corked &&
                    !state.bufferProcessing &&
                    state.bufferedRequest
                  ) {
                    clearBuffer(stream, state);
                  }
                  if (sync) {
                    asyncWrite(afterWrite, stream, state, finished, cb);
                  } else {
                    afterWrite(stream, state, finished, cb);
                  }
                }
              }
              function afterWrite(stream, state, finished, cb) {
                if (!finished) onwriteDrain(stream, state);
                state.pendingcb--;
                cb();
                finishMaybe(stream, state);
              }
              function onwriteDrain(stream, state) {
                if (state.length === 0 && state.needDrain) {
                  state.needDrain = false;
                  stream.emit("drain");
                }
              }
              function clearBuffer(stream, state) {
                state.bufferProcessing = true;
                var entry = state.bufferedRequest;
                if (stream._writev && entry && entry.next) {
                  var l = state.bufferedRequestCount;
                  var buffer = new Array(l);
                  var holder = state.corkedRequestsFree;
                  holder.entry = entry;
                  var count = 0;
                  while (entry) {
                    buffer[count] = entry;
                    entry = entry.next;
                    count += 1;
                  }
                  doWrite(
                    stream,
                    state,
                    true,
                    state.length,
                    buffer,
                    "",
                    holder.finish
                  );
                  state.pendingcb++;
                  state.lastBufferedRequest = null;
                  if (holder.next) {
                    state.corkedRequestsFree = holder.next;
                    holder.next = null;
                  } else {
                    state.corkedRequestsFree = new CorkedRequest(state);
                  }
                } else {
                  while (entry) {
                    var chunk = entry.chunk;
                    var encoding = entry.encoding;
                    var cb = entry.callback;
                    var len = state.objectMode ? 1 : chunk.length;
                    doWrite(stream, state, false, len, chunk, encoding, cb);
                    entry = entry.next;
                    if (state.writing) {
                      break;
                    }
                  }
                  if (entry === null) state.lastBufferedRequest = null;
                }
                state.bufferedRequestCount = 0;
                state.bufferedRequest = entry;
                state.bufferProcessing = false;
              }
              Writable.prototype._write = function (chunk, encoding, cb) {
                cb(new Error("_write() is not implemented"));
              };
              Writable.prototype._writev = null;
              Writable.prototype.end = function (chunk, encoding, cb) {
                var state = this._writableState;
                if (typeof chunk === "function") {
                  cb = chunk;
                  chunk = null;
                  encoding = null;
                } else if (typeof encoding === "function") {
                  cb = encoding;
                  encoding = null;
                }
                if (chunk !== null && chunk !== void 0)
                  this.write(chunk, encoding);
                if (state.corked) {
                  state.corked = 1;
                  this.uncork();
                }
                if (!state.ending && !state.finished)
                  endWritable(this, state, cb);
              };
              function needFinish(state) {
                return (
                  state.ending &&
                  state.length === 0 &&
                  state.bufferedRequest === null &&
                  !state.finished &&
                  !state.writing
                );
              }
              function prefinish(stream, state) {
                if (!state.prefinished) {
                  state.prefinished = true;
                  stream.emit("prefinish");
                }
              }
              function finishMaybe(stream, state) {
                var need = needFinish(state);
                if (need) {
                  if (state.pendingcb === 0) {
                    prefinish(stream, state);
                    state.finished = true;
                    stream.emit("finish");
                  } else {
                    prefinish(stream, state);
                  }
                }
                return need;
              }
              function endWritable(stream, state, cb) {
                state.ending = true;
                finishMaybe(stream, state);
                if (cb) {
                  if (state.finished) processNextTick(cb);
                  else stream.once("finish", cb);
                }
                state.ended = true;
                stream.writable = false;
              }
              function CorkedRequest(state) {
                var _this = this;
                this.next = null;
                this.entry = null;
                this.finish = function (err) {
                  var entry = _this.entry;
                  _this.entry = null;
                  while (entry) {
                    var cb = entry.callback;
                    state.pendingcb--;
                    cb(err);
                    entry = entry.next;
                  }
                  if (state.corkedRequestsFree) {
                    state.corkedRequestsFree.next = _this;
                  } else {
                    state.corkedRequestsFree = _this;
                  }
                };
              }
            }).call(exports3, __webpack_require__(6));
          },
          /* 23 */
          /***/
          function (module3, exports3) {
            (function (global2) {
              module3.exports = deprecate;
              function deprecate(fn, msg) {
                if (config("noDeprecation")) {
                  return fn;
                }
                var warned = false;
                function deprecated() {
                  if (!warned) {
                    if (config("throwDeprecation")) {
                      throw new Error(msg);
                    } else if (config("traceDeprecation")) {
                      console.trace(msg);
                    } else {
                      console.warn(msg);
                    }
                    warned = true;
                  }
                  return fn.apply(this, arguments);
                }
                return deprecated;
              }
              function config(name2) {
                try {
                  if (!global2.localStorage) return false;
                } catch (_) {
                  return false;
                }
                var val = global2.localStorage[name2];
                if (null == val) return false;
                return String(val).toLowerCase() === "true";
              }
            }).call(
              exports3,
              /* @__PURE__ */ (function () {
                return this;
              })()
            );
          },
          /* 24 */
          /***/
          function (module3, exports3, __webpack_require__) {
            var Buffer2 = __webpack_require__(2).Buffer;
            var isBufferEncoding =
              Buffer2.isEncoding ||
              function (encoding) {
                switch (encoding && encoding.toLowerCase()) {
                  case "hex":
                  case "utf8":
                  case "utf-8":
                  case "ascii":
                  case "binary":
                  case "base64":
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                  case "raw":
                    return true;
                  default:
                    return false;
                }
              };
            function assertEncoding(encoding) {
              if (encoding && !isBufferEncoding(encoding)) {
                throw new Error("Unknown encoding: " + encoding);
              }
            }
            var StringDecoder = (exports3.StringDecoder = function (encoding) {
              this.encoding = (encoding || "utf8")
                .toLowerCase()
                .replace(/[-_]/, "");
              assertEncoding(encoding);
              switch (this.encoding) {
                case "utf8":
                  this.surrogateSize = 3;
                  break;
                case "ucs2":
                case "utf16le":
                  this.surrogateSize = 2;
                  this.detectIncompleteChar = utf16DetectIncompleteChar;
                  break;
                case "base64":
                  this.surrogateSize = 3;
                  this.detectIncompleteChar = base64DetectIncompleteChar;
                  break;
                default:
                  this.write = passThroughWrite;
                  return;
              }
              this.charBuffer = new Buffer2(6);
              this.charReceived = 0;
              this.charLength = 0;
            });
            StringDecoder.prototype.write = function (buffer) {
              var charStr = "";
              while (this.charLength) {
                var available =
                  buffer.length >= this.charLength - this.charReceived
                    ? this.charLength - this.charReceived
                    : buffer.length;
                buffer.copy(this.charBuffer, this.charReceived, 0, available);
                this.charReceived += available;
                if (this.charReceived < this.charLength) {
                  return "";
                }
                buffer = buffer.slice(available, buffer.length);
                charStr = this.charBuffer
                  .slice(0, this.charLength)
                  .toString(this.encoding);
                var charCode = charStr.charCodeAt(charStr.length - 1);
                if (charCode >= 55296 && charCode <= 56319) {
                  this.charLength += this.surrogateSize;
                  charStr = "";
                  continue;
                }
                this.charReceived = this.charLength = 0;
                if (buffer.length === 0) {
                  return charStr;
                }
                break;
              }
              this.detectIncompleteChar(buffer);
              var end = buffer.length;
              if (this.charLength) {
                buffer.copy(
                  this.charBuffer,
                  0,
                  buffer.length - this.charReceived,
                  end
                );
                end -= this.charReceived;
              }
              charStr += buffer.toString(this.encoding, 0, end);
              var end = charStr.length - 1;
              var charCode = charStr.charCodeAt(end);
              if (charCode >= 55296 && charCode <= 56319) {
                var size = this.surrogateSize;
                this.charLength += size;
                this.charReceived += size;
                this.charBuffer.copy(this.charBuffer, size, 0, size);
                buffer.copy(this.charBuffer, 0, 0, size);
                return charStr.substring(0, end);
              }
              return charStr;
            };
            StringDecoder.prototype.detectIncompleteChar = function (buffer) {
              var i = buffer.length >= 3 ? 3 : buffer.length;
              for (; i > 0; i--) {
                var c = buffer[buffer.length - i];
                if (i == 1 && c >> 5 == 6) {
                  this.charLength = 2;
                  break;
                }
                if (i <= 2 && c >> 4 == 14) {
                  this.charLength = 3;
                  break;
                }
                if (i <= 3 && c >> 3 == 30) {
                  this.charLength = 4;
                  break;
                }
              }
              this.charReceived = i;
            };
            StringDecoder.prototype.end = function (buffer) {
              var res = "";
              if (buffer && buffer.length) res = this.write(buffer);
              if (this.charReceived) {
                var cr = this.charReceived;
                var buf = this.charBuffer;
                var enc = this.encoding;
                res += buf.slice(0, cr).toString(enc);
              }
              return res;
            };
            function passThroughWrite(buffer) {
              return buffer.toString(this.encoding);
            }
            function utf16DetectIncompleteChar(buffer) {
              this.charReceived = buffer.length % 2;
              this.charLength = this.charReceived ? 2 : 0;
            }
            function base64DetectIncompleteChar(buffer) {
              this.charReceived = buffer.length % 3;
              this.charLength = this.charReceived ? 3 : 0;
            }
          },
          /* 25 */
          /***/
          function (module3, exports3, __webpack_require__) {
            module3.exports = Transform;
            var Duplex = __webpack_require__(21);
            var util = __webpack_require__(18);
            util.inherits = __webpack_require__(12);
            util.inherits(Transform, Duplex);
            function TransformState(stream) {
              this.afterTransform = function (er, data) {
                return afterTransform(stream, er, data);
              };
              this.needTransform = false;
              this.transforming = false;
              this.writecb = null;
              this.writechunk = null;
              this.writeencoding = null;
            }
            function afterTransform(stream, er, data) {
              var ts = stream._transformState;
              ts.transforming = false;
              var cb = ts.writecb;
              if (!cb)
                return stream.emit(
                  "error",
                  new Error("no writecb in Transform class")
                );
              ts.writechunk = null;
              ts.writecb = null;
              if (data !== null && data !== void 0) stream.push(data);
              cb(er);
              var rs = stream._readableState;
              rs.reading = false;
              if (rs.needReadable || rs.length < rs.highWaterMark) {
                stream._read(rs.highWaterMark);
              }
            }
            function Transform(options) {
              if (!(this instanceof Transform)) return new Transform(options);
              Duplex.call(this, options);
              this._transformState = new TransformState(this);
              var stream = this;
              this._readableState.needReadable = true;
              this._readableState.sync = false;
              if (options) {
                if (typeof options.transform === "function")
                  this._transform = options.transform;
                if (typeof options.flush === "function")
                  this._flush = options.flush;
              }
              this.once("prefinish", function () {
                if (typeof this._flush === "function")
                  this._flush(function (er, data) {
                    done(stream, er, data);
                  });
                else done(stream);
              });
            }
            Transform.prototype.push = function (chunk, encoding) {
              this._transformState.needTransform = false;
              return Duplex.prototype.push.call(this, chunk, encoding);
            };
            Transform.prototype._transform = function (chunk, encoding, cb) {
              throw new Error("_transform() is not implemented");
            };
            Transform.prototype._write = function (chunk, encoding, cb) {
              var ts = this._transformState;
              ts.writecb = cb;
              ts.writechunk = chunk;
              ts.writeencoding = encoding;
              if (!ts.transforming) {
                var rs = this._readableState;
                if (
                  ts.needTransform ||
                  rs.needReadable ||
                  rs.length < rs.highWaterMark
                )
                  this._read(rs.highWaterMark);
              }
            };
            Transform.prototype._read = function (n) {
              var ts = this._transformState;
              if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
                ts.transforming = true;
                this._transform(
                  ts.writechunk,
                  ts.writeencoding,
                  ts.afterTransform
                );
              } else {
                ts.needTransform = true;
              }
            };
            function done(stream, er, data) {
              if (er) return stream.emit("error", er);
              if (data !== null && data !== void 0) stream.push(data);
              var ws = stream._writableState;
              var ts = stream._transformState;
              if (ws.length)
                throw new Error("Calling transform done when ws.length != 0");
              if (ts.transforming)
                throw new Error(
                  "Calling transform done when still transforming"
                );
              return stream.push(null);
            }
          },
          /* 26 */
          /***/
          function (module3, exports3, __webpack_require__) {
            module3.exports = PassThrough;
            var Transform = __webpack_require__(25);
            var util = __webpack_require__(18);
            util.inherits = __webpack_require__(12);
            util.inherits(PassThrough, Transform);
            function PassThrough(options) {
              if (!(this instanceof PassThrough))
                return new PassThrough(options);
              Transform.call(this, options);
            }
            PassThrough.prototype._transform = function (chunk, encoding, cb) {
              cb(null, chunk);
            };
          },
          /* 27 */
          /***/
          function (module3, exports3, __webpack_require__) {
            module3.exports = __webpack_require__(22);
          },
          /* 28 */
          /***/
          function (module3, exports3, __webpack_require__) {
            module3.exports = __webpack_require__(21);
          },
          /* 29 */
          /***/
          function (module3, exports3, __webpack_require__) {
            module3.exports = __webpack_require__(25);
          },
          /* 30 */
          /***/
          function (module3, exports3, __webpack_require__) {
            module3.exports = __webpack_require__(26);
          },
          /* 31 */
          /***/
          function (module3, exports3, __webpack_require__) {
            var zlib_inflate = __webpack_require__(32);
            var utils = __webpack_require__(33);
            var strings = __webpack_require__(38);
            var c = __webpack_require__(39);
            var msg = __webpack_require__(40);
            var ZStream = __webpack_require__(41);
            var GZheader = __webpack_require__(42);
            var toString = Object.prototype.toString;
            function Inflate(options) {
              if (!(this instanceof Inflate)) return new Inflate(options);
              this.options = utils.assign(
                {
                  chunkSize: 16384,
                  windowBits: 0,
                  to: "",
                },
                options || {}
              );
              var opt = this.options;
              if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
                opt.windowBits = -opt.windowBits;
                if (opt.windowBits === 0) {
                  opt.windowBits = -15;
                }
              }
              if (
                opt.windowBits >= 0 &&
                opt.windowBits < 16 &&
                !(options && options.windowBits)
              ) {
                opt.windowBits += 32;
              }
              if (opt.windowBits > 15 && opt.windowBits < 48) {
                if ((opt.windowBits & 15) === 0) {
                  opt.windowBits |= 15;
                }
              }
              this.err = 0;
              this.msg = "";
              this.ended = false;
              this.chunks = [];
              this.strm = new ZStream();
              this.strm.avail_out = 0;
              var status = zlib_inflate.inflateInit2(this.strm, opt.windowBits);
              if (status !== c.Z_OK) {
                throw new Error(msg[status]);
              }
              this.header = new GZheader();
              zlib_inflate.inflateGetHeader(this.strm, this.header);
            }
            Inflate.prototype.push = function (data, mode) {
              var strm = this.strm;
              var chunkSize = this.options.chunkSize;
              var dictionary = this.options.dictionary;
              var status, _mode;
              var next_out_utf8, tail, utf8str;
              var dict;
              var allowBufError = false;
              if (this.ended) {
                return false;
              }
              _mode =
                mode === ~~mode
                  ? mode
                  : mode === true
                  ? c.Z_FINISH
                  : c.Z_NO_FLUSH;
              if (typeof data === "string") {
                strm.input = strings.binstring2buf(data);
              } else if (toString.call(data) === "[object ArrayBuffer]") {
                strm.input = new Uint8Array(data);
              } else {
                strm.input = data;
              }
              strm.next_in = 0;
              strm.avail_in = strm.input.length;
              do {
                if (strm.avail_out === 0) {
                  strm.output = new utils.Buf8(chunkSize);
                  strm.next_out = 0;
                  strm.avail_out = chunkSize;
                }
                status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);
                if (status === c.Z_NEED_DICT && dictionary) {
                  if (typeof dictionary === "string") {
                    dict = strings.string2buf(dictionary);
                  } else if (
                    toString.call(dictionary) === "[object ArrayBuffer]"
                  ) {
                    dict = new Uint8Array(dictionary);
                  } else {
                    dict = dictionary;
                  }
                  status = zlib_inflate.inflateSetDictionary(this.strm, dict);
                }
                if (status === c.Z_BUF_ERROR && allowBufError === true) {
                  status = c.Z_OK;
                  allowBufError = false;
                }
                if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
                  this.onEnd(status);
                  this.ended = true;
                  return false;
                }
                if (strm.next_out) {
                  if (
                    strm.avail_out === 0 ||
                    status === c.Z_STREAM_END ||
                    (strm.avail_in === 0 &&
                      (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH))
                  ) {
                    if (this.options.to === "string") {
                      next_out_utf8 = strings.utf8border(
                        strm.output,
                        strm.next_out
                      );
                      tail = strm.next_out - next_out_utf8;
                      utf8str = strings.buf2string(strm.output, next_out_utf8);
                      strm.next_out = tail;
                      strm.avail_out = chunkSize - tail;
                      if (tail) {
                        utils.arraySet(
                          strm.output,
                          strm.output,
                          next_out_utf8,
                          tail,
                          0
                        );
                      }
                      this.onData(utf8str);
                    } else {
                      this.onData(utils.shrinkBuf(strm.output, strm.next_out));
                    }
                  }
                }
                if (strm.avail_in === 0 && strm.avail_out === 0) {
                  allowBufError = true;
                }
              } while (
                (strm.avail_in > 0 || strm.avail_out === 0) &&
                status !== c.Z_STREAM_END
              );
              if (status === c.Z_STREAM_END) {
                _mode = c.Z_FINISH;
              }
              if (_mode === c.Z_FINISH) {
                status = zlib_inflate.inflateEnd(this.strm);
                this.onEnd(status);
                this.ended = true;
                return status === c.Z_OK;
              }
              if (_mode === c.Z_SYNC_FLUSH) {
                this.onEnd(c.Z_OK);
                strm.avail_out = 0;
                return true;
              }
              return true;
            };
            Inflate.prototype.onData = function (chunk) {
              this.chunks.push(chunk);
            };
            Inflate.prototype.onEnd = function (status) {
              if (status === c.Z_OK) {
                if (this.options.to === "string") {
                  this.result = this.chunks.join("");
                } else {
                  this.result = utils.flattenChunks(this.chunks);
                }
              }
              this.chunks = [];
              this.err = status;
              this.msg = this.strm.msg;
            };
            function inflate(input, options) {
              var inflator = new Inflate(options);
              inflator.push(input, true);
              if (inflator.err) {
                throw inflator.msg || msg[inflator.err];
              }
              return inflator.result;
            }
            function inflateRaw(input, options) {
              options = options || {};
              options.raw = true;
              return inflate(input, options);
            }
            exports3.Inflate = Inflate;
            exports3.inflate = inflate;
            exports3.inflateRaw = inflateRaw;
            exports3.ungzip = inflate;
          },
          /* 32 */
          /***/
          function (module3, exports3, __webpack_require__) {
            var utils = __webpack_require__(33);
            var adler32 = __webpack_require__(34);
            var crc32 = __webpack_require__(35);
            var inflate_fast = __webpack_require__(36);
            var inflate_table = __webpack_require__(37);
            var CODES = 0;
            var LENS = 1;
            var DISTS = 2;
            var Z_FINISH = 4;
            var Z_BLOCK = 5;
            var Z_TREES = 6;
            var Z_OK = 0;
            var Z_STREAM_END = 1;
            var Z_NEED_DICT = 2;
            var Z_STREAM_ERROR = -2;
            var Z_DATA_ERROR = -3;
            var Z_MEM_ERROR = -4;
            var Z_BUF_ERROR = -5;
            var Z_DEFLATED = 8;
            var HEAD = 1;
            var FLAGS = 2;
            var TIME = 3;
            var OS = 4;
            var EXLEN = 5;
            var EXTRA = 6;
            var NAME = 7;
            var COMMENT = 8;
            var HCRC = 9;
            var DICTID = 10;
            var DICT = 11;
            var TYPE = 12;
            var TYPEDO = 13;
            var STORED = 14;
            var COPY_ = 15;
            var COPY = 16;
            var TABLE = 17;
            var LENLENS = 18;
            var CODELENS = 19;
            var LEN_ = 20;
            var LEN = 21;
            var LENEXT = 22;
            var DIST = 23;
            var DISTEXT = 24;
            var MATCH = 25;
            var LIT = 26;
            var CHECK = 27;
            var LENGTH = 28;
            var DONE = 29;
            var BAD = 30;
            var MEM = 31;
            var SYNC = 32;
            var ENOUGH_LENS = 852;
            var ENOUGH_DISTS = 592;
            var MAX_WBITS = 15;
            var DEF_WBITS = MAX_WBITS;
            function zswap32(q) {
              return (
                ((q >>> 24) & 255) +
                ((q >>> 8) & 65280) +
                ((q & 65280) << 8) +
                ((q & 255) << 24)
              );
            }
            function InflateState() {
              this.mode = 0;
              this.last = false;
              this.wrap = 0;
              this.havedict = false;
              this.flags = 0;
              this.dmax = 0;
              this.check = 0;
              this.total = 0;
              this.head = null;
              this.wbits = 0;
              this.wsize = 0;
              this.whave = 0;
              this.wnext = 0;
              this.window = null;
              this.hold = 0;
              this.bits = 0;
              this.length = 0;
              this.offset = 0;
              this.extra = 0;
              this.lencode = null;
              this.distcode = null;
              this.lenbits = 0;
              this.distbits = 0;
              this.ncode = 0;
              this.nlen = 0;
              this.ndist = 0;
              this.have = 0;
              this.next = null;
              this.lens = new utils.Buf16(320);
              this.work = new utils.Buf16(288);
              this.lendyn = null;
              this.distdyn = null;
              this.sane = 0;
              this.back = 0;
              this.was = 0;
            }
            function inflateResetKeep(strm) {
              var state;
              if (!strm || !strm.state) {
                return Z_STREAM_ERROR;
              }
              state = strm.state;
              strm.total_in = strm.total_out = state.total = 0;
              strm.msg = "";
              if (state.wrap) {
                strm.adler = state.wrap & 1;
              }
              state.mode = HEAD;
              state.last = 0;
              state.havedict = 0;
              state.dmax = 32768;
              state.head = null;
              state.hold = 0;
              state.bits = 0;
              state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
              state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
              state.sane = 1;
              state.back = -1;
              return Z_OK;
            }
            function inflateReset(strm) {
              var state;
              if (!strm || !strm.state) {
                return Z_STREAM_ERROR;
              }
              state = strm.state;
              state.wsize = 0;
              state.whave = 0;
              state.wnext = 0;
              return inflateResetKeep(strm);
            }
            function inflateReset2(strm, windowBits) {
              var wrap;
              var state;
              if (!strm || !strm.state) {
                return Z_STREAM_ERROR;
              }
              state = strm.state;
              if (windowBits < 0) {
                wrap = 0;
                windowBits = -windowBits;
              } else {
                wrap = (windowBits >> 4) + 1;
                if (windowBits < 48) {
                  windowBits &= 15;
                }
              }
              if (windowBits && (windowBits < 8 || windowBits > 15)) {
                return Z_STREAM_ERROR;
              }
              if (state.window !== null && state.wbits !== windowBits) {
                state.window = null;
              }
              state.wrap = wrap;
              state.wbits = windowBits;
              return inflateReset(strm);
            }
            function inflateInit2(strm, windowBits) {
              var ret;
              var state;
              if (!strm) {
                return Z_STREAM_ERROR;
              }
              state = new InflateState();
              strm.state = state;
              state.window = null;
              ret = inflateReset2(strm, windowBits);
              if (ret !== Z_OK) {
                strm.state = null;
              }
              return ret;
            }
            function inflateInit(strm) {
              return inflateInit2(strm, DEF_WBITS);
            }
            var virgin = true;
            var lenfix, distfix;
            function fixedtables(state) {
              if (virgin) {
                var sym;
                lenfix = new utils.Buf32(512);
                distfix = new utils.Buf32(32);
                sym = 0;
                while (sym < 144) {
                  state.lens[sym++] = 8;
                }
                while (sym < 256) {
                  state.lens[sym++] = 9;
                }
                while (sym < 280) {
                  state.lens[sym++] = 7;
                }
                while (sym < 288) {
                  state.lens[sym++] = 8;
                }
                inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, {
                  bits: 9,
                });
                sym = 0;
                while (sym < 32) {
                  state.lens[sym++] = 5;
                }
                inflate_table(
                  DISTS,
                  state.lens,
                  0,
                  32,
                  distfix,
                  0,
                  state.work,
                  { bits: 5 }
                );
                virgin = false;
              }
              state.lencode = lenfix;
              state.lenbits = 9;
              state.distcode = distfix;
              state.distbits = 5;
            }
            function updatewindow(strm, src, end, copy) {
              var dist;
              var state = strm.state;
              if (state.window === null) {
                state.wsize = 1 << state.wbits;
                state.wnext = 0;
                state.whave = 0;
                state.window = new utils.Buf8(state.wsize);
              }
              if (copy >= state.wsize) {
                utils.arraySet(
                  state.window,
                  src,
                  end - state.wsize,
                  state.wsize,
                  0
                );
                state.wnext = 0;
                state.whave = state.wsize;
              } else {
                dist = state.wsize - state.wnext;
                if (dist > copy) {
                  dist = copy;
                }
                utils.arraySet(
                  state.window,
                  src,
                  end - copy,
                  dist,
                  state.wnext
                );
                copy -= dist;
                if (copy) {
                  utils.arraySet(state.window, src, end - copy, copy, 0);
                  state.wnext = copy;
                  state.whave = state.wsize;
                } else {
                  state.wnext += dist;
                  if (state.wnext === state.wsize) {
                    state.wnext = 0;
                  }
                  if (state.whave < state.wsize) {
                    state.whave += dist;
                  }
                }
              }
              return 0;
            }
            function inflate(strm, flush) {
              var state;
              var input, output;
              var next;
              var put;
              var have, left;
              var hold;
              var bits;
              var _in, _out;
              var copy;
              var from;
              var from_source;
              var here = 0;
              var here_bits, here_op, here_val;
              var last_bits, last_op, last_val;
              var len;
              var ret;
              var hbuf = new utils.Buf8(4);
              var opts;
              var n;
              var order =
                /* permutation of code lengths */
                [
                  16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1,
                  15,
                ];
              if (
                !strm ||
                !strm.state ||
                !strm.output ||
                (!strm.input && strm.avail_in !== 0)
              ) {
                return Z_STREAM_ERROR;
              }
              state = strm.state;
              if (state.mode === TYPE) {
                state.mode = TYPEDO;
              }
              put = strm.next_out;
              output = strm.output;
              left = strm.avail_out;
              next = strm.next_in;
              input = strm.input;
              have = strm.avail_in;
              hold = state.hold;
              bits = state.bits;
              _in = have;
              _out = left;
              ret = Z_OK;
              inf_leave: for (;;) {
                switch (state.mode) {
                  case HEAD:
                    if (state.wrap === 0) {
                      state.mode = TYPEDO;
                      break;
                    }
                    while (bits < 16) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    if (state.wrap & 2 && hold === 35615) {
                      state.check = 0;
                      hbuf[0] = hold & 255;
                      hbuf[1] = (hold >>> 8) & 255;
                      state.check = crc32(state.check, hbuf, 2, 0);
                      hold = 0;
                      bits = 0;
                      state.mode = FLAGS;
                      break;
                    }
                    state.flags = 0;
                    if (state.head) {
                      state.head.done = false;
                    }
                    if (
                      !(state.wrap & 1) /* check if zlib header allowed */ ||
                      (((hold & 255) << 8) + (hold >> 8)) % 31
                    ) {
                      strm.msg = "incorrect header check";
                      state.mode = BAD;
                      break;
                    }
                    if ((hold & 15) !== Z_DEFLATED) {
                      strm.msg = "unknown compression method";
                      state.mode = BAD;
                      break;
                    }
                    hold >>>= 4;
                    bits -= 4;
                    len = (hold & 15) + 8;
                    if (state.wbits === 0) {
                      state.wbits = len;
                    } else if (len > state.wbits) {
                      strm.msg = "invalid window size";
                      state.mode = BAD;
                      break;
                    }
                    state.dmax = 1 << len;
                    strm.adler = state.check = 1;
                    state.mode = hold & 512 ? DICTID : TYPE;
                    hold = 0;
                    bits = 0;
                    break;
                  case FLAGS:
                    while (bits < 16) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    state.flags = hold;
                    if ((state.flags & 255) !== Z_DEFLATED) {
                      strm.msg = "unknown compression method";
                      state.mode = BAD;
                      break;
                    }
                    if (state.flags & 57344) {
                      strm.msg = "unknown header flags set";
                      state.mode = BAD;
                      break;
                    }
                    if (state.head) {
                      state.head.text = (hold >> 8) & 1;
                    }
                    if (state.flags & 512) {
                      hbuf[0] = hold & 255;
                      hbuf[1] = (hold >>> 8) & 255;
                      state.check = crc32(state.check, hbuf, 2, 0);
                    }
                    hold = 0;
                    bits = 0;
                    state.mode = TIME;
                  case TIME:
                    while (bits < 32) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    if (state.head) {
                      state.head.time = hold;
                    }
                    if (state.flags & 512) {
                      hbuf[0] = hold & 255;
                      hbuf[1] = (hold >>> 8) & 255;
                      hbuf[2] = (hold >>> 16) & 255;
                      hbuf[3] = (hold >>> 24) & 255;
                      state.check = crc32(state.check, hbuf, 4, 0);
                    }
                    hold = 0;
                    bits = 0;
                    state.mode = OS;
                  case OS:
                    while (bits < 16) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    if (state.head) {
                      state.head.xflags = hold & 255;
                      state.head.os = hold >> 8;
                    }
                    if (state.flags & 512) {
                      hbuf[0] = hold & 255;
                      hbuf[1] = (hold >>> 8) & 255;
                      state.check = crc32(state.check, hbuf, 2, 0);
                    }
                    hold = 0;
                    bits = 0;
                    state.mode = EXLEN;
                  case EXLEN:
                    if (state.flags & 1024) {
                      while (bits < 16) {
                        if (have === 0) {
                          break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                      }
                      state.length = hold;
                      if (state.head) {
                        state.head.extra_len = hold;
                      }
                      if (state.flags & 512) {
                        hbuf[0] = hold & 255;
                        hbuf[1] = (hold >>> 8) & 255;
                        state.check = crc32(state.check, hbuf, 2, 0);
                      }
                      hold = 0;
                      bits = 0;
                    } else if (state.head) {
                      state.head.extra = null;
                    }
                    state.mode = EXTRA;
                  case EXTRA:
                    if (state.flags & 1024) {
                      copy = state.length;
                      if (copy > have) {
                        copy = have;
                      }
                      if (copy) {
                        if (state.head) {
                          len = state.head.extra_len - state.length;
                          if (!state.head.extra) {
                            state.head.extra = new Array(state.head.extra_len);
                          }
                          utils.arraySet(
                            state.head.extra,
                            input,
                            next,
                            // extra field is limited to 65536 bytes
                            // - no need for additional size check
                            copy,
                            /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                            len
                          );
                        }
                        if (state.flags & 512) {
                          state.check = crc32(state.check, input, copy, next);
                        }
                        have -= copy;
                        next += copy;
                        state.length -= copy;
                      }
                      if (state.length) {
                        break inf_leave;
                      }
                    }
                    state.length = 0;
                    state.mode = NAME;
                  case NAME:
                    if (state.flags & 2048) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      copy = 0;
                      do {
                        len = input[next + copy++];
                        if (state.head && len && state.length < 65536) {
                          state.head.name += String.fromCharCode(len);
                        }
                      } while (len && copy < have);
                      if (state.flags & 512) {
                        state.check = crc32(state.check, input, copy, next);
                      }
                      have -= copy;
                      next += copy;
                      if (len) {
                        break inf_leave;
                      }
                    } else if (state.head) {
                      state.head.name = null;
                    }
                    state.length = 0;
                    state.mode = COMMENT;
                  case COMMENT:
                    if (state.flags & 4096) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      copy = 0;
                      do {
                        len = input[next + copy++];
                        if (state.head && len && state.length < 65536) {
                          state.head.comment += String.fromCharCode(len);
                        }
                      } while (len && copy < have);
                      if (state.flags & 512) {
                        state.check = crc32(state.check, input, copy, next);
                      }
                      have -= copy;
                      next += copy;
                      if (len) {
                        break inf_leave;
                      }
                    } else if (state.head) {
                      state.head.comment = null;
                    }
                    state.mode = HCRC;
                  case HCRC:
                    if (state.flags & 512) {
                      while (bits < 16) {
                        if (have === 0) {
                          break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                      }
                      if (hold !== (state.check & 65535)) {
                        strm.msg = "header crc mismatch";
                        state.mode = BAD;
                        break;
                      }
                      hold = 0;
                      bits = 0;
                    }
                    if (state.head) {
                      state.head.hcrc = (state.flags >> 9) & 1;
                      state.head.done = true;
                    }
                    strm.adler = state.check = 0;
                    state.mode = TYPE;
                    break;
                  case DICTID:
                    while (bits < 32) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    strm.adler = state.check = zswap32(hold);
                    hold = 0;
                    bits = 0;
                    state.mode = DICT;
                  case DICT:
                    if (state.havedict === 0) {
                      strm.next_out = put;
                      strm.avail_out = left;
                      strm.next_in = next;
                      strm.avail_in = have;
                      state.hold = hold;
                      state.bits = bits;
                      return Z_NEED_DICT;
                    }
                    strm.adler = state.check = 1;
                    state.mode = TYPE;
                  case TYPE:
                    if (flush === Z_BLOCK || flush === Z_TREES) {
                      break inf_leave;
                    }
                  case TYPEDO:
                    if (state.last) {
                      hold >>>= bits & 7;
                      bits -= bits & 7;
                      state.mode = CHECK;
                      break;
                    }
                    while (bits < 3) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    state.last = hold & 1;
                    hold >>>= 1;
                    bits -= 1;
                    switch (hold & 3) {
                      case 0:
                        state.mode = STORED;
                        break;
                      case 1:
                        fixedtables(state);
                        state.mode = LEN_;
                        if (flush === Z_TREES) {
                          hold >>>= 2;
                          bits -= 2;
                          break inf_leave;
                        }
                        break;
                      case 2:
                        state.mode = TABLE;
                        break;
                      case 3:
                        strm.msg = "invalid block type";
                        state.mode = BAD;
                    }
                    hold >>>= 2;
                    bits -= 2;
                    break;
                  case STORED:
                    hold >>>= bits & 7;
                    bits -= bits & 7;
                    while (bits < 32) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    if ((hold & 65535) !== ((hold >>> 16) ^ 65535)) {
                      strm.msg = "invalid stored block lengths";
                      state.mode = BAD;
                      break;
                    }
                    state.length = hold & 65535;
                    hold = 0;
                    bits = 0;
                    state.mode = COPY_;
                    if (flush === Z_TREES) {
                      break inf_leave;
                    }
                  case COPY_:
                    state.mode = COPY;
                  case COPY:
                    copy = state.length;
                    if (copy) {
                      if (copy > have) {
                        copy = have;
                      }
                      if (copy > left) {
                        copy = left;
                      }
                      if (copy === 0) {
                        break inf_leave;
                      }
                      utils.arraySet(output, input, next, copy, put);
                      have -= copy;
                      next += copy;
                      left -= copy;
                      put += copy;
                      state.length -= copy;
                      break;
                    }
                    state.mode = TYPE;
                    break;
                  case TABLE:
                    while (bits < 14) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    state.nlen = (hold & 31) + 257;
                    hold >>>= 5;
                    bits -= 5;
                    state.ndist = (hold & 31) + 1;
                    hold >>>= 5;
                    bits -= 5;
                    state.ncode = (hold & 15) + 4;
                    hold >>>= 4;
                    bits -= 4;
                    if (state.nlen > 286 || state.ndist > 30) {
                      strm.msg = "too many length or distance symbols";
                      state.mode = BAD;
                      break;
                    }
                    state.have = 0;
                    state.mode = LENLENS;
                  case LENLENS:
                    while (state.have < state.ncode) {
                      while (bits < 3) {
                        if (have === 0) {
                          break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                      }
                      state.lens[order[state.have++]] = hold & 7;
                      hold >>>= 3;
                      bits -= 3;
                    }
                    while (state.have < 19) {
                      state.lens[order[state.have++]] = 0;
                    }
                    state.lencode = state.lendyn;
                    state.lenbits = 7;
                    opts = { bits: state.lenbits };
                    ret = inflate_table(
                      CODES,
                      state.lens,
                      0,
                      19,
                      state.lencode,
                      0,
                      state.work,
                      opts
                    );
                    state.lenbits = opts.bits;
                    if (ret) {
                      strm.msg = "invalid code lengths set";
                      state.mode = BAD;
                      break;
                    }
                    state.have = 0;
                    state.mode = CODELENS;
                  case CODELENS:
                    while (state.have < state.nlen + state.ndist) {
                      for (;;) {
                        here = state.lencode[hold & ((1 << state.lenbits) - 1)];
                        here_bits = here >>> 24;
                        here_op = (here >>> 16) & 255;
                        here_val = here & 65535;
                        if (here_bits <= bits) {
                          break;
                        }
                        if (have === 0) {
                          break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                      }
                      if (here_val < 16) {
                        hold >>>= here_bits;
                        bits -= here_bits;
                        state.lens[state.have++] = here_val;
                      } else {
                        if (here_val === 16) {
                          n = here_bits + 2;
                          while (bits < n) {
                            if (have === 0) {
                              break inf_leave;
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                          }
                          hold >>>= here_bits;
                          bits -= here_bits;
                          if (state.have === 0) {
                            strm.msg = "invalid bit length repeat";
                            state.mode = BAD;
                            break;
                          }
                          len = state.lens[state.have - 1];
                          copy = 3 + (hold & 3);
                          hold >>>= 2;
                          bits -= 2;
                        } else if (here_val === 17) {
                          n = here_bits + 3;
                          while (bits < n) {
                            if (have === 0) {
                              break inf_leave;
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                          }
                          hold >>>= here_bits;
                          bits -= here_bits;
                          len = 0;
                          copy = 3 + (hold & 7);
                          hold >>>= 3;
                          bits -= 3;
                        } else {
                          n = here_bits + 7;
                          while (bits < n) {
                            if (have === 0) {
                              break inf_leave;
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                          }
                          hold >>>= here_bits;
                          bits -= here_bits;
                          len = 0;
                          copy = 11 + (hold & 127);
                          hold >>>= 7;
                          bits -= 7;
                        }
                        if (state.have + copy > state.nlen + state.ndist) {
                          strm.msg = "invalid bit length repeat";
                          state.mode = BAD;
                          break;
                        }
                        while (copy--) {
                          state.lens[state.have++] = len;
                        }
                      }
                    }
                    if (state.mode === BAD) {
                      break;
                    }
                    if (state.lens[256] === 0) {
                      strm.msg = "invalid code -- missing end-of-block";
                      state.mode = BAD;
                      break;
                    }
                    state.lenbits = 9;
                    opts = { bits: state.lenbits };
                    ret = inflate_table(
                      LENS,
                      state.lens,
                      0,
                      state.nlen,
                      state.lencode,
                      0,
                      state.work,
                      opts
                    );
                    state.lenbits = opts.bits;
                    if (ret) {
                      strm.msg = "invalid literal/lengths set";
                      state.mode = BAD;
                      break;
                    }
                    state.distbits = 6;
                    state.distcode = state.distdyn;
                    opts = { bits: state.distbits };
                    ret = inflate_table(
                      DISTS,
                      state.lens,
                      state.nlen,
                      state.ndist,
                      state.distcode,
                      0,
                      state.work,
                      opts
                    );
                    state.distbits = opts.bits;
                    if (ret) {
                      strm.msg = "invalid distances set";
                      state.mode = BAD;
                      break;
                    }
                    state.mode = LEN_;
                    if (flush === Z_TREES) {
                      break inf_leave;
                    }
                  case LEN_:
                    state.mode = LEN;
                  case LEN:
                    if (have >= 6 && left >= 258) {
                      strm.next_out = put;
                      strm.avail_out = left;
                      strm.next_in = next;
                      strm.avail_in = have;
                      state.hold = hold;
                      state.bits = bits;
                      inflate_fast(strm, _out);
                      put = strm.next_out;
                      output = strm.output;
                      left = strm.avail_out;
                      next = strm.next_in;
                      input = strm.input;
                      have = strm.avail_in;
                      hold = state.hold;
                      bits = state.bits;
                      if (state.mode === TYPE) {
                        state.back = -1;
                      }
                      break;
                    }
                    state.back = 0;
                    for (;;) {
                      here = state.lencode[hold & ((1 << state.lenbits) - 1)];
                      here_bits = here >>> 24;
                      here_op = (here >>> 16) & 255;
                      here_val = here & 65535;
                      if (here_bits <= bits) {
                        break;
                      }
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    if (here_op && (here_op & 240) === 0) {
                      last_bits = here_bits;
                      last_op = here_op;
                      last_val = here_val;
                      for (;;) {
                        here =
                          state.lencode[
                            last_val +
                              ((hold & ((1 << (last_bits + last_op)) - 1)) >>
                                last_bits)
                          ];
                        here_bits = here >>> 24;
                        here_op = (here >>> 16) & 255;
                        here_val = here & 65535;
                        if (last_bits + here_bits <= bits) {
                          break;
                        }
                        if (have === 0) {
                          break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                      }
                      hold >>>= last_bits;
                      bits -= last_bits;
                      state.back += last_bits;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    state.back += here_bits;
                    state.length = here_val;
                    if (here_op === 0) {
                      state.mode = LIT;
                      break;
                    }
                    if (here_op & 32) {
                      state.back = -1;
                      state.mode = TYPE;
                      break;
                    }
                    if (here_op & 64) {
                      strm.msg = "invalid literal/length code";
                      state.mode = BAD;
                      break;
                    }
                    state.extra = here_op & 15;
                    state.mode = LENEXT;
                  case LENEXT:
                    if (state.extra) {
                      n = state.extra;
                      while (bits < n) {
                        if (have === 0) {
                          break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                      }
                      state.length += hold & ((1 << state.extra) - 1);
                      hold >>>= state.extra;
                      bits -= state.extra;
                      state.back += state.extra;
                    }
                    state.was = state.length;
                    state.mode = DIST;
                  case DIST:
                    for (;;) {
                      here = state.distcode[hold & ((1 << state.distbits) - 1)];
                      here_bits = here >>> 24;
                      here_op = (here >>> 16) & 255;
                      here_val = here & 65535;
                      if (here_bits <= bits) {
                        break;
                      }
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    if ((here_op & 240) === 0) {
                      last_bits = here_bits;
                      last_op = here_op;
                      last_val = here_val;
                      for (;;) {
                        here =
                          state.distcode[
                            last_val +
                              ((hold & ((1 << (last_bits + last_op)) - 1)) >>
                                last_bits)
                          ];
                        here_bits = here >>> 24;
                        here_op = (here >>> 16) & 255;
                        here_val = here & 65535;
                        if (last_bits + here_bits <= bits) {
                          break;
                        }
                        if (have === 0) {
                          break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                      }
                      hold >>>= last_bits;
                      bits -= last_bits;
                      state.back += last_bits;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    state.back += here_bits;
                    if (here_op & 64) {
                      strm.msg = "invalid distance code";
                      state.mode = BAD;
                      break;
                    }
                    state.offset = here_val;
                    state.extra = here_op & 15;
                    state.mode = DISTEXT;
                  case DISTEXT:
                    if (state.extra) {
                      n = state.extra;
                      while (bits < n) {
                        if (have === 0) {
                          break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                      }
                      state.offset += hold & ((1 << state.extra) - 1);
                      hold >>>= state.extra;
                      bits -= state.extra;
                      state.back += state.extra;
                    }
                    if (state.offset > state.dmax) {
                      strm.msg = "invalid distance too far back";
                      state.mode = BAD;
                      break;
                    }
                    state.mode = MATCH;
                  case MATCH:
                    if (left === 0) {
                      break inf_leave;
                    }
                    copy = _out - left;
                    if (state.offset > copy) {
                      copy = state.offset - copy;
                      if (copy > state.whave) {
                        if (state.sane) {
                          strm.msg = "invalid distance too far back";
                          state.mode = BAD;
                          break;
                        }
                      }
                      if (copy > state.wnext) {
                        copy -= state.wnext;
                        from = state.wsize - copy;
                      } else {
                        from = state.wnext - copy;
                      }
                      if (copy > state.length) {
                        copy = state.length;
                      }
                      from_source = state.window;
                    } else {
                      from_source = output;
                      from = put - state.offset;
                      copy = state.length;
                    }
                    if (copy > left) {
                      copy = left;
                    }
                    left -= copy;
                    state.length -= copy;
                    do {
                      output[put++] = from_source[from++];
                    } while (--copy);
                    if (state.length === 0) {
                      state.mode = LEN;
                    }
                    break;
                  case LIT:
                    if (left === 0) {
                      break inf_leave;
                    }
                    output[put++] = state.length;
                    left--;
                    state.mode = LEN;
                    break;
                  case CHECK:
                    if (state.wrap) {
                      while (bits < 32) {
                        if (have === 0) {
                          break inf_leave;
                        }
                        have--;
                        hold |= input[next++] << bits;
                        bits += 8;
                      }
                      _out -= left;
                      strm.total_out += _out;
                      state.total += _out;
                      if (_out) {
                        strm.adler = state.check =
                          /*UPDATE(state.check, put - _out, _out);*/
                          state.flags
                            ? crc32(state.check, output, _out, put - _out)
                            : adler32(state.check, output, _out, put - _out);
                      }
                      _out = left;
                      if (
                        (state.flags ? hold : zswap32(hold)) !== state.check
                      ) {
                        strm.msg = "incorrect data check";
                        state.mode = BAD;
                        break;
                      }
                      hold = 0;
                      bits = 0;
                    }
                    state.mode = LENGTH;
                  case LENGTH:
                    if (state.wrap && state.flags) {
                      while (bits < 32) {
                        if (have === 0) {
                          break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                      }
                      if (hold !== (state.total & 4294967295)) {
                        strm.msg = "incorrect length check";
                        state.mode = BAD;
                        break;
                      }
                      hold = 0;
                      bits = 0;
                    }
                    state.mode = DONE;
                  case DONE:
                    ret = Z_STREAM_END;
                    break inf_leave;
                  case BAD:
                    ret = Z_DATA_ERROR;
                    break inf_leave;
                  case MEM:
                    return Z_MEM_ERROR;
                  case SYNC:
                  default:
                    return Z_STREAM_ERROR;
                }
              }
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              if (
                state.wsize ||
                (_out !== strm.avail_out &&
                  state.mode < BAD &&
                  (state.mode < CHECK || flush !== Z_FINISH))
              ) {
                if (
                  updatewindow(
                    strm,
                    strm.output,
                    strm.next_out,
                    _out - strm.avail_out
                  )
                );
              }
              _in -= strm.avail_in;
              _out -= strm.avail_out;
              strm.total_in += _in;
              strm.total_out += _out;
              state.total += _out;
              if (state.wrap && _out) {
                strm.adler = state.check =
                  /*UPDATE(state.check, strm.next_out - _out, _out);*/
                  state.flags
                    ? crc32(state.check, output, _out, strm.next_out - _out)
                    : adler32(state.check, output, _out, strm.next_out - _out);
              }
              strm.data_type =
                state.bits +
                (state.last ? 64 : 0) +
                (state.mode === TYPE ? 128 : 0) +
                (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
              if (
                ((_in === 0 && _out === 0) || flush === Z_FINISH) &&
                ret === Z_OK
              ) {
                ret = Z_BUF_ERROR;
              }
              return ret;
            }
            function inflateEnd(strm) {
              if (!strm || !strm.state) {
                return Z_STREAM_ERROR;
              }
              var state = strm.state;
              if (state.window) {
                state.window = null;
              }
              strm.state = null;
              return Z_OK;
            }
            function inflateGetHeader(strm, head) {
              var state;
              if (!strm || !strm.state) {
                return Z_STREAM_ERROR;
              }
              state = strm.state;
              if ((state.wrap & 2) === 0) {
                return Z_STREAM_ERROR;
              }
              state.head = head;
              head.done = false;
              return Z_OK;
            }
            function inflateSetDictionary(strm, dictionary) {
              var dictLength = dictionary.length;
              var state;
              var dictid;
              var ret;
              if (!strm || !strm.state) {
                return Z_STREAM_ERROR;
              }
              state = strm.state;
              if (state.wrap !== 0 && state.mode !== DICT) {
                return Z_STREAM_ERROR;
              }
              if (state.mode === DICT) {
                dictid = 1;
                dictid = adler32(dictid, dictionary, dictLength, 0);
                if (dictid !== state.check) {
                  return Z_DATA_ERROR;
                }
              }
              ret = updatewindow(strm, dictionary, dictLength, dictLength);
              if (ret) {
                state.mode = MEM;
                return Z_MEM_ERROR;
              }
              state.havedict = 1;
              return Z_OK;
            }
            exports3.inflateReset = inflateReset;
            exports3.inflateReset2 = inflateReset2;
            exports3.inflateResetKeep = inflateResetKeep;
            exports3.inflateInit = inflateInit;
            exports3.inflateInit2 = inflateInit2;
            exports3.inflate = inflate;
            exports3.inflateEnd = inflateEnd;
            exports3.inflateGetHeader = inflateGetHeader;
            exports3.inflateSetDictionary = inflateSetDictionary;
            exports3.inflateInfo = "pako inflate (from Nodeca project)";
          },
          /* 33 */
          /***/
          function (module3, exports3) {
            var TYPED_OK =
              typeof Uint8Array !== "undefined" &&
              typeof Uint16Array !== "undefined" &&
              typeof Int32Array !== "undefined";
            exports3.assign = function (obj) {
              var sources = Array.prototype.slice.call(arguments, 1);
              while (sources.length) {
                var source = sources.shift();
                if (!source) {
                  continue;
                }
                if (typeof source !== "object") {
                  throw new TypeError(source + "must be non-object");
                }
                for (var p in source) {
                  if (source.hasOwnProperty(p)) {
                    obj[p] = source[p];
                  }
                }
              }
              return obj;
            };
            exports3.shrinkBuf = function (buf, size) {
              if (buf.length === size) {
                return buf;
              }
              if (buf.subarray) {
                return buf.subarray(0, size);
              }
              buf.length = size;
              return buf;
            };
            var fnTyped = {
              arraySet: function (dest, src, src_offs, len, dest_offs) {
                if (src.subarray && dest.subarray) {
                  dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
                  return;
                }
                for (var i = 0; i < len; i++) {
                  dest[dest_offs + i] = src[src_offs + i];
                }
              },
              // Join array of chunks to single array.
              flattenChunks: function (chunks) {
                var i, l, len, pos, chunk, result;
                len = 0;
                for (i = 0, l = chunks.length; i < l; i++) {
                  len += chunks[i].length;
                }
                result = new Uint8Array(len);
                pos = 0;
                for (i = 0, l = chunks.length; i < l; i++) {
                  chunk = chunks[i];
                  result.set(chunk, pos);
                  pos += chunk.length;
                }
                return result;
              },
            };
            var fnUntyped = {
              arraySet: function (dest, src, src_offs, len, dest_offs) {
                for (var i = 0; i < len; i++) {
                  dest[dest_offs + i] = src[src_offs + i];
                }
              },
              // Join array of chunks to single array.
              flattenChunks: function (chunks) {
                return [].concat.apply([], chunks);
              },
            };
            exports3.setTyped = function (on) {
              if (on) {
                exports3.Buf8 = Uint8Array;
                exports3.Buf16 = Uint16Array;
                exports3.Buf32 = Int32Array;
                exports3.assign(exports3, fnTyped);
              } else {
                exports3.Buf8 = Array;
                exports3.Buf16 = Array;
                exports3.Buf32 = Array;
                exports3.assign(exports3, fnUntyped);
              }
            };
            exports3.setTyped(TYPED_OK);
          },
          /* 34 */
          /***/
          function (module3, exports3) {
            function adler32(adler, buf, len, pos) {
              var s1 = (adler & 65535) | 0,
                s2 = ((adler >>> 16) & 65535) | 0,
                n = 0;
              while (len !== 0) {
                n = len > 2e3 ? 2e3 : len;
                len -= n;
                do {
                  s1 = (s1 + buf[pos++]) | 0;
                  s2 = (s2 + s1) | 0;
                } while (--n);
                s1 %= 65521;
                s2 %= 65521;
              }
              return s1 | (s2 << 16) | 0;
            }
            module3.exports = adler32;
          },
          /* 35 */
          /***/
          function (module3, exports3) {
            function makeTable() {
              var c,
                table = [];
              for (var n = 0; n < 256; n++) {
                c = n;
                for (var k = 0; k < 8; k++) {
                  c = c & 1 ? 3988292384 ^ (c >>> 1) : c >>> 1;
                }
                table[n] = c;
              }
              return table;
            }
            var crcTable = makeTable();
            function crc32(crc, buf, len, pos) {
              var t = crcTable,
                end = pos + len;
              crc ^= -1;
              for (var i = pos; i < end; i++) {
                crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 255];
              }
              return crc ^ -1;
            }
            module3.exports = crc32;
          },
          /* 36 */
          /***/
          function (module3, exports3) {
            var BAD = 30;
            var TYPE = 12;
            module3.exports = function inflate_fast(strm, start) {
              var state;
              var _in;
              var last;
              var _out;
              var beg;
              var end;
              var dmax;
              var wsize;
              var whave;
              var wnext;
              var s_window;
              var hold;
              var bits;
              var lcode;
              var dcode;
              var lmask;
              var dmask;
              var here;
              var op;
              var len;
              var dist;
              var from;
              var from_source;
              var input, output;
              state = strm.state;
              _in = strm.next_in;
              input = strm.input;
              last = _in + (strm.avail_in - 5);
              _out = strm.next_out;
              output = strm.output;
              beg = _out - (start - strm.avail_out);
              end = _out + (strm.avail_out - 257);
              dmax = state.dmax;
              wsize = state.wsize;
              whave = state.whave;
              wnext = state.wnext;
              s_window = state.window;
              hold = state.hold;
              bits = state.bits;
              lcode = state.lencode;
              dcode = state.distcode;
              lmask = (1 << state.lenbits) - 1;
              dmask = (1 << state.distbits) - 1;
              top: do {
                if (bits < 15) {
                  hold += input[_in++] << bits;
                  bits += 8;
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                here = lcode[hold & lmask];
                dolen: for (;;) {
                  op = here >>> 24;
                  hold >>>= op;
                  bits -= op;
                  op = (here >>> 16) & 255;
                  if (op === 0) {
                    output[_out++] = here & 65535;
                  } else if (op & 16) {
                    len = here & 65535;
                    op &= 15;
                    if (op) {
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                      }
                      len += hold & ((1 << op) - 1);
                      hold >>>= op;
                      bits -= op;
                    }
                    if (bits < 15) {
                      hold += input[_in++] << bits;
                      bits += 8;
                      hold += input[_in++] << bits;
                      bits += 8;
                    }
                    here = dcode[hold & dmask];
                    dodist: for (;;) {
                      op = here >>> 24;
                      hold >>>= op;
                      bits -= op;
                      op = (here >>> 16) & 255;
                      if (op & 16) {
                        dist = here & 65535;
                        op &= 15;
                        if (bits < op) {
                          hold += input[_in++] << bits;
                          bits += 8;
                          if (bits < op) {
                            hold += input[_in++] << bits;
                            bits += 8;
                          }
                        }
                        dist += hold & ((1 << op) - 1);
                        if (dist > dmax) {
                          strm.msg = "invalid distance too far back";
                          state.mode = BAD;
                          break top;
                        }
                        hold >>>= op;
                        bits -= op;
                        op = _out - beg;
                        if (dist > op) {
                          op = dist - op;
                          if (op > whave) {
                            if (state.sane) {
                              strm.msg = "invalid distance too far back";
                              state.mode = BAD;
                              break top;
                            }
                          }
                          from = 0;
                          from_source = s_window;
                          if (wnext === 0) {
                            from += wsize - op;
                            if (op < len) {
                              len -= op;
                              do {
                                output[_out++] = s_window[from++];
                              } while (--op);
                              from = _out - dist;
                              from_source = output;
                            }
                          } else if (wnext < op) {
                            from += wsize + wnext - op;
                            op -= wnext;
                            if (op < len) {
                              len -= op;
                              do {
                                output[_out++] = s_window[from++];
                              } while (--op);
                              from = 0;
                              if (wnext < len) {
                                op = wnext;
                                len -= op;
                                do {
                                  output[_out++] = s_window[from++];
                                } while (--op);
                                from = _out - dist;
                                from_source = output;
                              }
                            }
                          } else {
                            from += wnext - op;
                            if (op < len) {
                              len -= op;
                              do {
                                output[_out++] = s_window[from++];
                              } while (--op);
                              from = _out - dist;
                              from_source = output;
                            }
                          }
                          while (len > 2) {
                            output[_out++] = from_source[from++];
                            output[_out++] = from_source[from++];
                            output[_out++] = from_source[from++];
                            len -= 3;
                          }
                          if (len) {
                            output[_out++] = from_source[from++];
                            if (len > 1) {
                              output[_out++] = from_source[from++];
                            }
                          }
                        } else {
                          from = _out - dist;
                          do {
                            output[_out++] = output[from++];
                            output[_out++] = output[from++];
                            output[_out++] = output[from++];
                            len -= 3;
                          } while (len > 2);
                          if (len) {
                            output[_out++] = output[from++];
                            if (len > 1) {
                              output[_out++] = output[from++];
                            }
                          }
                        }
                      } else if ((op & 64) === 0) {
                        here = dcode[(here & 65535) + (hold & ((1 << op) - 1))];
                        continue dodist;
                      } else {
                        strm.msg = "invalid distance code";
                        state.mode = BAD;
                        break top;
                      }
                      break;
                    }
                  } else if ((op & 64) === 0) {
                    here = lcode[(here & 65535) + (hold & ((1 << op) - 1))];
                    continue dolen;
                  } else if (op & 32) {
                    state.mode = TYPE;
                    break top;
                  } else {
                    strm.msg = "invalid literal/length code";
                    state.mode = BAD;
                    break top;
                  }
                  break;
                }
              } while (_in < last && _out < end);
              len = bits >> 3;
              _in -= len;
              bits -= len << 3;
              hold &= (1 << bits) - 1;
              strm.next_in = _in;
              strm.next_out = _out;
              strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
              strm.avail_out =
                _out < end ? 257 + (end - _out) : 257 - (_out - end);
              state.hold = hold;
              state.bits = bits;
              return;
            };
          },
          /* 37 */
          /***/
          function (module3, exports3, __webpack_require__) {
            var utils = __webpack_require__(33);
            var MAXBITS = 15;
            var ENOUGH_LENS = 852;
            var ENOUGH_DISTS = 592;
            var CODES = 0;
            var LENS = 1;
            var DISTS = 2;
            var lbase = [
              /* Length codes 257..285 base */
              3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43,
              51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
            ];
            var lext = [
              /* Length codes 257..285 extra */
              16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
              19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78,
            ];
            var dbase = [
              /* Distance codes 0..29 base */
              1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257,
              385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289,
              16385, 24577, 0, 0,
            ];
            var dext = [
              /* Distance codes 0..29 extra */
              16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
              23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64,
            ];
            module3.exports = function inflate_table(
              type,
              lens,
              lens_index,
              codes,
              table,
              table_index,
              work,
              opts
            ) {
              var bits = opts.bits;
              var len = 0;
              var sym = 0;
              var min = 0,
                max = 0;
              var root = 0;
              var curr = 0;
              var drop = 0;
              var left = 0;
              var used = 0;
              var huff = 0;
              var incr;
              var fill;
              var low;
              var mask;
              var next;
              var base = null;
              var base_index = 0;
              var end;
              var count = new utils.Buf16(MAXBITS + 1);
              var offs = new utils.Buf16(MAXBITS + 1);
              var extra = null;
              var extra_index = 0;
              var here_bits, here_op, here_val;
              for (len = 0; len <= MAXBITS; len++) {
                count[len] = 0;
              }
              for (sym = 0; sym < codes; sym++) {
                count[lens[lens_index + sym]]++;
              }
              root = bits;
              for (max = MAXBITS; max >= 1; max--) {
                if (count[max] !== 0) {
                  break;
                }
              }
              if (root > max) {
                root = max;
              }
              if (max === 0) {
                table[table_index++] = (1 << 24) | (64 << 16) | 0;
                table[table_index++] = (1 << 24) | (64 << 16) | 0;
                opts.bits = 1;
                return 0;
              }
              for (min = 1; min < max; min++) {
                if (count[min] !== 0) {
                  break;
                }
              }
              if (root < min) {
                root = min;
              }
              left = 1;
              for (len = 1; len <= MAXBITS; len++) {
                left <<= 1;
                left -= count[len];
                if (left < 0) {
                  return -1;
                }
              }
              if (left > 0 && (type === CODES || max !== 1)) {
                return -1;
              }
              offs[1] = 0;
              for (len = 1; len < MAXBITS; len++) {
                offs[len + 1] = offs[len] + count[len];
              }
              for (sym = 0; sym < codes; sym++) {
                if (lens[lens_index + sym] !== 0) {
                  work[offs[lens[lens_index + sym]]++] = sym;
                }
              }
              if (type === CODES) {
                base = extra = work;
                end = 19;
              } else if (type === LENS) {
                base = lbase;
                base_index -= 257;
                extra = lext;
                extra_index -= 257;
                end = 256;
              } else {
                base = dbase;
                extra = dext;
                end = -1;
              }
              huff = 0;
              sym = 0;
              len = min;
              next = table_index;
              curr = root;
              drop = 0;
              low = -1;
              used = 1 << root;
              mask = used - 1;
              if (
                (type === LENS && used > ENOUGH_LENS) ||
                (type === DISTS && used > ENOUGH_DISTS)
              ) {
                return 1;
              }
              for (;;) {
                here_bits = len - drop;
                if (work[sym] < end) {
                  here_op = 0;
                  here_val = work[sym];
                } else if (work[sym] > end) {
                  here_op = extra[extra_index + work[sym]];
                  here_val = base[base_index + work[sym]];
                } else {
                  here_op = 32 + 64;
                  here_val = 0;
                }
                incr = 1 << (len - drop);
                fill = 1 << curr;
                min = fill;
                do {
                  fill -= incr;
                  table[next + (huff >> drop) + fill] =
                    (here_bits << 24) | (here_op << 16) | here_val | 0;
                } while (fill !== 0);
                incr = 1 << (len - 1);
                while (huff & incr) {
                  incr >>= 1;
                }
                if (incr !== 0) {
                  huff &= incr - 1;
                  huff += incr;
                } else {
                  huff = 0;
                }
                sym++;
                if (--count[len] === 0) {
                  if (len === max) {
                    break;
                  }
                  len = lens[lens_index + work[sym]];
                }
                if (len > root && (huff & mask) !== low) {
                  if (drop === 0) {
                    drop = root;
                  }
                  next += min;
                  curr = len - drop;
                  left = 1 << curr;
                  while (curr + drop < max) {
                    left -= count[curr + drop];
                    if (left <= 0) {
                      break;
                    }
                    curr++;
                    left <<= 1;
                  }
                  used += 1 << curr;
                  if (
                    (type === LENS && used > ENOUGH_LENS) ||
                    (type === DISTS && used > ENOUGH_DISTS)
                  ) {
                    return 1;
                  }
                  low = huff & mask;
                  table[low] =
                    (root << 24) | (curr << 16) | (next - table_index) | 0;
                }
              }
              if (huff !== 0) {
                table[next + huff] = ((len - drop) << 24) | (64 << 16) | 0;
              }
              opts.bits = root;
              return 0;
            };
          },
          /* 38 */
          /***/
          function (module3, exports3, __webpack_require__) {
            var utils = __webpack_require__(33);
            var STR_APPLY_OK = true;
            var STR_APPLY_UIA_OK = true;
            try {
              String.fromCharCode.apply(null, [0]);
            } catch (__) {
              STR_APPLY_OK = false;
            }
            try {
              String.fromCharCode.apply(null, new Uint8Array(1));
            } catch (__) {
              STR_APPLY_UIA_OK = false;
            }
            var _utf8len = new utils.Buf8(256);
            for (var q = 0; q < 256; q++) {
              _utf8len[q] =
                q >= 252
                  ? 6
                  : q >= 248
                  ? 5
                  : q >= 240
                  ? 4
                  : q >= 224
                  ? 3
                  : q >= 192
                  ? 2
                  : 1;
            }
            _utf8len[254] = _utf8len[254] = 1;
            exports3.string2buf = function (str) {
              var buf,
                c,
                c2,
                m_pos,
                i,
                str_len = str.length,
                buf_len = 0;
              for (m_pos = 0; m_pos < str_len; m_pos++) {
                c = str.charCodeAt(m_pos);
                if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
                  c2 = str.charCodeAt(m_pos + 1);
                  if ((c2 & 64512) === 56320) {
                    c = 65536 + ((c - 55296) << 10) + (c2 - 56320);
                    m_pos++;
                  }
                }
                buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
              }
              buf = new utils.Buf8(buf_len);
              for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
                c = str.charCodeAt(m_pos);
                if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
                  c2 = str.charCodeAt(m_pos + 1);
                  if ((c2 & 64512) === 56320) {
                    c = 65536 + ((c - 55296) << 10) + (c2 - 56320);
                    m_pos++;
                  }
                }
                if (c < 128) {
                  buf[i++] = c;
                } else if (c < 2048) {
                  buf[i++] = 192 | (c >>> 6);
                  buf[i++] = 128 | (c & 63);
                } else if (c < 65536) {
                  buf[i++] = 224 | (c >>> 12);
                  buf[i++] = 128 | ((c >>> 6) & 63);
                  buf[i++] = 128 | (c & 63);
                } else {
                  buf[i++] = 240 | (c >>> 18);
                  buf[i++] = 128 | ((c >>> 12) & 63);
                  buf[i++] = 128 | ((c >>> 6) & 63);
                  buf[i++] = 128 | (c & 63);
                }
              }
              return buf;
            };
            function buf2binstring(buf, len) {
              if (len < 65537) {
                if (
                  (buf.subarray && STR_APPLY_UIA_OK) ||
                  (!buf.subarray && STR_APPLY_OK)
                ) {
                  return String.fromCharCode.apply(
                    null,
                    utils.shrinkBuf(buf, len)
                  );
                }
              }
              var result = "";
              for (var i = 0; i < len; i++) {
                result += String.fromCharCode(buf[i]);
              }
              return result;
            }
            exports3.buf2binstring = function (buf) {
              return buf2binstring(buf, buf.length);
            };
            exports3.binstring2buf = function (str) {
              var buf = new utils.Buf8(str.length);
              for (var i = 0, len = buf.length; i < len; i++) {
                buf[i] = str.charCodeAt(i);
              }
              return buf;
            };
            exports3.buf2string = function (buf, max) {
              var i, out, c, c_len;
              var len = max || buf.length;
              var utf16buf = new Array(len * 2);
              for (out = 0, i = 0; i < len; ) {
                c = buf[i++];
                if (c < 128) {
                  utf16buf[out++] = c;
                  continue;
                }
                c_len = _utf8len[c];
                if (c_len > 4) {
                  utf16buf[out++] = 65533;
                  i += c_len - 1;
                  continue;
                }
                c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
                while (c_len > 1 && i < len) {
                  c = (c << 6) | (buf[i++] & 63);
                  c_len--;
                }
                if (c_len > 1) {
                  utf16buf[out++] = 65533;
                  continue;
                }
                if (c < 65536) {
                  utf16buf[out++] = c;
                } else {
                  c -= 65536;
                  utf16buf[out++] = 55296 | ((c >> 10) & 1023);
                  utf16buf[out++] = 56320 | (c & 1023);
                }
              }
              return buf2binstring(utf16buf, out);
            };
            exports3.utf8border = function (buf, max) {
              var pos;
              max = max || buf.length;
              if (max > buf.length) {
                max = buf.length;
              }
              pos = max - 1;
              while (pos >= 0 && (buf[pos] & 192) === 128) {
                pos--;
              }
              if (pos < 0) {
                return max;
              }
              if (pos === 0) {
                return max;
              }
              return pos + _utf8len[buf[pos]] > max ? pos : max;
            };
          },
          /* 39 */
          /***/
          function (module3, exports3) {
            module3.exports = {
              /* Allowed flush values; see deflate() and inflate() below for details */
              Z_NO_FLUSH: 0,
              Z_PARTIAL_FLUSH: 1,
              Z_SYNC_FLUSH: 2,
              Z_FULL_FLUSH: 3,
              Z_FINISH: 4,
              Z_BLOCK: 5,
              Z_TREES: 6,
              /* Return codes for the compression/decompression functions. Negative values
               * are errors, positive values are used for special but normal events.
               */
              Z_OK: 0,
              Z_STREAM_END: 1,
              Z_NEED_DICT: 2,
              Z_ERRNO: -1,
              Z_STREAM_ERROR: -2,
              Z_DATA_ERROR: -3,
              //Z_MEM_ERROR:     -4,
              Z_BUF_ERROR: -5,
              //Z_VERSION_ERROR: -6,
              /* compression levels */
              Z_NO_COMPRESSION: 0,
              Z_BEST_SPEED: 1,
              Z_BEST_COMPRESSION: 9,
              Z_DEFAULT_COMPRESSION: -1,
              Z_FILTERED: 1,
              Z_HUFFMAN_ONLY: 2,
              Z_RLE: 3,
              Z_FIXED: 4,
              Z_DEFAULT_STRATEGY: 0,
              /* Possible values of the data_type field (though see inflate()) */
              Z_BINARY: 0,
              Z_TEXT: 1,
              //Z_ASCII:                1, // = Z_TEXT (deprecated)
              Z_UNKNOWN: 2,
              /* The deflate compression method */
              Z_DEFLATED: 8,
              //Z_NULL:                 null // Use -1 or null inline, depending on var type
            };
          },
          /* 40 */
          /***/
          function (module3, exports3) {
            module3.exports = {
              2: "need dictionary",
              /* Z_NEED_DICT       2  */
              1: "stream end",
              /* Z_STREAM_END      1  */
              0: "",
              /* Z_OK              0  */
              "-1": "file error",
              /* Z_ERRNO         (-1) */
              "-2": "stream error",
              /* Z_STREAM_ERROR  (-2) */
              "-3": "data error",
              /* Z_DATA_ERROR    (-3) */
              "-4": "insufficient memory",
              /* Z_MEM_ERROR     (-4) */
              "-5": "buffer error",
              /* Z_BUF_ERROR     (-5) */
              "-6": "incompatible version",
              /* Z_VERSION_ERROR (-6) */
            };
          },
          /* 41 */
          /***/
          function (module3, exports3) {
            function ZStream() {
              this.input = null;
              this.next_in = 0;
              this.avail_in = 0;
              this.total_in = 0;
              this.output = null;
              this.next_out = 0;
              this.avail_out = 0;
              this.total_out = 0;
              this.msg = "";
              this.state = null;
              this.data_type = 2;
              this.adler = 0;
            }
            module3.exports = ZStream;
          },
          /* 42 */
          /***/
          function (module3, exports3) {
            function GZheader() {
              this.text = 0;
              this.time = 0;
              this.xflags = 0;
              this.os = 0;
              this.extra = null;
              this.extra_len = 0;
              this.name = "";
              this.comment = "";
              this.hcrc = 0;
              this.done = false;
            }
            module3.exports = GZheader;
          },
          /******/
        ])
      );
    });
  })(browserfs$2);
  var browserfsExports = browserfs$2.exports;
  const browserfs = /* @__PURE__ */ getDefaultExportFromCjs(browserfsExports);
  const browserfs$1 = /* @__PURE__ */ _mergeNamespaces(
    {
      __proto__: null,
      default: browserfs,
    },
    [browserfsExports]
  );
  const raUserdataDir$1 = "/home/web_user/retroarch/userdata";
  function createEmscriptenFS({ FS, PATH, ERRNO_CODES }) {
    const inMemoryFS = new browserfsExports.FileSystem.InMemory();
    const mountableFS = new browserfsExports.FileSystem.MountableFileSystem();
    try {
      mountableFS.umount(raUserdataDir$1);
    } catch {}
    mountableFS.mount(raUserdataDir$1, inMemoryFS);
    browserfsExports.initialize(mountableFS);
    return new browserfsExports.EmscriptenFS(FS, PATH, ERRNO_CODES);
  }
  function getEmscriptenModuleOverrides(overrides) {
    let resolveRunDependenciesPromise;
    const runDependenciesPromise = new Promise((resolve) => {
      resolveRunDependenciesPromise = resolve;
    });
    const emscriptenModuleOverrides = {
      noInitialRun: true,
      noExitRuntime: false,
      locateFile(file) {
        return file;
      },
      print(...args) {
        console.info(...args);
      },
      printErr(...args) {
        console.error(...args);
      },
      // @ts-expect-error do not throw error when exit
      quit(status, toThrow) {
        if (status) {
          console.info(status, toThrow);
        }
      },
      // the return value of `monitorRunDependencies` seems to be misused here, but it works for now
      async monitorRunDependencies(left) {
        if (left === 0) {
          resolveRunDependenciesPromise();
        }
        return await runDependenciesPromise;
      },
      ...overrides,
    };
    return emscriptenModuleOverrides;
  }
  const { Buffer } = browserfsExports.BFSRequire("buffer");
  const path = browserfsExports.BFSRequire("path");
  const { basename, extname, dirname, join, relative } = path;
  function urlBaseName(url) {
    let pathname = url;
    try {
      pathname = new URL(url).pathname;
    } catch {}
    const name2 = basename(pathname);
    try {
      return decodeURIComponent(name2);
    } catch {
      return name2;
    }
  }
  function isAbsoluteUrl(string) {
    if (!string) {
      return false;
    }
    if (typeof string !== "string") {
      return false;
    }
    const absolutePrefixes = ["http://", "https://", "//", "data:", "blob:"];
    return absolutePrefixes.some((absolutePrefix) =>
      string.startsWith(absolutePrefix)
    );
  }
  async function blobToBuffer(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  function stringToBuffer(string) {
    return Buffer.from(string, "utf8");
  }
  function updateStyle(element, style) {
    if (!element) {
      return;
    }
    for (const rule in style) {
      const value = style[rule];
      element.style[rule] = value || null;
    }
  }
  function delay(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }
  function isGlobalScript(js2) {
    return js2.startsWith("var Module");
  }
  function isEsmScript(js2) {
    return js2.includes("import.meta.url");
  }
  function patchCoreJs({ name: name2, js: js2 }) {
    let jsContent2 = js2;
    if (isGlobalScript(js2)) {
      jsContent2 = `export function getEmscripten({ Module }) {
          ${js2};
          Module.FS = FS;
          Module.PATH = PATH;
          Module.ERRNO_CODES = ERRNO_CODES;
          return { JSEvents, Module, exit: _emscripten_force_exit }
        }`;
    } else if (isEsmScript(js2)) {
      jsContent2 = `${js2.replace(
        "readyPromiseResolve(Module)",
        "readyPromiseResolve({ JSEvents, Module, exit: _emscripten_force_exit })"
      )};
        export function getEmscripten({ Module }) {
          return (libretro_${name2} || ${name2})(Module)
        }
      `;
    }
    return jsContent2;
  }
  async function importCoreJsAsESM({ name, js }) {
    const jsContent = patchCoreJs({ name, js });
    const jsBlob = new Blob([jsContent], { type: "application/javascript" });
    const jsBlobUrl = URL.createObjectURL(jsBlob);
    if (!jsBlobUrl) {
      throw new Error("invalid jsBlob");
    }
    try {
      return await import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        jsBlobUrl
      );
    } catch {
      return await eval("import(jsBlobUrl)");
    } finally {
      URL.revokeObjectURL(jsBlobUrl);
    }
  }
  function isNil(obj) {
    return obj === void 0 || obj === null;
  }
  function isPlainObject(obj) {
    if (isNil(obj)) {
      return false;
    }
    const { constructor } = obj;
    return constructor === Object || !constructor;
  }
  function mergeSourceToTarget(target, source) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const targetValue = target[key];
        const sourceValue = source[key];
        if (isNil(targetValue)) {
          target[key] = sourceValue;
        } else if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
          target[key] = [...targetValue, ...sourceValue];
        } else if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
          target[key] = isPlainObject(targetValue) ? target[key] : {};
          mergeSourceToTarget(target[key], sourceValue);
        } else {
          target[key] = sourceValue;
        }
      }
    }
  }
  function merge(target, ...sources) {
    for (const source of sources) {
      mergeSourceToTarget(target, source);
    }
  }
  const encoder = new TextEncoder();
  const raUserdataDir = "/home/web_user/retroarch/userdata";
  const raBundleDir = "/home/web_user/retroarch/bundle";
  const raContentDir = join(raUserdataDir, "content");
  const raSystemDir = join(raUserdataDir, "system");
  const raConfigDir = join(raUserdataDir, "config");
  const raShaderDir = join(raBundleDir, "shaders", "shaders_glsl");
  const raConfigPath = join(raUserdataDir, "retroarch.cfg");
  const raCoreConfigPath = join(raUserdataDir, "retroarch-core-options.cfg");
  class Emulator {
    constructor(options) {
      __publicField(this, "emscripten");
      __publicField(this, "browserFS");
      __publicField(this, "options");
      __publicField(this, "messageQueue", []);
      __publicField(this, "gameStatus", "initial");
      __publicField(this, "canvasInitialSize", { width: 0, height: 0 });
      this.options = options;
    }
    get romBaseName() {
      const {
        rom: [{ fileName }],
      } = this.options;
      return fileName.slice(0, fileName.lastIndexOf("."));
    }
    get stateFileDirectory() {
      const { core } = this.options;
      const coreFullName = coreInfoMap[core.name].corename;
      if (!coreFullName) {
        throw new Error(`invalid core name: ${core.name}`);
      }
      return join(raUserdataDir, "states", coreFullName);
    }
    get stateFileName() {
      return join(this.stateFileDirectory, `${this.romBaseName}.state`);
    }
    get stateThumbnailFileName() {
      return `${this.stateFileName}.png`;
    }
    getOptions() {
      return this.options;
    }
    async launch() {
      await this.setupEmscripten();
      this.checkIsAborted();
      await this.setupRaConfigFile();
      this.checkIsAborted();
      const {
        element,
        style,
        respondToGlobalEvents,
        waitForInteraction,
        signal,
      } = this.options;
      updateStyle(element, style);
      if (!element.isConnected) {
        document.body.append(element);
        signal == null
          ? void 0
          : signal.addEventListener("abort", () => {
              element == null ? void 0 : element.remove();
            });
      }
      this.canvasInitialSize = this.getElementSize();
      if (respondToGlobalEvents === false) {
        if (!element.tabIndex || element.tabIndex === -1) {
          element.tabIndex = 0;
        }
        const { activeElement } = document;
        element.focus();
        signal == null
          ? void 0
          : signal.addEventListener("abort", () => {
              if (activeElement instanceof HTMLElement) {
                activeElement.focus();
              }
            });
      }
      const { nostalgist, beforeLaunch, onLaunch } = this.options;
      if (beforeLaunch) {
        await beforeLaunch(nostalgist);
      }
      const run = async () => {
        this.runMain();
        if (onLaunch) {
          await onLaunch(nostalgist);
        }
      };
      if (waitForInteraction) {
        waitForInteraction({ done: run });
      } else {
        run();
      }
    }
    sendCommand(msg) {
      const bytes = encoder.encode(`${msg}
  `);
      this.messageQueue.push([bytes, 0]);
    }
    resume() {
      if (this.gameStatus === "paused") {
        this.sendCommand("PAUSE_TOGGLE");
      }
      this.gameStatus = "running";
    }
    restart() {
      this.sendCommand("RESET");
      this.resume();
    }
    pause() {
      if (this.gameStatus === "running") {
        this.sendCommand("PAUSE_TOGGLE");
      }
      this.gameStatus = "paused";
    }
    getEmscripten() {
      if (!this.emscripten) {
        throw new Error("emulator is not ready");
      }
      return this.emscripten;
    }
    async saveState() {
      this.clearStateFile();
      this.sendCommand("SAVE_STATE");
      const savestateThumbnailEnable =
        this.options.retroarchConfig.savestate_thumbnail_enable;
      let stateBuffer;
      let stateThumbnailBuffer;
      if (savestateThumbnailEnable) {
        [stateBuffer, stateThumbnailBuffer] = await Promise.all([
          this.waitForEmscriptenFile(this.stateFileName),
          this.waitForEmscriptenFile(this.stateThumbnailFileName),
        ]);
      } else {
        stateBuffer = await this.waitForEmscriptenFile(this.stateFileName);
      }
      this.clearStateFile();
      const state = new Blob([stateBuffer], {
        type: "application/octet-stream",
      });
      const thumbnail = stateThumbnailBuffer
        ? new Blob([stateThumbnailBuffer], { type: "image/png" })
        : void 0;
      return { state, thumbnail };
    }
    async loadState(blob) {
      this.clearStateFile();
      const { Module } = this.getEmscripten();
      const { FS } = Module;
      const buffer = await blobToBuffer(blob);
      FS.writeFile(this.stateFileName, buffer);
      await this.waitForEmscriptenFile(this.stateFileName);
      this.sendCommand("LOAD_STATE");
    }
    exit(statusCode = 0) {
      const { emscripten } = this;
      if (emscripten) {
        const { Module, exit, JSEvents } = this.getEmscripten();
        const { FS } = Module;
        exit(statusCode);
        FS.unmount("/home");
        JSEvents.removeAllEventListeners();
      }
    }
    resize({ width, height }) {
      const { Module } = this.getEmscripten();
      if (typeof width === "number" && typeof height === "number") {
        Module.setCanvasSize(width, height);
      }
    }
    pressDown(button, player = 1) {
      const code = this.getKeyboardCode(button, player);
      if (code) {
        this.keyboardDown(code);
      }
    }
    pressUp(button, player = 1) {
      const code = this.getKeyboardCode(button, player);
      if (code) {
        this.keyboardUp(code);
      }
    }
    async press(button, player = 1, time = 100) {
      const code = this.getKeyboardCode(button, player);
      if (code) {
        await this.keyboardPress(code, time);
      }
    }
    async screenshot() {
      this.sendCommand("SCREENSHOT");
      const screenshotDirectory = join(raUserdataDir, "screenshots");
      const screenshotFileName = this.guessScreenshotFileName();
      const screenshotPath = join(screenshotDirectory, screenshotFileName);
      const buffer = await this.waitForEmscriptenFile(screenshotPath);
      const { Module } = this.getEmscripten();
      const { FS } = Module;
      FS.unlink(screenshotPath);
      const blobProperty = { type: "image/png" };
      return new Blob([buffer], blobProperty);
    }
    getElementSize() {
      const { element, size } = this.options;
      return !size || size === "auto"
        ? { width: element.offsetWidth, height: element.offsetHeight }
        : size;
    }
    async writeBlobToDirectory({ fileName, fileContent, directory }) {
      const { Module } = this.getEmscripten();
      const { FS } = Module;
      const buffer = await blobToBuffer(fileContent);
      FS.createDataFile("/", fileName, buffer, true, false);
      const encoding = "binary";
      const data = FS.readFile(fileName, { encoding });
      FS.mkdirTree(directory);
      FS.writeFile(join(directory, fileName), data, { encoding });
      FS.unlink(fileName);
    }
    writeTextToDirectory({ fileName, fileContent, directory }) {
      const { Module } = this.getEmscripten();
      const { FS } = Module;
      const buffer = stringToBuffer(fileContent);
      FS.createDataFile("/", fileName, buffer, true, false);
      const encoding = "binary";
      const data = FS.readFile(fileName, { encoding });
      FS.mkdirTree(directory);
      FS.writeFile(join(directory, fileName), data, { encoding });
      FS.unlink(fileName);
    }
    async setupFileSystem() {
      const { Module } = this.getEmscripten();
      const { FS, PATH, ERRNO_CODES } = Module;
      const { rom, bios, state } = this.options;
      const browserFS = createEmscriptenFS({ FS, PATH, ERRNO_CODES });
      this.browserFS = browserFS;
      FS.mount(browserFS, { root: "/home" }, "/home");
      if (rom.length > 0) {
        FS.mkdirTree(raContentDir);
      }
      if (bios.length > 0) {
        FS.mkdirTree(raSystemDir);
      }
      if (state) {
        FS.mkdirTree(this.stateFileDirectory);
      }
      const maxWaitTime = 100;
      let waitTime = 0;
      while (!Module.asm && waitTime < maxWaitTime) {
        await delay(10);
        this.checkIsAborted();
        waitTime += 5;
      }
      const filePromises = [];
      filePromises.push(
        ...rom.map((file) =>
          this.writeBlobToDirectory({ ...file, directory: raContentDir })
        ),
        ...bios.map((file) =>
          this.writeBlobToDirectory({ ...file, directory: raSystemDir })
        )
      );
      if (state) {
        const statePromise = this.writeBlobToDirectory({
          fileName: `${this.romBaseName}.state.auto`,
          fileContent: state,
          directory: this.stateFileDirectory,
        });
        filePromises.push(statePromise);
      }
      await Promise.all(filePromises);
      this.checkIsAborted();
    }
    async setupEmscripten() {
      var _a;
      if (typeof window === "object") {
        window.setImmediate ?? (window.setImmediate = window.setTimeout);
      }
      const { element, core, emscriptenModule } = this.options;
      const { wasm } = core;
      const moduleOptions = {
        wasmBinary: wasm,
        canvas: element,
        preRun: [],
        ...emscriptenModule,
      };
      const initialModule = getEmscriptenModuleOverrides(moduleOptions);
      (_a = initialModule.preRun) == null
        ? void 0
        : _a.push(() => initialModule.FS.init(() => this.stdin()));
      const { getEmscripten } = await importCoreJsAsESM(core);
      const emscripten = await getEmscripten({ Module: initialModule });
      this.emscripten = emscripten;
      const { Module } = emscripten;
      await Module.monitorRunDependencies();
      this.checkIsAborted();
      await this.setupFileSystem();
    }
    // copied from https://github.com/libretro/RetroArch/pull/15017
    stdin() {
      const { messageQueue } = this;
      while (messageQueue.length > 0) {
        const msg = messageQueue[0][0];
        const index = messageQueue[0][1];
        if (index >= msg.length) {
          messageQueue.shift();
        } else {
          messageQueue[0][1] = index + 1;
          return msg[index];
        }
      }
      return null;
    }
    writeConfigFile({ path: path2, config }) {
      const { Module } = this.getEmscripten();
      const { FS } = Module;
      const dir = path2.slice(0, path2.lastIndexOf("/"));
      FS.mkdirTree(dir);
      for (const key in config) {
        config[key] = `__${config[key]}__`;
      }
      let fileContent = ini$1.stringify(config, {
        whitespace: true,
        platform: "linux",
      });
      fileContent = fileContent.replaceAll("__", '"');
      const fileName = basename(path2);
      const directory = dirname(path2);
      this.writeTextToDirectory({ fileContent, fileName, directory });
    }
    async setupRaConfigFile() {
      this.writeConfigFile({
        path: raConfigPath,
        config: this.options.retroarchConfig,
      });
      this.writeConfigFile({
        path: raCoreConfigPath,
        config: this.options.retroarchCoreConfig,
      });
      await this.setupRaShaderFile();
    }
    async setupRaShaderFile() {
      const { shader } = this.options;
      if (shader.length === 0) {
        return;
      }
      const glslFiles = shader.filter((file) =>
        file.fileName.endsWith(".glslp")
      );
      if (glslFiles.length === 0) {
        return;
      }
      const glslpContent = glslFiles
        .map((file) => `#reference "${join(raShaderDir, file.fileName)}"`)
        .join("\n");
      this.writeTextToDirectory({
        fileName: "global.glslp",
        fileContent: glslpContent,
        directory: raConfigDir,
      });
      await Promise.all(
        shader.map(async ({ fileName, fileContent }) => {
          const directory = fileName.endsWith(".glslp")
            ? raShaderDir
            : join(raShaderDir, "shaders");
          await this.writeBlobToDirectory({ fileName, fileContent, directory });
        })
      );
    }
    runMain() {
      this.checkIsAborted();
      const { Module } = this.getEmscripten();
      const { arguments: raArgs = [] } = Module;
      const { rom, signal } = this.options;
      if (!Module.arguments && rom.length > 0) {
        const [{ fileName }] = rom;
        raArgs.push(join(raContentDir, fileName));
      }
      Module.callMain(raArgs);
      signal == null
        ? void 0
        : signal.addEventListener("abort", () => {
            this.exit();
          });
      this.gameStatus = "running";
      this.postRun();
    }
    postRun() {
      this.resize(this.canvasInitialSize);
      this.fireGamepadEvents();
      this.updateKeyboardEventHandlers();
    }
    fireGamepadEvents() {
      var _a;
      for (const gamepad of ((_a = navigator.getGamepads) == null
        ? void 0
        : _a.call(navigator)) ?? []) {
        if (gamepad) {
          window.dispatchEvent(
            new GamepadEvent("gamepadconnected", { gamepad })
          );
        }
      }
    }
    updateKeyboardEventHandlers() {
      const { JSEvents } = this.getEmscripten();
      const { respondToGlobalEvents, element } = this.options;
      if (!respondToGlobalEvents) {
        if (!element.getAttribute("tabindex")) {
          element.tabIndex = -1;
        }
        element.focus();
        element.addEventListener("click", () => {
          element.focus();
        });
      }
      const keyboardEvents = /* @__PURE__ */ new Set([
        "keyup",
        "keydown",
        "keypress",
      ]);
      const globalKeyboardEventHandlers = JSEvents.eventHandlers.filter(
        ({ eventTypeString, target }) =>
          keyboardEvents.has(eventTypeString) &&
          (target === document || target === element)
      );
      for (const globalKeyboardEventHandler of globalKeyboardEventHandlers) {
        const { eventTypeString, target, handlerFunc } =
          globalKeyboardEventHandler;
        JSEvents.registerOrRemoveHandler({ eventTypeString, target });
        JSEvents.registerOrRemoveHandler({
          ...globalKeyboardEventHandler,
          target: respondToGlobalEvents ? document : element,
          handlerFunc: (...args) => {
            const [event] = args;
            if (
              respondToGlobalEvents ||
              (event == null ? void 0 : event.target) === element
            ) {
              handlerFunc(...args);
            }
          },
        });
      }
    }
    async waitForEmscriptenFile(fileName) {
      const { Module } = this.getEmscripten();
      const { FS } = Module;
      const maxRetries = 30;
      let buffer;
      let isFinished = false;
      let retryTimes = 0;
      while (retryTimes <= maxRetries && !isFinished) {
        const delayTime = Math.min(100 * 2 ** retryTimes, 1e3);
        await delay(delayTime);
        try {
          const newBuffer = FS.readFile(fileName).buffer;
          isFinished =
            (buffer == null ? void 0 : buffer.byteLength) > 0 &&
            (buffer == null ? void 0 : buffer.byteLength) ===
              newBuffer.byteLength;
          buffer = newBuffer;
        } catch (error) {
          console.warn(error);
        }
        retryTimes += 1;
      }
      if (!isFinished) {
        throw new Error("fs timeout");
      }
      return buffer;
    }
    clearStateFile() {
      const { Module } = this.getEmscripten();
      const { FS } = Module;
      try {
        FS.unlink(this.stateFileName);
        FS.unlink(this.stateThumbnailFileName);
      } catch {}
    }
    getCurrentRetroarchConfig() {
      const { Module } = this.getEmscripten();
      const { FS } = Module;
      const configContent = FS.readFile(raConfigPath, { encoding: "utf8" });
      return ini$1.parse(configContent);
    }
    fireKeyboardEvent(type, code) {
      const { JSEvents } = this.getEmscripten();
      for (const {
        eventTypeString,
        eventListenerFunc,
      } of JSEvents.eventHandlers) {
        if (eventTypeString === type) {
          try {
            eventListenerFunc({ code, target: this.options.element });
          } catch {}
        }
      }
    }
    getKeyboardCode(button, player = 1) {
      const config = this.getCurrentRetroarchConfig();
      const configName = `input_player${player}_${button}`;
      const key = config[configName];
      if (!key || key === "nul") {
        return;
      }
      const { length } = key;
      if (length === 1) {
        return `Key${key.toUpperCase()}`;
      }
      if (key[0] === "f" && (length === 2 || length === 3)) {
        return key.toUpperCase();
      }
      if (length === 4 && key.startsWith("num")) {
        return `Numpad${key.at(-1)}`;
      }
      if (length === 7 && key.startsWith("keypad")) {
        return `Digit${key.at(-1)}`;
      }
      return keyboardCodeMap[key] || "";
    }
    keyboardUp(code) {
      this.fireKeyboardEvent("keyup", code);
    }
    keyboardDown(code) {
      this.fireKeyboardEvent("keydown", code);
    }
    async keyboardPress(code, time = 100) {
      this.keyboardDown(code);
      await delay(time);
      this.keyboardUp(code);
    }
    guessScreenshotFileName() {
      const date = /* @__PURE__ */ new Date();
      const year = date.getFullYear() % 1e3;
      const month = padZero(date.getMonth() + 1);
      const day = padZero(date.getDate());
      const hour = padZero(date.getHours());
      const minute = padZero(date.getMinutes());
      const second = padZero(date.getSeconds());
      const dateString = `${year}${month}${day}-${hour}${minute}${second}`;
      const baseName = this.romBaseName;
      return `${baseName}-${dateString}.png`;
    }
    checkIsAborted() {
      var _a;
      if ((_a = this.options.signal) == null ? void 0 : _a.aborted) {
        throw new Error("Launch aborted");
      }
    }
  }
  function padZero(number) {
    return (number < 10 ? "0" : "") + number;
  }
  const defaultRetroarchConfig = {
    menu_driver: "rgui",
    notification_show_when_menu_is_alive: true,
    savestate_auto_load: true,
    savestate_thumbnail_enable: true,
    stdin_cmd_enable: true,
    video_shader_enable: true,
    input_audio_mute: "nul",
    // override default 'f9'
    input_cheat_index_minus: "nul",
    // override default 't',
    input_cheat_index_plus: "nul",
    // override default 'y',
    input_cheat_toggle: "nul",
    // override default 'u',
    input_desktop_menu_toggle: "nul",
    // override default 'f5'
    input_exit_emulator: "nul",
    // override default 'esc',
    input_fps_toggle: "nul",
    // override default 'f3'
    input_frame_advance: "nul",
    // override default 'k',
    input_game_focus_toggle: "nul",
    // override default 'scroll_lock'
    input_grab_mouse_toggle: "nul",
    // override default 'f11'
    input_hold_fast_forward: "nul",
    // override default 'l',
    input_hold_slowmotion: "nul",
    // override default 'e',
    input_load_state: "nul",
    // override default 'f4'
    input_netplay_game_watch: "nul",
    // override default 'i',
    input_netplay_player_chat: "nul",
    // override default 'tilde'
    input_pause_toggle: "nul",
    // override default 'p',
    input_reset: "nul",
    // override default 'h',
    input_rewind: "nul",
    // override default 'r',
    input_save_state: "nul",
    // override default 'f2'
    input_screenshot: "nul",
    // override default 'f8'
    input_shader_next: "nul",
    // override default 'm',
    input_shader_prev: "nul",
    // override default 'n',
    input_shader_toggle: "nul",
    // override default 'comma'
    input_state_slot_decrease: "nul",
    // override default 'f6'
    input_state_slot_increase: "nul",
    // override default 'f7'
    input_toggle_fast_forward: "nul",
    // override default 'space'
    input_toggle_fullscreen: "nul",
    // override default 'f',
    input_volume_down: "nul",
    // override default 'subtract'
    input_volume_up: "nul",
    // override default 'add'
    input_player1_analog_dpad_mode: 1,
    input_player2_analog_dpad_mode: 1,
    input_player3_analog_dpad_mode: 1,
    input_player4_analog_dpad_mode: 1,
  };
  const cdnBaseUrl = "https://cdn.jsdelivr.net/gh";
  const coreRepo = "arianrhodsandlot/retroarch-emscripten-build";
  const coreVersion = "v1.17.0";
  const coreDirectory = "retroarch";
  const shaderRepo = "libretro/glsl-shaders";
  const shaderVersion = "bc8df9";
  function getDefaultOptions() {
    const defaultOptions = {
      element: "",
      runEmulatorManually: false,
      retroarchConfig: defaultRetroarchConfig,
      retroarchCoreConfig: {},
      resolveCoreJs(core) {
        return `${cdnBaseUrl}/${coreRepo}@${coreVersion}/${coreDirectory}/${core}_libretro.js`;
      },
      resolveCoreWasm(core) {
        return `${cdnBaseUrl}/${coreRepo}@${coreVersion}/${coreDirectory}/${core}_libretro.wasm`;
      },
      resolveRom(file) {
        if (typeof file !== "string") {
          return file || [];
        }
        if (isAbsoluteUrl(file)) {
          return file;
        }
        let romRepo = "";
        if (file.endsWith(".nes")) {
          romRepo = "retrobrews/nes-games";
        } else if (file.endsWith(".sfc")) {
          romRepo = "retrobrews/snes-games";
        } else if (file.endsWith(".gb") || file.endsWith(".gbc")) {
          romRepo = "retrobrews/gbc-games";
        } else if (file.endsWith(".gba")) {
          romRepo = "retrobrews/gba-games";
        } else if (file.endsWith(".sms")) {
          romRepo = "retrobrews/sms-games";
        } else if (file.endsWith(".md") || file.endsWith(".bin")) {
          romRepo = "retrobrews/md-games";
        }
        if (romRepo) {
          const encodedFile = encodeURIComponent(file);
          return `${cdnBaseUrl}/${romRepo}@master/${encodedFile}`;
        }
        return file || [];
      },
      resolveBios(file) {
        return file || [];
      },
      resolveShader(name2) {
        if (!name2) {
          return [];
        }
        const preset = `${cdnBaseUrl}/${shaderRepo}@${shaderVersion}/${name2}.glslp`;
        const segments = name2.split(path.sep);
        segments.splice(-1, 0, "shaders");
        const shader = `${cdnBaseUrl}/${shaderRepo}@${shaderVersion}/${segments.join(
          path.sep
        )}.glsl`;
        return [preset, shader];
      },
    };
    return defaultOptions;
  }
  const vendors = {
    ini: ini$1,
    browserfs: browserfs$1,
  };
  const _Nostalgist = class _Nostalgist {
    constructor(options) {
      __publicField(this, "options");
      __publicField(this, "emulatorOptions");
      __publicField(this, "emulator");
      const globalOptions = { ..._Nostalgist.globalOptions };
      const localOptions = { ...options };
      const mergedOptions = {};
      merge(mergedOptions, globalOptions, localOptions);
      this.options = mergedOptions;
    }
    /**
     * Reset the global configuation set by `Nostalgist.configure` to default.
     */
    static resetToDefault() {
      _Nostalgist.configure(getDefaultOptions());
    }
    /**
     * Update the global options for `Nostalgist`, so everytime the `Nostalgist.launch` method or shortcuts like `Nostalgist.nes` is called, the default options specified here will be used.
     *
     * You may want to specify how to resolve ROMs and RetroArch cores here.
     *
     * @example
     * ```js
     * Nostalgist.configure({
     *   resolveRom({ file }) {
     *     return `https://example.com/roms/${file}`
     *   },
     *   // other configuation can also be specified here
     * })
     * ```
     */
    static configure(options) {
      merge(_Nostalgist.globalOptions, options);
    }
    /**
     * Launch an emulator and return a `Promise` of the instance of the emulator.
     *
     * @example
     * A simple example:
     * ```js
     * const nostalgist = await Nostalgist.launch({
     *   core: 'fceumm',
     *   rom: 'flappybird.nes',
     * })
     * ```
     *
     * @example
     * A more complex one:
     * ```js
     * const nostalgist = await Nostalgist.launch({
     *   element: document.querySelector('.emulator-canvas'),
     *   core: 'fbneo',
     *   rom: ['mslug.zip'],
     *   bios: ['neogeo.zip'],
     *   retroarchConfig: {
     *     rewind_enable: true,
     *     savestate_thumbnail_enable: true,
     *   }
     *   runEmulatorManually: false,
     *   resolveCoreJs(core) {
     *     return `https://example.com/core/${core}_libretro.js`
     *   },
     *   resolveCoreWasm(core) {
     *     return `https://example.com/core/${core}_libretro.wasm`
     *   },
     *   resolveRom(file) {
     *     return `https://example.com/roms/${file}`
     *   },
     *   resolveBios(bios) {
     *     return `https://example.com/system/${bios}`
     *   },
     * })
     * ```
     */
    static async launch(options) {
      const nostalgist = new _Nostalgist(options);
      await nostalgist.launch();
      return nostalgist;
    }
    static async gb(options) {
      return await _Nostalgist.launchSystem("gb", options);
    }
    static async gba(options) {
      return await _Nostalgist.launchSystem("gba", options);
    }
    static async gbc(options) {
      return await _Nostalgist.launchSystem("gbc", options);
    }
    static async megadrive(options) {
      return await _Nostalgist.launchSystem("megadrive", options);
    }
    static async nes(options) {
      return await _Nostalgist.launchSystem("nes", options);
    }
    static async snes(options) {
      return await _Nostalgist.launchSystem("snes", options);
    }
    static getCoreForSystem(system) {
      return systemCoreMap[system];
    }
    static async launchSystem(system, options) {
      const launchOptions =
        typeof options === "string" ||
        options instanceof File ||
        ("fileName" in options && "fileContent" in options)
          ? { rom: options }
          : options;
      const core = _Nostalgist.getCoreForSystem(system);
      return await _Nostalgist.launch({ ...launchOptions, core });
    }
    getEmulator() {
      const { emulator } = this;
      if (!emulator) {
        throw new Error("emulator is not ready");
      }
      return emulator;
    }
    getEmulatorOptions() {
      if (!this.emulatorOptions) {
        throw new Error("emulator options are not ready");
      }
      return this.emulatorOptions;
    }
    getCanvas() {
      return this.getEmulatorOptions().element;
    }
    async launchEmulator() {
      return await this.getEmulator().launch();
    }
    getEmscriptenModule() {
      const emulator = this.getEmulator();
      const emscripten = emulator.getEmscripten();
      return emscripten.Module;
    }
    getEmscriptenFS() {
      const emulator = this.getEmulator();
      const emscripten = emulator.getEmscripten();
      return emscripten.Module.FS;
    }
    getBrowserFS() {
      const emulator = this.getEmulator();
      return emulator.browserFS;
    }
    getOptions() {
      return this.options;
    }
    /**
     * Save the state of the current running game.
     *
     * @see {@link https://nostalgist.js.org/apis/save-state}
     *
     * @example
     * ```js
     * const nostalgist = await Nostalgist.nes('flappybird.nes')
     *
     * // save the state
     * const { state } = await nostalgist.saveState()
     *
     * // load the state
     * await nostalgist.loadState(state)
     * ```
     * @returns
     * A Promise of the state of the current running game.
     *
     * Its type is like `Promise<{ state: Blob, thumbnail: Blob | undefined }>`.
     *
     * If RetroArch is launched with the option `savestate_thumbnail_enable` set to `true`, which is the default value inside Nostalgist.js, then the `thumbnail` will be a `Blob`. Otherwise the `thumbnail` will be `undefined`.
     */
    async saveState() {
      return await this.getEmulator().saveState();
    }
    /**
     * Load a state for the current running emulator and game.
     *
     * @see {@link https://nostalgist.js.org/apis/load-state}
     *
     * @example
     * ```js
     * const nostalgist = await Nostalgist.nes('flappybird.nes')
     *
     * // save the state
     * const { state } = await nostalgist.saveState(state)
     *
     * // load the state
     * await nostalgist.loadState(state)
     * ```
     */
    async loadState(state) {
      await this.getEmulator().loadState(state);
    }
    /**
     * Resume the current running game, if it has been paused by `pause`.
     *
     * @see {@link https://nostalgist.js.org/apis/resume}
     *
     * @example
     * ```js
     * const nostalgist = await Nostalgist.nes('flappybird.nes')
     *
     * nostalgist.pause()
     * await new Promise(resolve => setTimeout(resolve, 1000))
     * nostalgist.resume()
     * ```
     */
    resume() {
      this.getEmulator().resume();
    }
    /**
     * Pause the current running game.
     *
     * @see {@link https://nostalgist.js.org/apis/pause}
     *
     * @example
     * ```js
     * const nostalgist = await Nostalgist.nes('flappybird.nes')
     *
     * nostalgist.pause()
     * ```
     */
    pause() {
      this.getEmulator().pause();
    }
    /**
     * Restart the current running game.
     *
     * @see {@link https://nostalgist.js.org/apis/restart}
     *
     * @example
     * ```js
     * const nostalgist = await Nostalgist.nes('flappybird.nes')
     *
     * nostalgist.restart()
     * ```
     */
    restart() {
      this.getEmulator().restart();
    }
    /**
     * Exit the current running game and the emulator. Remove the canvas element used by the emulator if needed.
     *
     * @see {@link https://nostalgist.js.org/apis/exit}
     *
     * @example
     * ```js
     * const nostalgist = await Nostalgist.nes('flappybird.nes')
     *
     * nostalgist.exit()
     * ```
     * ```js
     * const nostalgist = await Nostalgist.nes('flappybird.nes')
     *
     * // the canvas element will not be removed
     * nostalgist.exit({ removeCanvas: false })
     * ```
     */
    exit({ removeCanvas = true } = {}) {
      this.getEmulator().exit();
      if (removeCanvas) {
        this.getCanvas().remove();
      }
    }
    /**
     * Resize the canvas element of the emulator.
     *
     * @see {@link https://nostalgist.js.org/apis/resize}
     *
     * @example
     * ```js
     * const nostalgist = await Nostalgist.nes('flappybird.nes')
     *
     * nostalgist.resize({ width: 1000, height: 800 })
     * ```
     */
    resize(size) {
      return this.getEmulator().resize(size);
    }
    /**
     * Press a button programmatically. Analog Joysticks are not supported by now.
     *
     * @see {@link https://nostalgist.js.org/apis/press-down}
     *
     * @example
     * ```js
     * const nostalgist = await Nostalgist.nes('flappybird.nes')
     *
     * nostalgist.pressDown('start')
     * ```
     */
    pressDown(options) {
      const emulator = this.getEmulator();
      if (typeof options === "string") {
        return emulator.pressDown(options);
      }
      return emulator.pressDown(options.button, options.player);
    }
    /**
     * Release it programmatically. Analog Joysticks are not supported by now.
     *
     * @see {@link https://nostalgist.js.org/apis/press-up}
     *
     * @example
     * ```js
     * const nostalgist = await Nostalgist.nes('flappybird.nes')
     *
     * nostalgist.pressUp('start')
     * ```
     */
    pressUp(options) {
      const emulator = this.getEmulator();
      if (typeof options === "string") {
        return emulator.pressUp(options);
      }
      return emulator.pressUp(options.button, options.player);
    }
    /**
     * Press a button and then release it programmatically. Analog Joysticks are not supported by now.
     *
     * @see {@link https://nostalgist.js.org/apis/press}
     *
     * @example
     * ```js
     * const nostalgist = await Nostalgist.nes('flappybird.nes')
     *
     * await nostalgist.press('start')
     * ```
     */
    async press(options) {
      const emulator = this.getEmulator();
      await (typeof options === "string"
        ? emulator.press(options)
        : emulator.press(options.button, options.player, options.time));
    }
    /**
     * Take a screenshot for the current running game.
     *
     * @see {@link https://nostalgist.js.org/apis/screenshot}
     *
     * @example
     * ```js
     * const nostalgist = await Nostalgist.nes('flappybird.nes')
     *
     * const blob = await nostalgist.screenshot()
     * ```
     */
    async screenshot() {
      const emulator = this.getEmulator();
      return await emulator.screenshot();
    }
    /**
     * Send a command to RetroArch.
     * The commands are listed here: https://docs.libretro.com/development/retroarch/network-control-interface/#commands .
     * But not all of them are supported inside a browser.
     *
     * @see {@link https://nostalgist.js.org/apis/send-command}
     *
     * @example
     * ```js
     * const nostalgist = await Nostalgist.nes('flappybird.nes')
     *
     * nostalgist.sendCommand('FAST_FORWARD')
     * ```
     */
    sendCommand(command) {
      const emulator = this.getEmulator();
      return emulator.sendCommand(command);
    }
    /**
     * Load options and then launch corresponding emulator if should
     */
    async launch() {
      await this.loadEmulatorOptions();
      this.checkIsAborted();
      this.loadEmulator();
      if (!this.options.runEmulatorManually) {
        await this.launchEmulator();
      }
    }
    async loadEmulatorOptions() {
      const {
        size = "auto",
        respondToGlobalEvents = true,
        state,
        waitForInteraction,
        signal,
        beforeLaunch,
        onLaunch,
        emscriptenModule = {},
      } = this.options;
      const element = this.getElementOption();
      const style = this.getStyleOption();
      const retroarchConfig = this.getRetroarchOption();
      const retroarchCoreConfig = this.getRetroarchCoreOption();
      const [core, rom, bios, shader] = await Promise.all([
        this.getCoreOption(),
        this.getRomOption(),
        this.getBiosOption(),
        this.getShaderOption(),
      ]);
      this.checkIsAborted();
      const emulatorOptions = {
        element,
        style,
        size,
        core,
        rom,
        bios,
        shader,
        state,
        respondToGlobalEvents,
        retroarchConfig,
        retroarchCoreConfig,
        waitForInteraction,
        emscriptenModule,
        signal,
        beforeLaunch,
        onLaunch,
        nostalgist: this,
      };
      this.emulatorOptions = emulatorOptions;
    }
    getElementOption() {
      if (typeof document !== "object") {
        throw new TypeError("document must be an object");
      }
      let { element } = this.options;
      if (typeof element === "string" && element) {
        const canvas = document.body.querySelector(element);
        if (!canvas) {
          throw new Error(`can not find element "${element}"`);
        }
        if (!(canvas instanceof HTMLCanvasElement)) {
          throw new TypeError(`element "${element}" is not a canvas element`);
        }
        element = canvas;
      }
      if (!element) {
        element = document.createElement("canvas");
      }
      if (element instanceof HTMLCanvasElement) {
        element.id = "canvas";
        return element;
      }
      throw new TypeError("invalid element");
    }
    getStyleOption() {
      const { element, style } = this.options;
      const defaultAppearanceStyle = {
        backgroundColor: "black",
        imageRendering: "pixelated",
      };
      if (element) {
        merge(defaultAppearanceStyle, style);
        return defaultAppearanceStyle;
      }
      const defaultLayoutStyle = {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: "1",
      };
      merge(defaultLayoutStyle, defaultAppearanceStyle, style);
      return defaultLayoutStyle;
    }
    async getCoreOption() {
      const { core, resolveCoreJs, resolveCoreWasm } = this.options;
      let coreDict;
      if (typeof core === "string") {
        const [js22, wasm2] = await Promise.all([
          resolveCoreJs(core, this.options),
          resolveCoreWasm(core, this.options),
        ]);
        coreDict = { name: core, js: js22, wasm: wasm2 };
      } else {
        coreDict = core;
      }
      let { name: name2, js: js2, wasm } = coreDict;
      const promises = [];
      if (typeof js2 === "string") {
        promises.push(
          (async () => {
            const response = await this.fetch(js2);
            js2 = await response.text();
          })()
        );
      }
      if (typeof wasm === "string") {
        promises.push(
          (async () => {
            const response = await this.fetch(wasm);
            wasm = await response.arrayBuffer();
          })()
        );
      }
      if (promises.length > 0) {
        await Promise.all(promises);
      }
      return { name: name2, js: js2, wasm };
    }
    async resolveStringFile(file, resolveFunction) {
      let fileName = urlBaseName(file);
      let fileContent;
      const resolvedRom = resolveFunction
        ? await resolveFunction(file, this.options)
        : file;
      if (!resolvedRom) {
        throw new Error("file is invalid");
      } else if (resolvedRom instanceof Blob) {
        fileContent = resolvedRom;
      } else if (typeof resolvedRom === "string") {
        fileName = urlBaseName(resolvedRom);
        const response = await this.fetch(resolvedRom);
        fileContent = await response.blob();
      }
      return { fileName, fileContent };
    }
    async resolveFile(file, resolveFunction) {
      let fileName = "";
      let fileContent;
      if (file instanceof File) {
        fileContent = file;
        fileName = file.name;
      } else if (file instanceof Blob) {
        fileContent = file;
        fileName = "rom.bin";
      } else if (typeof file === "string") {
        const resolvedFile = await this.resolveStringFile(
          file,
          resolveFunction
        );
        fileName = resolvedFile.fileName;
        fileContent = resolvedFile.fileContent;
      } else {
        if (typeof file.fileName === "string") {
          fileName = file.fileName;
        }
        if (file.fileContent instanceof Blob) {
          fileContent = file.fileContent;
        }
      }
      if (!fileContent) {
        throw new TypeError("file content is invalid");
      }
      fileName = fileName
        ? fileName.replaceAll(/["%*/:<>?\\|]/g, "-")
        : "rom.bin";
      return { fileName, fileContent };
    }
    async getRomOption() {
      const { rom, resolveRom } = this.options;
      if (!rom) {
        return [];
      }
      const romFiles = Array.isArray(rom) ? rom : [rom];
      return await Promise.all(
        romFiles.map((romFile) => this.resolveFile(romFile, resolveRom))
      );
    }
    async getBiosOption() {
      const { bios, resolveBios } = this.options;
      if (!bios) {
        return [];
      }
      const biosFiles = Array.isArray(bios) ? bios : [bios];
      return await Promise.all(
        biosFiles.map((biosFile) => this.resolveFile(biosFile, resolveBios))
      );
    }
    async getShaderOption() {
      const { shader, resolveShader } = this.options;
      if (!shader) {
        return [];
      }
      const shaderFile = await resolveShader(shader, this.options);
      if (Array.isArray(shaderFile)) {
        if (shaderFile.length > 0) {
          return await Promise.all(
            shaderFile.map((file) => this.resolveFile(file))
          );
        }
        return [];
      }
      if (shaderFile) {
        return [await this.resolveFile(shaderFile)];
      }
      return [];
    }
    getRetroarchOption() {
      const options = {};
      merge(
        options,
        _Nostalgist.globalOptions.retroarchConfig,
        this.options.retroarchConfig
      );
      return options;
    }
    getRetroarchCoreOption() {
      const options = {};
      merge(
        options,
        _Nostalgist.globalOptions.retroarchCoreConfig,
        this.options.retroarchCoreConfig
      );
      return options;
    }
    loadEmulator() {
      const emulatorOptions = this.getEmulatorOptions();
      const emulator = new Emulator(emulatorOptions);
      this.emulator = emulator;
    }
    async fetch(input) {
      const { signal = null } = this.options;
      return await fetch(input, { signal });
    }
    checkIsAborted() {
      var _a;
      if ((_a = this.options.signal) == null ? void 0 : _a.aborted) {
        throw new Error("Launch aborted");
      }
    }
  };
  __publicField(_Nostalgist, "Nostalgist", _Nostalgist);
  __publicField(_Nostalgist, "vendors", vendors);
  __publicField(_Nostalgist, "globalOptions", getDefaultOptions());
  let Nostalgist = _Nostalgist;
  return Nostalgist;
});
