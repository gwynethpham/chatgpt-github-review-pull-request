import { Context } from './mockup/context';
import CommentOnPullRequestService from './services/commentOnPullRequestService';

(async () => {
  try {
    const mockContext = new Context(); // Instantiate your mocked context
    const service = new CommentOnPullRequestService();
    
    // Replace global context with your mock context
    (global as any).context = mockContext;

    await service.addCommentToPr();
  } catch (error) {
    console.error('Error running the service:', error);
  }
})();
