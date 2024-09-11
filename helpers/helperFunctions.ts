// This function abbreviates a number that is greater than 999 so it's easier to read and so it also matches 
// the format on GitHub
export function abbreviateNumber(number){
    if(number >= 1000 && number <= 1000000){
        return parseFloat((number/1000).toFixed(1))
    }
    else if (number >=1000000){
       return parseFloat((number/1000000).toFixed(1))
    }
    else{
        return number
    }
}