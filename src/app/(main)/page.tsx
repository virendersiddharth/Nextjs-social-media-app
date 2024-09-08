import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import TrendsSidebar from "@/components/TrendsSidebar";
import prisma from "@/lib/prisma";
// import { getPostDataIncludes } from "@/lib/types";
import ForYouFeed from "./ForYouFeed";
import { useSession } from "./SessionProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";

export default async function Home() {

  // const {user} = useSession();

  // const posts = await prisma.post.findMany({
  //   include: getPostDataIncludes(user.id),
  //   orderBy: { createdAt: "desc" },
  // })

  return (
    <main className=" min-w-0 w-full flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {/* {
          posts.map((post) => (
            <Post key={post.id} post={post}/>            
          ))
        } */}
        <Tabs defaultValue="for-you">
          <TabsList >
            <TabsTrigger value="for-you">For You</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed/>
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed/>
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}
