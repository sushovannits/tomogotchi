module.exports = class Action {
  constructor(name) {
    this.name = name;
  }
  onInvokeHandler(handler) {
    this.onInvokeHandler = handler;
  }
  onRegister(pet) {
    pet.actionMap[this.name] = this;
  }
}