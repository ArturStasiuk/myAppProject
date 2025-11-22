<?php
declare(strict_types=1);
/**
 * Uniwersalne API bazy danych - zoptymalizowana wersja
 *
 * - Zachowano komentarze i przykłady funkcji (GET/ADD/UPDATE/DELETE oraz przykładowe getProject/getTasks).
 * - Zredukowano duplikację: wspólne helpery do budowy WHERE, wykonania paginowanych zapytań oraz walidacji wejścia.
 * - Bezpieczne bindowanie parametrów PDO, limit maksymalny (MAX_LIMIT) aby zapobiec dużym zapytaniom.
 *
 * Wklej plik do katalogu API i ustaw require 'config.php' (z $pdo).
 *
 * Uwaga: plik zakłada istnienie $pdo z config.php (PDO, ATTR_ERRMODE = ERRMODE_EXCEPTION).
 */
session_start();
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Brak aktywnej sesji']);
    exit;
}
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($pdo) || !($pdo instanceof PDO)) {
    respondError(500, 'Brak połączenia z bazą danych');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondError(405, 'Tylko POST');
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    respondError(400, 'Nieprawidłowy JSON: ' . json_last_error_msg());
}

if (!$input || empty($input['funkcja']) || !is_string($input['funkcja'])) {
    respondError(400, 'Brak funkcji');
}

$funkcja = $input['funkcja'];
$allowedFunctions = [
    'get','add','update','delete',
    // widoki specjalne
    'getProject','getTasks',
    'getBrygady','getDziennikPracy','getExtraPraca','getNotatkiProjektu',
    'getPracownicy','getPrzypomnienia','getProjekty'
];

if (!in_array($funkcja, $allowedFunctions, true)) {
    respondError(400, "Nieznana funkcja: $funkcja");
}

try {
    // bezpośrednie wywołanie funkcji - wszystkie funkcje mają sygnaturę (array $input, PDO $pdo)
    call_user_func($funkcja, $input, $pdo);
} catch (Throwable $e) {
    error_log("Unhandled Exception in $funkcja: " . $e->getMessage());
    respondError(500, 'Błąd serwera: ' . $e->getMessage());
}

/* ============================
   Helpery: odpowiedzi / walidacja / wykonywanie zapytań
   ============================ */

