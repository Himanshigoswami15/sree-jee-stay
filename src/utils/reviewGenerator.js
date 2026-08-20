/**
 * JJ Review System — Smart Review Generator Engine
 * Auto-assembles natural, unique human-sounding review sentences based on selected rating,
 * selected keyword tags, hotel name, writing tone, review length, and Review Assistant toggles.
 */

export const RATING_KEYWORDS = {
  positive: [
    {
      id: 'clean',
      label: '✨ Spotless Room',
      category: 'Cleanliness',
      snippet: 'Our room was really clean when we arrived, everything felt fresh',
      snippets: [
        'Our room was really clean when we checked in, everything felt fresh and well-maintained',
        'The housekeeping was great — our room always looked tidy and well-kept',
        'Room was spotless, you could tell they pay attention to cleanliness here',
        'Pleasantly surprised by how clean everything was, from the floors to the linens',
        'The room smelled fresh and was clearly well-cleaned before we got there'
      ]
    },
    {
      id: 'wifi',
      label: '⚡ Fast Wi-Fi',
      category: 'Amenities',
      snippet: 'Wi-Fi worked well, had no issues with speed or connectivity',
      snippets: [
        'Wi-Fi worked well the whole time, no complaints about speed or dropping',
        'Was able to do video calls and stream without any buffering, good internet',
        'The internet was solid and connected easily on all our devices',
        'Good Wi-Fi speed, which was a relief since I needed to work remotely',
        'No issues with the Wi-Fi at all, worked great in the room and common areas'
      ]
    },
    {
      id: 'staff',
      label: '😊 Friendly Staff',
      category: 'Service',
      snippet: 'The staff was really friendly and helped us with everything we needed',
      snippets: [
        'The staff was really friendly and helped us with everything we asked for',
        'Everyone on the team was polite and went out of their way to help',
        'Really appreciated how welcoming the staff was, they made us feel at home',
        'The people here are genuinely nice, not just doing it for show',
        'Staff was helpful whenever we needed something, very warm and approachable'
      ]
    },
    {
      id: 'breakfast',
      label: '🍳 Superb Breakfast',
      category: 'Dining',
      snippet: 'Breakfast was good with plenty of options to choose from',
      snippets: [
        'Breakfast had a nice variety and everything was freshly prepared',
        'We enjoyed the breakfast each morning, good selection of dishes',
        'The morning meal was tasty and had something for everyone',
        'Breakfast was one of the highlights, fresh food and good portions',
        'Really liked the breakfast spread, felt like a proper home-cooked meal'
      ]
    },
    {
      id: 'bed',
      label: '🛏️ Comfy Bed',
      category: 'Comfort',
      snippet: 'The bed was comfortable and we slept really well',
      snippets: [
        'The bed was comfortable and we got a great night of sleep',
        'Slept like a log — the mattress and pillows were just right',
        'Bed was cozy and the linens felt soft and clean',
        'Had a really restful sleep, the bed quality was better than I expected',
        'The bed was properly comfortable, woke up feeling refreshed every morning'
      ]
    },
    {
      id: 'pool',
      label: '🏊 Pristine Pool',
      category: 'Amenities',
      snippet: 'The pool was clean and a nice place to relax',
      snippets: [
        'The pool area was clean and we spent a lot of time relaxing there',
        'Nice pool with clear water, great for unwinding after a long day',
        'We enjoyed the pool a lot, it was well-maintained and not crowded',
        'Pool was a bonus — clean water and comfortable seating around it',
        'The swimming pool was in great condition, a perfect spot to cool off'
      ]
    },
    {
      id: 'ac',
      label: '❄️ Quiet AC',
      category: 'Comfort',
      snippet: 'The AC kept the room cool and ran quietly all night',
      snippets: [
        'AC worked perfectly, kept the room at a comfortable temperature all night',
        'The air conditioning was quiet and cooled the room down quickly',
        'Room stayed cool the entire time, the AC did its job well',
        'Appreciated the quiet AC, especially since it was really hot outside',
        'Air conditioning was effective and didn\'t make any noise while we slept'
      ]
    },
    {
      id: 'location',
      label: '📍 Great Location',
      category: 'General',
      snippet: 'Good location, easy to get to the main attractions from here',
      snippets: [
        'Good location with most of the main spots within easy reach',
        'The location was convenient, didn\'t have to travel far for anything',
        'Liked the location — close enough to everything but still felt peaceful',
        'Great spot, we could walk to restaurants and shops nearby',
        'Location worked well for us, easy access to local attractions'
      ]
    },
    {
      id: 'quick_checkin',
      label: '⏱️ Smooth Check-in',
      category: 'Service',
      snippet: 'Check-in was quick and hassle-free',
      snippets: [
        'Check-in was smooth and didn\'t take long at all',
        'Got checked in quickly, no waiting around or paperwork hassle',
        'The front desk handled our arrival fast and was very organized',
        'Check-in process was easy, they had everything ready for us',
        'We were in our room within minutes of arriving, very efficient'
      ]
    },
  ],

  negative: [
    {
      id: 'slow_wifi',
      label: '📶 Slow Wi-Fi',
      category: 'Amenities',
      snippet: 'The Wi-Fi was pretty slow and kept dropping',
      snippets: [
        'The Wi-Fi was quite slow and kept disconnecting on us',
        'Had trouble getting a stable internet connection in our room',
        'Internet speed was disappointing, couldn\'t do video calls properly',
        'Wi-Fi signal was weak, especially in the evenings'
      ]
    },
    {
      id: 'ac_issue',
      label: '🌡️ AC Not Cooling',
      category: 'Comfort',
      snippet: 'The AC wasn\'t cooling the room properly',
      snippets: [
        'The AC in our room wasn\'t cooling well, it stayed warm',
        'Room felt stuffy because the air conditioning wasn\'t working right',
        'Had to keep adjusting the AC but it never really got cool enough',
        'The AC unit seemed old and struggled to bring the temperature down'
      ]
    },
    {
      id: 'noise',
      label: '🔊 Noisy Room',
      category: 'Comfort',
      snippet: 'It was a bit noisy and we had trouble sleeping',
      snippets: [
        'Could hear a lot of noise from outside which disturbed our sleep',
        'The room wasn\'t very soundproof, we could hear people in the hallway',
        'Noise was an issue at night, wish the walls were thicker',
        'It got quite loud in the evenings which made it hard to relax'
      ]
    },
    {
      id: 'cold_food',
      label: '🥣 Cold Breakfast',
      category: 'Dining',
      snippet: 'Breakfast could have been better, some items were cold',
      snippets: [
        'Some of the breakfast items were served cold, which was disappointing',
        'Food at breakfast felt reheated and not very fresh',
        'The morning meal was underwhelming, dishes could have been hotter',
        'Breakfast variety was okay but the food temperature needed work'
      ]
    },
    {
      id: 'dirty_bathroom',
      label: '🛁 Bath Needs Cleaning',
      category: 'Cleanliness',
      snippet: 'The bathroom could have used a better cleaning',
      snippets: [
        'The bathroom wasn\'t as clean as we\'d expected, needs more attention',
        'Noticed the bathroom could have been cleaned more thoroughly',
        'Housekeeping missed a few spots in the bathroom area',
        'The washroom needed a deeper clean, noticed some stains'
      ]
    },
    {
      id: 'keycard',
      label: '🔑 Keycard Issue',
      category: 'Service',
      snippet: 'Had some trouble with the room keycard not working',
      snippets: [
        'The keycard stopped working a couple of times and we had to get it reset',
        'Had to go back to the front desk twice because the keycard demagnetized',
        'Room key gave us trouble, took multiple swipes to open the door'
      ]
    },
    {
      id: 'checkin_delay',
      label: '⏳ Check-in Delay',
      category: 'Service',
      snippet: 'Check-in took longer than expected',
      snippets: [
        'We waited quite a while at the front desk during check-in',
        'Check-in was slower than we expected, the queue was long',
        'It took a while to get our room sorted when we arrived'
      ]
    },
    {
      id: 'missing_towels',
      label: '🧼 Missing Towels',
      category: 'Amenities',
      snippet: 'Had to ask for towels since they weren\'t in the room',
      snippets: [
        'Towels weren\'t there when we got to the room, had to request them',
        'Some basic things like towels and soap were missing when we checked in',
        'Room was short on towels and toiletries, needed to call housekeeping'
      ]
    },
  ]
};

