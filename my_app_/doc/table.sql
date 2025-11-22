-- phpMyAdmin SQL Dump
-- version 5.2.1deb1+deb12u1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Lis 15, 2025 at 08:06 PM
-- Wersja serwera: 10.11.14-MariaDB-0+deb12u2
-- Wersja PHP: 8.2.29
-- 
-- POPRAWIONA WERSJA Z WARTOŚCIAMI DOMYŚLNYMI I NULL

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mayappproject`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `brygady`
--

CREATE TABLE `brygady` (
  `id_brygady` int(11) NOT NULL COMMENT 'Klucz główny brygady',
  `nazwa_brygady` varchar(255) DEFAULT 'Nowa brygada' COMMENT 'Nazwa brygady',
  `opis_brygady` text DEFAULT NULL COMMENT 'Opis brygady i jej specjalizacji',
  `lider_brygady` int(11) DEFAULT NULL COMMENT 'ID lidera brygady (klucz obcy do pracownicy)',
  `aktywna` tinyint(1) DEFAULT 1 COMMENT 'Czy brygada jest aktywna',
  `data_utworzenia` timestamp NULL DEFAULT current_timestamp() COMMENT 'Data utworzenia rekordu',
  `data_modyfikacji` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Data ostatniej modyfikacji'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela brygad roboczych';

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `dziennik_pracy`
--

CREATE TABLE `dziennik_pracy` (
  `id_dziennik` int(11) NOT NULL COMMENT 'Klucz główny dziennika pracy',
  `id_projektu` int(11) DEFAULT NULL COMMENT 'ID projektu',
  `id_pracownika` int(11) DEFAULT NULL COMMENT 'ID pracownika',
  `data_pracy` date DEFAULT (CURRENT_DATE) COMMENT 'Data pracy',
  `czas_rozpoczecia` time DEFAULT NULL COMMENT 'Czas rozpoczęcia pracy',
  `czas_zakonczenia` time DEFAULT NULL COMMENT 'Czas zakończenia pracy',
  `czas_pracy` decimal(5,2) DEFAULT 0.00 COMMENT 'Czas pracy w godzinach (np. 8.50)',
  `opis_pracy` text DEFAULT NULL COMMENT 'Opis wykonywanej pracy',
  `notatka` text DEFAULT NULL COMMENT 'Dodatkowa notatka',
  `zatwierdzone` tinyint(1) DEFAULT 0 COMMENT 'Czy wpis został zatwierdzony',
  `id_zatwierdzajacego` int(11) DEFAULT NULL COMMENT 'ID osoby zatwierdzającej wpis',
  `data_zatwierdzenia` timestamp NULL DEFAULT NULL COMMENT 'Data zatwierdzenia wpisu',
  `data_utworzenia` timestamp NULL DEFAULT current_timestamp() COMMENT 'Data utworzenia rekordu',
  `data_modyfikacji` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Data ostatniej modyfikacji'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Dziennik pracy pracowników przy projektach';

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `extra_praca`
--

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

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `notatki_projektu`
--

CREATE TABLE `notatki_projektu` (
  `id_notatki` int(11) NOT NULL COMMENT 'Klucz główny notatki',
  `id_projektu` int(11) DEFAULT NULL COMMENT 'ID projektu którego dotyczy notatka',
  `tytul_notatki` varchar(255) DEFAULT 'Nowa notatka' COMMENT 'Tytuł notatki',
  `tresc_notatki` text DEFAULT '' COMMENT 'Treść notatki',
  `typ_notatki` enum('Ogólna','Techniczna','Finansowa','Komunikacja','Problem','Rozwiązanie') DEFAULT 'Ogólna' COMMENT 'Typ notatki',
  `priorytet` enum('Niski','Normalny','Wysoki','Krytyczny') DEFAULT 'Normalny' COMMENT 'Priorytet notatki',
  `publiczna` tinyint(1) DEFAULT 1 COMMENT 'Czy notatka jest widoczna dla wszystkich członków projektu',
  `id_autora` int(11) DEFAULT NULL COMMENT 'ID autora notatki',
  `id_adresata` int(11) DEFAULT NULL COMMENT 'ID osoby do której jest skierowana notatka (opcjonalnie)',
  `data_utworzenia` timestamp NULL DEFAULT current_timestamp() COMMENT 'Data utworzenia notatki',
  `data_modyfikacji` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Data ostatniej modyfikacji'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Notatki dotyczące projektów';

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `pracownicy`
--

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

--
-- Dumping data for table `pracownicy`
--

INSERT INTO `pracownicy` (`id_pracownika`, `imie`, `nazwisko`, `email`, `telefon`, `stanowisko`, `id_brygady`, `data_zatrudnienia`, `aktywny`, `uprawnienia`, `haslo`, `ostatnie_logowanie`, `data_utworzenia`, `data_modyfikacji`) VALUES
(1, 'artur', 'stasiuk', 'artur@stasiuk', NULL, NULL, NULL, NULL, 1, 'Administrator', '1976', '2025-11-08 19:00:58', '2025-11-06 22:08:34', '2025-11-08 20:00:58');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `projekty`
--

CREATE TABLE `projekty` (
  `id_projektu` int(11) NOT NULL COMMENT 'Klucz główny używany jako odwołanie w innych tabelach - CASCADE DELETE',
  `nazwa_projektu` varchar(255) DEFAULT 'Nowy projekt' COMMENT 'Krótka nazwa lub numer projektu',
  `adres_projektu` text DEFAULT NULL COMMENT 'Adres realizacji projektu',
  `planowane_rozpoczecie` date DEFAULT NULL COMMENT 'Data planowanego rozpoczęcia projektu',
  `planowane_zakonczenie` date DEFAULT NULL COMMENT 'Data planowanego zakończenia projektu',
  `przypomnij_rozpoczecie` tinyint(1) DEFAULT 0 COMMENT 'Przypomnienie o planowanym rozpoczęciu',
  `przypomnij_zakonczenie` tinyint(1) DEFAULT 0 COMMENT 'Przypomnienie o planowanym zakończeniu',
  `data_rozpoczecia` date DEFAULT NULL COMMENT 'Data faktycznego rozpoczęcia projektu',
  `data_zakonczenia` date DEFAULT NULL COMMENT 'Data faktycznego zakończenia projektu',
  `stan_projektu` enum('W trakcie','Wstrzymany','Planowany','Do zatwierdzenia','Zakończony','Nie określono') DEFAULT 'Planowany' COMMENT 'Stan realizacji projektu',
  `status_projektu` enum('Normalny','Pilny','Krytyczny') DEFAULT 'Normalny' COMMENT 'Priorytet projektu',
  `id_brygady` int(11) DEFAULT NULL COMMENT 'Numer brygady przydzielonej do projektu',
  `id_kierownika` int(11) DEFAULT NULL COMMENT 'ID kierownika projektu',
  `ukryj_projekt` tinyint(1) DEFAULT 0 COMMENT 'Flaga ukrycia projektu',
  `notatka` text DEFAULT NULL COMMENT 'Dodatkowe informacje o projekcie',
  `data_utworzenia` timestamp NULL DEFAULT current_timestamp() COMMENT 'Data utworzenia rekordu',
  `data_modyfikacji` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Data ostatniej modyfikacji'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Główna tabela projektów - CASCADE DELETE na wszystkie powiązane tabele';

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `przypomnienia`
--

CREATE TABLE `przypomnienia` (
  `id_przypomnienia` int(11) NOT NULL COMMENT 'Klucz główny przypomnienia',
  `tytul` varchar(255) DEFAULT 'Nowe przypomnienie' COMMENT 'Tytuł przypomnienia',
  `opis` text DEFAULT NULL COMMENT 'Opis przypomnienia',
  `data_przypomnienia` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Data i czas przypomnienia',
  `typ_przypomnienia` enum('Projekt','Zadanie','Extra_praca','Ogólne','Spotkanie') DEFAULT 'Ogólne' COMMENT 'Typ przypomnienia',
  `id_powiazanego_obiektu` int(11) DEFAULT NULL COMMENT 'ID powiązanego obiektu (projektu, zadania itp.)',
  `id_pracownika` int(11) DEFAULT NULL COMMENT 'ID pracownika który ma otrzymać przypomnienie',
  `id_utworzyl` int(11) DEFAULT NULL COMMENT 'ID pracownika który utworzył przypomnienie',
  `status` enum('Aktywne','Wyslane','Odczytane','Anulowane') DEFAULT 'Aktywne' COMMENT 'Status przypomnienia',
  `powtarzaj` enum('Jednorazowe','Codziennie','Co_tydzien','Co_miesiac') DEFAULT 'Jednorazowe' COMMENT 'Częstotliwość powtarzania',
  `data_wyslania` timestamp NULL DEFAULT NULL COMMENT 'Data wysłania przypomnienia',
  `data_odczytania` timestamp NULL DEFAULT NULL COMMENT 'Data odczytania przypomnienia',
  `priorytet` enum('Niski','Normalny','Wysoki','Krytyczny') DEFAULT 'Normalny' COMMENT 'Priorytet przypomnienia',
  `data_utworzenia` timestamp NULL DEFAULT current_timestamp() COMMENT 'Data utworzenia przypomnienia',
  `data_modyfikacji` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Data ostatniej modyfikacji'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System przypomnień dla użytkowników';

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `zadania`
--

CREATE TABLE `zadania` (
  `id_zadania` int(11) NOT NULL COMMENT 'Klucz główny zadania',
  `id_projektu` int(11) DEFAULT NULL COMMENT 'Klucz obcy do tabeli projekty',
  `tytul_zadania` varchar(255) DEFAULT 'Nowe zadanie' COMMENT 'Krótki tytuł zadania',
  `opis_zadania` text DEFAULT NULL COMMENT 'Szczegółowy opis zadania',
  `notatka` text DEFAULT NULL COMMENT 'Dodatkowa notatka do zadania',
  `data_rozpoczecia` date DEFAULT NULL COMMENT 'Data rozpoczęcia zadania - jeśli NULL to aktualna data w aplikacji',
  `data_zakonczenia` date DEFAULT NULL COMMENT 'Data zakończenia zadania - jeśli NULL to aktualna data w aplikacji',
  `planowana_data_zakonczenia` date DEFAULT NULL COMMENT 'Planowana data zakończenia zadania',
  `status_zadania` tinyint(1) DEFAULT 0 COMMENT 'Status wykonania zadania (false - niewykonane, true - wykonane)',
  `priorytet` enum('Niski','Normalny','Wysoki','Krytyczny') DEFAULT 'Normalny' COMMENT 'Priorytet zadania',
  `przypomnij_rozpoczecie` tinyint(1) DEFAULT 1 COMMENT 'Przypomnienie o rozpoczęciu zadania',
  `id_pracownika` int(11) DEFAULT NULL COMMENT 'ID pracownika przypisanego do zadania',
  `procent_wykonania` int(11) DEFAULT 0 COMMENT 'Procent wykonania zadania (0-100)',
  `data_utworzenia` timestamp NULL DEFAULT current_timestamp() COMMENT 'Data utworzenia rekordu',
  `data_modyfikacji` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Data ostatniej modyfikacji'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela zadań projektowych';

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `zdjecia`
--

CREATE TABLE `zdjecia` (
  `id_zdjecia` int(11) NOT NULL COMMENT 'Klucz główny zdjęcia',
  `id_projektu` int(11) DEFAULT NULL COMMENT 'ID projektu którego dotyczy zdjęcie',
  `id_zadania` int(11) DEFAULT NULL COMMENT 'ID zadania którego dotyczy zdjęcie (opcjonalnie)',
  `id_extra_praca` int(11) DEFAULT NULL COMMENT 'ID dodatkowej pracy której dotyczy zdjęcie (opcjonalnie)',
  `nazwa_pliku` varchar(255) DEFAULT 'bez_nazwy.jpg' COMMENT 'Nazwa pliku zdjęcia',
  `sciezka_pliku` varchar(500) DEFAULT '' COMMENT 'Pełna ścieżka do pliku zdjęcia na serwerze',
  `sciezka_katalogu` varchar(400) DEFAULT '' COMMENT 'Ścieżka do katalogu przechowującego zdjęcie',
  `rozmiar_pliku` int(11) DEFAULT NULL COMMENT 'Rozmiar pliku w bajtach',
  `typ_pliku` varchar(50) DEFAULT 'image/jpeg' COMMENT 'Typ MIME pliku (image/jpeg, image/png, itp.)',
  `rozszerzenie` varchar(10) DEFAULT '.jpg' COMMENT 'Rozszerzenie pliku (.jpg, .png, .gif, itp.)',
  `szerokosc` int(11) DEFAULT NULL COMMENT 'Szerokość zdjęcia w pikselach',
  `wysokosc` int(11) DEFAULT NULL COMMENT 'Wysokość zdjęcia w pikselach',
  `opis_zdjecia` text DEFAULT NULL COMMENT 'Opis/komentarz do zdjęcia',
  `kategoria_zdjecia` enum('Przed_realizacja','W_trakcie','Po_zakonczeniu','Problem','Rozwiązanie','Inne') DEFAULT 'Inne' COMMENT 'Kategoria zdjęcia',
  `data_zdjecia` datetime DEFAULT NULL COMMENT 'Data i czas wykonania zdjęcia (EXIF lub ręcznie wprowadzona)',
  `geolokalizacja_lat` decimal(10,8) DEFAULT NULL COMMENT 'Szerokość geograficzna miejsca wykonania zdjęcia',
  `geolokalizacja_lng` decimal(11,8) DEFAULT NULL COMMENT 'Długość geograficzna miejsca wykonania zdjęcia',
  `publiczne` tinyint(1) DEFAULT 1 COMMENT 'Czy zdjęcie jest widoczne dla wszystkich członków projektu',
  `id_autora` int(11) DEFAULT NULL COMMENT 'ID pracownika który dodał zdjęcie',
  `miniaturka_sciezka` varchar(500) DEFAULT NULL COMMENT 'Ścieżka do miniaturki zdjęcia',
  `aktywne` tinyint(1) DEFAULT 1 COMMENT 'Czy zdjęcie jest aktywne (nie usunięte)',
  `data_utworzenia` timestamp NULL DEFAULT current_timestamp() COMMENT 'Data dodania zdjęcia do systemu',
  `data_modyfikacji` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Data ostatniej modyfikacji'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela przechowująca informacje o zdjęciach projektów';

-- --------------------------------------------------------

--
-- Indeksy dla tabel
--

ALTER TABLE `brygady`
  ADD PRIMARY KEY (`id_brygady`),
  ADD KEY `idx_brygady_aktywna` (`aktywna`),
  ADD KEY `idx_brygady_lider` (`lider_brygady`);

ALTER TABLE `dziennik_pracy`
  ADD PRIMARY KEY (`id_dziennik`),
  ADD KEY `fk_dziennik_pracy_id_zatwierdzajacego` (`id_zatwierdzajacego`),
  ADD KEY `idx_dziennik_id_projektu` (`id_projektu`),
  ADD KEY `idx_dziennik_id_pracownika` (`id_pracownika`),
  ADD KEY `idx_dziennik_data_pracy` (`data_pracy`),
  ADD KEY `idx_dziennik_zatwierdzone` (`zatwierdzone`);

ALTER TABLE `extra_praca`
  ADD PRIMARY KEY (`id_extra_praca`),
  ADD KEY `fk_extra_praca_id_zatwierdzajacego` (`id_zatwierdzajacego`),
  ADD KEY `idx_extra_praca_id_projektu` (`id_projektu`),
  ADD KEY `idx_extra_praca_id_pracownika` (`id_pracownika`),
  ADD KEY `idx_extra_praca_data_rozpoczecia` (`data_rozpoczecia`),
  ADD KEY `idx_extra_praca_zatwierdzona` (`zatwierdzona`);

ALTER TABLE `notatki_projektu`
  ADD PRIMARY KEY (`id_notatki`),
  ADD KEY `fk_notatki_id_adresata` (`id_adresata`),
  ADD KEY `idx_notatki_id_projektu` (`id_projektu`),
  ADD KEY `idx_notatki_id_autora` (`id_autora`),
  ADD KEY `idx_notatki_typ` (`typ_notatki`),
  ADD KEY `idx_notatki_priorytet` (`priorytet`),
  ADD KEY `idx_notatki_publiczna` (`publiczna`);

ALTER TABLE `pracownicy`
  ADD PRIMARY KEY (`id_pracownika`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_pracownicy_email` (`email`),
  ADD KEY `idx_pracownicy_id_brygady` (`id_brygady`),
  ADD KEY `idx_pracownicy_aktywny` (`aktywny`),
  ADD KEY `idx_pracownicy_uprawnienia` (`uprawnienia`);

