
import { faker } from '@faker-js/faker';

// Define skill sets for different job categories
const skillSets = {
  developer: [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 
    'Next.js', 'GraphQL', 'REST APIs', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Redux', 'Jest', 'Cypress',
    'HTML', 'CSS', 'Sass', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Figma', 'WebRTC',
    'Python', 'Django', 'Flask', 'Ruby', 'Rails', 'PHP', 'Laravel', 'Java', 'Spring Boot',
    'Kotlin', 'Swift', 'React Native', 'Flutter', 'Go', 'Rust', 'C#', '.NET'
  ],
  designer: [
    'UI Design', 'UX Design', 'User Research', 'Wireframing', 'Prototyping', 'Figma',
    'Adobe XD', 'Sketch', 'Illustrator', 'Photoshop', 'InDesign', 'After Effects',
    'Typography', 'Color Theory', 'Design Systems', 'Responsive Design', 'Motion Design',
    'Interaction Design', 'Usability Testing', 'Information Architecture', 'Storyboarding',
    'Brand Identity', 'Logo Design', 'Visual Design', 'Accessibility', 'A/B Testing'
  ],
  marketing: [
    'Content Marketing', 'SEO', 'SEM', 'Social Media Marketing', 'Email Marketing',
    'Google Analytics', 'Google Ads', 'Facebook Ads', 'Instagram Ads', 'TikTok Marketing',
    'LinkedIn Marketing', 'YouTube Marketing', 'Marketing Automation', 'CRM', 'Hubspot',
    'Mailchimp', 'Copywriting', 'Brand Strategy', 'Public Relations', 'Market Research',
    'Campaign Management', 'Growth Hacking', 'Conversion Rate Optimization', 'Google Tag Manager'
  ],
  product: [
    'Product Strategy', 'Product Roadmapping', 'User Stories', 'Agile', 'Scrum', 'Kanban',
    'JIRA', 'Confluence', 'Trello', 'Asana', 'Product Analytics', 'Competitive Analysis',
    'A/B Testing', 'Feature Prioritization', 'User Feedback', 'Stakeholder Management',
    'Go-to-Market Strategy', 'Product Lifecycle Management', 'Market Research', 'Pricing Strategy',
    'Product Metrics', 'OKRs', 'KPIs', 'User Interviews'
  ],
  data: [
    'SQL', 'Python', 'R', 'Tableau', 'Power BI', 'Excel', 'Data Visualization',
    'Data Modeling', 'ETL', 'Data Warehousing', 'Big Data', 'Hadoop', 'Spark',
    'Machine Learning', 'Statistical Analysis', 'Predictive Modeling', 'A/B Testing',
    'Data Mining', 'Natural Language Processing', 'Computer Vision', 'Deep Learning',
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter Notebooks'
  ],
  sales: [
    'Prospecting', 'Lead Generation', 'CRM', 'Salesforce', 'HubSpot', 'Sales Funnel',
    'Consultative Selling', 'Solution Selling', 'Account Management', 'Contract Negotiation',
    'Cold Calling', 'Sales Presentations', 'Closing Techniques', 'Pipeline Management',
    'Client Relationship Building', 'Sales Forecasting', 'Territory Management', 'Upselling',
    'Cross-selling', 'SaaS Sales', 'Enterprise Sales', 'Channel Sales', 'Inside Sales'
  ],
  executive: [
    'Strategic Planning', 'Leadership', 'Team Building', 'Change Management',
    'Executive Presentations', 'P&L Management', 'Budget Planning', 'Stakeholder Management',
    'Business Development', 'Corporate Strategy', 'Organizational Development',
    'Crisis Management', 'Board Reporting', 'Venture Capital', 'M&A', 'Fundraising',
    'Investor Relations', 'Scaling Operations', 'Executive Communication'
  ]
};

