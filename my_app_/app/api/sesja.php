

<?php

error_log('SESSION: ' . print_r($_SESSION, true));
// plik odpowiedzialny za sesje
session_start();

// Zwraca uprawnienia użytkownika jako string (np. 'Administrator', 'Kierownik') lub null
function pobierzUprawnienia(): ?array {
	if (isset($_SESSION['user']) && is_array($_SESSION['user'])) {
		return $_SESSION['user'];
	}
	return null;
}



function ustawDaneSesjiPracownika(array $user): void {
	$_SESSION['user'] = $user;
	// Możesz dodać dodatkowe logowanie lub operacje na sesji tutaj
}

// Obsługa zapytania AJAX: ?akcja=uprawnienia
if (isset($_GET['akcja']) && $_GET['akcja'] === 'uprawnienia') {
	header('Content-Type: application/json; charset=utf-8');
	$info = pobierzUprawnienia();
	if ($info) {
		$response = [
			'status' => 'success',
			'aktywny' => $info['aktywny'] ?? null,
			'email' => $info['email'] ?? null,
			'id_brygady' => $info['id_brygady'] ?? null,
			'id_pracownika' => $info['id_pracownika'] ?? null,
			'imie' => $info['imie'] ?? null,
			'nazwisko' => $info['nazwisko'] ?? null,
			'stanowisko' => $info['stanowisko'] ?? null,
			'uprawnienia' => $info['uprawnienia'] ?? null
		];
		echo json_encode($response, JSON_UNESCAPED_UNICODE);
	} else {
		echo json_encode([
			'status' => 'error'
		], JSON_UNESCAPED_UNICODE);
	}
	exit;
}


?>