import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function formatRupiah(value) {
    if (!value && value !== 0) return '';
    const numberString = value.toString().replace(/[^0-9]/g, '');
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function parseRupiah(value) {
    if (!value) return '';
    return value.toString().replace(/\./g, '');
}
