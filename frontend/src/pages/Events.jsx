function Events() {
  // Sample events, to be replaced with your own data later
  const upcomingEvents = [
    { title: "Travel Expo 2025", date: "Dec 10", city: "Delhi" },
    { title: "Partner Meetup", date: "Nov 20", city: "Mumbai" }
  ];

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#1a1a1a" }}>
      <div className="container">
        <h2 className="text-center fw-bold mb-4" style={{ color: "#1a1a1a", fontFamily: "'Inter', sans-serif" }}>Upcoming Events</h2>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <ul className="list-group">
              {upcomingEvents.map(ev => (
                <li className="list-group-item d-flex justify-content-between align-items-center" key={ev.title}>
                  <div>
                    <span className="fw-bold">{ev.title}</span>
                    <br />
                    <span className="text-muted">{ev.city} &mdash; {ev.date}</span>
                  </div>
                  <button className="btn btn-outline-success btn-sm">Details</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Events;

