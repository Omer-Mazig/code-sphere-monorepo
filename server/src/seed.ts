import { DataSource } from 'typeorm';
import { Post, ContentBlock } from './posts/entities/post.entity';
import { Comment } from './comments/entities/comment.entity';
import { Like } from './likes/entities/like.entity';
import { User } from './users/entities/user.entity';
import { config } from 'dotenv';
import { faker } from '@faker-js/faker';
import { tags } from '../../shared/constants/tags.constants';
import { POST_STATUS } from '../../shared/constants/posts.constants';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
config();

// Programming-related data
const programmingLanguages = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'Dart',
  'C++',
  'C',
  'Scala',
  'Elixir',
  'Haskell',
  'Clojure',
];

const frameworks = [
  'React',
  'Angular',
  'Vue',
  'Next.js',
  'Svelte',
  'Express',
  'NestJS',
  'Django',
  'Flask',
  'Spring Boot',
  'ASP.NET Core',
  'Laravel',
  'Ruby on Rails',
  'FastAPI',
  'Gin',
  'Phoenix',
];

const tools = [
  'Docker',
  'Kubernetes',
  'Git',
  'GitHub',
  'GitLab',
  'Jenkins',
  'CircleCI',
  'GitHub Actions',
  'Terraform',
  'Ansible',
  'Webpack',
  'Vite',
  'ESLint',
  'Jest',
  'Cypress',
  'Playwright',
];

const concepts = [
  'REST API',
  'GraphQL',
  'Microservices',
  'Serverless',
  'CI/CD',
  'TDD',
  'DDD',
  'Clean Architecture',
  'Design Patterns',
  'SOLID',
  'Functional Programming',
  'OOP',
  'Reactive Programming',
  'DevOps',
];

const databases = [
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'SQLite',
  'Cassandra',
  'DynamoDB',
  'Elasticsearch',
  'Firebase',
  'Supabase',
  'CouchDB',
  'Neo4j',
];

// Generate realistic post titles about programming
const generatePostTitle = () => {
  const templates = [
    `How to implement ${faker.helpers.arrayElement(concepts)} with ${faker.helpers.arrayElement(programmingLanguages)}`,
    `Best practices for ${faker.helpers.arrayElement(frameworks)} development in 2023`,
    `${faker.helpers.arrayElement(programmingLanguages)} vs ${faker.helpers.arrayElement(programmingLanguages)}: Which one to choose?`,
    `Building scalable applications with ${faker.helpers.arrayElement(frameworks)}`,
    `${faker.helpers.arrayElement(tools)} tutorial for beginners`,
    `Advanced ${faker.helpers.arrayElement(programmingLanguages)} techniques you should know`,
    `Why I switched from ${faker.helpers.arrayElement(frameworks)} to ${faker.helpers.arrayElement(frameworks)}`,
    `${faker.helpers.arrayElement(databases)} performance optimization tips`,
    `My experience with ${faker.helpers.arrayElement(concepts)} in production`,
    `Solving common problems in ${faker.helpers.arrayElement(frameworks)}`,
    `Understanding ${faker.helpers.arrayElement(concepts)} in depth`,
    `${faker.helpers.arrayElement(tools)} configuration guide`,
    `${faker.helpers.arrayElement(programmingLanguages)} ${faker.helpers.arrayElement(
      [
        'tips and tricks',
        'best practices',
        'common pitfalls',
        'performance optimizations',
      ],
    )}`,
  ];

  return faker.helpers.arrayElement(templates);
};

// Generate a subtitle for a blog post
const generateSubtitle = (title: string) => {
  const templates = [
    `A comprehensive guide to ${title.toLowerCase()}`,
    `Everything you need to know about ${title.toLowerCase()}`,
    `Practical tips for developers working with ${title.toLowerCase()}`,
    `${title} explained for both beginners and experts`,
    `A deep dive into ${title.toLowerCase()}`,
  ];

  return faker.helpers.arrayElement(templates);
};

