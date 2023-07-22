import React, { useEffect, useState } from "react";
import type { EventData } from "~/pages/createEvents";

type Stage1Props = {
  eventsData: EventData
  setEventsData: React.Dispatch<React.SetStateAction<any>>;
  setStage: React.Dispatch<React.SetStateAction<number>>;
};
type ValidErrors = {
  eventNameError: { message: string; valid: boolean };
  dateError: { message: string; valid: boolean };
  artistError: { message: string; valid: boolean };
  imageError: { message: string; valid: boolean };
  descriptionError: { message: string; valid: boolean };
  minAgeError: { message: string; valid: boolean };
  addressError: { message: string; valid: boolean };
};

const Stage1: React.FC<Stage1Props> = ({ eventsData, setEventsData, setStage }) => {
  
  const [validErrors, setValidErrors] = useState({
    eventNameError: {
      message: "יש למלא את שם האירוע",
      valid: true,
    },
    dateError: {
      message: "יש למלא תאריך",
      valid: true,
    },
    artistError: {
      message: "יש למלא את שם האומן/האמן",
      valid: true,
    },
    imageError: {
      message: "יש למלא את הקישור לתמונה",
      valid: true,
    },
    descriptionError: {
      message: "יש למלא תיאור לאירוע",
      valid: true,
    },
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
      [name]: value,
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

    // Validate artist
    if (eventsData.artist.trim() === "") {
      setValidErrors((prevErrors) => ({
        ...prevErrors,
        artistError: {
          ...prevErrors.artistError,
          valid: false,
        },
      }));
      isFormValid = false;
    }

    // Validate image
    if (eventsData.image.trim() === "") {
      setValidErrors((prevErrors) => ({
        ...prevErrors,
        imageError: {
          ...prevErrors.imageError,
          valid: false,
        },
      }));
      isFormValid = false;
    }

    // Validate description
    if (eventsData.description.trim() === "") {
      setValidErrors((prevErrors) => ({
        ...prevErrors,
        descriptionError: {
          ...prevErrors.descriptionError,
          valid: false,
        },
      }));
      isFormValid = false;
    }

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

  useEffect(() => {
    
    setEventsData(
      {
        eventName: "",
        date: "",
        artist: "",
        image: "",
        description: "",
        minAge: 0,
        address: ""
      }
    )
      
    }, [])

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={onSubmit} className="w-4/12">
        <div>
          <label htmlFor="eventName">שם האירוע</label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={eventsData.eventName}
            onChange={onChange}
            dir="rtl"
            className={`border ${validErrors.eventNameError.valid ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
          />
          {!validErrors.eventNameError.valid && <span className="text-red-500">{validErrors.eventNameError.message}</span>}
        </div>
        <div>
          <label htmlFor="date">תאריך</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={eventsData.date}
            onChange={onChange}
            dir="rtl"
            className={`border ${validErrors.dateError.valid ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
          />
          {!validErrors.dateError.valid && <span className="text-red-500">{validErrors.dateError.message}</span>}
        </div>
        <div>
          <label htmlFor="artist">שם האומן/האמן</label>
          <input
            type="text"
            id="artist"
            name="artist"
            value={eventsData.artist}
            onChange={onChange}
            dir="rtl"
            className={`border ${validErrors.artistError.valid ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
          />
          {!validErrors.artistError.valid && <span className="text-red-500">{validErrors.artistError.message}</span>}
        </div>
        <div>
          <label htmlFor="image">קישור לתמונה</label>
          <input
            type="text"
            id="image"
            name="image"
            value={eventsData.image}
            onChange={onChange}
            dir="rtl"
            className={`border ${validErrors.imageError.valid ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
          />
          {!validErrors.imageError.valid && <span className="text-red-500">{validErrors.imageError.message}</span>}
        </div>
        <div>
          <label htmlFor="description">תיאור האירוע</label>
          <textarea
            id="description"
            name="description"
            value={eventsData.description}
            onChange={onChange}
            dir="rtl"
            className={`border ${validErrors.descriptionError.valid ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
          />
          {!validErrors.descriptionError.valid && <span className="text-red-500">{validErrors.descriptionError.message}</span>}
        </div>
        <div>
          <label htmlFor="minAge">גיל מינימלי</label>
          <input
            type="number"
            id="minAge"
            name="minAge"
            value={eventsData.minAge}
            onChange={onChange}
            dir="rtl"
            className={`border ${validErrors.minAgeError.valid ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
          />
          {!validErrors.minAgeError.valid && <span className="text-red-500">{validErrors.minAgeError.message}</span>}
        </div>
        <div>
          <label htmlFor="address">כתובת האירוע</label>
          <input
            type="text"
            id="address"
            name="address"
            value={eventsData.address}
            onChange={onChange}
            dir="rtl"
            className={`border ${validErrors.addressError.valid ? "border-black" : "border-red-500"} rounded p-2 mb-2 w-11/12`}
          />
          {!validErrors.addressError.valid && <span className="text-red-500">{validErrors.addressError.message}</span>}
        </div>
      <button onClick={onSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-end ">
        Next Stage
      </button>
      </form>
    </div>
  );
};

export default Stage1;
