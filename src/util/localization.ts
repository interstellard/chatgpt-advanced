import Browser from "webextension-polyfill"

export const getCurrentLanguage = () => Browser.i18n.getUILanguage().split("-")[0]

export const Languages = {
    "auto": "Auto",
    "en": "English",
    "de": "Deutsch",
    "es": "Español",
    "fr": "Français",
    "it": "Italiano",
    "ja": "日本語",
    "ko": "한국어",
    "pt": "Português",
    "zh": "中文"
}

export class LocalizationManager {
    language: string

    constructor(language: string) {
        this.language = language
    }

    getString(key: string) {
        if (this.language in strings[key]) {
            return strings[key][this.language]
        }
        return strings[key]['en']
    }
}


export const LocalizationKeys = {
    defaultPrompt: 'default_prompt',
    UI: {
        language: 'language',
        supportThisProject: 'support_this_project',
        chooseLanguage: 'choose_language',
    },
    placeholders: {
        namePlaceholder: 'name_placeholder',
    },
    buttons: {
        save: 'save',
        newPrompt: 'new_prompt',
    },
    placeHolderTips: {
        currentDate: 'current_date_placeholder_tip',
        webResults: 'web_results_placeholder_tip',
        query: 'query_placeholder_tip',
    },
    socialButtonTips: {
        twitter: 'twitter_button_tip',
        github: 'github_button_tip',
        discord: 'discord_button_tip',
    }
}

