
/* odpowiada za wyglad i funkcjonalnosc kart projekty */

class projekty {
 
 /* wyswietla podstawowe informacje */
  projekt(projekt) {
    if (!projekt) return null;
    const {
      id_projektu,
      nazwa_projektu,
      adres_projektu,
      planowane_rozpoczecie,
      planowane_zakonczenie,
      data_rozpoczecia,
      data_zakonczenia,
      stan_projektu,
      status_projektu,
      zadania_wykonane,
      zadania_niewykonane,
      zadania_razem,
      extra_praca_count,
      extra_praca_zatwierdzone,
      extra_praca_niezatwierdzone,
      przypomnienia_aktywne,
      przypomnienia_wyslane,
      przypomnienia_odczytane,
      przypomnienia_anulowane,
      notatka
    } = projekt;

    // Pasek procentowy dla extra praca
    let procentExtraZatwierdzone = 0, procentExtraNiezatwierdzone = 0, sumaExtra = 0;

    // Suma przypomnień
    const sumaPrzypomnien = (przypomnienia_aktywne ?? 0) + (przypomnienia_wyslane ?? 0) + (przypomnienia_odczytane ?? 0) + (przypomnienia_anulowane ?? 0);

    // Oblicz dni do rozpoczęcia i zakończenia
    let dniDoRozpoczecia = null, dniDoZakonczenia = null;
    const today = new Date();
    if (planowane_rozpoczecie) {
      const startDate = new Date(planowane_rozpoczecie);
      dniDoRozpoczecia = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
    }
    if (planowane_zakonczenie) {
      const endDate = new Date(planowane_zakonczenie);
      dniDoZakonczenia = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    }

    // Pasek procentowy wykonania zadań
    let procentWykonane = 0, procentNiewykonane = 0, sumaZadan = 0;
    if (typeof zadania_razem === 'number') {
      sumaZadan = zadania_razem;
      if (sumaZadan > 0 && typeof zadania_wykonane === 'number') {
        procentWykonane = Math.round((zadania_wykonane / sumaZadan) * 100);
        procentNiewykonane = 100 - procentWykonane;
      }
    } else if (typeof zadania_wykonane === 'number' && typeof zadania_niewykonane === 'number') {
      sumaZadan = zadania_wykonane + zadania_niewykonane;
      if (sumaZadan > 0) {
        procentWykonane = Math.round((zadania_wykonane / sumaZadan) * 100);
        procentNiewykonane = 100 - procentWykonane;
      }
    }

    // Pasek procentowy dla extra praca
    if (typeof extra_praca_count === 'number') {
      sumaExtra = extra_praca_count;
      if (sumaExtra > 0 && typeof extra_praca_zatwierdzone === 'number') {
      procentExtraZatwierdzone = Math.round((extra_praca_zatwierdzone / sumaExtra) * 100);
      procentExtraNiezatwierdzone = 100 - procentExtraZatwierdzone;
      }
    } else if (typeof extra_praca_zatwierdzone === 'number' && typeof extra_praca_niezatwierdzone === 'number') {
      sumaExtra = extra_praca_zatwierdzone + extra_praca_niezatwierdzone;
      if (sumaExtra > 0) {
      procentExtraZatwierdzone = Math.round((extra_praca_zatwierdzone / sumaExtra) * 100);
      procentExtraNiezatwierdzone = 100 - procentExtraZatwierdzone;
      }
    }

    return {
      id: `${id_projektu}`,
      className: 'projekt-card-tile',
      navbar: `
        <div class="projekt-tile-header-nowa">
          <div class="projekt-tile-header-main">
            <span class="projekt-tile-ikona">📁</span>
            <span class="projekt-tile-title">${nazwa_projektu || 'Projekt'}</span>
          </div>
        </div>
      `,
      content: `
        <div class="projekt-tile-content-nowa">
          <div class="projekt-tile-header-statusy">
            <span class="projekt-status stan-${(stan_projektu || '').toLowerCase().replace(/\s/g, '-')}" title="Stan">${stan_projektu || ''}</span>
            <span class="projekt-status-projekt status-${(status_projektu || '').toLowerCase().replace(/\s/g, '-')}" title="Status">${status_projektu || ''}</span>
          </div>
          <section class="projekt-section">
            <h3 class="projekt-section-title">📍 Adres inwestycji</h3>
            <div class="projekt-section-value">${adres_projektu || '-'}</div>
          </section>
          <section class="projekt-section">
            <h3 class="projekt-section-title">📅 Terminy</h3>
            <div class="projekt-section-row"><span>Planowane rozpoczęcie:</span> <span>${planowane_rozpoczecie || '-'}${dniDoRozpoczecia !== null ? ` <span class='projekt-tile-days' title='Dni do rozpoczęcia'>(${dniDoRozpoczecia > 0 ? 'za ' + dniDoRozpoczecia + ' dni' : dniDoRozpoczecia === 0 ? 'dzisiaj' : Math.abs(dniDoRozpoczecia) + ' dni temu'})</span>` : ''}</span></div>
            <div class="projekt-section-row"><span>Planowane zakończenie:</span> <span>${planowane_zakonczenie || '-'}${dniDoZakonczenia !== null ? ` <span class='projekt-tile-days' title='Dni do zakończenia'>(${dniDoZakonczenia > 0 ? 'za ' + dniDoZakonczenia + ' dni' : dniDoZakonczenia === 0 ? 'dzisiaj' : Math.abs(dniDoZakonczenia) + ' dni temu'})</span>` : ''}</span></div>
            <div class="projekt-section-row"><span>Start:</span> <span>${data_rozpoczecia || '-'}</span></div>
            <div class="projekt-section-row"><span>Koniec:</span> <span>${data_zakonczenia || '-'}</span></div>
          </section>
          <section class="projekt-section">
            <h3 class="projekt-section-title">Zadania</h3>
            <div class="projekt-section-progress">
              <div class="projekt-progress-bar">
                <div class="projekt-progress-wykonane-bar" style="width: ${procentWykonane}%;${procentWykonane === 0 ? 'background: #eee;' : ''}">${procentWykonane > 0 ? procentWykonane + '%' : ''}</div>
                <div class="projekt-progress-niewykonane-bar" style="width: ${procentNiewykonane}%;${procentNiewykonane === 0 ? 'background: #eee;' : ''}">${procentNiewykonane > 0 ? procentNiewykonane + '%' : ''}</div>
              </div>
              <div class="projekt-progress-desc">✔️ ${zadania_wykonane ?? 0} / ❌ ${zadania_niewykonane ?? 0} (suma: ${sumaZadan})</div>
            </div>
          </section>
          <section class="projekt-section">
            <h3 class="projekt-section-title">Extra praca</h3>
            <div class="projekt-section-progress">
              <div class="projekt-progress-bar">
                <div class="projekt-progress-wykonane-bar" style="width: ${procentExtraZatwierdzone}%;${procentExtraZatwierdzone === 0 ? 'background: #eee;' : ''}">${procentExtraZatwierdzone > 0 ? procentExtraZatwierdzone + '%' : ''}</div>
                <div class="projekt-progress-niewykonane-bar" style="width: ${procentExtraNiezatwierdzone}%;${procentExtraNiezatwierdzone === 0 ? 'background: #eee;' : ''}">${procentExtraNiezatwierdzone > 0 ? procentExtraNiezatwierdzone + '%' : ''}</div>
              </div>
              <div class="projekt-extra-labels">
                <span class="projekt-extra-zatwierdzone" title="Zatwierdzone">✔️ ${extra_praca_zatwierdzone ?? 0}</span>
                <span class="projekt-extra-niezatwierdzone" title="Niezatwierdzone">❌ ${extra_praca_niezatwierdzone ?? 0}</span>
                <span class="projekt-extra-suma">(suma: ${sumaExtra})</span>
              </div>
            </div>
          </section>
          <section class="projekt-section">
            <h3 class="projekt-section-title">Przypomnienia</h3>
            <div class="projekt-reminder-labels">
              <span class="projekt-reminder-aktywne" title="Aktywne">🟢 ${przypomnienia_aktywne ?? 0}</span>
              <span class="projekt-reminder-wyslane" title="Wysłane">📤 ${przypomnienia_wyslane ?? 0}</span>
              <span class="projekt-reminder-odczytane" title="Odczytane">📖 ${przypomnienia_odczytane ?? 0}</span>
              <span class="projekt-reminder-anulowane" title="Anulowane">🚫 ${przypomnienia_anulowane ?? 0}</span>
              <span class="projekt-reminder-suma">(suma: ${sumaPrzypomnien})</span>
            </div>
          </section>
          <section class="projekt-section projekt-section-notatka">
            <h3 class="projekt-section-title">📝 Notatka</h3>
            <div class="projekt-section-value">${notatka ? notatka.replace(/\n/g, '<br>') : '-'}</div>
          </section>
        </div>
      `,
        footer: `
          <div class="projekt-section"">
            
            <button type="button" class="projekt-edit-save" onclick="window.function_projekty.edytuj('${id_projektu}')">Edytuj</button>
          </div>
        `,
      ikony: [
        { text: '📋 zadania', 
          onClick: () => {
             {
              window.zadania.zadania(`${id_projektu}`);
             }
          }


        },

        
        {
          text: '🛠️ extra_praca',
          onClick: () => {
            if (window.extra_praca && typeof window.extra_praca.podglad_extra_praca === 'function') {
              window.extra_praca.podglad_extra_praca(`${id_projektu}`);
            }
          }
        }
      
      ]
    };
  }

/* sluzy do edycji projektu */
edytuj(projekt,aktualna_brygada,aktywne_brygady,kierownicy_brygad){
  if (!projekt) return null;
  // Jeśli projekt jest opakowany w .data (np. z API), wyciągnij pierwszy element jeśli to tablica
  let p = projekt;
  if (projekt && typeof projekt === 'object' && 'data' in projekt) {
    if (Array.isArray(projekt.data)) {
      p = projekt.data[0] || {};
    } else {
      p = projekt.data;
    }
  }
  const {
    id_projektu,
    nazwa_projektu,
    adres_projektu,
    planowane_rozpoczecie,
    planowane_zakonczenie,
    przypomnij_rozpoczecie,
    przypomnij_zakonczenie,
    data_rozpoczecia,
    data_zakonczenia,
    stan_projektu,
    status_projektu,
    id_brygady,
    id_kierownika,
    ukryj_projekt,
    notatka
  } = p;

  // Opcje enum
  const statusy = ['Normalny','Pilny','Krytyczny'];
  const stany = ['W trakcie','Wstrzymany','Planowany','Do zatwierdzenia','Zakończony','Nie określono'];

  // Przygotowanie opcji brygad
  let brygadyOptions = '';
  if (Array.isArray(aktywne_brygady) && aktywne_brygady.length > 0) {
    let wybranaBrygada = null;
    let pozostaleBrygady = aktywne_brygady;
    if (id_brygady) {
      wybranaBrygada = aktywne_brygady.find(b => b.id_brygady == id_brygady);
      pozostaleBrygady = aktywne_brygady.filter(b => b.id_brygady != id_brygady);
      // Jeśli nie ma wybranej brygady w aktywnych, spróbuj dodać ją z aktualna_brygada
      if (!wybranaBrygada && aktualna_brygada && aktualna_brygada.id_brygady == id_brygady) {
        wybranaBrygada = aktualna_brygada;
      }
    }
    if (wybranaBrygada) {
      brygadyOptions += `<option value="${wybranaBrygada.id_brygady}" selected>${wybranaBrygada.nazwa_brygady} — ${wybranaBrygada.opis_brygady || ''}</option>`;
    }
    brygadyOptions += pozostaleBrygady.map(b => `<option value="${b.id_brygady}">${b.nazwa_brygady} — ${b.opis_brygady || ''}</option>`).join('');
  } else if (aktualna_brygada && aktualna_brygada.id_brygady) {
    // Jeśli nie ma aktywnych brygad, ale jest aktualna_brygada z projektu
    brygadyOptions = `<option value="${aktualna_brygada.id_brygady}" selected>${aktualna_brygada.nazwa_brygady} — ${aktualna_brygada.opis_brygady || ''}</option>`;
  } else {
    brygadyOptions = '<option value="">Brak aktywnych brygad</option>';
  }

  // Przygotowanie opcji liderów/kierowników
  let liderzyOptions = '';
  let wybranyLider = null;
  let brygadaDoWyboru = null;
  if (Array.isArray(aktywne_brygady) && id_brygady) {
    brygadaDoWyboru = aktywne_brygady.find(b => b.id_brygady == id_brygady) || aktualna_brygada;
  } else if (aktualna_brygada && aktualna_brygada.id_brygady) {
    brygadaDoWyboru = aktualna_brygada;
  }
  if (brygadaDoWyboru && brygadaDoWyboru.lider_brygady) {
    wybranyLider = brygadaDoWyboru.lider_brygady;
  } else if (id_kierownika) {
    wybranyLider = id_kierownika;
  }
  if (Array.isArray(kierownicy_brygad) && kierownicy_brygad.length > 0) {
    liderzyOptions += `<option value="">Wybierz kierownika/lidera</option>`;
    kierownicy_brygad.forEach(lider => {
      const selected = wybranyLider == lider.id_pracownika ? 'selected' : '';
      liderzyOptions += `<option value="${lider.id_pracownika}" ${selected}>${lider.imie} ${lider.nazwisko} (${lider.stanowisko})</option>`;
    });
  } else {
    liderzyOptions = '<option value="">Brak dostępnych kierowników/liderów</option>';
  }

  // Generowanie formularza edycji
  return {
    id: `${id_projektu}`,
    className: 'projekt-card-edit',
    navbar: `
      <div class="projekt-tile-header-nowa">
        <div class="projekt-tile-header-main">
          <span class="projekt-tile-ikona">✏️</span>
          <span class="projekt-tile-title">Edycja projektu</span>
        </div>
      </div>
    `,
    content: `
      <form class="projekt-edit-form" onsubmit="return false;">
        <input type="hidden" name="id_projektu" value="${id_projektu || ''}" />
        <input type="hidden" name="id_brygady" value="${id_brygady || ''}" />
        <input type="hidden" name="id_kierownika" value="${wybranyLider || ''}" />
        <section class="projekt-section">
          <label>🏷️ Nazwa projektu
            <input type="text" name="nazwa_projektu" value="${nazwa_projektu || ''}" maxlength="255" />
          </label>
        </section>
        <section class="projekt-section">
          <label>📍 Adres projektu
            <textarea name="adres_projektu">${adres_projektu || ''}</textarea>
          </label>
        </section>
        <section class="projekt-section">
          <label>👷 Brygada
            <select name="id_brygady" onchange="window.function_projekty && window.function_projekty.onBrygadaChange && window.function_projekty.onBrygadaChange(this, this.form)">
              ${brygadyOptions}
            </select>
          </label>
        </section>
        <section class="projekt-section">
          <label>🧑‍💼 Kierownik/Lider brygady
            <select name="id_kierownika">
              ${liderzyOptions}
            </select>
          </label>
        </section>
        <section class="projekt-section">
          <label>📅 Planowane rozpoczęcie
            <input type="date" name="planowane_rozpoczecie" value="${planowane_rozpoczecie || ''}" />
          </label>
          <label>🏁 Planowane zakończenie
            <input type="date" name="planowane_zakonczenie" value="${planowane_zakonczenie || ''}" />
          </label>
        </section>
        <section class="projekt-section">
          <label><input type="checkbox" name="przypomnij_rozpoczecie" ${przypomnij_rozpoczecie ? 'checked' : ''}/> ⏰ Przypomnij o rozpoczęciu</label>
          <label><input type="checkbox" name="przypomnij_zakonczenie" ${przypomnij_zakonczenie ? 'checked' : ''}/> ⏰ Przypomnij o zakończeniu</label>
        </section>
        <section class="projekt-section">
          <label>▶️ Data rozpoczęcia
            <input type="date" name="data_rozpoczecia" value="${data_rozpoczecia || ''}" />
          </label>
          <label>⏹️ Data zakończenia
            <input type="date" name="data_zakonczenia" value="${data_zakonczenia || ''}" />
          </label>
        </section>
        <section class="projekt-section">
          <label>🎯 Stan projektu
            <select name="stan_projektu">
              ${stany.map(s => `<option value="${s}"${stan_projektu === s ? ' selected' : ''}>${s}</option>`).join('')}
            </select>
          </label>
          <label>⭐ Status projektu
            <select name="status_projektu">
              ${statusy.map(s => `<option value="${s}"${status_projektu === s ? ' selected' : ''}>${s}</option>`).join('')}
            </select>
          </label>
        </section>
        <section class="projekt-section">
          <label>📝 Notatka
            <textarea name="notatka">${notatka || ''}</textarea>
          </label>
        </section>
        <section class="projekt-section">
          <label><input type="checkbox" name="ukryj_projekt" ${ukryj_projekt ? 'checked' : ''}/> 🙈 Ukryj projekt</label>
        </section>
        <section class="projekt-section">
        <button type="button" class="projekt-edit-save" onclick="window.function_projekty.wyswietl_projekt('${id_projektu}')">Anuluj</button>
          <button type="button" class="projekt-edit-save"
            onclick="window.function_projekty && window.function_projekty.aktalizuj && window.function_projekty.aktalizuj(window.function_projekty.pobierzDaneZFormularza(this.form));"
          >💾 Zapisz </button>

        </section>
      </form>
      <script>
        // Funkcja do pobierania wszystkich danych z formularza, łącznie z ukrytymi i wartościami wybranych opcji select
        window.function_projekty = window.function_projekty || {};
        window.function_projekty.pobierzDaneZFormularza = function(form) {
          const data = {};
          const elements = Array.from(form.elements);
          elements.forEach(el => {
            if (!el.name) return;
            let name = el.name;
            // Zamiana id_lidera na id_kierownika (jeśli gdzieś zostanie przesłane z formularza lub selecta)
            if (name === 'id_lidera') name = 'id_kierownika';
            if (el.type === 'checkbox') {
              data[name] = el.checked ? 1 : 0;
            } else if (el.tagName === 'SELECT') {
              const selected = el.options[el.selectedIndex];
              if (selected) {
                data[name] = selected.getAttribute('data-value') || selected.value;
              } else {
                data[name] = '';
              }
            } else {
              data[name] = el.value;
            }
          });
          return data;
        };
      </script>
    `,
    footer: `
 
    `,
    ikony: [
      {
        text: '↩️ cofnij',
        onClick: () => { window.function_projekty.wyswietl_projekt(`${id_projektu}`); }
      }
    ]
  };
}


nowy_projekt(aktywne_brygady, kierownicy_brygad) {
  // Pola puste, tylko przekazane brygady i kierownicy
  const stany = ['W trakcie','Wstrzymany','Planowany','Do zatwierdzenia','Zakończony','Nie określono'];
  const statusy = ['Normalny','Pilny','Krytyczny'];

  // Opcje brygad
  let brygadyOptions = '';
  if (Array.isArray(aktywne_brygady) && aktywne_brygady.length > 0) {
    brygadyOptions += '<option value="">Wybierz brygadę</option>';
    brygadyOptions += aktywne_brygady.map(b => `<option value="${b.id_brygady}">${b.nazwa_brygady} — ${b.opis_brygady || ''}</option>`).join('');
  } else {
    brygadyOptions = '<option value="">Brak aktywnych brygad</option>';
  }

  // Opcje kierowników/liderów
  let liderzyOptions = '';
  if (Array.isArray(kierownicy_brygad) && kierownicy_brygad.length > 0) {
    liderzyOptions += '<option value="">Wybierz kierownika/lidera</option>';
    kierownicy_brygad.forEach(lider => {
      liderzyOptions += `<option value="${lider.id_pracownika}">${lider.imie} ${lider.nazwisko} (${lider.stanowisko})</option>`;
    });
  } else {
    liderzyOptions = '<option value="">Brak dostępnych kierowników/liderów</option>';
  }

  return {
    id: 'nowy_projekt',
    className: 'projekt-card-edit',
    navbar: `
      <div class="projekt-tile-header-nowa">
        <div class="projekt-tile-header-main">
          <span class="projekt-tile-ikona">🆕</span>
          <span class="projekt-tile-title">Nowy projekt</span>
        </div>
      </div>
    `,
    content: `
      <form class="projekt-edit-form" onsubmit="return false;">
        <section class="projekt-section">
          <label>🏷️ Nazwa projektu
            <input type="text" name="nazwa_projektu" value="" maxlength="255" />
          </label>
        </section>
        <section class="projekt-section">
          <label>📍 Adres projektu
            <textarea name="adres_projektu"></textarea>
          </label>
        </section>
        <section class="projekt-section">
          <label>👷 Brygada
            <select name="id_brygady" onchange="window.function_projekty && window.function_projekty.onBrygadaChange && window.function_projekty.onBrygadaChange(this, this.form)">
              ${brygadyOptions}
            </select>
          </label>
        </section>
        <section class="projekt-section">
          <label>🧑‍💼 Kierownik/Lider brygady
            <select name="id_kierownika">
              ${liderzyOptions}
            </select>
          </label>
        </section>
        <section class="projekt-section">
          <label>📅 Planowane rozpoczęcie
            <input type="date" name="planowane_rozpoczecie" value="" />
          </label>
          <label>🏁 Planowane zakończenie
            <input type="date" name="planowane_zakonczenie" value="" />
          </label>
        </section>
        <section class="projekt-section">
          <label><input type="checkbox" name="przypomnij_rozpoczecie"/> ⏰ Przypomnij o rozpoczęciu</label>
          <label><input type="checkbox" name="przypomnij_zakonczenie"/> ⏰ Przypomnij o zakończeniu</label>
        </section>
        <section class="projekt-section">
          <label>▶️ Data rozpoczęcia
            <input type="date" name="data_rozpoczecia" value="" />
          </label>
          <label>⏹️ Data zakończenia
            <input type="date" name="data_zakonczenia" value="" />
          </label>
        </section>
        <section class="projekt-section">
          <label>🎯 Stan projektu
            <select name="stan_projektu">
              ${stany.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
          </label>
          <label>⭐ Status projektu
            <select name="status_projektu">
              ${statusy.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
          </label>
        </section>
        <section class="projekt-section">
          <label>📝 Notatka
            <textarea name="notatka"></textarea>
          </label>
        </section>
        <section class="projekt-section">
          <label><input type="checkbox" name="ukryj_projekt"/> 🙈 Ukryj projekt</label>
        </section>
        <section class="projekt-section">
          <button type="button" class="projekt-edit-save"
            onclick="window.function_projekty && window.function_projekty.dodaj && window.function_projekty.dodaj(window.function_projekty.pobierzDaneZFormularza(this.form));"
          >➕ Dodaj projekt</button>
        </section>
      </form>
      <script>
        window.function_projekty = window.function_projekty || {};
        window.function_projekty.pobierzDaneZFormularza = function(form) {
          const data = {};
          const elements = Array.from(form.elements);
          elements.forEach(el => {
            if (!el.name) return;
            let name = el.name;
            if (name === 'id_lidera') name = 'id_kierownika';
            if (el.type === 'checkbox') {
              data[name] = el.checked ? 1 : 0;
            } else if (el.tagName === 'SELECT') {
              const selected = el.options[el.selectedIndex];
              if (selected) {
                data[name] = selected.getAttribute('data-value') || selected.value;
              } else {
                data[name] = '';
              }
            } else {
              data[name] = el.value;
            }
          });
          return data;
        };
      </script>
    `,
      footer: `
        <div class="projekt-footer-buttons">
          <button type="button" class="footer-btn" onclick="window.Render.deleteContent()">Zamknij</button>
          <button type="button" class="footer-btn" onclick="window.location.reload()">Odśwież</button>
        </div>
      `,
    ikony: [
      {
        text: '↩️ cofnij',
        onClick: () => { window.Render.deleteContent(); }
      }
    ]
  };
}


//=============================================
}

export default projekty;