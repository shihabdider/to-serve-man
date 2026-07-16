import {
  CONTEXT_ITEM_DEFINITIONS,
  CONTEXT_ITEM_KINDS,
  addContextItem,
  contextQuality,
  contextUsage,
  createContextWindow,
  type ContextItemKind,
  type ContextWindow,
} from "../domain/context-window";

const COPY_LABEL = "Copy code to clipboard";
const COPIED_LABEL = "Copied to clipboard";
const COPY_FAILED_LABEL = "Could not copy code";

/** Copy through the modern API, with a selection fallback for restrictive browsers. */
async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.readOnly = true;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copyCommand = (document as unknown as { execCommand(command: string): boolean }).execCommand.bind(document);
    const copied = copyCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("Browser rejected the copy command");
  }
}

/** Add one progressively enhanced copy control to a rendered Markdown code block. */
function bindCopyButton(pre: HTMLPreElement): void {
  if (pre.parentElement?.classList.contains("code-block")) return;

  const code = pre.querySelector("code");
  if (code === null) return;

  const wrapper = document.createElement("div");
  wrapper.className = "code-block";
  pre.before(wrapper);
  wrapper.append(pre);

  const button = document.createElement("button");
  button.className = "copy-button";
  button.type = "button";
  button.title = COPY_LABEL;

  const icon = document.createElement("span");
  icon.className = "copy-button__icon";
  icon.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");
  label.className = "visually-hidden";
  label.textContent = COPY_LABEL;
  label.setAttribute("aria-live", "polite");

  button.append(icon, label);
  wrapper.append(button);

  let resetTimer: number | undefined;
  button.addEventListener("click", async () => {
    delete button.dataset.copied;
    delete button.dataset.copyFailed;

    try {
      await copyText(code.textContent ?? "");
      button.dataset.copied = "true";
      button.title = COPIED_LABEL;
      label.textContent = COPIED_LABEL;
    } catch {
      button.dataset.copyFailed = "true";
      button.title = COPY_FAILED_LABEL;
      label.textContent = COPY_FAILED_LABEL;
    }

    if (resetTimer !== undefined) window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      delete button.dataset.copied;
      delete button.dataset.copyFailed;
      button.title = COPY_LABEL;
      label.textContent = COPY_LABEL;
    }, 1800);
  });
}

function formatPercentage(value: number): string {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

function contextItemElement(kind: ContextItemKind, id: number): HTMLSpanElement {
  const definition = CONTEXT_ITEM_DEFINITIONS[kind];
  const item = document.createElement("span");
  item.className = `context-window__item context-window__item--${kind}`;
  item.dataset.tooltip = definition.tooltip;
  item.style.setProperty("--context-size", `${definition.size}%`);
  item.tabIndex = 0;
  item.setAttribute("role", "listitem");
  item.setAttribute("aria-label", definition.tooltip);
  item.textContent = definition.shortLabel;
  item.dataset.contextItem = String(id);
  return item;
}

/** Build the small stateful context-window illustration at its Markdown-authored marker. */
function bindContextWindow(root: HTMLElement): void {
  if (root.dataset.contextWindowBound !== undefined) return;
  root.dataset.contextWindowBound = "true";
  root.classList.add("context-window");
  root.setAttribute("role", "group");
  root.setAttribute("aria-label", "Chat context illustration");

  const contextHeader = document.createElement("div");
  contextHeader.className = "context-window__header";
  const contextLabel = document.createElement("span");
  contextLabel.textContent = "Context";
  const usageOutput = document.createElement("output");
  usageOutput.dataset.contextUsage = "";
  contextHeader.append(contextLabel, usageOutput);

  const contextTrack = document.createElement("div");
  contextTrack.className = "context-window__track";
  const contextItems = document.createElement("div");
  contextItems.className = "context-window__items";
  contextItems.setAttribute("role", "list");
  contextItems.setAttribute("aria-label", "Context sources");
  const threshold = document.createElement("span");
  threshold.className = "context-window__threshold";
  threshold.setAttribute("aria-hidden", "true");
  contextTrack.append(contextItems, threshold);

  const qualityHeader = document.createElement("div");
  qualityHeader.className = "context-window__header context-window__header--quality";
  const qualityLabel = document.createElement("span");
  qualityLabel.textContent = "Quality";
  const qualityOutput = document.createElement("output");
  qualityOutput.dataset.contextQuality = "";
  qualityHeader.append(qualityLabel, qualityOutput);

  const qualityTrack = document.createElement("div");
  qualityTrack.className = "context-window__quality";
  qualityTrack.setAttribute("role", "progressbar");
  qualityTrack.setAttribute("aria-label", "Illustrative output quality");
  qualityTrack.setAttribute("aria-valuemin", "0");
  qualityTrack.setAttribute("aria-valuemax", "100");
  const qualityFill = document.createElement("span");
  qualityFill.className = "context-window__quality-fill";
  qualityTrack.append(qualityFill);

  const controls = document.createElement("div");
  controls.className = "context-window__controls";
  const addButtons = new Map<ContextItemKind, HTMLButtonElement>();
  for (const kind of CONTEXT_ITEM_KINDS) {
    const definition = CONTEXT_ITEM_DEFINITIONS[kind];
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.contextAdd = kind;
    button.dataset.tooltip = `Add ${definition.tooltip.toLowerCase()}`;
    button.textContent = `+ ${definition.label}`;
    addButtons.set(kind, button);
    controls.append(button);
  }

  const reset = document.createElement("button");
  reset.className = "context-window__reset";
  reset.type = "button";
  reset.textContent = "↺";
  reset.setAttribute("aria-label", "Reset context");
  reset.dataset.tooltip = "Reset context";
  controls.append(reset);

  const note = document.createElement("p");
  note.className = "visually-hidden";
  note.textContent = "Illustrative only. Add context sources and observe the quality estimate after 40 percent usage.";

  root.replaceChildren(contextHeader, contextTrack, qualityHeader, qualityTrack, controls, note);

  let model = createContextWindow();
  const render = (window: ContextWindow): void => {
    const usage = contextUsage(window);
    const quality = contextQuality(window);
    usageOutput.value = formatPercentage(usage);
    qualityOutput.value = formatPercentage(quality);
    qualityTrack.setAttribute("aria-valuenow", String(quality));
    qualityFill.style.inlineSize = `${quality}%`;
    contextItems.replaceChildren(...window.items.map((item) => contextItemElement(item.kind, item.id)));
    root.toggleAttribute("data-degraded", usage > 40);

    for (const [kind, button] of addButtons) {
      button.disabled = usage + CONTEXT_ITEM_DEFINITIONS[kind].size > 100;
    }
  };

  for (const [kind, button] of addButtons) {
    button.addEventListener("click", () => {
      model = addContextItem(model, kind);
      render(model);
    });
  }
  reset.addEventListener("click", () => {
    model = createContextWindow();
    render(model);
  });

  render(model);
}

for (const root of document.querySelectorAll<HTMLElement>("[data-article-tools]")) {
  for (const pre of root.querySelectorAll<HTMLPreElement>(".prose pre")) bindCopyButton(pre);
  for (const widget of root.querySelectorAll<HTMLElement>("[data-context-window]")) bindContextWindow(widget);
}
