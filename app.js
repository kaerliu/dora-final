const navTitle = document.getElementById("nav-title");
const navBar = document.getElementById("nav-bar");
const navSidebar = document.getElementById("nav-sidebar");
const navAgentName = document.getElementById("nav-agent-name");
const navAgentSubtitle = document.getElementById("nav-agent-subtitle");
const navHistory = document.getElementById("nav-history");
const navTimer = document.querySelector(".nav-action-btn--timer");
const navNewChat = document.getElementById("nav-new-chat");
const phone = document.getElementById("phone");
const screen = document.getElementById("screen");
const inputArea = document.getElementById("input-area");

const sidebarRoot = document.getElementById("sidebar-root");
const sidebarMask = document.getElementById("sidebar-mask");
const sidebarPanel = document.getElementById("sidebar-panel");
const sbSidebarHome = document.getElementById("sb-sidebar-home");
const sbHomeHeaderRow = document.querySelector(".sb-header");
const sbViewPlatform = document.getElementById("sb-view-platform");
const sbViewAgentList = document.getElementById("sb-view-agent-list");

let currentState = "list";
let selectedAgent = "问数";
let timedTasksReturnState = "chat";
let sidebarView = "platform";
let streamToken = 0;
let currentQueryTitle = "如果我问了一个问题非常长的问题如果我问了一个问题非常长的问题如果我问了一个问题非常长的问题";

function resolveNavSubtitle(stateKey, options) {
  if (options.navSubtitle != null) return options.navSubtitle;
  if (stateKey === "thinking" || stateKey === "result") return currentQueryTitle;
  return "新聊天";
}

function getDefaultInputTemplate() {
  return `
      <div class="input-box input-activate" data-jump="longInput" role="button" aria-label="打开输入">
        <span class="placeholder">有问题，尽管问</span>
        <button class="send-btn icon-only send-icon" data-jump="longInput" aria-label="发送">
          <svg class="icon-symbol action-icon" aria-hidden="true">
            <use href="#icon-dora-fasong" xlink:href="#icon-dora-fasong"></use>
          </svg>
        </button>
      </div>
      <div class="input-system-gap"></div>
    `;
}

function setSidebarView(view) {
  sidebarView = view;
  const isPlatform = view === "platform";
  sbViewPlatform.classList.toggle("sb-view-hidden", !isPlatform);
  sbViewAgentList.classList.toggle("sb-view-hidden", isPlatform);
  sidebarPanel.classList.toggle("view-platform", isPlatform);
  sidebarPanel.classList.toggle("view-agent-list", !isPlatform);
}

function closeSidebar() {
  phone.classList.remove("sidebar-open");
  sidebarRoot.setAttribute("aria-hidden", "true");
  navSidebar.setAttribute("aria-expanded", "false");
}

function openSidebar(view = "platform") {
  if (currentState === "list") return;
  setSidebarView(view);
  phone.classList.add("sidebar-open");
  sidebarRoot.setAttribute("aria-hidden", "false");
  navSidebar.setAttribute("aria-expanded", "true");
}

