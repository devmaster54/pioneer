export const Colors = {
  White: '#FFFFFF',
  Grey: '#8C96A6',
  LogoPurple: '#4038FF',

  Black: {
    900: '#000000',
    800: '#131519',
    700: '#1F252E',
    600: '#404B5A',
    500: '#5D6B80',
    400: '#8C96A6',
    300: '#C4CCD6',
    200: '#DDE2EB',
    100: '#E8EDF6',
    75: '#EFF3FA',
    50: '#F6F8FC',
    25: '#F9FAFC',

    900.25: '#00000040',
    900.1: '#0000001A',
    700.85: '#1F252ED9',
  },

  Blue: {
    900: '#001AE4',
    800: '#0027EA',
    700: '#002CEF',
    600: '#2734F8',
    500: '#3F38FF',
    400: '#6C6CFF',
    300: '#817EFF',
    200: '#A7AAFF',
    100: '#D3DAFF',
    50: '#E7EBFF',
    300.4: '#817EFF66',
  },

  Green: {
    500: '#3DCFB3',
    400: '#62E1CA',
    400.4: '#62E1CA66',
    300: '#8EE6D6',
    200: '#B0EFE4',
    100: '#CEF5EE',
    50: '#DDF9F4',
  },

  Red: {
    500: '#F42E55',
    400: '#FF3960',
    400.4: '#FF396066',
    300: '#FF6D87',
    200: '#F695A4',
    100: '#FFCBD9',
    50: '#FEEAF1',
  },

  Orange: {
    500: '#FFAA02',
    400: '#FFBB33',
    400.4: '#FFBB3366',
    300: '#FFC654',
    200: '#FFDC98',
    100: '#FFEFCE',
    50: '#FFFAF0',
  },
}

export const BorderRad = {
  s: '2px',
  m: '4px',
  l: '8px',
  full: '1000px',
  round: '50%',
}

export const Sizes = {
  selectHeight: '80px',
  accountHeight: '94px',
}

export const Shadows = {
  transparent: '0px 0px 0px rgba(0, 0, 0, 0)',
  focusDefault: `0px 0px 8px ${Colors.Blue[300.4]}`,
  focusInvalid: `0px 0px 8px ${Colors.Red[400.4]}`,
  focusWarning: `0px 0px 8px ${Colors.Orange[400.4]}`,
  focusValid: `0px 0px 8px ${Colors.Green[400.4]}`,
  common: `0px 12px 28px ${Colors.Black[900.25]}`,
  light: '0px 0px 28px #D6D8E780',
  select: `0px 8px 16px ${Colors.Black[900.1]}`,
}

export const Fonts = {
  Grotesk: '"Grotesk", sans-serif',
  Inter: '"Inter", sans-serif',
}

export const Transitions = {
  all: 'all 0.25s ease',
  duration: '0.25s',
  showResult: '1s',
}

export const Animations = {
  showSymbol: `
    animation: showSymbol ${Transitions.duration} ease;

    @keyframes showSymbol {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  showResultSymbol: `
    animation: showSymbol ${Transitions.showResult} ease;

    @keyframes showSymbol {
      0% {
        opacity: 0;
      }
      25% {
        opacity: 1;
      }
      75% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `,
  showSidePane: `
    animation: showSidePane ${Transitions.duration} ease;

    @keyframes showSidePane {
      0% {
        opacity: 0;
        transform: translateX(100%);
      }
      25% {
        opacity: 1;
      }
      100% {
        transform: translateX(0%);
      }
    }
  `,
  showModalBackground: `
    animation: showModalBackground ${Transitions.duration} ease;

    @keyframes showModalBackground {
      from {
        background-color: transparent;
      }
      to {}
    }
  `,
  showModalBlock: `
    animation: showModalBlock ${Transitions.duration} ease;

    @keyframes showModalBlock {
      from {
        opacity: 0;
        transform: translateY(-24px);
      }
      to {}
    }
  `,
  showHelperTooltip: `
    animation: showHelperTooltip 0.25s ease;
    animation-delay: 0.25s;
    animation-fill-mode: forwards;

    @keyframes showHelperTooltip {
      from {
        opacity: 0;
        transform: translateY(8px);
        visibility: hidden;
      }
      to {
        visibility: visible;
      }
    }
  `,
  showNotification: `
    animation: showNotification ${Transitions.duration} ease;

    @keyframes showNotification {
      from {
        opacity: 0;
        transform: translateX(120%);
      }
      to {
        opactiy: 1;
        transform: translateX(0%);
      }
    }
  `,
}

export const Overflow = {
  DotsTwoLine: `
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    -moz-box-orient: vertical;
    overflow: hidden;
  `,
  Dots: `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
}