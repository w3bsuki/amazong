import Link from "next/link"
import { Menu } from "lucide-react"
import { SidebarMenu } from "@/components/sidebar-menu"

export function MainNav() {
  const links = ["Today's Deals", "Customer Service", "Registry", "Gift Cards", "Sell"]

  return (
    <nav className="bg-[#232f3e] text-white px-4 py-1.5 flex items-center gap-4 text-sm overflow-x-auto whitespace-nowrap">
      <SidebarMenu />
      {links.map((link) => (
        <Link
          key={link}
          href={link === "Sell" ? "/sell" : "#"}
          className="hover:outline outline-1 outline-white p-1 rounded-sm"
        >
          {link}
        </Link>
      ))}
      <div className="ml-auto font-bold hover:outline outline-1 outline-white p-1 rounded-sm hidden md:block">
        Shop great deals now
      </div>
    </nav>
  )
}
