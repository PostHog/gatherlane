import type {Event} from './domain';
const rows = [
 ['garden','Garden morning','Outdoors','Help tend the neighborhood beds, swap growing tips, and take home a seedling. Tools and tea are provided.','Willow Community Garden',42,24],
 ['pottery','Clay & conversation','Arts','Try hand-building a small clay piece with local makers. No experience needed; materials are provided.','The Kiln Room',24,14],
 ['walk','Riverside bird walk','Outdoors','Join a relaxed guided walk along the river and learn to spot the birds that call it home.','Riverbend Trailhead',30,18],
 ['supper','The long table','Food','Bring a favorite dish to share at a friendly community potluck. Labels for ingredients are welcome.','Oak Street Hall',60,35],
 ['repair','Repair café','Learning','Bring a small household item and learn simple repair skills alongside volunteer fixers.','Northside Workshop',32,20],
 ['stories','Stories after sunset','Culture','Listen to local storytellers share short tales, then take the mic if you have a story of your own.','Lantern Library',45,27],
 ['yoga','Stretch in the park','Wellbeing','Start the morning with a gentle, accessible movement session. Bring a mat or a towel.','Maple Park Lawn',40,25],
 ['music','Sunday listening club','Culture','Discover new sounds with neighbors in an informal listening session curated by local musicians.','Common Ground Café',35,22],
 ['cook','Community kitchen','Food','Cook a seasonal lunch together and share practical recipes for making the most of fresh produce.','West End Kitchen',20,12],
 ['print','Printmaking circle','Arts','Explore simple block printing techniques and make a set of postcards to take home.','The Making Room',26,16]
] as const;
// Annual fictional dates keep the programme upcoming without changing from day to day.
export const events:Event[]=rows.map(([id,title,category,description,location,capacity,available],i)=>{const now=new Date(); const d=new Date(now.getFullYear(), 0, 15+i*32, 12); if(d < now) d.setFullYear(d.getFullYear()+1); return {id,title,category,description,location,capacity,available,price:0 as const,date:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,time:i%2?'18:30':'10:00'};}).sort((a,b)=>a.date.localeCompare(b.date));
