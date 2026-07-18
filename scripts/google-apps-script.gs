/**
 * CEYLON UNSCRIPTED — Google Sheet Apps Script (single spreadsheet, single tab)
 *
 * Tab: Sheet1
 * - Plan My Trip appends one row per submission (columns A–AL)
 * - You manually add Quotation # + Tour Amount on that row when you send a quote
 * - Successful payments update the payment columns on the same row (AM–AV)
 *
 * See scripts/SHEET-COLUMNS.md for the full column list and setup steps.
 */

/** First column index (1-based) after the 37 Plan My Trip fields (+ Submitted At). */
var COL = {
  SUBMITTED_AT: 1,
  QUOTATION: 39,
  TOUR_AMOUNT: 40,
  TOTAL_PAID: 41,
  PERCENT_PAID: 42,
  AMOUNT_OWED: 43,
  PAYMENT_STATUS: 44,
  DAYS_TILL_ARRIVAL: 45,
  LAST_PAYMENT_DATE: 46,
  LAST_MILESTONE: 47,
  TRANSACTION_REFS: 48,
  ARRIVAL_DATE: 8, // within trip fields (after Submitted At)
};

var TRIP_FIELD_COUNT = 37;
var PAYMENT_COL_COUNT = 10;

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: "Empty request body" });
    }

    var data = JSON.parse(e.postData.contents);

    var expectedSecret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET");
    if (!expectedSecret || data.secret !== expectedSecret) {
      return json({ ok: false, error: "Unauthorized" });
    }

    if (data.action === "recordPayment") {
      return recordPayment(data);
    }

    if (data.action === "lookupBooking") {
      return lookupBooking(data);
    }

    if (data.action === "submitReview") {
      return submitReview(data);
    }

    if (data.action === "listReviews") {
      return listReviews(data);
    }

    // Plan My Trip (explicit action or legacy requests without action)
    return submitTrip(data);
  } catch (err) {
    return json({
      ok: false,
      error: "Script error: " + (err && err.message ? err.message : String(err)),
    });
  }
}

function submitTrip(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  if (!sheet) {
    return json({ ok: false, error: 'Missing "Sheet1" tab' });
  }

  var fieldOrder = getTripFieldOrder();

  var row = [new Date()];
  fieldOrder.forEach(function (key) {
    var value = data[key];
    row.push(value === undefined || value === null ? "" : String(value));
  });

  // Leave payment columns blank until you assign a quotation and payments arrive.
  for (var i = 0; i < PAYMENT_COL_COUNT; i++) {
    row.push("");
  }

  sheet.appendRow(row);
  return json({ ok: true });
}

function findBookingRow(sheet, quotation) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return { ok: false, error: "No trip requests in sheet" };
  }

  var values = sheet.getRange(2, 1, lastRow, COL.TRANSACTION_REFS).getValues();

  for (var i = 0; i < values.length; i++) {
    var cellQuotation = String(values[i][COL.QUOTATION - 1] || "").trim();
    if (cellQuotation.toLowerCase() === quotation.toLowerCase()) {
      return {
        ok: true,
        rowIndex: i + 2,
        row: values[i],
      };
    }
  }

  return { ok: false, error: "Quotation not found: " + quotation };
}

function lookupBooking(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  if (!sheet) {
    return json({ ok: false, error: 'Missing "Sheet1" tab' });
  }

  var quotation = String(data.quotation || "").trim();
  if (!quotation) {
    return json({ ok: false, error: "Quotation number is required" });
  }

  var found = findBookingRow(sheet, quotation);
  if (!found.ok) {
    return json(found);
  }

  var row = found.row;
  var tourAmount = Number(row[COL.TOUR_AMOUNT - 1]) || 0;
  var totalPaid = Number(row[COL.TOTAL_PAID - 1]) || 0;
  var amountOwed = Math.max(0, tourAmount - totalPaid);
  var arrivalRaw = row[COL.ARRIVAL_DATE - 1];
  var daysTillArrival = computeDaysTillArrival(arrivalRaw);
  var firstName = String(row[1] || "").trim();
  var lastName = String(row[2] || "").trim();
  var fullName = [firstName, lastName].filter(Boolean).join(" ");
  var email = String(row[3] || "").trim();
  var phone = String(row[4] || "").trim();

  if (!tourAmount || tourAmount <= 0) {
    return json({
      ok: false,
      error: "Tour Amount (USD) missing on that row — add it in the sheet first",
    });
  }

  return json({
    ok: true,
    quotation: quotation,
    name: fullName || firstName,
    email: email,
    phone: phone,
    tourAmount: roundMoney(tourAmount),
    totalPaid: roundMoney(totalPaid),
    amountOwed: roundMoney(amountOwed),
    arrivalDate: formatDateValue(arrivalRaw),
    daysTillArrival: daysTillArrival === "" ? null : daysTillArrival,
  });
}

