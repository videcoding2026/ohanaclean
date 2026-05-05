export function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function maskCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

export function maskCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

export function maskCnpj(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

export function maskDocument(v: string, type: "PF" | "PJ") {
  const d = v.replace(/\D/g, "")
  if (type === "PF") return maskCpf(d)
  return maskCnpj(d)
}

export function strip(v: string) {
  return v.replace(/\D/g, "")
}

export function maskTime(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4)
  if (d.length === 0) return ""
  if (d.length <= 2) return `${d} min`
  const h = d.slice(0, -2).replace(/^0+/, "") || "0"
  const m = d.slice(-2)
  return `${h}:${m} H`
}

export function maskDecimal(v: string, isMetric: boolean) {
  if (!isMetric) return v.replace(/\D/g, "")
  const d = v.replace(/\D/g, "")
  if (d.length === 0) return ""
  const padded = d.padStart(4, "0")
  const intPart = padded.slice(0, -3).replace(/^0+/, "") || "0"
  const decPart = padded.slice(-3)
  return `${intPart},${decPart}`
}

export function parseDecimal(v: string, isMetric: boolean): number {
  if (!isMetric) return parseInt(v.replace(/\D/g, "") || "0", 10)
  const d = v.replace(/\D/g, "")
  if (d.length === 0) return 0
  return parseInt(d, 10) / 1000
}

export function maskMoney(v: string) {
  const d = v.replace(/\D/g, "")
  if (d.length === 0) return ""
  const padded = d.padStart(3, "0")
  const intPart = padded.slice(0, -2).replace(/^0+/, "") || "0"
  const decPart = padded.slice(-2)
  return `${intPart},${decPart}`
}

export function parseMoney(v: string): number {
  const d = v.replace(/\D/g, "")
  if (d.length === 0) return 0
  return parseInt(d, 10) / 100
}
