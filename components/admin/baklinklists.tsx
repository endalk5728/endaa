'use client';

import { useEffect, useState } from 'react';
import { Backlink } from '@/types/post';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Pencil, Trash2 } from 'lucide-react';
import BacklinkEditDialog from './BacklinkEditDialog';

export default function BacklinkList() {
  const [backlinks, setBacklinks] = useState<Backlink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBacklink, setEditingBacklink] = useState<Backlink | null>(null);

  useEffect(() => {
    fetchBacklinks();
  }, []);

  async function fetchBacklinks() {
    try {
      const response = await fetch('/api/backlinks');
      if (!response.ok) {
        throw new Error('Failed to fetch backlinks');
      }
      const data = await response.json();
      setBacklinks(data);
    } catch (error) {
      console.error('Error fetching backlinks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch backlinks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this backlink?')) {
      try {
        const response = await fetch(`/api/backlinks/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete backlink');
        }

        toast({
          title: 'Backlink deleted',
          description: 'The backlink has been successfully deleted.',
        });

        fetchBacklinks();
      } catch (error) {
        console.error('Error deleting backlink:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete backlink. Please try again.',
          variant: 'destructive',
        });
      }
    }
  }

  function handleEdit(backlink: Backlink) {
    setEditingBacklink(backlink);
  }

  function handleEditComplete() {
    setEditingBacklink(null);
    fetchBacklinks();
  }

  if (isLoading) {
    return <div>Loading backlinks...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Existing Backlinks</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>URL</TableHead>
            <TableHead>Anchor Text</TableHead>
            <TableHead>Target URL</TableHead>
            <TableHead>Rel Attribute</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {backlinks.map((backlink) => (
            <TableRow key={backlink.id}>
              <TableCell>{backlink.url}</TableCell>
              <TableCell>{backlink.anchor_text}</TableCell>
              <TableCell>{backlink.target_url}</TableCell>
              <TableCell>{backlink.rel_attribute}</TableCell>
              <TableCell>
                <Badge variant={backlink.is_active ? 'default' : 'secondary'}>
                  {backlink.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="icon" onClick={() => handleEdit(backlink)} className="mr-2">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(backlink.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingBacklink && (
        <BacklinkEditDialog backlink={editingBacklink} onComplete={handleEditComplete} />
      )}
    </div>
  );
}
