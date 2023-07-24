import React from "react";

type Stage4Props = {
  eventsData: any;
  setEventsData: React.Dispatch<React.SetStateAction<any>>;
  setStage: React.Dispatch<React.SetStateAction<number>>;
};

const Stage4: React.FC<Stage4Props> = ({ eventsData, setEventsData, setStage }) => {
  return (
    <div>
      <h2>Stage 4 Content</h2>
      {/* Add your Stage 4 form or content here */}
      <button onClick={() => setStage(5)}>Next Stage</button>
    </div>
  );
};

export default Stage4;
