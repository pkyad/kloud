function price_in_words(value) {
  var price = parseInt(value)
  var sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
    dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
    tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
    handle_tens = function(dgt, prevDgt) {
      return 0 == dgt ? "" : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt])
    },
    handle_utlc = function(dgt, nxtDgt, denom) {
      return (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") + (0 != nxtDgt || dgt > 0 ? " " + denom : "")
    };

  var str = "",
    digitIdx = 0,
    digit = 0,
    nxtDigit = 0,
    words = [];
  if (price += "", isNaN(parseInt(price))) str = "";
  else if (parseInt(price) > 0 && price.length <= 10) {
    for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--) switch (digit = price[digitIdx] - 0, nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0, price.length - digitIdx - 1) {
      case 0:
        words.push(handle_utlc(digit, nxtDigit, ""));
        break;
      case 1:
        words.push(handle_tens(digit, price[digitIdx + 1]));
        break;
      case 2:
        words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2] ? " and" : "") : "");
        break;
      case 3:
        words.push(handle_utlc(digit, nxtDigit, "Thousand"));
        break;
      case 4:
        words.push(handle_tens(digit, price[digitIdx + 1]));
        break;
      case 5:
        words.push(handle_utlc(digit, nxtDigit, "Lakh"));
        break;
      case 6:
        words.push(handle_tens(digit, price[digitIdx + 1]));
        break;
      case 7:
        words.push(handle_utlc(digit, nxtDigit, "Crore"));
        break;
      case 8:
        words.push(handle_tens(digit, price[digitIdx + 1]));
        break;
      case 9:
        words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2] ? " and" : " Crore") : "")
    }
    str = words.reverse().join("")
  } else str = "";
  return str

}


scrollToTop = document.getElementById("scrollToTop");

// When the user scrolls down 20px from the top of the document, show the button
// window.onscroll = function() {scrollFunction()};
//
// function scrollFunction() {
//   if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//     scrollToTop.style.display = "block";
//   } else {
//     scrollToTop.style.display = "none";
//   }
// }

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


// This file is to store the native JS custom functions , This should be included in the top of the imports
function fileType(input){
  var ext = input.split('.')[input.split('.').length -1]
  switch (ext) {
    case 'py':
      return 'python';
    case 'css':
      return 'css';
    case 'html':
        return 'html';
    case 'js':
        return 'javascript';
    default:
      return ''
  }
}

function isEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function dateToString(date){
  return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+ (date.getDay());
}

var emptyFile = new File([""], "");

function daysInMonth(month,year) {
  return new Date(year, month, 0).getDate();
}

function getDays(month , year){
 //====== This function gives the dates of the month and the year in the array.
  var numDays = daysInMonth(month+1, year); // Number of days in the current month
  var numDaysPrev = daysInMonth(month, year); // Number of days in the current month
  var dTemp = new Date();
  dTemp.setFullYear(year, month, 1)
  var firstDay = dTemp.getDay();
  var dayFlags = [];
  var days = [];
  var dayFlag = "";
  var tFlag = 0;
  var start = numDaysPrev + 1 - firstDay;
  var temp = start;
  var toAdd = temp;
  if (temp>numDaysPrev){
    temp = 1;
    tFlag = 1;
  }
  for (var i= 0; i<42 ; i +=1) {
    if (tFlag==0){
      dayFlag = "Prev";
      toAdd = temp;
      temp +=1;
      if (temp>numDaysPrev){
        temp = 1;
        tFlag = 1;
      }
    }else if (tFlag ==1){
      dayFlag="Cur";
      toAdd = temp;
      temp +=1;
      if (temp > numDays){
        temp =1;
        tFlag = 2;
      }
    }else if (tFlag ==2){
      dayFlag = "Next";
      toAdd = temp;
      temp += 1;
    }
    days.push(toAdd);
    dayFlags.push(dayFlag);
  }
  return {days: days, flags : dayFlags};
};




Array.prototype.sortIndices = function (func) {
  var i = j = this.length,
    that = this;

  while (i--) {
    this[i] = { k: i, v: this[i] };
  }

  this.sort(function (a, b) {
    return func ? func.call(that, a.v, b.v) :  a.v < b.v ? -1 : a.v > b.v ? 1 : 0;
  });

  while (j--) {
      this[j] = this[j].k;
  }
}

range = function(min, max, step){
  step = step || 1;
  var input = [];
  for (var i = min; i <= max; i += step) input.push(i);
  return input;
};

scroll = function(element){
  var $id= $(element);
  $id.scrollTop($id[0].scrollHeight);
}

function isNumber(num){
  if (typeof num=='string') {
    num = parseInt(num);
  }
  // console.log(num);
  // console.log(Number.isInteger(num));
  if (Number.isInteger(num)){
    return true;
  }else {
    return false;
  }
}

getType = function(input){
  // returns the type if the input
  if (typeof input == 'function') {
    return 'function';
  }

  if (isNumber(input)) {
    return  'number';
  }
  if (typeof input =='boolean' || input == null) {
    return 'string';
  }
  if (typeof input == 'number') {
    return 'number';
  }
  if ( input.indexOf(' ') !=-1) {
    return 'string';
  }
  if (  input.length > 7) {

    input = input.toLowerCase()
    containesHTTP = (input.indexOf('http://') !=-1 || input.indexOf('https://') !=-1 );
    if ( containesHTTP ){
      if (input.endsWith('.jpg') || input.endsWith('png')) {
        type = 'image';
      }else if (input.endsWith('.pdf')) {
        type = 'pdf';
      }else if (input.endsWith('.py')) {
        type = 'python';
      }else if (input.endsWith('.odt')) {
        type = 'openDoc';
      }else{
        type = 'hyperLink';
      }
    } else{
      type = 'string'
    }
  } else {
    type = 'string';
  }
  return type;
}

String.prototype.endsWith = function(str){
  if (str.length<this){
    return false;
  }
  return (this.match(str+"$")==str)
}

getPK = function(input){
  // for any object url like /api/HR/uses/1/  : this can give the pk of the object
  if (typeof input == 'number') {
    return input;
  }
  parts = input.match(/\/\d*\//g);
  if (parts.length == 1) {
    return parseInt(parts[0].match(/\d+/));
  }
  return parseInt(input.match(/\/\d*\//g)[1].match(/\d+/))
}

String.prototype.cleanUrl = function(){
  return this.split('?')[0]
}
