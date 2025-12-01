export default function SellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout removes the main site header/footer for seller flows
  // The children will render with their own minimal headers
  return (
    <>
      {children}
    </>
  )
}
