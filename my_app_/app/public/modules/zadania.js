/* modul odpowiada z obsluge kart i funkkcji z tabeli zadania
*/

class zadania{
constructor(){
    this.name="zadania";
 }

 zadania(id_projektu){
    this.podglad_zadan(id_projektu);   
 }

 /*pobier zadania z projeku o podanym id_projektu 
 * i wyswietl je w karcie podgladu zadan
 */
 async podglad_zadan (projekt_id){
      const dane={
         "funkcja": "getTasks",
         "column": "id_projektu",
         "value": projekt_id,
         "mode": "exact",
         "limit": 1000,
         "offset": 0,
         "dane": {
            "columns": ["id_projektu","nazwa_projektu", "id_zadania", "tytul_zadania", "opis_zadania","status_zadania","priorytet","notatka","data_rozpoczecia","data_zakonczenia","planowana_data_zakonczenia","procent_wykonania"],
            "order": "status_priorytet"
         }
      }

      let data = await this.fetchApi(dane);

      // Jeśli nie znaleziono zadań, dodaj id_projektu do danych
      if (!data || (Array.isArray(data) && data.length === 0) || (data && Array.isArray(data.data) && data.data.length === 0)) {
         // Brak zadań, przekazujemy tablicę z jednym obiektem zawierającym id_projektu
         data = { data: [{ id_projektu: projekt_id }] };
      } else if (data && Array.isArray(data.data) && data.data.length > 0) {
         // Są zadania, ustaw id_projektu w pierwszym zadaniu (opcjonalnie)
         data.data[0].id_projektu = projekt_id;
      }
 
      console.log('Otrzymano z API:', data);
      window.Render.card(this.widok_podglad_zadan(data));
      
 }





 /* pobranie danych zadania o podanym id_zadania i uruchomienie edycji
 */
 async edytuj_zadanie(id_zadania){
    // Najpierw pobierz dane zadania, aby uzyskać id_projektu
    const zadanieRes = await this.fetchApi({
       "funkcja": "getTasks",
       "column": "id_zadania",
       "value": id_zadania,
       "mode": "exact",
       "limit": 1,
       "offset": 0
    });
    const zadanie = zadanieRes && zadanieRes.data && zadanieRes.data[0] ? zadanieRes.data[0] : null;
    if (!zadanie || !zadanie.id_projektu) {
       alert("Nie znaleziono zadania lub brak id_projektu");
       return;
    }
    const id_projektu = zadanie.id_projektu;
    const canAdd = await this.sprawdz_uprawnienia(id_projektu);
    if (!canAdd) {
         return;
    }

 // pobranie danych o projekcie 
const projekt = await this.fetchApi({  
   "funkcja": "getProjekty",
  "column": "id_projektu",
  "value": id_projektu,
  "mode": "exact",
  "limit": 1,
  "offset": 0
  
});  
 


// pobranie aktywnych pracownikow z danej brygady z projektu
let id_brygady = null;
if (projekt && projekt.data && projekt.data[0] && projekt.data[0].id_brygady) {
   id_brygady = projekt.data[0].id_brygady;
}
if (!id_brygady) {
   alert("Brak id_brygady w projekcie. Nie można pobrać pracowników.");
   return;
}
const pracownicy = await this.fetchApi({
   "funkcja": "getPracownicy",
   "column": "id_brygady",
   "value": id_brygady, 
   "mode": "exact",
   "offset": 0,
   "dane": {
      "columns": ["id_pracownika", "imie", "nazwisko", "stanowisko", "id_brygady"]
   },
   "filter": {
      "aktywny": 1             // 1 = aktywny, 0 = nieaktywny
   }
});  


 
   window.Render.card(this.widok_zadanie(projekt, pracownicy, zadanie));
 

 }





/* doawane pojedynczego zadania do zadan projektu o podanym id_projektu
 */
 async dodaj_zadanie(id_projektu){
   
   const canAdd = await this.sprawdz_uprawnienia(id_projektu);
   if (!canAdd) {
      return;
   }

// pobranie danych o projekcie 
const projekt = await this.fetchApi({  
   "funkcja": "getProjekty",
  "column": "id_projektu",
  "value": id_projektu,
  "mode": "exact",
  "limit": 1,
  "offset": 0
  
});  console.log( "projekt", projekt);
 

// pobranie aktywnych pracownikow z danej brygady z projektu
const pracownicy = await this.fetchApi({
  "funkcja": "getPracownicy",
  "column": "id_brygady",
  "value": projekt.data[0].id_brygady, 
  "mode": "exact",
 
  "offset": 0,
  "dane": {
    "columns": ["id_pracownika", "imie", "nazwisko", "stanowisko", "id_brygady"]
  },
  "filter": {
    "aktywny": 1             // 1 = aktywny, 0 = nieaktywny
  }
});  console.log("pracownicy", pracownicy);

 window.Render.card(this.widok_zadanie(projekt, pracownicy, null));

 }

