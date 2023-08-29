import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
interface MyContextType {
  formState: {
    tickets: {
      birthDay: string;
      gender: string;
      phoneNumber: string;
      instaUserName: string;
      nationalId: string;
      email: string;
      fullName: string;
    }[];
  };
  setFormState: React.Dispatch<
    React.SetStateAction<MyContextType['formState']>
  >;
}

const initialFormState: MyContextType['formState'] = {
  tickets: [
    {
      birthDay: '',
      gender: '',
      phoneNumber: '',
      instaUserName: '',
      nationalId: '',
      email: '',
      fullName: '',
    },
  ],
};

export const MyContext = createContext<MyContextType>({
  formState: initialFormState,
  setFormState: () => {}, // This will be overridden by the provider
});

// Create a context provider component
interface MyContextProviderProps {
  children: ReactNode;
}

const MyContextProvider: React.FC<MyContextProviderProps> = ({ children }) => {
  const [formState, setFormState] = useState<MyContextType['formState']>(
    initialFormState
  );
  

  const contextValue: MyContextType = {
    formState,
    setFormState,
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;
