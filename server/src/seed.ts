import { DataSource } from 'typeorm';
import { Post } from './posts/entities/post.entity';
import { ContentBlock, PostStatus } from '../../shared/types/posts.types';
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

// Add more specific tech topics
const specificTopics = {
  JavaScript: [
    'Closures',
    'Promises',
    'ES6+',
    'Async/Await',
    'Event Loop',
    'Prototypes',
    'Hoisting',
  ],
  React: [
    'Hooks',
    'Context API',
    'Redux',
    'Server Components',
    'Suspense',
    'React 18',
    'Virtual DOM',
  ],
  Python: [
    'Decorators',
    'Generators',
    'Type Hints',
    'Asyncio',
    'Context Managers',
    'List Comprehensions',
  ],
  Docker: [
    'Multi-stage Builds',
    'Volumes',
    'Networks',
    'Compose',
    'Security Best Practices',
  ],
  Database: [
    'Indexing',
    'Migrations',
    'Query Optimization',
    'Sharding',
    'Connection Pooling',
  ],
  Testing: [
    'Unit Tests',
    'Integration Tests',
    'E2E Tests',
    'Mocking',
    'Test Coverage',
  ],
  Performance: [
    'Lazy Loading',
    'Code Splitting',
    'Memoization',
    'Memory Leaks',
    'Profiling',
  ],
  Security: [
    'Authentication',
    'Authorization',
    'CSRF Protection',
    'XSS Prevention',
    'SQL Injection',
  ],
  Architecture: [
    'Monoliths',
    'Microservices',
    'Event-Driven',
    'Hexagonal Architecture',
    'CQRS',
  ],
};

// Common developer problems and solutions
const developerProblems = [
  'Debugging Memory Leaks',
  'Optimizing Database Queries',
  'State Management Complexity',
  'API Design Best Practices',
  'Authentication Workflows',
  'Managing Technical Debt',
  'Microservice Communication',
  'Handling Race Conditions',
  'Building Accessible UIs',
  'Mobile-First Responsive Design',
  'Error Handling Strategies',
  'Test Coverage Maintenance',
  'Optimizing CI/CD Pipelines',
  'Securing User Data',
  'Implementing Real-time Features',
];

// Real-world case studies
const caseStudies = [
  'How We Reduced API Response Time by 80%',
  'Our Journey Migrating from Monolith to Microservices',
  'Lessons Learned After 1 Year of Using TypeScript',
  'A Deep Dive Into Our React Component Architecture',
  'How We Automated Our Deployment Pipeline',
  'Scaling Our Database to Handle 10M Daily Users',
  "Implementing Authentication That Doesn't Suck",
  'Our Testing Strategy That Caught 95% of Bugs',
  'Building a Design System From Scratch',
  'How We Reduced Our Bundle Size by 60%',
];

// Generate realistic post titles about programming
const generatePostTitle = () => {
  const titleTemplates = [
    // How-to guides
    `How to Implement ${faker.helpers.arrayElement(specificTopics.JavaScript)} in Modern JavaScript`,
    `Building a ${faker.helpers.arrayElement(['Scalable', 'Maintainable', 'Performant', 'Secure'])} ${faker.helpers.arrayElement(frameworks)} Application: Step-by-Step Guide`,
    `${faker.helpers.arrayElement(tools)} in Production: A Complete Setup Guide`,

    // Comparisons
    `${faker.helpers.arrayElement(programmingLanguages)} vs ${faker.helpers.arrayElement(programmingLanguages)}: Choosing the Right Tool in ${new Date().getFullYear()}`,
    `${faker.helpers.arrayElement(frameworks)} or ${faker.helpers.arrayElement(frameworks)}? A Practical Comparison for Your Next Project`,
    `${faker.helpers.arrayElement(databases)} vs ${faker.helpers.arrayElement(databases)}: Performance and Use Cases`,

    // Problem-solution
    `Solving ${faker.helpers.arrayElement(developerProblems)}: Approaches That Actually Work`,
    `Fixing Common ${faker.helpers.arrayElement(frameworks)} Performance Issues`,
    `Avoiding the Top 5 Mistakes When Working With ${faker.helpers.arrayElement([...programmingLanguages, ...frameworks, ...databases])}`,

    // Opinion/Experience
    `Why We Switched From ${faker.helpers.arrayElement(frameworks)} to ${faker.helpers.arrayElement(frameworks)} and What We Learned`,
    `${faker.helpers.arrayElement(caseStudies)}`,
    `${faker.helpers.arrayElement(['10', '7', '5'])} ${faker.helpers.arrayElement(['Lessons', 'Tips', 'Insights'])} From ${faker.helpers.arrayElement(['Refactoring', 'Building', 'Scaling'])} Our ${faker.helpers.arrayElement(frameworks)} Codebase`,

    // Advanced topics
    `Advanced ${faker.helpers.arrayElement(programmingLanguages)} Patterns You Should Know`,
    `Deep Dive: ${faker.helpers.arrayElement(specificTopics.Architecture)} in Practice`,
    `Understanding ${faker.helpers.arrayElement(concepts)} Through Real Examples`,

    // Trends/State of tech
    `The State of ${faker.helpers.arrayElement([...programmingLanguages, ...frameworks, ...concepts])} in ${new Date().getFullYear()}`,
    `What's New in ${faker.helpers.arrayElement([...programmingLanguages, ...frameworks])} ${faker.helpers.arrayElement(['v5', 'v3', 'v2', 'v10', 'v18'])}`,
    `Is ${faker.helpers.arrayElement([...programmingLanguages, ...frameworks, ...concepts])} Still Relevant? An Analysis`,

    // Tutorials
    `Building a ${faker.helpers.arrayElement(['REST API', 'Chat Application', 'Dashboard', 'Authentication System', 'E-commerce Platform'])} with ${faker.helpers.arrayElement(frameworks)} and ${faker.helpers.arrayElement(databases)}`,
    `From Zero to Production: ${faker.helpers.arrayElement(programmingLanguages)} ${faker.helpers.arrayElement(['Web App', 'Mobile App', 'CLI Tool', 'API'])} Tutorial`,
    `Test-Driven ${faker.helpers.arrayElement(frameworks)} Development: A Practical Example`,
  ];

  return faker.helpers.arrayElement(titleTemplates);
};

