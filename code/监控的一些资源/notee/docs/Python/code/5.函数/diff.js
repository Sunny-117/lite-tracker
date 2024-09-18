// 初始化变量
function phoneticLookup(val) {
  var result = "";

  // 请把你的代码写在这条注释以下
  var lookup={
    "alpha":  "Adams",
    "bravo":  "Boston",
    "charlie":  "Chicago",
    "delta": "Denver",
    "echo": "Easy",
    "foxtrot": "Frank"
  };
  var val="alpha";
  
  // 请把你的代码写在这条注释以上
  return result;
}

// 你可以修改这一行来测试你的代码
phoneticLookup("charlie");



// 初始化变量
function phoneticLookup(val) {
  var result = "";

  // 请把你的代码写在这条注释以下
  switch(val) {
    case "alpha": 
      result = "Adams";
      break;
    case "bravo": 
      result = "Boston";
      break;
    case "charlie": 
      result = "Chicago";
      break;
    case "delta": 
      result = "Denver";
      break;
    case "echo": 
      result = "Easy";
      break;
    case "foxtrot": 
      result = "Frank";
  }

  // 请把你的代码写在这条注释以上
  return result;
}

// 你可以修改这一行来测试你的代码
phoneticLookup("charlie");
myObj.hasOwnProperty("top");