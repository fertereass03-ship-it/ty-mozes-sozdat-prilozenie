/**
 * Internationalization service for AI App Builder.
 * Supports Russian (ru), English (en), and Ukrainian (uk).
 */

const translations = {
  // ═══════════════════════════════════════════════════════════════
  //  RUSSIAN
  // ═══════════════════════════════════════════════════════════════
  ru: {
    // App
    'app.title': 'AI App Builder',
    'app.subtitle': 'Создание приложений с помощью ИИ',
    'app.loading': 'Загрузка...',

    // Navigation
    'nav.home': 'Главная',
    'nav.projects': 'Проекты',
    'nav.settings': 'Настройки',
    'nav.apiKeys': 'API и модели',
    'nav.profile': 'Профиль',
    'nav.logout': 'Выйти',

    // Home
    'home.hero': 'Создайте приложение с помощью ИИ',
    'home.subtitle': 'Опишите, что вы хотите создать, и искусственный интеллект разработает его за вас',
    'home.prompt.placeholder': 'Опишите приложение, которое хотите создать...',
    'home.createApp': 'Создать приложение',
    'home.recentProjects': 'Последние проекты',
    'home.examples': 'Примеры проектов',
    'home.newProject': 'Новый проект',
    'home.attachFiles': 'Прикрепить файлы',
    'home.projectType': 'Тип проекта',
    'home.aiModel': 'AI модель',
    'home.history': 'История генераций',

    // Project Types
    'type.web': 'Веб-приложение',
    'type.android': 'Android-приложение',
    'type.pwa': 'PWA',
    'type.site': 'Сайт',
    'type.backend': 'Backend-сервис',
    'type.api': 'API-сервис',
    'type.fullstack': 'Full-stack',
    'type.ios': 'iOS-приложение',

    // Auth
    'auth.login': 'Войти',
    'auth.register': 'Регистрация',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.name': 'Имя',
    'auth.confirmPassword': 'Подтвердите пароль',
    'auth.forgotPassword': 'Забыли пароль?',
    'auth.googleLogin': 'Войти через Google',
    'auth.noAccount': 'Нет аккаунта?',
    'auth.hasAccount': 'Уже есть аккаунт?',
    'auth.resetPassword': 'Восстановить пароль',

    // Workspace
    'workspace.files': 'Файлы',
    'workspace.preview': 'Предпросмотр',
    'workspace.code': 'Код',
    'workspace.logs': 'Логи',
    'workspace.terminal': 'Терминал',
    'workspace.settings': 'Настройки',
    'workspace.chat': 'AI Чат',
    'workspace.newFile': 'Новый файл',
    'workspace.newFolder': 'Новая папка',
    'workspace.deleteFile': 'Удалить',
    'workspace.renameFile': 'Переименовать',
    'workspace.searchFiles': 'Поиск файлов...',

    // Chat
    'chat.placeholder': 'Напишите сообщение...',
    'chat.send': 'Отправить',
    'chat.thinking': 'ИИ думает...',
    'chat.error': 'Ошибка при обработке запроса',
    'chat.retry': 'Повторить',
    'chat.clear': 'Очистить историю',
    'chat.attach': 'Прикрепить файл',
    'chat.fixErrors': 'Исправить ошибки с ИИ',

    // Preview
    'preview.mobile': 'Мобильный',
    'preview.tablet': 'Планшет',
    'preview.desktop': 'Компьютер',
    'preview.refresh': 'Обновить',
    'preview.openNew': 'Открыть в новом окне',
    'preview.errors': 'Ошибки',

    // Settings
    'settings.title': 'Настройки',
    'settings.language': 'Язык интерфейса',
    'settings.theme': 'Тема оформления',
    'settings.themeDark': 'Тёмная',
    'settings.themeLight': 'Светлая',
    'settings.themeSystem': 'Системная',
    'settings.aiProvider': 'AI провайдер',
    'settings.aiModel': 'AI модель',
    'settings.autoSave': 'Автосохранение',
    'settings.notifications': 'Уведомления',
    'settings.account': 'Аккаунт',
    'settings.generation': 'Настройки генерации',
    'settings.temperature': 'Температура',
    'settings.maxTokens': 'Макс. токенов',

    // API Keys
    'api.title': 'API и модели',
    'api.addKey': 'Добавить API ключ',
    'api.editKey': 'Изменить ключ',
    'api.deleteKey': 'Удалить ключ',
    'api.testConnection': 'Проверить подключение',
    'api.connected': 'Подключено',
    'api.disconnected': 'Не подключено',
    'api.error': 'Ошибка',
    'api.models': 'Доступные модели',
    'api.defaultModel': 'Модель по умолчанию',
    'api.priority': 'Приоритет',
    'api.usage': 'Использование',
    'api.customEndpoint': 'Пользовательский endpoint',

    // Build & Export
    'build.title': 'Сборка и экспорт',
    'build.exportZip': 'Скачать ZIP',
    'build.exportSource': 'Скачать исходный код',
    'build.buildApk': 'Собрать APK',
    'build.buildAab': 'Собрать AAB',
    'build.progress': 'Прогресс сборки',
    'build.success': 'Сборка завершена',
    'build.failed': 'Ошибка сборки',
    'build.publishGuide': 'Инструкция по публикации',

    // Project
    'project.save': 'Сохранить',
    'project.saved': 'Сохранено',
    'project.duplicate': 'Дублировать',
    'project.delete': 'Удалить проект',
    'project.export': 'Экспорт',
    'project.import': 'Импорт',
    'project.versions': 'История версий',
    'project.restore': 'Восстановить',
    'project.created': 'Создан',
    'project.updated': 'Обновлён',

    // Errors
    'error.apiKeyRequired': 'Необходимо добавить API ключ',
    'error.apiUnavailable': 'API недоступен. Проверьте ключ и подключение.',
    'error.allApisFailed': 'Все API недоступны. Проверьте подключения в настройках.',
    'error.projectNotFound': 'Проект не найден',
    'error.saveFailed': 'Ошибка сохранения',
    'error.loadFailed': 'Ошибка загрузки',

    // Common
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.close': 'Закрыть',
    'common.confirm': 'Подтвердить',
    'common.search': 'Поиск',
    'common.loading': 'Загрузка...',
    'common.noData': 'Нет данных',
    'common.success': 'Успешно',
    'common.error': 'Ошибка',
    'common.warning': 'Внимание',
    'common.info': 'Информация',
    'common.yes': 'Да',
    'common.no': 'Нет',
    'common.or': 'или',
    'common.back': 'Назад',
    'common.next': 'Далее',
    'common.create': 'Создать',
    'common.update': 'Обновить',
    'common.download': 'Скачать',
    'common.upload': 'Загрузить',
  },

  // ═══════════════════════════════════════════════════════════════
  //  ENGLISH
  // ═══════════════════════════════════════════════════════════════
  en: {
    // App
    'app.title': 'AI App Builder',
    'app.subtitle': 'Build apps with AI',
    'app.loading': 'Loading...',

    // Navigation
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.settings': 'Settings',
    'nav.apiKeys': 'API & Models',
    'nav.profile': 'Profile',
    'nav.logout': 'Log out',

    // Home
    'home.hero': 'Build an app with AI',
    'home.subtitle': 'Describe what you want to create and AI will build it for you',
    'home.prompt.placeholder': 'Describe the app you want to create...',
    'home.createApp': 'Create App',
    'home.recentProjects': 'Recent Projects',
    'home.examples': 'Example Projects',
    'home.newProject': 'New Project',
    'home.attachFiles': 'Attach Files',
    'home.projectType': 'Project Type',
    'home.aiModel': 'AI Model',
    'home.history': 'Generation History',

    // Project Types
    'type.web': 'Web App',
    'type.android': 'Android App',
    'type.pwa': 'PWA',
    'type.site': 'Website',
    'type.backend': 'Backend Service',
    'type.api': 'API Service',
    'type.fullstack': 'Full-stack',
    'type.ios': 'iOS App',

    // Auth
    'auth.login': 'Log in',
    'auth.register': 'Sign up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.confirmPassword': 'Confirm password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.googleLogin': 'Sign in with Google',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.resetPassword': 'Reset password',

    // Workspace
    'workspace.files': 'Files',
    'workspace.preview': 'Preview',
    'workspace.code': 'Code',
    'workspace.logs': 'Logs',
    'workspace.terminal': 'Terminal',
    'workspace.settings': 'Settings',
    'workspace.chat': 'AI Chat',
    'workspace.newFile': 'New File',
    'workspace.newFolder': 'New Folder',
    'workspace.deleteFile': 'Delete',
    'workspace.renameFile': 'Rename',
    'workspace.searchFiles': 'Search files...',

    // Chat
    'chat.placeholder': 'Type a message...',
    'chat.send': 'Send',
    'chat.thinking': 'AI is thinking...',
    'chat.error': 'Error processing request',
    'chat.retry': 'Retry',
    'chat.clear': 'Clear history',
    'chat.attach': 'Attach file',
    'chat.fixErrors': 'Fix errors with AI',

    // Preview
    'preview.mobile': 'Mobile',
    'preview.tablet': 'Tablet',
    'preview.desktop': 'Desktop',
    'preview.refresh': 'Refresh',
    'preview.openNew': 'Open in new window',
    'preview.errors': 'Errors',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Interface Language',
    'settings.theme': 'Theme',
    'settings.themeDark': 'Dark',
    'settings.themeLight': 'Light',
    'settings.themeSystem': 'System',
    'settings.aiProvider': 'AI Provider',
    'settings.aiModel': 'AI Model',
    'settings.autoSave': 'Auto-save',
    'settings.notifications': 'Notifications',
    'settings.account': 'Account',
    'settings.generation': 'Generation Settings',
    'settings.temperature': 'Temperature',
    'settings.maxTokens': 'Max Tokens',

    // API Keys
    'api.title': 'API & Models',
    'api.addKey': 'Add API Key',
    'api.editKey': 'Edit Key',
    'api.deleteKey': 'Delete Key',
    'api.testConnection': 'Test Connection',
    'api.connected': 'Connected',
    'api.disconnected': 'Disconnected',
    'api.error': 'Error',
    'api.models': 'Available Models',
    'api.defaultModel': 'Default Model',
    'api.priority': 'Priority',
    'api.usage': 'Usage',
    'api.customEndpoint': 'Custom Endpoint',

    // Build & Export
    'build.title': 'Build & Export',
    'build.exportZip': 'Download ZIP',
    'build.exportSource': 'Download Source Code',
    'build.buildApk': 'Build APK',
    'build.buildAab': 'Build AAB',
    'build.progress': 'Build Progress',
    'build.success': 'Build Completed',
    'build.failed': 'Build Failed',
    'build.publishGuide': 'Publishing Guide',

    // Project
    'project.save': 'Save',
    'project.saved': 'Saved',
    'project.duplicate': 'Duplicate',
    'project.delete': 'Delete Project',
    'project.export': 'Export',
    'project.import': 'Import',
    'project.versions': 'Version History',
    'project.restore': 'Restore',
    'project.created': 'Created',
    'project.updated': 'Updated',

    // Errors
    'error.apiKeyRequired': 'An API key is required',
    'error.apiUnavailable': 'API unavailable. Check your key and connection.',
    'error.allApisFailed': 'All APIs are unavailable. Check connections in settings.',
    'error.projectNotFound': 'Project not found',
    'error.saveFailed': 'Save failed',
    'error.loadFailed': 'Load failed',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.noData': 'No data',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.warning': 'Warning',
    'common.info': 'Info',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.or': 'or',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.download': 'Download',
    'common.upload': 'Upload',
  },

  // ═══════════════════════════════════════════════════════════════
  //  UKRAINIAN
  // ═══════════════════════════════════════════════════════════════
  uk: {
    // App
    'app.title': 'AI App Builder',
    'app.subtitle': 'Створення додатків з ІІ',
    'app.loading': 'Завантаження...',

    // Navigation
    'nav.home': 'Головна',
    'nav.projects': 'Проєкти',
    'nav.settings': 'Налаштування',
    'nav.apiKeys': 'API та моделі',
    'nav.profile': 'Профіль',
    'nav.logout': 'Вийти',

    // Home
    'home.hero': 'Створіть додаток за допомогою ІІ',
    'home.subtitle': 'Опишіть, що ви хочете створити, і штучний інтелект розробить це для вас',
    'home.prompt.placeholder': 'Опишіть додаток, який хочете створити...',
    'home.createApp': 'Створити додаток',
    'home.recentProjects': 'Останні проєкти',
    'home.examples': 'Приклади проєктів',
    'home.newProject': 'Новий проєкт',
    'home.attachFiles': 'Прикріпити файли',
    'home.projectType': 'Тип проєкту',
    'home.aiModel': 'AI модель',
    'home.history': 'Історія генерацій',

    // Project Types
    'type.web': 'Веб-додаток',
    'type.android': 'Android-додаток',
    'type.pwa': 'PWA',
    'type.site': 'Сайт',
    'type.backend': 'Backend-сервіс',
    'type.api': 'API-сервіс',
    'type.fullstack': 'Full-stack',
    'type.ios': 'iOS-додаток',

    // Auth
    'auth.login': 'Увійти',
    'auth.register': 'Реєстрація',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.name': "Ім'я",
    'auth.confirmPassword': 'Підтвердіть пароль',
    'auth.forgotPassword': 'Забули пароль?',
    'auth.googleLogin': 'Увійти через Google',
    'auth.noAccount': 'Немає акаунту?',
    'auth.hasAccount': 'Вже маєте акаунт?',
    'auth.resetPassword': 'Відновити пароль',

    // Workspace
    'workspace.files': 'Файли',
    'workspace.preview': 'Попередній перегляд',
    'workspace.code': 'Код',
    'workspace.logs': 'Логи',
    'workspace.terminal': 'Термінал',
    'workspace.settings': 'Налаштування',
    'workspace.chat': 'AI Чат',
    'workspace.newFile': 'Новий файл',
    'workspace.newFolder': 'Нова тека',
    'workspace.deleteFile': 'Видалити',
    'workspace.renameFile': 'Перейменувати',
    'workspace.searchFiles': 'Пошук файлів...',

    // Chat
    'chat.placeholder': 'Напишіть повідомлення...',
    'chat.send': 'Надіслати',
    'chat.thinking': 'ІІ думає...',
    'chat.error': 'Помилка при обробці запиту',
    'chat.retry': 'Повторити',
    'chat.clear': 'Очистити історію',
    'chat.attach': 'Прикріпити файл',
    'chat.fixErrors': 'Виправити помилки з ІІ',

    // Preview
    'preview.mobile': 'Мобільний',
    'preview.tablet': 'Планшет',
    'preview.desktop': "Комп'ютер",
    'preview.refresh': 'Оновити',
    'preview.openNew': 'Відкрити в новому вікні',
    'preview.errors': 'Помилки',

    // Settings
    'settings.title': 'Налаштування',
    'settings.language': 'Мова інтерфейсу',
    'settings.theme': 'Тема оформлення',
    'settings.themeDark': 'Темна',
    'settings.themeLight': 'Світла',
    'settings.themeSystem': 'Системна',
    'settings.aiProvider': 'AI провайдер',
    'settings.aiModel': 'AI модель',
    'settings.autoSave': 'Автозбереження',
    'settings.notifications': 'Сповіщення',
    'settings.account': 'Акаунт',
    'settings.generation': 'Налаштування генерації',
    'settings.temperature': 'Температура',
    'settings.maxTokens': 'Макс. токенів',

    // API Keys
    'api.title': 'API та моделі',
    'api.addKey': 'Додати API ключ',
    'api.editKey': 'Змінити ключ',
    'api.deleteKey': 'Видалити ключ',
    'api.testConnection': "Перевірити з'єднання",
    'api.connected': "Під'єднано",
    'api.disconnected': "Не під'єднано",
    'api.error': 'Помилка',
    'api.models': 'Доступні моделі',
    'api.defaultModel': 'Модель за замовчуванням',
    'api.priority': 'Пріоритет',
    'api.usage': 'Використання',
    'api.customEndpoint': 'Користувацький endpoint',

    // Build & Export
    'build.title': 'Збірка та експорт',
    'build.exportZip': 'Завантажити ZIP',
    'build.exportSource': 'Завантажити вихідний код',
    'build.buildApk': 'Зібрати APK',
    'build.buildAab': 'Зібрати AAB',
    'build.progress': 'Прогрес збірки',
    'build.success': 'Збірку завершено',
    'build.failed': 'Помилка збірки',
    'build.publishGuide': 'Інструкція з публікації',

    // Project
    'project.save': 'Зберегти',
    'project.saved': 'Збережено',
    'project.duplicate': 'Дублювати',
    'project.delete': 'Видалити проєкт',
    'project.export': 'Експорт',
    'project.import': 'Імпорт',
    'project.versions': 'Історія версій',
    'project.restore': 'Відновити',
    'project.created': 'Створено',
    'project.updated': 'Оновлено',

    // Errors
    'error.apiKeyRequired': 'Необхідно додати API ключ',
    'error.apiUnavailable': "API недоступний. Перевірте ключ та з'єднання.",
    'error.allApisFailed': 'Усі API недоступні. Перевірте підключення в налаштуваннях.',
    'error.projectNotFound': 'Проєкт не знайдено',
    'error.saveFailed': 'Помилка збереження',
    'error.loadFailed': 'Помилка завантаження',

    // Common
    'common.save': 'Зберегти',
    'common.cancel': 'Скасувати',
    'common.delete': 'Видалити',
    'common.edit': 'Редагувати',
    'common.close': 'Закрити',
    'common.confirm': 'Підтвердити',
    'common.search': 'Пошук',
    'common.loading': 'Завантаження...',
    'common.noData': 'Немає даних',
    'common.success': 'Успішно',
    'common.error': 'Помилка',
    'common.warning': 'Увага',
    'common.info': 'Інформація',
    'common.yes': 'Так',
    'common.no': 'Ні',
    'common.or': 'або',
    'common.back': 'Назад',
    'common.next': 'Далі',
    'common.create': 'Створити',
    'common.update': 'Оновити',
    'common.download': 'Завантажити',
    'common.upload': 'Вивантажити',
  },
};

