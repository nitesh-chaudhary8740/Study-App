import fs from 'fs'
let a = 1;

while(true){
a+=2;
    fs.unlinkSync(`./mypdf${a}.pdf`)
    
    
}