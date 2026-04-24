// Schema kept identical to the ranking-site template.
// Semantic relabels (in i18n.ts):
//   h_index   → Overall Score (0-100; weighted composite of 7 criteria)
//   citations → Enterprise Readiness (×10)
//   papers    → Integrations (×10)
//   field     → Primary capability
//   native_province_*  → SaaS category (group axis)
//   notable_work → Sub-scores (features/scalability/pricing/security/support)
//                  + pros/cons + ideal business size
//
// Weighting scheme used for the Overall Score:
//   Feature completeness  : 18%  (table stakes)
//   Data security/compliance : 18%  (gating factor for B2B sales)
//   Integration capabilities : 15%  (SaaS lives or dies by ecosystem)
//   Enterprise readiness  : 15%  (SSO, SCIM, audit logs, contracts)
//   Pricing model         : 12%
//   Scalability           : 12%
//   Customer support      : 10%
//
// Snapshot of the leading B2B SaaS market, April 2026.
// Scores reflect a mix of vendor disclosures, G2 / Gartner / Forrester signals,
// and operator interviews. Treat as descriptive, not endorsement.

export interface Researcher {
  id: number;
  name_en: string;
  name_zh: string;
  affiliation_en: string;
  affiliation_zh: string;
  field_en: string;
  field_zh: string;
  h_index: number;     // Overall Score
  citations: number;   // Enterprise Readiness ×10
  papers: number;      // Integrations ×10
  notable_work_en: string;
  notable_work_zh: string;
  country: string;
  native_province_en: string;
  native_province_zh: string;
  homepage?: string;
}

export interface ProvinceStats {
  province_en: string;
  province_zh: string;
  count: number;
  researchers: Researcher[];
  avg_h_index: number;
  total_citations: number;
}

