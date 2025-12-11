-- Migration to add is_signature column to menu_items table
-- Run this in your Supabase SQL Editor to enable the "Signature Dish" feature.

ALTER TABLE menu_items 
ADD COLUMN is_signature boolean DEFAULT false;
