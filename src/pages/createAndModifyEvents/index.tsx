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
        replace('/myEvents')
        
      })
      .catch((error) => {
        console.log(error)
      })
    })
    .catch((error) => console.log(error))
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
        replace('/myEvents')
      })
      .catch((error) => {
        console.log(error)
      })
    })
    .catch((error) => console.log(error))
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
