import { 
  User, 
  ScriptureProgress,
  BibleLesson, 
  UserLessonProgress, 
  GameMonitoring, 
  FriendRequest, 
  Alert, 
  PrayerJournal,
  Settings
} from "@shared/schema";
import { 
  DashboardSummary, 
  ChildDashboardData, 
  BibleVersion, 
  BibleBook, 
  BibleChapter,
  Devotional,
  ChatLog,
  ScreenTimeData
} from "./types";

// User data
export const mockUsers: User[] = [
  {
    id: 1,
    username: "parent1",
    password: "password123",
    email: "parent@example.com",
    isParent: true,
    displayName: "Parent User",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    username: "child1",
    password: "childpass",
    email: "child1@example.com",
    isParent: false,
    parentId: 1,
    displayName: "Johnny",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    username: "child2",
    password: "childpass",
    email: "child2@example.com",
    isParent: false,
    parentId: 1,
    displayName: "Sarah",
    createdAt: new Date().toISOString()
  }
];

// Scripture progress data
export const mockScriptureProgress: ScriptureProgress[] = [
  {
    id: 1,
    userId: 2,
    scriptureReference: "John 3:16",
    content: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    memorized: true,
    progress: 100,
    lastPracticed: new Date().toISOString()
  },
  {
    id: 2,
    userId: 2,
    scriptureReference: "Psalm 23:1",
    content: "The Lord is my shepherd, I lack nothing.",
    memorized: false,
    progress: 70,
    lastPracticed: new Date().toISOString()
  },
  {
    id: 3,
    userId: 2,
    scriptureReference: "Philippians 4:13",
    content: "I can do all this through him who gives me strength.",
    memorized: false,
    progress: 40,
    lastPracticed: new Date().toISOString()
  }
];

// Bible lessons data
export const mockBibleLessons: BibleLesson[] = [
  {
    id: 1,
    title: "God's Love",
    content: "In this lesson, we learn about God's amazing love for us. God loves us so much that He sent His Son Jesus to save us.\n\nGod's love is unconditional, which means He loves us no matter what. He doesn't love us because of what we do, but because of who He is. God is love!\n\nWhen we understand how much God loves us, it helps us to love others. We can share God's love with everyone we meet.",
    scriptureReferences: "John 3:16-17",
    ageRange: "Ages 5-8",
    completed: false
  },
  {
    id: 2,
    title: "Noah's Ark",
    content: "In this lesson, we learn about Noah and how he obeyed God by building the ark. Noah trusted God even when it seemed strange to build a big boat when there was no water around.\n\nGod promised to save Noah and his family from the flood, and God always keeps His promises. After the flood was over, God put a rainbow in the sky as a sign of His promise to never flood the whole earth again.\n\nThis story teaches us about obeying God and trusting His promises.",
    scriptureReferences: "Genesis 6-9",
    ageRange: "Ages 5-8",
    completed: false
  },
  {
    id: 3,
    title: "David and Goliath",
    content: "This lesson tells the amazing story of how young David defeated the giant Goliath with just a sling and a stone. David wasn't afraid because he knew God was with him.\n\nEven though David was small, he had big faith in God. He knew that with God's help, he could do things that seemed impossible.\n\nThis story teaches us that when we face big problems, we can trust God to help us. With God, we can be brave and strong.",
    scriptureReferences: "1 Samuel 17",
    ageRange: "Ages 7-10",
    completed: false
  },
  {
    id: 4,
    title: "Jesus Feeds 5000",
    content: "In this lesson, we learn about how Jesus performed an amazing miracle by feeding over 5000 people with just five loaves of bread and two fish.\n\nA boy offered his small lunch to Jesus, and Jesus used it to feed the huge crowd. This teaches us that when we give what we have to Jesus, even if it seems small, He can do incredible things with it.\n\nThis story also shows us that Jesus cares about our needs and can provide for us in amazing ways.",
    scriptureReferences: "Matthew 14:13-21",
    ageRange: "Ages 7-10",
    completed: false
  },
  {
    id: 5,
    title: "The Good Samaritan",
    content: "Jesus told this parable about a man who was robbed and hurt on the road. Two religious leaders walked by and didn't help, but a Samaritan man, who was from a group that the Jews didn't like, stopped to help the injured man.\n\nThe Samaritan bandaged the man's wounds, took him to an inn, and paid for his care. Jesus used this story to teach us that we should love and help everyone, even people who are different from us.\n\nThis parable teaches us to be kind and caring to all people, just like the Good Samaritan.",
    scriptureReferences: "Luke 10:25-37",
    ageRange: "Ages 8-12",
    completed: false
  }
];

