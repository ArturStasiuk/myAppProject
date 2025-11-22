






ALTER TABLE `extra_praca`
  ADD CONSTRAINT `fk_extra_praca_id_pracownika` FOREIGN KEY (`id_pracownika`) REFERENCES `pracownicy` (`id_pracownika`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_extra_praca_id_projektu` FOREIGN KEY (`id_projektu`) REFERENCES `projekty` (`id_projektu`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_extra_praca_id_zatwierdzajacego` FOREIGN KEY (`id_zatwierdzajacego`) REFERENCES `pracownicy` (`id_pracownika`) ON DELETE SET NULL ON UPDATE CASCADE;

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