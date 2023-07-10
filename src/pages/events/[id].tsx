import Link from 'next/link';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';


export default function EventPage(){
  const {query: {id}} = useRouter()
  const {data, isLoading} = api.events.getAll.useQuery(); 
  const event = data?.find(event => event.id == id )
  if(isLoading) return <div>Loading...</div>
    return (
     <>
        <div>{event?.eventName}</div>
        <div>{event?.artist} :אמן</div>
        <div>{event?.cost} :מחיר</div>
        <div>150 :כרטיסים שנותרו</div>
        <Link href={`/buyTickets/${event?.eventName as string}`} className='border-2 border-black rounded-lg p-1' >קנה כרטיס</Link>
      </>
     )
    }