export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  recyclable: boolean;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconKey: "plastic" | "paper" | "glass" | "metal" | "organic" | "electronic" | "battery" | "general";
  description: string;
  funFact: string;
}

export const MOCK_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Plastic",
    slug: "plastic",
    recyclable: true,
    color: "#f59e0b",
    bgColor: "bg-pastel-yellow",
    borderColor: "border-amber-200",
    textColor: "text-amber-900",
    iconKey: "plastic",
    description: "Bottles, tubs, and clean food containers (PET 1, HDPE 2, PP 5).",
    funFact: "Recycling 1 ton of plastic saves 5,774 kWh of energy.",
  },
  {
    id: "cat-2",
    name: "Paper & Cardboard",
    slug: "paper",
    recyclable: true,
    color: "#059669",
    bgColor: "bg-pastel-green",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-900",
    iconKey: "paper",
    description: "Clean flattened shipping boxes, packaging, and office paper.",
    funFact: "Recycling 1 ton of paper saves 17 mature trees.",
  },
  {
    id: "cat-3",
    name: "Glass",
    slug: "glass",
    recyclable: true,
    color: "#0284c7",
    bgColor: "bg-pastel-blue",
    borderColor: "border-sky-200",
    textColor: "text-sky-900",
    iconKey: "glass",
    description: "Bottles, beverage containers, and clean food jars.",
    funFact: "Glass can be recycled endlessly with zero loss in quality.",
  },
  {
    id: "cat-4",
    name: "Metal & Cans",
    slug: "metal",
    recyclable: true,
    color: "#ea580c",
    bgColor: "bg-pastel-peach",
    borderColor: "border-orange-200",
    textColor: "text-orange-900",
    iconKey: "metal",
    description: "Aluminum drink cans, clean tin cans, and baking foil trays.",
    funFact: "Recycling aluminum cans saves 95% of the energy needed for new metal.",
  },
  {
    id: "cat-5",
    name: "Organic & Compost",
    slug: "organic",
    recyclable: true,
    color: "#16a34a",
    bgColor: "bg-pastel-mint",
    borderColor: "border-teal-200",
    textColor: "text-teal-900",
    iconKey: "organic",
    description: "Fruit peels, coffee grounds, food prep scraps, and plant cuttings.",
    funFact: "Composting organic matter eliminates landfill methane emissions.",
  },
  {
    id: "cat-6",
    name: "Electronic Waste",
    slug: "electronic-waste",
    recyclable: false,
    color: "#7c3aed",
    bgColor: "bg-pastel-purple",
    borderColor: "border-purple-200",
    textColor: "text-purple-900",
    iconKey: "electronic",
    description: "Cables, broken chargers, phones, laptops, and circuit components.",
    funFact: "E-waste contains valuable recoverable copper, silver, and gold.",
  },
  {
    id: "cat-7",
    name: "Hazardous & Batteries",
    slug: "hazardous-waste",
    recyclable: false,
    color: "#e11d48",
    bgColor: "bg-pastel-pink",
    borderColor: "border-pink-200",
    textColor: "text-pink-900",
    iconKey: "battery",
    description: "Lithium cells, dry cells, paints, and specialty chemicals.",
    funFact: "Special safe handling protects local water tables and the ecosystem.",
  },
  {
    id: "cat-8",
    name: "General Mixed Waste",
    slug: "general-waste",
    recyclable: false,
    color: "#64748b",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-200",
    textColor: "text-slate-800",
    iconKey: "general",
    description: "Non-recyclable wrappers, soiled napkins, and wax cups.",
    funFact: "Correct sorting prevents contamination of recycling streams.",
  },
];

export interface RecyclingTip {
  id: string;
  category: string;
  iconKey: "plastic" | "paper" | "glass" | "metal" | "organic" | "battery";
  title: string;
  summary: string;
  steps: string[];
  dos: string[];
  donts: string[];
}