// Generate a subtitle for a blog post
const generateSubtitle = (title: string) => {
  // Extract the main tech or concept from the title for more relevant subtitles
  const extractMainTopic = (title: string) => {
    for (const tech of [
      ...programmingLanguages,
      ...frameworks,
      ...tools,
      ...concepts,
      ...databases,
    ]) {
      if (title.includes(tech)) {
        return tech;
      }
    }
    return null;
  };

  const mainTopic = extractMainTopic(title) || '';

  const subtitleTemplates = [
    `A practical guide for developers working with ${mainTopic || 'modern technology stacks'}`,
    `Learn battle-tested approaches from real-world experiences`,
    `Proven strategies that helped our team solve complex problems`,
    `Insights from building production applications at scale`,
    `Best practices we've developed after years of trial and error`,
    `The complete roadmap from beginner to expert`,
    `Code examples and architectural insights from a senior perspective`,
    `Avoiding common pitfalls when working with ${mainTopic || 'this technology'}`,
    `Performance optimizations that actually made a difference`,
    `Key insights that will change how you approach ${mainTopic || 'development'}`,
  ];

  return faker.helpers.arrayElement(subtitleTemplates);
};

// Generate content blocks for a blog post
const generateContentBlocks = (title: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];

  // Extract key topics from the title to create coherent content
  const titleLower = title.toLowerCase();
  const mainTopic = () => {
    for (const tech of [
      ...programmingLanguages,
      ...frameworks,
      ...tools,
      ...concepts,
      ...databases,
    ]) {
      if (titleLower.includes(tech.toLowerCase())) {
        return tech;
      }
    }
    return null;
  };

  const topic = mainTopic() || 'this technology';
  const isHowTo =
    titleLower.includes('how to') ||
    titleLower.includes('guide') ||
    titleLower.includes('tutorial');
  const isComparison =
    titleLower.includes(' vs ') || titleLower.includes('comparison');
  const isCaseStudy =
    titleLower.includes('how we') ||
    titleLower.includes('our') ||
    titleLower.includes('journey');

  // Introduction paragraph - tailored to the type of article
  if (isHowTo) {
    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `One of the most common challenges developers face when working with ${topic} is knowing how to implement it properly. After working with ${topic} on several production applications, I've developed a systematic approach that addresses common pitfalls and leverages best practices. This guide will walk you through the process step-by-step, with real-world examples.`,
    });
  } else if (isComparison) {
    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `Choosing between different technologies is one of the most consequential decisions you'll make at the start of a project. The wrong choice can lead to significant technical debt and limitations down the road. In this article, I'll compare these options based on my experience using both in production environments, giving you concrete criteria to make an informed decision.`,
    });
  } else if (isCaseStudy) {
    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `In this case study, I'll share our team's experience with ${topic}. We faced significant challenges that required us to rethink our approach. I'll be transparent about both our successes and failures, with the hope that our lessons learned can help other teams avoid the same pitfalls. All examples come from our actual production codebase (with sensitive details removed).`,
    });
  } else {
    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `${topic} has been gaining significant traction in the development community, and for good reason. It addresses several pain points that developers have struggled with for years. I've spent the last several months deeply exploring its capabilities, and in this article, I'll share what I've learned through practical examples and real-world scenarios.`,
    });
  }

  // Table of contents for longer posts
  if (faker.number.int(10) > 6) {
    // 40% chance to add a table of contents
    blocks.push({
      id: uuidv4(),
      type: 'heading',
      content: "What We'll Cover",
    });

    // Generate a table of contents based on the type of article
    const tocItems: string[] = [];
    if (isHowTo) {
      tocItems.push('Understanding the fundamentals of ' + topic);
      tocItems.push('Common implementation challenges');
      tocItems.push('Step-by-step implementation guide');
      tocItems.push('Best practices and optimization tips');
      tocItems.push('Troubleshooting and debugging');
    } else if (isComparison) {
      tocItems.push('Key differences and similarities');
      tocItems.push('Performance comparison');
      tocItems.push('Developer experience and ecosystem');
      tocItems.push('Use cases and scenarios');
      tocItems.push('Migration considerations');
    } else {
      tocItems.push('Background and context');
      tocItems.push('Key concepts and principles');
      tocItems.push('Practical implementation details');
      tocItems.push('Lessons learned and best practices');
      tocItems.push('Future considerations');
    }

    // Add TOC as a list
    tocItems.forEach((item) => {
      blocks.push({
        id: uuidv4(),
        type: 'paragraph',
        content: `• ${item}`,
      });
    });
  }

  // Background section with heading and paragraph
  blocks.push({
    id: uuidv4(),
    type: 'heading',
    content: 'Background',
  });

  if (isHowTo) {
    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `Before diving into implementation details, it's important to understand why ${topic} exists and what problems it solves. ${topic} was developed to address limitations in traditional approaches, particularly around ${faker.helpers.arrayElement(['performance', 'developer experience', 'scalability', 'maintainability', 'security'])}. Previous solutions often struggled with ${faker.helpers.arrayElement(['complexity', 'overhead', 'steep learning curves', 'poor performance', 'lack of flexibility'])}, which ${topic} elegantly resolves through its ${faker.helpers.arrayElement(['declarative API', 'efficient algorithm', 'innovative architecture', 'thoughtful abstractions'])}.`,
    });
  } else if (isComparison) {
    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `Both technologies emerged from the need to solve similar problems, but they've evolved with different priorities and philosophies. Understanding their origins and design goals will help contextualize their current feature sets and trade-offs. While they might seem interchangeable at first glance, each excels in specific scenarios and comes with its own set of assumptions and constraints.`,
    });
  } else {
    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `${topic} has evolved considerably since its initial release. The current version (${faker.helpers.arrayElement(['v2', 'v3', 'v4', 'v5', 'v10', 'v18'])}) introduces several key improvements over previous iterations, particularly in terms of ${faker.helpers.arrayElement(['performance', 'developer experience', 'type safety', 'bundle size', 'feature set'])}. These enhancements make it a compelling option for modern applications that prioritize ${faker.helpers.arrayElement(['user experience', 'developer productivity', 'maintainability', 'scalability', 'security'])}.`,
    });
  }

  // Problem statement section
  blocks.push({
    id: uuidv4(),
    type: 'heading',
    content: isHowTo
      ? 'The Problem'
      : isComparison
        ? 'Key Differences'
        : 'Core Concepts',
  });

  if (isHowTo) {
    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `Many developers struggle with ${topic} because of its ${faker.helpers.arrayElement(['complex mental model', 'extensive API surface', 'nuanced edge cases', 'steep learning curve'])}. Common pitfalls include ${faker.helpers.arrayElement(['improper error handling', 'performance bottlenecks', 'incorrect state management', 'security vulnerabilities', 'poor architectural decisions'])}. These issues often appear only in production when it's too late, leading to significant technical debt and maintenance headaches.`,
    });
  } else if (isComparison) {
    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `The fundamental difference between these technologies lies in their ${faker.helpers.arrayElement(['programming model', 'runtime behavior', 'type system', 'ecosystem', 'community support'])}. While one follows a ${faker.helpers.arrayElement(['declarative', 'imperative', 'functional', 'object-oriented'])} approach, the other embraces ${faker.helpers.arrayElement(['reactivity', 'mutability', 'immutability', 'static typing', 'dynamic typing'])}. This divergence influences everything from performance characteristics to developer workflows.`,
    });
  } else {
    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `To effectively use ${topic}, you need to understand its core principles. Unlike traditional approaches, ${topic} emphasizes ${faker.helpers.arrayElement(['composition over inheritance', 'convention over configuration', 'code over configuration', 'separation of concerns', 'single responsibility'])}. This paradigm shift requires rethinking how you structure your code and manage dependencies throughout your application.`,
    });
  }

  // Add an alert/note with actually useful information
  const alertTypes = ['info', 'warning', 'error'] as const;
  const alertType = faker.helpers.arrayElement(alertTypes);

  let alertContent = '';
  if (alertType === 'info') {
    alertContent = `${topic} works best when combined with ${faker.helpers.arrayElement([...tools, ...frameworks, ...databases])}. This combination provides excellent developer experience while maintaining production-grade performance.`;
  } else if (alertType === 'warning') {
    alertContent = `Be careful when using ${topic} with legacy systems. You might encounter compatibility issues, especially with ${faker.helpers.arrayElement(['older browsers', 'specific OS versions', 'certain database engines', 'non-standard API implementations'])}.`;
  } else {
    alertContent = `Never implement ${topic} without proper error handling. A common cause of production issues is inadequate error boundaries, which can lead to cascading failures across your application.`;
  }

  blocks.push({
    id: uuidv4(),
    type: 'alert',
    content: alertContent,
    meta: {
      title:
        alertType === 'info'
          ? 'Pro Tip'
          : alertType === 'warning'
            ? 'Caution'
            : 'Critical Warning',
      alertType: alertType,
    },
  });

  // Approach/solution section
  blocks.push({
    id: uuidv4(),
    type: 'heading',
    content: isHowTo
      ? 'Step-by-Step Implementation'
      : isComparison
        ? 'Practical Comparison'
        : 'Implementation Details',
  });

  blocks.push({
    id: uuidv4(),
    type: 'paragraph',
    content: `After experimenting with different approaches, I've found that the most effective way to work with ${topic} involves a systematic process. This method has been battle-tested in production environments and consistently yields maintainable, performant code. The key insight is to focus on ${faker.helpers.arrayElement(['simplicity', 'clarity', 'testability', 'extensibility', 'performance'])} from the beginning, rather than optimizing prematurely or over-engineering your solution.`,
  });

  // Code example - make language relevant to the post topic
  const determineLanguage = () => {
    if (
      titleLower.includes('javascript') ||
      titleLower.includes('typescript') ||
      titleLower.includes('react') ||
      titleLower.includes('vue') ||
      titleLower.includes('angular') ||
      titleLower.includes('node')
    ) {
      return titleLower.includes('typescript') ? 'typescript' : 'javascript';
    } else if (
      titleLower.includes('python') ||
      titleLower.includes('django') ||
      titleLower.includes('flask')
    ) {
      return 'python';
    } else if (titleLower.includes('java') || titleLower.includes('spring')) {
      return 'java';
    } else if (titleLower.includes('c#') || titleLower.includes('asp.net')) {
      return 'csharp';
    } else if (titleLower.includes('go') || titleLower.includes('golang')) {
      return 'go';
    } else if (titleLower.includes('rust')) {
      return 'rust';
    } else {
      return faker.helpers.arrayElement([
        'javascript',
        'typescript',
        'python',
        'java',
        'csharp',
        'go',
        'rust',
      ]);
    }
  };

  const language = determineLanguage();

  // Generate realistic code based on the language and topic
  let codeContent = '';
  if (language === 'javascript' || language === 'typescript') {
    if (titleLower.includes('react')) {
      codeContent = `// A custom React hook for ${topic}
const use${topic.replace(/\s+/g, '')} = (initialState) => {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        // Implementation-specific logic
        const result = await fetchData();
        setState(result);
      } catch (err) {
        setError(err);
        console.error("Failed to initialize:", err);
      } finally {
        setLoading(false);
      }
    };
    
    initialize();
  }, []);

  const updateState = useCallback((newValue) => {
    // Validation and business logic
    if (isValid(newValue)) {
      setState(newValue);
    }
  }, []);

  return { state, loading, error, updateState };
};`;
    } else {
      codeContent = `// Implementation for ${topic}
class ${topic.replace(/\s+/g, '')}Manager {
  constructor(config) {
    this.config = {
      timeout: 5000,
      retries: 3,
      ...config
    };
    this.cache = new Map();
  }

  async process(data) {
    const cacheKey = this.getCacheKey(data);
    
    if (this.cache.has(cacheKey)) {
      console.log("Cache hit for:", cacheKey);
      return this.cache.get(cacheKey);
    }
    
    let attempts = 0;
    
    while (attempts < this.config.retries) {
      try {
        const result = await this.doProcessing(data);
        this.cache.set(cacheKey, result);
        return result;
      } catch (error) {
        attempts++;
        console.warn(\`Attempt \${attempts} failed: \${error.message}\`);
        
        if (attempts >= this.config.retries) {
          throw new Error(\`Processing failed after \${attempts} attempts\`);
        }
        
        // Exponential backoff
        await new Promise(r => setTimeout(r, 
          Math.pow(2, attempts) * 100));
      }
    }
  }
  
  getCacheKey(data) {
    // Implementation-specific logic
  }
  
  async doProcessing(data) {
    // Implementation-specific logic
  }
}`;
    }
  } else if (language === 'python') {
    codeContent = `# Implementation for ${topic}
import time
import logging
from typing import Dict, Any, Optional
from dataclasses import dataclass

@dataclass
class Config:
    timeout: float = 5.0
    retries: int = 3
    cache_size: int = 100

class ${topic.replace(/\s+/g, '')}Manager:
    def __init__(self, config: Optional[Config] = None):
        self.config = config or Config()
        self.cache = {}
        self.logger = logging.getLogger(__name__)
    
    def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        cache_key = self._get_cache_key(data)
        
        if cache_key in self.cache:
            self.logger.info(f"Cache hit for: {cache_key}")
            return self.cache[cache_key]
        
        attempts = 0
        
        while attempts < self.config.retries:
            try:
                result = self._do_processing(data)
                if len(self.cache) >= self.config.cache_size:
                    # Simple LRU implementation
                    self.cache.pop(next(iter(self.cache)))
                self.cache[cache_key] = result
                return result
            except Exception as e:
                attempts += 1
                self.logger.warning(f"Attempt {attempts} failed: {str(e)}")
                
                if attempts >= self.config.retries:
                    raise RuntimeError(f"Processing failed after {attempts} attempts")
                
                # Exponential backoff
                time.sleep(2 ** attempts * 0.1)
    
    def _get_cache_key(self, data: Dict[str, Any]) -> str:
        # Implementation-specific logic
        pass
    
    def _do_processing(self, data: Dict[str, Any]) -> Dict[str, Any]:
        # Implementation-specific logic
        pass`;
  } else {
    codeContent = `// Example implementation for ${topic}
// This code demonstrates key concepts and patterns

// Core functionality
public class ${topic.replace(/\s+/g, '')}Manager {
    private final Configuration config;
    private final Cache<String, Result> cache;
    
    public ${topic.replace(/\s+/g, '')}Manager(Configuration config) {
        this.config = config;
        this.cache = new LRUCache<>(config.getCacheSize());
    }
    
    public Result process(Data data) throws ProcessingException {
        String cacheKey = getCacheKey(data);
        
        if (cache.contains(cacheKey)) {
            logger.info("Cache hit for: {}", cacheKey);
            return cache.get(cacheKey);
        }
        
        int attempts = 0;
        
        while (attempts < config.getRetries()) {
            try {
                Result result = doProcessing(data);
                cache.put(cacheKey, result);
                return result;
            } catch (Exception e) {
                attempts++;
                logger.warn("Attempt {} failed: {}", attempts, e.getMessage());
                
                if (attempts >= config.getRetries()) {
                    throw new ProcessingException("Failed after " + attempts + " attempts", e);
                }
                
                // Exponential backoff
                try {
                    Thread.sleep((long) Math.pow(2, attempts) * 100);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new ProcessingException("Processing interrupted", ie);
                }
            }
        }
        
        // Should never reach here due to exception in loop
        throw new IllegalStateException("Unexpected execution flow");
    }
    
    protected String getCacheKey(Data data) {
        // Implementation-specific logic
    }
    
    protected Result doProcessing(Data data) throws Exception {
        // Implementation-specific logic
    }
}`;
  }

  blocks.push({
    id: uuidv4(),
    type: 'code',
    content: codeContent,
    meta: {
      title: `Implementation of ${topic} in ${language}`,
      language: language,
    },
  });

  // Add a follow-up explanation
  blocks.push({
    id: uuidv4(),
    type: 'paragraph',
    content: `This implementation addresses several key aspects of working with ${topic}. First, it handles error cases gracefully through ${faker.helpers.arrayElement(['retries with exponential backoff', 'comprehensive error boundaries', 'defensive programming techniques', 'proper exception handling'])}. Second, it improves performance via ${faker.helpers.arrayElement(['caching frequently used results', 'lazy loading', 'efficient resource management', 'asynchronous processing'])}. Finally, it maintains a clean separation of concerns, making the code more testable and maintainable.`,
  });

  // Add an image if relevant
  if (faker.number.int(10) > 6) {
    // 40% chance to add an image
    const imageDescriptions = [
      `Diagram showing the architecture of ${topic}`,
      `${topic} performance comparison chart`,
      `Workflow diagram for implementing ${topic}`,
      `Decision tree for choosing between different ${topic} approaches`,
      `Visual representation of ${topic} concepts`,
    ];

    blocks.push({
      id: uuidv4(),
      type: 'image',
      content: faker.helpers.arrayElement(imageDescriptions),
      meta: {
        imageUrl: `https://picsum.photos/seed/${faker.number.int(1000)}/800/400`,
      },
    });
  }

  // Advanced concepts/deep dive section
  if (faker.number.int(10) > 3) {
    // 70% chance for advanced section
    blocks.push({
      id: uuidv4(),
      type: 'heading',
      content: 'Advanced Techniques',
    });

    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `For more complex scenarios, you can extend the basic implementation with advanced features. One powerful pattern is ${faker.helpers.arrayElement(['composition', 'dependency injection', 'the strategy pattern', 'lazy evaluation', 'middleware', 'memoization'])}. This approach lets you ${faker.helpers.arrayElement(['dynamically swap implementations', 'progressively enhance functionality', 'adapt to changing requirements', 'optimize for specific use cases'])}.`,
    });

    // Sometimes add a second code example for advanced use cases
    if (faker.number.int(10) > 5) {
      // 50% chance
      blocks.push({
        id: uuidv4(),
        type: 'code',
        content: `// Advanced implementation example
${language === 'python' ? 'def' : 'function'} optimized${topic.replace(/\s+/g, '')}(${language === 'python' ? 'data, config=None' : 'data, config = {}'}) {
  // Implementation-specific optimizations
  // This is a more specialized version for performance-critical cases
}`,
        meta: {
          title: `Advanced ${topic} optimization technique`,
          language: language,
        },
      });
    }
  }

  // Best practices section
  blocks.push({
    id: uuidv4(),
    type: 'heading',
    content: 'Best Practices',
  });

  const bestPractices = [
    `Always validate input data to prevent unexpected behavior`,
    `Implement proper error handling and logging for easier debugging`,
    `Write comprehensive tests, especially for edge cases`,
    `Consider performance implications for large-scale applications`,
    `Follow the principle of least privilege for security-sensitive operations`,
    `Document your implementation decisions for future maintainers`,
    `Use semantic versioning when releasing libraries and APIs`,
    `Consider backwards compatibility when making changes`,
  ];

  // Select 3-5 best practices randomly
  const selectedPractices = faker.helpers.arrayElements(
    bestPractices,
    faker.number.int({ min: 3, max: 5 }),
  );

  selectedPractices.forEach((practice, index) => {
    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `${index + 1}. ${practice}`,
    });
  });

  // Conclusion
  blocks.push({
    id: uuidv4(),
    type: 'heading',
    content: 'Conclusion',
  });

  if (isHowTo) {
    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `Implementing ${topic} correctly requires careful planning and attention to detail, but the benefits make it worthwhile. The approach outlined in this article has consistently produced maintainable, performant code across multiple projects. Start with the fundamentals, follow the best practices, and iterate as you gain experience. Your future self and team members will thank you for the clean, robust implementation.`,
    });
  } else if (isComparison) {
    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `There's no one-size-fits-all answer when comparing these technologies. The right choice depends on your specific requirements, team expertise, and project constraints. Consider factors like performance needs, learning curve, ecosystem maturity, and long-term maintenance when making your decision. In some cases, a hybrid approach might even be the optimal solution.`,
    });
  } else {
    blocks.push({
      id: uuidv4(),
      type: 'paragraph',
      content: `${topic} continues to evolve rapidly, with new features and improvements regularly being released. The principles covered in this article should serve as a solid foundation, even as the ecosystem grows. Stay curious, keep experimenting, and don't forget to share your own insights with the community. This collaborative knowledge-sharing is what makes the development world so dynamic and rewarding.`,
    });
  }

  return blocks;
};