// Lesson progress data
export const mockUserLessonProgress: UserLessonProgress[] = [
  {
    id: 1,
    userId: 2,
    lessonId: 1,
    completed: true,
    score: 90,
    completedAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 2,
    lessonId: 2,
    completed: true,
    score: 85,
    completedAt: new Date().toISOString()
  },
  {
    id: 3,
    userId: 2,
    lessonId: 3,
    completed: false,
    score: 0,
    completedAt: null
  }
];

// Game monitoring data
export const mockGameMonitoring: GameMonitoring[] = [
  {
    id: 1,
    childId: 2,
    gameName: "Minecraft",
    contentRating: "E (Everyone)",
    approved: true,
    screenTime: 120,
    redFlags: [],
    lastPlayed: new Date().toISOString()
  },
  {
    id: 2,
    childId: 2,
    gameName: "Roblox",
    contentRating: "E10+ (Everyone 10+)",
    approved: null,
    screenTime: 45,
    redFlags: [
      { type: "User-Generated Content", description: "Contains user-created worlds that may include inappropriate content" },
      { type: "In-Game Chat", description: "Features chat with other players that may need monitoring" }
    ],
    lastPlayed: new Date().toISOString()
  },
  {
    id: 3,
    childId: 2,
    gameName: "Fortnite",
    contentRating: "T (Teen)",
    approved: false,
    screenTime: 0,
    redFlags: [
      { type: "Violence", description: "Contains cartoon violence with weapons" },
      { type: "In-Game Purchases", description: "Offers in-game purchases that can add up quickly" }
    ],
    lastPlayed: null
  }
];

