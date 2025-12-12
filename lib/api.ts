
import { supabase } from './supabase';
import { MenuItem, GalleryItem } from '../types';
import { MENU_ITEMS, GALLERY_ITEMS } from '../constants';

// --- Menu Items ---

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
    const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true });

    if (error) {
        console.error('Error fetching menu items:', error);
        return [];
    }

    // Transform database shape to app shape if needed, 
    // currently assuming DB columns match needed structure or transforming here
    // DB structure expected: id, name_en, name_bs, description_en, description_bs, price, category, image_url

    return data.map((item: any) => ({
        id: item.id,
        name: { en: item.name_en, bs: item.name_bs },
        description: { en: item.description_en, bs: item.description_bs },
        price: item.price,
        category: item.category,
        image: item.image_url,
        isSignature: item.is_signature,
        subcategory: item.subcategory
    }));
};

export const deleteMenuItem = async (id: number) => {
    const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    // Transform back to DB shape
    const dbItem = {
        name_en: item.name.en,
        name_bs: item.name.bs,
        description_en: item.description.en,
        description_bs: item.description.bs,
        price: item.price,
        category: item.category,
        image_url: item.image,
        is_signature: item.isSignature,
        subcategory: item.subcategory
    };

    const { data, error } = await supabase
        .from('menu_items')
        .insert([dbItem])
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        name: { en: data.name_en, bs: data.name_bs },
        description: { en: data.description_en, bs: data.description_bs },
        price: data.price,
        category: data.category,
        image: data.image_url,
        isSignature: data.is_signature,
        subcategory: data.subcategory
    };
};

export const updateMenuItem = async (id: number, item: Partial<Omit<MenuItem, 'id'>>) => {
    const dbUpdates: any = {};
    if (item.name?.en) dbUpdates.name_en = item.name.en;
    if (item.name?.bs) dbUpdates.name_bs = item.name.bs;
    if (item.description?.en) dbUpdates.description_en = item.description.en;
    if (item.description?.bs) dbUpdates.description_bs = item.description.bs;
    if (item.price !== undefined) dbUpdates.price = item.price;
    if (item.category) dbUpdates.category = item.category;
    if (item.image) dbUpdates.image_url = item.image;
    if (item.isSignature !== undefined) dbUpdates.is_signature = item.isSignature;
    if (item.subcategory !== undefined) dbUpdates.subcategory = item.subcategory;

    const { data, error } = await supabase
        .from('menu_items')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        name: { en: data.name_en, bs: data.name_bs },
        description: { en: data.description_en, bs: data.description_bs },
        price: data.price,
        category: data.category,
        image: data.image_url,
        isSignature: data.is_signature,
        subcategory: data.subcategory
    };
};

// --- Categories ---

export interface Category {
    id: number;
    name: { en: string; bs: string };
}

export const fetchCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.warn('Error fetching categories:', error);
        return [];
    }

    return data.map((c: any) => ({
        id: c.id,
        name: { en: c.name_en, bs: c.name_bs }
    }));
};

export const addCategory = async (nameEn: string, nameBs: string) => {
    // Determine the name to save. User might input "CATEGORIES" prefix? 
    // Request: "Make sure when I add category to use name without 'CATEGORIES'". 
    // I will strip string "CATEGORIES" or similar if present, case insensitive.
    const cleanEn = nameEn.replace(/categories/i, '').trim();
    const cleanBs = nameBs.replace(/categories/i, '').trim();

    const { data, error } = await supabase
        .from('menu_categories')
        .insert([{ name_en: cleanEn, name_bs: cleanBs }])
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        name: { en: data.name_en, bs: data.name_bs }
    };
};

export const updateCategory = async (id: number, nameEn: string, nameBs: string) => {
    const cleanEn = nameEn.replace(/categories/i, '').trim();
    const cleanBs = nameBs.replace(/categories/i, '').trim();

    const { data, error } = await supabase
        .from('menu_categories')
        .update({ name_en: cleanEn, name_bs: cleanBs })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        name: { en: data.name_en, bs: data.name_bs }
    };
};

export const deleteCategory = async (id: number) => {
    const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// --- Image Upload ---

export const uploadImage = async (file: File): Promise<string> => {
    // Generate unique filename with timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `menu-items/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Upload error:', error);
        throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

    return publicUrl;
};

// --- Gallery Items ---

export const fetchGalleryItems = async (): Promise<GalleryItem[]> => {
    const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching gallery items:', error);
        return [];
    }

    return data.map((item: any) => ({
        id: item.id,
        image: item.image_url,
        alt: { en: item.alt_en, bs: item.alt_bs },
        size: item.size
    }));
};

export const deleteGalleryItem = async (id: number) => {
    const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

export const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    const dbItem = {
        image_url: item.image,
        alt_en: item.alt.en,
        alt_bs: item.alt.bs,
        size: item.size
    };

    const { data, error } = await supabase
        .from('gallery_items')
        .insert([dbItem])
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        image: data.image_url,
        alt: { en: data.alt_en, bs: data.alt_bs },
        size: data.size
    };
};

// --- Seeding ---

export const seedDatabase = async () => {
    console.log("Starting seed...");
    let seededMenu = 0;
    let seededGallery = 0;
    let seededCategories = 0;

    // 1. Seed Categories first (derived from MENU_ITEMS)
    const { count: catCount } = await supabase.from('menu_categories').select('*', { count: 'exact', head: true });

    if (catCount === 0) {
        console.log("Seeding categories...");
        const uniqueCategories = Array.from(new Set(MENU_ITEMS.map(i => i.category)));

        for (const catName of uniqueCategories) {
            // Mapping English category names to potential Bosnian equivalents for seeding
            // This is a simple static map for the initial seed based on known constants
            let bsName = catName;
            if (catName === 'Starters') bsName = 'Predjela';
            if (catName === 'Main Dishes') bsName = 'Glavna Jela';
            if (catName === 'Pizza') bsName = 'Pizza';
            if (catName === 'Pasta') bsName = 'Pasta';
            if (catName === 'Desserts') bsName = 'Deserti';

            await addCategory(catName, bsName);
            seededCategories++;
        }
    }

    // 2. Seed Menu Items
    const { count: menuCount } = await supabase.from('menu_items').select('*', { count: 'exact', head: true });
    if (menuCount === 0) {
        console.log("Seeding menu items...");
        for (const item of MENU_ITEMS) {
            // Omit 'id' as it will be auto-generated by DB
            const { id, ...itemData } = item;
            await addMenuItem(itemData);
            seededMenu++;
        }
    }

    // 3. Seed Gallery Items
    const { count: galleryCount } = await supabase.from('gallery_items').select('*', { count: 'exact', head: true });
    if (galleryCount === 0) {
        console.log("Seeding gallery items...");
        for (const item of GALLERY_ITEMS) {
            const { id, ...itemData } = item;
            await addGalleryItem(itemData);
            seededGallery++;
        }
    }

    return { seededMenu, seededGallery, seededCategories };
};
