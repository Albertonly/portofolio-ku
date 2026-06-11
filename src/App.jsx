import { useState, useEffect, useRef } from 'react';
import InstagramGallery from './InstagramGallery';
import AdminDashboard from './AdminDashboard'; // Import komponen Admin
import { supabase } from './supabase';

function App() {
  const [dataDiri, setDataDiri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // State untuk Admin Dashboard Routing
  const [showAdmin, setShowAdmin] = useState(window.location.hash === '#admin');

  const dropdownRef = useRef(null);

  // Ambil Data Portofolio dari Database (XAMPP Backend)
  // Ambil Data Portofolio dari Database (Supabase)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Ambil data profile utama
        const { data: profileData, error: profileErr } = await supabase
          .from('profile')
          .select('*')
          .eq('id', 1)
          .single();
          
        if (profileErr) throw profileErr;

        // 2. Ambil data dari tabel pendukung lainnya
        const { data: projData } = await supabase.from('projects').select('*').order('id', { ascending: true });
        const { data: eduData } = await supabase.from('educations').select('*').order('id', { ascending: true });
        const { data: expData } = await supabase.from('experiences').select('*').order('id', { ascending: true });
        const { data: srvData } = await supabase.from('services').select('*').order('id', { ascending: true });

        // 3. Satukan dan format strukturnya agar pas dengan frontend kamu
        const formattedData = {
          ...profileData,
          contact: {
            phone: profileData.phone,
            email: profileData.email,
            address: profileData.address,
            github: profileData.github,
            linkedin: profileData.linkedin,
            instagram: profileData.instagram,
            youtube1: profileData.youtube1,
            youtube2: profileData.youtube2
          },
          skills: { 
            hard: profileData.hard_skills || [], 
            soft: profileData.soft_skills || [] 
          },
          projects: projData || [],
          education: eduData || [],
          experience: expData || [],
          services: srvData || []
        };

        setDataDiri(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [showAdmin]);

  // Listener untuk mendeteksi perubahan hash URL ke #admin
  useEffect(() => {
    const handleHashChange = () => {
      setShowAdmin(window.location.hash === '#admin');
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Listener klik di luar dropdown resume
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsResumeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const serviceIcons = [
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ];

  // Render Halaman Admin
  if (showAdmin) {
    return <AdminDashboard onBack={() => { window.location.hash = ''; setShowAdmin(false); }} />;
  }

  // Render Halaman Gallery Instagram
  if (showGallery) {
    return <InstagramGallery onBack={() => setShowGallery(false)} />;
  }

  // Tampilan ketika data sedang di-load dari database
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E40AF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6 text-center">
        <p className="text-red-500 font-bold text-xl">Error: {error}</p>
      </div>
    );
  }

  // Resolusi Tautan File Dinamis dari Database Storage
  const profilePicUrl = dataDiri?.foto_profile
    ? `http://localhost/portfolio-api/uploads/profile/${dataDiri.foto_profile}`
    : "/foto-profil.jpg"; // Fallback ke lokal jika API tidak ada

  // Resume Bahasa Inggris: dari DB jika ada, fallback ke file lokal
  const resumeEnUrl = dataDiri?.resume
    ? `http://localhost/portfolio-api/uploads/resume/${dataDiri.resume}`
    : "/Muhamad Elgar Resume en.pdf";

  // Resume Bahasa Indonesia: dari DB jika ada (field resume_id), fallback ke file lokal
  const resumeIdUrl = dataDiri?.resume_id
    ? `http://localhost/portfolio-api/uploads/resume/${dataDiri.resume_id}`
    : "/muhamad Elgar Resume Id.pdf";

  // Setelah data berhasil diambil, baru pisahkan namanya
  const nameParts = dataDiri?.nama ? dataDiri.nama.split(' ') : ['Muhamad', 'Elgar'];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return (
    <div className="bg-[#FAFAFA] text-[#1E293B] min-h-screen font-sans antialiased scroll-smooth">

      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-slate-200/50 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <svg className="w-7 h-7 text-[#1E40AF]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
            <span className="text-xl font-black tracking-wider text-slate-800 hover:text-[#1E40AF] transition-colors cursor-pointer font-serif">
              EL
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#about" className="hover:text-[#1E40AF] hover:-translate-y-0.5 transition-all duration-300">About me</a>
            <a href="#services" className="hover:text-[#1E40AF] hover:-translate-y-0.5 transition-all duration-300">Services</a>
            <a href="#portfolio" className="hover:text-[#1E40AF] hover:-translate-y-0.5 transition-all duration-300">Work</a>
            <a href="#education" className="hover:text-[#1E40AF] hover:-translate-y-0.5 transition-all duration-300">Education</a>
            <a href="#experience" className="hover:text-[#1E40AF] hover:-translate-y-0.5 transition-all duration-300">Experience</a>
          </div>

          {/* Resume Dropdown — dua bahasa */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsResumeOpen(!isResumeOpen)}
              className="flex items-center gap-2 text-sm bg-[#1E40AF] hover:bg-[#153084] hover:shadow-lg hover:shadow-[#1E40AF]/30 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Resume
              <svg className={`w-4 h-4 transition-transform duration-300 ${isResumeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-300 origin-top-right ${isResumeOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
              <div className="flex flex-col">
                {/* Resume Bahasa Inggris */}
                <a
                  href={resumeEnUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="flex items-center gap-3 px-5 py-3.5 text-sm font-semibold text-slate-600 hover:text-[#1E40AF] hover:bg-slate-50 transition-colors border-b border-slate-100"
                >
                  <span className="text-base">🇬🇧</span>
                  <div>
                    <p className="font-bold text-slate-800">English Resume</p>
                    <p className="text-xs text-slate-400 font-normal">Download CV (EN)</p>
                  </div>
                </a>
                {/* Resume Bahasa Indonesia */}
                <a
                  href={resumeIdUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="flex items-center gap-3 px-5 py-3.5 text-sm font-semibold text-slate-600 hover:text-[#1E40AF] hover:bg-slate-50 transition-colors"
                >
                  <span className="text-base">🇮🇩</span>
                  <div>
                    <p className="font-bold text-slate-800">Resume Indonesia</p>
                    <p className="text-xs text-slate-400 font-normal">Unduh CV (ID)</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>
      </nav>

      {/* HERO & ABOUT ME SECTION */}
      <section id="about" className="pt-40 pb-24 px-6 md:px-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
        <div className="md:col-span-2 flex flex-col justify-center">
          <div className="mb-6">
            <p className="text-sm md:text-base font-semibold tracking-[0.2em] text-slate-500 uppercase mb-4">
              Hello, My Name Is
            </p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-slate-800">{firstName}</span>{' '}
              <span className="text-[#1E40AF]">{lastName}</span>
            </h1>
          </div>

          <p className="text-slate-600 text-lg leading-relaxed text-justify md:text-left mb-8 max-w-2xl">
            {dataDiri?.about}
          </p>

          <div className="flex flex-wrap gap-6">
            {dataDiri?.contact?.linkedin && (
              <a href={dataDiri.contact.linkedin} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-[#1E40AF] transition-colors">
                <span className="bg-slate-100 p-2 rounded-full group-hover:bg-blue-50 transition-colors">🔗</span>
                LinkedIn Profile
              </a>
            )}
            {dataDiri?.contact?.github && (
              <a href={dataDiri.contact.github} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                <span className="bg-slate-100 p-2 rounded-full group-hover:bg-slate-200 transition-colors">💻</span>
                GitHub Repositories
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end w-full">
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100">
            <div className="h-80 overflow-hidden bg-slate-100 relative group">
              <img
                src={profilePicUrl}
                alt={dataDiri?.nama}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop";
                }}
              />
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Contact Details</h3>
              <div className="space-y-4 text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-3 hover:text-[#1E40AF] transition-colors">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>{dataDiri?.contact?.address}</p>
                </div>
                <div className="flex items-center gap-3 break-all hover:text-[#1E40AF] transition-colors">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p>{dataDiri?.contact?.email}</p>
                </div>
                <div className="flex items-center gap-3 hover:text-[#1E40AF] transition-colors">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p>{dataDiri?.contact?.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-slate-200/60">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">My Specializations</h2>
          <div className="w-20 h-1.5 bg-[#1E40AF] mt-4 rounded-full mx-auto md:mx-0"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(dataDiri?.services || []).map((service, i) => (
            <div key={service.id || i} className="group p-8 bg-white border border-slate-100 rounded-2xl hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-2 hover:border-[#1E40AF]/30 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-5 rounded-full bg-blue-50 text-[#1E40AF] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#1E40AF] group-hover:text-white transition-all duration-500">
                {serviceIcons[i % serviceIcons.length]}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{service.description || service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-slate-200/60">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">Featured Projects</h2>
          <div className="w-20 h-1.5 bg-[#1E40AF] mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(dataDiri?.projects || []).map((p) => (
            <div key={p.project_id || p.id} className="group p-8 rounded-3xl bg-white border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div>
                <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#1E40AF] transition-colors duration-300">{p.title}</h3>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${p.time === "Recent Project" ? "bg-blue-100 text-[#1E40AF]" : "bg-slate-100 text-slate-500"}`}>{p.time}</span>
                </div>
                <p className="text-sm font-semibold text-[#1E40AF] mb-4">{p.role}</p>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">{p.description || p.desc}</p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {(p.tech || []).map((t, idx) => (
                    <span key={idx} className="bg-slate-50 text-xs font-medium border border-slate-200 px-3 py-1 rounded-full text-slate-600 group-hover:border-slate-300 transition-colors">
                      {t}
                    </span>
                  ))}
                </div>

                {p.link === "#gallery" ? (
                  <button
                    onClick={() => setShowGallery(true)}
                    className="inline-flex items-center text-sm font-bold text-[#1E40AF] hover:text-slate-800 transition-colors gap-2 group/link cursor-pointer"
                  >
                    Open Photo Gallery <span className="group-hover/link:translate-x-2 transition-transform duration-300">→</span>
                  </button>
                ) : p.link && p.link !== "#" ? (
                  <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-bold text-slate-800 hover:text-[#1E40AF] transition-colors gap-2 group/link">
                    Open Repository <span className="group-hover/link:translate-x-2 transition-transform duration-300">→</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center text-sm font-bold text-slate-400 gap-2 cursor-not-allowed">
                    Private / Internal Project 🔒
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATION & SKILLS */}
      <section id="education" className="py-24 px-6 md:px-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-slate-200/60">
        <div>
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Educations</h2>
            <div className="w-16 h-1.5 bg-[#1E40AF] mt-4 rounded-full"></div>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:to-transparent">
            {(dataDiri?.education || []).map((edu, i) => (
              <div key={edu.id || i} className="relative flex items-start pl-8 group">
                <div className="absolute left-0 w-4 h-4 rounded-full bg-white border-4 border-slate-200 group-hover:border-[#1E40AF] transition-colors duration-300 mt-1.5"></div>
                <div>
                  <span className="text-xs font-bold text-slate-400 tracking-wider bg-slate-100 px-2 py-1 rounded">{edu.year}</span>
                  <h3 className="font-bold text-slate-800 text-lg mt-2">{edu.institution}</h3>
                  <p className="text-sm text-slate-500 mt-1">{edu.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h4 className="text-sm font-bold text-slate-800 mb-4">Personal Hobbies</h4>
            <div className="flex flex-wrap gap-3">
              {(dataDiri?.hobbies || []).map((h, i) => (
                <span key={i} className="text-sm font-medium border border-slate-200 bg-white text-slate-600 px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Skill</h2>
            <div className="w-16 h-1.5 bg-[#1E40AF] mt-4 rounded-full"></div>
          </div>

          <div className="space-y-10 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Technical / Hard Skills</h4>
              <div className="flex flex-wrap gap-2">
                {(dataDiri?.skills?.hard || []).map((s, i) => (
                  <span key={i} className="bg-slate-800 hover:bg-[#1E40AF] transition-colors duration-300 text-white text-xs px-3 py-2 rounded-lg font-medium tracking-wide">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Soft Skills</h4>
              <div className="flex flex-wrap gap-2">
                {(dataDiri?.skills?.soft || []).map((s, i) => (
                  <span key={i} className="bg-blue-50 text-blue-900 border border-blue-100 hover:bg-blue-100 transition-colors duration-300 text-xs px-3 py-2 rounded-lg font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Software Familiarity</h4>
              <div className="flex flex-wrap gap-2">
                {(dataDiri?.software || []).map((s, i) => (
                  <span key={i} className="bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 transition-colors duration-300 text-xs px-3 py-2 rounded-lg font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="py-24 px-6 md:px-12 max-w-6xl mx-auto pb-32 border-t border-slate-200/60">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">Professional Experience</h2>
          <div className="w-20 h-1.5 bg-[#1E40AF] mt-4 rounded-full"></div>
        </div>

        <div className="space-y-6">
          {(dataDiri?.experience || []).map((exp, i) => (
            <div key={exp.id || i} className="group p-8 rounded-2xl bg-white border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-[#1E40AF]/30 transition-all duration-300">
              <div className="flex justify-between items-start flex-wrap gap-4 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#1E40AF] transition-colors duration-300">{exp.role}</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-1">{exp.company}</p>
                </div>
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">{exp.year || exp.time}</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mt-4 max-w-4xl">{exp.description || exp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <div className="flex gap-5 mb-6">
            {dataDiri?.contact?.instagram && (
              <a href={dataDiri.contact.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#1E40AF] hover:text-white transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            )}
            {dataDiri?.contact?.linkedin && (
              <a href={dataDiri.contact.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#1E40AF] hover:text-white transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            )}
            {dataDiri?.contact?.youtube1 && (
              <a href={dataDiri.contact.youtube1} title="ItsNekitsz" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#1E40AF] hover:text-white transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
            )}
            {dataDiri?.contact?.youtube2 && (
              <a href={dataDiri.contact.youtube2} title="CubesinemaProject" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#1E40AF] hover:text-white transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
            )}
            {dataDiri?.contact?.github && (
              <a href={dataDiri.contact.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#1E40AF] hover:text-white transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            )}
          </div>

          <p className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} Made By {dataDiri?.nama || "Muhamad Elgar"}
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;