const states = {
  list: {
    title: "Data Agent",
    body: `
      <div class="search">搜索</div>
      <div class="section-title">最新上线</div>
      <article class="card" data-jump="chat" data-agent="问数">
        <span class="card-corner">封装</span><span class="card-more">...</span>
        <div class="card-head">
          <div class="card-icon"></div>
          <div class="card-main">
            <h3>问数</h3>
            <div class="card-meta">最新发布时间：2026-02-21</div>
          </div>
        </div>
        <div class="card-desc">描述描述描述描述描述描述描述描述描述描述描述描述描述述描述描述描述描述描述描述描述描述描述描述...</div>
      </article>
      <div style="height:1px;background:#e6e9ef;margin:0 0 16px;"></div>
      <div class="section-title">全部智能体</div>
      <article class="card" data-jump="chat" data-agent="报告">
        <span class="card-corner">封装</span><span class="card-more">...</span>
        <div class="card-head">
          <div class="card-icon"></div>
          <div class="card-main"><h3>报告</h3><div class="card-meta">最新发布时间：2026-02-21</div></div>
        </div>
        <div class="card-desc">描述描述描述描述描述描述描述描述描述描述描述描述描述述描述描述描述描述描述描述描述描述描述描述...</div>
      </article>
      <article class="card" data-jump="chat" data-agent="数据分析">
        <span class="card-corner">封装</span><span class="card-more">...</span>
        <div class="card-head">
          <div class="card-icon"></div>
          <div class="card-main"><h3>数据分析</h3><div class="card-meta">最新发布时间：2026-02-21</div></div>
        </div>
        <div class="card-desc">描述描述描述描述描述描述描述描述描述描述描述描述描述述描述描述描述描述描述描述描述描述描述描述...</div>
      </article>
    `,
    input: "",
  },
  chat: {
    title: selectedAgent,
    body: `
      <section class="chat-layout">
        <section class="welcome">
          <div class="agent-identity">
            <div class="agent-logo" aria-hidden="true"><span class="sb-list-icon">icon</span></div>
            <div class="agent-name">${selectedAgent}</div>
          </div>
          <p>你好，我是${selectedAgent}。这里是用户设置的欢迎语。是以【默认卡片】样式展现的。注意它并不是一条会话消息。</p>
          <div class="tip-list">
            <div>😄你可以问我这些问题：</div>
            <div class="tip-tabs">
              <span class="tip-tab active">客户画像</span>
              <span class="tip-tab">公司信息</span>
              <span class="tip-tab">财务分析</span>
              <span class="tip-tab">新闻动态</span>
            </div>
            <div class="tip-item">做一份【公司】客户画像：工商概况、主营业务...</div>
            <div class="tip-item">做一份【公司】客户画像：工商概况、主营业务...</div>
            <div class="tip-item">做一份【公司】客户画像：工商概况、主营业务...</div>
            <div class="tip-item">做一份【公司】客户画像：工商概况、主营业务...</div>
          </div>
        </section>
      </section>
    `,
    input: getDefaultInputTemplate(),
  },
  longInput: {
    title: selectedAgent,
    body: `
      <div class="longinput-stage">
        <div class="longinput-fill" aria-hidden="true"></div>
        <div class="longinput-bar-outer longinput-slide-input">
          <div class="longinput-bar-inner">
            <div class="longinput-bar-text">
              <p>如果我问了一个问题非常长的问题，腾讯云助手的处理方式是：输入框变高，然后最多展示3行输入框，然后输入的内容在这个3行里出现纵向滚动↕️</p>
            </div>
            <button type="button" class="longinput-send" data-jump="thinking" aria-label="发送">
              <img src="https://www.figma.com/api/mcp/asset/ed108153-7fdc-41af-ba9c-4f8ee969f338" alt="" width="32" height="32" />
            </button>
          </div>
        </div>
        <div class="keyboard longinput-slide-keyboard">
          <p class="keyboard-label">输入法界面</p>
        </div>
      </div>
    `,
    input: "",
  },
  thinking: {
    title: "如果我问了一个问题非常长的问题如果我问了一个问题非常长的问题如果我问了一个问题非常长的问题",
    body: `
      <section class="thinking-layout stream-stage">
        <div class="bubble">
          如果我问了一个问题非常长的问题，发送出去以后还是适应内容高度。
        </div>
        <div class="middle-stream-window" id="middle-stream-window">
          <div class="middle-stream-content" id="middle-stream-content">
            <section class="thinking expanded">
              <h4 data-action="toggle-thinking">思考中 <span class="caret">⌄</span></h4>
              <div class="timeline" id="thinking-timeline">
                <div id="thinking-stream"></div>
              </div>
            </section>
          </div>
        </div>
      </section>
    `,
    input: `
      <div class="input-box">
        <span class="placeholder">有问题，尽管问</span>
        <button class="send-btn icon-only stop-icon" data-action="stop-thinking" aria-label="中止">
          <svg class="icon-symbol" aria-hidden="true"><use href="#icon-dora-zhongzhi" xlink:href="#icon-dora-zhongzhi"></use></svg>
        </button>
      </div>
      <div class="input-system-gap"></div>
    `,
  },
  result: {
    title: "如果我问了一个问题非常长的问题如果我问了一个问题非常长的问题如果我问了一个问题非常长的问题",
    body: `
      <section class="result-layout stream-stage">
        <div class="middle-stream-window" id="middle-stream-window">
          <section class="result middle-stream-content" id="middle-stream-content">
          <div class="result-title">
            已完成思考
            <span class="fold-link" data-action="toggle-result-thought">[收起]</span>
          </div>
          <div class="result-thought expanded" id="result-thought">
            <div class="result-thought-collapsed" id="result-thought-stream"></div>
          </div>
          <div class="result-answer" id="result-answer">
            <span id="result-answer-stream"></span>
          </div>
          <div class="actions">
            <button type="button" class="action-icon-btn" aria-label="复制">
              <svg class="icon-symbol action-toolbar-icon" aria-hidden="true">
                <use href="#icon-dora-fuzhi" xlink:href="#icon-dora-fuzhi"></use>
              </svg>
            </button>
            <button type="button" class="action-icon-btn" aria-label="点赞">
              <svg class="icon-symbol action-toolbar-icon" aria-hidden="true">
                <use href="#icon-dora-dianzan" xlink:href="#icon-dora-dianzan"></use>
              </svg>
            </button>
            <button type="button" class="action-icon-btn" aria-label="点踩">
              <svg class="icon-symbol action-toolbar-icon is-down" aria-hidden="true">
                <use href="#icon-dora-dianzan" xlink:href="#icon-dora-dianzan"></use>
              </svg>
            </button>
            <button type="button" class="action-icon-btn" aria-label="分享">
              <svg class="icon-symbol action-toolbar-icon" aria-hidden="true">
                <use href="#icon-dora-fenxiang" xlink:href="#icon-dora-fenxiang"></use>
              </svg>
            </button>
            <button type="button" class="action-icon-btn" aria-label="刷新">
              <svg class="icon-symbol action-toolbar-icon" aria-hidden="true">
                <use href="#icon-dora-shuaxin" xlink:href="#icon-dora-shuaxin"></use>
              </svg>
            </button>
          </div>
          </section>
        </div>
      </section>
    `,
    input: `
      <div class="input-box">
        <span class="placeholder">有问题，尽管问</span>
        <button class="send-btn icon-only send-icon" data-jump="longInput" aria-label="发送">
          <svg class="icon-symbol action-icon" aria-hidden="true">
            <use href="#icon-dora-fasong" xlink:href="#icon-dora-fasong"></use>
          </svg>
        </button>
      </div>
      <div class="input-system-gap"></div>
    `,
  },
  timedTasks: {
    title: "定时任务",
    hideNav: true,
    body: `
      <section class="timed-tasks-page">
        <header class="timed-tasks-header">
          <button class="timed-tasks-back" data-action="timed-back" aria-label="返回">‹</button>
          <h2 class="timed-tasks-title">定时任务</h2>
        </header>
      </section>
    `,
    input: "",
  },
};

