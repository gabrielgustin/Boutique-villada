import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, CalendarDays, ChevronRight, FileText, Instagram, MessageCircle, ShoppingBag } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Boutique ITS Villada",
  description: "Uniformes del colegio, herramientas de taller y librería técnica. Reservá tu turno, mirá la lista de precios o hacé tu pedido online.",
  openGraph: {
    title: "Boutique ITS Villada",
    description: "Uniformes del colegio, herramientas de taller y librería técnica.",
    type: "website",
    locale: "es_AR",
  },
}

// Sistema de turnos de otro proveedor: se enlaza tal cual, sin tocarlo.
const BOOKING_URL = "https://turnostiin.vercel.app/boutiqueitsvillada"

const OFFERS = ["Uniformes del Colegio", "Herramientas de Taller", "Librería Técnica y Apuntes"]

type LinkItem = { label: string; href: string; Icon: LucideIcon; external?: boolean; tone: string }

const LINKS: LinkItem[] = [
  { label: "Tienda online", href: "/app", Icon: ShoppingBag, tone: "text-blue-700 bg-blue-50" },
  {
    label: "Lista de Precios",
    href: "https://drive.google.com/file/d/1oijz_FW2yI4xsCP3kQn-By-Z5l_9NiTP/view?usp=drive_link",
    Icon: FileText,
    external: true,
    tone: "text-indigo-700 bg-indigo-50",
  },
  {
    label: "Catálogo",
    href: "https://drive.google.com/file/d/1tqUrIhE-XLddm5Gdlh-KXUgu8HiQcCgh/view?usp=drive_link",
    Icon: BookOpen,
    external: true,
    tone: "text-violet-700 bg-violet-50",
  },
  { label: "Instagram", href: "https://www.instagram.com/boutiqueits", Icon: Instagram, external: true, tone: "text-pink-700 bg-pink-50" },
  { label: "WhatsApp", href: "https://wa.me/543513862108", Icon: MessageCircle, external: true, tone: "text-green-700 bg-green-50" },
]

const card =
  "group flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-white via-white to-indigo-50/60 px-4 pb-8 pt-12 text-neutral-900 sm:pt-16">
      <div className="flex w-full max-w-md flex-1 flex-col items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5">
          <Image src="/logo-its-boutique.png" alt="Logo de Boutique ITS Villada" width={640} height={477} priority className="h-auto w-20" />
        </div>

        <h1 className="mt-6 text-balance text-center text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
          Boutique ITS Villada
        </h1>

        <div className="mt-5 space-y-1.5 text-center text-neutral-600">
          <p>Bienvenidos a la Boutique del ITS Villada</p>
          <p>Horarios de atención: lunes a viernes de 8 a 16 hs</p>
          <ul className="pt-1">
            {OFFERS.map((offer) => (
              <li key={offer}>
                <span aria-hidden>☀️</span> {offer}
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Accesos" className="mt-8 flex w-full flex-col gap-3">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl bg-gradient-to-r from-neutral-900 via-indigo-950 to-indigo-700 px-5 py-4 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <CalendarDays className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">Turnos Boutique</span>
              <span className="block text-sm text-white/75">60 minutos • Presencial</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-0.5" aria-hidden />
          </a>

          {LINKS.map(({ label, href, Icon, external, tone }) => {
            const content = (
              <>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1 font-medium">{label}</span>
                <ChevronRight className="h-5 w-5 shrink-0 text-neutral-400 transition group-hover:translate-x-0.5" aria-hidden />
              </>
            )
            return external ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={card}>
                {content}
              </a>
            ) : (
              <Link key={label} href={href} className={card}>
                {content}
              </Link>
            )
          })}
        </nav>
      </div>

      <footer className="mt-10 text-sm text-neutral-500">© {new Date().getFullYear()} Boutique ITS Villada</footer>
    </main>
  )
}
