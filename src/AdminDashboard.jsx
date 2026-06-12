import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';

// ─── SVG ICON COMPONENTS ────────────────────────────────────────────
const IconUser       = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const IconFolder     = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>;
const IconAcademic   = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-3.5l4 3.5 4-3.5" /></svg>;
const IconBriefcase  = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const IconWrench     = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" strokeWidth={2} /></svg>;
const IconLogout     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const IconEye        = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const IconPencil     = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const IconTrash      = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconPlus       = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const IconCheck      = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconX          = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconLock       = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const IconUpload     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const IconDoc        = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconTag        = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>;

// ─── SIDEBAR NAV CONFIG ──────────────────────────────────────────────
const NAV_TABS = [
  { id: 'Profile',    label: 'Profile & Media',  Icon: IconUser },
  { id: 'Skills',     label: 'Skills & Hobbies', Icon: IconTag },
  { id: 'Projects',   label: 'Proyek',            Icon: IconFolder },
  { id: 'Education',  label: 'Edukasi',           Icon: IconAcademic },
  { id: 'Experience', label: 'Pengalaman',         Icon: IconBriefcase },
  { id: 'Services',   label: 'Layanan',            Icon: IconWrench },
];

// ─── REUSABLE COMPONENTS ─────────────────────────────────────────────
function InputField({ label, value, onChange, type = 'text', required = true, placeholder = '' }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <input
        required={required}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, rows = 4 }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <textarea
        required
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
      />
    </div>
  );
}

function SectionHeading({ icon: Icon, title, mode }) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${mode === 'edit' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
        {mode === 'edit' ? <IconPencil /> : <IconPlus />}
      </span>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{Icon && <span className="inline-flex items-center gap-1"><Icon /> {title}</span>}</p>
        <h2 className="text-base font-bold text-slate-800">{mode === 'edit' ? 'Mode Edit' : 'Tambah Baru'}</h2>
      </div>
    </div>
  );
}

function ItemCard({ children, onEdit, onDelete }) {
  return (
    <div className="flex justify-between items-start gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all group">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          <IconPencil /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          <IconTrash /> Hapus
        </button>
      </div>
    </div>
  );
}

