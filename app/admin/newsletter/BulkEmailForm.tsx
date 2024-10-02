'use client'
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function BulkEmailForm() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleSendBulkEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/newsletter/send-bulk-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content }),
      });
      
      if (response.ok) {
        toast({
          title: "Emails Sent",
          description: "Bulk email has been sent to all subscribers.",
        });
        setSubject('');
        setContent('');
      } else {
        throw new Error('Failed to send bulk email');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send bulk email. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSendBulkEmail} className="space-y-4">
      <Input
        placeholder="Email Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <Textarea
        placeholder="Email Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <Button type="submit">Send Bulk Email</Button>
    </form>
  );
}
