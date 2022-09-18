import { AI } from "./ai";
import { Grid } from "./grid";
import { Tile } from "./tile";

const GRID_SIZE = 4;

export class Helper {
  constructor(tiles) {
    this.grid = this.encode(tiles);
    this.ai = new AI(this.grid);
  }

  think() {
    this.decode(this.grid);
    const best = this.ai.getBest();
    return this.ai.translate(best.move);
  }

  move(direction) {
    this.grid.move(direction);
  }

  decode(grid) {
    var cells = grid.cells.map((row) =>
      row.map((cell) => {
        if (!cell) return 0;
        return cell.value;
      })
    );
    cells = cells[0].map((_, colIndex) => cells.map((row) => row[colIndex]));
    // console.log(cells);
  }

  encode(tiles) {
    let newGrid = new Grid(GRID_SIZE);
    for (let { position, value } of tiles) {
      const [x, y] = position;
      newGrid.cells[x][y] = new Tile({ x, y }, value);
    }
    return newGrid;
  }
}
