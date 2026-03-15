export const de = {
  common: {
    brandName: "Job Agent",
    marketLabel: "Deutschland",
    localeLabels: {
      de: "DE",
      en: "EN",
      ru: "RU",
      uk: "UK",
    },
    languageSwitcher: {
      label: "Sprache",
      ariaLabel: "Oberflächensprache auswählen",
    },
    navigation: {
      howItWorks: "So funktioniert es",
      features: "Funktionen",
      germany: "Deutschland",
      search: "Suche",
      workspace: "Assistent",
      profile: "Profil",
      onboarding: "Onboarding",
      product: "Produkt",
      workflow: "Ablauf",
    },
    actions: {
      logIn: "Anmelden",
      signUp: "Registrieren",
      logOut: "Abmelden",
      openSearch: "Suche öffnen",
      openWorkspace: "Assistent öffnen",
      openProfile: "Profil öffnen",
      saveProfile: "Profil speichern",
      save: "Speichern",
      next: "Weiter",
      back: "Zurück",
      retry: "Erneut versuchen",
      analyze: "Analysieren",
      openOriginal: "Original öffnen",
      reviewSetup: "Kontext ansehen",
      continueToWorkspace: "Zum Assistenten",
      openJobSearch: "Jobsuche öffnen",
    },
    states: {
      loading: "Lädt...",
      saving: "Speichert...",
      checkingSession: "Sitzung wird geprüft...",
      loggingOut: "Abmeldung läuft...",
      redirectingToLogin: "Weiterleitung zur Anmeldung...",
      checkingOnboarding: "Onboarding-Fortschritt wird geprüft...",
      sessionUnavailable: "Sitzung derzeit nicht verfügbar",
      onboardingUnavailable: "Onboarding derzeit nicht verfügbar",
      authUnavailable: "Authentifizierung derzeit nicht verfügbar",
      account: "Konto",
      unknown: "Unbekannt",
      unavailable: "Nicht verfügbar",
      notProvided: "Nicht angegeben",
      none: "Keine",
      noneHighlighted: "Keine hervorgehoben.",
      recently: "vor Kurzem",
    },
    fields: {
      fullName: "Vollständiger Name",
      email: "E-Mail",
      phone: "Telefon",
      location: "Aktueller Standort",
      targetRole: "Zielrolle",
      yearsOfExperience: "Berufserfahrung in Jahren",
      workAuthorization: "Arbeitserlaubnis",
      remotePreference: "Remote-Präferenz",
      salaryExpectation: "Gehaltsvorstellung",
      skills: "Fähigkeiten",
      languages: "Sprachen",
      preferredLocations: "Bevorzugte Standorte",
      professionalSummary: "Berufliches Profil",
      cvText: "CV-Text",
      jobUrl: "Job-URL",
      rawJobText: "Rohtext der Stelle",
    },
    placeholders: {
      fullName: "Max Mustermann",
      email: "name@example.com",
      phone: "+49 170 1234567",
      location: "Berlin",
      targetRole: "Python-Entwickler",
      yearsOfExperience: "4",
      workAuthorization: "EU-Bürger, Blue Card, Visum erforderlich",
      remotePreference: "Remote, Hybrid, Vor Ort",
      salaryExpectation: "EUR 75.000",
      skills: "Python, SQL, Docker",
      languages: "Deutsch C1, Englisch C1",
      preferredLocations: "Berlin, München, Remote",
      professionalSummary:
        "Kurze Einordnung zu Erfahrung, Stärken und Zielrichtung.",
      cvText: "Lebenslauf oder wiederverwendbaren Hintergrundtext einfügen.",
      jobUrl: "https://example.com/job-posting",
      rawJobText: "Sichtbaren Text der Stellenanzeige hier einfügen.",
      keywords: "Python Entwickler",
      searchLocation: "Berlin",
      password: "Passwort",
      newPassword: "Passwort erstellen",
    },
    hints: {
      skills: "Kommagetrennt. Beispiel: Python, SQL, Excel",
      languages: "Kommagetrennt. Beispiel: Deutsch C1, Englisch B2",
      preferredLocations:
        "Kommagetrennt. Beispiel: Berlin, Hamburg, Remote",
      csv: "Kommagetrennt.",
    },
  },
  validation: {
    emailRequired: "E-Mail ist erforderlich.",
    emailInvalid: "Gültige E-Mail-Adresse eingeben.",
    passwordRequired: "Passwort ist erforderlich.",
    passwordMin: "Das Passwort muss mindestens 8 Zeichen lang sein.",
    fullNameMin: "Der vollständige Name muss mindestens 2 Zeichen haben.",
    fullNameRequired: "Der vollständige Name ist erforderlich.",
    yearsInteger: "Für die Berufserfahrung bitte eine ganze Zahl verwenden.",
    jobUrlInvalid: "Gültige Job-URL eingeben.",
    jobInputRequired: "Bitte entweder eine Job-URL oder Rohtext eingeben.",
  },
  landing: {
    header: {
      checkingSession: "Sitzung wird geprüft...",
      authUnavailable: "Authentifizierung derzeit nicht verfügbar",
    },
    hero: {
      eyebrow: "Persönlicher Job-Assistent",
      title:
        "Für deinen nächsten Schritt in Deutschland.",
      description:
        "Job Agent behält deinen Kontext, prüft Stellen und begleitet dich vom Profil bis zur Bewerbung.",
      supporting:
        "Profil, Suche und Bewerbung in einem ruhigen Verlauf.",
      openWorkspace: "Assistent öffnen",
      previewEyebrow: "Im Einsatz",
      previewTitle:
        "Dein persönlicher Assistent behält den Faden.",
      previewPanels: [
        {
          label: "Kontext",
          title: "Dein Kontext",
          detail: "Rollen, Erfahrung und Präferenzen bleiben greifbar.",
        },
        {
          label: "Suche",
          title: "Passende Rollen",
          detail: "Finden, auswählen und direkt weitergeben.",
        },
        {
          label: "Schritt",
          title: "Nächster Schritt",
          detail: "Stelle prüfen und Bewerbung vorbereiten.",
        },
      ],
    },
    productPreview: {
      eyebrow: "Dein Weg",
      title:
        "Ein klarer Weg statt loser Einzelschritte.",
      description:
        "Job Agent verbindet dein Profil mit jeder Stelle, damit Entscheidungen und nächste Schritte zusammenbleiben.",
      blocks: [
        {
          step: "01",
          title: "Profil setzen",
          description: "Sag dem Assistenten, wonach du suchst.",
          route: "/workspace",
        },
        {
          step: "02",
          title: "Jobs auswählen",
          description: "Suche Rollen und übernimm interessante Treffer.",
          route: "/search",
        },
        {
          step: "03",
          title: "Stellen klären",
          description: "Verstehe Anforderungen, Signale und offene Punkte.",
          route: "/search/resolve-job",
        },
        {
          step: "04",
          title: "Bewerbung vorbereiten",
          description: "Gehe mit Entwurf, CV-Hinweisen und Checkliste weiter.",
          route: "/applications/prepare",
        },
      ],
    },
    howItWorks: {
      eyebrow: "So begleitet dich Job Agent",
      title:
        "Weniger Reibung im Bewerbungsprozess.",
      description:
        "Dein Assistent hält Profil, Stelle und nächste Schritte zusammen.",
      steps: [
        {
          title: "Profil und Ziel setzen",
          description: "So bekommt jede Suche sofort Richtung.",
        },
        {
          title: "Rolle auswählen",
          description: "Über Suche oder direkt per URL.",
        },
        {
          title: "Stelle mit Assistenz prüfen",
          description: "Anforderungen, Chancen und Lücken werden klarer.",
        },
        {
          title: "Nächsten Schritt vorbereiten",
          description:
            "Passung, Anschreiben, CV-Hinweise und Checkliste bleiben verbunden.",
        },
      ],
    },
    features: {
      eyebrow: "Was dein Assistent übernimmt",
      title: "Klarheit für Suche und Bewerbung.",
      description:
        "Konzentriert auf die Punkte, an denen Entscheidungen zählen.",
      items: [
        {
          title: "Gespeicherter Kontext",
          description: "Ein Kontext, den dein Assistent behält.",
        },
        {
          title: "Assistierte Jobsuche",
          description: "Passende Rollen schneller auswählen.",
        },
        {
          title: "Stellenprüfung",
          description: "Anzeigen in klare Signale übersetzen.",
        },
        {
          title: "Passung",
          description: "Stärken, Lücken und Richtung sichtbar machen.",
        },
        {
          title: "Anschreiben-Entwurf",
          description: "Ein erster Entwurf mit echtem Kontext.",
        },
        {
          title: "CV-Anpassung",
          description: "Den CV gezielt auf die Rolle ausrichten.",
        },
        {
          title: "Nächste Schritte",
          description: "Mit einer klaren Checkliste weitergehen.",
        },
      ],
    },
    germany: {
      eyebrow: "Deutschland im Fokus",
      title:
        "Für die Jobsuche in Deutschland gebaut.",
      description:
        "Von IT-Rollen bis Ausbildung: Job Agent orientiert sich an typischen Abläufen, Anforderungen und Erwartungen des Marktes.",
      items: [
        {
          title: "Deutschland zuerst",
          description:
            "Standorte, Arbeitsmodelle und Bewerbungslogik mit lokalem Fokus.",
        },
        {
          title: "IT & Ausbildung",
          description:
            "Geeignet für Fachrollen, Ausbildung und frühe Karrierewege.",
        },
        {
          title: "Klare Bewerbungslogik",
          description:
            "Aus Stelleninhalten werden konkrete nächste Schritte.",
        },
        {
          title: "Wiederverwendbarer Kontext",
          description:
            "Dein Profil bleibt für spätere Suche und Bewertung erhalten.",
        },
      ],
    },
    cta: {
      eyebrow: "Bereit",
      title:
        "Starte mit deinem persönlichen Job-Assistenten.",
      description:
        "Richte deinen Kontext einmal ein und gehe von dort in Suche, Stellenprüfung und Bewerbung weiter.",
    },
    footer: {
      description:
        "Persönlicher Job-Assistent für Jobsuche und Bewerbung in Deutschland.",
    },
  },
  auth: {
    backToHome: "Zurück zu Job Agent",
    login: {
      title: "Anmelden",
      description:
        "Weiter mit deinem persönlichen Job-Assistenten.",
      helper:
        "Wenn dein Onboarding noch offen ist, geht es danach dort weiter.",
      submit: "Anmelden",
      submitting: "Anmeldung läuft...",
      continuing: "Weiterleitung...",
      needAccount: "Noch kein Konto? Registrieren",
      openSearch: "Suche öffnen",
      passwordLabel: "Passwort",
    },
    signup: {
      title: "Registrieren",
      description:
        "Richte deinen persönlichen Job-Assistenten ein.",
      helper:
        "Nach der Registrierung startest du direkt im Onboarding.",
      submit: "Registrieren",
      submitting: "Konto wird erstellt...",
      continuing: "Weiterleitung...",
      haveAccount: "Bereits ein Konto? Anmelden",
      openSearch: "Suche öffnen",
      passwordLabel: "Passwort",
    },
    errors: {
      invalidCredentials: "Ungültige E-Mail oder ungültiges Passwort.",
      duplicateEmail: "Für diese E-Mail existiert bereits ein Konto.",
      backendUnavailable:
        "Das Backend ist derzeit nicht erreichbar. Bitte prüfen und erneut versuchen.",
      unavailable:
        "Authentifizierung ist derzeit nicht verfügbar. Bitte später erneut versuchen.",
      determineDestination:
        "Der nächste Produktschritt konnte gerade nicht bestimmt werden.",
      loginGeneric: "Anmeldung ist derzeit nicht möglich.",
      signupGeneric: "Das Konto konnte derzeit nicht erstellt werden.",
    },
  },
  search: {
    page: {
      eyebrow: "Assistierte Jobsuche",
      title: "Finde Rollen für deinen nächsten Schritt.",
      description:
        "Suche Stellen, öffne relevante Treffer im Assistenten und gehe direkt in die Bewertung.",
      openWorkspace: "Assistent öffnen",
      resultsTitle: "Gefundene Rollen",
      initialSummary:
        "Starte mit Rolle und Ort.",
      activeSummary:
        "{count} Treffer von {source}. Wähle eine Rolle und öffne den nächsten Schritt im Assistenten.",
      noMatches: "Für diese Suche wurden keine passenden Rollen gefunden.",
      emptyState:
        "Suche nach Rolle und Ort, um passende Stellen zu laden.",
    },
    form: {
      keywordsLabel: "Stichwörter",
      keywordsPlaceholder: "Python Entwickler",
      locationLabel: "Standort",
      locationPlaceholder: "Berlin",
      submit: "Stellen finden",
      submitting: "Suche läuft...",
      keywordsRequired: "Bitte Stichwörter eingeben, um nach Jobs zu suchen.",
      searchError: "Jobsuche ist derzeit nicht möglich.",
    },
    resultCard: {
      companyLocationFallback: "Unternehmen oder Standort nicht angegeben",
      resolving: "Wird aufgelöst...",
      analyze: "Im Assistenten prüfen",
      openOriginal: "Original öffnen",
      resolveError:
        "Die Stelle konnte nicht für den Assistenten geladen werden.",
      sourceBadge: "Jooble",
    },
  },
  workspace: {
    header: {
      eyebrow: "Assistent",
      title: "Stelle prüfen. Nächsten Schritt vorbereiten.",
      description:
        "Hier verbindet dein Assistent Stelleninhalt und Kandidatenkontext.",
      backendAt: "Backend erwartet unter",
    },
    actions: {
      prepare: "Mit Assistent vorbereiten",
      parsing: "Stelleninhalt wird geladen...",
      preparing: "Nächste Schritte werden vorbereitet...",
    },
    notices: {
      resolvedRestoreFailed:
        "Der aufgelöste Job-Inhalt konnte nicht wiederhergestellt werden. Bitte den Vorgang aus der Suche erneut starten.",
      previewFallback:
        "Es wird die Suchvorschau verwendet, weil die Originalseite nicht vollständig geladen werden konnte.",
      loadProfileFailed:
        "Der gespeicherte Kandidatenkontext konnte derzeit nicht geladen werden.",
      saveProfileFailed:
        "Der Kandidatenkontext konnte derzeit nicht gespeichert werden.",
      applicationFailed:
        "Beim Vorbereiten der nächsten Bewerbungsschritte ist etwas schiefgelaufen.",
      resolvedLoaded:
        "Der Stelleninhalt ist schon geladen. Ergänze deinen Kontext und starte die Prüfung.",
      structuredOutput: "Strukturierte Ausgabe der aktuellen Assistenzprüfung.",
      resolvedResults:
        "Der Stelleninhalt liegt links bereit. Prüfe ihn und gehe dann weiter.",
      emptyResults:
        "Hier sammelt dein Assistent Bewertung, Entwurf und nächste Schritte.",
      submitToRender:
        "Sende das Formular ab, um Passung, Anschreiben, CV-Hinweise und Checkliste zu erzeugen.",
    },
    results: {
      defaultTitle: "Ergebnisse erscheinen hier",
      parsedJobTitle: "Geparster Job",
      parsedJobDescription:
        "Lesbarer Text, der vor dem Bewerbungspaket-Aufruf aus der Jobseite extrahiert wurde.",
      jobPostingTitle: "Stellenprofil",
      jobPostingDescription:
        "Strukturierte Job-Nutzlast, die zum Erzeugen des Pakets verwendet wurde.",
      sourceUrl: "Quell-URL",
      detectedSource: "Erkannte Quelle",
      pageTitle: "Seitentitel",
      rawText: "Rohtext",
      extractionWarnings: "Extraktionshinweise",
      employer: "Arbeitgeber",
      location: "Standort",
      employmentType: "Beschäftigungsart",
      language: "Sprache",
      summary: "Zusammenfassung",
      requirements: "Anforderungen",
      missingInformation: "Fehlende Informationen",
    },
    jobInput: {
      title: "Stellenkontext",
      description:
        "Gib eine Stellen-URL oder Rohtext ein. Dein Assistent nutzt den besten verfügbaren Inhalt.",
      rawTextNotice:
        "Der Rohtext wird direkt verwendet. Die URL bleibt als optionaler Quellenhinweis erhalten.",
    },
    profile: {
      title: "Gespeicherter Kontext",
      description:
        "Hier speicherst du den Kontext, den dein Assistent behalten soll.",
      savedProfileTitle: "Gespeicherter Kontext",
      savedProfileDescription:
        "Einmal pflegen. Später wiederverwenden.",
      loadingProfile: "Gespeicherter Kontext wird geladen...",
      noSavedProfile:
        "Es ist noch kein gespeicherter Kontext vorhanden. Kontoname und E-Mail sind zur Unterstützung vorausgefüllt.",
      loadedProfile:
        "Gespeicherter Kontext geladen. Zuletzt aktualisiert: {timestamp}.",
      savedProfile: "Kontext gespeichert.",
      savedProfileAt: "Kontext gespeichert um {timestamp}.",
    },
    progress: {
      title: "Assistenz-Fortschritt",
      steps: {
        parsing: "Stelle verstehen",
        preparing: "Nächste Schritte vorbereiten",
      },
      states: {
        skipped: "Übersprungen",
        running: "Läuft gerade",
        completed: "Abgeschlossen",
        waiting: "Wartet",
      },
    },
    cards: {
      matchResult: {
        title: "Passung",
        description:
          "Einschätzung deines Assistenten zur Rolle und zu deinem Profil.",
        badge: "Passung",
        strengths: "Stärken",
        gaps: "Lücken",
        nextSteps: "Empfohlene nächste Schritte",
      },
      coverLetter: {
        title: "Anschreiben-Entwurf",
        description:
          "Entwurf mit den Signalen, die dein Assistent genutzt hat.",
        keyPoints: "Verwendete Kernpunkte",
        warnings: "Hinweise",
      },
      cvTailoring: {
        title: "CV-Hinweise",
        description:
          "Hinweise, wie dein CV klarer zur Rolle passen kann.",
        summary: "Angepasste Zusammenfassung",
        highlightedSkills: "Hervorgehobene Fähigkeiten",
        experiencePoints: "Vorgeschlagene Erfahrungspunkte",
        warnings: "Hinweise",
      },
      checklist: {
        title: "Nächste Schritte / Hinweise",
        description:
          "Letzte Aufgaben und Risiken vor dem nächsten Schritt.",
        checklist: "Checkliste",
        warnings: "Hinweise",
      },
    },
  },
  profile: {
    page: {
      title: "Gespeicherter Kontext",
      description:
        "Hier speicherst du, was dein Assistent über dich wissen soll.",
      savedProfileTitle: "Gespeicherter Kontext",
      savedProfileDescription:
        "Das ist die dauerhafte Erinnerung deines Assistenten.",
      loadError:
        "Dein gespeicherter Kontext konnte derzeit nicht geladen werden.",
      saveError: "Dein Kontext konnte derzeit nicht gespeichert werden.",
      basicProfileTitle: "Basisdaten",
      basicProfileDescription:
        "Identität, Kontaktdaten und Bewerbungsbasis.",
      careerTitle: "Karrierekontext",
      careerDescription:
        "Richtung, Präferenzen und Suchsignale für deinen Assistenten.",
      backgroundTitle: "Erfahrung und Hintergrund",
      backgroundDescription:
        "Wiederverwendbarer Hintergrund für spätere Prüfung und Bewerbung.",
    },
  },
  onboarding: {
    page: {
      loading: "Onboarding wird geladen...",
      unavailableTitle: "Onboarding ist derzeit nicht verfügbar",
      unavailableDescription:
        "Dein Onboarding konnte derzeit nicht geladen werden. Bitte Backend prüfen und erneut versuchen.",
      tagline:
        "Onboarding für deinen persönlichen Job-Assistenten.",
      completedStatus:
        "Dein Assistent ist bereit. Du kannst jeden Schritt später anpassen.",
      savedStatus: "Fortschritt gespeichert.",
      finalReviewStatus:
        "Dein gespeicherter Kontext ist bereit für die letzte Prüfung.",
      helperDefault:
        "Beim Weitergehen speicherst du diesen Teil deines Kontexts.",
      helperFinal:
        "Mit diesem Schritt schließt du das Onboarding ab und öffnest den nächsten Bereich.",
      loadError:
        "Der Fortschritt deines Assistenten konnte derzeit nicht geladen werden.",
      stepChangeError:
        "Der Schrittwechsel konnte derzeit nicht gespeichert werden.",
      saveError:
        "Der Fortschritt deines Assistenten konnte derzeit nicht gespeichert werden.",
      targetRoleRequired:
        "Sag deinem Assistenten zuerst, auf welche Rolle er achten soll.",
      stepCounter: "Schritt {current} von {total}",
    },
    stages: [
      {
        title: "Einführung",
        eyebrow: "Assistent kennenlernen",
        description:
          "Lerne, wie dein Assistent dich durch Jobsuche und Bewerbung begleitet.",
      },
      {
        title: "Karriereziel",
        eyebrow: "Richtung",
        description:
          "Lege fest, worauf sich dein Assistent zuerst ausrichten soll.",
      },
      {
        title: "Basisprofil",
        eyebrow: "Identität",
        description:
          "Gib deinem Assistenten die wichtigsten Basisdaten.",
      },
      {
        title: "Erfahrung & Fähigkeiten",
        eyebrow: "Hintergrund",
        description:
          "Zeig Erfahrung, Fähigkeiten und Sprachen auf einen Blick.",
      },
      {
        title: "Job-Präferenzen",
        eyebrow: "Präferenzen",
        description:
          "Lege Orte, Arbeitsmodell und Gehaltsrahmen fest.",
      },
      {
        title: "CV / Hintergrund",
        eyebrow: "Kontext",
        description:
          "Hinterlege CV-Text und Material für spätere Bewerbungen.",
      },
      {
        title: "Bestätigung",
        eyebrow: "Bereit",
        description:
          "Prüfe den gespeicherten Kontext und gehe weiter.",
      },
    ],
    intro: {
      chip: "Persönlicher Job-Assistent",
      greeting: "Lerne deinen persönlichen Job-Assistenten kennen",
      text:
        "Ich richte mich auf deine Ziele, deinen Hintergrund und deine Präferenzen aus. Danach begleite ich Suche, Stellenprüfung und Bewerbung in Deutschland.",
      cards: [
        {
          title: "Kontext behalten",
          description:
            "Halte fest, was du nicht jedes Mal neu erklären willst.",
        },
        {
          title: "Mit Richtung suchen",
          description:
            "Deine Ziele geben später Suche und Bewertung Richtung.",
        },
        {
          title: "Klar weitergehen",
          description:
            "Gehe von der Stelle direkt zu den nächsten Schritten.",
        },
      ],
    },
    careerGoal: {
      targetHint:
        "Beginne mit der Rolle, auf die dein Assistent zuerst achten soll.",
      locationsHint:
        "Kommagetrennt. Nutze deutsche Städte, Regionen oder Remote.",
    },
    jobPreferences: {
      locationsHint:
        "Hier verfeinerst du, wo dein Assistent bei der Suche besonders aufmerksam sein soll.",
      workModeLabel: "Arbeitsmodell",
    },
    cv: {
      hint:
        "Für den Anfang reicht Rohtext. Datei-Uploads können später ergänzt werden.",
    },
    confirmation: {
      completedTitle: "Onboarding abgeschlossen",
      readyTitle: "Bereit zum Weitergehen",
      description:
        "Dein gespeicherter Kontext ist bereit. Als Nächstes wird {nextAction}.",
      groups: {
        direction: "Richtung",
        profile: "Profil",
        background: "Hintergrund",
      },
      nextStepDescription:
        "Danach kannst du suchen, dein Profil pflegen oder mit einer konkreten Vakanz in den Assistenten gehen.",
    },
  },
  guard: {
    sessionUnavailableTitle: "Sitzungsprüfung derzeit nicht verfügbar",
    sessionUnavailableDescription:
      "Die Sitzung konnte gerade nicht geprüft werden. Bitte sicherstellen, dass das Backend läuft, und erneut versuchen.",
    onboardingUnavailableTitle:
      "Prüfung des Onboarding-Fortschritts nicht verfügbar",
    onboardingUnavailableDescription:
      "Der Onboarding-Fortschritt konnte gerade nicht geprüft werden. Bitte in Kürze erneut versuchen.",
    openLogin: "Anmeldung öffnen",
    openOnboarding: "Onboarding öffnen",
  },
} as const;

export type Messages = typeof de;
