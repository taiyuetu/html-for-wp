// One-off generator: assembles about/contact/news/single-news pages from shared partials
const fs = require("fs");

const head = fs.readFileSync("_partial_head.txt", "utf8");
const foot = fs.readFileSync("_partial_foot.txt", "utf8");

// --- per-page tweaks on the shared header ---
function tweak(header, { current, langPath, cssFiles, title, desc }) {
  let out = header;
  // nav highlight: remove old, add new
  out = out.replace(/<li class="nav-item is-current([^\"]*)">/g, '<li class="nav-item$1">');
  out = out.replace(new RegExp('<li class="nav-item(?![^"]*has-drop)([^"]*)">\\s*<a href="[^"]*' + current + '"', ''),
    '<li class="nav-item is-current$1"><a href="' + current + '"');
  // about-us is a has-drop item: mark it too when needed
  if (current === "about-us") {
    out = out.replace('<li class="nav-item has-drop">\n            <a href="https://www.chunlitea.com/about-us">',
      '<li class="nav-item is-current has-drop">\n            <a href="https://www.chunlitea.com/about-us">');
  }
  if (current === "contact-us") {
    out = out.replace('<li class="nav-item"><a href="https://www.chunlitea.com/contact-us">Contact Us</a></li>',
      '<li class="nav-item is-current"><a href="https://www.chunlitea.com/contact-us">Contact Us</a></li>');
  }
  if (current === "newslist-1") {
    out = out.replace('<li class="nav-item has-drop">\n            <a href="https://www.chunlitea.com/newslist-1">',
      '<li class="nav-item is-current has-drop">\n            <a href="https://www.chunlitea.com/newslist-1">');
  }
  // language links path
  out = out.replace(/(https:\/\/(?:cy|no|se|tlh|ht|ko|th|id|ca|mww|pk)\.trulytea\.org)\/[^"]*/g, "$1" + langPath);
  out = out.replace(/(https:\/\/www\.chunlitea\.com)\/[^"]*"(?=[^>]*class="is-active")/, "$1" + langPath + '"');
  // css links + title
  out = out.replace(/<link rel="stylesheet" href="theme.css">/, '<link rel="stylesheet" href="theme.css">\n' + cssFiles.map(c => '<link rel="stylesheet" href="' + c + '">').join("\n"));
  out = out.replace(/<title>[\s\S]*?<\/title>/, "<title>" + title + "</title>");
  out = out.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + desc + '">');
  return out;
}

const CDN = "https://www.chunlitea.com";

// ============================================================ ABOUT
const aboutMain = `
<main>

  <div class="page-banner">
    <div class="banner-shot">
      <img src="${CDN}/uploads/202128027/ImgScroll/ba202112031417091577403.jpg?size=1920x300" width="1920" height="300" alt="About us banner">
    </div>
    <div class="banner-bar">
      <div class="shell banner-bar-row">
        <div class="crumbs">
          <a class="crumb-home" href="https://www.chunlitea.com/" title="Home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3.5 10.5 12 3l8.5 7.5"/><path d="M5.5 9.5V20h13V9.5"/></svg>
            Home
          </a>
          <span class="crumb-sep">/</span>
          <span class="crumb-current">About Us</span>
        </div>
        <h1 class="banner-heading">About Us</h1>
      </div>
    </div>
  </div>

  <section class="about-main">
    <div class="shell">

      <div class="story-cols">
        <div class="story-shot"><img src="${CDN}/Content/uploads/2023646163/20231215145304b4aec0a8fc3b42d9910d912212da65b7.jpg?size=600x0" alt="Chunli office building" loading="lazy"></div>
        <div class="story-copy">
          <p class="lead-name">Zhejiang Chunli Tea<br>Industry Co., Ltd</p>
          <p>Was set up in 1988 in Zhejiang province, China, with more than 300 employees and with a registered fund of 50 million yuan. Chunli also owns over 8 thousand square meters office building, 65 thousand square meters factory building and 23 million square meters tea garden. We are one of the famous and main enterprises in Zhejiang province, who focus on the tea product import and export business. Is a leading tea export company with an impressive volume of 35,000 tons annually. Our client base extends to most African and Central Asian countries, including Algeria, Mauritania, Senegal, as well as Russia, Europe, and the United States. Our company is renowned for high-quality tea production and has won the appreciation and loyalty of clients due to our strong production capacity and strict quality control measures.</p>
        </div>
      </div>

      <p class="story-statement">One of the famous and main enterprises in Zhejiang province,<br>who focus on the tea product import and export business.</p>
      <p class="story-note">The business aim of the Chunli is to supply the high-quality tea product with reasonable price to our customer. To achieve this business aim, we have our own tea processing factory and stable supply chain. The exporting quantity of our product reaches 35000 tons per year. As well, it is rising steadily.</p>

      <div class="stat-grid">
        <div class="stat-cell">
          <span class="stat-icon"><img src="${CDN}/Content/uploads/2023646163/2023121514514903b816a1e637410081af41fc1944ad23.png" alt="" loading="lazy"></span>
          <span class="stat-info"><span class="stat-value">30+ Years</span><br><span class="stat-label">Industry Experience</span></span>
        </div>
        <div class="stat-cell">
          <span class="stat-icon"><img src="${CDN}/Content/uploads/2023646163/20231215171730655861b4d23f49f59f6939669956053a.png" alt="" loading="lazy"></span>
          <span class="stat-info"><span class="stat-value">300+</span><br><span class="stat-label">Employees</span></span>
        </div>
        <div class="stat-cell">
          <span class="stat-icon"><img src="${CDN}/Content/uploads/2023646163/20231215145204debec756437c4db9bf109c78464c7956.png" alt="" loading="lazy"></span>
          <span class="stat-info"><span class="stat-value">&yen;50 Million</span><br><span class="stat-label">Registered Capital</span></span>
        </div>
        <div class="stat-cell">
          <span class="stat-icon"><img src="${CDN}/Content/uploads/2023646163/20231215145210f96429a8868d4718a3adf7e6e2e70ff0.png" alt="" loading="lazy"></span>
          <span class="stat-info"><span class="stat-value">8000+ M&sup2;</span><br><span class="stat-label">Office Building</span></span>
        </div>
        <div class="stat-cell">
          <span class="stat-icon"><img src="${CDN}/Content/uploads/2023646163/2023121514522097d04d339b3e4d3fad0a536e52a4415d.png" alt="" loading="lazy"></span>
          <span class="stat-info"><span class="stat-value">65000+ M&sup2;</span><br><span class="stat-label">Factory Building</span></span>
        </div>
        <div class="stat-cell">
          <span class="stat-icon"><img src="${CDN}/Content/uploads/2023646163/202312151452263c830af5f1904129a890ac85277aa28d.png" alt="" loading="lazy"></span>
          <span class="stat-info"><span class="stat-value">23 Million M&sup2;</span><br><span class="stat-label">Tea Garden</span></span>
        </div>
      </div>

      <h2 class="his-heading">Our History</h2>
      <div class="timeline">
__TIMELINE__
      </div>

      <div class="trust-cols">
        <div class="trust-copy">
          <p class="block-heading" style="text-align:left"><strong style="font-size:20px">A tea export company you can trust</strong></p>
          <p class="block-text">Our company is committed to providing high-quality tea products and promoting healthy living. With over a decade of experience in tea production and export, we have developed a reliable and efficient supply chain to deliver the best products to customers in different parts of the world. Our carefully selected raw materials and advanced production technology ensure that our tea is highly nutritious, safe, and of excellent quality.</p>
          <p class="block-text">Our products are highly sought-after in many countries, and we take great pride in seeing our tea sold in different parts of the world. We are committed to expanding our market reach and providing quality customer service to all our customers, big or small.</p>
          <p class="block-text">With our impressive production capacity, commitment to quality, and international certifications, you can be sure that you are getting the best tea products the industry has to offer.</p>
        </div>
        <div class="trust-shot"><img src="${CDN}/Content/uploads/2023646163/202312151502046ceb09b9cb3245d7904627f97bf9d8c2.jpg?size=600x0" alt="Chunli workshop" loading="lazy"></div>
      </div>

      <div class="photo-row">
        <img src="${CDN}/Content/uploads/2023646163/202312151502512ae13347e1d441bab7c22831e627ce76.jpg" alt="Chunli factory view" loading="lazy">
        <img src="${CDN}/Content/uploads/2023646163/202312151503268b734da2e27249a082a92b08697b12ea.jpg" alt="Chunli production line" loading="lazy">
        <img src="${CDN}/Content/uploads/2023646163/20231215150307526d77c2fb264b69a934b41d92744699.jpg" alt="Chunli workshop" loading="lazy">
        <img src="${CDN}/Content/uploads/2023646163/202312151536069fbdf465e5084be8954348d1dffd82a9.jpg" alt="Chunli equipment" loading="lazy">
      </div>

      <p class="block-heading">Producing high-quality tea with the most advanced technology and equipment</p>
      <p class="block-text">The tea production workshop is an important part of the company's production process, and it is responsible for the production of quality tea under strict supervision and control.</p>
      <p class="block-text">The tea production workshop is equipped with a state-of-the-art production line that includes several advanced tea manufacturing machines. The first step in the tea production process is the withering of the fresh tea leaves. The fresh tea leaves are placed on the withering machine to reduce their moisture content, which makes them pliable enough for further processing. The withered leaves are then transferred to the rolling machine, where they are rolled and twisted to break down the cell wall and release the essential oils and flavors. After rolling, the tea is then placed in a curing room to dry.</p>
      <p class="block-heading">Adopted a fully automated production line</p>
      <p class="block-text">Ensuring the production process is safe, efficient, and hygienic. The use of automated machines reduces labor costs and eliminates human errors, thus improving overall efficiency. The company has also installed advanced temperature and humidity control systems.</p>
      <p class="block-heading">Takes health and safety seriously</p>
      <p class="block-text">The tea production workshop of Zhejiang Chunli Tea Industry Co., Ltd. is well-lit, clean, and hygienic. All production equipment is maintained on a regular basis to ensure proper functionality and cleanliness. The company has implemented strict safety measures in the production workshop. All employees are required to wear protective clothing, including gloves, masks, and hairnets. The company also provides regular training to its employees on safety procedures and protocols.</p>

      <div class="photo-row wide">
        <img src="${CDN}/Content/uploads/2023646163/20231215150420e11b1c1d977140bf906a7cc514ed892e.jpg" alt="Chunli automated line" loading="lazy">
        <img src="${CDN}/Content/uploads/2023646163/2023121515042427183ae16a9b4089beefd941bad23d5d.jpg" alt="Chunli workshop interior" loading="lazy">
      </div>

      <p class="block-heading">Production and Processing Environment</p>
      <div class="env-grid">
__ENVGRID__
      </div>

      <p class="block-heading">Production Process</p>
      <div class="center-img"><img src="${CDN}/Content/uploads/2023646163/2023121515125078b973649ded4731b76d5e5f72c92d93.jpg?size=1400x0" alt="Chunli tea production process" loading="lazy"></div>

      <p class="block-heading">Our Certificate</p>
      <p class="block-text" style="text-align:center">As a testament to our commitment, we have received numerous certifications such as ISO 22000 and FDA,ensuring that our tea meets international food safety standards.</p>
      <div class="center-img"><img src="${CDN}/Content/uploads/2023646163/20231215151348b2002d6bb2fd446e8cf865c2daf1c2b6.jpg?size=1400x0" alt="Chunli certificates" loading="lazy"></div>

      <p class="block-heading">We Provide Top-Quality<br>After-Sales Service</p>
      <p class="block-text">At our company, we believe that customer satisfaction is the cornerstone of our success. That's why we provide top-quality after-sales service to ensure that our clients are fully satisfied with their purchases. Our commitment to providing exceptional service has been recognized by our customers, who continue to come back to us time after time.</p>
      <p class="block-text">Our after-sales service begins the moment you make your purchase. We work closely with our customers to ensure that they receive the right product for their needs. Our knowledgeable staff are on hand to answer any questions you may have about the products we offer and to provide you with guidance and advice throughout the buying process.</p>
      <p class="block-text">Once you've made your purchase, our commitment to customer satisfaction doesn't end there. We offer a range of after-sales services to ensure that your experience with us is a positive one. For example, if you encounter any issues with your product, our customer service team is available to assist you. Our team will work quickly to resolve any issues you may have, ensuring that you are fully satisfied with your purchase.</p>
      <p class="block-text">At our company, we take pride in the quality of our after-sales service. We believe that our commitment to customer satisfaction sets us apart from our competitors. We work hard to ensure that our customers are fully satisfied with the products and services they receive.</p>
      <p class="block-text">We believe that providing top-quality after-sales service is just as important as offering high-quality products. Our commitment to customer satisfaction is at the heart of everything we do, and we are dedicated to ensuring that every customer has a positive experience with our company.</p>
      <div class="center-img"><img src="${CDN}/Content/uploads/2023646163/20231215151456f26f503893154bbbaf09f5c40849311b.jpg?size=600x0" alt="Chunli after-sales service" loading="lazy"></div>

      <p class="block-heading">Exhibitions &amp; Customer Visits</p>
      <p class="block-text" style="text-align:center">Our strict quality control measures include multiple inspections and tests at every stage of production,ensuring that our tea is of consistently high quality. This has earned us a well-deserved reputation for excellence in the industry, and our customers have rewarded us with a high return customer rate.</p>
      <div class="center-img"><img src="${CDN}/Content/uploads/2023646163/202312151515565e67af65b3c1472f859aeead2526b5a5.jpg?size=1398x0" alt="Chunli exhibitions" loading="lazy"></div>

      <p class="block-heading">Sales Market</p>
      <p class="block-text"><strong>Zhejiang Chunli Tea Industry Co., Ltd.</strong>, is a leading tea export company with an impressive volume of 35,000 tons annually. Our client base extends to most African and Central Asian countries, including Algeria, Mauritania, Senegal, as well as Russia, Europe, and the United States. Our company is renowned for high-quality tea production and has won the appreciation and loyalty of clients due to our strong production capacity and strict quality control measures.</p>
      <div class="center-img"><img src="${CDN}/Content/uploads/2023646163/20231215151620ed212db32e4d41a18e3dcd6736f782e4.jpg?size=1401x0" alt="Chunli sales market map" loading="lazy"></div>
      <div class="photo-row wide">
        <img src="${CDN}/Content/uploads/2023646163/202312151516408c43ba78afe64a5fa7f387f5e02345c9.jpg" alt="Chunli client visit" loading="lazy">
        <img src="${CDN}/Content/uploads/2023646163/20231215151645ad17e0eab3494bfeaeb1e1e2decc9791.jpg" alt="Chunli exhibition booth" loading="lazy">
      </div>

      <p class="block-heading">Professional Team</p>
      <p class="block-text">A team of exceptional and professional individuals is an important component of a successful business. When it comes to providing the best services to our clients, we believe that we have assembled a team of experts who are dedicated to their work and committed to delivering quality results.</p>
      <p class="block-text">Our team is made up of individuals who are passionate about their profession, and who are committed to delivering excellence in every task they undertake. Each team member is carefully selected based on their qualifications, experience, and expertise in their respective fields. This ensures that we have a team of highly skilled professionals who are capable of providing our clients with the best possible service.</p>
      <p class="block-text">Our team is dedicated to providing exceptional customer service to our clients. We strive to always exceed their expectations and go above and beyond to ensure their satisfaction. As a result, we have built a strong reputation for delivering quality services that meet the needs of our clients.</p>
      <p class="block-text">We are proud of the diversity of our team, which brings a variety of perspectives, cultures, experiences and skills to the table. This diversity helps us to better understand our clients' needs and provide customized solutions that meet their unique requirements.</p>
      <p class="block-text">At the heart of our team is a strong sense of collaboration, trust and respect. Each team member plays an important role, and we work together to achieve our objectives. We encourage open communication and collaboration among team members, which allows us to share knowledge and expertise and deliver the best results for our clients.</p>
      <p class="block-text">We believe that our team is the best in the business when it comes to providing exceptional services to our clients. We are passionate, skilled, and dedicated to delivering excellence in everything we do, and we are committed to maintaining the highest standards of quality and professionalism in all our interactions.</p>

    </div>
  </section>

</main>
`;

// timeline rows data
const hisData = [
  ["1988", "Our company's predecessor--- CHUNFENG Tea Factory was founded and became influential in Shengzhou City (A city famous for its Green tea).", "Le pr&eacute;d&eacute;cesseur de notre soci&eacute;t&eacute; --- CHUNFENG Tea Factory a &eacute;t&eacute; fond&eacute;e et est devenue influente dans la ville de Shengzhou (une ville c&eacute;l&egrave;bre pour son th&eacute; vert).", "his1"],
  ["1992", "Upgraded production line, increased tea quality, output increased to 9000 tons per year.", "Mise &agrave; niveau de la ligne de production, am&eacute;lioration de la qualit&eacute; du th&eacute;, production augment&eacute;e &agrave; 9 000 tonnes par an.", "his2"],
  ["1995", "Tea garden expanded to over 20,000,000sqm.", "Le jardin de th&eacute; s'&eacute;tend sur plus de 20 000 000 m&sup2;.", "his3"],
  ["1998", "Chunli became export-oriented enterprise with self-export license.<br>All products obtained 1SO9000 quality system certifications.", "Chunli est devenue une entreprise orient&eacute;e vers l'exportation avec une licence d'auto-exportation. Tous les produits ont obtenu les certifications du syst&egrave;me qualit&eacute; 1SO9000.", "his4"],
  ["2003", "CHUNLI TEA CO., LTD was registered, manufacturing plant expanded to70000m.<br>Four more production lines established. Accelerated growth.", "CHUNLI TEA CO., LTD a &eacute;t&eacute; enregistr&eacute;e et l'usine de fabrication s'est &eacute;tendue &agrave; 70 000 m. Quatre lignes de production suppl&eacute;mentaires &eacute;tablies. Croissance acc&eacute;l&eacute;r&eacute;e.", "his5"],
  ["2005", "Chunmee tea was added to our production range.<br>&quot;Chunli&quot; was recognized as a famous trademark", "Le th&eacute; Chunmee a &eacute;t&eacute; ajout&eacute; &agrave; notre gamme de production. &laquo; Chunli &raquo; a &eacute;t&eacute; reconnu comme une marque c&eacute;l&egrave;bre.", "his6"],
  ["2008", "CHUNLI became leading agricultural enterprise in Zhejiang Province. Won provincial prize &quot;Zhejiang Agricultural Science and Technology Enterprises&quot;, &quot;Leading Forestry Enterprises&quot;, &quot;Key Agricultural Leading Enterprises&quot;.", "CHUNLI est devenue une entreprise agricole leader dans la province du Zhejiang. A remport&eacute; le prix provincial &laquo; Entreprises de science et technologie agricole du Zhejiang &raquo;, &laquo; Entreprises foresti&egrave;res leaders &raquo;, &laquo; Entreprises agricoles leaders cl&eacute;s &raquo;.", "his7"],
  ["2009", "Set up Agricultural Science and Technology Research and Development Centre.", "Cr&eacute;ation du centre de recherche et d&eacute;veloppement en science et technologie agricole.", "his8"],
  ["2015", "Export value reached USD 15millions.<br>Expanded markets in West Africa.", "La valeur des exportations a atteint 15 millions USD. Expansion des march&eacute;s en Afrique de l'Ouest.", "his9"],
  ["2016", "Opened online store on Alibaba B2B platform: https://chunlitea.en.alibaba.com/<br>Attracted many small and medium- sized customers and wholesalers.", "Ouverture d'une boutique en ligne sur la plateforme Alibaba B2B : https://chunlitea.en.alibaba.com/. A attir&eacute; de nombreux petits et moyens clients et grossistes.", "his10"],
  ["2020", "Improved tea garden management level and introduced scientific<br>modernization management system. Enhancing supply chain and rich sales experience ensure our service to our clients.", "Am&eacute;lioration du niveau de gestion des jardins de th&eacute; et introduction d'un syst&egrave;me de gestion scientifique et modernis&eacute;. Le renforcement de la cha&icirc;ne d'approvisionnement et une riche exp&eacute;rience de vente garantissent notre service &agrave; nos clients.", "his11"],
  ["2021", "The &quot;Chunli&quot; Tea Special Train of the China Europe Express is Starting.", "Le train sp&eacute;cial de th&eacute; &laquo; Chunli &raquo; de l'Express Chine-Europe d&eacute;marre.", "his12"],
  ["2023-1", "Establishment of Chunli Tea Culture Museum,enable more people to understand tea culture.", "Cr&eacute;ation du mus&eacute;e de la culture du th&eacute; Chunli, permettant &agrave; davantage de personnes de comprendre la culture du th&eacute;.", "his13"],
  ["2023-2", "Intelligent tea garden establishment, automatic detection of soil weather data, and improvement of tea production quality.", "Construction intelligente de plantation de th&eacute;, d&eacute;tection automatique des donn&eacute;es m&eacute;t&eacute;orologiques du sol, am&eacute;lioration de la qualit&eacute; de la production de th&eacute;.", "his14"],
];
const timeline = hisData.map(([year, en, fr, img]) => `        <div class="his-row">
          <div class="his-text">
            <p class="his-year">${year}</p>
            <p class="his-en">${en}</p>
            <p class="his-fr">${fr}</p>
          </div>
          <div class="his-photo"><img src="${CDN}/uploads/28027/${img}.jpg" alt="${year}" loading="lazy"></div>
        </div>`).join("\n");

const envData = [
  ["Factory", "gate", "20231215151124cfd4bf82bab64379beee43882e430b7a.jpg?size=331x0"],
  ["Factory", "area", "202312151511281fb877fb30784ebbb97d0e92594ea626.jpg?size=331x0"],
  ["A corner of the", "laboratory", "202312151511358c93fad0cfc946209c66b46e75391ba8.jpg?size=331x0"],
  ["Small packaging", "workshop", "20231215151140e20d7be537c24a7aae61215a2bf268da.jpg?size=331x0"],
  ["Fried tea", "workshop", "20231215151148409100a31d02478eaeac98693adb2a7e.jpg?size=331x0"],
  ["Air shower", "room", "20231215151154a644e7baded14dcda1a29e01fadac117.jpg?size=331x0"],
  ["Sterilization", "chamber", "20231215151158fa3fb626c94e40088de12fb90b068807.jpg?size=331x0"],
  ["Purification", "area", "202312151512035c8d894b49be4e7f9463f9079ed7c1b7.jpg?size=331x0"],
];
const envgrid = envData.map(([a, b, img]) => `        <div class="env-cell"><img src="${CDN}/Content/uploads/2023646163/${img}" alt="${a} ${b}" loading="lazy"><p class="env-name">${a}<br>${b}</p></div>`).join("\n");

let aboutHtml = tweak(head, {
  current: "about-us",
  langPath: "/about-us",
  cssFiles: ["about.css"],
  title: "About Us - Zhejiang Chunli Tea Co., Ltd. (Study Replica)",
  desc: "Study replica of the Chunli Tea about page rebuilt from scratch.",
}) + aboutMain + foot;
aboutHtml = aboutHtml.replace("__TIMELINE__", timeline).replace("__ENVGRID__", envgrid);
fs.writeFileSync("about.html", aboutHtml);
console.log("about.html written:", aboutHtml.length);

// ============================================================ CONTACT
const contactMain = `
<main>

  <div class="page-banner">
    <div class="banner-shot">
      <img src="${CDN}/uploads/202128027/ImgScroll/ba202112031504564274763.jpg?size=1920x300" width="1920" height="300" alt="Contact us banner">
    </div>
    <div class="banner-bar">
      <div class="shell banner-bar-row">
        <div class="crumbs">
          <a class="crumb-home" href="https://www.chunlitea.com/" title="Home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3.5 10.5 12 3l8.5 7.5"/><path d="M5.5 9.5V20h13V9.5"/></svg>
            Home
          </a>
          <span class="crumb-sep">/</span>
          <span class="crumb-current">Contact Us</span>
        </div>
        <h1 class="banner-heading">Contact Us</h1>
      </div>
    </div>
  </div>

  <section class="about-main">
    <div class="shell">
      <h2 class="contact-lead">We'd Love To Help You</h2>
      <p class="contact-sub">Please feel free to get in touch using the form below. We'd love to hear your thoughts &amp; answer any questions you may have!</p>

      <div class="contact-cards">
        <div class="contact-card">
          <span class="card-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5c-3.9 0-7 3-7 6.9 0 5.1 7 12.6 7 12.6s7-7.5 7-12.6c0-3.9-3.1-6.9-7-6.9Zm0 9.6a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Z"/></svg></span>
          <div class="card-info">
            <p class="card-name">Our Address:</p>
            <p class="card-value">379 Punan Rd., Shengzhou City, Zhejiang Province, China</p>
          </div>
        </div>
        <div class="contact-card">
          <span class="card-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.4 10.8c1.5 3 3.8 5.2 6.8 6.7l2.3-2.3c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1v3.3c0 .6-.4 1-1 1C10.7 21 3 13.3 3 3.9c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.3 1l-2.3 2.3Z"/></svg></span>
          <div class="card-info">
            <p class="card-name">Phone Line:</p>
            <p class="card-value"><a href="tel:+8613819507518">+8613819507518</a></p>
          </div>
        </div>
        <div class="contact-card">
          <span class="card-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg></span>
          <div class="card-info">
            <p class="card-name">Email Address:</p>
            <p class="card-value"><a href="mailto:cltea@chunlitea.com">cltea@chunlitea.com</a></p>
          </div>
        </div>
        <div class="contact-card">
          <span class="card-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M9 6.5h6M9 10h6M9 13.5h3"/></svg></span>
          <div class="card-info">
            <p class="card-name">Fax</p>
            <p class="card-value">+86-575-83262716</p>
          </div>
        </div>
      </div>

      <div class="contact-panel">
        <div class="panel-dark">
          <div class="panel-inner">
            <span class="panel-chip">Contact with us</span>
            <p class="panel-h1">Have questions? Feel free to write us</p>
            <p class="panel-text">Chunli Company tea garden is a beautiful and scenic place located in a serene environment. The tea garden boasts of miles of neatly trimmed green tea plants that give off a fresh, flowery aroma that is sure to captivate the senses.</p>
            <div class="panel-share">
              <a href="" aria-label="facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.4 21.5v-7.9h2.6l.4-3.1h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H7.7v3.1h2.6v7.9h3.1Z"/></svg></a>
              <a href="" aria-label="twitter"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 4.6a7.6 7.6 0 0 1-2.2.6 3.9 3.9 0 0 0 1.7-2.1c-.8.4-1.6.8-2.5 1a3.9 3.9 0 0 0-6.6 3.5A11 11 0 0 1 1.3 3.5a3.9 3.9 0 0 0 1.2 5.2c-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.4 3.1 3.8a3.9 3.9 0 0 1-1.7.1 3.9 3.9 0 0 0 3.6 2.7A7.8 7.8 0 0 1 .2 16.6a11 11 0 0 0 5.9 1.7c7.1 0 11-5.9 11-11v-.5c.8-.5 1.4-1.2 1.8-2.2Z"/></svg></a>
              <a href="" aria-label="linkedin"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.9 21.5H3.3V9.4h3.6v12.1ZM5.1 7.9a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm16.4 13.6h-3.6v-6.4c0-1.6-.6-2.6-2-2.6-1.1 0-1.7.7-2 1.4-.1.3-.1.7-.1 1v6.6H10s.1-10.4 0-12.1h3.6v1.7c.5-.8 1.4-1.9 3.4-1.9 2.5 0 4.5 1.6 4.5 5.1v7.2Z"/></svg></a>
            </div>
          </div>
        </div>
        <div class="panel-form">
          <div class="form-float">
            <form class="inq-form" onsubmit="return false">
              <div class="inq-row">
                <input class="inq-input" type="email" placeholder="E-mail:*" aria-label="E-mail (required)">
                <input class="inq-input" type="text" placeholder="Phone/WhatsApp:" aria-label="Phone or WhatsApp">
              </div>
              <textarea class="inq-area" placeholder="Please include details like size,weight,destination port and etc., so that we can quote the best price.*" aria-label="Inquiry details"></textarea>
              <button class="inq-submit" type="submit">Leave a message</button>
            </form>
          </div>
        </div>
      </div>

      <div class="panel-spacer"></div>
    </div>
  </section>

</main>
`;
const contactHtml = tweak(head, {
  current: "contact-us",
  langPath: "/contact-us",
  cssFiles: ["contact.css"],
  title: "Contact Us - Zhejiang Chunli Tea Co., Ltd. (Study Replica)",
  desc: "Study replica of the Chunli Tea contact page rebuilt from scratch.",
}) + contactMain + foot;
fs.writeFileSync("contact.html", contactHtml);
console.log("contact.html written:", contactHtml.length);

// ============================================================ NEWS LIST
const newsSidebar = `
        <aside class="side-rail">
          <div class="rail-box rail-search">
            <input type="text" name="Keyword" placeholder="Keyword" aria-label="Keyword">
            <button type="button" title="Search" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="6.5"/><path d="m16.2 16.2 4.6 4.6"/></svg>
            </button>
          </div>

          <div class="rail-box">
            <div class="rail-head">News Center</div>
            <div class="rail-hot">
              <div class="hot-row">
                <a class="hot-shot" href="https://www.chunlitea.com/news/for-the-first-time-in-the-yangtze-river-delta-46525834.html"><img src="${CDN}/uploads/202128027/n202106091134083441132.jpg" alt="For The First Time in The Yangtze River Delta" loading="lazy"></a>
                <div class="hot-blurb">
                  <a class="hot-name" href="https://www.chunlitea.com/news/for-the-first-time-in-the-yangtze-river-delta-46525834.html">For The First Time in The Yangtze River Delta, This...</a>
                  <a class="hot-more" href="https://www.chunlitea.com/news/for-the-first-time-in-the-yangtze-river-delta-46525834.html">read more</a>
                </div>
              </div>
              <div class="hot-row">
                <a class="hot-shot" href="https://www.chunlitea.com/news/the-third-china-shaoxing-international-friends-39767116.html"><img src="${CDN}/uploads/202028027/n202011161108523283976.jpg" alt="The Third China Shaoxing International Friendship Cities Conference" loading="lazy"></a>
                <div class="hot-blurb">
                  <a class="hot-name" href="https://www.chunlitea.com/news/the-third-china-shaoxing-international-friends-39767116.html">The Third China Shaoxing International Friendship Cities Conference</a>
                  <a class="hot-more" href="https://www.chunlitea.com/news/the-third-china-shaoxing-international-friends-39767116.html">read more</a>
                </div>
              </div>
              <div class="hot-row">
                <a class="hot-shot" href="https://www.chunlitea.com/news/didier-dacko-ambassador-of-the-republic-of-ma-38809233.html"><img src="${CDN}/uploads/202028027/n202010141603382868084.jpg" alt="Didier Dacko, Ambassador Of The Republic Of Mali" loading="lazy"></a>
                <div class="hot-blurb">
                  <a class="hot-name" href="https://www.chunlitea.com/news/didier-dacko-ambassador-of-the-republic-of-ma-38809233.html">Didier Dacko, Ambassador Of The Republic Of Mali...</a>
                  <a class="hot-more" href="https://www.chunlitea.com/news/didier-dacko-ambassador-of-the-republic-of-ma-38809233.html">read more</a>
                </div>
              </div>
              <div class="hot-row">
                <a class="hot-shot" href="https://www.chunlitea.com/news/the-tea-market-under-the-influence-of-the-covi-39028528.html"><img src="${CDN}/uploads/202028027/n202010211626466187202.jpg" alt="The Tea Market Under The Influence Of The COVID-19 Epidemic" loading="lazy"></a>
                <div class="hot-blurb">
                  <a class="hot-name" href="https://www.chunlitea.com/news/the-tea-market-under-the-influence-of-the-covi-39028528.html">The Tea Market Under The Influence Of The COVID-19 Epidemic</a>
                  <a class="hot-more" href="https://www.chunlitea.com/news/the-tea-market-under-the-influence-of-the-covi-39028528.html">read more</a>
                </div>
              </div>
            </div>
          </div>

          <div class="rail-box">
            <div class="rail-head">Hot products</div>
            <div class="rail-hot">
__HOTPRODUCTS__
            </div>
          </div>
        </aside>`;

const hotProducts = [
  ["Chunmee 41022 4A Export Tea", "https://www.chunlitea.com/chunmee-tea/chunmee-41022-export-tea.html", "chunmee-41022-export-tea07898.jpg"],
  ["Chunmee 4011 Export Tea", "https://www.chunlitea.com/chunmee-tea/chunmee-4011-export-tea.html", "chunmee-4011-export-tea11afa.jpg"],
  ["Chunmee Koutam Rouge Export Tea", "https://www.chunlitea.com/chunmee-tea/chunmee-koutam-rouge-export-tea.html", "chunmee-koutam-rouge-export-tea456ef.jpg"],
  ["Chunmee Achoura Export Tea", "https://www.chunlitea.com/chunmee-tea/extra-chunmee-green-tea-41022.html", "extra-chunmee-green-tea-41022ac29f.jpg"],
  ["Gunpowder 3505AAA El-bellar Export Tea", "https://www.chunlitea.com/gunpowder-tea/best-loose-tea-companies-3505.html", "best-loose-tea-companies-35058c664.jpg"],
  ["Chunmee 9367 Diamond Export Tea", "https://www.chunlitea.com/chunmee-tea/lung-clearing-tea-9367.html", "lung-clearing-tea-936753765.jpg"],
  ["Chunmee 41022 4A Flecha Export Tea", "https://www.chunlitea.com/chunmee-tea/drying-machina-green-tea-41022.html", "drying-machina-green-tea-41022-4a21a7c.jpg"],
  ["Chunmee 41022 5a Azawad Export Tea", "https://www.chunlitea.com/chunmee-tea/41022-5a-loss-tea-weight-wholesale.html", "41022-5a-loss-tea-weight-wholesaleeb0bd.jpg"],
  ["Gunpowder Tea 9371 EL-Taj Export Tea", "https://www.chunlitea.com/chunmee-tea/gunpowder-tea-9371b-populaire-au-maroc.html", "gunpowder-tea-9371b-populaire-au-maroc8f508.jpg"],
  ["Chunmee 41022AAA El-Rakim Export Tea", "https://www.chunlitea.com/chunmee-tea/41022-6a-tea-leaves-for-sale.html", "41022-6a-tea-leaves-for-sale54c8c.jpg"],
  ["Chunmee 41022 6A Export Tea", "https://www.chunlitea.com/chunmee-tea/healthcare-supplements.html", "healthcare-supplements-tea-41022-6a97a23.jpg"],
  ["Chunli Best Lingyun Green Tea Export Tea", "https://www.chunlitea.com/chunmee-tea/chunli-best-lingyun-green-tea.html", "chunli-best-lingyun-green-tea37908.jpg"],
].map(([name, url, img]) => `              <div class="hot-row">
                <a class="hot-shot" href="${url}"><img src="${CDN}/uploads/28027/small/${img}" alt="${name}" loading="lazy"></a>
                <div class="hot-blurb">
                  <a class="hot-name" href="${url}">${name}</a>
                  <a class="hot-more" href="${url}">read more</a>
                </div>
              </div>`).join("\n");

const newsData = [
  ["Jun 09, 2021", "For The First Time in The Yangtze River Delta, This Special Train Departs Today! Towards The Largest City in Central Asia...", "Exciting! \u201cChunli Train - Shengzhou Tea Special Train\u201d It just drove away~ Shengzhou green tea \u201cdrove\u201d country's door Go to...", "202128027/n202106091134083441132.jpg", "https://www.chunlitea.com/news/for-the-first-time-in-the-yangtze-river-delta-46525834.html"],
  ["Nov 16, 2020", "The Third China Shaoxing International Friendship Cities Conference", "Mr. Huang Chunjun, chairman of Chunli Tea Co., Ltd, participated in the 3rd China Shaoxing International Sister Cities Conference. Witnessed by rep...", "202028027/n202011161108523283976.jpg", "https://www.chunlitea.com/news/the-third-china-shaoxing-international-friends-39767116.html"],
  ["Oct 14, 2020", "Didier Dacko, Ambassador Of The Republic Of Mali To China And Counselor Bokary Bocoum Visited Chunli Tea", "Didier Dacko, Ambassador of the Republic of Mali to China and Counselor Bokary Bocoum were invited to visit Zhejiang Chunli Company, and together w...", "202028027/n202010141603382868084.jpg", "https://www.chunlitea.com/news/didier-dacko-ambassador-of-the-republic-of-ma-38809233.html"],
  ["Oct 21, 2020", "The Tea Market Under The Influence Of The COVID-19 Epidemic", "In 2020, the world tea market will see major changes! In January this year, the World Bank predicted that after a 5% drop in t...", "202028027/n202010211626466187202.jpg", "https://www.chunlitea.com/news/the-tea-market-under-the-influence-of-the-covi-39028528.html"],
  ["Nov 05, 2020", "The CHUNLI Story", "Zhejiang Chunli Tea Industry Co., Ltd. is one of the most professional gunpowder tea manufacturers and suppliers in China for over 30 years...", "202028027/n202011051641182149423.jpg", "https://www.chunlitea.com/news/the-chunli-story-39496083.html"],
  ["Sep 05, 2026", "Rui\u2019an Agri-Training Group Visits Chunli Tea", "Rui'an Agri-Training Group Visits Chunli Tea 01. On September 4, 2026, a delegation of 55 trainees from the Rui'an High-Quality Farmer Training Program (specializing in cross-border e\u2011commerce and ...", "28027/news/n20260905140842e87f5.jpg", "https://www.chunlitea.com/news/rui-an-agri-training-group-visits-chunli-tea-85631543.html"],
  ["Aug 14, 2026", "Zhejiang Tea Expert Visits Chunli Tea Factory", "Zhejiang Tea Expert Visits Chunli Tea Factory 01. On August 12, Yu Liaoyuan, chief tea expert of Zhejiang's Department of Agriculture and Rural Affairs, visited Chunfeng Tea Factory, a branch of Ch...", "28027/news/n20260814161321d7ea9.jpg", "https://www.chunlitea.com/news/zhejiang-tea-expert-visits-chunli-tea-factory-85613628.html"],
  ["May 21, 2026", "Famous Painter Mr. Zhang Hao Visits Chunli Tea Industry For Guidance", "Famous Painter Mr. Zhang Hao Visits Chunli Tea Industry for Guidance 01. On the morning of May 20, Mr. Zhang Hao, former Chairman of Zhejiang Provincial Federation of Literary and Art Circles and a...", "28027/news/n20260521155759a980d.jpg", "https://www.chunlitea.com/news/famous-painter-mr-zhang-hao-visits-chunli-tea-85539331.html"],
  ["Apr 20, 2026", "Vice Mayor Visits Chunli Tea", "Vice Mayor Visits Chunli Tea 01. On the afternoon of April 15, Qiu Liangfeng, Vice Mayor of Shengzhou Municipal People's Government, led a delegation to visit Zhejiang Chunli Tea Co., Ltd. for inve...", "28027/news/n20260420171129f048b.jpg", "https://www.chunlitea.com/news/vice-mayor-visits-chunli-tea-85511544.html"],
  ["Apr 18, 2026", "Shengzhou Municipal Party Committee And Municipal Government Visited Chunli Tea", "Shengzhou Municipal Party Committee and Municipal Government Visited Chunli Tea 01. On the morning of April 16, a research group from the Advisory Committee for Decision-making of the CPC Shengzhou...", "28027/news/n20260418173759d6d5f.jpg", "https://www.chunlitea.com/news/shengzhou-municipal-party-committee-and-munici-85509793.html"],
  ["Mar 21, 2026", "Deputy Director Of The Zhejiang Provincial Department Of Agriculture And Rural Affairs Visited Chunli Tea", "Deputy Director Of The Zhejiang Provincial Department Of Agriculture And Rural Affairs Visited Chunli Tea 01...", "28027/news/n20260321143458e6056.jpg", "https://www.chunlitea.com/news/deputy-director-of-the-zhejiang-provincial-dep-85483049.html"],
  ["Mar 13, 2026", "The Fragrance Of Tea And The Warmth Of Spring\u2014Chunli Women S...", "The Fragrance Of Tea And The Warmth Of Spring\u2014Chunli Women Sail Into The New Journey 01...", "28027/news/n20260313171639e19a3.jpg", "https://www.chunlitea.com/news/the-fragrance-of-tea-and-the-warmth-of-spring-85464156.html"],
];

const newsCards = newsData.map(([date, title, text, img, url]) => `        <li class="news-cell">
          <a class="news-shot" href="${url}"><img src="${CDN}/uploads/${img}?size=360x0" alt="${title.replace(/"/g, "&quot;")}" loading="lazy"></a>
          <div class="news-info">
            <div class="news-day"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 2.8V6m8-3.2V6"/></svg>${date}</div>
            <a class="news-name" href="${url}">${title}</a>
            <p class="news-snippet">${text}</p>
            <div class="news-more"><a href="${url}">Read More
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>
            </a></div>
          </div>
        </li>`).join("\n");

const newslistMain = `
<main>

  <div class="page-banner">
    <div class="banner-shot">
      <img src="${CDN}/uploads/202128027/ImgScroll/ba202112031504029108873.jpg?size=1920x300" width="1920" height="300" alt="News banner">
    </div>
    <div class="banner-bar">
      <div class="shell banner-bar-row">
        <div class="crumbs">
          <a class="crumb-home" href="https://www.chunlitea.com/" title="Home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3.5 10.5 12 3l8.5 7.5"/><path d="M5.5 9.5V20h13V9.5"/></svg>
            Home
          </a>
          <span class="crumb-sep">/</span>
          <span class="crumb-current">News</span>
        </div>
        <h1 class="banner-heading">News</h1>
      </div>
    </div>
  </div>

  <section class="page-main-wrap">
    <div class="shell">
      <div class="board-cols">
__SIDEBAR__

        <div class="list-stage">
          <ul class="news-cards">
__NEWSCARDS__
          </ul>

          <div class="page-nav">
            <span>First</span>
            <span class="is-cur">1</span>
            <a href="https://www.chunlitea.com/newslist-2">2</a>
            <a href="https://www.chunlitea.com/newslist-3">3</a>
            <a href="https://www.chunlitea.com/newslist-4">4</a>
            <a href="https://www.chunlitea.com/newslist-5">5</a>
            <a href="https://www.chunlitea.com/newslist-6">6</a>
            <a href="https://www.chunlitea.com/newslist-7">7</a>
            <a href="https://www.chunlitea.com/newslist-20">Last</a>
          </div>
        </div>

      </div>
    </div>
  </section>

  <section class="inquiry-band" id="toInquiry">
    <div class="shell">
      <div class="band-title">Send Inquiry</div>
      <form class="inq-form" onsubmit="return false">
        <div class="inq-row">
          <input class="inq-input" type="email" placeholder="E-mail:*" aria-label="E-mail (required)">
          <input class="inq-input" type="text" placeholder="Phone/WhatsApp:" aria-label="Phone or WhatsApp">
        </div>
        <textarea class="inq-area" placeholder="Please include details like size,weight,destination port and etc., so that we can quote the best price.*" aria-label="Inquiry details"></textarea>
        <button class="inq-submit" type="submit">Leave a message</button>
      </form>
    </div>
  </section>

</main>
`;
let newsHtml = tweak(head, {
  current: "newslist-1",
  langPath: "/newslist-1",
  cssFiles: ["taxonomy.css", "news.css"],
  title: "News - Zhejiang Chunli Tea Co., Ltd. (Study Replica)",
  desc: "Study replica of the Chunli Tea news list page rebuilt from scratch.",
}) + newslistMain + foot;
newsHtml = newsHtml.replace("__SIDEBAR__", newsSidebar.replace("__HOTPRODUCTS__", hotProducts)).replace("__NEWSCARDS__", newsCards);
fs.writeFileSync("news.html", newsHtml);
console.log("news.html written:", newsHtml.length);

// ============================================================ SINGLE NEWS
const IMG = (p) => CDN + p;
const articleImgs = [
  "/Content/uploads/2021646163/20210609103029d9e75d6dde1f46a29f9adea96d8b63a5.jpg",
  "/Content/uploads/2021646163/20210609110050ee85555de0984535acdead45c41ba60c.jpg",
  "/Content/uploads/2021646163/2021060910411258fd05b21835406cb2989e6eba654085.jpg",
  "/Content/uploads/2021646163/20210609105735b1cdd3eabda64c75ad0ade29b63f5c8e.jpg",
  "/Content/uploads/2021646163/202106091045247dffdd60242542299a245946269590fa.jpg",
  "/Content/uploads/2021646163/202106091046389f0dd5004f514dacad032dcb3fd88661.jpg",
  "/Content/uploads/2021646163/20210609104912eeb060caddbe462e8d90c68f54b709dc.jpg",
  "/Content/uploads/2021646163/2021060910560505c27a6cae9c476f8f401df75e5a0b1f.jpg",
  "/Content/uploads/2021646163/202106091050320dee822bdfcd4dc0b58e6a575490e388.jpg",
  "/Content/uploads/2021646163/20210609110910f47258b2663e48b6a413db718e82cedf.jpg",
  "/Content/uploads/2021646163/20210609111734723fded5e08d408eaa50de8e523a82e3.png",
  "/Content/uploads/2021646163/202106091117152ad1690a8516451ba4f6583ec41a3a1d.jpg",
];

const singleNewsMain = `
<main>

  <div class="page-banner">
    <div class="banner-bar">
      <div class="shell banner-bar-row">
        <div class="crumbs">
          <a class="crumb-home" href="https://www.chunlitea.com/" title="Home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3.5 10.5 12 3l8.5 7.5"/><path d="M5.5 9.5V20h13V9.5"/></svg>
            Home
          </a>
          <span class="crumb-sep">/</span>
          <a href="https://www.chunlitea.com/newslist-1">News</a>
          <span class="crumb-sep">/</span>
          <span class="crumb-current">Content</span>
        </div>
        <div class="banner-heading">News</div>
      </div>
    </div>
  </div>

  <section class="page-main-wrap">
    <div class="shell">
      <div class="board-cols">
__SIDEBAR__

        <div class="list-stage">
          <div class="news-box">
            <p class="news-date"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 2.8V6m8-3.2V6"/></svg>Jun 09, 2021</p>
            <h1 class="news-title">For The First Time in The Yangtze River Delta, This Special Train Departs Today! Towards The Largest City in Central Asia...</h1>
            <div class="news-meta">
              <p class="meta-views"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg><span>View(s)</span></p>
              <p class="meta-msg" role="button">Leave a message</p>
            </div>
            <div class="news-body">
              <p style="text-align:center">Exciting!</p>
              <p style="text-align:center">&quot;Chunli Train - Shengzhou Tea Special Train&quot;</p>
              <p style="text-align:center">It just drove away~</p>
              <p style="text-align:center">Shengzhou green tea &quot;drove&quot; country's door</p>
              <p style="text-align:center">Go to Central Asia!</p>
              <p>Thanks to CCTV News, China News Network, Zhejiang Daily, Toutiao Today, Shengzhou News, Shengzhou Live, Shaoxing Evening News and many other mainstream media reports.</p>
              <div class="center-img"><img src="${IMG(articleImgs[0])}" alt="Chunli Shengzhou tea special train" loading="lazy"></div>
              <p>Today (June 8) morning, with the sound of siren, a China-Europe (Yixinou) train carrying 100 TEUs of Shengzhou green tea, &quot;Chunli-Shengzhou Tea Special Train&quot;, set off from Yiwu towards The largest city in Central Asia-Tashkent, the capital of Uzbekistan, drove away.</p>
              <div class="center-img"><img src="${IMG(articleImgs[1])}" alt="Departure ceremony" loading="lazy"></div>
              <p>Chinese word:<br>China-Europe Train<br>Departure Ceremony of Chunli<br>(Yiwu - Tashkent)<br>2021, June, 8th</p>
              <div class="center-img"><img src="${IMG(articleImgs[2])}" alt="Departure ceremony site" loading="lazy"></div>
              <div class="center-img"><img src="${IMG(articleImgs[3])}" alt="Tea train" loading="lazy"></div>
              <p>&#9670;Zhou Jianhua</p>
              <p>Zhejiang Provincial Department of Commerce<br>Foreign Trade Service Center<br>Director:</p>
              <p>Shengzhou Green Tea goes abroad in the form of a whole train. This is not only the first time for Chunli, but also the first time for Zhejiang Green Tea. It is also the first special tea train in the Yangtze River Delta. This is bound to expand overseas markets for Shengzhou tea and serve Zhejiang The development of provincial agricultural products has played a strong role in promoting.</p>
              <div class="center-img"><img src="${IMG(articleImgs[4])}" alt="Green tea garden" loading="lazy"></div>
              <p>In 2020, the country's green tea exports were 293,000 tons, accounting for 84.1% of the total tea exports, while Shengzhou was in a leading position in the country with nearly 60,000 tons of pearl tea exports, and it was a veritable hometown of tea.</p>
              <div class="center-img"><img src="${IMG(articleImgs[5])}" alt="Tea leaves" loading="lazy"></div>
              <p>Chinese word:<br>Chunli good tea, makes the world fragrant.</p>
              <p>As one of the main tea export enterprises in Shengzhou, Chunli Tea Industry has been committed to introducing to the world high-quality and good-quality green tea with low pesticide residues and good taste. After years of hard work, it has established a strong presence in Central Asia, the European Union, North Africa and other regions. Brand influence.</p>
              <div class="center-img"><img src="${IMG(articleImgs[6])}" alt="Chunli factory" loading="lazy"></div>
              <p>Chinese word:<br>There is a tea factory in Zhejiang called Chunli, who tells the story of Chunli and tastes good tea.</p>
              <p>However, since last year, due to the impact of the global epidemic, land, sea, and air transportation have been blocked to varying degrees, and the export volume of Chinese green tea has fluctuated, and the pace of Shengzhou green tea going abroad has also been affected. Under the new situation, how to turn crises into opportunities and go against the trend? The official launch of the &quot;Belt and Road&quot; China-Europe Express has brought inspiration and hope to enterprises.</p>
              <div class="center-img"><img src="${IMG(articleImgs[7])}" alt="Belt and Road train" loading="lazy"></div>
              <p>Chinese word:<br>Congratulations to Zhejiang Chunli Tea Co., Ltd. &middot; Chunli - Shengzhou Green Tea Train on the smooth departure.</p>
              <div class="center-img"><img src="${IMG(articleImgs[8])}" alt="Tea special train departure" loading="lazy"></div>
              <div class="center-img"><img src="${IMG(articleImgs[9])}" alt="Train carrying tea" loading="lazy"></div>
              <p>Chinese Words:<br>China - Europe (Yiwu - Tashkent)<br>Chunli<br>Shengzhou Green Tea Special Train</p>
              <p>Looking at the far away train, Huang Chunjun, chairman of Zhejiang Chunli Tea Industry Co., Ltd., described his feelings as &quot;just like a daughter marrying away&quot;.</p>
              <p>&#9670;Huang Chunjun</p>
              <p>Zhejiang Chunli Tea Industry<br>Chairman of the Board</p>
              <p>This is the first time that we have cooperated with Yixinou, named Chunli Company, and it is also the first train in Zhejiang Province. We must continuously deliver Chunli tea to their market, and let Chunli tea become more and more popular. They also imported our tea culture into Uzbekistan.</p>
              <p>Huang Chunjun, chairman of Zhejiang Chunli Tea Industry Co., Ltd., said that the &quot;Belt and Road&quot; China Railway Express has brought him inspiration and hope. &quot;The China-Europe Express Express has short shipping time, low cost, large capacity, zero contact, economical and environmental protection, safety and efficiency, which can effectively help our tea go out and actively expand overseas markets.&quot;</p>
              <div class="center-img"><img src="${IMG(articleImgs[10])}" alt="Special tea train" loading="lazy"></div>
              <p>Chinese words:<br>Special Tea Train</p>
              <p>Up to now, the area of 180,000 mu of tea gardens in Shengzhou has reached 105,000 mu of improved varieties of tea gardens, and a traceability management system has been introduced in the export of tea. With the increasing influence of Shengzhou green tea in the world, the International Tea Committee also awarded Shengzhou the title of &quot;World Famous Tea Village&quot;.</p>
              <div class="center-img"><img src="${IMG(articleImgs[11])}" alt="Chunli tea garden" loading="lazy"></div>
              <p>Chunli Company, will export high-quality green tea to the world all the time.</p>
              <p>Looking forward to your win-win cooperation, please contact for import business:<br>Address: 379 Punan Road, Shengzhou City, Zhejiang Province, China</p>
            </div>
          </div>

          <div class="prev-next">
            <a href="https://www.chunlitea.com/news/china-europe-high-quality-development-forum-fo-46622384.html" class="pn-cell prev">
              <span class="pn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 5l-7 7 7 7"/></svg>
              </span>
              <span class="pn-label">China-Europe High-quality Development Forum For Railway Express Held in Ningbo</span>
            </a>
            <a href="https://www.chunlitea.com/news/the-first-tea-train-in-the-yangtze-river-delta-46518114.html" class="pn-cell next">
              <span class="pn-label">The First Tea Train in The Yangtze River Delta Named Chunli Set Off To Central Asia, Shengzhou Tea Goes To The World</span>
              <span class="pn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
              </span>
            </a>
          </div>
        </div>

      </div>
    </div>
  </section>

  <section class="inquiry-band" id="toInquiry">
    <div class="shell">
      <div class="band-title">Send Inquiry</div>
      <form class="inq-form" onsubmit="return false">
        <div class="inq-row">
          <input class="inq-input" type="email" placeholder="E-mail:*" aria-label="E-mail (required)">
          <input class="inq-input" type="text" placeholder="Phone/WhatsApp:" aria-label="Phone or WhatsApp">
        </div>
        <textarea class="inq-area" placeholder="Please include details like size,weight,destination port and etc., so that we can quote the best price.*" aria-label="Inquiry details"></textarea>
        <button class="inq-submit" type="submit">Leave a message</button>
      </form>
    </div>
  </section>

</main>
`;
let singleHtml = tweak(head, {
  current: "newslist-1",
  langPath: "/newslist-1",
  cssFiles: ["taxonomy.css", "news.css", "product.css"],
  title: "For The First Time in The Yangtze River Delta, This Special Train Departs Today! - Chunli Tea (Study Replica)",
  desc: "Study replica of a Chunli Tea single news page rebuilt from scratch.",
}) + singleNewsMain + foot;
singleHtml = singleHtml.replace("__SIDEBAR__", newsSidebar.replace("__HOTPRODUCTS__", hotProducts));
fs.writeFileSync("single-news.html", singleHtml);
console.log("single-news.html written:", singleHtml.length);
