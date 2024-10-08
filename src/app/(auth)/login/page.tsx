import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import loginImage from "@/assets/login-image.jpg";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
    title: "Login"
}

export default function page() {
    return <main className="flex h-screen items-center justify-center p-5">
        <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl overflow-hidden bg-card shadow-2xl">
            <div className="md:w-1/2 w-full space-y-10 overflow-y-auto p-10">
                <div className="space-y-1 text-center">
                    <h1 className="text-3xl font-bold">
                        Login to snapbook
                    </h1>
                    <p className="text-muted-foreground">
                        A place where even <span className="italic">you</span> can find a friend.
                    </p>
                </div>
                <div className="space-y-5">
                    <LoginForm />
                    <Link href={"/signup"}
                        className="block text-center hover:underline"
                    >
                        Don&apos;t have an account? Sign Up here.
                    </Link>
                </div>
            </div>
            <Image
                src={loginImage}
                alt=""
                className="md:w-1/2 hidden md:block object-cover"
            />
        </div>
    </main>
}