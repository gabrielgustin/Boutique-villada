"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "react-qr-code"
import { Download, Printer } from "lucide-react"

// Lámina A4 a 150 ppp: es la misma imagen para la vista previa, la descarga y la impresión.
const WIDTH = 1240
const HEIGHT = 1754
const INDIGO = "#231c6b" // color de la presentación del sitio
const DARK = "#14163a" // QR y textos oscuros
const RED = "#d8392b" // acento de la presentación
const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif'

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function loadImage(src: string, crossOrigin = false) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image()
    if (crossOrigin) image.crossOrigin = "anonymous"
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, size: number, weight: string) {
  let current = size
  ctx.font = `${weight} ${current}px ${FONT}`
  while (ctx.measureText(text).width > maxWidth && current > 18) {
    current -= 2
    ctx.font = `${weight} ${current}px ${FONT}`
  }
}

async function drawPoster(qrSvg: SVGSVGElement, { logoUrl, storeName }: { logoUrl: string | null; storeName: string }) {
  const canvas = document.createElement("canvas")
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext("2d")!
  ctx.textAlign = "center"
  ctx.textBaseline = "alphabetic"

  const [qr, logo] = await Promise.all([
    loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(qrSvg))}`),
    logoUrl ? loadImage(logoUrl, true) : Promise.resolve(null),
  ])

  // Fondo.
  ctx.fillStyle = "#f6f7fb"
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // Cabecera índigo con el borde inferior curvo, como la presentación del sitio.
  const headerEdge = 590
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(WIDTH, 0)
  ctx.lineTo(WIDTH, headerEdge)
  ctx.quadraticCurveTo(WIDTH / 2, headerEdge + 120, 0, headerEdge)
  ctx.closePath()
  ctx.clip()
  ctx.fillStyle = INDIGO
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = "rgba(255,255,255,0.05)"
  for (const [x, y, r] of [[1120, 110, 340], [90, 470, 270], [660, -90, 200]]) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  // Logo dentro de un círculo blanco con aro translúcido.
  const cx = WIDTH / 2
  const cy = 275
  const radius = 190
  ctx.fillStyle = "rgba(255,255,255,0.32)"
  ctx.beginPath()
  ctx.arc(cx, cy, radius + 22, 0, Math.PI * 2)
  ctx.fill()
  ctx.save()
  ctx.shadowColor = "rgba(0,0,0,0.3)"
  ctx.shadowBlur = 50
  ctx.shadowOffsetY = 18
  ctx.fillStyle = "#ffffff"
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  if (logo) {
    const box = radius * 2 * 0.74
    const scale = Math.min(box / logo.width, box / logo.height)
    const w = logo.width * scale
    const h = logo.height * scale
    ctx.drawImage(logo, cx - w / 2, cy - h / 2, w, h)
  } else {
    ctx.fillStyle = INDIGO
    fitText(ctx, storeName, radius * 2 * 0.8, 64, "800")
    ctx.fillText(storeName, cx, cy + 22)
  }

  // Título.
  ctx.fillStyle = INDIGO
  fitText(ctx, "¡Escaneá y hacé tu pedido!", WIDTH - 160, 92, "800")
  ctx.fillText("¡Escaneá y hacé tu pedido!", cx, 800)
  ctx.fillStyle = "#6b7280"
  ctx.font = `400 42px ${FONT}`
  ctx.fillText("Apuntá la cámara de tu celular al código", cx, 872)

  // Código QR en una tarjeta blanca con esquinas de enfoque.
  const frame = 640
  const fx = (WIDTH - frame) / 2
  const fy = 958
  ctx.save()
  ctx.shadowColor = "rgba(35,28,107,0.22)"
  ctx.shadowBlur = 48
  ctx.shadowOffsetY = 16
  ctx.fillStyle = "#ffffff"
  roundedRect(ctx, fx, fy, frame, frame, 48)
  ctx.fill()
  ctx.restore()
  if (qr) {
    const size = frame - 110
    ctx.drawImage(qr, fx + 55, fy + 55, size, size)
  }

  const gap = 34
  const arm = 78
  ctx.strokeStyle = RED
  ctx.lineWidth = 14
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  const l = fx - gap
  const r = fx + frame + gap
  const t = fy - gap
  const bt = fy + frame + gap
  for (const [x, y, dx, dy] of [[l, t, 1, 1], [r, t, -1, 1], [l, bt, 1, -1], [r, bt, -1, -1]]) {
    ctx.beginPath()
    ctx.moveTo(x + dx * arm, y)
    ctx.lineTo(x, y)
    ctx.lineTo(x, y + dy * arm)
    ctx.stroke()
  }

  // Cierre inferior curvo, sin texto.
  ctx.fillStyle = INDIGO
  ctx.beginPath()
  ctx.moveTo(0, HEIGHT)
  ctx.lineTo(0, HEIGHT - 52)
  ctx.quadraticCurveTo(WIDTH / 2, HEIGHT - 120, WIDTH, HEIGHT - 52)
  ctx.lineTo(WIDTH, HEIGHT)
  ctx.closePath()
  ctx.fill()

  return canvas.toDataURL("image/png")
}

export function QrPanel({ url, logoUrl, storeName }: { url: string; logoUrl: string | null; storeName: string }) {
  const [poster, setPoster] = useState<string | null>(null)
  const holder = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const svg = holder.current?.querySelector("svg")
    if (!svg) return
    let cancelled = false
    drawPoster(svg, { logoUrl, storeName }).then((image) => !cancelled && setPoster(image))
    return () => {
      cancelled = true
    }
  }, [url, logoUrl, storeName])

  function download() {
    if (!poster) return
    const link = document.createElement("a")
    link.download = `qr-${storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`
    link.href = poster
    link.click()
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:items-start">
      {/* Al imprimir solo sale la lámina, a página completa. */}
      <style>{`@media print { @page { size: A4; margin: 0 } }`}</style>

      {/* QR de origen: se dibuja oculto y se usa para armar la lámina. */}
      <div ref={holder} className="hidden" aria-hidden>
        <QRCode value={url} size={512} level="M" fgColor={DARK} bgColor="#ffffff" />
      </div>

      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-gray-200 print:max-w-none print:rounded-none print:shadow-none print:ring-0">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt={`Lámina con el código QR de ${storeName}`} className="block h-auto w-full" />
        ) : (
          <div className="flex aspect-[1240/1754] items-center justify-center text-sm text-gray-400">Preparando…</div>
        )}
      </div>

      <div className="space-y-4 print:hidden">
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={download} disabled={!poster} className="inline-flex items-center gap-2 rounded-md bg-[#1e4b8e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e4b8e]/90 disabled:opacity-50">
            <Download className="h-4 w-4" aria-hidden /> Descargar PNG
          </button>
          <button type="button" onClick={() => window.print()} disabled={!poster} className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 transition hover:text-[#1e4b8e] disabled:opacity-50">
            <Printer className="h-4 w-4" aria-hidden /> Imprimir
          </button>
        </div>
        <p className="text-sm text-gray-500">Imprimilo y ponelo en el local, en las bolsas o en tus redes: al escanearlo, tus clientes entran directo a la tienda.</p>
      </div>
    </div>
  )
}
