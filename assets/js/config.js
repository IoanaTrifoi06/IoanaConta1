/*
 * Căsuța din Butian — site configuration
 * ---------------------------------------------------------------
 * Everything the owner may need to change or verify lives here.
 * Source: https://www.visit-ro.com/casuta-din-butian.html
 * Values marked  VERIFY  come from that listing and may be out of date.
 */
window.CONFIG = {
  name: "Căsuța din Butian",

  // ---- Contact (from the listing) ----------------------------------------
  phone: "+40 755 321 984",
  phoneHref: "+40755321984",
  whatsapp: "40755321984",           // or null to hide the WhatsApp card
  email: "contaioana@yahoo.com",

  // ---- Stay information ---------------------------------------------------
  maxGuests: 10,                     // listing: 10 places, 4 rooms
  minNights: 1,                      // VERIFY

  // ---- Booking integration (later) ---------------------------------------
  booking: {
    // GET  availabilityEndpoint  -> { "booked": [["2026-12-24","2026-12-27"], ...] }  (checkout day is free)
    availabilityEndpoint: null,
    // POST bookingEndpoint -> create booking / payment session, returns { ok:true, redirectUrl? }
    bookingEndpoint: null,
    // Static fallback until a calendar (iCal / channel manager / API) is connected.
    // Format: [checkIn, checkOut] ISO dates; the check-out night is free again.
    bookedRanges: [],
    pricePerNight: 1500,             // VERIFY — listing: whole house, 1500 lei/night
    currency: "RON",
    paymentProvider: null            // e.g. "stripe" | "netopia" | "euplatesc"
  },

  // ---- Contact form ------------------------------------------------------
  // POST JSON {name,email,phone,topic,message,lang}. When null the form opens the visitor's mail app.
  contactEndpoint: null,

  // ---- Map ---------------------------------------------------------------
  mapQuery: "Botiza, Maramureș, Romania"
};
