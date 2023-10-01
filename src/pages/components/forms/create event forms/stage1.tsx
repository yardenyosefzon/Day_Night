import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import type { EventData } from "~/pages/createAndModifyEvents";

type Stage1Props = {
  eventsData: EventData
  setEventsData: React.Dispatch<React.SetStateAction<any>>;
  setStage: React.Dispatch<React.SetStateAction<number>>;
};

type ValidErrors = {
  eventNameError: { message: string; valid: boolean };
  dateError: { message: string; valid: boolean };
  // artistError: { message: string; valid: boolean };
  minAgeError: { message: string; valid: boolean };
  addressError: { message: string; valid: boolean };
};

const NoSSRStage1: React.FC<Stage1Props> = ({ eventsData, setEventsData, setStage }) => {
  
  const [validErrors, setValidErrors] = useState({
    eventNameError: {
      message: "יש למלא את שם האירוע",
      valid: true,
    },
    dateError: {
      message: "יש למלא תאריך",
      valid: true,
    },
    // artistError: {
    //   message: "יש למלא את שם האומן/האמן",
    //   valid: true,
    // },
    minAgeError: {
      message: "יש להזין גיל מינימלי",
      valid: true,
    },
    addressError: {
      message: "יש למלא כתובת לאירוע",
      valid: true,
    },
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setEventsData((eventsData: EventData) => ({
      ...eventsData,
      [name]: name !== 'minAge' ? value : Number(value),
    }));
  };

  const validateForm = () => {
    let isFormValid = true;

    // Validate eventName
    if (eventsData.eventName.trim() === "") {
      setValidErrors((prevErrors) => ({
        ...prevErrors,
        eventNameError: {
          ...prevErrors.eventNameError,
          valid: false,
        },
      }));
      isFormValid = false;
    }

    // Validate date
    if (eventsData.date.trim() === "") {
      setValidErrors((prevErrors) => ({
        ...prevErrors,
        dateError: {
          ...prevErrors.dateError,
          valid: false,
        },
      }));
      isFormValid = false;
    }

    // // Validate artist
    // if (eventsData.artist.trim() === "") {
    //   setValidErrors((prevErrors) => ({
    //     ...prevErrors,
    //     artistError: {
    //       ...prevErrors.artistError,
    //       valid: false,
    //     },
    //   }));
    //   isFormValid = false;
    // }

    // Validate minAge
    if (eventsData.minAge === 0) {
      setValidErrors((prevErrors) => ({
        ...prevErrors,
        minAgeError: {
          ...prevErrors.minAgeError,
          valid: false,
        },
      }));
      isFormValid = false;
    }

    // Validate address
    if (eventsData.address.trim() === "") {
      setValidErrors((prevErrors) => ({
        ...prevErrors,
        addressError: {
          ...prevErrors.addressError,
          valid: false,
        },
      }));
      isFormValid = false;
    }

    return isFormValid;
  };

  const resetValidation = () => {
    setValidErrors((prevValidErrors: ValidErrors) => {
      // Create a copy of the previous state to avoid mutating it directly
      let tempArg: ValidErrors = { ...prevValidErrors };
  
      // Update the 'valid' property of each error to true
      for (const key of Object.keys(tempArg)) {
        tempArg[key as keyof ValidErrors].valid = true;
      }
  
      // Return the new state
      return tempArg;
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetValidation()
    const isFormValid = validateForm();

    if (isFormValid) {
      // Do something with the data (e.g., save to state or API)
      setEventsData(eventsData);
      setStage(2);
    }
  };

  return (
    <div className="flex flex-col items-center h-full">
      <form className="flex flex-col justify-center w-5/6 h-full" onSubmit={onSubmit}>
        <div className="flex flex-col items-center">
          <label htmlFor="eventName">שם האירוע</label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={eventsData.eventName || ""}
            onChange={onChange}
            dir="rtl"
            className={`border ${validErrors.eventNameError.valid ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
          />
          {/* {!validErrors.eventNameError.valid && <span className="text-red-500">{validErrors.eventNameError.message}</span>} */}
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="date">תאריך</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={eventsData.date || ""}
            onChange={onChange}
            dir="rtl"
            className={`border ${validErrors.dateError.valid ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
          />
          {/* {!validErrors.dateError.valid && <span className="text-red-500">{validErrors.dateError.message}</span>} */}
        </div>
        {/* <div className="flex flex-col items-center">
          <label htmlFor="artist">שם האומן/האמן</label>
          <input
            type="text"
            id="artist"
            name="artist"
            value={eventsData.artist || ""}
            onChange={onChange}
            dir="rtl"
            className={`border ${validErrors.artistError.valid ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
          /> */}
          {/* {!validErrors.artistError.valid && <span className="text-red-500">{validErrors.artistError.message}</span>} */}
        {/* </div> */}
        <div className="flex flex-col items-center">
          <label htmlFor="minAge">גיל מינימלי</label>
          <input
            type="number"
            id="minAge"
            name="minAge"
            value={eventsData.minAge || ""}
            onChange={onChange}
            dir="rtl"
            className={`border ${validErrors.minAgeError.valid ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
          />
          {/* {!validErrors.minAgeError.valid && <span className="text-red-500">{validErrors.minAgeError.message}</span>} */}
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="address">כתובת האירוע</label>
          <input
            type="text"
            id="address"
            name="address"
            value={eventsData.address || ""}
            onChange={onChange}
            dir="rtl"
            className={`border ${validErrors.addressError.valid ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
          />
          {/* {!validErrors.addressError.valid && <span className="text-red-500">{validErrors.addressError.message}</span>} */}
        </div>
        
      <button onClick={onSubmit} className="text-emerald-950 font-bold rounded mt-4">
        השלב הבא
      </button>

      </form>
    </div>
  );
};

const Stage1 = dynamic(() => Promise.resolve(NoSSRStage1), {
  ssr: false,
})
export default Stage1;
