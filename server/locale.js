export const DEFAULT_LOCALE = 'zh-CN';

const MESSAGES = {
  'auth.not_logged_in': {
    'zh-CN': '未登录',
    en: 'Not logged in',
    ja: 'ログインしていません',
    ko: '로그인이 필요합니다'
  },
  'auth.expired': {
    'zh-CN': '登录已过期',
    en: 'Your session has expired',
    ja: 'ログインの有効期限が切れました',
    ko: '로그인 세션이 만료되었습니다'
  },
  'auth.email_password_required': {
    'zh-CN': '邮箱和密码不能为空',
    en: 'Email and password are required',
    ja: 'メールアドレスとパスワードは必須です',
    ko: '이메일과 비밀번호를 입력해 주세요'
  },
  'auth.email_registered': {
    'zh-CN': '该邮箱已被注册',
    en: 'This email is already registered',
    ja: 'このメールアドレスはすでに登録されています',
    ko: '이미 등록된 이메일입니다'
  },
  'auth.invalid_credentials': {
    'zh-CN': '邮箱或密码错误',
    en: 'Incorrect email or password',
    ja: 'メールアドレスまたはパスワードが正しくありません',
    ko: '이메일 또는 비밀번호가 올바르지 않습니다'
  },
  'auth.user_missing': {
    'zh-CN': '用户不存在',
    en: 'User does not exist',
    ja: 'ユーザーが存在しません',
    ko: '사용자를 찾을 수 없습니다'
  },
  'ai.conversation_required': {
    'zh-CN': '缺少 conversationId',
    en: 'Missing conversationId',
    ja: 'conversationId がありません',
    ko: 'conversationId가 없습니다'
  },
  'ai.message_required': {
    'zh-CN': 'message 不能为空',
    en: 'message is required',
    ja: 'message は必須です',
    ko: 'message는 필수입니다'
  },
  'ai.system_prompt_string': {
    'zh-CN': 'systemPrompt 必须是字符串',
    en: 'systemPrompt must be a string',
    ja: 'systemPrompt は文字列である必要があります',
    ko: 'systemPrompt는 문자열이어야 합니다'
  },
  'ai.conversation_string': {
    'zh-CN': 'conversationId 必须是字符串',
    en: 'conversationId must be a string',
    ja: 'conversationId は文字列である必要があります',
    ko: 'conversationId는 문자열이어야 합니다'
  },
  'ai.deepseek_key_missing': {
    'zh-CN': '未配置 DEEPSEEK_API_KEY（MCP_TRANSPORT=stdio）',
    en: 'DEEPSEEK_API_KEY is not configured (MCP_TRANSPORT=stdio)',
    ja: 'DEEPSEEK_API_KEY が設定されていません（MCP_TRANSPORT=stdio）',
    ko: 'DEEPSEEK_API_KEY가 설정되지 않았습니다(MCP_TRANSPORT=stdio)'
  },
  'ai.mcp_token_missing': {
    'zh-CN': '未配置 DEEPSEEK_MCP_AUTH_TOKEN（MCP_TRANSPORT=http）',
    en: 'DEEPSEEK_MCP_AUTH_TOKEN is not configured (MCP_TRANSPORT=http)',
    ja: 'DEEPSEEK_MCP_AUTH_TOKEN が設定されていません（MCP_TRANSPORT=http）',
    ko: 'DEEPSEEK_MCP_AUTH_TOKEN이 설정되지 않았습니다(MCP_TRANSPORT=http)'
  },
  'ai.empty_reply': {
    'zh-CN': '（空回复）',
    en: '(empty reply)',
    ja: '（空の返信）',
    ko: '(빈 응답)'
  },
  'ai.reflect_timeout': {
    'zh-CN': '归纳步骤超时',
    en: 'Reflection step timed out',
    ja: '要約ステップがタイムアウトしました',
    ko: '요약 단계 시간이 초과되었습니다'
  },
  'ai.session_reset_required': {
    'zh-CN': 'conversationId 必填',
    en: 'conversationId is required',
    ja: 'conversationId は必須です',
    ko: 'conversationId는 필수입니다'
  },
  'ai.session_reset_user_note': {
    'zh-CN': '已登录用户长期记忆未清除（全账号共用一份档案）；仅切换本地 conversationId 即可新对话。',
    en: 'Long-term memory for logged-in users was not cleared because it is shared across the account; switching the local conversationId starts a new chat.',
    ja: 'ログインユーザーの長期メモリは削除されていません（アカウント全体で共有されます）。ローカルの conversationId を切り替えると新しい会話になります。',
    ko: '로그인 사용자의 장기 기억은 계정 전체에서 공유되므로 삭제되지 않았습니다. 로컬 conversationId를 바꾸면 새 대화가 시작됩니다.'
  },
  'ai.session_reset_anon_note': {
    'zh-CN': '已清除该匿名会话下的临时长期记忆。',
    en: 'Temporary long-term memory for this anonymous session has been cleared.',
    ja: 'この匿名セッションの一時的な長期メモリを削除しました。',
    ko: '이 익명 세션의 임시 장기 기억을 삭제했습니다.'
  }
};

export function normalizeLocale(value) {
  if (typeof value !== 'string' || !value.trim()) return DEFAULT_LOCALE;
  const normalized = value.trim().toLowerCase();
  if (normalized.startsWith('zh')) return 'zh-CN';
  if (normalized.startsWith('en')) return 'en';
  if (normalized.startsWith('ja') || normalized.startsWith('jp')) return 'ja';
  if (normalized.startsWith('ko') || normalized.startsWith('kr')) return 'ko';
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
    ko: '한국어로 답변하세요. 내부 맥락이 다른 언어여도 주요 답변은 한국어로 유지하세요.'
  };
  return instructions[resolvedLocale] ?? instructions[DEFAULT_LOCALE];
}

export function displayLanguageName(locale) {
  const names = {
    'zh-CN': '简体中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어'
  };
  return names[normalizeLocale(locale)] ?? names[DEFAULT_LOCALE];
}
