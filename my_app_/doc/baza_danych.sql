-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Lis 22, 2025 at 08:40 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_002`
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

--
-- Dumping data for table `brygady`
--

INSERT INTO `brygady` (`id_brygady`, `nazwa_brygady`, `opis_brygady`, `lider_brygady`, `aktywna`, `data_utworzenia`, `data_modyfikacji`) VALUES
(1, 'dekarze', '', 1, 1, '2025-11-15 21:28:44', '2025-11-20 11:01:11'),
(2, 'malaze', 'cos tam bla bla', 2, 1, '2025-11-17 13:31:52', '2025-11-20 11:01:19'),
(3, 'metalmeni', ' pustym opis', NULL, 1, '2025-11-17 21:30:38', '2025-11-20 11:01:41');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `dziennik_pracy`
--

CREATE TABLE `dziennik_pracy` (
  `id_dziennik` int(11) NOT NULL COMMENT 'Klucz główny dziennika pracy',
  `id_projektu` int(11) DEFAULT NULL COMMENT 'ID projektu',
  `id_pracownika` int(11) DEFAULT NULL COMMENT 'ID pracownika',
  `data_pracy` date DEFAULT curdate() COMMENT 'Data pracy',
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

--
-- Dumping data for table `dziennik_pracy`
--

INSERT INTO `dziennik_pracy` (`id_dziennik`, `id_projektu`, `id_pracownika`, `data_pracy`, `czas_rozpoczecia`, `czas_zakonczenia`, `czas_pracy`, `opis_pracy`, `notatka`, `zatwierdzone`, `id_zatwierdzajacego`, `data_zatwierdzenia`, `data_utworzenia`, `data_modyfikacji`) VALUES
(1, 31, 1, '2025-11-15', NULL, NULL, 0.00, NULL, 'gbdsbd', 0, NULL, NULL, '2025-11-15 21:38:09', '2025-11-15 21:38:09'),
(2, 31, 1, '2025-11-16', NULL, '01:40:00', 0.00, NULL, NULL, 1, 1, NULL, '2025-11-15 21:40:58', '2025-11-15 21:41:19'),
(3, 33, 1, '2025-11-13', NULL, '03:55:00', 0.00, NULL, NULL, 0, NULL, NULL, '2025-11-15 21:55:18', '2025-11-15 21:55:18'),
(4, 33, 1, '2025-11-16', '07:00:00', '16:00:00', 0.00, 'hgmgm', 'ghmgm', 0, NULL, NULL, '2025-11-16 12:40:11', '2025-11-16 12:40:11');

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

--
-- Dumping data for table `extra_praca`
--

INSERT INTO `extra_praca` (`id_extra_praca`, `id_projektu`, `opis_pracy`, `notatka`, `data_rozpoczecia`, `data_zakonczenia`, `przypomnij_rozpoczecie`, `czas_pracy`, `koszt_dodatkowy`, `zatwierdzona`, `id_pracownika`, `id_zatwierdzajacego`, `data_utworzenia`, `data_modyfikacji`) VALUES
(1, 31, 'Dodatkowa praca', 'gryk', '2025-11-16', '2025-11-11', 1, 10.00, 0.00, 1, NULL, 1, '2025-11-16 12:38:16', '2025-11-21 16:13:44'),
(2, 31, 'rgbrwg', 'tbrbt', '2025-11-21', NULL, 0, 2.00, NULL, 1, 7, 1, '2025-11-21 10:32:54', '2025-11-21 10:47:57'),
(7, 31, 'g gh ', ' g gh gh', '2025-11-21', NULL, 1, 2.00, NULL, 1, NULL, NULL, '2025-11-21 10:34:14', '2025-11-21 16:20:22'),
(10, 31, 'fnfn hfvbjee  \n\n sgyuyg re g. jhc j ff e\n\nkjevkjbvkej', 'gfng gbfb  trg hh ', '2025-11-21', NULL, 1, NULL, NULL, 1, 8, 1, '2025-11-21 11:31:48', '2025-11-21 16:13:20'),
(12, 31, '', ' yfr r g er   eiu ieyieg \nefrjherg', '2025-11-21', NULL, 1, NULL, NULL, 0, 8, 2, '2025-11-21 12:45:20', '2025-11-21 16:20:35'),
(13, 31, 'bdbg', 'bfg', '2025-11-21', NULL, 1, 2.00, NULL, 1, 2, 1, '2025-11-21 12:52:35', '2025-11-21 12:52:35');

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

--
-- Dumping data for table `notatki_projektu`
--

INSERT INTO `notatki_projektu` (`id_notatki`, `id_projektu`, `tytul_notatki`, `tresc_notatki`, `typ_notatki`, `priorytet`, `publiczna`, `id_autora`, `id_adresata`, `data_utworzenia`, `data_modyfikacji`) VALUES
(1, 32, 'ftj', 'fnnynfnn', 'Ogólna', 'Niski', 1, 1, 1, '2025-11-16 12:41:08', '2025-11-16 12:41:08');

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
(1, ' administrator', 'stasiuk', 'artur@stasiuk', NULL, '', NULL, NULL, 1, 'Administrator', '1976', '2025-11-16 14:38:15', '2025-11-06 22:08:34', '2025-11-20 10:59:45'),
(2, 'kierownik 1', '', 'kierownik@email', NULL, NULL, 2, NULL, 1, 'Kierownik', 'kierownik', NULL, '2025-11-17 13:24:34', '2025-11-20 10:58:06'),
(3, 'pracownik', NULL, 'pracownik@email', NULL, NULL, 3, NULL, 1, 'Pracownik', 'pracownik', NULL, '2025-11-18 19:25:04', '2025-11-20 10:57:58'),
(4, ' obserwator', NULL, 'obserwator@email', NULL, NULL, 1, NULL, 1, 'Obserwator', 'obserwator', NULL, '2025-11-19 20:57:55', '2025-11-20 10:57:35'),
(5, 'kierownik 2', '', 'kierownik2@email', NULL, '', 3, NULL, 1, 'Kierownik', 'kierownik2', NULL, '2025-11-20 06:17:59', '2025-11-20 10:57:46'),
(6, 'pracownik1', 'Nieznane', NULL, NULL, NULL, 1, NULL, 1, 'Pracownik', NULL, NULL, '2025-11-20 10:56:08', '2025-11-20 10:57:00'),
(7, 'pracownik2 4', 'Nieznane', NULL, NULL, NULL, 2, NULL, 1, 'Pracownik', NULL, NULL, '2025-11-20 10:56:08', '2025-11-20 10:59:26'),
(8, 'pracownik 4', 'Nieznane', NULL, NULL, 'Pracownik', 2, NULL, 1, 'Pracownik', NULL, NULL, '2025-11-20 10:59:05', '2025-11-20 10:59:05'),
(9, 'pracownik 5', 'Nieznane', NULL, NULL, 'Pracownik', 3, NULL, 1, 'Pracownik', NULL, NULL, '2025-11-20 10:59:05', '2025-11-20 10:59:05');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `projekty`
--

CREATE TABLE `projekty` (
  `id_projektu` int(11) NOT NULL COMMENT 'Klucz główny',
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

--
-- Dumping data for table `projekty`
--

INSERT INTO `projekty` (`id_projektu`, `nazwa_projektu`, `adres_projektu`, `planowane_rozpoczecie`, `planowane_zakonczenie`, `przypomnij_rozpoczecie`, `przypomnij_zakonczenie`, `data_rozpoczecia`, `data_zakonczenia`, `stan_projektu`, `status_projektu`, `id_brygady`, `id_kierownika`, `ukryj_projekt`, `notatka`, `data_utworzenia`, `data_modyfikacji`) VALUES
(31, '1486', 'Adres dla 111', '2025-11-13', NULL, 0, 0, '2025-11-20', '2025-11-06', 'W trakcie', 'Normalny', 2, 2, 0, 'dostemp artur kierownik', '2025-11-15 20:31:37', '2025-11-21 07:29:50'),
(32, '222', 'Adres dla 222', '2025-11-15', '2025-11-06', 0, 0, '2025-11-21', '2025-11-19', 'Nie określono', 'Krytyczny', 1, 1, 0, NULL, '2025-11-15 21:16:21', '2025-11-19 04:16:58'),
(33, '333', 'Adres dla 333', '2025-11-15', '2025-11-29', 1, 1, '2025-11-15', '2025-11-29', 'Nie określono', 'Krytyczny', 1, 1, 0, 'notatka dla fluda pewne uwagi ', '2025-11-15 21:46:34', '2025-11-19 04:42:48'),
(34, '1484', 'Fluda ', '2025-11-18', '2025-11-29', 0, 0, '2025-11-20', '2025-11-29', 'Nie określono', 'Normalny', 3, NULL, 0, 'notatka dla \nprojektu \nfluda\njakies informacje ', '2025-11-17 21:31:36', '2025-11-19 04:14:15'),
(35, 'Malowanie Szkoły Gdańsk', NULL, NULL, NULL, 0, 0, NULL, NULL, 'Nie określono', 'Normalny', 1, 1, 0, NULL, '2025-11-18 20:51:56', '2025-11-18 22:52:47'),
(36, 'test3', NULL, NULL, NULL, 0, 0, NULL, NULL, 'Nie określono', 'Normalny', 1, 1, 0, NULL, '2025-11-18 20:53:36', '2025-11-19 04:13:52'),
(37, 'dostemp kierownik 2', NULL, NULL, NULL, 0, 0, NULL, NULL, 'Wstrzymany', 'Normalny', 1, 1, 0, 'dostemp artur I kierownik 2', '2025-11-18 20:58:54', '2025-11-20 14:30:18'),
(38, 'test na  wstrzymany', NULL, '2025-11-19', '2025-11-29', 1, 1, NULL, NULL, 'Wstrzymany', 'Normalny', 1, 1, 0, NULL, '2025-11-18 20:59:49', '2025-11-18 22:06:38'),
(39, 'wefwef', NULL, NULL, NULL, 0, 0, NULL, NULL, 'Zakończony', 'Normalny', 1, 1, 0, NULL, '2025-11-18 21:02:52', '2025-11-18 21:11:14'),
(40, '1286', NULL, NULL, NULL, 0, 0, NULL, NULL, 'Wstrzymany', 'Normalny', 1, 1, 0, NULL, '2025-11-18 21:03:53', '2025-11-19 21:32:54'),
(41, 'ffffffffffffffff', NULL, NULL, NULL, 0, 0, NULL, NULL, 'Zakończony', 'Normalny', 3, 1, 0, NULL, '2025-11-18 21:04:53', '2025-11-18 21:04:53'),
(42, 'rtrtgqqqqqqqqqqqqqqqqq', NULL, NULL, NULL, 0, 0, NULL, NULL, 'Zakończony', 'Normalny', NULL, NULL, 0, NULL, '2025-11-18 21:05:50', '2025-11-18 21:05:50');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `przypomnienia`
--

CREATE TABLE `przypomnienia` (
  `id_przypomnienia` int(11) NOT NULL COMMENT 'Klucz główny przypomnienia',
  `tytul` varchar(255) DEFAULT 'Nowe przypomnienie' COMMENT 'Tytuł przypomnienia',
  `opis` text DEFAULT NULL COMMENT 'Opis przypomnienia',
  `data_przypomnienia` datetime DEFAULT current_timestamp() COMMENT 'Data i czas przypomnienia',
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

--
-- Dumping data for table `przypomnienia`
--

INSERT INTO `przypomnienia` (`id_przypomnienia`, `tytul`, `opis`, `data_przypomnienia`, `typ_przypomnienia`, `id_powiazanego_obiektu`, `id_pracownika`, `id_utworzyl`, `status`, `powtarzaj`, `data_wyslania`, `data_odczytania`, `priorytet`, `data_utworzenia`, `data_modyfikacji`) VALUES
(2, 'Nowe przypomnienie', 'jakos tam', '2025-11-16 21:54:35', 'Ogólne', 33, NULL, NULL, 'Aktywne', 'Jednorazowe', NULL, NULL, 'Normalny', '2025-11-16 20:54:35', '2025-11-16 20:54:35');

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
-- Struktura widoku `view_brygady_summary`
--
DROP TABLE IF EXISTS `view_brygady_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_brygady_summary`  AS SELECT `b`.`id_brygady` AS `id_brygady`, `b`.`nazwa_brygady` AS `nazwa_brygady`, `b`.`opis_brygady` AS `opis_brygady`, `b`.`lider_brygady` AS `lider_brygady`, concat_ws(' ',`l`.`imie`,`l`.`nazwisko`) AS `lider_imie_nazwisko`, `b`.`aktywna` AS `aktywna`, `b`.`data_utworzenia` AS `data_utworzenia`, `b`.`data_modyfikacji` AS `data_modyfikacji`, coalesce((select count(1) from `pracownicy` `pw` where `pw`.`id_brygady` = `b`.`id_brygady`),0) AS `liczba_pracownikow`, coalesce((select count(1) from `projekty` `pr` where `pr`.`id_brygady` = `b`.`id_brygady`),0) AS `liczba_projektow` FROM (`brygady` `b` left join `pracownicy` `l` on(`b`.`lider_brygady` = `l`.`id_pracownika`)) ;

-- --------------------------------------------------------

--
-- Struktura widoku `view_dziennik_pracy_full`
--
DROP TABLE IF EXISTS `view_dziennik_pracy_full`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_dziennik_pracy_full`  AS SELECT `d`.`id_dziennik` AS `id_dziennik`, `d`.`id_projektu` AS `id_projektu`, `p`.`nazwa_projektu` AS `nazwa_projektu`, `d`.`id_pracownika` AS `id_pracownika`, concat_ws(' ',`pr`.`imie`,`pr`.`nazwisko`) AS `pracownik`, `d`.`data_pracy` AS `data_pracy`, `d`.`czas_rozpoczecia` AS `czas_rozpoczecia`, `d`.`czas_zakonczenia` AS `czas_zakonczenia`, `d`.`czas_pracy` AS `czas_pracy`, `d`.`opis_pracy` AS `opis_pracy`, `d`.`notatka` AS `notatka`, `d`.`zatwierdzone` AS `zatwierdzone`, `d`.`id_zatwierdzajacego` AS `id_zatwierdzajacego`, concat_ws(' ',`zatw`.`imie`,`zatw`.`nazwisko`) AS `zatwierdzajacy`, `d`.`data_zatwierdzenia` AS `data_zatwierdzenia`, `d`.`data_utworzenia` AS `data_utworzenia`, `d`.`data_modyfikacji` AS `data_modyfikacji` FROM (((`dziennik_pracy` `d` left join `projekty` `p` on(`d`.`id_projektu` = `p`.`id_projektu`)) left join `pracownicy` `pr` on(`d`.`id_pracownika` = `pr`.`id_pracownika`)) left join `pracownicy` `zatw` on(`d`.`id_zatwierdzajacego` = `zatw`.`id_pracownika`)) ;

