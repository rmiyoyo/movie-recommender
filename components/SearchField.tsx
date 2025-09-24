import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
interface Props {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
}
export default function SearchField({ value, onChange, onSubmit }: Props) {
  return (
    <div className="flex gap-3 max-w-2xl w-full">
      <Input 
        placeholder="Search for movies..." 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        className="h-12 text-lg border-2 focus:border-primary rounded-xl"
      />
      <Button onClick={onSubmit} size="lg" className="h-12 px-6 rounded-xl">
        <Search className="size-5" />
      </Button>
    </div>
  );
}