/* odpowiada za wyglad sidebar i jego funkcje
*/

class SideBar {
    constructor() {
    
        
        this.name = 'sideBar'; // dla systemu modułów
      
    }


    getMeniu1() {
        const sideBarMeniu = [
            {
            text: '📁 Projekty',
            onClick: () => { window.Render.sideBar(window.SideBar.getMeniu2());
            },
           // 'data-action': 'zaladujMeniu',
           // 'data-param': 'window.SideBar.getMeniu2()'
            }
          
        ];
        return sideBarMeniu;
    }


    getMeniu2() {
        const sideBarMeniu = [
            {
            text: '🔙 Powrót',
            onClick: () => { window.Render.sideBar(window.SideBar.getMeniu1());
            },
           // 'data-action': 'back-to-menu',
           // 'data-param': 'menu'
            },
            {
            text: '🏗️ W trakcie',
onClick: () => { window.function_projekty.w_trakcie();}
            },
            {
            text: '⏸️ Wstrzymany',
onClick: () => { window.function_projekty.wstrzymany();}
            },
            {
            text: '📅 Planowany',
          onClick: () => { window.function_projekty.planowany();}
            },
            {
            text: '📝 Do zatwierdzenia',
            onClick: () => { window.function_projekty.do_zatwierdzenia();}
            },
            {
            text: '✅ Zakończony',
onClick: () => { window.function_projekty.zakonczony();}
            },
            {
            text: '❓ Nie określono',
            onClick: () => { window.function_projekty.nie_okreslono();}
            },
        {
            text:'Nowy projekt ➕',
            onClick: () => { window.function_projekty.nowy_projekt();
            },
        }



        ];
        return sideBarMeniu;
    }

  getNavBarMeniu() {

   const navBarMeniu = [
        {
        text: '☰',
        onClick: () => { window.przelaczSideBar();
        },
      
        },
        {
        text: '🏠 Strona',
        onClick: () => { window.goHome();
        },
        
        },
        {
        text: '🌙',
        onClick: () => { window.zmienMotyw();
        },
           
        },
        {
        text: '🔒 Wyloguj',
        onClick: () => { window.location.href = '../public/logut.php';
        },
    }
      
    ];
    return navBarMeniu;


  }

    
}

// Eksport klasy
export default SideBar;