import "server-only"; 
import { NextRequest, NextResponse } from "next/server";  
import { logger } from "@/lib/default-logger";  
import { getUser } from "./server";
import { paths } from "@/paths";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next({ request: req }); 
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
        const { data } = await getUser(); 
        if (!data?.user) {
            logger.debug("[Middleware] User is not logged in, redirecting to sign in");
            const redirectTo = new URL(paths.auth.signIn, req.url);
            return NextResponse.redirect(redirectTo);
        }
    } 
    return res;
}