let arrayLike = { 0: "a", 1: "b", 2: "c", 3: "d", length: 4 };

console.log(Array.from(arrayLike));

console.log([...arrayLike]);