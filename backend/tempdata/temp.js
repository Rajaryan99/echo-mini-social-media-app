export const demoUsers = [
  {
    _id: 'u1',
    username: 'alex_dev',
    email: 'alex@example.com',
    password: 'demo12345',
    bio: 'Frontend developer • coffee lover • building cool things.',
    profilePicture:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-10-01T08:20:00.000Z',
  },
  {
    _id: 'u2',
    username: 'nina.design',
    email: 'nina@example.com',
    password: 'demo12345',
    bio: 'Product designer crafting simple and beautiful experiences.',
    profilePicture:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-10-03T12:40:00.000Z',
  },
  {
    _id: 'u3',
    username: 'sam.codes',
    email: 'sam@example.com',
    password: 'demo12345',
    bio: 'Full-stack engineer • learning • making ideas real.',
    profilePicture:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-10-05T10:15:00.000Z',
  },
];

export const demoPosts = [
  {
    _id: 'p1',
    userId: 'u1',
    content:
      'Morning coding session complete. Small wins add up. This is exactly what progress looks like.',
    imageUrl:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-11-01T09:30:00.000Z',
  },
  {
    _id: 'p2',
    userId: 'u2',
    content:
      'The best interfaces feel effortless. Clean design, clear copy, and a focus on the user journey.',
    imageUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-11-02T15:05:00.000Z',
  },
  {
    _id: 'p3',
    userId: 'u3',
    content: 'Ship it. Fix bugs. Repeat. A simple motto for building products people love.',
    imageUrl: '',
    createdAt: '2026-11-03T18:45:00.000Z',
  },
  {
    _id: 'p4',
    userId: 'u1',
    content:
      'Workspace setup is finally complete. Keyboard, coffee, and code — the essentials.',
    imageUrl:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-11-04T07:15:00.000Z',
  },
];

const demoData = {
  users: demoUsers,
  posts: demoPosts,
};

export default demoData;
