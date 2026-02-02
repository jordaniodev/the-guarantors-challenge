export const ADDRESS_ABBREVIATIONS: Record<string, string> = {
    st: 'street',
    ave: 'avenue',
    rd: 'road',
    blvd: 'boulevard',
};


export const ADDRESS_REGEX = {
    ZIP: /\b\d{5}(-\d{4})?\b/,
    STREET_NUMBER: /^\d+/,
    STATE_CODE: (state: string) => new RegExp(`\\b${state}\\b`, 'i'),
};
