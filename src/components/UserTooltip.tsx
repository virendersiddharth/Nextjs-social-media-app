"use client"
import { useSession } from "@/app/(main)/SessionProvider";
import { FollowerInfo, UserData } from "@/lib/types";
import { PropsWithChildren, use } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import FollowButton from "./FollowButton";
import Linkify from "./Linkify";
import FollowerCount from "./FollowerCount";


interface UserTooltipProps extends PropsWithChildren{
    user : UserData
}

export default function UserTooltip({children, user}: UserTooltipProps){
    const {user : loggedInUser} = useSession();

    const followInfo : FollowerInfo = {
        followers: user._count.followers,
        isFollowedByUser:!!user.followers.length,
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent>
                    <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5">
                        <div className="flex items-center justify-between gap-2">
                            <Link href={`/users/${user.username}`}>
                                <UserAvatar size={70} avatarUrl={user.avatarUrl}/>
                            </Link>
                            {
                                loggedInUser.id !== user.id &&
                                <FollowButton userId={user.id} initialState={followInfo}/>
                            }
                        </div>
                        <div>
                            <Link href={`/users/${user.username}`}>
                                <div className="text-lg font-semibold hover:underline">
                                    {user.username}
                                </div>
                                <div className="text-muted-foreground">@{user.username}</div>
                            </Link>
                        </div>
                        {user.bio && (
                            <Linkify>
                                <div className="line-clamp-4 whitespace-pre-line">
                                    {user.bio}
                                </div>
                            </Linkify>
                        )}
                        <FollowerCount userId={user.id} initialState={followInfo}/>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}