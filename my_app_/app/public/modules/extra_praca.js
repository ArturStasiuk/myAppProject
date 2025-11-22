/* Moduł obsługi kart i funkcji dla tabeli extra_praca i widoku view_extra_praca_full */
class extra_praca {
    constructor() {
        this.name = "extra_praca";
    }

    // Wyświetl podgląd extra_praca dla projektu
    async podglad_extra_praca(id_projektu) {
        const dane = {
            "funkcja": "getExtraPraca",
            "column": "id_projektu",
            "value": id_projektu,
            "mode": "exact",
            "limit": 1000,
            "offset": 0
        };
        let data = await this.fetchApi(dane);
        if (!data || (Array.isArray(data) && data.length === 0) || (data && Array.isArray(data.data) && data.data.length === 0)) {
            data = { data: [{ id_projektu: id_projektu }] };
        }
        window.Render.card(this.widok_podglad_extra_praca(data));
    }

    // Edycja rekordu extra_praca
    async edytuj_extra_praca(id_extra_praca) {
        // Pobierz rekord
        const res = await this.fetchApi({
            "funkcja": "getExtraPraca",
            "column": "id_extra_praca",
            "value": id_extra_praca,
            "mode": "exact",
            "limit": 1,
            "offset": 0
        });
        const rekord = res && res.data && res.data[0] ? res.data[0] : null;
        if (!rekord || !rekord.id_projektu) {
            alert("Nie znaleziono rekordu lub brak id_projektu");
            return;
        }
        const id_projektu = rekord.id_projektu;
        const canEdit = await this.sprawdz_uprawnienia(id_projektu);
        if (!canEdit) return;
        // Pobierz projekt i pracowników brygady
        const projekt = await this.fetchApi({
            "funkcja": "getProjekty",
            "column": "id_projektu",
            "value": id_projektu,
            "mode": "exact",
            "limit": 1,
            "offset": 0
        });
        let id_brygady = null;
        if (projekt && projekt.data && projekt.data[0] && projekt.data[0].id_brygady) {
            id_brygady = projekt.data[0].id_brygady;
        }
        let pracownicy = { data: [] };
        let zatwierdzajacy = { data: [] };
        if (id_brygady) {
            pracownicy = await this.fetchApi({
                "funkcja": "getPracownicy",
                "column": "id_brygady",
                "value": id_brygady,
                "mode": "exact",
                "offset": 0,
                "dane": {
                    "columns": ["id_pracownika", "imie", "nazwisko", "stanowisko", "id_brygady", "uprawnienia"]
                },
                "filter": { "aktywny": 1 }
            });
            // Zatwierdzający: tylko kierownik projektu i administratorzy
            // Pobierz kierownika projektu
            let kierownik = null;
            if (projekt && projekt.data && projekt.data[0] && projekt.data[0].id_kierownika) {
                const kierownikRes = await this.fetchApi({
                    "funkcja": "getPracownicy",
                    "column": "id_pracownika",
                    "value": projekt.data[0].id_kierownika,
                    "mode": "exact",
                    "offset": 0,
                    "dane": {
                        "columns": ["id_pracownika", "imie", "nazwisko", "stanowisko", "id_brygady", "uprawnienia"]
                    },
                    "filter": { "aktywny": 1 }
                });
                if (kierownikRes && kierownikRes.data && kierownikRes.data.length > 0) {
                    kierownik = kierownikRes.data[0];
                }
            }
            // Pobierz administratorów
            const admini = await this.fetchApi({
                "funkcja": "getPracownicy",
                "column": "uprawnienia",
                "value": "Administrator",
                "mode": "exact",
                "offset": 0,
                "dane": {
                    "columns": ["id_pracownika", "imie", "nazwisko", "stanowisko", "id_brygady", "uprawnienia"]
                },
                "filter": { "aktywny": 1 }
            });
            // Zbuduj listę zatwierdzających bez duplikatów
            zatwierdzajacy.data = [];
            if (kierownik) zatwierdzajacy.data.push(kierownik);
            if (admini && admini.data && Array.isArray(admini.data)) {
                admini.data.forEach(a => {
                    if (!zatwierdzajacy.data.find(z => z.id_pracownika == a.id_pracownika)) {
                        zatwierdzajacy.data.push(a);
                    }
                });
            }
        }
        window.Render.card(this.widok_extra_praca(projekt, pracownicy, zatwierdzajacy, rekord));
    }

