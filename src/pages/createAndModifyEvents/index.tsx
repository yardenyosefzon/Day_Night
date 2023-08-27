import React, { useEffect, useState } from "react";
import Stage1 from "../components/forms/create event forms/stage1";
import Stage2 from "../components/forms/create event forms/stage2";
import Stage3 from "../components/forms/create event forms/stage3";
import Stage4 from "../components/forms/create event forms/stage4";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { env } from "~/env.mjs";
import Spinner from "../components/spinner";
import { Noto_Sans_Hebrew } from "next/font/google";
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from "next/link";

const noto = Noto_Sans_Hebrew({subsets:['hebrew'], weight:"400"})

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

export type schemaTicketsData = {
  ticketName: string;
  price: number;
  numberOfTickets: number;
  notes: string;
}[];

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

  const [schemaTicketsData, setSchemaTicketsData] = useState<schemaTicketsData>([{
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
        fetch(`api/revalidate?path=/homePage`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({secret: env.NEXT_PUBLIC_MY_SECRET_TOKEN})
        })
        replace('/myEvents', undefined, {shallow:false})
        
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
        fetch(`api/revalidate?path=/homePage`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({secret: env.NEXT_PUBLIC_MY_SECRET_TOKEN})
        })
        fetch(`api/revalidate?path=/events/${encodeURIComponent(eventsData.slug as string)}`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
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

  if(eventLoading || schemaTicketCreateLoading || scemaTicketUpdateLoading)
  return <Spinner/>
  else
  return (
    <div className={`absolute flex flex-col w-full min-h-screen bg-orange-100 ${noto.className}`}>
      <div className="flex flex-col items-center justify-center mt-48 h-full">
        <div className="absolute top-0 right-0 mt-12 p-4 z-40 sm:p-12 sm:pr-20">
          <Link href={'/'}>
            <FontAwesomeIcon icon={faChevronRight} className="text-2xl"/>
          </Link>
        </div>
       {/* Interactive Indication (Bubbles with Numbers) */}
          <div className="absolute flex w-full top-20 justify-center space-x-4">
                  {[1, 2, 3, 4].map((number) => (
                    <div className={`flex ${number === stage ? "pt-2" : "" } `}>
                      <p
                        key={number}
                        onClick={() => {
                          if(number < stage)
                          setStage(number)
                        }}
                        className={`h-11 text-xl font-bold my-3 ${number === stage ? "bg-orange-400" : "bg-orange-200"} py-2 px-4 rounded-full`}
                      >
                        {number}
                      </p>
                    </div>
                  ))}
          </div>

         
              {/* Render the corresponding stage */}
              <div className="bg-white shadow-lg w-11/12 p-4 rounded-xl mb-3 sm:w-2/5">
                  {
                      stage === 1?
                    <Stage1
                      eventsData={eventsData}
                      setEventsData={setEventsData}
                      setStage={setStage}
                    />
                    :
                    stage === 2?
                    <Stage2 
                    setStage={setStage}
                    eventsData={eventsData}
                    setEventsData={setEventsData}/>
                    :
                    stage === 3?
                    <Stage3 setStage={setStage} setEventsData={setEventsData} eventsData={eventsData}/>
                    :
                    <Stage4 schemaTicketsData = {schemaTicketsData} setSchemaTicketsData = {setSchemaTicketsData} setStage = {setStage} handleCreateOrUpdateEvent = {handleCreateOrUpdateEvent}/>
                  }
              </div>
        

          {showErrorPopup && (
                          <div className='absolute flex h-full inset-0 items-center justify-center bg-black bg-opacity-50 z-50'>
                            <div className='bg-white shadow-md p-4 text-3xl bottom-1/4 w-11/12 rounded sm:w-2/5'>
                              {/* Close arrow */}
                              <button
                                onClick={() => setShowErrorPopup(false)}
                                className=' text-gray-400 hover:text-gray-600'
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
                  
                              <p dir="rtl" className='text-5xl mb-4 text-right sm:text-center'>
                                קיים אירוע עם שם זה...                      
                              </p>

                              <p dir="rtl" className='mb-4 text-center'>
                                אנא בחרו שם אחר                       
                              </p>
                            </div>
                          </div>
                        )}
      </div>
    </div>
  );
};

export default CreateEvents;
