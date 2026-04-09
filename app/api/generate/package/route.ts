import { NextResponse } from 'next/server';
import { generatePackage } from '@/lib/workflow/generatePackage';
import type { Brand, ContentItem } from '@/types/system';

export async function POST(req: Request) {
  const body = (await req.json()) as { brand: Brand; content: ContentItem };

  if (!body?.brand || !body?.content) {
    return NextResponse.json({ error: 'brand and content are required' }, { status: 400 });
  }

  const result = generatePackage(body.brand, body.content);
  return NextResponse.json(result);
}
