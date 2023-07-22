import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import RememberMePopUp from "../components/rememberMePopUp";

function BuyTicketPage() {
  const { data: sessionData } = useSession();
  const { query: { eventName }, replace } = useRouter();
  const { data: eventsData, isLoading } = api.events.getAll.useQuery();
  const {data: usersTicketsData} = api.boughtTickets.getFirstByIdAndUsersTicket.useQuery();
  const {data: ticketsData} = api.boughtTickets.getFirstById.useQuery();
  const event = eventsData?.find((event) => event.eventName === eventName);
  const [showRememberMePopup, setShowRememberMePopup] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formState, setFormState] = useState({
    tickets: 
     [
      {
        birthDay: "",
        gender: " ",
        phoneNumber: "",
        instaUserName: "",
        nationalId: "",
        email: "",
        fullName: ""
      }
    ]
  }
  );

  const [constErrors] = useState({
    birthDay: {
      value: "יש למלא את תאריך הלידה",
    },
    gender: {
      value: "יש לבחור מגדר",
    },
    phoneNumber: {
      value: "יש למלא את מספר הטלפון",
    },
    instaUserName: {
      value: "יש למלא את שם המשתמש באינסטגרם",
    },
    nationalId: {
      value: "יש למלא את שדה תעודת הזהות",
    },
    email: {
      value: "יש למלא כתובת אימייל",
    },
    fullName: {
      value: "יש למלא שם מלא",
    },
  });
  
  const [validErrors, setValidErrors] = useState(
    [
      {
        birthDay: {
          valid: true,
        },
        gender: {
          valid: true,
        },
        phoneNumber: {
          valid: true,
        },
        instaUserName: {
          valid: true,
        },
        nationalId: {
          valid: true,
        },
        email: {
          valid: true,
        },
        fullName: {
          valid: true,
        }
      }
    ]
  )
  
  const { refetch: createRefetch } = api.boughtTickets.create.useQuery({ userId: sessionData?.user.id as string, eventName: event?.eventName as string, usersTicket: rememberMe, ticketsArray: formState.tickets}, {enabled: false});

  const { refetch: userRefetch } = api.users.updateRememberProp.useQuery({rememberMe: rememberMe}, {enabled: false})

  const validateForm = () => {
    let isValid = true;
  
    for (let i = 0; i < formState.tickets.length; i++) {
      if (formState.tickets[i]?.birthDay === "") {
        setValidErrors((validErrors) => {
          const updatedErrors = [...validErrors];
          updatedErrors[i] = {
            ...(updatedErrors[i] as {
              birthDay: { valid: boolean };
              gender: { valid: boolean };
              phoneNumber: { valid: boolean };
              instaUserName: { valid: boolean };
              nationalId: { valid: boolean };
              email: { valid: boolean };
              fullName: { valid: boolean };
            }),
            birthDay: { valid: false },
          };
          return updatedErrors;
        });
        isValid = false;
      }
  
      if (formState.tickets[i]?.gender === "") {
        setValidErrors((validErrors) => {
          const updatedErrors = [...validErrors];
          updatedErrors[i] = {
            ...(updatedErrors[i] as {
              birthDay: { valid: boolean };
              gender: { valid: boolean };
              phoneNumber: { valid: boolean };
              instaUserName: { valid: boolean };
              nationalId: { valid: boolean };
              email: { valid: boolean };
              fullName: { valid: boolean };
            }),
            gender: { valid: false },
          };
          return updatedErrors;
        });
        isValid = false;
      }
  
      if (formState.tickets[i]?.nationalId === "") {
        setValidErrors((validErrors) => {
          const updatedErrors = [...validErrors];
          updatedErrors[i] = {
            ...(updatedErrors[i] as {
              birthDay: { valid: boolean };
              gender: { valid: boolean };
              phoneNumber: { valid: boolean };
              instaUserName: { valid: boolean };
              nationalId: { valid: boolean };
              email: { valid: boolean };
              fullName: { valid: boolean };
            }),
            nationalId: { valid: false },
          };
          return updatedErrors;
        });
        isValid = false;
      }
  
      if (formState.tickets[i]?.phoneNumber === "") {
        setValidErrors((validErrors) => {
          const updatedErrors = [...validErrors];
          updatedErrors[i] = {
            ...(updatedErrors[i] as {
              birthDay: { valid: boolean };
              gender: { valid: boolean };
              phoneNumber: { valid: boolean };
              instaUserName: { valid: boolean };
              nationalId: { valid: boolean };
              email: { valid: boolean };
              fullName: { valid: boolean };
            }),
            phoneNumber: { valid: false },
          };
          return updatedErrors;
        });
        isValid = false;
      } else if (
        !/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(formState.tickets[i]?.phoneNumber as string)
      ) {
        setValidErrors((validErrors) => {
          const updatedErrors = [...validErrors];
          updatedErrors[i] = {
            ...(updatedErrors[i] as {
              birthDay: { valid: boolean };
              gender: { valid: boolean };
              phoneNumber: { valid: boolean };
              instaUserName: { valid: boolean };
              nationalId: { valid: boolean };
              email: { valid: boolean };
              fullName: { valid: boolean };
            }),
            phoneNumber: {
              valid: false,
            },
          };
          return updatedErrors;
        });
        isValid = false;
      }
  
      if (formState.tickets[i]?.instaUserName === "") {
        setValidErrors((validErrors) => {
          const updatedErrors = [...validErrors];
          updatedErrors[i] = {
            ...(updatedErrors[i] as {
              birthDay: { valid: boolean };
              gender: { valid: boolean };
              phoneNumber: { valid: boolean };
              instaUserName: { valid: boolean };
              nationalId: { valid: boolean };
              email: { valid: boolean };
              fullName: { valid: boolean };
            }),
            instaUserName: { valid: false },
          };
          return updatedErrors;
        });
        isValid = false;
      }
  
      if (formState.tickets[i]?.email === "") {
        setValidErrors((validErrors) => {
          const updatedErrors = [...validErrors];
          updatedErrors[i] = {
            ...(updatedErrors[i] as {
              birthDay: { valid: boolean };
              gender: { valid: boolean };
              phoneNumber: { valid: boolean };
              instaUserName: { valid: boolean };
              nationalId: { valid: boolean };
              email: { valid: boolean };
              fullName: { valid: boolean };
            }),
            email: { valid: false },
          };
          return updatedErrors;
        });
        isValid = false;
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
          formState.tickets[i]?.email as string
        )
      ) {
        setValidErrors((validErrors) => {
          const updatedErrors = [...validErrors];
          updatedErrors[i] = {
            ...(updatedErrors[i] as {
              birthDay: { valid: boolean };
              gender: { valid: boolean };
              phoneNumber: { valid: boolean };
              instaUserName: { valid: boolean };
              nationalId: { valid: boolean };
              email: { valid: boolean };
              fullName: { valid: boolean };
            }),
            email: {
              valid: false,
            },
          };
          return updatedErrors;
        });
        isValid = false;
      }
  
      if (formState.tickets[i]?.fullName === "") {
        setValidErrors((validErrors) => {
          const updatedErrors = [...validErrors];
          updatedErrors[i] = {
            ...(updatedErrors[i] as {
              birthDay: { valid: boolean };
              gender: { valid: boolean };
              phoneNumber: { valid: boolean };
              instaUserName: { valid: boolean };
              nationalId: { valid: boolean };
              email: { valid: boolean };
              fullName: { valid: boolean };
            }),
            fullName: { valid: false },
          };
          return updatedErrors;
        });
        isValid = false;
      }
    }
  
    return isValid;
  };

  const resetValidation = () => {
  setValidErrors(validErrors => {
    const changedState = [];
    for(let i = 0; i < validErrors.length; i++){
      changedState.push({
        birthDay: {
          valid: true,
        },
        gender: {
          valid: true,
        },
        phoneNumber: {
          valid: true,
        },
        instaUserName: {
          valid: true,
        },
        nationalId: {
          valid: true,
        },
        email: {
          valid: true,
        },
        fullName: {
          valid: true,
        }
      })
    }
    return changedState;
  })
  }

  const addTicket = () => {
    setFormState(formState => {
      const changedState = [...formState.tickets]
      changedState.push({
        birthDay: "",
        gender: "",
        phoneNumber: "",
        instaUserName: "",
        nationalId: "",
        email: "",
        fullName: ""
      })
      return {tickets: changedState}
    })
    setValidErrors(validErrors => {
      const changedState = [...validErrors]
      changedState.push(
        {
          birthDay: {
            valid: true,
          },
          gender: {
            valid: true,
          },
          phoneNumber: {
            valid: true,
          },
          instaUserName: {
            valid: true,
          },
          nationalId: {
            valid: true,
          },
          email: {
            valid: true,
          },
          fullName: {
            valid: true,
          }
        }
     )
      return changedState
    })
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    resetValidation()
    e.preventDefault();
    if (validateForm()) {
      createRefetch()
      .then(()=>{'created'})
      .catch((error)=>{
        return error
      });
      if(rememberMe)
      userRefetch()
      .then(()=>{'updated'})
      .catch((error)=>{
        return error
      });;
      replace('/')
    }
  }

    function handleRememberMeSubmit(rememberMe: boolean) {
    setRememberMe(rememberMe);
    setShowRememberMePopup(false);
  };

  const handleChange = (e:FormEvent<HTMLFormElement> | ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>, index: number) => {
    const { name, value } = e.currentTarget;
    setFormState((prevFormState) => {
      const updatedFormState = prevFormState.tickets.map((ticket, i) => {
        if (i === index ) {
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


  useEffect(() => {

    if (sessionData) {
      const { email, name } = sessionData.user;

      if(sessionData.user.rememberMe){
      setFormState(formState => 
          {
            const changedState = [...formState.tickets] 
            changedState[0] = {
              email: email || "",
              fullName: name || "",
              nationalId: "XXXXXXXXX",
              birthDay: usersTicketsData?.birthDay as string,
              gender: usersTicketsData?.gender as string,
              phoneNumber: usersTicketsData?.phoneNumber as string,
              instaUserName: usersTicketsData?.instaUserName as string
            }
            return {tickets: changedState}
        })
    }
      else{

        if(ticketsData) setShowRememberMePopup(false)
        else if(ticketsData === null) setShowRememberMePopup(true)
        setFormState(formState => 
          {
            const changedState = [...formState.tickets] 
            changedState[0] = {
              email: email || "",
              fullName: name || "",
              nationalId: "",
              birthDay: "",
              gender: "",
              phoneNumber:"",
              instaUserName:""
            }
            return {tickets: changedState}
        })
    }
  }
  }, [ticketsData, rememberMe]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <form onSubmit={(e)=>handleSubmit(e)}>
        <h1>{event?.eventName} :קנה כרטיס עבור</h1>
        {formState.tickets.map((form, index) => {
          return<>
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
          {!validErrors[index]?.birthDay.valid && (
            <p className="text-red-500">{constErrors.birthDay.value}</p>
          )}
  
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
            <option value="" disabled>
              מגדר
            </option>
            <option value="נקבה">נקבה</option>
            <option value="זכר">זכר</option>
            <option value="אחר">אחר</option>
            <option value="מעדיף לא לבחור">לא רוצה לבחור</option>
          </select>
          {!validErrors[index]?.gender.valid && (
            <p className="text-red-500">{constErrors.gender.value}</p>
          )}
  
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
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            value={formState.tickets[index]?.phoneNumber}
          />
          {!validErrors[index]?.phoneNumber.valid && (
            <p className="text-red-500">{constErrors.phoneNumber.value}</p>
          )}
  
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
          {!validErrors[index]?.instaUserName.valid && (
            <p className="text-red-500">{constErrors.instaUserName.value}</p>
          )}
  
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
          {!validErrors[index]?.nationalId.valid && (
            <p className="text-red-500">{constErrors.nationalId.value}</p>
          )}
  
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
          {!validErrors[index]?.email.valid && (
            <p className="text-red-500">{constErrors.email.value}</p>
          )}
  
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
          {!validErrors[index]?.fullName.valid && (
            <p className="text-red-500">{constErrors.fullName.value}</p>
          )}
          {
           index < formState.tickets.length - 1 || index == 4 ?
           null
           :
          <button onClick={addTicket} className="block">
            הוסף כרטיס
          </button>  
          }
      </>
        })}
        <button type="submit">לרכישה</button>
        {
          showRememberMePopup ? (
          <RememberMePopUp onSubmit={handleRememberMeSubmit} rememberMe={rememberMe} setRememberMe={setRememberMe}/>
          )
    :
          <></>
        }
      </form>  
    </>
  );
}

export default BuyTicketPage;