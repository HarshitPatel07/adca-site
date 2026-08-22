"""
Builds every page of the Agarwal & Dhandhania site.

The header, green navigation bar, contact band and footer live here once and are
stamped into all 10 pages. The navigation itself is rendered in the browser from
assets/js/data.js, so menu changes need no rebuild — only page copy does.

Run from anywhere:      python _tools/build_pages.py
"""

import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --------------------------------------------------------------------------
# shared chrome
# --------------------------------------------------------------------------

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>@TITLE@ - Agarwal &amp; Dhandhania | Chartered Accountants</title>
<meta name="description" content="@DESC@">
<link rel="icon" href="assets/img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body data-page="@KEY@">

<div class="progress"></div>
"""

SOCIAL = """      <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M15 3h-3a4 4 0 0 0-4 4v3H6v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z"/></svg></a>
      <a href="#" aria-label="X"><svg viewBox="0 0 24 24"><path d="M3 3h4.6l4.3 6 5-6H21l-6.9 8.2L21.4 21h-4.6l-4.6-6.4L6.7 21H3.9l7.3-8.7z"/></svg></a>
      <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3.3 9h3.4v12H3.3zM9.2 9h3.3v1.7c.6-1.1 1.9-2 3.6-2 2.6 0 4.1 1.7 4.1 4.8V21h-3.4v-6.9c0-1.6-.6-2.5-1.9-2.5-1.2 0-2 .8-2 2.5V21H9.2z"/></svg></a>
      <a href="mailto:connect@adcaindia.com" aria-label="Email"><svg viewBox="0 0 24 24"><path d="M3 5h18v14H3zm1.8 1.6L12 12l7.2-5.4z"/></svg></a>
      <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.8C18.3 5 12 5 12 5s-6.3 0-7.9.5A2.5 2.5 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.8C5.7 19 12 19 12 19s6.3 0 7.9-.5a2.5 2.5 0 0 0 1.7-1.8C22 15.2 22 12 22 12zM10 15.2V8.8L15.5 12z"/></svg></a>"""

HEADER = """
<!-- ===================== HEADER ===================== -->
<header class="site-header">
  <div class="container header-top">

    <a class="logo" href="index.html">
      <img src="assets/img/logo.png" alt="Agarwal &amp; Dhandhania — Chartered Accountants">
      <span class="logo-sep">&rsaquo;</span>
      <span class="logo-tag">
        <span class="dark">Celebrating</span> <span class="amber">66</span><br>
        <span class="amber">Years</span> <span class="dark">of Existence</span>
      </span>
    </a>

    <div class="social-chips">
@SOCIAL@
    </div>

    <button class="burger" aria-label="Toggle navigation"><span></span><span></span><span></span></button>
  </div>

  <!-- navigation is rendered from assets/js/data.js -->
  <div class="nav-bar">
    <div class="container"><ul class="main-nav"></ul></div>
  </div>
</header>
"""

BANNER = """
<section class="page-banner">
  <div class="container">
    <h1>@TITLE@</h1>
    <p class="crumb"><a href="index.html">Home</a> &nbsp;/&nbsp; <span>@TITLE@</span></p>
  </div>
</section>
"""

CONTACT_BAND = """
<!-- ===================== QUICK CONTACT / CONTACT INFO ===================== -->
<section class="contact-band" id="quick-contact">

  <div class="qc">
    <div class="qc-inner">
      <h2>Quick Contact</h2>
      <form novalidate>
        <div class="fld"><input type="text" placeholder="First Name *" required><span class="err"></span></div>
        <div class="fld"><input type="text" placeholder="Last Name *" required><span class="err"></span></div>
        <div class="fld"><input type="email" placeholder="Email *" required><span class="err"></span></div>
        <div class="fld"><input type="tel" placeholder="Phone *" required><span class="err"></span></div>
        <div class="fld full"><textarea placeholder="Message *" required></textarea><span class="err"></span></div>
        <label class="robot">
          <input type="checkbox">
          <span>I'm not a robot</span>
          <span class="cap">reCAPTCHA<br>Privacy - Terms</span>
        </label>
        <button class="btn full" type="submit">Submit</button>
        <p class="msg"></p>
      </form>
    </div>
  </div>

  <div class="ci">
    <div class="ci-inner">
      <h2>Contact Info</h2>

      <div class="ci-row">
        <span class="ci-ico"><svg viewBox="0 0 24 24"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg></span>
        <div>
          <h4>Head Office</h4>
          <b>Agarwal &amp; Dhandhania</b>
          <p>204-205, SNS Interio, 4th Floor, Bhatar Althan Road, Nr Gujarat Gas Pump, Surat-395017 (Gujarat).</p>
        </div>
      </div>

      <div class="ci-row">
        <span class="ci-ico"><svg viewBox="0 0 24 24"><path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L15 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg></span>
        <div><p><a href="tel:02612269131">0261-2269131</a></p></div>
      </div>

      <div class="ci-row">
        <span class="ci-ico"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14"/><path d="m3.5 6 8.5 6 8.5-6"/></svg></span>
        <div><p><a href="mailto:connect@adcaindia.com">connect@adcaindia.com</a></p></div>
      </div>

    </div>
  </div>
</section>
"""

