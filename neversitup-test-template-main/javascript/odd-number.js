/**
 *
 * @param {number[]} numbers list of numbers example [7], [0], [1,1,2], [0,1,0,0,1], [1,2,3,4,5,6,7,8,9,0]
 * @returns {number} one number that odd number
 */
const findOddNumber = (numbers) => {
  // สร้างตัวแปรเก็บ
  let result,
    tmpObj = {};

  // ตรวจสอบ param ว่าเป็น Array หรือไม่
  if (!numbers || typeof numbers !== "object" || !Array.isArray(numbers)) {
    console.log("there is an error");
    return new Error("error");
  } else if (numbers.length === 1) {
    // ถ้ามีค่าเดียวให้ return เลย
    result = numbers[0];
  }
  numbers.forEach((num) => {
    // หา key value ว่ามีอยู่ใน Object ไหม ถ้ามีให้เพิ่มจำนวนครั้งที่เข้าไป 1 ถ้าไม่มีให้เซ็ตค่าเริ่มต้นเป็น 1
    if (tmpObj[num]) tmpObj[num]++;
    else tmpObj[num] = 1;
  });

  // for (const [key, _] of Object.entries(tmpObj)) {
  for (let num in tmpObj) {
    // Loop เพื่อ แตก Object ที่ได้มาจากข้างบนเเพื่อหาตัวเลขที่มีจำนวนซ้ำมาที่สุดและผลลัพธ์ที่เจอเป็นจำนวนคี่
    if (tmpObj[num] % 2 === 1) {
      // นำค่าสุดท้ายที่ตรงตามเงื่อนไขออกมาเป็นคำตอบ
      result = +num;
    }
  }
  return result;
};

// [1,2,2,3,3,3,4,3,3,3,2,2,1] should return 4, because it appears 1 time (which is odd).

// const data = [1, 2, 2, 3, 3, 3, 4, 3, 3, 3, 2, 2, 1];
// console.log(findOddNumber(data));

// console.log(
//   `should return ${num}, because it appears ${time} time (which is odd).`
// );
// console.log(findOddNumber([0, 1, 0, 0, 1]));

module.exports = {
  findOddNumber,
};
