// 抓取网页内容供 Agent 分析
// 返回纯文本内容、标题和主图 URL

async function fetchUrl({ url } = {}) {
  try {
    if (!url || typeof url !== "string") {
      return {
        isError: true,
        content: [{ type: "text", text: "缺少 URL 参数。请用户提供要分析的链接。" }],
      };
    }

    // 校验 URL 格式
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: "URL 格式无效，必须以 http:// 或 https:// 开头。请用户提供有效的链接。",
          },
        ],
      };
    }

    // 使用 wx.request 抓取网页内容
    const pageContent = await new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: "GET",
        header: {
          "User-Agent": "Mozilla/5.0 (compatible; WeChatMiniProgram/1.0)",
        },
        timeout: 10000,
        success(res) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        },
        fail(err) {
          reject(new Error(err.errMsg || "网络请求失败"));
        },
      });
    });

    // 提取文本内容（简单 HTML 去标签处理）
    let textContent = "";
    let title = "";
    let imageUrl = "";

    if (typeof pageContent === "string") {
      // 提取 title
      const titleMatch = pageContent.match(/<title[^>]*>([^<]*)<\/title>/i);
      if (titleMatch) title = titleMatch[1].trim();

      // 提取第一张有意义的图片
      const imgMatches = pageContent.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
      if (imgMatches && imgMatches.length > 0) {
        for (const imgTag of imgMatches) {
          const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
          if (srcMatch && !srcMatch[1].includes("icon") && !srcMatch[1].includes("logo")) {
            imageUrl = srcMatch[1];
            break;
          }
        }
      }

      // 去除 HTML 标签，保留纯文本
      textContent = pageContent
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      // 限制内容长度（避免过大的内容影响 Agent 推理）
      if (textContent.length > 3000) {
        textContent = textContent.substring(0, 3000) + "...(内容已截断)";
      }
    } else if (typeof pageContent === "object") {
      // JSON 响应，转为字符串
      textContent = JSON.stringify(pageContent, null, 2);
      if (textContent.length > 3000) {
        textContent = textContent.substring(0, 3000) + "...(内容已截断)";
      }
    }

    return {
      isError: false,
      content: [
        {
          type: "text",
          text: `已成功获取链接内容（标题：${title || "无标题"}）。接下来分析网页内容是否包含菜品信息。如果确认是菜品，请调用 saveCustomDish 保存；如果不是菜品，请告知用户。`,
        },
      ],
      structuredContent: {
        success: true,
        content: textContent,
        title: title,
        imageUrl: imageUrl,
      },
    };
  } catch (err) {
    console.error("[fetchUrl] error", err);
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `无法获取链接内容：${err.message || "未知错误"}。请确认链接是否有效，或让用户直接输入菜品描述文字。`,
        },
      ],
      structuredContent: {
        success: false,
        errorMessage: err.message || "未知错误",
      },
    };
  }
}

module.exports = fetchUrl;
