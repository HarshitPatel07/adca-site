/* Interactive office directory with geographic map pins. */
(function () {
  'use strict';
  var D = window.ADCA;
  if (!D) return;

  function init() {
    var mapCanvas = document.getElementById('camp-map-view');
    var mapFallback = document.getElementById('camp-map-fallback');
    var list = document.getElementById('camp-office-list');
    var detail = document.getElementById('camp-office-detail');
    var search = document.getElementById('camp-office-search');
    var count = document.getElementById('camp-office-count');
    if (!mapCanvas || !list || !detail || !search) return;

    /* City-center coordinates, using the listed branch cities. */
    var cityCoordinates = {
      'Surat':     { lat: 21.1959, lon: 72.8302, state: 'Gujarat', kind: 'Head Office' },
      'Delhi':     { lat: 28.65195, lon: 77.23149, state: 'Delhi', kind: 'Branch Office' },
      'Mumbai':    { lat: 19.07283, lon: 72.88261, state: 'Maharashtra', kind: 'Branch Office' },
      'Ahmedabad': { lat: 23.02579, lon: 72.58727, state: 'Gujarat', kind: 'Branch Office' },
      'Jaipur':    { lat: 26.91962, lon: 75.78781, state: 'Rajasthan', kind: 'Branch Office' },
      'Hyderabad': { lat: 17.38405, lon: 78.45636, state: 'Telangana', kind: 'Branch Office' },
      'Vapi':      { lat: 20.36381, lon: 72.92290, state: 'Gujarat', kind: 'Branch Office' },
      'Chennai':   { lat: 13.08784, lon: 80.27847, state: 'Tamil Nadu', kind: 'Branch Office' },
      'Kolkata':   { lat: 22.56263, lon: 88.36304, state: 'West Bengal', kind: 'Branch Office' }
    };
    var offices = [{
      city: 'Surat',
      address: D.firm.address,
      phone: D.firm.phone,
      phoneHref: D.firm.phoneHref,
      kind: cityCoordinates.Surat.kind,
      state: cityCoordinates.Surat.state,
      lat: cityCoordinates.Surat.lat,
      lon: cityCoordinates.Surat.lon
    }].concat(D.branches.map(function (branch) {
      var location = cityCoordinates[branch.city] || {};
      return {
        city: branch.city,
        address: branch.addr,
        phone: branch.phone || D.firm.phone,
        phoneHref: branch.phone ? 'tel:' + branch.phone.replace(/[^0-9+]/g, '') : D.firm.phoneHref,
        kind: location.kind || 'Branch Office',
        state: location.state || '',
        lat: location.lat,
        lon: location.lon
      };
    }));
    var activeCity = 'Surat';
    var map = null;
    var markers = {};

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>"]/g, function (char) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char];
      });
    }
    function mapHref(office) {
      return 'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(office.address + ', ' + office.city);
    }
    function markerIcon(office, index) {
      var number = String(index + 1).padStart(2, '0');
      var label = escapeHtml(office.city + ' · ' + office.state);
      var aria = 'View ' + escapeHtml(office.city) + ', ' + escapeHtml(office.state) +
        (office.kind === 'Head Office' ? ' head office' : ' branch office');
      return L.divIcon({
        className: 'camp-leaflet-pin',
        html: '<button class="camp-office-pin' + (office.city === activeCity ? ' is-active' : '') +
          '" type="button" data-city="' + escapeHtml(office.city) + '" aria-label="' + aria +
          '" aria-pressed="' + (office.city === activeCity) + '" title="' + label +
          '" data-label="' + label + '"><span>' + number + '</span></button>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
    }
    function initMap() {
      if (!window.L) {
        if (mapFallback) {
          mapFallback.hidden = false;
          mapFallback.innerHTML = 'The map could not load right now. <a href="https://www.google.com/maps/search/?api=1&query=India">Open the map in Google Maps ↗</a>';
        }
        return;
      }
      map = L.map(mapCanvas, {
        zoomControl: true,
        scrollWheelZoom: false,
        zoomSnap: 0.5,
        minZoom: 4,
        maxZoom: 17,
        attributionControl: true
      });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
      }).addTo(map);
      map.fitBounds(offices.map(function (office) { return [office.lat, office.lon]; }), {
        padding: [38, 38],
        maxZoom: 5.5
      });
      offices.forEach(function (office, index) {
        var marker = L.marker([office.lat, office.lon], {
          icon: markerIcon(office, index),
          title: office.city + ' · ' + office.state,
          keyboard: true,
          riseOnHover: true
        }).addTo(map);
        marker.on('click', function () { showOffice(office.city, true); });
        markers[office.city] = marker;
      });
      window.setTimeout(function () { map.invalidateSize(); }, 100);
    }
    function renderMarkers(matched) {
      if (!map) return;
      offices.forEach(function (office, index) {
        var marker = markers[office.city];
        if (!marker) return;
        marker.setIcon(markerIcon(office, index));
        if (!matched || matched.indexOf(office) !== -1) {
          if (!map.hasLayer(marker)) marker.addTo(map);
        } else if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      });
    }
    function renderList(query) {
      var q = query.trim().toLowerCase();
      var matched = offices.filter(function (office) {
        return (office.city + ' ' + office.state + ' ' + office.kind).toLowerCase().indexOf(q) !== -1;
      });
      list.innerHTML = matched.length ? matched.map(function (office) {
        var index = offices.indexOf(office);
        return '<button class="camp-office-option' + (office.city === activeCity ? ' is-active' : '') +
          '" type="button" data-city="' + escapeHtml(office.city) + '" aria-pressed="' +
          (office.city === activeCity) + '">' +
          '<span class="camp-office-option__number">' + String(index + 1).padStart(2, '0') + '</span>' +
          '<span class="camp-office-option__text"><strong>' + escapeHtml(office.city) +
          '</strong><small>' + escapeHtml(office.kind) + ' · ' + escapeHtml(office.state) +
          '</small></span><span class="camp-office-option__arrow" aria-hidden="true">↗</span></button>';
      }).join('') : '<p class="camp-office-empty">No office matches that search. Try another city.</p>';
      if (count) count.textContent = matched.length + (matched.length === 1 ? ' office' : ' offices');
      renderMarkers(matched);
    }
    function showOffice(city, focusMap) {
      var office = offices.filter(function (item) { return item.city === city; })[0];
      if (!office) return;
      activeCity = office.city;
      detail.innerHTML = '<span class="camp-office-detail__tag">' + escapeHtml(office.kind) +
        ' · AGARWAL &amp; DHANDHANIA</span><h3>' + escapeHtml(office.city) +
        ' <span>· ' + escapeHtml(office.state) + '</span>' +
        '</h3><div class="camp-office-detail__actions"><a href="' + escapeHtml(office.phoneHref) +
        '">Call ' + escapeHtml(office.city === 'Surat' || office.phone !== D.firm.phone ? office.phone : 'Surat office') +
        '</a><a href="' + mapHref(office) + '" target="_blank" rel="noopener noreferrer">Directions ↗</a></div>';
      renderList(search.value);
      if (map && focusMap) {
        map.flyTo([office.lat, office.lon], Math.max(map.getZoom(), 7), { duration: 0.65 });
      }
    }

    list.addEventListener('click', function (event) {
      var button = event.target.closest('.camp-office-option');
      if (button) showOffice(button.getAttribute('data-city'), true);
    });
    search.addEventListener('input', function () { renderList(search.value); });
    initMap();
    renderList('');
    showOffice(activeCity, false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
