'use client'
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Subscriber } from '@/types/post';
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";






export function SubscribersList() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [total, setTotal] = useState(0);
    const [selectedSubscribers, setSelectedSubscribers] = useState<Set<number>>(new Set());
  
    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch(`/api/newsletter/subscribes?page=${page}&pageSize=${pageSize}`);
          if (!response.ok) {
            throw new Error('Failed to fetch subscribers');
          }
          const data = await response.json();
          setSubscribers(data.subscribers);
          setTotal(data.total);
        } catch (error) {
          console.error('Error fetching subscribers:', error);
          // Handle error (e.g., show an error message to the user)
        }
      }
      fetchData();
    }, [page, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  const toggleSelectAll = () => {
    if (selectedSubscribers.size === subscribers.length) {
      setSelectedSubscribers(new Set());
    } else {
      setSelectedSubscribers(new Set(subscribers.map(s => s.id)));
    }
  };

  const toggleSelectSubscriber = (id: number) => {
    const newSelected = new Set(selectedSubscribers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSubscribers(newSelected);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
        <div>
          Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedSubscribers.size === subscribers.length}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[300px]">Email</TableHead>
            <TableHead>Subscribed At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.map((subscriber) => (
            <TableRow key={subscriber.id}>
              <TableCell>
                <Checkbox
                  checked={selectedSubscribers.has(subscriber.id)}
                  onCheckedChange={() => toggleSelectSubscriber(subscriber.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{subscriber.email}</TableCell>
              <TableCell>{new Date(subscriber.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
          Previous
        </Button>
        <span>Page {page} of {totalPages}</span>
        <Button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}
