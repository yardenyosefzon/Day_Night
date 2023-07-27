import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import RememberMePopUp from "../components/rememberMePopUp";
import BuyTicketsDetailsForm from "../components/forms/buy ticket form/detailsForm";

function BuyTicketPage() {
  const { data: sessionData, update } = useSession();
  const { query: { eventName, ticketKind }, replace } = useRouter();
  const { data: eventsData, isLoading } = api.events.getAll.useQuery(undefined, {refetchOnMount: false, refetchOnWindowFocus: false});
  const {data: usersTicketsData} = api.boughtTickets.getFirstByIdAndUsersTicket.useQuery(undefined, {refetchOnMount: false, refetchOnWindowFocus: false});
  const {data: ticketsData} = api.boughtTickets.getFirstById.useQuery(undefined, {refetchOnMount: false, refetchOnWindowFocus: false});
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
  
  const { mutateAsync: createTickets } = api.boughtTickets.create.useMutation();

  const { mutateAsync: userRememberMeUpdate } = api.users.updateRememberProp.useMutation()

  const {mutate: changeNumberOfTickets} = api.schemaTickets.changeNumberOfTicketsOfOneByEventAndTicketName.useMutation()

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
        !/^[0-9]{10}/.test(formState.tickets[i]?.phoneNumber as string)
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

  const handleDeleteTicket = (index: number) => {
    setFormState((prevFormState) => {
      const updatedTickets = prevFormState.tickets.filter((_, i) => i !== index);
      return { tickets: updatedTickets };
    });
    setValidErrors((prevFormState) => {
      const updatedValidErrors = prevFormState.filter((_, i) => i !== index);
      return  updatedValidErrors ;
    });
  };

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
      createTickets({ userId: sessionData?.user.id as string, eventName: event?.eventName as string, usersTicket: rememberMe, ticketsArray: formState.tickets, ticketKind: ticketKind as string})
      .then(()=>{changeNumberOfTickets({ticketName: ticketKind as string, eventName: event?.eventName as string})})
      .catch((error)=>{
        return error
      });
      if(rememberMe)
      userRememberMeUpdate({rememberMe: rememberMe})
      .then(()=>{
        update()
        replace('/')})
      .catch((error)=>{
        return error
      });
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
              nationalId: `XXXXXX${usersTicketsData?.partialNationalId}`,
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
        {formState.tickets.map((_, index) => 
          <BuyTicketsDetailsForm  key={index} formState={formState} constErrors={constErrors} validErrors={validErrors} handleChange={handleChange} index={index} handleDeleteTicket={handleDeleteTicket}/>
        )}
        <button type="submit">לרכישה</button>
      </form>
        {
          formState.tickets.length == 5 ?
         null
         :
         <button onClick={addTicket}>
         הוסף כרטיס
       </button>  
        }
      
      {showRememberMePopup ? (
        <RememberMePopUp
          onSubmit={handleRememberMeSubmit}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default BuyTicketPage;