"use client"

import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { LogOutIcon, UserIcon } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";

interface UserButtonProps{
    className ?: string;
}
export default function UserButton({className} : UserButtonProps){

    const {user} = useSession();
    const queryClient = useQueryClient();

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-fit h-fit p-0 grid place-content-center">
                    <UserAvatar avatarUrl={user.avatarUrl} size={40} className="rounded-md"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="bg-secondary py-3 px-5 drop-shadow-lg border rounded-md"
            >
                <DropdownMenuItem className="outline-none">
                    Logged in as @{user.username}
                </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <Link href={`/users/${user.username}`}>
                <DropdownMenuItem className="flex items-center gap-2 outline-none">
                    <UserIcon className="size-4"/>
                    Profile
                </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator/>
            <DropdownMenuItem className="flex items-center gap-2 outline-none"
                onClick={()=>{
                    queryClient.clear();
                    logout();
                }}
            >
                <LogOutIcon className="size-4"/>
                Logout
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}