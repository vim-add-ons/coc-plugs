import util from 'util'
import { styles2, PLStyles, PLOpenClose } from './styles'
export interface Colors {
    themes?: any
    styles?: any
    supportsColor?: () => boolean
    enabled?: any
    enable?: () => void
    disable?: () => void
    stripColors?: (str : string) => string
    strip?: (str : string) => string
    stylize?: (str : string, style : string) => string
    setTheme?: (theme : any) => void
    trap?: (text : string, options : string) => string
    zalgo?: (text : string, options : string) => string
    maps?: any
    reset?: PLOpenClose

    bold?: PLOpenClose
    dim?: PLOpenClose
    italic?: PLOpenClose
    underline?: PLOpenClose
    inverse?: PLOpenClose
    hidden?: PLOpenClose
    strikethrough?: PLOpenClose

    black?: PLOpenClose
    red?: PLOpenClose
    green?: PLOpenClose
    yellow?: PLOpenClose
    blue?: PLOpenClose
    magenta?: PLOpenClose
    cyan?: PLOpenClose
    white?: PLOpenClose
    gray?: PLOpenClose
    grey?: PLOpenClose

    brightRed?: PLOpenClose
    brightGreen?: PLOpenClose
    brightYellow?: PLOpenClose
    brightBlue?: PLOpenClose
    brightMagenta?: PLOpenClose
    brightCyan?: PLOpenClose
    brightWhite?: PLOpenClose

    bgBlack?: PLOpenClose
    bgRed?: PLOpenClose
    bgGreen?: PLOpenClose
    bgYellow?: PLOpenClose
    bgBlue?: PLOpenClose
    bgMagenta?: PLOpenClose
    bgCyan?: PLOpenClose
    bgWhite?: PLOpenClose
    bgGray?: PLOpenClose
    bgGrey?: PLOpenClose

    bgBrightRed?: PLOpenClose
    bgBrightGreen?: PLOpenClose
    bgBrightYellow?: PLOpenClose
    bgBrightBlue?: PLOpenClose
    bgBrightMagenta?: PLOpenClose
    bgBrightCyan?: PLOpenClose
    bgBrightWhite?: PLOpenClose

    // legacy styles2 for colors pre v1.0.0
    blackBG?: PLOpenClose
    redBG?: PLOpenClose
    greenBG?: PLOpenClose
    yellowBG?: PLOpenClose
    blueBG?: PLOpenClose
    magentaBG?: PLOpenClose
    cyanBG?: PLOpenClose
    whiteBG?: PLOpenClose
    styles2?: PLStyles
}

    export type Builder = {
        (__styles,...args) : string;
        _styles:any;
        __proto__: () => string;
    };
export var colors : Colors = {};

colors.themes = {};
colors.styles2 = styles2

