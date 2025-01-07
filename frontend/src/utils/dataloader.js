// utils/dataloader.js
import Papa from 'papaparse';

export const loadStoryElements = async () => {
  try {
    const response = await fetch('/data/story_elements.csv');
    const csv = await response.text();
    
    const { data } = Papa.parse(csv, { 
      header: true,
      skipEmptyLines: true
    });
    
    // Transform the flat CSV structure into the grouped format
    return data.map(row => ({
      id: row.sentence_id,
      color: row.color,
      elements: [
        {
          type: 'location_descriptor',
          text: row.location_descriptor,
        },
        {
          type: 'location',
          text: row.location,
        },
        {
          type: 'character_descriptor',
          text: row.character_descriptor,
        },
        {
          type: 'character',
          text: row.character,
        },
        {
          type: 'action_descriptor',
          text: row.action_descriptor,
        },
        {
          type: 'action',
          text: row.action,
        },
        {
          type: 'goal_descriptor',
          text: row.goal_descriptor,
        },
        {
          type: 'goal',
          text: row.goal,
        }
      ]
    }));
  } catch (error) {
    console.error('Error loading story elements:', error);
    return [];
  }
};