import { User, Post, Comment, Bookmark, Notification, Like } from "@/types";

// Mock Users
export const users: User[] = [
  {
    id: "1",
    email: "johndoe@example.com",
    username: "johndoe",
    bio: "Full-stack developer passionate about React and TypeScript",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    createdAt: "2023-01-15T08:30:00Z",
    followersCount: 245,
    followingCount: 112,
  },
  {
    id: "2",
    email: "janedoe@example.com",
    username: "janedoe",
    bio: "Frontend developer and UI/UX enthusiast",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    createdAt: "2023-02-20T10:15:00Z",
    followersCount: 189,
    followingCount: 97,
  },
  {
    id: "3",
    email: "alexsmith@example.com",
    username: "alexsmith",
    bio: "Backend developer specializing in Node.js and databases",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    createdAt: "2023-03-10T14:45:00Z",
    followersCount: 156,
    followingCount: 83,
  },
  {
    id: "4",
    email: "sarahjones@example.com",
    username: "sarahjones",
    bio: "DevOps engineer and cloud architecture specialist",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    createdAt: "2023-04-05T09:20:00Z",
    followersCount: 210,
    followingCount: 105,
  },
  {
    id: "5",
    email: "mikebrown@example.com",
    username: "mikebrown",
    bio: "Mobile app developer with a focus on React Native",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    createdAt: "2023-05-12T11:30:00Z",
    followersCount: 178,
    followingCount: 92,
  },
];

// Mock Posts (base version, not directly exported)
const basePosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with React Hooks",
    content: `# Getting Started with React Hooks

React Hooks have revolutionized how we write React components. In this post, I'll walk you through the basics of useState and useEffect.

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
\`\`\`

Stay tuned for more advanced hooks in my next post!`,
    authorId: "1",
    author: users[0],
    tags: ["React", "JavaScript", "Hooks", "Frontend"],
    publishedAt: "2023-06-15T09:30:00Z",
    views: 1245,
  },
  {
    id: "2",
    title: "Building Scalable APIs with NestJS",
    content: `# Building Scalable APIs with NestJS

NestJS provides a robust framework for building server-side applications. Here's how to create a basic controller:

\`\`\`typescript
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  findAll(): Cat[] {
    return this.catsService.findAll();
  }

  @Post()
  @HttpCode(201)
  create(@Body() createCatDto: CreateCatDto): Cat {
    return this.catsService.create(createCatDto);
  }
}
\`\`\`

NestJS combines the best of Express and Angular patterns for a great developer experience.`,
    authorId: "3",
    author: users[2],
    tags: ["NestJS", "TypeScript", "API", "Backend"],
    publishedAt: "2023-07-20T14:15:00Z",
    views: 978,
  },
  {
    id: "3",
    title: "CSS Grid vs Flexbox: When to Use Each",
    content: `# CSS Grid vs Flexbox: When to Use Each

Understanding when to use Grid vs Flexbox can greatly improve your layouts. Here's a quick comparison:

## Flexbox
- One-dimensional layouts (row OR column)
- Content-first design
- Great for components and small-scale layouts

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## Grid
- Two-dimensional layouts (rows AND columns)
- Layout-first design
- Perfect for page-level and complex layouts

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
\`\`\`

Choose the right tool for the job!`,
    authorId: "2",
    author: users[1],
    tags: ["CSS", "Flexbox", "Grid", "Frontend"],
    publishedAt: "2023-08-05T10:45:00Z",
    views: 1567,
  },
  {
    id: "4",
    title: "Optimizing Docker Containers for Production",
    content: `# Optimizing Docker Containers for Production

When deploying Docker containers to production, optimization is key. Here are some best practices:

1. Use multi-stage builds to reduce image size
2. Leverage layer caching effectively
3. Run containers as non-root users
4. Implement health checks

\`\`\`dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
\`\`\`

These optimizations can significantly improve security and performance.`,
    authorId: "4",
    author: users[3],
    tags: ["Docker", "DevOps", "Optimization", "Containers"],
    publishedAt: "2023-09-12T16:20:00Z",
    views: 823,
  },
  {
    id: "5",
    title: "State Management in React Native with Redux Toolkit",
    content: `# State Management in React Native with Redux Toolkit

Redux Toolkit simplifies Redux state management in React Native apps. Here's how to set it up:

\`\`\`typescript
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
\`\`\`

Redux Toolkit's createSlice API makes it much easier to work with Redux!`,
    authorId: "5",
    author: users[4],
    tags: ["React Native", "Redux", "State Management", "Mobile"],
    publishedAt: "2023-10-08T11:10:00Z",
    views: 745,
  },
];