/**
 * Internationalization service.
 * Provides translation lookup with parameter interpolation and locale switching.
 */
export class I18n {
  constructor() {
    /** @type {string} Current locale code */
    this.locale = 'ru';
    /** @type {Array<function(string): void>} Change listeners */
    this.listeners = [];
    /** @type {string} Fallback locale when a key is missing */
    this.fallbackLocale = 'en';
  }

  /**
   * Set the active locale and notify all listeners.
   * @param {string} locale - Locale code ('ru', 'en', or 'uk').
   */
  setLocale(locale) {
    if (!translations[locale]) {
      console.warn(`[i18n] Unknown locale "${locale}", falling back to "${this.fallbackLocale}"`);
      locale = this.fallbackLocale;
    }
    if (this.locale === locale) return;

    this.locale = locale;
    document.documentElement?.setAttribute('lang', locale);

    // Notify subscribers
    for (const callback of this.listeners) {
      try {
        callback(locale);
      } catch (err) {
        console.error('[i18n] Listener error:', err);
      }
    }
  }

  /**
   * Translate a key with optional parameter interpolation.
   * Parameters in the translation string are denoted as {paramName}.
   *
   * @param {string} key - The translation key, e.g. "home.hero".
   * @param {Object} [params] - Interpolation parameters, e.g. { name: "Alice" }.
   * @returns {string} The translated (and interpolated) string, or the key itself if not found.
   *
   * @example
   * i18n.t('home.hero'); // "Создайте приложение с помощью ИИ"
   * i18n.t('greeting', { name: 'World' }); // "Hello, World!" if greeting = "Hello, {name}!"
   */
  t(key, params) {
    let value =
      translations[this.locale]?.[key] ??
      translations[this.fallbackLocale]?.[key] ??
      key;

    if (params && typeof value === 'string') {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        value = value.replace(
          new RegExp(`\\{${paramKey}\\}`, 'g'),
          String(paramValue)
        );
      }
    }

    return value;
  }

  /**
   * Subscribe to locale changes.
   * @param {function(string): void} callback - Called with the new locale code.
   * @returns {function(): void} Unsubscribe function.
   */
  onChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Available locales with their display names.
   * @returns {Array<{code: string, name: string, nativeName: string}>}
   */
  get availableLocales() {
    return [
      { code: 'ru', name: 'Russian', nativeName: 'Русский' },
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
    ];
  }
}

export const i18n = new I18n();
