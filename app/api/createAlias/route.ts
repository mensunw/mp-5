"use server"
import getCollection, { ALIAS_COLLECTION } from "@/db"
import { NextResponse, NextRequest } from 'next/server';

// here's where i got info on this: https://nextjs.org/blog/building-apis-with-nextjs#3-creating-an-api-with-route-handlers

export async function POST(request: NextRequest) {
  try {
    // get params data
    const searchParams = request.nextUrl.searchParams;
    const alias = searchParams.get('alias');
    const url = searchParams.get('url');

    // 
    const a = {
      alias: alias,
      url: url
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

    if (!res.acknowledged) {
      throw new Error("DB insert failed")
    }

    // return data along with success status
    return NextResponse.json({ ...a, id: res.insertedId.toHexString() }, { status: 200 });

  } catch (e) {
    console.error('Hello API Error:', e);
    return NextResponse.json(
      { error: 'Failed to fetch data, please try again another time' },
      { status: 500 }
    );
  }
}
