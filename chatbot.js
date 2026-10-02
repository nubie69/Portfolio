(() => {
  // Local, curated replies only. Update these alongside the portfolio content.
  const topics = [
    { match: /\b(alagad|capstone|campus)\b/, text: 'ALAGAD is Zach’s smart campus navigation capstone for Bukidnon State University. It includes campus maps, destination search, smart directions, and an AI information assistant.', links: [['Explore ALAGAD', 'alagad.html']] },
    { match: /\b(zarvival|game|games|java)\b/, text: 'ZARVIVAL is a Java 2D platformer with playable characters, enemies, levels, audio, and menu and pause flows.', links: [['Explore ZARVIVAL', 'zarvival.html']] },
    { match: /\b(bottle|bottles|coin|recycling)\b/, text: 'Bottle to Coin is a sensor-based recycling prototype that exchanges clean plastic bottles for coins and rejects liquids and metal.', links: [['Explore Bottle to Coin', 'bottle-converter.html']] },
    { match: /\b(cloudbrew|coffee|mobile)\b/, text: 'CloudBrew is a role-based mobile POS app for coffee ordering, inventory, and shop operations, using Expo, React Native, and MongoDB.', links: [['Explore CloudBrew', 'cloudbrew.html']] },
    { match: /\b(robot|robotic|arduino)\b/, text: 'Zach’s robotic arm uses Arduino and servo motors to control movement across multiple degrees of freedom.', links: [['Explore the robotic arm', 'robotic-arm.html']] },
    { match: /\b(resume|cv)\b/, text: 'You can download Zach’s resume here for a closer look at his background and experience.', links: [['Download resume', 'assets/resume/Zach-Gelacio-Resume.pdf']] },
    { match: /\b(contact|email|hire|hiring|internship|internships|available|availability|collaborate|collaboration|work together)\b/, text: 'Zach is open to internships, collaborations, and entry-level opportunities. Email him at 2301101807@student.buksu.edu.ph. This chat does not send messages to him.', links: [['Email Zach', 'mailto:2301101807@student.buksu.edu.ph'], ['Contact section', 'index.html#contact']] },
    { match: /\b(certificates?|certifications?|credentials?)\b/, text: 'Zach’s credentials cover networking, ICT, and AI, including Cisco Networking Academy’s Switching, Routing, and Wireless Essentials and AI literacy courses.', links: [['View certificates', 'certificates.html']] },
    { match: /\b(skills?|stack|technologies|tools|frontend|backend|front end|back end|html|css|javascript|php|laravel|database)\b/, text: 'Zach works with HTML, CSS, JavaScript, Node.js, Express.js, PHP, Laravel, MongoDB, and MySQL. His portfolio also highlights responsive layouts, prototyping, CRUD workflows, and documentation.', links: [['See skills', 'index.html#skills']] },
    { match: /\b(projects?|builds?|built|iot|portfolio)\b/, text: 'Explore Zach’s work in web, mobile, games, and IoT: ALAGAD, ZARVIVAL, Bottle to Coin, CloudBrew, and an Arduino robotic arm.', links: [['All projects', 'projects.html'], ['ALAGAD', 'alagad.html'], ['CloudBrew', 'cloudbrew.html']] },
    { match: /\b(about|zach|who|education|study|studying|student|degree|background)\b/, text: 'Zach Andrie B. Gelacio is a 4th-year BS Information Technology student. He builds websites, mobile apps, and IoT prototypes, with a focus on clear design and useful applications.', links: [['More about Zach', 'index.html#about'], ['Education', 'index.html#education']] },
    { match: /\b(hi|hello|hey|help)\b/, text: 'Hi! I’m Zach’s portfolio guide. Ask me about his projects, skills, education, certificates, resume, or how to get in touch.' },
    { match: /\b(thanks|thank you|bye)\b/, text: 'Thanks for stopping by! Feel free to explore the projects or get in touch with Zach.', links: [['Explore projects', 'projects.html']] }
  ];
  const widget = document.createElement('aside');
  widget.className = 'portfolio-chat';
  widget.setAttribute('aria-label', 'Portfolio chat');
  widget.innerHTML = `
    <section class="chat-panel" id="portfolio-chat-panel" role="dialog" aria-labelledby="chat-title" aria-describedby="chat-description" hidden>
      <div class="chat-header">
        <span class="chat-avatar" aria-hidden="true">ZG</span>
        <div><h2 id="chat-title">Zach’s portfolio guide</h2><p>Let’s find your next stop.</p></div>
        <button class="chat-close" type="button" aria-label="Close chat">&times;</button>
      </div>
      <p class="chat-description" id="chat-description">Quick answers from this portfolio. Automated, not live chat.</p>
      <div class="chat-messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions" tabindex="0"></div>
      <div class="chat-suggestions" aria-label="Suggested questions">
        <button type="button">About Zach</button><button type="button">Projects</button><button type="button">Skills</button><button type="button">Resume</button><button type="button">Contact</button>
      </div>
      <form class="chat-form">
        <label class="chat-input-label" for="chat-input">Your question</label>
        <div class="chat-compose"><input id="chat-input" type="text" placeholder="Ask about Zach’s work…" maxlength="500" autocomplete="off" enterkeyhint="send"><button type="submit" aria-label="Send question" disabled>&#8593;</button></div>
      </form>
      <p class="chat-note">Local replies · Messages aren’t sent or saved.</p>
    </section>
    <button class="chat-launcher" type="button" aria-expanded="false" aria-controls="portfolio-chat-panel">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H4l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M8 10h8M8 14h5"/></svg><span>Ask about Zach</span>
    </button>`;
  document.body.append(widget);
  const panel = widget.querySelector('.chat-panel');
  const launcher = widget.querySelector('.chat-launcher');
  const messages = widget.querySelector('.chat-messages');
  const input = widget.querySelector('input');
  const send = widget.querySelector('[type="submit"]');

  function addMessage(text, sender, links = []) {
    const message = document.createElement('div');
    message.className = `chat-message chat-message--${sender}`;
    const label = document.createElement('span');
    label.className = 'chat-message-label';
    label.textContent = sender === 'user' ? 'You' : 'Portfolio guide';
    const body = document.createElement('p');
    body.textContent = text;
    message.append(label, body);
    if (links.length) {
      const actions = document.createElement('div');
      actions.className = 'chat-links';
      links.forEach(([title, href]) => {
        const link = document.createElement('a');
        link.textContent = title;
        link.href = href;
        if (href.endsWith('.pdf')) link.download = 'Zach-Andrie-Gelacio-Resume.pdf';
        actions.append(link);
      });
      message.append(actions);
    }
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) {
      input.focus({ preventScroll: true });
      messages.scrollTop = messages.scrollHeight;
    } else launcher.focus({ preventScroll: true });
  }

  function ask(question) {
    const value = question.trim().slice(0, 500);
    if (!value) return;
    addMessage(value, 'user');
    const normalized = value.toLowerCase().replace(/[-’']/g, ' ');
    const reply = topics.find(topic => topic.match.test(normalized)) || {
      text: 'I only have preset answers about Zach’s portfolio. Try asking about projects, skills, certificates, or a resume. For anything else, contact Zach directly.',
      links: [['Contact Zach', 'index.html#contact']]
    };
    addMessage(reply.text, 'bot', reply.links);
    input.value = '';
    send.disabled = true;
    input.focus({ preventScroll: true });
  }

  launcher.addEventListener('click', () => setOpen(panel.hidden));
  widget.querySelector('.chat-close').addEventListener('click', () => setOpen(false));
  widget.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {
      event.stopPropagation();
      setOpen(false);
    }
  });
  input.addEventListener('input', () => { send.disabled = !input.value.trim(); });
  widget.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    ask(input.value);
  });
  widget.querySelectorAll('.chat-suggestions button').forEach(button => {
    button.addEventListener('click', () => ask(button.textContent));
  });
  // Keep the existing modal image viewer's background non-interactive.
  const syncLightbox = () => { widget.inert = document.body.classList.contains('lightbox-open'); };
  new MutationObserver(syncLightbox).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  syncLightbox();
  addMessage('Hi there! Looking around? I can help you explore Zach’s projects, skills, and background. What would you like to know?', 'bot');
})();
