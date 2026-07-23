export function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

export function fmtTime(d: Date) {
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function maskNip(nip: string) {
  return nip;
}

export function maskNama(nama: string) {
  return nama;
}
