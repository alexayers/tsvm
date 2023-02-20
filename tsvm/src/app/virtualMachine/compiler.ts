import Parser, {ParseResult, Program} from "./parser";
import Lexer from "./lexer";
import {Token} from "./constants";

export interface CompilerResult {
  status: string
  exitCode: number

  program: Program | undefined
}


export class Compiler {

  private _lexer: Lexer;
  private _parser: Parser;

  constructor() {
    this._lexer = new Lexer();
    this._parser = new Parser();
  }
  compile(code : string) : CompilerResult {
    let tokenStream : Array<Token> = this._lexer.tokenize(code);
    console.log(tokenStream);

    let parseResult : ParseResult = this._parser.parse(tokenStream);
    console.log(parseResult);


    return {
      exitCode: parseResult.exitCode,
      status: parseResult.status,
      program: parseResult.program
    };
  }




}
