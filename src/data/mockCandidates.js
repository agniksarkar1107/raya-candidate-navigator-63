
import { generateCandidate } from './mockData/candidateGenerator';
import { filterCandidatesByQuery as filterCandidates } from './mockData/candidateFilters';

// Generate 500 candidates
export const generateMockCandidates = () => {
  const candidates = [];
  for (let i = 1; i <= 500; i++) {
    candidates.push(generateCandidate(i));
  }
  return candidates;
};

// Create and export the mock candidates
export const mockCandidates = generateMockCandidates();

// Export the filtering function that uses our mock candidates
export const filterCandidatesByQuery = (query) => {
  return filterCandidates(query, mockCandidates);
};
