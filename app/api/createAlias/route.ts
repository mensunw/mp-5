"use server"
import getCollection, { ALIAS_COLLECTION } from "@/db"
import { NextResponse, NextRequest } from 'next/server';

// here's where i got info on this: https://nextjs.org/blog/building-apis-with-nextjs#3-creating-an-api-with-route-handlers
// checks if a url is reachable
async function isReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch (e) {
    console.log(e)
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // get params data
    const searchParams = request.nextUrl.searchParams;
    const alias = searchParams.get('alias');
    const url = searchParams.get('url');

    // alias creation
    const a = {
      alias: alias,
      url: url
    }

    // check if url is valid
    if (url == null || !(await isReachable(url))) {
      return NextResponse.json(
        { error: "Invalid URL: Could not verify URL. Please try again." },
        { status: 400 }
      );
    }

    const aliasCollection = await getCollection(ALIAS_COLLECTION)

    // check if alias exists
    const existing = await aliasCollection.findOne({ alias: alias });

    if (existing) {
      return NextResponse.json(
        { error: `Invalid alias: This alias already exists` },
        { status: 409 }
      );
    }

    // insert into db
    const res = await aliasCollection.insertOne({ ...a })
    // check if insertion was success
    if (!res.acknowledged) {
      return NextResponse.json(
        { error: `Database Error: Please try again later` },
        { status: 500 }
      );
    }

    // return data along with success status
    return NextResponse.json({ ...a, id: res.insertedId.toHexString() }, { status: 200 });

  } catch (e) {
    // random or server error here
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to fetch data, please try again another time' },
      { status: 500 }
    );
  }
}
