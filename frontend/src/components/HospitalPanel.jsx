function HospitalPanel() {

  const hospitals = [
    { name: "City Heart Hospital", distance: "1.2 km" },
    { name: "Apollo Clinic", distance: "2.4 km" },
    { name: "Emergency Cardiac Center", distance: "3.1 km" },
  ];

  return (
    <div style={{ marginTop: "30px" }}>

      <h3>Nearby Hospitals</h3>

      <ul>
        {hospitals.map((h, i) => (
          <li key={i}>
            {h.name} — {h.distance}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default HospitalPanel;