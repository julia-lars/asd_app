export const DEFAULT_LOCALE = 'zh-CN';

const MESSAGES = {
  'auth.not_logged_in': {
    'zh-CN': '未登录',
    en: 'Not logged in',
    ja: 'ログインしていません',
    ko: '로그인이 필요합니다',
    es: 'No has iniciado sesión',
    fr: 'Non connecté',
    de: 'Nicht angemeldet',
    ar: 'لم يتم تسجيل الدخول',
    pt: 'Não conectado',
    ru: 'Вы не вошли в систему'
  },
  'auth.expired': {
    'zh-CN': '登录已过期',
    en: 'Your session has expired',
    ja: 'ログインの有効期限が切れました',
    ko: '로그인 세션이 만료되었습니다',
    es: 'Tu sesión ha caducado',
    fr: 'Votre session a expiré',
    de: 'Deine Sitzung ist abgelaufen',
    ar: 'انتهت صلاحية جلستك',
    pt: 'Sua sessão expirou',
    ru: 'Срок действия сеанса истек'
  },
  'auth.email_password_required': {
    'zh-CN': '邮箱和密码不能为空',
    en: 'Email and password are required',
    ja: 'メールアドレスとパスワードは必須です',
    ko: '이메일과 비밀번호를 입력해 주세요',
    es: 'El correo electrónico y la contraseña son obligatorios',
    fr: 'L’e-mail et le mot de passe sont obligatoires',
    de: 'E-Mail und Passwort sind erforderlich',
    ar: 'البريد الإلكتروني وكلمة المرور مطلوبان',
    pt: 'E-mail e senha são obrigatórios',
    ru: 'Электронная почта и пароль обязательны'
  },
  'auth.email_registered': {
    'zh-CN': '该邮箱已被注册',
    en: 'This email is already registered',
    ja: 'このメールアドレスはすでに登録されています',
    ko: '이미 등록된 이메일입니다',
    es: 'Este correo electrónico ya está registrado',
    fr: 'Cet e-mail est déjà enregistré',
    de: 'Diese E-Mail ist bereits registriert',
    ar: 'هذا البريد الإلكتروني مسجل بالفعل',
    pt: 'Este e-mail já está registrado',
    ru: 'Этот адрес электронной почты уже зарегистрирован'
  },
  'auth.invalid_credentials': {
    'zh-CN': '邮箱或密码错误',
    en: 'Incorrect email or password',
    ja: 'メールアドレスまたはパスワードが正しくありません',
    ko: '이메일 또는 비밀번호가 올바르지 않습니다',
    es: 'Correo electrónico o contraseña incorrectos',
    fr: 'E-mail ou mot de passe incorrect',
    de: 'E-Mail oder Passwort ist falsch',
    ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    pt: 'E-mail ou senha incorretos',
    ru: 'Неверная электронная почта или пароль'
  },
  'auth.user_missing': {
    'zh-CN': '用户不存在',
    en: 'User does not exist',
    ja: 'ユーザーが存在しません',
    ko: '사용자를 찾을 수 없습니다',
    es: 'El usuario no existe',
    fr: 'L’utilisateur n’existe pas',
    de: 'Benutzer existiert nicht',
    ar: 'المستخدم غير موجود',
    pt: 'O usuário não existe',
    ru: 'Пользователь не существует'
  },
  'auth.password_fields_required': {
    'zh-CN': '当前密码和新密码不能为空',
    en: 'Current password and new password are required',
    ja: '現在のパスワードと新しいパスワードは必須です',
    ko: '현재 비밀번호와 새 비밀번호를 입력해 주세요',
    es: 'La contraseña actual y la nueva contraseña son obligatorias',
    fr: 'Le mot de passe actuel et le nouveau mot de passe sont obligatoires',
    de: 'Aktuelles Passwort und neues Passwort sind erforderlich',
    ar: 'كلمة المرور الحالية وكلمة المرور الجديدة مطلوبتان',
    pt: 'A senha atual e a nova senha são obrigatórias',
    ru: 'Текущий и новый пароль обязательны'
  },
  'auth.password_too_short': {
    'zh-CN': '新密码至少需要 6 位',
    en: 'The new password must be at least 6 characters',
    ja: '新しいパスワードは6文字以上で入力してください',
    ko: '새 비밀번호는 6자 이상이어야 합니다',
    es: 'La nueva contraseña debe tener al menos 6 caracteres',
    fr: 'Le nouveau mot de passe doit contenir au moins 6 caractères',
    de: 'Das neue Passwort muss mindestens 6 Zeichen lang sein',
    ar: 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل',
    pt: 'A nova senha deve ter pelo menos 6 caracteres',
    ru: 'Новый пароль должен содержать не менее 6 символов'
  },
  'auth.current_password_wrong': {
    'zh-CN': '当前密码不正确',
    en: 'The current password is incorrect',
    ja: '現在のパスワードが正しくありません',
    ko: '현재 비밀번호가 올바르지 않습니다',
    es: 'La contraseña actual es incorrecta',
    fr: 'Le mot de passe actuel est incorrect',
    de: 'Das aktuelle Passwort ist falsch',
    ar: 'كلمة المرور الحالية غير صحيحة',
    pt: 'A senha atual está incorreta',
    ru: 'Текущий пароль неверен'
  },
  'auth.password_updated': {
    'zh-CN': '密码已更新',
    en: 'Password updated',
    ja: 'パスワードを更新しました',
    ko: '비밀번호가 변경되었습니다',
    es: 'Contraseña actualizada',
    fr: 'Mot de passe mis à jour',
    de: 'Passwort aktualisiert',
    ar: 'تم تحديث كلمة المرور',
    pt: 'Senha atualizada',
    ru: 'Пароль обновлен'
  },
  'ai.conversation_required': {
    'zh-CN': '缺少 conversationId',
    en: 'Missing conversationId',
    ja: 'conversationId がありません',
    ko: 'conversationId가 없습니다',
    es: 'Falta conversationId',
    fr: 'conversationId manquant',
    de: 'conversationId fehlt',
    ar: 'conversationId مفقود',
    pt: 'conversationId ausente',
    ru: 'Отсутствует conversationId'
  },
  'ai.message_required': {
    'zh-CN': 'message 不能为空',
    en: 'message is required',
    ja: 'message は必須です',
    ko: 'message는 필수입니다',
    es: 'message es obligatorio',
    fr: 'message est obligatoire',
    de: 'message ist erforderlich',
    ar: 'message مطلوب',
    pt: 'message é obrigatório',
    ru: 'message обязателен'
  },
  'ai.system_prompt_string': {
    'zh-CN': 'systemPrompt 必须是字符串',
    en: 'systemPrompt must be a string',
    ja: 'systemPrompt は文字列である必要があります',
    ko: 'systemPrompt는 문자열이어야 합니다',
    es: 'systemPrompt debe ser una cadena',
    fr: 'systemPrompt doit être une chaîne',
    de: 'systemPrompt muss eine Zeichenfolge sein',
    ar: 'يجب أن يكون systemPrompt سلسلة نصية',
    pt: 'systemPrompt deve ser uma string',
    ru: 'systemPrompt должен быть строкой'
  },
  'ai.conversation_string': {
    'zh-CN': 'conversationId 必须是字符串',
    en: 'conversationId must be a string',
    ja: 'conversationId は文字列である必要があります',
    ko: 'conversationId는 문자열이어야 합니다',
    es: 'conversationId debe ser una cadena',
    fr: 'conversationId doit être une chaîne',
    de: 'conversationId muss eine Zeichenfolge sein',
    ar: 'يجب أن يكون conversationId سلسلة نصية',
    pt: 'conversationId deve ser uma string',
    ru: 'conversationId должен быть строкой'
  },
  'ai.deepseek_key_missing': {
    'zh-CN': '未配置 DEEPSEEK_API_KEY（MCP_TRANSPORT=stdio）',
    en: 'DEEPSEEK_API_KEY is not configured (MCP_TRANSPORT=stdio)',
    ja: 'DEEPSEEK_API_KEY が設定されていません（MCP_TRANSPORT=stdio）',
    ko: 'DEEPSEEK_API_KEY가 설정되지 않았습니다(MCP_TRANSPORT=stdio)',
    es: 'DEEPSEEK_API_KEY no está configurada (MCP_TRANSPORT=stdio)',
    fr: 'DEEPSEEK_API_KEY n’est pas configurée (MCP_TRANSPORT=stdio)',
    de: 'DEEPSEEK_API_KEY ist nicht konfiguriert (MCP_TRANSPORT=stdio)',
    ar: 'لم يتم ضبط DEEPSEEK_API_KEY (MCP_TRANSPORT=stdio)',
    pt: 'DEEPSEEK_API_KEY não está configurada (MCP_TRANSPORT=stdio)',
    ru: 'DEEPSEEK_API_KEY не настроен (MCP_TRANSPORT=stdio)'
  },
  'ai.mcp_token_missing': {
    'zh-CN': '未配置 DEEPSEEK_MCP_AUTH_TOKEN（MCP_TRANSPORT=http）',
    en: 'DEEPSEEK_MCP_AUTH_TOKEN is not configured (MCP_TRANSPORT=http)',
    ja: 'DEEPSEEK_MCP_AUTH_TOKEN が設定されていません（MCP_TRANSPORT=http）',
    ko: 'DEEPSEEK_MCP_AUTH_TOKEN이 설정되지 않았습니다(MCP_TRANSPORT=http)',
    es: 'DEEPSEEK_MCP_AUTH_TOKEN no está configurado (MCP_TRANSPORT=http)',
    fr: 'DEEPSEEK_MCP_AUTH_TOKEN n’est pas configuré (MCP_TRANSPORT=http)',
    de: 'DEEPSEEK_MCP_AUTH_TOKEN ist nicht konfiguriert (MCP_TRANSPORT=http)',
    ar: 'لم يتم ضبط DEEPSEEK_MCP_AUTH_TOKEN (MCP_TRANSPORT=http)',
    pt: 'DEEPSEEK_MCP_AUTH_TOKEN não está configurado (MCP_TRANSPORT=http)',
    ru: 'DEEPSEEK_MCP_AUTH_TOKEN не настроен (MCP_TRANSPORT=http)'
  },
  'ai.empty_reply': {
    'zh-CN': '（空回复）',
    en: '(empty reply)',
    ja: '（空の返信）',
    ko: '(빈 응답)',
    es: '(respuesta vacía)',
    fr: '(réponse vide)',
    de: '(leere Antwort)',
    ar: '(رد فارغ)',
    pt: '(resposta vazia)',
    ru: '(пустой ответ)'
  },
  'ai.reflect_timeout': {
    'zh-CN': '归纳步骤超时',
    en: 'Reflection step timed out',
    ja: '要約ステップがタイムアウトしました',
    ko: '요약 단계 시간이 초과되었습니다',
    es: 'El paso de reflexión agotó el tiempo',
    fr: 'L’étape de synthèse a expiré',
    de: 'Der Reflexionsschritt ist abgelaufen',
    ar: 'انتهت مهلة خطوة التلخيص',
    pt: 'A etapa de reflexão expirou',
    ru: 'Время этапа обобщения истекло'
  },
  'ai.session_reset_required': {
    'zh-CN': 'conversationId 必填',
    en: 'conversationId is required',
    ja: 'conversationId は必須です',
    ko: 'conversationId는 필수입니다',
    es: 'conversationId es obligatorio',
    fr: 'conversationId est obligatoire',
    de: 'conversationId ist erforderlich',
    ar: 'conversationId مطلوب',
    pt: 'conversationId é obrigatório',
    ru: 'conversationId обязателен'
  },
  'ai.session_reset_user_note': {
    'zh-CN': '已登录用户长期记忆未清除（全账号共用一份档案）；仅切换本地 conversationId 即可新对话。',
    en: 'Long-term memory for logged-in users was not cleared because it is shared across the account; switching the local conversationId starts a new chat.',
    ja: 'ログインユーザーの長期メモリは削除されていません（アカウント全体で共有されます）。ローカルの conversationId を切り替えると新しい会話になります。',
    ko: '로그인 사용자의 장기 기억은 계정 전체에서 공유되므로 삭제되지 않았습니다. 로컬 conversationId를 바꾸면 새 대화가 시작됩니다.',
    es: 'La memoria a largo plazo de usuarios conectados no se borró porque se comparte en toda la cuenta; cambiar el conversationId local inicia un nuevo chat.',
    fr: 'La mémoire à long terme des utilisateurs connectés n’a pas été effacée car elle est partagée sur tout le compte ; changer le conversationId local démarre une nouvelle conversation.',
    de: 'Das Langzeitgedächtnis angemeldeter Nutzer wurde nicht gelöscht, da es kontoweit geteilt wird; ein lokaler Wechsel der conversationId startet einen neuen Chat.',
    ar: 'لم يتم مسح الذاكرة طويلة المدى للمستخدمين المسجلين لأنها مشتركة عبر الحساب؛ تغيير conversationId المحلي يبدأ محادثة جديدة.',
    pt: 'A memória de longo prazo de usuários conectados não foi apagada porque é compartilhada em toda a conta; alterar o conversationId local inicia um novo chat.',
    ru: 'Долгосрочная память вошедших пользователей не была очищена, потому что она общая для аккаунта; смена локального conversationId начинает новый чат.'
  },
  'ai.session_reset_anon_note': {
    'zh-CN': '已清除该匿名会话下的临时长期记忆。',
    en: 'Temporary long-term memory for this anonymous session has been cleared.',
    ja: 'この匿名セッションの一時的な長期メモリを削除しました。',
    ko: '이 익명 세션의 임시 장기 기억을 삭제했습니다.',
    es: 'Se borró la memoria temporal a largo plazo de esta sesión anónima.',
    fr: 'La mémoire temporaire à long terme de cette session anonyme a été effacée.',
    de: 'Das temporäre Langzeitgedächtnis dieser anonymen Sitzung wurde gelöscht.',
    ar: 'تم مسح الذاكرة طويلة المدى المؤقتة لهذه الجلسة المجهولة.',
    pt: 'A memória temporária de longo prazo desta sessão anônima foi apagada.',
    ru: 'Временная долгосрочная память этой анонимной сессии очищена.'
  }
};

