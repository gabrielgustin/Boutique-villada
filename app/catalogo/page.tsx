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

// Contenido del folleto impreso (Catalogo.pdf), con la misma estructura de paneles y colores.
const BLUE = "#2f4fa0"
const ORANGE = "#e8893f"
const GREEN = "#5a8a78"
const RED = "#d8392b"

const WHATSAPP_LABEL = "(0351) 153 862108"
const WHATSAPP_LINK = "https://wa.me/5493513862108"
const INSTAGRAM_URL = "https://www.instagram.com/boutiqueits"
const EMAIL = "boutiqueitsvillada@gmail.com"

type Photo = { file: string; w: number; h: number; alt: string }
type Item = {
  photo: Photo
  /** Texto del folleto: lo que va en negro y, aparte, lo que va en rojo (talles, nombre bordado). */
  name: string
  red?: string
  sizes?: string
  personalized?: boolean
  note?: string
  /** Segundo producto que aparece en la misma foto (por ejemplo, el pantalón). */
  also?: { name: string; sizes?: string }
}
type Panel = { id: string; title: string; short: string; color: string; items: Item[] }

const PANELS: Panel[] = [
  {
    id: "aula",
    title: "Uniforme de aula",
    short: "Aula",
    color: BLUE,
    items: [
      {
        photo: { file: "aula-uniforme", w: 900, h: 1714, alt: "Chomba de piqué blanca con logo bordado y pantalón jogging azul" },
        name: "Chomba de piqué con logo bordado",
        sizes: "T16 al XXL",
        personalized: true,
        also: { name: "Pantalón jogging largo, frisa invisible peinada de abrigo y en rústico sin frisa para media estación", sizes: "T16 al XXL" },
      },
    ],
  },
  {
    id: "gimnasia",
    title: "Uniforme de gimnasia",
    short: "Gimnasia",
    color: ORANGE,
    items: [
      {
        photo: { file: "gim-remera-pantalon", w: 581, h: 993, alt: "Remera de gimnasia blanca con logo estampado y pantalón largo azul" },
        name: "Remera de gimnasia con logo estampado",
        sizes: "T16 al XXL",
        also: { name: "Pantalón largo para gimnasia con logo estampado y nombre bordado", sizes: "T16 al XXL" },
        personalized: true,
      },
      {
        photo: { file: "gim-gorra", w: 348, h: 251, alt: "Gorra de gabardina blanca y azul con logo ITS Villada" },
        name: "Gorra gabardina de gimnasia con logo estampado",
        note: "Otros modelos disponibles con bordados",
      },
      {
        photo: { file: "gim-bermuda", w: 613, h: 1020, alt: "Bermuda de gimnasia azul con remera blanca" },
        name: "Bermuda de gimnasia con bolsillos, logo estampado y nombre bordado",
        sizes: "T14 al XXL",
        personalized: true,
      },
    ],
  },
  {
    id: "taller",
    title: "Uniforme de taller",
    short: "Taller",
    color: GREEN,
    items: [
      {
        photo: { file: "taller-guardapolvo", w: 889, h: 1314, alt: "Guardapolvo azul para taller con logo" },
        name: "Guardapolvo para taller con logo estampado y",
        red: "nombre del alumno bordado",
        sizes: "T14 al XXL",
        personalized: true,
      },
      {
        photo: { file: "taller-estuche", w: 663, h: 679, alt: "Estuche porta herramientas con herramientas de taller" },
        name: "Estuche porta herramientas y herramientas de taller",
        personalized: true,
      },
    ],
  },
  {
    id: "buzos-camperas",
    title: "Buzo y camperas",
    short: "Buzo y camperas",
    color: BLUE,
    items: [
      {
        photo: { file: "buzo", w: 900, h: 776, alt: "Buzo azul con logo estampado y la inscripción Villada" },
        name: "Buzo frisa invisible pesada peinada con logos estampados",
        sizes: "T14 al XXL",
        personalized: true,
      },
      {
        photo: { file: "campera-polar", w: 806, h: 638, alt: "Campera polar azul con cuello rojo y logo bordado" },
        name: "Campera polar antipiling combinada, bolsillos con cierres y logo bordado",
        sizes: "T14 al XXL",
        personalized: true,
      },
      {
        photo: { file: "campera-escolar", w: 721, h: 637, alt: "Campera escolar azul con cuello rojo y puños con vivos" },
        name: "Campera escolar combinada, frisa deportiva, bolsillos con cierres y logo bordado",
        sizes: "T14 al XXL",
        personalized: true,
      },
    ],
  },
]

const KIT = {
  id: "kit-inicial",
  title: "Kit inicial",
  short: "Kit inicial",
  color: GREEN,
  photos: [
    { file: "kit-papeleria", w: 1000, h: 769, alt: "Carpetas, hojas A4, portaminas, minas y cartuchera ITSV" },
    { file: "kit-carpeta-escuadras", w: 1000, h: 658, alt: "Portafolio, tablero y escuadras" },
    { file: "kit-paletas", w: 1000, h: 428, alt: "Paletas, estuche ITSV porta paleta y pelotitas" },
  ] as Photo[],
  items: ["Cartuchera ITSV", "Paletas, estuche ITSV porta paleta y pelotitas", "Estuche porta herramientas y herramientas de taller"],
}

const NAV = [...PANELS.map(({ id, short }) => ({ id, short })), { id: KIT.id, short: KIT.short }, { id: "contacto", short: "Contacto" }]

