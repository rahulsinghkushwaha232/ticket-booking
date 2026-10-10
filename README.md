# TicketHub

[![Author](https://img.shields.io/badge/Author-Rahul%20Singh%20Kushwaha-blue?style=for-the-badge&logo=github)](https://github.com/rahulsinghkushwaha232)
[![GitHub](https://img.shields.io/badge/GitHub-rahulsinghkushwaha232-181717?style=for-the-badge&logo=github)](https://github.com/rahulsinghkushwaha232)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

TicketHub is a responsive event ticket booking platform with VIP seating and demand-based and time-based surge pricing.

## Features

- Browse and search 20 events by name or venue.
- Responsive event cards with image fallbacks and direct booking links.
- Select up to six seats in an interactive, labeled seat map with VIP, Regular, Selected, and Booked seat states.
- See seat-tier prices, demand and time surges, and an updated booking total.
- Complete a demo checkout and view, print, or cancel saved tickets.
- Keep pending bookings and confirmed tickets in browser storage.
- Responsive glass styling, keyboard focus indicators, loading skeletons, and friendly not-found pages.

## Tech stack

- React 19 and React DOM 19
- React Router DOM 7
- Vite 7 with `@vitejs/plugin-react` 5
- ESLint 9 with flat configuration
- JavaScript/JSX and plain CSS

## Project structure

```text
ticket-booking/
├── public/
├── src/
│   ├── assets/react.svg
│   ├── components/
│   │   ├── BookingSummary.jsx
│   │   ├── CountdownTimer.jsx
│   │   ├── EventCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── PricingPanel.jsx
│   │   └── SeatMap.jsx
│   ├── data/
│   │   ├── events.js
│   │   └── tickets.js
│   ├── pages/
│   │   ├── Booking.jsx
│   │   ├── Credits.jsx
│   │   ├── Home.jsx
│   │   ├── MyTickets.jsx
│   │   └── Payment.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── Dockerfile
├── .dockerignore
├── .gitignore
├── eslint.config.js
├── index.html
├── nginx.conf
├── package.json
├── package-lock.json
├── README.md
├── vite.config.js
└── vercel.json
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home and event search |
| `/booking/:id` | Seat selection, pricing, and booking summary |
| `/payment` | Demo checkout and ticket confirmation |
| `/tickets` | Saved tickets and cancellation |
| `/credits` | Wikimedia Commons photo credits |
| Any other path | Friendly 404 page |

## How pricing works

Regular seats cost the listed event price. VIP seats cost `round(event price × 1.5)`. The selected seat prices are added to form the subtotal.

| Booked seats out of 40 | Demand surge |
| --- | --- |
| Below 30% | ×1 |
| 30% to below 50% | ×1.1 |
| 50% to 70% | ×1.2 |
| Above 70% | ×1.5 |

| Time until the event | Time surge |
| --- | --- |
| More than 30 days | ×1 |
| More than 7 days through 30 days | ×1.1 |
| 1 to 7 days | ×1.2 |
| Under 24 hours, or event started/ended | ×1.3 |

The total is `round(subtotal × demand surge × time surge)`.

## Local setup

Requires Node.js 20 or later.

```sh
npm install
npm run dev
```

Create a production build and run the available quality check:

```sh
npm run build
npm run lint
```

## Docker

Build the multi-stage image and start the Nginx server:

```sh
docker build -t ticket-booking .
docker run -p 8080:80 ticket-booking
```

Open [http://localhost:8080](http://localhost:8080).

## Deploy to Vercel

1. Import the project repository in the Vercel dashboard.
2. Select the Vite framework preset and keep the default build command (`npm run build`) and output directory (`dist`).
3. Deploy. The included `vercel.json` rewrites app routes to the SPA entry point.

Alternatively, use the Vercel CLI:

```sh
npx vercel
npx vercel --prod
```

## Storage and payments

Event data is bundled with the app; pending bookings and confirmed tickets are stored in `sessionStorage` and `localStorage` in the browser. Payment is a demo only: no real payment is processed, and there is no backend.

## Photo credits

These event images are from Wikimedia Commons, Unsplash, or Pexels. License links and original photo pages are included for attribution.

| Event | Photo title | Author | License | Source |
| --- | --- | --- | --- | --- |
| Sonu Nigam Live in Concert | Crowd and stage lighting at Beach, Please! Festival — concert theme photo, not Sonu Nigam | PinkBeachPlanet | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons file page](https://commons.wikimedia.org/wiki/File:Beach-Please-2022-crowd-stage-lights-night-performance.jpg) |
| Standup Comedy Night | Zakir khan | Panigrahiasmitku | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [File page](https://commons.wikimedia.org/wiki/File:Zakir_khan.jpg) |
| Bengaluru Tech Summit | Audience attentively watching a presentation in a conference setting — theme photo, not the actual summit | Atlantic Ambience | [Pexels License](https://www.pexels.com/license/) | [Pexels photo page](https://www.pexels.com/photo/people-sitting-inside-the-auditorium-9275222/) |
| Sunburn Festival Goa | Sunburn Festival, Goa, Trance music | Vyacheslav Argenberg | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [File page](https://commons.wikimedia.org/wiki/File:Sunburn_Festival,_Goa,_Trance_music.jpg) |
| Startup Mahakumbh | Bharat Mandapam illuminated — venue photo | DesiBoy101 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [File page](https://commons.wikimedia.org/wiki/File:Bharat_Mandapam_illuminated.jpg) |
| Lakmé Fashion Week | Vibrant fashion show runway with dramatic lighting — fashion theme photo, not Lakmé Fashion Week | Thể Phạm | [Pexels License](https://www.pexels.com/license/) | [Pexels photo page](https://www.pexels.com/photo/vibrant-fashion-show-runway-with-dramatic-lighting-28587831/) |
| Global Fintech Fest | Man speaking in front of crowd — business conference theme photo, not the actual fest | Miguel Henriques | [Unsplash License](https://unsplash.com/license) | [Unsplash photo page](https://unsplash.com/photos/man-speaking-in-front-of-crowd-RfiBK6Y_upQ) |
| Tata Mumbai Marathon | Runners during Tata Mumbai Marathon, 2023 at Worli Sea Link | KartikMistry | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [File page](https://commons.wikimedia.org/wiki/File:Runners_during_Tata_Mumbai_Marathon,_2023_at_Worli_Sea_Link.jpg) |

## Author

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/rahulsinghkushwaha232">
        <img src="https://github.com/rahulsinghkushwaha232.png" width="100px;" alt="Rahul Singh Kushwaha"/><br />
        <sub><b>Rahul Singh Kushwaha</b></sub>
      </a><br />
      <a href="https://github.com/rahulsinghkushwaha232">@rahulsinghkushwaha232</a>
    </td>
  </tr>
</table>

> 💡 **Creator & Lead Developer** — Designed and built the full TicketHub platform including UI, routing, seat map logic, surge pricing engine, and deployment configuration.

## Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/rahulsinghkushwaha232">
        <img src="https://github.com/rahulsinghkushwaha232.png" width="80px;" alt="Rahul Singh Kushwaha"/><br />
        <sub><b>Rahul Singh Kushwaha</b></sub>
      </a><br />
      🎨 UI/UX &nbsp;|&nbsp; ⚙️ Core Logic &nbsp;|&nbsp; 🚀 Deployment
    </td>
  </tr>
</table>

---

> Want to contribute? Feel free to fork this repository and submit a pull request!
> 
> ⭐ **If you found this project helpful, please give it a star!**

## License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/rahulsinghkushwaha232"><b>Rahul Singh Kushwaha</b></a>
</div>
