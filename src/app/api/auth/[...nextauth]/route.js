
import { handlers } from "@/auth";
import { NextRequest } from "next/server";

function getDynamicOriginRequest(req) {
    const forwardedHost = req.headers.get("x-forwarded-host");
    const host = forwardedHost || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";

    if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
        const publicOrigin = `${proto}://${host}`;
        const currentOrigin = req.nextUrl?.origin;
        if (currentOrigin && currentOrigin !== publicOrigin) {
            const newUrl = req.nextUrl.href.replace(currentOrigin, publicOrigin);
            return new NextRequest(newUrl, req);
        }
    }
    return req;
}

export async function GET(req) {
    return handlers.GET(getDynamicOriginRequest(req));
}

export async function POST(req) {
    return handlers.POST(getDynamicOriginRequest(req));
}

