import "server-only"; 
import { cookies } from "next/headers";  
import { authenticateToken } from "@/utils/backend-endpoints";

export async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        return { data: { user: null } };
    }

    const response = await authenticateToken(token);

    // console.log(response);

    return { data: { user: response } };
}