 /* dodawanie wielu zadan do bazy danych zadania
*/
async add_many_zadania(id_projektu){
   const canAdd = await this.sprawdz_uprawnienia(id_projektu);
   if (!canAdd) {
      return;
   }
 window.Render.card(this.widok_many_zadania(id_projektu));
}

/* zapisywanie wielu zadan do bazy danych */
async dodaj_zadania(id_projektu, zadaniaDoDodania){
  // console.log("Dodawanie wielu zadan do projektu o id_projektu:", id_projektu, zadaniaDoDodania);

   // Walidacja wszystkich zadań
   let allErrors = [];
   zadaniaDoDodania.forEach((zadanie, idx) => {
      const errors = this.walidujZadanie(zadanie);
      if (errors.length > 0) {
         allErrors.push(`Zadanie ${idx + 1}:\n` + errors.join('\n'));
      }
   });
   if (allErrors.length > 0) {
      alert('Wystąpiły błędy walidacji:\n' + allErrors.join('\n\n'));
      return;
   }
 
   const odpowiedz = await this.add_wiele_zadan(zadaniaDoDodania);
   console.log('Odpowiedź z add_wiele_zadan:', odpowiedz);
   if (odpowiedz && odpowiedz.status === 'success') {
      alert('Zadania zostały dodane pomyślnie.');
   } else {
      alert('Wystąpił błąd podczas dodawania zadań.');
   }
   this.podglad_zadan(id_projektu);
}


/* generowanie widoku do dodawania wielu zadan (zadanie , opis , notatka)
*/
widok_many_zadania(id_projektu) {
   // Przygotuj dzisiejszą datę
   const today = new Date();
   const yyyy = today.getFullYear();
   const mm = String(today.getMonth() + 1).padStart(2, '0');
   const dd = String(today.getDate()).padStart(2, '0');
   const todayStr = `${yyyy}-${mm}-${dd}`;

   // Funkcje globalne do obsługi formularza (tylko raz na window)
   if (!window.zadania) window.zadania = {};
   if (!window.zadania._zbierzDaneManyZadania) {
      window.zadania._zbierzDaneManyZadania = function(formId) {
         const form = document.getElementById(formId);
         if (!form) return [];
         const zadanieText = form.querySelector('[name="zadanie"]').value || '';
         const opisText = form.querySelector('[name="opis"]').value || '';
         const notatkaText = form.querySelector('[name="notatka"]').value || '';
         const id_projektu = form.querySelector('[name="id_projektu"]').value;
         function splitLines(text) {
            return text.split(/\n|\r/)
               .flatMap(line => line.split(/\s*\.[ ]*|\.$/))
               .map(l => l.trim())
               .filter(l => l.length > 0);
         }
         const zadaniaArr = splitLines(zadanieText);
         const opisyArr = splitLines(opisText);
         const notatkiArr = splitLines(notatkaText);
         const maxLen = Math.max(zadaniaArr.length, opisyArr.length, notatkiArr.length);
         const zadaniaDoDodania = [];
         for(let i=0; i<maxLen; i++){
            zadaniaDoDodania.push({
               id_projektu: id_projektu,
               tytul_zadania: zadaniaArr[i] || '',
               opis_zadania: opisyArr[i] || '',
               notatka: notatkiArr[i] || '',
               data_rozpoczecia: todayStr,
               status_zadania: 0,
               priorytet: 'Normalny',
               przypomnij_rozpoczecie: 1,
               procent_wykonania: 0
            });
         }
         return zadaniaDoDodania.filter(z => z.tytul_zadania.length > 0);
      }
   }
   if (!window.zadania._dodajWieleZadanAkcja) {
      window.zadania._dodajWieleZadanAkcja = function(id_projektu) {
         const zadaniaDoDodania = window.zadania._zbierzDaneManyZadania('formularz-many-zadania-' + id_projektu);
         if(zadaniaDoDodania.length === 0){
            alert('Wprowadź przynajmniej jedno zadanie.');
            return;
         }
         if(window.zadania && typeof window.zadania.dodaj_zadania === 'function'){
            window.zadania.dodaj_zadania(id_projektu, zadaniaDoDodania);
         } else if(window.Render && window.Render.activeModule && typeof window.Render.activeModule.dodaj_zadania === 'function'){
            window.Render.activeModule.dodaj_zadania(id_projektu, zadaniaDoDodania);
         }
      }
   }

   const card = {
      id: id_projektu,
      className: 'karta_zadania',
      navbar: `<h3>➕ Dodaj wiele zadań</h3>`,
      content: `
         <form id="formularz-many-zadania-${id_projektu}" class="formularz-many-zadania">
            <div class="zadania-table-wrap zadania-form-wrap">
            <table class="zadania-table zadania-form-table">
               <tbody>
               <tr><td><span title="Zadanie">📝 Zadanie</span></td><td><textarea name="zadanie" rows="6" placeholder="Każda linia = nowe zadanie"></textarea></td></tr>
               <tr><td><span title="Opis zadania">📄 Opis</span></td><td><textarea name="opis" rows="6" placeholder="Każda linia = nowy opis"></textarea></td></tr>
               <tr><td><span title="Notatka">📝 Notatka</span></td><td><textarea name="notatka" rows="6" placeholder="Każda linia = nowa notatka"></textarea></td></tr>
               </tbody>
            </table>
            </div>
            <input type="hidden" name="id_projektu" value="${id_projektu}">
         </form>
      `,
      footer: `
         <div class="zadania-footer-stat">
            <button type="button" class="zadania-btn-save"
               onclick="window.zadania._dodajWieleZadanAkcja('${id_projektu}')"
            >💾 Dodaj zadania</button>
            <button type="button" class="zadania-btn-cancel" onclick="window.zadania.podglad_zadan(${id_projektu})">❌ Anuluj</button>
         </div>
      `,
      ikony: [
         { text: '↩️', onClick: () => { this.podglad_zadan(id_projektu); } }
      ]
   };
   return card;
}



/* generowanie widoku dla zadania o podanym id_zadania badz nowego zadania dla projektu o podanym id_projektu
*/
 widok_zadanie(projekt, pracownicy,zadanie) {
   // Pobierz dane projektu
   const id_projektu = projekt?.data?.[0]?.id_projektu || projekt?.id_projektu || '';
   const nazwa_projektu = projekt?.data?.[0]?.nazwa_projektu || projekt?.nazwa_projektu || '';

   // Przygotuj listę pracowników do selecta
   let pracownicyOptions = '';
   if (pracownicy && pracownicy.data && Array.isArray(pracownicy.data)) {
      pracownicyOptions = pracownicy.data.map(p =>
         `<option value="${p.id_pracownika}" data-stanowisko="${p.stanowisko}"${zadanie && zadanie.id_pracownika == p.id_pracownika ? ' selected' : ''}>${p.imie} ${p.nazwisko} (${p.stanowisko})</option>`
      ).join('');
   }

   // Ustal dzisiejszą datę w formacie yyyy-mm-dd
   const today = new Date();
   const yyyy = today.getFullYear();
   const mm = String(today.getMonth() + 1).padStart(2, '0');
   const dd = String(today.getDate()).padStart(2, '0');
   const todayStr = `${yyyy}-${mm}-${dd}`;

   // Jeśli edycja zadania, ustaw wartości pól z zadania
   const isEdit = !!zadanie;
   const tytul_zadania = isEdit ? (zadanie.tytul_zadania || '') : '';
   const opis_zadania = isEdit ? (zadanie.opis_zadania || '') : '';
   const notatka = isEdit ? (zadanie.notatka || '') : '';
   const data_rozpoczecia = isEdit ? (zadanie.data_rozpoczecia || todayStr) : todayStr;
   const data_zakonczenia = isEdit ? (zadanie.data_zakonczenia || '') : '';
   const planowana_data_zakonczenia = isEdit ? (zadanie.planowana_data_zakonczenia || '') : '';
   const status_zadania = isEdit ? (zadanie.status_zadania == 1 || zadanie.status_zadania == '1') : false;
   const priorytet = isEdit ? (zadanie.priorytet || 'Normalny') : 'Normalny';
   const przypomnij_rozpoczecie = isEdit ? (zadanie.przypomnij_rozpoczecie == 1 || zadanie.przypomnij_rozpoczecie == '1') : true;
   const procent_wykonania = isEdit ? (zadanie.procent_wykonania || 0) : 0;

   const card = {
      id: id_projektu,
      className: 'karta_zadania',
      navbar: isEdit ? `<h3>✏️ Edycja zadania: ${nazwa_projektu}</h3>` : `<h3>📝 Nowe zadanie: ${nazwa_projektu}</h3>`,
      content: `
         <form id="formularz-zadanie-${id_projektu}" class="formularz-zadanie">
            <div class="zadania-table-wrap zadania-form-wrap">
            <table class="zadania-table zadania-form-table">
               <tbody>
               <tr>
                  <td colspan="2"><label for="tytul_zadania">📝 Zadanie</label></td>
               </tr>
               <tr>
                  <td colspan="2"><textarea name="tytul_zadania" id="tytul_zadania" rows="3">${tytul_zadania}</textarea></td>
               </tr>
               <tr>
                  <td colspan="2"><label for="opis_zadania">📄 Opis</label></td>
               </tr>
               <tr>
                  <td colspan="2"><textarea name="opis_zadania" id="opis_zadania" rows="3">${opis_zadania}</textarea></td>
               </tr>
               <tr>
                  <td colspan="2"><label for="notatka">📝 Notatka</label></td>
               </tr>
               <tr>
                  <td colspan="2"><textarea name="notatka" id="notatka" rows="2">${notatka}</textarea></td>
               </tr>
               <tr>
                  <td><label for="data_rozpoczecia">📅 Rozpoczęcie</label></td>
                  <td><input type="date" name="data_rozpoczecia" id="data_rozpoczecia" value="${data_rozpoczecia}"></td>
               </tr>
               <tr>
                  <td><label for="data_zakonczenia">🏁 Zakończenie</label></td>
                  <td><input type="date" name="data_zakonczenia" id="data_zakonczenia" value="${data_zakonczenia}"></td>
               </tr>
               <tr>
                  <td><label for="planowana_data_zakonczenia">⏳ Planowana</label></td>
                  <td><input type="date" name="planowana_data_zakonczenia" id="planowana_data_zakonczenia" value="${planowana_data_zakonczenia}"></td>
               </tr>
               <tr>
                  <td><label for="status_zadania">✔️ Status</label></td>
                  <td><input type="checkbox" name="status_zadania" id="status_zadania" value="1"${status_zadania ? ' checked' : ''}> Wykonane</td>
               </tr>
               <tr>
                  <td><label for="priorytet">⭐ Priorytet</label></td>
                  <td>
                     <select name="priorytet" id="priorytet">
                        <option value="Niski"${priorytet==='Niski'?' selected':''}>Niski</option>
                        <option value="Normalny"${priorytet==='Normalny'?' selected':''}>Normalny</option>
                        <option value="Wysoki"${priorytet==='Wysoki'?' selected':''}>Wysoki</option>
                        <option value="Krytyczny"${priorytet==='Krytyczny'?' selected':''}>Krytyczny</option>
                     </select>
                  </td>
               </tr>
               <tr>
                  <td><label for="przypomnij_rozpoczecie">⏰ Przypomnij</label></td>
                  <td><input type="checkbox" name="przypomnij_rozpoczecie" id="przypomnij_rozpoczecie" value="1"${przypomnij_rozpoczecie ? ' checked' : ''}></td>
               </tr>
               <tr>
                  <td><label for="id_pracownika">👷 Pracownik</label></td>
                  <td>
                     <select name="id_pracownika" id="id_pracownika">
                        <option value="">-- Wybierz pracownika --</option>
                        ${pracownicyOptions}
                     </select>
                  </td>
               </tr>
               <tr>
                  <td><label for="procent_wykonania">📈 Procent</label></td>
                  <td>
                     <input type="range" name="procent_wykonania" id="procent_wykonania" min="0" max="100" value="${procent_wykonania}" oninput="this.nextElementSibling.value = this.value">
                     <output style="margin-left:8px;">${procent_wykonania}</output> %
                  </td>
               </tr>
               </tbody>
            </table>
            </div>
            <input type="hidden" name="id_projektu" value="${id_projektu}">
            ${isEdit && zadanie.id_zadania ? `<input type="hidden" name="id_zadania" value="${zadanie.id_zadania}">` : ''}
         </form>
         <script>
         window.zadania = window.zadania || {};
         window.zadania._zbierzDaneZadanie = function(formId) {
            const form = document.getElementById(formId);
            if (!form) return {};
            const data = {};
            const elements = form.querySelectorAll('input, select, textarea');
            elements.forEach(el => {
               if (el.type === 'checkbox') {
                  data[el.name] = el.checked ? el.value : '';
               } else {
                  data[el.name] = el.value;
               }
            });
            return data;
         }
         </script>
      `,
      footer: `
         <div class="zadania-footer-stat">
            ${isEdit && zadanie.id_zadania ? `
            <button type="button" class="zadania-btn-save"
               onclick="window.zadania.update_zadanie(window.zadania._zbierzDaneZadanie('formularz-zadanie-${id_projektu}'))"
            >💾 Zapisz zmiany</button>
            <button type="button" class="zadania-btn-delete" style="margin-left:12px;color:#fff;background:#dc2626;" onclick="window.zadania.usun_zadanie('${zadanie.id_zadania}','${id_projektu}')">🗑️ Usuń zadanie</button>
            ` : `
            <button type="button" class="zadania-btn-save"
               onclick="window.zadania.add_zadanie(window.zadania._zbierzDaneZadanie('formularz-zadanie-${id_projektu}'))"
            >💾 Zapisz zadanie</button>
            `}
            <button type="button" class="zadania-btn-cancel" onclick="window.zadania.podglad_zadan(${id_projektu})">❌ Anuluj</button>
         </div>
      `,
      ikony: [
         { text: '↩️', 
            onClick: () => { this.podglad_zadan(id_projektu); }
         }
      ]
   };
   return card;
 }
 


/* generowanie widoku podgladu zadan
w każdej karcie z zadaniami zaznaczone id_zadania są przechowywane w globalnej tablicy window.zaznaczone_wiersze_{id_projektu}. Możesz łatwo pobrać te wartości i przekazać je dalej według potrzeb.*/
widok_podglad_zadan(response){
   // Obsługa dwóch możliwych formatów wejścia:
   // - bezpośrednia tablica zadań
   // - obiekt { status: 'success', data: [...], total, meta }
   let tasks = [];
   if (Array.isArray(response)) {
      tasks = response;
   } else if (response && Array.isArray(response.data)) {
      tasks = response.data;
   }

   if (!tasks || tasks.length === 0) {
      return {
         id: 'karta_zadania',
         className: 'karta_zadania',
         navbar: '<h3>Zadania</h3>',
         content: '<p>Brak zadań do wyświetlenia.</p>',
         footer: '',
         ikony: []
      };
   }

   const first = tasks[0] || {};
   const id_projektu = first.id_projektu || 'karta_zadania';
   const nazwa_projektu = first.nazwa_projektu || '';

   // Zamiana status_zadania na liczbę 0 lub 1 dla każdego zadania
   tasks = tasks.map(zadanie => {
      let statusVal = zadanie.status_zadania;
      zadanie.status_zadania = (statusVal === 1 || statusVal === '1') ? 1 : 0;
      return zadanie;
   });

   const rows = tasks.map(zadanie => {
      const status = zadanie.status_zadania === 1 ? '✅' : '⬜';
      const tytul = zadanie.tytul_zadania || '';
      const opis = zadanie.opis_zadania || '';
      const priorytet = zadanie.priorytet || '';
      const notatka = zadanie.notatka || '';
      const id_zadania = zadanie.id_zadania || '';
      const data_rozpoczecia = zadanie.data_rozpoczecia || '-';
      const data_zakonczenia = zadanie.data_zakonczenia || '-';
      const planowana_data_zakonczenia = zadanie.planowana_data_zakonczenia || '-';
      const procent_wykonania = (zadanie.procent_wykonania !== undefined && zadanie.procent_wykonania !== null) ? zadanie.procent_wykonania + '%' : '-';
      // Liczba linii w każdej komórce
      const lines = [tytul, opis, priorytet, notatka].map(val => (val.match(/\n/g) || []).length + 1);
      const maxLines = Math.max(...lines);
      // Ustal minimalną wysokość na podstawie liczby linii (przyjmij ok. 20px na linię, na mobile 28px)
      let minHeight = 20 * maxLines;
      let styleMobile = '';
      if(window && window.innerWidth && window.innerWidth <= 700){
         minHeight = 28 * maxLines;
         styleMobile = 'font-size:14px;max-width:unset;';
      }
      return `
         <tr class="zadanie-row" data-id="${id_zadania}" style="border-bottom: 1px solid #374151; cursor:pointer; min-height:${minHeight}px;">
            <td style="padding: 8px; vertical-align: top; word-break: break-word; white-space: pre-wrap; max-width: 220px; min-width: 120px; min-height:${minHeight}px;${styleMobile}">${tytul}<input type="hidden" name="id_zadania" value="${id_zadania}"></td>
            <td style="padding: 8px; vertical-align: top; word-break: break-word; white-space: pre-wrap; max-width: 320px; min-width: 140px; min-height:${minHeight}px;${styleMobile}">${opis}</td>
            <td style="padding: 8px; text-align: center; vertical-align: top; min-height:${minHeight}px;${styleMobile}">${status}</td>
            <td style="padding: 8px; vertical-align: top; word-break: break-word; white-space: pre-wrap; max-width: 100px; min-height:${minHeight}px;${styleMobile}">${priorytet}</td>
            <td style="padding: 8px; vertical-align: top; word-break: break-word; white-space: pre-wrap; max-width: 220px; min-width: 120px; min-height:${minHeight}px;${styleMobile}">${notatka}</td>
            <td style="padding: 8px; text-align: center; vertical-align: top; min-height:${minHeight}px;${styleMobile}">${data_rozpoczecia}</td>
            <td style="padding: 8px; text-align: center; vertical-align: top; min-height:${minHeight}px;${styleMobile}">${data_zakonczenia}</td>
            <td style="padding: 8px; text-align: center; vertical-align: top; min-height:${minHeight}px;${styleMobile}">${planowana_data_zakonczenia}</td>
            <td style="padding: 8px; text-align: center; vertical-align: top; min-height:${minHeight}px;${styleMobile}">${procent_wykonania}</td>
         </tr>
      `;
   }).join('');

   const card = {
      id: id_projektu,
      className: 'karta_zadania',
      navbar: `<h3>Zadania: ${nazwa_projektu}</h3>`,
      content: `
         <div class="zadania-table-wrap" id="zadania-table-wrap-${id_projektu}">
         <table class="zadania-table" id="zadania-table-${id_projektu}">
            <thead>
            <tr>
               <th>🏷️<br>Zadanie</th>
               <th>📝<br>Opis</th>
               
               <th >✅ Status<br></th>
               <th>⚠️<br>Priorytet</th>
               
               <th>🗒️<br>Notatka</th>
               
               <th>📅<br>Rozpoczęcie</th>
               
               <th>🏁<br>Zakończenie</th>
               
               <th>⏳<br>Planowana</th
               >
               <th>📈 <br>Wykonanie</th>
            </tr>
            </thead>
            <tbody>
            ${rows}
            </tbody>
         </table>
         </div>
         <script>
         (function(){
            // Tylko jeden wiersz może być zaznaczony
            const globalKey = 'zaznaczone_wiersze_${id_projektu}';
            window[globalKey] = window[globalKey] || [];
            let selectedRows = window[globalKey];
            const table = document.getElementById('zadania-table-${id_projektu}');
            if(table){
               table.addEventListener('click', function(e){
                  let tr = e.target.closest('tr.zadanie-row');
                  if(!tr) return;
                  const id = tr.getAttribute('data-id');
                  // Odznacz wszystkie inne
                  table.querySelectorAll('tr.selected').forEach(row => {
                     if(row !== tr) row.classList.remove('selected');
                  });
                  if(tr.classList.contains('selected')){
                     tr.classList.remove('selected');
                     selectedRows = [];
                  } else {
                     tr.classList.add('selected');
                     selectedRows = [id];
                  }
                  window[globalKey] = selectedRows;
               });

               // Dodaj obsługę podwójnego kliknięcia do edycji zadania (desktop)
               table.addEventListener('dblclick', function(e){
                  let tr = e.target.closest('tr.zadanie-row');
                  if(!tr) return;
                  const id = tr.getAttribute('data-id');
                  if(id){
                     if(window.zadania && typeof window.zadania.edytuj_zadanie === 'function'){
                        window.zadania.edytuj_zadanie(id);
                     } else if(window.Render && window.Render.activeModule && typeof window.Render.activeModule.edytuj_zadanie === 'function'){
                        window.Render.activeModule.edytuj_zadanie(id);
                     }
                  }
               });

               // Dodaj obsługę długiego przytrzymania (long press) na dotyku (mobile)
               let touchTimer = null;
               let touchStartX = 0, touchStartY = 0;
               let touchMoved = false;
               table.addEventListener('touchstart', function(e){
                  let tr = e.target.closest('tr.zadanie-row');
                  if(!tr) return;
                  if(e.touches && e.touches.length === 1){
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    touchMoved = false;
                  }
                  touchTimer = setTimeout(function(){
                     if(touchMoved) return;
                     const id = tr.getAttribute('data-id');
                     if(id){
                        if(window.zadania && typeof window.zadania.edytuj_zadanie === 'function'){
                           window.zadania.edytuj_zadanie(id);
                        } else if(window.Render && window.Render.activeModule && typeof window.Render.activeModule.edytuj_zadanie === 'function'){
                           window.Render.activeModule.edytuj_zadanie(id);
                        }
                     }
                  }, 500); // 500ms long press
               });
               table.addEventListener('touchend', function(e){
                  clearTimeout(touchTimer);
               });
               table.addEventListener('touchmove', function(e){
                  if(!touchTimer) return;
                  if(e.touches && e.touches.length === 1){
                    const dx = Math.abs(e.touches[0].clientX - touchStartX);
                    const dy = Math.abs(e.touches[0].clientY - touchStartY);
                    if(dx > 10 || dy > 10){
                      touchMoved = true;
                      clearTimeout(touchTimer); // Anuluj jeśli przesunięcie
                    }
                  }
               });
            }
         })();
         </script>
      `,
         footer: `
            <div class="zadania-progress-bar-wrap zadania-progress-bar-singleline">
               <div class="zadania-progress-bar-bg">
                           <div class="zadania-progress-bar-green" style="width: ${tasks.length ? (tasks.filter(z=>z.status_zadania===1).length/tasks.length*100) : 0}%;">
                           </div>
                           <div class="zadania-progress-bar-red" style="width: ${tasks.length ? (tasks.filter(z=>z.status_zadania===0).length/tasks.length*100) : 0}%; left: ${tasks.length ? (tasks.filter(z=>z.status_zadania===1).length/tasks.length*100) : 0}%;">
                           </div>
                           <span class="zadania-progress-bar-label">
                              Wykonane: ${tasks.filter(z=>z.status_zadania===1).length} | Niewykonane: ${tasks.filter(z=>z.status_zadania===0).length}
                           </span>
               </div>
            </div>
         `,
         ikony: [
            {
               text: '↩️ cofnij',
               onClick: () => { window.function_projekty.wyswietl_projekt(`${id_projektu}`); }
            },
            {
               text: '➕ dodaj',
               onClick: () => { this.dodaj_zadanie(id_projektu); }
            },
            {
               text: '📝 edytuj',
               onClick: async () => {
                  const globalKey = 'zaznaczone_wiersze_' + String(id_projektu);
                  const selected = window[globalKey] && window[globalKey][0];
                  if(selected){
                     if(window.zadania && typeof window.zadania.edytuj_zadanie === 'function'){
                        await window.zadania.edytuj_zadanie(selected);
                     } else if(window.Render && window.Render.activeModule && typeof window.Render.activeModule.edytuj_zadanie === 'function'){
                        await window.Render.activeModule.edytuj_zadanie(selected);
                     }
                  } else {
                     alert('Zaznacz wiersz do edycji.');
                  }
               }
            },
            {
               text:'➕ wiele',
               onClick: () => { this.add_many_zadania(id_projektu); }
            },
             {
                  text: '🗑️ usuń',
                  onClick: async () => {
                     const globalKey = 'zaznaczone_wiersze_' + String(id_projektu);
                     const selected = window[globalKey] && window[globalKey][0];
                     if(selected){
                        if(window.zadania && typeof window.zadania.usun_zadanie === 'function'){
                           await window.zadania.usun_zadanie(selected, id_projektu);
                        } else if(window.Render && window.Render.activeModule && typeof window.Render.activeModule.usun_zadanie === 'function'){
                           await window.Render.activeModule.usun_zadanie(selected, id_projektu);
                        }
                     } else {
                        alert('Zaznacz wiersz do usunięcia.');
                     }
                  }
             }

         ]
   };
   return card;
}

/*dodawanienowego zadania do bazy danych zadania
*/
async add_zadanie(dane){
   
   const errors = this.walidujZadanie(dane);
   if (errors.length > 0) {
      alert('Wystąpiły błędy walidacji:\n' + errors.join('\n'));
      return;
   }
   const odpowiedz = await this.fetchApi({
      "funkcja": "add",
      "tabela": "zadania",
      "dane": dane
   });
   console.log('Odpowiedź z API (add_zadanie):', odpowiedz);
   const message = odpowiedz.message || 'Zadanie zostało dodane.';
   if (confirm(`${message}\n\nCzy chcesz dodać kolejne zadanie?`)) {
      this.dodaj_zadanie(dane.id_projektu);
   } else {
      this.podglad_zadan(dane.id_projektu);
   }

}

