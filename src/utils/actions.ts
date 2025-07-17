'use server'
import {signIn} from "@/auth";

export async function authenticate(username: string, password: string) {
    try {
        const r = await signIn("credentials", {
            username: username,
            password: password,
            redirect: false,
        })
        return r

    } catch (error) {
        if((error as any).name === "InvalidEmailPasswordError"){
            return {
                error: (error as any).type,
                code: 1
            }
        }
        else if ((error as any).name === "InvalidNotActiveUser"){
            return {
                error: (error as any).type,
                code: 2
            }
        }
    }
}