import React from "react";
import { ThumbsUp, Heart, Smile, Frown, Angry } from "lucide-react";

type ReactionType = {
  type: string;
  count: number;
  users?: { username: string }[];
};

type ReactionDetailsProps = {
  reactions: Record<string, ReactionType>;
  isOpen: boolean;
  onClose: () => void;
};

const ReactionDetails = ({ reactions, isOpen, onClose }: ReactionDetailsProps) => {
  if (!isOpen) return null;

  const reactionIcons = {
    like: <ThumbsUp className="w-4 h-4 text-blue-500 fill-blue-500" />,
    love: <Heart className="w-4 h-4 text-red-500 fill-red-500" />,
    laugh: <Smile className="w-4 h-4 text-black fill-yellow-500" />,
    sad: <Frown className="w-4 h-4 text-black fill-purple-500" />,
    angry: <Angry className="w-4 h-4 text-black fill-orange-500" />,
  };

  // Get sorted reaction types by count
  const sortedReactions = Object.entries(reactions)
    .map(([type, data]) => ({
      type,
      count: data.count,
      users: data.users || [],
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate total reactions
  const totalReactions = sortedReactions.reduce((sum, item) => sum + item.count, 0);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Reactions ({totalReactions})</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Reaction tabs */}
        <div className="flex border-b mb-3">
          <button className="px-4 py-2 border-b-2 border-blue-500 font-medium">
            All
          </button>
          {sortedReactions.map((reaction) => (
            <button 
              key={reaction.type}
              className="px-3 py-2 text-gray-500 hover:bg-gray-100 flex items-center gap-1"
            >
              {reactionIcons[reaction.type as keyof typeof reactionIcons]}
              <span>{reaction.count}</span>
            </button>
          ))}
        </div>

        {/* Reaction list */}
        <div className="max-h-60 overflow-y-auto">
          {sortedReactions.length > 0 ? (
            sortedReactions.flatMap((reaction) => 
              reaction.users?.map((user, index) => (
                <div key={`${reaction.type}-${index}`} className="flex items-center gap-2 p-2 hover:bg-gray-50">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                    {reactionIcons[reaction.type as keyof typeof reactionIcons]}
                  </div>
                  <span>{user.username}</span>
                </div>
              )) || []
            )
          ) : (
            <p className="text-center text-gray-500 py-4">No reactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactionDetails;