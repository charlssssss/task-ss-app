// export { default } from "next-auth/middleware"
// export const config = { matcher: ["/user/:path*"] }

import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  // console.log(req.nextauth.token.user.role)
  function middleware(req) {
    const url = req.nextUrl.clone()
    url.pathname = `/404`
    
    // is an admin tries to access user pages
    if(req.nextUrl.pathname.startsWith('/user') && req.nextauth.token.user?.role_id == 2) {
      return NextResponse.rewrite(url)  
      // return NextResponse.redirect(new URL("/admin/dashboard?message=unauthorized", req.url))
    }

    // is a user tries to access admin pages
    if(req.nextUrl.pathname.startsWith('/admin') && req.nextauth.token.user?.role_id == 1) {
      return NextResponse.rewrite(url)   
      // return NextResponse.redirect(new URL("/user/dashboard?message=unauthorized", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = { matcher: ["/user/:path*", "/admin/:path*"] }