    // Dodawanie nowego rekordu extra_praca
    async dodaj_extra_praca(id_projektu) {
        const canAdd = await this.sprawdz_uprawnienia(id_projektu);
        if (!canAdd) return;
        // Pobierz projekt i pracowników brygady
        const projekt = await this.fetchApi({
            "funkcja": "getProjekty",
            "column": "id_projektu",
            "value": id_projektu,
            "mode": "exact",
            "limit": 1,
            "offset": 0
        });
        let id_brygady = null;
        if (projekt && projekt.data && projekt.data[0] && projekt.data[0].id_brygady) {
            id_brygady = projekt.data[0].id_brygady;
        }
        let pracownicy = { data: [] };
        let zatwierdzajacy = { data: [] };
        if (id_brygady) {
            pracownicy = await this.fetchApi({
                "funkcja": "getPracownicy",
                "column": "id_brygady",
                "value": id_brygady,
                "mode": "exact",
                "offset": 0,
                "dane": {
                    "columns": ["id_pracownika", "imie", "nazwisko", "stanowisko", "id_brygady", "uprawnienia"]
                },
                "filter": { "aktywny": 1 }
            });
            // Zatwierdzający: tylko kierownik projektu i administratorzy
            // Pobierz kierownika projektu
            let kierownik = null;
            if (projekt && projekt.data && projekt.data[0] && projekt.data[0].id_kierownika) {
                const kierownikRes = await this.fetchApi({
                    "funkcja": "getPracownicy",
                    "column": "id_pracownika",
                    "value": projekt.data[0].id_kierownika,
                    "mode": "exact",
                    "offset": 0,
                    "dane": {
                        "columns": ["id_pracownika", "imie", "nazwisko", "stanowisko", "id_brygady", "uprawnienia"]
                    },
                    "filter": { "aktywny": 1 }
                });
                if (kierownikRes && kierownikRes.data && kierownikRes.data.length > 0) {
                    kierownik = kierownikRes.data[0];
                }
            }
            // Pobierz administratorów
            const admini = await this.fetchApi({
                "funkcja": "getPracownicy",
                "column": "uprawnienia",
                "value": "Administrator",
                "mode": "exact",
                "offset": 0,
                "dane": {
                    "columns": ["id_pracownika", "imie", "nazwisko", "stanowisko", "id_brygady", "uprawnienia"]
                },
                "filter": { "aktywny": 1 }
            });
            // Zbuduj listę zatwierdzających bez duplikatów
            zatwierdzajacy.data = [];
            if (kierownik) zatwierdzajacy.data.push(kierownik);
            if (admini && admini.data && Array.isArray(admini.data)) {
                admini.data.forEach(a => {
                    if (!zatwierdzajacy.data.find(z => z.id_pracownika == a.id_pracownika)) {
                        zatwierdzajacy.data.push(a);
                    }
                });
            }
        }
        window.Render.card(this.widok_extra_praca(projekt, pracownicy, zatwierdzajacy, { id_projektu }));
    }

    // Usuwanie rekordu extra_praca
    async usun_extra_praca(id_extra_praca, id_projektu) {
        const canDel = await this.sprawdz_uprawnienia(id_projektu);
        if (!canDel) return;
        if (!confirm("Czy na pewno chcesz usunąć ten wpis?")) return;
        const odpowiedz = await this.fetchApi({
            "funkcja": "delete",
            "tabela": "extra_praca",
            "filter": { "id_extra_praca": id_extra_praca }
        });
        if (odpowiedz && odpowiedz.status === 'success') {
            alert('Wpis został usunięty.');
        } else {
            alert('Nie udało się usunąć wpisu.');
        }
        this.podglad_extra_praca(id_projektu);
    }

