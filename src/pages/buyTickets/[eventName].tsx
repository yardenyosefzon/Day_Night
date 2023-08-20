import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import RememberMePopUp from "../components/popUps/rememberMePopUp";
import BuyTicketsDetailsForm from "../components/forms/buy ticket form/detailsForm";
import { Noto_Sans_Hebrew } from 'next/font/google';
import AgeErrorPopup from "../components/popUps/ageErrorPopUp";

const noto = Noto_Sans_Hebrew({subsets: ["hebrew"], weight:"400"})

function BuyTicketPage() {
  const { data: sessionData, update } = useSession();
  const { query: { eventName, ticketKind }, replace } = useRouter();
  const { data: eventsData, isLoading } = api.events.getAll.useQuery();
  const {data: usersTicketsData} = api.boughtTickets.getFirstByIdAndUsersTicket.useQuery(undefined, {refetchOnWindowFocus: false});
  const {data: ticketsData} = api.boughtTickets.getFirstById.useQuery(undefined, {refetchOnWindowFocus: false});
  const event = eventsData?.find((event) => event.eventName === eventName);
 
  const [showRememberMePopup, setShowRememberMePopup] = useState(false);
  const [showAgeErrorPopUp, setShowAgeErrorPopUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formState, setFormState] = useState({
    tickets: 
     [
      {
        birthDay: "",
        gender: "",
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
  
  const { mutateAsync: createBoughtTickets } = api.boughtTickets.create.useMutation();

  const { mutateAsync: userRememberMeUpdate } = api.users.updateRememberProp.useMutation()

  const {mutate: changeNumberOfBoughtTickets} = api.schemaTickets.changeNumberOfBoughtTicketsOfOneByEventAndTicketName.useMutation()

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
      fetch(`https://restapidev.payplus.co.il/api/v1.0/PaymentPages/generateLink`, 
      {
        //@ts-ignore
        headers: {
          'content-type': 'application/json',
          'Authorization': {"api_key":process.env.NEXT_PUBLIC_PAYPLUS_KEY,"secret_key":process.env.NEXT_PUBLIC_PAYPLUS_SECRET}
        },
        body: JSON.stringify({
          payment_page_uid: process.env.NEXT_PUBLIC_PAYPLUS_UID,
          expiry_datetime: "30",
          more_info: "test1554423",
          customer: {
            customer_name:"David Levi",
            email:"david@gmail.com",
            phone:"0509111111",
            vat_number: "036534683"
          },
          amount: 30
          })
    }
      )
      .then((res) => res.json())
      .then((res) => console.log(res))
    //   let emailArray: Array<string>
    //   emailArray = formState.tickets.map((ticket) => (
    //      ticket.email
    // ))
    //   createBoughtTickets({ userId: sessionData? sessionData?.user.id as string : '' , eventName: event?.eventName as string, eventMinAge: event?.minAge as number, usersTicket: rememberMe, ticketsArray: formState.tickets, ticketKind: ticketKind as string})
    //   .then(() => {
    //     changeNumberOfBoughtTickets({ticketName: ticketKind as string, eventName: event?.eventName as string})
    //     if(rememberMe)
    //     userRememberMeUpdate({rememberMe: rememberMe})
    //     .then(()=>{
    //       update()})
    //     .catch((error)=>{
    //       return error
    //     });
    //     replace('/')
    //     fetch('api/email/bought', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({userName: sessionData?.user.name, usersEmails: emailArray, eventName: eventName})
    //     })
    //       .then(response => {
    //         if (!response.ok) {
    //           throw new Error('Network response was not ok');
    //         }
    //       })
    //   })
    //   .catch((error)=>{
    //     if(error.message.includes('Error: You are too young'))
    //     setShowAgeErrorPopUp(() => true)
    //   });
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
        console.log(usersTicketsData, ticketsData)
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
    <div className="absolute w-full min-h-screen bg-orange-200 bg-gradient-to-tr from-orange-100">
      <div className={`flex flex-col mt-16 h-fit ${noto.className}`}>
        <div className="flex justify-center mt-1 text-3xl">
          <h1 className="">{eventName}</h1>
        </div>
        <form className="flex flex-col w-full mt-3" onSubmit={(e)=>handleSubmit(e)}>
          <div className="flex flex-col justify-center w-full items-center my-4">
          {formState.tickets.map((_, index) => 
            <BuyTicketsDetailsForm  key={index} formState={formState} constErrors={constErrors} validErrors={validErrors} handleChange={handleChange} index={index} handleDeleteTicket={handleDeleteTicket} addTicket={addTicket}/>
          )}
          </div>
          <div className="flex justify-center">
            <button className="bg-yellow-500 p-2 -my-3 rounded-lg shadow-lg mb-2 text-white text-lg font-extralight" type="submit">לרכישה</button>
          </div>
        </form>
      </div> 
        
        {showRememberMePopup && (
          <RememberMePopUp
            onSubmit={handleRememberMeSubmit}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
          />
        )}
        {showAgeErrorPopUp && 
        <AgeErrorPopup setShowAgeErrorPopUp= {setShowAgeErrorPopUp}/>
        }
    </div>
  );
}

export default BuyTicketPage;