// Generate realistic comments related to post content
const generateComment = (post: Post) => {
  // Extract key topic from post title to generate relevant comments
  const extractTopics = (title: string) => {
    const allTechnologies = [
      ...programmingLanguages,
      ...frameworks,
      ...tools,
      ...concepts,
      ...databases,
    ];
    return allTechnologies.filter((tech) =>
      title.toLowerCase().includes(tech.toLowerCase()),
    );
  };

  const postTopics = extractTopics(post.title);
  const topic =
    postTopics.length > 0 ? faker.helpers.arrayElement(postTopics) : null;

  // Check post type
  const isHowTo =
    post.title.toLowerCase().includes('how to') ||
    post.title.toLowerCase().includes('guide') ||
    post.title.toLowerCase().includes('tutorial');
  const isComparison =
    post.title.toLowerCase().includes(' vs ') ||
    post.title.toLowerCase().includes('comparison');
  const isCaseStudy =
    post.title.toLowerCase().includes('how we') ||
    post.title.toLowerCase().includes('our') ||
    post.title.toLowerCase().includes('journey');

  // Generate comment based on post type and topic
  if (isHowTo) {
    const howToComments = [
      `Thanks for this detailed guide! I've been struggling with ${topic || 'this'} for weeks. Your approach to ${faker.helpers.arrayElement(['error handling', 'performance optimization', 'state management', 'configuration'])} is particularly helpful.`,

      `I followed your tutorial step by step and it worked perfectly! One question though - how would this implementation handle ${faker.helpers.arrayElement(['high traffic scenarios', 'authentication edge cases', 'legacy system integration', 'mobile-specific optimizations'])}?`,

      `Great article! I've been using a similar approach but with ${faker.helpers.arrayElement([...frameworks, ...tools])} instead. It adds some complexity but provides better ${faker.helpers.arrayElement(['performance', 'security', 'developer experience', 'scalability'])}.`,

      `This is exactly what I needed! Our team has been debating the best way to implement ${topic || 'this pattern'}, and your article provides the clarity we needed. Will definitely be adopting this approach.`,

      `Have you considered using ${faker.helpers.arrayElement([...frameworks, ...tools])} for this? It might solve some of the edge cases you mentioned in the article.`,
    ];
    return faker.helpers.arrayElement(howToComments);
  } else if (isComparison) {
    const comparisonComments = [
      `Interesting comparison! I've used both technologies in production, and I'd add that ${faker.helpers.arrayElement([...frameworks, ...tools, ...programmingLanguages])} has better ${faker.helpers.arrayElement(['documentation', 'community support', 'learning resources', 'integration options'])}.`,

      `Great article, but I think you missed an important point about ${topic || 'these technologies'} - ${faker.helpers.arrayElement(['the ecosystem maturity', 'the hiring market', 'long-term maintenance', 'enterprise support options'])} is also a crucial factor to consider.`,

      `I switched from ${faker.helpers.arrayElement([...frameworks, ...programmingLanguages])} to ${topic || faker.helpers.arrayElement([...frameworks, ...programmingLanguages])} last year and haven't looked back. Your comparison accurately captures the trade-offs.`,

      `While I agree with most points, I think ${topic || 'the newer option'} isn't mature enough for mission-critical applications yet. We encountered serious issues with ${faker.helpers.arrayElement(['reliability', 'edge cases', 'performance at scale', 'security updates'])}.`,

      `Perfect timing! I'm currently evaluating both for our next project. Has anyone in the comments used these in a microservices architecture?`,
    ];
    return faker.helpers.arrayElement(comparisonComments);
  } else if (isCaseStudy) {
    const caseStudyComments = [
      `Thanks for sharing your experience! We're facing similar challenges with our ${topic || 'system'}. Did you consider ${faker.helpers.arrayElement(['a different architecture', 'alternative tools', 'a phased approach', 'outsourcing certain components'])}?`,

      `Impressive results! How long did the whole process take from planning to full implementation? And what size was your team?`,

      `Great case study. We've been hesitant to make a similar transition because of concerns about ${faker.helpers.arrayElement(['downtime', 'learning curve', 'migration complexity', 'budget constraints'])}. How did you handle that aspect?`,

      `This is a fantastic write-up! It would be great to hear more about the specific metrics you used to measure success, and how you convinced stakeholders to approve such a significant change.`,

      `We tried a similar approach but ran into issues with ${faker.helpers.arrayElement(['legacy system integration', 'data migration', 'performance bottlenecks', 'team resistance'])}. How did you overcome these challenges?`,
    ];
    return faker.helpers.arrayElement(caseStudyComments);
  } else {
    // Default comments for other types of posts
    const defaultComments = [
      `Really insightful article on ${topic || 'this topic'}. I especially appreciated the section on ${faker.helpers.arrayElement(['best practices', 'common pitfalls', 'advanced techniques', 'performance considerations'])}.`,

      `I've been working with ${topic || 'this technology'} for about 2 years now, and your analysis is spot-on. One thing I'd add is that ${faker.helpers.arrayElement(['the learning curve can be steep', 'the community is incredibly helpful', 'the documentation has improved significantly', 'there are some subtle bugs to watch out for'])}.`,

      `Great post! Have you explored how ${topic || 'this'} interacts with ${faker.helpers.arrayElement([...frameworks, ...tools, ...databases])}? That combination has worked really well for our team.`,

      `This is one of the clearest explanations of ${topic || 'this concept'} I've seen. Would love to see a follow-up post about ${faker.helpers.arrayElement(['advanced techniques', 'real-world case studies', 'performance optimizations', 'security considerations'])}.`,

      `I'm new to ${topic || 'this area'} and found your article extremely helpful. Could you recommend any resources for diving deeper into this topic?`,
    ];
    return faker.helpers.arrayElement(defaultComments);
  }
};

