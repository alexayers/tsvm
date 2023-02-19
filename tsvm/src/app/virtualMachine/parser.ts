import {ByteCode, InstructionRule, instructionRules, keywords, Operand, PositionRule, Token} from "./constants";


export interface Program {
  symbolTable?: Map<string, any>
  jumpTable?: Map<string, number>
  byteCodes?: Array<ByteCode>
}

export interface ParseResult {
  status: string
  exitCode: number

  ds?: number
  cs?: number

  program?: Program | undefined
}

export default class Parser {

  private _codeSegment: number;
  private _dataSegment: number;

  private readonly _symbolTable: Map<string, any>
  private readonly _jumpTable: Map<string, number>

  private _byteCodes: Array<ByteCode>

  constructor() {
    this._symbolTable = new Map<string, any>();
    this._jumpTable = new Map<string, number>();
    this._byteCodes = [];

    this._codeSegment = 0;
    this._dataSegment = 0;
  }

  parse(tokenStream: Array<Token>): ParseResult {
    let parseResult: ParseResult = this.pass1(tokenStream);

    if (parseResult.exitCode == 0) {

      // @ts-ignore
      parseResult.program.byteCodes = this.pass2(tokenStream, parseResult);
    }


    return parseResult;
  }

  pass1(tokenStream: Array<Token>): ParseResult {

    let foundCodeSegment: boolean = false;
    let foundDataSegment: boolean = false;
    let parseResult: ParseResult;
    let cs: number = 0;
    let ds: number = 0;

    for (let i = 0; i < tokenStream.length; i++) {
      let token: Token = tokenStream[i];

      if (token.value == ".code") {

        cs = i + 1;
        parseResult = this.syntaxAnalysis(tokenStream, i);

        if (parseResult.exitCode != 0) {
          return parseResult;
        }

        console.log("Syntax Analysis complete...");
        foundCodeSegment = true;
      } else if (token.value == ".data") {

        ds = i + 1;
        parseResult = this.buildSymbolTable(tokenStream, i);

        if (parseResult.exitCode != 0) {
          return parseResult;
        }

        foundDataSegment = true;
        console.log("Symbol Table created...");
        console.log(this._symbolTable);
      }
    }

    if (!foundCodeSegment) {
      return {
        exitCode: 1,
        status: "Unable to find .code segment"
      }
    }

    if (!foundDataSegment) {
      return {
        exitCode: 1,
        status: "Unable to find .data segment"
      }
    }

    console.log("Parser pass1 complete...")

    return {
      exitCode: 0,
      status: "Parsing complete",
      program: {
        jumpTable: this._jumpTable,
        symbolTable: this._symbolTable,
        byteCodes: this._byteCodes
      },
      cs: cs,
      ds: ds
    }
  }

  pass2(tokenStream: Array<Token>, parseResult: ParseResult): Array<ByteCode> {
    let byteCodes: Array<ByteCode> = [];

    // @ts-ignore
    let startingIdx: number = parseResult.cs;
    let endingIdx: number = 0;

    // @ts-ignore
    if (parseResult.ds > parseResult.cs) {
      // @ts-ignore
      endingIdx = parseResult.ds;
    } else {
      endingIdx = tokenStream.length
    }

    for (let i = startingIdx; i < endingIdx; i++) {
      let token: Token = tokenStream[i];

      let op1: string = token.value;

      let byteCode: ByteCode = {
        instructionSize: 0,
        op1: 0,
        op2: 0,
        op2Operand: undefined,
        op3: 0,
        op3Operand: undefined
      };

      // @ts-ignore
      let instructionRule: InstructionRule = instructionRules.get(op1);

      console.log(instructionRule);
      let instructionSize = instructionRule.lineLength;
      byteCode.instructionSize = instructionSize;

      // @ts-ignore
      byteCode.op1 = keywords.get(op1).opCode;

      let token2;
      let token3;

      switch (instructionSize) {
        case 2:

          token2 = tokenStream[i + 1];

          byteCode = this.assignByteCode(token2.value, 2, byteCode);


          i++;
          break;
        case 3:
          token2 = tokenStream[i + 1];
          token3 = tokenStream[i + 2];

          byteCode = this.assignByteCode(token2.value, 2, byteCode);
          byteCode = this.assignByteCode(token3.value, 3, byteCode);

          i += 2;
          break;
      }


      byteCodes.push(byteCode);
    }

    console.log("ByteCode generation complete...");
    return byteCodes;
  }

  private assignByteCode(token: string, position: number, byteCode: ByteCode): ByteCode {
    // @ts-ignore
    if (keywords.has(token) && keywords.get(token).operand == Operand.REGISTER) {

      if (position == 2) {
        // @ts-ignore
        byteCode.op2 = keywords.get(token).opCode;
        byteCode.op2Operand = Operand.REGISTER;
      } else {
// @ts-ignore
        byteCode.op3= keywords.get(token).opCode;
        byteCode.op3Operand = Operand.REGISTER;
      }

      // @ts-ignore
    } else if (this._symbolTable.has(token)) {


      if (position == 2) {

        if (!isNaN(Number(this._symbolTable.get(token)))) {
          // @ts-ignore
          byteCode.op2 = Number(this._symbolTable.get(token));
          byteCode.op2Operand = Operand.NUMBER;
        } else {
          // @ts-ignore
          byteCode.op2 = this._symbolTable.get(token);
          byteCode.op2Operand = Operand.CONSTANT;
        }


      } else {


        if (!isNaN(Number(this._symbolTable.get(token)))) {
          // @ts-ignore
          byteCode.op3 = Number(this._symbolTable.get(token));
          byteCode.op2Operand = Operand.NUMBER;
        } else {
          // @ts-ignore
          byteCode.op3 = this._symbolTable.get(token);
          byteCode.op2Operand = Operand.CONSTANT;
        }

        byteCode.op3Operand = Operand.CONSTANT;
      }
    } else if (!isNaN(Number(token))) {


      if (position == 2) {
        // @ts-ignore
        byteCode.op2 = Number(token);
        byteCode.op2Operand = Operand.NUMBER;
      } else {
        // @ts-ignore
        byteCode.op3 = Number(token);
        byteCode.op3Operand = Operand.NUMBER;
      }

    } else {

      if (token[0] == "\"" && token[token.length - 1] == "\"") {
        if (position == 2) {
          // @ts-ignore
          byteCode.op2 = token;
          byteCode.op2Operand = Operand.CONSTANT;
        } else {
          // @ts-ignore
          byteCode.op3 = token;
          byteCode.op3Operand = Operand.CONSTANT;
        }
      } else {
        console.error(`Compilation error: unable to determine opCode for '${token}'`);
      }


    }


    return byteCode;

  }

