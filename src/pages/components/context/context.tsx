import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
interface MyContextType {
  formState: {
    tickets: {
      birthDay: string;
      age: number;
      gender: string;
      phoneNumber: string;
      instaUserName: string;
      nationalId: string;
      email: string;
      fullName: string;
    }[];
  };
  eventName: string;
  ticketSlug: string;
  ticketName: string;
  setFormState: React.Dispatch<
    React.SetStateAction<MyContextType['formState']>
  >;
  setEventName: React.Dispatch<React.SetStateAction<string>>
  setTicketSlug: React.Dispatch<React.SetStateAction<string>>
  setTicketName: React.Dispatch<React.SetStateAction<string>>
}

const initialFormState: MyContextType['formState'] = {
  tickets: [
    {
      birthDay: '',
      age: 0,
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
  eventName: "",
  ticketSlug: "",
  ticketName: "",
  setFormState: () => {},
  setEventName: () => "",
  setTicketSlug: () => "",
  setTicketName: () => ""
});

// Create a context provider component
interface MyContextProviderProps {
  children: ReactNode;
}

const MyContextProvider: React.FC<MyContextProviderProps> = ({ children }) => {
  const [formState, setFormState] = useState<MyContextType['formState']>(
    initialFormState
  );
  const [eventName, setEventName] = useState("")
  const [ticketSlug, setTicketSlug] = useState("")
  const [ticketName, setTicketName] = useState("")


  const contextValue: MyContextType = {
    formState,
    eventName,
    ticketSlug,
    ticketName,
    setEventName,
    setTicketSlug,
    setFormState,
    setTicketName
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;

