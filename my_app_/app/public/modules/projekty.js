//  plik odpowaiada za obsluge wszystkiego co zwiazane z projektami
class function_projekty {
   // Dynamiczna zmiana selecta lidera/kierownika po zmianie brygady
   onBrygadaChange(selectBrygady, form) {
      // Pobierz id wybranej brygady
      const idBrygady = selectBrygady.value;
      // Pobierz dane brygad i liderów z window (przekazane do widoku)
      const aktywneBrygady = window.aktywne_brygady || [];
      const liderzyBrygad = window.liderzy_brygad || [];
      // Znajdź wybraną brygadę
      const brygada = aktywneBrygady.find(b => b.id_brygady == idBrygady);
      let wybranyLider = '';
      if (brygada && brygada.lider_brygady) {
         wybranyLider = brygada.lider_brygady;
      }
      // Zbuduj select liderów/kierowników
      let options = '<option value="">Wybierz kierownika/lidera</option>';
      liderzyBrygad.forEach(lider => {
         const selected = wybranyLider == lider.id_pracownika ? 'selected' : '';
         options += `<option value="${lider.id_pracownika}" ${selected}>${lider.imie} ${lider.nazwisko} (${lider.stanowisko})</option>`;
      });
      // Podmień select
      const selectLider = form.querySelector('select[name="id_lidera"]');
      if (selectLider) {
         selectLider.innerHTML = options;
         // Ustaw hidden input
         const hiddenLider = form.querySelector('input[name="id_lidera"]');
         if (hiddenLider) hiddenLider.value = wybranyLider;
      }
   }

 constructor(){
    this.name="projekty_js";
 }

 async w_trakcie() {
      const dane = {
         funkcja: 'getProject',
         column:'stan_projektu',
         value:'W trakcie'
      };
      const result = await this.pobierz_dane(dane);
   this.wyswietl_projekty(result.data);
   
 }

 async wstrzymany() {
      const dane = {
         funkcja: 'getProject',
         column:'stan_projektu',
         value:'Wstrzymany'
      };
      const result = await this.pobierz_dane(dane);
   this.wyswietl_projekty(result.data);
   
 }

async planowany() {
      const dane = {
         funkcja: 'getProject',
         column:'stan_projektu',
         value:'Planowany'
      };
      const result = await this.pobierz_dane(dane);
   this.wyswietl_projekty(result.data);
   
 }

 async do_zatwierdzenia() {
      const dane = {
         funkcja: 'getProject',
         column:'stan_projektu',
         value:'Do zatwierdzenia'
      };
      const result = await this.pobierz_dane(dane);
   this.wyswietl_projekty(result.data);
   
 }

  async zakonczony() {
      const dane = {
         funkcja: 'getProject',
         column:'stan_projektu',
         value:'Zakończony'
      };
      const result = await this.pobierz_dane(dane);
   this.wyswietl_projekty(result.data);
   
 }

   async nie_okreslono() {
      const dane = {
         funkcja: 'getProject',
         column:'stan_projektu',
         value:'Nie określono'
      };
      const result = await this.pobierz_dane(dane);
   this.wyswietl_projekty(result.data);
      
 }

   async edytuj(id) {
   const user = await this.pobierzUprawnienia();
   const daneProjekt = {
      funkcja: 'get',
      tabela: 'projekty',
      filter: { id_projektu: id }
   };
   const projekt = await this.pobierz_dane(daneProjekt);
   const projektData = projekt.data ? projekt.data[0] : projekt;
   if (!user || (user.uprawnienia !== 'Administrator' && !(user.uprawnienia === 'Kierownik' && projektData.id_kierownika && user.id_pracownika == projektData.id_kierownika))) {
      alert('Brak uprawnień do edycji projektu!');
      return;
   }
   // ...dalej pobieranie brygady, brygad itd. (pozostała logika bez zmian)
     /* teraz pobierze do zmiennej aktualna_brygada z tabeli brygady po id_brygady z projekt 
     * nazwa_brygady opis_brygady i id_lidera
     */
     const brygada={
      funkcja:'get',
      tabela:'brygady',
      filter:{
         id_brygady: projekt.id_brygady 

      }
     };
     const aktualna_brgada= await this.pobierz_dane(brygada);

     /* nastepnie z tabeli brygady pobrac dane aktywne brygady*/
      const brygady ={
      funkcja:'get',
      tabela:'brygady',
      filter:{
         aktywna: 1
      }

     };
   const aktywne_brygady= await this.pobierz_dane(brygady);
   
   /* nstepnie nalezy pobrac z tabeli pracownicy dane liderow brygad czyli id_pracownika  id_brygady  imie i nazwisko filtrowanie na podstawie  jezeli zawiera w kolumnie stanowisko Kierownik badz Lider i czy jest aktywny 1/0  */
  const kierownik ={
  "funkcja": "getPracownicy",
  "column": "uprawnienia",
  "value": ["Administrator", "Kierownik"],
  "mode": "exact",
  "limit": 100,
  "offset": 0
  };
  
  const kierownicy_brygad= await this.pobierz_dane(kierownik);


 //  console.log("projekt", projekt.data);
  // console.log("aktualna brygada", aktualna_brgada.data);
 //  console.log("aktywne brygady", kierownicy_brygad);
  // console.log("kierownicy brygad", kierownicy_brygad.data);

   // Udostępnij aktywne brygady i liderów globalnie do obsługi dynamicznej zmiany selecta
   window.aktywne_brygady = aktywne_brygady.data;
   window.kierownicy_brygad = kierownicy_brygad.data;
   window.Render.card(
      window.widok_projekt.edytuj(
        projekt.data ? projekt.data[0] : projekt,
        aktualna_brgada.data ? aktualna_brgada.data[0] : aktualna_brgada,
        aktywne_brygady.data,
        kierownicy_brygad.data
      )
   );

 }

