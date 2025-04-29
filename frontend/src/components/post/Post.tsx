// src/components/Post.tsx
import { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";

const Post = ({ ...props }: React.ComponentProps<"div">) => {
  const [formData, setFormData] = useState({
    imageUrl: "",
    content: "",
    title: "",
    author: "",
    time: "",
    likes: "",
    comments: "",
  });
console.log("Post data:", formData);
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setFormData((prev) => ({ ...prev, [name]: value }));
   };
  return (
    <div
      className="bg-black p-4 rounded-lg shadow-md flex flex-col gap-4"
      {...props}
    >
      {/* Post Title */}
      <h3 className="font-bold text-lg">{formData.title}</h3>

      {/* Post Author and Time */}
      <div className="text-sm text-gray-500">
        {formData.author} · {formData.time}
      </div>

      {/* Post Image */}
      <div className="w-full mb-2">
        <img
          src={formData.imageUrl}
          alt="Post Image"
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>

      {/* Post Content */}
      <div className="text-gray-700">{formData.content}</div>

      {/* Interaction Buttons (Likes, Comments, Share) */}
      <div className="mt-4 flex items-center gap-6 text-gray-500">
        <div className="flex items-center gap-1 cursor-pointer">
          <Heart size={18} /> <span>{formData.likes}</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <MessageCircle size={18} /> <span>{formData.comments}</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <Share2 size={18} />
        </div>
      </div>
    </div>
  );
};

export default Post;