-- --------------------------------------------------------

--
-- Struktura widoku `view_extra_praca_full`
--
DROP TABLE IF EXISTS `view_extra_praca_full`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_extra_praca_full`  AS SELECT `e`.`id_extra_praca` AS `id_extra_praca`, `e`.`id_projektu` AS `id_projektu`, `p`.`nazwa_projektu` AS `nazwa_projektu`, `e`.`opis_pracy` AS `opis_pracy`, `e`.`notatka` AS `notatka`, `e`.`data_rozpoczecia` AS `data_rozpoczecia`, `e`.`data_zakonczenia` AS `data_zakonczenia`, `e`.`przypomnij_rozpoczecie` AS `przypomnij_rozpoczecie`, `e`.`czas_pracy` AS `czas_pracy`, `e`.`koszt_dodatkowy` AS `koszt_dodatkowy`, `e`.`zatwierdzona` AS `zatwierdzona`, `e`.`id_pracownika` AS `id_pracownika`, concat_ws(' ',`pw`.`imie`,`pw`.`nazwisko`) AS `wykonawca`, `e`.`id_zatwierdzajacego` AS `id_zatwierdzajacego`, concat_ws(' ',`zatw`.`imie`,`zatw`.`nazwisko`) AS `zatwierdzajacy`, `e`.`data_utworzenia` AS `data_utworzenia`, `e`.`data_modyfikacji` AS `data_modyfikacji` FROM (((`extra_praca` `e` left join `projekty` `p` on(`e`.`id_projektu` = `p`.`id_projektu`)) left join `pracownicy` `pw` on(`e`.`id_pracownika` = `pw`.`id_pracownika`)) left join `pracownicy` `zatw` on(`e`.`id_zatwierdzajacego` = `zatw`.`id_pracownika`)) ;

-- --------------------------------------------------------

--
-- Struktura widoku `view_notatki_projektu_full`
--
DROP TABLE IF EXISTS `view_notatki_projektu_full`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_notatki_projektu_full`  AS SELECT `n`.`id_notatki` AS `id_notatki`, `n`.`id_projektu` AS `id_projektu`, `p`.`nazwa_projektu` AS `nazwa_projektu`, `n`.`tytul_notatki` AS `tytul_notatki`, `n`.`tresc_notatki` AS `tresc_notatki`, `n`.`typ_notatki` AS `typ_notatki`, `n`.`priorytet` AS `priorytet`, `n`.`publiczna` AS `publiczna`, `n`.`id_autora` AS `id_autora`, concat_ws(' ',`a`.`imie`,`a`.`nazwisko`) AS `autor`, `n`.`id_adresata` AS `id_adresata`, concat_ws(' ',`ad`.`imie`,`ad`.`nazwisko`) AS `adresat`, `n`.`data_utworzenia` AS `data_utworzenia`, `n`.`data_modyfikacji` AS `data_modyfikacji` FROM (((`notatki_projektu` `n` left join `projekty` `p` on(`n`.`id_projektu` = `p`.`id_projektu`)) left join `pracownicy` `a` on(`n`.`id_autora` = `a`.`id_pracownika`)) left join `pracownicy` `ad` on(`n`.`id_adresata` = `ad`.`id_pracownika`)) ;

