import { BookmarkInfo, LikeInfo } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Bookmark, Heart } from "lucide-react";

interface BookmarkedButtonProps{
    postId: string,
    initialState: BookmarkInfo
}

export default function BookmarkedButton ({
    postId,
    initialState
} : BookmarkedButtonProps) {
    const {toast} = useToast()

    const queryClient = useQueryClient()
    const queryKey : QueryKey = ["bookmark-info", postId]

    const {data} = useQuery({
        queryKey : ["bookmark-info", postId],
        queryFn: async () => 
        kyInstance.get(`/api/posts/${postId}/bookmarks`).json<BookmarkInfo>(),
        staleTime: Infinity,
        initialData : initialState,
    })

    const {mutate} = useMutation({
        mutationFn: async () => 
            data.isBookmarkedByUser?
            kyInstance.delete(`/api/posts/${postId}/bookmarks`).json<BookmarkInfo>()
            :
            kyInstance.post(`/api/posts/${postId}/bookmarks`).json<BookmarkInfo>(),
        onMutate : async () => {
            await queryClient.cancelQueries({queryKey})
            const previousData = queryClient.getQueryData<BookmarkInfo>(queryKey)
            queryClient.setQueryData<BookmarkInfo>(queryKey, ()=>({
                isBookmarkedByUser :!(previousData?.isBookmarkedByUser)
            }))
            return {previousData}
        },
        onError(error, variables, context){
            queryClient.setQueryData<BookmarkInfo>(queryKey, context?.previousData)
            console.error(error);
            toast({
                variant:"destructive",
                description: "Something went wrong. Please try again..."
            })
        },
    });

    return(
        <button
            className="like-button flex items-center justify-start gap-2"
            onClick={()=> {mutate()}}
        >
            <Bookmark
                className={`size-6 ${data.isBookmarkedByUser? "fill-primary text-primary" : ""}`}
            />
        </button>
    )
}