function respondError(int $code, string $message): void {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function respondSuccess(int $code, array $data = []): void {
    http_response_code($code);
    echo json_encode(array_merge(['status' => 'success'], $data), JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Walidacja nazwy tabeli (do operacji uniwersalnych)
 */
function validateTable(array $input): string {
    if (!isset($input['tabela']) || !is_string($input['tabela']) || $input['tabela'] === '') {
        respondError(400, 'Brak nazwy tabeli');
    }
    if (!preg_match('/^[A-Za-z0-9_]+$/', $input['tabela'])) {
        respondError(400, 'Nieprawidłowa nazwa tabeli');
    }
    return $input['tabela'];
}

/**Pobierz kolumny tabeli (używane przez CRUD uniwersalny)
 * 
 * Zwraca: tablica kolumn => true
 */
function getTableColumnsMap(string $tabela, PDO $pdo): array {
    $sql = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':table' => $tabela]);
    $cols = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
    if (!$cols) respondError(404, "Tabela nie istnieje: $tabela");
    $map = [];
    foreach ($cols as $c) $map[$c] = true;
    return $map;
}

/**Buduje pojedynczy WHERE fragment (obsługuje scalar, array->IN i tryby LIKE)
 * 
 * - $intCols: lista kolumn traktowanych jako integer (porównanie =)
 * - Zwraca tuple: [whereSql:string, params:array]
 */
function buildWhereForColumn(string $column, $value, string $mode, array $intCols): array {
    $params = [];
    $parts = [];
    $idx = 0;

    if (is_array($value)) {
        $placeholders = [];
        foreach ($value as $v) {
            $ph = ":w{$idx}";
            $placeholders[] = $ph;
            $params[$ph] = in_array($column, $intCols, true) ? (int)$v : (string)$v;
            $idx++;
        }
        $parts[] = sprintf('`%s` IN (%s)', $column, implode(', ', $placeholders));
    } else {
        if (in_array($column, $intCols, true)) {
            $ph = ":w{$idx}";
            $params[$ph] = (int)$value;
            $parts[] = sprintf('`%s` = %s', $column, $ph);
            $idx++;
        } else {
            $ph = ":w{$idx}";
            if ($mode === 'exact') {
                $params[$ph] = (string)$value;
                $parts[] = sprintf('`%s` = %s', $column, $ph);
            } elseif ($mode === 'starts') {
                $params[$ph] = (string)$value . '%';
                $parts[] = sprintf('`%s` LIKE %s', $column, $ph);
            } else { // contains
                $params[$ph] = '%' . (string)$value . '%';
                $parts[] = sprintf('`%s` LIKE %s', $column, $ph);
            }
            $idx++;
        }
    }

    $where = 'WHERE ' . implode(' AND ', $parts);
    return [$where, $params];
}

/**Wykonuje zapytanie SELECT z paginacją i równoległym zapytaniem COUNT
 * 
 * - $tableOrView: nazwa tabeli/widoku
 * - $whereSql: "WHERE ..." (może być pusty string)
 * - $params: parametry PDO (placeholder => value)
 * - $orderBy: klauzula ORDER BY (np. "ORDER BY id DESC") lub empty
 * - $limit, $offset: int
 * - Zwraca [rows, total]
 */
function executePagedSelect(PDO $pdo, string $tableOrView, string $whereSql, array $params, string $orderBy, int $limit, int $offset, array $columns = []): array {
    // zabezpieczenia
    $MAX_LIMIT = 1000;
    if ($limit < 1) $limit = 1;
    if ($limit > $MAX_LIMIT) $limit = $MAX_LIMIT;
    if ($offset < 0) $offset = 0;

    $orderSql = $orderBy ? " $orderBy " : ' ';
    // obsługa wyboru kolumn
    if (is_array($columns) && count($columns) > 0) {
        $selectCols = implode(', ', array_map(function($c) { return "`$c`"; }, $columns));
    } else {
        $selectCols = '*';
    }
    $selectSql = "SELECT $selectCols FROM `$tableOrView` $whereSql $orderSql LIMIT :lim OFFSET :off";
    $stmt = $pdo->prepare($selectSql);

    // bind dynamic params
    foreach ($params as $ph => $val) {
        if (is_int($val) || (is_string($val) && ctype_digit($val))) {
            $stmt->bindValue($ph, (int)$val, PDO::PARAM_INT);
        } else {
            $stmt->bindValue($ph, (string)$val, PDO::PARAM_STR);
        }
    }
    $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // count
    $countSql = "SELECT COUNT(1) FROM `$tableOrView` $whereSql";
    $countStmt = $pdo->prepare($countSql);
    foreach ($params as $ph => $val) {
        if (is_int($val) || (is_string($val) && ctype_digit($val))) {
            $countStmt->bindValue($ph, (int)$val, PDO::PARAM_INT);
        } else {
            $countStmt->bindValue($ph, (string)$val, PDO::PARAM_STR);
        }
    }
    $countStmt->execute();
    $total = (int)$countStmt->fetchColumn(0);

    return [$rows, $total, $selectSql];
}

/**
 * Sprawdza flagę force_all w dodatkowe (zakaz UPDATE/DELETE bez WHERE chyba że force_all=true)
 */
function checkForceAll(array $input, array $whereParts, string $operation): void {
    $forceAll = isset($input['dodatkowe']['force_all']) && (bool)$input['dodatkowe']['force_all'];
    if (count($whereParts) === 0 && !$forceAll) {
        respondError(400, "$operation bez WHERE zabroniony (użyj dodatkowe.force_all=true)");
    }
}



/* GET - Pobiera rekordy z tabeli
Aby pobrać z wybranej tabeli rekord o konkretnym id i tylko wybraną kolumnę, wyślij zapytanie w formacie:
 {
  "funkcja": "get",
  "tabela": "nazwa_tabeli",
  "filter": {
    "id": 123
  },
  "dane": {
    "columns": ["nazwa_kolumny"]
  }
}
 */
function get(array $input, PDO $pdo): void {
    try {
        $tabela = validateTable($input);
        $colsMap = getTableColumnsMap($tabela, $pdo);

        $filter = $input['filter'] ?? [];
        if (!is_array($filter)) $filter = [];

        // build WHERE (obsługa IN i prostych porównań)
        $params = [];
        $whereParts = [];
        $idx = 0;
        foreach ($filter as $col => $val) {
            if (!isset($colsMap[$col])) continue;
            if (is_array($val)) {
                $phs = [];
                foreach ($val as $v) {
                    $ph = ":f{$idx}";
                    $phs[] = $ph;
                    $params[$ph] = $v;
                    $idx++;
                }
                $whereParts[] = "`$col` IN (" . implode(', ', $phs) . ")";
            } else {
                $ph = ":f{$idx}";
                $whereParts[] = "`$col` = $ph";
                $params[$ph] = $val;
                $idx++;
            }
        }
        $whereSql = count($whereParts) ? 'WHERE ' . implode(' AND ', $whereParts) : '';

        // sortowanie/limit/offset
        $orderBy = '';
        if (isset($input['dane']['order_by']) && isset($colsMap[$input['dane']['order_by']])) {
            $dir = (isset($input['dane']['order_dir']) && strtoupper($input['dane']['order_dir']) === 'DESC') ? 'DESC' : 'ASC';
            $orderBy = "ORDER BY `{$input['dane']['order_by']}` $dir";
        }
        $limit = isset($input['dane']['limit']) && is_numeric($input['dane']['limit']) ? (int)$input['dane']['limit'] : 100;
        $offset = isset($input['dane']['offset']) && is_numeric($input['dane']['offset']) ? (int)$input['dane']['offset'] : 0;

        [$rows, $total, $query] = executePagedSelect($pdo, $tabela, $whereSql, $params, $orderBy, $limit, $offset);

        respondSuccess(200, [
            'data' => $rows,
            'meta' => [
                'count' => count($rows),
                'total' => $total,
                'query' => $query,
                'dodatkowe' => $input['dodatkowe'] ?? null
            ]
        ]);
    } catch (PDOException $e) {
        error_log('PDO Exception in get: ' . $e->getMessage());
        respondError(500, 'Błąd bazy danych');
    }
}

/**ADD - Dodaje nowy rekord do tabeli
 * 
 * Przykład:
 * {
 *   "funkcja": "add",
 *   "tabela": "projekty",
 *   "dane": { "nazwa_projektu": "Nowy", "notatka": "..." }
 * }
 */
function add(array $input, PDO $pdo): void {
    try {
        $tabela = validateTable($input);
        $colsMap = getTableColumnsMap($tabela, $pdo);
        if (!isset($input['dane']) || !is_array($input['dane']) || count($input['dane']) === 0) {
            respondError(400, "Brak danych do zapisu w kluczu 'dane'");
        }

        $cols = [];
        $placeholders = [];
        $params = [];
        $i = 0;
        foreach ($input['dane'] as $col => $val) {
            if (!isset($colsMap[$col])) continue;
            $cols[] = "`$col`";
            $ph = ":p{$i}";
            $placeholders[] = $ph;
            $params[$ph] = $val;
            $i++;
        }
        if (count($cols) === 0) respondError(400, "Brak prawidłowych kolumn do wstawienia");

        $sql = "INSERT INTO `$tabela` (" . implode(', ', $cols) . ") VALUES (" . implode(', ', $placeholders) . ")";
        $pdo->beginTransaction();
        $stmt = $pdo->prepare($sql);
        foreach ($params as $ph => $v) $stmt->bindValue($ph, $v);
        $stmt->execute();
        $lastId = (int)$pdo->lastInsertId();
        $pdo->commit();

        respondSuccess(201, ['insert_id' => $lastId, 'query' => $sql, 'dodatkowe' => $input['dodatkowe'] ?? null]);
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        error_log('PDO Exception in add: ' . $e->getMessage());
        respondError(500, 'Błąd bazy danych: ' . $e->getMessage());
    }
}

/**UPDATE - Aktualizuje rekordy
 * 
 * Przykład:
  {
    "funkcja": "update",
   "tabela": "zadania",
    "dane": { "status_zadania": 1 },
   "filter": { "id_projektu": 5 }
  }
 */
function update(array $input, PDO $pdo): void {
    try {
        $tabela = validateTable($input);
        $colsMap = getTableColumnsMap($tabela, $pdo);

        if (!isset($input['dane']) || !is_array($input['dane']) || count($input['dane']) === 0) {
            respondError(400, "Brak danych do zapisu w kluczu 'dane'");
        }

        $setParts = [];
        $params = [];
        $i = 0;
        foreach ($input['dane'] as $col => $val) {
            if (!isset($colsMap[$col])) continue;
            $ph = ":s{$i}";
            $setParts[] = "`$col` = $ph";
            $params[$ph] = $val;
            $i++;
        }
        if (count($setParts) === 0) respondError(400, "Brak prawidłowych kolumn do aktualizacji");

        // where
        $whereParts = buildWhereClauseGeneric($input['filter'] ?? [], $colsMap, $params);
        checkForceAll($input, $whereParts, 'UPDATE');

        $whereSql = count($whereParts) ? 'WHERE ' . implode(' AND ', $whereParts) : '';
        $sql = "UPDATE `$tabela` SET " . implode(', ', $setParts) . " $whereSql";

        $pdo->beginTransaction();
        $stmt = $pdo->prepare($sql);
        foreach ($params as $ph => $v) {
            $stmt->bindValue($ph, $v);
        }
        $stmt->execute();
        $affected = $stmt->rowCount();
        $pdo->commit();

        respondSuccess(200, ['affected' => $affected, 'query' => $sql, 'dodatkowe' => $input['dodatkowe'] ?? null]);
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        error_log('PDO Exception in update: ' . $e->getMessage());
        respondError(500, 'Błąd bazy danych');
    }
}


/**DELETE - Usuwa rekordy
 * 
 * Przykład:
  {
    "funkcja": "delete",
    "tabela": "zadania",
    "filter": { "id_zadania": [10,11] }
  }
 */
function delete(array $input, PDO $pdo): void {
    try {
        $tabela = validateTable($input);
        $colsMap = getTableColumnsMap($tabela, $pdo);

        $params = [];
        $whereParts = buildWhereClauseGeneric($input['filter'] ?? [], $colsMap, $params);
        checkForceAll($input, $whereParts, 'DELETE');

        $whereSql = count($whereParts) ? 'WHERE ' . implode(' AND ', $whereParts) : '';
        $sql = "DELETE FROM `$tabela` $whereSql";

        $pdo->beginTransaction();
        $stmt = $pdo->prepare($sql);
        foreach ($params as $ph => $v) $stmt->bindValue($ph, $v);
        $stmt->execute();
        $affected = $stmt->rowCount();
        $pdo->commit();

        respondSuccess(200, ['deleted' => $affected, 'message' => "Usunięto $affected rekord(ów)", 'query' => $sql, 'dodatkowe' => $input['dodatkowe'] ?? null]);
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        error_log('PDO Exception in delete: ' . $e->getMessage());
        respondError(500, 'Błąd bazy danych: ' . $e->getMessage());
    }
}

/* Helper dla uniwersalnego build WHERE (filter) - obsługuje IN i proste porównania */
function buildWhereClauseGeneric($filter, array $colsMap, array &$params): array {
    $whereParts = [];
    $idx = 0;
    if (isset($filter) && is_array($filter)) {
        foreach ($filter as $col => $value) {
            if (!isset($colsMap[$col])) continue;
            if (is_array($value)) {
                $phs = [];
                foreach ($value as $v) {
                    $ph = ":g{$idx}";
                    $phs[] = $ph;
                    $params[$ph] = $v;
                    $idx++;
                }
                $whereParts[] = "`$col` IN (" . implode(', ', $phs) . ")";
            } else {
                $ph = ":g{$idx}";
                $whereParts[] = "`$col` = $ph";
                $params[$ph] = $value;
                $idx++;
            }
        }
    }
    return $whereParts;
}

/* Specjalne funkcje dla widoków (getProject, getTasks, getBrygady, ...)
   
   - Zachowano komentarze i przykłady jak wcześniej
   ============================ */

/**getProject - wyszukiwanie w widoku view_project_summary
 * 
 *
 * Wejście (POST JSON) - przykład:
 * {
 *   "funkcja": "getProject",
 *   "column": "id_projektu" | "nazwa_projektu" | "adres_projektu",
 *   "value": "12" | "Warszawa" | "Budowa",
 *   "mode": "exact" | "contains" | "starts",
 *   "limit": 50,
 *   "offset": 0
 * }
 */
function getProject(array $input, PDO $pdo): void {
    $allowed = [
        'id_projektu',
        'nazwa_projektu',
        'adres_projektu',
        'planowane_rozpoczecie',
        'planowane_zakonczenie',
        'przypomnij_rozpoczecie',
        'przypomnij_zakonczenie',
        'data_rozpoczecia',
        'data_zakonczenia',
        'notatka',
        'stan_projektu',
        'status_projektu',
        'zadania_wykonane',
        'zadania_niewykonane',
        'extra_praca_count'
    ];
    $intCols = [
        'id_projektu',
        'zadania_wykonane',
        'zadania_niewykonane',
        'extra_praca_count'
    ]; // stan_projektu i status_projektu są tekstowe
    genericViewFetcher($input, $pdo, 'view_project_summary', $allowed, $intCols, 'ORDER BY `id_projektu`');
}

/**getTasks - pobiera zadania z widoku view_zadania_full
 * 
 *
 * Wejście (POST JSON) - przykład:
 * {
 *   "funkcja": "getTasks",
 *   "column": "id_projektu" | "nazwa_projektu" | "tytul_zadania" | "id_pracownika" | "status_zadania",
 *   "value": "5" | "Budowa" | ["1","2","3"],
 *   "mode": "exact" | "contains" | "starts",
 *   "limit": 50,
 *   "offset": 0
 * }
 * {Otrzymasz tylko tytuł i opis zadań, posortowane wg statusu i priorytetu. Jeśli chcesz inne kolumny lub inne sortowanie, zmień odpowiednio columns i order.
  "funkcja": "getTasks",
  "column": "id_projektu",
  "value": "5",
  "mode": "exact",
  "limit": 100,
  "offset": 0,
  "dane": {
    "columns": ["tytul_zadania", "opis_zadania"],
    "order": "status_priorytet"
  }
}
Jeśli chcesz pobrać tylko wybrane kolumny, możesz dodać sekcję "dane": { "columns": [...] }, ale domyślnie bez niej otrzymasz wszystkie dostępne kolumny dla tego widoku
{
  "funkcja": "getTasks",
  "column": "id_zadania",
  "value": 123,           // tutaj podaj konkretne id_zadania
  "mode": "exact",
  "limit": 1,
  "offset": 0
}


 */
function getTasks(array $input, PDO $pdo): void {
    $allowed = [
        'id_zadania','id_projektu','nazwa_projektu','tytul_zadania','opis_zadania','notatka',
        'data_rozpoczecia','data_zakonczenia','planowana_data_zakonczenia','status_zadania',
        'priorytet','przypomnij_rozpoczecie','id_pracownika','pracownik','procent_wykonania',
        'data_utworzenia','data_modyfikacji'
    ];
    $intCols = ['id_zadania','id_projektu','id_pracownika','status_zadania','procent_wykonania'];
    genericViewFetcher($input, $pdo, 'view_zadania_full', $allowed, $intCols, 'ORDER BY `id_zadania` DESC');
}


/* getBrygady 
 "funkcja": "getBrygady",
 "column": "w kolumnie"| "drugaKolumna",
  "value": ["wartosc", "Kierownik"],
  "mode": "exact",
  "limit": 100,
  "offset": 0

*/
function getBrygady(array $input, PDO $pdo): void {
    $allowed = ['id_brygady','nazwa_brygady','lider_brygady','aktywna'];
    $intCols = ['id_brygady','lider_brygady','aktywna'];
    genericViewFetcher($input, $pdo, 'view_brygady_summary', $allowed, $intCols, 'ORDER BY `id_brygady` DESC');
}

/** getDziennikPracy - view_dziennik_pracy_full */
function getDziennikPracy(array $input, PDO $pdo): void {
    $allowed = ['id_dziennik','id_projektu','id_pracownika','data_pracy','zatwierdzone','id_zatwierdzajacego'];
    $intCols = ['id_dziennik','id_projektu','id_pracownika','zatwierdzone','id_zatwierdzajacego'];
    genericViewFetcher($input, $pdo, 'view_dziennik_pracy_full', $allowed, $intCols, 'ORDER BY `data_pracy` DESC, `id_dziennik` DESC');
}

/** getExtraPraca - view_extra_praca_full */
function getExtraPraca(array $input, PDO $pdo): void {
    $allowed = ['id_extra_praca','id_projektu','id_pracownika','zatwierdzona','data_rozpoczecia','data_zakonczenia'];
    $intCols = ['id_extra_praca','id_projektu','id_pracownika','zatwierdzona'];
    genericViewFetcher($input, $pdo, 'view_extra_praca_full', $allowed, $intCols, 'ORDER BY `data_rozpoczecia` DESC, `id_extra_praca` DESC');
}

/** getNotatkiProjektu - view_notatki_projektu_full */
function getNotatkiProjektu(array $input, PDO $pdo): void {
    $allowed = ['id_notatki','id_projektu','tytul_notatki','typ_notatki','priorytet','id_autora','id_adresata','publiczna'];
    $intCols = ['id_notatki','id_projektu','id_autora','id_adresata','publiczna'];
    genericViewFetcher($input, $pdo, 'view_notatki_projektu_full', $allowed, $intCols, 'ORDER BY `data_utworzenia` DESC, `id_notatki` DESC');
}

/** getPracownicy - view_pracownicy_full 
  "funkcja": "getPracownicy",
  "column": "stanowisko",
  "value": ["Lider", "Kierownik"],
  "mode": "exact",
  "limit": 100,
  "offset": 0
  Aby pobrać dane tylko z kolumn: id_pracownika, imie, nazwisko, stanowisko, id_brygady, na podstawie podania id_brygady oraz czy pracownik jest aktywny,
  {
  "funkcja": "getPracownicy",
  "column": "id_brygady",
  "value": 5,                // tutaj podaj konkretne id_brygady
  "mode": "exact",
  "limit": 100,
  "offset": 0,
  "dane": {
    "columns": ["id_pracownika", "imie", "nazwisko", "stanowisko", "id_brygady"]
  },
  "filter": {
    "aktywny": 1             // 1 = aktywny, 0 = nieaktywny
  }
}
*/
function getPracownicy(array $input, PDO $pdo): void {
    $allowed = ['id_pracownika','imie','nazwisko','email','id_brygady','aktywny','uprawnienia','stanowisko'];
    $intCols = ['id_pracownika','id_brygady','aktywny','stanowisko'];
    genericViewFetcher($input, $pdo, 'view_pracownicy_full', $allowed, $intCols, 'ORDER BY `id_pracownika` DESC');
}

/** getPrzypomnienia - view_przypomnienia_full */
function getPrzypomnienia(array $input, PDO $pdo): void {
    $allowed = ['id_przypomnienia','id_pracownika','id_utworzyl','typ_przypomnienia','status','powtarzaj','priorytet'];
    $intCols = ['id_przypomnienia','id_pracownika','id_utworzyl'];
    genericViewFetcher($input, $pdo, 'view_przypomnienia_full', $allowed, $intCols, 'ORDER BY `data_przypomnienia` DESC, `id_przypomnienia` DESC');
}

/* getProjekty - view_projekty_full 
zwróci wszystkie kolumny z widoku dla danego projektu o id_projektu = 123
  "funkcja": "getProjekty",
  "column": "nazwa_projektu",
  "value": "Budowa",
  "mode": "contains",
  "limit": 50,
  "offset": 0

  
*/
function getProjekty(array $input, PDO $pdo): void {
    $allowed = ['id_projektu','nazwa_projektu','adres_projektu','id_brygady','id_kierownika','stan_projektu','status_projektu','ukryj_projekt'];
    $intCols = ['id_projektu','id_brygady','id_kierownika','ukryj_projekt'];
    genericViewFetcher($input, $pdo, 'view_projekty_full', $allowed, $intCols, 'ORDER BY `id_projektu` DESC');
}

/**Generic fetcher dla widoków - konsoliduje logikę walidacji kolumn, budowy WHERE, paginacji i wykonania zapytania.
 * 
 *
 * Input:
 *  - column (string) - nazwa kolumny do wyszukiwania (wybrana z $allowed)
 *  - value  - wartość scalar lub array (dla IN)
 *  - mode   - exact|contains|starts (dla kolumn tekstowych)
 *  - limit, offset
 */
function genericViewFetcher(array $input, PDO $pdo, string $viewName, array $allowed, array $intCols, string $defaultOrderBy = ''): void {
    $column = $input['column'] ?? '';
    $value = $input['value'] ?? null;
    $mode = $input['mode'] ?? 'contains';
    $limit = isset($input['limit']) ? (int)$input['limit'] : 100;
    $offset = isset($input['offset']) ? (int)$input['offset'] : 0;
    // obsługa columns i sortowania
    $columnsRequested = $input['dane']['columns'] ?? null;
    $customOrder = $input['dane']['order'] ?? null;
    $orderByCol = $input['dane']['order_by'] ?? null;
    $orderDir = isset($input['dane']['order_dir']) && strtoupper($input['dane']['order_dir']) === 'DESC' ? 'DESC' : 'ASC';

    if ($column === '' || !in_array($column, $allowed, true)) {
        respondError(400, 'Nieprawidłowa lub brak kolumny wyszukiwania. Dozwolone: ' . implode(', ', $allowed));
    }
    if ($value === null || $value === '' || (is_array($value) && count($value) === 0)) {
        respondError(400, 'Wartość wyszukiwania nie może być pusta.');
    }
    if ($limit < 1) $limit = 1;
    if ($offset < 0) $offset = 0;

    // walidacja columns
    $columns = [];
    if ($columnsRequested !== null) {
        if (!is_array($columnsRequested) || count($columnsRequested) === 0) {
            respondError(400, 'dane.columns musi być tablicą niepustą');
        }
        foreach ($columnsRequested as $c) {
            if (!in_array($c, $allowed, true)) {
                respondError(400, "Nieprawidłowa kolumna w dane.columns: $c");
            }
            $columns[] = $c;
        }
    }

    // sortowanie specjalne
    $orderBySql = $defaultOrderBy;
    if ($customOrder === 'status_priorytet') {
        $orderBySql = "ORDER BY `status_zadania` ASC, FIELD(`priorytet`, 'Krytyczny','Wysoki','Normalny','Niski') ASC";
    } elseif ($orderByCol !== null) {
        if (!in_array($orderByCol, $allowed, true)) {
            respondError(400, 'Nieprawidłowa kolumna w dane.order_by');
        }
        $orderBySql = "ORDER BY `{$orderByCol}` $orderDir";
    }

    try {
    [$whereSql, $params] = buildWhereForColumn($column, $value, $mode, $intCols);
    [$rows, $total, $query] = executePagedSelect($pdo, $viewName, $whereSql, $params, $orderBySql, $limit, $offset, $columns);

        respondSuccess(200, [
            'data' => $rows,
            'total' => $total,
            'meta' => [
                'column' => $column,
                'mode' => $mode,
                'limit' => $limit,
                'offset' => $offset,
                'query' => $query
            ]
        ]);
    } catch (PDOException $e) {
        error_log("PDO Exception in genericViewFetcher($viewName): " . $e->getMessage());
        respondError(500, "Błąd bazy danych podczas pobierania z widoku $viewName");
    }
}