import React, { useEffect, useRef } from 'react'

function Example({jet, setJet}:{jet: string, setJet: React.Dispatch<React.SetStateAction<string>>}) {
    const ref = useRef(null)
    function handleButtonClick(){
        setJet(`${ref.current}`)

    }
    useEffect(() => {
        setJet("hhhhh")
    
      return () => {
       
      }
    }, [])
    
    
  return (
    <div>
        <input type="text" ref={ref} />
        <button onClick={() => {handleButtonClick()
        }}>
            ggggggggggg
        </button>
    </div>

  )
}

export default Example