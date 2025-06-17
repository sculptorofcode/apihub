
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  return (
    <div className="flex-1 max-w-md mx-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search ideas, people, or tags..."
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:bg-white/20"
        />
      </div>
    </div>
  );
};

export default SearchBar;
