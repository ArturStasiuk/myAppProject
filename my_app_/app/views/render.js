//import { BaseModule } from '../public/js/module.js';

class render  {
  constructor() {
    
    this.name = "render";
  }

  /** Renduje i wyświetla dynamiczną kartę z navbar, content i footer
   * @param {Object} config - konfiguracja karty
   * @param {string} config.id - unikalne ID karty
   * @param {string} [config.className] - dodatkowa klasa CSS dla karty
   * @param {string} [config.navbar] - HTML dla navbar karty
   * @param {string} [config.content] - HTML dla zawartości karty
   * @param {string} [config.footer] - HTML dla stopki karty
   * @param {Array} [config.ikony] - tablica ikon (stringów) do navbar karty
   * @param {Object} [config.atrybuty] - dodatkowe atrybuty do ustawienia na karcie
   */
  card(config) {
    if (!config || typeof config !== 'object') {
        console.error('Config musi być obiektem');
        return null;
    }

    if (!config.id) {
        console.error('ID jest wymagane');
        return null;
    }

    const { id, className = '', navbar = '', content = '', footer = '', ikony = [], atrybuty = {} } = config;

    const karta = document.createElement('div');
    karta.id = id;
    karta.className = className ? `karta ${className}` : 'karta';

    for (const [klucz, wartosc] of Object.entries(atrybuty)) {
        karta.setAttribute(klucz, wartosc);
    }

    // NAVBAR
    const navbarDiv = document.createElement('div');
    navbarDiv.className = 'navbar-karta';

    const navbarLeft = document.createElement('div');
    navbarLeft.className = 'navbar-karta-left';

    const toggle = document.createElement('button');
    toggle.className = 'navbar-karta-toggle';
    toggle.textContent = '☰';

    const menuDiv = document.createElement('div');
    menuDiv.className = 'navbar-karta-menu';

    ikony.forEach(ikona => {
        const btn = document.createElement('button');
        if (typeof ikona === 'object' && ikona.text) {
            btn.textContent = ikona.text;
            if (ikona.attributes && typeof ikona.attributes === 'object') {
                Object.entries(ikona.attributes).forEach(([key, value]) => {
                    btn.setAttribute(key, value);
                });
            }
            if (typeof ikona.onClick === 'function') {
                btn.addEventListener('click', ikona.onClick);
            }
        } else {
            btn.textContent = ikona;
        }
        menuDiv.appendChild(btn);
    });

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDiv.classList.toggle('widoczny');
    });

    navbarLeft.appendChild(toggle);
    navbarLeft.appendChild(menuDiv);

    const close = document.createElement('button');
    close.className = 'navbar-karta-close';
    close.textContent = '❌';

    close.addEventListener('click', (e) => {
        e.stopPropagation();
        karta.remove();
    });

    navbarDiv.appendChild(navbarLeft);

    if (navbar) {
        const navbarContent = document.createElement('div');
        navbarContent.innerHTML = navbar;
        navbarDiv.appendChild(navbarContent);
    }

    navbarDiv.appendChild(close);

    // CONTENT
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content-karta';
    contentDiv.innerHTML = content;

    // Obsługa <script> w content
    // Usuwanie starego skryptu jeśli istnieje
    const mainContent = document.getElementById('content');
    const existingCard = document.getElementById(id);
    if (existingCard) {
        // Usuwamy stare skrypty powiązane z tą kartą
        const oldScripts = existingCard.querySelectorAll('script[data-karta-script="' + id + '"]');
        oldScripts.forEach(s => s.remove());
    }

    // Dodaj nowy skrypt jeśli jest w content
    // (obsługuje tylko pierwszy <script> w content, można rozszerzyć na wiele)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        // Przepisz atrybuty
        for (const attr of script.attributes) {
            newScript.setAttribute(attr.name, attr.value);
        }
        newScript.textContent = script.textContent;
        newScript.setAttribute('data-karta-script', id);
        karta.appendChild(newScript);
    });

    // FOOTER
    const footerDiv = document.createElement('div');
    footerDiv.className = 'footer-karta';
    footerDiv.innerHTML = footer;

    karta.appendChild(navbarDiv);
    karta.appendChild(contentDiv);
    karta.appendChild(footerDiv);

    if (existingCard) {
        existingCard.replaceWith(karta);
    } else {
        mainContent.prepend(karta);
    }

    return karta;
  }

/* Usuwa całą zawartość z #content, w tym widoki i powiązane skrypty */
deleteContent() {
    const mainContent = document.getElementById('content');
    if (!mainContent) return;

    // Usuń wszystkie skrypty powiązane z kartami (data-karta-script)
    const scripts = mainContent.querySelectorAll('script[data-karta-script]');
    scripts.forEach(script => script.remove());

    // Usuń wszystkie dzieci (widoki, elementy itp.)
    while (mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild);
    }
}


/* renduje przyciski w panelu bocznym
*@param {Array} buttons - tablica obiektów przycisków
*@param {string} buttons[].text - tekst przycisku
*@param {function} buttons[].onClick - funkcja wywoływana po kliknięciu przycisku
*@param {data-action} buttons[].data-action - atrybut danych przycisku
*@param {data-param} buttons[].data-param - atrybut danych przycisku
 */
  sideBar(buttons = []) {
    const aside = document.getElementById('sideBar');
    aside.innerHTML = '';

    buttons.forEach(config => {
        const btn = document.createElement('button');
        btn.textContent = config.text || 'Przycisk';
        btn.addEventListener('click', config.onClick);

        // Dodaj atrybuty jeśli są zdefiniowane
        if (config['data-action']) {
            btn.setAttribute('data-action', config['data-action']);
        }
        if (config['data-param']) {
            btn.setAttribute('data-param', config['data-param']);
        }
        // Dodaj inne atrybuty jeśli są w config.attributes (obiekt)
        if (config.attributes && typeof config.attributes === 'object') {
            Object.entries(config.attributes).forEach(([key, value]) => {
                btn.setAttribute(key, value);
            });
        }

        aside.appendChild(btn);
    });
  }

  /* renduje przyciski w navbarze
  *@param {Array} button - tablica obiektów przycisków
  *@param {string} button[].text - tekst przycisku
  *@param {function} button[].onClick - funkcja wywoływana po kliknięciu przycisku
  *@param {data-action
    button[].data-action - atrybut danych przycisku
    *@param {data-param} button[].data-param - atrybut danych przycisku
    */
  navBar(button=[]){
    const navbar = document.getElementById('navBar');
    navbar.innerHTML = '';

    button.forEach(config => {
        const btn = document.createElement('button');
        btn.textContent = config.text || 'Przycisk';
        btn.addEventListener('click', config.onClick);

        if (config['data-action']) {
            btn.setAttribute('data-action', config['data-action']);
        }
        if (config['data-param']) {
            btn.setAttribute('data-param', config['data-param']);
        }
        if (config.attributes && typeof config.attributes === 'object') {
            Object.entries(config.attributes).forEach(([key, value]) => {
                btn.setAttribute(key, value);
            });
        }

        navbar.appendChild(btn);
    });
  }








}

export default render;