export const MOCK_RECYCLING_TIPS: RecyclingTip[] = [
  {
    id: "tip-1",
    category: "Plastic",
    iconKey: "plastic",
    title: "How to Recycle Beverage Bottles & Tubs",
    summary: "Empty, rinse, and leave the cap screwed on tightly.",
    steps: [
      "Check the resin code (#1 PET, #2 HDPE, #5 PP are accepted).",
      "Empty all remaining liquids completely.",
      "Quick rinse with cold water.",
      "Crush slightly to save bin volume.",
    ],
    dos: ["Recycle clear water bottles", "Rinse milk jugs", "Leave plastic bottle caps attached"],
    donts: ["Do not put soft plastic bags in curbside bins", "No oily food containers"],
  },
  {
    id: "tip-2",
    category: "Paper & Cardboard",
    iconKey: "paper",
    title: "Flattening Boxes & Clean Paper",
    summary: "Flatten every box and ensure paper remains dry and free of food oil.",
    steps: [
      "Remove packing tape and foam inserts.",
      "Flatten boxes completely flat.",
      "Keep dry and away from moisture.",
    ],
    dos: ["Cardboard shipping boxes", "Clean paper bags", "Magazines and documents"],
    donts: ["Greasy pizza boxes with food residue", "Wax-coated coffee cups", "Used paper towels"],
  },
  {
    id: "tip-3",
    category: "Glass",
    iconKey: "glass",
    title: "Bottles and Food Jars",
    summary: "Rinse food jars clean. Remove metal lids and place them in the metal bin.",
    steps: [
      "Rinse away sauces and residues.",
      "Remove metal twist lids (recycle in metal stream).",
      "Do not break the glass.",
    ],
    dos: ["Wine bottles", "Pickle jars", "Beverage glass bottles"],
    donts: ["Ceramics, porcelain, or mugs", "Window panes and mirrors", "Drinking glasses"],
  },
  {
    id: "tip-4",
    category: "Metal & Cans",
    iconKey: "metal",
    title: "Aluminum Beverage Cans & Food Tins",
    summary: "Infinitely recyclable. Rinse clean and drop in metal recycling bin.",
    steps: [
      "Rinse food tins clean.",
      "Push clean lid down inside the can.",
      "Aluminum beverage cans do not need crushing.",
    ],
    dos: ["Soda and seltzer cans", "Soup and food tins", "Clean aluminum baking trays"],
    donts: ["Paint cans with wet chemical residue", "Pressurized aerosol cans"],
  },
  {
    id: "tip-5",
    category: "Organic & Compost",
    iconKey: "organic",
    title: "Organic Food Scraps & Plant Matter",
    summary: "Turn food scraps into nutrient-rich compost for community gardens and landscaping.",
    steps: [
      "Collect food scraps in a clean container.",
      "Drop off at designated organic compost sorting bins.",
    ],
    dos: ["Fruit and vegetable peels", "Coffee grounds and paper filters", "Eggshells and tea leaves"],
    donts: ["Meat bones and dairy in standard bins", "Plastic stickers on fruit skins"],
  },
  {
    id: "tip-6",
    category: "Hazardous & Batteries",
    iconKey: "battery",
    title: "Batteries & Chemical Safety",
    summary: "Never throw batteries in standard bins. Drop off at designated collection boxes.",
    steps: [
      "Tape battery terminals with clear tape to prevent short circuits.",
      "Place in special designated battery drop box at facility collection centers.",
    ],
    dos: ["AA, AAA, 9V, and button cell batteries", "Rechargeable Li-ion device batteries"],
    donts: ["Never throw in standard trash", "Never crush or puncture"],
  },
];

export interface CollectionSchedule {
  id: string;
  zone: string;
  assignedArea: string;
  dayOfWeek: string;
  nextDate: string;
  timeWindow: string;
  wasteTypes: string[];
  driverStatus: "Scheduled" | "In Progress" | "Completed";
}

export const MOCK_COLLECTIONS: CollectionSchedule[] = [
  {
    id: "col-1",
    zone: "Zone A - North Sector & Residential",
    assignedArea: "Residential Blocks A-D & Facility Complex",
    dayOfWeek: "Monday & Thursday",
    nextDate: "Tomorrow, 8:30 AM",
    timeWindow: "8:30 AM - 11:30 AM",
    wasteTypes: ["Recyclables (Plastics/Paper)", "Organic Compost"],
    driverStatus: "Scheduled",
  },
  {
    id: "col-2",
    zone: "Zone B - Central Plaza & Commercial",
    assignedArea: "Food Court, Dining Hub & Commercial Center",
    dayOfWeek: "Daily (Mon-Sat)",
    nextDate: "Today, 2:00 PM",
    timeWindow: "2:00 PM - 4:00 PM",
    wasteTypes: ["Organic Food Scraps", "Cardboard & Metal Cans"],
    driverStatus: "In Progress",
  },
  {
    id: "col-3",
    zone: "Zone C - Industrial & Research Labs",
    assignedArea: "Technology Park, Labs & Engineering Units",
    dayOfWeek: "Wednesday & Friday",
    nextDate: "Wednesday, 10:00 AM",
    timeWindow: "10:00 AM - 1:00 PM",
    wasteTypes: ["Hazardous & E-Waste Special Pickup", "Clean Glass"],
    driverStatus: "Scheduled",
  },
  {
    id: "col-4",
    zone: "Zone D - Administration & Corporate",
    assignedArea: "Headquarters, Main Offices & Archive Suites",
    dayOfWeek: "Tuesday & Friday",
    nextDate: "Tuesday, 9:00 AM",
    timeWindow: "9:00 AM - 12:00 PM",
    wasteTypes: ["Paper & Document Shredding", "Recyclable Plastics"],
    driverStatus: "Scheduled",
  },
];

