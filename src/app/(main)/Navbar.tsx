import UserButton from "@/components/UserButton";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../../components/ModeToggle";
export default function Navbar(){
    return(
        <header className="sticky top-0 z-10 bg-card shadow-sm">
            <div className="mx-auto flex max-w-7xl flex-wrap justify-center items-center px-5 py-3 gap-5">
                <Link href={"/"} className="text-2xl text-primary font-bold mr-auto">
                    bugbook
                </Link>
                <UserButton/>
                <ModeToggle/>
            </div>
        </header>
    )
}