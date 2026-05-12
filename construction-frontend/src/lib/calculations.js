// Rule-based BOQ calculation engine.
// All dimensions in feet unless specified. Areas in sqft.
import { DEFAULT_RATES, QUALITY_MULTIPLIER, QUICK_RATE_BASELINE, CATEGORY_SPLIT } from "./defaults";

const getRate = (rates, key, fallback = 0) => {
  const r = rates?.[key]?.rate;
  return typeof r === "number" ? r : fallback;
};

const getRateObj = (rates, key) => rates?.[key] || DEFAULT_RATES[key] || null;

const pct = (v) => Number(v || 0) / 100;

// ---------- Quick Estimate ----------
export function computeQuickEstimate(project, rates = DEFAULT_RATES) {
  const area = Number(project.built_up_area || 0);
  const baseRate = QUICK_RATE_BASELINE[project.project_type] || QUICK_RATE_BASELINE.residential;
  const qMult = QUALITY_MULTIPLIER[project.quality] || 1;
  const locMult = Number(project.location_multiplier || 1);
  const ratePerSqft = baseRate * qMult * locMult;
  const subtotal = area * ratePerSqft;

  const items = [];
  Object.entries(CATEGORY_SPLIT).forEach(([category, share]) => {
    const amount = subtotal * share;
    items.push({
      id: crypto.randomUUID(),
      category,
      item: `${category} (Lump Sum)`,
      description: `Approximate cost share for ${category.toLowerCase()}`,
      unit: "LS",
      quantity: 1,
      rate: Math.round(amount),
      amount: Math.round(amount),
      remarks: "Quick estimate — share of total",
      assumed: true,
    });
  });

  return finalizeBOQ(project, items, rates, { ratePerSqft });
}

