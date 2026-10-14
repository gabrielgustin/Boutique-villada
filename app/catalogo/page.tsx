import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Instagram, Mail, MessageCircle } from "lucide-react"
import { WhatsAppFloatingButton } from "@/components/landing/whatsapp-button"
import { getWhatsAppUrl } from "@/components/landing/whatsapp-url"

export const metadata: Metadata = {
  title: "Catálogo digital · Boutique ITS Villada",
  description: "Uniformes de aula, gimnasia y taller, buzos y camperas, y kit inicial de la Boutique ITS Villada.",
}

// Contenido del catálogo impreso (Catalogo.pdf) de la boutique, tal cual figura en el folleto.
const WHATSAPP_LABEL = "(0351) 153 862108"
const WHATSAPP_LINK = "https://wa.me/5493513862108"
const INSTAGRAM_URL = "https://www.instagram.com/boutiqueits"
const EMAIL = "boutiqueitsvillada@gmail.com"

type Line = { name: string; detail?: string; sizes?: string }
type Product = { image: string; alt: string; lines: Line[]; tag?: string }
type Section = { id: string; title: string; short: string; color: string; products: Product[] }

const SECTIONS: Section[] = [
  {
    id: "aula",
    title: "Uniforme de aula",
    short: "Aula",
    color: "#2f4fa0",
    products: [
      {
        image: "aula-uniforme",
        alt: "Chomba de piqué blanca con logo bordado y pantalón jogging azul",
        tag: "Personalizado",
        lines: [
          { name: "Chomba de piqué", detail: "Con logo bordado", sizes: "T16 al XXL" },
          { name: "Pantalón jogging largo", detail: "Frisa invisible peinada de abrigo y en rústico sin frisa para media estación", sizes: "T16 al XXL" },
        ],
      },
    ],
  },
  {
    id: "gimnasia",
    title: "Uniforme de gimnasia",
    short: "Gimnasia",
    color: "#e8893f",
    products: [
      {
        image: "gim-remera-pantalon",
        alt: "Remera de gimnasia blanca con logo estampado y pantalón largo azul",
        tag: "Personalizado",
        lines: [
          { name: "Remera de gimnasia", detail: "Con logo estampado", sizes: "T16 al XXL" },
          { name: "Pantalón largo para gimnasia", detail: "Con logo estampado y nombre bordado", sizes: "T16 al XXL" },
        ],
      },
      {
        image: "gim-bermuda",
        alt: "Bermuda de gimnasia azul con remera blanca",
        tag: "Personalizado",
        lines: [{ name: "Bermuda de gimnasia", detail: "Con bolsillos, logo estampado y nombre bordado", sizes: "T14 al XXL" }],
      },
      {
        image: "gim-gorra",
        alt: "Gorra de gabardina blanca y azul con logo ITS Villada",
        lines: [{ name: "Gorra gabardina de gimnasia", detail: "Con logo estampado. Otros modelos disponibles con bordados" }],
      },
    ],
  },
  {
    id: "taller",
    title: "Uniforme de taller",
    short: "Taller",
    color: "#5a8a78",
    products: [
      {
        image: "taller-guardapolvo",
        alt: "Guardapolvo azul para taller con logo",
        tag: "Personalizado",
        lines: [{ name: "Guardapolvo para taller", detail: "Con logo estampado y nombre del alumno bordado", sizes: "T14 al XXL" }],
      },
      {
        image: "taller-estuche",
        alt: "Estuche porta herramientas con herramientas de taller",
        tag: "Personalizado",
        lines: [{ name: "Estuche porta herramientas y herramientas de taller" }],
      },
    ],
  },
  {
    id: "buzos-camperas",
    title: "Buzo y camperas",
    short: "Buzo y camperas",
    color: "#2f4fa0",
    products: [
      {
        image: "buzo",
        alt: "Buzo azul con logo estampado y la inscripción Villada",
        tag: "Personalizado",
        lines: [{ name: "Buzo frisa invisible pesada peinada", detail: "Con logos estampados", sizes: "T14 al XXL" }],
      },
      {
        image: "campera-polar",
        alt: "Campera polar azul con cuello rojo y logo bordado",
        tag: "Personalizada",
        lines: [{ name: "Campera polar antipiling combinada", detail: "Bolsillos con cierres y logo bordado", sizes: "T14 al XXL" }],
      },
      {
        image: "campera-escolar",
        alt: "Campera escolar azul con cuello rojo y puños con vivos",
        tag: "Personalizada",
        lines: [{ name: "Campera escolar combinada, frisa deportiva", detail: "Bolsillos con cierres y logo bordado", sizes: "T14 al XXL" }],
      },
    ],
  },
]

