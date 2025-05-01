import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Post from "../post/Post";
import { getPosts } from "@/api/post/post";
import { PostData } from "@/types/post";

const HomeComponent = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data);
        console.log("Posts fetched successfully:", response);
      } catch (err) {
        console.log("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col items-start jussta space-y-6 p-4 sm:p-6 md:p-8">
        <Post />
      </div>
    </MainLayout>
  );
};

export default HomeComponent;