    /* Widok podglądu extra_praca */
 widok_podglad_extra_praca(response) {
        let entries = [];
        if (Array.isArray(response)) {
            entries = response;
        } else if (response && Array.isArray(response.data)) {
            entries = response.data;
        }
        if (!entries || entries.length === 0) {
            return {
                id: 'karta_extra_praca',
                className: 'karta_extra_praca',
                navbar: '<h3>Dodatkowa praca</h3>',
                content: '<p>Brak wpisów do wyświetlenia.</p>',
                footer: '',
                ikony: []
            };
        }
        const first = entries[0] || {};
        const id_projektu = first.id_projektu || 'karta_extra_praca';
        const nazwa_projektu = first.nazwa_projektu || '';
        // Zaznaczanie wiersza i obsługa kliknięć/edycji/usuwania
        const rows = entries.map(e => {
            return `
                <tr class="extra-row" data-id="${e.id_extra_praca}">
                    <td>${e.opis_pracy || ''}</td>
                    <td>${e.notatka || '-'}</td>
                    <td>${e.data_rozpoczecia || '-'}</td>
                    <td>${e.data_zakonczenia || '-'}</td>
                    <td>${e.czas_pracy || '-'}</td>
                    <td>${e.koszt_dodatkowy || ''}</td>
                    <td>${e.zatwierdzona == 1 ? '✅' : '⬜'}</td>
                    <td>${e.przypomnij_rozpoczecie == 1 ? '🔔' : '⬜'}</td>
                    <td>${e.wykonawca || '-'}</td>
                    <td>${e.zatwierdzajacy || '-'}</td>
                </tr>
            `;
        }).join('');
            // Podsumowanie
            const wykonane = entries.filter(e => e.zatwierdzona == 1).length;
            const niewykonane = entries.filter(e => e.zatwierdzona != 1).length;
            // Suma godzin pracy
            let sumaGodzin = 0;
            entries.forEach(e => {
                let godz = 0;
                if (typeof e.czas_pracy === 'string' && e.czas_pracy.trim() !== '') {
                    // Obsługa formatu "hh:mm" lub liczby
                    if (/^\d{1,2}:\d{2}$/.test(e.czas_pracy)) {
                        const [h, m] = e.czas_pracy.split(':').map(Number);
                        godz = h + m/60;
                    } else if (!isNaN(parseFloat(e.czas_pracy))) {
                        godz = parseFloat(e.czas_pracy);
                    }
                } else if (typeof e.czas_pracy === 'number') {
                    godz = e.czas_pracy;
                }
                sumaGodzin += godz;
            });
            // Procent wykonania
            const total = entries.length;
            const procentWykonane = total > 0 ? Math.round((wykonane/total)*100) : 0;
            const procentNiewykonane = total > 0 ? Math.round((niewykonane/total)*100) : 0;
            // Całkowity koszt
            let sumaKoszt = 0;
            entries.forEach(e => {
                if (!isNaN(parseFloat(e.koszt_dodatkowy))) {
                    sumaKoszt += parseFloat(e.koszt_dodatkowy);
                }
            });
            // Dodaj wiersz podsumowania
            const summaryRow = `
                <tr class="extra-summary-row">
                    <td colspan="10" style="text-align:center; white-space:nowrap;">
                        
                        Wykonane: ${wykonane} (${procentWykonane}%) |
                        Suma godzin: ${sumaGodzin.toFixed(2)} | 
                        Koszt: ${sumaKoszt.toFixed(2)} zł
                    </td>
                </tr>
            `;
        const card = {
            id: id_projektu,
            className: 'karta_extra_praca',
            navbar: `<h3>Dodatkowa praca: ${nazwa_projektu}</h3>`,
            content: `
                <div class="extra-table-wrap" id="extra-table-wrap-${id_projektu}">
                <table class="extra-table" id="extra-table-${id_projektu}">
                    <thead>
                        <tr>
                            <th class="extra-col-opis">Opis pracy</th>
                            <th class="extra-col-notatka">Notatka</th>
                            <th>Rozpoczęcie</th>
                            <th>Zakończenie</th>
                            <th>Czas pracy</th>
                            <th>Koszt</th>
                            <th>Zatwierdzona</th>
                            <th>Przypomnij</th>
                            <th>Wykonawca</th>
                            <th>Zatwierdzający</th>
                        </tr>
                    </thead>
                    <tbody>
                            ${rows}
                            ${summaryRow}
                    </tbody>
                </table>
                </div>
                <script>
                (function(){
                    const globalKey = 'zaznaczone_wiersze_extra_' + String(${id_projektu});
                    window[globalKey] = window[globalKey] || [];
                    let selectedRows = window[globalKey];
                    const table = document.getElementById('extra-table-${id_projektu}');
                    if(table){
                        table.addEventListener('click', function(e){
                            let tr = e.target.closest('tr.extra-row');
                            if(!tr) return;
                            const id = tr.getAttribute('data-id');
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
                        table.addEventListener('dblclick', function(e){
                            let tr = e.target.closest('tr.extra-row');
                            if(!tr) return;
                            const id = tr.getAttribute('data-id');
                            if(id && window.extra_praca && typeof window.extra_praca.edytuj_extra_praca === 'function'){
                                window.extra_praca.edytuj_extra_praca(id);
                            }
                        });
                    }
                })();
                </script>
            `,
            footer: `
                <div class="extra-footer-stat">
                    <button type="button" class="extra-btn-save" onclick="window.extra_praca.dodaj_extra_praca(${id_projektu})">➕Dodaj </button>
                    <button type="button" class="extra-btn-edit" onclick="(function(){
                        const globalKey = 'zaznaczone_wiersze_extra_' + String(${id_projektu});
                        const selected = window[globalKey] && window[globalKey][0];
                        if(selected){
                            window.extra_praca.edytuj_extra_praca(selected);
                        } else { alert('Zaznacz wiersz do edycji.'); }
                    })()">📝 Edytuj</button>
                    <button type="button" class="extra-btn-delete" onclick="(function(){
                        const globalKey = 'zaznaczone_wiersze_extra_' + String(${id_projektu});
                        const selected = window[globalKey] && window[globalKey][0];
                        if(selected){
                            window.extra_praca.usun_extra_praca(selected, ${id_projektu});
                        } else { alert('Zaznacz wiersz do usunięcia.'); }
                    })()">🗑️ Usuń</button>
                </div>
            `,
            ikony: [
                { text: '↩️ cofnij', onClick: () => { window.function_projekty.wyswietl_projekt(`${id_projektu}`); } }
             
            ]
        };
        return card;
    }