// Mock Comments (base version, not directly exported)
const baseComments: Comment[] = [
  {
    id: "1",
    content:
      "Great article! I've been using hooks for a while now and they've completely changed how I write React components.",
    authorId: "2",
    author: users[1],
    postId: "1",
    createdAt: "2023-06-15T10:45:00Z",
  },
  {
    id: "2",
    content:
      "Could you explain the dependency array in useEffect a bit more? I'm still confused about when to include dependencies.",
    authorId: "3",
    author: users[2],
    postId: "1",
    createdAt: "2023-06-15T11:30:00Z",
  },
  {
    id: "3",
    content:
      "I've been using NestJS for a few months now and it's been a game-changer for my backend development workflow.",
    authorId: "1",
    author: users[0],
    postId: "2",
    createdAt: "2023-07-20T15:20:00Z",
  },
  {
    id: "4",
    content:
      "This is exactly what I needed! I've been struggling with deciding between Grid and Flexbox for my layouts.",
    authorId: "5",
    author: users[4],
    postId: "3",
    createdAt: "2023-08-05T12:10:00Z",
  },
  {
    id: "5",
    content:
      "The multi-stage build tip saved me a lot of space in my Docker images. Thanks for sharing!",
    authorId: "1",
    author: users[0],
    postId: "4",
    createdAt: "2023-09-12T17:45:00Z",
  },
  {
    id: "6",
    content:
      "Redux Toolkit is so much cleaner than traditional Redux. Have you tried using the RTK Query for API calls?",
    authorId: "2",
    author: users[1],
    postId: "5",
    createdAt: "2023-10-08T13:25:00Z",
  },
];

// Mock Bookmarks (base version, not directly exported)
const baseBookmarks: Bookmark[] = [
  {
    id: "1",
    userId: "1",
    postId: "3",
    post: basePosts[2],
    createdAt: "2023-08-06T09:15:00Z",
    category: "CSS",
  },
  {
    id: "2",
    userId: "1",
    postId: "4",
    post: basePosts[3],
    createdAt: "2023-09-13T10:30:00Z",
    category: "DevOps",
  },
  {
    id: "3",
    userId: "2",
    postId: "1",
    post: basePosts[0],
    createdAt: "2023-06-16T14:20:00Z",
    category: "React",
  },
  {
    id: "4",
    userId: "3",
    postId: "5",
    post: basePosts[4],
    createdAt: "2023-10-09T08:45:00Z",
    category: "Mobile",
  },
  {
    id: "5",
    userId: "4",
    postId: "2",
    post: basePosts[1],
    createdAt: "2023-07-21T11:10:00Z",
    category: "Backend",
  },
];

// Mock Notifications (base version, not directly exported)
const baseNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    type: "like",
    actorId: "2",
    actor: users[1],
    postId: "1",
    post: basePosts[0],
    read: false,
    createdAt: "2023-06-15T10:50:00Z",
  },
  {
    id: "2",
    userId: "1",
    type: "comment",
    actorId: "3",
    actor: users[2],
    postId: "1",
    post: basePosts[0],
    commentId: "2",
    comment: baseComments[1],
    read: true,
    createdAt: "2023-06-15T11:35:00Z",
  },
  {
    id: "3",
    userId: "2",
    type: "follow",
    actorId: "1",
    actor: users[0],
    read: false,
    createdAt: "2023-06-16T09:20:00Z",
  },
  {
    id: "4",
    userId: "3",
    type: "like",
    actorId: "1",
    actor: users[0],
    postId: "2",
    post: basePosts[1],
    read: true,
    createdAt: "2023-07-20T15:25:00Z",
  },
  {
    id: "5",
    userId: "4",
    type: "comment",
    actorId: "1",
    actor: users[0],
    postId: "4",
    post: basePosts[3],
    commentId: "5",
    comment: baseComments[4],
    read: false,
    createdAt: "2023-09-12T17:50:00Z",
  },
];

