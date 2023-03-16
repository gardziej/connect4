export const getRandomizer: (bottom: number, top: number) => () => number = (bottom: number, top: number) => {
  return () => Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}

export const randomInt: (bottom: number, top: number) => number = (bottom: number, top: number) => Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;

export const randomBoolean: () => boolean = () => Math.random() < 0.5;

export const getRandomColor = (): string => {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}