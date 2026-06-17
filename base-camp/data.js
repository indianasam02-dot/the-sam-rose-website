/* =====================================================
   data.js — Starter gear templates for each trip type
   --------------------------------------------------
   This file holds the default packing lists. It's kept
   separate from script.js so it's easy to edit or add
   to without touching the app logic.

   GEAR_TEMPLATES is a plain object. Each key is a trip
   type, and each value is an array of gear item names.
===================================================== */

const GEAR_TEMPLATES = {
  fishing: [
    "Fly rod & reel",
    "Tackle / fly box",
    "Waders",
    "Net",
    "Fishing license",
    "Polarized sunglasses",
    "Nippers & forceps",
    "Extra tippet & leaders",
    "Water bottle",
    "Snacks"
  ],
  camping: [
    "Tent",
    "Sleeping bag",
    "Sleeping pad",
    "Camp stove",
    "Fuel",
    "Lighter / matches",
    "Cooler & food",
    "Headlamp",
    "First aid kit",
    "Camp chairs"
  ],
  "day hike": [
    "Daypack",
    "Water (2L)",
    "Trail snacks",
    "Rain jacket",
    "Map / GPS",
    "Sunscreen",
    "First aid kit",
    "Hat",
    "Trekking poles"
  ],
  backcountry: [
    "Backpacking pack",
    "Tent / shelter",
    "Sleeping system",
    "Water filter",
    "Stove & fuel",
    "Dehydrated meals",
    "Navigation (map + GPS)",
    "Headlamp",
    "First aid kit",
    "Bear spray",
    "Extra layers",
    "Emergency whistle"
  ]
};

/* A short, friendly label + emoji for each trip type.
   Used on the cards and headers. */
const TRIP_TYPES = {
  fishing:       { label: "Fishing",      icon: "🎣" },
  camping:       { label: "Camping",      icon: "🏕️" },
  "day hike":    { label: "Day Hike",     icon: "🥾" },
  backcountry:   { label: "Backcountry",  icon: "🏔️" }
};
