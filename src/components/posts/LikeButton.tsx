import { LikeInfo } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Heart } from "lucide-react";

interface LikeButtonProps{
    postId: string,
    initialState: LikeInfo
}

export default function LikeButton ({
    postId,
    initialState
} : LikeButtonProps) {
    const {toast} = useToast()

    const queryClient = useQueryClient()
    const queryKey : QueryKey = ["like-info", postId]

    const {data} = useQuery({
        queryKey : ["like-info", postId],
        queryFn: async () => 
        kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
        staleTime: Infinity,
        initialData : initialState,
    })

    const {mutate} = useMutation({
        mutationFn: async () => 
            data.isLikedByUser?
            kyInstance.delete(`/api/posts/${postId}/likes`).json<LikeInfo>()
            :
            kyInstance.post(`/api/posts/${postId}/likes`).json<LikeInfo>(),
        onMutate : async () => {
            await queryClient.cancelQueries({queryKey})
            const previousData = queryClient.getQueryData<LikeInfo>(queryKey)
            queryClient.setQueryData<LikeInfo>(queryKey, ()=>({
                likes : (previousData?.likes || 0) + (previousData?.isLikedByUser? -1 : 1),
                isLikedByUser :!(previousData?.isLikedByUser)
            }))
            return {previousData}
        },
        onError(error, variables, context){
            queryClient.setQueryData<LikeInfo>(queryKey, context?.previousData)
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
            <Heart
                className={`size-6 ${data.isLikedByUser? "fill-red-500 text-red-500" : ""}`}
            />
            {
                data.likes > -1 && 
                <span>
                    {data.likes} {data.likes <= 1 ? "like" : "likes"}
                </span>
            }
        </button>
    )
}