/* Booking page — availability calendar + request form.
 * Integration points (see config.js):
 *   CONFIG.booking.availabilityEndpoint  -> GET  {booked:[[in,out],...]}
 *   CONFIG.booking.bookingEndpoint       -> POST booking payload (create payment session here)
 *   CONFIG.booking.pricePerNight         -> enables live totals
 * Until endpoints exist the form falls back to an email request.            */
(function () {
  "use strict";
  var C = window.CONFIG, B = C.booking, t = window.t, I = window.__icons;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var root = $("#booking"); if (!root) return;

  var DAY = 864e5;
  var iso = function (d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  var parse = function (s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
  var today = new Date(); today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  var st = { start: null, end: null, guests: 2, view: new Date(today.getFullYear(), today.getMonth(), 1), booked: new Set() };

  var calEl = $("#cal"), msg = $("#bkErr"), okEl = $("#bkOk");
  function setBooked(ranges) {
    st.booked = new Set();
    (ranges || []).forEach(function (r) { for (var d = parse(r[0]); d < parse(r[1]); d = new Date(d.getTime() + DAY)) st.booked.add(iso(d)); });
  }
  setBooked(B.bookedRanges);
  if (B.availabilityEndpoint) {
    fetch(B.availabilityEndpoint).then(function (r) { return r.json(); }).then(function (j) { setBooked(j.booked); render(); }).catch(function () {});
  }

  function freeRange(a, b) { for (var d = new Date(a); d < b; d = new Date(d.getTime() + DAY)) if (st.booked.has(iso(d))) return false; return true; }
  function fmt(d, o) { return new Intl.DateTimeFormat(window.getLang(), o).format(d); }

  /* prefill from URL (home quick-booking bar) */
  var q = new URLSearchParams(location.search);
  if (q.get("checkin") && q.get("checkout")) {
    var a = parse(q.get("checkin")), b = parse(q.get("checkout"));
    if (a >= today && b > a && freeRange(a, b)) { st.start = a; st.end = b; st.view = new Date(a.getFullYear(), a.getMonth(), 1); }
  }
  if (+q.get("guests")) st.guests = Math.min(C.maxGuests || 10, Math.max(1, +q.get("guests")));

  function say(el, text) { el.textContent = text; el.hidden = !text; }

  function month(first) {
    var wrap = document.createElement("div"); wrap.className = "cal-month";
    var h = document.createElement("h3"); h.textContent = fmt(first, { month: "long", year: "numeric" }); wrap.appendChild(h);
    var g = document.createElement("div"); g.className = "cal-grid";
    var mon = new Date(2024, 0, 1); // a Monday
    for (var i = 0; i < 7; i++) { var w = document.createElement("div"); w.className = "dow"; w.textContent = fmt(new Date(mon.getTime() + i * DAY), { weekday: "short" }).slice(0, 2); g.appendChild(w); }
    var offset = (first.getDay() + 6) % 7;
    for (i = 0; i < offset; i++) { var p = document.createElement("div"); p.className = "pad"; g.appendChild(p); }
    var n = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    for (var d = 1; d <= n; d++) {
      var date = new Date(first.getFullYear(), first.getMonth(), d), key = iso(date);
      var b = document.createElement("button"); b.type = "button"; b.className = "day"; b.textContent = d;
      var past = date < today, booked = st.booked.has(key);
      if (booked) b.classList.add("is-booked");
      if (+date === +today) b.classList.add("is-today");
      b.disabled = past || (booked && !(st.start && !st.end && date > st.start && freeRange(st.start, date)));
      if (st.start && +date === +st.start) b.classList.add("is-start");
      if (st.end && +date === +st.end) b.classList.add("is-end");
      if (st.start && st.end && date > st.start && date < st.end) b.classList.add("in-range");
      b.setAttribute("aria-label", fmt(date, { dateStyle: "full" }) + (booked ? " — " + t("bk.legend.booked") : ""));
      (function (dt) { b.addEventListener("click", function () { pick(dt); }); })(date);
      g.appendChild(b);
    }
    wrap.appendChild(g); return wrap;
  }
  function render() {
    calEl.innerHTML = "";
    calEl.appendChild(month(st.view));
    calEl.appendChild(month(new Date(st.view.getFullYear(), st.view.getMonth() + 1, 1)));
    $("#prevM").disabled = st.view <= new Date(today.getFullYear(), today.getMonth(), 1);
    summary();
  }
  function pick(d) {
    say(msg, "");
    if (!st.start || st.end || d <= st.start) {
      if (st.booked.has(iso(d))) return;
      st.start = d; st.end = null;
    } else if (freeRange(st.start, d)) {
      st.end = d;
    } else {
      say(msg, t("bk.err.range")); st.start = st.booked.has(iso(d)) ? null : d; st.end = null;
    }
    render();
  }

  function summary() {
    var none = t("bk.sum.none"), nights = st.start && st.end ? Math.round((st.end - st.start) / DAY) : 0;
    $("#sIn").textContent = st.start ? fmt(st.start, { dateStyle: "medium" }) : none;
    $("#sOut").textContent = st.end ? fmt(st.end, { dateStyle: "medium" }) : none;
    $("#sNights").textContent = nights ? (nights === 1 ? t("bk.night1") : t("bk.nights", { n: nights })) : none;
    $("#sGuests").textContent = st.guests;
    $("#gOut").textContent = st.guests;
    var price = $("#sPrice");
    if (B.pricePerNight && nights) price.textContent = new Intl.NumberFormat(window.getLang(), { style: "currency", currency: B.currency, maximumFractionDigits: 0 }).format(B.pricePerNight * nights);
    else price.textContent = t("bk.sum.price.tbc");
  }

  $("#prevM").addEventListener("click", function () { st.view = new Date(st.view.getFullYear(), st.view.getMonth() - 1, 1); render(); });
  $("#nextM").addEventListener("click", function () { st.view = new Date(st.view.getFullYear(), st.view.getMonth() + 1, 1); render(); });
  $("#prevM").innerHTML = I.left; $("#nextM").innerHTML = I.right;
  $("#clearSel").addEventListener("click", function () { st.start = st.end = null; say(msg, ""); render(); });
  $("#gMinus").addEventListener("click", function () { st.guests = Math.max(1, st.guests - 1); summary(); });
  $("#gPlus").addEventListener("click", function () { st.guests = Math.min(C.maxGuests || 10, st.guests + 1); summary(); });
  document.addEventListener("langchange", render);

  /* submit */
  var form = $("#bkForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault(); say(msg, ""); say(okEl, "");
    if (!st.start || !st.end) { say(msg, t("bk.err.dates")); $("#cal").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    var f = new FormData(form), bad = false;
    ["name", "email"].forEach(function (k) { var el = form.elements[k], v = !String(f.get(k) || "").trim() || (k === "email" && !/^\S+@\S+\.\S+$/.test(f.get(k))); el.classList.toggle("is-bad", v); bad = bad || v; });
    if (bad || !form.elements.consent.checked || f.get("website")) { say(msg, t("bk.err.fields")); return; }
    var payload = { checkin: iso(st.start), checkout: iso(st.end), nights: Math.round((st.end - st.start) / DAY), guests: st.guests, name: f.get("name"), email: f.get("email"), phone: f.get("phone"), notes: f.get("notes"), lang: window.getLang() };
    if (B.bookingEndpoint) {
      fetch(B.bookingEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        .then(function (r) { if (!r.ok) throw 0; return r.json().catch(function () { return {}; }); })
        .then(function (j) { if (j.redirectUrl) location.href = j.redirectUrl; else say(okEl, t("bk.ok.sent")); })
        .catch(function () { say(msg, t("bk.err.fields")); });
    } else {
      var body = [payload.checkin + " → " + payload.checkout + " (" + payload.nights + ")", t("bk.sum.guests") + ": " + payload.guests, "", payload.notes || "", "", "— " + payload.name + (payload.phone ? " · " + payload.phone : "") + " · " + payload.email].join("\n");
      location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent(t("bk.mail.subject") + " — " + C.name) + "&body=" + encodeURIComponent(body);
      say(okEl, t("bk.ok.title") + ". " + t("bk.ok.text"));
    }
  });
  render();
})();
