/*przelacza widok sideBar */
function przelaczSideBar() {
    const panel = document.getElementById('sideBar');
    const main = document.getElementById('content');
    const czyWidoczny = panel.classList.contains('widoczny');
    
    if (!czyWidoczny) {
        panel.classList.add('widoczny');
        main.style.marginLeft = '200px';
    } else {
        panel.classList.remove('widoczny');
        main.style.marginLeft = '0';
    }
}

/* ukrywa sideBar */
function ukryjSideBar() {
    const panel = document.getElementById('sideBar');
    if (panel.classList.contains('widoczny')) {
        panel.classList.remove('widoczny');
        document.getElementById('content').style.marginLeft = '0';
    }
}

/* zmienia motyw strony */
function zmienMotyw() {
    document.body.classList.toggle('light');
}

// INICJALIZACJA
window.addEventListener('load', async () => {
    // Poczekaj aż wszystkie moduły będą dostępne
    while (!window.Render || !window.SideBar) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
// Ustaw początkowy motyw
// zmienMotyw(); 
 // srawdzanie sesji    

 
    /* ukrywa sideBar boczne po kliknięciu w zawartość content */
    document.getElementById('content').addEventListener('click', ukryjSideBar);
    
    /*funkcja sprawdzajaca czy kliknieto w element o atrybucie data-action i parametrami w data-parms
    * i wywoluje funkcje z odpowiednimi parametrami
    */
    document.body.addEventListener('click', (e) => {
        const przycisk = e.target.closest('[data-action]');
        if (przycisk) {
            let akcja = przycisk.getAttribute('data-action');
            akcja = akcja.replace(/\s*\(.*\)\s*$/, '');
            const paramStr = przycisk.getAttribute('data-param');
            const param = paramStr ? paramStr.split('|') : [];
            
            if (akcja.includes(':')) {
                const [moduleName, functionName] = akcja.split(':', 2);
                
                // Użyj bezpośrednio window.NazwaModulu
                const module = window[moduleName];
                
                if (module && typeof module[functionName] === 'function') {
                    module[functionName](...param);
                    console.log(`Wykonano akcję z modułu: ${moduleName}.${functionName} z parametrami: ${param}`);
                } else {
                    console.warn(`Funkcja ${functionName} nie istnieje w module ${moduleName}`);
                }
            } else if (typeof window[akcja] === 'function') {
                window[akcja](...param);
                console.log(`Wykonano akcję: ${akcja} z parametrami: ${param}`);
            } else {
                console.warn(`Funkcja ${akcja} z parametrami ${param} nie istnieje`);
            }
        }
    });

   
    window.Render.sideBar(window.SideBar.getMeniu1());
    window.Render.navBar(window.SideBar.getNavBarMeniu());
    
   
});