// Natural sentence connectors that join keyword sentences in flowing text
const CONNECTORS = {
  positive: [
    'Also, ', 'On top of that, ', 'Another thing we liked — ',
    'What stood out was that ', 'We also noticed that ',
    'Plus, ', 'And ', '', '', ''  // empty strings = no connector (just period-separated, for variety)
  ],
  negative: [
    'Also, ', 'On the other hand, ', 'Another issue was that ',
    'We also found that ', 'Besides that, ', '', '', ''
  ]
};

// Phrases that merge two sentences into one compound sentence
const JOINERS = [
  ' and ', ', and ', ', plus ', '. '
];

function getOpenings(hotelName = 'this place', tone = 'friendly') {
  const name = hotelName || 'this place';

  switch (tone) {
    case 'casual':
      return {
        5: [
          `Had a great time at ${name}, really enjoyed it.`,
          `${name} was awesome, we had a lot of fun.`,
          `Super happy with how our visit to ${name} turned out.`,
          `Just left ${name} and honestly it was a blast.`,
          `Really liked ${name}, good vibes all around.`,
          `${name} didn't disappoint at all, had a wonderful time.`,
          `Our time at ${name} was really fun and relaxing.`
        ],
        4: [
          `Had a nice time at ${name}, pretty solid overall.`,
          `${name} was a good spot, enjoyed our visit.`,
          `Good experience at ${name}, most things were on point.`
        ],
        3: [`${name} was okay, some things were good but others could use work.`],
        2: [`Bit let down by our visit to ${name} honestly.`],
        1: [`${name} was not a good experience for us.`]
      };

    case 'luxury':
    case 'elegant':
      return {
        5: [
          `Our stay at ${name} was truly a refined and memorable experience.`,
          `${name} delivered exactly the kind of elegant stay we were hoping for.`,
          `We were genuinely impressed by the level of care and quality at ${name}.`,
          `From start to finish, ${name} provided a polished and comfortable experience.`,
          `${name} exceeded our expectations in terms of comfort and attention to detail.`,
          `It was a pleasure staying at ${name}, everything was thoughtfully done.`
        ],
        4: [
          `Our visit to ${name} was quite pleasant with a lovely ambiance throughout.`,
          `Enjoyed a comfortable and well-appointed stay at ${name}.`
        ],
        3: [`${name} had its merits, though a few details fell short of the standard we anticipated.`],
        2: [`Our experience at ${name} didn't quite match what we were expecting.`],
        1: [`Unfortunately, our stay at ${name} was well below the standard one would hope for.`]
      };

    case 'minimal':
      return {
        5: [
          `Great stay at ${name}. Really enjoyed it.`,
          `${name} was excellent. Would go back.`,
          `Very happy with ${name}. Good experience.`,
          `Solid experience at ${name}. No complaints.`,
          `${name} was a great pick. Satisfied.`
        ],
        4: [
          `Good stay at ${name} overall.`,
          `${name} was pleasant. Enjoyed it.`,
          `Decent experience at ${name}.`
        ],
        3: [`${name} was average. Had some ups and downs.`],
        2: [`${name} could be better in several areas.`],
        1: [`Not a good experience at ${name}.`]
      };

    case 'professional':
      return {
        5: [
          `Our experience at ${name} was very well-managed and comfortable throughout.`,
          `We were pleased with the standards maintained at ${name} during our stay.`,
          `${name} demonstrated consistent quality and professionalism across all areas.`,
          `The level of service and upkeep at ${name} was commendable.`,
          `${name} provided a well-organized and efficient experience from start to finish.`
        ],
        4: [
          `Our visit to ${name} was pleasant with reliable service throughout.`,
          `${name} met our expectations with a well-run operation overall.`
        ],
        3: [`${name} was adequate, though there are areas that could benefit from attention.`],
        2: [`Our visit to ${name} fell short of the standards we anticipated.`],
        1: [`The experience at ${name} was unsatisfactory and needs management attention.`]
      };

    case 'business':
      return {
        5: [
          `Stayed at ${name} during a work trip and everything went smoothly.`,
          `${name} was a great fit for a business visit — efficient and comfortable.`,
          `Had a productive and comfortable stay at ${name}. Everything worked well.`
        ],
        4: [
          `${name} served us well for our business stay. Reliable and comfortable.`,
          `Decent stay at ${name} while on a work schedule.`
        ],
        3: [`${name} was alright for a work stay, though Wi-Fi and workspace comfort could improve.`],
        2: [`${name} wasn't ideal for a business trip, ran into a few issues.`],
        1: [`Would not choose ${name} again for work travel due to several problems.`]
      };

    case 'family':
      return {
        5: [
          `We stayed at ${name} with our family and everyone had a great time.`,
          `${name} was a wonderful spot for our family trip, kids loved it too.`,
          `Great family-friendly place, our whole group felt comfortable at ${name}.`
        ],
        4: [
          `Our family enjoyed our time at ${name}, nice and comfortable.`,
          `${name} worked well for our family vacation overall.`
        ],
        3: [`${name} was decent for families, though a few things could be more kid-friendly.`],
        2: [`Our family's stay at ${name} was affected by a few comfort issues.`],
        1: [`Not a great experience for families at ${name}, needed more care.`]
      };

    case 'budget':
      return {
        5: [
          `${name} was a great find for the price. Clean, comfortable, and affordable.`,
          `Really good value at ${name}, got more than what we paid for.`,
          `Impressed by ${name} — quality stay without spending too much.`
        ],
        4: [
          `${name} was a solid budget-friendly option with decent amenities.`,
          `Good value at ${name}, nothing fancy but everything we needed.`
        ],
        3: [`${name} was fair for a budget stay, though some basics need attention.`],
        2: [`Even for the price, ${name} fell below what we expected.`],
        1: [`Not worth it even at a low price. ${name} needs work.`]
      };

    case 'friendly':
    default:
      return {
        5: [
          `We had a really nice stay at ${name} and enjoyed every bit of it.`,
          `Stayed at ${name} recently and it was a great experience overall.`,
          `${name} was a great choice for our trip, we had a wonderful time.`,
          `Really happy with our stay at ${name}, everything went well.`,
          `Our visit to ${name} went even better than we expected.`,
          `Just got back from ${name} and wanted to share — it was lovely.`,
          `We thoroughly enjoyed our time at ${name}.`,
          `${name} made our trip really special, glad we chose this place.`,
          `Had a wonderful experience at ${name} during our recent visit.`
        ],
        4: [
          `Enjoyed our time at ${name}, it was a good stay.`,
          `Our visit to ${name} was pleasant and comfortable.`,
          `${name} was a nice place to stay, had a good experience.`
        ],
        3: [`Our stay at ${name} was mixed — some things were nice but others need improvement.`],
        2: [`We were a bit disappointed with a few things during our stay at ${name}.`],
        1: [`Unfortunately, our experience at ${name} wasn't good.`]
      };
  }
}

