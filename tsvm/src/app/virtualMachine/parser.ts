import {instructionRules, keywords, Operand, PositionRule, Token} from "./keywords";


export interface ParseResult {
  status: string
  exitCode: number

  symbolTable?: Map<string, any>
  jumpTable?: Map<string, number>
}

export default class Parser {

  private _codeSegment: number;
  private _dataSegment: number;

  private readonly _symbolTable: Map<string, any>
  private readonly _jumpTable: Map<string, number>

  constructor() {
    this._symbolTable = new Map<string, any>();
    this._jumpTable = new Map<string, number>();

    this._codeSegment = 0;
    this._dataSegment = 0;
  }

  parse(tokenStream: Array<Token>): ParseResult {
    let parseResult: ParseResult = this.pass1(tokenStream);

    return parseResult;
  }

  pass1(tokenStream: Array<Token>): ParseResult {

    let foundCodeSegment: boolean = false;
    let foundDataSegment: boolean = false;
    let parseResult: ParseResult;

    for (let i = 0; i < tokenStream.length; i++) {
      let token: Token = tokenStream[i];

      if (token.value == ".code") {
        parseResult = this.syntaxAnalysis(tokenStream, i);
        if (parseResult.exitCode != 0) {
          return parseResult;
        }

        foundCodeSegment = true;
      } else if (token.value == ".data") {
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
      symbolTable: this._symbolTable,
      jumpTable: this._jumpTable
    }
  }

  pass2(tokenStream: Array<Token>) {

  }

  isValidStream(tokenStream: Array<Token>): boolean {


    return true;
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
          return {
            exitCode: 1,
            status: `Unrecognized symbol in position 3 '${op3}'`
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
