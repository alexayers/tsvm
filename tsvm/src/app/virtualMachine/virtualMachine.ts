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

  private _running: boolean;

  private _program?: Program;

  constructor() {
    this._compiler = new Compiler();

    this._running = true;
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
    let compilerResult: CompilerResult = this._compiler.compile(code);

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

      let cpuTick: number = 0;

      // @ts-ignore
      do {

        let byteCode: ByteCode = this.fetch();

        if (byteCode.instructionSize == -1) {
          this._running = false;
          console.log("CPU: Segment fault. Exiting");

          // @ts-ignore
        } else if (cpuTick > (this._program.byteCodes.length * 100)) {
          this._running  = false;
          return "CPU: Infinite Loop detected. Exiting";
        } else {
          this.decode(byteCode);
        }

        cpuTick++;
      } while (this._running );

    }
    return this._outputBuffer;
  }

  private fetch(): ByteCode {

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

        for (let i = 0; i < 32; i++) {
          this._stack.push(this._registers[i]);
        }

        break;
      case Instruction.POPA:
        ;
        for (let i = 31; i >= 0; i--) {
          this._registers[i] = this._stack.pop();
        }

        break
      case Instruction.RET:

        for (let i = 31; i >= 0; i--) {
          this._registers[i] = this._stack.pop();
        }

        this._ip = this._stack.pop();

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
        this._registers[byteCode.op2] = this._stack.pop();
        break;
      case Instruction.JMP:

        this._ip = byteCode.op2;

        break;
      case Instruction.JL:

        if (this._flags[Flag.ZERO] == 0 && this._flags[Flag.CARRY] == 1) {
          this._ip = byteCode.op2;
        }

        break;
      case Instruction.JG:

        if (this._flags[Flag.ZERO] == 0 && this._flags[Flag.CARRY] == 0) {
          this._ip = byteCode.op2;
        }

        break;
      case Instruction.JGE:

        if (this._flags[Flag.ZERO] == 1 || this._flags[Flag.CARRY] == 0) {
          this._ip = byteCode.op2;
        }

        break;
      case Instruction.JLE:

        if (this._flags[Flag.ZERO] == 1 || this._flags[Flag.CARRY] == 1) {
          this._ip = byteCode.op2;
        }

        break;
      case Instruction.JNE:
        if (this._flags[Flag.ZERO] == 0) {
          this._ip = byteCode.op2;
        }
        break;
      case Instruction.CALL:

        this._stack.push(this._ip);

        for (let i = 0; i < 32; i++) {
          this._stack.push(this._registers[i]);
        }

        this._ip = byteCode.op2;

        break;
      case Instruction.INT:
        switch (byteCode.op2) {
          case 1:
            this.handleIO(byteCode);
            break;

        }
        break;
    }
  }

  private handleThreeInstructionLine(byteCode: ByteCode) {

    switch (byteCode.op1) {
      case Instruction.MOV:

        if (byteCode.op3Operand == Operand.REGISTER) {
          this._registers[byteCode.op2] = this._registers[byteCode.op3];
        } else if (byteCode.op3Operand == Operand.NUMBER) {
          this._registers[byteCode.op2] = byteCode.op3;
        } else if (byteCode.op3Operand == Operand.CONSTANT) {
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

    switch (this._registers[31]) {
      case 0:
        this._outputBuffer += this._registers[0] + "<br>";
        break;
      case 1:
        this._outputBuffer += ":";
        this._running = false;
        break;
    }

  }
}
