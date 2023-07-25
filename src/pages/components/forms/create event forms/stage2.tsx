import React from "react";
import UploadImage from "../uploadImage";
import { EventData } from "~/pages/createEvents";
import dynamic from "next/dynamic";


export type Stage2Props = {
  setStage: React.Dispatch<React.SetStateAction<number>>;
  setEventsData: React.Dispatch<React.SetStateAction<EventData>>
};

const NoSSRStage2: React.FC<Stage2Props> = ({ setStage, setEventsData }) => {
  return (
    
    <div className="flex flex-col items-center">
      <UploadImage setStage={setStage} setEventsData={setEventsData}/>
      <button onClick={() => setStage(3)}>Next Stage</button>
    </div>
    
  );
};

const Stage2 = dynamic(() => Promise.resolve(NoSSRStage2), {
  ssr: false,
})

export default Stage2;
