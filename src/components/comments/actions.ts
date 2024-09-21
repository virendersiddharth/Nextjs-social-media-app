"use server"

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude, PostData } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";
import { error } from "console";

export async function submitComment({
    post,
    content
}: { post: PostData, content: string }) {

    const { user } = await validateRequest()

    if (!user) {
        throw new Error("Unauthorized");
    }

    const { content: contentValidated } = createCommentSchema.parse({ content });

    const [newComment] = await prisma.$transaction([
        prisma.comment.create({
            data: {
                content: contentValidated,
                postId: post.id,
                userId: user.id,
            },
            include: getCommentDataInclude(user.id)
        }),
        ...(post.user.id !== user.id) ?
            [
                prisma.notification.create({
                    data: {
                        issuerId: user.id,
                        recipientId: post.user.id,
                        postId: post.id,
                        type: "COMMENT"
                    }
                })
            ]
            :
            []
    ])
    return newComment;
}

export async function deleteComment(id: string) {
    const { user } = await validateRequest();

    if (!user) throw new Error("Unauthorized");

    const comment = await prisma.comment.findUnique({
        where: { id },
    });

    if (!comment) throw new Error("Comment not found");

    if (comment.userId !== user.id) throw new Error("Unauthorized");

    const post = await prisma.post.findUnique({
        where : {
            id: comment.postId
        }
    })

    if(!post){
        return Response.json({error : "Post not found"},{status : 404});
    }

    const [deletedComment] = await prisma.$transaction([
        prisma.comment.delete({
            where: { id },
            include: getCommentDataInclude(user.id),
        }),
        prisma.notification.deleteMany({
            where: {
                issuerId: user.id,
                recipientId: post.userId,
                postId: post.id,
                type: "COMMENT"
            }
        })
    ])

    return deletedComment;
}