const thoughtChunks = [
  { kind: "skill", text: "使用技能1：XXXXXX\n" },
  { kind: "step", text: "第1步，XXXXXXX\n" },
  { kind: "body", text: "这里技能下第1步的思考产出内容。采用纯文字流式输出的方式呈现思考内容。\n" },
  { kind: "step", text: "第2步，XXXXXXX\n" },
  { kind: "body", text: "这里技能下第2步的思考产出内容。采用纯文字流式输出的方式呈现思考内容。\n" },
  { kind: "summary", text: "这里是使用【技能1】全部结束后的一句总结。[查看详情]\n" },
  { kind: "skill", text: "使用技能2：XXXXXX\n" },
  { kind: "step", text: "第1步，XXXXXXX\n" },
  { kind: "body", text: "这里技能2下第1步的思考产出内容。采用纯文字流式输出的方式呈现思考内容。\n" },
  { kind: "summary", text: "这里是使用【技能2】全部结束后的一句总结。[查看详情]" },
];

const finalThoughtText = thoughtChunks.map((c) => c.text).join("");
const finalAnswerHtml =
  "已为你查询到上个月销量最高的商品：<br />" +
  "根据2025年12月的销售数据，销量最高的商品是<br />" +
  "<strong>三全960g奶香馒头</strong><span class=\"tag\">1</span>，其销售数量为 <strong>20,438</strong><br />" +
  "<span class=\"tag\">2</span>。";
