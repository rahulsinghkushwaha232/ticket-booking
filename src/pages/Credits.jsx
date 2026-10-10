import events from "../data/events.js";

const licenseUrls = {
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
  "Unsplash License": "https://unsplash.com/license",
  "Pexels License": "https://www.pexels.com/license/",
};
const venuePhotoEventIds = new Set([6]);

function getImageTitle(source, title) {
  if (title) return title;
  const fileTitle = source.split("/File:")[1] || source;
  return decodeURIComponent(fileTitle).replaceAll("_", " ");
}

function Credits() {
  const creditedEvents = events.filter((event) => event.imageCredit);

  return (
    <main className="page-shell credits-page">
      <header className="credits-heading">
        <p className="eyebrow">Openly licensed imagery</p>
        <h1>Photo credits</h1>
        <p>Photo attribution and license details for the event images used on TicketHub.</p>
      </header>
      <div className="credits-table-wrap">
        <table className="credits-table">
          <thead>
            <tr>
              <th scope="col">Event</th>
              <th scope="col">Photo title</th>
              <th scope="col">Author</th>
              <th scope="col">License</th>
              <th scope="col">Source</th>
            </tr>
          </thead>
          <tbody>
            {creditedEvents.map((event) => (
              <tr key={event.id}>
                <td data-label="Event">{event.name}</td>
                <td data-label="Photo title">
                  {getImageTitle(event.imageCredit.source, event.imageCredit.title)}
                  {venuePhotoEventIds.has(event.id) && <span className="credit-kind">Venue photo</span>}
                </td>
                <td data-label="Author">{event.imageCredit.author}</td>
                <td data-label="License">
                  <a href={licenseUrls[event.imageCredit.license]} rel="noreferrer" target="_blank">
                    {event.imageCredit.license}
                  </a>
                </td>
                <td data-label="Source">
                  <a href={event.imageCredit.source} rel="noreferrer" target="_blank">
                    {event.imageCredit.source.includes("unsplash.com")
                      ? "Unsplash photo page"
                      : event.imageCredit.source.includes("pexels.com")
                        ? "Pexels photo page"
                        : "Commons file page"}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Credits;