-- --------------------------------------------------------

--
-- Struktura widoku `view_pracownicy_full`
--
DROP TABLE IF EXISTS `view_pracownicy_full`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_pracownicy_full`  AS SELECT `pw`.`id_pracownika` AS `id_pracownika`, `pw`.`imie` AS `imie`, `pw`.`nazwisko` AS `nazwisko`, `pw`.`email` AS `email`, `pw`.`telefon` AS `telefon`, `pw`.`stanowisko` AS `stanowisko`, `pw`.`id_brygady` AS `id_brygady`, `b`.`nazwa_brygady` AS `nazwa_brygady`, `pw`.`data_zatrudnienia` AS `data_zatrudnienia`, `pw`.`aktywny` AS `aktywny`, `pw`.`uprawnienia` AS `uprawnienia`, `pw`.`ostatnie_logowanie` AS `ostatnie_logowanie`, `pw`.`data_utworzenia` AS `data_utworzenia`, `pw`.`data_modyfikacji` AS `data_modyfikacji`, coalesce((select count(1) from `zadania` `z` where `z`.`id_pracownika` = `pw`.`id_pracownika`),0) AS `liczba_zadan`, coalesce((select count(1) from `extra_praca` `e` where `e`.`id_pracownika` = `pw`.`id_pracownika`),0) AS `liczba_extra_praca`, coalesce((select count(1) from `dziennik_pracy` `d` where `d`.`id_pracownika` = `pw`.`id_pracownika`),0) AS `liczba_wpisow_dziennika` FROM (`pracownicy` `pw` left join `brygady` `b` on(`pw`.`id_brygady` = `b`.`id_brygady`)) ;

-- --------------------------------------------------------

--
-- Struktura widoku `view_project_summary`
--
DROP TABLE IF EXISTS `view_project_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_project_summary`  AS SELECT `p`.`id_projektu` AS `id_projektu`, `p`.`nazwa_projektu` AS `nazwa_projektu`, `p`.`adres_projektu` AS `adres_projektu`, `p`.`planowane_rozpoczecie` AS `planowane_rozpoczecie`, `p`.`planowane_zakonczenie` AS `planowane_zakonczenie`, `p`.`przypomnij_rozpoczecie` AS `przypomnij_rozpoczecie`, `p`.`przypomnij_zakonczenie` AS `przypomnij_zakonczenie`, `p`.`data_rozpoczecia` AS `data_rozpoczecia`, `p`.`data_zakonczenia` AS `data_zakonczenia`, `p`.`notatka` AS `notatka`, `p`.`stan_projektu` AS `stan_projektu`, `p`.`status_projektu` AS `status_projektu`, coalesce((select count(1) from `zadania` `z` where `z`.`id_projektu` = `p`.`id_projektu` and `z`.`status_zadania` = 1),0) AS `zadania_wykonane`, coalesce((select count(1) from `zadania` `z` where `z`.`id_projektu` = `p`.`id_projektu` and (`z`.`status_zadania` = 0 or `z`.`status_zadania` is null)),0) AS `zadania_niewykonane`, coalesce((select count(1) from `zadania` `z` where `z`.`id_projektu` = `p`.`id_projektu`),0) AS `zadania_razem`, coalesce((select count(1) from `extra_praca` `e` where `e`.`id_projektu` = `p`.`id_projektu`),0) AS `extra_praca_count`, coalesce((select count(1) from `extra_praca` `e` where `e`.`id_projektu` = `p`.`id_projektu` and `e`.`zatwierdzona` = 1),0) AS `extra_praca_zatwierdzone`, coalesce((select count(1) from `extra_praca` `e` where `e`.`id_projektu` = `p`.`id_projektu` and (`e`.`zatwierdzona` = 0 or `e`.`zatwierdzona` is null)),0) AS `extra_praca_niezatwierdzone`, coalesce((select count(1) from `przypomnienia` `r` where `r`.`id_powiazanego_obiektu` = `p`.`id_projektu` and `r`.`status` = 'Aktywne'),0) AS `przypomnienia_aktywne`, coalesce((select count(1) from `przypomnienia` `r` where `r`.`id_powiazanego_obiektu` = `p`.`id_projektu` and `r`.`status` = 'Wyslane'),0) AS `przypomnienia_wyslane`, coalesce((select count(1) from `przypomnienia` `r` where `r`.`id_powiazanego_obiektu` = `p`.`id_projektu` and `r`.`status` = 'Odczytane'),0) AS `przypomnienia_odczytane`, coalesce((select count(1) from `przypomnienia` `r` where `r`.`id_powiazanego_obiektu` = `p`.`id_projektu` and `r`.`status` = 'Anulowane'),0) AS `przypomnienia_anulowane` FROM `projekty` AS `p` ;

-- --------------------------------------------------------

--
-- Struktura widoku `view_projekty_full`
--
DROP TABLE IF EXISTS `view_projekty_full`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_projekty_full`  AS SELECT `p`.`id_projektu` AS `id_projektu`, `p`.`nazwa_projektu` AS `nazwa_projektu`, `p`.`adres_projektu` AS `adres_projektu`, `p`.`planowane_rozpoczecie` AS `planowane_rozpoczecie`, `p`.`planowane_zakonczenie` AS `planowane_zakonczenie`, `p`.`przypomnij_rozpoczecie` AS `przypomnij_rozpoczecie`, `p`.`przypomnij_zakonczenie` AS `przypomnij_zakonczenie`, `p`.`data_rozpoczecia` AS `data_rozpoczecia`, `p`.`data_zakonczenia` AS `data_zakonczenia`, `p`.`stan_projektu` AS `stan_projektu`, `p`.`status_projektu` AS `status_projektu`, `p`.`id_brygady` AS `id_brygady`, `b`.`nazwa_brygady` AS `nazwa_brygady`, `p`.`id_kierownika` AS `id_kierownika`, concat_ws(' ',`k`.`imie`,`k`.`nazwisko`) AS `kierownik`, `p`.`ukryj_projekt` AS `ukryj_projekt`, `p`.`notatka` AS `notatka`, `p`.`data_utworzenia` AS `data_utworzenia`, `p`.`data_modyfikacji` AS `data_modyfikacji`, coalesce((select count(1) from `zadania` `z` where `z`.`id_projektu` = `p`.`id_projektu`),0) AS `liczba_zadan`, coalesce((select sum(case when `z`.`status_zadania` = 1 then 1 else 0 end) from `zadania` `z` where `z`.`id_projektu` = `p`.`id_projektu`),0) AS `liczba_zadan_wykonanych`, coalesce((select count(1) from `extra_praca` `e` where `e`.`id_projektu` = `p`.`id_projektu`),0) AS `liczba_extra_praca` FROM ((`projekty` `p` left join `brygady` `b` on(`p`.`id_brygady` = `b`.`id_brygady`)) left join `pracownicy` `k` on(`p`.`id_kierownika` = `k`.`id_pracownika`)) ;