FOOTER = """
<!-- ===================== FOOTER ===================== -->
<div class="foot-dark"></div>

<footer>
  <nav class="foot-nav"><div class="container"><ul></ul></div></nav>

  <div class="newsletter">
    <div class="container">
      <div class="nl-title">
        <span class="ico"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14"/><path d="m3.5 6 8.5 6 8.5-6"/></svg></span>
        <span>Subscribe To Our Newsletter</span>
      </div>
      <form>
        <input type="email" placeholder="Enter your email address here*" required>
        <button type="submit">Subscribe</button>
      </form>
      <p class="nl-msg"></p>
    </div>
  </div>

  <div class="copyright">
    <div class="container">
      <p>Copyright 2025 Agarwal &amp; Dhandhania. All Rights Reserved.</p>
      <div class="social-chips">
@SOCIAL@
      </div>
    </div>
  </div>
</footer>

<button class="to-top" aria-label="Back to top"><svg viewBox="0 0 24 24"><path d="M12 5 4 13h5v6h6v-6h5z"/></svg></button>

<script src="assets/js/data.js"></script>
<script src="assets/js/main.js"></script>
</body>
</html>
"""


def render(key, title, desc, body, banner=True):
    html = HEAD + HEADER + (BANNER if banner else "") + body + CONTACT_BAND + FOOTER
    html = html.replace("@SOCIAL@", SOCIAL)
    html = html.replace("@TITLE@", title).replace("@DESC@", desc).replace("@KEY@", key)
    return html


# --------------------------------------------------------------------------
# page bodies
# --------------------------------------------------------------------------

HOME = """
<!-- ===================== HERO SLIDER ===================== -->
<section class="hero">
  <div class="slides"></div>
  <button class="hero-arrow prev" aria-label="Previous slide"><svg viewBox="0 0 24 24"><path d="M15.4 3.6 7 12l8.4 8.4 1.4-1.4L9.8 12l7-7z"/></svg></button>
  <button class="hero-arrow next" aria-label="Next slide"><svg viewBox="0 0 24 24"><path d="M8.6 3.6 7.2 5l7 7-7 7 1.4 1.4L17 12z"/></svg></button>
  <div class="hero-dots"></div>
</section>

<!-- ===================== COUNTERS ===================== -->
<div class="stats"><div class="container" id="stats"></div></div>

<!-- ===================== ABOUT ===================== -->
<section class="section">
  <div class="container about-grid">
    <div class="seal reveal">
      <img src="assets/img/about-logo.jpg" alt="Celebrating 66 years of existence">
      <span class="seal-years" id="seal-years">66 Years</span>
    </div>
    <div class="about-copy reveal">
      <h2 class="sec-head sec-head--inline underline">
        <span class="dark">About</span> <span class="amber">Agarwal &amp; Dhandhania</span>
      </h2>
      <div id="about-copy" style="margin-top:20px"></div>
      <a class="btn" href="about.html">Read more</a>
    </div>
  </div>
</section>

<!-- ===================== SERVICES ===================== -->
<section class="section section--gray">
  <div class="container">
    <div class="svc-head">
      <h2 class="sec-head underline"><span class="dark">Our</span><span class="amber">Services</span></h2>
      <p>Agarwal &amp; Dhandhania has grown steadily both in terms of size and the scope of its
        services, through strengthening its professional team and a sustained focus on providing
        sound practical advice at a reasonable price.</p>
      <a class="btn" href="services.html">View All</a>
    </div>
    <div class="svc-grid" id="svc-grid"></div>
  </div>
</section>

<!-- ===================== WHY ===================== -->
<section class="why">
  <div class="container">
    <h2 class="sec-head sec-head--inline underline center">
      <span class="dark">Why</span> <span class="amber">Agarwal &amp; Dhandhania</span>
    </h2>
    <div class="arc-wrap" id="arc-wrap"></div>
    <ul class="why-list" id="why-list"></ul>
  </div>
</section>
"""

