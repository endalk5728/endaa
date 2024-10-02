import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  LayoutDashboard, Settings,FileText, X, List, FolderPlus, 
  PlusCircle, Tags, Search, Circle, Image, Loader2
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  {
    icon: FileText,
    label: "Posts",
    href: "/admin/posts",
    subItems: [
      { icon: List, label: "Post List", href: "/admin/posts" },
      { icon: FolderPlus, label: "Categories", href: "/admin/posts/categories" },
      { icon: Tags, label: "Tags", href: "/admin/posts/tags" },
    ]
  },
  { icon: Search, label: "SEO", href: "/admin/seo" },
  { icon: Circle, label: "Advertising", href: "/admin/advertising" },
  { icon: Image, label: "Logo & Favicon", href: "/admin/branding" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleExpand = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-background transition-transform duration-200 ease-in-out transform",
      isOpen ? "translate-x-0" : "-translate-x-full",
      "lg:relative lg:translate-x-0"
    )}>
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="font-bold">Admin Dashboard</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="flex-1 border-r bg-background lg:block lg:w-60">
          <nav className="flex flex-col gap-2 p-2">
            {isLoading ? (
              // Skeleton loading
              Array(5).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full mb-2" />
              ))
            ) : (
              sidebarItems.map((item, index) => (
                <div key={index}>
                  {item.subItems ? (
                    <div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => toggleExpand(item.label)}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                      {expandedItem === item.label && (
                        <div className="ml-4 mt-2 flex flex-col gap-2">
                          {item.subItems.map((subItem, subIndex) => (
                            <Link key={subIndex} href={subItem.href} onClick={onClose}>
                              <Button variant="ghost" className="w-full justify-start">
                                <subItem.icon className="mr-2 h-4 w-4" />
                                {subItem.label}
                              </Button>
                            </Link>
                          ))}
                          {item.label === "Posts" && (
                            <Link href="/admin/categories" onClick={onClose}>
                              <Button variant="ghost" className="w-full justify-start">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Category
                              </Button>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href={item.href} onClick={onClose}>
                      <Button variant="ghost" className="w-full justify-start">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  )}
                </div>
              ))
            )}
          </nav>
        </ScrollArea>
        {!isLoading && (
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full" onClick={onClose}>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refresh Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
