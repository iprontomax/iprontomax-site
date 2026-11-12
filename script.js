const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function closeNavigation(returnFocus = false) {
  nav?.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
  menuBtn?.setAttribute('aria-label', 'Abrir menu');
  if (returnFocus) menuBtn?.focus();
}
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => closeNavigation());
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) closeNavigation(true);
});
document.addEventListener('click', event => {
  if (nav?.classList.contains('open') && !event.target.closest('.header-inner')) closeNavigation();
});
window.matchMedia('(min-width:981px)').addEventListener('change', event => {
  if (event.matches) closeNavigation();
});

const header = document.querySelector('.site-header');
const navigationLinks = [...document.querySelectorAll('.nav a:not(.nav-mobile-cta)')];
const pageSections = [...document.querySelectorAll('main > section[id]')];
let navigationFrame = 0;
function updateNavigation() {
  navigationFrame = 0;
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
  const threshold = (header?.getBoundingClientRect().height || 80) + 100;
  let activeId = pageSections[0]?.id;
  for (const section of pageSections) {
    if (section.getBoundingClientRect().top <= threshold) activeId = section.id;
  }
  navigationLinks.forEach(link => {
    if (link.hash === '#' + activeId) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', () => {
  if (!navigationFrame) navigationFrame = requestAnimationFrame(updateNavigation);
}, { passive: true });
window.addEventListener('resize', () => {
  if (!navigationFrame) navigationFrame = requestAnimationFrame(updateNavigation);
});
updateNavigation();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('[data-plan]').forEach(btn => {
  btn.addEventListener('click', () => {
    const select = document.querySelector('#planSelect');
    if (select) select.value = btn.dataset.plan;
  });
});

const form = document.querySelector('#leadForm');
const status = document.querySelector('#formStatus');
const whatsappNumber = '5599981794200';
form?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const fields = ['name', 'phone', 'address', 'plan'];
  const values = Object.fromEntries(fields.map(key => [key, String(data.get(key) || '').trim()]));
  for (const key of ['name', 'phone', 'address']) {
    const input = form.elements.namedItem(key);
    input.setCustomValidity(values[key] ? '' : 'Preencha este campo para consultar a cobertura.');
    if (!input.reportValidity()) return;
  }
  const message = [
    'Olá, equipe iProntoMAX! Quero consultar a cobertura e saber mais sobre a contratação.',
    '',
    '*Nome:* ' + values.name,
    '*WhatsApp:* ' + values.phone,
    '*Endereço/Bairro/Povoado:* ' + values.address,
    '*Plano de interesse:* ' + values.plan,
    '',
    'Podem verificar a disponibilidade para minha localidade e me informar os próximos passos?'
  ].join('\n');
  const url = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);
  window.open(url, '_blank', 'noopener,noreferrer');
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Abrir conversa no WhatsApp';
  status.replaceChildren(document.createTextNode('Sua mensagem está pronta. Confirme o envio no WhatsApp. '), link);
});
form?.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', () => input.setCustomValidity(''));
});

// A soft neon hotspot follows the pointer without moving the card or its contents.
document.querySelectorAll('.combo-max').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--neon-x', ((event.clientX - bounds.left) / bounds.width * 100) + '%');
    card.style.setProperty('--neon-y', ((event.clientY - bounds.top) / bounds.height * 100) + '%');
  });
  card.addEventListener('pointerleave', () => {
    card.style.removeProperty('--neon-x');
    card.style.removeProperty('--neon-y');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
