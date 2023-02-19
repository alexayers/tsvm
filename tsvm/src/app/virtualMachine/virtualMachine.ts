import {Compiler, CompilerResult} from "./compiler";
import {ParseResult, Program} from "./parser";
import {ByteCode, Instruction} from "./constants";


export default class VirtualMachine {

  private _compiler: Compiler;
  private _response: string = "";
  private _ip: number;
  private _sp: number;
  private _registers: Array<any>;
  private _stack: Array<any>;

  private _program?: Program;

  constructor() {
    this._compiler = new Compiler();

    this._ip = 0;
    this._sp = 0;

    this._registers = [];
    for (let i = 0; i < 10; i++) {
      this._registers.push(null);
    }

    this._stack = [];


  }


  compile(code: string): void {
    let compilerResult : CompilerResult = this._compiler.compile(code);

    if (compilerResult.exitCode != 0) {
      this._response = compilerResult.status;
    } else {
      this._program = compilerResult.program
    }

  }

  execute(): string {

    if (this._program) {
      console.log("Executing program");
      let running : boolean = true;

      // @ts-ignore
      do {

        let byteCode : ByteCode = this.fetch();

        if (byteCode.instructionSize == -1) {
          running = false;
          console.log("CPU: Segment fault. Exiting");
        } else {
          this.decode(byteCode);
        }

      } while (running);

    }
    return this._response;
  }

  private fetch() : ByteCode {

    if (this._program) {
      let byteCode: ByteCode | undefined = this._program?.byteCodes?.[this._ip];
      this._ip++;

      if (byteCode) {
        return byteCode;
      } else {
        return {
          instructionSize: -1, op1: 0, op2: undefined, op2Operand: undefined, op3: undefined, op3Operand: undefined
        };
      }
    }

    return {
      instructionSize: -1, op1: 0, op2: undefined, op2Operand: undefined, op3: undefined, op3Operand: undefined
    };
  }

  private decode(byteCode: ByteCode) {
    switch (byteCode.op1) {
      case Instruction.MOV:
        break;
      case Instruction.LEA:
        break;
      case Instruction.ADD:
        break;
      case Instruction.SUB:
        break;
      case Instruction.DIV:
        break;
      case Instruction.MUL:
        break;
      case Instruction.INC:
        break;
      case Instruction.DEC:
        break;
      case Instruction.AND:
        break;
      case Instruction.OR:
        break;
      case Instruction.NOT:
        break;
      case Instruction.XOR:
        break;
      case Instruction.NEG:
        break;
      case Instruction.CMP:
        break;
      case Instruction.JMP:
        break;
      case Instruction.JL:
        break;
      case Instruction.JG:
        break;
      case Instruction.JGE:
        break;
      case Instruction.JLE:
        break;
      case Instruction.JNE:
        break;
      case Instruction.PUSH:
        break;
      case Instruction.POP:
        break;
      case Instruction.PUSHA:
        break;
      case Instruction.POPA:
        break;
      case Instruction.CALL:
        break;
      case Instruction.RET:
        break;
      case Instruction.INT:
        break;
    }
  }


}