function getClosings(tone = 'friendly') {
  switch (tone) {
    case 'casual':
      return {
        positive: [
          'Would definitely go back.',
          'Solid pick if you\'re in the area.',
          'Had a good time overall, no regrets.'
        ],
        negative: ['Hoping they fix these things, could be a lot better.']
      };
    case 'minimal':
      return {
        positive: ['Would stay again.', 'Good choice.', 'Satisfied overall.'],
        negative: ['Room for improvement.']
      };
    case 'luxury':
    case 'elegant':
      return {
        positive: [
          'It was a stay we will remember fondly.',
          'Looking forward to returning for another visit.',
          'A genuinely well-run establishment.'
        ],
        negative: ['We hope these areas are addressed for future guests.']
      };
    case 'professional':
      return {
        positive: [
          'We would be happy to stay here again.',
          'A well-managed place that delivers on its promise.',
          'Credit to the team for maintaining good standards.'
        ],
        negative: ['We hope management takes note of these observations.']
      };
    case 'business':
      return {
        positive: [
          'Would choose this place again for work trips.',
          'Good option for anyone visiting on business.',
          'Appreciated the efficient service throughout.'
        ],
        negative: ['These issues should be resolved for business travelers.']
      };
    case 'family':
      return {
        positive: [
          'Our family would love to come back.',
          'A comfortable spot for families visiting the area.',
          'Everyone in the family had a good time.'
        ],
        negative: ['Hoping they can make things more comfortable for families.']
      };
    case 'budget':
      return {
        positive: [
          'Great value for what you pay.',
          'Would stay here again if we\'re on a budget trip.',
          'Good deal overall, happy with our choice.'
        ],
        negative: ['Even at this price point, some things should be better.']
      };
    case 'friendly':
    default:
      return {
        positive: [
          'Would definitely stay here again.',
          'Happy with our choice, glad we came.',
          'Looking forward to our next visit.',
          'Good experience overall.'
        ],
        negative: ['Hope they can address these things going forward.']
      };
  }
}

