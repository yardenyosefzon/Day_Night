import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

type RememberMePopupProps = {
  onSubmit: (rememberMe: boolean) => void;
  rememberMe: boolean
  setRememberMe: Dispatch<SetStateAction<boolean>>
};

export default function RememberMePopup({ onSubmit, rememberMe, setRememberMe }: RememberMePopupProps) {

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-medium mb-4">?לזכור אותך</h2>
        <div className="mb-4">
        <label>אם תבחרו לא להזכר על ידי המערכת, המידע עדיין ישמר אך לזמן מוגבל. בנוסף המערכת לא תשלים באופן אוטומאטי את פרטיכם ותאלצו למלא אותם מחדש בכל פעם שתרצו לרכוש כרטיס. 
          תמיד ניתן לשנות זאת בהגדרות
        </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            זכור את המידע שלי כדי לבצע רכישות עתידיות
          </label>
        </div>
        <button
          onClick={()=>onSubmit(rememberMe)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
