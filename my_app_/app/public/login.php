<?php
require_once __DIR__ . '/../api/config.php';
require_once __DIR__ . '/../api/sesja.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $haslo = trim($_POST['haslo'] ?? '');
    if ($email === '' || $haslo === '') {
        $error = 'Podaj email i hasło.';
    } else {
        $stmt = $pdo->prepare('SELECT * FROM pracownicy WHERE email = :email LIMIT 1');
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user && $haslo === $user['haslo']) {
            // Zapisz wszystkie dane pracownika do sesji przez funkcję z sesja.php
            ustawDaneSesjiPracownika($user);
            header('Location: index.php');
            exit;
        } else {
            $error = 'Nieprawidłowy email lub hasło.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logowanie</title>
    <link rel="stylesheet" href="../css/index.css">
    <link rel="stylesheet" href="../css/login.css">
</head>
<body>
    <main class="login-main">
        <form method="post" class="karta login-form">
            <h2 class="login-title">Logowanie</h2>
            <?php if ($error): ?>
                <div class="login-error"> <?= htmlspecialchars($error) ?> </div>
            <?php endif; ?>
            <div class="login-group">
                <label for="email" class="login-label">Email</label>
                <input type="email" id="email" name="email" required autofocus class="login-input">
            </div>
            <div class="login-group">
                <label for="haslo" class="login-label">Hasło</label>
                <input type="password" id="haslo" name="haslo" required class="login-input">
            </div>
            <button type="submit" class="login-btn">Zaloguj się</button>
        </form>
    </main>
</body>
</html>