ABOUT = """
<section class="section">
  <div class="container two-col">
    <div class="prose">

      <h2 id="who" class="sec-head sec-head--inline underline">
        <span class="dark">Who</span> <span class="amber">We Are</span>
      </h2>

      <p style="margin-top:22px">Agarwal &amp; Dhandhania, was founded in 1960 , can trace its
        roots back well over half a century.</p>

      <p>The firm started its functioning as Advisory in the field of Auditing and Taxation with
        the intent to set the standard of professional services in terms of Quality. The journey
        of AD has not only received recognition but also strive it with more commitment to uplift
        the level of proficiency and upgrade benchmarks as a true contributor in refinement of
        economic stratums.</p>

      <p>Since the last decade AD has put noteworthy contributions not only in Auditing &amp;
        Taxation but also inculcating other allied services such as Management Consultancy,
        Corporate Advisory to distinct organizations both in Public &amp; Private arena.</p>

      <p>Now adding up the varied dimensions AD has exceptionally progressed well in terms of its
        reach in diversified sectors of economy. Strengthening the team and building its capacity
        is the only mantra followed to achieve eminence.</p>

      <p>With the blend of Comprehensive and Constructive approach in our practice areas we also
        accommodate our services in Information and Risk Management, Tax Planning, Strategic
        Financial advice, Designing of Business operations and enhance its functioning
        effectively.</p>

      <p>We take pride in the fact that we are one of the few firms to combine professionalism
        with innovation and highly personalized service to clients. Currently, Agarwal &amp;
        Dhandhania has seven partners handling its operations PAN India.</p>

      <h2>Our Team Strength</h2>
      <p>Our team strength comprises of more than 300 professionals and supportive staff
        distinguished as</p>
      <div class="chip-grid" id="designations"></div>

      <h2>A Broad Based Advisory Approach</h2>
      <p>While retaining its proficiency in core practice areas, Agarwal &amp; Dhandhania now
        follows a broad based advisory approach that makes it a partner in its clients&rsquo;
        overall business strategies and their successes.</p>
      <p>Agarwal &amp; Dhandhania comprehensive approach includes information, risk management,
        tax-minimization plans, designing business information systems and strategic financial
        advice.</p>

    </div>

    <aside class="side-card">
      <h4>About Us</h4>
      <ul>
        <li><a class="active" href="about.html#who">Who We Are</a></li>
        <li><a href="team.html">Our Team</a></li>
        <li><a href="values.html">Our Values</a></li>
        <li><a href="network.html">Our Network</a></li>
        <li><a href="careers.html">Careers</a></li>
      </ul>
      <h4 style="margin-top:22px">Talk To Us</h4>
      <p style="font-size:13px">0261-2269131<br>
        <a href="mailto:connect@adcaindia.com" style="color:var(--green)">connect@adcaindia.com</a></p>
      <a class="btn" href="contact.html">Contact Us</a>
    </aside>
  </div>
</section>
"""

TEAM = """
<section class="section">
  <div class="container two-col">
    <div class="prose">
      <h2 class="sec-head sec-head--inline underline">
        <span class="dark">Our</span> <span class="amber">Team</span>
      </h2>

      <p style="margin-top:22px">Driven by the passion for quality and bedrock of professional
        integrity our people are our underpinning strength. To ensure that we are effective and
        efficient we have organised and maintained the functional hierarchy which leads us towards
        shared values and principles of business conduct which helps in shaping who we are, What
        we believe and How we deliver.</p>

      <p>We believe in nurturing a knowledge base that enables us to deliver premium value. All
        our team members are top drawers after rigorous selection process and they are exposed to
        extensive &amp; continuous learning and development process to make them the best in
        class. Our team is a combination of young and dynamic team of qualified members and
        seniors &amp; experienced professionals.</p>

      <h2>Composition</h2>
      <p>Seven partners handle operations PAN India, supported by a team of more than 300 members
        comprising of</p>
      <div class="chip-grid" id="designations"></div>
    </div>

    <aside class="side-card">
      <h4>About Us</h4>
      <ul>
        <li><a href="about.html#who">Who We Are</a></li>
        <li><a class="active" href="team.html">Our Team</a></li>
        <li><a href="values.html">Our Values</a></li>
      </ul>
      <h4 style="margin-top:22px">Join Us</h4>
      <p style="font-size:13px">We are always glad to hear from qualified professionals.</p>
      <a class="btn" href="careers.html">Careers</a>
    </aside>
  </div>
</section>
"""

