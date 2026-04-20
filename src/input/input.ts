import { CanvasContext } from "../render/render";

type Modifier = "Control" | "Alt" | "Shift" | "Meta";
const MODIFIERS: Modifier[] = ["Control", "Alt", "Shift", "Meta"];

type Modifiers = {
  [key in Modifier]: boolean
};

export function modifiersMatch(event: KeyboardEvent, mods: Modifiers) {
  for (const mod of MODIFIERS) {
    if (event.getModifierState(mod) !== mods[mod]) {
      return false;
    }
  }

  return true;
}
/**
 * Keycode as returned by KeyboardEvent
*/
export type KeyCode = string;

/**
 * ID of key binding
*/
export type Keybind = string;

export interface Binding {
  modifiers: Modifiers[];
  default?: Modifier;
  keybind: Keybind;
}

/**
 * Map of KeyCode -> Binding
*/
export interface Bindings {
  [key: KeyCode]: Binding[];
}

export type Keystate = "Up" | "Press" | "Down";

export type KeyListener = (state: Keystate) => void;

export class InputHandler {
  bindings: Bindings = {};
  listeners: KeyListenerSet[] = [];

  constructor({ canvas }: CanvasContext) {
    makeCanvasFocusable(canvas);
    canvas.addEventListener("keydown", (e)=> this.handleKeyboardEvent(e));
    canvas.addEventListener("keypress", (e)=> this.handleKeyboardEvent(e));
    canvas.addEventListener("keyup", (e)=> this.handleKeyboardEvent(e));
  }

  public addListenerSet(set: KeyListenerSet) {
    this.listeners.push(set);
  }

  public removeListenerSet(set: KeyListenerSet) {
    this.listeners.splice(this.listeners.findIndex( (s)=> { s.name == set.name } ), 1);
  }

  public handleKeyboardEvent(event: KeyboardEvent) {
    const { code } = event;

    const bindings = this.bindings[code];
    if (bindings != null) {
      for (const binding of bindings) {
        for (const modSet of binding.modifiers) {
          this.triggerIfMatching(event, binding, modSet);
        }
      }
    }
  }

  public triggerIfMatching(event: KeyboardEvent, binding: Binding, modSet: Modifiers) {
    if (modifiersMatch(event, modSet)) {
      for (const set of this.listeners) {
        set.trigger(binding.keybind, translateKeystate(event.type));
      }
      return;
    }
  }

}

function translateKeystate(type: string) {
  switch (type) {
    case "keydown":
      return "Down"
    case "keypress":
      return "Press"
    case "keyup":
      return "Up"
    default:
      throw new Error(`Invalid type ${type}`);
  }
}

export class KeyListenerSet {
  name: string;
  bindings: { [key: Keybind]: KeyListener; };
  
  constructor(name: string, bindings: { [key: Keybind]: KeyListener }) {
    this.name = name;
    this.bindings = bindings;
  }

  public trigger(key: Keybind, state: Keystate) {
    if (Object.hasOwn(this, key)) {
      this.bindings[key](state);
    }
  }
}

function makeCanvasFocusable(canvas: HTMLCanvasElement) {
  canvas.focus();
  canvas.addEventListener('click', ()=> canvas.focus() );
}







