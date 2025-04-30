import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Post from "../post/Post";
import { getPosts } from "@/api/post/post";
import { PostData } from "@/types/post";
import { Skeleton } from "@/components/ui/skeleton";

const HomeComponent = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        console.log("response in fetching posts:", response);
        setPosts(response.data);
      } catch (err) {
        console.log("error in fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <MainLayout>
      <div className="flex items-start gap-6 text-white">
        <div className="flex flex-col gap-6 w-full md:w-2/3">
            {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-4 p-4 bg-[#121212] rounded-xl shadow-md w-full max-w-xl border border-neutral-800"
              >
                <Skeleton className="h-6 w-1/2 rounded-md bg-gray-700" />
                <Skeleton className="h-4 w-1/3 rounded-md bg-gray-700" />
                <Skeleton className="h-64 w-full rounded-xl bg-gray-700" />
                <Skeleton className="h-4 w-full rounded bg-gray-700" />
                <Skeleton className="h-6 w-1/3 rounded-md bg-gray-700" />
              </div>
              ))
            : posts.map((post, index) => {
              const formatDate = (dateString: string) => {
                const date = new Date(dateString);
                const now = new Date();
                const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

                if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
                if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
                if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;

                const day = date.getDate();
                const month = date.toLocaleString("default", { month: "long" });
                const year = date.getFullYear();
                const daySuffix =
                day % 10 === 1 && day !== 11
                  ? "st"
                  : day % 10 === 2 && day !== 12
                  ? "nd"
                  : day % 10 === 3 && day !== 13
                  ? "rd"
                  : "th";

                return `${day}${daySuffix} ${month}, ${year}`;
              };

              return (
                <Post
                key={index}
                _id={post._id}
                content={post.content || []}
                title={post.title}
                author={post.username || "Unknown"}
                time={formatDate(post.createdAt)}
                likesCount={post.likesCount || 0}
                commentsCount={post.commentsCount || 0}
                currentUserId={post.user_id || "Unknown"}
                />
              );
              })}
        </div>

        {/* Right Sidebar */}
        <div className="hidden md:block w-1/3">
          {/* Reserved for widgets or extra content */}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomeComponent;
