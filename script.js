// Datos de contacto: complétalos y los enlaces del final de la página se activan solos.
const CONTACTO = {
  email: 'etiq.creativos@gmail.com',
  whatsapp: '573054697133',   // solo números con código de país (57 = Colombia)
  instagram: 'etiq.design'    // usuario sin @
};

document.documentElement.classList.add('js');
document.getElementById('year').textContent = new Date().getFullYear();

// Menú móvil
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');
function setMenu(open) {
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  menu.classList.toggle('is-open', open);
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Aparición al hacer scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Comparador antes / después
document.querySelectorAll('[data-compare]').forEach(box => {
  const range = box.querySelector('.compare__range');
  const set = () => box.style.setProperty('--pos', range.value + '%');
  range.addEventListener('input', set);
  set();
});

// Enlaces de contacto
const links = {
  email: CONTACTO.email && 'mailto:' + CONTACTO.email,
  whatsapp: CONTACTO.whatsapp && 'https://wa.me/' + CONTACTO.whatsapp,
  instagram: CONTACTO.instagram && 'https://instagram.com/' + CONTACTO.instagram
};
document.querySelectorAll('[data-link]').forEach(a => {
  const href = links[a.dataset.link];
  if (href) a.href = href; else a.hidden = true;
});

// Formulario: abre el correo del visitante con el mensaje redactado
const form = document.getElementById('form');
const note = form.querySelector('.form__note');
form.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(form);
  const fields = [...form.querySelectorAll('input, textarea')];
  fields.forEach(el => el.removeAttribute('aria-invalid'));
  const bad = fields.filter(el => !el.value.trim() || (el.type === 'email' && !el.checkValidity()));
  if (bad.length) {
    bad.forEach(el => el.setAttribute('aria-invalid', 'true'));
    bad[0].focus();
    note.textContent = 'Revisa los campos marcados.';
    return;
  }
  if (!CONTACTO.email) {
    note.textContent = 'El envío aún no está configurado. Escríbenos por otro medio, ¡gracias!';
    return;
  }
  const asunto = encodeURIComponent('Contacto desde la web — ' + f.get('nombre'));
  const cuerpo = encodeURIComponent(f.get('mensaje') + '\n\n' + f.get('nombre') + '\n' + f.get('correo'));
  location.href = `mailto:${CONTACTO.email}?subject=${asunto}&body=${cuerpo}`;
  note.textContent = 'Se abrió tu correo para enviar el mensaje.';
});