ALTER TABLE `projekty`
  ADD PRIMARY KEY (`id_projektu`),
  ADD KEY `idx_projekty_stan` (`stan_projektu`),
  ADD KEY `idx_projekty_status` (`status_projektu`),
  ADD KEY `idx_projekty_id_brygady` (`id_brygady`),
  ADD KEY `idx_projekty_id_kierownika` (`id_kierownika`),
  ADD KEY `idx_projekty_planowane_rozpoczecie` (`planowane_rozpoczecie`),
  ADD KEY `idx_projekty_planowane_zakonczenie` (`planowane_zakonczenie`),
  ADD KEY `idx_projekty_ukryj` (`ukryj_projekt`);

ALTER TABLE `przypomnienia`
  ADD PRIMARY KEY (`id_przypomnienia`),
  ADD KEY `fk_przypomnienia_id_utworzyl` (`id_utworzyl`),
  ADD KEY `idx_przypomnienia_data` (`data_przypomnienia`),
  ADD KEY `idx_przypomnienia_id_pracownika` (`id_pracownika`),
  ADD KEY `idx_przypomnienia_typ` (`typ_przypomnienia`),
  ADD KEY `idx_przypomnienia_status` (`status`),
  ADD KEY `idx_przypomnienia_priorytet` (`priorytet`);

