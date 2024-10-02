'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Menu, Github } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Logo from '@/components/logo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Branding } from '@/types/post';


const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), { ssr: false });

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Header() {
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [branding, setBranding] = useState<Branding | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const [categoriesRes, brandingRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/admin/branding')
        ]);

        if (!categoriesRes.ok || !brandingRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const categoriesData = await categoriesRes.json();
        const brandingData = await brandingRes.json();

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          throw new Error('Received categories data is not an array');
        }

        setBranding(brandingData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setCategories([]);
        setBranding(null);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const NavItems = () => (
    <>
      <Link href="/" className="font-medium transition-colors hover:text-primary">
        Home
      </Link>
      {categories.map((category) => (
        <Link key={category.id} href={`/${category.slug}`} className="font-medium transition-colors hover:text-primary">
          {category.name}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-6">
                <NavItems />
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2 md:ml-0">
            <Logo branding={branding} />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <NavItems />
        </nav>

        <div className="flex items-center space-x-2">
          {mounted && <ThemeToggle />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
     
    </header>
  );
}