VALUES = """
<section class="section">
  <div class="container two-col">
    <div class="prose">
      <h2 class="sec-head sec-head--inline underline">
        <span class="dark">Vision</span> <span class="amber">&amp; Mission</span>
      </h2>

      <h2 style="margin-top:26px">Vision</h2>
      <blockquote>&ldquo;A professional is someone who can do his best work when he doesn&rsquo;t
        feel like it.&rdquo;<cite>&mdash; Alistair Cooke</cite></blockquote>
      <blockquote>Quality is not an act, it is a habit.<cite>&mdash; Aristotle</cite></blockquote>
      <blockquote>Leadership is not about the next election, it&rsquo;s about the next
        generation.<cite>&mdash; Simon Sinek</cite></blockquote>
      <blockquote>Hold yourself responsible for a higher standard than anybody expects of you.
        Never excuse yourself.<cite>&mdash; Henry Ward Beecher</cite></blockquote>

      <h2>Mission</h2>
      <p>The firm operates as a constructive mechanism in the attainment of the objectives of its
        clients. We believe that this is the appropriate attitude to provide an integrated service
        to our Clients.</p>
      <p>We believe that our future depends on maintaining determination, experience and
        enthusiasm of our Chartered Accountants, and the integrity, effectiveness, sound judgement
        and discretion with which we conduct our client&rsquo;s affairs. The firm aims to
        continually develop its skills to meet new demands in areas where it can add significant
        value to our client&rsquo;s businesses at both a strategic and transactional level.</p>

      <h2>Corporate Vision Statement</h2>
      <blockquote style="border-left-color:var(--green);font-size:15.5px">&ldquo;To help our
        clients create such high levels of economic value that together we set new standards of
        excellence in our respective industries.&rdquo;</blockquote>
    </div>

    <aside class="side-card">
      <h4>About Us</h4>
      <ul>
        <li><a href="about.html#who">Who We Are</a></li>
        <li><a href="team.html">Our Team</a></li>
        <li><a class="active" href="values.html">Our Values</a></li>
      </ul>
    </aside>
  </div>
</section>
"""

SERVICES = """
<section class="section">
  <div class="container">
    <h2 class="sec-head sec-head--inline underline">
      <span class="dark">Our</span> <span class="amber">Services</span>
    </h2>
    <p style="margin:20px 0 14px;text-align:justify;font-size:14px">In the form of our
      professional commitments to unveil the disruptions and recommend the corrective and
      precautionary actions to the organizations we contribute for a better tomorrow.</p>
    <p style="font-size:13px;color:#7c847e;margin-bottom:24px">Select a practice area to see the
      full scope of work.</p>

    <div class="svc-grid" id="svc-grid" style="margin-bottom:34px"></div>
    <div id="svc-detail"></div>
  </div>
</section>
"""

NETWORK = """
<section class="section">
  <div class="container prose">
    <h2 class="sec-head sec-head--inline underline">
      <span class="dark">Our</span> <span class="amber">Network</span>
    </h2>

    <p style="margin-top:22px">&ldquo;Agarwal &amp; Dhandhania&rdquo; is the brand under which
      dedicated professionals and associates throughout the country collaborate to provide audit,
      consulting, financial advisory, risk advisory, tax and related services to its clients.</p>
    <blockquote>&ldquo;We don&rsquo;t consider boundaries to be constraint in providing the
      services to our clients&rdquo;</blockquote>
    <p>Below are the key locations where we have our widespread network that provides the local
      flexible and effective execution capability:</p>

    <h2 id="branches">Head Office &amp; Branches</h2>
    <div class="branch-grid" id="branch-grid"></div>

    <h2 id="camp" style="margin-top:36px">Camp Office Network</h2>
    <p style="font-size:13px;color:#7c847e;margin-bottom:14px">
      <b id="camp-summary" style="color:var(--green)"></b> &mdash; expand a state to see its cities.</p>
    <div id="camp-list"></div>
  </div>
</section>
"""

