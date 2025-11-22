/* plik do ladowanie modulow JS 
* moduly beda zapisane w zmiennej const modules = {}
* nazwa modulu bedzie zawierac katalog i nazwe pliku bez rozszerzenia .js
* przykladowo modul do obslugi kart bedzie w pliku ./modules/card.js
* i bedzie dostepny jako modules['modules/card']
* kazdy modul to klasa z metodami init() i innymi
* init() bedzie wywolywana przy ladowaniu modulu
* funkcje z modulow beda dostepne jako metody klasy
* i beda dostempne przez zmienna modules i dostepne globalnie jako window.modules
*/

// Kontener na wszystkie moduly z predefiniowanymi sciezkami
const modules = {
    '../../views/render': null,
    '../../views/sideBar': null,
    '../../views/card':null,
    '../../views/projekt':null,
    '../../public/modules/projekty':null,
    '../../public/modules/zadania':null,
    '../../public/modules/extra_praca':null
};

// Mapa aliasów - tutaj definiujesz krótkie nazwy
const moduleShortcuts = {
    'Render': '../../views/render',
    'SideBar': '../../views/sideBar',
     'Card':'../../views/card',
     'widok_projekt':'../../views/projekt',
     'function_projekty':'../../public/modules/projekty',
     'zadania':'../../public/modules/zadania',
     'extra_praca':'../../public/modules/extra_praca'

    // 'Utils': '../../ls/helpers',
};

// Klasa bazowa dla wszystkich modulow
class BaseModule {
    constructor() {
        this.initialized = false;
    }

    init() {
        //console.log(`Inicjalizacja modulu: ${this.constructor.name}`);
        this.initialized = true;
    }

    isInitialized() {
        return this.initialized;
    }
}

// System ladowania modulow
class ModuleLoader {
    static async loadModule(modulePath) {
        try {
            // Usuwamy rozszerzenie .js jesli jest podane
            const cleanPath = modulePath.replace(/\.js$/, '');
            
            // Sprawdzamy czy modul juz nie jest zaladowany
            if (modules[cleanPath] && modules[cleanPath] !== null) {
                return modules[cleanPath];
            }
            
            // Dynamiczne importowanie modulu
            const moduleFile = await import(`${cleanPath}.js`);
            
            // Pobieramy klase z modulu (domyslny export lub nazwany)
            const ModuleClass = moduleFile.default || moduleFile[Object.keys(moduleFile)[0]];
            
            if (!ModuleClass) {
                throw new Error(`Nie znaleziono klasy w module: ${cleanPath}`);
            }

            // Tworzymy instancje modulu
            const moduleInstance = new ModuleClass();
            
            // Sprawdzamy czy modul ma metode init
            if (typeof moduleInstance.init === 'function') {
                await moduleInstance.init();
            }

            // Zapisujemy modul w kontenerze
            modules[cleanPath] = moduleInstance;
            
            // Wyświetlamy informację o utworzonej instancji
            console.log(`✅ Utworzono instancję modułu: ${cleanPath} -> ${moduleInstance.constructor.name}`);
            if (moduleInstance.name) {
               // console.log(`   Nazwa instancji: ${moduleInstance.name}`);
            }
            
            return moduleInstance;

        } catch (error) {
            console.error(`❌ Błąd ładowania modułu ${modulePath}:`, error);
            throw error;
        }
    }

    static async loadAllPredefinedModules() {
        // Pobieramy tylko oryginalne ścieżki modułów (nie aliasy)
        const predefinedPaths = Object.keys(modules).filter(path => 
            !Object.keys(moduleShortcuts).includes(path)
        );
        
        for (const path of predefinedPaths) {
            try {
                const moduleInstance = await this.loadModule(path);
                
                // Automatycznie utwórz globalne skróty
                this.createGlobalShortcuts(path, moduleInstance);
                
            } catch (error) {
                // Cichy błąd, obsłużony w podsumowaniu
            }
        }
        
        this.showLoadedModules();
    }

