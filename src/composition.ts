import {createApp} from './application'; import {events} from './data'; import {storageRepository} from './storage';
export const app=createApp(events,storageRepository({getItem:(key)=>localStorage.getItem(key),setItem:(key,value)=>localStorage.setItem(key,value)} as Storage));
