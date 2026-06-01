import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Calendar,
  MessageCircle,
  FileText,
  Presentation,
  MapPin,
  ClipboardList,
  Clock,
  Calculator,
  Palette,
  Hammer,
  Store,
  Package,
  CheckCircle,
  Handshake,
  Files,
  PenTool,
  ThumbsUp,
  BarChart3,
  History,
  ListTodo,
  Building2,
  Upload,
  FileUp,
  StickyNote,
} from "lucide-react";

// Default rate library (mirrors backend defaults - used if backend unreachable)
export const DEFAULT_RATES = {
  cement_bag: {
    name: "Cement (OPC 53) — per bag (50kg)",
    unit: "bag",
    rate: 420,
    category: "Civil",
  },
  sand_river: {
    name: "River Sand",
    unit: "cu.ft",
    rate: 85,
    category: "Civil",
  },
  aggregate_20mm: {
    name: "Coarse Aggregate 20mm",
    unit: "cu.ft",
    rate: 65,
    category: "Civil",
  },
  steel_tmt: {
    name: "TMT Steel Bars (Fe500)",
    unit: "kg",
    rate: 72,
    category: "Civil",
  },
  brick_red: {
    name: "Red Clay Brick",
    unit: "nos",
    rate: 9,
    category: "Civil",
  },
  aac_block: {
    name: "AAC Block 600x200x150mm",
    unit: "nos",
    rate: 70,
    category: "Civil",
  },
  fly_ash_block: {
    name: "Fly Ash Block",
    unit: "nos",
    rate: 12,
    category: "Civil",
  },

  vitrified_tile: {
    name: "Vitrified Tile 600x600mm",
    unit: "sqft",
    rate: 75,
    category: "Finishing",
  },
  ceramic_tile: {
    name: "Ceramic Wall Tile",
    unit: "sqft",
    rate: 55,
    category: "Finishing",
  },
  marble: {
    name: "Marble Flooring",
    unit: "sqft",
    rate: 220,
    category: "Finishing",
  },
  granite: {
    name: "Granite Slab",
    unit: "sqft",
    rate: 180,
    category: "Finishing",
  },
  wooden_floor: {
    name: "Wooden / Laminate Flooring",
    unit: "sqft",
    rate: 140,
    category: "Finishing",
  },
  wall_putty: {
    name: "Wall Putty (Birla/JK)",
    unit: "kg",
    rate: 28,
    category: "Finishing",
  },
  primer: {
    name: "Wall Primer",
    unit: "ltr",
    rate: 180,
    category: "Finishing",
  },
  emulsion_paint: {
    name: "Premium Emulsion Paint",
    unit: "ltr",
    rate: 320,
    category: "Finishing",
  },
  distemper: {
    name: "Acrylic Distemper",
    unit: "ltr",
    rate: 180,
    category: "Finishing",
  },
  exterior_paint: {
    name: "Exterior Weatherproof Paint",
    unit: "ltr",
    rate: 420,
    category: "Finishing",
  },
  waterproofing: {
    name: "Waterproofing Compound",
    unit: "sqft",
    rate: 45,
    category: "Finishing",
  },
  false_ceiling: {
    name: "Gypsum False Ceiling",
    unit: "sqft",
    rate: 95,
    category: "Finishing",
  },
  pop_punning: {
    name: "POP Punning",
    unit: "sqft",
    rate: 22,
    category: "Finishing",
  },

  cpvc_pipe: {
    name: "CPVC Pipe 1/2 inch",
    unit: "rft",
    rate: 95,
    category: "Plumbing",
  },
  pvc_drain: {
    name: "PVC Drain Pipe 4 inch",
    unit: "rft",
    rate: 180,
    category: "Plumbing",
  },
  wc_commode: {
    name: "WC / Commode (Standard)",
    unit: "nos",
    rate: 6500,
    category: "Plumbing",
  },
  washbasin: {
    name: "Washbasin with Pedestal",
    unit: "nos",
    rate: 3800,
    category: "Plumbing",
  },
  kitchen_sink: {
    name: "Kitchen SS Sink",
    unit: "nos",
    rate: 4500,
    category: "Plumbing",
  },
  shower_set: {
    name: "Shower Set (Overhead + Mixer)",
    unit: "nos",
    rate: 3200,
    category: "Plumbing",
  },
  faucet: {
    name: "Bib Cock / Faucet",
    unit: "nos",
    rate: 850,
    category: "Plumbing",
  },
  water_tank: {
    name: "PVC Water Tank (1000L)",
    unit: "nos",
    rate: 6500,
    category: "Plumbing",
  },

  wire_copper: {
    name: "Copper Wire 2.5 sqmm",
    unit: "rft",
    rate: 28,
    category: "Electrical",
  },
  conduit_pipe: {
    name: "PVC Conduit Pipe",
    unit: "rft",
    rate: 18,
    category: "Electrical",
  },
  switch_socket: {
    name: "Modular Switch / Socket",
    unit: "nos",
    rate: 180,
    category: "Electrical",
  },
  db_panel: {
    name: "Distribution Board (8-way)",
    unit: "nos",
    rate: 3500,
    category: "Electrical",
  },
  light_point: {
    name: "LED Light Point (incl. fixture)",
    unit: "nos",
    rate: 650,
    category: "Electrical",
  },
  fan_point: {
    name: "Ceiling Fan Point",
    unit: "nos",
    rate: 1200,
    category: "Electrical",
  },
  ac_point: {
    name: "AC Point (20A)",
    unit: "nos",
    rate: 2200,
    category: "Electrical",
  },
  geyser_point: {
    name: "Geyser Point",
    unit: "nos",
    rate: 1500,
    category: "Electrical",
  },

  wardrobe: {
    name: "Modular Wardrobe (with laminate)",
    unit: "sqft",
    rate: 1350,
    category: "Carpentry",
  },
  modular_kitchen: {
    name: "Modular Kitchen (L/U shaped)",
    unit: "rft",
    rate: 2200,
    category: "Carpentry",
  },
  tv_panel: {
    name: "TV Panel / Entertainment Unit",
    unit: "sqft",
    rate: 850,
    category: "Carpentry",
  },
  door_flush: {
    name: "Flush Door with Frame",
    unit: "nos",
    rate: 8500,
    category: "Carpentry",
  },
  window_aluminum: {
    name: "Aluminum Sliding Window",
    unit: "sqft",
    rate: 480,
    category: "Carpentry",
  },
  wall_paneling: {
    name: "Veneer Wall Paneling",
    unit: "sqft",
    rate: 950,
    category: "Carpentry",
  },
  vanity_unit: {
    name: "Bathroom Vanity Unit",
    unit: "nos",
    rate: 12000,
    category: "Carpentry",
  },

  mason: { name: "Mason (skilled)", unit: "day", rate: 850, category: "Labor" },
  helper: {
    name: "Helper / Unskilled Labor",
    unit: "day",
    rate: 550,
    category: "Labor",
  },
  carpenter: { name: "Carpenter", unit: "day", rate: 900, category: "Labor" },
  plumber: { name: "Plumber", unit: "day", rate: 900, category: "Labor" },
  electrician: {
    name: "Electrician",
    unit: "day",
    rate: 900,
    category: "Labor",
  },
  painter: { name: "Painter", unit: "day", rate: 800, category: "Labor" },
  tile_mason: { name: "Tile Mason", unit: "day", rate: 950, category: "Labor" },
};

