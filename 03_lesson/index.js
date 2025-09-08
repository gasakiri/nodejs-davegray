import { format } from "date-fns";
import { v6 as uuid } from 'uuid';

console.log(format(new Date(), "yyyyMMdd\tHH:mm:ss"));

console.log(uuid());

console.log(uuid());