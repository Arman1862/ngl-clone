/**
 * Variabel Global untuk Nama Sheet.
 * PASTIKAN nama sheet di Spreadsheet kamu sama persis!
 * Users: Menyimpan data akun (UserID, LoginKey, NamaTampilan)
 * PesanAnonim: Menyimpan semua pesan masuk
 */
var sheetPesan = 'PesanAnonim';
var sheetUsers = 'Users';
var scriptProp = PropertiesService.getScriptProperties();

// --- Fungsi Pembantu (Helper Functions) ---

/**
 * Membuat respons JSON yang seragam.
 */
function createJSONResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Mengambil sheet berdasarkan nama. Jika tidak ada, dibuatkan dengan header.
 */
function getOrCreateSheet(doc, sheetName, headers) {
  var sheet = doc.getSheetByName(sheetName);
  if (!sheet) {
    sheet = doc.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
    }
  }
  return sheet;
}

/**
 * Mencari data di sheet tertentu berdasarkan nilai kolom.
 * @returns {Array} Baris data yang cocok atau null.
 */
function findRowByValue(sheet, columnIndex, value) {
  if (!sheet) return null;
  var data = sheet.getDataRange().getValues();
  // Mulai dari baris 1 (setelah header)
  for (var i = 1; i < data.length; i++) {
    // Bandingkan dengan lowercase untuk case-insensitive
    var existingValue = data[i][columnIndex] ? data[i][columnIndex].toString().toLowerCase() : '';
    if (existingValue === value.toString().toLowerCase()) {
      return data[i]; // Kembalikan seluruh baris
    }
  }
  return null;
}

/**
 * Mencari data di sheet tertentu berdasarkan nilai dan kunci login.
 * @returns {Array} Baris data yang cocok atau null.
 */
function findUserByCredentials(sheet, userId, loginKey) {
  if (!sheet) return null;
  var data = sheet.getDataRange().getValues();
  // Mulai dari baris 1 (setelah header)
  for (var i = 1; i < data.length; i++) {
    var existingUserId = data[i][0] ? data[i][0].toString() : ''; // Kolom 0: UserID
    var existingLoginKey = data[i][1] ? data[i][1].toString() : ''; // Kolom 1: LoginKey
    
    // Bandingkan UserID (case-insensitive) dan LoginKey (case-sensitive)
    if (existingUserId.toLowerCase() === userId.toLowerCase() && existingLoginKey === loginKey) {
      return data[i]; // Kembalikan seluruh baris user
    }
  }
  return null;
}

// --- Logika Registrasi (Action 'register') ---

function registerUser(e, doc) {
  var userId = e.parameter.userId ? e.parameter.userId.trim() : null;
  var namaTampilan = e.parameter.namaTampilan ? e.parameter.namaTampilan.trim() : null;
  
  if (!userId || !namaTampilan) {
    return createJSONResponse({ 'result': 'error', 'message': 'UserID dan Nama Tampilan wajib diisi.' });
  }
  
  var sheet = getOrCreateSheet(doc, sheetUsers, ['UserID', 'LoginKey', 'NamaTampilan']);
  
  // Kolom 0 adalah UserID
  if (findRowByValue(sheet, 0, userId)) {
    return createJSONResponse({ 'result': 'error', 'message': 'UserID "' + userId + '" sudah digunakan. Silakan coba yang lain.' });
  }
  
  // Generate LoginKey (Kunci Rahasia)
  var loginKey = Utilities.getUuid(); 
  
  // Simpan Data
  var newRow = [
    userId,        
    loginKey,      
    namaTampilan    
  ];
  
  sheet.appendRow(newRow);
  
  // Respons Sukses
  return createJSONResponse({ 
    'result': 'success', 
    'message': 'Pendaftaran berhasil. Silakan simpan LoginKey Anda!',
    'data': {
      'userId': userId,
      'loginKey': loginKey // Kunci rahasia dikembalikan
    }
  });
}

// --- Logika Kirim Pesan (Action 'send') ---

