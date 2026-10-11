import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, CalendarCheck, Instagram, ShoppingBag } from "lucide-react"
import { HoursDialog, type HoursDay } from "@/components/landing/hours-dialog"
import { WhatsAppFloatingButton } from "@/components/landing/whatsapp-button"
import { getStoreInfo } from "@/lib/db"

export const metadata: Metadata = {
  title: "Boutique ITS Villada",
  description: "Uniformes del colegio, herramientas de taller y librería técnica. Reservá tu turno o hacé tu pedido online.",
  openGraph: {
    title: "Boutique ITS Villada",
    description: "Uniformes del colegio, herramientas de taller y librería técnica.",
    type: "website",
    locale: "es_AR",
  },
}

// Sistema de turnos de otro proveedor: se enlaza tal cual, sin tocarlo.
const BOOKING_URL = "https://turnostiin.vercel.app/boutiqueitsvillada"
const INSTAGRAM_URL = "https://www.instagram.com/boutiqueits"

// Ubicación: la boutique funciona en el Instituto Técnico Salesiano Villada (Córdoba).
const ADDRESS = "Instituto Técnico Salesiano Villada\nCamino a La Calera, Km 7,5 · Valle Escondido, Córdoba"
const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Instituto Técnico Salesiano Villada, Camino a La Calera Km 7.5, Córdoba")}`

// Lunes a viernes de 8 a 16 hs, hora de Córdoba (el servidor puede estar en otra zona).
const OPEN_HOUR = 8
const CLOSE_HOUR = 16
const TIME_ZONE = "America/Argentina/Cordoba"

const WEEK = [
  { key: "Mon", label: "Lunes" },
  { key: "Tue", label: "Martes" },
  { key: "Wed", label: "Miércoles" },
  { key: "Thu", label: "Jueves" },
  { key: "Fri", label: "Viernes" },
  { key: "Sat", label: "Sábado" },
  { key: "Sun", label: "Domingo" },
]
const WORKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]

function getStatus(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, weekday: "short", hour: "numeric", hour12: false }).formatToParts(now)
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Mon"
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0) % 24
  const isWorkday = WORKDAYS.includes(weekday)

  if (isWorkday && hour >= OPEN_HOUR && hour < CLOSE_HOUR) return { weekday, open: true, label: `Abierto ahora · hasta las ${CLOSE_HOUR} hs` }
  const nextDay = weekday === "Fri" && hour >= CLOSE_HOUR ? "el lunes" : weekday === "Sat" || weekday === "Sun" ? "el lunes" : hour >= CLOSE_HOUR ? "mañana" : "hoy"
  return { weekday, open: false, label: `Cerrado ahora · abre ${nextDay} a las ${OPEN_HOUR} hs` }
}

/** WhatsApp del negocio: el mismo que usa la tienda (/app), cargado en el panel. Sin él, no se muestra el botón. */
async function getWhatsAppUrl() {
  try {
    return (await getStoreInfo()).whatsappUrl
  } catch {
    return null
  }
}

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231c6b]"

export default async function LandingPage() {
  const status = getStatus(new Date())
  const whatsappUrl = await getWhatsAppUrl()
  const days: HoursDay[] = WEEK.map(({ key, label }) => ({
    label,
    hours: WORKDAYS.includes(key) ? `${OPEN_HOUR}:00 a ${CLOSE_HOUR}:00 hs` : null,
    today: key === status.weekday,
  }))

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f7fb] text-[#14163a]">
      {/* Fondo en el azul del logo */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-[#231c6b] [clip-path:ellipse(120%_100%_at_50%_0%)]" />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col px-5 pb-10 pt-10 sm:pt-14">
        {/* Encabezado */}
        <header className="flex flex-col items-center text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-xl ring-4 ring-white/30">
            <Image src="/logo-its-boutique.png" alt="Logo de Boutique ITS Villada" width={640} height={477} priority className="h-auto w-[4.75rem]" />
          </div>

          <h1 className="sr-only">Boutique ITS Villada</h1>

          <p
            className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm ${
              status.open ? "bg-white text-emerald-700" : "bg-white/90 text-neutral-700"
            }`}
          >
            <span aria-hidden className={`h-2 w-2 rounded-full ${status.open ? "bg-emerald-500 motion-safe:animate-pulse" : "bg-neutral-400"}`} />
            {status.label}
          </p>
        </header>

        {/* Acciones principales */}
        <section aria-label="Accesos principales" className="mt-10 grid auto-rows-fr gap-4 sm:grid-cols-2 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex items-center gap-4 overflow-hidden rounded-3xl bg-white p-5 sm:flex-col sm:items-stretch sm:justify-between sm:gap-8 sm:p-6 shadow-xl shadow-[#231c6b]/10 ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-2xl ${focus}`}
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-[#231c6b]" />
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#231c6b] text-white">
              <CalendarCheck className="h-6 w-6" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2 text-xl font-bold">
                Turnos Boutique
                <ArrowUpRight className="h-5 w-5 shrink-0 text-[#231c6b] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </span>
              <span className="mt-1 block text-neutral-600">Reservá tu horario de atención · 60 minutos · Presencial</span>
            </span>
          </a>

          <Link
            href="/app"
            className={`group relative flex items-center gap-4 overflow-hidden rounded-3xl bg-white p-5 sm:flex-col sm:items-stretch sm:justify-between sm:gap-8 sm:p-6 shadow-xl shadow-[#d8392b]/10 ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-2xl ${focus}`}
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-[#d8392b]" />
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d8392b] text-white">
              <ShoppingBag className="h-6 w-6" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2 text-xl font-bold">
                Tienda online
                <ArrowUpRight className="h-5 w-5 shrink-0 text-[#d8392b] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </span>
              <span className="mt-1 block text-neutral-600">Mirá los productos y armá tu pedido online.</span>
            </span>
          </Link>
        </section>

        {/* Datos y redes */}
        <section aria-label="Información" className="mt-8 grid gap-3 sm:grid-cols-2">
          <HoursDialog days={days} open={status.open} statusLabel={status.label} address={ADDRESS} mapUrl={MAP_URL} bookingUrl={BOOKING_URL} />

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md ${focus}`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white">
              <Instagram className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Seguinos en Instagram</p>
              <p className="text-sm text-neutral-600">@boutiqueits</p>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-neutral-400 transition group-hover:text-neutral-700" aria-hidden />
          </a>
        </section>

        <footer className="mt-12 text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Boutique ITS Villada</p>
        </footer>
      </div>

      {whatsappUrl && <WhatsAppFloatingButton href={whatsappUrl} />}
    </main>
  )
}
