import React from "react";

type Stage5Props = {
  eventsData: any;
  setEventsData: React.Dispatch<React.SetStateAction<any>>;
  setStage: React.Dispatch<React.SetStateAction<number>>;
};

const Stage5: React.FC<Stage5Props> = ({ eventsData, setEventsData, setStage }) => {
  return (
    <div>
      <h2>Stage 5 Content</h2>
      {/* Add your Stage 5 form or content here */}
      <button onClick={() => setStage(1)}>Restart</button>
    </div>
  );
};

export default Stage5;
