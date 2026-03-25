import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { defaultServices } from '../data/services';
import { initialGallery } from '../data/gallery';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedServices = storage.get('services', defaultServices);
    const savedBookings = storage.get('bookings', []);
    const savedGallery = storage.get('gallery', initialGallery);
    setServices(savedServices);
    setBookings(savedBookings);
    setGallery(savedGallery);
    setInitialized(true);
  }, []);

  // --- Services ---
  const saveServices = (newServices) => {
    setServices(newServices);
    storage.set('services', newServices);
  };

  const addService = (service) => {
    const id = Date.now().toString();
    const newList = [...services, { ...service, id, active: true }];
    saveServices(newList);
  };

  const updateService = (id, updates) => {
    const newList = services.map(s => s.id === id ? { ...s, ...updates } : s);
    saveServices(newList);
  };

  const deleteService = (id) => {
    const newList = services.filter(s => s.id !== id);
    saveServices(newList);
  };

  const getService = (id) => services.find(s => s.id === id);

  // --- Bookings ---
  const saveBookings = (newBookings) => {
    setBookings(newBookings);
    storage.set('bookings', newBookings);
  };

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    const newList = [...bookings, newBooking];
    saveBookings(newList);
    return newBooking;
  };

  const updateBooking = (id, updates) => {
    const newList = bookings.map(b => b.id === id ? { ...b, ...updates } : b);
    saveBookings(newList);
  };

  const cancelBooking = (id) => {
    updateBooking(id, { status: 'cancelled' });
  };

  const completeBooking = (id) => {
    updateBooking(id, { status: 'completed' });
  };

  const getUserBookings = useCallback((userId) => {
    return bookings.filter(b => b.userId === userId).sort((a, b) =>
      new Date(b.datetime) - new Date(a.datetime)
    );
  }, [bookings]);

  // --- Gallery ---
  const saveGallery = (newGallery) => {
    setGallery(newGallery);
    storage.set('gallery', newGallery);
  };

  const addGalleryImage = (image) => {
    const newImage = { ...image, id: Date.now().toString(), uploadedAt: new Date().toISOString() };
    saveGallery([newImage, ...gallery]);
  };

  const deleteGalleryImage = (id) => {
    saveGallery(gallery.filter(img => img.id !== id));
  };

  // --- Finance ---
  const getFinancials = useCallback((period = 'month') => {
    const now = new Date();
    const completed = bookings.filter(b => b.status === 'completed');

    const filterByPeriod = (booking) => {
      const date = new Date(booking.datetime);
      if (period === 'day') {
        return date.toDateString() === now.toDateString();
      }
      if (period === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date >= weekAgo;
      }
      if (period === 'month') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }
      return true;
    };

    const filtered = completed.filter(filterByPeriod);
    const total = filtered.reduce((sum, b) => sum + (b.finalPrice || b.price || 0), 0);
    return { bookings: filtered, total };
  }, [bookings]);

  // --- Users (for admin) ---
  const getAllUsers = () => storage.get('users', []);

  return (
    <AppContext.Provider value={{
      initialized,
      services, addService, updateService, deleteService, getService,
      bookings, addBooking, updateBooking, cancelBooking, completeBooking, getUserBookings,
      gallery, addGalleryImage, deleteGalleryImage,
      getFinancials, getAllUsers,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
