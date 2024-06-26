import { isString } from "lodash-es";
import { TEMPORARY_CREATE_EDGE_ID } from "../../config";
import { EVENT_TYPE } from "../../events/config";

const clickEditNode = {
  name: "clic-edit-node",
  render: {
    id: null,
    renderContainer: null,
    init() {},
    destroy() {},
    getEvents() {
      return {
        "graphics:pointerdown": "onPointerDown",
        [EVENT_TYPE.CANVAS_POINTERDOWN]: "onCanvasClick",
      };
    },
    onPointerDown(evt) {
      if (!isString(evt.container?.html)) return;
      clickEditNode.render.renderContainer = evt.container;
      const bbox = evt.container.getBBox();
      clickEditNode.render.id = "stagehtml-" + evt.container.id;
      const stageChildren =
        this.instance.el.querySelectorAll("[id^='stagehtml-']");
      for (const child of stageChildren) {
        this.instance.el.removeChild(child);
      }
      const newEle = document.createElement("div");
      newEle.id = clickEditNode.render.id;
      newEle.innerHTML = evt.container.html;
      const input = newEle.querySelector("input");
      const getText = input.getAttribute("text");
      input.value = getText;

      newEle.style.position = "absolute";
      newEle.style.left = evt.target.x / 2 + "px";
      newEle.style.top = evt.target.y / 2 + "px";
      newEle.style.width = (bbox.maxX - bbox.minX) / 2 + "px";
      newEle.style.height = (bbox.maxY - bbox.minY) / 2 + "px";

      this.instance.el.appendChild(newEle);

      setTimeout(() => {
        input.focus();
      });
    },
    onCanvasClick(evt) {
      if (clickEditNode.render.id) {
        const stageChild = this.instance.el.querySelector(
          `#${clickEditNode.render.id}`
        );
        const text = stageChild.querySelector("input").value;

        const targetId = clickEditNode.render.renderContainer.id;
        this.instance.updateNodeData({
          id: targetId,
          text,
        });
        // stageChild && this.instance.el.removeChild(stageChild);
        const stageChildren =
          this.instance.el.querySelectorAll("[id^='stagehtml-']");
        for (const child of stageChildren) {
          this.instance.el.removeChild(child);
        }
      }
    },
  },
};

export default clickEditNode;
