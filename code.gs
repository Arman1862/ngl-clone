/**
 * Variabel Global untuk Nama Sheet.
 * PASTIKAN nama sheet di Spreadsheet kamu sama persis!
 * Users: Menyimpan data akun (UserID, LoginKey, NamaTampilan)
 * Pesan: Menyimpan semua pesan masuk
 */
var sheetPesan = 'Pesan'; // Sesuai permintaan
var sheetUsers = 'Users'; // Sesuai permintaan
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
    // FIX: Pastikan data kolom dan nilai perbandingan diubah ke String dan lowercase
    if (String(data[i][columnIndex]).toLowerCase() === String(value).toLowerCase()) {
      return data[i]; // Mengembalikan baris yang cocok
    }
  }
  return null;
}

/**
 * Membuat kunci login acak 6 digit.
 */
function generateLoginKey() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}


// --- Fungsi Utama (API Endpoints) ---

/**
 * Menerima request GET dari Web App (untuk Login dan Ambil Pesan)
 */
function doGet(e) {
  var action = e.parameter.action;

  if (action === 'login') {
    var userId = e.parameter.userId;
    var loginKey = e.parameter.loginKey;

    if (!userId || !loginKey) {
      return createJSONResponse({'result': 'error', 'message': 'UserID dan Login Key wajib diisi.'});
    }

    try {
      var doc = SpreadsheetApp.getActiveSpreadsheet();
      var usersSheet = doc.getSheetByName(sheetUsers);

      // Kolom UserID ada di indeks 0 (Kolom A)
      var userRow = findRowByValue(usersSheet, 0, userId); 

      if (!userRow) {
        return createJSONResponse({'result': 'error', 'message': 'UserID tidak ditemukan.'});
      }

      // Pastikan LoginKey sesuai. Kolom LoginKey ada di indeks 1 (Kolom B)
      // FIX: Pastikan userRow[1] diubah ke String
      if (String(userRow[1]) !== String(loginKey)) { 
        return createJSONResponse({'result': 'error', 'message': 'Login Key salah!'});
      }

      // --- 1. AMBIL DATA USER (Profile) ---
      // Header: [UserID, LoginKey, NamaTampilan]
      // FIX: Gunakan casing yang konsisten (camelCase) dan pastikan nilainya String.
      var userProfile = {
        userId: String(userRow[0]), // FIX: userId (huruf kecil) dan String()
        loginKey: String(userRow[1]),
        // FIX: namaTampilan dan beri default empty string jika cell kosong (null/undefined)
        namaTampilan: String(userRow[2] || '') 
      };

      // FIX: Ambil ID yang sudah pasti string dan lowercase sebelum loop (Perbaikan Error toLowerCase)
      var userLoggedInID = userProfile.userId.toLowerCase();


      // --- 2. FILTER PESAN ---
      var pesanSheet = doc.getSheetByName(sheetPesan);
      var messages = [];

      if (pesanSheet) {
          var dataRange = pesanSheet.getDataRange();
          var values = dataRange.getValues();
          
          // Header: [Tanggal, Pesan, Pengirim, RecipientID]
          var header = values.length > 0 ? values[0] : [];
          // Kolom RecipientID harusnya di indeks 3 (Kolom D)
          var recipientIdIndex = header.indexOf('RecipientID'); 

          // Mulai dari baris 1 (setelah header)
          for (var i = 1; i < values.length; i++) {
              var row = values[i];
              
              // Bandingkan RecipientID di baris pesan dengan UserID yang sedang login
              // FIX: Gunakan String() untuk RecipientID di row sebelum toLowerCase()
              if (row[recipientIdIndex] && String(row[recipientIdIndex]).toLowerCase() === userLoggedInID) { 
                  messages.push({
                      Tanggal: row[0],
                      Pesan: row[1],
                      Pengirim: row[2],
                      RecipientID: row[3] 
                  });
              }
          }
      }

      // --- 3. RESPON SUKSES ---
      return createJSONResponse({ 
        'result': 'success',
        'profile': userProfile, // Kirim profile dengan key baru: userId, namaTampilan
        'messages': messages.reverse() 
      });

    } catch (e) {
      Logger.log("Error details (doGet - login): " + e.toString());
      return createJSONResponse({'result': 'error', 'message': 'Terjadi kesalahan sistem saat login: ' + e.toString()});
    }
  } 

  // Jika tidak ada action atau action tidak dikenali
  return createJSONResponse({'result': 'error', 'message': 'Endpoint tidak valid.'});
}


/**
 * Menerima request POST dari Web App (untuk Register dan Kirim Pesan)
 */
function doPost(e) {
  var data = e.parameter;
  var action = data.action;

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'register') {
      var userId = data.userId;
      var namaTampilan = data.namaTampilan;
      var loginKey = generateLoginKey();

      if (!userId || !namaTampilan) {
        return createJSONResponse({'result': 'error', 'message': 'UserID dan Nama Tampilan wajib diisi.'});
      }
      
      var usersSheet = getOrCreateSheet(doc, sheetUsers, ['UserID', 'LoginKey', 'NamaTampilan']);
      
      // Cek apakah UserID sudah ada (Kolom A = 0)
      if (findRowByValue(usersSheet, 0, userId)) {
        return createJSONResponse({'result': 'error', 'message': 'UserID ' + userId + ' sudah digunakan.'});
      }

      // Tambahkan user baru
      usersSheet.appendRow([userId.trim(), loginKey, namaTampilan.trim()]);

      return createJSONResponse({
        'result': 'success',
        'message': 'Registrasi berhasil!',
        'data': {
          'userId': userId.trim(),
          'loginKey': loginKey
        }
      });

    } else if (data.pesan && data.recipientId) {
      // Logic Kirim Pesan Anonim
      var pesan = data.pesan;
      var pengirim = data.pengirim || 'Anonim';
      var recipientId = data.recipientId;
      var timestamp = new Date();

      var pesanSheet = getOrCreateSheet(doc, sheetPesan, ['Tanggal', 'Pesan', 'Pengirim', 'RecipientID']);

      // Cek apakah RecipientID valid (ada di sheet Users)
      var usersSheet = doc.getSheetByName(sheetUsers);
      if (!usersSheet || !findRowByValue(usersSheet, 0, recipientId)) {
        return createJSONResponse({'result': 'error', 'message': 'Recipient ID tidak ditemukan.'});
      }

      // Simpan pesan
      pesanSheet.appendRow([timestamp, pesan, pengirim, recipientId.trim()]);

      return createJSONResponse({'result': 'success', 'message': 'Pesan berhasil dikirim.'});
    }

    // Jika tidak ada action atau parameter wajib kurang
    return createJSONResponse({'result': 'error', 'message': 'Parameter tidak lengkap atau action tidak valid.'});

  } catch (e) {
    Logger.log("Error details (doPost): " + e.toString());
    return createJSONResponse({'result': 'error', 'message': 'Terjadi kesalahan sistem saat memproses data: ' + e.toString()});
  }
}