// ---------- Detailed BOQ ----------
export function computeDetailedBOQ(project, rates = DEFAULT_RATES) {
  const items = [];
  const area = Number(project.built_up_area || 0);
  const floors = Number(project.floors || 1);
  const ceilingH = Number(project.ceiling_height || 10);
  const wastage = 1 + pct(project.wastage_percent || 7);
  const scope = project.scope || "full";
  const includeLabor = project.include_labor !== false;

  const includeCivil = ["full", "civil_only"].includes(scope);
  const includeFinishing = ["full", "finishing_only", "renovation", "interior_only"].includes(scope);
  const includePlumbing = ["full", "plumbing_only", "renovation"].includes(scope);
  const includeElectrical = ["full", "electrical_only", "renovation"].includes(scope);
  const includeCarpentry = ["full", "interior_only", "renovation"].includes(scope);

  // ---------- Site / Civil ----------
  if (includeCivil && area > 0) {
    // Excavation: assumed 3ft deep footing trenches, ~15% of plot perimeter area (approx as fraction of BUA)
    const excavationVol = area * 0.35; // cu.ft estimation
    items.push(boqLine({
      category: "Site Preparation", item: "Site clearing & leveling", unit: "sqft",
      qty: area, rate: 12, remarks: "Assumed",
    }));
    items.push(boqLine({
      category: "Excavation & PCC", item: "Excavation for foundation", unit: "cu.ft",
      qty: excavationVol, rate: 45,
    }));

    // PCC (1:4:8) ~3 inch thick under footings: approx 0.15 × plinth area
    const pccArea = area * 0.15;
    items.push(boqLine({
      category: "Excavation & PCC", item: "PCC 1:4:8 (3\" thick)", unit: "sqft",
      qty: pccArea, rate: 85,
    }));

    // RCC: approx 0.045 cu.m per sqft of BUA (slab + beams + columns) = 1.59 cu.ft per sqft
    // For simplicity use standard per-sqft rate for RCC work
    items.push(boqLine({
      category: "RCC & Structure", item: "RCC Foundation, Columns, Beams & Slab",
      unit: "sqft", qty: area * floors, rate: 285, remarks: "M20 grade, includes shuttering",
    }));
    // Steel reinforcement: ~4kg/sqft of BUA
    const steelKg = area * floors * 4.0;
    items.push(boqLine({
      category: "RCC & Structure", item: "TMT Steel Reinforcement (Fe500)",
      unit: "kg", qty: steelKg, rate: getRate(rates, "steel_tmt", 72),
    }));
    // Cement for RCC ~0.4 bag/sqft
    items.push(boqLine({
      category: "RCC & Structure", item: "Cement for RCC work",
      unit: "bag", qty: area * floors * 0.4, rate: getRate(rates, "cement_bag", 420),
    }));

    // Brickwork / Blockwork: wall area ≈ perimeter × height. Approx wall area = 1.1 × BUA
    const wallArea = area * floors * 1.1;
    const wallThicknessFt = 0.75; // 9 inch wall
    const wallVol = wallArea * wallThicknessFt;
    // Red brick volume = (9×4.5×3 inch) = 0.0703 cu.ft
    const bricks = (wallVol / 0.0703) * 0.85; // 15% mortar allowance
    items.push(boqLine({
      category: "Brickwork & Blockwork", item: "Brickwork in CM 1:6 (9\" wall)",
      unit: "nos", qty: bricks, rate: getRate(rates, "brick_red", 9),
      remarks: "Red clay brick",
    }));
    items.push(boqLine({
      category: "Brickwork & Blockwork", item: "Cement for brickwork",
      unit: "bag", qty: wallVol * 0.12, rate: getRate(rates, "cement_bag", 420),
    }));

    // Plaster: internal + external ≈ 2 × wall area
    const plasterArea = wallArea * 2;
    items.push(boqLine({
      category: "Plaster & Waterproofing", item: "Plaster 12mm internal & external",
      unit: "sqft", qty: plasterArea, rate: 38, remarks: "1:4 mortar",
    }));

    // Waterproofing: roof + bathrooms
    const bathAreaWP = (Number(project.bathrooms) || 0) * 48; // ~48 sqft per bath
    const wpArea = area * 1.0 + bathAreaWP;
    items.push(boqLine({
      category: "Plaster & Waterproofing", item: "Waterproofing (roof + wet areas)",
      unit: "sqft", qty: wpArea, rate: getRate(rates, "waterproofing", 45),
    }));
  }

  // ---------- Finishing: flooring, wall tiles, paint ----------
  if (includeFinishing && area > 0) {
    // Compute per-room finishing if rooms exist, else use bulk
    const rooms = project.rooms || [];
    if (rooms.length > 0) {
      rooms.forEach((room, idx) => {
        const rL = Number(room.length || 0);
        const rW = Number(room.width || 0);
        const rH = Number(room.height || ceilingH);
        const rArea = rL * rW;
        const rWallArea = 2 * (rL + rW) * rH;
        if (rArea <= 0) return;

        // Flooring
        const flKey = room.flooring || "vitrified_tile";
        const flRate = getRateObj(rates, flKey);
        if (flRate) {
          items.push(boqLine({
            category: "Flooring & Tiling",
            item: `${flRate.name} — ${room.type || "Room"} ${idx + 1}`,
            unit: "sqft", qty: rArea * wastage, rate: flRate.rate,
            remarks: `${rL}×${rW} ft`,
          }));
        }
        // Skirting
        const skirtLen = 2 * (rL + rW) * 0.9;
        items.push(boqLine({
          category: "Flooring & Tiling",
          item: `Skirting — ${room.type || "Room"} ${idx + 1}`,
          unit: "rft", qty: skirtLen, rate: 35,
        }));

        // Wall finish
        const wKey = room.wall || "emulsion_paint";
        if (wKey === "ceramic_tile") {
          // Assume tiling up to 7ft
          const tileH = Math.min(7, rH);
          const tileArea = 2 * (rL + rW) * tileH;
          items.push(boqLine({
            category: "Flooring & Tiling",
            item: `Wall Tiling — ${room.type || "Room"} ${idx + 1}`,
            unit: "sqft", qty: tileArea * wastage, rate: getRate(rates, "ceramic_tile", 55),
          }));
          // Rest of wall: paint
          const paintArea = rWallArea - tileArea;
          if (paintArea > 0) {
            items.push(boqLine({
              category: "Painting",
              item: `Paint on walls — ${room.type || "Room"} ${idx + 1}`,
              unit: "sqft", qty: paintArea, rate: 28,
              remarks: "2 coats emulsion + primer",
            }));
          }
        } else if (wKey === "wall_paneling") {
          items.push(boqLine({
            category: "Carpentry & Joinery",
            item: `Veneer Wall Paneling — ${room.type || "Room"} ${idx + 1}`,
            unit: "sqft", qty: rWallArea * 0.5, rate: getRate(rates, "wall_paneling", 950),
            remarks: "50% wall coverage assumed",
          }));
          const paintArea = rWallArea * 0.5;
          items.push(boqLine({
            category: "Painting",
            item: `Paint remaining walls — ${room.type || "Room"} ${idx + 1}`,
            unit: "sqft", qty: paintArea, rate: 28,
          }));
        } else {
          items.push(boqLine({
            category: "Painting",
            item: `Paint walls (${wKey === "distemper" ? "Distemper" : "Emulsion"}) — ${room.type || "Room"} ${idx + 1}`,
            unit: "sqft", qty: rWallArea, rate: wKey === "distemper" ? 18 : 28,
            remarks: "Primer + 2 coats",
          }));
        }

        // Ceiling paint
        items.push(boqLine({
          category: "Painting",
          item: `Ceiling paint — ${room.type || "Room"} ${idx + 1}`,
          unit: "sqft", qty: rArea, rate: 22,
        }));

        // False ceiling if flagged
        if (room.false_ceiling) {
          items.push(boqLine({
            category: "Ceiling",
            item: `Gypsum False Ceiling — ${room.type || "Room"} ${idx + 1}`,
            unit: "sqft", qty: rArea, rate: getRate(rates, "false_ceiling", 95),
          }));
        }
      });
    } else {
      // Bulk estimate
      items.push(boqLine({
        category: "Flooring & Tiling", item: "Vitrified Tile Flooring (bulk)",
        unit: "sqft", qty: area * wastage, rate: getRate(rates, "vitrified_tile", 75),
      }));
      const wallArea = area * 1.1;
      items.push(boqLine({
        category: "Painting", item: "Wall Painting (Emulsion) — bulk",
        unit: "sqft", qty: wallArea * 2, rate: 28,
      }));
      items.push(boqLine({
        category: "Painting", item: "Ceiling Paint — bulk",
        unit: "sqft", qty: area, rate: 22,
      }));
    }

    // Wall putty + primer across total BUA
    const totalWallArea = area * 2.2;
    items.push(boqLine({
      category: "Painting", item: "Wall Putty (2 coats)",
      unit: "sqft", qty: totalWallArea, rate: 22,
    }));
    items.push(boqLine({
      category: "Painting", item: "Primer",
      unit: "sqft", qty: totalWallArea, rate: 12,
    }));
  }

  // ---------- Plumbing ----------
  if (includePlumbing) {
    const bathrooms = Number(project.bathrooms || 0);
    const kitchens = Number(project.kitchens || 0);
    if (bathrooms > 0) {
      items.push(boqLine({
        category: "Plumbing & Sanitary", item: "WC / Commode",
        unit: "nos", qty: bathrooms, rate: getRate(rates, "wc_commode", 6500),
      }));
      items.push(boqLine({
        category: "Plumbing & Sanitary", item: "Washbasin with Pedestal",
        unit: "nos", qty: bathrooms, rate: getRate(rates, "washbasin", 3800),
      }));
      items.push(boqLine({
        category: "Plumbing & Sanitary", item: "Shower Set",
        unit: "nos", qty: bathrooms, rate: getRate(rates, "shower_set", 3200),
      }));
      items.push(boqLine({
        category: "Plumbing & Sanitary", item: "Bib Cocks / Faucets",
        unit: "nos", qty: bathrooms * 3, rate: getRate(rates, "faucet", 850),
      }));
    }
    if (kitchens > 0) {
      items.push(boqLine({
        category: "Plumbing & Sanitary", item: "Kitchen SS Sink",
        unit: "nos", qty: kitchens, rate: getRate(rates, "kitchen_sink", 4500),
      }));
      items.push(boqLine({
        category: "Plumbing & Sanitary", item: "Kitchen Mixer Faucet",
        unit: "nos", qty: kitchens, rate: getRate(rates, "faucet", 850) * 1.5,
      }));
    }
    // Piping lengths
    const cpvcLen = (bathrooms + kitchens) * 45;
    const drainLen = (bathrooms + kitchens) * 25;
    if (cpvcLen > 0) {
      items.push(boqLine({
        category: "Plumbing & Sanitary", item: "CPVC Water Supply Pipes",
        unit: "rft", qty: cpvcLen, rate: getRate(rates, "cpvc_pipe", 95),
      }));
      items.push(boqLine({
        category: "Plumbing & Sanitary", item: "PVC Drain Pipes",
        unit: "rft", qty: drainLen, rate: getRate(rates, "pvc_drain", 180),
      }));
    }
    if (scope === "full" && area > 0) {
      items.push(boqLine({
        category: "Plumbing & Sanitary", item: "PVC Overhead Water Tank (1000L)",
        unit: "nos", qty: 1, rate: getRate(rates, "water_tank", 6500),
      }));
    }
  }

  // ---------- Electrical ----------
  if (includeElectrical && area > 0) {
    const totalRooms = Number(project.bedrooms || 0) + Number(project.living_rooms || 0) +
                       Number(project.kitchens || 0) + Number(project.bathrooms || 0) +
                       Number(project.balconies || 0);
    const effectiveRooms = Math.max(totalRooms, Math.ceil(area / 120));
    const lightPoints = Math.ceil(effectiveRooms * 3 + area / 100);
    const fanPoints = Math.max(effectiveRooms - Number(project.bathrooms || 0), 1);
    const sockets = Math.ceil(effectiveRooms * 4);
    const acPoints = Number(project.bedrooms || 0) + Math.max(Number(project.living_rooms || 0), 1);
    const geysers = Number(project.bathrooms || 0);

    items.push(boqLine({
      category: "Electrical", item: "LED Light Points (incl. fixture)",
      unit: "nos", qty: lightPoints, rate: getRate(rates, "light_point", 650),
    }));
    items.push(boqLine({
      category: "Electrical", item: "Ceiling Fan Points",
      unit: "nos", qty: fanPoints, rate: getRate(rates, "fan_point", 1200),
    }));
    items.push(boqLine({
      category: "Electrical", item: "Modular Switches / Sockets",
      unit: "nos", qty: sockets, rate: getRate(rates, "switch_socket", 180),
    }));
    if (acPoints > 0) {
      items.push(boqLine({
        category: "Electrical", item: "AC Points (20A)",
        unit: "nos", qty: acPoints, rate: getRate(rates, "ac_point", 2200),
      }));
    }
    if (geysers > 0) {
      items.push(boqLine({
        category: "Electrical", item: "Geyser Points",
        unit: "nos", qty: geysers, rate: getRate(rates, "geyser_point", 1500),
      }));
    }
    items.push(boqLine({
      category: "Electrical", item: "Copper Wiring (2.5 sqmm)",
      unit: "rft", qty: area * 2.5, rate: getRate(rates, "wire_copper", 28),
    }));
    items.push(boqLine({
      category: "Electrical", item: "PVC Conduit Pipes",
      unit: "rft", qty: area * 2.2, rate: getRate(rates, "conduit_pipe", 18),
    }));
    items.push(boqLine({
      category: "Electrical", item: "Distribution Board (8-way)",
      unit: "nos", qty: Math.max(1, Math.ceil(area / 800)), rate: getRate(rates, "db_panel", 3500),
    }));
  }

  // ---------- Carpentry & Joinery ----------
  if (includeCarpentry) {
    const bathrooms = Number(project.bathrooms || 0);
    const bedrooms = Number(project.bedrooms || 0);
    const kitchens = Number(project.kitchens || 0);

    // Doors: bedrooms + bathrooms + 1 main + kitchen
    const doors = bedrooms + bathrooms + kitchens + 1;
    if (doors > 0) {
      items.push(boqLine({
        category: "Doors & Windows", item: "Flush Doors with Frame",
        unit: "nos", qty: doors, rate: getRate(rates, "door_flush", 8500),
      }));
    }
    // Windows: ~10% of BUA
    if (area > 0) {
      items.push(boqLine({
        category: "Doors & Windows", item: "Aluminum Sliding Windows",
        unit: "sqft", qty: Math.max(50, area * 0.10), rate: getRate(rates, "window_aluminum", 480),
      }));
    }
    // Wardrobes: 35 sqft per bedroom
    if (bedrooms > 0) {
      items.push(boqLine({
        category: "Carpentry & Joinery", item: "Modular Wardrobes",
        unit: "sqft", qty: bedrooms * 35, rate: getRate(rates, "wardrobe", 1350),
      }));
    }
    // Modular kitchen: 10 rft standard
    if (kitchens > 0) {
      items.push(boqLine({
        category: "Carpentry & Joinery", item: "Modular Kitchen (L-shape)",
        unit: "rft", qty: kitchens * 10, rate: getRate(rates, "modular_kitchen", 2200),
      }));
    }
    // Vanity units for bathrooms
    if (bathrooms > 0) {
      items.push(boqLine({
        category: "Carpentry & Joinery", item: "Bathroom Vanity Unit",
        unit: "nos", qty: bathrooms, rate: getRate(rates, "vanity_unit", 12000),
      }));
    }
    // TV panel for living rooms
    const livingRooms = Number(project.living_rooms || 0);
    if (livingRooms > 0) {
      items.push(boqLine({
        category: "Carpentry & Joinery", item: "TV Panel / Entertainment Unit",
        unit: "sqft", qty: livingRooms * 60, rate: getRate(rates, "tv_panel", 850),
      }));
    }
  }

  // ---------- Labor ----------
  if (includeLabor && area > 0) {
    const mandays = Math.ceil(area * 0.35);
    items.push(boqLine({
      category: "Miscellaneous", item: "Skilled Labor (Mason, Carpenter, Electrician etc.)",
      unit: "day", qty: mandays, rate: 880, remarks: "Consolidated skilled",
    }));
    items.push(boqLine({
      category: "Miscellaneous", item: "Unskilled Helper",
      unit: "day", qty: Math.ceil(mandays * 0.8), rate: getRate(rates, "helper", 550),
    }));
  }

  return finalizeBOQ(project, items, rates);
}

