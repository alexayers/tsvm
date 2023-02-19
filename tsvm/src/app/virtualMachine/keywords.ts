

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


export enum PositionRule {

  REGISTER,
  REGISTER_OR_CONSTANT,
  CONSTANT
}

export interface InstructionRule {
  lineLength: number
  position1?: PositionRule
  position2?: PositionRule
}

export const instructionRules: Map<string, InstructionRule> = new Map<string, InstructionRule>([
  ["mov", {lineLength: 3, position1: PositionRule.REGISTER, position2: PositionRule.REGISTER_OR_CONSTANT}],
  ["lea", {lineLength: 3, position1: PositionRule.REGISTER}],

  ["add", {lineLength: 3, position1: PositionRule.REGISTER, position2: PositionRule.REGISTER_OR_CONSTANT}],
  ["sub", {lineLength: 3, position1: PositionRule.REGISTER, position2: PositionRule.REGISTER_OR_CONSTANT}],
  ["mul", {lineLength: 3, position1: PositionRule.REGISTER, position2: PositionRule.REGISTER_OR_CONSTANT}],
  ["div", {lineLength: 3, position1: PositionRule.REGISTER, position2: PositionRule.REGISTER_OR_CONSTANT}],
  ["inc", {lineLength: 3, position1: PositionRule.REGISTER}],
  ["dec", {lineLength: 3, position1: PositionRule.REGISTER}],

  ["and", {lineLength: 3, position1: PositionRule.REGISTER, position2: PositionRule.REGISTER_OR_CONSTANT}],
  ["or", {lineLength: 3, position1: PositionRule.REGISTER, position2: PositionRule.REGISTER_OR_CONSTANT}],
  ["not", {lineLength: 3, position1: PositionRule.REGISTER, position2: PositionRule.REGISTER_OR_CONSTANT}],
  ["xor", {lineLength: 3, position1: PositionRule.REGISTER, position2: PositionRule.REGISTER_OR_CONSTANT}],
  ["neg", {lineLength: 2, position1: PositionRule.REGISTER, position2: PositionRule.REGISTER_OR_CONSTANT}],

  ["cmp", {lineLength: 3, position1: PositionRule.REGISTER}],
  ["jmp", {lineLength: 2, position1: PositionRule.CONSTANT}],
  ["je", {lineLength: 2, position1: PositionRule.CONSTANT}],
  ["jne", {lineLength: 2, position1: PositionRule.CONSTANT}],
  ["jl", {lineLength: 2, position1: PositionRule.CONSTANT}],
  ["jg", {lineLength: 2, position1: PositionRule.CONSTANT}],
  ["jge", {lineLength: 2, position1: PositionRule.CONSTANT}],
  ["jle", {lineLength: 2, position1: PositionRule.CONSTANT}],

  ["push", {lineLength: 2, position1: PositionRule.REGISTER_OR_CONSTANT}],
  ["pop", {lineLength: 2, position1: PositionRule.REGISTER}],
  ["pusha", {lineLength: 1}],
  ["popa", {lineLength: 1}],

  ["call", {lineLength: 2, position1: PositionRule.CONSTANT}],
  ["ret", {lineLength: 1}],
  ["int", {lineLength: 2, position1: PositionRule.CONSTANT}],
  [".data", {lineLength: 1}],
]);
