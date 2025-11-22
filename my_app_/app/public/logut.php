
<?php
require_once __DIR__ . '/../api/sesja.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['potwierdz'])) {
    // Usuwanie wszystkich danych sesji
    $_SESSION = array();
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params['path'], $params['domain'],
            $params['secure'], $params['httponly']
        );
    }
    session_destroy();
    header('Location: login.php');
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['anuluj'])) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wylogowanie</title>
    <link rel="stylesheet" href="../css/index.css">
    <link rel="stylesheet" href="../css/login.css">
</head>
<body>
    <main class="login-main">
        <form method="post" class="karta login-form" style="text-align:center;">
            <h2 class="login-title">Potwierdź wylogowanie</h2>
            <p>Czy na pewno chcesz się wylogować?</p>
            <div style="display:flex; gap:16px; justify-content:center; margin-top:24px;">
                <button type="submit" name="potwierdz" class="login-btn" style="max-width:160px;">Wyloguj się</button>
                <button type="submit" name="anuluj" class="login-btn" style="background:#374151; max-width:160px;">Anuluj</button>
            </div>
        </form>
    </main>
</body>
</html>
