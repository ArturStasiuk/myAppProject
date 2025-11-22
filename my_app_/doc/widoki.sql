-- Widok: podsumowanie projektu z licznikami zadań i dodatkowej pracy
-- Tworzy widok z podstawowymi polami z tabeli `projekty` oraz:
--  - zadania_wykonane     = liczba zadań (status_zadania = 1)
--  - zadania_niewykonane  = liczba zadań (status_zadania = 0 lub NULL)
--  - extra_praca_count    = liczba rekordów w `extra_praca` powiązanych z projektem

DROP VIEW IF EXISTS `view_project_summary`;
CREATE VIEW `view_project_summary` AS
SELECT
  p.`id_projektu`,
  p.`nazwa_projektu`,
  p.`adres_projektu`,
  p.`planowane_rozpoczecie`,
  p.`planowane_zakonczenie`,
  p.`przypomnij_rozpoczecie`,
  p.`przypomnij_zakonczenie`,
  p.`data_rozpoczecia`,
  p.`data_zakonczenia`,
  p.`notatka`,
  p.`stan_projektu`,
  p.`status_projektu`,
  -- liczniki zadań (podzapytania aby uniknąć mnożenia w JOIN)
  COALESCE((
    SELECT COUNT(1)
    FROM `zadania` z
    WHERE z.`id_projektu` = p.`id_projektu`
      AND z.`status_zadania` = 1
  ), 0) AS `zadania_wykonane`,
  COALESCE((
    SELECT COUNT(1)
    FROM `zadania` z
    WHERE z.`id_projektu` = p.`id_projektu`
      AND (z.`status_zadania` = 0 OR z.`status_zadania` IS NULL)
  ), 0) AS `zadania_niewykonane`,
  COALESCE((
    SELECT COUNT(1)
    FROM `zadania` z
    WHERE z.`id_projektu` = p.`id_projektu`
  ), 0) AS `zadania_razem`,
  COALESCE((
    SELECT COUNT(1)
    FROM `extra_praca` e
    WHERE e.`id_projektu` = p.`id_projektu`
  ), 0) AS `extra_praca_count`,
  COALESCE((
    SELECT COUNT(1)
    FROM `extra_praca` e
    WHERE e.`id_projektu` = p.`id_projektu` AND e.`zatwierdzona` = 1
  ), 0) AS `extra_praca_zatwierdzone`,
  COALESCE((
    SELECT COUNT(1)
    FROM `extra_praca` e
    WHERE e.`id_projektu` = p.`id_projektu` AND (e.`zatwierdzona` = 0 OR e.`zatwierdzona` IS NULL)
  ), 0) AS `extra_praca_niezatwierdzone`,
  -- liczniki przypomnień wg statusu
  COALESCE((
    SELECT COUNT(1)
    FROM `przypomnienia` r
    WHERE r.`id_powiazanego_obiektu` = p.`id_projektu` AND r.`status` = 'Aktywne'
  ), 0) AS `przypomnienia_aktywne`,
  COALESCE((
    SELECT COUNT(1)
    FROM `przypomnienia` r
    WHERE r.`id_powiazanego_obiektu` = p.`id_projektu` AND r.`status` = 'Wyslane'
  ), 0) AS `przypomnienia_wyslane`,
  COALESCE((
    SELECT COUNT(1)
    FROM `przypomnienia` r
    WHERE r.`id_powiazanego_obiektu` = p.`id_projektu` AND r.`status` = 'Odczytane'
  ), 0) AS `przypomnienia_odczytane`,
  COALESCE((
    SELECT COUNT(1)
    FROM `przypomnienia` r
    WHERE r.`id_powiazanego_obiektu` = p.`id_projektu` AND r.`status` = 'Anulowane'
  ), 0) AS `przypomnienia_anulowane`
FROM `projekty` p;

-- Widok: view_zadania_full
-- Zwraca wszystkie istotne pola z tabeli `zadania` wraz z nazwą projektu i imieniem/nazwiskiem przypisanego pracownika
-- Ułatwia zapytania typu: WHERE id_projektu = X OR WHERE tytul_zadania LIKE '%...%'

DROP VIEW IF EXISTS `view_zadania_full`;
CREATE VIEW `view_zadania_full` AS
SELECT
  z.`id_zadania`,
  z.`id_projektu`,
  p.`nazwa_projektu`,
  z.`tytul_zadania`,
  z.`opis_zadania`,
  z.`notatka`,
  z.`data_rozpoczecia`,
  z.`data_zakonczenia`,
  z.`planowana_data_zakonczenia`,
  z.`status_zadania`,
  z.`priorytet`,
  z.`przypomnij_rozpoczecie`,
  z.`id_pracownika`,
  CONCAT(COALESCE(pr.`imie`,''), ' ', COALESCE(pr.`nazwisko`,'')) AS `pracownik`,
  z.`procent_wykonania`,
  z.`data_utworzenia`,
  z.`data_modyfikacji`
