import type {Repository} from './application';
import type {Registration} from './domain';
const key='gatherlane-v1';
export function storageRepository(storage:Storage):Repository {
 return {read(){let raw:string|null; try {raw=storage.getItem(key);} catch {throw new Error('Browser storage is unavailable. Enable storage to save events and registrations.');} if(!raw)return {saved:[],registrations:[]}; try {const data:unknown=JSON.parse(raw); if(!data||typeof data!=='object')throw 0; const d=data as {saved:unknown;registrations:unknown}; if(!Array.isArray(d.saved)||!d.saved.every(x=>typeof x==='string')||!Array.isArray(d.registrations)||!d.registrations.every((r:Registration)=>r&&typeof r.id==='string'&&typeof r.eventId==='string'&&typeof r.eventDate==='string'&&typeof r.name==='string'&&typeof r.email==='string'&&Number.isInteger(r.quantity)&&r.quantity>0))throw 0; return d as {saved:string[];registrations:Registration[]};} catch {throw new Error('Saved data is invalid. Clear Gatherlane data to start again.');}}, write(data){try{storage.setItem(key,JSON.stringify(data));}catch{throw new Error('Could not save to this device. Check browser storage settings and try again.');}}};
}
export function clearStorage(){localStorage.removeItem(key)}
