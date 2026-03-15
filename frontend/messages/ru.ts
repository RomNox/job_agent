import type { DeepPartialMessages } from "@/lib/i18n";

import type { Messages } from "./de";

export const ru: DeepPartialMessages<Messages> = {
  common: {
    marketLabel: "Германия",
    languageSwitcher: {
      label: "Язык",
      ariaLabel: "Выбрать язык интерфейса",
    },
    navigation: {
      howItWorks: "Как это работает",
      features: "Возможности",
      germany: "Германия",
      search: "Поиск",
      workspace: "Ассистент",
      profile: "Профиль",
      onboarding: "Онбординг",
      product: "Продукт",
      workflow: "Путь",
    },
    actions: {
      logIn: "Войти",
      signUp: "Регистрация",
      logOut: "Выйти",
      openSearch: "Открыть поиск",
      openWorkspace: "Открыть ассистента",
      openProfile: "Открыть профиль",
      saveProfile: "Сохранить профиль",
      save: "Сохранить",
      next: "Далее",
      back: "Назад",
      retry: "Повторить",
      analyze: "Анализировать",
      openOriginal: "Открыть оригинал",
      reviewSetup: "Проверить контекст",
      continueToWorkspace: "Перейти к ассистенту",
      openJobSearch: "Открыть поиск вакансий",
    },
    states: {
      loading: "Загрузка...",
      saving: "Сохранение...",
      checkingSession: "Проверка сессии...",
      loggingOut: "Выход...",
      redirectingToLogin: "Переход ко входу...",
      checkingOnboarding: "Проверка прогресса онбординга...",
      sessionUnavailable: "Сессия недоступна",
      onboardingUnavailable: "Онбординг недоступен",
      authUnavailable: "Аутентификация недоступна",
      account: "Аккаунт",
      unknown: "Неизвестно",
      unavailable: "Недоступно",
      notProvided: "Не указано",
      none: "Нет",
      noneHighlighted: "Ничего не выделено.",
      recently: "недавно",
    },
    fields: {
      fullName: "Полное имя",
      email: "Email",
      phone: "Телефон",
      location: "Текущая локация",
      targetRole: "Целевая роль",
      yearsOfExperience: "Опыт работы, лет",
      workAuthorization: "Разрешение на работу",
      remotePreference: "Предпочтение по формату работы",
      salaryExpectation: "Ожидаемая зарплата",
      skills: "Навыки",
      languages: "Языки",
      preferredLocations: "Предпочтительные локации",
      professionalSummary: "Профессиональное резюме",
      cvText: "Текст CV",
      jobUrl: "URL вакансии",
      rawJobText: "Текст вакансии",
    },
    placeholders: {
      targetRole: "Python Developer",
      workAuthorization: "Гражданин ЕС, Blue Card, нужна виза",
      remotePreference: "Удалённо, гибрид, офис",
      salaryExpectation: "75 000 EUR",
      skills: "Python, SQL, Docker",
      languages: "Немецкий C1, английский C1",
      preferredLocations: "Берлин, Мюнхен, Remote",
      professionalSummary:
        "Коротко опишите опыт, сильные стороны и карьерное направление.",
      cvText: "Вставьте текст CV или контекст, который можно использовать повторно.",
      keywords: "Python developer",
      searchLocation: "Берлин",
      password: "Пароль",
      newPassword: "Создать пароль",
    },
    hints: {
      skills: "Через запятую. Пример: Python, SQL, Excel",
      languages: "Через запятую. Пример: Немецкий C1, Английский B2",
      preferredLocations: "Через запятую. Пример: Berlin, Hamburg, Remote",
      csv: "Через запятую.",
    },
  },
  validation: {
    emailRequired: "Email обязателен.",
    emailInvalid: "Введите корректный email.",
    passwordRequired: "Пароль обязателен.",
    passwordMin: "Пароль должен содержать минимум 8 символов.",
    fullNameMin: "Полное имя должно содержать минимум 2 символа.",
    fullNameRequired: "Полное имя обязательно.",
    yearsInteger: "Укажите целое число лет опыта.",
    jobUrlInvalid: "Введите корректный URL вакансии.",
    jobInputRequired: "Укажите либо URL вакансии, либо текст вакансии.",
  },
  landing: {
    header: {
      checkingSession: "Проверка сессии...",
      authUnavailable: "Аутентификация недоступна",
    },
    hero: {
      eyebrow: "Персональный помощник по поиску работы",
      title:
        "Для следующего шага в Германии.",
      description:
        "Job Agent сохраняет ваш контекст, разбирает вакансии и ведет вас от профиля к отклику.",
      supporting: "Профиль, поиск, разбор и отклик в одном спокойном потоке.",
      openWorkspace: "Открыть ассистента",
      previewEyebrow: "В работе",
      previewTitle:
        "Ваш помощник держит нить процесса.",
      previewPanels: [
        {
          label: "Контекст",
          title: "Ваш контекст",
          detail: "Роли, опыт и предпочтения остаются под рукой.",
        },
        {
          label: "Поиск",
          title: "Подходящие роли",
          detail: "Найти, выбрать и сразу передать дальше.",
        },
        {
          label: "Шаг",
          title: "Следующий шаг",
          detail: "Разобрать вакансию и подготовить отклик.",
        },
      ],
    },
    productPreview: {
      eyebrow: "Ваш путь",
      title:
        "Четкий путь вместо разрозненных шагов.",
      description:
        "Job Agent связывает ваш профиль с каждой вакансией, чтобы решения и следующие шаги не распадались.",
      blocks: [
        {
          step: "01",
          title: "Задайте профиль",
          description: "Покажите ассистенту, что для вас важно.",
          route: "/workspace",
        },
        {
          step: "02",
          title: "Выберите роли",
          description: "Ищите и сразу забирайте сильные варианты.",
          route: "/search",
        },
        {
          step: "03",
          title: "Проясните вакансию",
          description: "Поймите требования, сигналы и открытые вопросы.",
          route: "/search/resolve-job",
        },
        {
          step: "04",
          title: "Подготовьте отклик",
          description: "Продолжайте с письмом, CV и чеклистом.",
          route: "/applications/prepare",
        },
      ],
    },
    howItWorks: {
      eyebrow: "Как Job Agent ведет вас",
      title:
        "Меньше трения в процессе отклика.",
      description:
        "Ассистент удерживает вместе профиль, вакансию и следующий шаг.",
      steps: [
        {
          title: "Задайте профиль и направление",
          description: "Поиск сразу получает нужный фокус.",
        },
        {
          title: "Выберите роль",
          description: "Из поиска или сразу по ссылке.",
        },
        {
          title: "Разберите с ассистентом",
          description: "Требования, пробелы и сигналы становятся яснее.",
        },
        {
          title: "Подготовьте следующий шаг",
          description:
            "Оценка, письмо, CV и чеклист остаются связаны.",
        },
      ],
    },
    features: {
      eyebrow: "Что берет на себя ассистент",
      title: "Ясность для поиска и отклика.",
      description:
        "Фокус на моментах, где особенно важны решения.",
      items: [
        {
          title: "Память ассистента",
          description: "Один слой контекста, который ассистент помнит.",
        },
        {
          title: "Поиск с поддержкой",
          description: "Быстрее выбирать сильные роли.",
        },
        {
          title: "Разбор вакансии",
          description: "Превращать описание в понятные сигналы.",
        },
        {
          title: "Соответствие",
          description: "Показывать сильные стороны, пробелы и направление.",
        },
        {
          title: "Черновик письма",
          description: "Первый черновик с реальным контекстом.",
        },
        {
          title: "Подсказки по CV",
          description: "Точнее подстроить CV под роль.",
        },
        {
          title: "Следующие шаги",
          description: "Двигаться дальше с ясным чеклистом.",
        },
      ],
    },
    germany: {
      eyebrow: "Фокус на Германии",
      title:
        "Сделано для рынка труда Германии.",
      description:
        "От IT-ролей до Ausbildung: Job Agent учитывает ритм и ожидания локального рынка.",
      items: [
        {
          title: "Германия в центре",
          description:
            "Локации, форматы работы и логика отклика учитывают местный контекст.",
        },
        {
          title: "IT и Ausbildung",
          description:
            "Полезно для профессиональных ролей, Ausbildung и раннего этапа карьеры.",
        },
        {
          title: "Понятная логика отклика",
          description:
            "Превращать контент вакансии в понятные следующие действия.",
        },
        {
          title: "Повторно используемый контекст",
          description:
            "Ваш профиль остается готовым для следующего поиска и разбора.",
        },
      ],
    },
    cta: {
      eyebrow: "Готовы",
      title:
        "Начните с персонального помощника по поиску работы.",
      description:
        "Один раз задайте контекст и дальше двигайтесь от поиска к разбору и отклику.",
    },
    footer: {
      description:
        "Персональный помощник по поиску работы в Германии.",
    },
  },
  auth: {
    backToHome: "Назад к Job Agent",
    login: {
      title: "Войти",
      description:
        "Продолжайте работу со своим помощником по поиску работы.",
      helper:
        "Если настройка еще не завершена, дальше откроется онбординг.",
      submit: "Войти",
      submitting: "Вход...",
      continuing: "Продолжаем...",
      needAccount: "Нет аккаунта? Зарегистрироваться",
      openSearch: "Открыть поиск",
      passwordLabel: "Пароль",
    },
    signup: {
      title: "Регистрация",
      description:
        "Настройте своего помощника по поиску работы.",
      helper:
        "Новые аккаунты сразу начинают с онбординга.",
      submit: "Зарегистрироваться",
      submitting: "Создание аккаунта...",
      continuing: "Продолжаем...",
      haveAccount: "Уже есть аккаунт? Войти",
      openSearch: "Открыть поиск",
      passwordLabel: "Пароль",
    },
    errors: {
      invalidCredentials: "Неверный email или пароль.",
      duplicateEmail: "Для этого email уже существует аккаунт.",
      backendUnavailable:
        "Бэкенд сейчас недоступен. Проверьте его и попробуйте ещё раз.",
      unavailable: "Аутентификация временно недоступна. Попробуйте позже.",
      determineDestination:
        "Сейчас не удалось определить следующий шаг в продукте.",
      loginGeneric: "Сейчас не удалось выполнить вход.",
      signupGeneric: "Сейчас не удалось создать аккаунт.",
    },
  },
  search: {
    page: {
      eyebrow: "Поиск с поддержкой ассистента",
      title: "Найдите роли для следующего шага.",
      description:
        "Ищите вакансии, открывайте сильные варианты в ассистенте и сразу переходите к разбору.",
      openWorkspace: "Открыть ассистента",
      resultsTitle: "Найденные роли",
      initialSummary:
        "Начните с роли и локации.",
      activeSummary:
        "{count} вакансий из {source}. Выберите одну и откройте следующий шаг в ассистенте.",
      noMatches: "По этому запросу подходящих ролей не найдено.",
      emptyState:
        "Ищите по роли и локации, чтобы загрузить подходящие вакансии.",
    },
    form: {
      keywordsLabel: "Ключевые слова",
      keywordsPlaceholder: "Python developer",
      locationLabel: "Локация",
      locationPlaceholder: "Берлин",
      submit: "Найти роли",
      submitting: "Поиск...",
      keywordsRequired: "Введите ключевые слова для поиска ролей.",
      searchError: "Сейчас не удалось выполнить поиск ролей.",
    },
    resultCard: {
      companyLocationFallback: "Компания или локация не указаны",
      resolving: "Получаем контент...",
      analyze: "Проверить в ассистенте",
      openOriginal: "Открыть оригинал",
      resolveError:
        "Не удалось загрузить эту роль для ассистента.",
      sourceBadge: "Jooble",
    },
  },
  workspace: {
    header: {
      eyebrow: "Ассистент",
      title: "Разберите роль. Подготовьте следующий шаг.",
      description:
        "Здесь ассистент соединяет контент вакансии и ваш кандидатский контекст.",
      backendAt: "Бэкенд ожидается по адресу",
    },
    actions: {
      prepare: "Подготовить с ассистентом",
      parsing: "Загружается контент вакансии...",
      preparing: "Готовятся следующие шаги...",
    },
    notices: {
      resolvedRestoreFailed:
        "Не удалось восстановить полученный контент вакансии. Повторите действие из поиска.",
      previewFallback:
        "Используется превью из поиска, потому что оригинальную страницу не удалось полностью получить.",
      loadProfileFailed:
        "Сейчас не удалось загрузить сохранённый контекст кандидата.",
      saveProfileFailed:
        "Сейчас не удалось сохранить контекст кандидата.",
      applicationFailed:
        "Что-то пошло не так при подготовке следующего шага по отклику.",
      resolvedLoaded:
        "Контент вакансии уже загружен. Добавьте свой контекст и начните разбор.",
      structuredOutput: "Структурированный результат текущего разбора ассистентом.",
      resolvedResults:
        "Контент вакансии уже готов слева. Проверьте его и продолжайте.",
      emptyResults:
        "Здесь ассистент собирает разбор, черновик и следующие шаги.",
      submitToRender:
        "Отправьте форму, чтобы получить соответствие, письмо, CV и чеклист.",
    },
    results: {
      defaultTitle: "Здесь появятся результаты",
      parsedJobTitle: "Разобранная вакансия",
      parsedJobDescription:
        "Читаемый текст, полученный до начала подготовки.",
      jobPostingTitle: "Профиль вакансии",
      jobPostingDescription:
        "Структурированное представление вакансии для следующего этапа.",
      sourceUrl: "Источник URL",
      detectedSource: "Определённый источник",
      pageTitle: "Заголовок страницы",
      rawText: "Текст",
      extractionWarnings: "Замечания по извлечению",
      employer: "Работодатель",
      location: "Локация",
      employmentType: "Тип занятости",
      language: "Язык",
      summary: "Резюме",
      requirements: "Требования",
      missingInformation: "Недостающая информация",
    },
    jobInput: {
      title: "Контекст вакансии",
      description:
        "Укажите URL вакансии или текст. Ассистент использует лучший доступный контент.",
      rawTextNotice:
        "Текст вакансии будет использован напрямую. URL остаётся как дополнительный источник.",
    },
    profile: {
      title: "Память ассистента",
      description:
        "Сохраняйте контекст, который ассистент должен помнить.",
      savedProfileTitle: "Сохранённый контекст",
      savedProfileDescription:
        "Настройте один раз. Используйте дальше.",
      loadingProfile: "Загрузка сохранённого контекста...",
      noSavedProfile:
        "Сохранённого контекста пока нет. Имя аккаунта и email подставлены для удобного старта.",
      loadedProfile: "Сохранённый контекст загружен. Последнее обновление: {timestamp}.",
      savedProfile: "Контекст сохранён.",
      savedProfileAt: "Контекст сохранён в {timestamp}.",
    },
    progress: {
      title: "Прогресс ассистента",
      steps: {
        parsing: "Понять вакансию",
        preparing: "Подготовить следующий шаг",
      },
      states: {
        skipped: "Пропущено",
        running: "Выполняется",
        completed: "Завершено",
        waiting: "Ожидание",
      },
    },
    cards: {
      matchResult: {
        title: "Соответствие",
        description:
          "Взгляд ассистента на роль и ваш профиль.",
        badge: "Соответствие",
        strengths: "Сильные стороны",
        gaps: "Пробелы",
        nextSteps: "Рекомендуемые следующие шаги",
      },
      coverLetter: {
        title: "Черновик письма",
        description:
          "Черновик на основе сигналов, которые использовал ассистент.",
        keyPoints: "Использованные опорные пункты",
        warnings: "Замечания",
      },
      cvTailoring: {
        title: "Подсказки по CV",
        description:
          "Как точнее подстроить CV под выбранную роль.",
        summary: "Адаптированное резюме",
        highlightedSkills: "Выделенные навыки",
        experiencePoints: "Предлагаемые акценты по опыту",
        warnings: "Замечания",
      },
      checklist: {
        title: "Следующие шаги / замечания",
        description:
          "Финальные действия и риски перед следующим шагом.",
        checklist: "Чеклист",
        warnings: "Замечания",
      },
    },
  },
  profile: {
    page: {
      title: "Память ассистента",
      description:
        "Здесь хранится то, что ассистент должен знать о вас.",
      savedProfileTitle: "Сохранённый контекст",
      savedProfileDescription:
        "Это долгосрочная память вашего ассистента.",
      loadError:
        "Сейчас не удалось загрузить сохранённый контекст.",
      saveError: "Сейчас не удалось сохранить ваш контекст.",
      basicProfileTitle: "Основные данные",
      basicProfileDescription:
        "Идентичность, контакты и база для отклика.",
      careerTitle: "Карьерный контекст",
      careerDescription:
        "Направление, предпочтения и сигналы поиска для ассистента.",
      backgroundTitle: "Опыт и бэкграунд",
      backgroundDescription:
        "Контекст, который можно использовать позже снова.",
    },
  },
  onboarding: {
    page: {
      loading: "Загрузка пошаговой настройки...",
      unavailableTitle: "Онбординг сейчас недоступен",
      unavailableDescription:
        "Сейчас не удалось загрузить настройку ассистента. Проверьте бэкенд и попробуйте ещё раз.",
      tagline:
        "Пошаговая настройка персонального помощника по поиску работы.",
      completedStatus:
        "Ассистент готов. К любому шагу можно вернуться позже.",
      savedStatus: "Прогресс сохранён.",
      finalReviewStatus:
        "Сохранённый контекст готов к финальной проверке.",
      helperDefault:
        "Переход дальше сохраняет эту часть контекста.",
      helperFinal:
        "Этот шаг завершает настройку и открывает следующий раздел.",
      loadError:
        "Сейчас не удалось загрузить прогресс ассистента.",
      stepChangeError:
        "Сейчас не удалось сохранить переход между шагами.",
      saveError:
        "Сейчас не удалось сохранить прогресс ассистента.",
      targetRoleRequired:
        "Сначала подскажите ассистенту, на какую роль ему ориентироваться.",
      stepCounter: "Шаг {current} из {total}",
    },
    stages: [
      {
        title: "Введение",
        eyebrow: "Знакомство с ассистентом",
        description:
          "Посмотрите, как ассистент будет вести вас через поиск и отклики.",
      },
      {
        title: "Карьерная цель",
        eyebrow: "Направление",
        description:
          "Задайте, на чем ассистенту сфокусироваться сначала.",
      },
      {
        title: "Базовый профиль",
        eyebrow: "Основа",
        description:
          "Добавьте основные данные, нужные ассистенту.",
      },
      {
        title: "Опыт и навыки",
        eyebrow: "Фон",
        description:
          "Покажите опыт, навыки и языки в ясном виде.",
      },
      {
        title: "Предпочтения по работе",
        eyebrow: "Предпочтения",
        description:
          "Задайте локации, формат работы и уровень зарплаты.",
      },
      {
        title: "CV / бэкграунд",
        eyebrow: "Контекст",
        description:
          "Сохраните текст CV и материалы для следующих шагов.",
      },
      {
        title: "Подтверждение",
        eyebrow: "Готово",
        description:
          "Проверьте сохранённый контекст и идите дальше.",
      },
    ],
    intro: {
      chip: "Персональный помощник по поиску работы",
      greeting: "Познакомьтесь со своим помощником по поиску работы",
      text:
        "Я настроюсь на ваши цели, опыт и предпочтения. После этого смогу сопровождать поиск, разбор вакансий и отклик в Германии.",
      cards: [
        {
          title: "Сохранить контекст",
          description:
            "Сохраните то, что не хочется повторять каждый раз.",
        },
        {
          title: "Искать с направлением",
          description:
            "Ваши цели позже повлияют на поиск и оценку.",
        },
        {
          title: "Двигаться яснее",
          description:
            "Переходите от вакансии сразу к следующему шагу.",
        },
      ],
    },
    careerGoal: {
      targetHint:
        "Начните с роли, на которую ассистент должен смотреть в первую очередь.",
      locationsHint:
        "Через запятую. Используйте города Германии, регионы или Remote.",
    },
    jobPreferences: {
      locationsHint:
        "Здесь вы уточняете, где ассистенту стоит особенно внимательно искать вакансии.",
      workModeLabel: "Формат работы",
    },
    cv: {
      hint:
        "Для начала достаточно обычного текста. Загрузку файлов можно добавить позже.",
    },
    confirmation: {
      completedTitle: "Онбординг завершён",
      readyTitle: "Готово продолжать",
      description:
        "Сохранённый контекст готов. Следующим шагом будет {nextAction}.",
      groups: {
        direction: "Направление",
        profile: "Профиль",
        background: "Фон",
      },
      nextStepDescription:
        "После этого можно открыть поиск, уточнить профиль или перейти к ассистенту с конкретной вакансией.",
    },
  },
  guard: {
    sessionUnavailableTitle: "Проверка сессии недоступна",
    sessionUnavailableDescription:
      "Сейчас не удалось проверить сессию. Убедитесь, что бэкенд работает, и попробуйте ещё раз.",
    onboardingUnavailableTitle: "Проверка онбординга недоступна",
    onboardingUnavailableDescription:
      "Сейчас не удалось проверить прогресс онбординга. Попробуйте ещё раз чуть позже.",
    openLogin: "Открыть вход",
    openOnboarding: "Открыть онбординг",
  },
};
