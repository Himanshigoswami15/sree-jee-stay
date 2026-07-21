/**
 * Smart Review Generator Engine
 * Auto-assembles natural human-sounding review sentences based on selected rating
 * and selected keyword tags.
 */

export const RATING_KEYWORDS = {
  // Positive tags for 4-5 stars
  positive: [
    { id: 'clean', label: '✨ Spotless Room', category: 'Cleanliness', snippet: 'The room was impeccably clean and spotless' },
    { id: 'wifi', label: '⚡ Fast Wi-Fi', category: 'Amenities', snippet: 'The Wi-Fi was fast and reliable for work and streaming' },
    { id: 'staff', label: '😊 Friendly Staff', category: 'Service', snippet: 'The staff were incredibly warm, welcoming, and helpful' },
    { id: 'breakfast', label: '🍳 Superb Breakfast', category: 'Dining', snippet: 'Breakfast was fresh, delicious, and offered great variety' },
    { id: 'bed', label: '🛏️ Comfy Bed', category: 'Comfort', snippet: 'The bed was super comfortable for a restful sleep' },
    { id: 'pool', label: '🏊 Pristine Pool', category: 'Amenities', snippet: 'The pool area was well-maintained and relaxing' },
    { id: 'ac', label: '❄️ Quiet AC', category: 'Comfort', snippet: 'The room AC worked perfectly and ran quietly' },
    { id: 'location', label: '📍 Great Location', category: 'General', snippet: 'Location was ideal and very convenient' },
    { id: 'quick_checkin', label: '⏱️ Smooth Check-in', category: 'Service', snippet: 'Check-in was quick and seamless' },
  ],

  // Issue tags for 1-3 stars
  negative: [
    { id: 'slow_wifi', label: '📶 Slow Wi-Fi', category: 'Amenities', snippet: 'The Wi-Fi connection was unstable and very slow' },
    { id: 'ac_issue', label: '🌡️ AC Not Cooling', category: 'Comfort', snippet: 'The air conditioning in the room was not cooling properly' },
    { id: 'noise', label: '🔊 Noisy Room', category: 'Comfort', snippet: 'There was considerable noise disrupting our rest' },
    { id: 'cold_food', label: '🥣 Cold Breakfast', category: 'Dining', snippet: 'The food served was cold and delayed' },
    { id: 'dirty_bathroom', label: '🛁 Bath Needs Cleaning', category: 'Cleanliness', snippet: 'The bathroom cleanliness fell below expected standards' },
    { id: 'keycard', label: '🔑 Keycard Issue', category: 'Service', snippet: 'Had trouble with the room keycard access multiple times' },
    { id: 'checkin_delay', label: '⏳ Check-in Delay', category: 'Service', snippet: 'We experienced a long wait time during check-in' },
    { id: 'missing_towels', label: '🧼 Missing Towels', category: 'Amenities', snippet: 'Towels and toiletries were missing upon arrival' },
  ]
};

export function generateReviewText({ rating, selectedTags = [], customNote = '', keywordsList = RATING_KEYWORDS }) {
  if (!rating) return '';

  const locationContext = 'during our stay';
  
  // Openings based on rating
  const openings = {
    5: [`Had a fantastic experience ${locationContext}!`, `Highly recommend Sree Jee Stay! Great experience ${locationContext}.`, `Wonderful stay ${locationContext}. Everything exceeded expectations.`],
    4: [`Really enjoyed our stay ${locationContext}.`, `Great experience overall ${locationContext}.`, `Good stay ${locationContext} with nice amenities.`],
    3: [`Mixed experience ${locationContext}. A few things could be improved.`, `Decent stay ${locationContext}, but had some minor hiccups.`],
    2: [`Disappointed with our stay ${locationContext}.`, `Had several issues ${locationContext} that impacted our experience.`],
    1: [`Very unsatisfactory experience ${locationContext}.`, `Extremely disappointed with our stay ${locationContext}.`]
  };

  const selectedList = rating >= 4 ? (keywordsList.positive || RATING_KEYWORDS.positive) : (keywordsList.negative || RATING_KEYWORDS.negative);
  
  const tagSnippets = selectedTags
    .map(tagId => selectedList.find(t => t.id === tagId))
    .filter(Boolean)
    .map(t => t.snippet || t.label);

  // Pick a deterministic opening based on tags length
  const openingList = openings[rating] || openings[5];
  const opening = openingList[selectedTags.length % openingList.length];

  let body = '';
  if (tagSnippets.length > 0) {
    if (rating >= 4) {
      body = ' ' + tagSnippets.join('. ') + '.';
    } else {
      body = ' Specifically, ' + tagSnippets.join(', and ') + '.';
    }
  }

  // Closing sentence
  let closing = '';
  if (rating >= 4) {
    closing = ' Will definitely come back again!';
  } else {
    closing = ' Hope management can look into these issues promptly.';
  }

  let fullText = `${opening}${body}${closing}`.trim();
  if (customNote.trim()) {
    fullText += ` Note: ${customNote.trim()}`;
  }

  return fullText;
}
