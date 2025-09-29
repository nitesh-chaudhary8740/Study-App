const str = "this  is    multiple space string"
const str1= "single space str"
const multiSpaceReg = /\s{2,}/g
const check_str = multiSpaceReg.test(str);
const check_str1 = multiSpaceReg.test(str1)
const removeExtraSpaces = (str)=>{
    return str.replace(multiSpaceReg," ")

}


console.log(check_str)
console.log(check_str1)
console.log(removeExtraSpaces(str))
// for (const match of matchResult) {
//   console.log("Match:", match[0], "Index:", match.index);
// }