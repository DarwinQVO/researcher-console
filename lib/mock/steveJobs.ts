export const subjectMeta = {
  id: "steve-jobs",
  name: "Steve Jobs",
  avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/800px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg",
  bio: "Co-founder of Apple Inc., visionary entrepreneur who revolutionized personal computing, music distribution, mobile phones, and tablet computing.",
  stamped_niches: ["Tech", "Creator", "Public Company"],
  stats: {
    quotes: 142,
    timeline_events: 87,
    qa_pairs: 34,
    representations: 12
  },
  status: "in_progress",
  last_updated: "2024-01-20T10:30:00Z"
}

export const timelineEvents = [
  {
    id: "1",
    date: "1955-02-24",
    title: "Born in San Francisco",
    description: "Steven Paul Jobs was born to Joanne Carole Schieble and Abdulfattah 'John' Jandali, later adopted by Paul and Clara Jobs.",
    type: "personal"
  },
  {
    id: "2",
    date: "1976-04-01",
    title: "Founded Apple Computer",
    description: "Co-founded Apple Computer Company with Steve Wozniak and Ronald Wayne in the Jobs family garage.",
    type: "career"
  },
  {
    id: "3",
    date: "1984-01-24",
    title: "Launched Macintosh",
    description: "Introduced the first Macintosh computer with the famous '1984' Super Bowl commercial.",
    type: "product"
  },
  {
    id: "4",
    date: "1985-09-17",
    title: "Left Apple",
    description: "Resigned from Apple after losing a boardroom battle with CEO John Sculley.",
    type: "career"
  },
  {
    id: "5",
    date: "1986-02-03",
    title: "Founded NeXT",
    description: "Founded NeXT Computer, focusing on high-end workstations for the education market.",
    type: "career"
  },
  {
    id: "6",
    date: "1997-09-16",
    title: "Returned to Apple",
    description: "Returned as interim CEO after Apple acquired NeXT.",
    type: "career"
  },
  {
    id: "7",
    date: "2007-01-09",
    title: "Unveiled iPhone",
    description: "Introduced the revolutionary iPhone at MacWorld, changing the smartphone industry forever.",
    type: "product"
  },
  {
    id: "8",
    date: "2011-10-05",
    title: "Passed Away",
    description: "Died at age 56 after a long battle with pancreatic cancer.",
    type: "personal"
  }
]

export const quotes = [
  {
    id: "q1",
    text: "Innovation distinguishes between a leader and a follower.",
    source: "The Innovation Secrets of Steve Jobs",
    date: "2001",
    tags: ["innovation", "leadership"],
    verified: true
  },
  {
    id: "q2",
    text: "Stay hungry, stay foolish.",
    source: "Stanford Commencement Address",
    date: "2005-06-12",
    tags: ["motivation", "philosophy"],
    verified: true
  },
  {
    id: "q3",
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    source: "New York Times Interview",
    date: "2003-11-30",
    tags: ["design", "philosophy"],
    verified: true
  },
  {
    id: "q4",
    text: "Sometimes when you innovate, you make mistakes. It is best to admit them quickly, and get on with improving your other innovations.",
    source: "Business Week",
    date: "1998",
    tags: ["innovation", "failure"],
    verified: true
  },
  {
    id: "q5",
    text: "Being the richest man in the cemetery doesn't matter to me. Going to bed at night saying we've done something wonderful, that's what matters to me.",
    source: "The Wall Street Journal",
    date: "1993-05-25",
    tags: ["philosophy", "purpose"],
    verified: true
  }
]