const resultAnswerChunks = [
  { text: "已为你查询到上个月销量最高的商品：\n", interval: 24, pause: 220 },
  { text: "根据2025年12月的销售数据，销量最高的商品是\n", interval: 16, pause: 120 },
  { text: "三全960g奶香馒头1，其销售数量为20,438。\n", interval: 12, pause: 100 },
  { text: "2。", interval: 20, pause: 0 },
];

function stopAllStreams() {
  streamToken += 1;
}

function scrollMiddleWindowToBottom() {
  const win = document.getElementById("middle-stream-window");
  if (win) win.scrollTop = win.scrollHeight;
}

function streamText({ target, text, interval = 35, onDone, token }) {
  if (!target) return;
  let i = 0;
  const timer = window.setInterval(() => {
    if (token !== streamToken) {
      window.clearInterval(timer);
      return;
    }
    i += 1;
    target.textContent = text.slice(0, i);
    scrollMiddleWindowToBottom();
    if (i >= text.length) {
      window.clearInterval(timer);
      if (typeof onDone === "function") onDone();
    }
  }, interval);
}

function startThinkingStream() {
  const localToken = streamToken;
  const streamEl = document.getElementById("thinking-stream");
  const timelineEl = document.getElementById("thinking-timeline");
  if (!streamEl || !timelineEl) return;

  let chunkIndex = 0;
  function pushNextChunk() {
    if (localToken !== streamToken) return;
    if (chunkIndex >= thoughtChunks.length) {
      window.setTimeout(() => {
        if (localToken !== streamToken) return;
        render("result", { streamAnswer: true });
      }, 280);
      return;
    }
    const chunk = thoughtChunks[chunkIndex];
    const chunkInterval = chunk.kind === "body" ? 10 : 20;
    let i = 0;
    const timer = window.setInterval(() => {
      if (localToken !== streamToken) {
        window.clearInterval(timer);
        return;
      }
      i += 1;
      streamEl.textContent += chunk.text.slice(i - 1, i);
      timelineEl.scrollTop = timelineEl.scrollHeight;
      scrollMiddleWindowToBottom();
      if (i >= chunk.text.length) {
        window.clearInterval(timer);
        chunkIndex += 1;
        window.setTimeout(pushNextChunk, 120);
      }
    }, chunkInterval);
  }
  pushNextChunk();
}

function startResultStream() {
  const localToken = streamToken;
  const thoughtEl = document.getElementById("result-thought-stream");
  const answerEl = document.getElementById("result-answer-stream");
  if (!thoughtEl || !answerEl) return;

  streamText({
    target: thoughtEl,
    text: finalThoughtText,
    interval: 8,
    token: localToken,
    onDone: () => {
      if (localToken !== streamToken) return;
      let idx = 0;
      function streamAnswerChunk() {
        if (localToken !== streamToken) return;
        if (idx >= resultAnswerChunks.length) {
          answerEl.innerHTML = finalAnswerHtml;
          return;
        }
        const part = resultAnswerChunks[idx];
        const current = answerEl.textContent || "";
        streamText({
          target: answerEl,
          text: current + part.text,
          interval: part.interval,
          token: localToken,
          onDone: () => {
            if (localToken !== streamToken) return;
            idx += 1;
            window.setTimeout(streamAnswerChunk, part.pause);
          },
        });
      }
      streamAnswerChunk();
    },
  });
}

function render(stateKey, options = {}) {
  stopAllStreams();
  const state = states[stateKey];
  currentState = stateKey;
  phone.className = `phone state-${stateKey}`;
  navBar.className = stateKey === "list" ? "nav nav-mode-list" : "nav nav-mode-session";
  navBar.style.display = state.hideNav ? "none" : "";
  navTitle.textContent = options.navTitle != null ? options.navTitle : state.title;
  if (navAgentName) navAgentName.textContent = selectedAgent;
  const nextSubtitle = resolveNavSubtitle(stateKey, options);
  if (navAgentSubtitle) {
    navAgentSubtitle.textContent = nextSubtitle;
  }
  screen.innerHTML = `<div class="state-transition no-animation">${state.body}</div>`;
  inputArea.innerHTML = state.input;
  bindJumps();
  closeSidebar();

  if (stateKey === "thinking") startThinkingStream();
  if (stateKey === "result") {
    if (options.streamAnswer) {
      startResultStream();
    } else {
      const thoughtEl = document.getElementById("result-thought-stream");
      const answerEl = document.getElementById("result-answer-stream");
      if (thoughtEl) thoughtEl.textContent = finalThoughtText;
      if (answerEl) answerEl.innerHTML = finalAnswerHtml;
    }
  }
}

