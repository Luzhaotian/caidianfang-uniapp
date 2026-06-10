// 注册所有原子接口
const fetchUrl = require("./apis/fetchUrl.js");
const saveCustomDish = require("./apis/saveCustomDish.js");
const listCustomDishes = require("./apis/listCustomDishes.js");

// 创建 skill 实例，path 需与 app.json 中 agent.skills[].path 一致
const skill = wx.modelContext.createSkill("skills/dish-skill");

// 注册原子接口，name 需与 mcp.json 中声明的一致
skill.registerAPI("fetchUrl", fetchUrl);
skill.registerAPI("saveCustomDish", saveCustomDish);
skill.registerAPI("listCustomDishes", listCustomDishes);

console.log("[dish-skill] APIs registered via createSkill");
