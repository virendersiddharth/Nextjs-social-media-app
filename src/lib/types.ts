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
        },
        likes: {
            where: {
              userId: loggedInUserId,
            },
            select: {
              userId: true,
            },
        },
        bookmarks: {
            where: {
                userId : loggedInUserId
            },
            select: {
                userId: true,
            },
        },
        _count: {
            select: {
              likes: true,
              comments: true,
            },
        },
    } satisfies Prisma.PostInclude;
}



export type PostData = Prisma.PostGetPayload<{
    include: ReturnType<typeof getPostDataIncludes>
}>

export type PostsPage = {
    posts: PostData[],
    nextCursor?: string | null
}

export const notificationsInclude = {
    issuer: {
      select: {
        username: true,
        displayName: true,
        avatarUrl: true,
      },
    },
    post: {
      select: {
        content: true,
      },
    },
  } satisfies Prisma.NotificationInclude;
  
  export type NotificationData = Prisma.NotificationGetPayload<{
    include: typeof notificationsInclude;
  }>;
  
  export interface NotificationsPage {
    notifications: NotificationData[];
    nextCursor: string | null;
  }

  export interface NotificationCountInfo {
    unreadCount: number;
  }

export function getCommentDataInclude(loggedInUserId: string){
    return {
        user : {
            select : getUserDetails(loggedInUserId),
        },
    } satisfies Prisma.CommentInclude
}

export type CommentData = Prisma.CommentGetPayload<{
    include: ReturnType<typeof getCommentDataInclude>
}>

export interface CommentsPage{
    comments: CommentData[],
    previousCursor?: string | null
}

export interface FollowerInfo {
    followers : number;
    isFollowedByUser: boolean;
}

export interface LikeInfo {
    likes : number;
    isLikedByUser: boolean;
}

export interface BookmarkInfo {
    isBookmarkedByUser : boolean;
}