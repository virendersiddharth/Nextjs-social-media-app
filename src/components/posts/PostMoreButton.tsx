"use client"

import { PostData } from "@/lib/types";
import { useState } from "react";
import DeletePostDialog from "./DeletePostDialog";
import { DropdownMenu, DropdownMenuContent } from "../ui/dropdown-menu";
import { DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash, Trash2 } from "lucide-react";

interface PostMoreButtonProps {
    post: PostData;
    className?: string;
}

export default function PostMoreButton({
    post, className
}: PostMoreButtonProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size={"icon"}
                        variant={"ghost"}
                        className={className}
                    >
                        <MoreHorizontal className="size-5 text-muted-foreground"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="p-3"
                >
                    <DropdownMenuItem
                        onClick={() => {setShowDeleteDialog(true)}}
                        className="flex items-center gap-2 outline-none"
                    >
                        <Trash2 className="size-5 text-destructive"/>
                        <span className="text-destructive">Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeletePostDialog
                post={post}
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
            />
        </>
    )
}