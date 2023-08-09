import React from "react";
import UploadImage from "../uploadImage";
import { EventData } from "~/pages/createAndModifyEvents";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export type Stage3Props = {
  setStage: React.Dispatch<React.SetStateAction<number>>;
  setEventsData: React.Dispatch<React.SetStateAction<EventData>>
  eventsData: EventData
};

const NoSSRStage3: React.FC<Stage3Props> = ({ setStage, setEventsData, eventsData }) => {
  return (
    
    <div className="flex flex-col items-center">
      <div className="flex justify-start w-full ml-1">
        <FontAwesomeIcon className="pb-1" icon={faChevronLeft} onClick={() => setStage(3)}/>
      </div>
      <div className=" relative flex flex-col justify-center items-center border w-full rounded-lg">
        {eventsData.image !== "" ?
        <Image className="rounded-lg" src={eventsData.image} alt="uploaded Photo" fill objectFit="cover"></Image>
        :
        <UploadImage setStage={setStage} setEventsData={setEventsData}/>
      }
      </div>
        <button onClick={() => setStage(4)}>השלב הבא</button>
    </div>
    
  );
};

const Stage3 = dynamic(() => Promise.resolve(NoSSRStage3), {
  ssr: false,
})

export default Stage3;
