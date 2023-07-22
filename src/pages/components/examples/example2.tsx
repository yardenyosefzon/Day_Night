import dynamic from "next/dynamic";
import React, { useState } from "react";

type TicketData = {
  ticketName: string;
  price: number;
  numberOfTickets: number;
};

type Stage2Props = {
  schemaTicketsData: TicketData[];
  setSchemaTicketsData: React.Dispatch<React.SetStateAction<TicketData[]>>;
  setStage: React.Dispatch<React.SetStateAction<number>>;
  handleCreateEvent: () => void
};

const NoSSRStage2: React.FC<Stage2Props> = ({ schemaTicketsData, setSchemaTicketsData, setStage, handleCreateEvent }) => {
  const [validErrors, setValidErrors] = useState<Array<{ nameError: boolean }>>([
    { nameError: false },
  ]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const ticketIndex = Number(name.split("_")[1]);
    const inputName = name.split("_")[0];

    setSchemaTicketsData((prevTickets) =>
      prevTickets.map((ticket, index) => {
        if (index === ticketIndex) {
          return {
            ...ticket,
            [inputName as string]: value,
          };
        }
        return ticket;
      })
    );
  };

  const resetErrors = () => {
    setValidErrors((prevErrors) =>
      prevErrors.map(() => {
        return { nameError: false };
      })
    );
  };

  const validateForm = () => {
    let isFormValid = true;
    const updatedErrors = schemaTicketsData.map((ticket, index) => {
      const hasError = ticket?.ticketName.trim() === "";
      if (hasError) {
        isFormValid = false;
      }
      return { nameError: hasError };
    });

    setValidErrors(updatedErrors);
    return isFormValid;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isFormValid = validateForm();

    if (isFormValid) {
      handleCreateEvent()
    }
  };

  const onAddRemoveTicket = (index: number) => {

    if(index == -1){
      const isFormValid = validateForm();

    if (isFormValid) {
      setSchemaTicketsData((prevTickets) => [
        ...prevTickets,
        {
          ticketName: "",
          price: 0,
          numberOfTickets: 0,
        },
      ]);

      setValidErrors((prevErrors) => [...prevErrors, { nameError: false }]);

      resetErrors();
    }
  }

    else{
    if (schemaTicketsData.length === 1) {
      // If there's only one ticket, prevent it from being removed
      return;
    }

    setSchemaTicketsData((prevTickets) => {
      const updatedTickets = [...prevTickets];
      updatedTickets.splice(index, 1);
      return updatedTickets;
    });

    setValidErrors((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors.splice(index, 1);
      return updatedErrors;
    });
  }
  };

  return (
    <div className="flex flex-col items-center">
      {schemaTicketsData.map((ticket, index) => (
        <form key={index} onSubmit={onSubmit} className="w-4/12">
          <div>
            <label htmlFor={`name_${index}`}>שם הכרטיס</label>
            <input
              type="text"
              id={`name_${index}`}
              name={`ticketName_${index}`}
              value={schemaTicketsData[index]?.ticketName}
              onChange={onChange}
              dir="rtl"
              className={`border ${
                validErrors[index]?.nameError ? "border-red-500" : "border-black"
              } rounded p-2 mb-2 w-11/12`}
            />
            {validErrors[index]?.nameError && (
              <span className="text-red-500">יש למלא את שם הכרטיס</span>
            )}
          </div>
          <div>
            <label htmlFor={`price_${index}`}>מחיר</label>
            <input
              type="number"
              id={`price_${index}`}
              name={`price_${index}`}
              value={ticket.price}
              onChange={onChange}
              dir="rtl"
              className="border rounded p-2 mb-2 w-11/12"
            />
          </div>
          <div>
            <label htmlFor={`numberOfTickets_${index}`}>מספר כרטיסים</label>
            <input
              type="number"
              id={`numberOfTickets_${index}`}
              name={`numberOfTickets_${index}`}
              value={ticket.numberOfTickets}
              onChange={onChange}
              dir="rtl"
              className="border rounded p-2 mb-2 w-11/12"
            />
          </div>
          {schemaTicketsData.length < 5 && (
        <button
          onClick={() => onAddRemoveTicket(-1)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          +
        </button>
      )}
              
          {index > 0 && (
            <button
              onClick={() => onAddRemoveTicket(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              -
            </button>
          )}
           <button
              onClick={onSubmit}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              קבע אירוע
            </button>
        </form>
      ))}
      <button
                onClick={() => setStage(1)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Previous Stage
      </button>
    </div>
    
  );
      
};

const Stage2 = dynamic(() => Promise.resolve(NoSSRStage2), {
  ssr: false,
})

export default Stage2