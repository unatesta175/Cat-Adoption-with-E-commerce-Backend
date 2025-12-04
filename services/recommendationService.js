/**
 * Rule-Based Recommendation Service
 * Calculates compatibility score between user preferences and cat traits
 */

export const calculateCompatibilityScore = (userPreferences, cat) => {
  let score = 0;
  const maxScore = 100;

  // +25 if activity level matches energy level
  if (userPreferences.activityLevel === cat.traits.energyLevel) {
    score += 25;
  }

  // +20 if user has kids and cat is good with kids
  if (userPreferences.hasKids && cat.traits.goodWithKids) {
    score += 20;
  }

  // +15 if apartment and low maintenance
  if (userPreferences.homeType === 'apartment' && cat.traits.maintenanceLevel === 'low') {
    score += 15;
  }

  // +25 if personality matches
  if (userPreferences.preferredPersonality === cat.traits.personality) {
    score += 25;
  }

  // +15 if experience level aligns with maintenance level
  if (alignsExperienceWithMaintenance(userPreferences.experienceLevel, cat.traits.maintenanceLevel)) {
    score += 15;
  }

  // Calculate percentage
  const percentage = Math.round((score / maxScore) * 100);

  return percentage;
};

const alignsExperienceWithMaintenance = (experienceLevel, maintenanceLevel) => {
  if (experienceLevel === 'beginner' && maintenanceLevel === 'low') return true;
  if (experienceLevel === 'intermediate' && (maintenanceLevel === 'low' || maintenanceLevel === 'moderate')) return true;
  if (experienceLevel === 'experienced') return true;
  return false;
};

export const getRecommendations = async (userPreferences, cats) => {
  if (!userPreferences || !userPreferences.homeType) {
    return [];
  }

  // Calculate compatibility for each cat
  const catsWithScores = cats.map(cat => ({
    cat: cat,
    compatibilityScore: calculateCompatibilityScore(userPreferences, cat)
  }));

  // Sort by score descending and return top 5
  const topCats = catsWithScores
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, 5);

  return topCats;
};




