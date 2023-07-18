import React, { Dispatch, SetStateAction } from 'react'

type BuyTicketsFormProps = {
  index: number;
  formState: {
    birthDay: string;
    gender: string;
    phoneNumber: string;
    instaUserName: string;
    nationalId: string;
    email: string;
    fullName: string;
}[]
  setFormState: 
  Dispatch<SetStateAction<{
    tickets: {
        birthDay: string;
        gender: string;
        phoneNumber: string;
        instaUserName: string;
        nationalId: string;
        email: string;
        fullName: string;
    }[];
}>>
validErrors: {
    birthDay: { valid: boolean };
    gender: { valid: boolean };
    phoneNumber: { valid: boolean };
    instaUserName: { valid: boolean };
    nationalId: { valid: boolean };
    email: { valid: boolean; value?: string };
    fullName: { valid: boolean };
  };
  errors:  {
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
addTicket: () => void
};

type FormChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

function BuyTicketsForm({ index, formState, setFormState, errors, validErrors, addTicket }: BuyTicketsFormProps) {
  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.currentTarget;
    setFormState((prevFormState) => {
      const updatedFormState = prevFormState.tickets.map((ticket, i) => {
        if (i === index) {
          return {
            ...ticket,
            [name]: value,
          };
        }
        return ticket;
      });
      return { tickets: updatedFormState };
    });
  };

  return (
    <>
        <label className="block" htmlFor="birthDay">
          תאריך לידה
        </label>
        <input
          onChange={(e) => {
            handleChange(e);
          }}
          name="birthDay"
          className={`border-2 rounded-md text-right p-1 ${
            !validErrors?.birthDay.valid ? 'border-red-500' : ''
          }`}
          type="date"
          placeholder=""
          value={formState[index]?.birthDay}
        />
        {!validErrors?.birthDay.valid && (
          <p className="text-red-500">{errors.birthDay.value}</p>
        )}

        <label className="block">מגדר</label>
        <select
          onChange={(e) => {
            handleChange(e);
          }}
          name="gender"
          className={`border-2 rounded-md text-right p-1 ${
            !validErrors.gender.valid ? 'border-red-500' : ''
          }`}
          value={formState[index]?.gender}
        >
          <option value="" disabled>
            מגדר
          </option>
          <option value="נקבה">נקבה</option>
          <option value="זכר">זכר</option>
          <option value="אחר">אחר</option>
          <option value="מעדיף לא לבחור">לא רוצה לבחור</option>
        </select>
        {!validErrors.gender.valid && (
          <p className="text-red-500">{errors.gender.value}</p>
        )}

        <label className="block" htmlFor="phoneNumber">
          מספר טלפון
        </label>
        <input
          onChange={(e) => {
            handleChange(e);
          }}
          name="phoneNumber"
          className={`border-2 rounded-md text-right p-1 ${
            !validErrors?.phoneNumber.valid ? 'border-red-500' : ''
          }`}
          type="tel"
          placeholder=""
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          value={formState[index]?.phoneNumber}
        />
        {!validErrors?.phoneNumber.valid && (
          <p className="text-red-500">{errors.phoneNumber.value}</p>
        )}

        <label className="block" htmlFor="instaUserName">
          שם משתמש באינסטגרם
        </label>
        <input
          onChange={(e) => {
            handleChange(e);
          }}
          name="instaUserName"
          className={`border-2 rounded-md text-right p-1 ${
            !validErrors?.instaUserName.valid ? 'border-red-500' : ''
          }`}
          type="text"
          placeholder="שם משתמש באינסטגרם"
          value={formState[index]?.instaUserName}
        />
        {!validErrors?.instaUserName.valid && (
          <p className="text-red-500">{errors.instaUserName.value}</p>
        )}

        <label className="block" htmlFor="nationalId">
          תעודת זהות
        </label>
        <input
          onChange={(e) => {
            handleChange(e);
          }}
          name="nationalId"
          className={`border-2 rounded-md text-right p-1 ${
            !validErrors?.nationalId.valid ? 'border-red-500' : ''
          }`}
          type="text"
          placeholder="תעודת זהות"
          value={formState[index]?.nationalId}
        />
        {!validErrors?.nationalId.valid && (
          <p className="text-red-500">{errors.nationalId.value}</p>
        )}

        <label className="block" htmlFor="email">
          כתובת אימייל
        </label>
        <input
          onChange={(e) => {
            handleChange(e);
          }}
          name="email"
          className={`border-2 rounded-md text-right p-1 ${
            !validErrors?.email.valid ? 'border-red-500' : ''
          }`}
          type="email"
          placeholder="כתובת אימייל"
          value={formState[index]?.email}
        />
        {!validErrors?.email.valid && (
          <p className="text-red-500">{errors.email.value}</p>
        )}

        <label className="block" htmlFor="fullName">
          שם מלא
        </label>
        <input
          onChange={(e) => {
            handleChange(e);
          }}
          name="fullName"
          className={`border-2 rounded-md text-right p-1 ${
            !validErrors?.fullName.valid ? 'border-red-500' : ''
          }`}
          type="text"
          placeholder="שם מלא"
          value={formState[index]?.fullName}
        />
        {!validErrors?.fullName.valid && (
          <p className="text-red-500">{errors.fullName.value}</p>
        )}
        {
         index < formState.length - 1 || index == 4 ?
         null
         :
        <button onClick={addTicket} className="block">
          הוסף כרטיס
        </button>  
        }
    </>
  );
}

export default BuyTicketsForm;
