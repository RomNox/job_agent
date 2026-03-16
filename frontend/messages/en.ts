import type { DeepPartialMessages } from "@/lib/i18n";

import type { Messages } from "./de";

export const en: DeepPartialMessages<Messages> = {
  common: {
    marketLabel: "Germany",
    languageSwitcher: {
      label: "Language",
      ariaLabel: "Select interface language",
    },
    navigation: {
      howItWorks: "How it works",
      features: "Features",
      germany: "Germany",
      search: "Search",
      workspace: "Assistant",
      profile: "Profile",
      pricing: "Pricing",
      onboarding: "Onboarding",
      product: "Product",
      workflow: "Flow",
    },
    actions: {
      logIn: "Log in",
      signUp: "Sign up",
      logOut: "Log out",
      openSearch: "Open search",
      openWorkspace: "Open assistant",
      openProfile: "Open profile",
      saveProfile: "Save profile",
      save: "Save",
      next: "Next",
      back: "Back",
      retry: "Retry",
      analyze: "Analyze",
      openOriginal: "Open original",
      reviewSetup: "Review context",
      continueToWorkspace: "Go to assistant",
      openJobSearch: "Open job search",
      openJobAgent: "Open Job Agent",
      openDemo: "Open demo",
    },
    states: {
      loading: "Loading...",
      saving: "Saving...",
      checkingSession: "Checking session...",
      loggingOut: "Logging out...",
      redirectingToLogin: "Redirecting to login...",
      checkingOnboarding: "Checking onboarding progress...",
      sessionUnavailable: "Session unavailable",
      onboardingUnavailable: "Onboarding unavailable",
      authUnavailable: "Authentication unavailable",
      account: "Account",
      unknown: "Unknown",
      unavailable: "Unavailable",
      notProvided: "Not provided",
      none: "None",
      noneHighlighted: "None highlighted.",
      recently: "recently",
    },
    fields: {
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      location: "Current location",
      targetRole: "Target role",
      yearsOfExperience: "Years of experience",
      workAuthorization: "Work authorization",
      remotePreference: "Remote preference",
      salaryExpectation: "Salary expectation",
      skills: "Skills",
      languages: "Languages",
      preferredLocations: "Preferred locations",
      professionalSummary: "Professional summary",
      cvText: "CV text",
      jobUrl: "Job URL",
      rawJobText: "Raw job text",
    },
    placeholders: {
      targetRole: "Python Developer",
      workAuthorization: "EU citizen, Blue Card, visa required",
      remotePreference: "Remote, Hybrid, On-site",
      salaryExpectation: "EUR 75,000",
      skills: "Python, SQL, Docker",
      languages: "German C1, English C1",
      preferredLocations: "Berlin, Munich, Remote",
      professionalSummary:
        "Short background, strengths, and career direction.",
      cvText: "Paste CV text or reusable background context.",
      jobUrl: "https://example.com/job-posting",
      rawJobText: "Paste the visible job posting text here.",
      keywords: "Python developer",
      searchLocation: "Berlin",
      password: "Password",
      newPassword: "Create password",
    },
    hints: {
      skills: "Comma-separated. Example: Python, SQL, Excel",
      languages: "Comma-separated. Example: German C1, English B2",
      preferredLocations:
        "Comma-separated. Example: Berlin, Hamburg, Remote",
      csv: "Comma-separated.",
    },
  },
  validation: {
    emailRequired: "Email is required.",
    emailInvalid: "Enter a valid email address.",
    passwordRequired: "Password is required.",
    passwordMin: "Password must be at least 8 characters.",
    fullNameMin: "Full name must be at least 2 characters.",
    fullNameRequired: "Full name is required.",
    yearsInteger: "Use a whole number for years of experience.",
    jobUrlInvalid: "Enter a valid job URL.",
    jobInputRequired: "Provide either a job URL or raw job text.",
  },
  landing: {
    header: {
      checkingSession: "Checking session...",
      authUnavailable: "Authentication unavailable",
    },
    hero: {
      eyebrow: "Job Agent",
      title:
        "Personal assistant for job search in Germany",
      description:
        "Job Agent works with vacancies the way career consultants do: it helps you find relevant roles, analyze employer requirements, tailor your CV, prepare applications, and move through the hiring process so you can get the job you actually want, then stay relevant in the job market and continue developing your career successfully.",
      supporting: "Profile, search, review, and application in one calm flow.",
      process: "profile → search → analysis → apply",
      termsPrefix: "Read more about use and service conditions in the",
      openWorkspace: "Open assistant",
      previewEyebrow: "Job Agent",
      previewTitle:
        "How your personal consultant helps:",
      previewPanels: [
        {
          label: "Vacancies",
          title: "Find suitable vacancies",
          detail:
            "Selects relevant vacancies and suggests options aligned with your experience and career goals.",
        },
        {
          label: "Documents",
          title: "Prepare documents",
          detail:
            "We help prepare your CV and cover letter for a job application.",
        },
        {
          label: "Interview",
          title: "Pass the interview",
          detail:
            "We help you prepare for interviews and confidently move through the next stage of hiring.",
        },
        {
          label: "Skills",
          title: "Stay relevant in the job market",
          detail:
            "We help keep your profile and professional skills current.",
        },
      ],
    },
    productPreview: {
      eyebrow: "Job Agent",
      title:
        "Let's map the path to your new job",
      description:
        "Job Agent helps you move through each stage of the job search, from choosing vacancies to receiving an offer.",
      blocks: [
        {
          step: "01",
          title: "Sign up",
          description:
            "Answer a few questions so Job Agent can understand what kind of job you are looking for.",
          route: "/workspace",
        },
        {
          step: "02",
          title: "Follow the guidance",
          description:
            "Job Agent suggests suitable vacancies, helps prepare documents, and shows how to get the job you want.",
          route: "/search",
        },
        {
          step: "03",
          title: "Get the job",
          description:
            "Job Agent will help you prepare for the interview, go through it, and receive a job offer.",
          route: "/search/resolve-job",
        },
        {
          step: "04",
          title: "Grow your career",
          description:
            "Job Agent will help you prepare for the interview, complete it successfully, and get the job you want.",
          route: "/applications/prepare",
        },
      ],
    },
    howItWorks: {
      eyebrow: "Your career assistant",
      title:
        "How Job Agent helps you",
      description:
        "Job Agent personally organizes your entire job search process: it selects suitable vacancies, helps prepare documents, and suggests the next step so you can focus on the result.",
      steps: [
        {
          title: "Find suitable vacancies",
          description:
            "Job Agent finds relevant vacancies and suggests options that match your experience and career goals.",
        },
        {
          title: "Adapt documents",
          description:
            "CVs and cover letters are adapted to each vacancy with your experience and the employer's requirements in mind.",
        },
        {
          title: "Prepare for interviews",
          description:
            "If a vacancy attracts the employer's interest, Job Agent helps you prepare for the next stage and move confidently through the hiring process.",
        },
        {
          title: "Control applications",
          description:
            "All submitted applications are stored in one place so you can track the process and not miss any opportunity.",
        },
      ],
    },
    features: {
      eyebrow: "Job Agent tools",
      title: "Intelligent tools for job search",
      description:
        "Job Agent brings together vacancy analysis, document personalization, and application management in one workspace, helping you make decisions faster and more accurately.",
      items: [
        {
          title: "Job analysis",
          description:
            "Automatically extracts key requirements, skills, and employer expectations.",
        },
        {
          title: "Match Score",
          description:
            "Shows how well a vacancy matches your profile and where the gaps are.",
        },
        {
          title: "Gap Analysis",
          description:
            "Identifies the skills and requirements missing for this role.",
        },
        {
          title: "Document preparation",
          description:
            "Adapts your CV and cover letter to a specific vacancy.",
        },
        {
          title: "Application checklist",
          description:
            "Creates a list of what should be prepared before sending an application.",
        },
        {
          title: "Application tracker",
          description:
            "Tracks all submitted applications and the stages of the process.",
        },
        {
          title: "Next steps plan",
          description:
            "Suggests the actions that can increase your chances of getting the job.",
        },
        {
          title: "Interview preparation",
          description:
            "Helps you prepare for employer questions and expectations.",
        },
        {
          title: "Career Strategy",
          description:
            "Helps you understand which skills to develop and which vacancies fit best.",
        },
      ],
    },
    germany: {
      eyebrow: "Job Agent",
      title:
        "Built for the German job market",
      description:
        "Job Agent selects vacancies from German platforms and takes the specifics of the local job market into account. The service analyzes employer requirements, helps prepare documents in the right format, and suggests an application strategy that fits German market expectations. This lets you focus on the job search and act more confidently at each stage of the hiring process.",
      items: [
        {
          title: "Vacancies from German platforms",
          description:
            "Job Agent selects vacancies from popular German job platforms and aggregators.",
        },
        {
          title: "Specifics of the German job market",
          description:
            "Vacancy analysis and recommendations take employer expectations and hiring practices in Germany into account.",
        },
        {
          title: "Regular roles and Ausbildung",
          description:
            "Suitable both for professional positions and for finding Ausbildung opportunities and starting a career.",
        },
        {
          title: "The right application logic",
          description:
            "Job Agent helps prepare an application the way employers expect on the German market.",
        },
      ],
    },
    cta: {
      eyebrow: "Ready",
      title:
        "Start with your personal job assistant.",
      description:
        "Set your context once, then move from search to review to application.",
    },
    footer: {
      description:
        "Personal job assistant for job search and applications in Germany.",
    },
  },
  pricing: {
    page: {
      eyebrow: "Pricing",
      title: "Choose the right plan for your AI-assisted job search.",
      description:
        "All plans include the candidate profile, job search, and workspace. They differ by the depth of AI assistance and by the number of job analyses available each month.",
      periods: [
        { key: "threeMonths", label: "3 months" },
        { key: "sixMonths", label: "6 months" },
        { key: "twelveMonths", label: "12 months" },
      ],
      recommended: "Recommended",
      mostPopular: "Most popular",
      priceCaption: "for {period}",
      planCta: "Choose plan",
      plans: [
        {
          name: "Starter",
          description: "For the first stage of job search.",
          analysisLimit: "20 job analyses / month",
          recommended: false,
          features: [
            "AI job analysis",
            "candidate profile",
            "job search",
            "basic workspace",
          ],
          prices: {
            threeMonths: "39 €",
            sixMonths: "69 €",
            twelveMonths: "119 €",
          },
        },
        {
          name: "Pro",
          description: "Best for active job seekers.",
          analysisLimit: "50 job analyses / month",
          recommended: true,
          features: [
            "AI job analysis",
            "CV tailoring",
            "cover letter generation",
            "saved jobs",
            "improved workspace",
          ],
          prices: {
            threeMonths: "99 €",
            sixMonths: "179 €",
            twelveMonths: "329 €",
          },
        },
        {
          name: "Agent",
          description: "For intensive AI-assisted job search.",
          analysisLimit: "120 job analyses / month",
          recommended: false,
          features: [
            "full AI analysis workflow",
            "CV + cover letter",
            "application preparation",
            "application tracking",
            "advanced workspace",
          ],
          prices: {
            threeMonths: "229 €",
            sixMonths: "399 €",
            twelveMonths: "699 €",
          },
        },
      ],
      creditsNote:
        "If your analysis limit runs out, additional credits can be purchased separately inside the account later.",
    },
  },
  legal: {
    terms: {
      linkLabel: "Terms of Use",
      eyebrow: "Legal",
      title: "Terms of Use",
      description:
        "A short overview of the current usage conditions for Job Agent.",
      notice:
        "This is a compact product-level summary. A fuller legal version can be added later.",
      sections: [
        {
          title: "Responsible use",
          body: "Use Job Agent only for lawful job-search purposes and only with content you have the right to use.",
        },
        {
          title: "Your review responsibility",
          body: "You remain responsible for reviewing CVs, cover letters, analyses, and other materials before sending them to employers.",
        },
        {
          title: "No hiring guarantee",
          body: "Job Agent supports search and preparation, but it does not guarantee employer responses, interviews, or hiring outcomes.",
        },
        {
          title: "Product changes",
          body: "Features, limits, and availability may evolve as the product continues to develop.",
        },
      ],
    },
  },
  demo: {
    page: {
      eyebrow: "Demo",
      title: "Explore Job Agent before creating an account.",
      description:
        "This read-only demo shows how the workspace looks and how profile, search, analysis, and application prep stay connected in one product flow.",
      readOnlyLabel: "Read-only demo",
      readOnlyDescription:
        "The demo does not send AI requests and does not save data. It exists only to show the interface and workflow.",
      columns: [
        {
          label: "Candidate profile",
          title: "Profile setup",
          description: "The starting point for direction, context, and search signals.",
          items: [
            {
              title: "Target role and market",
              detail: "Python Developer in Berlin with a focus on German-speaking product teams.",
            },
            {
              title: "Experience and strengths",
              detail: "Backend work, APIs, data tasks, and clear communication with hiring teams.",
            },
          ],
        },
        {
          label: "Job search",
          title: "Job search",
          description: "Search results and prioritized roles stay close to the candidate context.",
          items: [
            {
              title: "Role shortlist",
              detail: "Several backend and platform roles are collected and compared.",
            },
            {
              title: "Next strong option",
              detail: "The most relevant role is moved into the workspace for analysis.",
            },
          ],
        },
        {
          label: "Preparation",
          title: "Application preparation",
          description: "Analysis, CV work, and next steps stay in one calm flow.",
          items: [
            {
              title: "Job analysis",
              detail: "Requirements, open points, and fit are shown in a structured view.",
            },
            {
              title: "Application package",
              detail: "Guidance for CV, cover letter, and preparation for the next step.",
            },
          ],
        },
      ],
      footerNote:
        "After sign-up, the same workspace becomes interactive: you can run real analyses, save context, and prepare applications.",
    },
  },
  auth: {
    backToHome: "Back to Job Agent",
    login: {
      title: "Log in",
      description:
        "Continue with your personal job assistant.",
      helper:
        "If setup is still open, onboarding continues next.",
      submit: "Log in",
      submitting: "Logging in...",
      continuing: "Continuing...",
      needAccount: "Need an account? Sign up",
      openSearch: "Open search",
      passwordLabel: "Password",
    },
    signup: {
      title: "Sign up",
      description:
        "Set up your personal job assistant.",
      helper:
        "New accounts begin with guided onboarding.",
      submit: "Sign up",
      submitting: "Creating account...",
      continuing: "Continuing...",
      haveAccount: "Already have an account? Log in",
      openSearch: "Open search",
      passwordLabel: "Password",
    },
    errors: {
      invalidCredentials: "Invalid email or password.",
      duplicateEmail: "An account already exists for this email.",
      backendUnavailable:
        "The backend is currently unreachable. Please check it and try again.",
      unavailable: "Authentication is temporarily unavailable. Please try again.",
      determineDestination:
        "The next product step could not be determined right now.",
      loginGeneric: "Unable to log in right now.",
      signupGeneric: "Unable to create the account right now.",
    },
  },
  search: {
    page: {
      eyebrow: "Assisted job discovery",
      title: "Find roles for your next move.",
      description:
        "Search vacancies, open strong matches in the assistant, and move straight into review.",
      openWorkspace: "Open assistant",
      resultsTitle: "Roles found",
      initialSummary:
        "Start with role and location.",
      activeSummary:
        "{count} roles from {source}. Choose one and open the next step in the assistant.",
      noMatches: "No matching roles were found for this search.",
      emptyState:
        "Search by role and location to load relevant vacancies.",
    },
    form: {
      keywordsLabel: "Keywords",
      keywordsPlaceholder: "Python developer",
      locationLabel: "Location",
      locationPlaceholder: "Berlin",
      submit: "Find roles",
      submitting: "Searching...",
      keywordsRequired: "Enter keywords to search for roles.",
      searchError: "Unable to search for roles right now.",
    },
    resultCard: {
      companyLocationFallback: "Company or location not provided",
      resolving: "Resolving...",
      analyze: "Review in assistant",
      openOriginal: "Open original",
      resolveError:
        "Unable to load this role for the assistant.",
      sourceBadge: "Jooble",
    },
  },
  workspace: {
    header: {
      eyebrow: "Assistant",
      title: "Review the role. Prepare the next move.",
      description:
        "This is where your assistant connects vacancy content and candidate context.",
      backendAt: "Backend expected at",
    },
    actions: {
      prepare: "Prepare with assistant",
      parsing: "Loading vacancy content...",
      preparing: "Preparing next steps...",
    },
    notices: {
      resolvedRestoreFailed:
        "Resolved vacancy content could not be restored. Please retry from search.",
      previewFallback:
        "Using search preview because the original page could not be fully fetched.",
      loadProfileFailed:
        "Unable to load the saved candidate context right now.",
      saveProfileFailed:
        "Unable to save the candidate context right now.",
      applicationFailed:
        "Something went wrong while preparing the next application step.",
      resolvedLoaded:
        "Vacancy content is already loaded. Add your context and start the review.",
      structuredOutput: "Structured output from the current assistant review.",
      resolvedResults:
        "Vacancy content is ready on the left. Review it and continue.",
      emptyResults:
        "This is where your assistant collects review, draft, and next steps.",
      submitToRender:
        "Submit the form to generate fit, draft, CV guidance, and checklist.",
    },
    results: {
      defaultTitle: "Results will appear here",
      parsedJobTitle: "Parsed vacancy",
      parsedJobDescription:
        "Readable text extracted before the preparation flow begins.",
      jobPostingTitle: "Vacancy profile",
      jobPostingDescription:
        "Structured vacancy payload used for the preparation flow.",
      sourceUrl: "Source URL",
      detectedSource: "Detected source",
      pageTitle: "Page title",
      rawText: "Raw text",
      extractionWarnings: "Extraction notes",
      employer: "Employer",
      location: "Location",
      employmentType: "Employment type",
      language: "Language",
      summary: "Summary",
      requirements: "Requirements",
      missingInformation: "Missing information",
    },
    jobInput: {
      title: "Vacancy context",
      description:
        "Provide a job URL or raw text. Your assistant uses the best available content.",
      rawTextNotice:
        "Raw text will be used directly. The URL is kept as optional source context.",
    },
    profile: {
      title: "Assistant memory",
      description:
        "Store the context your assistant should keep.",
      savedProfileTitle: "Saved context",
      savedProfileDescription:
        "Maintain it once. Reuse it later.",
      loadingProfile: "Loading saved context...",
      noSavedProfile:
        "No saved context yet. Your account name and email are prefilled to help you start.",
      loadedProfile: "Saved context loaded. Last updated {timestamp}.",
      savedProfile: "Context saved.",
      savedProfileAt: "Context saved at {timestamp}.",
    },
    progress: {
      title: "Assistant progress",
      steps: {
        parsing: "Understanding the vacancy",
        preparing: "Preparing next steps",
      },
      states: {
        skipped: "Skipped",
        running: "Running now",
        completed: "Completed",
        waiting: "Waiting",
      },
    },
    cards: {
      matchResult: {
        title: "Fit",
        description:
          "Your assistant's view of the role and your profile.",
        badge: "Fit",
        strengths: "Strengths",
        gaps: "Gaps",
        nextSteps: "Recommended next steps",
      },
      coverLetter: {
        title: "Cover letter draft",
        description:
          "Draft text built from the signals your assistant used.",
        keyPoints: "Key points used",
        warnings: "Notes",
      },
      cvTailoring: {
        title: "CV guidance",
        description:
          "Suggestions for aligning your CV more clearly to the role.",
        summary: "Tailored summary",
        highlightedSkills: "Highlighted skills",
        experiencePoints: "Suggested experience points",
        warnings: "Notes",
      },
      checklist: {
        title: "Next steps / notes",
        description:
          "Final actions and risks before the next move.",
        checklist: "Checklist",
        warnings: "Notes",
      },
    },
  },
  profile: {
    page: {
      title: "Assistant memory",
      description:
        "This is where you save what your assistant should know about you.",
      savedProfileTitle: "Saved context",
      savedProfileDescription:
        "This is your assistant's long-term memory.",
      loadError:
        "Unable to load your saved context right now.",
      saveError: "Unable to save your context right now.",
      basicProfileTitle: "Core details",
      basicProfileDescription:
        "Identity, contact details, and your application base.",
      careerTitle: "Career context",
      careerDescription:
        "Direction, preferences, and search signals for your assistant.",
      backgroundTitle: "Experience and background",
      backgroundDescription:
        "Reusable background for later review and preparation.",
    },
  },
  onboarding: {
    page: {
      loading: "Loading your onboarding...",
      unavailableTitle: "Onboarding is unavailable right now",
      unavailableDescription:
        "Your assistant setup could not be loaded right now. Please check the backend and try again.",
      tagline:
        "Guided onboarding for your personal job assistant.",
      completedStatus:
        "Your assistant is ready. You can revisit any step later.",
      savedStatus: "Progress saved.",
      finalReviewStatus:
        "Your saved context is ready for a final review.",
      helperDefault:
        "Moving forward saves this part of your context.",
      helperFinal:
        "This step completes setup and opens the next area.",
      loadError:
        "Unable to load your assistant progress right now.",
      stepChangeError:
        "Unable to save the step change right now.",
      saveError:
        "Unable to save your assistant progress right now.",
      targetRoleRequired:
        "Tell your assistant which role it should focus on first.",
      stepCounter: "Step {current} of {total}",
    },
    stages: [
      {
        title: "Introduction",
        eyebrow: "Meet your assistant",
        description:
          "See how your assistant will guide job search and applications.",
      },
      {
        title: "Career goal",
        eyebrow: "Direction",
        description:
          "Set what your assistant should focus on first.",
      },
      {
        title: "Basic profile",
        eyebrow: "Identity",
        description:
          "Add the core details your assistant needs.",
      },
      {
        title: "Experience & skills",
        eyebrow: "Background",
        description:
          "Show experience, skills, and languages at a glance.",
      },
      {
        title: "Job preferences",
        eyebrow: "Preferences",
        description:
          "Set locations, work mode, and salary direction.",
      },
      {
        title: "CV / background",
        eyebrow: "Context",
        description:
          "Save CV text and reusable background material.",
      },
      {
        title: "Confirmation",
        eyebrow: "Ready",
        description:
          "Review your saved context and continue.",
      },
    ],
    intro: {
      chip: "Personal Job Assistant",
      greeting: "Meet your personal job assistant",
      text:
        "I align to your goals, background, and preferences. From there, I guide search, vacancy review, and application work in Germany.",
      cards: [
        {
          title: "Keep context",
          description:
            "Save what you should not have to explain again.",
        },
        {
          title: "Search with direction",
          description:
            "Your goals shape search and evaluation later.",
        },
        {
          title: "Move clearly",
          description:
            "Go from a vacancy straight to the next step.",
        },
      ],
    },
    careerGoal: {
      targetHint:
        "Start with the role your assistant should pay attention to first.",
      locationsHint:
        "Comma-separated. Use German cities, regions, or Remote.",
    },
    jobPreferences: {
      locationsHint:
        "This is where you refine where your assistant should focus its search effort.",
      workModeLabel: "Work mode",
    },
    cv: {
      hint:
        "Raw text is enough to start. Upload support can come later.",
    },
    confirmation: {
      completedTitle: "Onboarding complete",
      readyTitle: "Ready to continue",
      description:
        "Your saved context is ready. Next, the assistant will {nextAction}.",
      groups: {
        direction: "Direction",
        profile: "Profile",
        background: "Background",
      },
      nextStepDescription:
        "After this, you can search, refine your profile, or open the assistant with a specific vacancy.",
    },
  },
  guard: {
    sessionUnavailableTitle: "Session check unavailable",
    sessionUnavailableDescription:
      "Unable to verify your session right now. Check that the backend is running and try again.",
    onboardingUnavailableTitle: "Onboarding check unavailable",
    onboardingUnavailableDescription:
      "Unable to verify onboarding progress right now. Please try again in a moment.",
    openLogin: "Open login",
    openOnboarding: "Open onboarding",
  },
};
