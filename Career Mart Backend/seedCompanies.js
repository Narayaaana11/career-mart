const mongoose = require('mongoose');
const Company = require('./models/Company');
require('dotenv').config();

const companiesData = [
  // Technology Giants
  {
    name: 'Google',
    logo: 'https://logo.clearbit.com/google.com',
    description: 'Leading technology company specializing in internet-related services and products, including search engines, cloud computing, software, and hardware.',
    industry: 'Technology',
    location: 'Mountain View, CA',
    headquarters: {
      city: 'Mountain View',
      country: 'United States',
      address: '1600 Amphitheatre Parkway'
    },
    careerUrl: 'https://careers.google.com',
    website: 'https://google.com',
    openPositions: 1247,
    rating: 4.5,
    featured: true,
    founded: 1998,
    companySize: '10000+',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Free Meals', 'Gym Membership', 'Flexible Hours', 'Remote Work'],
    technologies: ['Python', 'Java', 'JavaScript', 'Go', 'Kubernetes', 'TensorFlow', 'Cloud Computing'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/google',
      twitter: 'https://twitter.com/google',
      facebook: 'https://facebook.com/Google',
      instagram: 'https://instagram.com/google'
    },
    contact: {
      email: 'careers@google.com',
      phone: '+1-650-253-0000'
    }
  },
  {
    name: 'Microsoft',
    logo: 'https://logo.clearbit.com/microsoft.com',
    description: 'Global technology company that develops, manufactures, licenses, and supports software products, services, and devices.',
    industry: 'Technology',
    location: 'Redmond, WA',
    headquarters: {
      city: 'Redmond',
      country: 'United States',
      address: 'One Microsoft Way'
    },
    careerUrl: 'https://careers.microsoft.com',
    website: 'https://microsoft.com',
    openPositions: 892,
    rating: 4.3,
    featured: true,
    founded: 1975,
    companySize: '10000+',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Professional Development', 'Flexible Hours', 'Remote Work'],
    technologies: ['C#', '.NET', 'Azure', 'TypeScript', 'React', 'Power BI', 'Office 365'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/microsoft',
      twitter: 'https://twitter.com/Microsoft',
      facebook: 'https://facebook.com/Microsoft',
      instagram: 'https://instagram.com/microsoft'
    },
    contact: {
      email: 'careers@microsoft.com',
      phone: '+1-425-882-8080'
    }
  },
  {
    name: 'Apple',
    logo: 'https://logo.clearbit.com/apple.com',
    description: 'Multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.',
    industry: 'Technology',
    location: 'Cupertino, CA',
    headquarters: {
      city: 'Cupertino',
      country: 'United States',
      address: '1 Apple Park Way'
    },
    careerUrl: 'https://jobs.apple.com',
    website: 'https://apple.com',
    openPositions: 567,
    rating: 4.4,
    featured: true,
    founded: 1976,
    companySize: '10000+',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Employee Discount', 'Flexible Hours', 'Remote Work'],
    technologies: ['Swift', 'Objective-C', 'iOS', 'macOS', 'Xcode', 'Metal', 'ARKit'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/apple',
      twitter: 'https://twitter.com/Apple',
      facebook: 'https://facebook.com/Apple',
      instagram: 'https://instagram.com/apple'
    },
    contact: {
      email: 'jobs@apple.com',
      phone: '+1-408-996-1010'
    }
  },
  {
    name: 'Amazon',
    logo: 'https://logo.clearbit.com/amazon.com',
    description: 'Multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
    industry: 'Technology',
    location: 'Seattle, WA',
    headquarters: {
      city: 'Seattle',
      country: 'United States',
      address: '410 Terry Avenue North'
    },
    careerUrl: 'https://www.amazon.jobs',
    website: 'https://amazon.com',
    openPositions: 2341,
    rating: 4.1,
    featured: true,
    founded: 1994,
    companySize: '10000+',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Career Growth'],
    technologies: ['AWS', 'Java', 'Python', 'React', 'DynamoDB', 'Lambda', 'S3'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/amazon',
      twitter: 'https://twitter.com/amazon',
      facebook: 'https://facebook.com/Amazon',
      instagram: 'https://instagram.com/amazon'
    },
    contact: {
      email: 'jobs@amazon.com',
      phone: '+1-206-266-1000'
    }
  },
  {
    name: 'Meta',
    logo: 'https://logo.clearbit.com/meta.com',
    description: 'Technology company that builds products to help people connect and share, including Facebook, Instagram, WhatsApp, and Oculus.',
    industry: 'Technology',
    location: 'Menlo Park, CA',
    headquarters: {
      city: 'Menlo Park',
      country: 'United States',
      address: '1 Hacker Way'
    },
    careerUrl: 'https://www.metacareers.com',
    website: 'https://meta.com',
    openPositions: 756,
    rating: 4.2,
    featured: false,
    founded: 2004,
    companySize: '10000+',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Free Meals', 'Gym Membership', 'Flexible Hours'],
    technologies: ['React', 'PHP', 'Python', 'Hack', 'GraphQL', 'React Native', 'AI/ML'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/meta',
      twitter: 'https://twitter.com/Meta',
      facebook: 'https://facebook.com/Meta',
      instagram: 'https://instagram.com/meta'
    },
    contact: {
      email: 'careers@meta.com',
      phone: '+1-650-543-4800'
    }
  },
  {
    name: 'Netflix',
    logo: 'https://logo.clearbit.com/netflix.com',
    description: 'Entertainment company that provides streaming media and video-on-demand online, including original content production.',
    industry: 'Entertainment',
    location: 'Los Gatos, CA',
    headquarters: {
      city: 'Los Gatos',
      country: 'United States',
      address: '100 Winchester Circle'
    },
    careerUrl: 'https://jobs.netflix.com',
    website: 'https://netflix.com',
    openPositions: 234,
    rating: 4.6,
    featured: false,
    founded: 1997,
    companySize: '5001-10000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Unlimited PTO', 'Flexible Hours', 'Remote Work'],
    technologies: ['Java', 'Python', 'React', 'Node.js', 'AWS', 'Kubernetes', 'Machine Learning'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/netflix',
      twitter: 'https://twitter.com/netflix',
      facebook: 'https://facebook.com/Netflix',
      instagram: 'https://instagram.com/netflix'
    },
    contact: {
      email: 'jobs@netflix.com',
      phone: '+1-408-540-3700'
    }
  },
  {
    name: 'Tesla',
    logo: 'https://logo.clearbit.com/tesla.com',
    description: 'Electric vehicle and clean energy company that designs, develops, manufactures, and sells electric cars, battery energy storage, and solar panels.',
    industry: 'Automotive',
    location: 'Austin, TX',
    headquarters: {
      city: 'Austin',
      country: 'United States',
      address: '1 Tesla Road'
    },
    careerUrl: 'https://www.tesla.com/careers',
    website: 'https://tesla.com',
    openPositions: 445,
    rating: 4.0,
    featured: false,
    founded: 2003,
    companySize: '10000+',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Employee Discount', 'Flexible Hours'],
    technologies: ['Python', 'C++', 'JavaScript', 'React', 'Machine Learning', 'Robotics', 'Battery Technology'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/tesla-motors',
      twitter: 'https://twitter.com/Tesla',
      facebook: 'https://facebook.com/TeslaMotorsCorp',
      instagram: 'https://instagram.com/teslamotors'
    },
    contact: {
      email: 'jobs@tesla.com',
      phone: '+1-888-518-3752'
    }
  },
  {
    name: 'Spotify',
    logo: 'https://logo.clearbit.com/spotify.com',
    description: 'Audio streaming and media services provider that offers access to millions of songs, podcasts, and videos from artists around the world.',
    industry: 'Entertainment',
    location: 'Stockholm, Sweden',
    headquarters: {
      city: 'Stockholm',
      country: 'Sweden',
      address: 'Regeringsgatan 19'
    },
    careerUrl: 'https://jobs.spotify.com',
    website: 'https://spotify.com',
    openPositions: 123,
    rating: 4.3,
    featured: false,
    founded: 2006,
    companySize: '1001-5000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Free Spotify Premium'],
    technologies: ['Python', 'Java', 'React', 'Node.js', 'Kubernetes', 'Machine Learning', 'Audio Processing'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/spotify',
      twitter: 'https://twitter.com/Spotify',
      facebook: 'https://facebook.com/Spotify',
      instagram: 'https://instagram.com/spotify'
    },
    contact: {
      email: 'jobs@spotify.com',
      phone: '+46-8-450-10-00'
    }
  },
  {
    name: 'Uber',
    logo: 'https://logo.clearbit.com/uber.com',
    description: 'Mobility and delivery platform connecting riders and drivers, and providing food delivery services through Uber Eats.',
    industry: 'Transportation',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '1455 Market Street'
    },
    careerUrl: 'https://www.uber.com/careers',
    website: 'https://uber.com',
    openPositions: 678,
    rating: 3.9,
    featured: false,
    founded: 2009,
    companySize: '10000+',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Uber Credits'],
    technologies: ['Python', 'Go', 'React', 'Node.js', 'Machine Learning', 'Maps API', 'Payment Systems'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/uber',
      twitter: 'https://twitter.com/Uber',
      facebook: 'https://facebook.com/uber',
      instagram: 'https://instagram.com/uber'
    },
    contact: {
      email: 'jobs@uber.com',
      phone: '+1-800-353-8237'
    }
  },
  {
    name: 'Airbnb',
    logo: 'https://logo.clearbit.com/airbnb.com',
    description: 'Online marketplace for lodging, primarily homestays for vacation rentals, and tourism activities.',
    industry: 'Travel',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '888 Brannan Street'
    },
    careerUrl: 'https://careers.airbnb.com',
    website: 'https://airbnb.com',
    openPositions: 234,
    rating: 4.2,
    featured: false,
    founded: 2008,
    companySize: '1001-5000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Travel Credits'],
    technologies: ['React', 'Ruby on Rails', 'Python', 'JavaScript', 'Machine Learning', 'Payment Systems'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/airbnb',
      twitter: 'https://twitter.com/airbnb',
      facebook: 'https://facebook.com/Airbnb',
      instagram: 'https://instagram.com/airbnb'
    },
    contact: {
      email: 'jobs@airbnb.com',
      phone: '+1-855-424-7262'
    }
  },
  {
    name: 'Stripe',
    logo: 'https://logo.clearbit.com/stripe.com',
    description: 'Technology company that builds economic infrastructure for the internet, providing payment processing software and APIs.',
    industry: 'Fintech',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '510 Townsend Street'
    },
    careerUrl: 'https://stripe.com/jobs',
    website: 'https://stripe.com',
    openPositions: 156,
    rating: 4.4,
    featured: false,
    founded: 2010,
    companySize: '1001-5000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Learning Budget'],
    technologies: ['Ruby', 'Python', 'Go', 'React', 'TypeScript', 'Payment APIs', 'Security'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/stripe',
      twitter: 'https://twitter.com/stripe',
      facebook: 'https://facebook.com/Stripe',
      instagram: 'https://instagram.com/stripe'
    },
    contact: {
      email: 'jobs@stripe.com',
      phone: '+1-855-845-0010'
    }
  },
  {
    name: 'Salesforce',
    logo: 'https://logo.clearbit.com/salesforce.com',
    description: 'Cloud-based software company that provides customer relationship management services and enterprise applications.',
    industry: 'Technology',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '415 Mission Street'
    },
    careerUrl: 'https://salesforce.wd1.myworkdayjobs.com',
    website: 'https://salesforce.com',
    openPositions: 892,
    rating: 4.1,
    featured: false,
    founded: 1999,
    companySize: '10000+',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Volunteer Time'],
    technologies: ['Apex', 'JavaScript', 'React', 'Lightning', 'Heroku', 'MuleSoft', 'Tableau'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/salesforce',
      twitter: 'https://twitter.com/salesforce',
      facebook: 'https://facebook.com/salesforce',
      instagram: 'https://instagram.com/salesforce'
    },
    contact: {
      email: 'jobs@salesforce.com',
      phone: '+1-800-667-6389'
    }
  },
  {
    name: 'Slack',
    logo: 'https://logo.clearbit.com/slack.com',
    description: 'Business communication platform that offers instant messaging, file sharing, and team collaboration tools.',
    industry: 'Technology',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '4th Floor, 500 Howard Street'
    },
    careerUrl: 'https://slack.com/careers',
    website: 'https://slack.com',
    openPositions: 89,
    rating: 4.3,
    featured: false,
    founded: 2009,
    companySize: '1001-5000',
    revenue: '$100M-$500M',
    funding: 'Acquired',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Learning Budget'],
    technologies: ['JavaScript', 'React', 'Node.js', 'Python', 'WebRTC', 'Real-time Communication'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/slack-technologies',
      twitter: 'https://twitter.com/SlackHQ',
      facebook: 'https://facebook.com/slackhq',
      instagram: 'https://instagram.com/slackhq'
    },
    contact: {
      email: 'jobs@slack.com',
      phone: '+1-844-725-2525'
    }
  },
  {
    name: 'Zoom',
    logo: 'https://logo.clearbit.com/zoom.us',
    description: 'Video communications company that provides video telephony and online chat services through a cloud-based peer-to-peer software platform.',
    industry: 'Technology',
    location: 'San Jose, CA',
    headquarters: {
      city: 'San Jose',
      country: 'United States',
      address: '55 Almaden Boulevard'
    },
    careerUrl: 'https://zoom.wd5.myworkdayjobs.com',
    website: 'https://zoom.us',
    openPositions: 234,
    rating: 4.0,
    featured: false,
    founded: 2011,
    companySize: '1001-5000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Free Zoom Pro'],
    technologies: ['C++', 'JavaScript', 'WebRTC', 'Video Processing', 'Cloud Computing', 'Security'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/zoom-video-communications',
      twitter: 'https://twitter.com/zoom_us',
      facebook: 'https://facebook.com/zoom',
      instagram: 'https://instagram.com/zoom'
    },
    contact: {
      email: 'jobs@zoom.us',
      phone: '+1-888-799-9666'
    }
  },
  {
    name: 'Shopify',
    logo: 'https://logo.clearbit.com/shopify.com',
    description: 'E-commerce platform that allows anyone to set up an online store and sell their products, with tools for inventory management, payments, and shipping.',
    industry: 'E-commerce',
    location: 'Ottawa, Canada',
    headquarters: {
      city: 'Ottawa',
      country: 'Canada',
      address: '150 Elgin Street'
    },
    careerUrl: 'https://www.shopify.com/careers',
    website: 'https://shopify.com',
    openPositions: 345,
    rating: 4.2,
    featured: false,
    founded: 2006,
    companySize: '5001-10000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Learning Budget'],
    technologies: ['Ruby on Rails', 'React', 'TypeScript', 'GraphQL', 'Cloud Computing', 'E-commerce'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/shopify',
      twitter: 'https://twitter.com/Shopify',
      facebook: 'https://facebook.com/shopify',
      instagram: 'https://instagram.com/shopify'
    },
    contact: {
      email: 'jobs@shopify.com',
      phone: '+1-888-746-7439'
    }
  },
  {
    name: 'Palantir',
    logo: 'https://logo.clearbit.com/palantir.com',
    description: 'Software company that specializes in big data analytics, providing platforms for integrating, visualizing, and analyzing information.',
    industry: 'Technology',
    location: 'Palo Alto, CA',
    headquarters: {
      city: 'Palo Alto',
      country: 'United States',
      address: '1200 17th Street'
    },
    careerUrl: 'https://jobs.lever.co/palantir',
    website: 'https://palantir.com',
    openPositions: 123,
    rating: 4.1,
    featured: false,
    founded: 2003,
    companySize: '1001-5000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Security Clearance'],
    technologies: ['Java', 'Python', 'JavaScript', 'Big Data', 'Machine Learning', 'Data Visualization'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/palantir-technologies',
      twitter: 'https://twitter.com/PalantirTech',
      facebook: 'https://facebook.com/PalantirTechnologies',
      instagram: 'https://instagram.com/palantir'
    },
    contact: {
      email: 'jobs@palantir.com',
      phone: '+1-650-847-3000'
    }
  },
  {
    name: 'OpenAI',
    logo: 'https://logo.clearbit.com/openai.com',
    description: 'Artificial intelligence research company that develops and deploys AI systems, including ChatGPT and GPT models.',
    industry: 'Technology',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '3180 18th Street'
    },
    careerUrl: 'https://openai.com/careers',
    website: 'https://openai.com',
    openPositions: 89,
    rating: 4.7,
    featured: true,
    founded: 2015,
    companySize: '501-1000',
    revenue: '$100M-$500M',
    funding: 'Series D+',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'AI Research'],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/openai',
      twitter: 'https://twitter.com/OpenAI',
      facebook: 'https://facebook.com/OpenAI',
      instagram: 'https://instagram.com/openai'
    },
    contact: {
      email: 'jobs@openai.com',
      phone: '+1-415-568-0000'
    }
  },
  {
    name: 'Notion',
    logo: 'https://logo.clearbit.com/notion.so',
    description: 'All-in-one workspace for notes, docs, project management, and collaboration.',
    industry: 'Technology',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '548 Market Street'
    },
    careerUrl: 'https://notion.so/careers',
    website: 'https://notion.so',
    openPositions: 67,
    rating: 4.4,
    featured: false,
    founded: 2013,
    companySize: '501-1000',
    revenue: '$100M-$500M',
    funding: 'Series D+',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Free Notion'],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Real-time Collaboration'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/notion-so',
      twitter: 'https://twitter.com/NotionHQ',
      facebook: 'https://facebook.com/NotionHQ',
      instagram: 'https://instagram.com/notionhq'
    },
    contact: {
      email: 'jobs@notion.so',
      phone: '+1-415-568-0000'
    }
  },
  {
    name: 'Figma',
    logo: 'https://logo.clearbit.com/figma.com',
    description: 'Collaborative interface design tool that enables teams to design, prototype, and collect feedback in one place.',
    industry: 'Technology',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '150 Post Street'
    },
    careerUrl: 'https://figma.com/careers',
    website: 'https://figma.com',
    openPositions: 45,
    rating: 4.5,
    featured: false,
    founded: 2012,
    companySize: '501-1000',
    revenue: '$100M-$500M',
    funding: 'Acquired',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Design Tools'],
    technologies: ['TypeScript', 'React', 'WebGL', 'Canvas API', 'Real-time Collaboration', 'Design Systems'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/figma',
      twitter: 'https://twitter.com/figma',
      facebook: 'https://facebook.com/figma',
      instagram: 'https://instagram.com/figma'
    },
    contact: {
      email: 'jobs@figma.com',
      phone: '+1-415-568-0000'
    }
  },
  {
    name: 'Discord',
    logo: 'https://logo.clearbit.com/discord.com',
    description: 'Communication platform for communities and friends to stay connected through voice, video, and text chat.',
    industry: 'Technology',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '444 De Haro Street'
    },
    careerUrl: 'https://discord.com/jobs',
    website: 'https://discord.com',
    openPositions: 78,
    rating: 4.3,
    featured: false,
    founded: 2015,
    companySize: '501-1000',
    revenue: '$100M-$500M',
    funding: 'Series D+',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Gaming Perks'],
    technologies: ['React', 'TypeScript', 'Elixir', 'Rust', 'WebRTC', 'Real-time Communication', 'Gaming APIs'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/discord',
      twitter: 'https://twitter.com/discord',
      facebook: 'https://facebook.com/discord',
      instagram: 'https://instagram.com/discord'
    },
    contact: {
      email: 'jobs@discord.com',
      phone: '+1-415-568-0000'
    }
  },
  {
    name: 'Twitch',
    logo: 'https://logo.clearbit.com/twitch.tv',
    description: 'Live streaming platform for gamers and content creators to broadcast their gameplay and interact with viewers.',
    industry: 'Entertainment',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '350 Bush Street'
    },
    careerUrl: 'https://jobs.lever.co/twitch',
    website: 'https://twitch.tv',
    openPositions: 156,
    rating: 4.1,
    featured: false,
    founded: 2011,
    companySize: '1001-5000',
    revenue: '$500M-$1B',
    funding: 'Acquired',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Gaming Perks'],
    technologies: ['React', 'TypeScript', 'Go', 'AWS', 'Video Streaming', 'Real-time Chat', 'Gaming APIs'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/twitch',
      twitter: 'https://twitter.com/Twitch',
      facebook: 'https://facebook.com/Twitch',
      instagram: 'https://instagram.com/twitch'
    },
    contact: {
      email: 'jobs@twitch.tv',
      phone: '+1-415-568-0000'
    }
  },
  {
    name: 'Coinbase',
    logo: 'https://logo.clearbit.com/coinbase.com',
    description: 'Digital currency exchange platform that allows users to buy, sell, and trade cryptocurrencies.',
    industry: 'Fintech',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '100 Pine Street'
    },
    careerUrl: 'https://coinbase.com/careers',
    website: 'https://coinbase.com',
    openPositions: 234,
    rating: 4.0,
    featured: false,
    founded: 2012,
    companySize: '1001-5000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Crypto Perks'],
    technologies: ['React', 'TypeScript', 'Go', 'Python', 'Blockchain', 'Cryptocurrency', 'Security'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/coinbase',
      twitter: 'https://twitter.com/coinbase',
      facebook: 'https://facebook.com/Coinbase',
      instagram: 'https://instagram.com/coinbase'
    },
    contact: {
      email: 'jobs@coinbase.com',
      phone: '+1-888-908-7930'
    }
  },
  {
    name: 'Robinhood',
    logo: 'https://logo.clearbit.com/robinhood.com',
    description: 'Financial services company that offers commission-free stock, ETF, and cryptocurrency trading through a mobile app.',
    industry: 'Fintech',
    location: 'Menlo Park, CA',
    headquarters: {
      city: 'Menlo Park',
      country: 'United States',
      address: '85 Willow Road'
    },
    careerUrl: 'https://careers.robinhood.com',
    website: 'https://robinhood.com',
    openPositions: 189,
    rating: 3.8,
    featured: false,
    founded: 2013,
    companySize: '1001-5000',
    revenue: '$500M-$1B',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Trading Perks'],
    technologies: ['React', 'TypeScript', 'Python', 'Go', 'Financial APIs', 'Mobile Development', 'Security'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/robinhood',
      twitter: 'https://twitter.com/robinhoodapp',
      facebook: 'https://facebook.com/RobinhoodApp',
      instagram: 'https://instagram.com/robinhoodapp'
    },
    contact: {
      email: 'jobs@robinhood.com',
      phone: '+1-650-940-2700'
    }
  },
  {
    name: 'DoorDash',
    logo: 'https://logo.clearbit.com/doordash.com',
    description: 'Food delivery platform that connects customers with local restaurants and delivery drivers.',
    industry: 'Food Delivery',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '303 2nd Street'
    },
    careerUrl: 'https://careers.doordash.com',
    website: 'https://doordash.com',
    openPositions: 345,
    rating: 3.9,
    featured: false,
    founded: 2013,
    companySize: '10000+',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Food Perks'],
    technologies: ['React', 'TypeScript', 'Python', 'Go', 'Machine Learning', 'Logistics', 'Mobile Apps'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/doordash',
      twitter: 'https://twitter.com/doordash',
      facebook: 'https://facebook.com/doordash',
      instagram: 'https://instagram.com/doordash'
    },
    contact: {
      email: 'jobs@doordash.com',
      phone: '+1-855-973-1040'
    }
  },
  {
    name: 'Instacart',
    logo: 'https://logo.clearbit.com/instacart.com',
    description: 'Grocery delivery and pick-up service that allows customers to order groceries online and have them delivered.',
    industry: 'Food Delivery',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '50 Beale Street'
    },
    careerUrl: 'https://instacart.careers',
    website: 'https://instacart.com',
    openPositions: 234,
    rating: 3.7,
    featured: false,
    founded: 2012,
    companySize: '1001-5000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Grocery Perks'],
    technologies: ['React', 'TypeScript', 'Python', 'Go', 'Machine Learning', 'Logistics', 'E-commerce'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/instacart',
      twitter: 'https://twitter.com/instacart',
      facebook: 'https://facebook.com/Instacart',
      instagram: 'https://instagram.com/instacart'
    },
    contact: {
      email: 'jobs@instacart.com',
      phone: '+1-888-246-7822'
    }
  },
  {
    name: 'Pinterest',
    logo: 'https://logo.clearbit.com/pinterest.com',
    description: 'Visual discovery engine for finding ideas like recipes, home and style inspiration, and more.',
    industry: 'Technology',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '505 Brannan Street'
    },
    careerUrl: 'https://pinterest.com/careers',
    website: 'https://pinterest.com',
    openPositions: 123,
    rating: 4.2,
    featured: false,
    founded: 2010,
    companySize: '1001-5000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Creative Perks'],
    technologies: ['React', 'TypeScript', 'Python', 'Machine Learning', 'Computer Vision', 'Recommendation Systems'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/pinterest',
      twitter: 'https://twitter.com/Pinterest',
      facebook: 'https://facebook.com/Pinterest',
      instagram: 'https://instagram.com/pinterest'
    },
    contact: {
      email: 'jobs@pinterest.com',
      phone: '+1-415-236-4000'
    }
  },
  {
    name: 'Snap Inc.',
    logo: 'https://logo.clearbit.com/snap.com',
    description: 'Camera company that develops Snapchat and other camera applications for mobile devices.',
    industry: 'Technology',
    location: 'Santa Monica, CA',
    headquarters: {
      city: 'Santa Monica',
      country: 'United States',
      address: '3000 31st Street'
    },
    careerUrl: 'https://careers.snap.com',
    website: 'https://snap.com',
    openPositions: 167,
    rating: 4.0,
    featured: false,
    founded: 2011,
    companySize: '1001-5000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Creative Perks'],
    technologies: ['React', 'TypeScript', 'Python', 'AR/VR', 'Computer Vision', 'Mobile Development', 'Real-time Communication'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/snap-inc',
      twitter: 'https://twitter.com/Snapchat',
      facebook: 'https://facebook.com/snapchat',
      instagram: 'https://instagram.com/snapchat'
    },
    contact: {
      email: 'jobs@snap.com',
      phone: '+1-424-800-0000'
    }
  },
  {
    name: 'Square',
    logo: 'https://logo.clearbit.com/squareup.com',
    description: 'Financial services and digital payments company that provides point-of-sale systems and payment processing.',
    industry: 'Fintech',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '1455 Market Street'
    },
    careerUrl: 'https://squareup.com/careers',
    website: 'https://squareup.com',
    openPositions: 234,
    rating: 4.1,
    featured: false,
    founded: 2009,
    companySize: '1001-5000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Financial Perks'],
    technologies: ['React', 'TypeScript', 'Ruby', 'Go', 'Payment Processing', 'Mobile Development', 'Security'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/square',
      twitter: 'https://twitter.com/Square',
      facebook: 'https://facebook.com/Square',
      instagram: 'https://instagram.com/square'
    },
    contact: {
      email: 'jobs@squareup.com',
      phone: '+1-855-700-6000'
    }
  },
  {
    name: 'GitHub',
    logo: 'https://logo.clearbit.com/github.com',
    description: 'Platform for software development and version control using Git, providing hosting for software development.',
    industry: 'Technology',
    location: 'San Francisco, CA',
    headquarters: {
      city: 'San Francisco',
      country: 'United States',
      address: '88 Colin P Kelly Jr Street'
    },
    careerUrl: 'https://github.com/about/careers',
    website: 'https://github.com',
    openPositions: 89,
    rating: 4.5,
    featured: true,
    founded: 2008,
    companySize: '1001-5000',
    revenue: '$500M-$1B',
    funding: 'Acquired',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Open Source Perks'],
    technologies: ['Ruby', 'Go', 'JavaScript', 'Git', 'GitHub Actions', 'Code Review', 'Developer Tools'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/github',
      twitter: 'https://twitter.com/github',
      facebook: 'https://facebook.com/GitHub',
      instagram: 'https://instagram.com/github'
    },
    contact: {
      email: 'jobs@github.com',
      phone: '+1-415-735-4488'
    }
  },
  {
    name: 'Atlassian',
    logo: 'https://logo.clearbit.com/atlassian.com',
    description: 'Software company that develops products for software developers, project managers, and content management.',
    industry: 'Technology',
    location: 'Sydney, Australia',
    headquarters: {
      city: 'Sydney',
      country: 'Australia',
      address: '341 George Street'
    },
    careerUrl: 'https://atlassian.com/careers',
    website: 'https://atlassian.com',
    openPositions: 456,
    rating: 4.2,
    featured: false,
    founded: 2002,
    companySize: '1001-5000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Developer Tools'],
    technologies: ['Java', 'Python', 'React', 'TypeScript', 'Jira', 'Confluence', 'Bitbucket'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/atlassian',
      twitter: 'https://twitter.com/Atlassian',
      facebook: 'https://facebook.com/Atlassian',
      instagram: 'https://instagram.com/atlassian'
    },
    contact: {
      email: 'jobs@atlassian.com',
      phone: '+61-2-8223-4000'
    }
  },
  {
    name: 'Datadog',
    logo: 'https://logo.clearbit.com/datadoghq.com',
    description: 'Monitoring and analytics platform for cloud-scale applications, providing monitoring of servers, databases, tools, and services.',
    industry: 'Technology',
    location: 'New York, NY',
    headquarters: {
      city: 'New York',
      country: 'United States',
      address: '620 8th Avenue'
    },
    careerUrl: 'https://datadoghq.com/careers',
    website: 'https://datadoghq.com',
    openPositions: 234,
    rating: 4.1,
    featured: false,
    founded: 2010,
    companySize: '1001-5000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Monitoring Tools'],
    technologies: ['Python', 'Go', 'React', 'TypeScript', 'Monitoring', 'Observability', 'Cloud Computing'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/datadog',
      twitter: 'https://twitter.com/datadoghq',
      facebook: 'https://facebook.com/DatadogHQ',
      instagram: 'https://instagram.com/datadoghq'
    },
    contact: {
      email: 'jobs@datadoghq.com',
      phone: '+1-866-329-4466'
    }
  },
  {
    name: 'MongoDB',
    logo: 'https://logo.clearbit.com/mongodb.com',
    description: 'Database company that develops and provides commercial support for the open-source MongoDB database.',
    industry: 'Technology',
    location: 'New York, NY',
    headquarters: {
      city: 'New York',
      country: 'United States',
      address: '1633 Broadway'
    },
    careerUrl: 'https://mongodb.com/careers',
    website: 'https://mongodb.com',
    openPositions: 189,
    rating: 4.3,
    featured: false,
    founded: 2007,
    companySize: '1001-5000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Database Tools'],
    technologies: ['JavaScript', 'Python', 'Go', 'MongoDB', 'Database', 'Cloud Computing', 'Developer Tools'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/mongodb',
      twitter: 'https://twitter.com/MongoDB',
      facebook: 'https://facebook.com/MongoDB',
      instagram: 'https://instagram.com/mongodb'
    },
    contact: {
      email: 'jobs@mongodb.com',
      phone: '+1-866-237-8815'
    }
  },
  {
    name: 'Snowflake',
    logo: 'https://logo.clearbit.com/snowflake.com',
    description: 'Cloud-based data warehousing company that provides data storage and analytics services.',
    industry: 'Technology',
    location: 'San Mateo, CA',
    headquarters: {
      city: 'San Mateo',
      country: 'United States',
      address: '106 E 6th Street'
    },
    careerUrl: 'https://snowflake.com/careers',
    website: 'https://snowflake.com',
    openPositions: 345,
    rating: 4.2,
    featured: false,
    founded: 2012,
    companySize: '1001-5000',
    revenue: '$1B+',
    funding: 'Public',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Data Tools'],
    technologies: ['SQL', 'Python', 'Java', 'JavaScript', 'Data Warehousing', 'Cloud Computing', 'Analytics'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/snowflake-computing',
      twitter: 'https://twitter.com/SnowflakeDB',
      facebook: 'https://facebook.com/SnowflakeComputing',
      instagram: 'https://instagram.com/snowflake'
    },
    contact: {
      email: 'jobs@snowflake.com',
      phone: '+1-844-766-9353'
    }
  }
];

async function seedCompanies() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing companies
    await Company.deleteMany({});
    console.log('Cleared existing companies');

    // Insert new companies
    const companies = await Company.insertMany(companiesData);
    console.log(`Successfully seeded ${companies.length} companies`);

    // Create text index for search
    await Company.createIndexes();
    console.log('Created indexes');

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding companies:', error);
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedCompanies();
}

module.exports = { seedCompanies, companiesData }; 