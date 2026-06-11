import { useState, useEffect } from 'react';

export default function InstagramGallery({ onBack }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstagramPhotos = async () => {
      try {
        // Fetch ke backend API lokal XAMPP
        const response = await fetch('/api/instagram');
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data. Pastikan XAMPP Backend berjalan.");
        }
        
        const data = await response.json();
        
        // Cek jika error dilempar oleh API Instagram
        if (data.error) {
           throw new Error(data.error.message || "Token kedaluwarsa atau terjadi masalah API");
        }
        
        // Tanggal batas paling lama (19 Januari 2025)
        const limitDate = new Date('2025-01-19T00:00:00Z');

        // Filter: Hanya IMAGE & CAROUSEL_ALBUM, dan tanggal >= 19 Jan 2025
        // Sort: Dari yang terbaru (descending)
        const filteredAndSortedPosts = data.data?.filter(
          (post) => {
            const isSupportedMedia = post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM';
            
            // Periksa jika timestamp tersedia dan lewati jika tidak ada untuk fallback yang aman
            if (post.timestamp) {
              const postDate = new Date(post.timestamp);
              const isAfterOrEqualLimit = postDate >= limitDate;
              return isSupportedMedia && isAfterOrEqualLimit;
            }
            
            return isSupportedMedia; 
          }
        ).sort((a, b) => {
          if (a.timestamp && b.timestamp) {
            return new Date(b.timestamp) - new Date(a.timestamp); // Terbaru ke terlama
          }
          return 0;
        }) || [];
        
        setPosts(filteredAndSortedPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPhotos();
  }, []);

  return (
    <div className="bg-[#FAFAFA] text-[#1E293B] min-h-screen font-sans antialiased scroll-smooth relative">
      
      {/* NAVIGATION BAR (Sesuai gaya App.jsx) */}
      <nav className="fixed top-0 left-0 right-0 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-slate-200/50 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7 text-[#1E40AF]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
            <span 
              onClick={onBack}
              className="text-xl font-black tracking-wider text-slate-800 hover:text-[#1E40AF] transition-colors cursor-pointer font-serif flex items-center gap-2"
            >
              EL <span className="font-sans font-medium text-sm text-slate-400 border-l border-slate-300 pl-2">Gallery</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button onClick={onBack} className="hover:text-[#1E40AF] hover:-translate-y-0.5 transition-all duration-300">Home Portfolio</button>
            <a href="#" className="text-[#1E40AF] hover:-translate-y-0.5 transition-all duration-300">Photography</a>
          </div>

          <div className="relative">
            <a 
              href="https://www.instagram.com/e.egar_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm bg-[#1E40AF] hover:bg-[#153084] hover:shadow-lg hover:shadow-[#1E40AF]/30 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
          </div>

        </div>
      </nav>

      {/* GALLERY CONTENT */}
      <div className="pt-36 pb-20 px-6 md:px-12 max-w-6xl mx-auto">
        
        {/* Header Gallery */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight font-serif">
            Photography Gallery
          </h1>
          <div className="w-24 h-1.5 bg-[#1E40AF] mt-6 mb-6 rounded-full mx-auto"></div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E40AF]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center max-w-2xl mx-auto shadow-sm">
            <p className="font-bold text-lg">Oops! Terjadi kesalahan koneksi galeri.</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        )}

        {/* Empty State jika tidak ada post di rentang tanggal tersebut */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 font-medium">Belum ada karya yang dipublikasikan.</p>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-12">
            {posts.map((post) => (
              <div key={post.id} className="flex flex-col items-center group">
                
                {/* Photo Frame */}
                <a 
                  href={post.permalink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="relative bg-white p-3 md:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(30,64,175,0.15)] transition-all duration-500 ease-out hover:-translate-y-3 w-full"
                >
                  <div className="aspect-square overflow-hidden bg-slate-100 relative">
                    <img 
                      src={post.media_url} 
                      alt={post.caption || "Gallery Photo"} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      loading="lazy"
                    />
                    {/* Hover Overlay Kaca */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                      <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/50 px-3 py-1.5 backdrop-blur-sm">
                        Lihat Postingan
                      </span>
                    </div>
                  </div>
                </a>

                {/* Photo Detail */}
                <div className="mt-6 bg-[#FDFBF7] border border-slate-200 px-6 py-5 shadow-sm w-[85%] text-center relative">
                  {/* Ornamen Pin Plakat */}
                  <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-300"></div>

                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-2">
                    {post.timestamp 
                      ? new Date(post.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
                      : "Archived"}
                  </p>
                  <h3 className="text-sm text-slate-700 font-serif italic line-clamp-2 leading-relaxed">
                    "{post.caption ? post.caption : "Tanpa Judul"}"
                  </h3>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}