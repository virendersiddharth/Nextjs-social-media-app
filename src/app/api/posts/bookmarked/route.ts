import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataIncludes, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest){
    try {
        const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
        const pageSize = 10;
        const {user} = await validateRequest();

        if(!user){
            return Response.json({error : "Unauthorized"}, {status : 401});
        }

        const bookmarks = await prisma.bookmark.findMany({
            where: {
                userId : user.id,
            },
            include: {
                post : {
                    include : getPostDataIncludes(user.id)
                },
            },
            orderBy: { createdAt: "desc" },
            take: pageSize + 1,
            cursor: cursor? {id: cursor} : undefined
        })

        const nextCursor = bookmarks.length > pageSize ? bookmarks[pageSize].id : null;
        const data : PostsPage = {
            posts: bookmarks.slice(0, pageSize).map(bookmark => {
                return bookmark.post
            }),
            nextCursor
        }

        return Response.json(data)
    } catch (error) {
        console.log(error);
        return Response.json({error: "Internal Server Error"}, {status: 500})
    }
}