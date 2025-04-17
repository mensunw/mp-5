'use client'
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CopyButton({ value }: { value: string }) {
  // tries to copy text for the button to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      // display toast success msg
      toast.success("Copied to clipboard!");
    } catch (err) {
      // display toast fail msg
      console.error("Copy failed:", err);
      toast.error("Failed to copy.");
    }
  };

  return (
    <>
      <Button onClick={handleCopy}>
        Copy Link
      </Button>
    </>
  );
}
