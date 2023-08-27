import dynamic from "next/dynamic";
import React, { useState } from "react";
import { faChevronLeft, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type TicketData = {
  ticketName: string;
  price: number;
  numberOfTickets: number;
  notes: string;
};

type Stage4Props = {
  schemaTicketsData: TicketData[];
  setSchemaTicketsData: React.Dispatch<React.SetStateAction<TicketData[]>>;
  setStage: React.Dispatch<React.SetStateAction<number>>;
  handleCreateOrUpdateEvent: () => void
};

const NoSSRStage4: React.FC<Stage4Props> = ({ schemaTicketsData, setSchemaTicketsData, setStage, handleCreateOrUpdateEvent }) => {
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
            [inputName as string]: inputName?.includes('numberOfTickets') || inputName?.includes('price') ? Number(value) : value,
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
      handleCreateOrUpdateEvent()
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
          price: 80,
          numberOfTickets: 100,
          notes: ""
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
      <div className="flex w-full">
        <FontAwesomeIcon icon={faChevronLeft} onClick={() => setStage(3)} className="flex justify-start m-3"/>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col w-10/12">
        {schemaTicketsData.map((ticket, index) => (
        <div key={index} className={`${index < schemaTicketsData.length-1? `border-b-2 border-black mb-8 border-dotted` : ""} pb-6`}> 
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
          <div>
            <label htmlFor={`numberOfTickets_${index}`}>הערות לדוגמה - כרטיסים אחרונים! אופציונלי</label>
            <input
              type="string"
              id={`notes_${index}`}
              name={`notes_${index}`}
              value={ticket.notes ? ticket.notes : ""}
              onChange={onChange}
              dir="rtl"
              className="border rounded p-2 mb-2 w-11/12"
            />
          </div>  
          <div className="flex justify-center gap-5 mt-4">
          {schemaTicketsData.length !== 1 && (
            <FontAwesomeIcon icon={faMinus} onClick={() => onAddRemoveTicket(index)} className="bg-red-500 text-white font-bold p-3 rounded"/>
            )}
            {schemaTicketsData.length < 5 && index === schemaTicketsData.length-1 && (
            <FontAwesomeIcon icon={faPlus} onClick={() => onAddRemoveTicket(-1)} className="bg-orange-300 text-white font-bold p-3 rounded "/>
            )}
          </div>
        </div>
          ))}
          < button
              onClick={onSubmit}
              className="bg-orange-50 text-orange-900 text-xl font-extrabold py-2 px-4 rounded border shadow-lg"
            >
              קבע אירוע
            </button>
        </form>
    </div>
    
  );
      
};

const Stage4 = dynamic(() => Promise.resolve(NoSSRStage4), {
  ssr: false,
})

export default Stage4