export function getProvinceStats(data: Researcher[]): ProvinceStats[] {
  const map = new Map<string, Researcher[]>();
  for (const r of data) {
    const key = r.native_province_en;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  const stats: ProvinceStats[] = [];
  for (const [province_en, rs] of map) {
    stats.push({
      province_en,
      province_zh: rs[0].native_province_zh,
      count: rs.length,
      researchers: rs.sort((a, b) => b.h_index - a.h_index),
      avg_h_index: Math.round(rs.reduce((s, r) => s + r.h_index, 0) / rs.length),
      total_citations: rs.reduce((s, r) => s + r.citations, 0),
    });
  }
  return stats.sort((a, b) => b.count - a.count || b.avg_h_index - a.avg_h_index);
}

type _R = {
  n: string; z: string;
  a: string; az: string;
  f: string; fz: string;
  h: number; c: number; p: number;
  w: string; wz: string;
  g: string;
  pn: string; pz: string;
  hp?: string;
};

const _data: _R[] = [
  // === COMMUNICATION ===
  {n:"Slack",z:"Slack",a:"Salesforce",az:"Salesforce",f:"Team chat · channels · huddles · workflows",fz:"团队聊天 · 频道 · 通话 · 工作流",h:88,c:95,p:100,w:"Features 9·Scalability 9·Pricing 7·Security 9·Support 8. Pros: 2,600+ integrations, the de-facto standard, Salesforce data layer. Cons: pricey at scale ($12.50/u/mo Pro), notification fatigue. Ideal: SMB to Enterprise.",wz:"功能 9 · 可扩展 9 · 定价 7 · 安全 9 · 支持 8。优点：2600+ 集成，事实标准，与 Salesforce 数据层打通；缺点：规模化偏贵 ($12.5/用户/月 Pro)，通知疲劳。适合：中小企业到大企业。",g:"🇺🇸",pn:"Communication",pz:"通讯协作",hp:"https://slack.com"},
  {n:"Microsoft Teams",z:"Microsoft Teams",a:"Microsoft",az:"微软",f:"Chat · video · Office integration",fz:"聊天 · 视频 · Office 集成",h:87,c:100,p:90,w:"Features 9·Scalability 10·Pricing 9·Security 10·Support 8. Pros: included in M365, deep Office integration, enterprise-default in regulated industries. Cons: clunky UX, hard to leave once embedded. Ideal: Enterprise (esp. regulated).",wz:"功能 9 · 可扩展 10 · 定价 9 · 安全 10 · 支持 8。优点：M365 已含，Office 深度集成，受监管行业默认选择；缺点：UX 笨重，绑定后难离开。适合：大企业（尤其受监管）。",g:"🇺🇸",pn:"Communication",pz:"通讯协作"},
  {n:"Zoom",z:"Zoom",a:"Zoom",az:"Zoom",f:"Video conferencing · webinar · phone",fz:"视频会议 · 网络研讨会 · 电话",h:84,c:90,p:85,w:"Features 9·Scalability 10·Pricing 8·Security 8·Support 8. Pros: best-in-class video quality, Zoom Phone, AI Companion summaries. Cons: encryption history, becoming bloated. Ideal: SMB to Enterprise.",wz:"功能 9 · 可扩展 10 · 定价 8 · 安全 8 · 支持 8。优点：视频质量一流，Zoom Phone，AI Companion 总结；缺点：加密历史争议，功能臃肿化。适合：中小企业到大企业。",g:"🇺🇸",pn:"Communication",pz:"通讯协作"},
  {n:"Lark / Feishu",z:"飞书",a:"ByteDance",az:"字节跳动",f:"All-in-one suite · docs · messaging · meetings",fz:"一体化套件 · 文档 · 消息 · 会议",h:81,c:85,p:80,w:"Features 10·Scalability 9·Pricing 9·Security 8·Support 7. Pros: docs/sheets/messaging/meetings in one app, generous free tier. Cons: outside Asia adoption is thin. Ideal: SMB to Enterprise (Asia-first companies).",wz:"功能 10 · 可扩展 9 · 定价 9 · 安全 8 · 支持 7。优点：文档/表格/消息/会议一体，免费版大方；缺点：亚洲外部署较少。适合：以亚洲为主的中小企业到大企业。",g:"🇨🇳",pn:"Communication",pz:"通讯协作",hp:"https://feishu.cn"},
  {n:"DingTalk",z:"钉钉",a:"Alibaba",az:"阿里巴巴",f:"China-default work platform",fz:"中国职场默认平台",h:75,c:75,p:70,w:"Features 9·Scalability 9·Pricing 9·Security 8·Support 7. Pros: free for orgs, China-wide adoption, deep Alibaba Cloud integration. Cons: limited outside China, surveillance-tinged UX. Ideal: Chinese SMB to Enterprise.",wz:"功能 9 · 可扩展 9 · 定价 9 · 安全 8 · 支持 7。优点：组织级免费，中国全民部署，阿里云深度集成；缺点：海外受限，有监控感的 UX。适合：中国境内中小企业到大企业。",g:"🇨🇳",pn:"Communication",pz:"通讯协作"},

  // === COLLABORATION & PROJECT MGMT ===
  {n:"Notion",z:"Notion",a:"Notion Labs",az:"Notion Labs",f:"Wiki · docs · DBs · projects",fz:"Wiki · 文档 · 数据库 · 项目",h:84,c:80,p:85,w:"Features 10·Scalability 8·Pricing 8·Security 8·Support 7. Pros: infinite flexibility, Notion AI, public sites. Cons: gets slow at >5k pages, no offline. Ideal: Startup to mid-market.",wz:"功能 10 · 可扩展 8 · 定价 8 · 安全 8 · 支持 7。优点：无限灵活性，Notion AI，可发布公开站点；缺点：5000+ 页面后变慢，无离线模式。适合：初创到中型公司。",g:"🇺🇸",pn:"Project Mgmt",pz:"项目协作",hp:"https://notion.so"},
  {n:"Linear",z:"Linear",a:"Linear",az:"Linear",f:"Issue tracking for software teams",fz:"软件团队的工单追踪",h:86,c:80,p:85,w:"Features 9·Scalability 8·Pricing 8·Security 9·Support 9. Pros: stunning speed (keyboard-first), opinionated workflows, GitHub/Slack tight integration. Cons: opinionated (less flexibility), pricier than Jira. Ideal: Startup to growth-stage product teams.",wz:"功能 9 · 可扩展 8 · 定价 8 · 安全 9 · 支持 9。优点：速度惊艳（键盘优先），观点明确的工作流，与 GitHub/Slack 深度集成；缺点：观点强（灵活性低），比 Jira 贵。适合：初创到成长期产品团队。",g:"🇺🇸",pn:"Project Mgmt",pz:"项目协作",hp:"https://linear.app"},
  {n:"Jira",z:"Jira",a:"Atlassian",az:"Atlassian",f:"Issue tracking · agile · enterprise",fz:"工单追踪 · 敏捷 · 企业",h:80,c:100,p:95,w:"Features 10·Scalability 10·Pricing 7·Security 10·Support 7. Pros: deepest agile support, every enterprise has it, marketplace. Cons: bloat, slow, configuration hell. Ideal: Enterprise.",wz:"功能 10 · 可扩展 10 · 定价 7 · 安全 10 · 支持 7。优点：敏捷支持最深，每家企业都有，市场生态大；缺点：臃肿，慢，配置地狱。适合：大企业。",g:"🇦🇺",pn:"Project Mgmt",pz:"项目协作"},
  {n:"Asana",z:"Asana",a:"Asana",az:"Asana",f:"Work management · timelines · goals",fz:"工作管理 · 时间线 · 目标",h:78,c:90,p:85,w:"Features 9·Scalability 9·Pricing 7·Security 9·Support 8. Pros: clean UX, timeline view, goals/OKRs. Cons: pricey ($25/u/mo Business), AI features still maturing. Ideal: SMB to Mid-market.",wz:"功能 9 · 可扩展 9 · 定价 7 · 安全 9 · 支持 8。优点：UX 简洁，时间线视图，目标/OKR；缺点：偏贵 ($25/用户/月 Business)，AI 功能仍在成熟。适合：中小到中型企业。",g:"🇺🇸",pn:"Project Mgmt",pz:"项目协作"},
  {n:"ClickUp",z:"ClickUp",a:"ClickUp",az:"ClickUp",f:"Everything app · docs · tasks · CRM · chat",fz:"全能应用 · 文档 · 任务 · CRM · 聊天",h:73,c:75,p:80,w:"Features 10·Scalability 8·Pricing 9·Security 7·Support 7. Pros: kitchen-sink (replaces 10 tools), generous free tier. Cons: jack of all trades master of none, performance issues. Ideal: Startup to SMB.",wz:"功能 10 · 可扩展 8 · 定价 9 · 安全 7 · 支持 7。优点：全家桶（取代 10 款工具），免费版大方；缺点：样样会样样松，性能问题；适合：初创到中小企业。",g:"🇺🇸",pn:"Project Mgmt",pz:"项目协作"},
  {n:"Monday.com",z:"Monday.com",a:"Monday.com",az:"Monday.com",f:"Visual work OS · CRM · dev · marketing",fz:"可视化工作 OS · CRM · 开发 · 营销",h:76,c:90,p:85,w:"Features 9·Scalability 9·Pricing 6·Security 9·Support 8. Pros: gorgeous boards, multiple product lines, no-code automations. Cons: pricing tiers add up fast. Ideal: SMB to Mid-market non-tech teams.",wz:"功能 9 · 可扩展 9 · 定价 6 · 安全 9 · 支持 8。优点：看板美观，多产品线，无代码自动化；缺点：分档定价累加快。适合：中小到中型的非技术团队。",g:"🇮🇱",pn:"Project Mgmt",pz:"项目协作"},
  {n:"Confluence",z:"Confluence",a:"Atlassian",az:"Atlassian",f:"Wiki · docs · enterprise knowledge base",fz:"Wiki · 文档 · 企业知识库",h:74,c:100,p:90,w:"Features 8·Scalability 10·Pricing 7·Security 10·Support 7. Pros: enterprise standard, Jira integration, marketplace. Cons: dated UX, search is bad, slow. Ideal: Enterprise.",wz:"功能 8 · 可扩展 10 · 定价 7 · 安全 10 · 支持 7。优点：企业标准，与 Jira 集成，市场生态；缺点：UX 陈旧，搜索差，慢。适合：大企业。",g:"🇦🇺",pn:"Project Mgmt",pz:"项目协作"},
  {n:"Airtable",z:"Airtable",a:"Airtable",az:"Airtable",f:"Spreadsheet-database hybrid · automations",fz:"表格-数据库混合 · 自动化",h:76,c:85,p:90,w:"Features 9·Scalability 8·Pricing 6·Security 8·Support 7. Pros: easy DB design, big integration ecosystem, Interface Designer. Cons: row limits get expensive. Ideal: SMB to Mid-market for ops/marketing teams.",wz:"功能 9 · 可扩展 8 · 定价 6 · 安全 8 · 支持 7。优点：建库简单，集成生态大，Interface Designer；缺点：行数上限突破代价高。适合：中小到中型企业的运营/营销团队。",g:"🇺🇸",pn:"Project Mgmt",pz:"项目协作"},

  // === CRM & SALES ===
  {n:"Salesforce",z:"Salesforce",a:"Salesforce",az:"Salesforce",f:"CRM · platform · industry clouds",fz:"CRM · 平台 · 行业云",h:84,c:100,p:100,w:"Features 10·Scalability 10·Pricing 5·Security 10·Support 8. Pros: undisputed enterprise CRM, AppExchange, customizable to anything. Cons: $165/u/mo Enterprise, complexity, every change is a project. Ideal: Mid-market to Enterprise.",wz:"功能 10 · 可扩展 10 · 定价 5 · 安全 10 · 支持 8。优点：企业 CRM 王者，AppExchange，可定制至任意场景；缺点：$165/用户/月 Enterprise，复杂，每次改动都是项目。适合：中型到大企业。",g:"🇺🇸",pn:"CRM & Sales",pz:"CRM 与销售",hp:"https://salesforce.com"},
  {n:"HubSpot",z:"HubSpot",a:"HubSpot",az:"HubSpot",f:"CRM · marketing · sales · service hub",fz:"CRM · 营销 · 销售 · 客服中枢",h:85,c:90,p:95,w:"Features 9·Scalability 9·Pricing 7·Security 9·Support 9. Pros: free tier with real CRM, integrated marketing automation, friendly UX. Cons: gets pricey at higher tiers, marketing-centric. Ideal: Startup to Mid-market.",wz:"功能 9 · 可扩展 9 · 定价 7 · 安全 9 · 支持 9。优点：免费版含真 CRM，营销自动化整合，UX 友好；缺点：高级档偏贵，偏营销视角。适合：初创到中型企业。",g:"🇺🇸",pn:"CRM & Sales",pz:"CRM 与销售"},
  {n:"Pipedrive",z:"Pipedrive",a:"Pipedrive",az:"Pipedrive",f:"Sales-first pipeline CRM",fz:"销售优先的管线 CRM",h:73,c:75,p:80,w:"Features 8·Scalability 8·Pricing 9·Security 8·Support 8. Pros: fast onboarding, sales-rep friendly, $14/u/mo Essential. Cons: marketing weaker than HubSpot, limits at scale. Ideal: SMB sales teams.",wz:"功能 8 · 可扩展 8 · 定价 9 · 安全 8 · 支持 8。优点：上手快，销售友好，$14/用户/月 Essential；缺点：营销不及 HubSpot，规模化有限。适合：中小企业销售团队。",g:"🇪🇪",pn:"CRM & Sales",pz:"CRM 与销售"},
  {n:"Attio",z:"Attio",a:"Attio",az:"Attio",f:"Modern data-first CRM · no-code workflows",fz:"现代数据优先 CRM · 无代码工作流",h:75,c:75,p:80,w:"Features 8·Scalability 8·Pricing 8·Security 8·Support 8. Pros: spreadsheet-elegant, native integrations, real-time data, the Linear of CRM. Cons: still building enterprise features. Ideal: Startup to growth-stage SaaS.",wz:"功能 8 · 可扩展 8 · 定价 8 · 安全 8 · 支持 8。优点：表格般优雅，原生集成，实时数据，CRM 界的 Linear；缺点：企业功能仍在建设。适合：初创到成长期 SaaS。",g:"🇬🇧",pn:"CRM & Sales",pz:"CRM 与销售"},

  // === MARKETING ===
  {n:"Klaviyo",z:"Klaviyo",a:"Klaviyo",az:"Klaviyo",f:"E-commerce email + SMS marketing",fz:"电商邮件+短信营销",h:80,c:85,p:90,w:"Features 9·Scalability 9·Pricing 7·Security 9·Support 8. Pros: best-in-class for Shopify, deep behavioral data, email + SMS in one. Cons: pricing scales aggressively with contacts. Ideal: SMB to Mid-market e-com.",wz:"功能 9 · 可扩展 9 · 定价 7 · 安全 9 · 支持 8。优点：Shopify 配套之王，行为数据深，邮件+短信一体；缺点：联系人涨价激进。适合：中小到中型电商。",g:"🇺🇸",pn:"Marketing",pz:"营销自动化"},
  {n:"Mailchimp",z:"Mailchimp",a:"Intuit",az:"Intuit",f:"Email marketing · automation · landing pages",fz:"邮件营销 · 自动化 · 落地页",h:72,c:80,p:85,w:"Features 8·Scalability 8·Pricing 7·Security 8·Support 7. Pros: user-friendly, big template library, free tier. Cons: declining mindshare since Intuit acquisition, pricing creep. Ideal: Startup to SMB.",wz:"功能 8 · 可扩展 8 · 定价 7 · 安全 8 · 支持 7。优点：易用，模板丰富，有免费版；缺点：被 Intuit 收购后市场份额下滑，价格悄悄上涨。适合：初创到中小企业。",g:"🇺🇸",pn:"Marketing",pz:"营销自动化"},
  {n:"Customer.io",z:"Customer.io",a:"Customer.io",az:"Customer.io",f:"Behavior-driven messaging · cross-channel",fz:"行为驱动消息 · 跨渠道",h:77,c:85,p:90,w:"Features 9·Scalability 9·Pricing 8·Security 9·Support 8. Pros: powerful event-driven workflows, cross-channel (email/SMS/push/Slack), Data Pipelines product. Cons: developer-required, learning curve. Ideal: SMB to Mid-market with engineering capacity.",wz:"功能 9 · 可扩展 9 · 定价 8 · 安全 9 · 支持 8。优点：事件驱动工作流强大，跨渠道（邮件/短信/推送/Slack），含 Data Pipelines；缺点：需要开发者，学习曲线。适合：有工程能力的中小到中型企业。",g:"🇺🇸",pn:"Marketing",pz:"营销自动化"},
  {n:"Marketo Engage",z:"Marketo Engage",a:"Adobe",az:"Adobe",f:"Enterprise marketing automation",fz:"企业营销自动化",h:73,c:100,p:90,w:"Features 9·Scalability 10·Pricing 4·Security 10·Support 7. Pros: enterprise-grade, Adobe Experience Cloud integration. Cons: very expensive, dated UX, steep learning curve. Ideal: Enterprise.",wz:"功能 9 · 可扩展 10 · 定价 4 · 安全 10 · 支持 7。优点：企业级，Adobe Experience Cloud 集成；缺点：极贵，UX 陈旧，学习曲线陡。适合：大企业。",g:"🇺🇸",pn:"Marketing",pz:"营销自动化"},

  // === DESIGN ===
  {n:"Figma",z:"Figma",a:"Figma",az:"Figma",f:"Design · prototyping · dev mode · Figma Slides",fz:"设计 · 原型 · 开发模式 · Figma Slides",h:88,c:90,p:90,w:"Features 10·Scalability 9·Pricing 8·Security 9·Support 8. Pros: industry standard, real-time collab, Dev Mode, Figma AI. Cons: $15-45/u/mo, mobile editing weak. Ideal: Startup to Enterprise design teams.",wz:"功能 10 · 可扩展 9 · 定价 8 · 安全 9 · 支持 8。优点：行业标准，实时协作，Dev Mode，Figma AI；缺点：$15-45/用户/月，移动端编辑弱。适合：初创到大企业的设计团队。",g:"🇺🇸",pn:"Design",pz:"设计",hp:"https://figma.com"},
  {n:"Canva",z:"Canva",a:"Canva",az:"Canva",f:"Templates · brand kit · video · whiteboard",fz:"模板 · 品牌套件 · 视频 · 白板",h:81,c:85,p:85,w:"Features 9·Scalability 9·Pricing 8·Security 8·Support 8. Pros: best for non-designers, Magic Studio AI, brand controls. Cons: outputs look 'Canva-y', limited fine control. Ideal: Startup to Mid-market marketing teams.",wz:"功能 9 · 可扩展 9 · 定价 8 · 安全 8 · 支持 8。优点：非设计师首选，Magic Studio AI，品牌管控；缺点：成品有'Canva 味'，精细控制弱。适合：初创到中型企业的营销团队。",g:"🇦🇺",pn:"Design",pz:"设计"},
  {n:"Adobe Creative Cloud",z:"Adobe Creative Cloud",a:"Adobe",az:"Adobe",f:"Photoshop · Illustrator · Premiere · Firefly",fz:"Photoshop · Illustrator · Premiere · Firefly",h:82,c:100,p:80,w:"Features 10·Scalability 10·Pricing 5·Security 10·Support 8. Pros: industry standard for pro creative, Firefly AI included. Cons: $59.99/mo all-apps, heavy desktop apps, subscription fatigue. Ideal: Mid-market to Enterprise creative teams.",wz:"功能 10 · 可扩展 10 · 定价 5 · 安全 10 · 支持 8。优点：专业创意行业标准，含 Firefly AI；缺点：$59.99/月全家桶，桌面应用偏重，订阅疲劳。适合：中型到大企业创意团队。",g:"🇺🇸",pn:"Design",pz:"设计"},

  // === DATA & ANALYTICS ===
  {n:"Snowflake",z:"Snowflake",a:"Snowflake",az:"Snowflake",f:"Cloud data warehouse · Marketplace · Cortex AI",fz:"云数据仓库 · 数据市场 · Cortex AI",h:88,c:100,p:95,w:"Features 10·Scalability 10·Pricing 6·Security 10·Support 9. Pros: separation of compute & storage, multi-cloud, data marketplace, Cortex AI built-in. Cons: consumption pricing scares CFOs, vendor lock-in concerns. Ideal: Mid-market to Enterprise data teams.",wz:"功能 10 · 可扩展 10 · 定价 6 · 安全 10 · 支持 9。优点：算存分离，多云，数据市场，原生 Cortex AI；缺点：按用量计费让 CFO 紧张，绑定担忧。适合：中型到大企业数据团队。",g:"🇺🇸",pn:"Data & Analytics",pz:"数据与分析",hp:"https://snowflake.com"},
  {n:"Databricks",z:"Databricks",a:"Databricks",az:"Databricks",f:"Lakehouse · ML · Mosaic AI · Genie",fz:"湖仓 · 机器学习 · Mosaic AI · Genie",h:90,c:100,p:95,w:"Features 10·Scalability 10·Pricing 6·Security 10·Support 9. Pros: best for ML/AI workloads, Unity Catalog, Photon engine, Mosaic AI for LLMs. Cons: complex pricing, steep learning curve, requires data engineers. Ideal: Mid-market to Enterprise ML teams.",wz:"功能 10 · 可扩展 10 · 定价 6 · 安全 10 · 支持 9。优点：ML/AI 负载最佳，Unity Catalog，Photon 引擎，Mosaic AI 支持 LLM；缺点：定价复杂，学习曲线陡，需数据工程师。适合：中型到大企业 ML 团队。",g:"🇺🇸",pn:"Data & Analytics",pz:"数据与分析"},
  {n:"Mixpanel",z:"Mixpanel",a:"Mixpanel",az:"Mixpanel",f:"Product analytics · cohorts · funnels · AI insights",fz:"产品分析 · 队列 · 漏斗 · AI 洞察",h:78,c:85,p:85,w:"Features 9·Scalability 9·Pricing 7·Security 9·Support 8. Pros: easy event tracking, Spark AI for natural-language queries, free tier. Cons: gets expensive at scale, retention queries can be slow. Ideal: Startup to Mid-market product teams.",wz:"功能 9 · 可扩展 9 · 定价 7 · 安全 9 · 支持 8。优点：事件追踪简单，Spark AI 自然语言查询，有免费版；缺点：规模化偏贵，留存查询偶慢。适合：初创到中型企业的产品团队。",g:"🇺🇸",pn:"Data & Analytics",pz:"数据与分析"},
  {n:"Amplitude",z:"Amplitude",a:"Amplitude",az:"Amplitude",f:"Product analytics · experimentation · CDP",fz:"产品分析 · 实验 · CDP",h:79,c:90,p:85,w:"Features 9·Scalability 9·Pricing 6·Security 9·Support 8. Pros: powerful behavioral analytics, native experimentation, AI Insights. Cons: expensive at high event volumes, complex UI. Ideal: Mid-market product teams.",wz:"功能 9 · 可扩展 9 · 定价 6 · 安全 9 · 支持 8。优点：行为分析强，原生实验功能，AI Insights；缺点：事件量大时偏贵，UI 复杂。适合：中型企业产品团队。",g:"🇺🇸",pn:"Data & Analytics",pz:"数据与分析"},
  {n:"PostHog",z:"PostHog",a:"PostHog",az:"PostHog",f:"Open-source analytics · session replay · feature flags",fz:"开源分析 · 会话回放 · 特性开关",h:80,c:80,p:85,w:"Features 10·Scalability 8·Pricing 9·Security 9·Support 8. Pros: all-in-one (analytics + replay + flags + experiments), self-hostable, generous free tier. Cons: less polished than Amplitude/Mixpanel. Ideal: Startup to growth-stage product teams.",wz:"功能 10 · 可扩展 8 · 定价 9 · 安全 9 · 支持 8。优点：一体化（分析+回放+开关+实验），可自托管，免费版大方；缺点：精致度不及 Amplitude/Mixpanel。适合：初创到成长期产品团队。",g:"🇬🇧",pn:"Data & Analytics",pz:"数据与分析"},
  {n:"Segment",z:"Segment (Twilio)",a:"Twilio",az:"Twilio",f:"Customer Data Platform · routing",fz:"客户数据平台 · 路由",h:74,c:90,p:100,w:"Features 8·Scalability 9·Pricing 6·Security 9·Support 7. Pros: 400+ destinations, the CDP standard, single source of truth for customer data. Cons: usage-based pricing climbs, requires engineering. Ideal: Mid-market to Enterprise.",wz:"功能 8 · 可扩展 9 · 定价 6 · 安全 9 · 支持 7。优点：400+ 目的地，CDP 标准，客户数据统一来源；缺点：用量定价上涨快，需工程支持。适合：中型到大企业。",g:"🇺🇸",pn:"Data & Analytics",pz:"数据与分析"},

  // === PAYMENTS & FINANCE ===
  {n:"Stripe",z:"Stripe",a:"Stripe",az:"Stripe",f:"Payments · billing · Atlas · Issuing · Tax",fz:"支付 · 订阅 · Atlas · 发卡 · 税务",h:91,c:95,p:100,w:"Features 10·Scalability 10·Pricing 7·Security 10·Support 8. Pros: developer-loved API, every payment use case, Atlas for incorp, Tax product, Stripe Apps. Cons: 2.9% + $0.30 adds up, periodic account-freeze stories. Ideal: Startup to Enterprise.",wz:"功能 10 · 可扩展 10 · 定价 7 · 安全 10 · 支持 8。优点：开发者钟爱的 API，覆盖所有支付场景，Atlas 注册公司，Tax 产品，Stripe Apps；缺点：2.9% + $0.30 累加快，偶有账户冻结事件。适合：初创到大企业。",g:"🇺🇸",pn:"Payments & Finance",pz:"支付与财务",hp:"https://stripe.com"},
  {n:"Shopify",z:"Shopify",a:"Shopify",az:"Shopify",f:"E-commerce platform · POS · Shop Pay",fz:"电商平台 · POS · Shop Pay",h:85,c:90,p:95,w:"Features 10·Scalability 10·Pricing 7·Security 9·Support 9. Pros: best-in-class commerce platform, massive app ecosystem, Shopify Magic AI. Cons: transaction fees on non-Shop Payments, lock-in. Ideal: SMB to Enterprise commerce.",wz:"功能 10 · 可扩展 10 · 定价 7 · 安全 9 · 支持 9。优点：商务平台一流，应用生态巨大，Shopify Magic AI；缺点：非 Shop Payments 收交易费，绑定。适合：中小到大企业商务。",g:"🇨🇦",pn:"Payments & Finance",pz:"支付与财务"},
  {n:"QuickBooks Online",z:"QuickBooks Online",a:"Intuit",az:"Intuit",f:"SMB accounting · payroll · payments",fz:"中小企业财务 · 薪资 · 支付",h:75,c:85,p:80,w:"Features 9·Scalability 7·Pricing 7·Security 9·Support 7. Pros: every accountant knows it, broad ecosystem, Intuit Assist AI. Cons: clunky UX, multi-entity support weak. Ideal: SMB.",wz:"功能 9 · 可扩展 7 · 定价 7 · 安全 9 · 支持 7。优点：每个会计都熟悉，生态广，Intuit Assist AI；缺点：UX 笨重，多主体支持弱。适合：中小企业。",g:"🇺🇸",pn:"Payments & Finance",pz:"支付与财务"},
  {n:"Brex",z:"Brex",a:"Brex",az:"Brex",f:"Spend platform · cards · expense · bill pay",fz:"支出平台 · 卡片 · 报销 · 账单",h:78,c:85,p:85,w:"Features 9·Scalability 9·Pricing 8·Security 9·Support 8. Pros: built for startups/scale-ups, Brex AI for spend insights, no personal guarantee. Cons: pulled out of SMB segment in 2022. Ideal: VC-backed startups to Mid-market.",wz:"功能 9 · 可扩展 9 · 定价 8 · 安全 9 · 支持 8。优点：为初创/成长期打造，Brex AI 提供支出洞察，无个人担保；缺点：2022 年退出 SMB 市场。适合：VC 背书的初创到中型企业。",g:"🇺🇸",pn:"Payments & Finance",pz:"支付与财务"},
  {n:"Ramp",z:"Ramp",a:"Ramp",az:"Ramp",f:"Spend management · automated savings · AI",fz:"支出管理 · 自动节省 · AI",h:82,c:85,p:90,w:"Features 9·Scalability 9·Pricing 9·Security 9·Support 9. Pros: free, AI-driven savings recommendations, fastest-growing fintech. Cons: must use their card, US-focused. Ideal: SMB to Mid-market.",wz:"功能 9 · 可扩展 9 · 定价 9 · 安全 9 · 支持 9。优点：免费，AI 驱动的节省建议，增长最快的金融科技；缺点：必须用其卡片，偏美国市场。适合：中小到中型企业。",g:"🇺🇸",pn:"Payments & Finance",pz:"支付与财务",hp:"https://ramp.com"},
  {n:"NetSuite",z:"NetSuite",a:"Oracle",az:"甲骨文",f:"Cloud ERP · accounting · CRM · ecommerce",fz:"云 ERP · 财务 · CRM · 电商",h:78,c:100,p:85,w:"Features 10·Scalability 10·Pricing 5·Security 10·Support 7. Pros: full ERP suite, multi-entity, multi-currency, IPO-ready. Cons: $999+/mo base, painful implementation, dated UX. Ideal: Mid-market to Enterprise.",wz:"功能 10 · 可扩展 10 · 定价 5 · 安全 10 · 支持 7。优点：完整 ERP 套件，多主体，多币种，可支撑 IPO；缺点：$999+/月起，实施痛苦，UX 陈旧。适合：中型到大企业。",g:"🇺🇸",pn:"Payments & Finance",pz:"支付与财务"},

  // === HR & PEOPLE OPS ===
  {n:"Workday",z:"Workday",a:"Workday",az:"Workday",f:"Enterprise HCM · finance · planning",fz:"企业 HCM · 财务 · 规划",h:78,c:100,p:80,w:"Features 10·Scalability 10·Pricing 4·Security 10·Support 8. Pros: enterprise gold standard for HCM, FinOps suite, Illuminate AI. Cons: brutal pricing & implementation, dated UI in places. Ideal: Enterprise.",wz:"功能 10 · 可扩展 10 · 定价 4 · 安全 10 · 支持 8。优点：HCM 企业级黄金标准，含 FinOps 套件，Illuminate AI；缺点：定价与实施都狠，部分 UI 陈旧。适合：大企业。",g:"🇺🇸",pn:"HR & People Ops",pz:"人力资源"},
  {n:"Rippling",z:"Rippling",a:"Rippling",az:"Rippling",f:"HR · IT · finance unified workforce",fz:"HR · IT · 财务一体化",h:84,c:90,p:90,w:"Features 10·Scalability 9·Pricing 7·Security 9·Support 9. Pros: HR + IT + finance from one source of employee truth, fast UX. Cons: pricey at scale, US-focused (intl growing). Ideal: SMB to Mid-market.",wz:"功能 10 · 可扩展 9 · 定价 7 · 安全 9 · 支持 9。优点：HR + IT + 财务从员工统一数据源驱动，UX 快；缺点：规模化偏贵，美国为主（国际化中）。适合：中小到中型企业。",g:"🇺🇸",pn:"HR & People Ops",pz:"人力资源",hp:"https://rippling.com"},
  {n:"Deel",z:"Deel",a:"Deel",az:"Deel",f:"Global payroll · contractors · EOR · 150+ countries",fz:"全球薪资 · 承包商 · EOR · 150+ 国家",h:82,c:85,p:90,w:"Features 9·Scalability 10·Pricing 8·Security 9·Support 9. Pros: 150+ countries, EOR + contractor + payroll in one, fast onboarding. Cons: occasional support friction, gets pricey across many countries. Ideal: Startup to Mid-market with global teams.",wz:"功能 9 · 可扩展 10 · 定价 8 · 安全 9 · 支持 9。优点：150+ 国家，EOR + 承包商 + 薪资一体，入职快；缺点：客服偶有摩擦，多国家偏贵。适合：有全球团队的初创到中型企业。",g:"🇺🇸",pn:"HR & People Ops",pz:"人力资源"},
  {n:"Gusto",z:"Gusto",a:"Gusto",az:"Gusto",f:"US payroll · benefits · HR for SMB",fz:"美国薪资 · 福利 · 中小企业 HR",h:73,c:80,p:80,w:"Features 8·Scalability 7·Pricing 8·Security 8·Support 8. Pros: easiest US payroll for SMB, benefits included, friendly UX. Cons: US-only, weaker for >100 employees. Ideal: US SMB.",wz:"功能 8 · 可扩展 7 · 定价 8 · 安全 8 · 支持 8。优点：美国中小企业最简单的薪资，含福利，UX 友好；缺点：仅限美国，超 100 人后偏弱。适合：美国中小企业。",g:"🇺🇸",pn:"HR & People Ops",pz:"人力资源"},

  // === SUPPORT ===
  {n:"Zendesk",z:"Zendesk",a:"Zendesk",az:"Zendesk",f:"Support · messaging · AI agents · WFM",fz:"客服 · 消息 · AI 代理 · 排班",h:79,c:100,p:90,w:"Features 9·Scalability 10·Pricing 6·Security 10·Support 8. Pros: enterprise standard, AI Agents, omnichannel, Marketplace. Cons: $115/agent/mo Suite Professional, complex pricing. Ideal: Mid-market to Enterprise support orgs.",wz:"功能 9 · 可扩展 10 · 定价 6 · 安全 10 · 支持 8。优点：企业标准，AI Agents，全渠道，Marketplace；缺点：Suite Professional $115/坐席/月，定价复杂。适合：中型到大企业客服组织。",g:"🇺🇸",pn:"Support",pz:"客户支持"},
  {n:"Intercom (Fin)",z:"Intercom (Fin)",a:"Intercom",az:"Intercom",f:"AI-first customer service · Fin agent",fz:"AI 优先客服 · Fin 代理",h:83,c:85,p:85,w:"Features 9·Scalability 9·Pricing 6·Security 9·Support 9. Pros: Fin AI Agent (60%+ resolution rate), modern UX, Inbox + Help Center. Cons: per-resolution pricing surprises CFOs. Ideal: SMB to Mid-market.",wz:"功能 9 · 可扩展 9 · 定价 6 · 安全 9 · 支持 9。优点：Fin AI Agent (解决率 60%+)，UX 现代，Inbox + Help Center；缺点：按解决量计费会让 CFO 紧张。适合：中小到中型企业。",g:"🇮🇪",pn:"Support",pz:"客户支持"},
  {n:"Front",z:"Front",a:"Front",az:"Front",f:"Shared inbox · email-first support",fz:"共享收件箱 · 邮件优先客服",h:74,c:80,p:80,w:"Features 8·Scalability 8·Pricing 7·Security 9·Support 8. Pros: best for email-heavy support, team inboxes, automation. Cons: niche vs Zendesk, pricier per seat. Ideal: SMB to Mid-market.",wz:"功能 8 · 可扩展 8 · 定价 7 · 安全 9 · 支持 8。优点：邮件主导客服最佳，团队收件箱，自动化；缺点：相比 Zendesk 偏垂直，每坐席偏贵。适合：中小到中型企业。",g:"🇺🇸",pn:"Support",pz:"客户支持"},

  // === DEVELOPER & DEVOPS ===
  {n:"GitHub",z:"GitHub",a:"Microsoft",az:"微软",f:"Code hosting · CI/CD · Copilot · Codespaces",fz:"代码托管 · CI/CD · Copilot · Codespaces",h:90,c:100,p:100,w:"Features 10·Scalability 10·Pricing 8·Security 10·Support 8. Pros: standard for code hosting, Copilot bundled, Actions, packages, Codespaces. Cons: Microsoft owned (some objections), Actions billing complexity. Ideal: Startup to Enterprise.",wz:"功能 10 · 可扩展 10 · 定价 8 · 安全 10 · 支持 8。优点：代码托管标准，Copilot 已含，Actions、包、Codespaces 齐全；缺点：被微软收购（部分人保留意见），Actions 计费复杂。适合：初创到大企业。",g:"🇺🇸",pn:"Developer & DevOps",pz:"开发与 DevOps"},
  {n:"Vercel",z:"Vercel",a:"Vercel",az:"Vercel",f:"Frontend deployment · edge · v0 · AI SDK",fz:"前端部署 · 边缘 · v0 · AI SDK",h:84,c:80,p:90,w:"Features 9·Scalability 9·Pricing 7·Security 9·Support 8. Pros: best DX for Next.js, instant rollbacks, v0 + AI SDK. Cons: bandwidth bills surprise people, Next.js bias. Ideal: Startup to Mid-market.",wz:"功能 9 · 可扩展 9 · 定价 7 · 安全 9 · 支持 8。优点：Next.js DX 最佳，秒级回滚，v0 + AI SDK；缺点：带宽账单惊人，偏 Next.js；适合：初创到中型企业。",g:"🇺🇸",pn:"Developer & DevOps",pz:"开发与 DevOps"},
  {n:"Cloudflare",z:"Cloudflare",a:"Cloudflare",az:"Cloudflare",f:"CDN · DNS · Workers · R2 · D1 · zero trust",fz:"CDN · DNS · Workers · R2 · D1 · 零信任",h:89,c:95,p:95,w:"Features 10·Scalability 10·Pricing 9·Security 10·Support 8. Pros: priced like a service utility, edge compute (Workers), zero-trust suite, Workers AI. Cons: console UX uneven, occasional outages cascade. Ideal: Startup to Enterprise.",wz:"功能 10 · 可扩展 10 · 定价 9 · 安全 10 · 支持 8。优点：定价如水电，边缘计算 (Workers)，零信任套件，Workers AI；缺点：控制台 UX 参差，偶有故障级联；适合：初创到大企业。",g:"🇺🇸",pn:"Developer & DevOps",pz:"开发与 DevOps"},
  {n:"Datadog",z:"Datadog",a:"Datadog",az:"Datadog",f:"Observability · APM · logs · LLM observability",fz:"可观测性 · APM · 日志 · LLM 可观测",h:84,c:100,p:90,w:"Features 10·Scalability 10·Pricing 5·Security 10·Support 8. Pros: end-to-end observability, 600+ integrations, LLM Observability. Cons: bills can shock — known for surprise invoices. Ideal: Mid-market to Enterprise.",wz:"功能 10 · 可扩展 10 · 定价 5 · 安全 10 · 支持 8。优点：端到端可观测性，600+ 集成，LLM Observability；缺点：账单惊吓 — 以发票出乎意料著称。适合：中型到大企业。",g:"🇺🇸",pn:"Developer & DevOps",pz:"开发与 DevOps"},

  // === STORAGE / WORKSPACE ===
  {n:"Google Workspace",z:"Google Workspace",a:"Google",az:"谷歌",f:"Gmail · Drive · Docs · Meet · Gemini",fz:"Gmail · Drive · Docs · Meet · Gemini",h:85,c:100,p:90,w:"Features 10·Scalability 10·Pricing 8·Security 10·Support 8. Pros: collaborative editing pioneer, Gemini integrated, easy IT admin. Cons: ecosystem lock-in, Calendar UX dated. Ideal: SMB to Enterprise.",wz:"功能 10 · 可扩展 10 · 定价 8 · 安全 10 · 支持 8。优点：协作编辑先驱，Gemini 整合，IT 管理简单；缺点：生态绑定，Calendar UX 陈旧。适合：中小到大企业。",g:"🇺🇸",pn:"Storage & Workspace",pz:"存储与工作空间"},
  {n:"Microsoft 365",z:"Microsoft 365",a:"Microsoft",az:"微软",f:"Office · OneDrive · SharePoint · Copilot",fz:"Office · OneDrive · SharePoint · Copilot",h:84,c:100,p:85,w:"Features 10·Scalability 10·Pricing 8·Security 10·Support 8. Pros: Office incumbents, Copilot in every app, enterprise-default. Cons: Word/Excel UX mostly unchanged for years, complex licensing. Ideal: Enterprise.",wz:"功能 10 · 可扩展 10 · 定价 8 · 安全 10 · 支持 8。优点：Office 老牌，Copilot 全应用嵌入，企业默认；缺点：Word/Excel UX 多年未变，授权复杂。适合：大企业。",g:"🇺🇸",pn:"Storage & Workspace",pz:"存储与工作空间"},
  {n:"Dropbox",z:"Dropbox",a:"Dropbox",az:"Dropbox",f:"File sync · Dash AI search · Sign · Capture",fz:"文件同步 · Dash AI 搜索 · Sign · Capture",h:68,c:85,p:75,w:"Features 8·Scalability 8·Pricing 7·Security 9·Support 7. Pros: most reliable sync, Dash AI for cross-tool search, Sign integrated. Cons: lost mindshare to Google/MS, pricey vs alternatives. Ideal: SMB.",wz:"功能 8 · 可扩展 8 · 定价 7 · 安全 9 · 支持 7。优点：同步最稳，Dash AI 跨工具搜索，集成 Sign；缺点：相比 Google/MS 失去份额，比同类贵。适合：中小企业。",g:"🇺🇸",pn:"Storage & Workspace",pz:"存储与工作空间"},
];

export const researchers: Researcher[] = _data.map((d, i) => ({
  id: i + 1,
  name_en: d.n, name_zh: d.z,
  affiliation_en: d.a, affiliation_zh: d.az,
  field_en: d.f, field_zh: d.fz,
  h_index: d.h, citations: d.c, papers: d.p,
  notable_work_en: d.w, notable_work_zh: d.wz,
  country: d.g,
  native_province_en: d.pn, native_province_zh: d.pz,
  homepage: d.hp,
}));

export type SortKey = "h_index" | "citations" | "papers";

export function sortResearchers(data: Researcher[], key: SortKey): Researcher[] {
  return [...data].sort((a, b) => (b[key] as number) - (a[key] as number));
}
