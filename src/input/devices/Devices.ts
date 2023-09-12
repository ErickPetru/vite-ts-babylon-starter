
enum GamePad {
  // Face Buttons
  FaceButtonBottom = 0, // A
  FaceButtonRight = 1, // B
  FaceButtonLeft = 2, // X
  FaceButtonTop = 3, // Y
  // Shoulder Buttons
  LeftShoulder = 4, // LB
  RightShoulder = 5, // RB
  
  // Special Buttons
  Select = 8, 
  Start = 9, 

  // Sticks Clicks
  LeftStickButton = 10,
  RightStickButton = 11
}

enum GamePadAxis {
  // Triggers
  LeftTrigger = "LeftTrigger", // LT
  RightTrigger = "RightTrigger", // RT

  // Sticks Axes
  LeftStickX = "LeftStickX",
  LeftStickY = "LeftStickY",
  RightStickX = "RightStickX",
  RightStickY = "RightStickY",

  DPadUp = "DPadUp",
  DPadDown = "DPadDown",
  DPadLeft = "DPadLeft",
  DPadRight = "DPadRight"
}

enum Mouse {
  LeftButton = 0,
  MiddleButton = 1,
  RightButton = 2,
  AltTop = 3,
  AltBack = 4,
}

enum MouseAxis {
  MouseX = "MouseX",
  MouseY = "MouseY",
  Wheel = "MouseWheel"
}

enum Keyboard {
  A = "a",
  B = "b",
  C = "c",
  D = "d",
  E = "e",
  F = "f",
  G = "g",
  H = "h",
  I = "i",
  J = "j",
  K = "k",
  L = "l",
  M = "m",
  N = "n",
  O = "o",
  P = "p",
  Q = "q",
  R = "r",
  S = "s",
  T = "t",
  U = "u",
  V = "v",
  W = "w",
  X = "x",
  Y = "y",
  Z = "z",
  _0 = "0",
  _1 = "1",
  _2 = "2",
  _3 = "3",
  _4 = "4",
  _5 = "5",
  _6 = "6",
  _7 = "7",
  _8 = "8",
  _9 = "9",
  Shift = "Shift",
  Control = "Control",
  Alt = "Alt",
  Tab = "\t",
  CapsLock = "CapsLock",
  Space = " ",
  Enter = "Enter",
  Escape = "Escape",
  F1 = "F1",
  F2 = "F2",
  F3 = "F3",
  F4 = "F4",
  F5 = "F5",
  F6 = "F6",
  F7 = "F7",
  F8 = "F8",
  F9 = "F9",
  F10 = "F10",
  F11 = "F11",
  F12 = "F12",
}


export { GamePad, GamePadAxis, Keyboard, Mouse, MouseAxis };
