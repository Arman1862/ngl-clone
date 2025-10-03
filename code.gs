var sheetPesan = 'Pesan';
var sheetUsers = 'Users';
var scriptProp = PropertiesService.getScriptProperties();

function createJSONResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


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
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][columnIndex]).toLowerCase() === String(value).toLowerCase()) {
      return data[i];
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

      var userRow = findRowByValue(usersSheet, 0, userId); 

      if (!userRow) {
        return createJSONResponse({'result': 'error', 'message': 'UserID tidak ditemukan.'});
      }

      if (String(userRow[1]) !== String(loginKey)) { 
        return createJSONResponse({'result': 'error', 'message': 'Login Key salah!'});
      }

      var userProfile = {
        userId: String(userRow[0]),
        loginKey: String(userRow[1]),
        namaTampilan: String(userRow[2] || '') 
      };

      var userLoggedInID = userProfile.userId.toLowerCase();


      var pesanSheet = doc.getSheetByName(sheetPesan);
      var messages = [];

      if (pesanSheet) {
          var dataRange = pesanSheet.getDataRange();
          var values = dataRange.getValues();
          
          var header = values.length > 0 ? values[0] : [];
          var recipientIdIndex = header.indexOf('RecipientID'); 

          for (var i = 1; i < values.length; i++) {
              var row = values[i];
              
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

      return createJSONResponse({ 
        'result': 'success',
        'profile': userProfile,
        'messages': messages.reverse() 
      });

    } catch (e) {
      Logger.log("Error details (doGet - login): " + e.toString());
      return createJSONResponse({'result': 'error', 'message': 'Terjadi kesalahan sistem saat login: ' + e.toString()});
    }
  } 

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
      
      if (findRowByValue(usersSheet, 0, userId)) {
        return createJSONResponse({'result': 'error', 'message': 'UserID ' + userId + ' sudah digunakan.'});
      }

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
      var pesan = data.pesan;
      var pengirim = data.pengirim || 'Anonim';
      var recipientId = data.recipientId;
      var timestamp = new Date();

      var pesanSheet = getOrCreateSheet(doc, sheetPesan, ['Tanggal', 'Pesan', 'Pengirim', 'RecipientID']);

      var usersSheet = doc.getSheetByName(sheetUsers);
      if (!usersSheet || !findRowByValue(usersSheet, 0, recipientId)) {
        return createJSONResponse({'result': 'error', 'message': 'Recipient ID tidak ditemukan.'});
      }

      pesanSheet.appendRow([timestamp, pesan, pengirim, recipientId.trim()]);

      return createJSONResponse({'result': 'success', 'message': 'Pesan berhasil dikirim.'});
    }

    return createJSONResponse({'result': 'error', 'message': 'Parameter tidak lengkap atau action tidak valid.'});

  } catch (e) {
    Logger.log("Error details (doPost): " + e.toString());
    return createJSONResponse({'result': 'error', 'message': 'Terjadi kesalahan sistem saat memproses data: ' + e.toString()});
  }
}