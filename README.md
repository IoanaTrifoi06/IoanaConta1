# Căsuța din Butian — Botiza, Maramureș

Static, dependency-free website (HTML + CSS + vanilla JS). Languages: RO · EN · FR · DE.

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | 7 sections: hero carousel + quick availability bar · welcome & stats · house bento · experiences bento · seasonal gallery with lightbox · around Botiza · good-to-know + CTA |
| Booking | `booking.html` | Availability calendar, guests, details, summary, payment placeholder |
| Maramureș & Botiza | `maramures.html` | About, what to see, how to get there (tabs + map), 15-question searchable FAQ |
| Contact | `contact.html` | General enquiries (not bookings), contact cards, map |

Shared: sticky header with language switcher + **Book** button, compact footer with CTA, scroll-progress bar, reveal animations, count-up stats, page transitions, back-to-top. `prefers-reduced-motion` is respected.

## Run
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
No build step. Deploy the folder to any static host (Netlify, GitHub Pages, …).

## Data source & things to verify — `assets/js/config.js`
Contact details, capacity (10 places, 4 rooms), Wi-Fi/parking/BBQ area, no-pets and no-card-on-site come from the listing
https://www.visit-ro.com/casuta-din-butian.html. Please verify:
- **Price** (`pricePerNight: 1500` lei, whole house) — may be out of date; it drives the live total on the booking page.
- **Hot tub:** the listing says "no ciubăr", but the supplied photos show an outdoor hot tub, so the site presents it. Remove it from `i18n.js`/`index.html` if it is no longer available.
- Check-in/out times are not published, so the site says they are agreed at booking.
- Travel times on the Maramureș page are approximate.

## Connecting booking & payments later
In `config.js → booking`:
- `availabilityEndpoint` — `GET` returns `{ "booked": [["2026-12-24","2026-12-27"]] }` (check-out day is free). Or fill `bookedRanges` statically / feed it from an iCal sync.
- `bookingEndpoint` — `POST` JSON `{checkin, checkout, nights, guests, name, email, phone, notes, lang}`; return `{ ok:true, redirectUrl }` to hand off to a payment page.
- `pricePerNight`, `currency`, `paymentProvider` — enable live totals; the payment card in `booking.html` is a marked placeholder.
Until endpoints exist the form opens the visitor's email app with the request. Contact form: `contactEndpoint` works the same way.

## Editing text / translations
All copy lives in `assets/js/i18n.js` as `"key": [RO, EN, FR, DE]`. HTML uses `data-i18n="key"`.

## Design
Warm timber + shutter-green + cream; **red & white appear only as subtle details** (folk diamond band, accents, progress bar, CTA buttons) inspired by Maramureș embroidery and carved porch balustrades. Fonts: Fraunces + Inter (Google Fonts). Photos in `assets/img/` were cut from the supplied collages.
