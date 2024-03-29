import * as i18n from '@/languages';

export const supportedCurrencies = {
  ETH: {
    alignment: 'left',
    assetLimit: 0.001,
    currency: 'ETH',
    decimals: 18,
    emoji: '🔷',
    label: i18n.t(i18n.l.settings.currency.ETH),
    mask: '[09999999999]{.}[999999999999999999]',
    placeholder: '0',
    smallThreshold: 0.003,
    symbol: 'Ξ',
    glyph: 'Ξ',
  },
  USD: {
    alignment: 'left',
    assetLimit: 1,
    currency: 'USD',
    decimals: 2,
    emoji: '🇺🇸',
    emojiName: 'united_states',
    label: i18n.t(i18n.l.settings.currency.USD),
    mask: '[099999999999]{.}[00]',
    placeholder: '0.00',
    smallThreshold: 1,
    symbol: '$',
    glyph: '$',
  },
  EUR: {
    alignment: 'left',
    assetLimit: 1,
    currency: 'EUR',
    decimals: 2,
    emoji: '🇪🇺',
    emojiName: 'european_union',
    label: i18n.t(i18n.l.settings.currency.EUR),
    mask: '[099999999999]{.}[00]',
    placeholder: '0.00',
    smallThreshold: 1,
    symbol: '€',
    glyph: '€',
  },
  GBP: {
    alignment: 'left',
    assetLimit: 1,
    currency: 'GBP',
    decimals: 2,
    emoji: '🇬🇧',
    emojiName: 'united_kingdom',
    label: i18n.t(i18n.l.settings.currency.GBP),
    mask: '[099999999999]{.}[00]',
    placeholder: '0.00',
    smallThreshold: 1,
    symbol: '£',
    glyph: '£',
  },
  AUD: {
    alignment: 'left',
    assetLimit: 1,
    currency: 'AUD',
    decimals: 2,
    emoji: '🇦🇺',
    emojiName: 'australia',
    label: i18n.t(i18n.l.settings.currency.AUD),
    mask: '[099999999999]{.}[00]',
    placeholder: '0.00',
    smallThreshold: 1,
    symbol: 'A$',
    glyph: '$',
  },
  CNY: {
    alignment: 'left',
    assetLimit: 1,
    currency: 'CNY',
    decimals: 2,
    emoji: '🇨🇳',
    emojiName: 'china',
    label: i18n.t(i18n.l.settings.currency.CNY),
    mask: '[099999999999]{.}[00]',
    placeholder: '0.00',
    smallThreshold: 5,
    symbol: '¥',
    glyph: '¥',
  },
  KRW: {
    alignment: 'left',
    assetLimit: 1,
    currency: 'KRW',
    decimals: 0,
    emoji: '🇰🇷',
    emojiName: 'south_korea',
    label: i18n.t(i18n.l.settings.currency.KRW),
    mask: '[099999999999]{.}[00]',
    placeholder: '0.00',
    smallThreshold: 1000,
    symbol: '₩',
    glyph: '₩',
  },
  RUB: {
    alignment: 'right',
    assetLimit: 1,
    currency: 'RUB',
    decimals: 2,
    emoji: '🇷🇺',
    emojiName: 'russia',
    label: i18n.t(i18n.l.settings.currency.RUB),
    mask: '[099999999999]{,}[00]',
    placeholder: '0.00',
    smallThreshold: 75,
    symbol: '₽',
    glyph: '₽',
  },
  INR: {
    alignment: 'left',
    assetLimit: 1,
    currency: 'INR',
    decimals: 2,
    emoji: '🇮🇳',
    emojiName: 'india',
    label: i18n.t(i18n.l.settings.currency.INR),
    mask: '[099999999999]{.}[00]',
    placeholder: '0.00',
    smallThreshold: 75,
    symbol: '₹',
    glyph: '₹',
  },
  JPY: {
    alignment: 'left',
    assetLimit: 1,
    currency: 'JPY',
    decimals: 2,
    emoji: '🇯🇵',
    emojiName: 'japan',
    label: i18n.t(i18n.l.settings.currency.JPY),
    mask: '[099999999999]{.}[00]',
    placeholder: '0.00',
    smallThreshold: 100,
    symbol: '¥',
    glyph: '¥',
  },
  TRY: {
    alignment: 'left',
    assetLimit: 1,
    currency: 'TRY',
    decimals: 2,
    emoji: '🇹🇷',
    emojiName: 'turkey',
    label: i18n.t(i18n.l.settings.currency.TRY),
    mask: '[099999999999]{.}[00]',
    placeholder: '0.00',
    smallThreshold: 8,
    symbol: '₺',
    glyph: '₺',
  },
  CAD: {
    alignment: 'left',
    assetLimit: 1,
    currency: 'CAD',
    decimals: 2,
    emoji: '🇨🇦',
    emojiName: 'canada',
    label: i18n.t(i18n.l.settings.currency.CAD),
    mask: '[099999999999]{.}[00]',
    placeholder: '0.00',
    smallThreshold: 1,
    symbol: 'CA$',
    glyph: '$',
  },
  NZD: {
    alignment: 'left',
    assetLimit: 1,
    currency: 'NZD',
    decimals: 2,
    emoji: '🇳🇿',
    emojiName: 'new_zealand',
    label: i18n.t(i18n.l.settings.currency.NZD),
    mask: '[099999999999]{.}[00]',
    placeholder: '0.00',
    smallThreshold: 1.5,
    symbol: 'NZ$',
    glyph: '$',
  },
  ZAR: {
    alignment: 'left',
    assetLimit: 1,
    currency: 'ZAR',
    decimals: 2,
    emoji: '🇿🇦',
    emojiName: 'south_africa',
    label: i18n.t(i18n.l.settings.currency.ZAR),
    mask: '[099999999999]{.}[00]',
    placeholder: '0.00',
    smallThreshold: 15,
    symbol: 'R',
    glyph: 'R',
  },
};

export type SupportedCurrency = typeof supportedCurrencies;
export type SupportedCurrencyKey = keyof SupportedCurrency;
