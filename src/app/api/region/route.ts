import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "";
    const state = searchParams.get("state") || ""; 

   
}