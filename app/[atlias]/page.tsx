'use client'
import { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import DisplayIcons from "@/components/DisplayIcons";

import { Icon, IconAPI } from "@/types/types"
export default function Results() {
  // get current path aka the query
  const pathname = usePathname();
  // parse it
  const query = decodeURIComponent(pathname.substring(1));
  const [icons, setIcons] = useState<Icon[]>([]);
  const [error, setError] = useState<string>('');

  // load icons once
  useEffect(() => {
    async function getIcons() {
      try {
        // insert query into api call
        const response = await (await fetch(`/api/getIconData?query=${encodeURIComponent(query)}`)).json()

        // error check
        if (response.error) {
          setError(response.error)
        } else {
          const filteredIcons = response.message.icons.map((icon: IconAPI) => ({
            // parse through until find each attribute within object
            icon_id: icon.icon_id,
            // might not have url of raster size 8
            icon_url: icon.raster_sizes[8]?.formats[0].preview_url ? icon.raster_sizes[8].formats[0].preview_url : null,
            // might not have tags
            tags: icon.tags?.[0] ? icon.tags : [],
          })
          )
          setIcons(filteredIcons)
        }
      } catch (e) {
        console.log("Error trying to fetch API: ", e)
      }
    }
    getIcons()
  }, [])
  // get icons using api call

  return (
    <>
      {/* display the icons if no error fetching from API*/}
      {error ? (
        <h3>{error}</h3>
      ) : (
        <DisplayIcons icons={icons} />
      )}

    </>
  )
}