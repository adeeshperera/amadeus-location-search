import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get('keyword');
  const dotnetUrl = process.env.DOTNET_URL || 'http://localhost:5000';
  
  const res = await fetch(
    `${dotnetUrl}/api/locations/search?keyword=${keyword}`
  );
  const data = await res.json();
  
  return NextResponse.json(data);
}