FROM `zadania` z
LEFT JOIN `projekty` p ON z.`id_projektu` = p.`id_projektu`
LEFT JOIN `pracownicy` pr ON z.`id_pracownika` = pr.`id_pracownika`;

-- Widok: podsumowanie brygad z informacją o liderze i liczbach pracowników/projektów
DROP VIEW IF EXISTS `view_brygady_summary`;
CREATE VIEW `view_brygady_summary` AS
SELECT
  b.`id_brygady`,
  b.`nazwa_brygady`,
  b.`opis_brygady`,
  b.`lider_brygady`,
  CONCAT_WS(' ', l.`imie`, l.`nazwisko`) AS `lider_imie_nazwisko`,
  b.`aktywna`,
  b.`data_utworzenia`,
  b.`data_modyfikacji`,
  COALESCE((
    SELECT COUNT(1) FROM `pracownicy` pw WHERE pw.`id_brygady` = b.`id_brygady`
  ), 0) AS `liczba_pracownikow`,
  COALESCE((
    SELECT COUNT(1) FROM `projekty` pr WHERE pr.`id_brygady` = b.`id_brygady`
  ), 0) AS `liczba_projektow`
FROM `brygady` b
LEFT JOIN `pracownicy` l ON b.`lider_brygady` = l.`id_pracownika`;

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

-- Widok: notatki_projektu z informacjami o projekcie, autorze i odbiorcy
DROP VIEW IF EXISTS `view_notatki_projektu_full`;
CREATE VIEW `view_notatki_projektu_full` AS
SELECT
  n.`id_notatki`,
  n.`id_projektu`,
  p.`nazwa_projektu`,
  n.`tytul_notatki`,
  n.`tresc_notatki`,
  n.`typ_notatki`,
  n.`priorytet`,
  n.`publiczna`,
  n.`id_autora`,
  CONCAT_WS(' ', a.`imie`, a.`nazwisko`) AS `autor`,
  n.`id_adresata`,
  CONCAT_WS(' ', ad.`imie`, ad.`nazwisko`) AS `adresat`,
  n.`data_utworzenia`,
  n.`data_modyfikacji`
FROM `notatki_projektu` n
LEFT JOIN `projekty` p ON n.`id_projektu` = p.`id_projektu`
LEFT JOIN `pracownicy` a ON n.`id_autora` = a.`id_pracownika`
LEFT JOIN `pracownicy` ad ON n.`id_adresata` = ad.`id_pracownika`;

-- Widok: dziennik_pracy z nazwą projektu oraz imieniem i nazwiskiem pracownika i zatwierdzającego
DROP VIEW IF EXISTS `view_dziennik_pracy_full`;
CREATE VIEW `view_dziennik_pracy_full` AS
SELECT
  d.`id_dziennik`,
  d.`id_projektu`,
  p.`nazwa_projektu`,
  d.`id_pracownika`,
  CONCAT_WS(' ', pr.`imie`, pr.`nazwisko`) AS `pracownik`,
  d.`data_pracy`,
  d.`czas_rozpoczecia`,
  d.`czas_zakonczenia`,
  d.`czas_pracy`,
  d.`opis_pracy`,
  d.`notatka`,
  d.`zatwierdzone`,
  d.`id_zatwierdzajacego`,
  CONCAT_WS(' ', zatw.`imie`, zatw.`nazwisko`) AS `zatwierdzajacy`,
  d.`data_zatwierdzenia`,
  d.`data_utworzenia`,
  d.`data_modyfikacji`
FROM `dziennik_pracy` d
LEFT JOIN `projekty` p ON d.`id_projektu` = p.`id_projektu`
LEFT JOIN `pracownicy` pr ON d.`id_pracownika` = pr.`id_pracownika`
LEFT JOIN `pracownicy` zatw ON d.`id_zatwierdzajacego` = zatw.`id_pracownika`;

-- Widok: pracownicy z nazwą brygady oraz licznikami zadań, extra_pracy i wpisów w dzienniku
DROP VIEW IF EXISTS `view_pracownicy_full`;
CREATE VIEW `view_pracownicy_full` AS
SELECT
  pw.`id_pracownika`,
  pw.`imie`,
  pw.`nazwisko`,
  pw.`email`,
  pw.`telefon`,
  pw.`stanowisko`,
  pw.`id_brygady`,
  b.`nazwa_brygady`,
  pw.`data_zatrudnienia`,
  pw.`aktywny`,
  pw.`uprawnienia`,
  pw.`ostatnie_logowanie`,
  pw.`data_utworzenia`,
  pw.`data_modyfikacji`,
  COALESCE((
    SELECT COUNT(1) FROM `zadania` z WHERE z.`id_pracownika` = pw.`id_pracownika`
  ), 0) AS `liczba_zadan`,
  COALESCE((
    SELECT COUNT(1) FROM `extra_praca` e WHERE e.`id_pracownika` = pw.`id_pracownika`
  ), 0) AS `liczba_extra_praca`,
  COALESCE((
    SELECT COUNT(1) FROM `dziennik_pracy` d WHERE d.`id_pracownika` = pw.`id_pracownika`
  ), 0) AS `liczba_wpisow_dziennika`
