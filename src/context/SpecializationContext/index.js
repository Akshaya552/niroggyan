import { createContext, useState } from "react";

export const SpecializationContext = createContext();

export const SpecializationProvider = ({ children }) => {
  const [specialization, setSpecialization] = useState('');

  return (
    <SpecializationContext.Provider value={{ specialization, setSpecialization }}>
      {children}
    </SpecializationContext.Provider>
  );
};