function bindJumps() {
  document.querySelectorAll("[data-jump]").forEach((el) => {
    el.addEventListener("click", () => {
      const target = el.getAttribute("data-jump");
      const agentName = el.getAttribute("data-agent");
      if (agentName) selectedAgent = agentName;
      if (target === "thinking") {
        currentQueryTitle = "如果我问了一个问题非常长的问题如果我问了一个问题非常长的问题如果我问了一个问题非常长的问题";
      }
      render(target, { navTitle: selectedAgent });
    });
  });
  const timedBack = document.querySelector("[data-action='timed-back']");
  if (timedBack) {
    timedBack.addEventListener("click", () => render(timedTasksReturnState || "chat", { navTitle: selectedAgent }));
  }
  const thinkingToggle = document.querySelector("[data-action='toggle-thinking']");
  if (thinkingToggle) {
    thinkingToggle.addEventListener("click", () => {
      const card = thinkingToggle.closest(".thinking");
      card.classList.toggle("expanded");
    });
  }
  const resultToggle = document.querySelector("[data-action='toggle-result-thought']");
  if (resultToggle) {
    resultToggle.addEventListener("click", () => {
      const thought = document.getElementById("result-thought");
      const expanded = thought.classList.toggle("expanded");
      resultToggle.textContent = expanded ? "[收起]" : "[展开]";
    });
  }
  const stopThinking = document.querySelector("[data-action='stop-thinking']");
  if (stopThinking) {
    stopThinking.addEventListener("click", () => {
      stopAllStreams();
      inputArea.innerHTML = getDefaultInputTemplate();
      bindJumps();
    });
  }
}

function openTimedTasks() {
  timedTasksReturnState = currentState === "timedTasks" ? timedTasksReturnState : currentState;
  render("timedTasks");
}

function switchAgent(agentName) {
  if (!agentName) return;
  selectedAgent = agentName;
  render("chat", { navTitle: selectedAgent });
}

navSidebar.addEventListener("click", () => openSidebar("agent-list"));
if (navHistory) {
  navHistory.addEventListener("click", () => openSidebar("platform"));
}
if (navTimer) {
  navTimer.addEventListener("click", () => openTimedTasks());
}
if (navNewChat) {
  navNewChat.addEventListener("click", () => render("chat", { navTitle: selectedAgent, navSubtitle: "新聊天" }));
}
sidebarMask.addEventListener("click", () => closeSidebar());

if (sbSidebarHome) {
  sbSidebarHome.addEventListener("click", () => render("list"));
}
if (sbHomeHeaderRow) {
  sbHomeHeaderRow.addEventListener("click", () => render("list"));
}

sidebarPanel.addEventListener("click", (event) => {
  const newChatTrigger = event.target.closest(".sb-new-chat");
  if (newChatTrigger) {
    render("chat", { navTitle: selectedAgent, navSubtitle: "新聊天" });
    return;
  }
  const sessionItem = event.target.closest(".sb-session-item");
  if (sessionItem) {
    const titleEl = sessionItem.querySelector(".sb-agent-item-text");
    const sessionTitle = titleEl ? titleEl.textContent.trim() : selectedAgent;
    currentQueryTitle = sessionTitle;
    render("result", { navTitle: selectedAgent, navSubtitle: sessionTitle, streamAnswer: false });
    return;
  }
  const agentItem = event.target.closest(".sb-agent-icon-item");
  if (agentItem) {
    const nameEl = agentItem.querySelector(".sb-agent-item-text");
    switchAgent(nameEl ? nameEl.textContent.trim() : "");
  }
});

render("list");
