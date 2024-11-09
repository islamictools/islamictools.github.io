import React, { createContext, useState, useContext } from 'react';

const WindowsContext = createContext();

export const WindowsProvider = ({ children }) => {
  const [windows, setWindows] = useState([]);

  const addWindow = new_window => setWindows([...windows, new_window]);
  const delWindow = target => setWindows(prev => prev.filter(w => w.id != target));
  const setActive = (target) => setWindows(prev => [...prev.filter(w => w.id != target), prev.find(w => w.id == target)]);

  const make_key = () => windows.length + 1;
  const make_id = key => String(Date.now()) + '-' + String(key);
  const key_id = () => {
    const key = make_key();
    const id = make_id(key);
    return [key, id];
  }

  return (
    <WindowsContext.Provider value={{ windows, addWindow, delWindow, setActive, make_id, make_key, key_id }}>
      {children}
    </WindowsContext.Provider>
  );
};

export const useWindows = () => {
  return useContext(WindowsContext);
};