ALTER TABLE `zadania`
  ADD PRIMARY KEY (`id_zadania`),
  ADD KEY `idx_zadania_id_projektu` (`id_projektu`),
  ADD KEY `idx_zadania_id_pracownika` (`id_pracownika`),
  ADD KEY `idx_zadania_status` (`status_zadania`),
  ADD KEY `idx_zadania_data_rozpoczecia` (`data_rozpoczecia`),
  ADD KEY `idx_zadania_planowana_data` (`planowana_data_zakonczenia`),
  ADD KEY `idx_zadania_priorytet` (`priorytet`);

ALTER TABLE `zdjecia`
  ADD PRIMARY KEY (`id_zdjecia`),
  ADD KEY `idx_zdjecia_id_projektu` (`id_projektu`),
  ADD KEY `idx_zdjecia_id_zadania` (`id_zadania`),
  ADD KEY `idx_zdjecia_id_extra_praca` (`id_extra_praca`),
  ADD KEY `idx_zdjecia_id_autora` (`id_autora`),
  ADD KEY `idx_zdjecia_kategoria` (`kategoria_zdjecia`),
  ADD KEY `idx_zdjecia_data_zdjecia` (`data_zdjecia`),
  ADD KEY `idx_zdjecia_publiczne` (`publiczne`),
  ADD KEY `idx_zdjecia_aktywne` (`aktywne`),
  ADD KEY `idx_zdjecia_sciezka_katalogu` (`sciezka_katalogu`);

