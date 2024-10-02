import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Banner: React.FC = () => {
  return (
    <div className="relative h-[250px] md:h-[300px] overflow-hidden">
      <div className="absolute inset-0 bg-[url('/path/to/your/texture.png')] opacity-10 dark:opacity-5"></div>
      <Card className="relative z-10 h-full border-none shadow-none bg-transparent">
        <CardContent className="flex flex-col items-center justify-center h-full p-6">
          <CardHeader className="text-center p-0 mb-4">
            <CardTitle className="text-2xl font-bold md:text-4xl mb-2">
              Discover Amazing Content
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Find what you're looking for in seconds
            </CardDescription>
          </CardHeader>
          <div className="flex flex-col w-full max-w-md space-y-2 sm:flex-row sm:space-y-0">
            <Input
              type="text"
              placeholder="Search..."
              className="flex-grow sm:rounded-r-none"
            />
            <Button type="submit" className="w-full sm:w-auto sm:rounded-l-none">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Banner;
