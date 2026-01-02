export const BAND_CONTACT = {
  addressLine: 'Via Traversa Campanile 31',
  cityLine: '87059 Casali del Manco (CS) — Località Pedace',
} as const;

export const BAND_ADDRESS_FULL =
  `${BAND_CONTACT.addressLine}, ${BAND_CONTACT.cityLine}` as const;

// Link “apri su Google Maps”
export const MAPS_URL = `https://www.google.com/maps?q=${encodeURIComponent(BAND_ADDRESS_FULL)}` as const;

// Embed senza API key
export const MAPS_EMBED_URL =
  `https://www.google.com/maps?q=${encodeURIComponent(BAND_ADDRESS_FULL)}&output=embed` as const;
