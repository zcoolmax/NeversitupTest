/**
 *
 * @param {string[]} texts list of string [":)", ":(", ":>"]
 * @returns {number} amount of smily face detected
 */
const countSmilyFace = (text) =>
  text.filter((face) => /(:|;)(-|~)?(\)|D)/.test(face)).length; // หารูปแบบดวงตาขึ้นต้นด้วย : หรือ ; ต่อมาจมูกต้องเป็น - หรือ ~ มีหรือไม่มีก็ได้ และ รอยยิ้ม ) หรือ D

// console.log(countSmilyFace([":)", ";(", ";}", ":-D"])); // should return 2;
// console.log(countSmilyFace([";D", ":-(", ":-)", ";~)"])); // should return 3;
// console.log(countSmilyFace([";]", ":[", ";*", ":$", ";-D"])); // should return 1;

module.exports = {
  countSmilyFace,
};
