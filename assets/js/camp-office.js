/* Interactive office directory with India-focused official boundary rendering. */
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

    /* City-center coordinates for the listed branch cities. */
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
    function markerElement(office, index) {
      var number = String(index + 1).padStart(2, '0');
      var button = document.createElement('button');
      button.className = 'camp-office-pin' + (office.city === activeCity ? ' is-active' : '');
      button.type = 'button';
      button.setAttribute('data-city', office.city);
      button.setAttribute('aria-label', 'View ' + office.city + ', ' + office.state +
        (office.kind === 'Head Office' ? ' head office' : ' branch office'));
      button.setAttribute('aria-pressed', office.city === activeCity ? 'true' : 'false');
      button.setAttribute('title', office.city + ' · ' + office.state);
      button.setAttribute('data-label', office.city + ' · ' + office.state);
      button.innerHTML = '<span>' + number + '</span>';
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        showOffice(office.city, true);
      });
      return button;
    }
    function showMapFallback() {
      if (!mapFallback) return;
      mapFallback.hidden = false;
      mapFallback.innerHTML = 'The map could not load right now. <a href="https://www.google.com/maps/search/?api=1&query=India">Open the map in Google Maps ↗</a>';
    }
    function renderMarkers(matched) {
      if (!map) return;
      offices.forEach(function (office) {
        var entry = markers[office.city];
        if (!entry) return;
        var visible = !matched || matched.indexOf(office) !== -1;
        if (visible && !entry.visible) {
          entry.marker.addTo(map);
          entry.visible = true;
        } else if (!visible && entry.visible) {
          entry.marker.remove();
          entry.visible = false;
        }
        entry.element.classList.toggle('is-active', office.city === activeCity);
        entry.element.setAttribute('aria-pressed', office.city === activeCity ? 'true' : 'false');
      });
    }
    function addMarkers(maplibregl) {
      offices.forEach(function (office, index) {
        var element = markerElement(office, index);
        var marker = new maplibregl.Marker({ element: element, anchor: 'center' })
          .setLngLat([office.lon, office.lat])
          .addTo(map);
        markers[office.city] = { marker: marker, element: element, visible: true };
      });
      var bounds = new maplibregl.LngLatBounds();
      offices.forEach(function (office) { bounds.extend([office.lon, office.lat]); });
      map.fitBounds(bounds, { padding: 34, maxZoom: 5.5, duration: 0 });
    }
    function initMap() {
      if (!window.maplibregl || !window.BharatMap) {
        showMapFallback();
        return;
      }
      var boundaryReady = window.BharatMap.install(window.maplibregl);
      Promise.resolve(boundaryReady)
        .then(function () {
          return window.BharatMap.fixStyle('https://basemaps.cartocdn.com/gl/positron-gl-style/style.json');
        })
        .then(function (style) {
          map = new window.maplibregl.Map({
            container: mapCanvas,
            style: style,
            center: [78, 22],
            zoom: 4.5,
            minZoom: 3.5,
            maxZoom: 17,
            attributionControl: true,
            dragRotate: false,
            pitchWithRotate: false
          });
          map.addControl(new window.maplibregl.NavigationControl({
            showCompass: false,
            visualizePitch: false
          }), 'top-left');
          map.on('load', function () { addMarkers(window.maplibregl); });
          map.on('error', function (event) {
            if (event && event.error && /style|source|tile/i.test(event.error.message || '')) showMapFallback();
          });
          window.setTimeout(function () { if (map) map.resize(); }, 150);
        })
        .catch(function () { showMapFallback(); });
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
        map.flyTo({
          center: [office.lon, office.lat],
          zoom: Math.max(map.getZoom(), 7),
          duration: 850
        });
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
