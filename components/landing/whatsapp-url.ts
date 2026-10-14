import { getStoreInfo } from "@/lib/db"

/** WhatsApp del negocio: el mismo que usa la tienda (/app), cargado en el panel. Sin él, no se muestra el botón. */
export async function getWhatsAppUrl() {
  try {
    return (await getStoreInfo()).whatsappUrl
  } catch {
    return null
  }
}
