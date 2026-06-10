// 自定义菜品列表卡片组件
Component({
  data: {
    dishes: [],
    total: 0,
  },
  lifetimes: {
    created() {
      this._modelCtx = wx.modelContext.getContext(this);
      this._viewCtx = wx.modelContext.getViewContext(this);
      const { NotificationType } = wx.modelContext;
      this._modelCtx.on(NotificationType.Result, (data) => {
        const result = data && data.result ? data.result : {};
        const sc = result.structuredContent || {};

        this.setData({
          dishes: sc.dishes || [],
          total: sc.total || 0,
        });
      });
    },
  },
  methods: {
    onTapDish(e) {
      const dish = e.currentTarget.dataset.dish;
      if (!dish) return;
      this._modelCtx.sendFollowUpMessage({
        content: [
          { type: "text", text: `查看「${dish.name}」详情` },
          { type: "api/call", data: { name: "listCustomDishes", arguments: {} } },
        ],
      });
    },
  },
});
