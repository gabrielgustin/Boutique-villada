import { randomBytes } from "node:crypto"
import { promises as fs } from "node:fs"
import path from "node:path"
import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { requireBackofficeSession } from "@/lib/backoffice-auth"

// Dónde se guardan las imágenes:
// - Con BLOB_READ_WRITE_TOKEN (Vercel Blob): esta ruta las guarda en Blob desde el servidor.
//   Las fotos ya llegan achicadas desde el navegador, así que entran en el límite de Vercel (4,5 MB)
//   y van por el mismo dominio del sitio: funciona en redes que bloquean vercel.com.
//   Solo un archivo más grande sube directo al almacenamiento con /api/backoffice/upload/client-token.
// - Sin token (desarrollo local): se guarda en ./data/uploads y lo sirve /media.

const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads")
const MAX_BYTES = 4 * 1024 * 1024
const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN)

export async function GET() {
  if (!(await requireBackofficeSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  return NextResponse.json({ storage: useBlob ? "blob" : "local" })
}

// Se identifica el formato por los primeros bytes, no por lo que declare el navegador.
function detectExtension(bytes: Uint8Array) {
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return ".png"
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return ".jpg"
  const riff = String.fromCharCode(...bytes.slice(0, 4)) + String.fromCharCode(...bytes.slice(8, 12))
  if (riff === "RIFFWEBP") return ".webp"
  if (String.fromCharCode(...bytes.slice(0, 4)) === "GIF8") return ".gif"
  return null
}

export async function POST(request: Request) {
  if (!(await requireBackofficeSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const form = await request.formData().catch(() => null)
  const file = form?.get("file")
  if (!(file instanceof File)) return NextResponse.json({ error: "Falta el archivo" }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "La imagen supera los 4 MB" }, { status: 413 })

  const bytes = new Uint8Array(await file.arrayBuffer())
  const extension = detectExtension(bytes)
  if (!extension) return NextResponse.json({ error: "Formato no válido. Usá PNG, JPG, WebP o GIF" }, { status: 415 })

  const name = `${randomBytes(8).toString("hex")}${extension}`
  if (useBlob) {
    try {
      const contentType = { ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" }[extension]
      const blob = await put(name, Buffer.from(bytes), { access: "public", contentType })
      return NextResponse.json({ url: blob.url })
    } catch (error) {
      console.error("Error guardando la imagen en Vercel Blob:", error)
      return NextResponse.json({ error: `No se pudo guardar la imagen en el almacenamiento (${error instanceof Error ? error.message : "error desconocido"})` }, { status: 502 })
    }
  }
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true })
    await fs.writeFile(path.join(UPLOADS_DIR, name), bytes)
  } catch {
    return NextResponse.json({ error: "No se pudo guardar la imagen en el servidor" }, { status: 500 })
  }
  return NextResponse.json({ url: `/media/${name}` })
}