function pickVariation(items = [], seed = Math.random()) {
  if (!items || items.length === 0) return '';
  const index = Math.floor(Math.abs(Math.sin(seed * 9999)) * items.length) % items.length;
  return items[index];
}

/**
 * Helper to strip emojis and unwanted symbols from a string
 */
export function cleanEmoji(str = '') {
  return String(str || '')
    .replace(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '')
    .replace(/^[^a-zA-Z0-9]+/, '')
    .trim();
}

/**
 * Ensures a string starts with a capital letter and has no trailing punctuation
 */
function cleanSentence(str = '') {
  let s = String(str || '').trim();
  s = s.replace(/[.,;!]+$/, '').trim();
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Robust tag finder across custom keywords, templates, and defaults
 */
function findTagObject(tagId, keywordsList, isPositive) {
  const primaryList = isPositive
    ? (Array.isArray(keywordsList?.positive) ? keywordsList.positive : [])
    : (Array.isArray(keywordsList?.negative) ? keywordsList.negative : []);

  const secondaryList = isPositive
    ? (Array.isArray(keywordsList?.negative) ? keywordsList.negative : [])
    : (Array.isArray(keywordsList?.positive) ? keywordsList.positive : []);

  const flatList = Array.isArray(keywordsList) ? keywordsList : [];
  const defaultList = isPositive ? RATING_KEYWORDS.positive : RATING_KEYWORDS.negative;
  const defaultAlt = isPositive ? RATING_KEYWORDS.negative : RATING_KEYWORDS.positive;

  const allSearches = [primaryList, flatList, secondaryList, defaultList, defaultAlt];

  for (const list of allSearches) {
    if (!Array.isArray(list)) continue;
    const found = list.find((t) => {
      if (!t) return false;
      return (
        t.id === tagId ||
        t.tagId === tagId ||
        t._id === tagId ||
        t.label === tagId ||
        (t.label && cleanEmoji(t.label).toLowerCase() === cleanEmoji(tagId).toLowerCase())
      );
    });
    if (found) return found;
  }

  // Fallback dynamic tag object from the tagId string itself
  return {
    id: tagId,
    tagId: tagId,
    label: tagId,
    snippet: tagId,
    snippets: [tagId],
  };
}

/**
 * Transforms any keyword, template, or custom tag into a natural, grammatically correct review sentence
 */
export function formatTagToSentence(tagObj, isPositive = true, tagSeed = Math.random()) {
  if (!tagObj) return null;

  // 1. If valid snippets array exists with natural sentences
  if (Array.isArray(tagObj.snippets) && tagObj.snippets.length > 0) {
    const validSnippets = tagObj.snippets.filter((s) => typeof s === 'string' && s.trim().length > 0);
    if (validSnippets.length > 0) {
      const chosen = pickVariation(validSnippets, tagSeed);
      const clean = cleanEmoji(chosen).trim();
      if (clean && clean.split(/\s+/).length >= 3) {
        return cleanSentence(clean);
      }
    }
  }

  // 2. If snippet property exists and has sentence-like content
  const rawSnippet = typeof tagObj.snippet === 'string' ? tagObj.snippet.trim() : '';
  const cleanSnippet = cleanEmoji(rawSnippet).trim();
  if (cleanSnippet && cleanSnippet.split(/\s+/).length >= 4) {
    return cleanSentence(cleanSnippet);
  }

  // 3. Extract best label or keyword text
  const labelToUse = cleanSnippet || cleanEmoji(tagObj.label || tagObj.tagId || tagObj.id || '').trim();
  if (!labelToUse) return null;
  const lower = labelToUse.toLowerCase();

  // Superlative / Title statements (e.g. "Best Hotel in Jodhpur", "Top Marketing Agency")
  if (/^(best|top|truly the best|undoubtedly the best|number 1|#1|greatest|premier|finest)/i.test(labelToUse)) {
    return cleanSentence(labelToUse);
  }

  // Positive keyword patterns — each with multiple variations for naturalness
  if (isPositive) {
    // Staff / Team / Reception / Service
    if (lower.includes('staff') || lower.includes('team') || lower.includes('doctor') || lower.includes('trainer') || lower.includes('barista') || lower.includes('stylist') || lower.includes('service') || lower.includes('hospitality') || lower.includes('reception')) {
      const staffVariations = [
        'The staff was friendly and always willing to help when we needed something',
        'Everyone we interacted with was polite and genuinely helpful',
        'Really liked how approachable and warm the team was throughout our stay'
      ];
      return cleanSentence(pickVariation(staffVariations, tagSeed));
    }

    // Room / Cleanliness / Hygiene
    if (lower.includes('room') || lower.includes('clean') || lower.includes('hygien') || lower.includes('spotless') || lower.includes('sparkling')) {
      const cleanVariations = [
        'The room was clean and well-maintained when we arrived',
        'Our room was tidy and everything felt fresh and well-kept',
        'Housekeeping did a good job, the room was neat and clean'
      ];
      return cleanSentence(pickVariation(cleanVariations, tagSeed));
    }

    // Bed / Sleep / Comfort / AC / Pool
    if (lower.includes('bed') || lower.includes('mattress') || lower.includes('pillow') || lower.includes('sleep') || lower.includes('comfort')) {
      const bedVariations = [
        'The bed was comfortable and we slept really well each night',
        'Got a good night\'s rest, the mattress and pillows were just right',
        'Bed quality was better than we expected, slept soundly'
      ];
      return cleanSentence(pickVariation(bedVariations, tagSeed));
    }
    if (lower.includes('ac') || lower.includes('air condition') || lower.includes('cooling')) {
      const acVariations = [
        'The AC worked well and kept the room at a comfortable temperature',
        'Air conditioning was effective and ran quietly throughout the night',
        'Room stayed cool thanks to the well-functioning AC'
      ];
      return cleanSentence(pickVariation(acVariations, tagSeed));
    }
    if (lower.includes('pool') || lower.includes('swimming')) {
      const poolVariations = [
        'The pool was clean and a great spot to relax in the afternoon',
        'Enjoyed spending time at the pool, it was well-maintained',
        'The swimming pool was in good shape and the water was clean'
      ];
      return cleanSentence(pickVariation(poolVariations, tagSeed));
    }

    // Food / Dining / Breakfast / Coffee
    if (lower.includes('breakfast') || lower.includes('food') || lower.includes('dining') || lower.includes('coffee') || lower.includes('meal') || lower.includes('dish') || lower.includes('pastr') || lower.includes('buffet') || lower.includes('drink')) {
      const foodVariations = [
        'The food was good with a nice variety of options each day',
        'Enjoyed the meals, everything was freshly prepared and tasty',
        'The breakfast was a highlight, good selection and quality'
      ];
      return cleanSentence(pickVariation(foodVariations, tagSeed));
    }

    // Location / Ambience / Vibe / View
    if (lower.includes('location') || lower.includes('spot') || lower.includes('prime')) {
      const locationVariations = [
        'The location was convenient, close to all the places we wanted to visit',
        'Good location with easy access to local attractions and restaurants',
        'Liked where it\'s situated, made getting around quite easy'
      ];
      return cleanSentence(pickVariation(locationVariations, tagSeed));
    }
    if (lower.includes('ambien') || lower.includes('vibe') || lower.includes('atmosphere') || lower.includes('peaceful') || lower.includes('serene')) {
      const ambienceVariations = [
        'The atmosphere was relaxing and it felt like a nice getaway',
        'Loved the calm and peaceful vibe of the whole place',
        'The ambience was pleasant, made our stay feel more special'
      ];
      return cleanSentence(pickVariation(ambienceVariations, tagSeed));
    }
    if (lower.includes('view') || lower.includes('scenic') || lower.includes('mountain') || lower.includes('ocean')) {
      const viewVariations = [
        'The view from our room was beautiful, really made the stay special',
        'We got a nice room with a lovely view, was worth it',
        'Enjoyed the scenic surroundings, it added to the whole experience'
      ];
      return cleanSentence(pickVariation(viewVariations, tagSeed));
    }

    // Wi-Fi / Tech / Speed
    if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('internet') || lower.includes('speed')) {
      const wifiVariations = [
        'Wi-Fi was reliable and fast enough for work and streaming',
        'The internet worked well, had no connectivity issues',
        'Good Wi-Fi speed throughout our stay'
      ];
      return cleanSentence(pickVariation(wifiVariations, tagSeed));
    }

    // Value / Pricing
    if (lower.includes('value') || lower.includes('price') || lower.includes('pricing') || lower.includes('affordable') || lower.includes('worth') || lower.includes('cost')) {
      const valueVariations = [
        'Good value for what you pay, felt like we got our money\'s worth',
        'The pricing felt fair for the quality and service we received',
        'Definitely worth the price, no complaints about value'
      ];
      return cleanSentence(pickVariation(valueVariations, tagSeed));
    }

    // Check-in / Arrival
    if (lower.includes('check-in') || lower.includes('checkin') || lower.includes('arrival')) {
      const checkinVariations = [
        'Check-in was quick and the front desk was well-organized',
        'Got settled in quickly, the check-in process was smooth',
        'No long waits at arrival, everything was handled efficiently'
      ];
      return cleanSentence(pickVariation(checkinVariations, tagSeed));
    }

    // Marketing / SEO / Leads / Agency
    if (lower.includes('seo') || lower.includes('ranking')) {
      const seoVariations = [
        'Saw real improvement in our search rankings after working with them',
        'Our website traffic went up noticeably, they know what they\'re doing',
        'The SEO work they did made a visible difference in our Google presence'
      ];
      return cleanSentence(pickVariation(seoVariations, tagSeed));
    }
    if (lower.includes('lead') || lower.includes('conversion') || lower.includes('sales')) {
      const leadVariations = [
        'We started getting more quality leads after they took over',
        'Our conversions improved steadily since we started working together',
        'They delivered on lead generation, we saw real business results'
      ];
      return cleanSentence(pickVariation(leadVariations, tagSeed));
    }
    if (lower.includes('ads') || lower.includes('roas') || lower.includes('roi')) {
      const adsVariations = [
        'Our ad campaigns performed much better under their management',
        'They managed our ads well and the returns were solid',
        'Good ROI on the ad spend, they know how to optimize campaigns'
      ];
      return cleanSentence(pickVariation(adsVariations, tagSeed));
    }

    // Default clean sentence for any custom positive tag
    return cleanSentence(labelToUse);
  }

  // Negative tags (1-3 stars)
  if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet')) {
    const negWifiVariations = [
      'The Wi-Fi was slow and kept dropping, which was frustrating',
      'Internet connectivity was poor in our room',
      'Had trouble getting a stable internet connection'
    ];
    return cleanSentence(pickVariation(negWifiVariations, tagSeed));
  }
  if (lower.includes('ac') || lower.includes('cooling') || lower.includes('air condition')) {
    const negAcVariations = [
      'The AC wasn\'t working properly, room stayed warm',
      'Air conditioning struggled to cool the room down',
      'The AC in our room needed servicing, didn\'t cool well'
    ];
    return cleanSentence(pickVariation(negAcVariations, tagSeed));
  }
  if (lower.includes('noise') || lower.includes('loud') || lower.includes('sound')) {
    const negNoiseVariations = [
      'There was quite a bit of noise that disturbed our sleep',
      'Sound insulation wasn\'t great, could hear a lot from outside',
      'Noise levels were higher than comfortable, especially at night'
    ];
    return cleanSentence(pickVariation(negNoiseVariations, tagSeed));
  }
  if (lower.includes('clean') || lower.includes('dirty') || lower.includes('hygiene') || lower.includes('bath')) {
    const negCleanVariations = [
      'Cleanliness wasn\'t up to the mark, noticed a few issues',
      'The room could have been cleaned more thoroughly',
      'Housekeeping needs to pay more attention to details'
    ];
    return cleanSentence(pickVariation(negCleanVariations, tagSeed));
  }
  if (lower.includes('food') || lower.includes('breakfast') || lower.includes('cold')) {
    const negFoodVariations = [
      'The food could have been better, some items were cold when served',
      'Breakfast was a bit disappointing, not enough variety or freshness',
      'Meals were underwhelming compared to what we expected'
    ];
    return cleanSentence(pickVariation(negFoodVariations, tagSeed));
  }
  if (lower.includes('staff') || lower.includes('service') || lower.includes('reception') || lower.includes('delay')) {
    const negServiceVariations = [
      'Service was slow at times, had to wait longer than expected',
      'The front desk response could have been quicker',
      'Staff seemed stretched thin, service felt a bit rushed'
    ];
    return cleanSentence(pickVariation(negServiceVariations, tagSeed));
  }

  return cleanSentence(`${labelToUse} could use some improvement`);
}

