import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import RememberMePopUp from "../components/popUps/rememberMePopUp";
import BuyTicketsDetailsForm from "../components/forms/buy ticket form/detailsForm";
import { Noto_Sans_Hebrew } from 'next/font/google';
import AgeErrorPopup from "../components/popUps/ageErrorPopUp";
import { GetServerSidePropsContext } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { getServerAuthSession } from "~/server/auth";
import superjson from "superjson";
import { MyContext } from "../components/context/context";

const noto = Noto_Sans_Hebrew({subsets: ["hebrew"], weight:"400"})

function BuyTicketPage() {
  const contextValue = useContext(MyContext)
  const formState = contextValue?.formState
  const setFormState = contextValue?.setFormState
  const { data: sessionData, update } = useSession();
  const { query: { eventName, ticketKind }, replace } = useRouter();
  const { data: eventsData, isLoading } = api.events.getAll.useQuery(undefined, {refetchOnWindowFocus: false, refetchOnMount: false});
  const {data: usersTicketsData} = api.boughtTickets.getFirstByIdAndUsersTicket.useQuery(undefined, {refetchOnWindowFocus: false, refetchOnMount: false});
  const {data: ticketsData} = api.boughtTickets.getFirstById.useQuery(undefined, {refetchOnWindowFocus: false, refetchOnMount: false});
  const {data: schemaTicketData} = api.schemaTickets.getOneBySlug.useQuery({slug: ticketKind as string}, {refetchOnWindowFocus: false, refetchOnMount: false})
  const event = eventsData?.find((event) => event.eventName === eventName);
 
  const [sum, setSum] = useState()
  const [showRememberMePopup, setShowRememberMePopup] = useState(false);
  const [showAgeErrorPopUp, setShowAgeErrorPopUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { mutateAsync: userRememberMeUpdate } = api.users.updateRememberProp.useMutation()
  
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
      fetch('/api/getPaymentLink',{
        method: 'POST',
        body: JSON.stringify({
          amount: Number(schemaTicketData?.price as number * formState.tickets.length) + Number((schemaTicketData?.price as number * 7 / 100 *formState.tickets.length).toFixed(2))
        })
      })
      .then((res) => {
        return res.json(); 
      })
      .then((data) => {
        if(rememberMe)
            userRememberMeUpdate({rememberMe: rememberMe})
            .then(()=>{
              update()
            })
        replace(`/paymentPages/paymentPage?url=${data.data.payment_page_link}`)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
        // else if(ticketsData === null) setShowRememberMePopup(true)
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
    <div className="absolute w-full h-fit min-h-screen bg-orange-200 bg-gradient-to-tr from-orange-100 py-5">
      <div className={`flex flex-col mt-16 h-fit ${noto.className}`}>
        <div className="flex justify-center mt-1 text-3xl">
          <h1 className="">{eventName}</h1>
        </div>
        <form className="flex flex-col items-center w-full" onSubmit={(e)=>handleSubmit(e)}>
          <div className="flex flex-col justify-center w-full items-center my-4">
          {formState.tickets.map((_, index) => 
            <BuyTicketsDetailsForm  key={index} formState={formState} validErrors={validErrors} handleChange={handleChange} index={index} handleDeleteTicket={handleDeleteTicket} addTicket={addTicket}/>
          )}
          </div>
          <div className="flex justify-between items-center w-4/5 px-5 sm:w-2/5">
            <div className="flex flex-col items-center">
              <p className="font-semibold text-xs">₪{(schemaTicketData?.price as number * 7 / 100 *formState.tickets.length).toFixed(2)} Online עמלת סליקה</p>
              <p className="font-semibold text-sm">+</p>
              <p className="font-semibold text-sm">₪{`${schemaTicketData?.price as number} x ${formState.tickets.length}`}</p>
              <div className="flex gap-3 items-center mt-1">
                <p className="font-semibold text-base">₪{Number(schemaTicketData?.price as number * formState.tickets.length) + Number((schemaTicketData?.price as number * 7 / 100 *formState.tickets.length).toFixed(2))}</p>
                <p className="font-semibold text-base">סה"כ</p>
              </div>
            </div>
            <button className="bg-yellow-500 px-2 py-1 -my-3 rounded-lg shadow-lg text-white text-lg font-extralight h-16" type="submit">לרכישה</button>
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
// 5929742f-9938-4081-9b4d-5da8f5c5ea7b
export default BuyTicketPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const {query} = context
  
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({session: await getServerAuthSession({req: context.req ,res: context.res}) }), 
    transformer: superjson
  });
  await helpers.events.getAll.prefetch()
  await helpers.boughtTickets.getFirstByIdAndUsersTicket.prefetch()
  await helpers.boughtTickets.getFirstById.prefetch()
  await helpers.schemaTickets.getOneBySlug.prefetch({slug: query?.ticketKind as string})
  await helpers.events.getManyByUserId.prefetch()

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}