const fs = require('fs');
const console = require('console');
const myConsole = new console.Console(fs.createWriteStream('./output.txt'));

    var ansiStyles = colors.styles = styles2
    var defineProps = Object.defineProperties;
    var newLineRegex = new RegExp(/[\r\n]+/g);

    colors.supportsColor = function() { return true; }

    if (typeof colors.enabled === 'undefined') {
      colors.enabled = colors.supportsColor() !== false;
    }

    colors.enable = function() {
      colors.enabled = true;
    };

    colors.disable = function() {
      colors.enabled = false;
    };

    colors.stripColors = colors.strip = function(str) {
      return ('' + str).replace(/\x1B\[\d+m/g, '');
    };

    // eslint-disable-next-line no-unused-vars
    var stylize = colors.stylize = function stylize(str, style) {
      if (!colors.enabled) {
        return str+'';
      }

      var styleMap = ansiStyles[style];

      // Stylize should work for non-ANSI styles, too
      if(!styleMap && style in colors){
        // Style maps like trap operate as functions on strings;
        // they don't have properties like open or close.
        return colors[style](str);
      }

      return styleMap.open + str + styleMap.close;
    };

    var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
    var escapeStringRegexp = function(str) {
      if (typeof str !== 'string') {
        throw new TypeError('Expected a string, got: ' + typeof str);
      }
      //  throw new TypeError('Expected and got a string, got: ' + str);
      return str.replace(matchOperatorsRe, '\\$&');
    };

    function applyStyle (__styles:string[],...args : any[]) {
        myConsole.log('Called with ' + __styles)
        var str = args.map(function(arg) {
            // Use weak equality check so we can colorize null/undefined in safe mode
            if (arg != null && arg.constructor === String) {
                return arg;
            } else {
                return util.inspect(arg);
            }
        }).join(' ');

        myConsole.log('Called with ' + str)

        if (!colors.enabled || !str) {
            return str;
        }

        var newLinesPresent = str.indexOf('\n') != -1;

        var nestedStyles = __styles

        var i = nestedStyles.length;
        myConsole.log('Len: ' + i)
        while (i--) {
            var code = ansiStyles[nestedStyles[i]];
            myConsole.log('loop // ' + str)
            myConsole.log('loop // ' + code.closeRe)
            str = code.open + str.replace(code.closeRe, code.open) + code.close;
            if (newLinesPresent) {
                str = str.replace(newLineRegex, function(match) {
                    return code.close + match + code.open;
                });
            }
        }

        myConsole.log('Returning → ' + str)
        return str;
    }
    /**
     * @constructor
     * @this Builder
     */
    export function build(__styles) {


    return function (...args) {
        return applyStyle(__styles,...Array.from(args))
    }
    }

function getAllFuncs(toCheck) {
    var props : string[] = [];
    var obj = toCheck;
    do {
        props = props.concat(Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    return props.sort().filter(function(e, i, arr) {
        if (e!=arr[i+1]) return true;
        // if (e!=arr[i+1] && typeof toCheck[e] == 'function') return true;
    }).join(', ');
}
    var styles = (function() {
      var ret = {};
      ansiStyles.grey = ansiStyles.gray;
      Object.keys(ansiStyles).forEach(function(key) {
          ansiStyles[key].closeRe =
              new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
          ret[key] = {
              open: ansiStyles[key].open,
              close: ansiStyles[key].close,
              get: function() {
                  return build([key]);
              },
          };
      });
      return ret;
    })();
    myConsole.log(styles["magenta"]);
    colors.styles2 = styles

    var proto = defineProps(function colors() {}, styles);

    colors.setTheme = function(theme) {
      if (typeof theme === 'string') {
        console.log('colors.setTheme now only accepts an object, not a string.  ' +
          'If you are trying to set a theme from a file, it is now your (the ' +
          'caller\'s) responsibility to require the file.  The old syntax ' +
          'looked like colors.setTheme(__dirname + ' +
          '\'/../themes/generic-logging.js\'); The new syntax looks like '+
          'colors.setTheme(require(__dirname + ' +
          '\'/../themes/generic-logging.js\'));');
        return;
      }
      for (var style in theme) {
        (function(style) {
          colors[style] = function(str) {
            if (typeof theme[style] === 'object') {
              var out = str;
              for (var i in theme[style]) {
                out = colors[theme[style][i]](out);
              }
              return out;
            }
            return colors[theme[style]](str);
          };
        })(style);
      }
    };

    function init() {
      var ret = {};
      Object.keys(styles).forEach(function(name) {
        ret[name] = {
          get: function() {
            return build([name]);
          },
        };
      });
      return ret;
    }

    var sequencer = function sequencer(map, str) {
      var exploded = str.split('');
      exploded = exploded.map(map);
      return exploded.join('');
    };

    // custom formatter methods
    colors.trap = function runTheTrap(text, options) {
      var result = '';
      text = text || 'Run the trap, drop the bass';
      let text_sp : string[] = text.split('');
      var trap = {
        a: ['\u0040', '\u0104', '\u023a', '\u0245', '\u0394', '\u039b', '\u0414'],
        b: ['\u00df', '\u0181', '\u0243', '\u026e', '\u03b2', '\u0e3f'],
        c: ['\u00a9', '\u023b', '\u03fe'],
        d: ['\u00d0', '\u018a', '\u0500', '\u0501', '\u0502', '\u0503'],
        e: ['\u00cb', '\u0115', '\u018e', '\u0258', '\u03a3', '\u03be', '\u04bc',
          '\u0a6c'],
        f: ['\u04fa'],
        g: ['\u0262'],
        h: ['\u0126', '\u0195', '\u04a2', '\u04ba', '\u04c7', '\u050a'],
        i: ['\u0f0f'],
        j: ['\u0134'],
        k: ['\u0138', '\u04a0', '\u04c3', '\u051e'],
        l: ['\u0139'],
        m: ['\u028d', '\u04cd', '\u04ce', '\u0520', '\u0521', '\u0d69'],
        n: ['\u00d1', '\u014b', '\u019d', '\u0376', '\u03a0', '\u048a'],
        o: ['\u00d8', '\u00f5', '\u00f8', '\u01fe', '\u0298', '\u047a', '\u05dd',
          '\u06dd', '\u0e4f'],
        p: ['\u01f7', '\u048e'],
        q: ['\u09cd'],
        r: ['\u00ae', '\u01a6', '\u0210', '\u024c', '\u0280', '\u042f'],
        s: ['\u00a7', '\u03de', '\u03df', '\u03e8'],
        t: ['\u0141', '\u0166', '\u0373'],
        u: ['\u01b1', '\u054d'],
        v: ['\u05d8'],
        w: ['\u0428', '\u0460', '\u047c', '\u0d70'],
        x: ['\u04b2', '\u04fe', '\u04fc', '\u04fd'],
        y: ['\u00a5', '\u04b0', '\u04cb'],
        z: ['\u01b5', '\u0240'],
      };
      text_sp.forEach(function(c) {
        c = c.toLowerCase();
        var chars = trap[c] || [' '];
        var rand = Math.floor(Math.random() * chars.length);
        if (typeof trap[c] !== 'undefined') {
          result += trap[c][rand];
        } else {
          result += c;
        }
      });
      return result;
    }
    colors.zalgo = function zalgo(text, options) {
      text = text || '   he is here   ';
      var soul : any = {
        'up': [
          '̍', '̎', '̄', '̅',
          '̿', '̑', '̆', '̐',
          '͒', '͗', '͑', '̇',
          '̈', '̊', '͂', '̓',
          '̈', '͊', '͋', '͌',
          '̃', '̂', '̌', '͐',
          '̀', '́', '̋', '̏',
          '̒', '̓', '̔', '̽',
          '̉', 'ͣ', 'ͤ', 'ͥ',
          'ͦ', 'ͧ', 'ͨ', 'ͩ',
          'ͪ', 'ͫ', 'ͬ', 'ͭ',
          'ͮ', 'ͯ', '̾', '͛',
          '͆', '̚',
        ],
        'down': [
          '̖', '̗', '̘', '̙',
          '̜', '̝', '̞', '̟',
          '̠', '̤', '̥', '̦',
          '̩', '̪', '̫', '̬',
          '̭', '̮', '̯', '̰',
          '̱', '̲', '̳', '̹',
          '̺', '̻', '̼', 'ͅ',
          '͇', '͈', '͉', '͍',
          '͎', '͓', '͔', '͕',
          '͖', '͙', '͚', '̣',
        ],
        'mid': [
          '̕', '̛', '̀', '́',
          '͘', '̡', '̢', '̧',
          '̨', '̴', '̵', '̶',
          '͜', '͝', '͞',
          '͟', '͠', '͢', '̸',
          '̷', '͡', ' ҉',
        ],
      };
      var all = [].concat(soul.up, soul.down, soul.mid);

      function randomNumber(range) {
        var r = Math.floor(Math.random() * range);
        return r;
      }

      function isChar(character) {
        var bool = false;
        all.filter(function(i) {
          bool = (i === character);
        });
        return bool;
      }


      function heComes(text, options) {
        var result = '';
        var counts;
        var l;
        options = options || {};
        options['up'] =
          typeof options['up'] !== 'undefined' ? options['up'] : true;
        options['mid'] =
          typeof options['mid'] !== 'undefined' ? options['mid'] : true;
        options['down'] =
          typeof options['down'] !== 'undefined' ? options['down'] : true;
        options['size'] =
          typeof options['size'] !== 'undefined' ? options['size'] : 'maxi';
        text = text.split('');
        for (l in text) {
          if (isChar(l)) {
            continue;
          }
          result = result + text[l];
          counts = {'up': 0, 'down': 0, 'mid': 0};
          switch (options.size) {
            case 'mini':
              counts.up = randomNumber(8);
              counts.mid = randomNumber(2);
              counts.down = randomNumber(8);
              break;
            case 'maxi':
              counts.up = randomNumber(16) + 3;
              counts.mid = randomNumber(4) + 1;
              counts.down = randomNumber(64) + 3;
              break;
            default:
              counts.up = randomNumber(8) + 1;
              counts.mid = randomNumber(6) / 2;
              counts.down = randomNumber(8) + 1;
              break;
          }

          var arr = ['up', 'mid', 'down'];
          for (var d in arr) {
            var index = arr[d];
            for (var i = 0; i <= counts[index]; i++) {
              if (options[index]) {
                result = result + soul[index][randomNumber(soul[index].length)];
              }
            }
          }
        }
        return result;
      }
      // don't summon him
      return heComes(text, options);
    }

    // maps
    colors.maps = {};
    colors.maps.america = function(colors) {
      return function(letter, i, exploded) {
        if (letter === ' ') return letter;
        switch (i%3) {
          case 0: return colors.red(letter);
          case 1: return colors.white(letter);
          case 2: return colors.blue(letter);
        }
      };
    };
    colors.maps.zebra = function(colors) {
      return function(letter, i, exploded) {
        return i % 2 === 0 ? letter : colors.inverse(letter);
      };
    };
    colors.maps.rainbow = function(colors) {
      // RoY G BiV
      var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta'];
      return function(letter, i, exploded) {
        if (letter === ' ') {
          return letter;
        } else {
          return colors[rainbowColors[i++ % rainbowColors.length]](letter);
        }
      };
    }
    colors.maps.random = function(colors) {
      var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green',
        'blue', 'white', 'cyan', 'magenta', 'brightYellow', 'brightRed',
        'brightGreen', 'brightBlue', 'brightWhite', 'brightCyan', 'brightMagenta'];
      return function(letter, i, exploded) {
        return letter === ' ' ? letter :
          colors[
              available[Math.round(Math.random() * (available.length - 2))]
          ](letter);
      };
    }

    for (var map in colors.maps) {
      (function(map) {
        colors[map] = function(str) {
          return sequencer(colors.maps[map], str);
        };
      })(map);
    }

    defineProps(colors, init());
    myConsole.log('°'+styles["magenta"]);
    myConsole.log('°¨'+styles2["magenta"]?.get());
    myConsole.log('°˙'+colors.magenta);
    //colors = Object.assign(colors,styles)
    myConsole.log('°˙'+colors.magenta);
