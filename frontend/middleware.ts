// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';




export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('jwt'); 


  console.log(sessionCookie)



  if (!sessionCookie) {
    
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/check`, {
      headers: {
   
        Cookie: `jwt=${sessionCookie.value}`,
      },
    });


    

    if (!res.ok) {
        throw new Error("Auth check failed");
    }

    const data = await res.json();

    // 3. Check if the user is an admin
    if (data.user?.role === 'admin') {
      // If they are an admin, let them proceed
      return NextResponse.next();
    } else {
      // If they are logged in but not an admin, redirect to the homepage or an "unauthorized" page
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  } catch (error) {
    console.error("Middleware error:", error);
    // If verification fails for any reason, redirect to login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

// This config specifies which routes the middleware should run on
export const config = {
  matcher: '/dashboard/:path*', // Protects /dashboard and all its sub-routes
};