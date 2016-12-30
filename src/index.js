import { Module } from 'module';

let _load = null;

function nanosecondsSince(time) {
  let delta = process.hrtime(time);
  return delta[0] * 1e9 + delta[1];
}

export function instrument() {

}

export function _installLoadWrapper(callback) {
  _load = Module._load;
  Module._load = function(requestedModuleId, parent) {
    let start = process.hrtime();

    let returnValue = _load.apply(Module, arguments);

    let info = {
      requestedModuleId,
      parentModuleId: parent.id,
      duration: nanosecondsSince(start)
    };

    callback(info);

    return returnValue;
  };
}

export function reset() {
  if (_load) {
    Module._load = _load;
  }
}
