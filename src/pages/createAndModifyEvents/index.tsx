import React, { useEffect, useState } from "react";
import Stage1 from "../components/forms/create event forms/stage1";
import Stage2 from "../components/forms/create event forms/stage2";
import Stage3 from "../components/forms/create event forms/stage3";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { env } from "~/env.mjs";
import Spinner from "../components/spinner";

export type EventData = {
  eventName: string,
    date: string,
    artist: string,
    image: string,
    description: string,
    minAge: number,
    address: string,
    slug: string
};

const stageComponents = [
  Stage1,
  Stage2,
  Stage3
];

const CreateEvents: React.FC = () => {

  const {replace, query} = useRouter()
  const eventName = query?.eventName
  const [stage, setStage] = useState(1); 
  const [showErrorPopup, setShowErrorPopup] = useState(false); 

  const [eventsData, setEventsData] = useState<EventData>({
    eventName: "",
    date: "",
    artist: "",
    image: "",
    description: "",
    minAge: 0,
    address: "",
    slug: ""
  });

  const [schemaTicketsData, setSchemaTicketsData] = useState([{
    ticketName: "",
    price: 80,
    numberOfTickets: 100,
    notes: ""
  }])

  const { refetch: eventRefetch } = api.events.getOneByName.useQuery({eventName: eventName as string}, {refetchOnMount: false, refetchOnWindowFocus: false, retry: false, enabled: false})
  const { refetch: schemaTicketsRefetch } = api.schemaTickets.getManyByEventName.useQuery({eventName: eventName as string}, {refetchOnMount: false, refetchOnWindowFocus: false, retry: false, enabled: false})
  const {mutateAsync: eventMutate, isLoading: eventLoading} = api.events.createOrUpdate.useMutation()
  const {mutateAsync: schemaTicketCreate, isLoading: schemaTicketCreateLoading} = api.schemaTickets.create.useMutation()
  const {mutateAsync: schemaTicketUpdate, isLoading: scemaTicketUpdateLoading} = api.schemaTickets.updateDetails.useMutation()

  function handleCreateOrUpdateEvent () {
    
    if(!eventName){
    eventMutate(eventsData)
    .then((res) => {
      //@ts-ignore
      schemaTicketCreate({schemaTicketsData: schemaTicketsData, eventId: res.id})
      .then((res) => {
        fetch(`api/revalidate?path=/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({secret: env.NEXT_PUBLIC_MY_SECRET_TOKEN})
        })
        fetch(`api/revalidate?path=/events/${eventName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({secret: env.NEXT_PUBLIC_MY_SECRET_TOKEN})
        })
        replace('/myEvents')
        
      })
      .catch((error) => {
        console.log(error)
      })
    })
    .catch((error) => {
      if (error.message.includes('Unique constraint failed on the')) {
        setShowErrorPopup(true);
        setStage(1);
      }
    })
  }
  else{
    eventMutate(eventsData)
    .then((res) => {
      //@ts-ignore
      schemaTicketUpdate({schemaTicketsData: schemaTicketsData, eventName: res.eventName})
      .then((res) => {
        fetch(`api/revalidate?path=/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({secret: env.NEXT_PUBLIC_MY_SECRET_TOKEN})
        })
        fetch(`api/revalidate?path=/events/${eventName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({secret: env.NEXT_PUBLIC_MY_SECRET_TOKEN})
        })
        replace('/myEvents')
      })
      .catch((error) => {
        console.log(error, '///////////////')
      })
    })
    .catch((error) => {
      if (error.message.includes('Unique constraint failed on the')) {
        setShowErrorPopup(true);
        setStage(1);
      }
    })
  }
  }

useEffect(() => {

  if(typeof(eventName) === "string"){
    eventRefetch()
      .then((res) => {

        const eventData = res.data as {
          eventName: string;
          date: string;
          artist: string;
          image: string;
          description: string;
          minAge: number;
          address: string;
          slug: string;
        };
  
        setEventsData((prevData) => ({
        ...prevData,
        eventName: eventData.eventName,
        date: eventData.date,
        artist: eventData.artist,
        image: eventData.image,
        description: eventData.description,
        minAge: eventData.minAge,
        address: eventData.address,
        slug: eventData.slug,
      }));

      schemaTicketsRefetch()
      .then((res) => {
        //@ts-ignore
        setSchemaTicketsData(() => res.data )
    });
    })
  }
}, [])
console.log(schemaTicketsData)
  if(eventLoading || schemaTicketCreateLoading || scemaTicketUpdateLoading)
  return <Spinner/>
  else
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Current Stage: Stage {stage}</h1>

      {/* Interactive Indication (Bubbles with Numbers) */}
      <div className="flex justify-center mb-4 space-x-4">
        {[1, 2, 3].map((number) => (
          <div
            key={number}
            onClick={() => {
              if(number < stage)
               setStage(number)
            }}
            className={`stage-bubble ${number === stage ? "active" : ""}`}
          >
            {number}
          </div>
        ))}
      </div>
      {/* Pop-up */}
      {showErrorPopup && (
                    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                      <div className='bg-white rounded shadow-md relative p-14 text-3xl bottom-1/4'>
                        {/* Close arrow */}
                        <button
                          onClick={() => setShowErrorPopup(false)}
                          className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </button>
            
                        <p className='mb-4'>
                          .קיים אירוע עם שם זה. אנא בחרו שם אחר                        
                        </p>
                      </div>
                    </div>
                  )}
      {/* Render the corresponding stage */}
      <div className="border p-4">
        {
          stage === 1?
        <Stage1
          eventsData={eventsData}
          setEventsData={setEventsData}
          setStage={setStage}
        />
        :
        stage === 2?
        <Stage2 setStage={setStage} setEventsData={setEventsData}/>
        :
        <Stage3 schemaTicketsData = {schemaTicketsData} setSchemaTicketsData = {setSchemaTicketsData} setStage = {setStage} handleCreateOrUpdateEvent = {handleCreateOrUpdateEvent}/>
      }
      </div>
    </div>
  );
};

export default CreateEvents;