 /* update istniejącego zadania w bazie danych zadania
*/
async update_zadanie(dane){
   //console.log("update_zadanie dane:", dane);
   const errors = this. walidujZadanie(dane);
if (errors.length > 0) {
  alert('Wystąpiły błędy walidacji:\n' + errors.join('\n'));
  return;}
   try {
      const odpowiedz = await this.fetchApi({
         "funkcja": "update",
         "tabela": "zadania",
         "dane": { ...dane },
         "filter": { "id_zadania": dane.id_zadania }
      });
      const message = odpowiedz.message || 'Zadanie zostało zaktualizowane.';
      alert(message);
      // Odśwież widok zadań dla projektu
      this.podglad_zadan(dane.id_projektu);
   } catch (e) {
      alert('Błąd podczas aktualizacji zadania.');
      console.error(e);
   }
}


async add_wiele_zadan(zadania){
   let allOk = true;
   let results = [];
   for (const dane of zadania) {
      try {
         const res = await this.fetchApi({
            "funkcja": "add",
            "tabela": "zadania",
            "dane": dane
         });
         results.push(res);
         if (!res || res.status !== 'success') {
            allOk = false;
         }
      } catch (e) {
         allOk = false;
         results.push({ status: 'error', message: e?.message || 'Błąd sieci' });
      }
   }
   return allOk ? { status: 'success', results } : { status: 'error', results };
}







/* usuwanie zadania */
async usun_zadanie(id_zadania,id_projektu){ 

   const canAdd = await this.sprawdz_uprawnienia(id_projektu);
   if (!canAdd) {
      return;
   }


   if (!confirm("Czy na pewno chcesz usunąć to zadanie?")) {
      return;
   }
 const odpowiedz = await this.fetchApi(  {
    "funkcja": "delete",
    "tabela": "zadania",
    "filter": { "id_zadania": id_zadania }
  });
if (odpowiedz && odpowiedz.status === 'success') {
   alert('Zadanie zostało usunięte.');
} else {
   alert('Nie udało się usunąć zadania.');
}
  this.podglad_zadan(id_projektu);
   
  

}



/* endpoint do wysylania i odbierania danych z api_baza_danych
*/
   async fetchApi(dane) {
      try {
         const options = {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(dane)
         };
        // console.log('Wysyłanie do API:', dane);
         const response = await fetch('../api/api_baza_danych.php', options);

         if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Błąd sieci: ${response.status} ${response.statusText} ${errorData.message || ''}`);
         }

         const data = await response.json();
       //  console.log('Otrzymano z API:', data);
         return data;

      } catch (error) {
         console.error('Błąd podczas pobierania projektów:', error);
         throw error;
      }
   }



/* spraedzanie uprawnien */
async sprawdz_uprawnienia(id_projektu){



      // Pobierz dane użytkownika bezpośrednio tutaj
      let userData = null;
      try {
         const response = await fetch('../api/sesja.php?akcja=uprawnienia', { credentials: 'include' });
         if (!response.ok) return false;
         userData = await response.json();
      } catch (e) {
         return false;
      }

      const dane = {
         "funkcja": "get",
         "tabela": "projekty",
         "filter": {
            "id_projektu": id_projektu
         }
      };
      const projekt = await this.fetchApi(dane);
      console.log("zalogowany", userData);
      console.log("projekt", projekt);
      if(userData.uprawnienia !== "Administrator"){
         if(userData.aktywny != 1){
            alert("Twoje konto jest nieaktywne. Nie możesz dodawać zadań.");
            return false;
         }
         if(userData.id_pracownika !== projekt.data[0].id_kierownika){
            alert("Nie masz uprawnień do dodawania zadań w tym projekcie.");
            return false;
         }
      }
      //console.log("moze dodac zadanie");
      return true;
   }
/* waliduje dane ustawiajac odpowiednie wartosc w razie np pustych pul
*/
walidujZadanie(dane) {
   const errors = [];

   // id_projektu - wymagane, liczba całkowita
   if (!dane.id_projektu || isNaN(parseInt(dane.id_projektu))) {
      errors.push('Brak prawidłowego id_projektu.');
      dane.id_projektu = 1;
   }

   // tytul_zadania - wymagany, max 255 znaków
   if (!dane.tytul_zadania || dane.tytul_zadania.trim().length === 0) {
      errors.push('Tytuł zadania jest wymagany.');
   } else if (dane.tytul_zadania.length > 255) {
      dane.tytul_zadania = dane.tytul_zadania.substring(0, 255);
   }

   // data_rozpoczecia - wymagane
   if (!dane.data_rozpoczecia || !/^\d{4}-\d{2}-\d{2}$/.test(dane.data_rozpoczecia)) {
      errors.push('Nieprawidłowa data rozpoczęcia.');
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dane.data_rozpoczecia = `${yyyy}-${mm}-${dd}`;
   }

   // data_zakonczenia, planowana_data_zakonczenia - opcjonalne, poprawny format daty
   ['data_zakonczenia', 'planowana_data_zakonczenia'].forEach(field => {
      if (dane[field] === '') {
         dane[field] = null;
      } else if (dane[field] && !/^\d{4}-\d{2}-\d{2}$/.test(dane[field])) {
         dane[field] = null;
      }
   });

   // status_zadania - 0 lub 1
   if (dane.status_zadania !== undefined && ![0, 1, '0', '1'].includes(dane.status_zadania)) {
      dane.status_zadania = 0;
   }

   // priorytet - enum
   const priorytety = ['Niski', 'Normalny', 'Wysoki', 'Krytyczny'];
   if (dane.priorytet && !priorytety.includes(dane.priorytet)) {
      dane.priorytet = 'Normalny';
   }

   // przypomnij_rozpoczecie - 0 lub 1
   if (dane.przypomnij_rozpoczecie !== undefined && ![0, 1, '0', '1'].includes(dane.przypomnij_rozpoczecie)) {
      dane.przypomnij_rozpoczecie = 0;
   }

   // id_pracownika - opcjonalny, liczba całkowita lub null
   if (dane.id_pracownika === '') {
      dane.id_pracownika = null;
   } else if (dane.id_pracownika && isNaN(parseInt(dane.id_pracownika))) {
      dane.id_pracownika = null;
   }

   // procent_wykonania - liczba 0-100
   if (dane.procent_wykonania === '') {
      dane.procent_wykonania = null;
   } else if (dane.procent_wykonania !== undefined) {
      let val = parseInt(dane.procent_wykonania);
      if (isNaN(val) || val < 0) {
         dane.procent_wykonania = 0;
      } else if (val > 100) {
         dane.procent_wykonania = 100;
      } else {
         dane.procent_wykonania = val;
      }
   }

   return errors;
}






}
 export default zadania ;