export const qaData = [
  {
    id: "qa1",
    question: "What was Steve Jobs' management philosophy?",
    answer: "Jobs believed in hiring the best people and giving them freedom to excel. He was known for his attention to detail and perfectionism, often pushing teams to achieve what they thought was impossible. His philosophy centered on the intersection of technology and liberal arts.",
    tags: ["management", "philosophy"]
  },
  {
    id: "qa2",
    question: "How did Steve Jobs approach product design?",
    answer: "Jobs approached design with a focus on simplicity and user experience. He believed that great design was not just about appearance but about how something works. He often said 'simplicity is the ultimate sophistication' and would remove features to achieve elegant solutions.",
    tags: ["design", "product"]
  },
  {
    id: "qa3",
    question: "What was Jobs' relationship with Bill Gates?",
    answer: "Jobs and Gates had a complex relationship that evolved from early collaboration to fierce rivalry and eventually to mutual respect. While they competed intensely in the personal computer market, they also recognized each other's contributions to the industry.",
    tags: ["relationships", "competition"]
  }
]

export const representations = [
  {
    id: "r1",
    title: "Think Different",
    description: "Jobs' philosophy that innovation comes from thinking differently than the competition and challenging the status quo.",
    category: "philosophy",
    key_points: [
      "Challenge conventional thinking",
      "Focus on user experience over specs",
      "Integrate technology with humanities"
    ]
  },
  {
    id: "r2",
    title: "The Reality Distortion Field",
    description: "Jobs' legendary ability to convince anyone of practically anything, pushing people to achieve the impossible.",
    category: "leadership",
    key_points: [
      "Unwavering belief in vision",
      "Ability to inspire teams",
      "Refusing to accept limitations"
    ]
  },
  {
    id: "r3",
    title: "Intersection of Technology and Liberal Arts",
    description: "Jobs believed that truly great products come from combining technology with humanities and arts.",
    category: "product_philosophy",
    key_points: [
      "Technology alone is not enough",
      "Products should be intuitive and beautiful",
      "User experience trumps technical specifications"
    ]
  }
]

