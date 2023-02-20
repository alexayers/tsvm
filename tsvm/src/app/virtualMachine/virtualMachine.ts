import {Compiler, CompilerResult} from "./compiler";
import {Program} from "./parser";
import {ByteCode, Instruction, Operand} from "./constants";

export enum Flag {
  ZERO,
  CARRY,
  SIGN,
  OVERFLOW
}

export default class VirtualMachine {

  private _compiler: Compiler;
  private _outputBuffer: string = "";
  private _ip: number;
  private _sp: number;

  private _flags: Array<Flag>;
  private _registers: Array<any>;
  private _stack: Array<any>;

  private _program?: Program;

  constructor() {
    this._compiler = new Compiler();

    this._ip = 0;
    this._sp = 0;
    this._flags = [];

    for (let i = 0; i < 4; i++) {
      this._flags[i] = 0;
    }

    this._registers = [];
    for (let i = 0; i < 32; i++) {
      this._registers.push(null);
    }

    this._stack = [];


  }


  compile(code: string): void {
    let compilerResult : CompilerResult = this._compiler.compile(code);

    if (compilerResult.exitCode != 0) {
      this._outputBuffer = compilerResult.status;
    } else {
      this._program = compilerResult.program
    }

  }

  execute(): string {

    if (this._program) {
      this._outputBuffer = "";
      console.log("Executing program");
      let running : boolean = true;

      // @ts-ignore
      do {

        let byteCode : ByteCode = this.fetch();

        console.log(`Fetched ${JSON.stringify(byteCode)}`);

        if (byteCode.instructionSize == -1) {
          running = false;
          console.log("CPU: Segment fault. Exiting");
        } else {
          this.decode(byteCode);
        }

        console.debug(`Registers: ${this._registers}`);

      } while (running);

    }
    return this._outputBuffer;
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

    switch (byteCode.instructionSize) {
      case 1:
        this.handleSingleInstructionLine(byteCode);
        break;
      case 2:
        this.handleTwoInstructionLine(byteCode);
        break;
      case 3:
        this.handleThreeInstructionLine(byteCode);
        break;
    }

  }


  private handleSingleInstructionLine(byteCode: ByteCode) {
    switch (byteCode.op1) {

      case Instruction.PUSHA:
        break;
      case Instruction.POPA:
        break;
      case Instruction.RET:
        break;
    }
  }

  private handleTwoInstructionLine(byteCode: ByteCode) {
    switch (byteCode.op1) {
      case Instruction.INC:
          this._registers[byteCode.op2]++;
        break;
      case Instruction.DEC:
        this._registers[byteCode.op2]--;
        break;
      case Instruction.NEG:
        this._registers[byteCode.op2] *= -1;
        break;
      case Instruction.PUSH:

        if (byteCode.op2Operand == Operand.REGISTER) {
          this._stack.push(this._registers[byteCode.op2]);
        } else if (byteCode.op2Operand == Operand.NUMBER) {
          this._stack.push(byteCode.op2);
        }

        break;
      case Instruction.POP:
        this._registers[byteCode.op2] =  this._stack.pop();
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
      case Instruction.CALL:
        break;
      case Instruction.INT:
        switch ( byteCode.op2) {
          case 1:
              this.handleIO(byteCode);
            break;
        }
        break;
    }
  }

  private handleThreeInstructionLine(byteCode: ByteCode) {

    console.log(byteCode.op1)
    switch (byteCode.op1) {
      case Instruction.MOV:

        if (byteCode.op3Operand == Operand.REGISTER) {
          this._registers[byteCode.op2] = this._registers[byteCode.op3];
        } else if (byteCode.op3Operand == Operand.NUMBER) {
          this._registers[byteCode.op2] = byteCode.op3;
        }

        break;
      case Instruction.LEA:
        break;
      case Instruction.ADD:

        if (byteCode.op3Operand == Operand.REGISTER) {
          this._registers[byteCode.op2] += this._registers[byteCode.op3];
        } else if (byteCode.op3Operand == Operand.NUMBER) {
          this._registers[byteCode.op2] += byteCode.op3;
        }

        break;
      case Instruction.SUB:

        if (byteCode.op3Operand == Operand.REGISTER) {
          this._registers[byteCode.op2] -= this._registers[byteCode.op3];
        } else if (byteCode.op3Operand == Operand.NUMBER) {
          this._registers[byteCode.op2] -= byteCode.op3;
        }

        break;
      case Instruction.DIV:
        if (byteCode.op3Operand == Operand.REGISTER) {
          this._registers[byteCode.op2] /= this._registers[byteCode.op3];
        } else if (byteCode.op3Operand == Operand.NUMBER) {
          this._registers[byteCode.op2] /= byteCode.op3;
        }
        break;
      case Instruction.MUL:
        if (byteCode.op3Operand == Operand.REGISTER) {
          this._registers[byteCode.op2] *= this._registers[byteCode.op3];
        } else if (byteCode.op3Operand == Operand.NUMBER) {
          this._registers[byteCode.op2] *= byteCode.op3;
        }
        break;
      case Instruction.AND:
        if (byteCode.op3Operand == Operand.REGISTER) {
          this._registers[byteCode.op2] &= this._registers[byteCode.op3];
        } else if (byteCode.op3Operand == Operand.NUMBER) {
          this._registers[byteCode.op2] &= byteCode.op3;
        }
        break;
      case Instruction.OR:
        if (byteCode.op3Operand == Operand.REGISTER) {
          this._registers[byteCode.op2] |= this._registers[byteCode.op3];
        } else if (byteCode.op3Operand == Operand.NUMBER) {
          this._registers[byteCode.op2] |= byteCode.op3;
        }
        break;
      case Instruction.NOT:

        break;
      case Instruction.XOR:
        if (byteCode.op3Operand == Operand.REGISTER) {
          this._registers[byteCode.op2] ^= this._registers[byteCode.op3];
        } else if (byteCode.op3Operand == Operand.NUMBER) {
          this._registers[byteCode.op2] ^= byteCode.op3;
        }
        break;
      case Instruction.CMP:

        if (byteCode.op3Operand == Operand.REGISTER) {

          if (this._registers[byteCode.op2] == this._registers[byteCode.op3]) {
            this._flags[Flag.ZERO] = 1;
          } else {
            this._flags[Flag.ZERO] = 0;
          }

          if (this._registers[byteCode.op2] > this._registers[byteCode.op3]) {
            this._flags[Flag.CARRY] = 0;
          }

          if (this._registers[byteCode.op2] < this._registers[byteCode.op3]) {
            this._flags[Flag.CARRY] = 1;
          }

        } else if (byteCode.op3Operand == Operand.NUMBER) {
          if (this._registers[byteCode.op2] == byteCode.op3) {
            this._flags[Flag.ZERO] = 1;
          } else {
            this._flags[Flag.ZERO] = 0;
          }

          if (this._registers[byteCode.op2] > byteCode.op3) {
            this._flags[Flag.CARRY] = 0;
          }

          if (this._registers[byteCode.op2] < byteCode.op3) {
            this._flags[Flag.CARRY] = 1;
          }
        }

        break;


    }
  }

  private handleIO(byteCode: ByteCode) {
    let io : number = this._registers[31];

    this._outputBuffer += this._registers[0] + "<br>";
  }
}
