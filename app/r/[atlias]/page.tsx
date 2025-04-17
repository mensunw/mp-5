'use client'
import { usePathname } from "next/navigation";
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function Results() {
  // get current path aka the query
  const pathname = usePathname();
  // parse it
  const alias = decodeURIComponent(pathname.substring(3));
  const router = useRouter()


  async function checkAlias() {
    try {
      // check if alias is in db
      const params = new URLSearchParams({
        alias: alias
      })

      const response = await (await fetch(`/api/checkAlias?${params.toString()}`,
        { method: "GET" }
      )).json()

      // error check
      if (response.error) {
        // navigate user back to home page if invalid alias
        console.log(response.error)
        router.push("/")
      } else {
        // navigate user to the url if alias exists
        console.log(response)
        window.location.href = response.url;
      }

    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    }


  }
  checkAlias()



  return null
}