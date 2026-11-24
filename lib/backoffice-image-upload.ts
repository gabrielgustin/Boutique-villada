import { upload } from "@vercel/blob/client"
import { removeSolidBackground, visibleBounds } from "@/lib/image-background"

// Generous ceiling for the raw file selected by the user, before any
// client-side resizing happens (fotos de 48 MP de celulares nuevos rondan los 20-30 MB).
const MAX_FILE_SIZE = 50 * 1024 * 1024
// Lo que acepta el almacenamiento si hay que subir el archivo original sin convertir.
const MAX_ORIGINAL_SIZE = 20 * 1024 * 1024
const DISPLAYABLE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const EXTENSION: Record<string, string> = { "image/webp": "webp", "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif" }

// Uniform canvas size every uploaded image is normalized into. Images are
// never cropped: they are scaled to fit inside this square and centered.
// The canvas is left transparent (WebP supports alpha) so logos and other
// images with transparent backgrounds keep it — a filled background would
// bake a solid square behind them wherever they're displayed on a colored
// surface (e.g. the store logo in the header).
const CANVAS_SIZE = 1200
const WEBP_QUALITY = 0.82

export class ImageUploadError extends Error {}

// Algunos navegadores (Chrome en Windows o Android con fotos HEIC) dejan `file.type` vacío:
// por eso también se mira la extensión del nombre.
export const isImageFile = (file: { name: string; type: string }) =>
  file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|avif|bmp|hei[cf])$/i.test(file.name)

export const isHeic = (file: { name: string; type: string }) => /^image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name)

export interface UploadOptions {
  /** Quita un fondo liso (para logos). Si la imagen no lo tiene, se sube igual. */
  removeBackground?: boolean
  /** Avisa si se pudo quitar el fondo. */
  onBackground?: (removed: boolean) => void
}

function toBaseFileName(fileName: string) {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, "")
  const safeName = withoutExtension.replace(/[^a-zA-Z0-9_-]+/g, "-").toLowerCase() || "imagen"
  return safeName
}

/**
 * Resizes/converts an image entirely in the browser using <canvas>, instead
 * of sending it to a server route backed by a native image library (sharp).
 * Native image libraries ship platform-specific binaries that can fail to
 * load depending on the deployment target (architecture, libc, bundler),
 * which is what caused uploads to fail with "Error al optimizar la imagen".
 * The Canvas API has no native dependency: it runs the same way in every
 * browser, so this step can never fail for that reason.
 */
async function resizeToWebp(file: File, options: UploadOptions = {}): Promise<Blob | null> {
  if (typeof document === "undefined") return null

  const objectUrls: string[] = []
  const load = (blob: Blob) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const url = URL.createObjectURL(blob)
      objectUrls.push(url)
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error("No se pudo leer la imagen"))
      img.src = url
    })

  try {
    let image: HTMLImageElement
    try {
      image = await load(file)
    } catch (error) {
      // Chrome, Edge y Firefox no leen fotos HEIC de iPhone: se convierten primero a JPEG.
      // El conversor pesa unos 3 MB, por eso se descarga solo cuando hace falta.
      if (!isHeic(file)) throw error
      const { heicTo } = await import("heic-to/next")
      image = await load(await heicTo({ blob: file, type: "image/jpeg", quality: 0.92 }))
    }

    const canvas = document.createElement("canvas")
    canvas.width = CANVAS_SIZE
    canvas.height = CANVAS_SIZE

    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    // A freshly created canvas is already fully transparent, so no fill is
    // needed here — that's what keeps source transparency intact.

    // Scale to fit inside the square (never crop) and center it, mirroring
    // the "contain" behavior of the previous server-side implementation.
    const scale = Math.min(CANVAS_SIZE / image.width, CANVAS_SIZE / image.height)
    const drawWidth = image.width * scale
    const drawHeight = image.height * scale
    const offsetX = (CANVAS_SIZE - drawWidth) / 2
    const offsetY = (CANVAS_SIZE - drawHeight) / 2

    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)

    let output = canvas
    if (options.removeBackground) {
      // Se trabaja sobre la imagen ya escalada y se recorta el margen que queda vacío.
      const pixels = ctx.getImageData(offsetX, offsetY, Math.round(drawWidth), Math.round(drawHeight))
      const removed = removeSolidBackground(pixels.data, pixels.width, pixels.height)
      options.onBackground?.(removed)
      if (removed) {
        const bounds = visibleBounds(pixels.data, pixels.width, pixels.height)
        if (bounds) {
          const trimmed = document.createElement("canvas")
          trimmed.width = bounds.width
          trimmed.height = bounds.height
          const trimmedCtx = trimmed.getContext("2d")
          const staging = document.createElement("canvas")
          staging.width = pixels.width
          staging.height = pixels.height
          staging.getContext("2d")?.putImageData(pixels, 0, 0)
          if (trimmedCtx) {
            trimmedCtx.drawImage(staging, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height)
            output = trimmed
          }
        }
      }
    }

    const encode = (target: HTMLCanvasElement, type: string, quality?: number) =>
      new Promise<Blob | null>((resolve) => target.toBlob(resolve, type, quality))

    // Some browsers (Safari) ignore the requested type and return PNG or null:
    // only a real webp blob counts.
    const webp = await encode(output, "image/webp", WEBP_QUALITY)
    if (webp?.type === "image/webp") return webp

    // Sin WebP: PNG si la imagen tiene partes transparentes (logos), si no JPEG con fondo blanco
    // (el JPEG no tiene transparencia y los márgenes saldrían negros).
    const area = output === canvas ? { x: offsetX, y: offsetY, w: drawWidth, h: drawHeight } : { x: 0, y: 0, w: output.width, h: output.height }
    const content = output.getContext("2d")?.getImageData(area.x, area.y, Math.max(1, Math.round(area.w)), Math.max(1, Math.round(area.h))).data
    let transparent = false
    for (let i = 3; content && i < content.length; i += 16) {
      if (content[i] < 250) {
        transparent = true
        break
      }
    }
    if (transparent) {
      const png = await encode(output, "image/png")
      return png?.type === "image/png" ? png : null
    }
    const flat = document.createElement("canvas")
    flat.width = output.width
    flat.height = output.height
    const flatCtx = flat.getContext("2d")
    if (!flatCtx) return null
    flatCtx.fillStyle = "#ffffff"
    flatCtx.fillRect(0, 0, flat.width, flat.height)
    flatCtx.drawImage(output, 0, 0)
    const jpeg = await encode(flat, "image/jpeg", 0.85)
    return jpeg?.type === "image/jpeg" ? jpeg : null
  } catch {
    // Formatos que el navegador no sabe leer (por ejemplo HEIC en Chrome o Firefox).
    return null
  } finally {
    objectUrls.forEach((url) => URL.revokeObjectURL(url))
  }
}

