import React, { useState, useRef, useEffect } from "react";
import { Heart, ThumbsUp, Smile, Frown, Angry } from "lucide-react";
import { likeService } from "@/services/likeService";
import ReactionDetails from "./ReactionDetails";

type EmojiReactionProps = {
  postId: string;
  initialReaction: string | null;
  likesCount: number;
  onReactionChange: (newCount: number, type: string | null) => void;
};

const EmojiReactions = ({ postId, initialReaction, likesCount, onReactionChange }: EmojiReactionProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showReactionDetails, setShowReactionDetails] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<string | null>(initialReaction);
  const [count, setCount] = useState(likesCount);
  const [allReactions, setAllReactions] = useState<Record<string, any>>({});
  const [loadingReactions, setLoadingReactions] = useState(false);
  const reactionRef = useRef<HTMLDivElement>(null);

  // This useEffect syncs the component with props when they change
  useEffect(() => {
    setCurrentReaction(initialReaction);
    setCount(likesCount);
  }, [initialReaction, likesCount]);

  const reactions = [
    { type: "like", icon: <ThumbsUp className="w-5 h-5" />, color: "text-blue-500", fill: "fill-blue-500" },
    { type: "love", icon: <Heart className="w-5 h-5" />, color: "text-red-500", fill: "fill-red-500" },
    { type: "laugh", icon: <Smile className="w-5 h-5" />, color: "text-yellow-500", fill: "fill-yellow-500" },
    { type: "sad", icon: <Frown className="w-5 h-5" />, color: "text-purple-500", fill: "fill-purple-500" },
    { type: "angry", icon: <Angry className="w-5 h-5" />, color: "text-orange-500", fill: "fill-orange-500" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (reactionRef.current && !reactionRef.current.contains(event.target as Node)) {
        setShowReactions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchReactions = async () => {
    try {
      setLoadingReactions(true);
      // Use the actual API to fetch reactions
      const response = await likeService.getReactions(postId);
      setAllReactions(response.data);
    } catch (error) {
      console.error("Error fetching reactions:", error);
    } finally {
      setLoadingReactions(false);
    }
  };

  const handleShowReactionDetails = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (count > 0) {
      await fetchReactions();
      setShowReactionDetails(true);
    }
  };

  const handleReactionClick = async (type: string) => {
    try {
      setShowReactions(false);
      
      // If clicking the same reaction, remove it
      if (currentReaction === type) {
        // First update local state to avoid UI flicker
        const newCount = count - 1;
        setCurrentReaction(null);
        setCount(newCount);
        
        // Then call the API and parent callback
        await likeService.remove(postId);
        onReactionChange(newCount, null);
      } else {
        // If changing from one reaction to another, don't increment count
        const isChangingReaction = currentReaction !== null;
        let newCount = count;
        
        // Only increment count if this is a new reaction (not changing an existing one)
        if (!isChangingReaction) {
          newCount = count + 1;
        }
        
        // First update local state
        setCurrentReaction(type);
        setCount(newCount);
        
        // Then call the API and parent callback
        await likeService.react(postId, type);
        onReactionChange(newCount, type);
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
      // Revert the local state if the API call fails
      setCurrentReaction(initialReaction);
      setCount(likesCount);
    }
  };

  const getCurrentReactionIcon = () => {
    if (!currentReaction) {
      return <ThumbsUp className="w-5 h-5" />;
    }
    
    const reaction = reactions.find(r => r.type === currentReaction);
    if (reaction) {
      return React.cloneElement(reaction.icon, { 
        className: `w-5 h-5 ${reaction.color} ${currentReaction ? reaction.fill : ""}` 
      });
    }
    
    return <ThumbsUp className="w-5 h-5" />;
  };

  const toggleReactions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReactions(prev => !prev);
  };

  return (
    <div className="relative" ref={reactionRef}>
      <button 
        onClick={toggleReactions}
        className={`flex items-center gap-1 text-sm hover:opacity-80 transition-all ${
          currentReaction ? reactions.find(r => r.type === currentReaction)?.color : "text-muted-foreground"
        }`}
      >
        {getCurrentReactionIcon()}
        <span 
          className="cursor-pointer hover:underline" 
          onClick={handleShowReactionDetails}
        >
          {count}
        </span>
      </button>

      {showReactions && (
        <div className="absolute bottom-8 left-0 bg-white rounded-full shadow-lg p-1 flex items-center space-x-1 border z-10">
          {reactions.map((reaction) => (
            <button
              key={reaction.type}
              onClick={() => handleReactionClick(reaction.type)}
              className={`p-2 rounded-full hover:bg-gray-100 transition-all transform hover:scale-110 ${
                currentReaction === reaction.type ? reaction.color : ""
              }`}
              title={reaction.type.charAt(0).toUpperCase() + reaction.type.slice(1)}
            >
              {React.cloneElement(reaction.icon, { 
                className: `w-5 h-5 ${currentReaction === reaction.type ? `${reaction.color} ${reaction.fill}` : ""}` 
              })}
            </button>
          ))}
        </div>
      )}

      {/* Reaction Details Modal */}
      <ReactionDetails
        reactions={allReactions}
        isOpen={showReactionDetails}
        onClose={() => setShowReactionDetails(false)}
      />
    </div>
  );
};

export default EmojiReactions;