    // Widok formularza edycji/dodawania extra_praca
    widok_extra_praca(projekt, pracownicy, zatwierdzajacy, rekord) {
        // Przygotuj dane projektu i pracowników
        const id_projektu = projekt?.data?.[0]?.id_projektu || projekt?.id_projektu || '';
        const nazwa_projektu = projekt?.data?.[0]?.nazwa_projektu || projekt?.nazwa_projektu || '';
        let pracownicyOptions = '';
        if (pracownicy && pracownicy.data && Array.isArray(pracownicy.data)) {
            pracownicyOptions = pracownicy.data.map(p =>
                `<option value="${p.id_pracownika}"${rekord && rekord.id_pracownika == p.id_pracownika ? ' selected' : ''}>${p.imie} ${p.nazwisko} (${p.stanowisko})</option>`
            ).join('');
        }
        let zatwierdzajacyOptions = '';
        if (zatwierdzajacy && zatwierdzajacy.data && Array.isArray(zatwierdzajacy.data)) {
            zatwierdzajacyOptions = zatwierdzajacy.data.map(p =>
                `<option value="${p.id_pracownika}"${rekord && rekord.id_zatwierdzajacego == p.id_pracownika ? ' selected' : ''}>${p.imie} ${p.nazwisko} (${p.stanowisko})</option>`
            ).join('');
        }
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;
        const isEdit = !!rekord && !!rekord.id_extra_praca;
        const opis_pracy = rekord?.opis_pracy || '';
        const notatka = rekord?.notatka || '';
        const data_rozpoczecia = rekord?.data_rozpoczecia || todayStr;
        const data_zakonczenia = rekord?.data_zakonczenia || '';
        const czas_pracy = rekord?.czas_pracy || '';
        const koszt_dodatkowy = rekord?.koszt_dodatkowy || '';
    const zatwierdzona = rekord?.zatwierdzona == 1 || rekord?.zatwierdzona == '1';
    const przypomnij_rozpoczecie = rekord?.przypomnij_rozpoczecie == 1 || rekord?.przypomnij_rozpoczecie == '1';
        const id_pracownika = rekord?.id_pracownika || '';
        const id_zatwierdzajacego = rekord?.id_zatwierdzajacego || '';
        const id_extra_praca = rekord?.id_extra_praca || '';
        const card = {
            id: id_projektu,
            className: 'karta_extra_praca',
            navbar: isEdit ? `<h3>✏️ Edycja dodatkowej pracy: ${nazwa_projektu}</h3>` : `<h3>➕ Nowa dodatkowa praca: ${nazwa_projektu}</h3>`,
            content: `
                <form id="formularz-extra-praca-${id_projektu}" class="formularz-extra-praca">
                    <div class="extra-form-fields">
                        <div class="extra-form-group">
                            <label for="opis_pracy">Opis pracy</label>
                            <textarea name="opis_pracy" id="opis_pracy" rows="3">${opis_pracy}</textarea>
                        </div>
                        <div class="extra-form-group">
                            <label for="notatka">Notatka</label>
                            <textarea name="notatka" id="notatka" rows="2">${notatka}</textarea>
                        </div>
                        <div class="extra-form-group">
                            <label for="data_rozpoczecia">Data rozpoczęcia</label>
                            <input type="date" name="data_rozpoczecia" id="data_rozpoczecia" value="${data_rozpoczecia}">
                        </div>
                        <div class="extra-form-group">
                            <label for="data_zakonczenia">Data zakończenia</label>
                            <input type="date" name="data_zakonczenia" id="data_zakonczenia" value="${data_zakonczenia}">
                        </div>
                        <div class="extra-form-group">
                            <label for="czas_pracy">Czas pracy</label>
                            <input type="text" name="czas_pracy" id="czas_pracy" value="${czas_pracy}">
                        </div>
                        <div class="extra-form-group">
                            <label for="koszt_dodatkowy">Koszt dodatkowy</label>
                            <input type="number" name="koszt_dodatkowy" id="koszt_dodatkowy" value="${koszt_dodatkowy}">
                        </div>
                        <div class="extra-form-group extra-form-checkbox">
                            <label for="zatwierdzona">Zatwierdzona</label>
                            <input type="checkbox" name="zatwierdzona" id="zatwierdzona" value="1"${zatwierdzona ? ' checked' : ''}>
                        </div>
                        <div class="extra-form-group extra-form-checkbox">
                            <label for="przypomnij_rozpoczecie">Przypomnij rozpoczęcie</label>
                            <input type="checkbox" name="przypomnij_rozpoczecie" id="przypomnij_rozpoczecie" value="1"${przypomnij_rozpoczecie ? ' checked' : ''}>
                        </div>
                        <div class="extra-form-group">
                            <label for="id_pracownika">Pracownik</label>
                            <select name="id_pracownika" id="id_pracownika"><option value="">-- Wybierz pracownika --</option>${pracownicyOptions}</select>
                        </div>
                        <div class="extra-form-group">
                            <label for="id_zatwierdzajacego">Zatwierdzający</label>
                            <select name="id_zatwierdzajacego" id="id_zatwierdzajacego"><option value="">-- Wybierz zatwierdzającego --</option>${zatwierdzajacyOptions}</select>
                        </div>
                    </div>
                    <input type="hidden" name="id_projektu" value="${id_projektu}">
                    ${isEdit && id_extra_praca ? `<input type="hidden" name="id_extra_praca" value="${id_extra_praca}">` : ''}
                </form>
                <script>
                window.extra_praca = window.extra_praca || {};
                window.extra_praca._zbierzDaneExtraPraca = function(formId) {
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
                    // Jeśli nie wybrano pracownika lub zatwierdzającego, ustaw na null
                    if (data.id_pracownika === '' || data.id_pracownika === undefined) data.id_pracownika = null;
                    if (data.id_zatwierdzajacego === '' || data.id_zatwierdzajacego === undefined) data.id_zatwierdzajacego = null;
                    // Checkbox przypomnij_rozpoczecie na 0/1
                    if (typeof data.przypomnij_rozpoczecie !== 'undefined') {
                        data.przypomnij_rozpoczecie = data.przypomnij_rozpoczecie === '1' ? 1 : 0;
                    }
                    return data;
                }
                </script>
            `,
            footer: `
                <div class="extra-footer-stat">
                    ${isEdit && id_extra_praca ? `
                        <button type="button" class="extra-btn-save" onclick="window.extra_praca.update_extra_praca(window.extra_praca._zbierzDaneExtraPraca('formularz-extra-praca-${id_projektu}'))">💾 Zapisz zmiany</button>
                        <button type="button" class="extra-btn-delete" style="margin-left:12px;color:#fff;background:#dc2626;" onclick="window.extra_praca.usun_extra_praca('${id_extra_praca}','${id_projektu}')">🗑️ Usuń wpis</button>
                    ` : `
                        <button type="button" class="extra-btn-save" onclick="window.extra_praca.add_extra_praca(window.extra_praca._zbierzDaneExtraPraca('formularz-extra-praca-${id_projektu}'))">💾 Zapisz wpis</button>
                    `}
                    <button type="button" class="extra-btn-cancel" onclick="window.extra_praca.podglad_extra_praca(${id_projektu})">❌ Anuluj</button>
                </div>
            `,
            ikony: [
                { text: '↩️', onClick: () => { this.podglad_extra_praca(id_projektu); } }
            ]
        };
        return card;
    }

