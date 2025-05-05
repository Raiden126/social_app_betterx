export const buildUserProfilePipeline = (matchStage) => [
  {
    $match:
      typeof matchStage === "string"
        ? { username: matchStage }
        : { _id: matchStage },
  },
  {
    $lookup: {
      from: "follows",
      let: { userId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$following", "$$userId"] } } },
        { $count: "count" },
      ],
      as: "followingCount",
    },
  },
  {
    $lookup: {
      from: "follows",
      let: { userId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$follows", "$$userId"] } } },
        { $count: "count" },
      ],
      as: "followerCount",
    },
  },
  {
    $lookup: {
      from: "posts",
      let: { userId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$user_id", "$$userId"] } } },
        { $count: "count" },
      ],
      as: "postsCount",
    },
  },
  {
    $addFields: {
      followingCount: {
        $ifNull: [{ $arrayElemAt: ["$followingCount.count", 0] }, 0],
      },
      followerCount: {
        $ifNull: [{ $arrayElemAt: ["$followerCount.count", 0] }, 0],
      },
      postsCount: { $ifNull: [{ $arrayElemAt: ["$postsCount.count", 0] }, 0] },
    },
  },
  {
    $project: {
      username: 1,
      firstname: 1,
      lastname: 1,
      email: 1,
      followingCount: 1,
      followerCount: 1,
      profilePicture: 1,
      coverImage: 1,
      bio: 1,
      postsCount: 1,
    },
  },
];

export const buildUserPostsPipeline = (userId) => [
  { $match: { user_id: userId } },
  {
    $lookup: {
      from: "comments",
      let: { postId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$post", "$$postId"] } } },
        { $count: "count" },
      ],
      as: "commentsCount",
    },
  },
  {
    $lookup: {
      from: "likes",
      let: { postId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$post", "$$postId"] } } },
        { $count: "count" },
      ],
      as: "likesCount",
    },
  },
  {
    $addFields: {
      commentsCount: {
        $ifNull: [{ $arrayElemAt: ["$commentsCount.count", 0] }, 0],
      },
      likesCount: { $ifNull: [{ $arrayElemAt: ["$likesCount.count", 0] }, 0] },
    },
  },
  { $sort: { createdAt: -1 } },
];
