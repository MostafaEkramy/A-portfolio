import { createContext, useState, useEffect, useContext } from 'react'

const TranslationContext = createContext()

const translations = {
  en: {
    // Navbar
    navHome: 'Home',
    navAbout: 'About',
    navSkills: 'Skills',
    navProjects: 'Projects',
    navCertifications: 'Certificates',
    navAchievements: 'Achievements',
    navEvents: 'Events',
    navContact: 'Contact',
    navCV: 'CV',

    // Hero
    heroGreeting: "Hello, I'm",
    heroName: 'Ahmed EL Saeed',
    heroIntro: "I'm a",
    heroDesc: 'Passionate about building innovative solutions and turning ideas into reality. Currently studying at the Faculty of Engineering, Mansoura National University.',
    heroQuote: 'Building the future, one line of code at a time',
    heroBtnProjects: 'View Projects',
    heroBtnContact: 'Contact Me',
    heroBtnCV: 'Download CV',

    // About
    aboutTitle: 'About Me',
    aboutText: 'I am Ahmed EL Saeed, a dedicated engineering student at Mansoura National University with a strong passion for software engineering, problem-solving, and technology. I strive to combine my engineering knowledge with cutting-edge technologies to create impactful solutions. I am always eager to learn, grow, and take on new challenges.',
    aboutEduTitle: 'Education',
    aboutLabelName: 'Name',
    aboutLabelUniversity: 'University',
    aboutLabelFaculty: 'Faculty',
    aboutLabelLocation: 'Location',
    aboutValName: 'Ahmed EL Saeed',
    aboutValUniversity: 'Mansoura National University',
    aboutValFaculty: 'Faculty of Engineering',
    aboutValLocation: 'Egypt',
    aboutTimeline1Title: 'Faculty of Engineering',
    aboutTimeline1Subtitle: 'Mansoura National University',
    aboutTimeline1Period: 'Current',
    aboutTimeline1Desc: 'Pursuing engineering degree with focus on technology and innovation',
    aboutTimeline2Title: 'Secondary Education',
    aboutTimeline2Subtitle: 'Completed with Distinction',
    aboutTimeline2Period: 'Graduated',
    aboutTimeline2Desc: 'Completed secondary education with excellent academic performance',

    // Skills
    skillsTitle: 'My Skills',
    skillsCatProg: 'Programming Languages',
    skillsCatWeb: 'Web Development',
    skillsCatProblem: 'Problem Solving',
    skillsCatEng: 'Engineering Skills',
    skillsCatSoft: 'Soft Skills',

    // Projects
    projectsTitle: 'My Projects',
    projectsSearchPlaceholder: 'Search projects...',
    projectsFilterAll: 'All',
    projectsLiveDemo: 'Live Demo',
    projectsOf: 'of',
    projectsNoResults: 'No projects found',
    proj1Title: 'Portfolio Website',
    proj1Desc: 'A modern, responsive personal portfolio built with React.js featuring smooth animations and dark theme.',
    proj2Title: 'Task Management App',
    proj2Desc: 'A full-stack task management application with real-time updates and collaborative features.',
    proj3Title: 'Weather Dashboard',
    proj3Desc: 'An interactive weather dashboard that provides real-time weather data and forecasts with beautiful visualizations.',
    proj4Title: 'E-Commerce Platform',
    proj4Desc: 'A modern e-commerce platform with product catalog, shopping cart, and secure checkout functionality.',
    proj5Title: 'Chat Application',
    proj5Desc: 'Real-time chat application with private messaging, group chats, and file sharing capabilities.',
    proj6Title: 'Algorithm Visualizer',
    proj6Desc: 'An interactive tool for visualizing sorting and pathfinding algorithms with step-by-step animation.',

    // Achievements
    achievementsTitle: 'Achievements & Awards',
    statAwards: 'Awards',
    statProjects: 'Projects',
    statCompetitions: 'Competitions',
    statExperience: 'Years Experience',
    ach1Title: 'Academic Excellence Award',
    ach1Desc: 'Recognized for outstanding academic performance in engineering studies',
    ach2Title: 'Hackathon Finalist',
    ach2Desc: 'Reached the finals in a national coding hackathon competition',
    ach3Title: 'Student Leadership Award',
    ach3Desc: 'Awarded for exceptional leadership in student organizations and events',
    ach4Title: 'Programming Competition',
    ach4Desc: 'Participated and excelled in competitive programming contests',
    ach5Title: 'Community Service Recognition',
    ach5Desc: 'Recognized for volunteer work and community impact',

    // Events
    eventsTitle: 'Events',
    eventsTabOrganized: 'Organized Events',
    eventsTabAttended: 'Attended Events',
    eventOrg1Title: 'Tech Innovation Workshop',
    eventOrg1Desc: 'Organized a comprehensive workshop on emerging technologies and innovation in engineering.',
    eventOrg2Title: 'Coding Bootcamp',
    eventOrg2Desc: 'Led a week-long coding bootcamp teaching programming fundamentals to fellow students.',
    eventOrg3Title: 'Engineering Career Fair',
    eventOrg3Desc: 'Organized and managed a career fair connecting engineering students with industry professionals.',
    eventAtt1Title: 'National Engineering Conference',
    eventAtt1Desc: 'Attended the national conference on modern engineering practices and emerging technologies.',
    eventAtt2Title: 'AI & Machine Learning Summit',
    eventAtt2Desc: 'Participated in a summit exploring the latest advancements in artificial intelligence.',
    eventAtt3Title: 'Open Source Contribution Day',
    eventAtt3Desc: 'Joined a collaborative event contributing to open-source software projects.',
    eventAtt4Title: 'Leadership Development Program',
    eventAtt4Desc: 'Completed an intensive leadership development program for aspiring student leaders.',

    // Certifications
    certsTitle: 'Certifications',
    certsViewCred: 'View Credential',
    certsModalTitle: 'Certification Details',
    certsModalIssuer: 'Issued by',
    certsModalDesc: 'This certification validates proficiency and demonstrates commitment to continuous learning and professional development.',

    // Contact
    contactTitle: 'Contact Me',
    contactLabelName: 'Name',
    contactLabelEmail: 'Email',
    contactLabelSubject: 'Subject',
    contactLabelMessage: 'Message',
    contactPlaceholderName: 'Your name',
    contactPlaceholderEmail: 'Your email',
    contactPlaceholderSubject: 'Subject',
    contactPlaceholderMessage: 'Your message',
    contactBtnSend: 'Send Message',
    contactBtnSent: 'Message Sent!',
    contactGetInTouch: 'Get in Touch',
    contactDesc: 'Feel free to reach out to me for any opportunities, collaborations, or just to say hello!',
    contactFollowMe: 'Follow Me',

    // Footer
    footerCopyright: 'All rights reserved.',

    // CV
    cvTitle: 'Curriculum Vitae',
    cvDownload: 'Download CV',
    cvAtsBtn: 'ATS CV',
    cvPrintBtn: 'Download PDF / Print',
    cvBack: 'Back to Portfolio',
    cvSummary: 'Professional Summary',
    cvSummaryText: 'Dedicated engineering student at Mansoura National University with a strong passion for software engineering, problem-solving, and technology. Experienced in frontend development (React.js), algorithms, competitive programming, and engineering designs. Eager to create scalable software applications and solve complex engineering problems.',
    cvContactInfo: 'Contact Information',
    cvEduTitle: 'Education',
    cvSkillsTitle: 'Skills',
    cvProjTitle: 'Key Projects',
    cvCertTitle: 'Certifications',
    cvAchTitle: 'Achievements',
  },
  ar: {
    // Navbar
    navHome: 'الرئيسية',
    navAbout: 'من أنا',
    navSkills: 'المهارات',
    navProjects: 'المشاريع',
    navCertifications: 'الشهادات',
    navAchievements: 'الإنجازات',
    navEvents: 'الفعاليات',
    navContact: 'اتصل بي',
    navCV: 'السيرة الذاتية',

    // Hero
    heroGreeting: 'مرحباً، أنا',
    heroName: 'أحمد السعيد',
    heroIntro: 'أنا',
    heroDesc: 'شغوف ببناء حلول مبتكرة وتحويل الأفكار إلى واقع عملي. أدرس حالياً في كلية الهندسة بجامعة المنصورة الأهلية.',
    heroQuote: 'أبني المستقبل، سطر برمجيات واحد في كل مرة',
    heroBtnProjects: 'المشاريع',
    heroBtnContact: 'اتصل بي',
    heroBtnCV: 'السيرة الذاتية',

    // About
    aboutTitle: 'من أنا',
    aboutText: 'أنا أحمد السعيد، طالب هندسة طموح ومثابر بجامعة المنصورة الأهلية، لدي شغف قوي بهندسة البرمجيات، حل المشكلات، والتطوير البرمجي. أسعى لدمج معرفتي الهندسية مع أحدث التقنيات لإنشاء حلول وتطبيقات برمجية متميزة ذات أثر إيجابي. متطلع دائماً للتعلم المستمر، مواكبة التطورات التقنية ومواجهة تحديات برمجية جديدة.',
    aboutEduTitle: 'التعليم والمسيرة الدراسية',
    aboutLabelName: 'الاسم',
    aboutLabelUniversity: 'الجامعة',
    aboutLabelFaculty: 'الكلية',
    aboutLabelLocation: 'الموقع',
    aboutValName: 'أحمد السعيد',
    aboutValUniversity: 'جامعة المنصورة الأهلية',
    aboutValFaculty: 'كلية الهندسة',
    aboutValLocation: 'مصر',
    aboutTimeline1Title: 'كلية الهندسة',
    aboutTimeline1Subtitle: 'جامعة المنصورة الأهلية',
    aboutTimeline1Period: 'حالي',
    aboutTimeline1Desc: 'دراسة تخصص الهندسة مع التركيز على التقنيات الحديثة والابتكار التكنولوجي',
    aboutTimeline2Title: 'التعليم الثانوي',
    aboutTimeline2Subtitle: 'أتممته بتفوق وتقدير ممتاز',
    aboutTimeline2Period: 'تخرجت',
    aboutTimeline2Desc: 'إنهاء المرحلة الثانوية بمعدل متميز وأداء أكاديمي متفوق',

    // Skills
    skillsTitle: 'مهاراتي',
    skillsCatProg: 'لغات البرمجة',
    skillsCatWeb: 'تطوير الويب',
    skillsCatProblem: 'حل المشكلات',
    skillsCatEng: 'مهارات هندسية',
    skillsCatSoft: 'المهارات الشخصية',

    // Projects
    projectsTitle: 'مشاريعي',
    projectsSearchPlaceholder: 'ابحث عن مشروع...',
    projectsFilterAll: 'الكل',
    projectsLiveDemo: 'عرض مباشر',
    projectsOf: 'من',
    projectsNoResults: 'لا توجد مشاريع',
    proj1Title: 'موقع معرض الأعمال الشخصي',
    proj1Desc: 'موقع ويب تعريفي شخصي متجاوب ومصمم بأحدث التقنيات مع تأثيرات حركية جذابة وتنسيق ألوان متميز.',
    proj2Title: 'تطبيق إدارة المهام المتكامل',
    proj2Desc: 'تطبيق ويب لإدارة وتنظيم المهام اليومية مع ميزات تفاعلية وتحديثات فورية للمستخدمين.',
    proj3Title: 'لوحة معلومات الطقس',
    proj3Desc: 'تطبيق تفاعلي يتيح استعراض حالة الطقس والتوقعات الجوية في الوقت الفعلي مع رسوم بيانية منسقة.',
    proj4Title: 'منصة التجارة الإلكترونية',
    proj4Desc: 'منصة تسوق متكاملة تتيح استعراض المنتجات، إدارتها في سلة المشتريات وإتمام عملية الدفع بشكل آمن.',
    proj5Title: 'تطبيق المحادثة الفورية',
    proj5Desc: 'تطبيق دردشة في الوقت الفعلي يتيح تبادل الرسائل الخاصة والمجموعات ومشاركة الملفات.',
    proj6Title: 'محلل الخوارزميات التفاعلي',
    proj6Desc: 'أداة تعليمية وتفاعلية تتيح محاكاة وتصوير خوارزميات الترتيب والبحث عن المسار بخطوات متحركة.',

    // Achievements
    achievementsTitle: 'الإنجازات والجوائز الكبرى',
    statAwards: 'جوائز وتقديرات',
    statProjects: 'مشاريع منفذة',
    statCompetitions: 'مسابقات برمجية',
    statExperience: 'سنوات خبرة',
    ach1Title: 'جائزة التميز الأكاديمي',
    ach1Desc: 'تكريم رسمي للأداء الأكاديمي المتميز والتفوق الدراسي في العلوم الهندسية',
    ach2Title: 'بلوغ نهائي الهاكاثون الوطني',
    ach2Desc: 'الوصول للتصفيات النهائية في هاكاثون برمجي تنافسي لحل مشكلات واقعية باستخدام البرمجيات',
    ach3Title: 'جائزة القيادة الطلابية',
    ach3Desc: 'جائزة تكريمية لدور قيادي متميز في إدارة الأنشطة والفعاليات والمنظمات الطلابية',
    ach4Title: 'مسابقات البرمجة التنافسية',
    ach4Desc: 'المشاركة الفعالة والتفوق في تحديات البرمجة وحل المشكلات الرياضية والخوارزميات',
    ach5Title: 'تقدير الخدمة المجتمعية',
    ach5Desc: 'شهادة تكريم للمساهمة في المبادرات التطوعية المجتمعية وصناعة أثر إيجابي للغير',

    // Events
    eventsTitle: 'الفعاليات والأحداث',
    eventsTabOrganized: 'فعاليات قمت بتنظيمها',
    eventsTabAttended: 'فعاليات شاركت بها',
    eventOrg1Title: 'ورشة عمل الابتكار التكنولوجي',
    eventOrg1Desc: 'إعداد وتقديم ورشة تدريبية شاملة حول الابتكار الهندسي والتقنيات البرمجية الناشئة.',
    eventOrg2Title: 'معسكر تدريبي لتعليم البرمجة',
    eventOrg2Desc: 'تنظيم وإدارة معسكر تعليمي مكثف لتبسيط أساسيات البرمجة للطلاب والمهتمين بالتعلم.',
    eventOrg3Title: 'الملتقى المهني لطلاب الهندسة',
    eventOrg3Desc: 'إدارة ملتقى لربط طلاب الكليات الهندسية بالشركات والمتخصصين في سوق العمل.',
    eventAtt1Title: 'المؤتمر الهندسي الوطني للتقنيات الحديثة',
    eventAtt1Desc: 'حضور ومتابعة فعاليات المؤتمر الوطني للممارسات الهندسية وتطبيقات الذكاء الاصطناعي.',
    eventAtt2Title: 'قمة الذكاء الاصطناعي وتعلم الآلة',
    eventAtt2Desc: 'مشاركة فعالة في جلسات قمة مخصصة لاستعراض أحدث تقنيات ونماذج الذكاء الاصطناعي.',
    eventAtt3Title: 'يوم المساهمة في البرمجيات مفتوحة المصدر',
    eventAtt3Desc: 'التعاون مع مبرمجين محترفين في تعديل وتطوير أكواد لمشاريع عالمية مفتوحة المصدر.',
    eventAtt4Title: 'برنامج إعداد وتطوير القادة الشباب',
    eventAtt4Desc: 'إتمام دورة تدريبية مكثفة حول المهارات القيادية وتطوير فرق العمل التفاعلية.',

    // Certifications
    certsTitle: 'الشهادات المعتمدة',
    certsViewCred: 'عرض الشهادة المعتمدة',
    certsModalTitle: 'تفاصيل الشهادة',
    certsModalIssuer: 'جهة الاعتماد',
    certsModalDesc: 'تؤكد هذه الشهادة الكفاءة والاحترافية البرمجية، وتجسد الالتزام الراسخ بمواصلة التعلم وصقل المهارات الشخصية والعملية.',

    // Contact
    contactTitle: 'تواصل معي',
    contactLabelName: 'الاسم',
    contactLabelEmail: 'البريد الإلكتروني',
    contactLabelSubject: 'الموضوع',
    contactLabelMessage: 'الرسالة',
    contactPlaceholderName: 'ادخل اسمك الكريم',
    contactPlaceholderEmail: 'ادخل بريدك الإلكتروني',
    contactPlaceholderSubject: 'موضوع الرسالة',
    contactPlaceholderMessage: 'اكتب رسالتك هنا...',
    contactBtnSend: 'إرسال الرسالة الآن',
    contactBtnSent: 'تم إرسال رسالتك بنجاح!',
    contactGetInTouch: 'ابقى على تواصل',
    contactDesc: 'يسعدني تواصلك معي للاستفسار عن أي فرصة عمل أو شراكة برمجية أو مشاريع مشتركة!',
    contactFollowMe: 'حساباتي الاجتماعية',

    // Footer
    footerCopyright: 'جميع الحقوق محفوظة.',

    // CV
    cvTitle: 'السيرة الذاتية',
    cvDownload: 'Download CV',
    cvAtsBtn: 'ATS CV',
    cvPrintBtn: 'Download PDF / Print',
    cvBack: 'العودة للموقع',
    cvSummary: 'الملخص المهني',
    cvSummaryText: 'طالب هندسة طموح ومثابر بجامعة المنصورة الأهلية، شغوف بهندسة البرمجيات، حل المشكلات والبرمجة التنافسية. متمكن من تقنيات تطوير واجهات الويب وتصميم الأنظمة الهندسية. متطلع للمساهمة في بناء تطبيقات برمجية متطورة وحل المشكلات البرمجية المعقدة.',
    cvContactInfo: 'معلومات الاتصال',
    cvEduTitle: 'التعليم',
    cvSkillsTitle: 'المهارات الرئيسية',
    cvProjTitle: 'أبرز المشاريع',
    cvCertTitle: 'الشهادات المعتمدة',
    cvAchTitle: 'الإنجازات والجوائز',
  }
}

export const TranslationProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('ahmed_portfolio_lang') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('ahmed_portfolio_lang', locale)
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = locale

    if (locale === 'ar') {
      document.body.classList.add('rtl')
      document.body.style.fontFamily = "'Cairo', 'Tajawal', 'Inter', sans-serif"
    } else {
      document.body.classList.remove('rtl')
      document.body.style.fontFamily = "'Inter', sans-serif"
    }
  }, [locale])

  const t = (key) => {
    return translations[locale][key] || key
  }

  const toggleLocale = () => {
    setLocale(prev => prev === 'en' ? 'ar' : 'en')
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t, toggleLocale }}>
      {children}
    </TranslationContext.Provider>
  )
}

export const useTranslation = () => useContext(TranslationContext)
