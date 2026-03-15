import type { DeepPartialMessages } from "@/lib/i18n";

import type { Messages } from "./de";

export const uk: DeepPartialMessages<Messages> = {
  common: {
    marketLabel: "Німеччина",
    languageSwitcher: {
      label: "Мова",
      ariaLabel: "Вибрати мову інтерфейсу",
    },
    navigation: {
      howItWorks: "Як це працює",
      features: "Можливості",
      germany: "Німеччина",
      search: "Пошук",
      workspace: "Асистент",
      profile: "Профіль",
      onboarding: "Онбординг",
      product: "Продукт",
      workflow: "Шлях",
    },
    actions: {
      logIn: "Увійти",
      signUp: "Реєстрація",
      logOut: "Вийти",
      openSearch: "Відкрити пошук",
      openWorkspace: "Відкрити асистента",
      openProfile: "Відкрити профіль",
      saveProfile: "Зберегти профіль",
      save: "Зберегти",
      next: "Далі",
      back: "Назад",
      retry: "Спробувати ще раз",
      analyze: "Аналізувати",
      openOriginal: "Відкрити оригінал",
      reviewSetup: "Перевірити контекст",
      continueToWorkspace: "Перейти до асистента",
      openJobSearch: "Відкрити пошук вакансій",
    },
    states: {
      loading: "Завантаження...",
      saving: "Збереження...",
      checkingSession: "Перевірка сесії...",
      loggingOut: "Вихід...",
      redirectingToLogin: "Перенаправлення на вхід...",
      checkingOnboarding: "Перевірка прогресу онбордингу...",
      sessionUnavailable: "Сесія недоступна",
      onboardingUnavailable: "Онбординг недоступний",
      authUnavailable: "Автентифікація недоступна",
      account: "Акаунт",
      unknown: "Невідомо",
      unavailable: "Недоступно",
      notProvided: "Не вказано",
      none: "Немає",
      noneHighlighted: "Нічого не виділено.",
      recently: "щойно",
    },
    fields: {
      fullName: "Повне ім'я",
      email: "Email",
      phone: "Телефон",
      location: "Поточна локація",
      targetRole: "Цільова роль",
      yearsOfExperience: "Досвід роботи, років",
      workAuthorization: "Дозвіл на роботу",
      remotePreference: "Перевага щодо формату роботи",
      salaryExpectation: "Очікувана зарплата",
      skills: "Навички",
      languages: "Мови",
      preferredLocations: "Бажані локації",
      professionalSummary: "Професійний опис",
      cvText: "Текст CV",
      jobUrl: "URL вакансії",
      rawJobText: "Текст вакансії",
    },
    placeholders: {
      targetRole: "Python Developer",
      workAuthorization: "Громадянин ЄС, Blue Card, потрібна віза",
      remotePreference: "Віддалено, гібрид, офіс",
      salaryExpectation: "75 000 EUR",
      skills: "Python, SQL, Docker",
      languages: "Німецька C1, англійська C1",
      preferredLocations: "Берлін, Мюнхен, Remote",
      professionalSummary:
        "Коротко опишіть досвід, сильні сторони та кар'єрний напрям.",
      cvText: "Вставте текст CV або контекст, який можна використовувати повторно.",
      keywords: "Python developer",
      searchLocation: "Берлін",
      password: "Пароль",
      newPassword: "Створити пароль",
    },
    hints: {
      skills: "Через кому. Приклад: Python, SQL, Excel",
      languages: "Через кому. Приклад: Німецька C1, Англійська B2",
      preferredLocations: "Через кому. Приклад: Berlin, Hamburg, Remote",
      csv: "Через кому.",
    },
  },
  validation: {
    emailRequired: "Email обов'язковий.",
    emailInvalid: "Введіть коректний email.",
    passwordRequired: "Пароль обов'язковий.",
    passwordMin: "Пароль має містити щонайменше 8 символів.",
    fullNameMin: "Повне ім'я має містити щонайменше 2 символи.",
    fullNameRequired: "Повне ім'я обов'язкове.",
    yearsInteger: "Вкажіть ціле число років досвіду.",
    jobUrlInvalid: "Введіть коректний URL вакансії.",
    jobInputRequired: "Вкажіть або URL вакансії, або текст вакансії.",
  },
  landing: {
    header: {
      checkingSession: "Перевірка сесії...",
      authUnavailable: "Автентифікація недоступна",
    },
    hero: {
      eyebrow: "Персональний помічник з пошуку роботи",
      title:
        "Для наступного кроку в Німеччині.",
      description:
        "Job Agent зберігає ваш контекст, розбирає вакансії та веде вас від профілю до відгуку.",
      supporting: "Профіль, пошук, розбір і відгук в одному спокійному потоці.",
      openWorkspace: "Відкрити асистента",
      previewEyebrow: "У роботі",
      previewTitle:
        "Ваш помічник тримає нитку процесу.",
      previewPanels: [
        {
          label: "Контекст",
          title: "Ваш контекст",
          detail: "Ролі, досвід і переваги залишаються під рукою.",
        },
        {
          label: "Пошук",
          title: "Потрібні ролі",
          detail: "Знайти, обрати й одразу передати далі.",
        },
        {
          label: "Крок",
          title: "Наступний крок",
          detail: "Розібрати вакансію і підготувати відгук.",
        },
      ],
    },
    productPreview: {
      eyebrow: "Ваш шлях",
      title:
        "Чіткий шлях замість розрізнених кроків.",
      description:
        "Job Agent поєднує ваш профіль з кожною вакансією, щоб рішення і наступні кроки не розпадалися.",
      blocks: [
        {
          step: "01",
          title: "Задайте профіль",
          description: "Покажіть асистенту, що для вас важливо.",
          route: "/workspace",
        },
        {
          step: "02",
          title: "Оберіть ролі",
          description: "Шукайте й одразу забирайте сильні варіанти.",
          route: "/search",
        },
        {
          step: "03",
          title: "Проясніть вакансію",
          description: "Побачте вимоги, сигнали й відкриті питання.",
          route: "/search/resolve-job",
        },
        {
          step: "04",
          title: "Підготуйте відгук",
          description: "Продовжуйте з листом, CV і чеклистом.",
          route: "/applications/prepare",
        },
      ],
    },
    howItWorks: {
      eyebrow: "Як Job Agent веде вас",
      title:
        "Менше тертя в процесі відгуку.",
      description:
        "Асистент утримує разом профіль, вакансію і наступний крок.",
      steps: [
        {
          title: "Задайте профіль і напрям",
          description: "Пошук одразу отримує потрібний фокус.",
        },
        {
          title: "Оберіть роль",
          description: "Із пошуку або одразу за посиланням.",
        },
        {
          title: "Розберіть з асистентом",
          description: "Вимоги, прогалини й сигнали стають яснішими.",
        },
        {
          title: "Підготуйте наступний крок",
          description:
            "Оцінка, лист, CV і чеклист залишаються пов'язаними.",
        },
      ],
    },
    features: {
      eyebrow: "Що бере на себе асистент",
      title: "Ясність для пошуку й відгуку.",
      description:
        "Фокус на моментах, де рішення мають найбільше значення.",
      items: [
        {
          title: "Пам'ять асистента",
          description: "Один шар контексту, який асистент пам'ятає.",
        },
        {
          title: "Пошук із підтримкою",
          description: "Швидше обирати сильні ролі.",
        },
        {
          title: "Розбір вакансії",
          description: "Перетворювати опис на зрозумілі сигнали.",
        },
        {
          title: "Відповідність",
          description: "Показувати сильні сторони, прогалини й напрям.",
        },
        {
          title: "Чернетка листа",
          description: "Перший чернетковий текст з реальним контекстом.",
        },
        {
          title: "Підказки щодо CV",
          description: "Точніше підлаштувати CV під роль.",
        },
        {
          title: "Наступні кроки",
          description: "Рухатися далі з ясним чеклистом.",
        },
      ],
    },
    germany: {
      eyebrow: "Фокус на Німеччині",
      title:
        "Створено для ринку праці Німеччини.",
      description:
        "Від IT-ролей до Ausbildung: Job Agent враховує ритм і очікування локального ринку.",
      items: [
        {
          title: "Німеччина в центрі",
          description:
            "Локації, формати роботи й логіка відгуку враховують місцевий контекст.",
        },
        {
          title: "IT і Ausbildung",
          description:
            "Корисно для професійних ролей, Ausbildung і раннього етапу кар'єри.",
        },
        {
          title: "Зрозуміла логіка відгуку",
          description:
            "Перетворювати контент вакансії на зрозумілі наступні дії.",
        },
        {
          title: "Повторно використовуваний контекст",
          description:
            "Ваш профіль лишається готовим для наступного пошуку й розбору.",
        },
      ],
    },
    cta: {
      eyebrow: "Готові",
      title:
        "Почніть з персонального помічника з пошуку роботи.",
      description:
        "Один раз задайте контекст і далі переходьте від пошуку до розбору та відгуку.",
    },
    footer: {
      description:
        "Персональний помічник з пошуку роботи в Німеччині.",
    },
  },
  auth: {
    backToHome: "Назад до Job Agent",
    login: {
      title: "Увійти",
      description:
        "Продовжуйте роботу зі своїм помічником з пошуку роботи.",
      helper:
        "Якщо налаштування ще не завершене, далі відкриється онбординг.",
      submit: "Увійти",
      submitting: "Вхід...",
      continuing: "Продовжуємо...",
      needAccount: "Ще немає акаунта? Зареєструватися",
      openSearch: "Відкрити пошук",
      passwordLabel: "Пароль",
    },
    signup: {
      title: "Реєстрація",
      description:
        "Налаштуйте свого помічника з пошуку роботи.",
      helper:
        "Нові акаунти одразу починають з онбордингу.",
      submit: "Зареєструватися",
      submitting: "Створення акаунта...",
      continuing: "Продовжуємо...",
      haveAccount: "Вже є акаунт? Увійти",
      openSearch: "Відкрити пошук",
      passwordLabel: "Пароль",
    },
    errors: {
      invalidCredentials: "Невірний email або пароль.",
      duplicateEmail: "Для цього email уже існує акаунт.",
      backendUnavailable:
        "Бекенд зараз недоступний. Перевірте його і спробуйте ще раз.",
      unavailable: "Автентифікація тимчасово недоступна. Спробуйте пізніше.",
      determineDestination:
        "Зараз не вдалося визначити наступний крок у продукті.",
      loginGeneric: "Зараз не вдалося виконати вхід.",
      signupGeneric: "Зараз не вдалося створити акаунт.",
    },
  },
  search: {
    page: {
      eyebrow: "Пошук із підтримкою асистента",
      title: "Знайдіть ролі для наступного кроку.",
      description:
        "Шукайте вакансії, відкривайте сильні варіанти в асистенті й одразу переходьте до розбору.",
      openWorkspace: "Відкрити асистента",
      resultsTitle: "Знайдені ролі",
      initialSummary:
        "Почніть з ролі й локації.",
      activeSummary:
        "{count} вакансій із {source}. Оберіть одну і відкрийте наступний крок в асистенті.",
      noMatches: "За цим запитом відповідних ролей не знайдено.",
      emptyState:
        "Шукайте за роллю й локацією, щоб завантажити відповідні вакансії.",
    },
    form: {
      keywordsLabel: "Ключові слова",
      keywordsPlaceholder: "Python developer",
      locationLabel: "Локація",
      locationPlaceholder: "Берлін",
      submit: "Знайти ролі",
      submitting: "Пошук...",
      keywordsRequired: "Введіть ключові слова для пошуку ролей.",
      searchError: "Зараз не вдалося виконати пошук ролей.",
    },
    resultCard: {
      companyLocationFallback: "Компанія або локація не вказані",
      resolving: "Отримуємо контент...",
      analyze: "Перевірити в асистенті",
      openOriginal: "Відкрити оригінал",
      resolveError:
        "Не вдалося завантажити цю роль для асистента.",
      sourceBadge: "Jooble",
    },
  },
  workspace: {
    header: {
      eyebrow: "Асистент",
      title: "Розберіть роль. Підготуйте наступний крок.",
      description:
        "Тут асистент поєднує контент вакансії та ваш кандидатський контекст.",
      backendAt: "Бекенд очікується за адресою",
    },
    actions: {
      prepare: "Підготувати з асистентом",
      parsing: "Завантажується контент вакансії...",
      preparing: "Готуються наступні кроки...",
    },
    notices: {
      resolvedRestoreFailed:
        "Не вдалося відновити отриманий контент вакансії. Повторіть дію з пошуку.",
      previewFallback:
        "Використовується прев'ю з пошуку, бо оригінальну сторінку не вдалося повністю отримати.",
      loadProfileFailed:
        "Зараз не вдалося завантажити збережений контекст кандидата.",
      saveProfileFailed:
        "Зараз не вдалося зберегти контекст кандидата.",
      applicationFailed:
        "Щось пішло не так під час підготовки наступного кроку за відгуком.",
      resolvedLoaded:
        "Контент вакансії вже завантажено. Додайте свій контекст і почніть розбір.",
      structuredOutput: "Структурований результат поточного розбору асистентом.",
      resolvedResults:
        "Контент вакансії вже готовий ліворуч. Перевірте його і продовжуйте.",
      emptyResults:
        "Тут асистент збирає розбір, чернетку і наступні кроки.",
      submitToRender:
        "Надішліть форму, щоб отримати відповідність, лист, CV і чеклист.",
    },
    results: {
      defaultTitle: "Тут з'являться результати",
      parsedJobTitle: "Розібрана вакансія",
      parsedJobDescription:
        "Читабельний текст, отриманий до початку підготовки.",
      jobPostingTitle: "Профіль вакансії",
      jobPostingDescription:
        "Структуроване представлення вакансії для наступного етапу.",
      sourceUrl: "Джерело URL",
      detectedSource: "Визначене джерело",
      pageTitle: "Заголовок сторінки",
      rawText: "Текст",
      extractionWarnings: "Зауваження щодо отримання",
      employer: "Роботодавець",
      location: "Локація",
      employmentType: "Тип зайнятості",
      language: "Мова",
      summary: "Резюме",
      requirements: "Вимоги",
      missingInformation: "Відсутня інформація",
    },
    jobInput: {
      title: "Контекст вакансії",
      description:
        "Вкажіть URL вакансії або текст. Асистент використає найкращий доступний контент.",
      rawTextNotice:
        "Текст вакансії буде використано напряму. URL зберігається як додаткове джерело.",
    },
    profile: {
      title: "Пам'ять асистента",
      description:
        "Зберігайте контекст, який асистент має пам'ятати.",
      savedProfileTitle: "Збережений контекст",
      savedProfileDescription:
        "Налаштуйте один раз. Використовуйте далі.",
      loadingProfile: "Завантаження збереженого контексту...",
      noSavedProfile:
        "Збереженого контексту поки немає. Ім'я акаунта та email підставлені для зручного старту.",
      loadedProfile: "Збережений контекст завантажено. Останнє оновлення: {timestamp}.",
      savedProfile: "Контекст збережено.",
      savedProfileAt: "Контекст збережено о {timestamp}.",
    },
    progress: {
      title: "Прогрес асистента",
      steps: {
        parsing: "Зрозуміти вакансію",
        preparing: "Підготувати наступний крок",
      },
      states: {
        skipped: "Пропущено",
        running: "Виконується",
        completed: "Завершено",
        waiting: "Очікування",
      },
    },
    cards: {
      matchResult: {
        title: "Відповідність",
        description:
          "Погляд асистента на роль і ваш профіль.",
        badge: "Відповідність",
        strengths: "Сильні сторони",
        gaps: "Прогалини",
        nextSteps: "Рекомендовані наступні кроки",
      },
      coverLetter: {
        title: "Чернетка листа",
        description:
          "Чернетка на основі сигналів, які використав асистент.",
        keyPoints: "Використані опорні пункти",
        warnings: "Зауваження",
      },
      cvTailoring: {
        title: "Підказки щодо CV",
        description:
          "Як точніше підлаштувати CV під вибрану роль.",
        summary: "Адаптоване резюме",
        highlightedSkills: "Виділені навички",
        experiencePoints: "Запропоновані акценти по досвіду",
        warnings: "Зауваження",
      },
      checklist: {
        title: "Наступні кроки / зауваження",
        description:
          "Фінальні дії та ризики перед наступним кроком.",
        checklist: "Чеклист",
        warnings: "Зауваження",
      },
    },
  },
  profile: {
    page: {
      title: "Пам'ять асистента",
      description:
        "Тут зберігається те, що асистент має знати про вас.",
      savedProfileTitle: "Збережений контекст",
      savedProfileDescription:
        "Це довготривала пам'ять вашого асистента.",
      loadError:
        "Зараз не вдалося завантажити збережений контекст.",
      saveError: "Зараз не вдалося зберегти ваш контекст.",
      basicProfileTitle: "Основні дані",
      basicProfileDescription:
        "Ідентичність, контакти та база для відгуку.",
      careerTitle: "Кар'єрний контекст",
      careerDescription:
        "Напрям, переваги та сигнали пошуку для асистента.",
      backgroundTitle: "Досвід і бекграунд",
      backgroundDescription:
        "Контекст, який можна використати пізніше знову.",
    },
  },
  onboarding: {
    page: {
      loading: "Завантаження покрокового налаштування...",
      unavailableTitle: "Онбординг зараз недоступний",
      unavailableDescription:
        "Зараз не вдалося завантажити налаштування асистента. Перевірте бекенд і спробуйте ще раз.",
      tagline:
        "Покрокове налаштування персонального помічника з пошуку роботи.",
      completedStatus:
        "Асистент готовий. До будь-якого кроку можна повернутися пізніше.",
      savedStatus: "Прогрес збережено.",
      finalReviewStatus:
        "Збережений контекст готовий до фінальної перевірки.",
      helperDefault:
        "Перехід далі зберігає цю частину контексту.",
      helperFinal:
        "Цей крок завершує налаштування і відкриває наступний розділ.",
      loadError:
        "Зараз не вдалося завантажити прогрес асистента.",
      stepChangeError:
        "Зараз не вдалося зберегти перехід між кроками.",
      saveError:
        "Зараз не вдалося зберегти прогрес асистента.",
      targetRoleRequired:
        "Спочатку підкажіть асистенту, на яку роль йому орієнтуватися.",
      stepCounter: "Крок {current} із {total}",
    },
    stages: [
      {
        title: "Вступ",
        eyebrow: "Знайомство з асистентом",
        description:
          "Подивіться, як асистент проведе вас через пошук і відгуки.",
      },
      {
        title: "Кар'єрна ціль",
        eyebrow: "Напрям",
        description:
          "Задайте, на чому асистенту сфокусуватися спочатку.",
      },
      {
        title: "Базовий профіль",
        eyebrow: "Основа",
        description:
          "Додайте основні дані, потрібні асистенту.",
      },
      {
        title: "Досвід і навички",
        eyebrow: "Фон",
        description:
          "Покажіть досвід, навички й мови в ясному вигляді.",
      },
      {
        title: "Переваги щодо роботи",
        eyebrow: "Переваги",
        description:
          "Задайте локації, формат роботи й рівень зарплати.",
      },
      {
        title: "CV / бекграунд",
        eyebrow: "Контекст",
        description:
          "Збережіть текст CV і матеріали для наступних кроків.",
      },
      {
        title: "Підтвердження",
        eyebrow: "Готово",
        description:
          "Перевірте збережений контекст і рухайтеся далі.",
      },
    ],
    intro: {
      chip: "Персональний помічник з пошуку роботи",
      greeting: "Познайомтеся зі своїм помічником з пошуку роботи",
      text:
        "Я налаштуюся на ваші цілі, досвід і переваги. Після цього зможу супроводжувати пошук, розбір вакансій і відгук у Німеччині.",
      cards: [
        {
          title: "Зберегти контекст",
          description:
            "Збережіть те, що не хочеться повторювати щоразу.",
        },
        {
          title: "Шукати з напрямом",
          description:
            "Ваші цілі згодом впливатимуть на пошук і оцінку.",
        },
        {
          title: "Рухатися ясніше",
          description:
            "Переходьте від вакансії одразу до наступного кроку.",
        },
      ],
    },
    careerGoal: {
      targetHint:
        "Почніть із ролі, на яку асистент має дивитися насамперед.",
      locationsHint:
        "Через кому. Використовуйте міста Німеччини, регіони або Remote.",
    },
    jobPreferences: {
      locationsHint:
        "Тут ви уточнюєте, де асистенту варто особливо уважно шукати вакансії.",
      workModeLabel: "Формат роботи",
    },
    cv: {
      hint:
        "Для початку достатньо звичайного тексту. Підтримку завантаження файлів можна додати пізніше.",
    },
    confirmation: {
      completedTitle: "Онбординг завершено",
      readyTitle: "Готово продовжувати",
      description:
        "Збережений контекст готовий. Наступним кроком буде {nextAction}.",
      groups: {
        direction: "Напрям",
        profile: "Профіль",
        background: "Фон",
      },
      nextStepDescription:
        "Після цього можна відкрити пошук, уточнити профіль або перейти до асистента з конкретною вакансією.",
    },
  },
  guard: {
    sessionUnavailableTitle: "Перевірка сесії недоступна",
    sessionUnavailableDescription:
      "Зараз не вдалося перевірити сесію. Переконайтеся, що бекенд працює, і спробуйте ще раз.",
    onboardingUnavailableTitle: "Перевірка онбордингу недоступна",
    onboardingUnavailableDescription:
      "Зараз не вдалося перевірити прогрес онбордингу. Спробуйте ще раз трохи пізніше.",
    openLogin: "Відкрити вхід",
    openOnboarding: "Відкрити онбординг",
  },
};