const strings = {
    "default_prompt": {
        "en": "Web search results:\n\n{web_results}\nCurrent date: {current_date}\n\nInstructions: Using the provided web search results, write a comprehensive reply to the given query. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject.\nQuery: {query}",
        "pt": "Resultados de pesquisa na web:\n\n{web_results}\nData atual: {current_date}\n\nInstruções: Usando os resultados de pesquisa na web fornecidos, escreva uma resposta abrangente para a consulta dada. Certifique-se de citar os resultados usando a notação [[número](URL)] após a referência. Se os resultados de pesquisa fornecidos se referem a múltiplos assuntos com o mesmo nome, escreva respostas separadas para cada assunto.\nConsulta: {query}",
        "es": "Resultados de búsqueda en la web:\n\n{web_results}\nFecha actual: {current_date}\n\nInstrucciones: Utilizando los resultados de búsqueda en la web proporcionados, escriba una respuesta completa a la consulta dada. Asegúrese de citar los resultados utilizando la notación [[número](URL)] después de la referencia. Si los resultados de búsqueda proporcionados se refieren a varios temas con el mismo nombre, escriba respuestas separadas para cada tema.\nConsulta: {query}",
        "fr": "Résultats de recherche sur le web:\n\n{web_results}\nDate actuelle: {current_date}\n\nInstructions: En utilisant les résultats de recherche sur le web fournis, écrivez une réponse complète à la question posée. Assurez-vous de citer les résultats en utilisant la notation [[numéro](URL)] après la référence. Si les résultats de recherche fournis se réfèrent à plusieurs sujets ayant le même nom, écrivez des réponses séparées pour chaque sujet.\nRequête: {query}",
        "de": "Web-Suchergebnisse:\n\n{web_results}\nAktuelles Datum: {current_date}\n\nAnweisungen: Verwenden Sie die bereitgestellten Web-Suchergebnisse, um eine umfassende Antwort auf die gegebene Anfrage zu geben. Stellen Sie sicher, dass Sie die Ergebnisse mit der Notation [[Zahl](URL)] nach der Referenz zitieren. Wenn die bereitgestellten Suchergebnisse auf mehrere Themen mit demselben Namen verweisen, schreiben Sie separate Antworten für jedes Thema.\nAnfrage: {query}",
        "it": "Risultati della ricerca Web:\n\n{risultati_web}\nData corrente: {data_corrente}\n\nIstruzioni: utilizzando i risultati della ricerca Web forniti, scrivere una risposta completa alla query specificata. Assicurati di citare i risultati utilizzando la notazione [[numero](URL)] dopo il riferimento. Se i risultati di ricerca forniti si riferiscono a più argomenti con lo stesso nome, scrivi risposte separate per ogni argomento.\nQuery: {query}",
        "zh": "网络搜索结果:\n\n{web_results}\n当前日期: {current_date}\n\n说明: 使用提供的网络搜索结果，对给定的查询进行综合回复。 确保在参考文献后使用 [[数字](URL)] 符号来引用结果。 如果提供的搜索结果涉及同名的多个主题，请为每个主题分别写下答案。\n查询: {query}",
        "ja": "Web 検索結果:\n\n{web_results}\n現在の日付: {current_date}\n\n指示: 提供された Web 検索結果を使用して、指定されたクエリに対する包括的な回答を作成します。 参考文献の後に必ず[[数字](URL)]表記で結果を引用してください。 提供された検索結果が同じ名前の複数の件名を参照している場合は、件名ごとに個別の回答を記述してください。\nクエリ: {query}",
        "ko": "웹 검색 결과:\n\n{web_results}\n현재 날짜: {current_date}\n\n지침: 제공된 웹 검색 결과를 사용하여 주어진 쿼리에 대한 포괄적인 회신을 작성합니다. 반드시 [[숫자](URL)] 표기를 사용하여 결과를 인용한다. 제공된 검색 결과가 동일한 이름을 가진 여러 주제를 참조하는 경우 각 주제에 대해 별도의 답변을 작성하십시오.\n쿼리: {query}"
    },
    "language": {
        "en": "Language",
        "pt": "Idioma",
        "es": "Idioma",
        "fr": "Langue",
        "de": "Sprache",
        "it": "Lingua",
        "zh": "语言",
        "ja": "言語",
        "ko": "언어"
    },
    "choose_language": {
        "en": "Choose language",
        "pt": "Escolha o idioma",
        "es": "Elegir idioma",
        "fr": "Choisir la langue",
        "de": "Sprache auswählen",
        "it": "Scegli la lingua",
        "zh": "选择语言",
        "ja": "言語を選択",
        "ko": "언어 선택"
    },
    "support_this_project": {
        "en": "Support this project",
        "pt": "Apoie este projeto",
        "es": "Apoya este proyecto",
        "fr": "Soutenez ce projet",
        "de": "Unterstützen Sie dieses Projekt",
        "it": "Sostieni questo progetto",
        "zh": "支持此项目",
        "ja": "このプロジェクトを支援",
        "ko": "이 프로젝트 지원"
    },
    "save": {
        "en": "Save",
        "pt": "Salvar",
        "es": "Guardar",
        "fr": "Enregistrer",
        "de": "Speichern",
        "it": "Salva",
        "zh": "保存",
        "ja": "保存",
        "ko": "저장"
    },
    "new_prompt": {
        "en": "New prompt",
        "pt": "Novo prompt",
        "es": "Nuevo prompt",
        "fr": "Nouveau prompt",
        "de": "Neues Prompt",
        "it": "Nuovo prompt",
        "zh": "新提示",
        "ja": "新しいプロンプト",
        "ko": "새로운 프롬프트"
    },
    "name_placeholder": {
        "en": "Name",
        "pt": "Nome",
        "es": "Nombre",
        "fr": "Nom",
        "de": "Name",
        "it": "Nome",
        "zh": "名称",
        "ja": "名前",
        "ko": "이름"
    },
    "current_date_placeholder_tip": {
        "en": "Insert placeholder for the current date (optional)",
        "pt": "Insira o espaço reservado para a data atual (opcional)",
        "es": "Ingrese un marcador de posición para la fecha actual (opcional)",
        "fr": "Insérer un marqueur de place pour la date actuelle (facultatif)",
        "de": "Platzhalter für das aktuelle Datum einfügen (optional)",
        "it": "Inserisci il segnaposto per la data attuale (opzionale)",
        "zh": "插入当前日期的占位符（可选）",
        "ja": "現在の日付のプレースホルダーを挿入（任意）",
        "ko": "현재 날짜의 자리 표시자를 삽입 (선택 사항)"
    },
    "web_results_placeholder_tip": {
        "en": "Insert placeholder for the web results (required)",
        "pt": "Insira o espaço reservado para os resultados da pesquisa na web (obrigatório)",
        "es": "Ingrese un marcador de posición para los resultados de búsqueda web (requerido)",
        "fr": "Insérer un marqueur de place pour les résultats de recherche web (requis)",
        "de": "Platzhalter für die Web-Ergebnisse einfügen (erforderlich)",
        "it": "Inserisci il segnaposto per i risultati web (richiesto)",
        "zh": "插入网络搜索结果的占位符（必需）",
        "ja": "Web結果のプレースホルダーを挿入（必須）",
        "ko": "웹 검색 결과의 자리 표시자를 삽입 (필수)"
    },
    "query_placeholder_tip": {
        "en": "Insert placeholder for the initial query (required)",
        "pt": "Insira o espaço reservado para a pergunta inicial (obrigatório)",
        "es": "Ingrese un marcador de posición para la consulta inicial (requerido)",
        "fr": "Insérer un marqueur de place pour la requête initiale (requis)",
        "de": "Platzhalter für die ursprüngliche Anfrage einfügen (erforderlich)",
        "it": "Inserisci il segnaposto per la query iniziale (richiesto)",
        "zh": "插入初始查询的占位符（必需）",
        "ja": "初期クエリのプレースホルダーを挿入（必須）",
        "ko": "초기 쿼리의 자리 표시자를 삽입 (필수)"
    },
    "twitter_button_tip": {
        "en": "Follow me on Twitter",
        "pt": "Siga-me no Twitter",
        "es": "Sígueme en Twitter",
        "fr": "Me suivre sur Twitter",
        "de": "Folgen Sie mir auf Twitter",
        "it": "Seguimi su Twitter",
        "zh": "在 Twitter 上关注我",
        "ja": "Twitterで私をフォロー",
        "ko": "Twitter에서 나를 팔로우하세요"
    },
    "github_button_tip": {
        "en": "View the source code on GitHub",
        "pt": "Veja o código fonte no GitHub",
        "es": "Ver el código fuente en GitHub",
        "fr": "Voir le code source sur GitHub",
        "de": "Quellcode auf GitHub anzeigen",
        "it": "Visualizza il codice sorgente su GitHub",
        "zh": "在 GitHub 上查看源代码",
        "ja": "GitHub上のソースコードを見る",
        "ko": "GitHub에서 소스 코드 보기"
    },
    "discord_button_tip": {
        "en": "Join our Discord community",
        "pt": "Junte-se à nossa comunidade no Discord",
        "es": "Únete a nuestra comunidad de Discord",
        "fr": "Rejoignez notre communauté Discord",
        "de": "Treten Sie unserer Discord-Community bei",
        "it": "Unisciti alla nostra comunità su Discord",
        "zh": "加入我们的 Discord 社区",
        "ja": "私たちのDiscordコミュニティに参加してください",
        "ko": "우리의 Discord 커뮤니티에 가입하세요"
    }
}
