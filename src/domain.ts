export type Event = { id:string; title:string; description:string; date:string; time:string; location:string; category:string; capacity:number; available:number; price:0 };
export type Registration = { id:string; eventId:string; eventDate:string; name:string; email:string; quantity:number };
export function validate(name:string,email:string,quantity:number,available:number): Record<string,string> {
 const errors:Record<string,string>={};
 if (!name.trim()) errors.name='Enter your name.';
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email='Enter a valid email address.';
 if (!Number.isInteger(quantity)||quantity<1) errors.quantity='Choose at least one ticket.';
 else if(quantity>available) errors.quantity=`Only ${available} tickets are available on this device.`;
 return errors;
}
export const remaining=(event:Event, registrations:Registration[])=>Math.max(0,event.available-registrations.filter(r=>r.eventId===event.id&&r.eventDate===event.date).reduce((sum,r)=>sum+r.quantity,0));
