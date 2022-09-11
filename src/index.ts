const CUBE_RULE = [[1, 1, 1], [0, 0, 0], [0, 0, 2], [0, 2, 0], [0, 2, 2], [2, 0, 0], [2, 0, 2], [2, 2, 0], [2, 2, 2]];

const FACE_0_RULE = [[0, 1, 1], [0, 0, 0], [0, 0, 2], [0, 2, 0], [0, 2, 2], [1, 1, 1]];
const FACE_1_RULE = [[1, 0, 1], [0, 0, 0], [0, 0, 2], [2, 0, 0], [2, 0, 2], [1, 1, 1]];
const FACE_2_RULE = [[1, 1, 0], [0, 0, 0], [0, 2, 0], [2, 0, 0], [2, 2, 0], [1, 1, 1]];
const FACE_3_RULE = [[2, 1, 1], [2, 0, 0], [2, 0, 2], [2, 2, 0], [2, 2, 2], [1, 1, 1]];
const FACE_4_RULE = [[1, 2, 1], [0, 2, 0], [0, 2, 2], [2, 2, 0], [2, 2, 2], [1, 1, 1]];
const FACE_5_RULE = [[1, 1, 2], [0, 0, 2], [0, 2, 2], [2, 0, 2], [2, 2, 2], [1, 1, 1]];

const EDGE_0_RULE = [[0, 0, 1], [0, 0, 0], [0, 0, 2], [0, 1, 1], [1, 0, 1]];
const EDGE_1_RULE = [[0, 1, 0], [0, 0, 0], [0, 2, 0], [0, 1, 1], [1, 1, 0]];
const EDGE_2_RULE = [[0, 2, 1], [0, 2, 0], [0, 2, 2], [0, 1, 1], [1, 2, 1]];
const EDGE_3_RULE = [[0, 1, 2], [0, 0, 2], [0, 2, 2], [0, 1, 1], [1, 1, 2]];
const EDGE_4_RULE = [[1, 0, 0], [0, 0, 0], [2, 0, 0], [1, 0, 1], [1, 1, 0]];
const EDGE_5_RULE = [[1, 0, 2], [0, 0, 2], [2, 0, 2], [1, 0, 1], [1, 1, 2]];
const EDGE_6_RULE = [[1, 2, 0], [0, 2, 0], [2, 2, 0], [1, 2, 1], [1, 1, 0]];
const EDGE_7_RULE = [[1, 2, 2], [0, 2, 2], [2, 2, 2], [1, 2, 1], [1, 1, 2]];
const EDGE_8_RULE = [[2, 0, 1], [2, 0, 0], [2, 0, 2], [2, 1, 1], [1, 0, 1]];
const EDGE_9_RULE = [[2, 1, 0], [2, 0, 0], [2, 2, 0], [2, 1, 1], [1, 1, 0]];
const EDGE_10_RULE = [[2, 2, 1], [2, 2, 0], [2, 2, 2], [2, 1, 1], [1, 2, 1]];
const EDGE_11_RULE = [[2, 1, 2], [2, 0, 2], [2, 2, 2], [2, 1, 1], [1, 1, 2]];

const FACE_6_RULE = [[2, 1, 1], [2, 0, 0], [2, 0, 2], [2, 2, 0], [2, 2, 2], [1, 1, 1], [5, 1, 1]];
const FACE_7_RULE = [[1, 0, 1], [0, 0, 0], [0, 0, 2], [2, 0, 0], [2, 0, 2], [1, 3, 1], [1, 1, 1]];
const FACE_8_RULE = [[1, 1, 0], [0, 0, 0], [0, 2, 0], [2, 0, 0], [2, 2, 0], [1, 1, 3], [1, 1, 1]];

/**
 * Type representing a user-defined RNG callback function
 */
type TRandomCallback = ()=> number;

/**
 * Class representing a cellular automata based terrain generator
 */
export default class TerrainGenerator {

  /**
   * The dimension of the terrain
   */
  private _dim: number = 0;
  /**
   * The amount of states
   */
  private _states: number = 0;
  /**
   * The resolution of the terrain
   */
  private _resolution: number = 0;

  /**
   * User-defined random number generator callback
   */
  private _randomCallback: TRandomCallback;

  private _cubeRule: number[][][][] = null;
  private _faceRule: number[][][][] = null;
  private _edgeRule: number[][][][] = null;
  private _outerFaceRule: number[][][][] = null;
  private _ruleBuffer: Uint8Array = null;
  private _state: Uint8Array = null;

  /**
   * Contructs a new terrain generator
   * @param states - The amount of states to use
   * @param resolution - The resolution of the terrain grid
   */
  public constructor(states: number, resolution: number) {
    this._dim = resolution + 1;
    this._resolution = resolution;
    this._states = states;
  }

