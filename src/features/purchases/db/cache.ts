import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getPurchaseGlobalTag() {
  return getGlobalTag("purchases")
}

export function getPurchaseIdTag(id: string) {
  return getIdTag("purchases", id)
}

export function getPurchaseUserTag(id: string) { return `purchase:${id}`; }

export function revalidatePurchaseCache({
  id,
  userId,
}: {
  id: string
  userId: string
}) {
  revalidateTag(getPurchaseGlobalTag())
  revalidateTag(getPurchaseIdTag(id))
  revalidateTag(getPurchaseUserTag(userId))
}