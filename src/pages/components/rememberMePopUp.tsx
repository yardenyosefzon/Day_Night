import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Noto_Sans_Hebrew } from "next/font/google";

type RememberMePopupProps = {
  onSubmit: (rememberMe: boolean) => void;
  rememberMe: boolean
  setRememberMe: Dispatch<SetStateAction<boolean>>
};

const noto= Noto_Sans_Hebrew({subsets: ['hebrew'], weight:"400"})

export default function RememberMePopup({ onSubmit, rememberMe, setRememberMe }: RememberMePopupProps) {

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-violet-200 bg-opacity-95 text-md">
      <div className="bg-purple-50 p-6 pb-2 rounded shadow shadow-black drop-shadow-sm w-2/3 sm:w-1/3">
        <h2 className={`text-lg font-medium mb-4 ${noto.className}`}>?לזכור אותך</h2>
        <div className={`mb-4 ${noto.className}`}>
          <p> אם תבחרו לא להזכר על ידי המערכת, המידע עדיין ישמר אך לזמן מוגבל. בנוסף המערכת לא תשלים באופן אוטומאטי את פרטיכם ותאלצו למלא אותם מחדש בכל פעם שתרצו לרכוש כרטיס</p>
          <p className={`my-2`}>תמיד ניתן לשנות זאת בהגדרות</p>
          <div className={`flex sm:justify-end`}>
            <label className={`my-5 mr-3`}>
            זכור את המידע שלי כדי לבצע רכישות עתידיות
            </label>
            <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleCheckboxChange}
                className="mr-2"
            />
          </div>
          <div className={`flex justify-center sm:justify-normal`}>
            <button
              onClick={()=>onSubmit(rememberMe)}
              className="bg-purple-500 hover:bg-purple-50 hover:text-purple-500 hover:font-semibold text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
      </div>
    </div>
  </div>
  );
}
