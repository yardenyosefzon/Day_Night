import React, { useState } from "react";

type TicketData = {
  name: string;
  price: number;
  numberOfTickets: number;
};

type Stage2Props = {
  eventsData: any;
  setEventsData: React.Dispatch<React.SetStateAction<any>>;
  setStage: React.Dispatch<React.SetStateAction<number>>;
};

const Stage2: React.FC<Stage2Props> = ({ eventsData, setEventsData, setStage }) => {
  const [tickets, setTickets] = useState<TicketData[]>([
    {
      name: eventsData.name || "",
      price: eventsData.price || 0,
      numberOfTickets: eventsData.numberOfTickets || 0,
    },
  ]);

  const [validErrors, setValidErrors] = useState<Array<{ [key: string]: boolean }>>([
    {
      nameError: true,
      priceError: true,
      numberOfTicketsError: true,
    },
  ]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const ticketIndex = Number(name.split("_")[1]);
    const inputName = name.split("_")[0];

    setTickets((prevTickets) =>
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

    // Reset error for the modified input field
    setValidErrors((prevErrors) =>
      prevErrors.map((errors, index) => {
        if (index === ticketIndex) {
          return {
            ...errors,
            [`${inputName}Error`]: true,
          };
        }
        return errors;
      })
    );
  };

  const resetErrors = (ticketIndex: number) => {
    setValidErrors((prevErrors) =>
      prevErrors.map((errors, index) => {
        if (index === ticketIndex) {
          return {
            nameError: true,
            priceError: true,
            numberOfTicketsError: true,
          };
        }
        return errors;
      })
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isFormValid = validateForm();

    if (isFormValid) {
      // Do something with the data (e.g., save to state or API)
      setEventsData(tickets[tickets.length - 1]);
      setTickets((prevTickets) => [
        ...prevTickets,
        {
          name: "",
          price: 0,
          numberOfTickets: 0,
        },
      ]);

      resetErrors(tickets.length); // Reset errors for the newly added ticket
    }
  };

  const validateForm = () => {
    let isFormValid = true;

    const lastIndex = tickets.length - 1;
    const lastTicket = tickets[lastIndex];

    // Validate name
    if (lastTicket?.name.trim() === "") {
      setValidErrors((prevErrors) =>
        prevErrors.map((errors, index) => {
          if (index === lastIndex) {
            return {
              ...errors,
              nameError: false,
            };
          }
          return errors;
        })
      );
      isFormValid = false;
    }

    // Validate price
    if (lastTicket?.price === 0) {
      setValidErrors((prevErrors) =>
        prevErrors.map((errors, index) => {
          if (index === lastIndex) {
            return {
              ...errors,
              priceError: false,
            };
          }
          return errors;
        })
      );
      isFormValid = false;
    }

    // Validate numberOfTickets
    if (lastTicket?.numberOfTickets === 0) {
      setValidErrors((prevErrors) =>
        prevErrors.map((errors, index) => {
          if (index === lastIndex) {
            return {
              ...errors,
              numberOfTicketsError: false,
            };
          }
          return errors;
        })
      );
      isFormValid = false;
    }

    return isFormValid;
  };

  return (
    <div className="flex flex-col items-center">
      {tickets.map((ticket, index) => (
        <form key={index} onSubmit={onSubmit} className="w-4/12">
          <div>
            <label htmlFor={`name_${index}`}>שם האירוע</label>
            <input
              type="text"
              id={`name_${index}`}
              name={`name_${index}`}
              value={ticket.name}
              onChange={onChange}
              dir="rtl"
              className={`border ${validErrors[index]?.nameError ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
            />
            {!validErrors[index]?.nameError && <span className="text-red-500">יש למלא את שם האירוע</span>}
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
              className={`border ${validErrors[index]?.priceError ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
            />
            {!validErrors[index]?.priceError && <span className="text-red-500">יש למלא את המחיר</span>}
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
              className={`border ${validErrors[index]?.numberOfTicketsError ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
            />
            {!validErrors[index]?.numberOfTicketsError && <span className="text-red-500">יש למלא את מספר הכרטיסים</span>}
          </div>
          {index === tickets.length - 1 && (
            <>
              <button onClick={() => setStage(1)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-end">
                Previous Stage
              </button>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-end">
                Next Stage
              </button>
            </>
          )}
        </form>
      ))}
      <button onClick={() => {
        setTickets((prevTickets) => [
          ...prevTickets,
          {
            name: "",
            price: 0,
            numberOfTickets: 0,
          },
        ]);
        resetErrors(tickets.length); // Reset errors for the newly added ticket
      }} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
        +
      </button>
    </div>
  );
};

export default Stage2;