    async pobierzUprawnienia() {
         // Prosty endpoint PHP, np. api/sesja.php?akcja=uprawnienia
         try {
            const response = await fetch('../api/sesja.php?akcja=uprawnienia', { credentials: 'include' });
            if (!response.ok) return null;
            const data = await response.json();
            return data;
         } catch (e) {
            return null;
         }
    }

    async nowy_projekt() {
         const user = await this.pobierzUprawnienia();
         if (!user || user.uprawnienia !== 'Administrator') {
            alert('Brak uprawnień do dodawania projektu!');
            return;
         }
         // ...existing code...
         const brygady = {
            funkcja: 'get',
            tabela: 'brygady',
            filter: { aktywna: 1 }
         };
         const aktywne_brygady = await this.pobierz_dane(brygady);
         const kierownik = {
            "funkcja": "getPracownicy",
            "column": "uprawnienia",
            "value": ["Administrator", "Kierownik"],
            "mode": "exact",
            "limit": 100,
            "offset": 0
         };
         const kierownicy_brygad = await this.pobierz_dane(kierownik);
         window.aktywne_brygady = aktywne_brygady.data;
         window.kierownicy_brygad = kierownicy_brygad.data;
         window.Render.card(
            window.widok_projekt.nowy_projekt(
               aktywne_brygady.data,
               kierownicy_brygad.data
            )
         );
    }

    async aktalizuj(data) {
         const uprawnienia = await this.pobierzUprawnienia();
         if (!uprawnienia || (uprawnienia !== 'Administrator' && uprawnienia !== 'Kierownik')) {
            alert('Brak uprawnień do edycji projektu!');
            return;
         }
         // ...existing code...
         const filteredData = this.normalizeProjectData(data);
         if (!filteredData.id_projektu) {
             console.error('Brak id_projektu w danych do aktualizacji!');
             return;
         }
         const dane = {
             funkcja: 'update',
             tabela: 'projekty',
             dane: filteredData,
             filter: {
                  id_projektu: filteredData.id_projektu
             }
         };
         try {
             const projekt = await this.pobierz_dane(dane);
             alert('Zmiany zostały zapisane.');
             const stanProjektu = filteredData.stan_projektu;
             if (stanProjektu === 'Planowany') {
                await this.planowany();
             } else if (stanProjektu === 'W trakcie') {
                await this.w_trakcie();
             } else if (stanProjektu === 'Wstrzymany') {
                await this.wstrzymany();
             } else if (stanProjektu === 'Do zatwierdzenia') {
                await this.do_zatwierdzenia();
             } else if (stanProjektu === 'Zakończony') {
                await this.zakonczony();
             } else if (stanProjektu === 'Nie określono') {
                await this.nie_okreslono();
             }
         } catch (err) {
            alert('Wystąpił problem podczas zapisywania zmian.');
            this.wyswietl_projekt(filteredData.id_projektu);
         }
    }

    async dodaj(data) {
         const uprawnienia = await this.pobierzUprawnienia();
         if (!uprawnienia || (uprawnienia !== 'Administrator' && uprawnienia !== 'Kierownik')) {
            alert('Brak uprawnień do dodawania projektu!');
            return;
         }
         // ...existing code...
         const filteredData = this.normalizeProjectData(data);
         const dane = {
             funkcja: 'add',
             tabela: 'projekty',
             dane: filteredData
         };
         try {
             const projekt = await this.pobierz_dane(dane);
             alert('Nowy projekt został dodany.');
             const stanProjektu = filteredData.stan_projektu;
             if (stanProjektu === 'Planowany') {
                await this.planowany();
             } else if (stanProjektu === 'W trakcie') {
                await this.w_trakcie();
             } else if (stanProjektu === 'Wstrzymany') {
                await this.wstrzymany();
             } else if (stanProjektu === 'Do zatwierdzenia') {
                await this.do_zatwierdzenia();
             } else if (stanProjektu === 'Zakończony') {
                await this.zakonczony();
             } else if (stanProjektu === 'Nie określono') {
                await this.nie_okreslono();
             }
         } catch (err) {
            alert('Wystąpił problem podczas dodawania nowego projektu.');
         }
    }



