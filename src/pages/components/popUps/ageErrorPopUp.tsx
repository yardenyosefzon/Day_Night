import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Noto_Sans_Hebrew } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type AgeErrorPopupProps = {
    setShowAgeErrorPopUp: Dispatch<SetStateAction<boolean>>
};

const noto= Noto_Sans_Hebrew({subsets: ['hebrew'], weight:"400"})

export default function AgeErrorPopup({ setShowAgeErrorPopUp }: AgeErrorPopupProps) {

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-red-200 bg-opacity-95 text-md">
      <div className="flex bg-purple-50 p-6  rounded shadow shadow-black drop-shadow-sm w-10/12 sm:w-2/5 sm:justify-center">
        <div className="absolute right-0 top-0 p-2">
            <FontAwesomeIcon icon={faXmark} onClick={() => setShowAgeErrorPopUp(false)}/>
        </div>
        <p className="text-lg">הגיל שהוזן אינו תואם את הגיל המינימלי לאירוע</p>
    </div>
  </div>
  );
}
