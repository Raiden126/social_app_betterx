import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostProps } from "@/types/post";
import { likeService } from "@/services/likeService";
import { commentService } from "@/services/commentService";
import { useAuthCheck } from "@/hooks/useAuthCheck";

const Post = ({
  content,
  title,
  author,
  time,
  likesCount,
  commentsCount,
  _id: postId,
}: PostProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthCheck(); // assume this returns null if not logged in

  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount || 0);
  const [commenting, setCommenting] = useState(false);
  const [comment, setComment] = useState("");

  const handleDotClick = (index: number) => {
    instanceRef.current?.moveToIdx(index);
  };

  const handleLike = async () => {
    if (!isAuthenticated) return navigate("/login");

    try {
      if (liked) {
        await likeService.remove(postId);
        setLikes((prev) => prev - 1);
      } else {
        await likeService.react(postId, "like");
        setLikes((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleDoubleClick = () => {
    if (!liked) handleLike();
  };

  const handleCommentSubmit = async () => {
    if (!isAuthenticated) return navigate("/login");

    if (!comment.trim()) return;
    try {
      await commentService.add(postId, comment);
      setComment("");
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  return (
    <div
      className="bg-black p-4 rounded-2xl shadow-md w-full max-w-xl flex flex-col gap-4 border border-gray-800"
      onDoubleClick={handleDoubleClick}
    >
      <h3 className="font-bold text-xl text-white">{title}</h3>
      <div className="text-sm text-gray-400">
        {author} · {time}
      </div>

      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
        <div ref={sliderRef} className="keen-slider h-full w-full rounded-xl">
          {content?.map((url, index) => (
            <motion.div
              key={index}
              className="keen-slider__slide flex items-center justify-center bg-black"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={url}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>
          ))}
        </div>

        {content.length > 1 && (
          <>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {content.map((_, idx) => (
                <button
                  key={idx}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "bg-white scale-110" : "bg-gray-500"
                  }`}
                  onClick={() => handleDotClick(idx)}
                />
              ))}
            </div>

            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full z-10">
              {currentSlide + 1} / {content.length}
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center gap-6 text-white">
        <div
          className="flex items-center gap-1 cursor-pointer transition-colors hover:text-red-500"
          onClick={handleLike}
        >
          <Heart
            size={18}
            className={`${liked ? "fill-red-500 text-red-500" : ""}`}
          />
          <span>{likes}</span>
        </div>

        <div
          className="flex items-center gap-1 cursor-pointer transition-colors hover:text-blue-500"
          onClick={() => {
            if (!isAuthenticated) return navigate("/login");
            setCommenting(!commenting);
          }}
        >
          <MessageCircle size={18} />
          <span>{commentsCount}</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer">
          <Share2 size={18} />
        </div>
      </div>

      {commenting && (
        <div className="mt-2 flex items-center gap-2">
          <Input
            className="bg-gray-900 border-gray-700 text-white"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            className="bg-white text-black hover:bg-gray-200"
            onClick={handleCommentSubmit}
          >
            Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default Post;