  /**
   * Generate the terrain
   * @param lambda - Lambda threshold used when applying rules (0.0 - 1.0)
   * @param randomCallback - Optional custom random number generator
   */
  public generate(lambda: number, randomCallback: TRandomCallback): void {
    this._randomCallback = randomCallback;
    if (!(randomCallback instanceof Function)) {
      throw new ReferenceError(`Random number generator is required`);
    }
    this._ruleBuffer = new Uint8Array(this._states);
    this._cubeRule = Array(9).fill(0).map(() => Array(9).fill(0).map(() => Array(9).fill(0).map(() => Array(9).fill(0))));
    this._faceRule = Array(6).fill(0).map(() => Array(6).fill(0).map(() => Array(6).fill(0).map(() => Array(6).fill(0))));
    this._edgeRule = Array(5).fill(0).map(() => Array(5).fill(0).map(() => Array(5).fill(0).map(() => Array(5).fill(0))));
    this._outerFaceRule = Array(7).fill(0).map(() => Array(7).fill(0).map(() => Array(7).fill(0).map(() => Array(7).fill(0))));
    this._state = new Uint8Array(this._dim * this._dim * this._dim);
    this._generateRules(lambda);
    this._initState();
    this._evalState();
  }

  /**
   * Returns the cell state based on the provided coordinates
   * @param x - The grid-space x-axis position of the cell to read
   * @param y - The grid-space y-axis position of the cell to read
   * @param z - The grid-space z-axis position of the cell to read
   */
  public getState(x: number, y: number, z: number): number {
    const index = (z * this._dim * this._dim) + (y * this._dim) + x;
    return this._state[index | 0] | 0;
  }

  /**
   * Updates the cell state based on the provided coordinates and state value
   * @param x - The grid-space x-axis position of the cell to write
   * @param y - The grid-space y-axis position of the cell to write
   * @param z - The grid-space z-axis position of the cell to write
   * @param v - The cell state value to write
   */
  public setState(x: number, y: number, z: number, v: number): void {
    const index = (z * this._dim * this._dim) + (y * this._dim) + x;
    if (v > 0) this._state[index | 0] = v | 0;
  }

  /**
   * Returns a random seeded number
   * @internal
   */
  private _random(): number {
    return this._randomCallback();
  }

  /**
   * Generates rules based on the provided parameters
   * @param lambda - The lambda factor to use
   * @internal
   */
  private _generateRules(lambda: number): void {
    for (let aa = 0; aa < 9; ++aa) {
      for (let bb = 0; bb < 9 - aa; ++bb) {
        for (let cc = 0; cc < 9 - bb; ++cc) {
          for (let dd = 0; dd < 9 - cc; ++dd) {
            if ((aa === 0 && bb === 0 && cc === 0 && dd === 0) || (this._random() > lambda)) this._cubeRule[aa][bb][cc][dd] = 0;
            else this._cubeRule[aa][bb][cc][dd] = Math.floor(this._random() * this._states) + 1;
          }
        }
      }
    }
    for (let aa = 0; aa < 6; ++aa) {
      for (let bb = 0; bb < 6 - aa; ++bb) {
        for (let cc = 0; cc < 6 - bb; ++cc) {
          for (let dd = 0; dd < 6 - cc; ++dd) {
            if ((aa === 0 && bb === 0 && cc === 0 && dd === 0) || (this._random() > lambda)) this._faceRule[aa][bb][cc][dd] = 0;
            else this._faceRule[aa][bb][cc][dd] = Math.floor(this._random() * this._states) + 1;
          }
        }
      }
    }
    for (let aa = 0; aa < 5; ++aa) {
      for (let bb = 0; bb < 5 - aa; ++bb) {
        for (let cc = 0; cc < 5 - bb; ++cc) {
          for (let dd = 0; dd < 5 - cc; ++dd) {
            if ((aa === 0 && bb === 0 && cc === 0 && dd === 0) || (this._random() > lambda)) this._edgeRule[aa][bb][cc][dd] = 0;
            else this._edgeRule[aa][bb][cc][dd] = Math.floor(this._random() * this._states) + 1;
          }
        }
      }
    }
    for (let aa = 0; aa < 7; ++aa) {
      for (let bb = 0; bb < 7 - aa; ++bb) {
        for (let cc = 0; cc < 7 - bb; ++cc) {
          for (let dd = 0; dd < 7 - cc; ++dd) {
            if ((aa === 0 && bb === 0 && cc === 0 && dd === 0) || (this._random() > lambda)) this._outerFaceRule[aa][bb][cc][dd] = 0;
            else this._outerFaceRule[aa][bb][cc][dd] = Math.floor(this._random() * this._states) + 1;
          }
        }
      }
    }
  }

