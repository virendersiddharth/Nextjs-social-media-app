import { Prisma } from "@prisma/client";

export function getUserDetails(loggedInUserId: string){
    return {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        followers : {
            where : {
                followerId : loggedInUserId
            },
            select:{
                followerId: true
            }
        },
        _count : {
            select : {
                followers: true,
                post : true
            }
        }
    } satisfies Prisma.UserSelect
}

export type UserData = Prisma.UserGetPayload<{
    select : ReturnType<typeof getUserDetails>
}>

export function getPostDataIncludes(loggedInUserId: string){
    return {
        user: {
            select : getUserDetails(loggedInUserId),
        }
    } satisfies Prisma.PostInclude;
}



export type PostData = Prisma.PostGetPayload<{
    include: ReturnType<typeof getPostDataIncludes>
}>

export type PostsPage = {
    posts: PostData[],
    nextCursor?: string | null
}

export interface FollowerInfo {
    followers : number;
    isFollowedByUser: boolean;
}