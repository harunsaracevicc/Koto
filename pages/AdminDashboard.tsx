import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Loader2, Image as ImageIcon, Lock, CheckCircle, AlertCircle, LogOut, Star } from 'lucide-react';
import { fetchMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, fetchCategories, addCategory, deleteCategory, uploadImage, Category } from '../lib/api';
import { MenuItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const AdminDashboard: React.FC = () => {
    // --- Auth State ---
    const { user, loading: authLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState(false);
    const [authLoadingState, setAuthLoadingState] = useState(false);

    // --- Data State ---
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("Sve");

    // --- Modal States ---
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // --- Confirmation/Status Popups ---
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, message: string, onConfirm: () => void }>({
        isOpen: false, message: '', onConfirm: () => { }
    });
    const [statusModal, setStatusModal] = useState<{ isOpen: boolean, type: 'success' | 'error', message: string }>({
        isOpen: false, type: 'success', message: ''
    });

    // --- Form States ---
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [itemForm, setItemForm] = useState({
        nameBs: '', nameEn: '',
        descBs: '', descEn: '',
        price: '',
        category: '',
        image: '',
        isSignature: false
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [newCategory, setNewCategory] = useState({ nameBs: '', nameEn: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoadingState(true);
        setAuthError(false);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: 'admin@koto.ba',
                password
            });

            if (error) throw error;

        } catch (error) {
            console.error(error);
            setAuthError(true);
        } finally {
            setAuthLoadingState(false);
        }
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error && error.message !== 'Session from session_id claim in JWT does not exist') {
                console.error('Supabase signOut error:', error);
            }
        } catch (err) {
            console.warn('Unexpected logout error:', err);
        } finally {
            supabase.auth.setSession(null);
            localStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('adminPin');
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [items, cats] = await Promise.all([fetchMenuItems(), fetchCategories()]);
            setMenuItems(items);
            setCategories(cats);
        } catch (e) {
            showStatus('error', "Greška prilikom učitavanja podataka.");
        }
        setLoading(false);
    };

    const showStatus = (type: 'success' | 'error', message: string) => {
        setStatusModal({ isOpen: true, type, message });
        // Auto-close success after 2s
        if (type === 'success') {
            setTimeout(() => setStatusModal(prev => ({ ...prev, isOpen: false })), 2000);
        }
    };

    const requestConfirm = (message: string, action: () => void) => {
        setConfirmModal({
            isOpen: true,
            message,
            onConfirm: () => {
                action();
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    // --- CRUD Handlers ---

    const [isCreatingCategoryInItemModal, setIsCreatingCategoryInItemModal] = useState(false);

    const handleItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let finalCategory = itemForm.category;

            // Handle inline category creation
            if (isCreatingCategoryInItemModal) {
                if (!newCategory.nameBs || !newCategory.nameEn) {
                    throw new Error("Category names are required");
                }
                const addedCat = await addCategory(newCategory.nameEn, newCategory.nameBs);
                setCategories(prev => [...prev, addedCat]);
                finalCategory = addedCat.name.en;
                // Reset category creation state
                setNewCategory({ nameBs: '', nameEn: '' });
                setIsCreatingCategoryInItemModal(false);
            }

            // Handle image upload if file is selected
            let imageUrl = itemForm.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';

            if (imageFile) {
                setUploading(true);
                try {
                    imageUrl = await uploadImage(imageFile);
                } catch (uploadError) {
                    console.error('Image upload failed:', uploadError);
                    showStatus('error', 'Greška pri uploadu slike. Koristi se URL umjesto toga.');
                } finally {
                    setUploading(false);
                }
            }

            const payload = {
                name: { bs: itemForm.nameBs, en: itemForm.nameEn || itemForm.nameBs },
                description: { bs: itemForm.descBs, en: itemForm.descEn || itemForm.descBs },
                price: parseFloat(itemForm.price),
                category: finalCategory,
                image: imageUrl,
                isSignature: itemForm.isSignature
            };

            if (editingItem) {
                await updateMenuItem(editingItem.id, payload);
                showStatus('success', 'Jelo uspješno ažurirano!');
            } else {
                await addMenuItem(payload);
                showStatus('success', 'Novo jelo dodano!');
            }
            await loadData();
            setIsItemModalOpen(false);
            resetItemForm();
        } catch (error) {
            console.error(error);
            showStatus('error', "Greška prilikom spremanja.");
        } finally {
            setSubmitting(false);
        }
    };

    // ... (keeping existing handlers largely same, just verify context)

    const handleDeleteItem = (id: number) => {
        requestConfirm("Da li ste sigurni da želite trajno obrisati ovo jelo?", async () => {
            try {
                await deleteMenuItem(id);
                setMenuItems(prev => prev.filter(i => i.id !== id));
                showStatus('success', 'Jelo obrisano.');
            } catch (error) {
                showStatus('error', "Greška prilikom brisanja.");
            }
        });
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addCategory(newCategory.nameEn || newCategory.nameBs, newCategory.nameBs);
            await loadData();
            setIsCategoryModalOpen(false);
            setNewCategory({ nameBs: '', nameEn: '' });
            showStatus('success', 'Kategorija dodana!');
        } catch (error) {
            showStatus('error', "Greška prilikom dodavanja kategorije.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteCategory = (id: number) => {
        requestConfirm("Obrisati kategoriju? Povezana jela mogu ostati bez kategorije.", async () => {
            try {
                await deleteCategory(id);
                await loadData();
                showStatus('success', 'Kategorija obrisana.');
            } catch (error) {
                showStatus('error', "Greška prilikom brisanja kategorije.");
            }
        });
    };

    // Helpers
    const openEditItem = (item: any) => {
        setEditingItem(item);
        setItemForm({
            nameBs: item.name.bs,
            nameEn: item.name.en,
            descBs: item.description.bs,
            descEn: item.description.en,
            price: item.price.toString(),
            category: item.category,
            image: item.image,
            isSignature: item.isSignature || false
        });
        setIsCreatingCategoryInItemModal(false);
        setIsItemModalOpen(true);
    };

    const resetItemForm = () => {
        setEditingItem(null);
        setItemForm({
            nameBs: '', nameEn: '',
            descBs: '', descEn: '',
            price: '',
            category: categories.length > 0 ? categories[0].name.en : '',
            image: '',
            isSignature: false
        });
        setImageFile(null);
        setIsCreatingCategoryInItemModal(false);
        setNewCategory({ nameBs: '', nameEn: '' });
    };

    const displayItems = activeCategory === "Sve"
        ? menuItems
        : menuItems.filter(i => i.category === activeCategory);

    // --- Loading State ---
    if (authLoading) {
        return <div className="min-h-screen bg-black-rich flex items-center justify-center"><Loader2 className="animate-spin text-gold-300" size={40} /></div>;
    }

    // --- Render Login Screen ---
    if (!user) {
        return (
            <div className="min-h-screen bg-black-rich flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 p-8 rounded-2xl w-full max-w-sm text-center backdrop-blur-sm shadow-2xl"
                >
                    <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-gold-300">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-serif text-white mb-2">Admin Pristup</h1>
                    <p className="text-white/50 mb-6 text-sm">Prijavite se sa svojim nalogom</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Wrapper for PIN-only authentication backed by Supabase */}
                        <div className="space-y-2">
                            <input
                                type="password"
                                autoFocus
                                required
                                placeholder="Unesite PIN"
                                className={`w-full bg-black-surface border ${authError ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 text-center text-white text-lg tracking-[0.5em] outline-none focus:border-gold-300 transition-colors`}
                                value={password}
                                onChange={e => { setPassword(e.target.value); setAuthError(false); }}
                            />
                            {authError && <p className="text-red-400 text-xs mt-2">Pogrešan PIN kod</p>}
                        </div>
                        <button disabled={authLoadingState} type="submit" className="w-full bg-gold-gradient text-black-rich font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex justify-center">
                            {authLoadingState ? <Loader2 className="animate-spin" /> : "Otključaj"}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    // ... (Dashboard view starts)

    return (
        <div className="min-h-screen bg-black-rich text-white pt-12 px-6 pb-20">
            <div className="max-w-7xl mx-auto">
                {/* Header and Toolbar omitted for brevity in search replacement, assuming functionality remains */}

                {/* ... (Existing UI Code) ... */}

                {/* REPLACING JUST THE MODAL CONTENT LOGIC */}

                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-serif text-gold-300 mb-2">Admin Panel</h1>
                        <p className="text-white/60">Upravljanje jelovnikom i kategorijama</p>
                    </div>
                    {/* ... */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => requestConfirm("Da li ste sigurni da želite sačuvati sve izmjene?", () => { showStatus('success', 'Sve izmjene su sačuvane!') })}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20"
                        >
                            <Save size={18} />
                            Sačuvaj Sve
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                {/* Actions Toolbar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/[0.07] transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-serif text-gold-200">Jela</h3>
                            <span className="text-xs bg-gold-500/20 text-gold-300 px-2 py-1 rounded-full">{menuItems.length} ukupno</span>
                        </div>
                        <button
                            onClick={() => { resetItemForm(); setIsItemModalOpen(true); }}
                            className="w-full bg-gold-gradient text-black-rich font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <Plus size={18} /> Dodaj novo jelo
                        </button>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/[0.07] transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-serif text-gold-200">Kategorije</h3>
                            <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">{categories.length} ukupno</span>
                        </div>
                        <button
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="w-full bg-white/10 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                        >
                            <Plus size={18} /> Dodaj novu kategoriju
                        </button>
                    </div>
                </div>

                {/* Categories Pills */}
                <div className="flex flex-wrap gap-2 mb-8 items-center bg-black-surface/50 p-2 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setActiveCategory("Sve")}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === "Sve" ? "bg-gold-300 text-black-rich shadow-lg shadow-gold-500/20" : "text-white/60 hover:text-white"}`}
                    >
                        SVE
                    </button>
                    {categories.map(cat => (
                        <div key={cat.id} className="relative group">
                            <button
                                onClick={() => setActiveCategory(cat.name.en)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all pr-8 ${activeCategory === cat.name.en ? "bg-gold-300 text-black-rich shadow-lg shadow-gold-500/20" : "text-white/60 hover:text-white"}`}
                            >
                                {cat.name.bs}
                            </button>
                            {cat.id > 0 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                                    className="absolute right-1 top-1.5 p-1 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold-300" size={40} /></div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {displayItems.map(item => (
                            <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4 items-start group hover:border-gold-300/30 transition-colors">
                                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-black/40">
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-serif text-lg text-white truncate pr-2 flex items-center gap-2">
                                            {item.name.bs}
                                            {item.isSignature && <Star size={14} className="text-gold-500 fill-gold-500" />}
                                        </h4>
                                        <span className="text-gold-300 font-bold text-sm bg-black-surface px-2 py-0.5 rounded">{item.price} KM</span>
                                    </div>
                                    <p className="text-white/40 text-xs line-clamp-2 mb-1 h-4">{item.description.bs}</p>
                                    <p className="text-white/20 text-[10px] line-clamp-1 mb-3">{item.description.en}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditItem(item)}
                                            className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold hover:bg-blue-500 hover:text-white transition-all flex items-center gap-1"
                                        >
                                            <Edit2 size={12} /> Uredi
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center gap-1"
                                        >
                                            <Trash2 size={12} /> Obriši
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Modals --- */}

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-black-card border border-white/20 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                            <AlertCircle size={48} className="text-gold-300 mx-auto mb-4" />
                            <h3 className="text-xl font-serif text-white mb-2">Potvrda</h3>
                            <p className="text-white/60 mb-8">{confirmModal.message}</p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={confirmModal.onConfirm} className="bg-gold-gradient text-black-rich font-bold px-6 py-2.5 rounded-xl hover:opacity-90 flex-1">
                                    Da
                                </button>
                                <button onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} className="bg-white/10 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-white/20 flex-1">
                                    Ne
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Status Modal */}
            <AnimatePresence>
                {statusModal.isOpen && (
                    <div className="fixed top-6 right-6 z-[80]">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={`
                            flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md
                            ${statusModal.type === 'success' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'}
                        `}>
                            {statusModal.type === 'success' ? <CheckCircle className="text-green-400" /> : <AlertCircle className="text-red-400" />}
                            <span className="text-white font-medium">{statusModal.message}</span>
                            <button onClick={() => setStatusModal(prev => ({ ...prev, isOpen: false }))} className="ml-2 text-white/50 hover:text-white"><X size={16} /></button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Item Modal */}
            <AnimatePresence>
                {isItemModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-black-card border border-white/20 w-full max-w-2xl rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif text-gold-300">{editingItem ? 'Uredi Jelo' : 'Dodaj Novo Jelo'}</h2>
                                <button onClick={() => setIsItemModalOpen(false)} className="text-white/40 hover:text-white"><X /></button>
                            </div>
                            <form onSubmit={handleItemSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-white/60">Naziv (BS)</label>
                                        <input required className="w-full bg-black-surface border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold-300"
                                            value={itemForm.nameBs} onChange={e => setItemForm({ ...itemForm, nameBs: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-white/60">Naziv (EN)</label>
                                        <input className="w-full bg-black-surface border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold-300"
                                            value={itemForm.nameEn} onChange={e => setItemForm({ ...itemForm, nameEn: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs text-white/60">Kategorija</label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsCreatingCategoryInItemModal(!isCreatingCategoryInItemModal);
                                                if (!isCreatingCategoryInItemModal) setNewCategory({ nameBs: '', nameEn: '' });
                                            }}
                                            className={`text-[10px] font-bold uppercase transition-colors ${isCreatingCategoryInItemModal ? 'text-red-400 hover:text-red-300' : 'text-gold-300 hover:text-gold-200'}`}
                                        >
                                            {isCreatingCategoryInItemModal ? 'x Otkaži' : '+ Nova Kategorija'}
                                        </button>
                                    </div>

                                    {isCreatingCategoryInItemModal ? (
                                        <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
                                            <input required={isCreatingCategoryInItemModal} autoFocus className="w-full bg-black-surface border border-gold-300/50 rounded-lg p-3 text-white outline-none focus:border-gold-300"
                                                value={newCategory.nameBs} onChange={e => setNewCategory({ ...newCategory, nameBs: e.target.value })} placeholder="Nova kategorija (BS)" />
                                            <input required={isCreatingCategoryInItemModal} className="w-full bg-black-surface border border-gold-300/50 rounded-lg p-3 text-white outline-none focus:border-gold-300"
                                                value={newCategory.nameEn} onChange={e => setNewCategory({ ...newCategory, nameEn: e.target.value })} placeholder="New Category (EN)" />
                                        </div>
                                    ) : (
                                        <select required className="w-full bg-black-surface border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold-300"
                                            value={itemForm.category} onChange={e => setItemForm({ ...itemForm, category: e.target.value })}
                                        >
                                            <option value="" disabled>Odaberi kategoriju</option>
                                            {categories.map(c => <option key={c.id} value={c.name.en}>{c.name.bs}</option>)}
                                        </select>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-white/60">Cijena (KM)</label>
                                    <input required type="number" step="0.1" className="w-full bg-black-surface border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold-300"
                                        value={itemForm.price} onChange={e => setItemForm({ ...itemForm, price: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-white/60">Opis (BS)</label>
                                    <textarea required rows={3} className="w-full bg-black-surface border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold-300"
                                        value={itemForm.descBs} onChange={e => setItemForm({ ...itemForm, descBs: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-white/60">Opis (EN)</label>
                                    <textarea rows={3} className="w-full bg-black-surface border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold-300"
                                        value={itemForm.descEn} onChange={e => setItemForm({ ...itemForm, descEn: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-white/60">Slika</label>

                                    {/* Image Preview */}
                                    {(imageFile || itemForm.image) && (
                                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-black-surface border border-white/10">
                                            <img
                                                src={imageFile ? URL.createObjectURL(imageFile) : itemForm.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setItemForm({ ...itemForm, image: '' });
                                                }}
                                                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {/* File Upload Button */}
                                    <div className="flex gap-2">
                                        <label className="flex-1 cursor-pointer">
                                            <div className="w-full bg-gold-500/10 hover:bg-gold-500/20 border border-gold-300/30 rounded-lg p-3 text-gold-300 font-medium text-center transition-colors flex items-center justify-center gap-2">
                                                <ImageIcon size={18} />
                                                {imageFile ? imageFile.name : 'Upload sa uređaja'}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setImageFile(file);
                                                        setItemForm({ ...itemForm, image: '' }); // Clear URL when file is selected
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>

                                    {/* URL Input (alternative) */}
                                    <div className="relative">
                                        <input
                                            className="w-full bg-black-surface border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-gold-300 disabled:opacity-50"
                                            value={itemForm.image}
                                            onChange={(e) => {
                                                setItemForm({ ...itemForm, image: e.target.value });
                                                if (e.target.value) setImageFile(null); // Clear file when URL is entered
                                            }}
                                            placeholder="ili unesi URL slike..."
                                            disabled={!!imageFile}
                                        />
                                    </div>

                                    {uploading && (
                                        <div className="flex items-center gap-2 text-gold-300 text-sm">
                                            <Loader2 className="animate-spin" size={14} />
                                            <span>Upload u toku...</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer" onClick={() => setItemForm(prev => ({ ...prev, isSignature: !prev.isSignature }))}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${itemForm.isSignature ? 'bg-gold-500 border-gold-500 text-black' : 'border-white/30'}`}>
                                        {itemForm.isSignature && <CheckCircle size={14} />}
                                    </div>
                                    <span className="text-white text-sm select-none">Izdvojeno Jelo (Signature Dish)</span>
                                </div>
                                <button type="submit" disabled={submitting} className="w-full bg-gold-gradient text-black-rich font-bold py-4 rounded-xl mt-4 hover:opacity-90 transition-opacity">
                                    {submitting ? <Loader2 className="animate-spin mx-auto" /> : (editingItem ? "Sačuvaj Promjene" : "Dodaj Jelo")}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Category Modal (Existing one, kept for standalone usage) */}
            <AnimatePresence>
                {isCategoryModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-black-card border border-white/20 w-full max-w-md rounded-2xl p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif text-gold-300">Dodaj Kategoriju</h2>
                                <button onClick={() => setIsCategoryModalOpen(false)} className="text-white/40 hover:text-white"><X /></button>
                            </div>
                            <form onSubmit={handleCategorySubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-white/60">Naziv (BS)</label>
                                    <input required className="w-full bg-black-surface border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold-300"
                                        value={newCategory.nameBs} onChange={e => setNewCategory({ ...newCategory, nameBs: e.target.value })} placeholder="Npr. Kolači" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-white/60">Interi Naziv (EN)</label>
                                    <input className="w-full bg-black-surface border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold-300"
                                        value={newCategory.nameEn} onChange={e => setNewCategory({ ...newCategory, nameEn: e.target.value })} placeholder="Cakes" />
                                </div>
                                <button type="submit" disabled={submitting} className="w-full bg-gold-gradient text-black-rich font-bold py-4 rounded-xl mt-4 hover:opacity-90 transition-opacity">
                                    {submitting ? <Loader2 className="animate-spin mx-auto" /> : "Dodaj Kategoriju"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
