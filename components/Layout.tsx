import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="container">
      <header>
        <nav>
          <Link href="/">Home</Link>
          {/* Add more navigation links as needed */}
        </nav>
      </header>

      <main>{children}</main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Your Blog Name. All rights reserved.</p>
      </footer>

      <style jsx global>{`
        /* Your global styles here */
      `}</style>
    </div>
  );
}
