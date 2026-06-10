// 菜品预览卡片组件
// 展示 AI 识别并保存的菜品信息
Component({
  data: {
    dishId: 0,
    name: "",
    desc: "",
    categoryName: "",
    cookTime: "",
    difficulty: "",
    ingredients: [],
    seasonings: [],
    steps: [],
    image: "",
  },
  lifetimes: {
    created() {
      this._modelCtx = wx.modelContext.getContext(this);
      this._viewCtx = wx.modelContext.getViewContext(this);
      const { NotificationType } = wx.modelContext;
      this._modelCtx.on(NotificationType.Result, (data) => {
        const result = data && data.result ? data.result : {};
        const sc = result.structuredContent || {};
        const meta = result._meta || {};
        const dish = meta.dish || {};

        this.setData({
          dishId: sc.dishId || dish.id || 0,
          name: sc.dishName || dish.name || "",
          desc: dish.desc || "",
          categoryName: sc.categoryName || "",
          cookTime: dish.cookTime || "",
          difficulty: dish.difficulty || "中等",
          ingredients: dish.ingredients || [],
          seasonings: dish.seasonings || [],
          steps: dish.steps || [],
          image: dish.image || "",
        });
      });
    },
  },
  methods: {
    onTapViewMenu() {
      this._viewCtx.openDetailPage({
        url: "/pages/index/index",
      });
    },
  },
});
