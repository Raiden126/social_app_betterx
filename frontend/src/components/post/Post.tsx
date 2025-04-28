// src/components/Post.tsx
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface PostProps {
  imageUrl: string;
  content: string;
  title: string;
  author: string;
  time: string;
  likes: number;
  comments: number;
}

const Post = ({
  imageUrl,
  content,
  title,
  author,
  time,
  likes,
  comments,
}: PostProps) => {
  return (
    <div className="bg-black p-4 rounded-lg shadow-md flex flex-col gap-4">
      {/* Post Title */}
      <h3 className="font-bold text-lg">{title}</h3>

      {/* Post Author and Time */}
      <div className="text-sm text-gray-500">
        {author} · {time}
      </div>

      {/* Post Image */}
      <div className="w-full mb-2">
        <img
          src={imageUrl}
          alt="Post Image"
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>

      {/* Post Content */}
      <div className="text-gray-700">{content}</div>

      {/* Interaction Buttons (Likes, Comments, Share) */}
      <div className="mt-4 flex items-center gap-6 text-gray-500">
        <div className="flex items-center gap-1 cursor-pointer">
          <Heart size={18} /> <span>{likes}</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <MessageCircle size={18} /> <span>{comments}</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <Share2 size={18} />
        </div>
      </div>
    </div>
  );
};

export default Post;