// Generate realistic comment replies that connect to the parent comment
const generateReply = (parentComment: string) => {
  // Extract potential topics from the parent comment to generate a relevant reply
  const extractKeyword = (comment: string) => {
    const allTechnologies = [
      ...programmingLanguages,
      ...frameworks,
      ...tools,
      ...concepts,
      ...databases,
    ];
    for (const tech of allTechnologies) {
      if (comment.includes(tech)) {
        return tech;
      }
    }

    // Check for common phrases in the comment
    const phrases = [
      'performance',
      'security',
      'learning curve',
      'documentation',
      'best practices',
      'implementation',
      'approach',
      'architecture',
      'community',
      'experience',
      'issue',
      'problem',
      'solution',
      'tutorial',
      'guide',
      'example',
      'production',
    ];

    for (const phrase of phrases) {
      if (comment.toLowerCase().includes(phrase.toLowerCase())) {
        return phrase;
      }
    }

    return null;
  };

  const keyword = extractKeyword(parentComment);

  // Check if the comment is a question
  const isQuestion = parentComment.includes('?');

  // Tailored replies based on the comment type
  if (isQuestion) {
    const questionReplies = [
      `Great question! In my experience, ${keyword || 'this approach'} works best when you ${faker.helpers.arrayElement(['start with a clear architecture', 'focus on test coverage', 'document your decisions', 'keep dependencies minimal'])}.`,

      `I've actually faced that exact question in a recent project. We solved it by ${faker.helpers.arrayElement(['using a middleware layer', 'implementing a custom hook', 'abstracting the logic into a service', 'creating a dedicated module'])}.`,

      `From what I've seen, most teams handle ${keyword || 'that aspect'} by ${faker.helpers.arrayElement(['setting up proper monitoring', 'implementing feature flags', 'following the strangler pattern', 'establishing clear boundaries'])}.`,

      `I'm not the author, but I can share that in our production environment, we addressed this by ${faker.helpers.arrayElement(['isolating the critical path', 'implementing circuit breakers', 'using a caching layer', 'leveraging serverless functions'])}.`,

      `That's actually addressed in the article, but perhaps not explicitly. The key is to ${faker.helpers.arrayElement(['focus on the core principles', 'understand the trade-offs', 'start with a minimal implementation', 'prioritize maintainability'])}.`,
    ];
    return faker.helpers.arrayElement(questionReplies);
  } else if (parentComment.toLowerCase().includes('thank')) {
    // Response to a thank you comment
    const thankYouReplies = [
      `You're welcome! Glad you found it helpful. Let me know if you have any questions as you implement this.`,

      `Happy to help! I remember how challenging it was when I first started with ${keyword || 'this technology'}.`,

      `Thanks for the kind words! I'm planning a follow-up article on ${faker.helpers.arrayElement(['advanced patterns', 'optimization techniques', 'real-world case studies', 'common pitfalls'])} soon.`,

      `Appreciate the feedback! If you're interested in more content like this, I've written about ${faker.helpers.arrayElement([...concepts, ...tools])} as well.`,

      `That's why I write these articles - to help others avoid the same struggles I went through. Good luck with your project!`,
    ];
    return faker.helpers.arrayElement(thankYouReplies);
  } else if (
    parentComment.toLowerCase().includes('issue') ||
    parentComment.toLowerCase().includes('problem') ||
    parentComment.toLowerCase().includes('error') ||
    parentComment.toLowerCase().includes('bug')
  ) {
    // Response to a comment about problems
    const problemReplies = [
      `Sorry to hear you're having trouble. The most common cause of that issue is ${faker.helpers.arrayElement(['incorrect configuration', 'version mismatches', 'missing dependencies', 'environment-specific quirks'])}.`,

      `That sounds frustrating. Have you tried ${faker.helpers.arrayElement(['clearing the cache', 'updating all dependencies', 'checking for conflicting packages', 'reviewing the logs for subtle errors'])}?`,

      `We encountered a similar issue in our project. It turned out to be related to ${faker.helpers.arrayElement(['an edge case in the API', 'a race condition', 'browser compatibility', 'memory management'])}.`,

      `That's an interesting edge case. Could you share more details about your environment and setup? It might help pinpoint the cause.`,

      `Thanks for pointing this out! I'll update the article to address this scenario. In the meantime, a workaround is to ${faker.helpers.arrayElement(['use a different approach for that specific case', 'add explicit error handling', 'implement a feature flag', 'create a custom wrapper'])}.`,
    ];
    return faker.helpers.arrayElement(problemReplies);
  } else if (
    parentComment.toLowerCase().includes('alternative') ||
    parentComment.toLowerCase().includes('instead') ||
    parentComment.toLowerCase().includes('different')
  ) {
    // Response to suggestions of alternatives
    const alternativeReplies = [
      `That's a great suggestion! ${keyword || 'That alternative'} definitely has advantages for ${faker.helpers.arrayElement(['certain use cases', 'larger teams', 'performance-critical applications', 'specific industries'])}.`,

      `I've experimented with that approach too. While it works well for ${faker.helpers.arrayElement(['simpler applications', 'specific ecosystems', 'highly scaled systems', 'certain architectural styles'])}, I found the approach in the article more ${faker.helpers.arrayElement(['flexible', 'maintainable', 'intuitive', 'performant'])} overall.`,

      `You make a valid point. The trade-off with ${keyword || 'that alternative'} is usually between ${faker.helpers.arrayElement(['simplicity and power', 'performance and developer experience', 'flexibility and predictability', 'learning curve and long-term productivity'])}.`,

      `I should have mentioned that alternative! It's especially good when you need ${faker.helpers.arrayElement(['strict type safety', 'real-time capabilities', 'offline support', 'complex state management'])}.`,

      `That's definitely worth considering. In my next article, I plan to do a more comprehensive comparison including that approach.`,
    ];
    return faker.helpers.arrayElement(alternativeReplies);
  } else {
    // Generic thoughtful replies
    const genericReplies = [
      `Thanks for sharing your perspective! The point about ${keyword || 'that aspect'} is particularly insightful.`,

      `I agree, especially regarding ${keyword || 'that point'}. It's often overlooked but makes a significant difference in practice.`,

      `That's been my experience as well. What I find particularly valuable about ${keyword || 'this approach'} is how it scales as your application grows.`,

      `You've highlighted an important consideration. Finding the right balance between ${faker.helpers.arrayElement(['simplicity and flexibility', 'performance and maintainability', 'developer experience and user experience', 'innovation and stability'])} is always a challenge.`,

      `Well said! The ${keyword || 'technical'} landscape is constantly evolving, so sharing real-world experiences like this is incredibly valuable for the community.`,
    ];
    return faker.helpers.arrayElement(genericReplies);
  }
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

    // Define content creation patterns - some users create more content than others
    // This creates a more realistic distribution
    const userContentPatterns = existingUsers.map((user) => {
      return {
        user,
        // Randomly classify users as casual, regular, or power users
        userType: faker.helpers.arrayElement([
          'casual',
          'regular',
          'regular',
          'power',
        ]), // Higher chance of regular users
      };
    });

    // Create posts for each user with realistic distribution
    const postRepository = dataSource.getRepository(Post);
    const allPosts: Post[] = [];

    // For each user, create posts based on their content creation pattern
    for (const { user, userType } of userContentPatterns) {
      // Determine post count based on user type
      let postCount;
      if (userType === 'casual') {
        postCount = faker.number.int({ min: 1, max: 4 });
      } else if (userType === 'regular') {
        postCount = faker.number.int({ min: 5, max: 12 });
      } else {
        // power user
        postCount = faker.number.int({ min: 15, max: 25 });
      }

      // Create a history of posts over time, not all at once
      // This simulates a realistic posting history
      for (let i = 0; i < postCount; i++) {
        const postTitle = generatePostTitle();
        const postSubtitle = generateSubtitle(postTitle);
        const contentBlocks = generateContentBlocks(postTitle);

        // Generate 2-5 realistic programming tags
        const tags = generateTags();

        // Realistic view counts - popular posts get more views
        const isPopularPost = faker.datatype.boolean(0.3); // 30% of posts are "popular"
        const views = isPopularPost
          ? faker.number.int({ min: 500, max: 5000 })
          : faker.number.int({ min: 10, max: 499 });

        // Simulate post creation over time (1-12 months ago)
        const createdAt = new Date();
        createdAt.setMonth(
          createdAt.getMonth() - faker.number.int({ min: 0, max: 12 }),
        );

        // Some posts might be drafts or scheduled
        let status: PostStatus = POST_STATUS.PUBLISHED;

        // For power users, ensure most content is published
        if (userType === 'power' && i < postCount - 2) {
          status = POST_STATUS.PUBLISHED;
        }

        // For casual users, they might have more drafts
        if (userType === 'casual' && faker.datatype.boolean(0.4)) {
          status = POST_STATUS.DRAFT;
        }

        const post = await postRepository.save({
          title: postTitle,
          subtitle: postSubtitle,
          contentBlocks: contentBlocks,
          authorId: user.id,
          tags: tags,
          views: views,
          status: status,
          createdAt: createdAt,
          updatedAt: createdAt,
        });

        allPosts.push(post);
      }
    }

    console.log(`Created ${allPosts.length} posts`);

    // Create comments for posts with realistic distribution
    const commentRepository = dataSource.getRepository(Comment);
    const allComments: Comment[] = [];

    // Popular posts get more comments
    for (const post of allPosts) {
      // Only published posts get comments
      if (post.status !== POST_STATUS.PUBLISHED) {
        continue;
      }

      // Popular posts (determined by views) get more comments
      const isPopularPost = post.views > 500;
      const commentCount = isPopularPost
        ? faker.number.int({ min: 3, max: 15 })
        : faker.number.int({ min: 0, max: 5 });

      for (let i = 0; i < commentCount; i++) {
        // Get a random user (excluding the post author)
        let commentUser;
        do {
          commentUser = faker.helpers.arrayElement(existingUsers);
        } while (commentUser.id === post.authorId);

        // Create comment with a timestamp after the post creation but before now
        const postDate = new Date(post.createdAt);
        const now = new Date();
        const commentDate = new Date(
          faker.date.between({ from: postDate, to: now }).toISOString(),
        );

        const comment = await commentRepository.save({
          content: generateComment(post),
          authorId: commentUser.id,
          postId: post.id,
          createdAt: commentDate,
          updatedAt: commentDate,
        });

        allComments.push(comment);
      }
    }

    console.log(`Created ${allComments.length} comments`);

    // Create replies to some comments - more for popular posts/topics
    // Realistically, not all comments get replies
    const commentReplies: Comment[] = [];

    for (const comment of allComments) {
      // 40% chance of getting a reply
      if (faker.datatype.boolean(0.4)) {
        // 1-3 replies per comment
        const replyCount = faker.number.int({ min: 1, max: 3 });

        for (let i = 0; i < replyCount; i++) {
          // Get a random user (can be any user including original commenter)
          const replyUser = faker.helpers.arrayElement(existingUsers);

          // First, ensure we have the post ID by loading the comment with its post relation
          const commentWithPost = await commentRepository.findOne({
            where: { id: comment.id },
            relations: ['post'],
          });

          if (!commentWithPost || !commentWithPost.postId) {
            console.log(
              `Skipping reply - couldn't find post for comment ${comment.id}`,
            );
            continue;
          }

          // Create reply with timestamp after the parent comment
          const commentDate = new Date(comment.createdAt);
          const now = new Date();
          const replyDate = new Date(
            faker.date.between({ from: commentDate, to: now }).toISOString(),
          );

          const reply = await commentRepository.save({
            content: generateReply(comment.content),
            authorId: replyUser.id,
            postId: commentWithPost.postId,
            parent: comment,
            createdAt: replyDate,
            updatedAt: replyDate,
          });

          commentReplies.push(reply);
        }
      }
    }

    console.log(`Created ${commentReplies.length} comment replies`);

    // Create likes for posts with realistic patterns
    const likeRepository = dataSource.getRepository(Like);
    const postLikes: Like[] = [];

    // Create a more realistic distribution of likes
    // Popular posts get more likes
    for (const post of allPosts) {
      // Only published posts get likes
      if (post.status !== POST_STATUS.PUBLISHED) {
        continue;
      }

      // Determine how many users will like this post
      // High view posts get more likes
      let likeRatio;
      if (post.views > 2000) {
        likeRatio = faker.number.float({ min: 0.4, max: 0.8 }); // 40-80% of users like very popular posts
      } else if (post.views > 500) {
        likeRatio = faker.number.float({ min: 0.2, max: 0.5 }); // 20-50% like moderately popular posts
      } else {
        likeRatio = faker.number.float({ min: 0.05, max: 0.25 }); // 5-25% like regular posts
      }

      // Find users who will like this post (excluding the author)
      const potentialLikers = existingUsers.filter(
        (user) => user.id !== post.authorId,
      );
      const likeCount = Math.floor(potentialLikers.length * likeRatio);
      const usersWhoLike = faker.helpers.arrayElements(
        potentialLikers,
        likeCount,
      );

      // Create likes with timestamps after post creation
      for (const user of usersWhoLike) {
        const postDate = new Date(post.createdAt);
        const now = new Date();
        const likeDate = new Date(
          faker.date.between({ from: postDate, to: now }).toISOString(),
        );

        const like = await likeRepository.save({
          userId: user.id,
          postId: post.id,
          createdAt: likeDate,
          updatedAt: likeDate,
        });

        postLikes.push(like);
      }
    }

    console.log(`Created ${postLikes.length} post likes`);

    // Create likes for comments - focus on insightful comments
    const commentLikes: Like[] = [];

    // Comments get fewer likes than posts typically
    for (const comment of [...allComments, ...commentReplies]) {
      // 40% of comments get likes
      if (faker.datatype.boolean(0.4)) {
        // Determine how many likes based on comment length (proxy for quality)
        const isLongComment = comment.content.length > 100;
        const likeRatio = isLongComment
          ? faker.number.float({ min: 0.05, max: 0.2 }) // 5-20% of users like longer comments
          : faker.number.float({ min: 0.01, max: 0.1 }); // 1-10% like shorter comments

        // Find potential likers (excluding comment author)
        const potentialLikers = existingUsers.filter(
          (user) => user.id !== comment.authorId,
        );
        const likeCount = Math.floor(potentialLikers.length * likeRatio);
        const usersWhoLike = faker.helpers.arrayElements(
          potentialLikers,
          likeCount,
        );

        // Create likes with timestamps after comment creation
        for (const user of usersWhoLike) {
          const commentDate = new Date(comment.createdAt);
          const now = new Date();
          const likeDate = new Date(
            faker.date.between({ from: commentDate, to: now }).toISOString(),
          );

          const like = await likeRepository.save({
            userId: user.id,
            commentId: comment.id,
            createdAt: likeDate,
            updatedAt: likeDate,
          });

          commentLikes.push(like);
        }
      }
    }

    console.log(`Created ${commentLikes.length} comment likes`);

    // Create following relationships between users with realistic patterns
    // Active content creators get more followers

    // First, identify power users who should have more followers
    const powerUsers = userContentPatterns
      .filter((pattern) => pattern.userType === 'power')
      .map((pattern) => pattern.user);

    // Regular users
    const regularUsers = userContentPatterns
      .filter((pattern) => pattern.userType === 'regular')
      .map((pattern) => pattern.user);

    // Casual users
    const casualUsers = userContentPatterns
      .filter((pattern) => pattern.userType === 'casual')
      .map((pattern) => pattern.user);

    // Create realistic following patterns
    for (const follower of existingUsers) {
      // Each user has different following patterns

      // Following power users (influencers) - most users follow them
      if (powerUsers.length > 0) {
        const powerUserFollowRatio = faker.number.float({ min: 0.7, max: 0.9 }); // 70-90% chance to follow power users
        const powerUsersToFollow = powerUsers.filter(
          (user) => user.id !== follower.id,
        );
        const selectedPowerUsers = faker.helpers.arrayElements(
          powerUsersToFollow,
          Math.floor(powerUsersToFollow.length * powerUserFollowRatio),
        );

        // Regular users - medium follow rate
        const regularUserFollowRatio = faker.number.float({
          min: 0.3,
          max: 0.6,
        }); // 30-60% chance to follow regular users
        const regularUsersToFollow = regularUsers.filter(
          (user) => user.id !== follower.id,
        );
        const selectedRegularUsers = faker.helpers.arrayElements(
          regularUsersToFollow,
          Math.floor(regularUsersToFollow.length * regularUserFollowRatio),
        );

        // Casual users - low follow rate
        const casualUserFollowRatio = faker.number.float({
          min: 0.1,
          max: 0.3,
        }); // 10-30% chance to follow casual users
        const casualUsersToFollow = casualUsers.filter(
          (user) => user.id !== follower.id,
        );
        const selectedCasualUsers = faker.helpers.arrayElements(
          casualUsersToFollow,
          Math.floor(casualUsersToFollow.length * casualUserFollowRatio),
        );

        // Combine all selected users to follow
        const usersToFollow = [
          ...selectedPowerUsers,
          ...selectedRegularUsers,
          ...selectedCasualUsers,
        ];

        // Set up follower relationships
        follower.following = usersToFollow;
        await userRepository.save(follower);
      }
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
