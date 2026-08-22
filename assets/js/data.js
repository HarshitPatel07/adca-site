/* ==========================================================================
   Agarwal & Dhandhania — site content
   --------------------------------------------------------------------------
   EVERY repeated block on the site is rendered from this one file: the slider,
   the service tiles and their detail lists, the "Why" arc labels, the counters,
   the branch list, the camp-office network, the budget publications and the
   gallery.

   To change site content you edit THIS file only — not the HTML. Counts such as
   "117 cities" and "20 states" are calculated, never typed.
   ========================================================================== */

window.ADCA = {

  /* ---- firm details -------------------------------------------------- */
  firm: {
    name: 'Agarwal & Dhandhania',
    tagline: 'Chartered Accountants',
    founded: 1960,
    // Head office. NOTE: the live site prints two different pincodes for this
    // same address — 395017 on the home page, 395002 on the network/contact
    // pages. 395017 is used here; correct it in one place if 395002 is right.
    address: '204-205, SNS Interio, 4th Floor, Bhatar Althan Road, ' +
             'Nr Gujarat Gas Pump, Surat-395017 (Gujarat).',
    phone: '0261-2269131',
    phoneHref: 'tel:02612269131',
    email: 'connect@adcaindia.com',
    hours: 'Monday to Saturday, 10:30 am – 7:00 pm'
  },

  /* ---- hero slider --------------------------------------------------- */
  slides: [
    { img: 'assets/img/New-Project.png',
      h: 'Celebrating <span>66 years</span> of existence',
      p: 'Founded in 1960, Agarwal & Dhandhania can trace its roots back well over half a century.',
      cta: 'About The Firm', href: 'about.html' },
    { img: 'assets/img/1.png',
      h: 'Sound practical advice at a <span>reasonable price</span>',
      p: 'A broad-based provider of management consultancy, accounting and taxation advice to a diverse set of geographically dispersed organizations.',
      cta: 'Our Services', href: 'services.html' },
    { img: 'assets/img/3.png',
      h: 'Seven partners, <span>PAN India</span>',
      p: 'Supported by a team of more than 300 professionals across eight branches and a camp-office network reaching 20 states.',
      cta: 'Our Network', href: 'network.html' },
    { img: 'assets/img/2.png',
      h: 'A partner in your <span>business strategy</span>',
      p: 'Information and risk management, tax-minimisation plans, business information systems and strategic financial advice.',
      cta: 'Who We Are', href: 'about.html#who' },
    { img: 'assets/img/13.png',
      h: 'Quality is not an act, <span>it is a habit</span>',
      p: 'Professional integrity and a rigorous selection process — our people are our underpinning strength.',
      cta: 'Our Values', href: 'values.html' }
  ],

  /* ---- counters (home) ----------------------------------------------- */
  stats: [
    { n: 66,  suffix: '',  label: 'Years Of Existence' },
    { n: 7,   suffix: '',  label: 'Partners PAN India' },
    { n: 300, suffix: '+', label: 'Professionals & Staff' },
    { n: 8,   suffix: '',  label: 'Branches Across India' }
  ],

  /* ---- about (home + about page) ------------------------------------- */
  about: {
    heading: ['ABOUT', 'AGARWAL & DHANDHANIA'],
    paras: [
      'Agarwal & Dhandhania, was founded in 1960 , can trace its roots back well over half a century.',
      'The firm initially rendered high quality audit and income tax advisory services to clients with operations localised in Western India. Particularly over the last decade however, Agarwal & Dhandhania has rapidly expanded to become a broad-based provider of Management consultancy,accounting and taxation advice to a diverse set of geographically dispersed organizations.',
      'Agarwal & Dhandhania has grown steadily both in terms of size and the scope of its services, through strengthening its professional team and a sustained focus on providing sound practical advice&hellip;'
    ]
  },

  /* ---- services ------------------------------------------------------ */
  /* icon = the firm's own PNG; iconWhite = the hover state sprite       */
  services: [
    {
      id: 'audit', name: 'Audit &amp; Risk Assurance',
      icon: 'service4.png', iconWhite: 'service4-white.png',
      items: ['Statutory Audit.', 'Internal Audit.', 'Tax Audit.', 'Concurrent Audit.',
              'Due Diligence Audit.', 'Forensic Audit.', 'Operations Audit.',
              'Management Audit.', 'Compliance Audit.', 'Inspection/ Investigation.',
              'Certification.', 'Stores Compliance Audit.', 'Fixed Assets Verification.']
    },
    {
      id: 'corporate', name: 'Corporate Advisory',
      icon: 'service3.png', iconWhite: 'service3-white.png',
      items: ['Event Management and Mass HR Planning.', 'Business Advisory.',
              'Transaction Support.', 'Business Valuation.', 'Corporate Finance.',
              'IFRS Advisory.', 'Merger and Acquisition.',
              'Private Equity and IPO Support.', 'Corporate Restructuring.',
              'Information System and Risk Management.']
    },
    {
      id: 'management', name: 'Management Consultancy',
      icon: 'service2.png', iconWhite: 'service2-white.png',
      items: ['Strategic decision making.', 'Brainstorming Sessions.',
              'Evaluation and Training on potential areas.',
              'Streamlining Operational and Functional aspects.', 'System designing.',
              "Formulation of SOP's.",
              'Performance Review and Comparative Analysis.',
              'Recommendations on Accounting, Taxation and Compliance Issues.']
    },
    {
      id: 'accounting', name: 'Accounting &amp; Business Support',
      icon: 'service5.png', iconWhite: 'service5-white.png',
      items: ['Accounting Services Including Management Accounting.',
              'Review of Accounting Systems.', 'Accounts /System Manual.',
              'Back–office operations including Payroll/ HR Processing.',
              'Transaction Processing – Orders/ Claims Processing.',
              'Standard Operating Processes.', 'Financial Verification.',
              'Claims Verification and Processing.', 'Certifications.']
    },
    {
      id: 'taxation', name: 'Direct &amp; Indirect Taxation',
      icon: 'service1.png', iconWhite: 'service1-white.png',
      groups: [
        { title: 'Direct Tax',
          items: ['Registration under Income tax Act - 1961.', 'Filing of tax returns.',
                  'Tax audits.', 'Representation before tax authorities.',
                  'Advisory services for Planning deductions / rebates / exemptions under the tax laws.',
                  'Personal investment strategy for optimum tax Management.',
                  'Tax management for both Individuals and Corporate level.',
                  'Investment planning for business expansions.', 'ROC Compliance .'] },
        { title: 'Indirect Tax — Goods &amp; Service Tax',
          items: ['Registrations under GST Act.',
                  'Ascertainment of applicable tax laws and ensuring its compliance.',
                  'Filing of periodical returns and remittance of tax dues.',
                  'Providing clarifications and opinions as and when required.',
                  'Advice on Compliance.',
                  'Providing Updates on significant changes in law.',
                  'Assist in compliance with procedures, availing of tax benefits, etc.',
                  'Assistance during assessments.',
                  'Litigation services involving strategy, preparation and filing of appeals and representation before the authorities.',
                  "Conducting introductory and advanced training to acquaint client's staff."] }
      ]
    },
    {
      id: 'forensic', name: 'Forensic &amp; Investigation Audit',
      icon: 'service7.png', iconWhite: 'service7-white.png',
      intro: 'Fraud Prevention and detection is of a paramount importance to every ' +
             'organisation. We conduct forensic audits with the objective of gathering ' +
             'quality evidence that can be presented in court or legal proceedings.',
      items: ['Fraud Investigation.', 'Development of a Fraud Prevention Plan.',
              'Fraud Hotline.', 'Forensic Auditing.',
              'Investigations into theft, fraud and corruption.',
              'Commercial crime investigations.', 'Procurement irregularities.',
              'Money laundering investigations.',
              'Financial mismanagement investigations.',
              'Non-compliance with legislation relating to both the private and public sectors.',
              'Risk management review.', 'Disciplinary process support.',
              'Quality assurance reviews.',
              'Data Mining, Analysis, Observations and Recommendations.']
    },
    {
      id: 'turnkey', name: 'Online &amp; Offline Trunkey Support',
      icon: 'service8.png', iconWhite: 'service8-white.png',
      items: ['Reduction in the Total Cost of Ownership.',
              'Fixed IT Management & Support Costs.',
              'Increased Efficiency and Competitiveness.',
              'Increased customer confidence through reduced downtime.',
              'Scalable and Flexible Payment Plans.',
              'Quick Implementation of New Technology.',
              'Professional, Certified, Qualified, Experience IT Professionals.',
              'Proactive Monitoring and Servicing.',
              'Continuing Infrastructure Assessment and Auditing.']
    },
    {
      id: 'kpo', name: 'Kpo &amp; Bpo',
      icon: 'service6.png', iconWhite: 'service6-white.png',
      paras: ['Business process outsourcing (BPO) is the contracting of non-primary business activities and functions to a third-party provider. BPO services include payroll, human resources (HR), accounting and customer/call center relations. BPO is also known as Information Technology Enabled Services (ITES).',
              'Knowledge process outsourcing (KPO) describes the outsourcing of core information-related business activities which are competitively important or form an integral part of a company\'s value chain. KPO requires advanced analytical and technical skills as well as a high degree of expertise.']
    }
  ],

  servicesIntro: 'In the form of our professional commitments to unveil the disruptions ' +
    'and recommend the corrective and precautionary actions to the organizations we ' +
    'contribute for a better tomorrow.',

  /* ---- why (arc labels, in visual order left→right) ------------------- */
  why: [
    { pos: 'l3', text: 'Celebrating 66 Years<br>Of Existence' },
    { pos: 'l2', text: 'Well-qualified &amp;<br>Experienced Professionals' },
    { pos: 'l1', text: 'Our Usp-country<br>Wide Network' },
    { pos: 'top', text: 'Cost Competitive<br>Services' },
    { pos: 'r1', text: 'Reliable And<br>Timely Services' },
    { pos: 'r2', text: 'Understanding Clients<br>Requirements' },
    { pos: 'r3', text: 'Customer Friendly<br>Approach' }
  ],

  /* ---- team ---------------------------------------------------------- */
  team: {
    intro: 'Driven by the passion for quality and bedrock of professional integrity our ' +
      'people are our underpinning strength. To ensure that we are effective and efficient ' +
      'we have organised and maintained the functional hierarchy which leads us towards ' +
      'shared values and principles of business conduct which helps in shaping who we are, ' +
      'What we believe and How we deliver.',
    intro2: 'We believe in nurturing a knowledge base that enables us to deliver premium ' +
      'value. All our team members are top drawers after rigorous selection process and ' +
      'they are exposed to extensive & continuous learning and development process to make ' +
      'them the best in class. Our team is a combination of young and dynamic team of ' +
      'qualified members and seniors & experienced professionals.',
    designations: [
      'Chartered Accountants (CA)', 'Cost &amp; Management Accountants (CMA)',
      'Company Secretaries (CS)', 'Certified Financial Analysts (CFA)',
      'Certified Information System Auditors (CISA)', 'Certified Internal Auditors (CIA)',
      'Certified Fraud Examiners (CFE)', 'Law Graduates (LLB)', 'Engineers',
      'Master in Business Administration (MBA)', 'Social Scientist'
    ]
  },

  /* ---- branches ------------------------------------------------------ */
  /* Addresses per the Contact Us / Our Network pages; phones per Our      */
  /* Network. NOTE: the live Our Branches page lists a DIFFERENT Mumbai    */
  /* address (Gorai/Borivali) — the Malad one below appears on two pages.  */
  branches: [
    { city: 'Delhi',     addr: '1333, Baidwara, Maliwada, Chandni Chowk, Delhi-110 006.', phone: '09825045937' },
    { city: 'Mumbai',    addr: '32, Sujata Niketan, Rani Sati Marg, Near Malad Railway Station, Malad East, Mumbai 400097', phone: '09879745937' },
    { city: 'Ahmedabad', addr: 'A-63, Rajshree Towers, Nr Prerna Tirth Derasar, Jodhpur Gam Road, Sattellite, Ahmedabad-380015.', phone: '09016471674' },
    { city: 'Jaipur',    addr: 'F 113 Kartarpur I.E, Road No 4, Jaipur-302006.', phone: '09664619711' },
    { city: 'Hyderabad', addr: 'B-4-548/1 2ND Left after, Gokul Theatre, Erragadda, Hyderabad-500016.', phone: '0141-4023510' },
    { city: 'Vapi',      addr: '208, Riddhi Siddhi Complex, Near Vapi Telephone Exchange, Vapi Char Rasta, Vapi-396191', phone: '09377661130' },
    { city: 'Chennai',   addr: 'K.N. Krishnamurthy, Door No:9, Plot No.153 A, 20th Avenue, Banunagar, Pudur, Ambattur, Chennai-600 053', phone: '' },
    { city: 'Kolkata',   addr: 'Shantiniketan Bldg, 9th Floor Room No.913, 8 Carnac Street, Kolkata 700017', phone: '' }
  ],

  /* ---- camp office network (city counts are computed, not typed) ------ */
  campIntro: '“Agarwal & Dhandhania” is the brand under which dedicated professionals and ' +
    'associates throughout the country collaborate to provide audit, consulting, financial ' +
    'advisory, risk advisory, tax and related services to its clients. “We don’t consider ' +
    'boundaries to be constraint in providing the services to our clients”',
  camp: [
    { state: 'Gujarat',        cities: ['Surat','Ahmadabad','Vadodara','Rajkot','Porbandar','Mehsana','Kutch','Amreli','Morbi','Ghandhinagar','Surendranagar','Bhavnagar','Jamnagar','Junagadh'] },
    { state: 'Maharashtra',    cities: ['Mumbai','Pune','Nagpur','Aurangabad','Kolhapur','Nashik','Akola-Jalgaon','Ratnagiri','Satara','Solapur','Yavatmal','Latur'] },
    { state: 'Uttar Pradesh',  cities: ['Noida','Lucknow','Kanpur','Ghaziabad','Varanasi','Bareilly','Gorakhpur','Prayagraj'] },
    { state: 'Karnataka',      cities: ['Bengaluru','Mysuru','Hubli','Kalaburagi','Mangaluru','Davanagere','Ballari'] },
    { state: 'Andhra Pradesh', cities: ['Vishakhapatnam','Vijaywada','Tirupati','Rajahmundry-Guntur','Nellore','Chittoor','Kurnool'] },
    { state: 'Tamil Nadu',     cities: ['Chennai','Coimbatore','Madurai','Salem','Erode','Tirunelveli','Puducherry'] },
    { state: 'Rajasthan',      cities: ['Jaipur','Ajmer','Kota','Jodhpur','Chittorgarth','Banswara'] },
    { state: 'West Bengal',    cities: ['Kolkata','Siliguri','Kharagpur','Darjeeling','Jalpaiguri'] },
    { state: 'Bihar',          cities: ['Patna','Gaya','Muzaffarpur','Darbhanga','Chhapra'] },
    { state: 'Assam',          cities: ['Guwahati','Tezpur','Shillong','Dimapur','Agartala'] },
    { state: 'Delhi',          cities: ['Faridabad','Gurgaon','Panipat','Rohtak','Sonipat'] },
    { state: 'Haryana',        cities: ['Faridabad','Gurugram','Panipat','Rohtak','Sonipat'] },
    { state: 'Madhya Pradesh', cities: ['Bhopal','Indore','Jabalpur','Gwalior','Ujjain'] },
    { state: 'Orissa',         cities: ['Bhubneswar','Cuttak','Puri','Rourkela'] },
    { state: 'Jharkhand',      cities: ['Ranchi','Jamshedpur','Dhanbad','Bokaro'] },
    { state: 'Punjab',         cities: ['Chandigarh','Ludhiana','Amritsar','Patiala'] },
    { state: 'Kerala',         cities: ['Thrissur','Ernakulam','Kozhikode','Trivandrum'] },
    { state: 'Telangana',      cities: ['Hyderabad','Warangal','Khammam','Karimnagar'] },
    { state: 'Uttarakhand',    cities: ['Dehradun','Haridwar','Rudrapur-Haldwani'] },
    { state: 'Chhattisgarh',   cities: ['Raipur','Bilaspur','Rajnandgaon'] }
  ],

  /* ---- publications -------------------------------------------------- */
  publicationIntro: 'Our wide and extensive range of publications includes Expert Advice on ' +
    'Implications of Union Budget, Monthly Banking Newsletter, Articles magazine called as ' +
    'Knowledge Hub and other publications in relation with the current and economic affairs ' +
    'of our nation. The making of Budget Publication is in itself a vital specimen ' +
    'representing team work and the level of competent expertise on varied subject matters. ' +
    'We release our Union Budget Publication by the following day of announcement of Budget ' +
    'with all the analysis in a concrete and precise manner.',
  budgets: [
    { label: 'Budget 2025-2026',           slug: 'budget-2025-2026' },
    { label: 'Budget 2024-2025',           slug: 'budget-2024-25' },
    { label: 'Budget 2024-2025 (Interim)', slug: 'budget-2024-25-interim' },
    { label: 'Budget 2023-2024',           slug: 'budget-2023-24' },
    { label: 'Budget 2022-2023',           slug: 'budget-2022-2023' },
    { label: 'Budget 2021-2022',           slug: 'budget-2021-22' },
    { label: 'Budget 2020-2021',           slug: 'budget-2020-2021' },
    { label: 'Budget 2019-2020',           slug: 'budget-2019-20' },
    { label: 'Budget 2019-2020 (Interim)', slug: 'budget-2019-2020-interim' },
    { label: 'Budget 2018-2019',           slug: 'budget-2018-2019' },
    { label: 'Budget 2017-2018',           slug: 'budget-2017-2018' },
    { label: 'Budget 2016-2017',           slug: 'budget-2016-2017' },
    { label: 'Budget 2015-2016',           slug: 'budget-2015-2016' },
    { label: 'Budget 2014-2015(2)',        slug: 'budget-2014-20152' },
    { label: 'Budget 2014-2015',           slug: 'budget-2014-2015' },
    { label: 'Budget 2013-2014',           slug: 'budget-2013-2014' },
    { label: 'Budget 2012-2013',           slug: 'budget-2012-2012' },
    { label: 'Budget 2011-2012',           slug: 'budget-2011-2012' },
    { label: 'Budget 2010-2011',           slug: 'budget-2010-2011-2' },
    { label: 'Budget 2009-2010',           slug: 'budget-2009-2010' }
  ],

  /* ---- values -------------------------------------------------------- */
  values: {
    quotes: [
      { q: 'A professional is someone who can do his best work when he doesn’t feel like it.', a: 'Alistair Cooke' },
      { q: 'Quality is not an act, it is a habit.', a: 'Aristotle' },
      { q: 'Leadership is not about the next election, it’s about the next generation.', a: 'Simon Sinek' },
      { q: 'Hold yourself responsible for a higher standard than anybody expects of you. Never excuse yourself.', a: 'Henry Ward Beecher' }
    ],
    paras: [
      'The firm operates as a constructive mechanism in the attainment of the objectives of its clients. We believe that this is the appropriate attitude to provide an integrated service to our Clients.',
      'We believe that our future depends on maintaining determination, experience and enthusiasm of our Chartered Accountants, and the integrity, effectiveness, sound judgement and discretion with which we conduct our client’s affairs. The firm aims to continually develop its skills to meet new demands in areas where it can add significant value to our client’s businesses at both a strategic and transactional level.'
    ],
    visionStatement: 'To help our clients create such high levels of economic value that ' +
      'together we set new standards of excellence in our respective industries.'
  },

  /* ---- careers ------------------------------------------------------- */
  careers: {
    intro: 'Our people are our underpinning strength. We look for candidates who combine ' +
      'technical ability with the professional integrity our practice is built on.',
    tracks: [
      { title: 'Article Section',
        body: 'Articleship under a firm practising since 1960 — exposure across statutory ' +
              'audit, tax audit, GST compliance and advisory work, with partner-level review.' },
      { title: 'Staff',
        body: 'Paid assistants and qualified professionals across audit, taxation, ' +
              'accounting support and forensic assignments at our Surat head office and branches.' },
      { title: 'Current Openings',
        body: 'Openings are filled on a rolling basis. Email your CV and we will contact ' +
              'you when a suitable position opens in your area of practice.' }
    ]
  },

  /* ---- gallery (24 real photographs from the firm's own gallery) ------ */
  gallery: (function () {
    var out = [], i;
    for (i = 1; i <= 24; i++) {
      out.push('assets/img/gallery-' + (i < 10 ? '0' + i : i) + '.jpg');
    }
    return out;
  })(),

  /* ---- navigation ---------------------------------------------------- */
  nav: [
    { key: 'home',     label: 'Home',            href: 'index.html' },
    { key: 'about',    label: 'About Us',        href: 'about.html', sub: [
        { label: 'Who We Are', href: 'about.html#who' },
        { label: 'Our Team',   href: 'team.html' },
        { label: 'Our Values', href: 'values.html' } ] },
    { key: 'services', label: 'Services',        href: 'services.html' },
    { key: 'network',  label: 'Our Network',     href: 'network.html', sub: [
        { label: 'Our Branches', href: 'network.html#branches' },
        { label: 'Camp Office',  href: 'network.html#camp' } ] },
    { key: 'pub',      label: 'Publication',     href: 'publication.html', sub: 'budgets' },
    { key: 'careers',  label: 'Careers',         href: 'careers.html' },
    { key: 'gallery',  label: 'Gallery & Events', href: 'gallery.html' },
    { key: 'contact',  label: 'Contact Us',      href: 'contact.html' }
  ]
};
