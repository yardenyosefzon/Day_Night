import dynamic from 'next/dynamic';
import React, { ChangeEvent, FormEvent, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faPersonCircleMinus } from '@fortawesome/free-solid-svg-icons';


interface FormState {
        tickets: {
            birthDay: string;
            gender: string;
            phoneNumber: string;
            instaUserName: string;
            nationalId: string;
            email: string;
            fullName: string;
        }[];
    }
  
  interface ValidErrors {
    birthDay: {
        valid: boolean;
    };
    gender: {
        valid: boolean;
    };
    phoneNumber: {
        valid: boolean;
    };
    instaUserName: {
        valid: boolean;
    };
    nationalId: {
        valid: boolean;
    };
    email: {
        valid: boolean;
    };
    fullName: {
        valid: boolean;
    };
}[]
  
  interface ConstErrors {
    birthDay: {
        value: string;
    };
    gender: {
        value: string;
    };
    phoneNumber: {
        value: string;
    };
    instaUserName: {
        value: string;
    };
    nationalId: {
        value: string;
    };
    email: {
        value: string;
    };
    fullName: {
        value: string;
    };
}
  
  interface BuyTicketsDetailsFormProps {
    handleChange: (e: FormEvent<HTMLFormElement> | ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>, index: number) => void
    handleDeleteTicket: (index: number) => void,
    addTicket: () => void,
    formState: FormState;
    validErrors: ValidErrors[];
    constErrors: ConstErrors;
    index: number;
  }

  function NoSSRBuyTicketsDetailsForm({
    handleChange,
    formState,
    validErrors,
    addTicket,
    index,
    handleDeleteTicket
  }: BuyTicketsDetailsFormProps) {
    
  return (
    <>
    <div className={`relative flex flex-col border-black w-4/5 justify-between gap-2 p-6 pt-3 rounded-lg shadow shadow-black my-3 bg-white opacity-95 sm:w-2/5`}>
    <div className='absolute t-0 l-0'>
        {
          formState.tickets.length == 5 || index < formState.tickets.length-1 ?
          <FontAwesomeIcon icon={faPersonCircleMinus} className='text-3xl text-yellow-600' onClick={() => handleDeleteTicket(index)}></FontAwesomeIcon>
         :
         <FontAwesomeIcon icon={faPersonCirclePlus} className='text-3xl text-yellow-600' onClick={() => addTicket()}></FontAwesomeIcon> 
        }
       
      </div>
        <div className={`flex flex-col justify-center mt-5`}>
          <label className="block" htmlFor="fullName">
            שם מלא
          </label>
          <input
            onChange={(e) => {
              handleChange(e, index);
            }}
            name="fullName"
            className={`border-2 rounded-md text-right p-1 ${
              !validErrors[index]?.fullName.valid ? 'border-red-500' : ''
            }`}
            type="text"
            placeholder="שם מלא"
            value={formState.tickets[index]?.fullName}
          />
          {/* {!validErrors[index]?.fullName.valid && (
            <p className="text-red-500">{constErrors.fullName.value}</p>
          )} */}
        </div>
        <div className={`flex flex-col justify-center`}>
                <label className="block" htmlFor="email">
                  כתובת אימייל
                </label>
                <input
                  onChange={(e) => {
                    handleChange(e, index);
                  }}
                  name="email"
                  className={`border-2 rounded-md text-right p-1 ${
                    !validErrors[index]?.email.valid ? 'border-red-500' : ''
                  }`}
                  type="email"
                  placeholder="כתובת אימייל"
                  value={formState.tickets[index]?.email}
                />
                {/* {!validErrors[index]?.email.valid && (
                  <p className="text-red-500">{constErrors.email.value}</p>
                )} */}
        </div>
      <div className={`flex flex-col justify-center`}>
        <label className="block" htmlFor="birthDay">
          תאריך לידה
        </label>
        <input
          onChange={(e) => {
            handleChange(e, index);
          }}
          name="birthDay"
          className={`border-2 rounded-md text-right p-1 ${
            !validErrors[index]?.birthDay.valid ? 'border-red-500' : ''
          }`}
          type="date"
          placeholder=""
          value={formState.tickets[index]?.birthDay}
        />
        {/* {!validErrors[index]?.birthDay.valid && (
          <p className="text-red-500">{constErrors.birthDay.value}</p>
        )} */}
      </div>
      <div className={`flex flex-col justify-center`}>
        <label className="block">מגדר</label>
        <select
          onChange={(e) => {
            handleChange(e, index);
          }}
          name="gender"
          className={`border-2 rounded-md text-right p-1 ${
            !validErrors[index]?.gender.valid ? 'border-red-500' : ''
          }`}
          value={formState.tickets[index]?.gender}
        >
          <option hidden>
            מגדר
          </option>
          <option dir='rtl' value="נקבה">נקבה</option>
          <option dir='rtl' value="זכר">זכר</option>
          <option dir='rtl' value="אחר">אחר</option>
        </select>
        {/* {!validErrors[index]?.gender.valid && (
          <p className="text-red-500">{constErrors.gender.value}</p>
        )} */}
      </div>
      <div className={`flex flex-col justify-center`}>
        <label className="block" htmlFor="phoneNumber">
          מספר טלפון
        </label>
        <input
          onChange={(e) => {
            handleChange(e, index);
          }}
          name="phoneNumber"
          className={`border-2 rounded-md text-right p-1 ${
            !validErrors[index]?.phoneNumber.valid ? 'border-red-500' : ''
          }`}
          type="tel"
          placeholder=""
          pattern="[0-9]{10}"
          value={formState.tickets[index]?.phoneNumber}
        />
        {/* {!validErrors[index]?.phoneNumber.valid && (
          <p className="text-red-500">{constErrors.phoneNumber.value}</p>
        )} */}
        </div>
        <div className={`flex flex-col justify-center`}>
                <label className="block" htmlFor="instaUserName">
                  שם משתמש באינסטגרם
                </label>
                <input
                  onChange={(e) => {
                    handleChange(e, index);
                  }}
                  name="instaUserName"
                  className={`border-2 rounded-md text-right p-1 ${
                    !validErrors[index]?.instaUserName.valid ? 'border-red-500' : ''
                  }`}
                  type="text"
                  placeholder="שם משתמש באינסטגרם"
                  value={formState.tickets[index]?.instaUserName}
                />
                {/* {!validErrors[index]?.instaUserName.valid && (
                  <p className="text-red-500">{constErrors.instaUserName.value}</p>
                )} */}
        </div>
        <div className={`flex flex-col justify-center`}>
                <label className="block" htmlFor="nationalId">
                  תעודת זהות
                </label>
                <input
                  onChange={(e) => {
                    handleChange(e, index);
                  }}
                  name="nationalId"
                  className={`border-2 rounded-md text-right p-1 ${
                    !validErrors[index]?.nationalId.valid ? 'border-red-500' : ''
                  }`}
                  type="text"
                  placeholder="תעודת זהות"
                  value={formState.tickets[index]?.nationalId}
                />
                {/* {!validErrors[index]?.nationalId.valid && (
                  <p className="text-red-500">{constErrors.nationalId.value}</p>
                )} */}
        </div>
      </div>
    </>
  );
}

const BuyTicketsDetailsForm = dynamic(() => Promise.resolve(NoSSRBuyTicketsDetailsForm), {
  ssr: false,
})

export default BuyTicketsDetailsForm;