   // Lista dozwolonych pól w tabeli projekty
   getProjektyFields() {
      return [
         'id_projektu',
         'nazwa_projektu',
         'adres_projektu',
         'planowane_rozpoczecie',
         'planowane_zakonczenie',
         'przypomnij_rozpoczecie',
         'przypomnij_zakonczenie',
         'data_rozpoczecia',
         'data_zakonczenia',
         'stan_projektu',
         'status_projektu',
         'id_brygady',
         'id_kierownika',
         'ukryj_projekt',
         'notatka'
      ];
   }

   // Zamienia puste stringi na null dla wybranych pól
   normalizeProjectData(data) {
      const fields = this.getProjektyFields();
      const intFields = ['id_projektu', 'id_brygady', 'id_kierownika', 'przypomnij_rozpoczecie', 'przypomnij_zakonczenie', 'ukryj_projekt'];
      const dateFields = ['planowane_rozpoczecie', 'planowane_zakonczenie', 'data_rozpoczecia', 'data_zakonczenia'];
      let result = {};
      fields.forEach(key => {
         if (data.hasOwnProperty(key)) {
            let value = data[key];
            if (dateFields.includes(key) && (value === '' || value === undefined)) {
               result[key] = null;
            } else if (intFields.includes(key)) {
               result[key] = (value === '' || value === undefined || value === null) ? null : Number(value);
            } else if (value === '' || value === undefined) {
               result[key] = null;
            } else {
               result[key] = value;
            }
         }
      });
      return result;
   }

   async aktalizuj(data) {
      // Filtruj i normalizuj dane przed wysłaniem do API
      const filteredData = this.normalizeProjectData(data);
      if (!filteredData.id_projektu) {
         console.error('Brak id_projektu w danych do aktualizacji!');
         return;
      }
      const dane = {
         funkcja: 'update',
         tabela: 'projekty',
         dane: filteredData,
         filter: {
            id_projektu: filteredData.id_projektu
         }
      };
      try {
         const projekt = await this.pobierz_dane(dane);
      //    console.log(projekt);
         
            alert('Zmiany zostały zapisane.');
          //this.wyswietl_projekt(filteredData.id_projektu);
            const stanProjektu = filteredData.stan_projektu;
          if (stanProjektu === 'Planowany') {
            await this.planowany();
          } else if (stanProjektu === 'W trakcie') {
            await this.w_trakcie();
          } else if (stanProjektu === 'Wstrzymany') {
            await this.wstrzymany();
          } else if (stanProjektu === 'Do zatwierdzenia') {
            await this.do_zatwierdzenia();
          } else if (stanProjektu === 'Zakończony') {
            await this.zakonczony();
          } else if (stanProjektu === 'Nie określono') {
            await this.nie_okreslono();
          }


      } catch (err) {
        alert('Wystąpił problem podczas zapisywania zmian.');
        this.wyswietl_projekt(filteredData.id_projektu);
      }
   }

   async dodaj(data) {
      // Filtruj i normalizuj dane przed wysłaniem do API
      const filteredData = this.normalizeProjectData(data);
      const dane = {
         funkcja: 'add',
         tabela: 'projekty',
         dane: filteredData
      };
      try {
         const projekt = await this.pobierz_dane(dane);
        //  console.log(projekt);
         
            alert('Nowy projekt został dodany.');
          // Po dodaniu nowego projektu, wywołaj odpowiednią funkcję w zależności od stanu projektu
         
          const stanProjektu = filteredData.stan_projektu;
          if (stanProjektu === 'Planowany') {
            await this.planowany();
          } else if (stanProjektu === 'W trakcie') {
            await this.w_trakcie();
          } else if (stanProjektu === 'Wstrzymany') {
            await this.wstrzymany();
          } else if (stanProjektu === 'Do zatwierdzenia') {
            await this.do_zatwierdzenia();
          } else if (stanProjektu === 'Zakończony') {
            await this.zakonczony();
          } else if (stanProjektu === 'Nie określono') {
            await this.nie_okreslono();
          } 
      } catch (err) {
        alert('Wystąpił problem podczas dodawania nowego projektu.');
       // this.nowy_projekt();
      }
   }  


 async wyswietl_projekt(id){
   /* pobieranie danych projektu */
   const dane={ 
       funkcja:'getProject',
       column:'id_projektu',
       value:id
   };
      const projekt = await this.pobierz_dane(dane);

   window.Render.card(window.widok_projekt.projekt(projekt.data[0]));
}

async wyswietl_projekty(data){
   window.Render.deleteContent();
   if (Array.isArray(data)) {
      data.forEach(item => {
         console.log("item", item);
         window.Render.card(window.widok_projekt.projekt(item));
      });
   }
   

 }




/* pobieranie danych z bazy danych */
   async pobierz_dane(dane) {
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




  
}





export default function_projekty ;