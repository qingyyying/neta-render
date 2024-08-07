import { NetaGraph } from "../NetaGraph";
import { BEHAVIOR } from "../register";
import { RefBehavior, RefBehaviorItem, RegBhvType } from "../types/register";
import { EVENT_TYPE } from "./config";

export class BuiltInEvent {
  private instance: NetaGraph;
  private behaviors: RegBhvType[] = [];
  private propsBhvs: RefBehaviorItem[] = [];

  constructor(instance: NetaGraph, registerEvent: RegBhvType[], optBhvs?: RefBehavior[]) {
    this.instance = instance;
    this.propsBhvs = optBhvs.filter((i) => typeof i !== "string");
    // 加载注册内置的behavior
    if (Array.isArray(optBhvs)) {
      for (const val of optBhvs) {
        let modules = [];
        if (typeof val === "string") {
          const _modules = Object.values(BEHAVIOR).filter(
            (i) => i.name === val
          );
          modules = [...modules, ..._modules];
        } else {
          const _name = val.key;
          const _modules = Object.values(BEHAVIOR).filter(
            (i) => i.name === _name
          );
          modules = [...modules, ..._modules];
        }
        modules.forEach((m) => {
          this.behaviors[m.name] = m;
        });
      }
    }

    // 加载自定义的behavior
    if (Array.isArray(registerEvent)) {
      for (const regEvent of registerEvent) {
        this.behaviors[regEvent.name] = regEvent;
      }
    }

    const _this = this;
    for (const key in EVENT_TYPE) {
      this[`EVENT_${key}`] = function (event) {
        const name = EVENT_TYPE[key];
        _this.loadEvent(name, [event]);
      };
    }
  }

  init() {
    for (const behaviorKey in this.behaviors) {
      const behaviorIns = this.behaviors[behaviorKey];
      if (typeof behaviorIns?.render?.init == "function") {
        const _options =
          this.propsBhvs.find((item) => item.key == behaviorKey)?.options ?? {};
        const originThis = behaviorIns.render;
        behaviorIns.render.init.apply(this, [{ ..._options, originThis }]);
      }
    }

    for (const key in this) {
      if (!key.startsWith("EVENT_")) continue;
      const eventKey = key.slice(6);
      this.instance.on(EVENT_TYPE[eventKey], this[key].bind(this));
    }
  }

  destroy() {
    for (const behaviorKey in this.behaviors) {
      const behaviorIns = this.behaviors[behaviorKey];
      if (typeof behaviorIns?.render?.destroy == "function") {
        behaviorIns.render.destroy.apply(this, null);
      }
    }

    for (const key in this) {
      if (!key.startsWith("EVENT_")) continue;

      const eventKey = key.slice(6);
      this.instance.off(EVENT_TYPE[eventKey], this[key]);
    }
  }

  loadEvent(name: string, args: any[]) {
    for (const behaviorKey in this.behaviors) {
      const behaviorIns = this.behaviors[behaviorKey];
      const events = behaviorIns.render.getEvents();
      const evnetName = events[name];

      if (typeof behaviorIns.render[evnetName] == "function") {
        // throw new Error("当前挂载的behavior动作异常");
        const originThis = behaviorIns.render;

        if (typeof args[0] === "object") {
          args[0].originThis = originThis;
        }
        behaviorIns.render[evnetName].apply(this, [...args]);
      }
    }
  }
}