// Friend requests data
export const mockFriendRequests: FriendRequest[] = [
  {
    id: 1,
    childId: 2,
    friendName: "BibleBuddy42",
    status: "pending",
    requestDate: new Date().toISOString()
  },
  {
    id: 2,
    childId: 2,
    friendName: "GameMaster99",
    status: "pending",
    requestDate: new Date().toISOString()
  },
  {
    id: 3,
    childId: 2,
    friendName: "CraftyCreator",
    status: "approved",
    requestDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    childId: 2,
    friendName: "UnknownPlayer123",
    status: "denied",
    requestDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Alert data
export const mockAlerts: Alert[] = [
  {
    id: 1,
    userId: 1,
    childId: 2,
    type: "Game approval request",
    content: "Johnny would like permission to play Roblox (rated E10+)",
    read: false,
    handled: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 1,
    childId: 2,
    type: "Friend request",
    content: "Johnny received a friend request from BibleBuddy42",
    read: false,
    handled: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    userId: 1,
    childId: 2,
    type: "Scripture memorized",
    content: "Johnny has successfully memorized John 3:16",
    read: true,
    handled: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Prayer journals data
export const mockPrayerJournals: PrayerJournal[] = [
  {
    id: 1,
    userId: 2,
    title: "My Prayer for Family",
    content: "Dear God,\n\nThank you for my mom and dad and my sister. Please help us to be kind to each other and to love each other like you love us. Help us to forgive each other when we make mistakes.\n\nAmen",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 2,
    title: "Prayer for School",
    content: "Dear God,\n\nPlease help me at school tomorrow. I have a math test and I'm a little nervous. Help me to remember what I studied and to do my best.\n\nAlso, please help me to be a good friend to everyone in my class, especially the new student.\n\nThank you for loving me.\n\nAmen",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    userId: 2,
    title: "Thankful Prayer",
    content: "Dear God,\n\nToday I want to thank you for:\n- My family\n- My friends\n- My toys\n- Good food\n- My church\n\nThank you for all the blessings you give me every day.\n\nAmen",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// User settings
export const mockSettings: Settings = {
  id: 1,
  userId: 1,
  screenTimeLimit: 120,
  notifications: true,
  autoApproveGames: false,
  autoApproveFriends: false,
  contentFilters: {
    chatMonitoring: true,
    contentBlocking: true,
    youtubeRestrictions: true
  },
  darkMode: true
};

// Dashboard summary data
export const mockDashboardSummary: DashboardSummary = {
  pendingAlerts: 2,
  scriptureProgressPercent: 70,
  lessonsCompleted: 2,
  totalLessons: 5,
  prayerEntries: 3,
  childUsers: mockUsers.filter(user => !user.isParent)
};

// Child dashboard data
export const mockChildDashboardData: ChildDashboardData = {
  user: mockUsers.find(user => user.id === 2)!,
  scriptureProgress: mockScriptureProgress,
  recentLessons: mockBibleLessons.slice(0, 3),
  dailyDevotional: {
    title: "God's Promise to Abraham",
    verse: "I will make you into a great nation, and I will bless you; I will make your name great, and you will be a blessing.",
    content: "God promised Abraham that he would have many descendants, even though Abraham and his wife Sarah were very old and didn't have any children. This seemed impossible! But Abraham trusted God's promise, and God did exactly what He said He would do. Abraham and Sarah had a son named Isaac, just as God had promised. This teaches us that God always keeps His promises, even when they seem impossible to us."
  },
  gameTime: {
    earned: 15,
    available: 35,
    total: 120
  }
};

// Bible versions
export const mockBibleVersions: BibleVersion[] = [
  {
    id: "kjv",
    name: "King James Version",
    description: "Traditional, classic translation"
  },
  {
    id: "niv",
    name: "New International Version",
    description: "Modern, clear translation"
  },
  {
    id: "icb",
    name: "International Children's Bible",
    description: "Easy-to-understand for children"
  },
  {
    id: "esv",
    name: "English Standard Version",
    description: "Accurate, readable translation"
  }
];

// Bible books
export const mockBibleBooks: BibleBook[] = [
  {
    id: "genesis",
    name: "Genesis",
    chapters: 50
  },
  {
    id: "exodus",
    name: "Exodus",
    chapters: 40
  },
  {
    id: "psalms",
    name: "Psalms",
    chapters: 150
  },
  {
    id: "proverbs",
    name: "Proverbs",
    chapters: 31
  },
  {
    id: "matthew",
    name: "Matthew",
    chapters: 28
  },
  {
    id: "mark",
    name: "Mark",
    chapters: 16
  },
  {
    id: "john",
    name: "John",
    chapters: 21
  }
];

// Bible chapter content
export const mockBibleChapter: BibleChapter = {
  book: "John",
  chapter: 3,
  verses: [
    { verse: 1, text: "Now there was a Pharisee, a man named Nicodemus who was a member of the Jewish ruling council." },
    { verse: 2, text: "He came to Jesus at night and said, \"Rabbi, we know that you are a teacher who has come from God. For no one could perform the signs you are doing if God were not with him.\"" },
    { verse: 3, text: "Jesus replied, \"Very truly I tell you, no one can see the kingdom of God unless they are born again.\"" },
    { verse: 4, text: "\"How can someone be born when they are old?\" Nicodemus asked. \"Surely they cannot enter a second time into their mother's womb to be born!\"" },
    { verse: 5, text: "Jesus answered, \"Very truly I tell you, no one can enter the kingdom of God unless they are born of water and the Spirit.\"" },
    { verse: 6, text: "\"Flesh gives birth to flesh, but the Spirit gives birth to spirit.\"" },
    { verse: 7, text: "\"You should not be surprised at my saying, 'You must be born again.'\"" },
    { verse: 8, text: "\"The wind blows wherever it pleases. You hear its sound, but you cannot tell where it comes from or where it is going. So it is with everyone born of the Spirit.\"" },
    { verse: 9, text: "\"How can this be?\" Nicodemus asked." },
    { verse: 10, text: "\"You are Israel's teacher,\" said Jesus, \"and do you not understand these things?\"" },
    { verse: 11, text: "\"Very truly I tell you, we speak of what we know, and we testify to what we have seen, but still you people do not accept our testimony.\"" },
    { verse: 12, text: "\"I have spoken to you of earthly things and you do not believe; how then will you believe if I speak of heavenly things?\"" },
    { verse: 13, text: "\"No one has ever gone into heaven except the one who came from heaven—the Son of Man.\"" },
    { verse: 14, text: "\"Just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up,\"" },
    { verse: 15, text: "\"that everyone who believes may have eternal life in him.\"" },
    { verse: 16, text: "\"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.\"" },
    { verse: 17, text: "\"For God did not send his Son into the world to condemn the world, but to save the world through him.\"" }
  ]
};

// Devotionals
export const mockDevotionals: Devotional[] = [
  {
    id: 1,
    title: "God's Amazing Love",
    verse: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    reference: "John 3:16",
    content: "Did you know that God loves you more than anyone else ever could? His love is so big that He sent Jesus to earth just for you!\n\nThink about the biggest love you can imagine - maybe it's how much your mom or dad loves you. God's love is even bigger than that! He loves you so much that He wants you to be with Him forever.\n\nToday, remember that you are loved by the Creator of the universe. When you feel sad or alone, think about God's amazing love for you.",
    date: new Date().toISOString(),
    image: "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=800&h=400",
    tags: ["love", "John", "salvation"]
  },
  {
    id: 2,
    title: "Being Brave Like David",
    verse: "The Lord is my shepherd, I lack nothing.",
    reference: "Psalm 23:1",
    content: "David was a young boy who took care of sheep. He was brave because he knew God was with him. When a big giant named Goliath came to fight, everyone was scared - except David!\n\nDavid knew that God would help him be brave. With just a sling and a stone, David defeated the giant. How amazing!\n\nSometimes we face big problems that seem scary like giants. But remember, God is with you just like He was with David. You can be brave because God is on your side!",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1542652694-40abf526446e?auto=format&fit=crop&w=800&h=400",
    tags: ["courage", "David", "faith"]
  },
  {
    id: 3,
    title: "Sharing Like Jesus Did",
    verse: "And do not forget to do good and to share with others, for with such sacrifices God is pleased.",
    reference: "Hebrews 13:16",
    content: "Jesus taught us that sharing is very important. One day, thousands of people were listening to Jesus teach, and they got hungry. A boy shared his lunch - just five loaves of bread and two fish. It wasn't much, but Jesus did something amazing with it!\n\nJesus blessed the food and then gave it to everyone. The food multiplied, and all 5,000 people had enough to eat! There were even leftovers!\n\nWhen we share what we have, God can use it to do incredible things. Today, look for ways to share with others.",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1544939514-c0ba495b439f?auto=format&fit=crop&w=800&h=400",
    tags: ["sharing", "miracle", "generosity"]
  }
];

// Chat logs
export const mockChatLogs: ChatLog[] = [
  {
    id: 1,
    childId: 2,
    childName: "Johnny",
    platform: "Roblox",
    content: "Player1: Hey, what's your name?\nJohnny: I'm Johnny, I'm 8 years old\nPlayer1: Cool, I'm Mike. Do you want to play this game together?\nJohnny: Sure, that sounds fun!",
    flagged: true,
    flagReason: "Child shared personal information (age)",
    timestamp: new Date().toISOString(),
    participants: ["Johnny", "Player1"]
  },
  {
    id: 2,
    childId: 2,
    childName: "Johnny",
    platform: "Minecraft",
    content: "BibleBuddy42: Hey Johnny, did you finish that Bible lesson about Noah?\nJohnny: Yes! I learned that Noah trusted God even when it seemed weird to build a boat.\nBibleBuddy42: That's awesome! I loved that part too. Want to build an ark in Minecraft together?\nJohnny: Yes! Let's do it!",
    flagged: false,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    participants: ["Johnny", "BibleBuddy42"]
  },
  {
    id: 3,
    childId: 2,
    childName: "Johnny",
    platform: "Roblox",
    content: "CraftyCreator: Hey Johnny, do you want to play this new game?\nJohnny: Which one?\nCraftyCreator: It's called 'Adventure Quest'. It's really fun.\nJohnny: I need to ask my parents first if I can play a new game.\nCraftyCreator: That's a good idea. Let me know what they say!",
    flagged: false,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    participants: ["Johnny", "CraftyCreator"]
  }
];

// Screen time data
export const mockScreenTimeData: ScreenTimeData = {
  user: mockUsers.find(user => user.id === 2)!,
  dailyLimits: {
    total: 120,
    gaming: 60,
    social: 30,
    educational: 60
  },
  usageToday: {
    total: 75,
    gaming: 45,
    social: 10,
    educational: 20
  },
  timeRewards: {
    fromScripture: 15,
    fromLessons: 10,
    fromChores: 5
  },
  schedule: [
    {
      id: 1,
      dayOfWeek: "monday",
      startTime: "15:00",
      endTime: "17:00",
      enabled: true
    },
    {
      id: 2,
      dayOfWeek: "tuesday",
      startTime: "15:00",
      endTime: "17:00",
      enabled: true
    },
    {
      id: 3,
      dayOfWeek: "wednesday",
      startTime: "15:00",
      endTime: "17:00",
      enabled: true
    },
    {
      id: 4,
      dayOfWeek: "saturday",
      startTime: "10:00",
      endTime: "12:00",
      enabled: true
    },
    {
      id: 5,
      dayOfWeek: "saturday",
      startTime: "14:00",
      endTime: "16:00",
      enabled: true
    }
  ],
  blockedApps: [
    {
      id: 1,
      name: "Minecraft",
      category: "gaming",
      blocked: false
    },
    {
      id: 2,
      name: "Roblox",
      category: "gaming",
      blocked: false
    },
    {
      id: 3,
      name: "YouTube Kids",
      category: "entertainment",
      blocked: false
    },
    {
      id: 4,
      name: "Fortnite",
      category: "gaming",
      blocked: true
    },
    {
      id: 5,
      name: "TikTok",
      category: "social",
      blocked: true
    }
  ]
};
