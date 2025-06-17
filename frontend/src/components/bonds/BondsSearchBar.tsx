
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface BondsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const BondsSearchBar: React.FC<BondsSearchBarProps> = ({ value, onChange }) => {
  // Use a ref to keep track of whether we're in initial render
  const firstMount = useRef(true);
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, 500); // 500ms debounce delay

  // Only update parent when debounced value changes (not on first render)
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    
    // Only call onChange if the value has actually changed
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  // Update local state immediately for responsive UI
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="sticky top-14 md:top-16 z-40 bg-[var(--background)] pb-3 sm:pb-4">
      <Card className="shadow-md">
        <CardContent className="p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Input
              placeholder="Search friends..."
              value={inputValue}
              onChange={handleChange}
              className="pl-10 h-11 sm:h-10 text-base sm:text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BondsSearchBar;