function sendPesanAnonim(e, doc) {
  var pesan = e.parameter.pesan ? e.parameter.pesan.trim() : null;
  var pengirim = e.parameter.pengirim ? e.parameter.pengirim.trim() : 'Anonim';
  var recipientId = e.parameter.recipientId ? e.parameter.recipientId.trim() : null;

  if (!pesan || !recipientId) {
    return createJSONResponse({ 'result': 'error', 'message': 'Pesan dan ID Penerima wajib diisi.' });
  }

  // VALIDASI KRUSIAL: Cek apakah RecipientID ada
  var userSheet = getOrCreateSheet(doc, sheetUsers, ['UserID', 'LoginKey', 'NamaTampilan']);
  // Kolom 0 adalah UserID
  if (!findRowByValue(userSheet, 0, recipientId)) {
    return createJSONResponse({ 'result': 'error', 'message': 'ID Penerima tidak ditemukan.' });
  }

  // Simpan Pesan
  var pesanSheet = getOrCreateSheet(doc, sheetPesan, ['Tanggal', 'Pesan', 'Pengirim', 'RecipientID']);
  
  var newRow = [
    new Date(),
    pesan,
    pengirim,
    recipientId // Kunci untuk filtering
  ];

  pesanSheet.appendRow(newRow);

  return createJSONResponse({ 'result': 'success', 'message': 'Pesan berhasil dikirim.', 'recipient': recipientId });
}

// --- Fungsi Utama Web App Setup & Dispatch ---

/**
 * Fungsi ini HARUS dijalankan satu kali di Apps Script Editor
 * sebelum di-deploy, untuk menyimpan ID Spreadsheet.
 */
function initialSetup() {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Inisialisasi kedua sheet agar memiliki header jika belum ada
  getOrCreateSheet(activeSpreadsheet, sheetUsers, ['UserID', 'LoginKey', 'NamaTampilan']);
  getOrCreateSheet(activeSpreadsheet, sheetPesan, ['Tanggal', 'Pesan', 'Pengirim', 'RecipientID']);
  
  scriptProp.setProperty('key', activeSpreadsheet.getId());
  Logger.log('ID Spreadsheet berhasil disimpan!');
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    var action = e.parameter.action; 

    if (action === 'register') {
      return registerUser(e, doc);
    }
    
    if (action === 'send') {
      return sendPesanAnonim(e, doc); 
    }

    // Default jika action tidak valid atau tidak ada
    return createJSONResponse({ 'result': 'error', 'message': 'Aksi POST tidak valid atau tidak dikenali.' });

  } catch (e) {
    Logger.log("Error details (doPost): " + e.message + " Stack: " + e.stack);
    return createJSONResponse({ 'result': 'error', 'message': 'Terjadi kesalahan server saat POST.' });
  } finally {
    lock.releaseLock();
  }
}

// --- Logika Login & Filter Pesan (doGet) ---

function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    var userId = e.parameter.userId;
    var loginKey = e.parameter.loginKey;
    
    // --- 1. OTENTIKASI ---
    var userSheet = doc.getSheetByName(sheetUsers);
    var userRow = findUserByCredentials(userSheet, userId, loginKey);
    
    if (!userRow) {
        return createJSONResponse({ 'result': 'error', 'message': 'Kredensial Login tidak valid.' });
    }
    
    // Data user yang terautentikasi: [UserID, LoginKey, NamaTampilan]
    var userProfile = {
        userId: userRow[0],
        namaTampilan: userRow[2]
    };

    // --- 2. FILTER PESAN ---
    var pesanSheet = doc.getSheetByName(sheetPesan);
    var messages = [];

    if (pesanSheet) {
        var dataRange = pesanSheet.getDataRange();
        var values = dataRange.getValues();
        
        // Header: [Tanggal, Pesan, Pengirim, RecipientID]
        var header = values.length > 0 ? values[0] : [];
        var recipientIdIndex = header.indexOf('RecipientID'); // Kolom ke-3

        // Mulai dari baris 1 (setelah header)
        for (var i = 1; i < values.length; i++) {
            var row = values[i];
            
            // Bandingkan RecipientID di baris pesan dengan UserID yang sedang login
            if (row[recipientIdIndex] && row[recipientIdIndex].toString().toLowerCase() === userProfile.userId.toLowerCase()) {
                messages.push({
                    Tanggal: row[0],
                    Pesan: row[1],
                    Pengirim: row[2],
                    RecipientID: row[3] 
                    // Field lain tidak perlu dikirim
                });
            }
        }
    }

    // --- 3. RESPON SUKSES ---
    return createJSONResponse({ 
      'result': 'success',
      'profile': userProfile,
      'messages': messages
    });

  } catch (e) {
    Logger.log("Error details (doGet): " + e.message + " Stack: " + e.stack);
    return createJSONResponse({ 'result': 'error', 'message': 'Terjadi kesalahan server saat GET.' });
  } finally {
    lock.releaseLock();
  }
}