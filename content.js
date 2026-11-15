/* =====================================================================
   CONTENT FILE — 웹사이트에 보이는 모든 글은 여기에서 수정하세요.
   - 따옴표 "..." 안의 글만 바꾸면 됩니다. 따옴표와 쉼표는 지우지 마세요.
   - 비어 있는 값 ""은 아직 쓰지 않은 항목입니다. 내용을 쓰면 사이트에 나타납니다.
   - showTodo: true  → 비어 있는 칸을 "To add" 상자로 보여줍니다 (작업용).
     showTodo: false → 비어 있는 칸을 숨깁니다. 링크를 공유하기 전에 false로 바꾸세요.
   ===================================================================== */

window.SITE = {
  showTodo: true,

  hero: {
    name: "Chloe Jeong",
    tagline: "Sports Events, Community & Business",
    // 첫 화면의 직무 키워드
    keywords: ["Sports Event Operations", "Partnerships", "Marketing Operations", "Community", "Project Coordination"],
    status: "Open to internships & junior roles in international sport",
    button: "Explore my work",
    hint: "Drag to look around · Scroll or pinch to zoom · Click the ice to skate"
  },

  // "At a glance" 요약 칸 (첫 화면 바로 아래)
  glance: {
    title: "At a glance",
    lookingFor: "Internships and junior roles in international sport.",
    availability: "Available remotely now, and on-site from January 2027."
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
    storyTitle: "My story",
    // ---- My Story pages (About pop-up, after the video page) ----
    // Add a photo later: image: "assets/xxx.jpg" + alt. Add a video later: video: "assets/xxx.mp4".
    // With no photo or video the page shows the text on its own.
    scenes: [
      {
        title: "Life on the ice",
        place: "South Korea · Figure skating",
        text: [
          "For ten years, figure skating was at the centre of my life in Korea. I spent countless hours on the ice, refining my technique, preparing for competitions and pushing myself to improve. Skating shaped much of who I am today, from the way I approach challenges to the determination I bring to everything I do.",
          "In 2019, back and ankle injuries brought my skating career to an end. I took some time to reflect on what I wanted to do next and eventually decided to pursue a new direction by studying abroad. It marked the beginning of a new chapter in my life."
        ],
        image: "assets/story-began.jpg", video: "", alt: "Chloe taking a mirror selfie, holding her white figure skates with green blade guards"
      },
      {
        title: "A new beginning",
        place: "🇬🇧 United Kingdom · Coventry University",
        text: [
          "I moved to the UK to study Sport & Exercise Science at Coventry University. After years on the ice, I wanted to better understand how the body and mind influence performance and how I could use that knowledge to support other athletes.",
          "Leading the university’s Ice Skating Society introduced me to a different side of sport. Instead of focusing on my own performance, I found myself helping others feel welcome, build confidence and enjoy being on the ice together. It was my first experience of contributing to sport beyond my own training and competitions."
        ],
        images: [                                            // photos change every 2 s
          { src: "assets/uk-1.jpg", alt: "Ice Skating Society stall with skates on a table outside a university building" },
          { src: "assets/uk-2.jpg", alt: "Four skaters in team jackets standing on the ice in an arena" },
          { src: "assets/uk-3.jpg", alt: "Selfie with friends at university" },
          { src: "assets/uk-4.jpg", alt: "Large group of Ice Skating Society members on the ice" },
          { src: "assets/uk-5.jpg", alt: "Society social night with a big group of friends" },
          { src: "assets/uk-6.jpg", alt: "Coventry University graduation day with classmates in gowns" },
          { src: "assets/de-1.jpg", alt: "Chloe horse riding on a black and white horse" }
        ],
        extras: { label: "Other societies", items: ["Language Exchange", "Horse Riding", "Tennis"] },
        image: "", video: "", alt: ""
      },
      {
        title: "A wider view of sport",
        place: "🇩🇪 Germany · German Sport University Cologne",
        text: [
          "During my exchange in Cologne, I studied Sport Management & Communication and began to see sport from a broader perspective.",
          "Living close to a stadium hosting EURO 2024 brought that learning to life. The atmosphere surrounding the tournament sparked my curiosity about what happens behind the scenes: the planning, partnerships and people that make major sporting events possible. I began to see a future for myself not just participating in sport, but helping create the experiences that bring people together."
        ],
        images: [                                            // photos 2 s each, short videos play to the end (muted)
          { video: "assets/de-v1.mp4", poster: "assets/de-v1-poster.jpg", alt: "Short video: Chloe at a EURO 2024 match in the stadium, England scarf on" },
          { src: "assets/uk-7.jpg", alt: "Chloe driving past a field, a cow looking in through the window" },
          { video: "assets/de-v2.mp4", poster: "assets/de-v2-poster.jpg", alt: "Short video: trampoline jump in a sports hall" },
          { src: "assets/de-3.jpg", alt: "Chloe walking on a mountain path with snowy peaks behind" },
          { src: "assets/uk-8.jpg", alt: "Chloe skiing, standing on a snowy slope in front of mountains" }
        ],
        image: "", video: "", alt: ""
      },
      {
        title: "Learning across borders",
        place: "🇫🇷 🇱🇹 🇱🇺 🇵🇱 🇵🇹 Europe · Erasmus Mundus GOALS",
        text: [
          "That curiosity led me to GOALS, the Erasmus Mundus Master’s programme in Governance and Administration of Leisure and Sports.",
          "Studying across five countries alongside classmates from 28 countries has introduced me to different perspectives on how sport is organised and managed. I bring my experience as a skater to our discussions, while learning from people with different cultural, academic and professional backgrounds.",
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
        title: "What comes next",
        place: "",
        text: [
          "I’m currently seeking an internship or entry-level opportunity in the international sports industry, where I can combine my background as an athlete with my experience in community leadership and international sporting events.",
          "I’m particularly interested in sports operations, business development, governance and content creation. Through these areas, I hope to contribute to projects that connect organisations, athletes and audiences while continuing to develop my understanding of the industry.",
          "From competing on the ice to exploring the world behind sport, my perspective has continued to evolve. I’m excited to bring that experience, curiosity and willingness to take on new challenges to a team working to make sport happen."
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
      { label: "Languages", value: "Korean, English, German (basic)" },
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
        overview: "At the ISU World Figure Skating Championships in Prague, I supported mixed-zone operations as a supervisor, coordinating athlete movement, interview logistics and communication between event personnel and international media.",
        responsibilities: [
          "Coordinated athlete movement and interview logistics within the mixed zone.",
          "Supported media access and interview flow during a major international sporting event.",
          "Collaborated as part of a seven-person operations team.",
          "Contributed to event operations serving 487 accredited media and broadcast personnel.",
          "Responded to changing on-site requirements while helping maintain organised communication and interview procedures."
        ],
        contributions: [],
        metrics: [
          { value: "7", label: "Person operations team I was part of" },
          { value: "487", label: "Accredited media & broadcast personnel at the event" }
        ],
        skills: ["Mixed Zone Operations", "Athlete & Media Coordination", "Interview Logistics", "On-site Problem Solving", "Team Communication", "International Event Operations"],
        coverImage: "assets/prague-team.jpg", coverAlt: "Team photo at the ISU World Figure Skating Championships in Prague",
        gallery: [], mediaLinks: [], relatedProjects: [], editions: []
      },
      // ---------------- FEATURED 02 (two editions on one page) ----------------
      {
        id: 2, slug: "grand-prix-de-france-angers", featured: true, published: true, group: "events",
        organisation: "ISU Grand Prix de France",
        officialRole: "Press Team Volunteer (2025) → Mixed Zone Manager (2026)",
        editorialHeadline: "From Volunteer to Mixed Zone Manager",
        subtitle: "Two editions. A new level of responsibility.",
        location: "Angers, France",
        date: "October 2025 & October 2026",
        category: "Media Operations & Communications",
        overview: "Returning to the ISU Grand Prix de France in 2026 marked a new chapter in my international event experience. After supporting press operations as a volunteer in 2025, I came back as Mixed Zone Manager, taking on greater operational responsibility while also providing Korean–English interpretation during press conferences.",
        responsibilities: [], contributions: [],
        metrics: [
          { value: "2", label: "Editions of the same event" },
          { value: "Volunteer → Manager", label: "Press Team Volunteer in 2025, Mixed Zone Manager in 2026" }
        ],
        skills: [],
        coverImage: "", coverAlt: "",
        gallery: [], mediaLinks: [], relatedProjects: [],
        editions: [
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
          "Organised weekly skating sessions and social activities.",
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
        coverImage: "", coverAlt: "",
        gallery: [], mediaLinks: [], relatedProjects: [], editions: []
      },

      // ================= ARCHIVE — Sports Events & Volunteering =================
      {
        id: 4, slug: "eu-sport-conference", featured: false, published: true, group: "events",
        organisation: "EU Sport Conference", officialRole: "Event Operations Volunteer",
        location: "Lille, France", date: "2025",
        overview: "Supported the delivery of an international sports conference through attendee services, guest coordination and on-site logistical support.",
        responsibilities: ["Assisted with attendee accreditation.", "Supported guest flow and event logistics.", "Helped monitor catering inventory and operational requirements."],
        contributions: [], metrics: [],
        skills: ["Event Logistics", "Guest Services", "Accreditation", "Teamwork"],
        gallery: [], relatedProjects: []
      },
      {
        id: 5, slug: "pink-run", featured: false, published: true, group: "events",
        organisation: "Pink Run", officialRole: "Event Volunteer",
        location: "Seoul, South Korea", date: "2026",
        overview: "Supported participant-facing operations at a large-scale running event.",
        responsibilities: ["Assisted with participant guidance.", "Supported crowd movement and event flow.", "Helped with on-site operational tasks."],
        contributions: [], metrics: [],
        skills: ["Participant Experience", "Crowd Flow", "Event Support"],
        gallery: [], relatedProjects: []
      },
      {
        id: 6, slug: "cu-young-footballers-programme", featured: false, published: true, group: "events",
        organisation: "CU Young Footballers Programme", officialRole: "Research Support Volunteer",
        location: "Coventry, United Kingdom", date: "November 2024",
        overview: "Assisted with participant coordination and research activities involving 25 young football participants.",
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
        organisation: "Preply", officialRole: "Freelance Korean Language Tutor",
        editorialHeadline: "Teaching Across Borders",
        employmentType: "Freelance / Self-Employed", workArrangement: "Remote / International",
        location: "Remote / International", date: "2024–Present",
        overview: "As a freelance Korean language tutor on Preply, I have delivered over 500 personalised lessons to 23 students across 10 countries in Europe, North America and Asia, independently coordinating international lesson schedules, student communication and personalised learning content while travelling between countries.",
        metrics: [
          { value: "23", label: "Students taught" },
          { value: "500+", label: "Lessons delivered" },
          { value: "10", label: "Countries reached" }
        ],
        metricsNote: "Students based in the United States, United Kingdom, France, Canada, Italy, Russia, Malaysia, Ireland, Germany and Portugal: 10 countries across Europe, North America and Asia.",
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
        overview: "Performed in professional live ice-skating productions, adapting to changing performance requirements and supporting continuity across shows.",
        responsibilities: ["Performed in live ice-skating productions.", "Prepared choreography and covered roles for 12 performers.", "Supported more than 55 shows through performance preparation and adaptability.", "Worked collaboratively in a live entertainment environment."],
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
    intro: "Academic and independent projects. Academic work was completed as coursework, not for the organisations named.",
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
    // =====================================================================
    list: [
      {
        id: 1,
        slug: "academic-project-01",
        number: "01",
        category: "Academic",                 // "Academic" or "Skills-Based"
        title: "New Balance Category Management",
        type: "Individual Academic Project",
        year: "",                             // e.g. "2025"
        status: "Completed",                  // "Planned" | "In Progress" | "Completed"
        showDetails: false,                   // true when the project page content below is ready
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
        number: "02",
        category: "Academic",
        title: "Vilkaviškio Perlas GO Growth Strategy",
        type: "Group Academic Project",
        year: "",
        status: "Completed",
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
        id: 3,
        slug: "academic-project-03",
        number: "03",
        category: "Academic",
        title: "ISU Young Athlete Governance Strategy",
        type: "Group Academic Project",
        featured: true,                       // true → shown as the featured project in "At a glance" (one only)
        year: "",
        status: "Completed",
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
        id: 4,
        slug: "skills-project-01",
        number: "04",
        category: "Skills-Based",
        title: "Sorare Operations Lab",
        type: "Independent Portfolio Project",
        year: "",
        status: "In Progress",
        showDetails: false,
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
      { name: "EU Sport Conference", logo: "assets/work/eusc.png", experience: "eu-sport-conference" },
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
