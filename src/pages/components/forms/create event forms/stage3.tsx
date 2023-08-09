import React from "react";
import UploadImage from "../uploadImage";
import { EventData } from "~/pages/createAndModifyEvents";
import dynamic from "next/dynamic";
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type Stage3Props = {
  setStage: React.Dispatch<React.SetStateAction<number>>;
  setEventsData: React.Dispatch<React.SetStateAction<EventData>>
};

const NoSSRStage3: React.FC<Stage3Props> = ({ setStage, setEventsData }) => {
  return (
    
    <div className="flex flex-col items-center">
      <UploadImage setStage={setStage} setEventsData={setEventsData}/>
      <div className="">
        <FontAwesomeIcon icon={faImage}/>
      </div>
        <button onClick={() => setStage(4)}>Next Stage</button>
    </div>
    
  );
};

const Stage3 = dynamic(() => Promise.resolve(NoSSRStage3), {
  ssr: false,
})

export default Stage3;
