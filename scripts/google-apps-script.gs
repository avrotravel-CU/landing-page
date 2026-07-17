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
  var data = JSON.parse(e.postData.contents);

  var expectedSecret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET");
  if (!expectedSecret || data.secret !== expectedSecret) {
    return json({ ok: false, error: "Unauthorized" });
  }

  if (data.action === "recordPayment") {
    return recordPayment(data);
  }

  return submitTrip(data);
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

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return json({ ok: false, error: "No trip requests in sheet" });
  }

  var values = sheet.getRange(2, 1, lastRow, COL.TRANSACTION_REFS).getValues();
  var rowIndex = -1;
  var row = null;

  for (var i = 0; i < values.length; i++) {
    var cellQuotation = String(values[i][COL.QUOTATION - 1] || "").trim();
    if (cellQuotation.toLowerCase() === quotation.toLowerCase()) {
      rowIndex = i + 2;
      row = values[i];
      break;
    }
  }

  if (rowIndex === -1) {
    return json({ ok: false, error: "Quotation not found: " + quotation });
  }

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

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