export const sources = [
  {
    id: "s1",
    title: "Walter Isaacson - Steve Jobs Biography",
    type: "book",
    url: "https://www.simonandschuster.com/books/Steve-Jobs/Walter-Isaacson/9781451648539",
    author: "Walter Isaacson",
    publication_date: "2011-10-24",
    credibility: "high",
    notes: "Official biography with exclusive interviews. Primary source for personal life and business decisions.",
    tags: ["biography", "primary", "comprehensive"],
    subject_ids: ["steve-jobs"],
    added_date: "2024-01-10",
    last_accessed: "2024-01-20",
    quotes_extracted: 47,
    status: "processed"
  },
  {
    id: "s2",
    title: "Stanford Commencement Speech 2005",
    type: "video",
    url: "https://www.youtube.com/watch?v=UF8uR6Z6KLc",
    author: "Steve Jobs",
    publication_date: "2005-06-12",
    credibility: "primary",
    notes: "Famous 'Stay Hungry, Stay Foolish' speech. Essential for understanding his philosophy.",
    tags: ["speech", "primary", "philosophy"],
    subject_ids: ["steve-jobs"],
    added_date: "2024-01-11",
    last_accessed: "2024-01-19",
    quotes_extracted: 12,
    status: "processed"
  },
  {
    id: "s3",
    title: "The Innovation Secrets of Steve Jobs",
    type: "book",
    url: "https://www.amazon.com/Innovation-Secrets-Steve-Jobs-Principles/dp/1259835898",
    author: "Carmine Gallo",
    publication_date: "2010-10-07",
    credibility: "high",
    notes: "Analysis of Jobs' innovation methodology and business principles.",
    tags: ["innovation", "business", "analysis"],
    subject_ids: ["steve-jobs"],
    added_date: "2024-01-12",
    last_accessed: "2024-01-18",
    quotes_extracted: 23,
    status: "processed"
  },
  {
    id: "s4",
    title: "All Things Digital Interview 2010",
    type: "video",
    url: "https://www.wsj.com/video/steve-jobs-at-d8-the-full-uncut-interview/",
    author: "Walt Mossberg & Kara Swisher",
    publication_date: "2010-06-07",
    credibility: "primary",
    notes: "Candid interview covering Apple's strategy, Flash controversy, and mobile future.",
    tags: ["interview", "primary", "strategy"],
    subject_ids: ["steve-jobs"],
    added_date: "2024-01-13",
    last_accessed: "2024-01-21",
    quotes_extracted: 18,
    status: "processed"
  },
  {
    id: "s5",
    title: "Inside Apple: The Secrets Behind the Past and Future Success",
    type: "book",
    url: "https://www.amazon.com/Inside-Apple-Americas-Admired---Secretive---Company/dp/1455512168",
    author: "Adam Lashinsky",
    publication_date: "2012-01-25",
    credibility: "medium",
    notes: "Deep dive into Apple's culture and operations. Some insider perspectives.",
    tags: ["culture", "business", "operations"],
    subject_ids: ["steve-jobs"],
    added_date: "2024-01-14",
    last_accessed: "2024-01-17",
    quotes_extracted: 15,
    status: "in_review"
  },
  {
    id: "s6",
    title: "Steve Jobs Archive - Official Website",
    type: "website",
    url: "https://stevejobsarchive.com",
    author: "Laurene Powell Jobs",
    publication_date: "2022-09-01",
    credibility: "primary",
    notes: "Official archive with emails, speeches, and personal documents.",
    tags: ["archive", "primary", "official"],
    subject_ids: ["steve-jobs"],
    added_date: "2024-01-15",
    last_accessed: "2024-01-22",
    quotes_extracted: 0,
    status: "pending"
  },
  {
    id: "s7",
    title: "The Pixar Story Documentary",
    type: "documentary",
    url: "https://www.imdb.com/title/tt1059955/",
    author: "Leslie Iwerks",
    publication_date: "2007-08-28",
    credibility: "high",
    notes: "Documentary about Pixar's journey with Jobs' role prominently featured.",
    tags: ["documentary", "pixar", "leadership"],
    subject_ids: ["steve-jobs"],
    added_date: "2024-01-16",
    last_accessed: "2024-01-16",
    quotes_extracted: 8,
    status: "processed"
  },
  {
    id: "s8",
    title: "Becoming Steve Jobs: The Evolution of a Reckless Upstart",
    type: "book",
    url: "https://www.penguinrandomhouse.com/books/223269/becoming-steve-jobs-by-brent-schlender-and-rick-tetzeli/",
    author: "Brent Schlender & Rick Tetzeli",
    publication_date: "2015-03-24",
    credibility: "high",
    notes: "Alternative biography showing Jobs' evolution as a leader. Tim Cook endorsed.",
    tags: ["biography", "leadership", "evolution"],
    subject_ids: ["steve-jobs"],
    added_date: "2024-01-17",
    last_accessed: "2024-01-20",
    quotes_extracted: 31,
    status: "processed"
  }
]

export const requestsData = [
  {
    id: "steve-jobs",
    name: "Steve Jobs",
    avatar: subjectMeta.avatar,
    stamped_niches: ["Tech", "Creator", "Public Company"],
    status: "in_progress",
    last_updated: "2024-01-20T10:30:00Z"
  },
  {
    id: "elon-musk",
    name: "Elon Musk",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/800px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
    stamped_niches: ["Tech", "Public Company"],
    status: "backlog",
    last_updated: "2024-01-19T14:20:00Z"
  },
  {
    id: "oprah-winfrey",
    name: "Oprah Winfrey",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Oprah_Winfrey_%282004%29.jpg/800px-Oprah_Winfrey_%282004%29.jpg",
    stamped_niches: ["Creator", "Media"],
    status: "review",
    last_updated: "2024-01-18T09:15:00Z"
  },
  {
    id: "warren-buffett",
    name: "Warren Buffett",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Warren_Buffett_KU_Visit.jpg/800px-Warren_Buffett_KU_Visit.jpg",
    stamped_niches: ["Public Company", "Finance"],
    status: "done",
    last_updated: "2024-01-17T16:45:00Z"
  }
]