PUBLICATION = """
<section class="section">
  <div class="container prose">
    <h2 class="sec-head sec-head--inline underline">
      <span class="dark">Our</span> <span class="amber">Publications</span>
    </h2>

    <p style="margin-top:22px">Our wide and extensive range of publications includes Expert Advice
      on Implications of Union Budget, Monthly Banking Newsletter, Articles magazine called as
      Knowledge Hub and other publications in relation with the current and economic affairs of
      our nation.</p>

    <p>The making of Budget Publication is in itself a vital specimen representing team work and
      the level of competent expertise on varied subject matters. We release our Union Budget
      Publication by the following day of announcement of Budget with all the analysis in a
      concrete and precise manner. The detailed analysis on its impact pertaining to all the
      different sectors of economy along with the expert opinion on compliance subject to
      strategic planning and management.</p>

    <p>We consider ourselves fortunate enough on getting such an outstanding response from people
      engaged in different sectors all over the country. With every budget to be announced we not
      only put our observations in it but also provide the recommendations on it which helps our
      clients to unfold optimum opportunities for their development.</p>

    <h2>Budget Publications</h2>
    <p style="font-size:13px;color:#7c847e;margin-bottom:14px">Every budget publication released
      since 2009. These open the corresponding page on adcaindia.com &mdash; repoint them at your
      own PDFs once uploaded.</p>
    <div class="pub-grid" id="pub-grid"></div>
  </div>
</section>
"""

CAREERS = """
<section class="section">
  <div class="container prose">
    <h2 class="sec-head sec-head--inline underline">
      <span class="dark">Careers</span> <span class="amber">With Us</span>
    </h2>

    <p style="margin-top:22px">Driven by the passion for quality and bedrock of professional
      integrity our people are our underpinning strength. All our team members are top drawers
      after a rigorous selection process, and are exposed to an extensive and continuous learning
      and development process to make them the best in class.</p>

    <h2>Where You Can Join</h2>
    <div class="tile-grid">
      <div class="tile reveal">
        <h3>Article Section</h3>
        <p>Articleship with a firm practising since 1960 &mdash; exposure across statutory audit,
          tax audit, GST compliance and advisory work, under partner-level review.</p>
      </div>
      <div class="tile reveal">
        <h3>Staff</h3>
        <p>Paid assistants and qualified professionals across audit, taxation, accounting support
          and forensic assignments, at our Surat head office and branches.</p>
      </div>
      <div class="tile reveal">
        <h3>Current Openings</h3>
        <p>Positions are filled on a rolling basis across our eight branches. Send us your CV and
          we will be in touch when a suitable role opens in your practice area.</p>
      </div>
    </div>

    <h2>What We Look For</h2>
    <ul>
      <li>Technical ability matched with professional integrity.</li>
      <li>Willingness to learn continuously &mdash; the law does not stand still.</li>
      <li>Clear written and spoken communication with clients.</li>
      <li>Ownership of the work from planning through to sign-off.</li>
    </ul>

    <h2>How To Apply</h2>
    <p>Email your curriculum vitae to
      <a href="mailto:connect@adcaindia.com" style="color:var(--green)">connect@adcaindia.com</a>
      with the position in the subject line.</p>
    <a class="btn" href="mailto:connect@adcaindia.com">Email Your CV</a>
  </div>
</section>
"""

GALLERY = """
<section class="section">
  <div class="container">
    <h2 class="sec-head sec-head--inline underline">
      <span class="dark">Gallery</span> <span class="amber">&amp; Events</span>
    </h2>
    <p style="margin:20px 0 26px;font-size:14px">Seminars, training sessions, staff programmes and
      firm events. Click any photograph to open it full size &mdash; use the arrow keys to move
      through the set.</p>
    <div class="gal-grid" id="gal-grid"></div>
  </div>
</section>
"""