export function normalizeLocale(value) {
  if (typeof value !== 'string' || !value.trim()) return DEFAULT_LOCALE;
  const normalized = value.trim().toLowerCase();
  if (normalized.startsWith('zh')) return 'zh-CN';
  if (normalized.startsWith('en')) return 'en';
  if (normalized.startsWith('ja') || normalized.startsWith('jp')) return 'ja';
  if (normalized.startsWith('ko') || normalized.startsWith('kr')) return 'ko';
  if (normalized.startsWith('es')) return 'es';
  if (normalized.startsWith('fr')) return 'fr';
  if (normalized.startsWith('de')) return 'de';
  if (normalized.startsWith('ar')) return 'ar';
  if (normalized.startsWith('pt')) return 'pt';
  if (normalized.startsWith('ru')) return 'ru';
  return DEFAULT_LOCALE;
}

export function localeFromRequest(req) {
  const bodyLocale = req?.body?.locale;
  if (typeof bodyLocale === 'string' && bodyLocale.trim()) return normalizeLocale(bodyLocale);
  const queryLocale = req?.query?.locale;
  if (typeof queryLocale === 'string' && queryLocale.trim()) return normalizeLocale(queryLocale);
  const header = req?.headers?.['accept-language'];
  if (typeof header === 'string' && header.trim()) return normalizeLocale(header.split(',')[0]);
  return DEFAULT_LOCALE;
}

