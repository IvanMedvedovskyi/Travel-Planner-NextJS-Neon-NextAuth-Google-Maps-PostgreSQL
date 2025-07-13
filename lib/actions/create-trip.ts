"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

export async function createTrip(formDate: FormData) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = formDate.get("title") as string;
  const description = formDate.get("description") as string;
  const imageUrl = formDate.get("imageUrl") as string | null;
  const startDateStr = formDate.get("startDate") as string;
  const endDateStr = formDate.get("endDate") as string;

  if (!title || !description || !startDateStr || !endDateStr) {
    throw new Error("All fields are required");
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  await prisma.trip.create({
    data: {
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      userId: session.user.id,
    },
  });

  redirect("/trips");
}
