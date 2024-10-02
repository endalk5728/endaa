import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon } from "@radix-ui/react-icons";

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/newsletter/subscribes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Newsletter</h3>
      {isSubscribed ? (
        <Alert variant="default" className="bg-green-100 border-green-500 text-green-800">
          <CheckCircledIcon className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            You&apos;ve been successfully added to our newsletter.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubscribe} className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-black border-gray-300"
            required
          />
          <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
            Subscribe
          </Button>
        </form>
      )}
    </div>
  );
}
