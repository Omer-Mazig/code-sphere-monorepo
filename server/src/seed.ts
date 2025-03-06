import { DataSource } from 'typeorm';
import { Post } from './posts/entities/post.entity';
import { Comment } from './comments/entities/comment.entity';
import { Like } from './likes/entities/like.entity';
import { User } from './users/entities/user.entity';
import { config } from 'dotenv';
import { faker } from '@faker-js/faker';

// Load environment variables
config();

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
    synchronize: false,
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
        const postTitle = faker.lorem.sentence();
        const postContent = `# ${postTitle}\n\n${faker.lorem.paragraphs(3)}\n\n${faker.lorem.paragraphs(2)}`;

        // Generate 2-5 random tags
        const tagCount = faker.number.int({ min: 2, max: 5 });
        const tags: string[] = [];
        for (let j = 0; j < tagCount; j++) {
          tags.push(faker.word.sample());
        }

        const post = await postRepository.save({
          title: postTitle,
          content: postContent,
          authorId: user.id,
          tags: tags,
          views: faker.number.int({ min: 10, max: 1000 }),
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
          content: faker.lorem.paragraph(),
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

      const reply = await commentRepository.save({
        content: faker.lorem.paragraph(),
        authorId: replyUser.id,
        postId: parentComment.post?.id,
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
