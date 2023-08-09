import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from 'react';
import { Stage2Props } from './create event forms/stage3';
import dynamic from 'next/dynamic';

type UploadImagesProps = Stage2Props

const NoSSRUploadImage: React.FC<UploadImagesProps> = ({ setStage, setEventsData }) => {

  return (
    <>
      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        uploadPreset="tyifuktq"
        onUpload={(result: any, widget: any) => {
          setEventsData(prevData => ({
            ...prevData,
            image: result?.info.url
        }))
          widget.close();
          setStage(3)
        }}
      >
        {({ open }) => {
          function handleOnClick(e: any) {
            e.preventDefault();
            open();
          }
          return (
            <button onClick={handleOnClick}>
              Upload an Image
            </button>
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