  /**
   * Initializes the initial state
   * @internal
   */
  private _initState(): void {
    for (let zz = 0; zz < this._dim; ++zz) {
      for (let yy = 0; yy < 1; ++yy) {
        for (let xx = 0; xx < this._dim; ++xx) {
          this.setState(xx, yy, zz, Math.floor(this._random() * this._states) + 1);
        }
      }
    }
  }

  /**
   * Evalulates the state
   * @internal
   */
  private _evalState(): void {
    const dim = Math.log2(this._resolution);
    for (let ii = 0; ii < dim; ++ii) {
      const w = this._resolution >> ii;
      this._evalStateDimension(w, w >> 1);
    }
  }

  /**
   * Evaluates a state dimension
   * @param w - State dimension
   * @param h - State half dimension
   * @internal
   */
  private _evalStateDimension(w: number, h: number): void {
    const d = [0, h, w, -h, -w, w + h];
    for (let zz = 0; zz < this._resolution; zz += w) {
      for (let yy = 0; yy < this._resolution; yy += w) {
        for (let xx = 0; xx < this._resolution; xx += w) {
          this._evalStateRule(CUBE_RULE, this._cubeRule, xx, yy, zz, d);
          this._evalStateRule(FACE_0_RULE, this._faceRule, xx, yy, zz, d);
          this._evalStateRule(FACE_1_RULE, this._faceRule, xx, yy, zz, d);
          this._evalStateRule(FACE_2_RULE, this._faceRule, xx, yy, zz, d);
          this._evalStateRule(FACE_3_RULE, this._faceRule, xx, yy, zz, d);
          this._evalStateRule(FACE_4_RULE, this._faceRule, xx, yy, zz, d);
          this._evalStateRule(FACE_5_RULE, this._faceRule, xx, yy, zz, d);
          this._evalStateRule(EDGE_0_RULE, this._edgeRule, xx, yy, zz, d);
          this._evalStateRule(EDGE_1_RULE, this._edgeRule, xx, yy, zz, d);
          this._evalStateRule(EDGE_2_RULE, this._edgeRule, xx, yy, zz, d);
          this._evalStateRule(EDGE_3_RULE, this._edgeRule, xx, yy, zz, d);
          this._evalStateRule(EDGE_4_RULE, this._edgeRule, xx, yy, zz, d);
          this._evalStateRule(EDGE_5_RULE, this._edgeRule, xx, yy, zz, d);
          this._evalStateRule(EDGE_6_RULE, this._edgeRule, xx, yy, zz, d);
          this._evalStateRule(EDGE_7_RULE, this._edgeRule, xx, yy, zz, d);
          this._evalStateRule(EDGE_8_RULE, this._edgeRule, xx, yy, zz, d);
          this._evalStateRule(EDGE_9_RULE, this._edgeRule, xx, yy, zz, d);
          this._evalStateRule(EDGE_10_RULE, this._edgeRule, xx, yy, zz, d);
          this._evalStateRule(EDGE_11_RULE, this._edgeRule, xx, yy, zz, d);
          this._evalStateRule(FACE_6_RULE, this._outerFaceRule, xx, yy, zz, d);
          this._evalStateRule(FACE_7_RULE, this._outerFaceRule, xx, yy, zz, d);
          this._evalStateRule(FACE_8_RULE, this._outerFaceRule, xx, yy, zz, d);
        }
      }
    }
  }

  /**
   * Evaluate a state rule
   * @param table - The rule table to use
   * @param rule - The rule buffer to use
   * @param x - The x-axis coordinate to evaluate at
   * @param y - The y-axis coordinate to evaluate at
   * @param z - The z-axis coordinate to evaluate at
   * @param dim - The dimension to evaluate
   * @internal
   */
  private _evalStateRule(table: number[][], rule: number[][][][], x: number, y: number, z: number, dim: number[]): void {
    const rules = this._ruleBuffer;
    rules.fill(0);
    // Read state
    for (let ii = 1; ii < table.length; ++ii) {
      const offset = table[ii];
      const srcX = x + dim[offset[0]];
      const srcY = y + dim[offset[1]];
      const srcZ = z + dim[offset[2]];
      if (
        (srcX < 0 || srcY < 0 || srcZ < 0) ||
        (srcX >= this._dim || srcY >= this._dim || srcZ >= this._dim)
      ) return;
      const state = this.getState(srcX, srcY, srcZ);
      if (state > 0) rules[state]++;
    }
    // Write state
    const dstX = x + dim[table[0][0]];
    const dstY = y + dim[table[0][1]];
    const dstZ = z + dim[table[0][2]];
    if (
      (dstX < 0 || dstY < 0 || dstZ < 0) ||
      (dstX >= this._dim || dstY >= this._dim || dstZ >= this._dim)
    ) return;
    const state = rule[rules[0]][rules[1]][rules[2]][rules[3]] | 0;
    this.setState(dstX, dstY, dstZ, state);
  }

}
