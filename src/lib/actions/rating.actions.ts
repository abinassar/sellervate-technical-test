"use server";

import { revalidatePath } from "next/cache";
import { rateMessage } from "@/lib/db/repositories/messages.repository";

export async function rateMessageAction(
  messageId: string,
  qualityLevelId: string,
  ratingUserId: string
) {
  try {
    if (!messageId || !qualityLevelId || !ratingUserId) {
      return { success: false, error: "Faltan parámetros requeridos para la calificación." };
    }

    const updated = await rateMessage(messageId, qualityLevelId, ratingUserId);
    if (!updated) {
      return { success: false, error: "No se encontró el mensaje o no pudo ser actualizado." };
    }

    revalidatePath("/home");
    revalidatePath(`/conversation/${updated.idConversation}`);

    return { success: true, message: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado al calificar el mensaje.",
    };
  }
}

