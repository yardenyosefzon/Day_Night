import { useRouter } from "next/router";
import { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

function BuyTicketPage() {
  const { query: { eventName } } = useRouter();
  const { data, isLoading } = api.events.getAll.useQuery();
  const event = data?.find((event) => event.eventName === eventName);
  const {data: sessionData} = useSession()

  const [formState, setFormState] = useState({
    birthDay: "",
    gender: "",
    phoneNumber: "",
    instaUserName: "",
    nationalId:""
  });

  const [errors, setErrors] = useState({
    birthDay: {
      value: "יש למלא את תאריך הלידה",
      valid: false
    },
    gender: {
      value: "יש לבחור מגדר",
      valid: false
    },
    phoneNumber: {
      value: "יש למלא את מספר הטלפון",
      valid: false
    },
    instaUserName: {
      value: "יש למלא את שם המשתמש באינסטגרם",
      valid: false
    },
    nationalId: {
      value: "יש למלא את שדה תעודת הזהות",
      valid: false
    }
  });
///////validates form
  const validateForm = () => {
    let isValid = true;
  
    if (formState.birthDay == "") {
      setErrors((errors) => ({
        ...errors,
        birthDay: { ...errors.birthDay, valid: true }
      }));
      isValid = false;
    }
  
    if (formState.gender == "") {
      setErrors((errors) => ({
        ...errors,
        gender: { ...errors.gender, valid: true }
      }));
      isValid = false;
    }

    if (formState.nationalId == "") {
      setErrors((errors) => ({
        ...errors,
        nationalId: { ...errors.nationalId, valid: true }
      }));
      isValid = false;
    }
  
    if (formState.phoneNumber == "") {
      setErrors((errors) => ({
        ...errors,
        phoneNumber: { ...errors.phoneNumber, valid: true }
      }));
      isValid = false;
    } else if (!/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(formState.phoneNumber)) {
      setErrors((errors) => ({
        ...errors,
        phoneNumber: {
          value: "יש למלא מספר טלפון חוקי בפורמט XXX-XXX-XXXX",
          valid: true
        }
      }));

    } 
  
    if (formState.instaUserName == "") {
      setErrors((errors) => ({
        ...errors,
        instaUserName: { ...errors.instaUserName, valid: true}
      }));
      isValid = false;
    } 

    return isValid;
  };

  const {refetch: updateRefetch} = api.users.update.useQuery({ nationalId:formState.nationalId , birthDay:formState.birthDay, gender:formState.gender, phoneNumber:formState.phoneNumber, instaUserName: formState.instaUserName }, {enabled:false})
  const {refetch: createRefetch, data :clg} = api.tickets.create.useQuery({userId: sessionData?.user.id as string, eventId: event?.id as string }, {enabled:false})

  function handleSubmit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    if (validateForm()) {
      updateRefetch()
      createRefetch()
    }
  };

  return (
    <>
      <h1>{event?.eventName} :קנה כרטיס עבור</h1>
      <form onSubmit={handleSubmit}>
        <label className="block" htmlFor="birthDay">תאריך לידה</label>
        <input
          onChange={(e) => setFormState({ ...formState, birthDay: e.currentTarget.value })}
          name="birthDay"
          className={`border-2 rounded-md text-right p-1 ${errors.birthDay.valid ? 'border-red-500' : ''}`}
          type="date"
          placeholder=""
        />
        {errors.birthDay.valid && <p className="text-red-500">{errors.birthDay.value}</p>}
  
        <label className="block" htmlFor="gender">מגדר</label>
        <select
          onChange={(e) => setFormState({ ...formState, gender: e.currentTarget.value })}
          name="gender"
          className={`border-2 rounded-md text-right p-1 ${errors.gender.valid ? 'border-red-500' : ''}`}
          defaultValue=""
        >
          <option value="" disabled hidden>מגדר</option>
          <option value="נקבה">נקבה</option>
          <option value="זכר">זכר</option>
          <option value="אחר">אחר</option>
          <option value="מעדיף לא לבחור">לא רוצה לבחור</option>
        </select>
        {errors.gender.valid && <p className="text-red-500">{errors.gender.value}</p>}
  
        <label className="block" htmlFor="phoneNumber">מספר טלפון</label>
        <input
          onChange={(e) => setFormState({ ...formState, phoneNumber: e.currentTarget.value })}
          name="phoneNumber"
          className={`border-2 rounded-md text-right p-1 ${errors.phoneNumber.valid ? 'border-red-500' : ''}`}
          type="tel"
          placeholder=""
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        />
        {errors.phoneNumber.valid && <p className="text-red-500">{errors.phoneNumber.value}</p>}
  
        <label className="block" htmlFor="instaUserName">שם משתמש באינסטגרם</label>
        <input
          onChange={(e) => setFormState({ ...formState, instaUserName: e.currentTarget.value })}
          name="instaUserName"
          className={`border-2 rounded-md text-right p-1 ${errors.instaUserName.valid ? 'border-red-500' : ''}`}
          type="text"
          placeholder="שם משתמש באינסטגרם"
        />
        {errors.instaUserName.valid && <p className="text-red-500">{errors.instaUserName.value}</p>}

        <label className="block" htmlFor="instaUserName">תעודת זהות</label>
        <input
          onChange={(e) => setFormState({ ...formState, nationalId: e.currentTarget.value })}
          name="nationalId"
          className={`border-2 rounded-md text-right p-1 ${errors.nationalId.valid ? 'border-red-500' : ''}`}
          type="text"
          placeholder="תעודת זהות"
        />
        {errors.nationalId.valid && <p className="text-red-500">{errors.nationalId.value}</p>}
  
        <button className="block" type="submit">המשך</button>
      </form>
    </>
  );
  }  

export default BuyTicketPage;

