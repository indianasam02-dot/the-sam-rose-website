/* =====================================================
   script.js — Base Camp
   --------------------------------------------------
   This file holds all the app logic. It's organized as:

   1. Data + saving        (the "state" and localStorage)
   2. Helpers              (small reusable functions)
   3. View switching       (show one screen at a time)
   4. Trips list view      (create / show trip cards)
   5. Trip detail view     (gear checklist + catch log)
   6. All-catches view     (stats, filter, sort)
   7. Startup              (wire up buttons, first render)

   KEY IDEA: We keep everything in one array called `trips`.
   Each trip is an object that CONTAINS its own gear list
   and its own catch list. Whenever that array changes, we
   (a) save it to localStorage and (b) re-draw the screen.
===================================================== */


/* =====================================================
   1. DATA + SAVING
===================================================== */

// This is the app's "memory" while it runs — an array of trip objects.
let trips = [];

// Remembers which trip is currently open in the detail view (by id).
let activeTripId = null;

// The name we use to store data in the browser's localStorage.
const STORAGE_KEY = "baseCampTrips";

/* Save the trips array to localStorage.
   localStorage can only store text, so we convert our array
   into a text string with JSON.stringify(). */
function saveTrips() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

/* Load trips back from localStorage when the app starts.
   JSON.parse() turns the saved text back into a real array.
   If nothing is saved yet, we start with an empty array. */
function loadTrips() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    trips = JSON.parse(saved);
  } else {
    trips = [];
  }
}


/* =====================================================
   2. HELPERS
===================================================== */

// Make a simple unique id using the current time + a random number.
function makeId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000);
}

// Find a trip object in the array by its id.
function getTrip(id) {
  return trips.find(function (trip) {
    return trip.id === id;
  });
}

// Format a date string (like "2026-06-15") into something friendlier.
// If there's no date, we just return a dash.
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00"); // avoid timezone surprises
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

// Shortcut for document.getElementById — saves typing.
function el(id) {
  return document.getElementById(id);
}


/* =====================================================
   3. VIEW SWITCHING
   Only one <section class="view"> is visible at a time.
   We hide all of them, then show the one we want.
===================================================== */

function showView(viewName) {
  // Hide every view
  el("view-trips").classList.add("hidden");
  el("view-detail").classList.add("hidden");
  el("view-catches").classList.add("hidden");

  // Remove the "active" highlight from both nav buttons
  el("navTripsBtn").classList.remove("active");
  el("navCatchesBtn").classList.remove("active");

  // Show the requested view and highlight the right nav button
  if (viewName === "trips") {
    el("view-trips").classList.remove("hidden");
    el("navTripsBtn").classList.add("active");
    renderTrips();
  } else if (viewName === "detail") {
    el("view-detail").classList.remove("hidden");
    renderDetail();
  } else if (viewName === "catches") {
    el("view-catches").classList.remove("hidden");
    el("navCatchesBtn").classList.add("active");
    renderAllCatches();
  }

  // Always scroll back to the top when changing screens
  window.scrollTo(0, 0);
}


/* =====================================================
   4. TRIPS LIST VIEW
===================================================== */

