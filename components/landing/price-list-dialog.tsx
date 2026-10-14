"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { ChevronRight, MessageCircle, Receipt, TriangleAlert, X } from "lucide-react"

type Row = { name: string; detail?: string; promo?: boolean; price: number | null }
type Group = { title: string; sizes?: string; rows: Row[] }

// Lista de precios vigente (PDF "LISTAS DE PRECIOS_DESDE 14.10.2026"). Precios en efectivo, transferencia o tarjeta de débito.
const GROUPS: Group[] = [
  {
    title: "Chombas",
    sizes: "T12 al TXL",
    rows: [
      { name: "Chomba piqué M/C", promo: true, price: 70000 },
      { name: "Chomba piqué AP 1ra. M/cortas", price: 40000 },
      { name: "Chomba piqué M/L", promo: true, price: 80000 },
      { name: "Chomba piqué AP 1ra. M/largas", price: 45000 },
    ],
  },
  {
    title: "Remeras de gimnasia",
    sizes: "T16 al TXL",
    rows: [
      { name: "Remera gimnasia M/C", promo: true, price: 40000 },
      { name: "Remera gimnasia M/cortas", price: 25000 },
      { name: "Remera gimnasia M/L", promo: true, price: 50000 },
      { name: "Remera gimnasia M/largas", price: 30000 },
    ],
  },
  {
    title: "Taller",
    rows: [{ name: "Guardapolvo taller seguridad", detail: "T14 al T4", price: 54000 }],
  },
  {
    title: "Buzos",
    sizes: "T14 al TXL",
    rows: [
      { name: "Buzo frisa 1ra. uso general", price: 46000 },
      { name: "Buzo frisa intermedia 1ra.", price: 40000 },
    ],
  },
  {
    title: "Pantalones jogging",
    sizes: "T12 al TXL",
    rows: [
      { name: "Pantalón jogging c/frisa", price: 45000 },
      { name: "Pantalón jogging rústico liq.", price: 38000 },
      { name: "Pantalón jogging s/frisa 1ra.", price: 46000 },
    ],
  },
  {
    title: "Bermudas",
    sizes: "T14 al TXL",
    rows: [
      { name: "Bermuda ed. física microfibra", price: 25000 },
      { name: "Bermuda educación física 1ra.", price: 29000 },
    ],
  },
  {
    title: "Camperas",
    sizes: "T16 al TXL",
    rows: [
      { name: "Campera escolar comb. 1ra.", price: 54000 },
      { name: "Campera polar combinada 1ra.", price: 59000 },
    ],
  },
  {
    title: "Otros",
    rows: [
      { name: "Bordado personalizado", detail: "Nombre y apellido · 2 txt", price: 3000 },
      { name: "Cartuchera ITS Villada", detail: "Aula", price: 5000 },
      { name: "Estuche porta herramientas", detail: "Taller", price: 22000 },
      { name: "Kit escolar inicial", detail: "Aula", price: null },
      { name: "Kit escolar inicial dib. técnico", detail: "Aula", price: null },
      { name: "Tablero DT Pizzini 40x50 c/6 pos.", detail: "Aula", price: null },
    ],
  },
]

const money = (value: number) => `$ ${value.toLocaleString("es-AR")}`
const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231c6b]"

type Props = {
  /** Texto de vigencia, p. ej. "14.10.2026 al 31.10.2026". */
  validity: string
  /** Resumen corto para la tarjeta de la portada. */
  summary: string
  expired: boolean
  whatsappUrl: string | null
}

/** Tarjeta "Lista de precios": al tocarla abre una ventana flotante con los precios vigentes. */
export function PriceListDialog({ validity, summary, expired, whatsappUrl }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={`group flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md ${focus}`}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d8392b]/10 text-[#d8392b]">
            <Receipt className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Lista de precios</span>
            <span className="block text-sm text-neutral-600">{summary}</span>
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
              <Receipt className="h-6 w-6" aria-hidden />
            </span>
            <Dialog.Title className="mt-4 text-2xl font-bold">Lista de precios</Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-white/80">Uniforme ITS Villada</Dialog.Description>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-sm font-medium text-neutral-800">
              Vigencia: {validity}
            </p>
          </div>

          <div className="space-y-4 p-6">
            {expired && (
              <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                <p>Esta lista ya no está vigente. Consultá los precios actualizados por WhatsApp.</p>
              </div>
            )}

            <p className="text-sm text-neutral-600">Precios en efectivo, transferencia o tarjeta de débito.</p>

            {GROUPS.map((group) => (
              <section key={group.title} className="overflow-hidden rounded-2xl ring-1 ring-black/5">
                <div className="flex items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50 px-4 py-2.5">
                  <h3 className="font-semibold">{group.title}</h3>
                  {group.sizes && <span className="text-xs font-semibold text-neutral-500">{group.sizes}</span>}
                </div>
                <ul className="divide-y divide-neutral-100">
                  {group.rows.map((row) => (
                    <li key={row.name + (row.promo ? "-promo" : "")} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                      <span className="min-w-0 flex-1 text-neutral-800">
                        {row.name}
                        {row.promo && <span className="ml-2 rounded-full bg-[#d8392b]/10 px-2 py-0.5 text-[11px] font-bold uppercase text-[#d8392b]">Promo x 2</span>}
                        {row.detail && <span className="block text-xs text-neutral-500">{row.detail}</span>}
                      </span>
                      <span className={`shrink-0 font-semibold ${row.promo ? "text-[#d8392b]" : row.price === null ? "text-neutral-500" : "text-[#14163a]"}`}>
                        {row.price === null ? "Consultar" : money(row.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <div className="space-y-1.5 rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
              <p>
                <span className="font-semibold">Tarjetas de crédito:</span> presencial o telefónico.
              </p>
              <p>
                <span className="font-semibold">Importante:</span> si necesita horario especial, coordinar por WhatsApp.
              </p>
            </div>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 font-semibold text-[#0b3d1f] transition hover:brightness-105 ${focus}`}
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                Consultar por WhatsApp
              </a>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
