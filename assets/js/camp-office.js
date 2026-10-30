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

    var positions = {
      'Surat':     { x: 19, y: 56, state: 'Gujarat', kind: 'Head Office' },
      'Delhi':     { x: 33, y: 32, state: 'Delhi', kind: 'Branch Office' },
      'Mumbai':    { x: 19, y: 61, state: 'Maharashtra', kind: 'Branch Office' },
      'Ahmedabad': { x: 18, y: 45, state: 'Gujarat', kind: 'Branch Office' },
      'Jaipur':    { x: 28, y: 37, state: 'Rajasthan', kind: 'Branch Office' },
      'Hyderabad': { x: 50, y: 62, state: 'Telangana', kind: 'Branch Office' },
      'Vapi':      { x: 19, y: 59, state: 'Gujarat', kind: 'Branch Office' },
      'Chennai':   { x: 42, y: 85, state: 'Tamil Nadu', kind: 'Branch Office' },
      'Kolkata':   { x: 78, y: 43, state: 'West Bengal', kind: 'Branch Office' }
    };
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
