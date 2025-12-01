
import { MenuItem, GalleryItem } from './types';
import { ASSETS } from './assets/images';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: { en: "Seared Scallops", bs: "Pržene Jakovice" },
    description: { en: "Delicate scallops with a lemon-butter sauce and fresh herbs.", bs: "Nježne jakovice sa sosom od putera i limuna te svježim začinskim biljem." },
    price: "$24",
    category: "Starters",
    image: ASSETS.MENU.SCALLOPS
  },
  {
    id: 2,
    name: { en: "Truffle Risotto", bs: "Rižoto s Tartufima" },
    description: { en: "Creamy Arborio rice with black truffle, Parmesan, and a hint of white wine.", bs: "Kremasta Arborio riža s crnim tartufom, parmezanom i dodirom bijelog vina." },
    price: "$28",
    category: "Main Dishes",
    image: ASSETS.MENU.RISOTTO_TRUFFLE
  },
  {
    id: 3,
    name: { en: "Margherita Pizza", bs: "Pizza Margherita" },
    description: { en: "Fresh mozzarella, San Marzano tomatoes, and basil on a thin crust.", bs: "Svježa mocarela, San Marzano paradajz i bosiljak na tankom tijestu." },
    price: "$22",
    category: "Pizza",
    image: ASSETS.MENU.PIZZA
  },
  {
    id: 4,
    name: { en: "Grilled Salmon", bs: "Grilovani Losos" },
    description: { en: "Perfectly grilled salmon served with asparagus and a dill sauce.", bs: "Savršeno grilovan losos serviran sa šparogama i sosom od kopra." },
    price: "$32",
    category: "Main Dishes",
    image: ASSETS.MENU.SALMON
  },
  {
    id: 5,
    name: { en: "Spaghetti Carbonara", bs: "Špageti Carbonara" },
    description: { en: "Al dente spaghetti with pancetta, egg yolk, Pecorino Romano, and black pepper.", bs: "Al dente špageti s pančetom, žumanjkom, Pecorino Romano sirom i crnim biberom." },
    price: "$26",
    category: "Pasta",
    image: ASSETS.MENU.CARBONARA
  },
  {
    id: 6,
    name: { en: "Classic Tiramisu", bs: "Klasični Tiramisu" },
    description: { en: "Layers of coffee-soaked ladyfingers and mascarpone cream, dusted with cocoa.", bs: "Slojevi piškota natopljenih kafom i maskarpone kreme, posuti kakaom." },
    price: "$14",
    category: "Desserts",
    image: ASSETS.MENU.TIRAMISU
  },
  {
    id: 7,
    name: { en: "Grilled Adriatic Sea Bass", bs: "Grilovani Jadranski Brancin" },
    description: { en: "Served with a lemon-butter sauce and seasonal vegetables.", bs: "Serviran sa sosom od putera i limuna te sezonskim povrćem." },
    price: "$34",
    category: "Main Dishes",
    image: ASSETS.MENU.SEABASS
  },
  {
    id: 8,
    name: { en: "Slow-Cooked Lamb Shank", bs: "Sporo Kuhana Janjeća Koljenica" },
    description: { en: "Tender lamb in a rich red wine reduction with creamy polenta.", bs: "Mekana janjetina u bogatoj redukciji crnog vina sa kremastom palentom." },
    price: "$36",
    category: "Main Dishes",
    image: ASSETS.MENU.LAMB
  },
  {
    id: 9,
    name: { en: "Saffron Risotto", bs: "Rižoto sa Šafranom" },
    description: { en: "Creamy risotto with parmesan, asparagus, and a hint of truffle.", bs: "Kremasti rižoto s parmezanom, šparogama i dodirom tartufa." },
    price: "$28",
    category: "Pasta",
    image: ASSETS.MENU.RISOTTO_SAFFRON
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, alt: { en: "-", bs: "-" }, size: 'wide', image: ASSETS.GALLERY.KOTO2 },
  { id: 2, alt: { en: "-", bs: "-" }, size: 'normal', image: ASSETS.GALLERY.KOTO1 },
  { id: 3, alt: { en: "-", bs: "-" }, size: 'normal', image: ASSETS.GALLERY.KOTO3 },
  { id: 4, alt: { en: "-", bs: "-" }, size: 'wide', image: ASSETS.GALLERY.KOTO4 },
  { id: 5, alt: { en: "-", bs: "-" }, size: 'tall', image: ASSETS.GALLERY.KOTO5 },
  { id: 6, alt: { en: "-", bs: "-" }, size: 'normal', image: ASSETS.GALLERY.KOTO6 },
  { id: 7, alt: { en: "-", bs: "-" }, size: 'normal', image: ASSETS.GALLERY.KOTO7 },
  { id: 8, alt: { en: "-", bs: "-" }, size: 'normal', image: ASSETS.GALLERY.KOTO8 },
  { id: 9, alt: { en: "-", bs: "-" }, size: 'normal', image: ASSETS.GALLERY.KOTO9 },
  { id: 10, alt: { en: "-", bs: "-" }, size: 'wide', image: ASSETS.GALLERY.KOTO10 },
  { id: 11, alt: { en: "-", bs: "-" }, size: 'normal', image: ASSETS.GALLERY.KOTO11 },
  { id: 12, alt: { en: "-", bs: "-" }, size: 'normal', image: ASSETS.GALLERY.KOTO12 },
  { id: 13, alt: { en: "-", bs: "-" }, size: 'wide', image: ASSETS.GALLERY.KOTO13 },
  { id: 14, alt: { en: "-", bs: "-" }, size: 'normal', image: ASSETS.GALLERY.KOTO14 },
  { id: 15, alt: { en: "-", bs: "-" }, size: 'normal', image: ASSETS.GALLERY.KOTO15 },
  { id: 16, alt: { en: "-", bs: "-" }, size: 'normal', image: ASSETS.GALLERY.KOTO16 },
  { id: 17, alt: { en: "-", bs: "-" }, size: 'normal', image: ASSETS.GALLERY.KOTO17 },
];
