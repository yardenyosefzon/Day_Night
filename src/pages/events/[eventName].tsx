import Link from 'next/link';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import IsLoggedIn from '../components/isLoggedIn';

export default function EventPage(){
  const {query: {eventName}} = useRouter()
  const {data, isLoading} = api.events.getAll.useQuery(); 
  const event = data?.find(event => event.eventName ==  eventName)
  if(isLoading) return <div>Loading...</div>
    return (
     <>
        <div>{event?.eventName}</div>
        <div>{event?.artist} :אמן</div>
        <div>150 :כרטיסים שנותרו</div>
        <IsLoggedIn actionA={<Link href={`/buyTickets/${event?.eventName as string}`} className='border-2 border-black rounded-lg p-1' >קנה כרטיס</Link>} actionB={<Link href={`/logInTo/logInToBuyTickets?callBackUrl=${event?.eventName as string}`} className='border-2 border-black rounded-lg p-1' >קנה כרטיס</Link>}/>
        
      </>
     )
    }