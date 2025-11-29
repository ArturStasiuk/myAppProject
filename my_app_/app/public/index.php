<?php

require_once __DIR__ . '/../api/sesja.php';

if (!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>

<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dynamiczne karty z HTML i atrybutami</title>
<?php // dynamiczne ładowanie wszystkich plików CSS z katalogu css
$cssDir = realpath(__DIR__ . '/../css');
if ($cssDir && is_dir($cssDir)) {
    foreach (glob($cssDir . '/*.css') as $cssFile) {
        $fileName = basename($cssFile);
        echo '<link rel="stylesheet" href="../css/' . $fileName . '">' . PHP_EOL;
    }
}
?>
</head>
<body>

<header id ="navBar">

</header>

<aside id="sideBar"></aside>

<main id="content"></main>

<footer id="footer">
                 <?php
    if (isset($_SESSION['user'])) {
        $user = $_SESSION['user'];
        echo '<div style="font-size: 1.1em;">';
        echo 'Użytkownik: <b>' . htmlspecialchars($user['username'] . " " ?? '') . '</b>';
      
        echo 'Uprawnienia: <b>' . htmlspecialchars($user['uprawnienia'] ." " ?? '') . '</b>';
      
    }
    ?>
</footer>

<script type="module" src="./js/module.js"></script>
<script src="./js/index.js"></script>

<script>











</script>

</body>
</html>