/*
 * Căsuța de pe Maluri — site configuration
 * ---------------------------------------------------------------
 * Everything the owner may need to change or verify lives here.
 * Values marked  TODO  could not be confirmed (the cazare.online listing was
 * not reachable while building) — please replace them with the real data.
 */
window.CONFIG = {
  name: "Căsuța de pe Maluri",

  // ---- Contact (TODO: replace with real details) -------------------------
  phone: "+40 700 000 000",          // TODO
  phoneHref: "+40700000000",         // TODO digits only, with country code
  whatsapp: "40700000000",           // TODO or null to hide
  email: "contact@casutadepemaluri.ro", // TODO

  // ---- Stay information (TODO: verify) -----------------------------------
  checkin: "15:00",                  // TODO
  checkout: "11:00",                 // TODO
  maxGuests: 10,                     // TODO real capacity
  minNights: 1,                      // TODO

  // ---- Booking integration (later) ---------------------------------------
  booking: {
    // GET  availabilityEndpoint  -> { "booked": [["2026-12-24","2026-12-27"], ...] }  (checkout day is free)
    availabilityEndpoint: null,
    // POST bookingEndpoint -> create booking / payment session, returns { ok:true, redirectUrl? }
    bookingEndpoint: null,
    // Static fallback until a calendar (iCal / channel manager / API) is connected.
    // Format: [checkIn, checkOut] ISO dates; the check-out night is free again.
    bookedRanges: [],
    pricePerNight: null,             // number, e.g. 450 — shows live totals when set
    currency: "RON",
    paymentProvider: null            // e.g. "stripe" | "netopia" | "euplatesc"
  },

  // ---- Contact form ------------------------------------------------------
  // POST JSON {name,email,phone,topic,message,lang}. When null the form opens the visitor's mail app.
  contactEndpoint: null,

  // ---- Map ---------------------------------------------------------------
  mapQuery: "Botiza, Maramureș, Romania"
};
