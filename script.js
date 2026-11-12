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

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

document.querySelectorAll('[data-plan]').forEach(btn => {
  btn.addEventListener('click', () => {
    const select = document.querySelector('#planSelect');
    if (select) select.value = btn.dataset.plan;
  });
});

const form = document.querySelector('#leadForm');
const status = document.querySelector('#formStatus');
const whatsappNumber = '5599981794200';
const phoneInput = form?.elements.namedItem('phone');
const validAreaCodes = new Set('11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'.split(' '));
function phoneDigits(value) {
  let digits = String(value).replace(/\D/g, '');
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) digits = digits.slice(2);
  return digits;
}
function formatPhone(value) {
  const digits = phoneDigits(value);
  if (digits.length > 11) return value;
  if (digits.length < 3) return digits ? '(' + digits : '';
  const area = '(' + digits.slice(0, 2) + ') ';
  const local = digits.slice(2);
  const split = local.length > 8 ? 5 : 4;
  return area + local.slice(0, split) + (local.length > split ? '-' + local.slice(split) : '');
}
function validatePhone() {
  if (!phoneInput) return false;
  const digits = phoneDigits(phoneInput.value);
  const local = digits.slice(2);
  const valid = validAreaCodes.has(digits.slice(0, 2)) &&
    (/^9[0-9]{8}$/.test(local) || /^[2-5][0-9]{7}$/.test(local));
  phoneInput.setCustomValidity(valid ? '' : 'Informe um WhatsApp válido com DDD. Exemplo: (99) 98179-4200.');
  return valid;
}
phoneInput?.addEventListener('input', () => {
  phoneInput.setCustomValidity('');
  phoneInput.value = formatPhone(phoneInput.value);
});
phoneInput?.addEventListener('change', () => {
  phoneInput.value = formatPhone(phoneInput.value);
});
phoneInput?.addEventListener('blur', () => {
  if (phoneInput.value.trim()) validatePhone();
});
if (phoneInput?.value) phoneInput.value = formatPhone(phoneInput.value);
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
  if (!validatePhone()) { phoneInput.reportValidity(); return; }
  values.phone = formatPhone(values.phone);
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


// An enlarged, keyboard-accessible map; the inline map remains usable without it.
const mapDialog = document.querySelector('#coverageMapDialog');
const mapViewport = document.querySelector('#mapViewport');
const mapExpand = document.querySelector('#expandCoverageMap');
const mapZoom = document.querySelector('#mapZoom');
const mapZoomValue = document.querySelector('#mapZoomValue');
const inlineMap = document.querySelector('.coverage-map > .coverage-map-svg');
if (mapDialog && typeof mapDialog.showModal === 'function' && mapViewport && inlineMap) {
  function updateMapZoom() {
    const baseWidth = Math.max(850, mapViewport.clientWidth);
    mapViewport.style.setProperty('--map-zoom-width', baseWidth * Number(mapZoom.value) / 100 + 'px');
    mapZoomValue.value = mapZoom.value + '%';
  }
  mapExpand.addEventListener('click', () => {
    const mapCopy = inlineMap.cloneNode(true);
    const ids = new Map();
    mapCopy.querySelectorAll('[id]').forEach(el => ids.set(el.id, 'enlarged-' + el.id));
    mapCopy.querySelectorAll('*').forEach(el => {
      for (const attr of [...el.attributes]) {
        let value = attr.value;
        if (attr.name === 'id') value = ids.get(value) || value;
        else {
          ids.forEach((newId, oldId) => { value = value.replaceAll('url(#' + oldId + ')', 'url(#' + newId + ')'); });
          if (attr.name === 'aria-labelledby' || attr.name === 'aria-describedby') value = value.split(' ').map(id => ids.get(id) || id).join(' ');
        }
        el.setAttribute(attr.name, value);
      }
    });
    mapCopy.setAttribute('aria-labelledby', inlineMap.getAttribute('aria-labelledby').split(' ').map(id => ids.get(id) || id).join(' '));
    mapViewport.replaceChildren(mapCopy);
    mapZoom.value = '100';
    mapDialog.showModal();
    updateMapZoom();
    mapViewport.scrollLeft = (mapViewport.scrollWidth - mapViewport.clientWidth) / 2;
    mapViewport.scrollTop = 65;
  });
  mapZoom.addEventListener('input', updateMapZoom);
  mapDialog.addEventListener('click', event => {
    if (event.target !== mapDialog) return;
    const rect = mapDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) mapDialog.close();
  });
  mapDialog.addEventListener('close', () => mapExpand.focus());
  mapExpand.hidden = false;
}
