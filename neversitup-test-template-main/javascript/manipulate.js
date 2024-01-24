/**
 *
 * @param {string} text string of value example "aabb", "abcde"
 * @returns {string[]} string array of result
 */
function manipulate(
  text,
  leftIdx = 0,
  rightIdx = text.length - 1,
  result = []
) {
  // หากสลับตำแหน่งไม่ได้แล้วและค่าในผลลัพธ์ยังไม่เคยมีให้ทำการยัดค่าเข้า Array
  if (leftIdx == rightIdx && !result.includes(text)) {
    result.push(text);
  } else {
    for (let i = leftIdx; i <= rightIdx; i++) {
      //สลับตำแหน่งตัวอักษร
      text = swap(text, leftIdx, i);
      manipulate(text, leftIdx + 1, rightIdx, result);
      //ย้อนกลับไป
      text = swap(text, leftIdx, i);
    }
  }
  return result;
}

//Function to swap the letters of the string
function swap(text, leftIdx, rightIdx) {
  // string เป็น array
  let arr = text.split("");
  // สลับตำแหน่ง
  [arr[leftIdx], arr[rightIdx]] = [arr[rightIdx], arr[leftIdx]];
  // array เป็น string
  return arr.join("");
}

// console.log(manipulate("a"));
// console.log(manipulate("ab"));
// console.log(manipulate("abc"));
// console.log(manipulate("aabb"));

module.exports = {
  manipulate,
};