// Job titles for different categories
const jobTitles = {
  developer: [
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Mobile Developer', 'DevOps Engineer', 'Software Engineer',
    'React Developer', 'Node.js Developer', 'JavaScript Developer',
    'Python Developer', 'Cloud Engineer', 'Site Reliability Engineer',
    'UI Engineer', 'Systems Architect', 'Principal Engineer',
    'Technical Lead', 'Engineering Manager', 'CTO', 'Blockchain Developer',
    'Game Developer', 'AI/ML Engineer', 'Solutions Engineer'
  ],
  designer: [
    'UI Designer', 'UX Designer', 'Product Designer', 'Visual Designer',
    'Interaction Designer', 'UX Researcher', 'Design Lead', 'Creative Director',
    'Brand Designer', 'Design Systems Engineer', 'Motion Designer',
    'Graphic Designer', 'Illustration Artist', 'UI/UX Designer',
    'Design Manager', 'Web Designer', 'Design Technologist', 'Art Director'
  ],
  marketing: [
    'Marketing Manager', 'Digital Marketing Specialist', 'Content Strategist',
    'SEO Specialist', 'Social Media Manager', 'Growth Marketer',
    'Brand Manager', 'Community Manager', 'PR Specialist',
    'Email Marketing Specialist', 'Marketing Director', 'CMO',
    'Content Creator', 'Marketing Analyst', 'Campaign Manager'
  ],
  product: [
    'Product Manager', 'Product Owner', 'Associate Product Manager',
    'Senior Product Manager', 'Director of Product', 'VP of Product',
    'Product Analyst', 'Product Marketing Manager', 'Chief Product Officer',
    'Technical Product Manager', 'Group Product Manager', 'Product Operations'
  ],
  data: [
    'Data Scientist', 'Data Analyst', 'Data Engineer', 'Business Intelligence Analyst',
    'Machine Learning Engineer', 'Business Analyst', 'Analytics Engineer',
    'Chief Data Officer', 'Data Science Manager', 'AI Researcher',
    'Quantitative Analyst', 'Decision Scientist', 'Research Scientist'
  ],
  sales: [
    'Sales Representative', 'Account Executive', 'Business Development Representative',
    'Sales Manager', 'Sales Director', 'VP of Sales', 'Chief Revenue Officer',
    'Account Manager', 'Enterprise Account Executive', 'Sales Operations',
    'Customer Success Manager', 'Solutions Consultant', 'Sales Engineer'
  ],
  executive: [
    'CEO', 'COO', 'CFO', 'CTO', 'CMO', 'CIO', 'CHRO',
    'VP of Engineering', 'VP of Marketing', 'VP of Sales',
    'VP of Product', 'VP of Finance', 'VP of Operations',
    'Director of Engineering', 'Director of Marketing', 'Director of Sales',
    'Director of HR', 'Director of Product'
  ]
};

// Get a random number of skills (between min and max) from a specific category
const getRandomSkills = (category, min = 3, max = 8) => {
  const skills = skillSets[category];
  const numSkills = faker.number.int({ min, max });
  return faker.helpers.arrayElements(skills, numSkills);
};

// Generate a match score with some variety
const generateMatchScore = () => {
  // Generate scores with a distribution that favors the 70-95 range
  const baseScore = faker.number.int({ min: 60, max: 99 });
  return baseScore;
};

// Generate a candidate with natural language descriptions
const generateCandidate = (id) => {
  // Randomly select a job category
  const categories = Object.keys(jobTitles);
  const category = faker.helpers.arrayElement(categories);
  
  // Generate years of experience with a reasonable distribution
  const experience = faker.number.int({ min: 1, max: 25 });
  
  // Get a job title from the selected category
  const title = faker.helpers.arrayElement(jobTitles[category]);
  
  // Get skills relevant to the job category
  const skills = getRandomSkills(category);
  
  // Generate a location with a bias toward major cities
  const cities = [
    "San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Boston, MA",
    "Chicago, IL", "Los Angeles, CA", "Denver, CO", "Atlanta, GA", "Portland, OR",
    "Miami, FL", "Washington, DC", "Philadelphia, PA", "San Diego, CA", "Dallas, TX",
    "Houston, TX", "Phoenix, AZ", "Nashville, TN", "Charlotte, NC", "Minneapolis, MN",
    "Remote"
  ];
  
  const location = faker.helpers.arrayElement(cities);
  
  // Create a natural language description of experience
  let experienceText;
  if (experience === 1) {
    experienceText = "1 year";
  } else {
    experienceText = `${experience} years`;
  }
  
  return {
    id,
    name: faker.person.fullName(),
    title,
    location,
    experience: experienceText,
    skills,
    image: `https://i.pravatar.cc/150?img=${faker.number.int({ min: 1, max: 70 })}`,
    matchScore: generateMatchScore(),
    category
  };
};

// Generate 500 candidates
export const generateMockCandidates = () => {
  const candidates = [];
  for (let i = 1; i <= 500; i++) {
    candidates.push(generateCandidate(i));
  }
  return candidates;
};

export const mockCandidates = generateMockCandidates();

// Function to filter candidates based on search query
export const filterCandidatesByQuery = (query) => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return mockCandidates.filter(candidate => {
    // Check if query matches job title
    const titleMatch = candidate.title.toLowerCase().includes(normalizedQuery);
    
    // Check if query matches skills
    const skillsMatch = candidate.skills.some(skill => 
      skill.toLowerCase().includes(normalizedQuery)
    );
    
    // Check if query matches category
    const categoryMatch = candidate.category.toLowerCase().includes(normalizedQuery);
    
    return titleMatch || skillsMatch || categoryMatch;
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 20); // Return top 20 matches
};
