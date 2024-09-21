"use client"

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { PostData, PostsPage } from "@/lib/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function Bookmarks() {
    const {
        data,
        status,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isFetching
    } = useInfiniteQuery({
        queryKey: ["post-feed", "bookmark-info"],
        queryFn: ({ pageParam }) => kyInstance.get(
            "/api/posts/bookmarked",
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
        return <p className="text-center text-muted-foreground">
            You didn't bookmarked any post yet.
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