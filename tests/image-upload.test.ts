import { describe, expect, it } from "vitest"
import { isHeic, isImageFile, targetSize } from "@/lib/backoffice-image-upload"

describe("isImageFile", () => {
  it("acepta imágenes por tipo", () => {
    expect(isImageFile({ name: "foto", type: "image/jpeg" })).toBe(true)
    expect(isImageFile({ name: "x.bin", type: "image/heic" })).toBe(true)
  })
  it("acepta fotos sin tipo si la extensión es de imagen (Chrome en Windows con HEIC)", () => {
    expect(isImageFile({ name: "IMG_1234.HEIC", type: "" })).toBe(true)
    expect(isImageFile({ name: "remera.jpeg", type: "" })).toBe(true)
  })
  it("rechaza lo que no es imagen", () => {
    expect(isImageFile({ name: "lista.pdf", type: "application/pdf" })).toBe(false)
    expect(isImageFile({ name: "sin-extension", type: "" })).toBe(false)
  })
})

describe("isHeic", () => {
  it("reconoce HEIC y HEIF por tipo o por extensión", () => {
    expect(isHeic({ name: "a.jpg", type: "image/heic" })).toBe(true)
    expect(isHeic({ name: "IMG_1.heif", type: "" })).toBe(true)
    expect(isHeic({ name: "foto.jpg", type: "image/jpeg" })).toBe(false)
  })
})

describe("targetSize", () => {
  it("conserva la proporción sin relleno (antes quedaba un cuadrado con franjas)", () => {
    expect(targetSize(3000, 4000)).toMatchObject({ canvasWidth: 1200, canvasHeight: 1600, offsetX: 0, offsetY: 0 })
    expect(targetSize(4000, 1500)).toMatchObject({ canvasWidth: 1600, canvasHeight: 600 })
  })
  it("no agranda las imágenes chicas", () => {
    expect(targetSize(640, 480)).toMatchObject({ canvasWidth: 640, canvasHeight: 480 })
  })
  it("el favicon se centra en un cuadrado", () => {
    expect(targetSize(400, 200, true)).toMatchObject({ canvasWidth: 400, canvasHeight: 400, offsetX: 0, offsetY: 100 })
  })
})
