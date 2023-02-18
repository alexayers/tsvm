

export enum Operand {
  REGISTER,
  CONSTANT,
  INSTRUCTION,
  SEGMENT
}

export interface Token {
  operand: Operand
  value: string
}


const keywords : Map<string,Token> =new Map([
  ["mov", {operand: Operand.INSTRUCTION, value: "mov"}],
  ["lea",{operand: Operand.INSTRUCTION,value: "lea"}],

  ["add",{operand: Operand.INSTRUCTION,value: "add"}],
  ["sub",{operand: Operand.INSTRUCTION,value: "sub"}],
  ["mul",{operand: Operand.INSTRUCTION,value: "mul"}],
  ["div",{operand: Operand.INSTRUCTION,value: "div"}],
  ["inc",{operand: Operand.INSTRUCTION,value: "inc"}],
  ["dec",{operand: Operand.INSTRUCTION,value: "dec"}],


  ["and",{operand: Operand.INSTRUCTION,value: "and"}],
  ["or",{operand: Operand.INSTRUCTION,value: "or"}],
  ["not",{operand: Operand.INSTRUCTION,value: "not"}],
  ["xor",{operand: Operand.INSTRUCTION,value: "xor"}],
  ["neg",{operand: Operand.INSTRUCTION,value: "neg"}],

  ["cmp",{operand: Operand.INSTRUCTION,value: "jmp"}],
  ["jmp",{operand: Operand.INSTRUCTION,value: "jmp"}],
  ["je",{operand: Operand.INSTRUCTION,value: "je"}],
  ["jne",{operand: Operand.INSTRUCTION,value: "jne"}],
  ["jl",{operand: Operand.INSTRUCTION,value: "jl"}],
  ["jg",{operand: Operand.INSTRUCTION,value: "jg"}],
  ["jge",{operand: Operand.INSTRUCTION,value: "jge"}],
  ["jle",{operand: Operand.INSTRUCTION,value: "jle"}],

  ["push",{operand: Operand.INSTRUCTION,value: "push"}],
  ["pop",{operand: Operand.INSTRUCTION,value: "pop"}],
  ["pusha",{operand: Operand.INSTRUCTION,value: "pusha"}],
  ["popa",{operand: Operand.INSTRUCTION,value: "popa"}],

  ["call",{operand: Operand.INSTRUCTION,value: "call"}],
  ["ret",{operand: Operand.INSTRUCTION,value: "ret"}],
  ["int",{operand: Operand.INSTRUCTION,value: "int"}],


  ["ax",{operand: Operand.REGISTER,value: "ax"}],
  ["bx",{operand: Operand.REGISTER,value: "bx"}],
  ["cx",{operand: Operand.REGISTER,value: "cx"}],
  ["dx",{operand: Operand.REGISTER,value: "dx"}],
  ["ix",{operand: Operand.REGISTER,value: "ix"}],
  ["sp",{operand: Operand.REGISTER,value: "sp"}],
  ["ip",{operand: Operand.REGISTER,value: "ip"}],

  [".code",{operand: Operand.SEGMENT,value: ".code"}],
  [".data",{operand: Operand.SEGMENT,value: ".data"}],

]);


export default class Lexer {

  private _tokenStream: Array<Token> = [];

  tokenize(code : string)  : Array<Token> {

    let token: string = "";

    for (let i = 0; i < code.length; i++) {

      let ch : string = code[i];

      if (ch == '\n') {
        this.addToken(token);
        token = "";
      } else if (ch == ';') {
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
          value: tokenString
        }

        this._tokenStream.push(token);
      }

    }
  }

  isValidToken(token: string) : boolean {
    return keywords.has(token);
  }
}
