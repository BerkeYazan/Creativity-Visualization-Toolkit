// utils/storyAnalysis.js

export const calculateCoherence = (elements) => {
  if (!elements || elements.length === 0) return 0;

  // Simple coherence scoring based on element completeness
  const requiredTypes = ["location", "character", "action", "goal"];

  const hasTypes = requiredTypes.map((type) =>
    elements.some((element) => element.type === type)
  );

  return (hasTypes.filter(Boolean).length / requiredTypes.length) * 100;
};

export const calculateCreativity = (selectedElements, allElements) => {
  if (!selectedElements || selectedElements.length === 0) return 0;

  // Calculate uniqueness of combinations
  const uniqueCombinations = new Set(
    selectedElements.map((element) => element.text)
  ).size;

  // Calculate variety of element types
  const uniqueTypes = new Set(selectedElements.map((element) => element.type))
    .size;

  return (
    (uniqueCombinations / selectedElements.length) * 50 + (uniqueTypes / 8) * 50
  ); // 8 is total possible types
};

export const generateSmartSuggestions = (selectedElements, allElements) => {
  if (!selectedElements || selectedElements.length === 0) return [];

  const suggestions = [];
  const types = selectedElements.map((element) => element.type);

  // Check for missing essential elements
  if (!types.includes("character")) {
    suggestions.push("Consider adding a character to your story");
  }
  if (!types.includes("action")) {
    suggestions.push("Your story might benefit from an action");
  }
  if (!types.includes("goal")) {
    suggestions.push("Adding a goal could give your story more direction");
  }
  if (!types.includes("location")) {
    suggestions.push("Setting a location would help ground your story");
  }

  // Add creative suggestions
  if (selectedElements.length >= 4) {
    suggestions.push(
      "Your story is developing nicely! Try experimenting with different combinations"
    );
  }

  return suggestions;
};
