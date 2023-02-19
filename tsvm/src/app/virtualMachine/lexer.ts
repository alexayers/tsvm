import {keywords, Operand, Token} from "./constants";



export default class Lexer {

  private _tokenStream: Array<Token> = [];

  tokenize(code : string)  : Array<Token> {

    let token: string = "";

    for (let i = 0; i < code.length; i++) {

      let ch : string = code[i];

      if (ch == '\n' || ch == ' ') { // Must be a new token at line break or a quote
        this.addToken(token);
        token = "";
      } else if (ch == '\"') { // Handle quoted strings
        this.addToken(token);

        do {
          ch = code[i];

          if (ch != '\n') {
            token += ch;
          }

          i++;
        } while (ch != '\n');
        this.addToken(token);
        token = "";
        i--;
      } else if (ch == ';') { // Skip comments
        do {
          ch = code[i];
          i++;
        } while (ch != '\n');
      } else if (ch != ' ') {
        token += ch;

        if (this.isValidToken(token)) {
          this.addToken(token);
          token = "";
        }
      }
    }

    this.addToken(token);

    return this._tokenStream;
  }


  addToken(tokenString: string) : void {
    if (tokenString != "") {

      let token : Token | undefined = keywords.get(tokenString);

      if (token != null) {
        this._tokenStream.push(token);
      } else {
        token = {
          operand: Operand.CONSTANT,
          value: tokenString,
          opCode: -1
        }

        this._tokenStream.push(token);
      }

    }
  }

  isValidToken(token: string) : boolean {
    return keywords.has(token);
  }
}
