"use strict";

(() => {
  const status = document.getElementById("status");
  const retry = document.getElementById("retry");
  function report(message, failed = false) {
    status.textContent = message;
    status.dataset.state = failed ? "error" : "normal";
    retry.hidden = !failed;
  }

  if (!window.L) {
    report("Не удалось загрузить карту. Проверьте интернет и повторите загрузку.", true);
    retry.addEventListener("click", () => window.location.reload());
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const map = L.map("map", { zoomControl: false, fadeAnimation: !reducedMotion, zoomAnimation: !reducedMotion });
  const schoolBounds = L.latLngBounds([51.041803, 71.241071], [51.208789, 71.685867]);
  function showSchools() { map.fitBounds(schoolBounds, { padding: [28, 28], animate: !reducedMotion }); }
  showSchools();
  L.control.zoom({ position: "topright" }).addTo(map);
  L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

  const base = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // One transparent WMS image per tile keeps requests low on the small server.
  const schools = L.tileLayer.wms("/qgis", {
    MAP: "/app/Week_11_Variant_3.qgz",
    layers: "schools_polygons,schools_points",
    styles: "",
    format: "image/png",
    transparent: true,
    version: "1.1.1",
    tileSize: 512,
    maxZoom: 19,
    updateWhenIdle: true,
    keepBuffer: 1,
    attribution: "Школы Астаны · QGIS Server"
  });
  let failedTiles = false;
  schools.on("loading", () => {
    failedTiles = false;
    report("Загружаем слои школ…");
  });
  schools.on("tileerror", () => {
    failedTiles = true;
    report("Не удалось загрузить часть карты школ. Повторите загрузку.", true);
  });
  schools.on("load", () => {
    if (!failedTiles) report("Слои школ загружены с сервера");
  });
  schools.addTo(map);

  const points = document.getElementById("points");
  const polygons = document.getElementById("polygons");
  function updateLayers() {
    const selected = [];
    if (polygons.checked) selected.push("schools_polygons");
    if (points.checked) selected.push("schools_points");
    if (selected.length === 0) {
      map.removeLayer(schools);
      report("Слои школ скрыты. Включите нужный слой галочкой.");
      return;
    }
    schools.setParams({ layers: selected.join(",") });
    if (!map.hasLayer(schools)) schools.addTo(map);
  }
  points.addEventListener("change", updateLayers);
  polygons.addEventListener("change", updateLayers);
  document.getElementById("basemap").addEventListener("change", (event) => {
    if (event.target.checked) base.addTo(map);
    else map.removeLayer(base);
  });
  document.getElementById("reset").addEventListener("click", showSchools);
  retry.addEventListener("click", () => schools.redraw());
})();
