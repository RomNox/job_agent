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
      eyebrow: "Personal Job Assistant",
      title:
        "For your next step in Germany.",
      description:
        "Job Agent keeps your context, reviews vacancies, and guides you from profile to application.",
      supporting: "Profile, search, review, and application in one calm flow.",
      openWorkspace: "Open assistant",
      previewEyebrow: "In motion",
      previewTitle:
        "Your personal assistant keeps the thread.",
      previewPanels: [
        {
          label: "Memory",
          title: "Your context",
          detail: "Roles, experience, and preferences stay in reach.",
        },
        {
          label: "Search",
          title: "Relevant roles",
          detail: "Find them, choose them, move them forward.",
        },
        {
          label: "Assist",
          title: "Next move",
          detail: "Review the role. Prepare the application.",
        },
      ],
    },
    productPreview: {
      eyebrow: "Your path",
      title:
        "A clear path instead of disconnected steps.",
      description:
        "Job Agent keeps your profile connected to each vacancy so decisions and next steps stay together.",
      blocks: [
        {
          step: "01",
          title: "Set your profile",
          description: "Tell the assistant what you are aiming for.",
          route: "/workspace",
        },
        {
          step: "02",
          title: "Choose roles",
          description: "Search and move strong matches forward.",
          route: "/search",
        },
        {
          step: "03",
          title: "Clarify the vacancy",
          description: "See the requirements, signals, and open points.",
          route: "/search/resolve-job",
        },
        {
          step: "04",
          title: "Prepare the application",
          description: "Continue with draft, CV guidance, and checklist.",
          route: "/applications/prepare",
        },
      ],
    },
    howItWorks: {
      eyebrow: "How Job Agent guides you",
      title:
        "Less friction in the application process.",
      description:
        "Your assistant keeps profile, vacancy, and next steps together.",
      steps: [
        {
          title: "Set profile and direction",
          description: "Every search starts with sharper focus.",
        },
        {
          title: "Choose a role",
          description: "Start from search or from a direct URL.",
        },
        {
          title: "Review with assistance",
          description: "Requirements, gaps, and signals become clearer.",
        },
        {
          title: "Prepare the next move",
          description: "Fit, letter, CV guidance, and checklist stay connected.",
        },
      ],
    },
    features: {
      eyebrow: "What your assistant handles",
      title: "Clarity for search and applications.",
      description:
        "Focused on the moments where decisions matter most.",
      items: [
        {
          title: "Assistant memory",
          description: "One context layer your assistant keeps.",
        },
        {
          title: "Assisted job search",
          description: "Choose stronger roles faster.",
        },
        {
          title: "Vacancy review",
          description: "Turn job posts into clear signals.",
        },
        {
          title: "Fit",
          description: "See strengths, gaps, and direction.",
        },
        {
          title: "Cover letter draft",
          description: "A first draft with real context behind it.",
        },
        {
          title: "CV guidance",
          description: "Align your CV more clearly to the role.",
        },
        {
          title: "Next steps",
          description: "Move forward with a clear checklist.",
        },
      ],
    },
    germany: {
      eyebrow: "Germany in focus",
      title:
        "Built for the job market in Germany.",
      description:
        "From IT roles to Ausbildung, Job Agent follows the rhythms and expectations of the local market.",
      items: [
        {
          title: "Germany first",
          description:
            "Locations, work modes, and application logic stay locally grounded.",
        },
        {
          title: "IT and Ausbildung",
          description:
            "Useful for specialist roles, Ausbildung, and early-career paths.",
        },
        {
          title: "Clear application logic",
          description:
            "Turn vacancy content into practical next moves.",
        },
        {
          title: "Reusable context",
          description:
            "Your profile stays ready for later search and review.",
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