-- --------------------------------------------------------

--
-- Struktura widoku `view_przypomnienia_full`
--
DROP TABLE IF EXISTS `view_przypomnienia_full`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_przypomnienia_full`  AS SELECT `r`.`id_przypomnienia` AS `id_przypomnienia`, `r`.`tytul` AS `tytul`, `r`.`opis` AS `opis`, `r`.`data_przypomnienia` AS `data_przypomnienia`, `r`.`typ_przypomnienia` AS `typ_przypomnienia`, `r`.`id_powiazanego_obiektu` AS `id_powiazanego_obiektu`, `r`.`id_pracownika` AS `id_pracownika`, concat_ws(' ',`odb`.`imie`,`odb`.`nazwisko`) AS `odbiorca`, `r`.`id_utworzyl` AS `id_utworzyl`, concat_ws(' ',`utw`.`imie`,`utw`.`nazwisko`) AS `utworzyl`, `r`.`status` AS `status`, `r`.`powtarzaj` AS `powtarzaj`, `r`.`data_wyslania` AS `data_wyslania`, `r`.`data_odczytania` AS `data_odczytania`, `r`.`priorytet` AS `priorytet`, `r`.`data_utworzenia` AS `data_utworzenia`, `r`.`data_modyfikacji` AS `data_modyfikacji` FROM ((`przypomnienia` `r` left join `pracownicy` `odb` on(`r`.`id_pracownika` = `odb`.`id_pracownika`)) left join `pracownicy` `utw` on(`r`.`id_utworzyl` = `utw`.`id_pracownika`)) ;

-- --------------------------------------------------------

--
-- Struktura widoku `view_zadania_full`
--
DROP TABLE IF EXISTS `view_zadania_full`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_zadania_full`  AS SELECT `z`.`id_zadania` AS `id_zadania`, `z`.`id_projektu` AS `id_projektu`, `p`.`nazwa_projektu` AS `nazwa_projektu`, `z`.`tytul_zadania` AS `tytul_zadania`, `z`.`opis_zadania` AS `opis_zadania`, `z`.`notatka` AS `notatka`, `z`.`data_rozpoczecia` AS `data_rozpoczecia`, `z`.`data_zakonczenia` AS `data_zakonczenia`, `z`.`planowana_data_zakonczenia` AS `planowana_data_zakonczenia`, `z`.`status_zadania` AS `status_zadania`, `z`.`priorytet` AS `priorytet`, `z`.`przypomnij_rozpoczecie` AS `przypomnij_rozpoczecie`, `z`.`id_pracownika` AS `id_pracownika`, concat(coalesce(`pr`.`imie`,''),' ',coalesce(`pr`.`nazwisko`,'')) AS `pracownik`, `z`.`procent_wykonania` AS `procent_wykonania`, `z`.`data_utworzenia` AS `data_utworzenia`, `z`.`data_modyfikacji` AS `data_modyfikacji` FROM ((`zadania` `z` left join `projekty` `p` on(`z`.`id_projektu` = `p`.`id_projektu`)) left join `pracownicy` `pr` on(`z`.`id_pracownika` = `pr`.`id_pracownika`)) ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;