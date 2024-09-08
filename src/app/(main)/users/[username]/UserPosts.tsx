"use client"

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UserPostsProps {
    userId : string;
}

export default function UserPosts({
    userId
} : UserPostsProps) {
    const {
        data,
        status,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isFetching
    } = useInfiniteQuery({
        queryKey: ["post-feed", "user-posts", userId],
        queryFn: ({ pageParam }) => kyInstance.get(
            `/api/users/${userId}/posts`,
            pageParam ? { searchParams: { cursor: pageParam } } : {}
        ).json<PostsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const posts = data?.pages.flatMap(page => page.posts) || [];

    if (status === "pending") {
        return (
            <PostsLoadingSkeleton />
        )
    }

    if (status === "success" && !posts.length && !hasNextPage) {
        return <p>
            This user hasn&asop;t posted anything yet.
        </p>
    }

    if (status === "error") {
        return (
            <p className="text-center text-destructive">
                An error occurred while fetching the post feed. Please try again later.
            </p>
        )
    }

    return (
        <InfiniteScrollContainer className="space-y-5"
            onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
        >
            {
                posts.map((post) => (
                    <Post key={post.id} post={post} />
                ))
            }

            {
                isFetching && <PostsLoadingSkeleton />
            }
        </InfiniteScrollContainer>
    )
}