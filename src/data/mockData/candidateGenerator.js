
import { faker } from '@faker-js/faker';
import { skillSets } from './skillSets';
import { jobTitles } from './jobTitles';

// Get a random number of skills (between min and max) from a specific category
export const getRandomSkills = (category, min = 3, max = 8) => {
  const skills = skillSets[category];
  const numSkills = faker.number.int({ min, max });
  return faker.helpers.arrayElements(skills, numSkills);
};

// Generate a match score with some variety
export const generateMatchScore = () => {
  // Generate scores with a distribution that favors the 70-95 range
  const baseScore = faker.number.int({ min: 60, max: 99 });
  return baseScore;
};

// Generate a candidate with natural language descriptions
export const generateCandidate = (id) => {
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