const KIT = {
  id: "kit-inicial",
  title: "Kit inicial",
  short: "Kit inicial",
  color: "#5a8a78",
  images: [
    { image: "kit-papeleria", alt: "Carpetas, hojas A4, portaminas, minas y cartuchera ITSV" },
    { image: "kit-carpeta-escuadras", alt: "Portafolio, tablero y escuadras" },
    { image: "kit-paletas", alt: "Paletas, estuche ITSV porta paleta y pelotitas" },
  ],
  items: ["Cartuchera ITSV", "Paletas, estuche ITSV porta paleta y pelotitas", "Estuche porta herramientas y herramientas de taller"],
}

const NAV = [...SECTIONS.map(({ id, short }) => ({ id, short })), { id: KIT.id, short: KIT.short }]

function ProductCard({ product, color }: { product: Product; color: string }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[4/5] w-full bg-white">
        <Image
          src={`/catalogo/${product.image}.jpg`}
          alt={product.alt}
          fill
          sizes="(min-width: 768px) 320px, (min-width: 640px) 45vw, 90vw"
          className="object-contain p-3"
        />
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm" style={{ backgroundColor: color }}>
            {product.tag}
          </span>
        )}
      </div>
      <ul className="space-y-3 border-t border-neutral-100 p-4">
        {product.lines.map((line) => (
          <li key={line.name}>
            <p className="font-semibold leading-snug text-[#14163a]">{line.name}</p>
            {line.detail && <p className="mt-0.5 text-sm text-neutral-600">{line.detail}</p>}
            {line.sizes && (
              <p className="mt-1.5">
                <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-700">Talles {line.sizes}</span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </article>
  )
}

export default async function CatalogoPage() {
  const whatsappUrl = await getWhatsAppUrl()

  return (
    <main className="min-h-screen bg-[#f6f7fb] pb-28 text-[#14163a]">
      <header className="sticky top-0 z-30 bg-[#231c6b] text-white shadow-md">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            aria-label="Volver al inicio"
            className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold leading-tight">Catálogo digital</h1>
            <p className="truncate text-xs text-white/75">Boutique ITS Villada</p>
          </div>
        </div>
        <nav aria-label="Secciones del catálogo" className="mx-auto w-full max-w-5xl">
          <ul className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map(({ id, short }) => (
              <li key={id} className="shrink-0">
                <a
                  href={`#${id}`}
                  className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-medium transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
                >
                  {short}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="mx-auto w-full max-w-5xl space-y-12 px-4 pt-8">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-32">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-8 w-1.5 rounded-full" style={{ backgroundColor: section.color }} />
              <h2 id={`${section.id}-title`} className="text-2xl font-bold">
                {section.title}
              </h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.products.map((product) => (
                <ProductCard key={product.image} product={product} color={section.color} />
              ))}
            </div>
          </section>
        ))}

        <section id={KIT.id} aria-labelledby={`${KIT.id}-title`} className="scroll-mt-32">
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-8 w-1.5 rounded-full" style={{ backgroundColor: KIT.color }} />
            <h2 id={`${KIT.id}-title`} className="text-2xl font-bold">
              {KIT.title}
            </h2>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {KIT.images.map(({ image, alt }) => (
              <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
                <Image src={`/catalogo/${image}.jpg`} alt={alt} fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw" className="object-contain p-3" />
              </div>
            ))}
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {KIT.items.map((item) => (
              <li key={item} className="rounded-2xl bg-white px-4 py-3 text-sm font-medium shadow-sm ring-1 ring-black/5">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="local-title" className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
          <div className="grid gap-px bg-neutral-100 sm:grid-cols-2">
            <div className="relative aspect-[10/9] bg-white">
              <Image src="/catalogo/local-fachada.jpg" alt="Frente del Instituto Técnico Salesiano Villada, Boutique Uniformes ITS Villada" fill sizes="(min-width: 640px) 480px, 100vw" className="object-cover" />
            </div>
            <div className="relative aspect-[10/9] bg-white sm:aspect-auto">
              <Image src="/catalogo/local-interior.jpg" alt="Herramientas para taller, uniforme completo, probador y stock todo el año" fill sizes="(min-width: 640px) 480px, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="space-y-5 p-6 text-center">
            <h2 id="local-title" className="text-2xl font-bold text-[#231c6b]">
              Abierto todo el año
            </h2>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500">Medios de contacto</p>
              <div className="mt-3 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:flex-wrap">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3 font-semibold text-[#0b3d1f] transition hover:brightness-105"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  {WHATSAPP_LABEL} · WhatsApp
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-100 px-5 py-3 font-semibold transition hover:bg-neutral-200"
                >
                  <Instagram className="h-5 w-5" aria-hidden />
                  boutiqueits
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-100 px-5 py-3 font-semibold transition hover:bg-neutral-200"
                >
                  <Mail className="h-5 w-5" aria-hidden />
                  {EMAIL}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {whatsappUrl && <WhatsAppFloatingButton href={whatsappUrl} />}
    </main>
  )
}
