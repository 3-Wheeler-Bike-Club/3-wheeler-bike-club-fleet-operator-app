export function shortenTxt(
    txt?: string,
    frontSlice = 18,
    backSlice = 9
): string {
    if (!txt) return '';
    if (txt.length < frontSlice + backSlice) return txt;
    return txt.slice(0, frontSlice) + '...' + txt.slice(-backSlice);
}
  

export function shortenAddress(
    txt?: string,
    frontSlice = 9,
    backSlice = 9
): string {
    if (!txt) return '';
    if (txt.length < frontSlice + backSlice) return txt;
    return txt.slice(0, frontSlice) + '...' + txt.slice(-backSlice);
}
  