# voxelchain-terrain-generator

The terrain generator used in [VoxelChain](https://voxelchain.app/)

### Documentation:
The documentation is auto-generated and can be found [here](https://voxelchain.github.io/voxelchain-terrain-generator/).

### Installation:
Package installation:
````
npm install voxelchain-terrain-generator
````

### Example:
````ts
import {TerrainGenerator} from "voxelchain-terrain-generator";

// Generate terrain
const lambda = 0.3;
const stateCount = 4; // Currently fixed to 4
const resolution = 128;
const terrain = new TerrainGenerator(stateCount, resolution);
// Generate the terrain
terrain.generate(lambda, () => {
  // Plug in a random number generator (can also be seeded)
  return Math.random();
});
// Do something with resulting terrain data
for (let z = 0; z < resolution; ++z) {
  for (let y = 0; y < resolution; ++y) {
    for (let x = 0; x < resolution; ++x) {
      const state = terrain.getState(x, y, z);
      // If state is positive, then it's a solid grid cell
      if (state > 0) {
        // Write cell into a 3d grid
      } else {
        // Cell is empty, write nothing
      }
    }
  }
}

````

### Preview:
<img src="https://i.imgur.com/SLfQvWm.png">

### Additional:
This tool is inspired by the idea of [Brent Werness](https://bitbucket.org/BWerness/), who found that in the diamond square algorithm, instead of averaging, you can apply CA rules, which leads to quite interesting results.
