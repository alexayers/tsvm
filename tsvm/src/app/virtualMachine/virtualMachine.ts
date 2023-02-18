
import {Compiler} from "./compiler";
import {ParseResult} from "./parser";


export default class VirtualMachine {

    private _compiler: Compiler;
    private _response: string = "";

    constructor() {
      this._compiler = new Compiler();
    }


  compile(code : string) : void {
      let result : ParseResult = this._compiler.compile(code);
      this._response = result.status;
  }

  execute() : string {
    return this._response;
  }

}