export function serverMessage(code, locale) {
  const resolvedLocale = normalizeLocale(locale);
  return MESSAGES[code]?.[resolvedLocale] ?? MESSAGES[code]?.[DEFAULT_LOCALE] ?? code;
}

export function replyLanguageInstruction(locale) {
  const resolvedLocale = normalizeLocale(locale);
  const instructions = {
    'zh-CN': '请使用简体中文回答用户。',
    en: 'Reply in English. Keep the main answer in English even if internal context is in another language.',
    ja: '日本語で回答してください。内部コンテキストが別言語でも、主な回答は日本語にしてください。',
    ko: '한국어로 답변하세요. 내부 맥락이 다른 언어여도 주요 답변은 한국어로 유지하세요.',
    es: 'Responde en español. Mantén la respuesta principal en español aunque el contexto interno esté en otro idioma.',
    fr: 'Répondez en français. Gardez la réponse principale en français même si le contexte interne est dans une autre langue.',
    de: 'Antworte auf Deutsch. Halte die Hauptantwort auf Deutsch, auch wenn der interne Kontext in einer anderen Sprache ist.',
    ar: 'أجب باللغة العربية. اجعل الإجابة الرئيسية بالعربية حتى إذا كان السياق الداخلي بلغة أخرى.',
    pt: 'Responda em português. Mantenha a resposta principal em português mesmo que o contexto interno esteja em outro idioma.',
    ru: 'Отвечайте на русском языке. Сохраняйте основной ответ на русском, даже если внутренний контекст на другом языке.'
  };
  return instructions[resolvedLocale] ?? instructions[DEFAULT_LOCALE];
}

export function displayLanguageName(locale) {
  const names = {
    'zh-CN': '简体中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    ar: 'العربية',
    pt: 'Português',
    ru: 'Русский'
  };
  return names[normalizeLocale(locale)] ?? names[DEFAULT_LOCALE];
}
