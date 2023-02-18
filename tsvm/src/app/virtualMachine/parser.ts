
import {keywords, Token} from "./keywords";


export interface ParseResult {
  status: string
  exitCode : number

  symbolTable?: Map<string, any>
}

export default class Parser {

  private _codeSegment: number;
  private _dataSegment: number;

  private _symbolTable:Map<string, any>

  constructor() {
    this._symbolTable = new Map<string, any>();
    this._codeSegment = 0;
    this._dataSegment =0;
  }

  parse(tokenStream:Array<Token>) : ParseResult {
    let parseResult : ParseResult = this.pass1(tokenStream);

    return parseResult;
  }

  pass1(tokenStream:Array<Token>) : ParseResult {

    let foundCodeSegment : boolean = false;
    let foundDataSegment : boolean = false;
    let parseResult : ParseResult;

    for (let i = 0; i < tokenStream.length; i++) {
      let token : Token = tokenStream[i];

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

    return {
      exitCode: 0,
      status: "Parsing complete",
      symbolTable: this._symbolTable
    }
  }

  pass2(tokenStream:Array<Token>) {

  }

  isValidStream(tokenStream:Array<Token>) : boolean {


    return true;
  }

  private syntaxAnalysis(tokenStream: Array<Token>, idx: number) : ParseResult {

    return {
      exitCode: 0,
      status: "ok"
    };
  }

  private buildSymbolTable(tokenStream: Array<Token>, idx: number) : ParseResult {

    for (let i = idx + 1; i < tokenStream.length; i+= 2) {
      let variableName = tokenStream[i].value;
      let variableValue = tokenStream[i+1].value;

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
