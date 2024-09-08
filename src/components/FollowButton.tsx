"use client"

import useFollowerInfo from "@/hooks/useFollowerInfo";
import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface FollowButtonProps{
    userId : string,
    initialState : FollowerInfo 
}
export default function FollowButton({
    userId,
    initialState
}: FollowButtonProps){

    const {toast} = useToast()

    const queryClient = useQueryClient()
    const queryKey : QueryKey = ["follower-info", userId]

    const {data} = useFollowerInfo(userId, initialState);
    const {mutate} = useMutation({
        mutationFn: async () => 
            data.isFollowedByUser 
                ? kyInstance.delete(`/api/users/${userId}/followers`).json<FollowerInfo>()
                : kyInstance.post(`/api/users/${userId}/followers`).json<FollowerInfo>(),
        onMutate : async () => {
            await queryClient.cancelQueries({queryKey})
            const previousData = queryClient.getQueryData<FollowerInfo>(queryKey)
            queryClient.setQueryData<FollowerInfo>(queryKey, ()=>({
                followers : (previousData?.followers || 0) + (previousData?.isFollowedByUser ? -1 : 1),
                isFollowedByUser :!(previousData?.isFollowedByUser)
            }))
            return {previousData}
        },

        onError(error, variables, context) {
            queryClient.setQueryData<FollowerInfo>(queryKey, context?.previousData)
            console.error(error);
            toast({
                variant:"destructive",
                description: "Something went wrong. Please try again..."
            })
        },    
    });

    return(
        <Button
            variant={data.isFollowedByUser ? "secondary" : "default" }
            onClick={()=> {mutate()}}
        >
            {data.isFollowedByUser ? "Unfollow" : "Follow"}
        </Button>
    )
}