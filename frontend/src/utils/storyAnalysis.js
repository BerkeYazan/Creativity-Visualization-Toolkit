export const calculateCoherence = (elements) => {
    if (!elements.length) return 0;
    
    const flowPatterns = {
      opening: { ideal: 0, weight: 1 },
      character: { ideal: 1, weight: 0.8 },
      action: { ideal: 2, weight: 0.9 },
      goal: { ideal: 3, weight: 1 }
    };
  
    let coherenceScore = 0;
    let maxPossibleScore = 0;
  
    elements.forEach((element, index) => {
      const pattern = flowPatterns[element.type];
      if (pattern) {
        const positionScore = 1 - Math.abs(pattern.ideal - index) / elements.length;
        coherenceScore += positionScore * pattern.weight;
        maxPossibleScore += pattern.weight;
      }
    });
  
    return (coherenceScore / maxPossibleScore) * 100;
  };
  
  export const calculateCreativity = (elements, allElements) => {
    if (!elements.length) return 0;
    
    const uniquenessScore = elements.reduce((score, element) => {
      const frequency = allElements.filter(e => e.type === element.type).length;
      return score + (1 / frequency);
    }, 0) / elements.length;
  
    const varietyScore = new Set(elements.map(e => e.type)).size / 
                        new Set(allElements.map(e => e.type)).size;
  
    return ((uniquenessScore * 0.6) + (varietyScore * 0.4)) * 100;
  };
  
  // In storyAnalysis.js

export const generateSmartSuggestions = (currentElements, allElements) => {
    const scoreSuggestion = (element, currentElements) => {
      // Make sure element has a type
      if (!element || !element.type) {
        return 0;
      }
  
      let score = 0;
      
      // Narrative coherence bonus
      const currentTypes = currentElements.map(e => e.type).filter(Boolean);
      const typeOrder = ['opening', 'character', 'action', 'goal'];
      const nextExpectedType = typeOrder.find(type => !currentTypes.includes(type));
      if (element.type === nextExpectedType) {
        score += 30;
      }
  
      // Context matching bonus
      if (currentElements.length > 0) {
        const lastElement = currentElements[currentElements.length - 1];
        const contextPairs = {
          character: ['action', 'goal'],
          location: ['character', 'action'],
          action: ['goal', 'character'],
          goal: ['character', 'action']
        };
        
        if (lastElement?.type && contextPairs[lastElement.type]?.includes(element.type)) {
          score += 20;
        }
      }
  
      // Variety bonus
      if (!currentElements.some(e => e.type === element.type)) {
        score += 15;
      }
  
      return score;
    };
  
    // Filter out invalid elements
    const potentialSuggestions = allElements.filter(element => 
      element && 
      element.type && 
      element.text && 
      !currentElements.some(current => current.text === element.text)
    );
  
    const scoredSuggestions = potentialSuggestions
      .map(element => ({
        ...element,
        score: scoreSuggestion(element, currentElements)
      }))
      .sort((a, b) => b.score - a.score);
  
    const maxSuggestions = 5;
    const typeCounts = new Map();
    
    return scoredSuggestions
      .filter(suggestion => {
        if (!suggestion.type) return false;
        const count = typeCounts.get(suggestion.type) || 0;
        if (count < 2) {
          typeCounts.set(suggestion.type, count + 1);
          return true;
        }
        return false;
      })
      .slice(0, maxSuggestions)
      .map(suggestion => ({
        ...suggestion,
        type: suggestion.type || 'unknown',
        text: suggestion.text || 'Suggestion'
      }));
  };