--
-- AUTO_INCREMENT
--

ALTER TABLE `brygady`
  MODIFY `id_brygady` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Klucz główny brygady';

ALTER TABLE `dziennik_pracy`
  MODIFY `id_dziennik` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Klucz główny dziennika pracy';

ALTER TABLE `extra_praca`
  MODIFY `id_extra_praca` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Klucz główny dodatkowej pracy';

ALTER TABLE `notatki_projektu`
  MODIFY `id_notatki` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Klucz główny notatki';

ALTER TABLE `pracownicy`
  MODIFY `id_pracownika` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Klucz główny pracownika', AUTO_INCREMENT=2;

ALTER TABLE `projekty`
  MODIFY `id_projektu` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Klucz główny', AUTO_INCREMENT=31;

ALTER TABLE `przypomnienia`
  MODIFY `id_przypomnienia` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Klucz główny przypomnienia';

ALTER TABLE `zadania`
  MODIFY `id_zadania` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Klucz główny zadania';

ALTER TABLE `zdjecia`
  MODIFY `id_zdjecia` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Klucz główny zdjęcia';

--
-- Constraints (Foreign Keys)
--

ALTER TABLE `brygady`
  ADD CONSTRAINT `fk_brygady_lider` FOREIGN KEY (`lider_brygady`) REFERENCES `pracownicy` (`id_pracownika`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `dziennik_pracy`
  ADD CONSTRAINT `fk_dziennik_pracy_id_pracownika` FOREIGN KEY (`id_pracownika`) REFERENCES `pracownicy` (`id_pracownika`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dziennik_pracy_id_projektu` FOREIGN KEY (`id_projektu`) REFERENCES `projekty` (`id_projektu`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dziennik_pracy_id_zatwierdzajacego` FOREIGN KEY (`id_zatwierdzajacego`) REFERENCES `pracownicy` (`id_pracownika`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `extra_praca`
  ADD CONSTRAINT `fk_extra_praca_id_pracownika` FOREIGN KEY (`id_pracownika`) REFERENCES `pracownicy` (`id_pracownika`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_extra_praca_id_projektu` FOREIGN KEY (`id_projektu`) REFERENCES `projekty` (`id_projektu`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_extra_praca_id_zatwierdzajacego` FOREIGN KEY (`id_zatwierdzajacego`) REFERENCES `pracownicy` (`id_pracownika`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `notatki_projektu`
  ADD CONSTRAINT `fk_notatki_id_adresata` FOREIGN KEY (`id_adresata`) REFERENCES `pracownicy` (`id_pracownika`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notatki_id_autora` FOREIGN KEY (`id_autora`) REFERENCES `pracownicy` (`id_pracownika`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notatki_id_projektu` FOREIGN KEY (`id_projektu`) REFERENCES `projekty` (`id_projektu`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `pracownicy`
  ADD CONSTRAINT `fk_pracownicy_id_brygady` FOREIGN KEY (`id_brygady`) REFERENCES `brygady` (`id_brygady`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `projekty`
  ADD CONSTRAINT `fk_projekty_id_brygady` FOREIGN KEY (`id_brygady`) REFERENCES `brygady` (`id_brygady`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_projekty_id_kierownika` FOREIGN KEY (`id_kierownika`) REFERENCES `pracownicy` (`id_pracownika`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `przypomnienia`
  ADD CONSTRAINT `fk_przypomnienia_id_pracownika` FOREIGN KEY (`id_pracownika`) REFERENCES `pracownicy` (`id_pracownika`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_przypomnienia_id_utworzyl` FOREIGN KEY (`id_utworzyl`) REFERENCES `pracownicy` (`id_pracownika`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `zadania`
  ADD CONSTRAINT `fk_zadania_id_pracownika` FOREIGN KEY (`id_pracownika`) REFERENCES `pracownicy` (`id_pracownika`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_zadania_id_projektu` FOREIGN KEY (`id_projektu`) REFERENCES `projekty` (`id_projektu`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `zdjecia`
  ADD CONSTRAINT `fk_zdjecia_id_autora` FOREIGN KEY (`id_autora`) REFERENCES `pracownicy` (`id_pracownika`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_zdjecia_id_extra_praca` FOREIGN KEY (`id_extra_praca`) REFERENCES `extra_praca` (`id_extra_praca`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_zdjecia_id_projektu` FOREIGN KEY (`id_projektu`) REFERENCES `projekty` (`id_projektu`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_zdjecia_id_zadania` FOREIGN KEY (`id_zadania`) REFERENCES `zadania` (`id_zadania`) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;