/** Banner de color con el título en mayúsculas y el logo a la derecha, como en el folleto. */
function Banner({ title, color, id }: { title: string; color: string; id: string }) {
  return (
    <div className="flex items-stretch" style={{ backgroundColor: color }}>
      <h2 id={id} className="flex flex-1 items-center px-4 py-4 text-xl font-extrabold uppercase leading-tight tracking-wide text-white">
        {title}
      </h2>
      <div className="flex shrink-0 items-center bg-white px-3">
        <Image src="/logo-its-boutique.png" alt="ITS Boutique" width={640} height={477} className="h-auto w-16" />
      </div>
      <div aria-hidden className="w-3 shrink-0" style={{ backgroundColor: color }} />
    </div>
  )
}

function ProductBlock({ item }: { item: Item }) {
  return (
    <div className="px-4">
      <Image
        src={`/catalogo/${item.photo.file}.jpg`}
        alt={item.photo.alt}
        width={item.photo.w}
        height={item.photo.h}
        sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 92vw"
        className="mx-auto h-auto w-full max-w-[22rem]"
      />
      <p className="mt-3 text-[15px] font-semibold leading-snug text-neutral-800">
        {item.name}
        {item.red && <span style={{ color: RED }}> {item.red}</span>}
        {item.sizes && <span style={{ color: RED }}> ({item.sizes})</span>}
      </p>
      {item.also && (
        <p className="mt-3 text-[15px] font-semibold leading-snug text-neutral-800">
          {item.also.name}
          {item.also.sizes && <span style={{ color: RED }}> ({item.also.sizes})</span>}
        </p>
      )}
      {item.note && <p className="mt-1.5 text-sm leading-snug text-neutral-600">{item.note}</p>}
      {item.personalized && (
        <p className="mt-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: RED }}>
          Personalizado
        </p>
      )}
    </div>
  )
}

function PanelShell({ id, color, title, children }: { id: string; color: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex scroll-mt-36 flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <Banner id={`${id}-title`} title={title} color={color} />
      <div className="flex-1 space-y-8 py-5">{children}</div>
      <div aria-hidden className="h-5" style={{ backgroundColor: color }} />
    </section>
  )
}

export default async function CatalogoPage() {
  const whatsappUrl = await getWhatsAppUrl()

  return (
    <main className="min-h-screen bg-neutral-100 pb-28 text-neutral-900">
      <header className="sticky top-0 z-30 bg-[#231c6b] text-white shadow-md">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            aria-label="Volver al inicio"
            className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold leading-tight">Catálogo digital</h1>
            <p className="truncate text-xs text-white/75">Boutique Uniformes ITS Villada</p>
          </div>
        </div>
        <nav aria-label="Secciones del catálogo" className="mx-auto w-full max-w-6xl">
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

      <div className="mx-auto grid w-full max-w-6xl items-start gap-5 px-4 pt-6 md:grid-cols-2 lg:grid-cols-3">
        {PANELS.map((panel) => (
          <PanelShell key={panel.id} id={panel.id} title={panel.title} color={panel.color}>
            {panel.items.map((item) => (
              <ProductBlock key={item.photo.file} item={item} />
            ))}
          </PanelShell>
        ))}

        <PanelShell id={KIT.id} title={KIT.title} color={KIT.color}>
          <div className="space-y-4 px-4">
            {KIT.photos.map((photo) => (
              <Image
                key={photo.file}
                src={`/catalogo/${photo.file}.jpg`}
                alt={photo.alt}
                width={photo.w}
                height={photo.h}
                sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 92vw"
                className="mx-auto h-auto w-full max-w-[22rem]"
              />
            ))}
          </div>
          <ul className="space-y-1.5 px-4">
            {KIT.items.map((item) => (
              <li key={item} className="text-[15px] font-semibold text-neutral-800 underline decoration-neutral-400 underline-offset-4">
                {item}
              </li>
            ))}
          </ul>
        </PanelShell>

        {/* Último panel del folleto: el local y los medios de contacto */}
        <section id="contacto" aria-labelledby="contacto-title" className="flex scroll-mt-36 flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <Image
            src="/catalogo/local-fachada.jpg"
            alt="Frente del Instituto Técnico Salesiano Villada, Boutique Uniformes ITS Villada"
            width={1000}
            height={918}
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
            className="h-auto w-full"
          />
          <Image
            src="/catalogo/local-interior.jpg"
            alt="Herramientas para taller, uniforme completo, probador y stock todo el año"
            width={1000}
            height={531}
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
            className="h-auto w-full"
          />
          <h2 id="contacto-title" className="px-4 py-4 text-center text-2xl font-extrabold uppercase tracking-wide text-white" style={{ backgroundColor: BLUE }}>
            Abierto todo el año
          </h2>
          <div className="space-y-4 px-4 py-6 text-center">
            <p className="text-lg font-bold uppercase underline underline-offset-4">Medios de contacto</p>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="mx-auto flex w-fit items-center gap-3 text-xl font-semibold hover:underline">
              <MessageCircle className="h-7 w-7 text-[#25D366]" aria-hidden />
              <span>
                {WHATSAPP_LABEL}
                <span className="block text-base font-bold text-[#1f9d4d]">(WhatsApp)</span>
              </span>
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="mx-auto flex w-fit items-center gap-3 text-xl font-semibold hover:underline">
              <Instagram className="h-7 w-7 text-[#d62976]" aria-hidden />
              boutiqueits
            </a>
            <a href={`mailto:${EMAIL}`} className="mx-auto flex w-fit items-center gap-2 text-base font-semibold hover:underline">
              <Mail className="h-5 w-5 text-neutral-500" aria-hidden />
              {EMAIL}
            </a>
          </div>
        </section>
      </div>

      {whatsappUrl && <WhatsAppFloatingButton href={whatsappUrl} />}
    </main>
  )
}
