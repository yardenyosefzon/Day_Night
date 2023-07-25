import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import { Stage2Props } from './create event forms/stage2';

type UploadImagesProps = Stage2Props

export const UploadImage: React.FC<UploadImagesProps> = ({ setStage, setEventsData }) => {
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