// Quality multipliers
export const QUALITY_MULTIPLIER = {
  basic: 0.8,
  standard: 1.0,
  premium: 1.35,
  luxury: 1.8,
};

// Per-sqft baseline for Quick Estimate (INR / sqft, Standard quality, RCC)
export const QUICK_RATE_BASELINE = {
  residential: 1850,
  commercial: 2200,
  renovation: 950,
  interior: 1500,
};

// Category split for Quick Estimate (fractions of total)
export const CATEGORY_SPLIT = {
  "Site Preparation": 0.02,
  "Excavation & PCC": 0.03,
  "RCC & Structure": 0.22,
  "Brickwork & Blockwork": 0.08,
  "Plaster & Waterproofing": 0.06,
  "Flooring & Tiling": 0.14,
  Painting: 0.06,
  "Plumbing & Sanitary": 0.09,
  Electrical: 0.08,
  "Carpentry & Joinery": 0.14,
  "Doors & Windows": 0.05,
  Miscellaneous: 0.03,
};

// City multipliers
export const CITY_MULTIPLIER = {
  Mumbai: 1.25,
  "Delhi NCR": 1.15,
  Bangalore: 1.18,
  Pune: 1.12,
  Hyderabad: 1.08,
  Chennai: 1.1,
  Kolkata: 1.05,
  Ahmedabad: 1.0,
  Jaipur: 0.95,
  Lucknow: 0.9,
  "Tier 2 / Other": 0.92,
  "Tier 3 / Rural": 0.82,
};

