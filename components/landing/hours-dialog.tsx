"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { ArrowUpRight, CalendarCheck, ChevronRight, Clock, MapPin, X } from "lucide-react"

export type HoursDay = { label: string; hours: string | null; today: boolean }

type Props = {
  days: HoursDay[]
  open: boolean
  statusLabel: string
  address: string | null
  mapUrl: string | null
  bookingUrl: string
}

/** Une días seguidos con el mismo horario: "Lunes a viernes", "Sábado y domingo". */
function groupDays(days: HoursDay[]): HoursDay[] {
  const groups: { first: string; last: string; count: number; hours: string | null; today: boolean }[] = []
  for (const day of days) {
    const previous = groups[groups.length - 1]
    if (previous && previous.hours === day.hours) {
      previous.last = day.label
      previous.count += 1
      previous.today ||= day.today
    } else {
      groups.push({ first: day.label, last: day.label, count: 1, hours: day.hours, today: day.today })
    }
  }
  return groups.map(({ first, last, count, hours, today }) => ({
    label: count === 1 ? first : count === 2 ? `${first} y ${last.toLowerCase()}` : `${first} a ${last.toLowerCase()}`,
    hours,
    today,
  }))
}

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231c6b]"

/** Tarjeta "Horario de atención": al tocarla abre una ventana flotante con el detalle. */
export function HoursDialog({ days, open, statusLabel, address, mapUrl, bookingUrl }: Props) {
  const today = days.find((day) => day.today)

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={`group flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md ${focus}`}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d8392b]/10 text-[#d8392b]">
            <Clock className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Horario de atención</span>
            <span className="block text-sm text-neutral-600">Lunes a viernes de 8 a 16 hs</span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-neutral-700" aria-hidden />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#14163a]/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          <div className="relative bg-[#231c6b] px-6 pb-6 pt-7 text-white">
            <Dialog.Close
              aria-label="Cerrar"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
            >
              <X className="h-5 w-5" aria-hidden />
            </Dialog.Close>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Clock className="h-6 w-6" aria-hidden />
            </span>
            <Dialog.Title className="mt-4 text-2xl font-bold">Horario de atención</Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-white/80">Atención presencial en la boutique.</Dialog.Description>
            <p className={`mt-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ${open ? "bg-white text-emerald-700" : "bg-white/90 text-neutral-700"}`}>
              <span aria-hidden className={`h-2 w-2 rounded-full ${open ? "bg-emerald-500" : "bg-neutral-400"}`} />
              {statusLabel}
            </p>
          </div>

          <div className="space-y-5 p-6">
            <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl ring-1 ring-black/5">
              {groupDays(days).map((day) => (
                <li
                  key={day.label}
                  className={`flex items-center justify-between gap-3 px-4 py-3 text-sm ${day.today ? "bg-[#231c6b]/5 font-semibold text-[#231c6b]" : "text-neutral-700"}`}
                >
                  <span className="flex items-center gap-2">
                    {day.label}
                    {day.today && <span className="rounded-full bg-[#231c6b] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">Hoy</span>}
                  </span>
                  <span className={day.hours ? "" : "text-neutral-400"}>{day.hours ?? "Cerrado"}</span>
                </li>
              ))}
            </ul>

            {today && !today.hours && <p className="text-sm text-neutral-600">Hoy la boutique no atiende. Podés reservar un turno para otro día.</p>}

            {address && (
              <div className="flex items-start gap-3 rounded-2xl bg-neutral-50 p-4 text-sm">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#d8392b]" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Dónde estamos</p>
                  <p className="whitespace-pre-line text-neutral-600">{address}</p>
                  {mapUrl && (
                    <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={`mt-2 inline-flex items-center gap-1 font-semibold text-[#231c6b] hover:underline ${focus}`}>
                      Cómo llegar <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </a>
                  )}
                </div>
              </div>
            )}

            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-[#231c6b] px-5 py-3.5 font-semibold text-white transition hover:bg-[#2c2386] ${focus}`}
            >
              <CalendarCheck className="h-5 w-5" aria-hidden />
              Reservar un turno
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
