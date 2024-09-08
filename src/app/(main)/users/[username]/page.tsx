import { validateRequest } from "@/auth"
import FollowButton from "@/components/FollowButton"
import FollowerCount from "@/components/FollowerCount"
import TrendsSidebar from "@/components/TrendsSidebar"
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/UserAvatar"
import prisma from "@/lib/prisma"
import { FollowerInfo, getUserDetails, UserData } from "@/lib/types"
import { formatDate } from "date-fns"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import UserPosts from "./UserPosts"
import Linkify from "@/components/Linkify"
import { formatNumber } from "@/lib/utils"
import EditProfileButton from "./EditProfileButton"

interface PageProps {
    params: { username: string }
}

const getUser = cache(async (username: string, loggedInUser: string) => {
    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: username,
                mode: 'insensitive'
            }
        },
        select: getUserDetails(loggedInUser)
    })

    if (!user) notFound()

    return user;
})

// export async function generateMetadata({ params: { username } }: PageProps): Promise<Metadata> {
//     const { user: loggedInUser } = await validateRequest();

//     if (!loggedInUser) return {}

//     const user = await getUser(username, loggedInUser.id)

//     return {
//         title: `${user.displayName} (@${user.username})`
//     }
// }

export default async function page({ params: { username } }: PageProps) {
    const { user: loggedInUser } = await validateRequest();
    //TODO
    if (!loggedInUser) return notFound()
    const user = await getUser(username, loggedInUser.id)
    return (
        <main className=" min-w-0 w-full flex gap-5">
            <div className="w-full min-w-0 space-y-5">
                <UserProfile user={user} loggedInUserId={loggedInUser?.id}/>
                <div
                    className="w-full px-5 py-3 text-center bg-card text-3xl rounded-2xl font-bold"
                >
                    {user.displayName}&apos;s posts
                </div>
                <UserPosts userId={user.id}/>
            </div>
            <TrendsSidebar />
        </main>
    );
}

interface UserProfileProps{
    user : UserData,
    loggedInUserId : string
}

async function UserProfile({user, loggedInUserId} : UserProfileProps) {
    const followerInfo : FollowerInfo = {
        followers: user?._count?.followers | 0,
        isFollowedByUser: !!user.followers.length
    }

    return(
        <div className="h-fit w-full rounded-2xl bg-card p-5 shadow-sm space-y-5">
            <UserAvatar
                avatarUrl={user.avatarUrl}
                size={250}
                className="mx-auto size-full max-w-60 max-h-60 rounded-full"
            />
            <div
                className="flex flex-wrap gap-3 sm:flex-nowrap"
            >
                <div className="me-auto space-y-3">
                    <div>
                        <h1 className="text-3xl font-bold">{user.displayName}</h1>
                        <span className="text-muted-foreground">@{user.username}</span>
                    </div>
                    <div>Member since {formatDate(user.createdAt, "MMM d,yyy")}</div>
                    <div className="flex items-center gap-2">
                        <span>Posts : {formatNumber(user._count.post)}</span>
                        <FollowerCount userId ={user.id} initialState={followerInfo}/>
                    </div>
                </div>
                {
                    user.id === loggedInUserId ? 
                    <EditProfileButton user={user}/>
                    :
                    <FollowButton userId={user.id} initialState={followerInfo}/>
                }
            </div>
            {user.bio && (
                <>
                    <hr />
                    <Linkify>
                        <div
                            className="overflow-hidden whitespace-pre-line break-words"
                        >
                            {user.bio}
                        </div>
                    </Linkify>
                </>
            )}
        </div>
    )
}