// Draw all the trip cards (or the empty state if there are none).
function renderTrips() {
  const grid = el("tripGrid");
  const empty = el("tripsEmpty");
  grid.innerHTML = ""; // clear whatever was there before

  if (trips.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  // Build one card per trip
  trips.forEach(function (trip) {
    // Count how many gear items are packed
    const packed = trip.gear.filter(function (g) { return g.packed; }).length;
    const totalGear = trip.gear.length;
    const typeInfo = TRIP_TYPES[trip.type]; // from data.js

    // Create the card element
    const card = document.createElement("div");
    card.className = "trip-card";

    card.innerHTML =
      '<div class="trip-card-icon">' + typeInfo.icon + '</div>' +
      '<p class="trip-card-type">' + typeInfo.label + '</p>' +
      '<h3 class="trip-card-name">' + trip.name + '</h3>' +
      '<p class="trip-card-meta">' + formatDate(trip.date) +
        (trip.location ? ' · ' + trip.location : '') + '</p>' +
      '<div class="trip-card-stats">' +
        '<span><strong>' + packed + '/' + totalGear + '</strong> packed</span>' +
        '<span><strong>' + trip.catches.length + '</strong> fish</span>' +
      '</div>';

    // Clicking a card opens that trip
    card.addEventListener("click", function () {
      activeTripId = trip.id;
      showView("detail");
    });

    grid.appendChild(card);
  });
}

// Show or hide the "new trip" form
function toggleNewTripForm(show) {
  const form = el("newTripForm");
  if (show) {
    form.classList.remove("hidden");
    el("tripName").focus();
  } else {
    form.classList.add("hidden");
    // Clear the fields
    el("tripName").value = "";
    el("tripLocation").value = "";
    el("tripDate").value = "";
    el("tripType").value = "fishing";
  }
}

// Create a brand-new trip from the form values
function createTrip() {
  const name = el("tripName").value.trim();
  const type = el("tripType").value;
  const date = el("tripDate").value;
  const location = el("tripLocation").value.trim();

  // Simple validation: a trip needs a name
  if (name === "") {
    el("tripName").focus();
    el("tripName").style.borderColor = "#B4564B";
    return;
  }
  el("tripName").style.borderColor = ""; // reset if it was red

  // Build the gear list for this trip type from the template in data.js.
  // We turn each gear name into an object { item, packed:false }.
  const starterGear = GEAR_TEMPLATES[type].map(function (itemName) {
    return { id: makeId(), item: itemName, packed: false };
  });

  // The new trip object — note it carries its own gear + catches arrays
  const newTrip = {
    id: makeId(),
    name: name,
    type: type,
    date: date,
    location: location,
    gear: starterGear,
    catches: []
  };

  trips.unshift(newTrip); // add to the front of the array
  saveTrips();
  toggleNewTripForm(false);
  renderTrips();
}


/* =====================================================
   5. TRIP DETAIL VIEW (gear checklist + catch log)
===================================================== */

function renderDetail() {
  const trip = getTrip(activeTripId);
  if (!trip) { showView("trips"); return; } // safety check

  const typeInfo = TRIP_TYPES[trip.type];

  // Fill in the header
  el("detailType").textContent = typeInfo.icon + " " + typeInfo.label;
  el("detailName").textContent = trip.name;
  el("detailMeta").textContent =
    formatDate(trip.date) + (trip.location ? " · " + trip.location : "");

  renderGear(trip);
  renderCatches(trip);
}

/* ---- GEAR CHECKLIST ---- */
function renderGear(trip) {
  const list = el("gearList");
  list.innerHTML = "";

  trip.gear.forEach(function (gearItem) {
    const li = document.createElement("li");

    // checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = gearItem.packed;
    checkbox.id = "gear-" + gearItem.id;
    // When toggled, update the data and re-render
    checkbox.addEventListener("change", function () {
      gearItem.packed = checkbox.checked;
      saveTrips();
      updateGearProgress(trip);
    });

    // label
    const label = document.createElement("label");
    label.textContent = gearItem.item;
    label.setAttribute("for", "gear-" + gearItem.id);

    // remove button
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-x";
    removeBtn.textContent = "×";
    removeBtn.title = "Remove item";
    removeBtn.addEventListener("click", function () {
      // Keep every gear item EXCEPT this one
      trip.gear = trip.gear.filter(function (g) { return g.id !== gearItem.id; });
      saveTrips();
      renderGear(trip);
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });

  updateGearProgress(trip);
}

// Update the progress bar + count pill based on packed items
function updateGearProgress(trip) {
  const total = trip.gear.length;
  const packed = trip.gear.filter(function (g) { return g.packed; }).length;
  // Avoid dividing by zero if the list is empty
  const percent = total === 0 ? 0 : Math.round((packed / total) * 100);

  el("gearProgress").style.width = percent + "%";
  el("gearProgressLabel").textContent = percent + "% packed";
  el("gearCount").textContent = packed + " / " + total;
}

// Add a custom gear item typed by the user
function addGear() {
  const input = el("newGearInput");
  const value = input.value.trim();
  if (value === "") return;

  const trip = getTrip(activeTripId);
  trip.gear.push({ id: makeId(), item: value, packed: false });
  saveTrips();
  input.value = "";
  renderGear(trip);
}

/* ---- CATCH LOG (per trip) ---- */
function renderCatches(trip) {
  const list = el("catchList");
  const emptyNote = el("catchEmpty");
  list.innerHTML = "";

  el("catchCount").textContent = trip.catches.length + " fish";

  if (trip.catches.length === 0) {
    emptyNote.classList.remove("hidden");
    return;
  }
  emptyNote.classList.add("hidden");

  trip.catches.forEach(function (fish) {
    const li = document.createElement("li");

    // Build the length text only if a length was entered
    const lengthText = fish.length ? fish.length + '"' : "—";

    li.innerHTML =
      '<div class="catch-info">' +
        '<div class="catch-species">' + fish.species + '</div>' +
        '<div class="catch-detail">' + (fish.fly ? fish.fly : "No fly noted") + '</div>' +
      '</div>' +
      '<span class="catch-len">' + lengthText + '</span>';

    // remove button
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-x";
    removeBtn.textContent = "×";
    removeBtn.title = "Remove catch";
    removeBtn.addEventListener("click", function () {
      trip.catches = trip.catches.filter(function (c) { return c.id !== fish.id; });
      saveTrips();
      renderCatches(trip);
    });

    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

// Add a catch to the currently open trip
function addCatch() {
  const species = el("catchSpecies").value.trim();
  const length = el("catchLength").value;  // a string; may be empty
  const fly = el("catchFly").value.trim();

  // A catch needs at least a species
  if (species === "") {
    el("catchSpecies").focus();
    el("catchSpecies").style.borderColor = "#B4564B";
    return;
  }
  el("catchSpecies").style.borderColor = "";

  const trip = getTrip(activeTripId);
  trip.catches.unshift({
    id: makeId(),
    species: species,
    length: length ? Number(length) : null, // store as a number, or null
    fly: fly
  });
  saveTrips();

  // Clear the form
  el("catchSpecies").value = "";
  el("catchLength").value = "";
  el("catchFly").value = "";

  renderCatches(trip);
}

// Delete the whole trip (with a confirm so it's not accidental)
function deleteActiveTrip() {
  const trip = getTrip(activeTripId);
  const ok = confirm('Delete "' + trip.name + '"? This removes its gear list and catches.');
  if (!ok) return;

  trips = trips.filter(function (t) { return t.id !== activeTripId; });
  saveTrips();
  activeTripId = null;
  showView("trips");
}


/* =====================================================
   6. ALL-CATCHES VIEW (rolled up across every trip)
===================================================== */

/* Build one big array of every catch from every trip.
   We attach the trip name to each fish so we know where
   it came from. This uses two loops: for each trip, for
   each catch inside that trip. */
function getAllCatches() {
  const all = [];
  trips.forEach(function (trip) {
    trip.catches.forEach(function (fish) {
      all.push({
        species: fish.species,
        length: fish.length,
        fly: fish.fly,
        tripName: trip.name
      });
    });
  });
  return all;
}

function renderAllCatches() {
  const all = getAllCatches();
  const empty = el("catchesEmpty");
  const list = el("allCatchList");
  const statsRow = el("statsRow");
  const filterBar = document.querySelector(".filter-bar");

  // Empty state if there are no catches anywhere
  if (all.length === 0) {
    empty.classList.remove("hidden");
    list.innerHTML = "";
    statsRow.innerHTML = "";
    filterBar.classList.add("hidden");
    return;
  }
  empty.classList.add("hidden");
  filterBar.classList.remove("hidden");

  renderStats(all);
  populateSpeciesFilter(all);
  renderFilteredCatches(); // draws the list using current filter/sort
}

/* ---- STATS DASHBOARD ----
   reduce() walks through the array building up one value.
   Here we use it to find totals and the longest fish. */
function renderStats(all) {
  const total = all.length;

  // Longest fish: reduce keeps the biggest length seen so far
  const longest = all.reduce(function (max, fish) {
    return (fish.length && fish.length > max) ? fish.length : max;
  }, 0);

  // Count how many DIFFERENT species — a Set holds only unique values
  const speciesSet = new Set(all.map(function (f) { return f.species.toLowerCase(); }));
  const speciesCount = speciesSet.size;

  // Count trips that actually have at least one catch
  const tripsWithFish = trips.filter(function (t) { return t.catches.length > 0; }).length;

  const stats = [
    { value: total, label: "Total Catches" },
    { value: longest ? longest + '"' : "—", label: "Longest" },
    { value: speciesCount, label: "Species" },
    { value: tripsWithFish, label: "Trips Fished" }
  ];

  const row = el("statsRow");
  row.innerHTML = "";
  stats.forEach(function (s) {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML =
      '<div class="stat-value">' + s.value + '</div>' +
      '<div class="stat-label">' + s.label + '</div>';
    row.appendChild(card);
  });
}

/* ---- SPECIES FILTER DROPDOWN ----
   Fill the dropdown with each unique species name. */
function populateSpeciesFilter(all) {
  const select = el("speciesFilter");
  const current = select.value; // remember current choice

  // Get unique species names
  const speciesSet = new Set(all.map(function (f) { return f.species; }));

  // Rebuild the options: "All species" first, then each one
  select.innerHTML = '<option value="all">All species</option>';
  speciesSet.forEach(function (name) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  // Restore the previous choice if it still exists
  select.value = current && [...speciesSet, "all"].includes(current) ? current : "all";
}

/* ---- DRAW THE LIST using the chosen filter + sort ---- */
function renderFilteredCatches() {
  let all = getAllCatches();

  // 1) FILTER by species (unless "all")
  const species = el("speciesFilter").value;
  if (species !== "all") {
    all = all.filter(function (f) { return f.species === species; });
  }

  // 2) SORT
  const sortBy = el("sortBy").value;
  if (sortBy === "longest") {
    // Longest first. (b - a) sorts big-to-small. Missing lengths count as 0.
    all.sort(function (a, b) { return (b.length || 0) - (a.length || 0); });
  }
  // "recent" keeps natural order (newest were unshifted to the front)

  // 3) DRAW
  const list = el("allCatchList");
  list.innerHTML = "";
  all.forEach(function (fish) {
    const li = document.createElement("li");
    const lengthText = fish.length ? fish.length + '"' : "—";
    li.innerHTML =
      '<div class="catch-info">' +
        '<div class="catch-species">' + fish.species + '</div>' +
        '<div class="catch-detail">' + (fish.fly ? fish.fly : "No fly noted") + '</div>' +
        '<span class="catch-trip-tag">' + fish.tripName + '</span>' +
      '</div>' +
      '<span class="catch-len">' + lengthText + '</span>';
    list.appendChild(li);
  });
}


/* =====================================================
   7. STARTUP — wire up buttons and do the first render
===================================================== */

function init() {
  loadTrips();

  // --- Header / nav buttons ---
  el("logoBtn").addEventListener("click", function () { showView("trips"); });
  el("navTripsBtn").addEventListener("click", function () { showView("trips"); });
  el("navCatchesBtn").addEventListener("click", function () { showView("catches"); });

  // --- Trips list view ---
  el("newTripBtn").addEventListener("click", function () { toggleNewTripForm(true); });
  el("cancelTripBtn").addEventListener("click", function () { toggleNewTripForm(false); });
  el("createTripBtn").addEventListener("click", createTrip);

  // --- Trip detail view ---
  el("backToTripsBtn").addEventListener("click", function () { showView("trips"); });
  el("deleteTripBtn").addEventListener("click", deleteActiveTrip);
  el("addGearBtn").addEventListener("click", addGear);
  el("addCatchBtn").addEventListener("click", addCatch);

  // Pressing Enter in the "add gear" box adds the item
  el("newGearInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") addGear();
  });

  // --- All-catches view: re-draw when filter or sort changes ---
  el("speciesFilter").addEventListener("change", renderFilteredCatches);
  el("sortBy").addEventListener("change", renderFilteredCatches);

  // Show the home view first
  showView("trips");
}

// Run init() once the page's HTML has finished loading
document.addEventListener("DOMContentLoaded", init);