// ─── TAG PILL (untuk menampilkan item skill/software/hobbies satu per satu) ─
function TagPill({ label, onDelete }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-full">
      {label}
      <button
        type="button"
        onClick={onDelete}
        className="hover:text-rose-600 transition-colors ml-0.5"
        title="Hapus item ini"
      >
        <IconX />
      </button>
    </span>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────
export default function AdminDashboard({ onBack }) {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('admin_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Master Data State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Profile');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    nama: '', about: '', phone: '', email: '', address: '',
    github: '', linkedin: '', instagram: '', youtube1: '', youtube2: ''
  });
  const [fotoProfileFile, setFotoProfileFile] = useState(null);
  const [resumeEnFile, setResumeEnFile] = useState(null);    // Resume bahasa Inggris
  const [resumeIdFile, setResumeIdFile] = useState(null);    // Resume bahasa Indonesia

  // Skills / Software / Hobbies State
  // Masing-masing disimpan sebagai array, dikelola per-item (add/delete)
  const [hardSkills, setHardSkills]   = useState([]);
  const [softSkills, setSoftSkills]   = useState([]);
  const [software, setSoftware]       = useState([]);
  const [hobbies, setHobbies]         = useState([]);

  // Input sementara untuk tambah item baru di tiap array
  const [newHardSkill, setNewHardSkill]   = useState('');
  const [newSoftSkill, setNewSoftSkill]   = useState('');
  const [newSoftware, setNewSoftware]     = useState('');
  const [newHobby, setNewHobby]           = useState('');

  // Edit mode untuk skills (edit satu item by index)
  const [editHardSkillIdx, setEditHardSkillIdx]   = useState(null);
  const [editHardSkillVal, setEditHardSkillVal]   = useState('');
  const [editSoftSkillIdx, setEditSoftSkillIdx]   = useState(null);
  const [editSoftSkillVal, setEditSoftSkillVal]   = useState('');
  const [editSoftwareIdx, setEditSoftwareIdx]     = useState(null);
  const [editSoftwareVal, setEditSoftwareVal]     = useState('');
  const [editHobbyIdx, setEditHobbyIdx]           = useState(null);
  const [editHobbyVal, setEditHobbyVal]           = useState('');

  // Sub-section Forms
  const [projectForm, setProjectForm] = useState({ project_id: null, title: '', role: '', time: '', tech: '', description: '', link: '' });
  const [educationForm, setEducationForm] = useState({ id: null, year: '', institution: '', detail: '' });
  const [experienceForm, setExperienceForm] = useState({ id: null, time: '', role: '', company: '', description: '' });
  const [serviceForm, setServiceForm] = useState({ id: null, title: '', description: '' });

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3500);
  };

  // ── Fetch Data (dibungkus useCallback agar aman sebagai dependency) ─
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Ambil data dari Supabase
      const { data: profileData, error: profileErr } = await supabase
        .from('profile')
        .select('*')
        .eq('id', 1)
        .single();

      if (profileErr) throw profileErr;

      const { data: projData } = await supabase.from('projects').select('*').order('id', { ascending: true });
      const { data: eduData } = await supabase.from('educations').select('*').order('id', { ascending: true });
      const { data: expData } = await supabase.from('experiences').select('*').order('id', { ascending: true });
      const { data: srvData } = await supabase.from('services').select('*').order('id', { ascending: true });

      const result = {
        ...profileData,
        projects: projData || [],
        education: eduData || [],
        experience: expData || [],
        services: srvData || []
      };

      setData(result);

      // 2. Mapping data sesuai nama kolom di database (TANPA .contact atau .skills)
      if (result) {
        setProfileForm({
          nama:      result.nama       || '',
          about:     result.about      || '',
          phone:     result.phone      || '',
          email:     result.email      || '',
          address:   result.address    || '',
          github:    result.github     || '',
          linkedin:  result.linkedin   || '',
          instagram: result.instagram  || '',
          youtube1:  result.youtube1   || '',
          youtube2:  result.youtube2   || ''
        });

        // Di Supabase, tipe kolom JSONB akan otomatis di-parse menjadi Array JavaScript
        setHardSkills(Array.isArray(result.hard_skills) ? result.hard_skills : []);
        setSoftSkills(Array.isArray(result.soft_skills) ? result.soft_skills : []);
        setSoftware(Array.isArray(result.software) ? result.software : []);
        setHobbies(Array.isArray(result.hobbies) ? result.hobbies : []);
      }
    } catch (err) {
      setMessage({ text: 'Gagal mengambil data dari Supabase: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [setLoading, setData, setProfileForm, setHardSkills, setSoftSkills, setSoftware, setHobbies]);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, fetchData]);

  // ── Authentication ──────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Menggunakan Supabase Auth untuk verifikasi email & password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username, // Di form namanya 'username', tapi kita kirim sbg email ke Supabase
        password: password
      });

      if (error) {
        // Jika salah password atau email tidak ditemukan
        showMessage(error.message || 'Email atau password salah.', 'error');
      } else if (data.session) {
        // Berhasil login, simpan token dari Supabase
        sessionStorage.setItem('admin_token', data.session.access_token);
        setIsAuthenticated(true);
        showMessage('Login berhasil! Selamat datang.', 'success');
      }
    } catch (err) {
      showMessage('Gagal terhubung ke server autentikasi: ' + err.message, 'error');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    if (onBack) onBack();
  };

  // ── Profile Submit ──────────────────────────────────────────────────
  // ── Profile Submit (Versi Supabase) ─────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Siapkan data teks yang akan di-update
      let updateData = {
        nama: profileForm.nama,
        about: profileForm.about,
        phone: profileForm.phone,
        email: profileForm.email,
        address: profileForm.address,
        github: profileForm.github,
        linkedin: profileForm.linkedin,
        instagram: profileForm.instagram,
        youtube1: profileForm.youtube1,
        youtube2: profileForm.youtube2
      };

      // Fungsi bantuan untuk upload file ke Supabase Storage
      const uploadToSupabase = async (file, folderName) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${folderName}/${fileName}`;

        // Upload ke bucket bernama 'portfolio_media'
        const { error: uploadError } = await supabase.storage
          .from('portfolio_media') 
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Ambil Public URL dari file yang baru diupload
        const { data: publicUrlData } = supabase.storage
          .from('portfolio_media')
          .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
      };

      // 2. Cek dan upload file jika ada yang baru dipilih
      if (fotoProfileFile) {
        updateData.foto_profile = await uploadToSupabase(fotoProfileFile, 'profiles');
      }
      if (resumeEnFile) {
        updateData.resume = await uploadToSupabase(resumeEnFile, 'resumes');
      }
      if (resumeIdFile) {
        updateData.resume_id = await uploadToSupabase(resumeIdFile, 'resumes');
      }

      // 3. Update data (teks & URL file) ke tabel 'profile'
      const { error } = await supabase
        .from('profile')
        .update(updateData)
        .eq('id', 1);

      if (error) throw error;

      showMessage('Profile & semua berkas berhasil diperbarui!', 'success');
      setFotoProfileFile(null);
      setResumeEnFile(null);
      setResumeIdFile(null);
      fetchData(); // Refresh data di layar

    } catch (err) {
      showMessage('Gagal memperbarui: ' + err.message, 'error');
    }
  };

  // ── Skills / Software / Hobbies Submit ─────────────────────────────
  // Menyimpan semua array sekaligus ke kolom hard_skills & soft_skills
  // di tabel profile, plus kolom software & hobbies.
  // API menerima JSON: { hard_skills: [...], soft_skills: [...], software: [...], hobbies: [...] }
  const handleSkillsSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update langsung ke tabel profile dengan tipe JSONB (Supabase otomatis handle object/array ke JSONB)
      const { error } = await supabase
        .from('profile')
        .update({
          hard_skills: hardSkills,
          soft_skills: softSkills,
          software: software,
          hobbies: hobbies
        })
        .eq('id', 1);

      if (error) throw error;

      showMessage('Skills, Software & Hobbies berhasil disimpan!', 'success');
      fetchData();
    } catch (err) {
      showMessage('Gagal menyimpan: ' + err.message, 'error');
    }
  };

  // ── Helper: tambah item ke array lokal ─────────────────────────────
  const addItem = (value, setter, inputSetter) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setter(prev => [...prev, trimmed]);
    inputSetter('');
  };

  // ── Helper: hapus item dari array lokal by index ────────────────────
  const removeItem = (index, setter) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  // ── Helper: simpan edit item di array lokal by index ────────────────
  const saveEditItem = (index, newVal, setter, setIdx, setVal) => {
    const trimmed = newVal.trim();
    if (!trimmed) return;
    setter(prev => prev.map((item, i) => i === index ? trimmed : item));
    setIdx(null);
    setVal('');
  };

  // ── Generic Save & Delete ───────────────────────────────────────────
  // Mengganti API localhost untuk aksi Simpan (Create/Update)
  const handleSaveItem = async (tableName, payload, resetForm, idField = 'id') => {
    try {
      const isEdit = payload[idField] !== null;
      let response;

      if (isEdit) {
        // Mode Update
        response = await supabase.from(tableName).update(payload).eq(idField, payload[idField]);
      } else {
        // Mode Insert: buang properti ID yang null agar Supabase menggunakan auto-increment
        const { [idField]: removedId, ...insertData } = payload;
        response = await supabase.from(tableName).insert([insertData]);
      }

      if (response.error) throw response.error;

      showMessage('Data berhasil disimpan!', 'success');
      resetForm();
      fetchData();
    } catch (err) {
      showMessage('Gagal menyimpan data: ' + err.message, 'error');
    }
  };

  // Mengganti API localhost untuk aksi Hapus (Delete)
  const handleDeleteItem = async (tableName, id, idField = 'id') => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    try {
      const { error } = await supabase.from(tableName).delete().eq(idField, id);
      if (error) throw error;

      showMessage('Data berhasil dihapus!', 'success');
      fetchData();
    } catch (err) {
      showMessage('Gagal menghapus data: ' + err.message, 'error');
    }
  };

  // ── Login Screen ────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/40 mb-4">
              <IconLock />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Console</h1>
            <p className="text-sm text-slate-400 mt-1">Portfolio Engine — Secure Access</p>
          </div>

          {/* Alert */}
          {message.text && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium mb-5 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
              {message.type === 'success' ? <IconCheck /> : <IconX />}
              {message.text}
            </div>
          )}

          {/* Form */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-7 shadow-2xl">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</label>
                <input
                  required type="text" value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <input
                  required type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
                />
              </div>
              <button
                type="submit"
                className="mt-1 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <IconLock /> Masuk ke Dashboard
              </button>
            </form>
          </div>

          <button
            onClick={onBack}
            className="mt-5 w-full text-center text-sm text-slate-500 hover:text-slate-300 transition-colors py-2"
          >
            ← Kembali ke Situs
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard Shell ─────────────────────────────────────────────────
  const activeNavItem = NAV_TABS.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

      {/* ── TOP HEADER BAR ── */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 h-14 flex items-center px-4 md:px-6 gap-4">
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </span>
          <div className="hidden sm:block">
            <span className="text-sm font-black text-slate-800 tracking-tight">Portfolio</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">Admin Console</span>
          </div>
        </div>

        {/* Center: active tab label */}
        <div className="flex-1 flex items-center justify-center">
          {activeNavItem && (
            <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-600">
              <activeNavItem.Icon />
              <span>{activeNavItem.label}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all"
          >
            <IconEye /> <span className="hidden sm:inline">Lihat Web</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 px-3 py-2 rounded-lg transition-all"
          >
            <IconLogout /> <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* ── LAYOUT: SIDEBAR + CONTENT ── */}
      <div className="flex pt-14 min-h-screen">

        {/* Sidebar Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/30 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed md:sticky top-14 h-[calc(100vh-3.5rem)] z-30 w-60 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <p className="px-3 pt-2 pb-1 text-xs font-bold text-slate-400 uppercase tracking-widest">Menu</p>
            {NAV_TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <Icon />
                {label}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-bold text-slate-800">Muhamad Elgar</p>
              <p className="text-xs text-slate-400 mt-0.5">Administrator</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 md:p-8">

          {/* Global Alert */}
          {message.text && (
            <div className={`flex items-center gap-2.5 p-3.5 rounded-xl text-sm font-semibold mb-5 shadow-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {message.type === 'success' ? <IconCheck /> : <IconX />}
              {message.text}
            </div>
          )}

          {/* Panel Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

            {/* Panel Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              {activeNavItem && (
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <activeNavItem.Icon />
                  </span>
                  <h1 className="font-bold text-slate-800">{activeNavItem.label}</h1>
                </div>
              )}
            </div>

            {/* Panel Body */}
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-slate-400 font-medium">Memuat data dari database...</p>
                </div>
              ) : (
                <>
                  {/* ════════════════════════════════════════
                      PANEL: PROFILE, FOTO PROFIL & RESUME
                  ════════════════════════════════════════ */}
                  {activeTab === 'Profile' && (
                    <form onSubmit={handleProfileSubmit} className="flex flex-col gap-7">

                      {/* Identitas */}
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Identitas Utama</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField label="Nama Lengkap" value={profileForm.nama} onChange={e => setProfileForm({...profileForm, nama: e.target.value})} />
                          <InputField label="Nomor Telepon" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} type="tel" />
                          <InputField label="Email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} type="email" />
                          <InputField label="Alamat Domisili" value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} />
                        </div>
                        <div className="mt-4">
                          <TextAreaField label="Tentang Saya (About)" value={profileForm.about} onChange={e => setProfileForm({...profileForm, about: e.target.value})} rows={4} />
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="border-t border-slate-100 pt-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tautan Sosial & Kontak</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField label="GitHub URL" value={profileForm.github} onChange={e => setProfileForm({...profileForm, github: e.target.value})} placeholder="https://github.com/..." />
                          <InputField label="LinkedIn URL" value={profileForm.linkedin} onChange={e => setProfileForm({...profileForm, linkedin: e.target.value})} placeholder="https://linkedin.com/in/..." />
                          <InputField label="Instagram URL" value={profileForm.instagram} onChange={e => setProfileForm({...profileForm, instagram: e.target.value})} placeholder="https://instagram.com/..." />
                          <InputField label="YouTube Channel 1 (ItsNekitsz)" value={profileForm.youtube1} onChange={e => setProfileForm({...profileForm, youtube1: e.target.value})} placeholder="https://youtube.com/@..." />
                          <InputField label="YouTube Channel 2 (CubesinemaProject)" value={profileForm.youtube2} onChange={e => setProfileForm({...profileForm, youtube2: e.target.value})} placeholder="https://youtube.com/@..." />
                        </div>
                      </div>

                      {/* Media Berkas */}
                      <div className="border-t border-slate-100 pt-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Berkas Media</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                          {/* Foto Profil */}
                          <div className="flex flex-col gap-2 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 hover:border-indigo-300 transition-colors">
                            <div className="flex items-center gap-2 text-slate-600 mb-1">
                              <IconUpload />
                              <span className="text-xs font-bold uppercase tracking-wider">Foto Profil</span>
                            </div>
                            <input
                              type="file" accept="image/*"
                              onChange={e => setFotoProfileFile(e.target.files[0])}
                              className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                            />
                            {data?.foto_profile && (
                              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <IconDoc />
                                <span className="truncate font-mono text-indigo-500">{data.foto_profile}</span>
                              </p>
                            )}
                          </div>

                          {/* Resume EN */}
                          <div className="flex flex-col gap-2 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 hover:border-indigo-300 transition-colors">
                            <div className="flex items-center gap-2 text-slate-600 mb-1">
                              <IconUpload />
                              <span className="text-xs font-bold uppercase tracking-wider">Resume 🇬🇧 (English)</span>
                            </div>
                            <input
                              type="file" accept=".pdf,.doc,.docx"
                              onChange={e => setResumeEnFile(e.target.files[0])}
                              className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                            />
                            {data?.resume && (
                              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <IconDoc />
                                <span className="truncate font-mono text-indigo-500">{data.resume}</span>
                              </p>
                            )}
                          </div>

                          {/* Resume ID */}
                          <div className="flex flex-col gap-2 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 hover:border-indigo-300 transition-colors">
                            <div className="flex items-center gap-2 text-slate-600 mb-1">
                              <IconUpload />
                              <span className="text-xs font-bold uppercase tracking-wider">Resume 🇮🇩 (Indonesia)</span>
                            </div>
                            <input
                              type="file" accept=".pdf,.doc,.docx"
                              onChange={e => setResumeIdFile(e.target.files[0])}
                              className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                            />
                            {data?.resume_id && (
                              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <IconDoc />
                                <span className="truncate font-mono text-indigo-500">{data.resume_id}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-indigo-600/20"
                        >
                          <IconCheck /> Simpan Semua Perubahan
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ════════════════════════════════════════
                      PANEL: SKILLS, SOFTWARE & HOBBIES
                  ════════════════════════════════════════ */}
                  {activeTab === 'Skills' && (
                    <form onSubmit={handleSkillsSubmit} className="flex flex-col gap-8">
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <IconTag />
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kelola Skills, Software & Hobbies</p>
                          <h2 className="text-base font-bold text-slate-800">Tambah, Edit, atau Hapus Item</h2>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 font-medium">
                        ⚠️ Perubahan hanya tersimpan ke database setelah kamu klik tombol <strong>Simpan Semua Perubahan</strong> di bawah.
                      </p>

                      {/* ── HARD SKILLS ─────────────────────────────── */}
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Technical / Hard Skills</p>
                        <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
                          {hardSkills.map((skill, idx) => (
                            editHardSkillIdx === idx ? (
                              <span key={idx} className="inline-flex items-center gap-1.5">
                                <input
                                  autoFocus
                                  value={editHardSkillVal}
                                  onChange={e => setEditHardSkillVal(e.target.value)}
                                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveEditItem(idx, editHardSkillVal, setHardSkills, setEditHardSkillIdx, setEditHardSkillVal); } if (e.key === 'Escape') { setEditHardSkillIdx(null); setEditHardSkillVal(''); } }}
                                  className="px-2 py-1 text-xs border border-indigo-400 rounded-lg outline-none bg-white w-36"
                                />
                                <button type="button" onClick={() => saveEditItem(idx, editHardSkillVal, setHardSkills, setEditHardSkillIdx, setEditHardSkillVal)} className="text-emerald-600 hover:text-emerald-800"><IconCheck /></button>
                                <button type="button" onClick={() => { setEditHardSkillIdx(null); setEditHardSkillVal(''); }} className="text-slate-400 hover:text-slate-600"><IconX /></button>
                              </span>
                            ) : (
                              <span key={idx} className="inline-flex items-center gap-0.5">
                                <TagPill
                                  label={skill}
                                  onDelete={() => removeItem(idx, setHardSkills)}
                                />
                                <button type="button" onClick={() => { setEditHardSkillIdx(idx); setEditHardSkillVal(skill); }} className="text-slate-400 hover:text-amber-500 transition-colors ml-0.5" title="Edit"><IconPencil /></button>
                              </span>
                            )
                          ))}
                          {hardSkills.length === 0 && <p className="text-xs text-slate-400 italic">Belum ada hard skill.</p>}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newHardSkill}
                            onChange={e => setNewHardSkill(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(newHardSkill, setHardSkills, setNewHardSkill); } }}
                            placeholder="Tambah hard skill (Enter atau klik +)"
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => addItem(newHardSkill, setHardSkills, setNewHardSkill)}
                            className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                          >
                            <IconPlus /> Tambah
                          </button>
                        </div>
                      </div>

                      {/* ── SOFT SKILLS ─────────────────────────────── */}
                      <div className="border-t border-slate-100 pt-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Soft Skills</p>
                        <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
                          {softSkills.map((skill, idx) => (
                            editSoftSkillIdx === idx ? (
                              <span key={idx} className="inline-flex items-center gap-1.5">
                                <input
                                  autoFocus
                                  value={editSoftSkillVal}
                                  onChange={e => setEditSoftSkillVal(e.target.value)}
                                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveEditItem(idx, editSoftSkillVal, setSoftSkills, setEditSoftSkillIdx, setEditSoftSkillVal); } if (e.key === 'Escape') { setEditSoftSkillIdx(null); setEditSoftSkillVal(''); } }}
                                  className="px-2 py-1 text-xs border border-indigo-400 rounded-lg outline-none bg-white w-36"
                                />
                                <button type="button" onClick={() => saveEditItem(idx, editSoftSkillVal, setSoftSkills, setEditSoftSkillIdx, setEditSoftSkillVal)} className="text-emerald-600 hover:text-emerald-800"><IconCheck /></button>
                                <button type="button" onClick={() => { setEditSoftSkillIdx(null); setEditSoftSkillVal(''); }} className="text-slate-400 hover:text-slate-600"><IconX /></button>
                              </span>
                            ) : (
                              <span key={idx} className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 border border-blue-100 text-xs font-medium px-3 py-1.5 rounded-lg">
                                {skill}
                                <button type="button" onClick={() => { setEditSoftSkillIdx(idx); setEditSoftSkillVal(skill); }} className="ml-1 hover:text-amber-600 transition-colors" title="Edit"><IconPencil /></button>
                                <button type="button" onClick={() => removeItem(idx, setSoftSkills)} className="hover:text-rose-500 transition-colors" title="Hapus"><IconX /></button>
                              </span>
                            )
                          ))}
                          {softSkills.length === 0 && <p className="text-xs text-slate-400 italic">Belum ada soft skill.</p>}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newSoftSkill}
                            onChange={e => setNewSoftSkill(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(newSoftSkill, setSoftSkills, setNewSoftSkill); } }}
                            placeholder="Tambah soft skill (Enter atau klik +)"
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => addItem(newSoftSkill, setSoftSkills, setNewSoftSkill)}
                            className="inline-flex items-center gap-1 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                          >
                            <IconPlus /> Tambah
                          </button>
                        </div>
                      </div>

                      {/* ── SOFTWARE FAMILIARITY ─────────────────────── */}
                      <div className="border-t border-slate-100 pt-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Software Familiarity</p>
                        <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
                          {software.map((sw, idx) => (
                            editSoftwareIdx === idx ? (
                              <span key={idx} className="inline-flex items-center gap-1.5">
                                <input
                                  autoFocus
                                  value={editSoftwareVal}
                                  onChange={e => setEditSoftwareVal(e.target.value)}
                                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveEditItem(idx, editSoftwareVal, setSoftware, setEditSoftwareIdx, setEditSoftwareVal); } if (e.key === 'Escape') { setEditSoftwareIdx(null); setEditSoftwareVal(''); } }}
                                  className="px-2 py-1 text-xs border border-indigo-400 rounded-lg outline-none bg-white w-36"
                                />
                                <button type="button" onClick={() => saveEditItem(idx, editSoftwareVal, setSoftware, setEditSoftwareIdx, setEditSoftwareVal)} className="text-emerald-600 hover:text-emerald-800"><IconCheck /></button>
                                <button type="button" onClick={() => { setEditSoftwareIdx(null); setEditSoftwareVal(''); }} className="text-slate-400 hover:text-slate-600"><IconX /></button>
                              </span>
                            ) : (
                              <span key={idx} className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg">
                                {sw}
                                <button type="button" onClick={() => { setEditSoftwareIdx(idx); setEditSoftwareVal(sw); }} className="ml-1 hover:text-amber-600 transition-colors" title="Edit"><IconPencil /></button>
                                <button type="button" onClick={() => removeItem(idx, setSoftware)} className="hover:text-rose-500 transition-colors" title="Hapus"><IconX /></button>
                              </span>
                            )
                          ))}
                          {software.length === 0 && <p className="text-xs text-slate-400 italic">Belum ada software.</p>}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newSoftware}
                            onChange={e => setNewSoftware(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(newSoftware, setSoftware, setNewSoftware); } }}
                            placeholder="Tambah software (Enter atau klik +)"
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => addItem(newSoftware, setSoftware, setNewSoftware)}
                            className="inline-flex items-center gap-1 bg-slate-600 hover:bg-slate-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                          >
                            <IconPlus /> Tambah
                          </button>
                        </div>
                      </div>

                      {/* ── HOBBIES ──────────────────────────────────── */}
                      <div className="border-t border-slate-100 pt-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Personal Hobbies</p>
                        <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
                          {hobbies.map((hobby, idx) => (
                            editHobbyIdx === idx ? (
                              <span key={idx} className="inline-flex items-center gap-1.5">
                                <input
                                  autoFocus
                                  value={editHobbyVal}
                                  onChange={e => setEditHobbyVal(e.target.value)}
                                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveEditItem(idx, editHobbyVal, setHobbies, setEditHobbyIdx, setEditHobbyVal); } if (e.key === 'Escape') { setEditHobbyIdx(null); setEditHobbyVal(''); } }}
                                  className="px-2 py-1 text-xs border border-indigo-400 rounded-lg outline-none bg-white w-36"
                                />
                                <button type="button" onClick={() => saveEditItem(idx, editHobbyVal, setHobbies, setEditHobbyIdx, setEditHobbyVal)} className="text-emerald-600 hover:text-emerald-800"><IconCheck /></button>
                                <button type="button" onClick={() => { setEditHobbyIdx(null); setEditHobbyVal(''); }} className="text-slate-400 hover:text-slate-600"><IconX /></button>
                              </span>
                            ) : (
                              <span key={idx} className="inline-flex items-center gap-1 border border-slate-200 bg-white text-slate-600 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
                                {hobby}
                                <button type="button" onClick={() => { setEditHobbyIdx(idx); setEditHobbyVal(hobby); }} className="ml-1 hover:text-amber-600 transition-colors" title="Edit"><IconPencil /></button>
                                <button type="button" onClick={() => removeItem(idx, setHobbies)} className="hover:text-rose-500 transition-colors" title="Hapus"><IconX /></button>
                              </span>
                            )
                          ))}
                          {hobbies.length === 0 && <p className="text-xs text-slate-400 italic">Belum ada hobi.</p>}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newHobby}
                            onChange={e => setNewHobby(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(newHobby, setHobbies, setNewHobby); } }}
                            placeholder="Tambah hobi (Enter atau klik +)"
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => addItem(newHobby, setHobbies, setNewHobby)}
                            className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                          >
                            <IconPlus /> Tambah
                          </button>
                        </div>
                      </div>

                      {/* ── TOMBOL SIMPAN ────────────────────────────── */}
                      <div className="border-t border-slate-100 pt-6">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-indigo-600/20"
                        >
                          <IconCheck /> Simpan Semua Perubahan ke Database
                        </button>
                        <p className="text-xs text-slate-400 mt-2">
                          Menyimpan hard_skills, soft_skills, software, dan hobbies ke tabel <code className="bg-slate-100 px-1 rounded">profile</code> di database.
                        </p>
                      </div>
                    </form>
                  )}

                  {/* ════════════════════════════════════════
                      PANEL: PROJECTS
                  ════════════════════════════════════════ */}
                  {activeTab === 'Projects' && (
                    <div className="flex flex-col gap-8">
                      {/* Form */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const techArray = typeof projectForm.tech === 'string'
                            ? projectForm.tech.split(',').map(t => t.trim()).filter(Boolean)
                            : projectForm.tech;
                          handleSaveItem(
                            'projects',
                            { ...projectForm, tech: techArray },
                            () => setProjectForm({ project_id: null, title: '', role: '', time: '', tech: '', description: '', link: '' }),
                            'project_id'
                          );
                        }}
                        className="flex flex-col gap-4"
                      >
                        <SectionHeading icon={IconFolder} title="Proyek" mode={projectForm.project_id ? 'edit' : 'add'} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField label="Judul Proyek" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                          <InputField label="Peran (Role)" value={projectForm.role} onChange={e => setProjectForm({...projectForm, role: e.target.value})} />
                          <InputField label="Durasi / Waktu Pengerjaan" value={projectForm.time} onChange={e => setProjectForm({...projectForm, time: e.target.value})} placeholder="Contoh: Sept 2025 - Dec 2026" />
                          <InputField label="Teknologi (pisahkan dengan koma)" value={typeof projectForm.tech === 'string' ? projectForm.tech : (projectForm.tech || []).join(', ')} onChange={e => setProjectForm({...projectForm, tech: e.target.value})} placeholder="React, PHP, MySQL" />
                          <InputField label="Link URL / #gallery / #" value={projectForm.link} onChange={e => setProjectForm({...projectForm, link: e.target.value})} placeholder="https://... atau #gallery atau #" />
                        </div>
                        <TextAreaField label="Deskripsi Proyek" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} rows={3} />
                        <div className="flex gap-2">
                          <button type="submit" className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl transition-all text-sm">
                            {projectForm.project_id ? <><IconCheck /> Perbarui Proyek</> : <><IconPlus /> Tambah Proyek</>}
                          </button>
                          {projectForm.project_id && (
                            <button type="button" onClick={() => setProjectForm({ project_id: null, title: '', role: '', time: '', tech: '', description: '', link: '' })} className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-5 rounded-xl transition-all text-sm">
                              <IconX /> Batal
                            </button>
                          )}
                        </div>
                      </form>

                      {/* List */}
                      <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                          Daftar Proyek ({data?.projects?.length || 0})
                        </h3>
                        <div className="flex flex-col gap-2.5">
                          {(data?.projects || []).map(p => (
                            <ItemCard
                              key={p.project_id}
                              onEdit={() => setProjectForm({
                                project_id: p.project_id, title: p.title, role: p.role,
                                time: p.time, tech: Array.isArray(p.tech) ? p.tech.join(', ') : (p.tech || ''),
                                description: p.description, link: p.link
                              })}
                              onDelete={() => handleDeleteItem('projects', p.project_id, 'project_id')}
                            >
                              <h4 className="font-bold text-slate-800 text-sm">{p.title}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">{p.role} · {p.time}</p>
                              {Array.isArray(p.tech) && p.tech.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {p.tech.slice(0, 4).map((t, i) => (
                                    <span key={i} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{t}</span>
                                  ))}
                                  {p.tech.length > 4 && <span className="text-xs text-slate-400">+{p.tech.length - 4}</span>}
                                </div>
                              )}
                            </ItemCard>
                          ))}
                          {(!data?.projects || data.projects.length === 0) && (
                            <p className="text-sm text-slate-400 text-center py-6">Belum ada proyek. Tambahkan di atas.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ════════════════════════════════════════
                      PANEL: EDUCATION
                  ════════════════════════════════════════ */}
                  {activeTab === 'Education' && (
                    <div className="flex flex-col gap-8">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSaveItem('educations', educationForm, () => setEducationForm({ id: null, year: '', institution: '', detail: '' }));
                        }}
                        className="flex flex-col gap-4"
                      >
                        <SectionHeading icon={IconAcademic} title="Edukasi" mode={educationForm.id ? 'edit' : 'add'} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Tahun / Rentang Durasi"
                            value={educationForm.year}
                            onChange={e => setEducationForm({...educationForm, year: e.target.value})}
                            placeholder="Contoh: 2022 - Present atau 2019 - 2022"
                          />
                          <InputField
                            label="Institusi Pendidikan"
                            value={educationForm.institution}
                            onChange={e => setEducationForm({...educationForm, institution: e.target.value})}
                            placeholder="Nama universitas / sekolah"
                          />
                        </div>
                        <InputField
                          label="Detail Jurusan / Kualifikasi"
                          value={educationForm.detail}
                          onChange={e => setEducationForm({...educationForm, detail: e.target.value})}
                          placeholder="Contoh: Computer Science Major"
                        />
                        <div className="flex gap-2">
                          <button type="submit" className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl transition-all text-sm">
                            {educationForm.id ? <><IconCheck /> Perbarui Edukasi</> : <><IconPlus /> Tambah Edukasi</>}
                          </button>
                          {educationForm.id && (
                            <button type="button" onClick={() => setEducationForm({ id: null, year: '', institution: '', detail: '' })} className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-5 rounded-xl transition-all text-sm">
                              <IconX /> Batal
                            </button>
                          )}
                        </div>
                      </form>

                      <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                          Riwayat Edukasi ({data?.education?.length || 0})
                        </h3>
                        <div className="flex flex-col gap-2.5">
                          {(data?.education || []).map(e => (
                            <ItemCard
                              key={e.id}
                              onEdit={() => setEducationForm({ id: e.id, year: e.year, institution: e.institution, detail: e.detail })}
                              onDelete={() => handleDeleteItem('educations', e.id)}
                            >
                              <h4 className="font-bold text-slate-800 text-sm">{e.institution}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">{e.year} · {e.detail}</p>
                            </ItemCard>
                          ))}
                          {(!data?.education || data.education.length === 0) && (
                            <p className="text-sm text-slate-400 text-center py-6">Belum ada data edukasi.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ════════════════════════════════════════
                      PANEL: EXPERIENCE
                  ════════════════════════════════════════ */}
                  {activeTab === 'Experience' && (
                    <div className="flex flex-col gap-8">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSaveItem('experiences', experienceForm, () => setExperienceForm({ id: null, time: '', role: '', company: '', description: '' }));
                        }}
                        className="flex flex-col gap-4"
                      >
                        <SectionHeading icon={IconBriefcase} title="Pengalaman" mode={experienceForm.id ? 'edit' : 'add'} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Periode Waktu Kerja"
                            value={experienceForm.time}
                            onChange={e => setExperienceForm({...experienceForm, time: e.target.value})}
                            placeholder="Contoh: 2024 (July - August)"
                          />
                          <InputField
                            label="Jabatan / Role"
                            value={experienceForm.role}
                            onChange={e => setExperienceForm({...experienceForm, role: e.target.value})}
                            placeholder="Contoh: Finance Data Entry Intern"
                          />
                          <div className="md:col-span-2">
                            <InputField
                              label="Nama Perusahaan / Instansi"
                              value={experienceForm.company}
                              onChange={e => setExperienceForm({...experienceForm, company: e.target.value})}
                              placeholder="Contoh: CV. Sindikasi Artistik Indonesia"
                            />
                          </div>
                        </div>
                        <TextAreaField
                          label="Deskripsi Jobdesk & Kontribusi"
                          value={experienceForm.description}
                          onChange={e => setExperienceForm({...experienceForm, description: e.target.value})}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button type="submit" className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl transition-all text-sm">
                            {experienceForm.id ? <><IconCheck /> Perbarui Pengalaman</> : <><IconPlus /> Tambah Pengalaman</>}
                          </button>
                          {experienceForm.id && (
                            <button type="button" onClick={() => setExperienceForm({ id: null, time: '', role: '', company: '', description: '' })} className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-5 rounded-xl transition-all text-sm">
                              <IconX /> Batal
                            </button>
                          )}
                        </div>
                      </form>

                      <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                          Riwayat Pengalaman ({data?.experience?.length || 0})
                        </h3>
                        <div className="flex flex-col gap-2.5">
                          {(data?.experience || []).map(ex => (
                            <ItemCard
                              key={ex.id}
                              onEdit={() => setExperienceForm({ id: ex.id, time: ex.time || ex.year, role: ex.role, company: ex.company, description: ex.description || ex.desc })}
                              onDelete={() => handleDeleteItem('experiences', ex.id)}
                            >
                              <h4 className="font-bold text-slate-800 text-sm">{ex.role}</h4>
                              <p className="text-xs text-indigo-600 font-medium mt-0.5">{ex.company}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{ex.time || ex.year}</p>
                            </ItemCard>
                          ))}
                          {(!data?.experience || data.experience.length === 0) && (
                            <p className="text-sm text-slate-400 text-center py-6">Belum ada data pengalaman.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ════════════════════════════════════════
                      PANEL: SERVICES
                  ════════════════════════════════════════ */}
                  {activeTab === 'Services' && (
                    <div className="flex flex-col gap-8">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSaveItem('services', serviceForm, () => setServiceForm({ id: null, title: '', description: '' }));
                        }}
                        className="flex flex-col gap-4"
                      >
                        <SectionHeading icon={IconWrench} title="Layanan" mode={serviceForm.id ? 'edit' : 'add'} />
                        <InputField
                          label="Nama Layanan / Keahlian"
                          value={serviceForm.title}
                          onChange={e => setServiceForm({...serviceForm, title: e.target.value})}
                          placeholder="Contoh: Basic Web Development"
                        />
                        <TextAreaField
                          label="Deskripsi Layanan"
                          value={serviceForm.description}
                          onChange={e => setServiceForm({...serviceForm, description: e.target.value})}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button type="submit" className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl transition-all text-sm">
                            {serviceForm.id ? <><IconCheck /> Perbarui Layanan</> : <><IconPlus /> Tambah Layanan</>}
                          </button>
                          {serviceForm.id && (
                            <button type="button" onClick={() => setServiceForm({ id: null, title: '', description: '' })} className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-5 rounded-xl transition-all text-sm">
                              <IconX /> Batal
                            </button>
                          )}
                        </div>
                      </form>

                      <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                          Daftar Layanan ({data?.services?.length || 0})
                        </h3>
                        <div className="flex flex-col gap-2.5">
                          {(data?.services || []).map(s => (
                            <ItemCard
                              key={s.id}
                              onEdit={() => setServiceForm({ id: s.id, title: s.title, description: s.description || s.desc })}
                              onDelete={() => handleDeleteItem('services', s.id)}
                            >
                              <h4 className="font-bold text-slate-800 text-sm">{s.title}</h4>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{s.description || s.desc}</p>
                            </ItemCard>
                          ))}
                          {(!data?.services || data.services.length === 0) && (
                            <p className="text-sm text-slate-400 text-center py-6">Belum ada data layanan.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
