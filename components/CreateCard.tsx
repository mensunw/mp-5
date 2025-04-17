'use client'
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CopyButton from "@/components/CopyButton";
import { toast } from 'sonner'

export default function CreateCard() {
  const [alias, setAlias] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [res, setRes] = useState<string>('');

  // get current path
  const pathname = usePathname();

  // for re-routing user to their search result (docs here: https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes)
  const router = useRouter()

  async function getShortenedUrl() {
    try {

      // check if alias is inside collection
      const params = new URLSearchParams({
        alias: alias,
        url: url,
      });

      // insert params into api call
      const response = await (await fetch(`/api/createAlias?${params.toString()}`,
        { method: "POST" }
      )).json()

      // error check
      if (response.error) {
        // toast error
        console.log(response.error)
        toast.error(response.error);
      } else {
        // set the result to be shown if correct
        console.log(response)
        setRes(`${window.location.origin}/r/${alias}`)
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      {/* display card for creating url */}
      <Card className="m-auto mt-12 p-12 w-1/2">
        <CardTitle>Shorten a URL</CardTitle>
        {/* URL input */}
        <CardDescription>URL</CardDescription>
        <Input onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/very/long/url"></Input>
        {/* Alias input */}
        <CardDescription>Custom Alias</CardDescription>
        <Input onChange={(e) => setAlias(e.target.value)} placeholder="your-custom-alias"></Input>
        <Button variant="default" onClick={() => (getShortenedUrl())}>Shorten</Button>
        {/* display URL if result is present */}
        {res ? (
          <Card className="p-2">
            <CardDescription>Your shortened URL:</CardDescription>
            <p>
              <a href={res} target="_blank" className="underline">
                {res}
              </a>
            </p>
            <CopyButton value={res} />
          </Card>
        ) : (
          <div>

          </div>
        )}

      </Card>
    </>
  )
}