// Generate content blocks for a blog post
const generateContentBlocks = (title: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];

  // Introduction paragraph
  const introTemplates = [
    `Recently, I've been working on a project that required me to dive deep into this topic. Here's what I learned.`,
    `After months of research and experimentation, I want to share my findings on this subject.`,
    `Let me share my experience and the lessons I learned along the way.`,
    `This has been a topic of interest for many developers, so I decided to compile my knowledge into this post.`,
  ];

  blocks.push({
    id: uuidv4(),
    type: 'paragraph',
    content: faker.helpers.arrayElement(introTemplates),
  });

  // Background section with heading and paragraph
  blocks.push({
    id: uuidv4(),
    type: 'heading',
    content: 'Background',
  });

  blocks.push({
    id: uuidv4(),
    type: 'paragraph',
    content: `Before we dive in, let's understand why this is important. ${faker.lorem.paragraph(3)}`,
  });

  // Problem section
  blocks.push({
    id: uuidv4(),
    type: 'heading',
    content: 'The Problem',
  });

  blocks.push({
    id: uuidv4(),
    type: 'paragraph',
    content: `Many developers struggle with this because ${faker.lorem.paragraph(3)}`,
  });

  // Add an alert/note
  const alertTypes = ['info', 'warning', 'error'] as const;
  const alertType = faker.helpers.arrayElement(alertTypes);
  const alertTitles = {
    info: 'Note',
    warning: 'Warning',
    error: 'Important',
  };

  blocks.push({
    id: uuidv4(),
    type: 'alert',
    content: faker.lorem.paragraph(2),
    meta: {
      title: alertTitles[alertType],
      alertType: alertType,
    },
  });

  // Approach section
  blocks.push({
    id: uuidv4(),
    type: 'heading',
    content: 'My Approach',
  });

  blocks.push({
    id: uuidv4(),
    type: 'paragraph',
    content: `After trying several methods, here's what worked best for me: ${faker.lorem.paragraph(2)}`,
  });

  // Code example
  const language = faker.helpers.arrayElement([
    'javascript',
    'typescript',
    'python',
    'java',
    'csharp',
    'go',
    'rust',
  ]);

  blocks.push({
    id: uuidv4(),
    type: 'code',
    content: faker.lorem.lines(6),
    meta: {
      title: `Example code in ${language}`,
      language: language,
    },
  });

  // Image if needed
  if (faker.number.int(10) > 7) {
    // 30% chance to add an image
    blocks.push({
      id: uuidv4(),
      type: 'image',
      content: `Visualization of the ${title} concept`,
      meta: {
        imageUrl: `https://picsum.photos/seed/${faker.number.int(1000)}/800/400`,
      },
    });
  }

  // More explanation
  blocks.push({
    id: uuidv4(),
    type: 'paragraph',
    content: faker.lorem.paragraph(3),
  });

  // Conclusion
  blocks.push({
    id: uuidv4(),
    type: 'heading',
    content: 'Conclusion',
  });

  blocks.push({
    id: uuidv4(),
    type: 'paragraph',
    content: `This approach has significantly improved our development workflow and code quality. ${faker.lorem.paragraph(1)}`,
  });

  return blocks;
};

// Generate realistic comments
const generateComment = () => {
  const templates = [
    `Great post! I've been using this approach in my projects and it works really well.`,
    `Have you tried combining this with ${faker.helpers.arrayElement(frameworks)}? It might solve the performance issues you mentioned.`,
    `I disagree with your point about ${faker.helpers.arrayElement(concepts)}. In my experience, ${faker.lorem.sentence()}`,
    `This was exactly what I needed. I've been struggling with ${faker.helpers.arrayElement(tools)} configuration for days.`,
    `Thanks for sharing! I learned a lot from this post.`,
    `Could you elaborate more on how you handled ${faker.helpers.arrayElement(concepts)}?`,
    `I found a similar approach, but using ${faker.helpers.arrayElement(programmingLanguages)} instead. Here's why it might be better in some cases: ${faker.lorem.sentence()}`,
    `Have you considered the security implications of this approach?`,
    `This helped me solve a bug I've been stuck on for days. Thank you!`,
    `I'm curious about how this scales with larger datasets, especially when using ${faker.helpers.arrayElement(databases)}.`,
  ];

  return faker.helpers.arrayElement(templates);
};

