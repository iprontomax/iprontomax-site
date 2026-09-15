const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
});

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
form?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get('name');
  status.textContent = `${name}, sua solicitação foi preparada. Na próxima etapa conectaremos este formulário ao WhatsApp ou ao CRM da iProntoMAX.`;
});

document.querySelector('#year').textContent = new Date().getFullYear();
