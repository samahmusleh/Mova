// Demo data only. No real students. Names match the Figma prototype personas.

export const crew = [
  { id: 'KN', name: 'Kayla N.', grade: 9, status: 'needs', detail: 'Missed Tuesday' },
  { id: 'MT', name: 'Mia T.', grade: 9, status: 'ok', detail: '5 of 5 days this week' },
  { id: 'AJ', name: 'Andre J.', grade: 9, status: 'slip', detail: '3 of 5 days' },
  { id: 'DL', name: 'Dani L.', grade: 9, status: 'ok', detail: '5 of 5 days this week' },
  { id: 'SR', name: 'Sam R.', grade: 9, status: 'needs', detail: 'Out 2 days' }
];

export const checkinOptions = [
  { id: 'good', label: 'All good', emoji: '😊' },
  { id: 'bus', label: 'Bus is late', emoji: '🚌', challenge: 'Getting to school' },
  { id: 'family', label: 'Family stuff', emoji: '🏠', challenge: 'Family stuff' },
  { id: 'meh', label: 'Not feeling it', emoji: '😕', challenge: 'Tired or sick' }
];

export const supportTypes = ['Homework help', 'Bus / ride plan', 'Check-in talk', 'Walked to class', 'Study buddy', 'Just listened'];
export const challengeTypes = ['Getting to school', 'Homework', 'Family stuff', 'Tired or sick', 'Nothing today'];

export const rewards = [
  { id: 'pizza', title: 'Crew pizza party', sub: 'Your whole crew shows up 5 days straight', progress: '4 of 5 days', pct: 95, toGo: '1 more day!', icon: '🍕', bg: 'var(--fun-orange-subtle)', near: true },
  { id: 'lunch', title: 'Skip-the-line lunch pass', sub: 'Show up on time 10 days', progress: '9 of 10 days', pct: 90, toGo: '1 more day!', icon: '⏰', bg: 'var(--fun-pink-subtle)', near: true },
  { id: 'hoodie', title: 'MOVA hoodie drop', sub: 'Earn 5 badges', progress: '4 of 5 badges', pct: 80, toGo: '1 badge to go!', icon: '⭐', bg: 'var(--fun-purple-subtle)', near: true },
  { id: 'tickets', title: 'Game day tickets', sub: 'Reach 2,000 points', progress: '1,240 of 2,000 pts', pct: 62, toGo: '760 pts to go', icon: '🏆', bg: 'var(--bg-brand-subtle)' },
  { id: 'letter', title: "Principal's letter for your résumé", sub: 'Mentor for 8 weeks', progress: '5 of 8 weeks', pct: 62, toGo: '3 weeks to go', icon: '✉️', bg: 'var(--bg-success-subtle)' },
  { id: 'credit', title: 'Leadership credit', sub: '40 mentoring hours, approved by your advisor', progress: '18 of 40 hours', pct: 45, toGo: '22 hours to go', icon: '🎖️', bg: 'var(--bg-accent-subtle)' },
  { id: 'job', title: 'Summer job fast-track', sub: 'Finish the semester as a mentor', progress: 'Week 6 of 16', pct: 38, toGo: '10 weeks to go', icon: '💼', bg: 'var(--bg-brand-subtle)' }
];

export const crewCode = [
  ['⏰', 'Show up', "Be on time for your crew. If you can't make it, tell your mentees and Mr. Robinson."],
  ['💗', 'Be kind, always', 'No put-downs, teasing or yelling. Cheer every small win.'],
  ['🔒', 'Keep it private', 'What mentees share stays between you, them and your advisor. Never post, screenshot or gossip.'],
  ['🏫', 'Meet at school', 'Only in school spaces where adults are around. No 1-on-1 meetups off campus.'],
  ['💬', 'Talk in MOVA', 'Use MOVA chat, not personal DMs or social media. Your advisor can see chats.'],
  ['🚨', 'Tell an adult', "If someone might be hurt, unsafe or in trouble, tell Mr. Robinson right away. You don't have to fix it alone."],
  ['✅', 'Log honestly', 'Log real times and real help. Your hours become your credit.'],
  ['🌟', 'Be a role model', 'Help with schoolwork, never do it for them. Lead by showing up yourself.']
];

export const ferpaPoints = [
  ['👤', "You're a school official", "You can see records because you have a legitimate educational interest: supporting these students' attendance."],
  ['🔒', 'Use it only to help', 'Use student info only for attendance and mentoring support, never for discipline or anything else.'],
  ['👥', 'Share only with staff who need it', "Don't share records outside authorized school staff. Mentors see names and check-ins, never why a student is out."],
  ['📵', 'Keep it inside MOVA', 'No screenshots, exports or personal email of student info.'],
  ['🚨', 'Safety comes first', 'You are still a mandated reporter. Report any data breach to the district privacy officer within 24 hours.'],
  ['🏛️', 'Covered by the district agreement', "MOVA works under the district's Data Privacy Agreement. Data is never sold and is deleted when no longer needed."]
];

export const baseHelpRequests = [
  { id: 'marcus', initials: 'MT', name: 'Marcus T.', grade: 9, status: 'slip', message: "I don't get the fractions homework.", time: '7:50 AM', challenge: 'Homework',
    options: [['Ask Aaliyah to help', 'His mentor gets a nudge for a lunch session'], ['Share a practice set', '5 fraction story problems at his level'], ['Send Marcus a note', '"Good on you for asking. Help is coming."']] },
  { id: 'dee', initials: 'DR', name: 'Dee R.', grade: 9, status: 'needs', message: 'Can I talk to someone?', time: 'Yesterday', challenge: 'Talk to a grown-up', urgent: true,
    options: [['Meet Dee today', 'Pick a time: lunch or after 6th hour'], ['Loop in the counselor', 'Ms. Carter gets a private heads-up'], ['Send Dee a note', '"I\'m here. Let\'s talk today."']] }
];

export const baseLogs = [
  { id: 'l2', mentor: 'Aaliyah T.', mentorId: 'AT', mentee: 'Marcus T.', start: '12:05', end: '12:30', minutes: 25, support: ['Fractions practice'], challenge: 'Homework', details: 'We worked through 4 fraction problems at lunch. He got the last two on his own!', status: 'review' },
  { id: 'l3', mentor: 'Jaylen W.', mentorId: 'JW', mentee: 'Dee R.', start: '14:00', end: '14:10', minutes: 10, support: ['Check-in talk'], challenge: 'Nothing today', details: 'Quick check-in between classes. Dee said she is doing okay.', status: 'review' }
];

export const mentors = [
  { id: 'JW', name: 'Jaylen W.', mentees: 5, hours: 4.5, change: 'Attendance 62% → 91%', status: 'ok' },
  { id: 'AT', name: 'Aaliyah T.', mentees: 4, hours: 3, change: 'Attendance 70% → 84%', status: 'ok' },
  { id: 'CP', name: 'Chris P.', mentees: 5, hours: 1, change: 'Missed 2 logs', status: 'slip' }
];
