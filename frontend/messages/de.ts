export const de = {
  common: {
    brandName: "Job Agent",
    marketLabel: "Germany",
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
      pricing: "Tarife",
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
      openJobAgent: "Job Agent öffnen",
      openDemo: "Demo öffnen",
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
      eyebrow: "Job Agent",
      title:
        "Persönlicher Assistent für die Jobsuche in Deutschland",
      description:
        "Job Agent arbeitet mit Stellenanzeigen so, wie Karriereberater es tun: passende Rollen finden, Anforderungen des Arbeitgebers analysieren, den Lebenslauf anpassen, Bewerbungsunterlagen vorbereiten und dich durch den Prozess begleiten, damit du die Stelle bekommst, die du wirklich willst und danach auf dem Arbeitsmarkt gefragt bleibst und deine Karriere erfolgreich weiterentwickelst.",
      supporting:
        "Profil, Suche und Bewerbung in einem ruhigen Verlauf.",
      process: "Profil → Suche → Analyse → Bewerbung",
      termsPrefix: "Mehr zu Nutzung und Rahmenbedingungen in den",
      openWorkspace: "Assistent öffnen",
      previewEyebrow: "Job Agent",
      previewTitle:
        "So hilft dein persönlicher Berater:",
      previewPanels: [
        {
          label: "Stellen",
          title: "Passende Stellen finden",
          detail:
            "Wählt relevante Stellen aus und schlägt Optionen vor, die zu deiner Erfahrung und deinen Karrierezielen passen.",
        },
        {
          label: "Unterlagen",
          title: "Unterlagen vorbereiten",
          detail:
            "Wir helfen dabei, Lebenslauf und Anschreiben für eine Bewerbung vorzubereiten.",
        },
        {
          label: "Interview",
          title: "Durch das Interview gehen",
          detail:
            "Wir helfen bei der Vorbereitung auf das Vorstellungsgespräch und dabei, den nächsten Schritt im Bewerbungsprozess sicher zu gehen.",
        },
        {
          label: "Kompetenzen",
          title: "Am Arbeitsmarkt relevant bleiben",
          detail:
            "Wir helfen dabei, Profil und berufliche Kompetenzen aktuell zu halten.",
        },
      ],
    },
    productPreview: {
      eyebrow: "Job Agent",
      title:
        "Wir zeigen den Weg zu deinem neuen Job",
      description:
        "Job Agent hilft dir, jede Phase der Jobsuche Schritt für Schritt zu durchlaufen – von der Auswahl passender Stellen bis zum Angebot.",
      blocks: [
        {
          step: "01",
          title: "Registriere dich",
          description:
            "Beantworte ein paar Fragen, damit Job Agent versteht, welche Arbeit du suchst.",
          route: "/workspace",
        },
        {
          step: "02",
          title: "Folge den Schritten",
          description:
            "Job Agent schlägt passende Stellen vor, hilft bei der Vorbereitung der Unterlagen und zeigt, wie du den gewünschten Job bekommst.",
          route: "/search",
        },
        {
          step: "03",
          title: "Erhalte den Job",
          description:
            "Job Agent hilft dir, dich auf das Interview vorzubereiten, es zu durchlaufen und ein Jobangebot zu erhalten.",
          route: "/search/resolve-job",
        },
        {
          step: "04",
          title: "Entwickle deine Karriere weiter",
          description:
            "Job Agent hilft dir, dich auf das Interview vorzubereiten, es erfolgreich zu bestehen und den gewünschten Job zu bekommen.",
          route: "/applications/prepare",
        },
      ],
    },
    howItWorks: {
      eyebrow: "Dein Karriere-Assistent",
      title:
        "Wie Job Agent dir hilft",
      description:
        "Job Agent organisiert deinen gesamten Bewerbungsprozess persönlich: passende Stellen finden, Unterlagen vorbereiten und den nächsten Schritt zeigen, damit du dich auf das Ergebnis konzentrieren kannst.",
      steps: [
        {
          title: "Passende Stellen finden",
          description:
            "Job Agent findet relevante Stellen und schlägt Optionen vor, die zu deiner Erfahrung und deinen Karrierezielen passen.",
        },
        {
          title: "Unterlagen anpassen",
          description:
            "Lebenslauf und Anschreiben werden für jede Stelle unter Berücksichtigung deiner Erfahrung und der Anforderungen des Arbeitgebers angepasst.",
        },
        {
          title: "Auf Interviews vorbereiten",
          description:
            "Wenn eine Stelle das Interesse des Arbeitgebers weckt, hilft dir Job Agent bei der Vorbereitung auf den nächsten Schritt und dabei, den Bewerbungsprozess sicher zu durchlaufen.",
        },
        {
          title: "Bewerbungen kontrollieren",
          description:
            "Alle versendeten Bewerbungen werden an einem Ort gespeichert, damit du den Prozess verfolgen und keine Chance verpassen kannst.",
        },
      ],
    },
    features: {
      eyebrow: "Tools von Job Agent",
      title: "Intelligente Werkzeuge für die Jobsuche",
      description:
        "Job Agent vereint Stellenanalyse, Personalisierung von Unterlagen und Bewerbungsmanagement in einem Arbeitsbereich und hilft dir, schneller und präziser zu entscheiden.",
      items: [
        {
          title: "Stellenanalyse",
          description:
            "Extrahiert automatisch die wichtigsten Anforderungen, Fähigkeiten und Erwartungen des Arbeitgebers.",
        },
        {
          title: "Match Score",
          description:
            "Zeigt, wie gut eine Stelle zu deinem Profil passt und wo Lücken bestehen.",
        },
        {
          title: "Gap Analysis",
          description:
            "Ermittelt Fähigkeiten und Anforderungen, die für diese Rolle noch fehlen.",
        },
        {
          title: "Unterlagen vorbereiten",
          description:
            "Passt Lebenslauf und Anschreiben an eine konkrete Stelle an.",
        },
        {
          title: "Bewerbungs-Checkliste",
          description:
            "Erstellt eine Liste dessen, was vor dem Absenden vorbereitet werden sollte.",
        },
        {
          title: "Bewerbungstracker",
          description:
            "Verfolgt alle eingereichten Bewerbungen und die Prozessschritte.",
        },
        {
          title: "Plan für die nächsten Schritte",
          description:
            "Zeigt, welche Handlungen deine Chancen auf den Job erhöhen können.",
        },
        {
          title: "Interviewvorbereitung",
          description:
            "Hilft bei der Vorbereitung auf Fragen und Erwartungen des Arbeitgebers.",
        },
        {
          title: "Career Strategy",
          description:
            "Hilft zu verstehen, welche Fähigkeiten du entwickeln und welche Stellen besser zu dir passen.",
        },
      ],
    },
    germany: {
      eyebrow: "Job Agent",
      title:
        "Für den deutschen Arbeitsmarkt gemacht",
      description:
        "Job Agent wählt Stellen von deutschen Plattformen aus und berücksichtigt die Besonderheiten des lokalen Arbeitsmarkts. Der Service analysiert die Anforderungen der Arbeitgeber, hilft bei der Vorbereitung der Unterlagen im richtigen Format und zeigt eine Bewerbungsstrategie, die auf dem deutschen Markt üblich ist. So kannst du dich auf die Jobsuche konzentrieren und in jeder Phase des Bewerbungsprozesses sicherer handeln.",
      items: [
        {
          title: "Stellen von deutschen Plattformen",
          description:
            "Job Agent wählt Stellen von beliebten deutschen Job-Plattformen und Aggregatoren aus.",
        },
        {
          title: "Besonderheiten des deutschen Arbeitsmarkts",
          description:
            "Stellenanalyse und Empfehlungen berücksichtigen die Erwartungen der Arbeitgeber und die Einstellungspraxis in Deutschland.",
        },
        {
          title: "Reguläre Stellen und Ausbildung",
          description:
            "Geeignet sowohl für berufliche Positionen als auch für die Suche nach Ausbildung und den Karrierestart.",
        },
        {
          title: "Die richtige Bewerbungslogik",
          description:
            "Job Agent hilft dabei, eine Bewerbung so vorzubereiten, wie Arbeitgeber es auf dem deutschen Markt erwarten.",
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
  pricing: {
    page: {
      eyebrow: "Tarife",
      title: "Wähle den passenden Plan für deine Jobsuche mit AI-Unterstützung.",
      description:
        "Alle Pläne enthalten das Kandidatenprofil, Jobsuche und Workspace. Der Unterschied liegt in der Tiefe der AI-Unterstützung und in der Anzahl der Stellenanalysen pro Monat.",
      periods: [
        { key: "threeMonths", label: "3 Monate" },
        { key: "sixMonths", label: "6 Monate" },
        { key: "twelveMonths", label: "12 Monate" },
      ],
      recommended: "Empfohlen",
      mostPopular: "Am beliebtesten",
      priceCaption: "für {period}",
      planCta: "Plan wählen",
      plans: [
        {
          name: "Starter",
          description: "Für die erste Phase der Jobsuche.",
          analysisLimit: "20 Stellenanalysen / Monat",
          recommended: false,
          features: [
            "AI-Stellenanalyse",
            "Kandidatenprofil",
            "Jobsuche",
            "Basis-Workspace",
          ],
          prices: {
            threeMonths: "39 €",
            sixMonths: "69 €",
            twelveMonths: "119 €",
          },
        },
        {
          name: "Pro",
          description: "Ideal für aktive Jobsuchende.",
          analysisLimit: "50 Stellenanalysen / Monat",
          recommended: true,
          features: [
            "AI-Stellenanalyse",
            "CV-Anpassung",
            "Anschreiben generieren",
            "Gespeicherte Jobs",
            "Erweiterter Workspace",
          ],
          prices: {
            threeMonths: "99 €",
            sixMonths: "179 €",
            twelveMonths: "329 €",
          },
        },
        {
          name: "Agent",
          description: "Für intensive, AI-gestützte Jobsuche.",
          analysisLimit: "120 Stellenanalysen / Monat",
          recommended: false,
          features: [
            "Vollständiger AI-Analyse-Workflow",
            "CV + Anschreiben",
            "Bewerbungsvorbereitung",
            "Bewerbungstracking",
            "Erweiterter Workspace",
          ],
          prices: {
            threeMonths: "229 €",
            sixMonths: "399 €",
            twelveMonths: "699 €",
          },
        },
      ],
      creditsNote:
        "Wenn dein Analyse-Limit aufgebraucht ist, können zusätzliche Credits später separat im Account gekauft werden.",
    },
  },
  legal: {
    terms: {
      linkLabel: "Nutzungsbedingungen",
      eyebrow: "Rechtliches",
      title: "Nutzungsbedingungen",
      description:
        "Ein kurzer Überblick über die aktuellen Nutzungsbedingungen von Job Agent.",
      notice:
        "Dies ist eine kompakte Produktfassung. Eine ausführlichere rechtliche Version kann später ergänzt werden.",
      sections: [
        {
          title: "Verantwortliche Nutzung",
          body: "Nutze Job Agent nur für rechtmäßige Bewerbungszwecke und nur mit Inhalten, die du selbst verwenden darfst.",
        },
        {
          title: "Eigene Verantwortung",
          body: "Du prüfst Lebenslauf, Anschreiben, Analysen und andere Inhalte vor der Verwendung selbst, bevor du sie an Arbeitgeber weitergibst.",
        },
        {
          title: "Keine Einstellungszusage",
          body: "Job Agent unterstützt bei Suche und Vorbereitung, garantiert aber weder Antworten von Arbeitgebern noch eine Einstellung.",
        },
        {
          title: "Produktänderungen",
          body: "Funktionen, Limits und Verfügbarkeit können sich weiterentwickeln, während das Produkt ausgebaut wird.",
        },
      ],
    },
  },
  demo: {
    page: {
      eyebrow: "Demo",
      title: "Sieh dir Job Agent vor der Registrierung in Ruhe an.",
      description:
        "Diese read-only Demo zeigt, wie der Workspace aussieht und wie Profil, Suche, Analyse und Bewerbung in einem Produktfluss zusammenkommen.",
      readOnlyLabel: "Read-only Demo",
      readOnlyDescription:
        "Die Demo sendet keine AI-Anfragen und speichert keine Daten. Sie ist nur zur Orientierung im Interface gedacht.",
      columns: [
        {
          label: "Kandidatenprofil",
          title: "Profile setup",
          description: "Der Ausgangspunkt für Richtung, Kontext und Suchsignale.",
          items: [
            {
              title: "Zielrolle und Markt",
              detail: "Python Developer in Berlin mit Fokus auf deutschsprachige Produktteams.",
            },
            {
              title: "Erfahrung und Stärken",
              detail: "Backend, APIs, Datenarbeit und klare Kommunikation mit Hiring-Teams.",
            },
          ],
        },
        {
          label: "Jobsuche",
          title: "Job search",
          description: "Suchergebnisse und priorisierte Rollen bleiben nah am Kandidatenkontext.",
          items: [
            {
              title: "Longlist der Rollen",
              detail: "Mehrere Backend- und Platform-Rollen werden gesammelt und verglichen.",
            },
            {
              title: "Nächste starke Option",
              detail: "Die interessanteste Rolle wird für die Analyse in den Workspace übernommen.",
            },
          ],
        },
        {
          label: "Vorbereitung",
          title: "Application preparation",
          description: "Analyse, CV-Anpassung und nächste Schritte bleiben in einem ruhigen Ablauf.",
          items: [
            {
              title: "Job analysis",
              detail: "Anforderungen, offene Punkte und Passung werden in einer strukturierten Sicht gezeigt.",
            },
            {
              title: "Bewerbungspaket",
              detail: "Hinweise für CV, Anschreiben und Vorbereitung auf den nächsten Schritt.",
            },
          ],
        },
      ],
      footerNote:
        "Nach der Registrierung wird derselbe Workspace interaktiv: Du kannst echte Analysen starten, Inhalte speichern und Bewerbungen vorbereiten.",
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
    resumeFlow: {
      headerDescription:
        "Schritt für Schritt zu einem Lebenslauf, den dein Assistent für die Jobsuche in Deutschland nutzen kann.",
      timelineTitle: "Lebenslauf-Setup",
      timelineDescription:
        "Jeder Schritt ergänzt einen Teil deines Profils, damit Stellen besser bewertet und Bewerbungen sauber vorbereitet werden können.",
      timelineHelper:
        "Du kannst über die Punkte zu jedem Schritt springen. Beim Vorwärtsgehen speichern wir deinen aktuellen Stand.",
      status: {
        loading: "Dein Lebenslauf-Onboarding wird geladen...",
        unavailable: "Das Onboarding ist gerade nicht verfügbar.",
        draftLoaded: "Dein gespeicherter Lebenslauf wurde geladen.",
        accountPrefilled:
          "Verfügbare Kontodaten haben wir bereits für dich eingetragen.",
        loadError:
          "Dein Lebenslauf-Onboarding konnte gerade nicht geladen werden.",
        completeError:
          "Das Onboarding konnte gerade nicht abgeschlossen werden.",
        finalReviewReady:
          "Dein Profil ist bereit für die letzte Prüfung.",
        progressSaved: "Dein Fortschritt wurde gespeichert.",
        saveError: "Dein Lebenslauf konnte gerade nicht gespeichert werden.",
        updateError:
          "Der Schrittwechsel konnte gerade nicht gespeichert werden.",
        fileTooLarge:
          "Die Referenzdatei darf nicht größer als 2 MB sein.",
        fileLoaded: "Der Referenztext wurde hinzugefügt.",
        fileReadError: "Die Datei konnte nicht gelesen werden.",
        guidedSelected:
          "Wir erstellen deinen Lebenslauf jetzt Schritt für Schritt.",
        uploadSelected:
          "Du kannst jetzt einen vorhandenen Lebenslauf als Referenz hinzufügen.",
      },
      actions: {
        continue: "Weiter",
        createResume: "Lebenslauf erstellen",
        uploadExistingResume: "Vorhandenen Lebenslauf hochladen",
        uploadFile: "Datei hochladen",
        clearReference: "Referenz entfernen",
        addAnotherPosition: "Weitere Position hinzufügen",
        addAnotherEducation: "Weitere Ausbildung hinzufügen",
        addAnotherLanguage: "Weitere Sprache hinzufügen",
        remove: "Entfernen",
      },
      start: {
        guidedDescription:
          "Wir führen dich in kurzen Schritten durch deinen ersten Lebenslauf.",
        uploadDescription:
          "Nutze einen vorhandenen Lebenslauf als Referenz und ergänze fehlende Angaben.",
        referenceTitle: "Vorhandenen Lebenslauf als Referenz nutzen",
        referenceDescription:
          "Du kannst Text aus einem bestehenden Lebenslauf einfügen oder eine Textdatei hochladen. So versteht der Assistent deinen Hintergrund schneller.",
        referenceLabel: "Referenztext zum Lebenslauf",
        referencePlaceholder:
          "Füge hier den Text deines vorhandenen Lebenslaufs ein...",
      },
      steps: [
        {
          shortLabel: "Willkommen",
          eyebrow: "Erster Lebenslauf",
          title: "Lass uns deinen Lebenslauf erstellen",
          description: [
            "Wir führen dich in ein paar kurzen Schritten durch dein berufliches Profil.",
            "Diese Angaben helfen dem Assistenten, Stellen zu analysieren, Bewerbungen vorzubereiten und deine Jobsuche in Deutschland zu unterstützen.",
            "Das dauert nur wenige Minuten und du kannst später alles anpassen.",
          ],
        },
        {
          shortLabel: "Persönlich",
          eyebrow: "Persönliche Angaben",
          title: "Persönliche Angaben",
          description: [
            "Beginnen wir mit ein paar grundlegenden Angaben zu dir.",
            "Diese Daten gehören in Deutschland meist in einen Lebenslauf und werden für Bewerbungen häufig benötigt.",
            "Außerdem kann der Assistent damit Bewerbungsunterlagen automatisch vorbereiten.",
          ],
        },
        {
          shortLabel: "Ort",
          eyebrow: "Adresse",
          title: "Ort und Adresse",
          description: [
            "Arbeitgeber in Deutschland erwarten im Lebenslauf oft eine Angabe zum Wohnort.",
            "So wird schneller klar, ob eine Stelle für dich realistisch ist und ob ein Umzug nötig wäre.",
          ],
        },
        {
          shortLabel: "Arbeit",
          eyebrow: "Arbeitserlaubnis",
          title: "Arbeitserlaubnis",
          description: [
            "Viele Stellen in Deutschland setzen eine gültige Arbeitserlaubnis voraus.",
            "Mit dieser Angabe kann der Assistent besser einschätzen, welche Jobs wirklich zu deinem Profil passen.",
          ],
        },
        {
          shortLabel: "Rolle",
          eyebrow: "Zielposition",
          title: "Deine Zielrolle",
          description: [
            "Beschreibe, nach welcher Position du suchst.",
            "Der Assistent nutzt diese Information, um Stellenanzeigen zu bewerten und deine Passung zu jeder Gelegenheit einzuschätzen.",
          ],
        },
        {
          shortLabel: "Erfahrung",
          eyebrow: "Beruflicher Hintergrund",
          title: "Berufserfahrung",
          description: [
            "Deine Berufserfahrung ist einer der wichtigsten Teile deines Lebenslaufs.",
            "Frühere Positionen helfen dem Assistenten, deinen Hintergrund zu verstehen und mit Stellenanforderungen zu vergleichen.",
          ],
        },
        {
          shortLabel: "Bildung",
          eyebrow: "Ausbildung",
          title: "Ausbildung",
          description: [
            "Für bestimmte Rollen in Deutschland ist Ausbildung oder Studium besonders relevant, etwa bei Visa-Programmen oder reglementierten Berufen.",
            "Füge deine Ausbildungsstationen hinzu, damit sie im Lebenslauf berücksichtigt werden können.",
          ],
        },
        {
          shortLabel: "Skills",
          eyebrow: "Kompetenzen",
          title: "Skills",
          description: [
            "Liste die wichtigsten Fähigkeiten auf, die du in deiner Arbeit einsetzt.",
            "Der Assistent vergleicht diese Skills mit Stellenanforderungen und hebt passende Positionen hervor.",
          ],
        },
        {
          shortLabel: "Sprachen",
          eyebrow: "Sprachkenntnisse",
          title: "Sprachen",
          description: [
            "Sprachanforderungen sind in deutschen Stellenanzeigen sehr häufig.",
            "Mit deinen Sprachkenntnissen kann der Assistent die Kompatibilität einer Stelle genauer einschätzen.",
          ],
        },
        {
          shortLabel: "Wünsche",
          eyebrow: "Arbeitsumfeld",
          title: "Job-Präferenzen",
          description: [
            "Zum Schluss beschreibst du, welches Arbeitsumfeld du suchst.",
            "Diese Präferenzen helfen dem Assistenten, die Chancen zu priorisieren, die zu deinen Erwartungen passen.",
          ],
        },
        {
          shortLabel: "Fertig",
          eyebrow: "Abschluss",
          title: "Dein Lebenslauf ist bereit",
          description: [
            "Dein berufliches Profil wurde erstellt.",
            "Jetzt kannst du Stellen analysieren, Bewerbungen vorbereiten und deine Jobsuche mit dem Assistenten organisieren.",
          ],
        },
      ],
      fields: {
        firstName: "Vorname",
        lastName: "Nachname",
        birthYear: "Geburtsjahr",
        email: "E-Mail",
        phone: "Telefon",
        street: "Straße",
        city: "Stadt",
        postalCode: "Postleitzahl",
        country: "Land",
        workAuthorizationStatus: "Status der Arbeitserlaubnis",
        desiredRole: "Gewünschte Rolle",
        yearsOfExperience: "Berufserfahrung in Jahren",
        jobTitle: "Positionsbezeichnung",
        company: "Unternehmen",
        location: "Ort",
        startDate: "Startdatum",
        endDate: "Enddatum",
        responsibilities: "Aufgaben",
        technologiesUsed: "Verwendete Technologien",
        institution: "Institution",
        degree: "Abschluss",
        fieldOfStudy: "Fachrichtung",
        startYear: "Startjahr",
        endYear: "Endjahr",
        skills: "Skills",
        language: "Sprache",
        level: "Niveau",
        preferredLocations: "Bevorzugte Orte",
        workMode: "Arbeitsmodell",
        salaryExpectation: "Gehaltsvorstellung",
        availability: "Verfügbarkeit",
      },
      placeholders: {
        firstName: "Anna",
        lastName: "Schmidt",
        birthYear: "1994",
        email: "anna@example.com",
        phone: "+49 151 23456789",
        street: "Beispielstraße 12",
        city: "Berlin",
        postalCode: "10115",
        country: "Deutschland",
        desiredRole: "Backend Engineer",
        yearsOfExperience: "5",
        jobTitle: "Software Engineer",
        company: "Muster GmbH",
        location: "Berlin, Deutschland",
        startDate: "01/2021",
        endDate: "03/2024 oder heute",
        responsibilities:
          "Beschreibe die wichtigsten Aufgaben und Ergebnisse dieser Rolle.",
        technologiesUsed: "Python, SQL, Docker",
        institution: "Technische Universität Berlin",
        degree: "Master",
        fieldOfStudy: "Informatik",
        startYear: "2016",
        endYear: "2018",
        language: "Deutsch",
        level: "C1",
        preferredLocations: "Berlin, Hamburg, Remote",
        salaryExpectation: "EUR 65.000 brutto",
        availability: "Ab sofort / ab Juni 2026",
      },
      options: {
        workAuthorization: [
          { value: "EU citizen", label: "EU-Bürger:in" },
          { value: "Blue Card", label: "Blue Card" },
          { value: "Work visa", label: "Arbeitsvisum" },
          { value: "Need sponsorship", label: "Sponsoring nötig" },
        ],
        workMode: [
          { value: "Remote", label: "Remote" },
          { value: "Hybrid", label: "Hybrid" },
          { value: "Office", label: "Vor Ort" },
        ],
      },
      experience: {
        intro:
          "Frühere Positionen geben dem Assistenten den besten Überblick über deinen Hintergrund. Beschreibe pro Rolle kurz Aufgaben, Wirkung und relevante Technologien.",
        itemLabel: "Position {number}",
        countOne: "{count} Position hinzugefügt",
        countOther: "{count} Positionen hinzugefügt",
      },
      education: {
        itemLabel: "Ausbildung {number}",
        countOne: "{count} Ausbildung hinzugefügt",
        countOther: "{count} Ausbildungen hinzugefügt",
      },
      skills: {
        inputPlaceholder: "Skill eingeben und mit Enter bestätigen",
        example: "Beispiel: Python, SQL, Docker, AWS, React",
      },
      languages: {
        itemLabel: "Sprache {number}",
        countOne: "{count} Sprache hinzugefügt",
        countOther: "{count} Sprachen hinzugefügt",
      },
      ready: {
        notice:
          "Dein berufliches Profil ist erstellt. Prüfe kurz die wichtigsten Angaben, bevor du zum Assistenten wechselst.",
        cards: {
          profile: "Profil",
          resume: "Lebenslauf",
          preferences: "Präferenzen",
        },
        labels: {
          name: "Name",
          email: "E-Mail",
          phone: "Telefon",
          location: "Ort",
          workAuthorization: "Arbeitserlaubnis",
          targetRole: "Zielrolle",
          yearsOfExperience: "Berufserfahrung",
          skills: "Skills",
          languages: "Sprachen",
          preferredLocations: "Bevorzugte Orte",
          workMode: "Arbeitsmodell",
          salary: "Gehalt",
          availability: "Verfügbarkeit",
        },
      },
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
  setupFlow: {
    loading: "Dein Ablauf wird geladen...",
    loadError: "Der Ablauf konnte gerade nicht geladen werden.",
    actions: {
      continue: "Weiter",
      openAssistant: "Assistent öffnen",
      retry: "Erneut versuchen",
    },
    steps: [
      {
        label: "Start",
        title: "Lernen wir uns kennen",
        description: [
          "Ich bin dein Job Agent. Ich helfe dir, einen klaren Weg zur Arbeit in Deutschland aufzubauen — basierend auf den Anforderungen des Arbeitsmarktes und dem, was Arbeitgeber wirklich erwarten.",
          "Wir beginnen mit deinem Lebenslauf und gehen diesen Weg gemeinsam weiter — hin zu echten Bewerbungen und ersten Ergebnissen.",
        ],
      },
      {
        label: "Lebenslauf",
        title: "Erstelle deinen ersten Lebenslauf",
        description: [
          "Der erste Pflichtschritt ist dein Lebenslauf.",
          "Wenn du den Punkt unten öffnest, startet das bestehende Onboarding. Danach kommst du wieder genau hierhin zurück.",
        ],
      },
      {
        label: "Weiter",
        title: "Danach geht es direkt in den Assistenten",
        description: [
          "Sobald der Lebenslauf fertig ist, kannst du mit Job Agent Stellen prüfen und Unterlagen vorbereiten.",
          "Das Onboarding bleibt dabei ein separates Werkzeug im Ablauf.",
        ],
      },
    ],
    checklist: {
      title: "Checkliste",
      description:
        "Schließe diesen Schritt ab, bevor du im Ablauf weitergehst.",
      items: {
        createResume: "Ersten Lebenslauf erstellen",
      },
      pending:
        "Öffnet das bestehende Onboarding in einem separaten Schritt.",
      completed: "Erledigt. Du kannst jetzt weitergehen.",
      continueLocked:
        "Schließe zuerst den Punkt in der Checkliste ab, um weiterzugehen.",
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
    openSetupFlow: "Ablauf öffnen",
  },
} as const;

export type Messages = typeof de;
