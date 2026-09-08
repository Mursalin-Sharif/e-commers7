"use server";

import { prisma } from "@/lib/prisma";

export type ContactState = { error?: string; success?: string };

export async function contactAction(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) return { error: "Name, email and message are required" };

  try {
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      },
    });
    return { success: "Thank you! Your message has been received. We will contact you soon." };
  } catch {
    return { error: "Could not send message. Please try again." };
  }
}