export interface SampleClassifyItem {
  id: string;
  name: string;
  category: string;
  iconKey: "plastic" | "paper" | "metal" | "organic" | "battery" | "general";
  confidence: number;
  recyclable: boolean;
  detectedType: string;
  instructions: string;
  imageUrl: string;
}

export const SAMPLE_CLASSIFY_ITEMS: SampleClassifyItem[] = [
  {
    id: "sample-1",
    name: "PET Water Bottle",
    category: "Plastic",
    iconKey: "plastic",
    confidence: 0.984,
    recyclable: true,
    detectedType: "PET #1 Clear Plastic Bottle",
    instructions: "Rinse lightly, leave cap screwed on, toss into yellow plastic recycling bin.",
    imageUrl: "/vectors/PETWATERBOTTLE.png",
  },
  {
    id: "sample-2",
    name: "Cardboard Delivery Box",
    category: "Paper & Cardboard",
    iconKey: "paper",
    confidence: 0.962,
    recyclable: true,
    detectedType: "Corrugated Cardboard Box",
    instructions: "Remove packing tape, flatten completely flat, place in blue paper bin.",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "sample-3",
    name: "Soda Can",
    category: "Metal & Cans",
    iconKey: "metal",
    confidence: 0.991,
    recyclable: true,
    detectedType: "Aluminum Beverage Can",
    instructions: "Empty liquid, place directly into metal recycling container.",
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "sample-4",
    name: "Apple Core & Fruit Peel",
    category: "Organic & Compost",
    iconKey: "organic",
    confidence: 0.945,
    recyclable: true,
    detectedType: "Food & Organic Matter",
    instructions: "Place in green organics bin for composting streams.",
    imageUrl: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "sample-5",
    name: "Lithium Battery",
    category: "Hazardous & Batteries",
    iconKey: "battery",
    confidence: 0.978,
    recyclable: false,
    detectedType: "Alkaline / Lithium Battery",
    instructions: "Tape terminals. Do NOT place in normal bins. Drop at dedicated e-waste collection point.",
    imageUrl: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "sample-6",
    name: "Takeout Coffee Cup",
    category: "General Mixed Waste",
    iconKey: "general",
    confidence: 0.912,
    recyclable: false,
    detectedType: "Wax-Coated Paper Cup with Plastic Lid",
    instructions: "Separate plastic lid (recycle #5) and place wax cup in general waste bin.",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80",
  },
];

export interface WasteReportItem {
  id: string;
  category: string;
  iconKey: "plastic" | "paper" | "glass" | "metal" | "organic" | "electronic" | "battery" | "general";
  quantityKg: number;
  location: string;
  description: string;
  date: string;
  recyclable: boolean;
  status: "verified" | "pending" | "review_required";
  confidence: number;
}

export const INITIAL_MOCK_REPORTS: WasteReportItem[] = [
  {
    id: "rep-101",
    category: "Plastic",
    iconKey: "plastic",
    quantityKg: 3.4,
    location: "Facility Tower B, 2nd Floor",
    description: "Sorted plastic drink bottles and clean food containers.",
    date: "Today, 11:20 AM",
    recyclable: true,
    status: "verified",
    confidence: 0.97,
  },
  {
    id: "rep-102",
    category: "Paper & Cardboard",
    iconKey: "paper",
    quantityKg: 8.5,
    location: "Central Operations, Delivery Dock",
    description: "Flattened shipping cartons and printer paper boxes.",
    date: "Yesterday, 3:45 PM",
    recyclable: true,
    status: "verified",
    confidence: 0.99,
  },
  {
    id: "rep-103",
    category: "Metal & Cans",
    iconKey: "metal",
    quantityKg: 1.8,
    location: "Building D Break Room",
    description: "Rinsed aluminum beverage cans.",
    date: "Aug 14, 2026",
    recyclable: true,
    status: "verified",
    confidence: 0.98,
  },
  {
    id: "rep-104",
    category: "Organic & Compost",
    iconKey: "organic",
    quantityKg: 5.2,
    location: "Main Cafeteria & Food Prep Station",
    description: "Coffee grounds and fruit prep scraps.",
    date: "Aug 13, 2026",
    recyclable: true,
    status: "verified",
    confidence: 0.95,
  },
  {
    id: "rep-105",
    category: "Electronic Waste",
    iconKey: "electronic",
    quantityKg: 2.1,
    location: "IT Operations & Hardware Hub",
    description: "Defective USB cables, broken keyboards, and retired adapters.",
    date: "Aug 12, 2026",
    recyclable: false,
    status: "verified",
    confidence: 0.92,
  },
];
