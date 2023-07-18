import { useRouter } from "next/router";
import { FormEvent, useState, useEffect } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import RememberMePopUp from "../components/rememberMePopUp";
import BuyTicketsForm from "../components/buyTicketsForm";

function BuyTicketPage() {
  const { data: sessionData } = useSession();
  const { query: { eventName }, replace } = useRouter();
  const { data: eventsData, isLoading } = api.events.getAll.useQuery();
  const {data: usersTicketsData} = api.tickets.getFirstByIdAndUsersTicket.useQuery();
  let   {data: ticketsData} = api.tickets.getFirstById.useQuery();
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

  const [constErrors, setConstErrors] = useState({
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
  
  const { refetch: createRefetch } = api.tickets.create.useQuery({ userId: sessionData?.user.id as string, eventName: event?.eventName as string, usersTicket: rememberMe, ticketsArray: formState.tickets}, {enabled: false});

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
    let changedState = [];
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
      createRefetch();
      if(rememberMe)
      userRefetch();
      replace('/')
    }
  }

    function handleRememberMeSubmit(rememberMe: boolean) {
    setRememberMe(rememberMe);
    setShowRememberMePopup(false);
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
console.log(formState, validErrors)
  return (
    <>
      <form onSubmit={(e)=>handleSubmit(e)}>
        <h1>{event?.eventName} :קנה כרטיס עבור</h1>
        {formState.tickets.map((form, index) => {
          return <BuyTicketsForm index={index} formState={formState.tickets} setFormState={setFormState} validErrors={validErrors[index]!} errors={constErrors} addTicket={addTicket}/>
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