export const FLOORING_OPTIONS = [
  { key: "vitrified_tile", label: "Vitrified Tile" },
  { key: "ceramic_tile", label: "Ceramic Tile" },
  { key: "marble", label: "Marble" },
  { key: "granite", label: "Granite" },
  { key: "wooden_floor", label: "Wooden / Laminate" },
];

export const WALL_FINISH_OPTIONS = [
  { key: "emulsion_paint", label: "Emulsion Paint" },
  { key: "distemper", label: "Distemper" },
  { key: "wall_paneling", label: "Veneer Paneling" },
  { key: "ceramic_tile", label: "Wall Tile (bath/kitchen)" },
];

export const ROOM_TYPES = [
  "Bedroom",
  "Master Bedroom",
  "Living Room",
  "Dining Room",
  "Kitchen",
  "Bathroom",
  "Balcony",
  "Study",
  "Store",
  "Puja Room",
  "Office",
  "Reception",
  "Cabin",
  "Conference",
  "Other",
];

export const PROJECT_TEMPLATES = [
  {
    id: "house_construction",
    name: "New House Construction (2 BHK)",
    description:
      "Full construction — foundation to finish for a 2BHK independent home",
    image:
      "https://images.unsplash.com/photo-1773643331824-ee399df4e1e5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBob3VzZSUyMGNvbnN0cnVjdGlvbnxlbnwwfHx8fDE3NzY0NDk2MTh8MA&ixlib=rb-4.1.0&q=85",
    mode: "detailed",
    preset: {
      name: "New House — 2BHK",
      project_type: "residential",
      scope: "full",
      quality: "standard",
      plot_area: 1200,
      built_up_area: 1000,
      carpet_area: 850,
      floors: 1,
      bedrooms: 2,
      bathrooms: 2,
      kitchens: 1,
      living_rooms: 1,
      balconies: 1,
      ceiling_height: 10,
      rooms: [
        {
          type: "Master Bedroom",
          length: 14,
          width: 12,
          height: 10,
          flooring: "vitrified_tile",
          wall: "emulsion_paint",
        },
        {
          type: "Bedroom",
          length: 12,
          width: 10,
          height: 10,
          flooring: "vitrified_tile",
          wall: "emulsion_paint",
        },
        {
          type: "Living Room",
          length: 16,
          width: 14,
          height: 10,
          flooring: "vitrified_tile",
          wall: "emulsion_paint",
        },
        {
          type: "Kitchen",
          length: 10,
          width: 8,
          height: 10,
          flooring: "vitrified_tile",
          wall: "ceramic_tile",
        },
        {
          type: "Bathroom",
          length: 8,
          width: 6,
          height: 10,
          flooring: "ceramic_tile",
          wall: "ceramic_tile",
        },
        {
          type: "Bathroom",
          length: 7,
          width: 5,
          height: 10,
          flooring: "ceramic_tile",
          wall: "ceramic_tile",
        },
      ],
    },
  },
  {
    id: "bathroom_renovation",
    name: "Bathroom Renovation",
    description:
      "Complete bathroom redo — tiles, plumbing, fixtures, waterproofing",
    image:
      "https://images.unsplash.com/photo-1762418362644-a4daad168fb9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzZ8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBiYXRocm9vbSUyMHJlbm92YXRpb258ZW58MHx8fHwxNzc2NDQ5NjE4fDA&ixlib=rb-4.1.0&q=85",
    mode: "renovation",
    preset: {
      name: "Bathroom Renovation",
      project_type: "renovation",
      scope: "renovation",
      quality: "premium",
      built_up_area: 50,
      bathrooms: 1,
      ceiling_height: 10,
      rooms: [
        {
          type: "Bathroom",
          length: 8,
          width: 6,
          height: 10,
          flooring: "ceramic_tile",
          wall: "ceramic_tile",
        },
      ],
    },
  },
  {
    id: "office_interior",
    name: "Office Interior Fit-Out",
    description:
      "Commercial office interior — partitions, flooring, lighting, workstations",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwwfHx8fDE3NzY0NDk2MTh8MA&ixlib=rb-4.1.0&q=85",
    mode: "interior",
    preset: {
      name: "Office Interior Fit-Out",
      project_type: "commercial",
      scope: "interior_only",
      quality: "premium",
      built_up_area: 2000,
      ceiling_height: 11,
      rooms: [
        {
          type: "Reception",
          length: 20,
          width: 15,
          height: 11,
          flooring: "vitrified_tile",
          wall: "emulsion_paint",
        },
        {
          type: "Cabin",
          length: 14,
          width: 12,
          height: 11,
          flooring: "wooden_floor",
          wall: "wall_paneling",
        },
        {
          type: "Conference",
          length: 20,
          width: 14,
          height: 11,
          flooring: "vitrified_tile",
          wall: "emulsion_paint",
        },
        {
          type: "Office",
          length: 40,
          width: 25,
          height: 11,
          flooring: "vitrified_tile",
          wall: "emulsion_paint",
        },
      ],
    },
  },
  {
    id: "kitchen_remodel",
    name: "Modular Kitchen Remodel",
    description:
      "Modular kitchen with cabinets, counter, appliances, tile work",
    image:
      "https://images.unsplash.com/photo-1771862956369-c840b0a1fc9d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBraXRjaGVuJTIwcmVtb2RlbHxlbnwwfHx8fDE3NzY0NDk2MTh8MA&ixlib=rb-4.1.0&q=85",
    mode: "renovation",
    preset: {
      name: "Modular Kitchen Remodel",
      project_type: "renovation",
      scope: "renovation",
      quality: "premium",
      built_up_area: 80,
      kitchens: 1,
      ceiling_height: 10,
      rooms: [
        {
          type: "Kitchen",
          length: 10,
          width: 8,
          height: 10,
          flooring: "vitrified_tile",
          wall: "ceramic_tile",
        },
      ],
    },
  },
];
export const navSections = [
  {
    title: "MAIN",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: FolderKanban, label: "Projects", path: "/projects" },
      { icon: Users, label: "Clients", path: "/clients" },
      { icon: Calendar, label: "Calendar", path: "/calendar" },
      { icon: MessageCircle, label: "Chat", path: "/chat" },
    ],
  },
  {
    title: "WORKFLOW",
    items: [
      { icon: FileText, label: "Brief", path: "/brief" },
      { icon: Presentation, label: "Pitch", path: "/pitches" },
      { icon: MapPin, label: "Site Reki", path: "/site-reki" },
      { icon: ClipboardList, label: "Scope of Work", path: "/scopes" },
      { icon: Clock, label: "Time & Cost", path: "/time-cost" },
      { icon: Calculator, label: "BOQ", path: "/boq" },
      { icon: Hammer, label: "Execution", path: "/execution" },
      { icon: Store, label: "Vendors", path: "/vendors" },
      { icon: Package, label: "Inventory", path: "/inventory" },
      { icon: CheckCircle, label: "Quality & Progress", path: "/quality" },
      { icon: Handshake, label: "Handover", path: "/handover" },
    ],
  },
  {
    title: "DOCUMENTS",
    items: [
      { icon: PenTool, label: "Drawings", path: "/drawings" },
      { icon: ThumbsUp, label: "Approvals", path: "/approvals" },
      { icon: BarChart3, label: "Reports", path: "/reports" },
      { icon: History, label: "Revision Logs", path: "/revision-logs" },
    ],
  },
  {
    title: "TEAM",
    items: [
      { icon: ListTodo, label: "Team Tasks", path: "/team-tasks" },
      { icon: ListTodo, label: "Team & Roles", path: "/team-roles" },
      {
        icon: Building2,
        label: "Site Coordination",
        path: "/site-coordination",
      },
      { icon: StickyNote, label: "Internal Notes", path: "/notes" },
    ],
  },
];

export const quickActions = [
  { icon: Upload, label: "Upload Design" },
  { icon: FileUp, label: "Upload Execution Drawing" },
  { icon: Presentation, label: "Create Pitch Document" },
  { icon: Calculator, label: "Add BOQ Version" },
  { icon: ThumbsUp, label: "Review Client Remarks" },
];