// ---------- Renovation ----------
export function computeRenovation(project, rates = DEFAULT_RATES) {
  // Renovation focuses on re-flooring, rewiring, repainting, bath/kitchen redo
  const p = { ...project, scope: "renovation" };
  return computeDetailedBOQ(p, rates);
}

// ---------- Interior Fit-Out ----------
export function computeInterior(project, rates = DEFAULT_RATES) {
  const p = { ...project, scope: "interior_only" };
  return computeDetailedBOQ(p, rates);
}

// ---------- Finalize (markup, gst, contingency) ----------
function finalizeBOQ(project, items, rates, meta = {}) {
  const subtotal = items.reduce((s, i) => s + Number(i.amount || 0), 0);
  const markup = subtotal * pct(project.contractor_markup_percent || 0);
  const contingency = (subtotal + markup) * pct(project.contingency_percent || 0);
  const preTaxTotal = subtotal + markup + contingency;
  const gst = project.include_gst ? preTaxTotal * pct(project.gst_percent || 0) : 0;
  const total = preTaxTotal + gst;

  return {
    items,
    summary: {
      subtotal,
      markup,
      contingency,
      gst,
      total,
      area: Number(project.built_up_area || 0),
      ratePerSqft: meta.ratePerSqft || (Number(project.built_up_area) ? total / Number(project.built_up_area) : 0),
      itemCount: items.length,
    },
  };
}

