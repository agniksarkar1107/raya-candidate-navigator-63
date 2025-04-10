
// Function to filter candidates based on search query
export const filterCandidatesByQuery = (query, candidates) => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return candidates.filter(candidate => {
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