// Generate realistic comment replies
const generateReply = () => {
  const templates = [
    `You're right! I should have mentioned that in the post.`,
    `That's an interesting point. I'll look into it and update the post.`,
    `I've tried that approach too, but found some limitations with ${faker.helpers.arrayElement(frameworks)}.`,
    `Thanks for the suggestion! I'll definitely give it a try.`,
    `Good question! In my experience, ${faker.lorem.sentence()}`,
    `I agree with you on ${faker.helpers.arrayElement(concepts)}. It's often overlooked.`,
    `That's a clever workaround! Have you open-sourced your solution?`,
    `I'm planning a follow-up post that addresses exactly this issue.`,
    `Thanks for sharing your experience. It's helpful to see different perspectives.`,
    `Valid concern. I should have addressed the security aspects in more detail.`,
  ];

  return faker.helpers.arrayElement(templates);
};

const generatePostStatus = () => {
  // return faker.helpers.arrayElement(Object.values(POST_STATUS));
  return POST_STATUS.PUBLISHED;
};

// Generate realistic programming tags
const generateTags = () => {
  const tagCount = faker.number.int({ min: 2, max: 5 });
  return faker.helpers.arrayElements(tags, tagCount);
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
    entities: [User, Post, Comment, Like],
    synchronize: true,
  });

  // Initialize the data source
  await dataSource.initialize();
  console.log('Database connection established');

  try {
    // Get all existing users from Clerk
    const userRepository = dataSource.getRepository(User);
    const existingUsers = await userRepository.find();

    if (existingUsers.length === 0) {
      console.error('No users found. Please create users via Clerk first.');
      return;
    }

    console.log(`Found ${existingUsers.length} users. Using them for seeding.`);

    // Clear existing data (if needed)
    await dataSource.query('TRUNCATE TABLE likes CASCADE');
    await dataSource.query('TRUNCATE TABLE comments CASCADE');
    await dataSource.query('TRUNCATE TABLE posts CASCADE');
    await dataSource.query('TRUNCATE TABLE user_followers CASCADE');
    await dataSource.query('TRUNCATE TABLE user_following CASCADE');
    console.log('Existing data cleared');

    // Create posts for each user (at least 5 per user)
    const postRepository = dataSource.getRepository(Post);
    const allPosts: Post[] = [];

    // For each user, create 5-8 posts
    for (const user of existingUsers) {
      const postCount = faker.number.int({ min: 5, max: 8 });

      for (let i = 0; i < postCount; i++) {
        const postTitle = generatePostTitle();
        const postSubtitle = generateSubtitle(postTitle);
        const contentBlocks = generateContentBlocks(postTitle);

        // Generate 2-5 realistic programming tags
        const tags = generateTags();

        const post = await postRepository.save({
          title: postTitle,
          subtitle: postSubtitle,
          contentBlocks: contentBlocks,
          authorId: user.id,
          tags: tags,
          views: faker.number.int({ min: 10, max: 1000 }),
          status: generatePostStatus(),
        });

        allPosts.push(post);
      }
    }

    console.log(`Created ${allPosts.length} posts`);

    // Create comments for posts
    const commentRepository = dataSource.getRepository(Comment);
    const allComments: Comment[] = [];

    // For each post, create 1-5 comments from random users
    for (const post of allPosts) {
      const commentCount = faker.number.int({ min: 1, max: 5 });

      for (let i = 0; i < commentCount; i++) {
        // Get a random user (excluding the post author)
        let commentUser;
        do {
          commentUser = faker.helpers.arrayElement(existingUsers);
        } while (commentUser.id === post.authorId);

        const comment = await commentRepository.save({
          content: generateComment(),
          authorId: commentUser.id,
          postId: post.id,
        });

        allComments.push(comment);
      }
    }

    console.log(`Created ${allComments.length} comments`);

    // Create replies to some comments
    const replyCount = Math.floor(allComments.length * 0.3); // Reply to 30% of comments
    const commentReplies: Comment[] = [];

    for (let i = 0; i < replyCount; i++) {
      const parentComment = faker.helpers.arrayElement(allComments);
      // Get a random user (can be any user including original commenter)
      const replyUser = faker.helpers.arrayElement(existingUsers);

      // First, ensure we have the post ID by loading the comment with its post relation
      const commentWithPost = await commentRepository.findOne({
        where: { id: parentComment.id },
        relations: ['post'],
      });

      if (!commentWithPost || !commentWithPost.postId) {
        console.log(
          `Skipping reply - couldn't find post for comment ${parentComment.id}`,
        );
        continue;
      }

      const reply = await commentRepository.save({
        content: generateReply(),
        authorId: replyUser.id,
        postId: commentWithPost.postId,
        parent: parentComment,
      });

      commentReplies.push(reply);
    }

    console.log(`Created ${commentReplies.length} comment replies`);

    // Create likes for posts (each user should like multiple posts, but not their own)
    const likeRepository = dataSource.getRepository(Like);
    const postLikes: Like[] = [];

    // Each user likes 40-70% of other users' posts
    for (const user of existingUsers) {
      // Filter posts not authored by this user
      const otherUsersPosts = allPosts.filter(
        (post) => post.authorId !== user.id,
      );

      // Calculate how many posts this user will like
      const likePercentage = faker.number.float({ min: 0.4, max: 0.7 });
      const likeCount = Math.floor(otherUsersPosts.length * likePercentage);

      // Randomly select posts to like
      const postsToLike = faker.helpers.arrayElements(
        otherUsersPosts,
        likeCount,
      );

      for (const post of postsToLike) {
        const like = await likeRepository.save({
          userId: user.id,
          postId: post.id,
        });

        postLikes.push(like);
      }
    }

    console.log(`Created ${postLikes.length} post likes`);

    // Create likes for comments (each user should like some comments, but not their own)
    const commentLikes: Like[] = [];

    // Each user likes 20-40% of comments (excluding their own)
    for (const user of existingUsers) {
      // Filter comments not authored by this user
      const otherUsersComments = [...allComments, ...commentReplies].filter(
        (comment) => comment.authorId !== user.id,
      );

      // Calculate how many comments this user will like
      const likePercentage = faker.number.float({ min: 0.2, max: 0.4 });
      const likeCount = Math.floor(otherUsersComments.length * likePercentage);

      // Randomly select comments to like
      const commentsToLike = faker.helpers.arrayElements(
        otherUsersComments,
        likeCount,
      );

      for (const comment of commentsToLike) {
        const like = await likeRepository.save({
          userId: user.id,
          commentId: comment.id,
        });

        commentLikes.push(like);
      }
    }

    console.log(`Created ${commentLikes.length} comment likes`);

    // Create following relationships between users
    // Each user follows 2-4 other users
    for (const follower of existingUsers) {
      // Get potential users to follow (everyone except self)
      const potentialFollowings = existingUsers.filter(
        (u) => u.id !== follower.id,
      );

      // Determine how many users to follow (2-4, or less if not enough users)
      const followCount = Math.min(
        faker.number.int({ min: 2, max: 4 }),
        potentialFollowings.length,
      );

      // Randomly select users to follow
      const usersToFollow = faker.helpers.arrayElements(
        potentialFollowings,
        followCount,
      );

      // Set up follower relationships
      follower.following = usersToFollow;
      await userRepository.save(follower);
    }

    console.log('Created following relationships between users');

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
