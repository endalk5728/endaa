'use client';

import { useEffect, useState } from 'react';
import { Backlink } from '@/types/post';

export default function Backlinks() {
  const [backlinks, setBacklinks] = useState<Backlink[]>([]);

  useEffect(() => {
    async function fetchBacklinks() {
      try {
        const response = await fetch('/api/backlinks');
        if (!response.ok) {
          throw new Error('Failed to fetch backlinks');
        }
        const data = await response.json();
        setBacklinks(data.filter((backlink: Backlink) => backlink.is_active));
      } catch (error) {
        console.error('Error fetching backlinks:', error);
      }
    }

    fetchBacklinks();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Our Partners</h2>
      <ul className="space-y-2">
        {backlinks.map((backlink) => (
          <li key={backlink.id}>
            <a
              href={backlink.target_url}
              rel={backlink.rel_attribute}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              {backlink.anchor_text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
