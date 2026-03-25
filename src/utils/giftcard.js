// Gift card utilities
import { storage } from './storage';

const STORAGE_KEY = 'giftcards';

export function getAllGiftCards() {
  return storage.get(STORAGE_KEY, []);
}

export function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function createGiftCard({ benefitType, benefitValue, serviceId, note }) {
  const cards = getAllGiftCards();
  const newCard = {
    id: Date.now().toString(),
    code: generateCode(),
    benefitType, // 'discount_percent' | 'discount_fixed' | 'free_service'
    benefitValue, // number (percent or R$) or null for free service
    serviceId: serviceId || null,
    note: note || '',
    used: false,
    usedBy: null,
    usedAt: null,
    createdAt: new Date().toISOString(),
  };
  storage.set(STORAGE_KEY, [...cards, newCard]);
  return newCard;
}

export function validateGiftCard(code) {
  const cards = getAllGiftCards();
  const card = cards.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
  if (!card) return { valid: false, error: 'Código não encontrado.' };
  if (card.used) return { valid: false, error: 'Este gift card já foi utilizado.' };
  return { valid: true, card };
}

export function redeemGiftCard(code, userId) {
  const cards = getAllGiftCards();
  const idx = cards.findIndex(c => c.code.toUpperCase() === code.toUpperCase().trim());
  if (idx === -1) return false;
  cards[idx] = { ...cards[idx], used: true, usedBy: userId, usedAt: new Date().toISOString() };
  storage.set(STORAGE_KEY, cards);
  return cards[idx];
}

export function getWhatsAppLink(card, businessInfo) {
  const msg = `🎁 *Presente Especial!* 🎁\nVocê ganhou um Gift Card da ${businessInfo.name}!\n\n*Código:* ${card.code}\n*Benefício:* ${describeBenefit(card)}\n\nAgende seu horário: ${window.location.origin}`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

export function describeBenefit(card) {
  if (card.benefitType === 'free_service') return 'Serviço gratuito';
  if (card.benefitType === 'discount_percent') return `${card.benefitValue}% de desconto`;
  if (card.benefitType === 'discount_fixed') return `R$ ${card.benefitValue.toFixed(2)} de desconto`;
  return '';
}

export function applyDiscount(price, card) {
  if (!card) return price;
  if (card.benefitType === 'discount_percent') return Math.max(0, price * (1 - card.benefitValue / 100));
  if (card.benefitType === 'discount_fixed') return Math.max(0, price - card.benefitValue);
  if (card.benefitType === 'free_service') return 0;
  return price;
}
