import { redirect } from "next/navigation"

export default async function EditProductPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id: productId } = await searchParams

  if (productId) {
    redirect(`/account/selling/${productId}/edit`)
  }

  redirect("/account/selling")
}
