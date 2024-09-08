"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import PlaceHolder from "@tiptap/extension-placeholder"
import { submitPost } from "./action"
import { useSession } from "@/app/(main)/SessionProvider"
import UserAvatar from "@/components/UserAvatar"
import { Button } from "@/components/ui/button"
import "./styles.css"
import LoadingButton from "@/components/LoadingButton"
import { useTransition } from "react"
import { useSubmitPostMutation } from "./mutations"
import Link from "next/link"

export default function PostEditor() {

    const { user } = useSession()

    const  mutation = useSubmitPostMutation();

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false
            }),
            PlaceHolder.configure({
                placeholder: "What's crack-a-lackin'?"
            })
        ]
    })

    const input = editor?.getText({
        blockSeparator: "\n",
    }) || "";

    async function onSubmit() {
        mutation.mutate(input, {
            onSuccess : () => {
                editor?.commands.clearContent();
            }
        })
    }

    return (
        <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex gap-5">
                <Link href={`/users/${user.username}`}>
                    <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
                </Link>
                <EditorContent
                    editor={editor}
                    className="w-full max-h-[20rem] overflow-y-auto bg-background px-5 py-3 rounded-2xl border-none stroke-none"
                />
            </div>
            <div className="flex justify-end">
                <LoadingButton
                    loading={mutation.isPending}
                    onClick={onSubmit}
                    disabled={!input.trim()}
                    className="min-w-20"
                >
                    Post
                </LoadingButton>
            </div>
        </div>
    )
}