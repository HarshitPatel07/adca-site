/* Interactive office directory and map pins for Camp Office. */
(function () {
  'use strict';
  var D = window.ADCA;
  if (!D) return;

  function init() {
    var pins = document.getElementById('camp-map-pins');
    var list = document.getElementById('camp-office-list');
    var detail = document.getElementById('camp-office-detail');
    var search = document.getElementById('camp-office-search');
    var count = document.getElementById('camp-office-count');
    if (!pins || !list || !detail || !search) return;

    /* City-centre coordinates mapped to the static India artwork.
       The reference is Delhi, with the scale calibrated to the artwork's
       latitude/longitude grid; pin tips land on the mapped city positions. */
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
    var mapReference = { lat: 28.65195, lon: 77.23149, x: 33, y: 32, scaleX: 3.25, scaleY: 3.05 };
    var positions = {};
    Object.keys(cityCoordinates).forEach(function (city) {
      var location = cityCoordinates[city];
      positions[city] = {
        x: mapReference.x + (location.lon - mapReference.lon) * mapReference.scaleX,
        y: mapReference.y + (mapReference.lat - location.lat) * mapReference.scaleY,
        state: location.state,
        kind: location.kind
      };
    });
    var offices = [{
      city: 'Surat',
      address: D.firm.address,
      phone: D.firm.phone,
      phoneHref: D.firm.phoneHref,
      kind: 'Head Office',
      state: positions.Surat.state,
      x: positions.Surat.x,
      y: positions.Surat.y
    }].concat(D.branches.map(function (branch) {
      var pos = positions[branch.city] || { x: 50, y: 50, kind: 'Branch Office' };
      return {
        city: branch.city,
        address: branch.addr,
        phone: branch.phone || D.firm.phone,
        phoneHref: branch.phone ? 'tel:' + branch.phone.replace(/[^0-9+]/g, '') : D.firm.phoneHref,
        kind: pos.kind,
        state: pos.state,
        x: pos.x,
        y: pos.y
      };
    }));
    var activeCity = 'Surat';

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>"]/g, function (char) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char];
      });
    }
    function mapHref(office) {
      return 'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(office.address + ', ' + office.city);
    }
    function renderPins() {
      pins.innerHTML = offices.map(function (office, index) {
        return '<button class="camp-office-pin' + (office.city === activeCity ? ' is-active' : '') +
          '" type="button" data-city="' + escapeHtml(office.city) +
          '" style="left:' + office.x + '%;top:' + office.y + '%" aria-label="View ' +
          escapeHtml(office.city) + ', ' + escapeHtml(office.state) +
          (office.kind === 'Head Office' ? ' head office' : ' branch office') +
          '" aria-pressed="' + (office.city === activeCity) + '" title="' +
          escapeHtml(office.city + ' · ' + office.state) + '" data-label="' +
          escapeHtml(office.city + ' · ' + office.state) + '"><span>' + (index + 1) + '</span></button>';
      }).join('');
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
      pins.querySelectorAll('.camp-office-pin').forEach(function (pin) {
        pin.hidden = matched.every(function (office) { return office.city !== pin.getAttribute('data-city'); });
      });
    }
    function showOffice(city) {
      var office = offices.filter(function (item) { return item.city === city; })[0];
      if (!office) return;
      activeCity = office.city;
      detail.innerHTML = '<span class="camp-office-detail__tag">' + escapeHtml(office.kind) +
        ' · AGARWAL &amp; DHANDHANIA</span><h3>' + escapeHtml(office.city) +
        ' <span>· ' + escapeHtml(office.state) + '</span>' +
        '</h3><div class="camp-office-detail__actions"><a href="' + escapeHtml(office.phoneHref) +
        '">Call ' + escapeHtml(office.city === 'Surat' || office.phone !== D.firm.phone ? office.phone : 'Surat office') +
        '</a><a href="' + mapHref(office) + '" target="_blank" rel="noopener noreferrer">Directions ↗</a></div>';
      renderPins();
      renderList(search.value);
    }
    pins.addEventListener('click', function (event) {
      var button = event.target.closest('.camp-office-pin');
      if (button) showOffice(button.getAttribute('data-city'));
    });
    list.addEventListener('click', function (event) {
      var button = event.target.closest('.camp-office-option');
      if (button) showOffice(button.getAttribute('data-city'));
    });
    search.addEventListener('input', function () { renderList(search.value); });
    renderPins();
    renderList('');
    showOffice(activeCity);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