  private syntaxAnalysis(tokenStream: Array<Token>, idx: number): ParseResult {

    idx++; // Skip pass .code
    let line: number = 1;

    do {
      let token: Token = tokenStream[idx];

      if (token.operand != Operand.INSTRUCTION) {

        if (token.value == ".data") {
          return {
            exitCode: 0,
            status: `ok`
          }
        } else if (token.value[token.value.length - 1] == ":") {
          this._jumpTable.set(token.value.replace(":", ""), line + 1);
          idx++;
          continue;
        } else {
          return {
            exitCode: 1,
            status: `Expected instruction but found '${token.value}' found on line ${line}.`
          }
        }
      }

      if (!instructionRules.has(token.value)) {
        return {
          exitCode: 1,
          status: `Invalid instruction '${token.value}' found on line ${line}.`
        }
      }

      let parseResult: ParseResult;

      if (instructionRules.has(token.value)) {

        //@ts-ignore
        switch (instructionRules.get(token.value).lineLength) {
          case 1:

            idx++;
            break;
          case 2:
            parseResult = this.evaluateLine(tokenStream[idx].value, tokenStream[idx + 1].value);

            if (parseResult.exitCode != 0) {
              parseResult.status += ` on line ${line}`;
              return parseResult;
            }

            idx += 2;
            break;
          case 3:
            parseResult = this.evaluateLine(tokenStream[idx].value, tokenStream[idx + 1].value, tokenStream[idx + 2].value);

            if (parseResult.exitCode != 0) {
              parseResult.status += ` on line ${line}`;

              return parseResult;
            }

            idx += 3;
            break;
        }

      }


      line++;
    } while (idx < tokenStream.length);

    return {
      exitCode: 0,
      status: "ok"
    };
  }

  private evaluateLine(op1: string, op2: string, op3: string = ""): ParseResult {

    // @ts-ignore
    let instructionRule: InstructionRule = instructionRules.get(op1);


    //@ts-ignore
    if (instructionRule.position1 == PositionRule.REGISTER) {

      // @ts-ignore
      if (!keywords.has(op2) || keywords.get(op2).operand != Operand.REGISTER) {
        return {
          exitCode: 1,
          status: `Expected register in position 2 but found '${op2}'`
        }
      }
    } else if (instructionRule.position1 == PositionRule.CONSTANT) {

      // @ts-ignore
      if (keywords.has(op2)) {
        return {
          exitCode: 1,
          status: `Expected constant in position 2 but found '${op2}'`
        }
      }

      // @ts-ignore
      if (!this._symbolTable.has(op2) && Number.isInteger(op2)) {
        return {
          exitCode: 1,
          status: `Unrecognized symbol in position 2 '${op2}'`
        }
      }
    }

    if (op3 != "") {

      if (!this._symbolTable.has(op3)) {

        // @ts-ignore
        if (keywords.has(op3) && keywords.get(op3).operand != Operand.REGISTER) {
          return {
            exitCode: 1,
            status: `Unexpected instruction in position 3 '${op3}'`
          }
        } else { // @ts-ignore
          if (keywords.has(op3) && keywords.get(op3).operand == Operand.REGISTER) {
            return {
              exitCode: 0,
              status: "ok"
            }
          }
        }

        if (isNaN(Number(op3))) {

          if (op3[0] != "\"" && op3[op3.length -1] != "\"") {
            return {
              exitCode: 1,
              status: `Unrecognized symbol in position 3 '${op3}'`
            }
          }

        }
      }
    }

    return {
      exitCode: 0,
      status: "ok"
    }

  }

  private buildSymbolTable(tokenStream: Array<Token>, idx: number): ParseResult {

    for (let i = idx + 1; i < tokenStream.length; i += 2) {
      let variableName = tokenStream[i].value;
      let variableValue = tokenStream[i + 1].value;

      if (variableName == ".code") {
        break;
      }

      if (this._symbolTable.has(variableName)) {
        return {
          exitCode: 1,
          status: "Duplicate variable name defined"
        }
      } else if (keywords.has(variableName)) {

        return {
          exitCode: 1,
          status: `You can't use registered operand '${variableName}' as a variable name`
        }
      } else if (!isNaN(Number(variableName))) {
        return {
          exitCode: 1,
          status: `You can't use the number '${variableName}' as a variable name`
        }
      } else {
        this._symbolTable.set(variableName, variableValue);
      }
    }

    return {
      exitCode: 0,
      status: "ok",
    }

  }
}
