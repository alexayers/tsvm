import Lexer, {Token} from "./lexer";


export default class VirtualMachine {


  private _lexer: Lexer;

  constructor() {
    this._lexer = new Lexer();
  }

  compile(code : string) : void {
    let tokenStream : Array<Token> = this._lexer.tokenize(code);

    console.log(tokenStream);
  }

  execute() : string {
    return "ok";
  }

}
