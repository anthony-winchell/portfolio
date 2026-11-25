// Each letter is a 5x7 bitmap: "#" is a filled pixel.
const glyphs = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  N: ["#...#", "##..#", "##..#", "#.#.#", "#..##", "#..##", "#...#"],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  W: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "##.##", "#...#"],
  I: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"],
  C: [".####", "#....", "#....", "#....", "#....", "#....", ".####"],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
};

const LETTER_WIDTH = 6; // five pixels plus a one-pixel gap
const LINE_HEIGHT = 9; // seven pixels plus a two-pixel gap
const lines = ["ANTHONY", "WINCHELL"];

const pixels = lines.flatMap((line, lineIndex) =>
  [...line].flatMap((letter, letterIndex) =>
    glyphs[letter].flatMap((row, y) =>
      [...row].flatMap((cell, x) =>
        cell === "#"
          ? [
              {
                x: letterIndex * LETTER_WIDTH + x,
                y: lineIndex * LINE_HEIGHT + y,
              },
            ]
          : [],
      ),
    ),
  ),
);

export const viewBox = "0 0 48 17";

// One path with a square per pixel, instead of hundreds of elements.
export const path = pixels.map(({ x, y }) => `M${x} ${y}h.9v.9h-.9z`).join("");