    static createGlobalShortcuts(fullPath, moduleInstance) {
        // Znajdź wszystkie aliasy dla tego modułu
        for (const [shortName, modulePath] of Object.entries(moduleShortcuts)) {
            if (modulePath === fullPath) {
                // NIE dodawaj do kontenera modules (żeby uniknąć duplikatów)
                // Dodaj tylko jako globalna zmienna
                window[shortName] = moduleInstance;
                console.log(`📝 Utworzono globalny skrót: window.${shortName}`);
            }
        }
    }

    static async loadModules(modulePaths) {
        const promises = modulePaths.map(path => this.loadModule(path));
        const results = await Promise.all(promises);
        
        this.showLoadedModules();
        
        return results;
    }

    static getModule(modulePath) {
        const cleanPath = modulePath.replace(/\.js$/, '');
        
        // Sprawdź w skrótach - ale szukaj w window, nie w modules
        if (moduleShortcuts[modulePath]) {
            const originalPath = moduleShortcuts[modulePath];
            return modules[originalPath];
        }
        
        // Sprawdź w pełnych ścieżkach
        return modules[cleanPath] || null;
    }

    static getAllModules() {
        return { ...modules };
    }

    static isModuleLoaded(modulePath) {
        const cleanPath = modulePath.replace(/\.js$/, '');
        
        // Sprawdź czy to alias
        if (moduleShortcuts[cleanPath]) {
            const originalPath = moduleShortcuts[cleanPath];
            return modules[originalPath] && modules[originalPath] !== null;
        }
        
        return modules[cleanPath] && modules[cleanPath] !== null;
    }

    static showLoadedModules() {
        // Pokazuj tylko oryginalne ścieżki modułów
        const originalPaths = Object.keys(modules).filter(path => 
            !Object.keys(moduleShortcuts).includes(path)
        );
        
        const loadedModules = originalPaths.filter(key => modules[key] !== null);
        const notLoadedModules = originalPaths.filter(key => modules[key] === null);
        
        console.log("=== PODSUMOWANIE MODUŁÓW ===");
        console.log(`Załadowane (${loadedModules.length}/${originalPaths.length}):`);
        
        if (loadedModules.length > 0) {
            loadedModules.forEach(path => {
                const instance = modules[path];
                const instanceName = instance.name || instance.constructor.name;
               // console.log(`  📦 ${path} -> ${instanceName}`);
                
                // Pokaż dostępne aliasy
                const aliases = Object.keys(moduleShortcuts).filter(alias => 
                    moduleShortcuts[alias] === path
                );
                if (aliases.length > 0) {
                    console.log(`     Aliasy: ${aliases.map(alias => `window.${alias}`).join(', ')}`);
                }
            });
        } else {
            console.log("  brak");
        }
        
        console.log(`Niezaładowane (${notLoadedModules.length}/${originalPaths.length}):`, notLoadedModules.length > 0 ? notLoadedModules : "brak");
        console.log("===========================");
        
        return { loaded: loadedModules, notLoaded: notLoadedModules };
    }

    static addModulePath(path) {
        const cleanPath = path.replace(/\.js$/, '');
        if (!modules.hasOwnProperty(cleanPath)) {
            modules[cleanPath] = null;
            console.log(`Dodano sciezke modulu: ${cleanPath}`);
        }
    }
}

// Ustawiamy globalna dostepnosc
window.modules = modules;
window.ModuleLoader = ModuleLoader;
window.BaseModule = BaseModule;

// Funkcje pomocnicze dostepne globalnie
window.loadModule = (path) => ModuleLoader.loadModule(path);
window.loadAllModules = () => ModuleLoader.loadAllPredefinedModules();
window.getModule = (path) => ModuleLoader.getModule(path);
window.showLoadedModules = () => ModuleLoader.showLoadedModules();

console.log("System ladowania modulow JS gotowy");
console.log("Predefiniowane moduly:", Object.keys(modules));

// Automatyczne ladowanie wszystkich predefiniowanych modulow
(async () => {
    await ModuleLoader.loadAllPredefinedModules();
})();

// Eksport dla uzytku w innych plikach
export { modules, ModuleLoader, BaseModule };