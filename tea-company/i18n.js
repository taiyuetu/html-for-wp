/* ==========================================================================
   EVERLEAF TEA INDUSTRIAL GROUP — LANGUAGE SWITCHER (i18n)
   --------------------------------------------------------------------------
   Static-site client-side translation:
   · Dictionary maps normalized English strings → translations (zh bundled).
   · Walks text nodes, plus placeholder / aria-label / data-caption /
     data-template / title attributes.
   · Choice persists in localStorage; switching reloads for a clean state.
   · Add a language: add a dictionary below + one <li data-lang="xx"> option.
   ========================================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'everleaf-lang';

  var LANG_LABELS = { en: 'EN', zh: '中文' };

  var DICT = {
    /* ---------------- zh (简体中文) ---------------- */
    zh: {
      /* Shared chrome */
      'Skip to content': '跳至主要内容',
      'Export Sales Desk — replies within 24 hours': '出口销售部 — 24小时内回复',
      'Tea Industrial Group': '茶叶工业集团',
      'Products': '产品中心',
      'Manufacturing': '生产制造',
      'Process': '加工工艺',
      'Quality': '品质保证',
      'OEM': 'OEM代工',
      'Export': '全球出口',
      'Contact': '联系我们',
      'Request Quotation': '获取报价',
      'Primary': '主导航',
      'Open menu': '打开菜单',
      'Close menu': '关闭菜单',
      'Back to top': '返回顶部',
      'Chat with us on WhatsApp': '在 WhatsApp 上联系我们',
      'Email us': '给我们发邮件',
      'Scan to chat on WhatsApp': '扫码添加 WhatsApp',
      'Breadcrumb': '面包屑导航',
      'Home': '首页',

      /* Header nav menus (mega + dropdowns) */
      'Toggle submenu': '展开子菜单',
      'Product Families': '产品系列',
      'Quick Links': '快捷链接',
      'Full Product Catalogue': '全部产品目录',
      'Need spec sheets or pricing?': '需要规格单或报价？',
      'Replies within 24 hours.': '24小时内回复。',
      'Pan-fired eyebrow leaf — grades 41022 & 9371': '炒青眉形茶 — 等级41022与9371',
      'Temple-ball rolled — grades 3505 & 9372': '珠形卷曲颗粒 — 等级3505与9372',
      'EU 2018/848 · USDA NOP · JAS certified': '欧盟2018/848 · 美国NOP · JAS认证',
      'Five-cycle jasmine scenting': '五次茉莉鲜花窨制',
      'Orthodox Hao Ya A/B & Grades 1–4': '传统工艺 Hao Ya A/B 与等级1–4',
      'Tea-bag grade — mesh 40/60/80': '袋泡茶级 — 40/60/80目',
      'Manufacturing Capability': '生产制造能力',
      '52,000 m² campus · 28,000 MT capacity': '52,000㎡园区 · 年产能28,000公吨',
      'Company Profile': '公司简介',
      '38 years at origin in Huangshan': '扎根黄山产地38年',
      'Facility Gallery': '厂区图库',
      'Campus, lines & process photography': '园区、产线与工艺摄影',
      'Processing Overview': '加工工艺概览',
      'From fresh leaf to export-ready carton': '从鲜叶到出口纸箱',
      'Packaging & Artwork Gallery': '包装与设计图库',
      'Retail pouches, cartons & label artwork': '零售袋、纸箱与标签设计',
      'Spring Crop Report 2026': '2026年春茶报告',
      '2026 Anhui harvest outlook': '2026年安徽收成展望',
      'Audit-ready documentation on every lot': '每批随附可审核文件',
      'Certifications': '认证体系',
      'ISO · HACCP · EU & USDA organic · FDA': 'ISO · HACCP · 欧美有机 · FDA',
      'Laboratory & Testing': '实验室与检测',
      'HPLC & GC-MS screening per batch': '每批经HPLC与GC-MS筛查',
      'Your brand, produced and packed at origin': '您的品牌，产地生产与包装',
      'OEM Process & Timeline': 'OEM流程与周期',
      'Brief → sampling → trial → production': '需求 → 打样 → 试产 → 量产',
      'Request a Sample': '申请样品',
      'Counter-samples in 7–10 days': '7–10天提供对样',
      'Global Export Overview': '全球出口概览',
      '62 markets across six regions': '六大区域 · 62个市场',
      'Export Markets & Regions': '出口市场与区域',
      'Europe · Africa · Middle East · Asia & more': '欧洲 · 非洲 · 中东 · 亚洲等',
      'Incoterms & Documentation': '贸易条款与单证',
      'FOB / CIF / DDP with full document sets': 'FOB / CIF / DDP 全套单证',
      'Contact & Inquiry': '联系与询盘',
      'Quotes, samples & documentation': '报价、样品与文件支持',
      'News & Market Insights': '新闻与市场洞察',
      'Crop reports, trade shows & updates': '收成报告、展会与动态',
      'Search the Site': '搜索本站',
      'Find grades, products & topics': '查找等级、产品与主题',

      /* Header search dropdown */
      'Search the site': '搜索本站',
      'Search grades, products or topics — e.g. 41022, organic, MOQ': '搜索等级、产品或主题 — 如 41022、有机、MOQ',
      'Search': '搜索',
      'Popular:': '热门搜索：',
      'Grade 41022': '珍眉 41022',
      'Organic': '有机',
      'MOQ & Samples': 'MOQ与样品',

      /* Footer (shared) */
      'Manufacturing and exporting premium Chinese green tea in bulk since 1987 — 28,000 MT annual capacity, OEM & private-label programmes and audit-ready quality systems for importers in 62 countries.': '自1987年起批量生产并出口优质中国绿茶 — 年产能28,000公吨，提供OEM与贴牌定制项目，以可审核的质量体系服务62个国家的进口商。',
      'EU Organic': '欧盟有机认证',
      'USDA NOP': '美国NOP有机认证',
      'Chunmee Green Tea': '珍眉绿茶',
      'Gunpowder Green Tea': '珠茶绿茶',
      'Organic Green Tea': '有机绿茶',
      'Jasmine Green Tea': '茉莉花绿茶',
      'Keemun Black Tea': '祁门红茶',
      'Green Tea Fannings': '绿茶片茶',
      'Company': '公司信息',
      'About Us': '关于我们',
      'Quality Assurance': '品质保证',
      'OEM & Private Label': 'OEM与贴牌定制',
      'News & Insights': '新闻资讯',
      'Image Library': '图片资料库',
      'Tea Industrial Park,': '茶叶产业园，',
      'Huangshan City, Anhui 245000, China': '中国安徽省黄山市 245000',
      'Mon–Sat · 8:30–18:30 (GMT+8)': '周一至周六 · 8:30–18:30（GMT+8）',
      'Everleaf Tea Industrial Group Co., Ltd. All rights reserved.': 'Everleaf茶叶工业集团有限公司 版权所有。',
      'Privacy Policy': '隐私政策',
      'Terms of Trade': '贸易条款',
      'Made at origin — Huangshan, Anhui': '原产地制造 — 安徽黄山',

      /* Index · hero */
      'Est. 1987 · Huangshan, Anhui — China': '始于1987年 · 中国安徽黄山',
      'Premium Chinese Green Tea Manufacturer & Global Export Partner': '优质中国绿茶制造商与全球出口合作伙伴',
      'Everleaf Tea Group manufactures and exports Chunmee, Gunpowder and certified organic green tea in bulk — 28,000 MT of annual capacity, full OEM support and EU-compliant quality systems for importers in 62 countries.': 'Everleaf茶业集团批量生产并出口珍眉、珠茶及认证有机绿茶 — 年产能28,000公吨，为62个国家的进口商提供完整OEM支持与符合欧盟标准的质量体系。',
      'OEM & Private Label': 'OEM与贴牌定制',
      'Bulk Container Supply': '整柜批量供货',
      'EU & USDA Organic Lines': '欧盟与美国有机认证产线',
      'View Products': '浏览产品',
      'Hero · Spring tea terraces at dawn — Huangshan growing base (replace with 1920×1080 image or muted video loop)': '主视觉 · 黄山基地春茶梯田晨景（可替换为1920×1080图片或静音视频循环）',

      /* Index · metrics */
      'Company key metrics': '企业关键数据',
      'Years of Export Heritage': '年出口历史',
      'Export Countries Served': '服务出口国家',
      'MT Annual Production Capacity': '公吨年产能',
      'International Certifications': '项国际认证',

      /* Index · products */
      'Product Portfolio': '产品体系',
      'A structured export catalogue, built for blending & packing houses': '为拼配厂与分装企业打造的标准化出口产品目录',
      'Twelve commercial grades across six tea families — every lot specified, graded and documented to the standard your market requires.': '六大茶类、十二个商业等级 — 每一批均按目标市场标准进行规格化、分级与文件管理。',
      'Full Spec Sheet (PDF)': '完整规格书（PDF）',
      'Green · Pan-Fired': '绿茶 · 炒青',
      'Green · Rolled': '绿茶 · 珠形',
      'Certified Organic': '有机认证',
      'Scented': '窨花茶',
      'Black · Orthodox': '红茶 · 传统工艺',
      'Tea-Bag Grade': '袋泡茶级',
      'Tight, uniform eyebrow leaf with a brisk, clean-astringent cup. Our flagship bulk tea for North and West African blending programmes.': '条索紧结匀整的眉茶，滋味浓爽干净，是北非与西非拼配项目的核心大宗茶。',
      'Grades': '等级',
      'Packing': '包装',
      '25–30 kg kraft paper bags': '25–30公斤牛皮纸袋',
      'Dense temple-ball roll with high bulk density and excellent transit stability — the backbone of Moroccan and Maghreb mint-tea blends.': '颗粒紧实卷曲，容重高，运输稳定性极佳 — 是摩洛哥及马格里布薄荷茶拼配的支柱原料。',
      'Estate-level traceability from certified organic bases in Anhui and Jiangxi. Every lot residue-screened against full EU MRL lists before release.': '来自安徽与江西认证有机基地的庄园级溯源。每一批出货前均按欧盟MRL全项进行农残筛查。',
      'Certification': '认证',
      'Styles': '款式',
      'Chunmee · Gunpowder · Sencha-style': '珍眉 · 珠茶 · 煎茶风格',
      'Spring-picked green base, scent-swept with fresh jasmine blossoms across five cycles. Scented and packed at origin for full aroma retention.': '春季采摘的绿茶坯，与鲜茉莉花经五次窨制。产地窨花与包装，完整保留花香。',
      'Scentings': '窨次',
      '5 cycles (7 on request)': '5次（可按需7次）',
      'Winey, orchid-scented Qi Men black tea for premium blends and specialty private-label lines. Consistent leaf appearance, season after season.': '具果香与兰花香的祁门红茶，适用于高端拼配与精品贴牌产线，叶底外观四季稳定。',
      'Consistent colour and cup strength for high-speed teabag lines. Blended to your target specification, batch after batch.': '汤色与浓度稳定，适配高速袋泡茶生产线，按目标规格逐批复配。',
      'Mesh': '目数',
      'Moisture': '水分',
      'Get Quote': '获取报价',
      'View Details': '查看详情',
      'Request Spec': '索取规格书',
      'Chunmee dry leaf — uniform eyebrow curl (1200×800)': '珍眉干茶 — 匀整眉形（1200×800）',
      'Gunpowder pellet roll — density check (1200×800)': '珠茶颗粒 — 容重检测（1200×800）',
      'Certified organic base — Jiangxi estate (1200×800)': '有机认证基地 — 江西庄园（1200×800）',
      'Jasmine scenting cycle — Fujian (1200×800)': '茉莉窨制 — 福建（1200×800）',
      'Keemun dry leaf — orthodox roll (1200×800)': '祁红干茶 — 传统条形（1200×800）',
      'Fannings sieve analysis — lab bench (1200×800)': '片茶筛分分析 — 实验台（1200×800）',

      /* Index · capability */
      'Manufacturing Capability': '生产制造能力',
      'A factory built for container-scale consistency': '为整柜级一致性而建的工厂',
      'Two origin-based processing campuses, six automated lines and an on-site laboratory — engineered so that container 400 matches container 1.': '两座产地加工园区、六条自动化产线与自建实验室 — 确保第400柜与第1柜品质如一。',
      '52,000 m² production campus': '52,000平方米生产基地',
      'Two processing bases in Huangshan and Xiuning, Anhui — the core origin of pan-fired green tea.': '位于炒青绿茶核心产地 — 安徽黄山与休宁的两大加工基地。',
      'Six automated production lines': '六条自动化生产线',
      'Peak-season fresh-leaf intake of 90,000 kg per day, processed within six hours of picking.': '旺季日收鲜叶90,000公斤，采摘后6小时内完成加工。',
      'On-site QC laboratory': '自建QC实验室',
      'HPLC & GC-MS residue screening on every batch, verified by SGS and Eurofins.': '每批经HPLC与GC-MS农残筛查，并由SGS、Eurofins验证。',
      '120 trained staff · 15 QC specialists': '120名专业员工 · 15名质检专员',
      'Low turnover keeps process knowledge on the floor, season after season.': '团队稳定，工艺经验代代相传。',
      '28,000 MT annual capacity': '28,000公吨年产能',
      'Container-scale supply with blend-to-blend consistency across the full crop year.': '全年稳定供货，批次间品质一致。',
      'Direct port access': '临近港口',
      '190 km from Ningbo–Zhoushan Port; weekly sailings on all major trade lanes.': '距宁波舟山港190公里，主要航线每周班轮直达。',
      'Production campus — Huangshan (900×1200)': '生产基地 — 黄山（900×1200）',
      'Automated pan-fired line B (1200×800)': '自动化炒青B线（1200×800）',
      'Fresh-leaf intake, peak season (1200×800)': '旺季鲜叶收购（1200×800）',

      /* Index · process */
      'Processing & Craftsmanship': '加工工艺',
      'Five controlled stages, from leaf to export carton': '从鲜叶到出口箱的五大受控工序',
      'Pan-fired green tea is unforgiving. Each stage runs to defined parameters and is logged against the lot code — craft, held to specification.': '炒青绿茶对工艺容错极低。每道工序均按既定参数执行并按批号记录 — 匠心，且恪守规格。',
      'Harvest & Fresh-Leaf Intake': '采摘与鲜叶进厂',
      'Hand-plucked and machine-harvested leaf from contracted bases enters intake within 4–6 hours, where moisture, purity and leaf age are graded before processing begins.': '来自签约基地的手采与机采鲜叶4–6小时内进厂，按含水量、净度与嫩度分级后方可投产。',
      '≤ 6 h field-to-factory': '田间到工厂 ≤ 6小时',
      '3-grade intake sorting': '进厂三级分选',
      'Fixation — Kill-Green (Sha Qing)': '杀青（Sha Qing）',
      'Hot-air pan fixation at 280–300 °C halts oxidation within minutes, locking in the jade colour and the fresh, chestnut-sweet profile Chunmee is known for.': '280–300°C热风杀青，数分钟内钝化酶活，锁住翠绿色泽与珍眉标志性的板栗甜香。',
      'Same-day fixation': '当日杀青',
      'Rolling & Shaping': '揉捻成型',
      'Calibrated pressure profiles curl and tighten the leaf, forming the signature eyebrow or pellet shape while controlling cell-wall rupture for consistent cup strength.': '经校准的压力曲线使叶片卷曲紧结，形成标志性的眉形或颗粒外形，同时控制细胞破碎率以保证滋味浓度稳定。',
      '4 rolling passes': '4次揉捻',
      'Controlled rupture ratio': '受控破碎率',
      'Drying & Moisture Lock': '干燥锁鲜',
      'Three-stage drying brings moisture to ≤ 6.0% without scorching, developing aroma and locking the leaf for long-distance ocean transit and shelf stability.': '三段式干燥将水分降至≤6.0%而不产生焦味，发展香气，为远洋运输与货架期稳定性打底。',
      '≤ 6.0% moisture': '水分 ≤ 6.0%',
      '3-stage drying': '三段干燥',
      'Sorting, Grading & Bulk Packing': '筛分定级与散装打包',
      'Elliptical sifters, air columns and colour sorters separate twelve-plus commercial grades. Metal detection and final inspection precede export packing.': '平面圆筛机、风选机与色选机分出12个以上商业等级，出口打包前经金属探测与终检。',
      '12+ commercial grades': '12+商业等级',
      '100% metal-detected': '100%金属探测',
      'Spring harvest — terraced rows, Xiuning base (1200×900)': '春季采摘 — 休宁基地梯田茶园（1200×900）',
      'Fixation line — temperature control panel (1200×900)': '杀青线 — 温控面板（1200×900）',
      'Rolling machines — line A, close-up (1200×900)': '揉捻机 — A线特写（1200×900）',
      'Drying ovens — moisture audit (1200×900)': '干燥炉 — 水分抽检（1200×900）',
      'Sorting & sifting hall — grade separation (1200×900)': '筛分车间 — 等级分选（1200×900）',

      /* Index · quality */
      'Quality Assurance': '品质保证',
      'Compliance you can hand to your inspector': '可直接呈交检验官的合规体系',
      'Every container leaves with a complete, audit-ready documentation set — certificates, test reports and traceability records included.': '每个货柜均随附完整、可供审核的文件集 — 含证书、检测报告与溯源记录。',
      'Quality management system': '质量管理体系',
      'Food safety management': '食品安全管理',
      'Certified hazard control plan': '危害控制计划认证',
      'Certified organic processing': '有机加工认证',
      'United States organic standard': '美国有机标准',
      'Japan agricultural standard': '日本农业标准',
      'Sustainable sourcing certified': '可持续采购认证',
      'US facility registration': '美国FDA设施注册',
      'In-House Laboratory': '自建实验室',
      'HPLC & GC-MS screening for pesticide residues, heavy metals and microbiology — run on every production batch before release.': '每批放行前经HPLC与GC-MS筛查农残、重金属与微生物。',
      'Third-Party Verification': '第三方验证',
      "Pre-shipment certificates from SGS, Eurofins or Intertek against your market's MRL standard — EU, NOP or JAS.": '出货前由SGS、Eurofins或Intertek按目标市场MRL标准（欧盟/NOP/JAS）出具证书。',
      'Traceability & Retention': '溯源与留样',
      'Lot-coded from base to carton, with retention samples held for 24 months against every shipment.': '从基地到纸箱全程批号管理，每批货留样24个月。',
      'QC laboratory — HPLC & GC-MS bench (1600×700)': 'QC实验室 — HPLC与GC-MS台（1600×700）',
      'Fresh-leaf intake check': '鲜叶进厂检查',
      'In-line process monitoring': '过程在线监控',
      'Moisture & grade audit': '水分与等级审核',
      'Pre-shipment inspection': '出货前检验',
      'Container loading check': '装柜监督',

      /* Index · OEM */
      'Your brand, produced and packed at origin': '您的品牌，产地生产与包装',
      'From a 500 kg trial order to full retail programmes — we manufacture, pack and document under your brand, to your specification.': '从500公斤试单到完整零售项目 — 按您的规格，以您的品牌完成生产、包装与文件。',
      'Private-label packaging': '贴牌包装',
      'Kraft bags, retail pouches, tins, envelopes and single- or double-chamber teabags.': '牛皮纸袋、零售软包、罐装、信封包装及单/双室茶包。',
      'Custom blend formulation': '定制拼配方案',
      'Counter-samples matched to your cup, liquor colour and leaf profile in 7–10 days.': '7–10天内按您的滋味、汤色与叶底要求提供对样。',
      'Artwork & labelling support': '设计与标签支持',
      'In-house design studio producing market-compliant, multilingual label artwork.': '自有设计团队，出具符合目标市场法规的多语种标签稿。',
      'Documentation & compliance': '文件与合规',
      'Specification sheets, COA, allergen and GMO statements prepared per shipment.': '每批随附规格单、COA、过敏原与非转基因声明。',
      'Brand protection': '品牌保护',
      'Exclusive grade and blend agreements, with NDA available on request.': '独占等级与拼配协议，可按需签署保密协议。',
      'Flexible logistics': '灵活物流',
      'Mixed-SKU consolidation, pallet configuration and labelling to your DC spec.': '支持混装拼柜，托盘方案与标签按您配送中心要求执行。',
      'Flexible MOQ from 500 kg.': 'MOQ灵活，低至500公斤。',
      'Trial orders and first-container programmes are welcomed — scale up as your market grows.': '欢迎试单与首柜项目 — 随您的市场成长逐步放量。',
      'Brief & NDA': '需求沟通与保密协议',
      'Send your target spec, packaging format and volumes. NDA signed before sampling.': '提供目标规格、包装形式与数量，打样前签署NDA。',
      'Sampling & Formulation': '打样与配方',
      'Counter-samples in 7–10 days; revisions until your sign-off.': '7–10天提供对样，直至确认签样。',
      'Trial Run & Approval': '试产与确认',
      'Pre-production sample approved before the mass run begins.': '量产前完成产前样确认。',
      'Production & Export': '生产与出口',
      'Mass production with the full QC documentation set on every shipment.': '批量生产，每批随附完整QC文件集。',
      'Packaging line — retail pouches & cartons (1200×800)': '包装线 — 零售软包与纸箱（1200×800）',
      'Label & artwork samples — multilingual range (1200×800)': '标签与设计稿 — 多语种系列（1200×800）',

      /* Index · export */
      'Global Export': '全球出口',
      'Shipping trust, container by container': '一柜一柜，交付信任',
      '62 markets across six regions, served by weekly sailings and a documentation team that speaks your customs language.': '覆盖六大区域62个市场，每周班轮出运，文件团队熟悉您的清关语言。',
      'World export map — 62 active markets (replace with illustrated or interactive map)': '全球出口地图 — 62个活跃市场（可替换为图示或交互地图）',
      'Europe': '欧洲',
      '18 markets': '18个市场',
      'Germany · Poland · UK · Netherlands · France': '德国 · 波兰 · 英国 · 荷兰 · 法国',
      'North & West Africa': '北非与西非',
      '14 markets': '14个市场',
      'Morocco · Algeria · Senegal · Ghana · Mauritania': '摩洛哥 · 阿尔及利亚 · 塞内加尔 · 加纳 · 毛里塔尼亚',
      'Middle East & Central Asia': '中东与中亚',
      '12 markets': '12个市场',
      'UAE · Saudi Arabia · Uzbekistan': '阿联酋 · 沙特阿拉伯 · 乌兹别克斯坦',
      'East & Southeast Asia': '东亚与东南亚',
      '9 markets': '9个市场',
      'Japan · Malaysia · Singapore': '日本 · 马来西亚 · 新加坡',
      'North America': '北美',
      '5 markets': '5个市场',
      'United States · Canada': '美国 · 加拿大',
      'Latin America': '拉丁美洲',
      '4 markets': '4个市场',
      'Chile · Panama': '智利 · 巴拿马',
      'Incoterms & Ports': '贸易条款与港口',
      'FOB, CIF and DDP from Ningbo–Zhoushan and Shanghai, with weekly sailings on all major trade lanes.': '宁波舟山港与上海港FOB/CIF/DDP出运，主要航线每周班轮。',
      'Export Documentation': '出口单证',
      'Certificate of Origin, Form A / EUR.1, phytosanitary and fumigation certificates, marine insurance.': '原产地证、Form A / EUR.1、植检与熏蒸证书、海运保险。',
      'Packing & Consolidation': '包装与拼柜',
      '25–30 kg kraft bags, jumbo bags and retail cartons palletised to spec; mixed-SKU LCL consolidation available.': '25–30公斤牛皮纸袋、吨袋与零售纸箱按规格托盘化；支持混SKU拼柜。',
      'Trusted by': '客户类型',
      'Importers & Wholesalers': '进口商与批发商',
      'Packing Houses': '分装厂',
      'Private-Label Brands': '贴牌品牌',
      'HoReCa Distributors': '酒店餐饮分销商',
      'Retail Chains': '零售连锁',

      /* Index & contact · form */
      'Start a Conversation': '开启合作',
      'Request a quotation or sample programme': '获取报价或样品方案',
      'Tell us your market, target spec and volumes — our export desk replies within 24 hours with pricing, samples and documentation.': '告诉我们您的市场、目标规格与数量 — 出口部将在24小时内回复价格、样品与文件。',
      'Full Name *': '姓名 *',
      'Your name': '您的姓名',
      'Company *': '公司 *',
      'Company / trading house': '公司 / 贸易企业',
      'Business Email *': '商务邮箱 *',
      'Country *': '国家 *',
      'e.g. Germany': '如：德国',
      'Inquiry Type': '询盘类型',
      'Bulk Supply Request': '大宗供货询价',
      'OEM / Private Label': 'OEM / 贴牌定制',
      'Samples & Specification': '样品与规格',
      'Partnership / Distribution': '合作 / 经销',
      'Other': '其他',
      'Message *': '留言 *',
      'Target tea type, grade, volumes, packaging, destination market…': '目标茶类、等级、数量、包装、目的市场…',
      'Send Inquiry': '发送询盘',
      'Your details are used only to answer this inquiry — never shared.': '您的信息仅用于回复本次询盘 — 绝不外泄。',
      'Inquiry received.': '询盘已收到。',
      'Thank you — our export desk will reply within 24 hours with pricing, samples and documentation.': '感谢您的垂询 — 出口部将在24小时内回复价格、样品与文件。',
      'Send another inquiry': '再次发送询盘',
      'Please enter your name.': '请输入姓名。',
      'Please enter your company.': '请输入公司名称。',
      'Please enter a valid email address.': '请输入有效的邮箱地址。',
      'Please enter your country.': '请输入国家。',
      'Please tell us briefly about your requirement (min. 10 characters).': '请简要描述您的需求（至少10个字符）。',
      'Export Sales Desk': '出口销售部',
      'Tea Industrial Park, Huangshan City, Anhui 245000, China': '中国安徽省黄山市茶叶产业园 245000',
      'Huangshan facility — buyer visits by appointment (1200×800)': '黄山工厂 — 欢迎预约参观（1200×800）',
      'Average first response: 4 working hours · Samples dispatched within 3 days.': '平均首次回复：4个工作小时 · 样品3天内寄出。',

      /* Products archive */
      'Product Catalogue': '产品目录',
      'Catalogue sidebar': '目录侧栏',
      '6 Tea Families': '六大茶类',
      '12 Commercial Grades': '12个商业等级',
      'MOQ from 500 kg': '起订量500公斤起',
      'Showing 6 of 6 products': '共6个产品，当前显示6个',
      'Showing 2 of 6 products': '共6个产品，当前显示2个',
      'Showing 1 of 6 products': '共6个产品，当前显示1个',
      'Showing {n} of {t} products': '共{t}个产品，当前显示{n}个',
      'All Families': '全部茶类',
      'Pan-Fired Green': '炒青绿茶',
      'Rolled Green': '珠形绿茶',
      'Organic': '有机',
      'Orthodox Black': '传统红茶',
      'Organic & Certified': '有机与认证',
      'Product Families': '产品分类',
      'Best Sellers': '热销产品',
      'The North & West Africa staple': '北非与西非主力产品',
      'High-density mint-tea base': '高容重薄荷茶原料',
      'Full MRL clearance, lot-coded': 'MRL全项合规，批号管理',
      'Need Help?': '需要帮助？',
      'Not sure which grade fits your blend? Our export desk will match counter-samples to your target spec.': '不确定哪款等级适合您的拼配？出口部将按您的目标规格提供对样。',
      'Ask the Export Desk': '咨询出口部',
      'Downloads': '资料下载',
      'Full catalogue (PDF, 4.2 MB)': '完整产品目录（PDF, 4.2 MB）',
      'Organic certificates pack': '有机认证文件包',
      'Packing & loading guide': '包装与装柜指南',
      "Can't find your grade in the catalogue?": '目录中没有您要的等级？',
      'We formulate custom blends to your cup, liquor colour and leaf profile — counter-samples in 7–10 days, MOQ from 500 kg.': '我们按您的滋味、汤色与叶底要求定制拼配 — 7–10天提供对样，MOQ低至500公斤。',
      'Request a Custom Blend': '定制拼配需求',
      'Catalogue pages': '产品目录分页',

      /* Single product */
      'Chunmee Green Tea — 41022 Series': '珍眉绿茶 — 41022系列',
      'Green · Pan-fired. The flagship bulk tea of our export programme — twelve commercial grades produced to a locked specification for blending and packing houses.': '绿茶 · 炒青。出口项目的旗舰大宗茶 — 按锁定规格生产十二个商业等级，服务拼配与分装企业。',
      'EU MRL Compliant': '欧盟MRL合规',
      'Full Doc Set': '全套单证',
      'Chunmee dry leaf — uniform eyebrow curl, grade 41022AAA (1200×900)': '珍眉干茶 — 匀整眉形，41022AAA（1200×900）',
      'Brewed liquor — bright yellow-green (1200×900)': '茶汤 — 嫩黄绿明亮（1200×900）',
      'Sieve analysis — grading bench (1200×900)': '筛分分析 — 定级台（1200×900）',
      'Specification overview': '规格概览',
      'Tightly rolled, uniform eyebrow leaf with a brisk, clean-astringent cup and bright yellow-green liquor. Produced from spring and autumn flushes at our Huangshan and Xiuning bases, blended to target spec and released only after laboratory clearance.': '条索紧结匀整，滋味浓爽干净，汤色嫩黄绿明亮。产自黄山与休宁基地的春秋茶，按目标规格拼配，实验室放行后方可出货。',
      'Blend-friendly profile for North & West African programmes': '适配北非与西非拼配项目',
      'Batch-to-batch consistency, lot-coded and traceable': '批次稳定，批号可溯',
      'Residue-screened against full EU MRL lists': '欧盟MRL全项农残筛查',
      'Private-label packing available from 500 kg': '500公斤起提供贴牌包装',
      'Origin': '产地',
      'Huangshan & Xiuning, Anhui — China': '中国安徽黄山与休宁',
      '500 kg (trial) · 1×20\' container standard': '500公斤（试单）· 标准1×20尺柜',
      'Lead time': '交期',
      '15–25 days after contract & deposit': '签约与定金后15–25天',
      'Ports / terms': '港口 / 条款',
      'Samples': '样品',
      '150 g courier samples within 3 days': '3天内寄出150g快递样品',
      'Email Sales Desk': '邮件联系出口部',
      'Technical Specification': '技术规格',
      'Grade schedule & physical standards': '等级表与理化标准',
      'Every grade ships with a batch-specific specification sheet and certificate of analysis. Custom grade targets on request.': '每个等级均随附批次规格单与检测报告（COA）。可按需定制等级目标。',
      'Grade': '等级',
      'Leaf appearance': '外形',
      'Total ash': '总灰分',
      'Tight, narrow eyebrow — uniform dark jade': '紧结细眉 — 色泽乌绿匀称',
      'Well-rolled eyebrow, clean sift': '卷结匀整，筛分干净',
      'Standard curl, economy blending base': '常规卷曲，经济拼配原料',
      'Small, neat pellet-style curl': '细小圆紧的珠形卷曲',
      'Younger leaf style, brighter liquor': '嫩度更高，汤色更亮',
      'Broader leaf, full-bodied cup': '叶张较宽，滋味醇厚',
      'Quality & Compliance': '质量与合规',
      'Pesticide residues compliant with EU MRL / USDA NOP; heavy metals and microbiology per batch. HACCP and ISO 22000 certified processing.': '农残符合欧盟MRL / 美国NOP标准；每批检测重金属与微生物。HACCP与ISO 22000认证加工。',
      'Packing & Loading': '包装与装柜',
      "5-ply kraft-paper bags, 25–30 kg net; ~26 MT per 40' HQ palletised or loose. Jumbo bags and private-label retail packing on request.": '五层牛皮纸袋，净重25–30公斤；40尺高柜约26公吨，可托盘或散装。支持吨袋与贴牌零售包装。',
      'Shipping Documents': '出口单证',
      'Commercial invoice & packing list, CO / Form A / EUR.1, phytosanitary & fumigation certificates, COA, third-party SGS report on request.': '商业发票与装箱单、CO / Form A / EUR.1、植检与熏蒸证书、COA，可按需提供SGS第三方报告。',
      'Related Products': '相关产品',
      'Also in the export catalogue': '出口目录中的其他产品',
      'Full Catalogue': '完整目录',
      'Dense temple-ball roll for Moroccan and Maghreb mint-tea blends.': '紧实珠形颗粒，适用于摩洛哥及马格里布薄荷茶拼配。',
      'EU 2018/848 and USDA NOP certified Chunmee and Gunpowder styles.': '通过欧盟2018/848与美国NOP认证的珍眉与珠茶。',
      'Mesh 40/60/80 fannings blended to spec for high-speed teabag lines.': '40/60/80目片茶，按规格拼配，适配高速袋泡茶产线。',
      'Need 41022 samples before you commit?': '下单前需要41022样品？',
      '150 g reference samples of any grade are dispatched within 3 working days — courier on our account for contract quantities.': '任何等级均可3个工作日内寄出150g参考样 — 合同数量由我方承担快递费用。',
      'Request Samples': '索取样品',

      /* News archive */
      'News & Market Insights': '新闻与市场洞察',
      'Crop reports, compliance updates and company milestones — written for importers, packing houses and private-label buyers.': '收成报告、合规动态与企业里程碑 — 为进口商、分装厂与贴牌买家而写。',
      'Showing 6 of 6 articles': '共6篇文章，当前显示6篇',
      'Showing 2 of 6 articles': '共6篇文章，当前显示2篇',
      'Showing 1 of 6 articles': '共6篇文章，当前显示1篇',
      'Showing {n} of {t} articles': '共{t}篇文章，当前显示{n}篇',
      'All': '全部',
      'Trade Shows': '行业展会',
      'Market Reports': '市场报告',
      '18 Apr 2026 · 6 min read': '2026年4月18日 · 阅读6分钟',
      '2026 Spring Crop Report: Anhui Harvest Outlook & What It Means for Buyers': '2026年春茶报告：安徽收成展望及对买家的意义',
      'A colder, later spring shifts the harvest window by 8–10 days. Our field team covers volume expectations, grade availability and pricing guidance for Chunmee and Gunpowder programmes.': '今春偏冷偏晚，采收窗口推迟8–10天。一线团队为您解读珍眉与珠茶项目的产量预期、等级供应与价格走向。',
      'Read Article': '阅读全文',
      '02 Apr 2026': '2026年4月2日',
      'Everleaf Completes EU 2026 Organic Surveillance Audit With Zero Non-Conformities': 'Everleaf顺利通过2026年欧盟有机监督审核，零不符合项',
      'Annual inspection of our certified organic processing lines and Jiangxi estates closed with zero findings — full report available to customers.': '对有机加工产线与江西庄园的年度审核零缺陷收官 — 完整报告可向客户提供。',
      'Surveillance audit — documentation review (1200×750)': '监督审核 — 文件评审（1200×750）',
      '21 Mar 2026': '2026年3月21日',
      'SIAL Paris 2026: Meet Our Export Team at Hall 5A, Stand K028': 'SIAL巴黎展2026：欢迎莅临5A馆K028展位',
      'Sample tasting of the 2026 Chunmee crop, OEM packaging consultations and on-stand specification reviews — book a meeting slot in advance.': '2026年珍眉新茶品鉴、OEM包装咨询与现场规格评审 — 敬请提前预约洽谈时段。',
      'Exhibition stand — SIAL Paris (1200×750)': '展位 — SIAL巴黎展（1200×750）',
      '05 Mar 2026': '2026年3月5日',
      'New Gunpowder Line Commissioned — +4,000 MT Annual Capacity': '新珠茶产线投产 — 年产能增加4,000公吨',
      'The sixth automated line adds dedicated rolled-tea capacity with in-line density control, cutting lead times for Maghreb programmes during peak season.': '第六条自动化产线专用于珠茶，配备在线容重控制，缩短旺季马格里布项目交期。',
      'Commissioned line — new gunpowder rolling hall (1200×750)': '投产产线 — 新珠茶揉捻车间（1200×750）',
      '18 Feb 2026': '2026年2月18日',
      'Understanding the 2026 EU MRL Updates for Green Tea Importers': '解读2026年欧盟MRL新规对绿茶进口商的影响',
      "What changed, which actives now carry tighter limits, and how our pre-shipment screening protects your clearance — with a downloadable summary table.": '哪些内容变化、哪些农残限值收紧，以及我们的出货前筛查如何保障清关 — 附可下载的汇总表。',
      'GC-MS residue screening — QC lab (1200×750)': 'GC-MS农残筛查 — QC实验室（1200×750）',
      '27 Jan 2026': '2026年1月27日',
      'Everleaf Expands Certified Organic Bases in Jiangxi': 'Everleaf扩大江西有机认证基地',
      'Two additional estates join our certified organic programme, adding 380 hectares of EU/NOP-compliant leaf for the 2027 harvest onward.': '两座庄园新加入有机认证项目，自2027年采收季起新增380公顷欧盟/NOP合规茶园。',
      'Expanded organic estate — Jiangxi (1200×750)': '扩建有机庄园 — 江西（1200×750）',
      '09 Jan 2026': '2026年1月9日',
      'Ocean Freight Outlook Q1 2026: Booking Guidance for Container Programmes': '2026年一季度海运展望：集装箱项目订舱指南',
      'Rates, space expectations and cut-off planning for the spring shipping window — practical guidance for buyers scheduling annual contracts.': '春季出运窗口的运价、舱位预期与截关安排 — 为安排年度合同的买家提供实操建议。',
      'Container loading — Ningbo–Zhoushan port (1200×750)': '集装箱装运 — 宁波舟山港（1200×750）',
      'Reading about us is not the same as tasting us.': '读遍介绍，不如亲口一杯。',
      'Request reference samples of the current crop and judge the leaf, liquor and cup against your own blend target.': '索取当季参考样，按您自己的拼配目标评判外形、汤色与滋味。',
      'News pages': '新闻分页',

      /* News article */
      '2026 Spring Crop Report': '2026年春茶报告',
      'Market Reports · 18 April 2026 · By the Everleaf Export Desk · 6 min read': '市场报告 · 2026年4月18日 · Everleaf出口部 · 阅读6分钟',
      'Every spring, the Anhui harvest sets the tone for global green tea pricing. This year the season opened colder and later than the five-year average — and for buyers running Chunmee and Gunpowder programmes, the details matter more than the headline.': '每年春天，安徽茶季都为全球绿茶价格定调。今年的茶季比五年均值更冷、更晚 — 对于运营珍眉与珠茶项目的买家而言，细节比标题更重要。',
      'Between late February and mid-March, growing regions across Huangshan and Xiuning recorded sustained minimum temperatures two to three degrees below seasonal norms, with two light frost events at higher elevations. The practical effect: budding was delayed by roughly eight to ten days, compressing the window between the premium early flush and the volume-driven mid-season leaf.': '2月下旬至3月中旬，黄山与休宁各产区的最低气温持续低于季节均值2–3度，高海拔地区出现两次轻霜冻。实际影响是：萌发推迟约8–10天，早期高档茶与以量取胜的中期茶之间的窗口被压缩。',
      'Early spring rows — delayed budding at 600 m elevation (1600×900)': '早春茶园 — 600米海拔萌发推迟（1600×900）',
      'A colder, later spring': '更冷、更晚的春天',
      'Delayed budding is not automatically bad news. Slow early growth typically concentrates aroma precursors in the leaf, and our intake teams are reporting the best fragrance levels since 2021 on the first ten days of plucking. The risk sits at the transition: once temperatures normalised in late March, growth accelerated quickly, and bases that manage their plucking rounds carelessly will show it in leaf uniformity.': '萌发推迟并不必然是坏消息。早期生长放缓通常会使叶片中的香气前体物质更集中，收购团队反馈开园头十天的香气为2021年以来最佳。风险在于过渡期：3月下旬气温回归后生长加速，采摘轮次管理粗放的基地会在匀整度上现出短板。',
      'This is where contract manufacturing earns its keep. Our intake grading stations sort fresh leaf into three age classes within four hours of arrival, and fixation is run same-day — so the compressed window affects our scheduling, not your cup profile.': '这正是合约加工的价值所在。我们的进厂分级站会在鲜叶到场4小时内按嫩度分为三档，并当日杀青 — 压缩的窗口影响的是我们的排产，而不是您的杯品。',
      'Volume & price outlook': '产量与价格展望',
      'Across the growers we contract with, early-season intake is tracking 6–8% below last year. Mid-season volume should recover most of that gap, but the composition changes: relatively less premium leaf, relatively more standard-grade material. On pricing, farm-gate costs are up modestly on labour, and we expect published indications for 41022AAA to firm in the high single digits year-on-year, with 9371 and 3008 closer to flat.': '从签约农户来看，早期收青量同比低6–8%。中期产量应能补回大部分缺口，但结构会变化：高档叶占比下降，标准级原料占比上升。价格方面，人工成本推动产地收购价温和上行，预计41022AAA报价同比走高高个位数百分比，9371与3008基本持平。',
      'Buyers who lock annual programmes before the June fairs are, in a year like this one, buying certainty. Buyers who wait for the market to settle are usually buying whatever the market has left.': '在这样的年份里，赶在6月展会前锁定年度项目的买家买到的是确定性；而等市场企稳再出手的买家，往往只能接受市场剩下的东西。',
      '— Export Desk, Everleaf Tea Industrial Group': '— Everleaf茶叶工业集团 出口部',
      'What buyers should do now': '买家现在应该做什么',
      'Fix blending targets early.': '尽早锁定拼配目标。',
      'Compressed harvest windows reward buyers who confirm grade composition before the mid-season rush.': '采收窗口压缩时，先于中期供应高峰确认等级结构的买家更从容。',
      'Split premium from volume.': '高档与大宗分开规划。',
      'Consider contracting 41022AAA quantities now and holding 41022A/B decisions until mid-season samples land.': '建议现在锁定41022AAA数量，41022A/B的决定等中期样品到位再做。',
      'Ask for retention samples.': '索要留样对照。',
      'Every Everleaf lot ships with 24-month retention — reference your comparisons against the same standard all year.': '每批货均留样24个月 — 全年对照都以同一样为准。',
      'Book freight ahead of the fairs.': '展会前订好舱位。',
      'Space tightens in June; our logistics desk publishes cut-off schedules monthly.': '6月舱位趋紧；物流部每月发布截关时间表。',
      '2026 Season at a Glance': '2026茶季一览',
      'Harvest window:': '采收窗口：',
      'opened 8–10 days later than the five-year average': '较五年均值推迟8–10天',
      'Early volume:': '早期产量：',
      'tracking 6–8% below 2025 across contracted bases': '签约基地同比低6–8%',
      'Aroma:': '香气：',
      'strongest early-cup fragrance since 2021 on premium leaf': '高档叶开园香气为2021年以来最佳',
      'Pricing:': '价格：',
      '41022AAA firms high single digits; 9371 / 3008 near flat': '41022AAA走高高个位数；9371 / 3008基本持平',
      'Recommendation:': '建议：',
      'fix annual programmes before the June fairs': '6月展会前锁定年度项目',
      'Our full grade-by-grade availability schedule is shared directly with contracted customers, and reference samples of the current crop are dispatched within three working days of request. If your programme depends on a specific leaf appearance or cup standard, send the target — our blending team will match it against the 2026 intake and confirm what the season can hold.': '完整的分等级供应计划仅向签约客户直接分享，当季参考样在收到需求后3个工作日内寄出。如果您的项目对外形或杯品标准有明确要求，请把目标发给我们 — 拼配团队将对照2026年收青情况确认本季可实现的范围。',
      'Chunmee': '珍眉',
      'Gunpowder': '珠茶',
      'Anhui 2026': '安徽2026',
      'Continue Reading': '延伸阅读',
      'Related articles': '相关文章',
      'All News': '全部新闻',
      'EU 2026 Organic Surveillance Audit Closed With Zero Non-Conformities': '2026年欧盟有机监督审核零不符合项收官',
      'Plan your 2026 programme against the real crop.': '对照真实茶季规划您的2026年项目。',
      'Talk to the export desk about grade availability, pricing and sample sets for the current harvest.': '联系出口部了解当季等级供应、价格与样品组合。',
      'Contact the Export Desk': '联系出口部',

      /* About */
      'Thirty-Eight Years at Origin': '扎根产地三十八年',
      'From a leaf-trading station in Huangshan to a 52,000 m² export manufacturer — built on contracted farms, locked specifications and partnerships that outlast seasons.': '从黄山的收叶站到52,000平方米的出口制造企业 — 以签约农场、锁定规格与超越茶季的长期合作为根基。',
      'Our Story': '品牌故事',
      'A factory with roots in the rows it harvests': '一家根植于茶园的工厂',
      'Everleaf began in 1987 as a leaf-trading station serving the terraced gardens around Huangshan. As export demand for pan-fired green tea grew, the trading desk became a factory — and the factory became an industrial group with two processing bases, an on-site laboratory and customers in 62 countries.': 'Everleaf始于1987年，是服务黄山周边梯田茶园的收叶站。随着炒青绿茶出口需求的增长，收叶站变成了工厂 — 工厂又成长为拥有两大加工基地、自建实验室、客户遍及62个国家的产业集团。',
      'We remain deliberately close to the leaf. More than 80% of our intake comes from bases under multi-year contract, where our agronomy team manages plucking standards, and every lot we produce is coded back to the field it came from. That control is what lets us promise a 41022AAA that tastes, brews and sifts the same in March as it does in October.': '我们始终刻意贴近茶叶本身。超过80%的收青来自多年签约基地，由农艺团队管理采摘标准；每一批产品都可回溯到来源田块。正是这种掌控，让我们敢于承诺：3月与10月的41022AAA，滋味、冲泡与筛分表现完全一致。',
      'Today the group is led by the second generation of its founding family and employs 120 people — fifteen of them dedicated quality specialists who answer to the laboratory, not the sales desk.': '如今集团由创始家族第二代执掌，拥有120名员工 — 其中15名专职质检专员只对实验室负责，而非销售部。',
      'The original tea station — Huangshan, 1987 (1200×900)': '最初的收叶站 — 黄山，1987（1200×900）',
      'Founded': '创立',
      'Processing bases': '加工基地',
      'Staff members': '员工',
      'Export markets': '出口市场',
      'How We Operate': '运营理念',
      'Four commitments that shape every shipment': '塑造每一次发货的四个承诺',
      'Origin Control': '产地掌控',
      'Contracted bases, managed plucking standards and 4–6 hour field-to-factory intake keep the leaf — and the blame line — under one roof.': '签约基地、受控采摘标准与4–6小时田间进厂，让鲜叶与责任边界始终在同一个屋檐下。',
      'Specification Discipline': '规格纪律',
      'Every grade ships to a locked, written specification. If a lot misses it, the lot does not ship — no exceptions, no quiet blends.': '每个等级均按锁定的书面规格出货。不达标的批次绝不发货 — 没有例外，也没有悄悄的拼配。',
      'Compliance First': '合规优先',
      'EU MRL, NOP and JAS screening on every batch, with an audit-ready document set in every container. Your inspector is our specification.': '每批按欧盟MRL、NOP与JAS筛查，每个货柜随附可供审核的文件集。您的检验官标准就是我们的规格。',
      'Long-Term Partnership': '长期伙伴',
      'Our ten largest customers have bought from us for an average of 14 years. We price for continuity, not for the fast season.': '我们最大的十家客户平均合作14年。我们为持续合作定价，不为短期行情定价。',
      'Milestones': '发展历程',
      'The road from station to export house': '从收叶站到出口企业之路',
      'Founded in Huangshan': '创立于黄山',
      'A leaf-trading station supplying local pan-fired green tea to provincial packers.': '为省内分装企业提供本地炒青绿茶的收叶站。',
      'First export licence': '首张出口许可',
      'First container shipped independently — Chunmee 41022 to North Africa, a programme we still run today.': '首柜自主出运 — 41022珍眉发往北非，该项目延续至今。',
      'ISO 9001 & first EU contract': 'ISO 9001与首个欧盟合同',
      "Quality management certification and the company's first EU blending-house contract.": '通过质量管理体系认证，签下首个欧盟拼配厂合同。',
      'Organic certification': '有机认证',
      'First EU- and NOP-certified organic bases registered in Anhui and Jiangxi.': '首批欧盟与NOP认证有机基地在安徽、江西注册。',
      'New 52,000 m² campus': '新52,000平方米园区',
      'Consolidated processing, withering and QC laboratory into a single industrial campus with six automated lines.': '将加工、萎凋与QC实验室整合进拥有六条自动化产线的单一产业园区。',
      'ISO 22000 & Rainforest Alliance': 'ISO 22000与雨林联盟认证',
      'Food-safety management certified group-wide; sustainable-sourcing programme launched with contracted farms.': '食品安全管理体系集团认证；与签约农场启动可持续采购项目。',
      '62 markets · 28,000 MT': '62个市场 · 28,000公吨',
      'Annual capacity reaches 28,000 MT across six tea families, with OEM programmes running in 19 countries.': '六大茶类年产能达28,000公吨，OEM项目覆盖19个国家。',
      'Production Bases': '生产基地',
      'Two campuses in the heart of the origin': '地处产地核心的两大园区',
      'Both bases sit within the Huangshan leaf basin — close enough to the gardens that fresh leaf arrives before the afternoon, far enough apart to de-risk the harvest.': '两大基地均位于黄山茶区 — 距茶园足够近，鲜叶午后前即可进厂；彼此相距足够远，分散茶季风险。',
      'Huangshan Main Campus': '黄山主园区',
      '52,000 m² of processing halls, withering lofts, the QC laboratory and finished-goods warehousing. Six automated pan-fired lines, metal detection on every exit line, and rail-linked container loading.': '52,000平方米的加工车间、萎凋车间、QC实验室与成品仓。六条自动化炒青产线，每条出线端配金属探测，铁路直达集装箱装运。',
      'Xiuning Base': '休宁基地',
      'A second processing site dedicated to organic production — physically segregated intake, dedicated equipment and separate certification scope for EU, NOP and JAS material.': '专用于有机加工的第二厂区 — 物理隔离的收叶通道、专用设备，以及覆盖欧盟、NOP与JAS物料的独立认证范围。',
      'Huangshan main campus — aerial view (1200×900)': '黄山主园区 — 鸟瞰（1200×900）',
      'Why Buyers Choose Us': '买家为何选择我们',
      'What 38 years of exporting buys you': '38年出口经验带来的价值',
      'One contact to contract.': '一人对接，直达成交。',
      'The desk that quotes your programme is the desk that runs it.': '为您报价的团队就是执行项目的团队。',
      'Locked specifications.': '锁定规格。',
      'Written, batch-verified standards for every grade we ship.': '每个出货等级均有书面且逐批验证的标准。',
      'Own-leaf supply.': '自有基地供叶。',
      '80%+ of intake from multi-year contracted bases — fewer market surprises.': '80%以上收青来自多年签约基地 — 市场波动影响更小。',
      'Audit-ready paperwork.': '随时可审的文件。',
      'COA, phytosanitary, origin and third-party reports in every container.': '每柜随附COA、植检证、原产地证与第三方报告。',
      'OEM at origin.': '产地OEM。',
      'Private-label packing and blending under the same roof as production.': '贴牌包装与拼配和生产同在一处完成。',
      '24-month retention.': '24个月留样。',
      'Every lot sampled and stored — complaints answered against the same leaf.': '每批留样存储 — 质量异议以同批叶对照回复。',
      'Judge a supplier on the factory floor.': '到车间现场评判供应商。',
      'Buyer visits to our Huangshan campus are welcomed by appointment — production lines, laboratory and loading included.': '欢迎预约参观黄山园区 — 含产线、实验室与装柜区。',
      'Arrange a Visit': '预约参观',

      /* Contact page */
      'Contact & Inquiry': '联系与询盘',
      'Direct Lines': '直线联系',
      'Reach the right desk first time': '第一次就找对窗口',
      'Export Sales': '出口销售',
      'Bulk quotations, grade selection, samples and annual programmes.': '大宗报价、等级选择、样品与年度项目。',
      'Custom blends, packaging formats, artwork briefs and NDAs.': '定制拼配、包装形式、设计需求与保密协议。',
      'Logistics & Documentation': '物流与单证',
      'Bookings, shipping documents, certificates and container tracking.': '订舱、出口单证、证书与集装箱跟踪。',
      'Locations': '办公地点',
      'Two offices, one port of focus': '两处办公室，一个港口焦点',
      'Head Office & Factory': '总部与工厂',
      'Huangshan, Anhui': '安徽黄山',
      '+86 559 258 8000 · Mon–Sat, 8:30–18:30 (GMT+8)': '+86 559 258 8000 · 周一至周六 8:30–18:30（GMT+8）',
      'Buyer visits by appointment — production, laboratory and loading included.': '参观请预约 — 含生产车间、实验室与装柜区。',
      'Port Office': '港口办公室',
      'Ningbo': '宁波',
      'Export documentation and container operations, 190 km from the Huangshan campus and minutes from Ningbo–Zhoushan Port.': '出口单证与集装箱操作，距黄山园区190公里，紧邻宁波舟山港。',
      '+86 574 838 6100 · Mon–Sat, 9:00–18:00 (GMT+8)': '+86 574 838 6100 · 周一至周六 9:00–18:00（GMT+8）',
      'Location map — Huangshan campus & Ningbo office (replace with embedded or illustrated map)': '位置地图 — 黄山园区与宁波办公室（可替换为嵌入或图示地图）',

      /* 404 */
      'This page has been packed away.': '这个页面已被收进仓库。',
      "The address you followed doesn't exist — it may have been moved, renamed, or never grown at all. Try a search, or head back to the catalogue.": '您访问的地址不存在 — 它可能已被移动、更名，或从未存在过。试试搜索，或返回产品目录。',
      'Search grades, topics, pages…': '搜索等级、主题、页面…',
      'Search': '搜索',
      'Search the site': '搜索本站',
      'Homepage': '首页',
      'News': '新闻',

      /* Search page */
      'Find product grades, specifications, news and pages — try “41022”, “organic”, “OEM” or “MOQ”.': '查找产品等级、规格、新闻与页面 — 试试“41022”、“有机”、“OEM”或“MOQ”。',
      'Pages': '页面',

      /* Gallery */
      'Origin, facility and process photography — the reference set we supply for buyer presentations, private-label briefings and trade communications.': '产地、工厂与工艺摄影 — 用于买家演示、贴牌简报与商务沟通的参考图库。',
      'Showing 12 of 12 images': '共12张图片，当前显示12张',
      'Showing {n} of {t} images': '共{t}张图片，当前显示{n}张',
      'Plantation': '茶园',
      'Facility': '工厂',
      'Terraced tea rows at dawn — Xiuning base': '晨光中的梯田茶园 — 休宁基地',
      'Spring plucking — hand-picked premium standards': '春季采摘 — 手采高档标准',
      'Certified organic estate — Jiangxi': '有机认证庄园 — 江西',
      'Production campus exterior — Huangshan': '生产基地外景 — 黄山',
      'Automated pan-fired production line B': '自动化炒青产线B',
      'Fresh-leaf intake hall, peak season': '旺季鲜叶收购车间',
      'Fixation control panel — kill-green stage': '杀青控制面板 — 杀青工段',
      'Rolling machines close-up — line A': '揉捻机特写 — A线',
      'Drying ovens — three-stage moisture lock': '干燥炉 — 三段锁水',
      'QC laboratory — HPLC & GC-MS bench': 'QC实验室 — HPLC与GC-MS台',
      'Sieve analysis & grade separation': '筛分分析与等级分选',
      'Kraft bag packing line — 25–30 kg': '牛皮纸袋包装线 — 25–30公斤',
      'All images on this page are placeholders — replace with licensed photography. High-resolution assets and a usage-approved media kit are available to customers on request.': '本页图片均为占位图 — 请替换为授权摄影图。高清素材与授权媒体包可向客户按需提供。',
      'Need assets for your own presentation?': '需要用于您自有演示的素材？',
      'Our export desk supplies print-resolution photography, certificates and spec sheets for customer use.': '出口部向客户提供印刷级摄影图、证书与规格单。',
      'Request the Media Kit': '索取媒体资料包',
      'Image viewer': '图片查看器',
      'Close viewer': '关闭查看器',
      'Previous image': '上一张',
      'Next image': '下一张',
      'Language': '语言',
      'Select language': '选择语言',

      /* Coverage fixes found by the string audit */
      'Everleaf Tea Industrial Group — home': 'Everleaf茶叶工业集团 — 首页',
      'Hero · Spring tea terraces at dawn — Huangshan growing base': '主视觉 · 黄山基地春茶梯田晨景',
      '(replace with 1920×1080 image or muted video loop)': '（可替换为1920×1080图片或静音视频循环）',
      'World export map — 62 active markets': '全球出口地图 — 62个活跃市场',
      '(replace with illustrated or interactive map)': '（可替换为图示或交互地图）',
      'Location map — Huangshan campus & Ningbo office': '位置地图 — 黄山园区与宁波办公室',
      '(replace with embedded or illustrated map)': '（可替换为嵌入或图示地图）',
      'Filter products by family': '按茶类筛选',
      'Filter articles by category': '按栏目筛选',
      'Filter results by type': '按类型筛选',
      'Filter images by category': '按类别筛选',
      'Product image thumbnails': '产品图片缩略图',
      'Show dry leaf image': '查看干茶图',
      'Show brewed liquor image': '查看茶汤图',
      'Show sieving analysis image': '查看筛分分析图',
      'Spring terraces at harvest — Xiuning base (1600×1000)': '采收季茶山 — 休宁基地（1600×1000）',
      '25–30 kg kraft bag': '25–30公斤牛皮纸袋',
      'Green Tea Fannings (CTC / BTP)': '绿茶片茶（CTC / BTP）',
      'Hao Ya A / B · Grade 1–4': 'Hao Ya A / B · 等级1–4',
      'Packaging': '包装'
    }
  };

  function norm(s) {
    return s.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  }

  var current = 'en';

  function translateTextNode(node, dict) {
    var raw = node.nodeValue;
    if (!raw) return;
    var key = norm(raw);
    if (!key) return;
    var val = dict[key];
    if (val === undefined) return;
    var lead = raw.match(/^\s*/)[0];
    var trail = raw.match(/\s*$/)[0];
    node.nodeValue = lead + val + trail;
  }

  var ATTRS = ['placeholder', 'aria-label', 'data-caption', 'data-template', 'title'];

  function applyDict(root, dict) {
    if (!dict || !root) return;

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'NOSCRIPT') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) { translateTextNode(n, dict); });

    var withAttrs = root.querySelectorAll('[placeholder],[aria-label],[data-caption],[data-template],[title]');
    Array.prototype.forEach.call(withAttrs, function (el) {
      ATTRS.forEach(function (attr) {
        var v = el.getAttribute(attr);
        if (!v) return;
        var val = dict[norm(v)];
        if (val !== undefined) el.setAttribute(attr, val);
      });
    });
  }

  function readStoredLang() {
    try {
      var fromUrl = new URLSearchParams(window.location.search).get('lang');
      if (fromUrl && LANG_LABELS[fromUrl]) return fromUrl;
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && LANG_LABELS[saved]) return saved;
    } catch (e) { /* storage unavailable — default to EN */ }
    return 'en';
  }

  function persistLang(lang) {
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
  }

  function updateSwitcher() {
    var wrap = document.getElementById('lang-switcher');
    if (!wrap) return;
    var currentLabel = wrap.querySelector('.lang__current');
    if (currentLabel) currentLabel.textContent = LANG_LABELS[current] || 'EN';
    Array.prototype.forEach.call(wrap.querySelectorAll('[data-lang]'), function (opt) {
      var active = opt.getAttribute('data-lang') === current;
      opt.classList.toggle('is-active', active);
      opt.setAttribute('aria-selected', String(active));
    });
  }

  function initSwitcher() {
    var wrap = document.getElementById('lang-switcher');
    if (!wrap) return;
    var btn = wrap.querySelector('.lang__btn');

    function close() {
      wrap.classList.remove('is-open');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    if (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = wrap.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });
    }

    wrap.addEventListener('click', function (e) {
      var opt = e.target.closest('[data-lang]');
      if (!opt) return;
      var lang = opt.getAttribute('data-lang');
      if (!LANG_LABELS[lang]) return;
      if (lang === current) { close(); return; }
      persistLang(lang);
      window.location.reload();
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* Boot: translate before the rest of the page scripts run */
  current = readStoredLang();
  document.documentElement.setAttribute('lang', current === 'zh' ? 'zh-CN' : 'en');
  if (current !== 'en') applyDict(document.body, DICT[current]);
  updateSwitcher();
  initSwitcher();

  /* Public hook for dynamically rendered views (e.g. search results) */
  window.EVERLEAF_I18N = {
    lang: function () { return current; },
    t: function (text) {
      var dict = DICT[current];
      if (!dict) return text;
      var val = dict[norm(text)];
      return val === undefined ? text : val;
    },
    applyTo: function (root) { applyDict(root, DICT[current]); }
  };
})();
