import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Bookmark,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  PackageOpen,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Tag,
  UserRound,
  X,
} from "lucide-react";

const citySubcities = {
  "Addis Ababa": [
    "Bole",
    "Kirkos",
    "Yeka",
    "Arada",
    "Lideta",
    "Nifas Silk-Lafto",
  ],
  Hawassa: ["Tabor", "Misrak", "Menaharia", "Dato"],
  Adama: ["Bole", "Gendegerada", "Dabe"],
};

const initialListings = [
  {
    id: 1,
    title: "Minimal oak writing desk",
    category: "Furniture",
    price: 8500,
    condition: "Like new",
    city: "Addis Ababa",
    subcity: "Bole",
    seller: "Mimi T.",
    verified: true,
    posted: "2 hours ago",
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=85",
    color: "bg-[#e9e3d8]",
  },
  {
    id: 2,
    title: "iPhone 12 · 128 GB",
    category: "Electronics",
    price: 32000,
    condition: "Good",
    city: "Addis Ababa",
    subcity: "Kirkos",
    seller: "Dawit K.",
    verified: true,
    posted: "5 hours ago",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=85",
    color: "bg-[#e6e9e7]",
  },
  {
    id: 3,
    title: "Everyday leather tote",
    category: "Fashion",
    price: 1800,
    condition: "Good",
    city: "Hawassa",
    subcity: "Tabor",
    seller: "Hana M.",
    verified: false,
    posted: "Yesterday",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",
    color: "bg-[#efe5dc]",
  },
  {
    id: 4,
    title: "Classic acoustic guitar",
    category: "Hobbies",
    price: 6500,
    condition: "Like new",
    city: "Adama",
    subcity: "Bole",
    seller: "Robel A.",
    verified: true,
    posted: "Yesterday",
    image:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=85",
    color: "bg-[#eee4d7]",
  },
  {
    id: 5,
    title: "Ceramic coffee set",
    category: "Home & living",
    price: 1200,
    condition: "New",
    city: "Addis Ababa",
    subcity: "Yeka",
    seller: "Selam B.",
    verified: true,
    posted: "2 days ago",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
    color: "bg-[#e9e4dc]",
  },
  {
    id: 6,
    title: "Mountain bike, ready to ride",
    category: "Sports",
    price: 14500,
    condition: "Good",
    city: "Hawassa",
    subcity: "Misrak",
    seller: "Yonas G.",
    verified: false,
    posted: "3 days ago",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=85",
    color: "bg-[#e1e8e4]",
  },
];

const categories = [
  "Everything",
  "Electronics",
  "Furniture",
  "Fashion",
  "Home & living",
  "Hobbies",
  "Sports",
];

const money = (amount) => `ETB ${Number(amount).toLocaleString("en-ET")}`;

