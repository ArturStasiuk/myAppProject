--
-- Zastąpiona struktura widoku `view_brygady_summary`
-- (See below for the actual view)
--
CREATE TABLE `view_brygady_summary` (
`id_brygady` int(11)
,`nazwa_brygady` varchar(255)
,`opis_brygady` text
,`lider_brygady` int(11)
,`lider_imie_nazwisko` varchar(201)
,`aktywna` tinyint(1)
,`data_utworzenia` timestamp
,`data_modyfikacji` timestamp
,`liczba_pracownikow` bigint(21)
,`liczba_projektow` bigint(21)
);

-- --------------------------------------------------------

--
-- Zastąpiona struktura widoku `view_dziennik_pracy_full`
-- (See below for the actual view)
--
CREATE TABLE `view_dziennik_pracy_full` (
`id_dziennik` int(11)
,`id_projektu` int(11)
,`nazwa_projektu` varchar(255)
,`id_pracownika` int(11)
,`pracownik` varchar(201)
,`data_pracy` date
,`czas_rozpoczecia` time
,`czas_zakonczenia` time
,`czas_pracy` decimal(5,2)
,`opis_pracy` text
,`notatka` text
,`zatwierdzone` tinyint(1)
,`id_zatwierdzajacego` int(11)
,`zatwierdzajacy` varchar(201)
,`data_zatwierdzenia` timestamp
,`data_utworzenia` timestamp
,`data_modyfikacji` timestamp
);

-- --------------------------------------------------------

--
-- Zastąpiona struktura widoku `view_extra_praca_full`
-- (See below for the actual view)
--
CREATE TABLE `view_extra_praca_full` (
`id_extra_praca` int(11)
,`id_projektu` int(11)
,`nazwa_projektu` varchar(255)
,`opis_pracy` text
,`notatka` text
,`data_rozpoczecia` date
,`data_zakonczenia` date
,`przypomnij_rozpoczecie` tinyint(1)
,`czas_pracy` decimal(5,2)
,`koszt_dodatkowy` decimal(10,2)
,`zatwierdzona` tinyint(1)
,`id_pracownika` int(11)
,`wykonawca` varchar(201)
,`id_zatwierdzajacego` int(11)
,`zatwierdzajacy` varchar(201)
,`data_utworzenia` timestamp
,`data_modyfikacji` timestamp
);

-- --------------------------------------------------------

--
-- Zastąpiona struktura widoku `view_notatki_projektu_full`
-- (See below for the actual view)
--
CREATE TABLE `view_notatki_projektu_full` (
`id_notatki` int(11)
,`id_projektu` int(11)
,`nazwa_projektu` varchar(255)
,`tytul_notatki` varchar(255)
,`tresc_notatki` text
,`typ_notatki` enum('Ogólna','Techniczna','Finansowa','Komunikacja','Problem','Rozwiązanie')
,`priorytet` enum('Niski','Normalny','Wysoki','Krytyczny')
,`publiczna` tinyint(1)
,`id_autora` int(11)
,`autor` varchar(201)
,`id_adresata` int(11)
,`adresat` varchar(201)
,`data_utworzenia` timestamp
,`data_modyfikacji` timestamp
);

-- --------------------------------------------------------

--
-- Zastąpiona struktura widoku `view_pracownicy_full`
-- (See below for the actual view)
--
CREATE TABLE `view_pracownicy_full` (
`id_pracownika` int(11)
,`imie` varchar(100)
,`nazwisko` varchar(100)
,`email` varchar(255)
,`telefon` varchar(20)
,`stanowisko` varchar(100)
,`id_brygady` int(11)
,`nazwa_brygady` varchar(255)
,`data_zatrudnienia` date
,`aktywny` tinyint(1)
,`uprawnienia` enum('Administrator','Kierownik','Pracownik','Obserwator')
,`ostatnie_logowanie` timestamp
,`data_utworzenia` timestamp
,`data_modyfikacji` timestamp
,`liczba_zadan` bigint(21)
,`liczba_extra_praca` bigint(21)
,`liczba_wpisow_dziennika` bigint(21)
);

-- --------------------------------------------------------

