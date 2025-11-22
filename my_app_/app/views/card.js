/* odpowiada za wyglad i funkcjonalnosc kart */

class card {

 constructor(){
    this.name="card";
 }


karta1() {
   /* wyglad karty z pelnym html-em */
    const card = {
        id: `karta`,
        className: 'karta1',
        navbar: '<h3>🧠 Karta z HTML</h3>',
        content: `
            <h2>Zaawansowana karta</h2>
            <p>Ta karta została wygenerowana za pomocą funkcji createCard.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr style="border-bottom: 1px solid #374151;">
                <th style="text-align: left; padding: 8px;">Nazwa</th>
                <th style="text-align: left; padding: 8px;">Wartość</th>
              </tr>
              <tr style="border-bottom: 1px solid #374151;">
                <td style="padding: 8px;">Status</td>
                <td style="padding: 8px;">✅ Aktywna</td>
              </tr>
            </table>
        `,
        footer: 'Dynamiczna karta z pełnym HTML-em',
        ikony: [
            { text: '🧠', attributes: { 'data-action': 'zmienMotyw()', 'data-param': 'ge' } },
            { text: '📦', attributes: { 'data-ikona': 'box', 'data-type': 'storage' } },
            { text: '🪄', attributes: { 'data-ikona': 'magic', 'data-type': 'tool' } }
        ],
    
    };
  
 return card;
   
}

formularz() {
    const card = {
        id: `karta-formularz`,
        className: 'karta-formularz',
        navbar: '<h3>📝 Formularz</h3>',
        content: `
            <h2>Formularz kontaktowy</h2>
            <form id="formularzKontaktowy" style="display: flex; flex-direction: column; gap: 10px;">
                <label>
                    Imię:
                    <input type="text" name="imie" required>
                </label>
                <label>
                    Email:
                    <input type="email" name="email" required>
                </label>
                <label>
                    Wiadomość:
                    <textarea name="wiadomosc" rows="4" required></textarea>
                </label>
                <button type="submit">Wyślij</button>
            </form>
            
        `,
        footer: 'Dynamiczna karta z formularzem',
        ikony: [
            { text: '📝', attributes: { 'data-action': 'formularz', 'data-type': 'form' } },
            { text: '📧', attributes: { 'data-ikona': 'mail', 'data-type': 'contact' } }
        ],
        //atrybuty: {}
    };

    return card;
}


}

export default card ;