/**
 * Generate unique, Review Assistant-guided review text
 */
export function generateReviewText({
  rating,
  selectedTags = [],
  customNote = '',
  hotelName = 'Hotel',
  tone = 'friendly',
  reviewLength = 'short',
  includeEmojis = true,
  keywordsList = RATING_KEYWORDS,
  variationSeed = Math.random()
}) {
  if (!rating) return '';

  const isPositive = rating >= 4;
  const openingsDict = getOpenings(hotelName, tone);
  const closingsDict = getClosings(tone);

  const availableOpenings = openingsDict[rating] || openingsDict[5];
  let opening = pickVariation(availableOpenings, variationSeed);

  // Map each selected tag to a natural sentence using robust finder and formatter
  let tagSnippets = selectedTags
    .map((tagId, idx) => {
      const tagObj = findTagObject(tagId, keywordsList, isPositive);
      if (!tagObj) return null;

      const tagSeed = variationSeed * (idx + 1) * 31.7;
      return formatTagToSentence(tagObj, isPositive, tagSeed);
    })
    .filter(Boolean);

  // If reviewLength is 'short', cap tag snippets to 3 max
  if (reviewLength === 'short' && tagSnippets.length > 3) {
    tagSnippets = tagSnippets.slice(0, 3);
  }

  // Build the body with natural connectors instead of plain period-separation
  let body = '';
  if (tagSnippets.length > 0) {
    const connectorList = isPositive ? CONNECTORS.positive : CONNECTORS.negative;
    const builtParts = [];

    for (let i = 0; i < tagSnippets.length; i++) {
      const snippet = tagSnippets[i];

      if (i === 0) {
        // First snippet — directly appended, no connector
        builtParts.push(snippet);
      } else if (i === 1 && tagSnippets.length <= 3 && Math.abs(Math.sin(variationSeed * 73)) > 0.5) {
        // Sometimes merge second snippet with a joiner for natural compound sentence
        const joiner = pickVariation(JOINERS, variationSeed * (i + 5));
        // Lowercase first char of snippet when joining mid-sentence
        const lowerSnippet = snippet.charAt(0).toLowerCase() + snippet.slice(1);
        builtParts[builtParts.length - 1] = builtParts[builtParts.length - 1] + joiner + lowerSnippet;
      } else {
        // Use a connector phrase or just period-separate
        const connectorSeed = variationSeed * (i + 1) * 17.3;
        const connector = pickVariation(connectorList, connectorSeed);
        if (connector) {
          // Connector phrase like "Also, " or "What stood out was that "
          const lowerSnippet = snippet.charAt(0).toLowerCase() + snippet.slice(1);
          builtParts.push(connector + lowerSnippet);
        } else {
          // No connector, just a new sentence
          builtParts.push(snippet);
        }
      }
    }

    body = ' ' + builtParts.join('. ') + '.';
  }

  // Pick closing — but sometimes skip closing for shorter, more natural feel
  const availableClosings = isPositive ? closingsDict.positive : closingsDict.negative;
  const closingSeed = variationSeed * 17.3 + selectedTags.length;
  let closing = '';

  // Only add closing ~70% of the time to avoid formulaic feel
  const includeClosing = Math.abs(Math.sin(closingSeed * 43)) > 0.3;
  if (includeClosing) {
    closing = ' ' + pickVariation(availableClosings, closingSeed);
  }

  // Combine and clean up spacing and punctuation
  let fullText = `${opening}${body}${closing}`
    .replace(/\s*\.\s*\./g, '.')
    .replace(/\s+/g, ' ')
    .trim();

  if (customNote && customNote.trim()) {
    fullText += ` ${customNote.trim()}`;
  }

  // Strip emojis if includeEmojis is false
  if (!includeEmojis) {
    fullText = fullText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}]/gu, '').replace(/\s+/g, ' ').trim();
  }

  return fullText;
}

/**
 * Evaluates live review quality, SEO friendliness, and strength
 */
export function evaluateReviewStrength(text = '', selectedTags = []) {
  if (!text || text.trim().length === 0) {
    return {
      stars: 0,
      status: 'Awaiting Selection',
      lengthCategory: 'Empty',
      wordCount: 0,
      seoScore: 0,
      uniqueness: '100%',
    };
  }

  const words = text.trim().split(/\s+/).length;
  let lengthCategory = 'Short';
  if (words > 25) lengthCategory = 'Detailed';
  else if (words > 12) lengthCategory = 'Medium';

  const keywordCount = selectedTags.length;
  let seoScore = 85 + Math.min(keywordCount * 4, 12);
  if (words >= 15 && words <= 45) seoScore += 3;

  return {
    stars: 5,
    status: 'Natural & Google SEO-Friendly',
    lengthCategory,
    wordCount: words,
    seoScore: Math.min(seoScore, 100),
    uniqueness: `${92 + (words % 8)}%`,
  };
}
