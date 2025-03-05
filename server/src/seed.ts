import { DataSource } from 'typeorm';
import { Post } from './posts/entities/post.entity';
import { Comment } from './comments/entities/comment.entity';
import { Like } from './likes/entities/like.entity';
import { config } from 'dotenv';

// Load environment variables
config();

// Define mock Clerk user IDs to use in our seed data
const MOCK_CLERK_USER_IDS = {
  user1: 'user_mock_clerk_id_1',
  user2: 'user_mock_clerk_id_2',
  user3: 'user_mock_clerk_id_3',
  user4: 'user_mock_clerk_id_4',
  user5: 'user_mock_clerk_id_5',
};

async function bootstrap() {
  console.log('Starting seed...');

  // Create a standalone data source
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Post, Comment, Like],
    synchronize: true,
  });

  // Initialize the data source
  await dataSource.initialize();
  console.log('Database connection established');

  try {
    // Clear existing data (if needed)
    await dataSource.query('TRUNCATE TABLE likes CASCADE');
    await dataSource.query('TRUNCATE TABLE comments CASCADE');
    await dataSource.query('TRUNCATE TABLE posts CASCADE');
    console.log('Existing data cleared');

    // Create posts (using Clerk user IDs instead of database user IDs)
    const postRepository = dataSource.getRepository(Post);
    const posts = await Promise.all([
      postRepository.save({
        title: 'Getting Started with React Hooks',
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
        clerkUserId: MOCK_CLERK_USER_IDS.user1,
        tags: ['React', 'JavaScript', 'Hooks', 'Frontend'],
        views: 1245,
      }),
      postRepository.save({
        title: 'Building Scalable APIs with NestJS',
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
        clerkUserId: MOCK_CLERK_USER_IDS.user3,
        tags: ['NestJS', 'TypeScript', 'API', 'Backend'],
        views: 978,
      }),
      postRepository.save({
        title: 'CSS Grid vs Flexbox: When to Use Which',
        content: `# CSS Grid vs Flexbox: When to Use Which

CSS layout has evolved significantly with Grid and Flexbox. Here's a quick comparison:

## Flexbox:
- One-dimensional layout (row OR column)
- Great for component layouts
- Easy alignment and distribution of space

## Grid:
- Two-dimensional layout (rows AND columns)
- Excellent for page-level layouts
- Creates complex grid-based designs easily

\`\`\`css
/* Flexbox Example */
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Grid Example */
.page-layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 
    "h h h h h h h h h h h h"
    "m m m c c c c c c s s s"
    "f f f f f f f f f f f f";
}
\`\`\`

Choose the right tool for your layout needs!`,
        clerkUserId: MOCK_CLERK_USER_IDS.user2,
        tags: ['CSS', 'Frontend', 'Web Design', 'Layout'],
        views: 1122,
      }),
      postRepository.save({
        title: 'Docker Best Practices for Node.js Applications',
        content: `# Docker Best Practices for Node.js Applications

Containerizing Node.js apps properly can significantly improve your deployment workflow. Here are some best practices:

## Use Official Node Images
Start with the official Node.js images and consider Alpine for smaller footprints.

## Multi-Stage Builds
Use multi-stage builds to keep images slim:

\`\`\`dockerfile
# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]
\`\`\`

## Handle Signals Properly
Make sure your Node.js app handles SIGTERM and SIGINT for graceful shutdowns.

## Use .dockerignore
Create a thorough .dockerignore file to prevent unnecessary files from being included.

These practices will help you create more efficient and reliable containerized applications.`,
        clerkUserId: MOCK_CLERK_USER_IDS.user4,
        tags: ['Docker', 'Node.js', 'DevOps', 'Containers'],
        views: 864,
      }),
      postRepository.save({
        title: 'State Management in React Native with Redux Toolkit',
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
        clerkUserId: MOCK_CLERK_USER_IDS.user5,
        tags: ['React Native', 'Redux', 'State Management', 'Mobile'],
        views: 745,
      }),
    ]);

    console.log(`Created ${posts.length} posts`);

    // Create comments
    const commentRepository = dataSource.getRepository(Comment);
    const comments = await Promise.all([
      commentRepository.save({
        content:
          "Great article! I've been using hooks for a while now and they've completely changed how I write React components.",
        clerkUserId: MOCK_CLERK_USER_IDS.user2,
        postId: posts[0].id,
      }),
      commentRepository.save({
        content:
          "Could you explain the dependency array in useEffect a bit more? I'm still confused about when to include dependencies.",
        clerkUserId: MOCK_CLERK_USER_IDS.user3,
        postId: posts[0].id,
      }),
      commentRepository.save({
        content:
          "I've been using NestJS for a few months now and it's been a game-changer for my backend development workflow.",
        clerkUserId: MOCK_CLERK_USER_IDS.user1,
        postId: posts[1].id,
      }),
      commentRepository.save({
        content:
          "This is exactly what I needed! I've been struggling with deciding between Grid and Flexbox for my layouts.",
        clerkUserId: MOCK_CLERK_USER_IDS.user5,
        postId: posts[2].id,
      }),
      commentRepository.save({
        content:
          'The multi-stage build tip saved me a lot of space in my Docker images. Thanks for sharing!',
        clerkUserId: MOCK_CLERK_USER_IDS.user1,
        postId: posts[3].id,
      }),
      commentRepository.save({
        content:
          'Redux Toolkit is so much cleaner than traditional Redux. Have you tried using the RTK Query for API calls?',
        clerkUserId: MOCK_CLERK_USER_IDS.user2,
        postId: posts[4].id,
      }),
    ]);

    console.log(`Created ${comments.length} comments`);

    // Create likes for posts
    const likeRepository = dataSource.getRepository(Like);
    const postLikes = await Promise.all([
      // Likes for post 1
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user2,
        postId: posts[0].id,
      }),
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user3,
        postId: posts[0].id,
      }),
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user4,
        postId: posts[0].id,
      }),
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user5,
        postId: posts[0].id,
      }),

      // Likes for post 2
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user1,
        postId: posts[1].id,
      }),
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user4,
        postId: posts[1].id,
      }),
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user5,
        postId: posts[1].id,
      }),

      // Likes for post 3
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user1,
        postId: posts[2].id,
      }),
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user3,
        postId: posts[2].id,
      }),
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user4,
        postId: posts[2].id,
      }),
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user5,
        postId: posts[2].id,
      }),

      // Likes for post 4
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user2,
        postId: posts[3].id,
      }),
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user3,
        postId: posts[3].id,
      }),

      // Likes for post 5
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user1,
        postId: posts[4].id,
      }),
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user2,
        postId: posts[4].id,
      }),
    ]);

    console.log(`Created ${postLikes.length} post likes`);

    // Create likes for comments
    const commentLikes = await Promise.all([
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user1,
        commentId: comments[0].id,
      }),
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user4,
        commentId: comments[0].id,
      }),
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user5,
        commentId: comments[1].id,
      }),
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user2,
        commentId: comments[2].id,
      }),
      likeRepository.save({
        clerkUserId: MOCK_CLERK_USER_IDS.user4,
        commentId: comments[3].id,
      }),
    ]);

    console.log(`Created ${commentLikes.length} comment likes`);

    // Update likes and comments counts in posts
    for (const post of posts) {
      const likesCount = await likeRepository.count({
        where: { postId: post.id },
      });
      const commentsCount = await commentRepository.count({
        where: { postId: post.id },
      });

      await postRepository.update(post.id, {
        likesCount,
        commentsCount,
      });
    }

    // Update likes counts in comments
    for (const comment of comments) {
      const likesCount = await likeRepository.count({
        where: { commentId: comment.id },
      });

      await commentRepository.update(comment.id, {
        likesCount,
      });
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await dataSource.destroy();
    console.log('Database connection closed');
  }
}

bootstrap()
  .then(() => console.log('Seed script completed'))
  .catch((error) => console.error('Error running seed script:', error));
