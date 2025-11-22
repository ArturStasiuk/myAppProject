

CREATE TABLE `extra_praca` (
  `id_extra_praca` int(11) NOT NULL COMMENT 'Klucz główny dodatkowej pracy',
  `id_projektu` int(11) DEFAULT NULL COMMENT 'Klucz obcy do tabeli projekty',
  `opis_pracy` text DEFAULT 'Dodatkowa praca' COMMENT 'Opis dodatkowej pracy',
  `notatka` text DEFAULT NULL COMMENT 'Dodatkowa notatka do pracy',
  `data_rozpoczecia` date DEFAULT NULL COMMENT 'Data rozpoczęcia dodatkowej pracy',
  `data_zakonczenia` date DEFAULT NULL COMMENT 'Data zakończenia dodatkowej pracy',
  `przypomnij_rozpoczecie` tinyint(1) DEFAULT 0 COMMENT 'Przypomnienie o rozpoczęciu dodatkowej pracy',
  `czas_pracy` decimal(5,2) DEFAULT 0.00 COMMENT 'Czas trwania dodatkowej pracy w godzinach (np. 8.50)',
  `koszt_dodatkowy` decimal(10,2) DEFAULT 0.00 COMMENT 'Dodatkowy koszt pracy',
  `zatwierdzona` tinyint(1) DEFAULT 0 COMMENT 'Czy praca została zatwierdzona',
  `id_pracownika` int(11) DEFAULT NULL COMMENT 'ID pracownika wykonującego dodatkową pracę',
  `id_zatwierdzajacego` int(11) DEFAULT NULL COMMENT 'ID pracownika zatwierdzającego wykonanie dodatkowej pracy',
  `data_utworzenia` timestamp NULL DEFAULT current_timestamp() COMMENT 'Data utworzenia rekordu',
  `data_modyfikacji` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Data ostatniej modyfikacji'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela dodatkowych prac projektów';

-- 


  -- Widok: dodatkowa praca (extra_praca) z nazwą projektu, wykonawcą i zatwierdzającym
DROP VIEW IF EXISTS `view_extra_praca_full`;
CREATE VIEW `view_extra_praca_full` AS
SELECT
  e.`id_extra_praca`,
  e.`id_projektu`,
  p.`nazwa_projektu`,
  e.`opis_pracy`,
  e.`notatka`,
  e.`data_rozpoczecia`,
  e.`data_zakonczenia`,
  e.`przypomnij_rozpoczecie`,
  e.`czas_pracy`,
  e.`koszt_dodatkowy`,
  e.`zatwierdzona`,
  e.`id_pracownika`,
  CONCAT_WS(' ', pw.`imie`, pw.`nazwisko`) AS `wykonawca`,
  e.`id_zatwierdzajacego`,
  CONCAT_WS(' ', zatw.`imie`, zatw.`nazwisko`) AS `zatwierdzajacy`,
  e.`data_utworzenia`,
  e.`data_modyfikacji`
FROM `extra_praca` e
LEFT JOIN `projekty` p ON e.`id_projektu` = p.`id_projektu`
LEFT JOIN `pracownicy` pw ON e.`id_pracownika` = pw.`id_pracownika`
LEFT JOIN `pracownicy` zatw ON e.`id_zatwierdzajacego` = zatw.`id_pracownika`;


CREATE TABLE `pracownicy` (
  `id_pracownika` int(11) NOT NULL COMMENT 'Klucz główny pracownika',
  `imie` varchar(100) DEFAULT 'Nieznane' COMMENT 'Imię pracownika',
  `nazwisko` varchar(100) DEFAULT 'Nieznane' COMMENT 'Nazwisko pracownika',
  `email` varchar(255) DEFAULT NULL COMMENT 'Adres email pracownika',
  `telefon` varchar(20) DEFAULT NULL COMMENT 'Numer telefonu',
  `stanowisko` varchar(100) DEFAULT 'Pracownik' COMMENT 'Stanowisko pracownika',
  `id_brygady` int(11) DEFAULT NULL COMMENT 'ID brygady do której należy pracownik',
  `data_zatrudnienia` date DEFAULT NULL COMMENT 'Data zatrudnienia',
  `aktywny` tinyint(1) DEFAULT 1 COMMENT 'Czy pracownik jest aktywny',
  `uprawnienia` enum('Administrator','Kierownik','Pracownik','Obserwator') DEFAULT 'Pracownik' COMMENT 'Poziom uprawnień',
  `haslo` varchar(255) DEFAULT NULL COMMENT 'haslo logowania',
  `ostatnie_logowanie` timestamp NULL DEFAULT NULL COMMENT 'Data ostatniego logowania',
  `data_utworzenia` timestamp NULL DEFAULT current_timestamp() COMMENT 'Data utworzenia rekordu',
  `data_modyfikacji` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Data ostatniej modyfikacji'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela pracowników';

CREATE TABLE `brygady` (
  `id_brygady` int(11) NOT NULL COMMENT 'Klucz główny brygady',
  `nazwa_brygady` varchar(255) DEFAULT 'Nowa brygada' COMMENT 'Nazwa brygady',
  `opis_brygady` text DEFAULT NULL COMMENT 'Opis brygady i jej specjalizacji',
  `lider_brygady` int(11) DEFAULT NULL COMMENT 'ID lidera brygady (klucz obcy do pracownicy)',
  `aktywna` tinyint(1) DEFAULT 1 COMMENT 'Czy brygada jest aktywna',
  `data_utworzenia` timestamp NULL DEFAULT current_timestamp() COMMENT 'Data utworzenia rekordu',
  `data_modyfikacji` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Data ostatniej modyfikacji'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela brygad roboczych';