FROM `pracownicy` pw
LEFT JOIN `brygady` b ON pw.`id_brygady` = b.`id_brygady`;

-- Widok: przypomnienia z informacjami o odbiorcy i twórcy przypomnienia
DROP VIEW IF EXISTS `view_przypomnienia_full`;
CREATE VIEW `view_przypomnienia_full` AS
SELECT
  r.`id_przypomnienia`,
  r.`tytul`,
  r.`opis`,
  r.`data_przypomnienia`,
  r.`typ_przypomnienia`,
  r.`id_powiazanego_obiektu`,
  r.`id_pracownika`,
  CONCAT_WS(' ', odb.`imie`, odb.`nazwisko`) AS `odbiorca`,
  r.`id_utworzyl`,
  CONCAT_WS(' ', utw.`imie`, utw.`nazwisko`) AS `utworzyl`,
  r.`status`,
  r.`powtarzaj`,
  r.`data_wyslania`,
  r.`data_odczytania`,
  r.`priorytet`,
  r.`data_utworzenia`,
  r.`data_modyfikacji`
FROM `przypomnienia` r
LEFT JOIN `pracownicy` odb ON r.`id_pracownika` = odb.`id_pracownika`
LEFT JOIN `pracownicy` utw ON r.`id_utworzyl` = utw.`id_pracownika`;


-- Widok: pełne projekty z nazwą kierownika, nazwą brygady oraz licznikami zadań i extra_praca
DROP VIEW IF EXISTS `view_projekty_full`;
CREATE VIEW `view_projekty_full` AS
SELECT
  p.`id_projektu`,
  p.`nazwa_projektu`,
  p.`adres_projektu`,
  p.`planowane_rozpoczecie`,
  p.`planowane_zakonczenie`,
  p.`przypomnij_rozpoczecie`,
  p.`przypomnij_zakonczenie`,
  p.`data_rozpoczecia`,
  p.`data_zakonczenia`,
  p.`stan_projektu`,
  p.`status_projektu`,
  p.`id_brygady`,
  b.`nazwa_brygady`,
  p.`id_kierownika`,
  CONCAT_WS(' ', k.`imie`, k.`nazwisko`) AS `kierownik`,
  p.`ukryj_projekt`,
  p.`notatka`,
  p.`data_utworzenia`,
  p.`data_modyfikacji`,
  COALESCE((
    SELECT COUNT(1) FROM `zadania` z WHERE z.`id_projektu` = p.`id_projektu`
  ), 0) AS `liczba_zadan`,
  COALESCE((
    SELECT SUM(CASE WHEN z.`status_zadania` = 1 THEN 1 ELSE 0 END) FROM `zadania` z WHERE z.`id_projektu` = p.`id_projektu`
  ), 0) AS `liczba_zadan_wykonanych`,
  COALESCE((
    SELECT COUNT(1) FROM `extra_praca` e WHERE e.`id_projektu` = p.`id_projektu`
  ), 0) AS `liczba_extra_praca`
FROM `projekty` p
LEFT JOIN `brygady` b ON p.`id_brygady` = b.`id_brygady`
LEFT JOIN `pracownicy` k ON p.`id_kierownika` = k.`id_pracownika`;

-- Widok: podsumowanie brygad z informacją o liderze i liczbach pracowników/projektów
DROP VIEW IF EXISTS `view_brygady_summary`;
CREATE VIEW `view_brygady_summary` AS
SELECT
  b.`id_brygady`,
  b.`nazwa_brygady`,
  b.`opis_brygady`,
  b.`lider_brygady`,
  CONCAT_WS(' ', l.`imie`, l.`nazwisko`) AS `lider_imie_nazwisko`,
  b.`aktywna`,
  b.`data_utworzenia`,
  b.`data_modyfikacji`,
  COALESCE((
    SELECT COUNT(1) FROM `pracownicy` pw WHERE pw.`id_brygady` = b.`id_brygady`
  ), 0) AS `liczba_pracownikow`,
  COALESCE((
    SELECT COUNT(1) FROM `projekty` pr WHERE pr.`id_brygady` = b.`id_brygady`
  ), 0) AS `liczba_projektow`
FROM `brygady` b
LEFT JOIN `pracownicy` l ON b.`lider_brygady` = l.`id_pracownika`;