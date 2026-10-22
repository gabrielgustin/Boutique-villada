"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"
import { Check, ChevronRight, Copy, CreditCard, X } from "lucide-react"

const SAME_PRICE = ["Efectivo", "Transferencia", "Tarjeta de débito", "Tarjeta de crédito en 1 pago"]

const INSTALLMENT_GROUPS: { title: string; plans: { label: string; rate: string }[] }[] = [
  { title: "Tarjeta Naranja", plans: [{ label: "Plan Z", rate: "8 %" }] },
  {
    title: "Tarjetas Visa y Mastercard bancarizadas",
    plans: [
      { label: "3 cuotas", rate: "8 %" },
      { label: "6 cuotas", rate: "15 %" },
    ],
  },
]

const TRANSFERS = [
  { title: "Transferencia uniformes (padres)", bank: "BNA+", alias: "ITS.VILLADA.BOUTIQUE", color: "#2b3490" },
  { title: "Transferencia alumnos", bank: "Mercado Pago", alias: "ITS.VILLADA.mp", color: "#ff6a00" },
]

function CopyAlias({ alias }: { alias: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(alias)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // shortcut: sin permiso de portapapeles el alias igual se ve y se puede copiar a mano.
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-[#231c6b]"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  )
}

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231c6b]"

/** Tarjeta "Métodos de pago": al tocarla abre una ventana flotante con el detalle. */
export function PaymentDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={`group flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md ${focus}`}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#231c6b]/10 text-[#231c6b]">
            <CreditCard className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Métodos de pago</span>
            <span className="block text-sm text-neutral-600">Efectivo, transferencia y tarjetas</span>
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
              <CreditCard className="h-6 w-6" aria-hidden />
            </span>
            <Dialog.Title className="mt-4 text-2xl font-bold">Métodos de pago</Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-white/80">Formas de pago disponibles en la boutique.</Dialog.Description>
          </div>

          <div className="space-y-4 p-6">
            <section className="rounded-2xl ring-1 ring-black/5">
              <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3">
                <h3 className="font-semibold">Pago directo</h3>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Mismo precio</span>
              </div>
              <ul className="divide-y divide-neutral-100">
                {SAME_PRICE.map((method) => (
                  <li key={method} className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700">
                    <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                    {method}
                  </li>
                ))}
              </ul>
            </section>

            {TRANSFERS.map((transfer) => (
              <section key={transfer.title} className="rounded-2xl ring-1 ring-black/5">
                <h3 className="border-b border-neutral-100 px-4 py-3 font-semibold" style={{ color: transfer.color }}>
                  {transfer.title}
                </h3>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Alias {transfer.bank}</p>
                    <p className="break-all text-base font-bold text-[#14163a]">{transfer.alias}</p>
                  </div>
                  <CopyAlias alias={transfer.alias} />
                </div>
              </section>
            ))}

            {INSTALLMENT_GROUPS.map((group) => (
              <section key={group.title} className="rounded-2xl ring-1 ring-black/5">
                <h3 className="border-b border-neutral-100 px-4 py-3 font-semibold">{group.title}</h3>
                <ul className="divide-y divide-neutral-100">
                  {group.plans.map((plan) => (
                    <li key={plan.label} className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-neutral-700">
                      <span>{plan.label}</span>
                      <span className="font-semibold text-[#231c6b]">{plan.rate}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
