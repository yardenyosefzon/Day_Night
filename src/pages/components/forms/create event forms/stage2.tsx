import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from 'next/dynamic'
import React from 'react'
import { EventData } from '~/pages/createAndModifyEvents';

type Stage2Props = {
    eventsData: EventData
    setEventsData: React.Dispatch<React.SetStateAction<any>>;
    setStage: React.Dispatch<React.SetStateAction<number>>
  };

const  modules  = {
    toolbar: [
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list:  "ordered" }, { list:  "bullet" }],
        ["clean"],
    ],
  };

const NoSSRStage2 : React.FC<Stage2Props> = ({ eventsData, setEventsData, setStage}) => {
  return (
    <div>
        <div className="flex flex-col items-center">
          <div className="flex justify-start w-full ml-1">
            <FontAwesomeIcon icon={faChevronLeft} onClick={() => setStage(1)}/>
          </div>
          <label className='text-xl'>תיאור</label>
          <QuillNoSSRWrapper 
          style={{minHeight: '60vh',}}
          className="bg-white border-black border-2 rounded-lg text-center float-right overflow-hidden"
          modules={modules}
          theme="snow" 
          value={eventsData.description} 
          onChange={(desc) => 
            setEventsData((prevData: {}) => ({
            ...prevData,
            description: desc
          }))}/>
        </div>
        <div>
          <button className="flex justify-center w-full text-emerald-950" onClick={() => setStage(3)}>
          השלב הבא
          </button>
        </div>
    </div>
  )
}

const QuillNoSSRWrapper = dynamic(import('react-quill'), {	
	ssr: false,
	loading: () => <p>Loading ...</p>,
	})

const Stage2 = dynamic(() => Promise.resolve(NoSSRStage2), {
    ssr: false,
    })
      export default Stage2;
