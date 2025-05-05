import { Card } from "@/components/ui/card";
import {
  MessageCircle,
  MoreHorizontal,
  ThumbsUp,
  Heart,
  Smile,
} from "lucide-react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect } from "react";
import EmojiReactions from "./EmojiReactions";
import { likeService } from "@/services/likeService";

// Simple helper to format time ago string
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) return `${secondsAgo} seconds ago`;

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60)
    return `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24)
    return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;

  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 30) return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;

  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12)
    return `${monthsAgo} ${monthsAgo === 1 ? "month" : "months"} ago`;

  const yearsAgo = Math.floor(monthsAgo / 12);
  return `${yearsAgo} ${yearsAgo === 1 ? "year" : "years"} ago`;
};

type PostProps = {
  post: {
    _id: string;
    title: string;
    text: string;
    content: string[]; // array of image URLs
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    user_id: {
      _id?: string;
      name?: string;
      username?: string;
      profilePicture?: string;
    };
  };
  onLike?: (postId: string) => void;
  isLiked?: boolean;
  userReaction?: string | null;
};

export default function Post({
  post,
  onLike,
  isLiked = false,
  userReaction = null,
}: PostProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentLikes, setCurrentLikes] = useState(post.likesCount);
  const [currentReaction, setCurrentReaction] = useState<string | null>(
    userReaction
  );
  const [loadingUserReaction, setLoadingUserReaction] = useState(true);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slides: { perView: 1 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  // Fetch the user's reaction status on component mount
  useEffect(() => {
    const fetchUserReaction = async () => {
      try {
        setLoadingUserReaction(true);
        const response = await likeService.getUserReaction(post._id);
        console.log("User reaction response:", response.data.data.reaction);
        
        if (response.data?.data.reaction) {
          setCurrentReaction(response.data.data.reaction);
        } else {
          setCurrentReaction(null);
        }
      } catch (error) {
        console.error("Error fetching user reaction:", error);
        setCurrentReaction(null); // Fallback
      } finally {
        setLoadingUserReaction(false);
      }
    };
  
    fetchUserReaction();
  }, [post._id]);  

  const handleReactionChange = (newCount: number, type: string | null) => {
    // Update local state
    setCurrentLikes(newCount);
    setCurrentReaction(type);

    // Notify parent component
    if (onLike) {
      onLike(post._id);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto rounded-2xl shadow-sm border p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center">
        <div className="flex-1">
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(post.createdAt)}
          </span>
          <h2 className="font-semibold text-sm">{post.title || "Title"} </h2>
        </div>
        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
      </div>
      {post.text && <p className="text-sm">{post.text}</p>}
      {/* Image Slider */}
      {post.content.length > 0 && (
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
          <div ref={sliderRef} className="keen-slider h-full">
            {post.content.map((url, index) => (
              <div
                className="keen-slider__slide flex items-center justify-center"
                key={index}
              >
                <img
                  src={url}
                  className="object-cover h-full w-full"
                  alt={`post-img-${index}`}
                />
              </div>
            ))}
          </div>

          {/* Slide Indicator */}
          {post.content.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {currentSlide + 1}/{post.content.length}
            </div>
          )}
        </div>
      )}

      {/* Like & Comment Row */}
      <div className="flex items-center justify-start gap-3.5 pt-2 text-muted-foreground">
        {loadingUserReaction ? (
          <div className="flex items-center gap-1 text-sm">
            <ThumbsUp className="w-5 h-5" />
            <span>{currentLikes}</span>
          </div>
        ) : (
          <EmojiReactions
            postId={post._id}
            initialReaction={currentReaction}
            likesCount={currentLikes}
            onReactionChange={handleReactionChange}
          />
        )}

        <div className="flex items-center gap-1 text-sm">
          <MessageCircle className="w-5 h-5" />
          <span>{post.commentsCount}</span>
        </div>
      </div>

      {/* Reaction Summary - This would show when there are reactions */}
      {currentLikes > 0 && (
        <div className="flex items-center mt-1 ml-1">
          <div className="flex -space-x-1">
            {currentReaction === "like" && (
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center border border-white">
                <ThumbsUp className="w-3 h-3 text-blue-500" />
              </div>
            )}
            {currentReaction === "love" && (
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center border border-white">
                <Heart className="w-3 h-3 text-red-500" />
              </div>
            )}
            {currentReaction === "laugh" && (
              <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center border border-white">
                <Smile className="w-3 h-3 text-yellow-500" />
              </div>
            )}
            {/* We can show more reaction icons when needed */}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            {currentReaction ? "You" : ""}{" "}
            {currentLikes > 1 &&
              `and ${currentLikes - (currentReaction ? 1 : 0)} others`}
          </span>
        </div>
      )}
    </Card>
  );
}