/* =====================================================================
   CONTENT FILE — 웹사이트에 보이는 모든 글은 여기에서 수정하세요.
   - 따옴표 "..." 안의 글만 바꾸면 됩니다. 따옴표와 쉼표는 지우지 마세요.
   - 비어 있는 값 ""은 아직 쓰지 않은 항목입니다. 내용을 쓰면 사이트에 나타납니다.
   - showTodo: true  → 비어 있는 칸을 "To add" 상자로 보여줍니다 (작업용).
     showTodo: false → 비어 있는 칸을 숨깁니다. 링크를 공유하기 전에 false로 바꾸세요.
   ===================================================================== */

window.SITE = {
  showTodo: false,

  hero: {
    name: "Chloe Jeong",
    tagline: "Sport · People · New Perspectives",
    // 첫 화면의 짧은 배경 소개 (한 줄)
    intro: "Former figure skater · Sport management master’s student · International event experience",
    // (첫 화면에는 더 이상 표시되지 않음 — 보관용)
    keywords: ["Sports Event Operations", "Partnerships", "Marketing Operations", "Community", "Project Coordination"],
    status: "Open to internships & junior roles in international sport",
    button: "Explore my work",
    hint: "Drag to look around · Scroll or pinch to zoom · Click the ice to skate"
  },

  // ---- Profile right below the rink (résumé style). Facts match Chloe's CV. ----
  profile: {
    // About Me (below the rink). Copy approved by Chloe - use regular hyphens (-) in this section.
    photo: "assets/chloe-about.jpg",
    photoAlt: "Chloe Jeong in front of snowy mountains",
    greeting: "Hello!",
    keywords: "Sport · People · New Perspectives",
    location: "Paris, France",
    statement: "A life shaped by sport, curiosity, and new places.",
    intro: [
      "I’m Chloe, a former figure skater now studying sport management through the Erasmus Mundus GOALS programme.",
      "From performing on ice to working behind the scenes at international competitions, I’ve found new ways to experience sport while studying and living across Europe."
    ],
    // current: true = the yellow dot on the timeline (most recent)
    education: [
      { years: "2025-2027", logo: "assets/logos/mono-goals.png", title: "Erasmus Mundus GOALS Master’s", sub: "Governance and Administration of Leisure and Sports",
        detail: "Université de Lille · Mykolas Romeris University · LUNEX University", current: true },
      { years: "2021-2025", logo: "assets/logos/mono-coventry.png", title: "Coventry University", sub: "BSc Sport and Exercise Science", detail: "" },
      { years: "2023-2024", logo: "assets/logos/mono-cologne.png", title: "German Sport University Cologne", sub: "Erasmus Exchange Programme",
        detail: "Sport Management, Business & Communication" }
    ],
    languages: "Korean (Native) · English (C1) · French (A2)",
    experience: [
      { role: "Mixed Zone Supervisor", org: "ISU World Figure Skating Championships", location: "Prague, Czech Republic", date: "March 2026",
        points: ["Coordinated athlete movements, media access and interview logistics as part of a seven-person operations team.",
                 "Supported mixed-zone operations at a championship with 487 accredited media and broadcast personnel."] },
      { role: "Press Team", org: "ISU Grand Prix de France", location: "Angers, France", date: "October 2025 & 2026",
        points: ["Supported interviews, press conferences and mixed-zone operations.",
                 "Assisted 80+ accredited media representatives with on-site requests and Korean-English interpretation."] },
      { role: "President", org: "Coventry University Ice Skating Society", location: "Coventry, United Kingdom", date: "2022-2025",
        points: ["Helped grow the society from 2 to 50+ members.",
                 "Organised weekly skating sessions and community events for 25-40 participants."] },
      { role: "Freelance Korean Language Tutor", org: "Self-employed", location: "Remote / International", date: "2024-Present",
        points: ["Delivered 500+ personalised lessons to 15 international learners.",
                 "Independently managed client communication, lesson planning and scheduling."] }
    ],
    international: [
      { role: "Selected Global Talent", org: "Impulse Summit 2024", location: "St. Gallen, Switzerland", date: "November 2024",
        points: ["Selected as one of 60 Global Talents from six continents for an international summit focused on sport, business and sustainability.",
                 "Participated in IOC- and FIS-organised workshops exploring sustainable events and sport integrity."] },
      { role: "International Youth Event Volunteer", org: "Kid’s AU", location: "Ulaanbaatar, Mongolia", date: "August 2019",
        points: ["Supported an international youth event involving 129 participants from five Northeast Asian countries.",
                 "Assisted with programme coordination and cross-cultural activities."] }
    ],
    certifications: [
      { name: "CMI Level 5 Certificate in Management and Leadership", org: "Chartered Management Institute (CMI)", code: "Qualification code: 5AW30" }
    ]
  },

  // "At a glance" 요약 칸 (첫 화면 바로 아래)
  glance: {
    title: "At a glance",
    lookingFor: "Internships and junior roles in international sport.",
    availability: "Available from February 2027 · open to relocating across Europe."
  },

  about: {
    title: "About Me",
    // ---- 자기소개 영상 ----
    // 영상 파일을 받으면 src에 경로를 넣으세요 (예: "assets/meet-chloe.mp4").
    // 비어 있으면 Play 버튼을 보여주지 않습니다.
    video: {
      src: "assets/meet-chloe.mp4",
      poster: "assets/meet-chloe-poster.jpg",   // 영상 첫 장면 (손 흔드는 모습)
      captions: "",     // 영어 자막 파일 (.vtt) 예: "assets/meet-chloe-en.vtt" — 아직 없음
      label: "Meet Chloe"
    },
    // ---- 사진 ----
    photo: {
      src: "assets/chloe-skates.jpg",
      small: "assets/chloe-skates-720.jpg",
      alt: "Chloe smiling in a mirror selfie, holding her white figure skates with green blade guards",
      caption: "Off the ice, skates in hand."
    },
    storyTitle: "Beyond the Ice",
    storySubtitle: "From figure skating to finding my place in international sport.",
    storyQuote: { scene: 3, paragraph: 3 },   // pull quote shown before chapter 4: Chloe's own sentence
    // ---- My Story page (3 chapters, Nov 2026). The older 5-chapter "scenes" below are kept as source text but no longer shown. ----
    story: {
      title: "Beyond the Ice",
      subtitle: "From life on the ice to finding my place behind the scenes.",
      chapters: [
        {
          title: "Life on Ice", layout: "text-left",
          image: "assets/story/ms-skating.jpg", alt: "Chloe performing in a light blue competition dress, one arm raised, during her competitive figure skating years",
          text: [
            "For ten years, figure skating was my world. I grew up training, competing and spending most of my days at the rink. Sport wasn't just something I did. It shaped my routine, my friendships and the way I approached challenges.",
            "When injuries brought my competitive skating career to an end, I suddenly had to imagine a life beyond the ice. I didn't have a clear plan, but I knew I wanted sport to remain part of it.",
            "That uncertainty eventually took me to the UK, where I began studying Sport and Exercise Science at Coventry University."
          ]
        },
        {
          title: "The Turning Point", layout: "featured",
          image: "assets/story/ms-euro.jpg", alt: "Chloe sitting on the stadium wall at a EURO 2024 match, wearing a blue cap and EURO 2024 scarves, looking out over the pitch and the crowd",
          text: [
            "At Coventry, I became president of the university's Ice Skating Society. For the first time, I was organising skating sessions for others rather than training for my own competitions. I loved seeing people discover the sport I'd grown up with.",
            "But the real turning point came during my exchange year at the German Sport University Cologne.",
            "In summer 2024, I lived just minutes from a stadium hosting EURO 2024. The atmosphere was unforgettable. Seeing people from different places come together, sharing the excitement of the tournament, made me curious about everything that goes into creating an experience like that.",
            "I started thinking less about being the athlete and more about the people who make these experiences possible.",
            "That was when sport management became more than an interesting subject. It became something I wanted to pursue."
          ]
        },
        {
          title: "Still Figuring It Out", layout: "photo-left",
          image: "assets/story/ms-goals.jpg", alt: "Erasmus Mundus GOALS classmates posing together near the Eiffel Tower",
          text: [
            "That curiosity led me to the Erasmus Mundus GOALS master's programme, where I've been studying sport governance and management across Europe.",
            "I've also found myself back in the world of figure skating, this time working behind the scenes at international competitions. Being on the other side of the rink has given me a completely different perspective on a sport I thought I knew so well.",
            "Living and studying alongside people from different countries continues to challenge the way I think and what I want to do next.",
            "I don't have every step figured out yet. But after spending so many years focused on my own performance, I'm excited to be part of creating sporting experiences for others."
          ]
        }
      ],
      closing: "That's my story so far.",
      cta: "Explore my experience"
    },
    // ---- My Story pages (About pop-up, after the video page) ----
    // Add a photo later: image: "assets/xxx.jpg" + alt. Add a video later: video: "assets/xxx.mp4".
    // With no photo or video the page shows the text on its own.
    scenes: [
      {
        title: "Life on Ice",
        place: "South Korea · Figure skating",
        text: [
          "For ten years, figure skating was at the centre of my life in Korea. I spent countless hours on the ice, refining my technique, preparing for competitions and pushing myself to improve. Skating shaped much of who I am today, from the way I approach challenges to the determination I bring to everything I do.",
          "In 2019, back and ankle injuries brought my skating career to an end. I took some time to reflect on what I wanted to do next and eventually decided to pursue a new direction by studying abroad. It marked the beginning of a new chapter in my life."
        ],
        image: "assets/story-began.jpg", video: "", alt: "Chloe taking a mirror selfie, holding her white figure skates with green blade guards"
      },
      {
        title: "Beyond the Rink",
        place: "🇬🇧 United Kingdom · Coventry University",
        text: [
          "I moved to the UK to study Sport & Exercise Science at Coventry University. After years on the ice, I wanted to better understand how the body and mind influence performance and how I could use that knowledge to support other athletes.",
          "Leading the university’s Ice Skating Society introduced me to a different side of sport. Instead of focusing on my own performance, I found myself helping others feel welcome, build confidence and enjoy being on the ice together. It was my first experience of contributing to sport beyond my own training and competitions."
        ],
        images: [                                            // photos change every 2 s
          { src: "assets/uk-2.jpg", alt: "Four skaters in team jackets standing on the ice in an arena" },
          { src: "assets/uk-3.jpg", alt: "Selfie with friends at university" },
          { src: "assets/uk-5.jpg", alt: "Society social night with a big group of friends" },
          { src: "assets/uk-6.jpg", alt: "Coventry University graduation day with classmates in gowns" },
          { src: "assets/de-1.jpg", alt: "Chloe horse riding on a black and white horse" }
        ],
        extras: { label: "Other societies", items: ["Language Exchange", "Horse Riding", "Tennis"] },
        image: "", video: "", alt: ""
      },
      {
        title: "Behind the Scenes",
        place: "🇩🇪 Germany · German Sport University Cologne",
        text: [
          "During my exchange in Cologne, I studied Sport Management & Communication and began to see sport from a broader perspective.",
          "Living close to a stadium hosting EURO 2024 brought that learning to life. The atmosphere surrounding the tournament sparked my curiosity about what happens behind the scenes: the planning, partnerships and people that make major sporting events possible. I began to see a future for myself not just participating in sport, but helping create the experiences that bring people together.",
          "Since then, I’ve seen that side of sport up close: in the mixed zone at the ISU World Figure Skating Championships in Prague, and with the press team at the ISU Grand Prix de France in Angers."
        ],
        images: [                                            // first photo leads the chapter
          { src: "assets/prague-team.jpg", alt: "Mixed zone team at the ISU World Figure Skating Championships in Prague" },
          { video: "assets/de-v1.mp4", poster: "assets/de-v1-poster.jpg", alt: "Short video: Chloe at a EURO 2024 match in the stadium, England scarf on" },
          { src: "assets/uk-7.jpg", alt: "Chloe driving past a field, a cow looking in through the window" },
          { video: "assets/de-v2.mp4", poster: "assets/de-v2-poster.jpg", alt: "Short video: trampoline jump in a sports hall" },
          { src: "assets/de-3.jpg", alt: "Chloe walking on a mountain path with snowy peaks behind" },
          { src: "assets/uk-8.jpg", alt: "Chloe skiing, standing on a snowy slope in front of mountains" }
        ],
        image: "", video: "", alt: ""
      },
      {
        title: "Learning Across Borders",
        place: "Europe · Erasmus Mundus GOALS",
        text: [
          "That curiosity led me to GOALS, the Erasmus Mundus Master’s programme in Governance and Administration of Leisure and Sports.",
          "In a programme that spans five countries, alongside classmates from 28 countries, I’ve been introduced to different perspectives on how sport is organised and managed. I bring my experience as a skater to our discussions, while learning from people with different cultural, academic and professional backgrounds.",
          "Having spent years focused on training and competition, I’m now exploring the decisions and organisations behind those experiences: how events are delivered, how partnerships are developed and how athletes and communities are supported.",
          "For me, GOALS is an opportunity to connect the sport I’ve lived with the industry I’m learning to navigate."
        ],
        images: [                                            // photos 2 s each
          { src: "assets/goals-1.jpg", alt: "GOALS classmates holding up their passports from many countries in a circle" },
          { src: "assets/goals-2.jpg", alt: "Selfie with GOALS classmates in front of the Eiffel Tower" },
          { src: "assets/goals-3.jpg", alt: "Chloe in a lift with her suitcases, moving to the next study country" },
          { src: "assets/goals-4.jpg", alt: "GOALS cohort group photo near the Eiffel Tower" }
        ],
        image: "", video: "", alt: ""
      },
      {
        title: "Still Figuring It Out",
        place: "",
        text: [
          "I’m currently seeking an internship or entry-level opportunity in the international sports industry, where I can combine my background as an athlete with my experience in community leadership and international sporting events.",
          "I’m particularly interested in sports operations, business development, governance and content creation. Through these areas, I hope to contribute to projects that connect organisations, athletes and audiences while continuing to develop my understanding of the industry.",
          "From competing on the ice to exploring the world behind sport, my perspective has continued to evolve. I’m excited to bring that experience, curiosity and willingness to take on new challenges to a team working to make sport happen."
        ],
        // Proposed rewrite, waiting for Chloe's approval (not shown on the site):
        proposedText: [
          "I don’t have it all mapped out, and I’m comfortable with that. What I do know is where I’d like to start: an internship or junior role in international sport, from February 2027, where my background as an athlete, my community work and my time at international events can be useful.",
          "I’m especially drawn to sports operations, business development, governance and content creation: the work that connects organisations, athletes and audiences.",
          "I started on the ice. I’m still learning what happens around it, and I’d like to keep learning inside a team that makes sport happen."
        ],
        images: [                                            // photos 2 s each, the short video plays to the end (muted)
          { src: "assets/next-1.jpg", alt: "Chloe at the ISU Figure Skating Awards 2026" },
          { src: "assets/next-2.jpg", alt: "Chloe as event staff at Mykolas Romeris University" },
          { src: "assets/next-3.jpg", alt: "Selfie with a sports team mascot" },
          { src: "assets/next-4.jpg", alt: "Chloe sitting on the lawn in front of the Eiffel Tower" },
          { video: "assets/next-v1.mp4", poster: "assets/next-v1-poster.jpg", alt: "Short video: group selfie with friends on a sunny day trip" }
        ],
        image: "", video: "", alt: ""
      }
    ],
    paragraphs: [
      "I’m a former figure skater and Erasmus Mundus GOALS master’s student, exploring opportunities in international sports events, operations and communications.",
      "I competed as a figure skater for ten years and later performed professionally on the ice. Working at the rink side of major events has turned that background into a strong interest in how international sport is organised, promoted and run."
    ],
    greeting: "Hi, I’m Chloe.",   // heading on the first About pop-up page
    interestsTitle: "Areas I’m interested in",
    interests: [
      "Sports Event Operations",
      "Partnerships & Activation",
      "Marketing & Communications",
      "Community Engagement",
      "Project Coordination"
    ],
    facts: [
      { label: "Studying", value: "Erasmus Mundus GOALS master's programme" },
      { label: "Background", value: "BSc Sport & Exercise Science" },
      { label: "Languages", value: "Korean (Native), English (C1), French (A2), German (A1)" },
      { label: "Looking for", value: "Internships & junior roles in international sport" }
    ]
  },

  experience: {
    title: "Experience",
    subtitle: "On the ground, behind the scenes, and across borders.",
    intro: "From international figure skating events to community leadership and independent work, these experiences have shaped how I organise, communicate and collaborate.",
    featuredTitle: "Featured experiences",
    archiveTitle: "Experience archive",
    // =====================================================================
    //  EXPERIENCE — every card, story page and archive entry reads from this one list.
    //  • featured: true  → big card at the top + its own story page (#experience-<slug>)
    //    featured: false → line in the archive below (opens in place, no separate page)
    //  • group: "events" | "work" | "athletic"  → which archive filter it belongs to
    //  • Photos: put the file in assets/ and write the path, e.g. coverImage: "assets/prague-cover.jpg"
    //    gallery: [{ src: "assets/prague-1.jpg", alt: "what the photo shows", caption: "optional" }]
    //  • published: false hides an entry everywhere (handy while you are still writing it).
    //  • Empty fields ("" or []) are hidden. Only write what really happened.
    // =====================================================================
    filters: [
      { id: "all", label: "All" },
      { id: "events", label: "Sports Events & Volunteering" },
      { id: "work", label: "Professional & Independent Work" },
      { id: "athletic", label: "Athletic Background" }
    ],
    items: [
      // ---------------- FEATURED 01 ----------------
      {
        id: 1, slug: "isu-worlds-prague-2026", featured: true, published: true, group: "events",
        organisation: "ISU World Figure Skating Championships",
        officialRole: "Mixed Zone Supervisor",
        editorialHeadline: "Keeping the Mixed Zone Moving",
        subtitle: "Coordinating athlete interviews and media flow on the world championship stage.",
        location: "Prague, Czech Republic",
        date: "March 2026",
        category: "International Event Operations",
        overview: "At the ISU World Figure Skating Championships in Prague, I managed mixed-zone flow as a supervisor, coordinating athlete movement, interview logistics and communication between event personnel and international media.",
        responsibilities: [
          "Coordinated athlete movement and interview logistics within the mixed zone.",
          "Supported media access and interview flow during a major international sporting event.",
          "Collaborated as part of a seven-person operations team.",
          "Managed mixed-zone flow supporting 487 accredited media and broadcast personnel.",
          "Responded to changing on-site requirements while helping maintain organised communication and interview procedures."
        ],
        contributions: [],
        metrics: [
          { value: "7", label: "Person operations team I was part of" },
          { value: "487", label: "Accredited media & broadcast personnel at the event" }
        ],
        skills: ["Mixed Zone Operations", "Athlete & Media Coordination", "Interview Logistics", "On-site Problem Solving", "Team Communication", "International Event Operations"],
        card: {   // homepage card (latest CV)
          what: "Managed mixed-zone flow supporting 487 accredited media and broadcast personnel, and coordinated on-site athlete and media logistics.",
          contextLabel: "Context",
          context: "Part of a seven-person operations team at the World Championships."
        },
        coverImage: "assets/prague-team.jpg", coverAlt: "Team photo at the ISU World Figure Skating Championships in Prague",
        gallery: [], mediaLinks: [], relatedProjects: [], editions: []
      },
      // ---------------- FEATURED 02 (two editions on one page) ----------------
      {
        id: 2, slug: "grand-prix-de-france-angers", featured: true, published: true, group: "events",
        organisation: "ISU Grand Prix de France",
        officialRole: "Press Team",
        editorialHeadline: "Two Editions with the Press Team",
        subtitle: "Working between athletes and international media across two editions.",
        location: "Angers, France",
        date: "October 2025 & October 2026",
        category: "Media Operations & Communications",
        overview: "I worked with the press team at the ISU Grand Prix de France in Angers in October 2025 and again in October 2026, facilitating athlete interviews, press conferences and mixed-zone operations, and assisting accredited media with Korean–English interpretation and on-site requests.",
        responsibilities: [
          "Facilitated athlete interviews, press conferences and mixed-zone operations.",
          "Assisted 80+ accredited media representatives with Korean–English interpretation and on-site requests."
        ],
        contributions: [],
        metrics: [
          { value: "2", label: "Editions of the same event" },
          { value: "80+", label: "Accredited media representatives assisted" }
        ],
        skills: [],
        card: {
          what: "Facilitated athlete interviews, press conferences and mixed-zone operations, and helped 80+ accredited media with Korean–English interpretation and on-site requests.",
          contextLabel: "What came out of it",
          context: "I returned for a second edition in 2026."
        },
        coverImage: "", coverAlt: "",
        gallery: [], mediaLinks: [], relatedProjects: [],
        editions: [],
        // Earlier per-year notes, kept for reference but NOT shown: the latest CV lists "Press Team" for both years.
        previousEditions: [
          {
            year: "2025",
            officialRole: "Press Team Volunteer",
            editorialSubheading: "Behind the Scenes",
            focus: "Press Services & Event Support",
            overview: "",
            responsibilities: [
              "Supported media accreditation and check-in.",
              "Assisted with press services and media-related requests.",
              "Helped coordinate athlete interview activities.",
              "Supported the day-to-day flow of press operations.",
              "Worked with event staff and media representatives in an international competition environment."
            ],
            skills: ["Media Accreditation", "Press Services", "Event Support", "Teamwork", "International Communication"],
            gallery: []
          },
          {
            year: "2026",
            officialRole: "Mixed Zone Manager",
            editorialSubheading: "Taking on Greater Responsibility",
            focus: "Mixed Zone Coordination & Multilingual Communication",
            overview: "",
            responsibilities: [
              "Managed assigned mixed-zone operational responsibilities.",
              "Coordinated athlete interview logistics and media communication within the mixed-zone environment.",
              "Supported press operations and communication with international media representatives.",
              "Provided Korean–English interpretation during press conferences.",
              "Adapted to the fast-paced operational demands of an international figure skating event."
            ],
            skills: ["Mixed Zone Management", "Athlete Interview Coordination", "Press Conference Interpretation", "Media Communication", "On-site Operations", "Cross-Cultural Communication"],
            gallery: []
          }
        ]
      },
      // ---------------- FEATURED 03 ----------------
      {
        id: 3, slug: "coventry-ice-skating-society", featured: true, published: true, group: "events",
        organisation: "Coventry University Ice Skating Society",
        officialRole: "President",
        editorialHeadline: "From Two Skaters to a Community of 50+",
        subtitle: "Building a place for people to connect through skating.",
        location: "Coventry, United Kingdom",
        date: "2022–2025",
        category: "Community Leadership",
        overview: "During my time at Coventry University, I helped revitalise the Ice Skating Society, growing its membership from just two students to more than 50 and creating a welcoming environment for skaters of different experience levels.",
        responsibilities: [
          "Grew society membership from 2 to 50+.",
          "Coordinated weekly sessions, events and member communications.",
          "Coordinated sessions for approximately 25–40 participants.",
          "Managed member communication and participation.",
          "Used feedback to improve activities and encourage ongoing engagement.",
          "Helped create an inclusive community for beginners and experienced skaters."
        ],
        contributions: [],
        metrics: [
          { value: "2 → 50+", label: "Members" },
          { value: "25–40", label: "Participants per weekly session (approx.)" }
        ],
        skills: ["Community Building", "Membership Growth", "Event Planning", "Leadership", "Member Engagement", "Communication"],
        card: {
          what: "Revitalised the society and coordinated weekly sessions, events and member communications for 25–40 participants.",
          contextLabel: "What came out of it",
          context: "Membership grew from 2 to 50+."
        },
        coverImage: "assets/uk-4.jpg", coverAlt: "Large group of Ice Skating Society members on the ice",
        gallery: [], mediaLinks: [], relatedProjects: [], editions: []
      },

      // ================= ARCHIVE — Sports Events & Volunteering =================
      {
        id: 5, slug: "pink-run", featured: false, published: true, group: "events",
        organisation: "Pink Run", officialRole: "Event Operations Volunteer",
        location: "Seoul, South Korea", date: "October 2026",
        overview: "Led photo booth operations at a breast cancer awareness run.",
        responsibilities: [],
        contributions: [], metrics: [],
        skills: ["Participant Experience", "Crowd Flow", "Event Support"],
        gallery: [], relatedProjects: []
      },
      {
        id: 12, slug: "study-in-europe-pavilion", featured: false, published: true, group: "events",
        organisation: "Study in Europe Pavilion", officialRole: "Student Representative",
        location: "Seoul, South Korea", date: "September 2026",
        overview: "Represented the GOALS programme at the invitation of the EU Delegation to Korea.",
        responsibilities: [], contributions: [], metrics: [], skills: [],
        gallery: [], relatedProjects: []
      },
      {
        id: 4, slug: "eu-sport-conference", featured: false, published: true, group: "events",
        organisation: "EU Sport Congress", officialRole: "Event Operations Volunteer",
        location: "Lille, France", date: "2025",
        overview: "Supported the delivery of an international sports conference through attendee services, guest coordination and on-site logistical support.",
        responsibilities: ["Assisted with attendee accreditation.", "Supported guest flow and event logistics.", "Helped monitor catering inventory and operational requirements."],
        contributions: [], metrics: [],
        skills: ["Event Logistics", "Guest Services", "Accreditation", "Teamwork"],
        gallery: [], relatedProjects: []
      },
      {
        id: 6, slug: "cu-young-footballers-programme", featured: false, published: true, group: "events",
        organisation: "CU Young Footballers Programme", officialRole: "Research Volunteer",
        location: "Coventry, United Kingdom", date: "November 2024",
        overview: "Supported on-site data collection and physical performance testing for 25 young footballers aged 9–14.",
        responsibilities: ["Supported participant flow and communication.", "Assisted with structured data collection.", "Helped organise research-related activities."],
        contributions: [], metrics: [],
        skills: ["Research Support", "Participant Coordination", "Data Collection"],
        gallery: [], relatedProjects: []
      },
      {
        id: 7, slug: "kids-au", featured: false, published: true, group: "events",
        organisation: "Kid’s AU", officialRole: "International Youth Event Volunteer",
        location: "Ulaanbaatar, Mongolia", date: "August 2019",
        overview: "Supported an international youth event bringing together 129 participants from five Northeast Asian countries.",
        responsibilities: ["Assisted with event coordination.", "Supported cultural exchange activities.", "Helped participants navigate the programme."],
        contributions: [], metrics: [],
        skills: ["International Communication", "Event Support", "Cultural Exchange"],
        gallery: [], relatedProjects: []
      },

      // ================= ARCHIVE — Professional & Independent Work =================
      {
        id: 8, slug: "preply", featured: false, published: true, group: "work", rich: true,
        organisation: "Preply", officialRole: "Korean Tutor",
        editorialHeadline: "Teaching Across Borders",
        employmentType: "Freelance / Self-Employed", workArrangement: "Remote / International",
        location: "Remote / International", date: "2024–Present",
        overview: "As a Korean tutor on Preply, I have delivered over 500 personalised lessons to learners from different cultural backgrounds, independently coordinating international lesson schedules, student communication and personalised learning content while travelling between countries.",
        metrics: [
          { value: "500+", label: "Lessons delivered" }
        ],
        // To verify with Chloe before showing (not on the latest CV): 23 students, 10 countries, and the country list.
        pendingVerification: { metrics: [{ value: "23", label: "Students taught" }, { value: "10", label: "Countries reached" }],
          metricsNote: "Students based in the United States, United Kingdom, France, Canada, Italy, Russia, Malaysia, Ireland, Germany and Portugal: 10 countries across Europe, North America and Asia." },
        responsibilities: [
          { heading: "International Scheduling & Time Management", items: [
            "Coordinated lessons with students based across Europe, North America and Asia.",
            "Managed different local times, student availability and scheduling requirements.",
            "Adapted lesson schedules while travelling and relocating internationally.",
            "Independently balanced lesson preparation, client communication and teaching commitments."] },
          { heading: "Cross-Cultural Communication", items: [
            "Worked with students from different cultural and linguistic backgrounds.",
            "Adapted teaching methods and communication styles to individual learning needs.",
            "Built ongoing professional relationships with international learners."] },
          { heading: "Curriculum & Content Development", items: [
            "Designed personalised learning plans and curricula.",
            "Created teaching presentations, exercises and learning resources.",
            "Adapted lesson materials based on language levels, goals and student feedback."] },
          { heading: "Independent Freelance Operations", items: [
            "Managed scheduling, lesson preparation and delivery independently.",
            "Coordinated student communication and ongoing learning progress.",
            "Delivered 500+ lessons while managing an international student base."] }
        ],
        contributions: [],
        skills: ["Cross-Time-Zone Scheduling", "International Coordination", "Time Management", "Cross-Cultural Communication", "Curriculum Development", "Content Creation", "Client Communication", "Independent Operations"],
        gallery: [],
        relatedProjects: ["korean-learning-materials"]     // shown only when that mini project is published
      },
      {
        id: 9, slug: "phantasialand", featured: false, published: true, group: "work",
        organisation: "Phantasialand", officialRole: "Professional Ice Skater",
        location: "Brühl, Germany", date: "March–September 2024",
        overview: "Executed live performances demonstrating adaptability, precision and teamwork.",
        responsibilities: ["Performed in live ice-skating productions.", "Worked collaboratively in a live entertainment environment."],
        // To verify with Chloe before showing (not on the latest CV):
        pendingVerification: { responsibilities: ["Prepared choreography and covered roles for 12 performers.", "Supported more than 55 shows through performance preparation and adaptability."] },
        contributions: [], metrics: [],
        skills: ["Live Production", "Adaptability", "Teamwork", "Performance Preparation"],
        gallery: [], relatedProjects: []
      },
      {
        id: 10, slug: "british-council", featured: false, published: true, group: "work",
        organisation: "British Council", officialRole: "English Class Assistant & Level Tester",
        location: "South Korea", date: "March–September 2023",
        overview: "Supported English-language education through classroom assistance, communication support and individual language assessments.",
        responsibilities: ["Assisted with English classes and classroom activities.", "Supported real-time communication and translation.", "Conducted individual language-level assessments."],
        contributions: [], metrics: [],
        skills: ["Communication", "Assessment", "Interpretation", "Classroom Coordination"],
        gallery: [], relatedProjects: []
      },

      // ================= ARCHIVE — Athletic Background =================
      {
        id: 11, slug: "competitive-figure-skating", featured: false, published: true, group: "athletic",
        organisation: "Competitive Figure Skating", officialRole: "Competitive Figure Skater",
        location: "South Korea", date: "Ten years, until 2019",
        overview: "Spent ten years training and competing in figure skating, including representing Gyeonggi-do between 2015 and 2018. This background shaped my understanding of athlete experiences, discipline and the operational environment surrounding sport.",
        responsibilities: [], contributions: [], metrics: [],
        skills: ["Athlete Perspective", "Discipline", "Performance", "Adaptability"],
        gallery: [], relatedProjects: []
      }
    ],
    // ---- Mini projects shown inside an archive entry (linked by relatedProjects) ----
    // To go live: add 4–8 slides with real images, then set published: true.
    miniProjects: [
      {
        id: "korean-learning-materials",
        title: "Korean Learning Materials",
        category: "Curriculum & Content Development",
        description: "A collection of personalised Korean learning resources designed for international students, demonstrating curriculum planning, educational content development and audience-focused communication.",
        published: false,
        slides: []      // [{ image: "assets/klm-1.jpg", alt: "...", title: "...", caption: "...", lessonCategory: "...", link: "" }]
      }
    ]
  },

  projects: {
    title: "Projects",
    intro: "Ideas I've explored, problems I've worked on, and things I've built.",   // supporting line under the Projects heading
    // older intro (kept for reference): "Academic and independent projects. Academic work was completed as coursework, not for the organisations named."
    // =====================================================================
    //  PROJECTS PAGE (Nov 2026) - each project in "showcase" is one editorial feature on the page.
    //  To add a project: copy the whole { ... } block below, change the text and image paths.
    //  Every field is optional except title; empty fields are simply not shown.
    //    layout: "hero"  → title + short text beside the main visual, details below (good for tools)
    //            "stack" → main visual under the text, full width (good for decks, creative or visual work)
    //            "showcase" → compact intro, product screenshots with Dashboard / Comments style tabs (views: [...]),
    //                         approach, contribution and evidence. Each project brings its own views.
    //  The older project list further down ("list") is kept but no longer shown.
    // =====================================================================
    showcase: [
      {
        slug: "campaign-response-monitor",
        layout: "showcase",                      // "showcase": intro → product views with tabs → approach → contribution → evidence
        number: "01",
        category: "Independent project · Sports marketing",
        title: "Campaign Response Monitor",
        question: "What do people actually notice in sports campaigns beyond views and likes?",
        summary: "I built an AI-assisted tool to analyse public YouTube comments and compare audience responses to Nike and adidas campaigns.",
        // product evidence: one tab per screenshot (each project can bring its own views)
        views: [
          { label: "Dashboard", src: "assets/projects/crm-dashboard.png", width: 1662, height: 794, alt: "The Campaign Response Monitor dashboard: 2 campaigns, 73 comments, 73 analysed, 49 needing review, and a bar chart of comment themes for Nike and adidas", caption: "Compare how different themes appear in public comments across the two campaigns.",
            // mobile detail view: a crop of the real screenshot in its own pixels (x, y, width, height); a tap still opens the full image
            mobileCrop: { x: 0, y: 196, w: 900, h: 594, label: "Detail: summary figures and the first theme comparisons" } },
          { label: "Comments", src: "assets/projects/crm-comments.jpg", width: 2266, height: 1218, alt: "The Comments view: brand and sentiment filters, a needs-review toggle, a table of comments with themes, sentiment, purchase intent and summary, and a Download filtered Excel report button", caption: "Explore individual comments alongside their classified themes, sentiment and purchase interest.",
            mobileCrop: { x: 1203, y: 478, w: 676, h: 616, label: "Detail: classified themes, sentiment and purchase intent" } }
        ],
        // "My role": one section for what was designed, how it was built and what was tested
        role: {
          label: "My role",
          title: "Design & Build",
          parts: [
            { label: "Design", primary: true,
              text: "Selected the campaigns and defined how audience comments would be analysed and compared.",
              tags: ["Themes", "Sentiment", "Purchase interest"] },
            { label: "Build",
              flow: [                                   // the actual workflow, in order: what each technology does
                { step: "Collect",  tool: "YouTube Data API" },
                { step: "Classify", tool: "OpenAI Batch API" },
                { step: "Store",    tool: "SQLite" },
                { step: "Explore",  tool: "Streamlit" }
              ],
              note: "Python workflow · AI-assisted coding" },
            { label: "Test & review", step: "Human review",    // drawn after the workflow, with a dashed line: my work, not part of the software
              text: "Tested the application and reviewed the classification outputs." }
          ]
        },
        // test context, shown compactly under the screenshots (not as headline numbers)
        evidenceLabel: "Test scope",
        evidence: [
          { value: "2", label: "campaign videos" },
          { value: "73", label: "comments analysed" }
        ],
        evidenceDetail: "49 flagged for closer human review, not confirmed errors.",
        limitation: "Exploratory test only; not representative of wider audience sentiment.",
        disclaimer: "Independent project, not affiliated with Nike or adidas.",
        tech: ["Python", "YouTube Data API", "OpenAI Batch API", "SQLite", "Streamlit"],
        links: [ { label: "View on GitHub", href: "https://github.com/jchh0606/campaign-response-monitor", hidden: true } ]   // hidden while the repository is private: delete hidden: true to show it
      }
    ],
    // =====================================================================
    //  PROJECTS — edit everything about your projects here.
    //  The cards on the Projects page AND each project's own page read from this list,
    //  so changing a title, text or picture here updates both automatically.
    //
    //  • Change a project's status:  status: "Planned" | "In Progress" | "Completed"
    //  • Show the full project page:  showDetails: true   (false → "details coming soon" page)
    //  • Add a picture: put the file in assets/ and write its path, e.g. coverImage: "assets/nb-cover.jpg"
    //  • Add a new project: copy one whole { ... } block, paste it at the end of the list,
    //    give it a new id and a new slug (lowercase-with-dashes; the slug becomes its web address #project-slug).
    //  • Empty fields ("" or []) are simply hidden on the project page.
    //  • Write only what really happened. For group work, describe your own part in myRole.
    //  • hidden: true  → kept here but not shown to visitors (for projects that are not ready yet).
    // =====================================================================
    list: [
      {
        id: 1,
        slug: "academic-project-01",
        hidden: true,                         // Nov 2026: kept for later, not shown on the redesigned Projects page
        number: "01",
        category: "Academic",                 // "Academic" or "Skills-Based"
        title: "New Balance Category Management",
        type: "Individual Project",
        year: "",                             // e.g. "2025"
        status: "Completed",                  // "Planned" | "In Progress" | "Completed"
        showDetails: false,                   // true when the project page content below is ready
        card: { whatLabel: "What I did", what: "Analysed three regional markets and four competitors to develop strategic recommendations.",
                resultType: "deliverable", result: "Strategic recommendations" },   // latest CV
        shortDescription: "",                 // 2–3 sentences, shown on the back of the card
        cardImage: "",                        // optional picture on the front of the card
        coverImage: "", coverAlt: "",         // big picture at the top of the project page
        overview: "", objectives: [], context: "",
        myRole: "", responsibilities: [], skills: [], tools: [],
        process: [], keyDecisions: [],
        outcomes: [], learnings: [], skillsDeveloped: [],
        gallery: [],                          // [{ src: "assets/x.jpg", alt: "...", caption: "..." }]
        documents: [],                        // [{ label: "Final report (PDF)", href: "assets/report.pdf" }]
        externalLinks: []                     // [{ label: "...", href: "https://..." }]
      },
      {
        id: 2,
        slug: "academic-project-02",
        hidden: true,                         // Nov 2026: kept for later, not shown on the redesigned Projects page
        number: "02",
        category: "Academic",
        title: "Vilkaviškio Perlas GO Growth Strategy",
        type: "Group Project",
        year: "",
        status: "Completed",
        showDetails: false,
        card: { whatLabel: "My part", what: "Developed a club growth strategy combining community engagement and digital fan initiatives.",
                resultType: "target", result: "25–30% attendance growth" },          // a proposed target, not an achieved outcome
        shortDescription: "",
        cardImage: "",
        coverImage: "", coverAlt: "",
        overview: "", objectives: [], context: "",
        myRole: "", responsibilities: [], skills: [], tools: [],
        process: [], keyDecisions: [],
        outcomes: [], learnings: [], skillsDeveloped: [],
        gallery: [], documents: [], externalLinks: []
      },
      {
        id: 3,
        slug: "academic-project-03",
        hidden: true,                         // Nov 2026: kept for later, not shown on the redesigned Projects page
        number: "03",
        category: "Academic",
        title: "ISU Young Athlete Governance Strategy",
        type: "Group Consultancy Project",
        featured: true,                       // true → shown as the featured project in "At a glance" (one only)
        year: "",
        status: "Completed",
        showDetails: false,
        card: { whatLabel: "My part", what: "Contributed to a three-pillar youth safeguarding policy and a KPI-based monitoring framework.",
                resultType: "deliverable", result: "Safeguarding policy and monitoring framework (proposal)" },
        shortDescription: "",
        cardImage: "",
        coverImage: "", coverAlt: "",
        overview: "", objectives: [], context: "",
        myRole: "", responsibilities: [], skills: [], tools: [],
        process: [], keyDecisions: [],
        outcomes: [], learnings: [], skillsDeveloped: [],
        gallery: [], documents: [], externalLinks: []
      },
      {
        id: 4,
        slug: "skills-project-01",
        hidden: true,                         // Nov 2026: kept for later, not shown on the redesigned Projects page
        number: "04",
        category: "Skills-Based",
        title: "Sorare Operations Lab",
        type: "Independent Portfolio Project",
        year: "",
        status: "In Progress",
        showDetails: false,
        card: { whatLabel: "Idea", what: "A demo that will check fictional player data for missing values, duplicates and image file-name errors.",
                resultType: "progress", result: "Not built yet" },
        shortDescription: "A planned demo that will check fictional player data for missing values, duplicates and image file-name errors. Not built yet: this space will be updated as the project develops.",
        cardImage: "",
        coverImage: "", coverAlt: "",
        overview: "", objectives: [], context: "",
        myRole: "", responsibilities: [], skills: [], tools: [],
        process: [], keyDecisions: [],
        outcomes: [], learnings: [], skillsDeveloped: [],
        gallery: [], documents: [], externalLinks: []
      },
      {
        id: 5,
        slug: "skills-project-02",
        number: "05",
        category: "Skills-Based",
        title: "Skills Project 02",           // placeholder: replace with the real title
        hidden: true,                         // hidden from visitors until it has real content (delete this line to show it)
        type: "",
        year: "",
        status: "Planned",
        showDetails: false,
        shortDescription: "",
        cardImage: "",
        coverImage: "", coverAlt: "",
        overview: "", objectives: [], context: "",
        myRole: "", responsibilities: [], skills: [], tools: [],
        process: [], keyDecisions: [],
        outcomes: [], learnings: [], skillsDeveloped: [],
        gallery: [], documents: [], externalLinks: []
      },
      {
        id: 6,
        slug: "skills-project-03",
        number: "06",
        category: "Skills-Based",
        title: "Skills Project 03",           // placeholder: replace with the real title
        hidden: true,                         // hidden from visitors until it has real content (delete this line to show it)
        type: "",
        year: "",
        status: "Planned",
        showDetails: false,
        shortDescription: "",
        cardImage: "",
        coverImage: "", coverAlt: "",
        overview: "", objectives: [], context: "",
        myRole: "", responsibilities: [], skills: [], tools: [],
        process: [], keyDecisions: [],
        outcomes: [], learnings: [], skillsDeveloped: [],
        gallery: [], documents: [], externalLinks: []
      }
    ]
  },

  // ---- 빙상장 "스폰서" 자리: 학교 로고 ----
  // 위에 있을수록 비싼 자리예요 (1번 = 링크 정중앙 얼음, 2·3번 = 얼음 양쪽, 그다음 = 보드 광고판).
  // 순서를 바꾸면 자리도 바뀌어요. 로고를 누르면 그 학교 이야기 창이 열려요.
  //   relation: 나와 이 학교의 관계 (예: "BSc Sport & Exercise Science, 2022–2025")
  //   story:    이곳에서 한 일·있었던 일 (비어 있으면 "To add"로 보여요)
  //   photos:   사진 경로 목록, 예: ["assets/schools/coventry-1.jpg", "assets/schools/coventry-2.jpg"]
  //   partner:  true = 내가 다닌 학교가 아니라 GOALS 협력 대학 (그렇게 표시돼요)
  // ---- In the 3D rink ----
  rink: {
    // Boards around the ice: places I have worked. No logo file → the name is written in navy letters.
    boards: [
      { name: "ISU World Figure Skating Championships Prague 2026", logo: "assets/work/isu-prague.png", experience: "isu-worlds-prague-2026" },
      { name: "ISU Grand Prix de France", logo: "assets/work/gp-france.png", experience: "grand-prix-de-france-angers" },
      { name: "Phantasialand", logo: "assets/work/phantasialand.png", experience: "phantasialand" },
      { name: "Preply", logo: "assets/work/preply.png", experience: "preply" },
      { name: "Coventry University Ice Skating Society", text: "Coventry University Ice Skating Society", logo: "", experience: "coventry-ice-skating-society" },
      { name: "EU Sport Congress", logo: "assets/work/eusc.png", experience: "eu-sport-conference" },
      { name: "British Council", logo: "assets/work/british-council.png", experience: "british-council" },
      { name: "Pink Run", logo: "assets/work/pinkrun.png", experience: "pink-run" },
      { name: "CU Young Footballers Programme", text: "CU Young Footballers Programme", logo: "", experience: "cu-young-footballers-programme" },
      { name: "Kid’s AU", text: "Kid’s AU · Ulaanbaatar", logo: "", experience: "kids-au" }
    ],
    // Flags lowered from the ceiling, like a medal ceremony: where I have lived and studied.
    // school: shown with the country when the mouse is over the flag.
    flags: [
      { code: "KR", country: "South Korea", note: "Where it began" },
      { code: "GB", country: "United Kingdom", school: "Coventry University" },
      { code: "DE", country: "Germany", school: "German Sport University Cologne" },
      { code: "FR", country: "France", school: "Université de Lille" },
      { code: "LT", country: "Lithuania", school: "Mykolas Romeris University" },
      { code: "LU", country: "Luxembourg", school: "LUNEX University" },
      { code: "PT", country: "Portugal", school: "Universidade de Lisboa" },
      { code: "PL", country: "Poland", school: "Nicolaus Copernicus University in Toruń" }
    ],
    // The places on my journey, in order. Not drawn in the arena right now; kept for re-use (e.g. My Story).
    // code: the matching flag code (same codes as the flags above).
    cities: [
      { name: "Seoul", country: "South Korea", note: "Where it began", code: "KR" },
      { name: "Coventry", country: "United Kingdom", note: "Coventry University", code: "GB" },
      { name: "Cologne", country: "Germany", note: "German Sport University Cologne", code: "DE" },
      { name: "Lille", country: "France", note: "Université de Lille", code: "FR" },
      { name: "Vilnius", country: "Lithuania", note: "Mykolas Romeris University", code: "LT" },
      { name: "Luxembourg", country: "Luxembourg", note: "LUNEX University", code: "LU" },
      { name: "Lisbon", country: "Portugal", note: "Universidade de Lisboa", code: "PT" },
      { name: "Toruń", country: "Poland", note: "Nicolaus Copernicus University", code: "PL" }
    ]
  },

  sponsors: [
    { name: "Erasmus Mundus GOALS", short: "GOALS", sub: "Erasmus Mundus", logo: "assets/logos/goals.png",
      relation: "My current master's programme", story: "", photos: [] },
    { name: "LUNEX University", short: "LUNEX", sub: "University", logo: "assets/logos/lunex.png",
      relation: "", story: "", photos: [] },
    { name: "Coventry University", short: "Coventry", sub: "University", logo: "assets/logos/coventry.png",
      relation: "", story: "", photos: [] },
    { name: "German Sport University Cologne", short: "German Sport University", sub: "Cologne", logo: "assets/logos/cologne.png",
      relation: "", story: "", photos: [] },
    { name: "Université de Lille", short: "Université de Lille", sub: "", logo: "assets/logos/lille.png",
      relation: "", story: "", photos: [] },
    { name: "Mykolas Romeris University", short: "Mykolas Romeris", sub: "University", logo: "assets/logos/mru.png",
      relation: "", story: "", photos: [] },
    { name: "Nicolaus Copernicus University in Toruń", short: "Nicolaus Copernicus", sub: "University in Toruń", logo: "assets/logos/torun.png",
      relation: "GOALS semester 4: master's thesis (planned)", story: "", photos: [] },
    { name: "Universidade de Lisboa", short: "Universidade", sub: "de Lisboa", logo: "assets/logos/lisbon.png",
      relation: "GOALS partner university", story: "One of the universities that run the Erasmus Mundus GOALS programme.", photos: [], partner: true }
  ],

  contact: {
    title: "Contact",
    intro: "Open to internships and junior roles in international sport.",
    // 실제 값을 넣으면 버튼이 나타납니다. 비어 있으면 버튼이 보이지 않습니다.
    linkedin: "https://www.linkedin.com/in/chaehyeon-chloe-jeong/",
    email: "jchh0606@gmail.com",
    cvLink: "",     // CV 파일을 받으면 연결할게요 (비어 있으면 CV 버튼이 보이지 않아요)
    // ---- Contact 팝업 카드 ("After the Show") ----
    card: {
      heading: "Let’s Connect.",
      topics: "Opportunities · Collaborations · Conversations",
      invite: "Have something in mind? I’d love to hear from you.",
      location: "Paris, France",
      photo: "assets/chloe-profile.jpg"
    }
  }
};
