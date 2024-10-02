import { ModeToggle } from "./ModeToggle"
import { UserButton } from "./users"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:gap-8">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <MenuIcon className="h-6 w-6" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div className="flex-1" />
      <ModeToggle />
      <UserButton />
    </header>
  )
}
