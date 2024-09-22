import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { deleteComment, submitComment } from "./actions";
import { CommentsPage } from "@/lib/types";

export function useSumitCommentMutation(postId: string){
    const {toast} = useToast()

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: submitComment,
        onSuccess: async (newComment) => {
            const queryKey: QueryKey = ["comments", postId];

            await queryClient.cancelQueries({queryKey})

            queryClient.setQueriesData<InfiniteData<CommentsPage, string | null>>(
                {queryKey: queryKey},
                (oldData) => {
                    const firstPage = oldData?.pages[0]

                    if(firstPage){
                        return{
                            pageParams: oldData.pageParams,
                            pages: [
                                {
                                    comments: [...firstPage.comments, newComment],
                                    previousCursor: firstPage.previousCursor
                                },
                                ...oldData.pages.slice(1)
                            ]
                        }
                    }
                }
            )

            queryClient.invalidateQueries({
                queryKey: queryKey,
                predicate(query){
                    return !query.state.data
                }
            })

            toast({
                variant: "default",
                description: "Comment created"
            })
        },

        onError(error) {
            console.error(error);
            toast({
                variant: "destructive",
                description : "Failed to comment. Please try again"
            })
        }
    })

    return mutation;
}

export function useDeleteCommentMutation() {
    const { toast } = useToast();
  
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: deleteComment,
      onSuccess: async (deletedCommentPostId, deletedCommentId) => {
        console.log("Deleted Comment = ", deletedCommentPostId, deletedCommentId)
        const queryKey: QueryKey = ["comments", deletedCommentPostId];
  
        await queryClient.cancelQueries({ queryKey });
  
        queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
          queryKey,
          (oldData) => {
            if (!oldData) return;
  
            return {
              pageParams: oldData.pageParams,
              pages: oldData.pages.map((page) => ({
                previousCursor: page.previousCursor,
                comments: page.comments.filter((c) => c.id !== deletedCommentId),
              })),
            };
          },
        );
  
        toast({
          description: "Comment deleted",
        });
      },
      onError(error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Failed to delete comment. Please try again.",
        });
      },
    });
  
    return mutation;
  }