CONTACT = """
<section class="section">
  <div class="container two-col">
    <div class="prose">
      <h2 class="sec-head sec-head--inline underline">
        <span class="dark">Contact</span> <span class="amber">Us</span>
      </h2>

      <p style="margin-top:22px">Thanks For Your Interest In adcaindia.com. Please Fill The Form
        Below If You Have Any Questions About Our Services &amp; We&rsquo;ll Get Back With You
        Very Soon.</p>

      <h2>Head Office</h2>
      <div class="tbl-scroll">
        <table class="tbl">
          <tr><th>Address</th>
              <td>204-205, SNS Interio, 4th Floor, Bhatar Althan Road,<br>
                  Nr Gujarat Gas Pump, Surat-395017 (Gujarat).</td></tr>
          <tr><th>Phone</th><td><a href="tel:02612269131" style="color:var(--green)">0261-2269131</a></td></tr>
          <tr><th>Email</th><td><a href="mailto:connect@adcaindia.com" style="color:var(--green)">connect@adcaindia.com</a></td></tr>
          <tr><th>Office Hours</th><td>Monday to Saturday, 10:30 am &ndash; 7:00 pm</td></tr>
        </table>
      </div>

      <h2>Branches Across India</h2>
      <div class="branch-grid" id="branch-grid"></div>

      <h2>Find Us</h2>
      <p style="font-size:13px;color:#7c847e">Paste your Google Maps embed in place of the block
        below to show the live map.</p>
      <div style="background:var(--gray-bg);border:1px solid var(--gray-line);aspect-ratio:16/7;
                  display:grid;place-items:center;text-align:center">
        <p style="font-size:13px;color:#7c847e;max-width:36ch">Google Maps embed<br>
          Agarwal &amp; Dhandhania, Chartered Accountants &mdash; Bhatar Althan Road, Surat</p>
      </div>
    </div>

    <aside class="side-card">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="services.html">Our Services</a></li>
        <li><a href="about.html#who">Who We Are</a></li>
        <li><a href="network.html">Our Network</a></li>
        <li><a href="careers.html">Careers</a></li>
      </ul>
      <h4 style="margin-top:22px">Call Us</h4>
      <p style="font-size:13px">0261-2269131</p>
    </aside>
  </div>
</section>
"""

# --------------------------------------------------------------------------
# build
# --------------------------------------------------------------------------

PAGES = [
    ("index.html", "home", "Home",
     "Agarwal & Dhandhania, Chartered Accountants — founded 1960. Audit & risk assurance, "
     "corporate advisory, management consultancy, accounting support, direct & indirect "
     "taxation, forensic audit, turnkey support, KPO & BPO. Surat, Gujarat.",
     HOME, False),

    ("about.html", "about", "Who We Are",
     "Agarwal & Dhandhania was founded in 1960 and traces its roots back well over half a "
     "century. Seven partners PAN India supported by more than 300 professionals.",
     ABOUT, True),

    ("team.html", "about", "Our Team",
     "Our people are our underpinning strength — Chartered Accountants, CMAs, Company "
     "Secretaries, CFAs, CISAs and more across Agarwal & Dhandhania.",
     TEAM, True),

    ("values.html", "about", "Our Values",
     "Vision, mission and corporate vision statement of Agarwal & Dhandhania, "
     "Chartered Accountants.",
     VALUES, True),

    ("services.html", "services", "Services",
     "Audit & risk assurance, corporate advisory, management consultancy, accounting & business "
     "support, direct & indirect taxation, forensic & investigation audit, turnkey support, "
     "KPO & BPO.",
     SERVICES, True),

    ("network.html", "network", "Our Network",
     "Head office in Surat, eight branches across India and a camp-office network spanning "
     "20 states and 117 cities.",
     NETWORK, True),

    ("publication.html", "pub", "Publication",
     "Union Budget publications from 2009-2010 to 2025-2026, monthly banking newsletter and the "
     "Knowledge Hub articles magazine.",
     PUBLICATION, True),

    ("careers.html", "careers", "Careers",
     "Article section and staff openings at Agarwal & Dhandhania, Chartered Accountants, Surat.",
     CAREERS, True),

    ("gallery.html", "gallery", "Gallery &amp; Events",
     "Seminars, training sessions and firm events at Agarwal & Dhandhania, Chartered Accountants.",
     GALLERY, True),

    ("contact.html", "contact", "Contact Us",
     "Contact Agarwal & Dhandhania — 204-205, SNS Interio, Bhatar Althan Road, Surat-395017. "
     "Phone 0261-2269131, connect@adcaindia.com.",
     CONTACT, True),
]


def main():
    for filename, key, title, desc, body, banner in PAGES:
        html = render(key, title, desc, body, banner)
        with open(os.path.join(ROOT, filename), "w", encoding="utf-8") as fh:
            fh.write(html)
        print("wrote %-18s %6d bytes" % (filename, len(html)))


if __name__ == "__main__":
    main()
