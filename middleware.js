import { NextResponse } from "next/server";

export function middleware(request) {
  const userAuthToken = request.cookies.get("userAuthToken")?.value;

  if (request.nextUrl.pathname === "/") {
    if (userAuthToken) {
      return NextResponse.redirect(new URL("/search", request.url));
    } else {
      return NextResponse.rewrite(new URL("/", request.url));
    }
  } else if (request.nextUrl.pathname.startsWith("/search")) {
    if (userAuthToken) {
      return NextResponse.rewrite(new URL("/search", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}