    // Dodawanie nowego wpisu do bazy
    async add_extra_praca(dane) {
        const errors = this.walidujExtraPraca(dane);
        if (errors.length > 0) {
            alert('Wystąpiły błędy walidacji:\n' + errors.join('\n'));
            return;
        }
        const odpowiedz = await this.fetchApi({
            "funkcja": "add",
            "tabela": "extra_praca",
            "dane": dane
        });
        const message = odpowiedz.message || 'Wpis został dodany.';
        if (confirm(`${message}\n\nCzy chcesz dodać kolejny wpis?`)) {
            this.dodaj_extra_praca(dane.id_projektu);
        } else {
            this.podglad_extra_praca(dane.id_projektu);
        }
    }

    // Aktualizacja wpisu
    async update_extra_praca(dane) {
        const errors = this.walidujExtraPraca(dane);
        // Sprawdzenie wymaganych pól (id_pracownika i id_zatwierdzajacego mogą być NULL)
        const required = ['id_extra_praca', 'id_projektu'];
        required.forEach(f => {
            if (!dane[f] || dane[f] === '') {
                errors.push(`Brak wymaganego pola: ${f}`);
            }
        });
        console.log('Dane do update_extra_praca:', dane);
        if (errors.length > 0) {
            alert('Wystąpiły błędy walidacji:\n' + errors.join('\n'));
            return;
        }
        try {
            const odpowiedz = await this.fetchApi({
                "funkcja": "update",
                "tabela": "extra_praca",
                "dane": { ...dane },
                "filter": { "id_extra_praca": dane.id_extra_praca }
            });
            const message = odpowiedz.message || 'Wpis został zaktualizowany.';
            alert(message);
            this.podglad_extra_praca(dane.id_projektu);
        } catch (e) {
            alert('Błąd podczas aktualizacji wpisu.');
            console.error(e);
        }
    }

