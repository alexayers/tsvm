import {Compiler, CompilerResult} from "./compiler";
import {ParseResult} from "./parser";


export default class VirtualMachine {

  private _compiler: Compiler;
  private _response: string = "";
  private _ip: number;
  private _sp: number;
  private _registers: Array<any>;
  private _stack: Array<any>;

  constructor() {
    this._compiler = new Compiler();
    this._ip = 0;
    this._sp = 0;
    this._registers = [];
    this._stack = [];
  }


  compile(code: string): void {
    let result: CompilerResult = this._compiler.compile(code);
    this._response = result.status;
  }

  execute(): string {
    return this._response;
  }

}
