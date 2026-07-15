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

for (const root of document.querySelectorAll<HTMLElement>("[data-article-tools]")) {
  for (const pre of root.querySelectorAll<HTMLPreElement>(".prose pre")) bindCopyButton(pre);
}