function recordPayment(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  if (!sheet) {
    return json({ ok: false, error: 'Missing "Sheet1" tab' });
  }

  var quotation = String(data.quotation || "").trim();
  var paymentAmount = Number(data.paymentAmount);

  if (!quotation) {
    return json({ ok: false, error: "Quotation number is required" });
  }
  if (!paymentAmount || paymentAmount <= 0) {
    return json({ ok: false, error: "A valid payment amount is required" });
  }

  var found = findBookingRow(sheet, quotation);
  if (!found.ok) {
    return json(found);
  }

  var rowIndex = found.rowIndex;
  var row = found.row;

  var tourAmount = Number(row[COL.TOUR_AMOUNT - 1]);
  if (!tourAmount || tourAmount <= 0) {
    return json({
      ok: false,
      error: "Tour Amount (USD) missing on that row — add it in the sheet first",
    });
  }

  var previousPaid = Number(row[COL.TOTAL_PAID - 1]) || 0;
  var totalPaid = previousPaid + paymentAmount;
  var percentPaid = Math.min(100, Math.round((totalPaid / tourAmount) * 1000) / 10);
  var amountOwed = Math.max(0, tourAmount - totalPaid);
  var status = totalPaid >= tourAmount ? "All Paid" : "Partial";
  var arrivalRaw = row[COL.ARRIVAL_DATE - 1];
  var daysTillArrival = computeDaysTillArrival(arrivalRaw);
  var now = new Date();

  sheet.getRange(rowIndex, COL.TOTAL_PAID).setValue(roundMoney(totalPaid));
  sheet.getRange(rowIndex, COL.PERCENT_PAID).setValue(percentPaid + "%");
  sheet.getRange(rowIndex, COL.AMOUNT_OWED).setValue(roundMoney(amountOwed));
  sheet.getRange(rowIndex, COL.PAYMENT_STATUS).setValue(status);
  sheet.getRange(rowIndex, COL.DAYS_TILL_ARRIVAL).setValue(
    daysTillArrival === "" ? "" : daysTillArrival
  );
  sheet.getRange(rowIndex, COL.LAST_PAYMENT_DATE).setValue(now);
  sheet.getRange(rowIndex, COL.LAST_MILESTONE).setValue(
    String(data.milestoneLabel || data.milestone || "")
  );
  var newRef = String(data.transactionRef || data.stripePaymentIntentId || "").trim();
  var existingRefs = String(row[COL.TRANSACTION_REFS - 1] || "").trim();
  sheet.getRange(rowIndex, COL.TRANSACTION_REFS).setValue(
    appendTransactionRef(existingRefs, newRef)
  );

  return json({
    ok: true,
    quotation: quotation,
    totalPaid: roundMoney(totalPaid),
    percentPaid: percentPaid,
    amountOwed: roundMoney(amountOwed),
    status: status,
    daysTillArrival: daysTillArrival,
  });
}

function getTripFieldOrder() {
  return [
    "First Name",
    "Last Name",
    "Email Address",
    "Phone / WhatsApp",
    "Country of Residence",
    "Preferred Contact Method",
    "Arrival Date",
    "Departure Date",
    "Number of Days",
    "Adults",
    "Infants",
    "Children",
    "Teens",
    "Travelling with Pets",
    "Pet Details",
    "Destinations",
    "Other Destinations",
    "Hotel Rating",
    "Room Types",
    "Meal Plan",
    "Mixed Meal Plan Details",
    "Activities",
    "Other Activities",
    "Preferred Language",
    "Driver Gender Preference",
    "Preferred Driver Age",
    "LGBTQ Friendly Driver",
    "Child Friendly Driver",
    "Food Preferences",
    "Spice Level",
    "Allergies / Medical",
    "Cultural Preferences",
    "Cultural Details",
    "Budget",
    "Dream Trip",
    "Terms Agreed",
    "Full Trip Request",
  ];
}

function formatDateValue(value) {
  if (!value) return "";
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return String(value);
}

function computeDaysTillArrival(arrivalRaw) {
  if (!arrivalRaw) return "";

  var arrival;
  if (Object.prototype.toString.call(arrivalRaw) === "[object Date]") {
    arrival = new Date(arrivalRaw.getTime());
  } else {
    arrival = new Date(String(arrivalRaw));
  }

  if (isNaN(arrival.getTime())) return "";

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  arrival.setHours(0, 0, 0, 0);

  var diffMs = arrival.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

/** Keeps every payment ref in column AV, separated by " | ". */
function appendTransactionRef(existing, newRef) {
  newRef = String(newRef || "").trim();
  if (!newRef) return existing;
  if (!existing) return newRef;
  return existing + " | " + newRef;
}

// --- Customer reviews (Share Your Story) ---

function ensureReviewsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Reviews");
  if (!sheet) {
    sheet = ss.insertSheet("Reviews");
    sheet.appendRow([
      "Submitted At",
      "Name",
      "Country",
      "Visit Month",
      "Visit Year",
      "Rating",
      "Review",
      "Photo URLs",
      "Display on Site",
    ]);
  }
  return sheet;
}