// ---------- BOQ Line Helper ----------
function boqLine({ category, item, description = "", unit, qty, rate, remarks = "" }) {
  const q = Number(qty || 0);
  const r = Number(rate || 0);
  return {
    id: crypto.randomUUID(),
    category,
    item,
    description,
    unit,
    quantity: round2(q),
    rate: r,
    amount: round2(q * r),
    remarks,
  };
}

function round2(n) { return Math.round(n * 100) / 100; }

// Recalculate totals after manual edits
export function recalculateBOQ(items, project) {
  const clean = items.map((it) => ({
    ...it,
    amount: round2(Number(it.quantity || 0) * Number(it.rate || 0)),
  }));
  const subtotal = clean.reduce((s, i) => s + Number(i.amount || 0), 0);
  const markup = subtotal * pct(project.contractor_markup_percent || 0);
  const contingency = (subtotal + markup) * pct(project.contingency_percent || 0);
  const preTaxTotal = subtotal + markup + contingency;
  const gst = project.include_gst ? preTaxTotal * pct(project.gst_percent || 0) : 0;
  const total = preTaxTotal + gst;
  return {
    items: clean,
    summary: {
      subtotal, markup, contingency, gst, total,
      area: Number(project.built_up_area || 0),
      ratePerSqft: Number(project.built_up_area) ? total / Number(project.built_up_area) : 0,
      itemCount: clean.length,
    },
  };
}

// Category aggregation
export function aggregateByCategory(items) {
  const map = {};
  items.forEach((i) => {
    const c = i.category || "Miscellaneous";
    if (!map[c]) map[c] = { category: c, amount: 0, qty: 0, items: 0 };
    map[c].amount += Number(i.amount || 0);
    map[c].items += 1;
  });
  return Object.values(map).sort((a, b) => b.amount - a.amount);
}

export function computeProject(project, rates) {
  const mode = project.mode || "detailed";
  if (mode === "quick") return computeQuickEstimate(project, rates);
  if (mode === "renovation") return computeRenovation(project, rates);
  if (mode === "interior") return computeInterior(project, rates);
  return computeDetailedBOQ(project, rates);
}
