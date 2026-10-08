<?php
/**
 * =========================================================================
 * FILE: backend.php
 * Backend Logic (PHP + MariaDB / MySQLi OOP)
 * Target Domain: 16395.local
 * =========================================================================
 */

// 1. Inisialisasi Variabel Status & Data
$db_connected = false;
$db_status_msg = '';
$top_scores = [];

// Parameter Koneksi Database MariaDB
$db_host = 'localhost';
$db_user = 'user_16395';
$db_pass = 'password123';
$db_name = 'db_16395';

// 2. Koneksi MySQLi OOP
mysqli_report(MYSQLI_REPORT_OFF);
$mysqli = @new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($mysqli->connect_errno) {
    // Coba fallback ke default root XAMPP tanpa password jika user_16395 belum dikonfigurasi
    $fallback_mysqli = @new mysqli('localhost', 'root', '', $db_name);
    if (!$fallback_mysqli->connect_errno) {
        $mysqli = $fallback_mysqli;
        $db_connected = true;
        $db_status_msg = "Koneksi ke database '{$db_name}' berhasil (via fallback root).";
        $mysqli->set_charset("utf8mb4");
    } else {
        $db_connected = false;
        $db_status_msg = "Koneksi database gagal: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    }
} else {
    $db_connected = true;
    $db_status_msg = "Koneksi ke database '{$db_name}' berhasil (user: {$db_user}).";
    $mysqli->set_charset("utf8mb4");
}

// 3. Handler POST untuk Menyimpan Skor Baru (Prepared Statements anti-SQL Injection)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Membaca input (mendukung Form-encoded standar maupun JSON payload)
    $raw_json = file_get_contents('php://input');
    $json_data = json_decode($raw_json, true);

    $raw_name = $json_data['player_name'] ?? $_POST['player_name'] ?? '';
    $raw_score = $json_data['score'] ?? $_POST['score'] ?? null;

    // Sanitasi input
    $player_name = trim(strip_tags((string)$raw_name));
    $score = filter_var($raw_score, FILTER_VALIDATE_INT);

    // Deteksi apakah request berasal dari Fetch/AJAX JSON
    $is_json_request = (
        (isset($_SERVER['CONTENT_TYPE']) && stripos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) ||
        (isset($_GET['action']) && $_GET['action'] === 'save_score') ||
        !empty($json_data)
    );

    if (!$db_connected) {
        if ($is_json_request) {
            header('Content-Type: application/json; charset=UTF-8');
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $db_status_msg]);
            exit;
        }
    } elseif ($player_name === '' || $score === false || $score < 0) {
        if ($is_json_request) {
            header('Content-Type: application/json; charset=UTF-8');
            http_response_code(422);
            echo json_encode([
                'status' => 'error', 
                'message' => 'Data tidak valid: Nama tidak boleh kosong dan skor harus angka bulat >= 0.'
            ]);
            exit;
        }
    } else {
        // Batasi panjang string nama maksimal 50 karakter
        $player_name = mb_substr($player_name, 0, 50);

        // Eksekusi Prepared Statement
        $stmt = $mysqli->prepare("INSERT INTO leaderboard (player_name, score) VALUES (?, ?)");
        if ($stmt) {
            $stmt->bind_param("si", $player_name, $score);
            if ($stmt->execute()) {
                $new_id = $stmt->insert_id;
                $stmt->close();

                if ($is_json_request) {
                    header('Content-Type: application/json; charset=UTF-8');
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Skor berhasil disimpan!',
                        'id' => $new_id,
                        'player_name' => $player_name,
                        'score' => $score
                    ]);
                    exit;
                }
            } else {
                $err = $stmt->error;
                $stmt->close();
                if ($is_json_request) {
                    header('Content-Type: application/json; charset=UTF-8');
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan data: ' . $err]);
                    exit;
                }
            }
        } else {
            if ($is_json_request) {
                header('Content-Type: application/json; charset=UTF-8');
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Gagal menyiapkan query: ' . $mysqli->error]);
                exit;
            }
        }
    }
}

// 4. Query SELECT Data Top 10 Highscore
if ($db_connected) {
    $sql_top10 = "SELECT id, player_name, score, created_at FROM leaderboard ORDER BY score DESC, created_at ASC LIMIT 10";
    $result = $mysqli->query($sql_top10);

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $top_scores[] = [
                'id'          => (int)$row['id'],
                'player_name' => $row['player_name'],
                'score'       => (int)$row['score'],
                'created_at'  => $row['created_at']
            ];
        }
        $result->free();
    }
}

// 5. Endpoint JSON saat dipanggil via AJAX GET (?action=get_leaderboard)
if (isset($_GET['action']) && $_GET['action'] === 'get_leaderboard') {
    header('Content-Type: application/json; charset=UTF-8');
    if (!$db_connected) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $db_status_msg, 'data' => []]);
    } else {
        echo json_encode(['status' => 'success', 'data' => $top_scores]);
    }
    exit;
}
