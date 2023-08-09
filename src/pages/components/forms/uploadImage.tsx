import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from 'react';
import { Stage3Props } from './create event forms/stage3';
import dynamic from 'next/dynamic';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type UploadImagesProps = Partial<Stage3Props> 

const NoSSRUploadImage: React.FC<UploadImagesProps> = ({ setStage, setEventsData }) => {

  return (
    <>
      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        uploadPreset="tyifuktq"
        onUpload={(result: any, widget: any) => {
          if(setEventsData)
          setEventsData(prevData => ({
            ...prevData,
            image: result?.info.url
        }))
          widget.close();
          if(setStage)
          setStage(3)
        }}
      >
        {({ open }) => {
          function handleOnClick(e: any) {
            e.preventDefault();
            open();
          }
          return (
            <>
              <FontAwesomeIcon onClick={handleOnClick} className="text-4xl bg-orange-100 p-3 rounded-t-full" icon={faImage}/>
              <button onClick={handleOnClick} className='text-lg bg-orange-100 p-2 -mt-3 rounded-lg'>
                העלו תמונה
              </button>
            </>
          );
        }}
      </CldUploadWidget>
    </>
  )
}

const uploadImage = dynamic(() => Promise.resolve(NoSSRUploadImage), {
  ssr: false,
})

export default uploadImage