// Mock Likes
export const likes: Like[] = [
  {
    id: "1",
    userId: "2",
    postId: "1",
    createdAt: "2023-06-15T10:40:00Z",
  },
  {
    id: "2",
    userId: "3",
    postId: "1",
    createdAt: "2023-06-15T11:20:00Z",
  },
  {
    id: "3",
    userId: "4",
    postId: "1",
    createdAt: "2023-06-16T09:15:00Z",
  },
  {
    id: "4",
    userId: "5",
    postId: "1",
    createdAt: "2023-06-16T14:30:00Z",
  },
  {
    id: "5",
    userId: "1",
    postId: "2",
    createdAt: "2023-07-20T15:10:00Z",
  },
  {
    id: "6",
    userId: "4",
    postId: "2",
    createdAt: "2023-07-21T08:45:00Z",
  },
  {
    id: "7",
    userId: "5",
    postId: "2",
    createdAt: "2023-07-22T11:30:00Z",
  },
  {
    id: "8",
    userId: "1",
    postId: "3",
    createdAt: "2023-08-05T11:20:00Z",
  },
  {
    id: "9",
    userId: "3",
    postId: "3",
    createdAt: "2023-08-06T10:15:00Z",
  },
  {
    id: "10",
    userId: "4",
    postId: "3",
    createdAt: "2023-08-07T09:30:00Z",
  },
  {
    id: "11",
    userId: "5",
    postId: "3",
    createdAt: "2023-08-08T14:45:00Z",
  },
  {
    id: "12",
    userId: "2",
    postId: "4",
    createdAt: "2023-09-13T09:20:00Z",
  },
  {
    id: "13",
    userId: "3",
    postId: "4",
    createdAt: "2023-09-14T11:10:00Z",
  },
  {
    id: "14",
    userId: "1",
    postId: "5",
    createdAt: "2023-10-09T10:30:00Z",
  },
  {
    id: "15",
    userId: "2",
    postId: "5",
    createdAt: "2023-10-10T13:45:00Z",
  },
  // Comment likes
  {
    id: "16",
    userId: "1",
    commentId: "1",
    createdAt: "2023-06-16T08:30:00Z",
  },
  {
    id: "17",
    userId: "4",
    commentId: "1",
    createdAt: "2023-06-16T10:15:00Z",
  },
  {
    id: "18",
    userId: "5",
    commentId: "2",
    createdAt: "2023-06-16T11:45:00Z",
  },
  {
    id: "19",
    userId: "2",
    commentId: "3",
    createdAt: "2023-07-21T09:20:00Z",
  },
  {
    id: "20",
    userId: "4",
    commentId: "4",
    createdAt: "2023-08-06T13:10:00Z",
  },
];

// Helper functions to derive counts
export const getPostLikesCount = (postId: string): number => {
  return likes.filter((like) => like.postId === postId).length;
};

export const getPostCommentsCount = (postId: string): number => {
  return baseComments.filter((comment) => comment.postId === postId).length;
};

export const getPostBookmarksCount = (postId: string): number => {
  return baseBookmarks.filter((bookmark) => bookmark.postId === postId).length;
};

export const getCommentLikesCount = (commentId: string): number => {
  return likes.filter((like) => like.commentId === commentId).length;
};

// Functions to enhance entities with derived counts
export const getEnhancedPost = (post: Post): Post => {
  return {
    ...post,
    likesCount: getPostLikesCount(post.id),
    commentsCount: getPostCommentsCount(post.id),
    bookmarksCount: getPostBookmarksCount(post.id),
  };
};

export const getEnhancedPosts = (): Post[] => {
  return basePosts.map((post) => getEnhancedPost(post));
};

export const getEnhancedComment = (comment: Comment): Comment => {
  return {
    ...comment,
    likesCount: getCommentLikesCount(comment.id),
  };
};

export const getEnhancedComments = (): Comment[] => {
  return baseComments.map((comment) => getEnhancedComment(comment));
};

// Export enhanced versions for direct use
export const posts = getEnhancedPosts();
export const comments = getEnhancedComments();

// Update bookmarks to use enhanced posts
export const bookmarks: Bookmark[] = baseBookmarks.map((bookmark) => ({
  ...bookmark,
  post: posts.find((post) => post.id === bookmark.postId),
}));

// Update notifications to use enhanced posts and comments
export const notifications: Notification[] = baseNotifications.map(
  (notification) => ({
    ...notification,
    post: notification.postId
      ? posts.find((post) => post.id === notification.postId)
      : undefined,
    comment: notification.commentId
      ? comments.find((comment) => comment.id === notification.commentId)
      : undefined,
  })
);

// User-related helper functions
export const getUserLikedPostIds = (userId: string): string[] => {
  return likes
    .filter((like) => like.userId === userId && like.postId)
    .map((like) => like.postId as string);
};

export const getEnhancedUser = (user: User): User => {
  return {
    ...user,
    likedPosts: getUserLikedPostIds(user.id),
  };
};

export const getEnhancedUsers = (): User[] => {
  return users.map((user) => getEnhancedUser(user));
};

// Current user (for auth simulation)
export const currentUser = getEnhancedUser(users[0]);

// Test function to verify data integrity
export const verifyDataIntegrity = () => {
  const post1 = posts.find((post) => post.id === "1");
  const post2 = posts.find((post) => post.id === "2");

  console.log("Post 1 likes count:", post1?.likesCount); // Should be 4
  console.log("Post 1 comments count:", post1?.commentsCount); // Should be 2
  console.log("Post 1 bookmarks count:", post1?.bookmarksCount); // Should be 1

  console.log("Post 2 likes count:", post2?.likesCount); // Should be 3
  console.log("Post 2 comments count:", post2?.commentsCount); // Should be 1
  console.log("Post 2 bookmarks count:", post2?.bookmarksCount); // Should be 1

  const comment1 = comments.find((comment) => comment.id === "1");
  console.log("Comment 1 likes count:", comment1?.likesCount); // Should be 2

  const user1LikedPosts = getUserLikedPostIds("1");
  console.log("User 1 liked posts:", user1LikedPosts); // Should include posts 2, 3, 5

  return {
    post1,
    post2,
    comment1,
    user1LikedPosts,
  };
};
