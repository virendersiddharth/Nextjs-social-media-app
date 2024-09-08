"use client"

import { PostData } from "@/lib/types";
import { useDeletePostMutation } from "./mutations";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";

interface DeletePostDialogProps {
    post : PostData;
    open : boolean;
    onClose : () => void;
}

export default function DeletePostDialog({
    post, open, onClose
} : DeletePostDialogProps){

    const mutation = useDeletePostMutation();

    function handleOpenChange(open: boolean){
        if(!open || !mutation.isPending){
            onClose();
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Post</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete post? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <LoadingButton
                        loading={mutation.isPending}
                        // loading={false}
                        variant={"destructive"}
                        onClick={()=> mutation.mutate(post.id, {onSuccess : onClose})}
                    >
                        Delete 
                    </LoadingButton>
                    <Button
                        disabled={mutation.isPending}
                        variant={"outline"}
                        onClick={() => {
                            onClose()
                            console.log("Delete psot")
                        }}
                    >
                        Cancel
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
)}   