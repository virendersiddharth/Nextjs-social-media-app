"use client"

import { LikeInfo, PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "@/app/(main)/SessionProvider";
import PostMoreButton from "./PostMoreButton";
import Linkify from "../Linkify";
import UserTooltip from "../UserTooltip";
import LikeButton from "./LikeButton";
import BookmarkedButton from "./BookmarkedButton";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import Comments from "../comments/Comments";

interface PostProps {
    post: PostData
}

export default function Post({ post }: PostProps) {

    const [showComments, setShowComments] = useState(false)

    const { user } = useSession();
    const initialState: LikeInfo = {
        likes: post._count.likes,
        isLikedByUser:!!post.likes.length,
    }

    return (
        <article
            className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm"
        >
            <div className="flex justify-between gap-3">

                <div className="flex flex-wrap gap-3">
                    <UserTooltip user={post.user}>

                        <Link href={`/users/${post.user.username}`}>
                            <UserAvatar avatarUrl={post.user.avatarUrl} />
                        </Link>
                    </UserTooltip>
                    <div>
                        <UserTooltip user={post.user}>
                            <Link href={`/users/${post.user.username}`}
                                className="block font-medium hover:underline"
                            >
                                {post.user.username}
                            </Link>
                        </UserTooltip>
                        <Link href={`/posts/${post.id}`}
                            className="block text-sm text-muted-foreground hover:underline"
                        >
                            {
                                formatRelativeDate(post.createdAt)
                            }
                        </Link>
                    </div>
                </div>

                {
                    user?.id === post.user.id &&
                    <PostMoreButton post={post} className="opacity-0 transition-opacity group-hover/post:opacity-100" />
                }
            </div>
            <Linkify>
                <div className="whitespace-pre-line break-words">
                    {post.content}
                </div>
            </Linkify>
            <hr />
            <div className="flex justify-between gap-5 items-center">
                <div className="flex items-center gap-5">
                    <LikeButton postId={post.id} initialState={initialState}/>
                    <CommentButton post={post} onClick={() => setShowComments(!showComments)}/>
                </div>
                <BookmarkedButton postId={post.id} initialState={{
                    isBookmarkedByUser : post.bookmarks.some((bookmark) => (
                        bookmark.userId === user?.id
                    ))
                }}/>
            </div>
            {
                showComments && 
                <Comments post={post}/>
            }
        </article>
    )
}

interface CommentButtonProps{
    post: PostData,
    onClick: ()=> void
}

export function CommentButton({ post, onClick }: CommentButtonProps){
    return (
        <button
            className="flex items-center gap-2"
            onClick={onClick}
        >
            <MessageSquare className="size-5"/>
            <span>
                {post._count.comments} {" "}
                <span className="hidden sm:inline">Comments</span>
            </span>
        </button>
    )
}