    // API fetch
    async fetchApi(dane) {
        try {
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dane)
            };
            const response = await fetch('../api/api_baza_danych.php', options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Błąd sieci: ${response.status} ${response.statusText} ${errorData.message || ''}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Błąd podczas pobierania:', error);
            throw error;
        }
    }

    // Sprawdzanie uprawnień (analogicznie do zadania.js)
    async sprawdz_uprawnienia(id_projektu) {
        let userData = null;
        try {
            const response = await fetch('../api/sesja.php?akcja=uprawnienia', { credentials: 'include' });
            if (!response.ok) return false;
            userData = await response.json();
        } catch (e) { return false; }
        const dane = {
            "funkcja": "get",
            "tabela": "projekty",
            "filter": { "id_projektu": id_projektu }
        };
        const projekt = await this.fetchApi(dane);
        if(userData.uprawnienia !== "Administrator"){
            if(userData.aktywny != 1){
                alert("Twoje konto jest nieaktywne. Nie możesz edytować wpisów.");
                return false;
            }
            if(userData.id_pracownika !== projekt.data[0].id_kierownika){
                alert("Nie masz uprawnień do edycji wpisów w tym projekcie.");
                return false;
            }
        }
        return true;
    }

    // Walidacja danych
        walidujExtraPraca(dane) {
            // Przypomnij rozpoczęcie: zamiana pustego stringa na 0
            if (typeof dane.przypomnij_rozpoczecie === 'undefined' || dane.przypomnij_rozpoczecie === '' || dane.przypomnij_rozpoczecie === null) {
                dane.przypomnij_rozpoczecie = 0;
            } else if (![0,1,'0','1'].includes(dane.przypomnij_rozpoczecie)) {
                dane.przypomnij_rozpoczecie = 0;
            } else {
                dane.przypomnij_rozpoczecie = Number(dane.przypomnij_rozpoczecie);
            }
            const errors = [];
            if (!dane.id_projektu || isNaN(parseInt(dane.id_projektu))) {
                dane.id_projektu = 1;
            }
            if (dane.opis_pracy && dane.opis_pracy.length > 255) {
                dane.opis_pracy = dane.opis_pracy.substring(0, 255);
            }
            if (dane.notatka && dane.notatka.length > 255) {
                dane.notatka = dane.notatka.substring(0, 255);
            }
            ['data_rozpoczecia', 'data_zakonczenia'].forEach(field => {
                if (dane[field] === '') {
                    dane[field] = null;
                } else if (dane[field] && !/^\d{4}-\d{2}-\d{2}$/.test(dane[field])) {
                    const today = new Date();
                    const yyyy = today.getFullYear();
                    const mm = String(today.getMonth() + 1).padStart(2, '0');
                    const dd = String(today.getDate()).padStart(2, '0');
                    dane[field] = `${yyyy}-${mm}-${dd}`;
                }
            });
            // Poprawka: zamiana pustego stringa na null dla czas_pracy
            if (dane.czas_pracy === '' || dane.czas_pracy === undefined) {
                dane.czas_pracy = null;
            } else if (typeof dane.czas_pracy === 'string' && dane.czas_pracy.length > 32) {
                dane.czas_pracy = dane.czas_pracy.substring(0, 32);
            }
            // Poprawka: zamiana pustego stringa na null dla koszt_dodatkowy
            if (dane.koszt_dodatkowy === '' || dane.koszt_dodatkowy === undefined) {
                dane.koszt_dodatkowy = null;
            } else if (isNaN(parseFloat(dane.koszt_dodatkowy))) {
                dane.koszt_dodatkowy = 0;
            } else {
                dane.koszt_dodatkowy = parseFloat(dane.koszt_dodatkowy);
            }
            if (dane.zatwierdzona !== undefined && ![0, 1, '0', '1'].includes(dane.zatwierdzona)) {
                dane.zatwierdzona = 0;
            }
            return errors;
        }
}
export default extra_praca;