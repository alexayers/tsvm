/// <reference lib="webworker" />

import VirtualMachine from "./virtualMachine/virtualMachine";

const virtualMachine: VirtualMachine = new VirtualMachine();

addEventListener('message', ({data}) => {


  virtualMachine.compile(data);

  const response = virtualMachine.execute();
  postMessage(response);
});
