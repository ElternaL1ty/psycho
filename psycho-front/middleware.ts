import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {
    let path = request.nextUrl.pathname
    if(path != '/'){
        if(!request.cookies.has('assistX-token')){
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
    if(path == '/'){
        if(request.cookies.has('assistX-token')){
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }
    const response = NextResponse.next();
    return response;
}
export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  };