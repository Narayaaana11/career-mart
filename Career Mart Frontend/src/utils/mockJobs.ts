import { Job } from "@/types/job";

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechFlow Inc.',
    location: 'San Francisco, CA',
    type: 'Full-Time',
    postedDate: '2 days ago',
    applyUrl: 'https://example.com/apply/1',
    salary: '$120k - $150k',
    description: 'We are looking for a passionate Senior Frontend Developer to join our team. You will be responsible for building the next generation of web applications using React, TypeScript, and modern web technologies.',
    tags: ['React', 'TypeScript', 'CSS', 'JavaScript']
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateLab',
    location: 'Remote',
    type: 'Remote',
    postedDate: '1 day ago',
    applyUrl: 'https://example.com/apply/2',
    salary: '$100k - $130k',
    description: 'Join our product team to drive innovation and strategy for our flagship products. You will work closely with engineering, design, and business teams.',
    tags: ['Product Strategy', 'Analytics', 'Agile']
  },
  {
    id: '3',
    title: 'Data Science Intern',
    company: 'DataCorp',
    location: 'New York, NY',
    type: 'Internship',
    postedDate: '3 days ago',
    applyUrl: 'https://example.com/apply/3',
    description: 'Exciting internship opportunity to work on machine learning projects and data analysis. Perfect for students looking to gain real-world experience.',
    tags: ['Python', 'Machine Learning', 'SQL']
  },
  {
    id: '4',
    title: 'UX Designer',
    company: 'DesignHub',
    location: 'Austin, TX',
    type: 'Full-Time',
    postedDate: '1 week ago',
    applyUrl: 'https://example.com/apply/4',
    salary: '$85k - $110k',
    description: 'We are seeking a creative UX Designer to help us create intuitive and beautiful user experiences. You will work on web and mobile applications.',
    tags: ['Figma', 'User Research', 'Prototyping']
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Remote',
    type: 'Remote',
    postedDate: '4 days ago',
    applyUrl: 'https://example.com/apply/5',
    salary: '$110k - $140k',
    description: 'Looking for a skilled DevOps Engineer to help us scale our infrastructure and improve our deployment processes.',
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
  },
  {
    id: '6',
    title: 'Marketing Coordinator',
    company: 'BrandBoost',
    location: 'Los Angeles, CA',
    type: 'Full-Time',
    postedDate: '5 days ago',
    applyUrl: 'https://example.com/apply/6',
    salary: '$50k - $65k',
    description: 'Join our marketing team to help execute campaigns and grow our brand presence across multiple channels.',
    tags: ['Social Media', 'Content Marketing', 'Analytics']
  },
  {
    id: '7',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Seattle, WA',
    type: 'Full-Time',
    postedDate: '1 day ago',
    applyUrl: 'https://example.com/apply/7',
    salary: '$95k - $125k',
    description: 'Exciting opportunity to work on cutting-edge technology at a fast-growing startup. You will work across the entire stack.',
    tags: ['Node.js', 'React', 'PostgreSQL', 'GraphQL']
  },
  {
    id: '8',
    title: 'Software Engineering Intern',
    company: 'MegaCorp',
    location: 'Mountain View, CA',
    type: 'Internship',
    postedDate: '6 days ago',
    applyUrl: 'https://example.com/apply/8',
    description: 'Summer internship program for students interested in software engineering. Work on real projects with mentorship.',
    tags: ['Java', 'Spring Boot', 'Git']
  }
];

export const getFilteredJobs = (jobs: Job[], filters: import('@/types/job').JobFilters): Job[] => {
  return jobs.filter(job => {
    // Keyword search
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const searchableText = `${job.title} ${job.company} ${job.description || ''} ${job.tags?.join(' ') || ''} ${job.skills?.join(' ') || ''}`.toLowerCase();
      if (!searchableText.includes(keyword)) {
        return false;
      }
    }

    // Job type filter
    if (filters.type.length > 0 && !filters.type.includes(job.type)) {
      return false;
    }

    // Posted within filter (handle both string and Date objects)
    if (filters.postedWithin !== 'all') {
      const jobDate = new Date(job.postedDate);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filters.postedWithin) {
        case '24h':
          if (daysDiff > 1) return false;
          break;
        case '7d':
          if (daysDiff > 7) return false;
          break;
        case '30d':
          if (daysDiff > 30) return false;
          break;
      }
    }

    return true;
  });
};