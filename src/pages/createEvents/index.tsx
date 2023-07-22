import React, { useEffect, useState } from "react";
import Stage1 from "../components/examples/example1";
// import Stage2 from "../components/examples/example2";
import Stage3 from "../components/examples/example3";
import Stage4 from "../components/examples/example4";
import Stage5 from "../components/examples/example5";

export type EventData = {
  eventName: string,
    date: string,
    artist: string,
    image: string,
    description: string,
    minAge: number,
    address: string
};

const stageComponents = [
  Stage1,
  // Stage2,
  Stage3,
  Stage4,
  Stage5
];

const CreateEvents: React.FC = () => {
  
  const [stage, setStage] = useState(1);
  const [eventsData, setEventsData] = useState<EventData>({
    eventName: "",
    date: "",
    artist: "",
    image: "",
    description: "",
    minAge: 0,
    address: ""
  });

  const handleStageClick = (selectedStage: number) => {
    setStage(selectedStage);
  };

  const CurrentStageComponent = stageComponents[stage - 1]!;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Current Stage: Stage {stage}</h1>

      {/* Interactive Indication (Bubbles with Numbers) */}
      <div className="flex justify-center mb-4 space-x-4">
        {[1, 2, 3, 4, 5].map((number) => (
          <div
            key={number}
            onClick={() => handleStageClick(number)}
            className={`stage-bubble ${number === stage ? "active" : ""}`}
          >
            {number}
          </div>
        ))}
      </div>

      {/* Render the corresponding stage */}
      <div className="border p-4">
        <CurrentStageComponent
          eventsData={eventsData}
          setEventsData={setEventsData}
          setStage={setStage}
        />
      </div>
    </div>
  );
};

export default CreateEvents;
