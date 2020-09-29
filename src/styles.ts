import {Builder,build} from './colors'
    export interface PLOpenClose {
        open: string
        close: string
        get: () => Builder
    }
    export interface PLStyles {
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
    }

    export var styles2 : PLStyles = {};

    var codes = {
      reset: [0, 0],

      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29],

      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      gray: [90, 39],
      grey: [90, 39],

      brightRed: [91, 39],
      brightGreen: [92, 39],
      brightYellow: [93, 39],
      brightBlue: [94, 39],
      brightMagenta: [95, 39],
      brightCyan: [96, 39],
      brightWhite: [97, 39],

      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      bgGray: [100, 49],
      bgGrey: [100, 49],

      bgBrightRed: [101, 49],
      bgBrightGreen: [102, 49],
      bgBrightYellow: [103, 49],
      bgBrightBlue: [104, 49],
      bgBrightMagenta: [105, 49],
      bgBrightCyan: [106, 49],
      bgBrightWhite: [107, 49],

      // legacy styles2 for colors pre v1.0.0
      blackBG: [40, 49],
      redBG: [41, 49],
      greenBG: [42, 49],
      yellowBG: [43, 49],
      blueBG: [44, 49],
      magentaBG: [45, 49],
      cyanBG: [46, 49],
      whiteBG: [47, 49],

    };

    Object.keys(codes).forEach(function(key) {
        var val = codes[key];
        styles2[key] = {
            open: '\u001b[' + val[0] + 'm',
            close: '\u001b[' + val[1] + 'm',
            get:function() { return build([key]) }
        }
    });
