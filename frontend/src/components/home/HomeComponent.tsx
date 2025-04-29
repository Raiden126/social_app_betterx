// src/pages/HomeComponent.tsx
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Post from "../post/Post";
import { getPosts } from "@/api/post/post"; // Import your getPosts function
import { PostResponse } from "@/types/post";

const HomeComponent = () => {
  const [posts, setPosts] = useState<PostResponse>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response);
        console.log("Posts fetched successfully:", response);
        // setLoading(false);
      } catch (err) {
        // setError("Error fetching posts");
        // setLoading(false);
      }
    };

    fetchPosts(); // Call the fetch function when the component mounts
  }, []);

  // if (loading) {
  //   return <div>Loading...</div>; // Show loading state while fetching
  // }

  // if (error) {
  //   return <div>{error}</div>; // Show error if there's a problem fetching
  // }

  return (
    <MainLayout>
      <div className="space-y-4">
        {posts.map((post, index) => (
          console.log('post',post),
          <Post
            key={index}
            imageUrl={post.content?.[0] || ""}
            content={post.text}
            title={post.title}
            author={post.user_id || "Unknown"}
            time={new Date(post.createdAt).toLocaleString()}
            likes={post.likes?.length || 0}
            comments={post.comments?.length || 0}
          />
        ))}
      </div>
    </MainLayout>
  );
};

export default HomeComponent;