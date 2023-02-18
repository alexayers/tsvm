

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


export const keywords : Map<string,Token> =new Map([
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
