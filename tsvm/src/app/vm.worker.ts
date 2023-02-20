/// <reference lib="webworker" />

import VirtualMachine from "./virtualMachine/virtualMachine";

const virtualMachine: VirtualMachine = new VirtualMachine();

addEventListener('message', ({data}) => {


  console.log(data);
  virtualMachine.compile(data);

  let outputBuffer : string = virtualMachine.execute();
  postMessage(outputBuffer);
});