function getReviewsPhotoFolder() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty("REVIEWS_DRIVE_FOLDER_ID");
  if (id) {
    try {
      return DriveApp.getFolderById(String(id).trim());
    } catch (e) {
      throw new Error(
        'REVIEWS_DRIVE_FOLDER_ID is invalid. Open your folder in Drive, copy the ID from the URL, and set Script property REVIEWS_DRIVE_FOLDER_ID.'
      );
    }
  }
  var folder = DriveApp.createFolder("Ceylon Unscripted Review Photos");
  props.setProperty("REVIEWS_DRIVE_FOLDER_ID", folder.getId());
  return folder;
}

function normalizeDrivePhotoUrl(url) {
  var u = String(url || "").trim();
  if (!u) return u;
  var m = u.match(/[?&]id=([^&]+)/);
  if (m) return "https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w1600";
  m = u.match(/\/d\/([^/]+)/);
  if (m) return "https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w1600";
  return u;
}

function saveReviewPhotos(photos) {
  if (!photos || !photos.length) return [];

  var folder = getReviewsPhotoFolder();
  var urls = [];

  for (var i = 0; i < photos.length; i++) {
    var item = photos[i];
    if (!item || !item.data) continue;

    var mime = item.mime || "image/jpeg";
    var name =
      String(item.name || "review-photo-" + i + ".jpg").replace(/[^\w.\-]+/g, "_");
    var blob = Utilities.newBlob(Utilities.base64Decode(String(item.data)), mime, name);
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    var fileId = file.getId();
    urls.push("https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1600");
  }

  return urls;
}

function submitReview(data) {
  try {
    var name = String(data.name || "").trim();
    var country = String(data.country || "").trim();
    var month = String(data.month || "").trim();
    var year = String(data.year || "").trim();
    var rating = Number(data.rating);
    var reviewText = String(data.review || "").trim();

    if (!name || !country || !month || !year || !reviewText) {
      return json({ ok: false, error: "Missing required review fields" });
    }
    if (!rating || rating < 1 || rating > 5) {
      return json({ ok: false, error: "Invalid rating" });
    }

    var photoUrls = saveReviewPhotos(data.photos);
    var sheet = ensureReviewsSheet();

    var displayStatus = "Yes";

    sheet.appendRow([
      new Date(),
      name,
      country,
      month,
      year,
      rating,
      reviewText,
      photoUrls.join(" | "),
      displayStatus,
    ]);

    return json({
      ok: true,
      displayStatus: displayStatus,
      photoCount: photoUrls.length,
      folderId: getReviewsPhotoFolder().getId(),
    });
  } catch (err) {
    return json({
      ok: false,
      error: err && err.message ? err.message : String(err),
    });
  }
}

function listReviews() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Reviews");
  if (!sheet || sheet.getLastRow() < 2) {
    return json({ ok: true, reviews: [] });
  }

  var values = sheet.getRange(2, 1, sheet.getLastRow(), 9).getValues();
  var reviews = [];

  for (var i = values.length - 1; i >= 0; i--) {
    var row = values[i];
    var display = String(row[8] || "").trim();
    if (display !== "Yes") continue;

    var photoRaw = String(row[7] || "").trim();
    var photos = photoRaw
      ? photoRaw.split(" | ").filter(function (u) {
          return u.trim();
        }).map(normalizeDrivePhotoUrl)
      : [];

    reviews.push({
      id: "review-" + (i + 2),
      name: String(row[1] || ""),
      location: String(row[2] || ""),
      visited: String(row[3] || "") + " " + String(row[4] || ""),
      quote: String(row[6] || ""),
      rating: Number(row[5]) || 5,
      photos: photos,
      submittedAt: row[0] ? new Date(row[0]).toISOString() : "",
    });
  }

  return json({ ok: true, reviews: reviews });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Run once from the Apps Script editor (Run ▶) after updating Code.gs.
 * Re-grants Spreadsheet + Drive access so the Web App can write again.
 */
function authorizeScript() {
  SpreadsheetApp.getActiveSpreadsheet().getName();
  DriveApp.getRootFolder().getId();
  return "Authorization OK — save and use your existing Web App deployment URL.";
}

/**
 * Run from the editor (Run ▶) to test Reviews tab + Drive WITHOUT the website.
 * Check: Reviews tab new row + photo file in your review photos folder.
 */
function testSubmitReviewInSheet() {
  var result = submitReview({
    name: "Apps Script Test",
    country: "Sri Lanka",
    month: "July",
    year: "2026",
    rating: 5,
    review: "Test row from Apps Script editor — safe to delete.",
    photos: [
      {
        mime: "image/png",
        name: "test-pixel.png",
        data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      },
    ],
  });
  Logger.log(result.getContent());
}
