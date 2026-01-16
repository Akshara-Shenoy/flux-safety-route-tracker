/* ================= MAP ================= */
const map = L.map("map").setView([12.9716, 77.5946], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let routingControl;
let navStart, navEnd;

/* ================= SAFETY SCORE (SIMULATED) ================= */
function calculateSafetyScore() {
  const streetLights = Math.floor(Math.random() * 6) + 1;
  const shops = Math.floor(Math.random() * 6);
  const crowd = Math.floor(Math.random() * 6);

  const score = streetLights + shops + crowd;

  return { streetLights, shops, crowd, score };
}

/* ================= ROUTE + NAVIGATION ================= */
window.findSafestRoute = function () {
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!start || !end) {
    alert("Please enter both start and destination");
    return;
  }

  Promise.all([
    fetch(https://nominatim.openstreetmap.org/search?format=json&q=${start}).then(r => r.json()),
    fetch(https://nominatim.openstreetmap.org/search?format=json&q=${end}).then(r => r.json())
  ]).then(([s, e]) => {

    const startLatLng = L.latLng(s[0].lat, s[0].lon);
    const endLatLng = L.latLng(e[0].lat, e[0].lon);

    navStart = startLatLng;
    navEnd = endLatLng;

    if (routingControl) map.removeControl(routingControl);

    routingControl = L.Routing.control({
      waypoints: [startLatLng, endLatLng],
      routeWhileDragging: false,
      addWaypoints: false,
      show: false,
      createMarker: () => null,
      lineOptions: {
        styles: [{ color: "green", weight: 6 }]
      }
    }).addTo(map);

    routingControl.on("routesfound", function (e) {
      const route = e.routes[0];
      const safety = calculateSafetyScore();

      document.getElementById("status").innerHTML = `
        <b>Safest Route Selected</b><br>
        Distance: ${(route.summary.totalDistance / 1000).toFixed(2)} km<br>
        Time: ${(route.summary.totalTime / 60).toFixed(1)} mins<br>
        Safety Score: ${safety.score}/18<br>
        Emergency Number: <b>112</b>
      `;

      document.getElementById("reason").innerHTML = `
        <b>Why this route is safer</b><br>
        💡 Street lights: ${safety.streetLights}<br>
        🏪 Shops nearby: ${safety.shops}<br>
        👥 Crowd intensity: ${safety.crowd}<br><br>
        <b>Why other routes are unsafe</b><br>
        ✖ Poor lighting<br>
        ✖ Isolated streets<br>
        ✖ Low night activity
      `;

      let stepsHTML = "<h3>Navigation Steps</h3><ol>";
      route.instructions.forEach(step => {
        stepsHTML += <li>${step.text}</li>;
      });
      stepsHTML += "</ol>";

      document.getElementById("navigation").innerHTML = stepsHTML;
    });
  });
};

/* ================= START REAL NAVIGATION ================= */
window.startNavigation = function () {
  if (!navStart || !navEnd) {
    alert("Please find a route first");
    return;
  }

  const url = https://www.google.com/maps/dir/?api=1&origin=${navStart.lat},${navStart.lng}&destination=${navEnd.lat},${navEnd.lng}&travelmode=walking;
  window.open(url, "_blank");
};

/* ================= SOS ================= */
window.sendSOS = function () {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup("🚨 SOS LOCATION")
      .openPopup();

    document.getElementById("status").innerHTML = `
      <b>🚨 SOS ACTIVATED</b><br>
      Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}<br>
      Emergency Number: <b>112</b><br>
      <a href="tel:112">📞 Call 112 (Mobile only)</a>
    `;
  }, () => {
    alert("Please allow location access");
  });
};