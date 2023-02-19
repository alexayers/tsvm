

export enum Operand {
  REGISTER,
  CONSTANT,
  INSTRUCTION,
  SEGMENT,
  MEMORY_LOCATION,
  NUMBER
}

export interface Token {
  operand: Operand
  value: string

  opCode: number
}

// Doing this in case I want to add instructions later and don't want to deal with manually maintaining numbers.

let opCodeIdx : number = 0;

function assignOpCode() : number {
  opCodeIdx++;
  return opCodeIdx;
}

export const keywords : Map<string,Token> =new Map([
  ["mov", {operand: Operand.INSTRUCTION, value: "mov", opCode:assignOpCode()}],
  ["lea",{operand: Operand.INSTRUCTION,value: "lea", opCode:assignOpCode()}],

  ["add",{operand: Operand.INSTRUCTION,value: "add", opCode:assignOpCode()}],
  ["sub",{operand: Operand.INSTRUCTION,value: "sub", opCode:assignOpCode()}],
  ["mul",{operand: Operand.INSTRUCTION,value: "mul", opCode:assignOpCode()}],
  ["div",{operand: Operand.INSTRUCTION,value: "div", opCode:assignOpCode()}],
  ["inc",{operand: Operand.INSTRUCTION,value: "inc", opCode:assignOpCode()}],
  ["dec",{operand: Operand.INSTRUCTION,value: "dec", opCode:assignOpCode()}],


  ["and",{operand: Operand.INSTRUCTION,value: "and", opCode:assignOpCode()}],
  ["or",{operand: Operand.INSTRUCTION,value: "or", opCode:assignOpCode()}],
  ["not",{operand: Operand.INSTRUCTION,value: "not", opCode:assignOpCode()}],
  ["xor",{operand: Operand.INSTRUCTION,value: "xor", opCode:assignOpCode()}],
  ["neg",{operand: Operand.INSTRUCTION,value: "neg", opCode:assignOpCode()}],

  ["cmp",{operand: Operand.INSTRUCTION,value: "jmp", opCode:assignOpCode()}],
  ["jmp",{operand: Operand.INSTRUCTION,value: "jmp", opCode:assignOpCode()}],
  ["je",{operand: Operand.INSTRUCTION,value: "je", opCode:assignOpCode()}],
  ["jne",{operand: Operand.INSTRUCTION,value: "jne", opCode:assignOpCode()}],
  ["jl",{operand: Operand.INSTRUCTION,value: "jl", opCode:assignOpCode()}],
  ["jg",{operand: Operand.INSTRUCTION,value: "jg",opCode:assignOpCode()}],
  ["jge",{operand: Operand.INSTRUCTION,value: "jge", opCode:assignOpCode()}],
  ["jle",{operand: Operand.INSTRUCTION,value: "jle", opCode:assignOpCode()}],

  ["push",{operand: Operand.INSTRUCTION,value: "push", opCode:assignOpCode()}],
  ["pop",{operand: Operand.INSTRUCTION,value: "pop", opCode:assignOpCode()}],
  ["pusha",{operand: Operand.INSTRUCTION,value: "pusha", opCode:assignOpCode()}],
  ["popa",{operand: Operand.INSTRUCTION,value: "popa", opCode:assignOpCode()}],

  ["call",{operand: Operand.INSTRUCTION,value: "call", opCode:assignOpCode()}],
  ["ret",{operand: Operand.INSTRUCTION,value: "ret", opCode:assignOpCode()}],
  ["int",{operand: Operand.INSTRUCTION,value: "int", opCode:assignOpCode()}],

  [".code",{operand: Operand.SEGMENT,value: ".code", opCode:assignOpCode()}],
  [".data",{operand: Operand.SEGMENT,value: ".data", opCode:assignOpCode()}],

  ["ax",{operand: Operand.REGISTER,value: "ax", opCode:assignOpCode()}],
  ["bx",{operand: Operand.REGISTER,value: "bx", opCode:assignOpCode()}],
  ["cx",{operand: Operand.REGISTER,value: "cx", opCode:assignOpCode()}],
  ["dx",{operand: Operand.REGISTER,value: "dx", opCode:assignOpCode()}],
  ["ix",{operand: Operand.REGISTER,value: "ix", opCode:assignOpCode()}],
  ["sp",{operand: Operand.REGISTER,value: "sp", opCode:assignOpCode()}],
  ["ip",{operand: Operand.REGISTER,value: "ip", opCode:assignOpCode()}]



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

export interface ByteCode {

  op1: number,
  op2: number,
  op3: number
  instructionSize: number
  op2Operand: Operand | undefined
  op3Operand: Operand  | undefined
}



