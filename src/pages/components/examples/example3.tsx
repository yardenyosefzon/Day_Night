import React from "react";

type Stage3Props = {
  eventsData: any;
  setEventsData: React.Dispatch<React.SetStateAction<any>>;
  setStage: React.Dispatch<React.SetStateAction<number>>;
};

const Stage3: React.FC<Stage3Props> = ({ eventsData, setEventsData, setStage }) => {
  return (
    <div>
      <h2>Stage 3 Content</h2>
      {/* Add your Stage 3 form or content here */}
      <button onClick={() => setStage(4)}>Next Stage</button>
    </div>
  );
};

export default Stage3;