/**
 * Uploads an image for the backoffice directly from the browser to Blob
 * storage using a short-lived client token, bypassing the request body size
 * limit that Vercel enforces on Route Handlers/Server Actions (~4.5MB).
 *
 * The image is resized and converted to WebP client-side first (see
 * resizeToWebp above). If that isn't possible for any reason, the original
 * file is uploaded as-is rather than failing the whole upload — some image
 * is always better than a hard error for the user.
 */
export async function uploadBackofficeImage(file: File, options: UploadOptions = {}): Promise<string> {
  if (!isImageFile(file)) {
    throw new ImageUploadError("Elegí un archivo de imagen: JPG, PNG, WebP o una foto del celular.")
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ImageUploadError("La imagen no debe superar los 50 MB")
  }

  const optimized = await resizeToWebp(file, options)

  // Si el navegador no pudo convertirla, solo se sube el original si se puede ver en cualquier navegador.
  if (!optimized) {
    if (isHeic(file)) {
      throw new ImageUploadError("Este navegador no puede leer fotos HEIC de iPhone. Subila desde el celular o guardala como JPG y volvé a intentar.")
    }
    if (!DISPLAYABLE_TYPES.includes(file.type)) {
      throw new ImageUploadError("No se pudo leer la imagen. Probá con una foto JPG o PNG.")
    }
    if (file.size > MAX_ORIGINAL_SIZE) {
      throw new ImageUploadError("No se pudo achicar la imagen y supera los 20 MB. Probá con una foto más liviana.")
    }
  }

  const uploadFile = optimized ?? file
  const fileName = `${toBaseFileName(file.name)}.${EXTENSION[uploadFile.type] ?? "jpg"}`

  try {
    const modeResponse = await fetch("/api/backoffice/upload")
    // La sesión del panel dura 12 horas: con la pestaña abierta desde el día anterior, vence.
    if (modeResponse.status === 401) {
      throw new ImageUploadError("Tu sesión venció. Volvé a iniciar sesión en el panel y subí la imagen de nuevo.")
    }
    const mode = (await modeResponse.json()) as { storage?: string }

    // Desarrollo local: el archivo se guarda en el propio servidor.
    if (mode.storage !== "blob") {
      const body = new FormData()
      body.append("file", uploadFile, fileName)
      const response = await fetch("/api/backoffice/upload", { method: "POST", body })
      const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!response.ok || !data.url) throw new ImageUploadError(data.error ?? "No se pudo subir la imagen")
      return data.url
    }

    const blob = await upload(fileName, uploadFile, {
      access: "public",
      handleUploadUrl: "/api/backoffice/upload/client-token",
      contentType: uploadFile.type,
    })

    return blob.url
  } catch (error) {
    if (error instanceof ImageUploadError) throw error
    console.error("Error subiendo la imagen:", error)
    throw new ImageUploadError("No se pudo subir la imagen. Intenta nuevamente.")
  }
}
