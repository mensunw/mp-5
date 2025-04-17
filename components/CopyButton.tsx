'use client'
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CopyButton({ value }: { value: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Failed to copy.");
    }
  };

  return (
    <Button onClick={handleCopy}>
      Copy Link
    </Button>
  );
}
