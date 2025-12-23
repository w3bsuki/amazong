"use client"

import { useState } from "react"
import { Link } from "@/i18n/routing"
import { DotsThreeVertical, ShareNetwork, Link as LinkIcon, Eye, X } from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { toast } from "sonner"
import { useLocale } from "next-intl"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ProductCardMenuProps {
  productUrl: string
  title: string
}

export function ProductCardMenu({ productUrl, title }: ProductCardMenuProps) {
  const locale = useLocale()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleShare = async (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    const shareUrl = `${window.location.origin}${productUrl}`
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl })
        setDrawerOpen(false)
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      toast.success(locale === 'bg' ? 'Линкът е копиран' : 'Link copied')
      setDrawerOpen(false)
    }
  }

  const handleCopyLink = async (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    const shareUrl = `${window.location.origin}${productUrl}`
    await navigator.clipboard.writeText(shareUrl)
    toast.success(locale === 'bg' ? 'Линкът е копиран' : 'Link copied')
    setDrawerOpen(false)
  }

  const triggerButton = (
    <button 
      className="p-1.5 -mr-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      aria-label="More options"
      onClick={(e) => e.preventDefault()}
    >
      <DotsThreeVertical size={20} weight="bold" />
    </button>
  )

  // Desktop: Dropdown
  if (isDesktop) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {triggerButton}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleShare} className="gap-2.5 cursor-pointer py-2.5">
            <ShareNetwork size={18} />
            {locale === 'bg' ? 'Сподели' : 'Share'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink} className="gap-2.5 cursor-pointer py-2.5">
            <LinkIcon size={18} />
            {locale === 'bg' ? 'Копирай линк' : 'Copy link'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="gap-2.5 cursor-pointer py-2.5">
            <Link href={productUrl}>
              <Eye size={18} />
              {locale === 'bg' ? 'Виж детайли' : 'View details'}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Mobile: Bottom Drawer
  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        {triggerButton}
      </DrawerTrigger>
      <DrawerContent className="pb-6">
        <DrawerHeader className="relative border-b pb-3">
          <DrawerTitle className="text-base font-semibold line-clamp-1 pr-8">
            {title}
          </DrawerTitle>
          <DrawerClose className="absolute right-4 top-4 p-1 rounded-full hover:bg-muted">
            <X size={20} />
          </DrawerClose>
        </DrawerHeader>
        
        <div className="px-4 pt-2">
          {/* Action buttons - large touch targets */}
          <button
            onClick={handleShare}
            className="flex items-center gap-4 w-full px-2 py-4 hover:bg-muted rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <ShareNetwork size={20} />
            </div>
            <span className="text-base font-medium">
              {locale === 'bg' ? 'Сподели' : 'Share'}
            </span>
          </button>
          
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-4 w-full px-2 py-4 hover:bg-muted rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <LinkIcon size={20} />
            </div>
            <span className="text-base font-medium">
              {locale === 'bg' ? 'Копирай линк' : 'Copy link'}
            </span>
          </button>
          
          <Link
            href={productUrl}
            onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-4 w-full px-2 py-4 hover:bg-muted rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Eye size={20} />
            </div>
            <span className="text-base font-medium">
              {locale === 'bg' ? 'Виж детайли' : 'View details'}
            </span>
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
