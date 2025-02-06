import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AtSign } from "lucide-react";
import { useId } from "react";

export default function InputWithIcon() {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Input with start icon</Label>
      <div className="relative">
        <Input id={id} className="peer ps-9" placeholder="Email" type="email" />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-neutral-500/80 peer-disabled:opacity-50 dark:text-neutral-400/80">
          <AtSign size={16} strokeWidth={2} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
