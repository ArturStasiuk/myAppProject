<?php

require_once __DIR__ . '/app/api/sesja.php';

// Sprawdź, czy użytkownik jest zalogowany
if (!isset($_SESSION['user'])) {
    header('Location: app/public/login.php');
    exit;
}

$db = require __DIR__ . '/app/api/config.php';

if (isset($db) && $db instanceof PDO) {
    try {
        $db->query('SELECT 1');
        // Przekierowanie do publicznego katalogu projektu (DocumentRoot = /var/www/html)
        // Dynamiczne przekierowanie do katalogu public niezależnie od serwera/katalogu
        $base = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
        header('Location: ' . $base . '/app/public/index.php');
        exit;
    } catch (PDOException $e) {
        echo "Błąd połączenia z bazą danych: " . $e->getMessage();
    }
} else {
    echo "Błąd połączenia z bazą danych.";
}
?>