--
-- Zastąpiona struktura widoku `view_project_summary`
-- (See below for the actual view)
--
CREATE TABLE `view_project_summary` (
`id_projektu` int(11)
,`nazwa_projektu` varchar(255)
,`adres_projektu` text
,`planowane_rozpoczecie` date
,`planowane_zakonczenie` date
,`przypomnij_rozpoczecie` tinyint(1)
,`przypomnij_zakonczenie` tinyint(1)
,`data_rozpoczecia` date
,`data_zakonczenia` date
,`notatka` text
,`stan_projektu` enum('W trakcie','Wstrzymany','Planowany','Do zatwierdzenia','Zakończony','Nie określono')
,`status_projektu` enum('Normalny','Pilny','Krytyczny')
,`zadania_wykonane` bigint(21)
,`zadania_niewykonane` bigint(21)
,`zadania_razem` bigint(21)
,`extra_praca_count` bigint(21)
,`extra_praca_zatwierdzone` bigint(21)
,`extra_praca_niezatwierdzone` bigint(21)
,`przypomnienia_aktywne` bigint(21)
,`przypomnienia_wyslane` bigint(21)
,`przypomnienia_odczytane` bigint(21)
,`przypomnienia_anulowane` bigint(21)
);

-- --------------------------------------------------------

--
-- Zastąpiona struktura widoku `view_projekty_full`
-- (See below for the actual view)
--
CREATE TABLE `view_projekty_full` (
`id_projektu` int(11)
,`nazwa_projektu` varchar(255)
,`adres_projektu` text
,`planowane_rozpoczecie` date
,`planowane_zakonczenie` date
,`przypomnij_rozpoczecie` tinyint(1)
,`przypomnij_zakonczenie` tinyint(1)
,`data_rozpoczecia` date
,`data_zakonczenia` date
,`stan_projektu` enum('W trakcie','Wstrzymany','Planowany','Do zatwierdzenia','Zakończony','Nie określono')
,`status_projektu` enum('Normalny','Pilny','Krytyczny')
,`id_brygady` int(11)
,`nazwa_brygady` varchar(255)
,`id_kierownika` int(11)
,`kierownik` varchar(201)
,`ukryj_projekt` tinyint(1)
,`notatka` text
,`data_utworzenia` timestamp
,`data_modyfikacji` timestamp
,`liczba_zadan` bigint(21)
,`liczba_zadan_wykonanych` decimal(22,0)
,`liczba_extra_praca` bigint(21)
);

-- --------------------------------------------------------

--
-- Zastąpiona struktura widoku `view_przypomnienia_full`
-- (See below for the actual view)
--
CREATE TABLE `view_przypomnienia_full` (
`id_przypomnienia` int(11)
,`tytul` varchar(255)
,`opis` text
,`data_przypomnienia` datetime
,`typ_przypomnienia` enum('Projekt','Zadanie','Extra_praca','Ogólne','Spotkanie')
,`id_powiazanego_obiektu` int(11)
,`id_pracownika` int(11)
,`odbiorca` varchar(201)
,`id_utworzyl` int(11)
,`utworzyl` varchar(201)
,`status` enum('Aktywne','Wyslane','Odczytane','Anulowane')
,`powtarzaj` enum('Jednorazowe','Codziennie','Co_tydzien','Co_miesiac')
,`data_wyslania` timestamp
,`data_odczytania` timestamp
,`priorytet` enum('Niski','Normalny','Wysoki','Krytyczny')
,`data_utworzenia` timestamp
,`data_modyfikacji` timestamp
);

-- --------------------------------------------------------

--
-- Zastąpiona struktura widoku `view_zadania_full`
-- (See below for the actual view)
--
CREATE TABLE `view_zadania_full` (
`id_zadania` int(11)
,`id_projektu` int(11)
,`nazwa_projektu` varchar(255)
,`tytul_zadania` varchar(255)
,`opis_zadania` text
,`notatka` text
,`data_rozpoczecia` date
,`data_zakonczenia` date
,`planowana_data_zakonczenia` date
,`status_zadania` tinyint(1)
,`priorytet` enum('Niski','Normalny','Wysoki','Krytyczny')
,`przypomnij_rozpoczecie` tinyint(1)
,`id_pracownika` int(11)
,`pracownik` varchar(201)
,`procent_wykonania` int(11)
,`data_utworzenia` timestamp
,`data_modyfikacji` timestamp
);

-- --------------------------------------------------------