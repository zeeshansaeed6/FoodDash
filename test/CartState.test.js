import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getCart, 
  addToCart, 
  removeFromCart, 
  updateItemQty, 
  clearCart
} from '../src/components/CartState.js';

const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = val.toString(); },
  removeItem: (key) => { delete mockStorage[key]; }
};

describe('FoodDash Frontend Cart State Tests', () => {
  beforeEach(() => {
    clearCart();
  });

  it('should add an item to the cart', () => {
    addToCart({ id: 1, name: 'Pizza', price: 250 }, 1, 'Test Restaurant');
    const cart = getCart();
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].name).toBe('Pizza');
    expect(cart.items[0].qty).toBe(1);
  });

  it('should increase quantity if same item added', () => {
    addToCart({ id: 1, name: 'Burger', price: 150 }, 1, 'Rest A');
    addToCart({ id: 1, name: 'Burger', price: 150 }, 1, 'Rest A');
    
    const cart = getCart();
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].qty).toBe(2);
  });

  it('should update quantity correctly', () => {
    addToCart({ id: 1, name: 'Pasta', price: 200 }, 1, 'Rest A');
    updateItemQty(1, 4); // delta of 4, so total 5
    const cart = getCart();
    expect(cart.items[0].qty).toBe(5);
  });

  it('should remove item when quantity is reduced to 0', () => {
    addToCart({ id: 1, name: 'Pasta', price: 200 }, 1, 'Rest A');
    updateItemQty(1, -1);
    const cart = getCart();
    expect(cart.items.length).toBe(0);
  });

  it('should remove item from cart explicitly', () => {
    addToCart({ id: 1, name: 'Pasta', price: 200 }, 1, 'Rest A');
    removeFromCart(1);
    const cart = getCart();
    expect(cart.items.length).toBe(0);
  });

  it('should get item quantity correctly', () => {
    addToCart({ id: 1, name: 'Item 1', price: 100 }, 1, 'Rest A'); 
    addToCart({ id: 1, name: 'Item 1', price: 100 }, 1, 'Rest A');
    addToCart({ id: 2, name: 'Item 2', price: 150 }, 1, 'Rest A');
    
    expect(getCart().items[0].qty).toBe(2);
  });
});