function ListingCard({ listing, saved, onSave, onChat }) {
  return (
    <article className="group overflow-hidden rounded-[1.4rem] border border-[#ece9e2] bg-white transition hover:-translate-y-1 hover:shadow-[0_14px_38px_rgba(27,45,34,0.09)]">
      <div className={`relative aspect-[1.15] overflow-hidden ${listing.color}`}>
        <img
          src={listing.image}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <button
          type="button"
          aria-label={saved ? "Remove from saved items" : "Save item"}
          onClick={() => onSave(listing.id)}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full shadow-sm transition ${
            saved
              ? "bg-[#214d38] text-white"
              : "bg-white/90 text-[#344439] hover:bg-white"
          }`}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#39483d] backdrop-blur">
          {listing.condition}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-h-11 text-[15px] font-semibold leading-5 text-[#25352a]">
            {listing.title}
          </h3>
          <span className="shrink-0 rounded-full bg-[#f3f5ef] px-2.5 py-1 text-[10px] font-medium text-[#687365]">
            {listing.category}
          </span>
        </div>
        <p className="mt-2 text-lg font-bold tracking-tight text-[#214d38]">
          {money(listing.price)}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-[#f0eee8] pt-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-xs font-medium text-[#455448]">
              <span className="truncate">{listing.seller}</span>
              {listing.verified && (
                <BadgeCheck size={14} className="shrink-0 text-[#4c8664]" />
              )}
            </p>
            <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-[#8b9288]">
              <MapPin size={12} />
              {listing.subcity}, {listing.city}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChat(listing)}
            aria-label={`Message ${listing.seller} about ${listing.title}`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#e5e9e1] text-[#315940] transition hover:bg-[#eff4ed]"
          >
            <MessageCircle size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [listings, setListings] = useState(initialListings);
  const [savedIds, setSavedIds] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [category, setCategory] = useState("Everything");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All cities");
  const [subcity, setSubcity] = useState("All subcities");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);
  const [listingCityForm, setListingCityForm] = useState("Addis Ababa");
  const [chatListing, setChatListing] = useState(null);
  const [messages, setMessages] = useState({});
  const [draft, setDraft] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (!telegram) return;
    telegram.ready();
    telegram.expand();
    telegram.setHeaderColor?.("#f7f6f1");
    telegram.setBackgroundColor?.("#f7f6f1");
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const visibleListings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return listings.filter((listing) => {
      const matchesTab =
        activeTab !== "saved" || savedIds.includes(listing.id);
      const matchesCategory =
        category === "Everything" || listing.category === category;
      const matchesCity = city === "All cities" || listing.city === city;
      const matchesSubcity =
        subcity === "All subcities" || listing.subcity === subcity;
      const matchesQuery =
        !query ||
        `${listing.title} ${listing.category} ${listing.city} ${listing.subcity} ${listing.seller}`
          .toLowerCase()
          .includes(query);
      const matchesMin = !minPrice || listing.price >= Number(minPrice);
      const matchesMax = !maxPrice || listing.price <= Number(maxPrice);
      return (
        matchesTab &&
        matchesCategory &&
        matchesCity &&
        matchesSubcity &&
        matchesQuery &&
        matchesMin &&
        matchesMax
      );
    });
  }, [
    activeTab,
    category,
    city,
    listings,
    maxPrice,
    minPrice,
    savedIds,
    search,
    subcity,
  ]);

  const toggleSaved = (id) => {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id],
    );
  };

  const openChat = (listing) => {
    setChatListing(listing);
    setActiveTab("inbox");
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("light");
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !chatListing) return;
    setMessages((current) => ({
      ...current,
      [chatListing.id]: [
        ...(current[chatListing.id] || [
          {
            from: "seller",
            text: `Hi! Thanks for asking about ${chatListing.title}. Let me know what you'd like to know.`,
          },
        ]),
        { from: "buyer", text },
      ],
    }));
    setDraft("");
  };

  const publishListing = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const price = Number(form.get("price"));
    const listingCity = String(form.get("city") || "");
    const listingSubcity = String(form.get("subcity") || "");
    if (!title || !price || !listingCity || !listingSubcity) return;
    const newListing = {
      id: Date.now(),
      title,
      price,
      city: listingCity,
      subcity: listingSubcity,
      category: String(form.get("category") || "Home & living"),
      condition: String(form.get("condition") || "Good"),
      seller: "You",
      verified: false,
      posted: "Just now",
      image:
        "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=85",
      color: "bg-[#e9e3d8]",
    };
    setListings((current) => [newListing, ...current]);
    setActiveTab("home");
    setCategory("Everything");
    setCity("All cities");
    setSubcity("All subcities");
    setSearch("");
    setShowListingForm(false);
    setToast("Your listing is live on Liyu!");
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.("success");
  };

  const startSelling = () => {
    setShowListingForm(true);
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("light");
  };

  const setSelectedCity = (value) => {
    setCity(value);
    setSubcity("All subcities");
  };

  const navItems = [
    { id: "home", label: "Explore", icon: Home },
    { id: "saved", label: "Saved", icon: Bookmark },
    { id: "inbox", label: "Inbox", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f1] pb-24 text-[#25352a] selection:bg-[#d7e6d7]">
      <header className="sticky top-0 z-30 border-b border-[#eae8df] bg-[#f7f6f1]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-7 lg:px-10">
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-2.5 text-left"
            aria-label="Liyu home"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#214d38] text-white">
              <Sparkles size={20} />
            </span>
            <span>
              <span className="block text-[18px] font-bold leading-5 tracking-tight">
                liyu<span className="text-[#d68d4e]">.</span>
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-[#81887e]">
                used market
              </span>
            </span>
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-[#e7e5dc] bg-white px-3.5 py-2 text-sm text-[#556255] sm:flex">
            <MapPin size={15} className="text-[#4d7656]" />
            <select
              value={city}
              onChange={(event) => setSelectedCity(event.target.value)}
              aria-label="Choose a city"
              className="max-w-36 cursor-pointer appearance-none bg-transparent pr-1 font-medium outline-none"
            >
              <option>All cities</option>
              {Object.keys(citySubcities).map((cityName) => (
                <option key={cityName}>{cityName}</option>
              ))}
            </select>
            <ChevronDown size={14} />
          </div>
          <button
            type="button"
            onClick={startSelling}
            className="flex items-center gap-2 rounded-full bg-[#214d38] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#183c2b]"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">Sell an item</span>
            <span className="sm:hidden">Sell</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-7 lg:px-10">
        {activeTab === "inbox" ? (
          <section className="mx-auto max-w-4xl py-8 sm:py-12">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#738071]">
                Your conversations
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Inbox<span className="text-[#d68d4e]">.</span>
              </h1>
              <p className="mt-2 text-sm text-[#7b837a]">
                Connect with local buyers and sellers.
              </p>
            </div>
            {chatListing ? (
              <div className="overflow-hidden rounded-[1.5rem] border border-[#eae8df] bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-[#eeece6] p-4">
                  <button
                    type="button"
                    onClick={() => setChatListing(null)}
                    aria-label="Back to conversations"
                    className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#f4f4ef]"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e6eee6] text-sm font-semibold text-[#315940]">
                    {chatListing.seller.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 text-sm font-semibold">
                      {chatListing.seller}
                      {chatListing.verified && (
                        <BadgeCheck size={15} className="text-[#4c8664]" />
                      )}
                    </p>
                    <p className="truncate text-xs text-[#81887e]">
                      {chatListing.title} · {money(chatListing.price)}
                    </p>
                  </div>
                  <span className="hidden rounded-full bg-[#f2f5ef] px-3 py-1 text-xs text-[#55705a] sm:inline">
                    {chatListing.subcity}, {chatListing.city}
                  </span>
                </div>
                <div className="flex min-h-[330px] flex-col gap-3 bg-[#fbfaf7] p-5">
                  <div className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-white p-3.5 text-sm leading-6 shadow-sm">
                    Hi! Thanks for asking about {chatListing.title}. Let me know what
                    you&apos;d like to know.
                  </div>
                  {(messages[chatListing.id] || [])
                    .filter((message) => message.from === "buyer")
                    .map((message, index) => (
                      <div
                        key={`${chatListing.id}-${index}`}
                        className="max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-[#214d38] p-3.5 text-sm leading-6 text-white"
                      >
                        {message.text}
                      </div>
                    ))}
                </div>
                <form
                  onSubmit={sendMessage}
                  className="flex items-center gap-2 border-t border-[#eeece6] p-3"
                >
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Write a message..."
                    aria-label="Message"
                    className="h-11 min-w-0 flex-1 rounded-full bg-[#f5f5f0] px-4 text-sm outline-none placeholder:text-[#9a9e96] focus:ring-2 focus:ring-[#b6ccb8]"
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
                    className="grid h-11 w-11 place-items-center rounded-full bg-[#214d38] text-white transition hover:bg-[#183c2b]"
                  >
                    <Send size={17} />
                  </button>
                </form>
                <p className="border-t border-[#f0eee8] px-4 py-2 text-center text-[10px] text-[#94988f]">
                  Keep your conversations and meetups safe.
                </p>
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-[#eae8df] bg-white p-8 text-center sm:p-14">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eff4ed] text-[#42684a]">
                  <MessageCircle size={24} />
                </span>
                <h2 className="mt-4 text-lg font-semibold">Your inbox is ready</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7b837a]">
                  Message a seller from any listing to start a conversation.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("home")}
                  className="mt-5 rounded-full bg-[#214d38] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Explore listings
                </button>
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="relative mt-6 overflow-hidden rounded-[1.7rem] bg-[#214d38] px-6 py-8 text-white sm:mt-8 sm:px-10 sm:py-11 lg:px-14">
              <div className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full border border-white/10 sm:right-16 sm:top-[-8rem] sm:h-[28rem] sm:w-[28rem]" />
              <div className="pointer-events-none absolute -right-1 -top-10 h-48 w-48 rounded-full border border-white/10 sm:right-24 sm:top-[-5rem] sm:h-[23rem] sm:w-[23rem]" />
              <div className="relative max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium tracking-wide text-[#e2eadf]">
                  <Sparkles size={13} />
                  GOOD FINDS, CLOSER TO HOME
                </span>
                <h1 className="mt-5 max-w-xl text-[2.4rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
                  Give good things
                  <br />
                  a <span className="font-serif italic text-[#e7b77e]">new</span>{" "}
                  story.
                </h1>
                <p className="mt-4 max-w-md text-sm leading-6 text-[#d3dfd2] sm:text-base">
                  Buy and sell pre-loved finds with people in your neighborhood.
                  Better for your pocket, kinder to the planet.
                </p>
                <button
                  type="button"
                  onClick={startSelling}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f1c48f] px-5 py-3 text-sm font-semibold text-[#274330] transition hover:bg-[#f5d2a7]"
                >
                  List something you love
                  <ArrowUpRight size={17} />
                </button>
              </div>
              <div className="absolute bottom-5 right-6 hidden h-36 w-36 rotate-[-8deg] items-center justify-center rounded-[2rem] border border-white/20 bg-[#f1c48f] text-[#214d38] shadow-2xl sm:flex lg:bottom-8 lg:right-24 lg:h-44 lg:w-44">
                <div className="text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/50">
                    <Tag size={23} />
                  </span>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.15em]">
                    Made for
                  </p>
                  <p className="text-lg font-semibold">Ethiopia</p>
                </div>
              </div>
            </section>

            <section className="mt-8 sm:mt-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b8679]">
                    Find your next favorite
                  </p>
                  <h2 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-[1.8rem]">
                    Good things, nearby<span className="text-[#d68d4e]">.</span>
                  </h2>
                </div>
                <div className="flex w-full gap-2 sm:w-auto">
                  <label className="flex h-12 flex-1 items-center gap-2.5 rounded-full border border-[#e8e6dd] bg-white px-4 sm:w-72 sm:flex-none">
                    <Search size={17} className="shrink-0 text-[#788176]" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search finds..."
                      aria-label="Search listings"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-[#9a9e96]"
                    />
                    {search && (
                      <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => setSearch("")}
                        className="text-[#8b9288]"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowFilters((visible) => !visible)}
                    aria-expanded={showFilters}
                    className={`flex h-12 items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${
                      showFilters
                        ? "border-[#214d38] bg-[#214d38] text-white"
                        : "border-[#e8e6dd] bg-white text-[#435044]"
                    }`}
                  >
                    <SlidersHorizontal size={16} />
                    <span className="hidden sm:inline">Filters</span>
                  </button>
                </div>
              </div>

              <div className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categories.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => {
                      setCategory(item);
                      setActiveTab("home");
                    }}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition ${
                      category === item
                        ? "bg-[#214d38] text-white"
                        : "border border-[#e8e6dd] bg-white text-[#5b665b] hover:border-[#cbd6c8]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {showFilters && (
                <div className="mt-3 grid gap-3 rounded-2xl border border-[#e8e6dd] bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="text-xs font-medium text-[#637061]">
                    City
                    <select
                      value={city}
                      onChange={(event) => setSelectedCity(event.target.value)}
                      className="mt-1.5 h-10 w-full rounded-xl border border-[#e9e8e1] bg-[#fbfaf7] px-3 text-sm text-[#344439] outline-none focus:border-[#9db69e]"
                    >
                      <option>All cities</option>
                      {Object.keys(citySubcities).map((cityName) => (
                        <option key={cityName}>{cityName}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-medium text-[#637061]">
                    Subcity
                    <select
                      value={subcity}
                      onChange={(event) => setSubcity(event.target.value)}
                      disabled={city === "All cities"}
                      className="mt-1.5 h-10 w-full rounded-xl border border-[#e9e8e1] bg-[#fbfaf7] px-3 text-sm text-[#344439] outline-none disabled:opacity-50"
                    >
                      <option>All subcities</option>
                      {(citySubcities[city] || []).map((area) => (
                        <option key={area}>{area}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-medium text-[#637061]">
                    Minimum price (ETB)
                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(event) => setMinPrice(event.target.value)}
                      placeholder="No minimum"
                      className="mt-1.5 h-10 w-full rounded-xl border border-[#e9e8e1] bg-[#fbfaf7] px-3 text-sm text-[#344439] outline-none placeholder:text-[#a0a49c] focus:border-[#9db69e]"
                    />
                  </label>
                  <label className="text-xs font-medium text-[#637061]">
                    Maximum price (ETB)
                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(event.target.value)}
                      placeholder="No maximum"
                      className="mt-1.5 h-10 w-full rounded-xl border border-[#e9e8e1] bg-[#fbfaf7] px-3 text-sm text-[#344439] outline-none placeholder:text-[#a0a49c] focus:border-[#9db69e]"
                    />
                  </label>
                </div>
              )}

              <div className="mt-5 flex items-center justify-between">
                <p className="text-sm text-[#798176]">
                  {activeTab === "saved" ? "Your saved finds" : "Fresh in the market"}
                  <span className="ml-1.5 text-[#a2a69e]">
                    ({visibleListings.length})
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("home");
                    setCategory("Everything");
                    setCity("All cities");
                    setSubcity("All subcities");
                    setMinPrice("");
                    setMaxPrice("");
                    setSearch("");
                  }}
                  className="text-xs font-medium text-[#56725a] hover:text-[#214d38]"
                >
                  Clear filters
                </button>
              </div>

              {visibleListings.length ? (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      saved={savedIds.includes(listing.id)}
                      onSave={toggleSaved}
                      onChat={openChat}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-[1.5rem] border border-dashed border-[#d9ddd4] bg-white px-5 py-14 text-center">
                  <PackageOpen size={28} className="mx-auto text-[#8a9b88]" />
                  <h3 className="mt-3 font-semibold">No finds just yet</h3>
                  <p className="mt-1 text-sm text-[#7b837a]">
                    Try changing your search or filters.
                  </p>
                </div>
              )}
            </section>

            <section className="my-10 flex flex-col items-start justify-between gap-4 rounded-[1.5rem] border border-[#e5e8df] bg-[#eff2e9] p-5 sm:flex-row sm:items-center sm:px-7">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#527358]">
                  <Camera size={19} />
                </span>
                <div>
                  <h3 className="font-semibold">Have something to pass on?</h3>
                  <p className="mt-1 text-sm text-[#6f796e]">
                    Give it a new home in just a few steps.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={startSelling}
                className="flex items-center gap-2 rounded-full bg-[#214d38] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#183c2b]"
              >
                Start selling
                <ChevronRight size={16} />
              </button>
            </section>
          </>
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e8e6df] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="mx-auto flex h-[66px] max-w-lg items-center justify-around px-4">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => {
                setActiveTab(id);
                if (id === "inbox") setChatListing(null);
              }}
              className={`flex min-w-[72px] flex-col items-center gap-1 text-[10px] font-medium transition ${
                activeTab === id ? "text-[#214d38]" : "text-[#90968d]"
              }`}
            >
              <span className="relative">
                <Icon size={20} fill={id === "saved" && activeTab === id ? "currentColor" : "none"} />
                {id === "inbox" && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full border-2 border-white bg-[#d68d4e]" />
                )}
              </span>
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={startSelling}
            className="flex min-w-[72px] flex-col items-center gap-1 text-[10px] font-medium text-[#90968d]"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f3f5ef] text-[#315940]">
              <UserRound size={17} />
            </span>
            Profile
          </button>
        </div>
      </nav>

      {showListingForm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#16251b]/50 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowListingForm(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="listing-form-title"
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[1.7rem] bg-[#fbfaf7] p-5 shadow-2xl sm:rounded-[1.7rem] sm:p-7"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#758174]">
                  Sell on Liyu
                </p>
                <h2 id="listing-form-title" className="mt-1 text-2xl font-semibold">
                  List your item<span className="text-[#d68d4e]">.</span>
                </h2>
                <p className="mt-1 text-sm text-[#7b837a]">
                  Tell your neighbors what you&apos;re passing on.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close listing form"
                onClick={() => setShowListingForm(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#657064] hover:bg-[#eff1ea]"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={publishListing} className="mt-5 space-y-3.5">
              <label className="block text-xs font-medium text-[#637061]">
                Item name
                <input
                  name="title"
                  required
                  maxLength="70"
                  placeholder="e.g. Wooden coffee table"
                  className="mt-1.5 h-11 w-full rounded-xl border border-[#e5e5dd] bg-white px-3.5 text-sm outline-none placeholder:text-[#a0a49c] focus:border-[#9db69e]"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-medium text-[#637061]">
                  Price (ETB)
                  <input
                    name="price"
                    type="number"
                    min="1"
                    required
                    placeholder="0"
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#e5e5dd] bg-white px-3.5 text-sm outline-none placeholder:text-[#a0a49c] focus:border-[#9db69e]"
                  />
                </label>
                <label className="block text-xs font-medium text-[#637061]">
                  Category
                  <select
                    name="category"
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#e5e5dd] bg-white px-3 text-sm outline-none focus:border-[#9db69e]"
                  >
                    {categories
                      .filter((item) => item !== "Everything")
                      .map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-medium text-[#637061]">
                  Condition
                  <select
                    name="condition"
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#e5e5dd] bg-white px-3 text-sm outline-none focus:border-[#9db69e]"
                  >
                    {["Like new", "Good", "Fair", "New"].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-medium text-[#637061]">
                  City
                  <select
                    name="city"
                    required
                    value={listingCityForm}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#e5e5dd] bg-white px-3 text-sm outline-none focus:border-[#9db69e]"
                    onChange={(event) => setListingCityForm(event.target.value)}
                  >
                    {Object.keys(citySubcities).map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-xs font-medium text-[#637061]">
                Subcity / neighborhood
                <select
                  name="subcity"
                  required
                  className="mt-1.5 h-11 w-full rounded-xl border border-[#e5e5dd] bg-white px-3 text-sm outline-none focus:border-[#9db69e]"
                >
                  {citySubcities[listingCityForm].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <p className="flex items-start gap-2 rounded-xl bg-[#eff3eb] p-3 text-xs leading-5 text-[#637061]">
                <Check size={15} className="mt-0.5 shrink-0 text-[#557a5a]" />
                Meet in a public place and agree on payment directly with your buyer.
              </p>
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#214d38] text-sm font-semibold text-white transition hover:bg-[#183c2b]"
              >
                <Plus size={17} />
                Publish listing
              </button>
            </form>
          </section>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#214d38] px-5 py-3 text-sm font-medium text-white shadow-xl"
        >
          <Check size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
