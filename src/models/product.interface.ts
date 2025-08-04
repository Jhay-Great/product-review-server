export interface ProductFeedback {
  currentUser: User,
  productRequests: Feedback[],
}

export interface Feedback {
  id: string;
  title: string;
  category: string;
  upvotes: number;
  status: string;
  description: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  user: User;
}

export interface User {
  image: string;
  name: string;
  username: string;
}

export interface CreateFeedback {
  title: string;
  category: string;
  description: string;
}