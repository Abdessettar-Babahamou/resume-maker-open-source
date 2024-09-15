import { headers } from "next/headers"
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { addUser } from "@/lib/db/queries"

export async function POST (req:Request){

    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
      }

        // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

//   get the body 
  const payload=await req.json();
  const body =JSON.stringify(payload);

  const wh=new Webhook(WEBHOOK_SECRET);

    let evt:WebhookEvent;
    try {
        evt = wh.verify(body, {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature,
        }) as WebhookEvent
      } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error occured', {
          status: 400,
        })
      }

       if (evt.type === 'user.created') {
      const {id ,email_addresses,first_name,last_name}=evt.data;
      await addUser({
        id,
        name:first_name + " "+last_name,
        email:email_addresses[0].email_address,

      });
      }
      console.log(evt);
    // console.log("text")
      return new Response('Th new user hqs been creqted',{status:200})

}