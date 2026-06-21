

export function dateFix(date)
{
   var result = new Date(date)

   // console.log(result.toLocaleString());
   // console.log(result.toDateString());
   
   //var result = date.toLocaleDateString('en-US', { weekday: 'long' }); 
   //var result = date.toLocaleString().substring(0, 16).replace(', ', ' ')/* .replace(".", "-",) */;

   var res = String(result.getFullYear()) + '-' + String(result.getMonth() + 1).padStart(2, '0') + '-' + result.getDate();
   res += ' ' + String(result.getHours()) + ':' + String(result.getMinutes());


   return res;
}