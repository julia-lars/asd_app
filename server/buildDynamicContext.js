import { normalizeLocale } from './locale.js';

const TEMPLATES = {
  'zh-CN': {
    title: '【用户长期记忆（来自历史对话归纳，用户自述未核验，非医疗诊断）】',
    disclaimer: '以下信息仅用于保持对话连贯与语气关怀，若与用户当前说法冲突，以用户当下表述为准。',
    background: '【已知背景要点】',
    emotion: '【上一轮对话中对其情绪与支持需求的观察（非诊断）】',
    opener: '【建议开场】用户再次发言时，可先自然表达一句关心（可参考下句，允许改写）：',
    finalInstruction: '请先简短表达关心或承接其处境，再回答用户本轮问题。'
  },
  en: {
    title: '[User long-term memory (summarized from past chats; self-reported, unverified, non-diagnostic)]',
    disclaimer: "Use this only for continuity and supportive tone. If it conflicts with the user's current message, prioritize the current message.",
    background: '[Known background points]',
    emotion: '[Observation from the previous chat about emotions/support needs (non-diagnostic)]',
    opener: '[Suggested opening] When the user speaks again, you may naturally start with a brief caring sentence inspired by this:',
    finalInstruction: "Briefly acknowledge or care for the user's situation first, then answer the current question."
  },
  ja: {
    title: '【ユーザーの長期メモリ（過去の会話からの要約・自己申告・未検証・診断ではありません）】',
    disclaimer: '以下は会話の連続性と支援的な口調のためだけに使用してください。現在の発言と矛盾する場合は、現在の発言を優先してください。',
    background: '【把握している背景】',
    emotion: '【前回の会話における感情と支援ニーズの観察（診断ではありません）】',
    opener: '【提案される開き方】ユーザーが次に話すとき、次の一文を参考に自然に気遣いを示してもよいです：',
    finalInstruction: 'まず短く気遣いや状況への受け止めを示してから、今回の質問に答えてください。'
  },
  ko: {
    title: '【사용자 장기 기억(과거 대화 요약, 자기 보고, 미검증, 진단 아님)】',
    disclaimer: '아래 정보는 대화의 연속성과 지지적인 어조를 위해서만 사용하세요. 현재 사용자의 말과 충돌하면 현재 말을 우선하세요.',
    background: '【알려진 배경 정보】',
    emotion: '【이전 대화에서의 감정 및 지원 필요 관찰(진단 아님)】',
    opener: '【추천 시작 문장】사용자가 다시 말할 때 아래 문장을 참고해 자연스럽게 짧은 관심을 표현할 수 있습니다：',
    finalInstruction: '먼저 짧게 관심을 표현하거나 상황을 받아준 뒤, 이번 질문에 답하세요.'
  },
  es: {
    title: '[Memoria a largo plazo del usuario (resumida de conversaciones anteriores; autoinformada, no verificada, no diagnóstica)]',
    disclaimer: 'Use esta información solo para continuidad y tono de apoyo. Si contradice el mensaje actual del usuario, priorice el mensaje actual.',
    background: '[Datos de contexto conocidos]',
    emotion: '[Observación de la conversación anterior sobre emociones/necesidades de apoyo (no diagnóstica)]',
    opener: '[Apertura sugerida] Cuando el usuario vuelva a escribir, puede empezar con una frase breve y natural de cuidado inspirada en esto:',
    finalInstruction: 'Primero reconozca brevemente la situación del usuario o muestre cuidado, luego responda la pregunta actual.'
  },
  fr: {
    title: '[Mémoire à long terme de l’utilisateur (résumée depuis des conversations passées ; autodéclarée, non vérifiée, non diagnostique)]',
    disclaimer: 'Utilisez ces informations uniquement pour la continuité et un ton bienveillant. Si elles contredisent le message actuel, privilégiez le message actuel.',
    background: '[Éléments de contexte connus]',
    emotion: '[Observation de la conversation précédente sur les émotions/besoins de soutien (non diagnostique)]',
    opener: '[Ouverture suggérée] Lorsque l’utilisateur revient, vous pouvez commencer naturellement par une courte phrase de soutien inspirée de ceci :',
    finalInstruction: 'Exprimez d’abord brièvement de l’attention ou reconnaissez la situation, puis répondez à la question actuelle.'
  },
  de: {
    title: '[Langzeitgedächtnis des Nutzers (aus früheren Chats zusammengefasst; selbstberichtet, ungeprüft, nicht diagnostisch)]',
    disclaimer: 'Verwende diese Informationen nur für Kontinuität und einen unterstützenden Ton. Wenn sie der aktuellen Aussage widersprechen, hat die aktuelle Aussage Vorrang.',
    background: '[Bekannte Hintergrundpunkte]',
    emotion: '[Beobachtung aus dem vorherigen Chat zu Emotionen/Unterstützungsbedarf (nicht diagnostisch)]',
    opener: '[Vorgeschlagener Einstieg] Wenn der Nutzer wieder schreibt, kannst du natürlich mit einem kurzen fürsorglichen Satz beginnen, der hiervon inspiriert ist:',
    finalInstruction: 'Zeige zuerst kurz Fürsorge oder erkenne die Situation an, dann beantworte die aktuelle Frage.'
  },
  ar: {
    title: '[ذاكرة المستخدم طويلة المدى (ملخصة من محادثات سابقة؛ معلومات ذاتية غير موثقة وغير تشخيصية)]',
    disclaimer: 'استخدم هذه المعلومات فقط للحفاظ على استمرارية الحديث والنبرة الداعمة. إذا تعارضت مع رسالة المستخدم الحالية، فالأولوية للرسالة الحالية.',
    background: '[نقاط خلفية معروفة]',
    emotion: '[ملاحظة من المحادثة السابقة حول المشاعر/احتياجات الدعم (غير تشخيصية)]',
    opener: '[افتتاحية مقترحة] عندما يكتب المستخدم مرة أخرى، يمكنك البدء بجملة قصيرة داعمة مستوحاة من الآتي:',
    finalInstruction: 'ابدأ أولًا بتعاطف قصير أو اعتراف بالموقف، ثم أجب عن السؤال الحالي.'
  },
  pt: {
    title: '[Memória de longo prazo do usuário (resumida de conversas anteriores; autodeclarada, não verificada, não diagnóstica)]',
    disclaimer: 'Use estas informações apenas para continuidade e tom de apoio. Se houver conflito com a mensagem atual do usuário, priorize a mensagem atual.',
    background: '[Pontos de contexto conhecidos]',
    emotion: '[Observação da conversa anterior sobre emoções/necessidades de apoio (não diagnóstica)]',
    opener: '[Abertura sugerida] Quando o usuário voltar a escrever, você pode começar naturalmente com uma frase breve de cuidado inspirada nisto:',
    finalInstruction: 'Primeiro reconheça brevemente a situação ou demonstre cuidado, depois responda à pergunta atual.'
  },
  ru: {
    title: '[Долгосрочная память пользователя (обобщено из прошлых чатов; со слов пользователя, не проверено, не диагностика)]',
    disclaimer: 'Используйте эту информацию только для непрерывности беседы и поддерживающего тона. Если она противоречит текущему сообщению пользователя, приоритет у текущего сообщения.',
    background: '[Известные сведения]',
    emotion: '[Наблюдение из предыдущего чата об эмоциях/потребностях в поддержке (не диагностика)]',
    opener: '[Рекомендуемое начало] Когда пользователь снова напишет, можно естественно начать с короткой заботливой фразы, вдохновленной этим:',
    finalInstruction: 'Сначала кратко проявите поддержку или признайте ситуацию, затем ответьте на текущий вопрос.'
  }
};

/**
 * 将用户级长期记忆注入主对话 system（非诊断免责声明）
 * @param {import('./longTermMemory.js').LongTermMemoryState | null | undefined} memory
 */
export function buildLongTermContext(memory, locale = 'zh-CN') {
  if (!memory) return '';
  const { basicInfoLines = [], lastEmotionalNote = '', careOpener = '' } = memory;
  if (!basicInfoLines.length && !lastEmotionalNote.trim() && !careOpener.trim()) return '';
  const template = TEMPLATES[normalizeLocale(locale)] ?? TEMPLATES['zh-CN'];

  const lines = [
    template.title,
    template.disclaimer,
    '',
  ];

  if (basicInfoLines.length) {
    lines.push(template.background);
    for (const b of basicInfoLines) lines.push(`- ${b}`);
    lines.push('');
  }

  if (lastEmotionalNote.trim()) {
    lines.push(template.emotion);
    lines.push(lastEmotionalNote.trim());
    lines.push('');
  }

  if (careOpener.trim()) {
    lines.push(template.opener);
    lines.push(`「${careOpener.trim()}」`);
    lines.push('');
  }

  lines.push(template.finalInstruction);
  return lines.join('\n').trim();
}
