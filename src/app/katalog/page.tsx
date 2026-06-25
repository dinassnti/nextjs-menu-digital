import Link from "next/link";
import { connectDB } from "@/lib/db";
import Profile from "@/models/Profile";
import Menu from "@/models/Menu";

export const dynamic = 'force-dynamic';

export default async function KatalogPage({ searchParams }: any) {
  await connectDB();
  const profile = await Profile.findOne().lean();
  const menus = await Menu.find().lean();
  
  const cafeName = profile?.cafeName || "Kafe MenuDigital";
  const address = profile?.address || "Alamat belum diatur oleh admin.";
  
  // Menarik data Hari dan Jam Operasional dari Database
  const openDays = profile?.openDays || "Hari belum diatur";
  const openHours = profile?.openHours || "Jam belum diatur";

  const params = await Promise.resolve(searchParams);
  const activeTab = params?.tab || "Makanan";

  const categories = [
    { id: "Makanan", label: "Makanan", emoji: "🍔" },
    { id: "Minuman", label: "Minuman", emoji: "🍹" },
    { id: "Snack", label: "Snack", emoji: "🍟" },
  ];

  const displayedMenus = menus.filter((m: any) => m.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-24 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. HERO HEADER */}
      <header className="bg-white pt-16 pb-12 px-6 border-b border-slate-200 relative shadow-sm">
        <Link 
          href="/" 
          className="absolute top-6 left-6 md:left-10 w-11 h-11 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 rounded-full flex items-center justify-center transition-colors shadow-sm border border-slate-200"
          title="Kembali ke Beranda"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>

        <div className="max-w-3xl mx-auto text-center mt-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            {cafeName}
          </h1>
          
          <p className="text-slate-600 font-medium mt-5 flex items-center justify-center gap-2 text-base md:text-lg">
            <span className="text-xl">📍</span> {address}
          </p>

          {/* INFORMASI HARI & JAM BUKA (Tampilan Badge/Kapsul) */}
          <div className="flex flex-wrap justify-center items-center gap-3 mt-4 text-sm md:text-base">
            <span className="flex items-center gap-2 bg-slate-50 text-slate-600 px-5 py-2 rounded-full border border-slate-200 shadow-sm font-medium">
              <span>📅</span> {openDays}
            </span>
            <span className="flex items-center gap-2 bg-slate-50 text-slate-600 px-5 py-2 rounded-full border border-slate-200 shadow-sm font-medium">
              <span>⏰</span> {openHours}
            </span>
          </div>
        </div>
      </header>

      {/* 2. TAB MENU KATEGORI */}
      <div className="sticky top-0 z-40 bg-slate-100/90 backdrop-blur-md py-6 px-6 shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex justify-center gap-4 sm:gap-6 overflow-x-auto pb-2 snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <Link 
              key={cat.id}
              href={`/katalog?tab=${cat.id}`}
              scroll={false}
              className={`snap-start whitespace-nowrap px-8 py-3.5 rounded-full font-bold text-base transition-colors ${
                activeTab === cat.id 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <span className="mr-2 text-lg">{cat.emoji}</span> {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 3. KARTU MENU */}
      <main className="max-w-6xl mx-auto px-6 mt-10">
        {displayedMenus.length === 0 ? (
          <div className="bg-white py-16 px-6 rounded-[2rem] border border-slate-200 text-center shadow-sm">
            <span className="text-5xl block mb-4">🍽️</span>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Kategori Kosong</h3>
            <p className="text-slate-500 font-medium">Belum ada menu yang didaftarkan di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
            {displayedMenus.map((item: any) => (
              <div 
                key={item._id.toString()} 
                className="bg-white rounded-[1.5rem] p-4 md:p-5 shadow-md border border-slate-100 flex flex-col"
              >
                <div className="w-full aspect-[4/3] rounded-[1rem] overflow-hidden mb-5 bg-slate-100 border border-slate-50">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="px-2 flex-1 flex flex-col">
                  <h4 className="font-bold text-slate-800 text-lg md:text-xl leading-snug mb-2 line-clamp-2">
                    {item.name}
                  </h4>
                  
                  {item.description && (
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6 font-medium">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-4 pb-2 border-t border-slate-100">
                    <span className="text-indigo-600 font-black text-xl md:text-2xl">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}