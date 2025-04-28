// src/pages/HomeComponent.tsx
import MainLayout from "../layouts/MainLayout";
import Post from "../post/Post";

const HomeComponent = () => {
  const posts = [
    {
      imageUrl: "https://via.placeholder.com/600x400",
      content:
        "This is the content of the post. It can be a longer description or text.",
      title: "First Post",
      author: "John Doe",
      time: "2 hours ago",
      likes: 150,
      comments: 20,
    },
    {
      imageUrl: "https://via.placeholder.com/600x400",
      content: "Here’s another post with some content.",
      title: "Second Post",
      author: "Jane Smith",
      time: "4 hours ago",
      likes: 200,
      comments: 50,
    },
    // More posts here
  ];

  return (
    <MainLayout>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <Post
            key={index}
            imageUrl={post.imageUrl}
            content={post.content}
            title={post.title}
            author={post.author}
            time={post.time}
            likes={post.likes}
            comments={post.comments}
          />
        ))}
      </div>
    </MainLayout>
  );
};

export default HomeComponent;