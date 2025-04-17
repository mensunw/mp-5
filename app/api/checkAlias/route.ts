"use server"
import getCollection, { ALIAS_COLLECTION } from "@/db"
import { NextResponse, NextRequest } from 'next/server';

// here's where i got info on this: https://nextjs.org/blog/building-apis-with-nextjs#3-creating-an-api-with-route-handlers

export async function GET(request: NextRequest) {
  try {
    // get params data
    const searchParams = request.nextUrl.searchParams;
    const alias = searchParams.get('alias');
    const aliasCollection = await getCollection(ALIAS_COLLECTION)

    // check if alias exists
    const existing = await aliasCollection.findOne({ alias: alias });
    if (!existing) {
      return NextResponse.json(
        { error: `Invalid alias: This alias does not exist` },
        { status: 404 }
      );
    }

    // return url based on the alias
    return NextResponse.json({
      alias: existing.alias,
      url: existing.url,
      id: existing._id.toHexString(),
    });

  } catch (e) {
    // random or server error here
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to fetch data, please try again another time' },
      { status: 500 }
    );
  }
}
