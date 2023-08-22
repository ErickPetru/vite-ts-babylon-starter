# Vite + TypeScript + Babylon.js

> Opinionated Vite starter template with TypeScript and Babylon.js.

## Features

- [Vite](https://vitejs.dev/) - Next generation front-end tooling.
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript.
- [Rome](https://rome.tools/) - Modern unified code linter and formatter.
- [Babylon.js](https://www.babylonjs.com/) - 3D Engine with WebGPU support.
- [Babylon.js Inspector](https://doc.babylonjs.com/toolsAndResources/inspector) - Ready to inspect Babylon scenes.
- [Babylon.js GUI](https://doc.babylonjs.com/features/featuresDeepDive/gui) - Pre-installed Babylon GUI library.
- [Babylon.js Loaders](https://doc.babylonjs.com/features/featuresDeepDive/importers) - Pre-installed Babylon loaders 
library (for `OBJ`, `STL`, and `glTF` formats).
- [Babylon.js Serializers](https://doc.babylonjs.com/features/featuresDeepDive/importers) - Pre-installed Babylon scene and mesh serializers.
- [Babylon.js Materials](https://doc.babylonjs.com/features/featuresDeepDive/materials) - Pre-installed Babylon advanced materials library.
- [Babylon.js Procedural Textures](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/proceduralTextures) - Pre-installed Babylon procedural textures library.
- [Babylon.js Post-Process](https://doc.babylonjs.com/features/featuresDeepDive/postProcesses) - Pre-installed Babylon post process effects library.
- [Babylon.js Havok](https://doc.babylonjs.com/features/featuresDeepDive/physics/havokPlugin) - Pre-installed Babylon integration for Havok physics library.

## Usage

As you probably guessed, first have [Node.js](https://nodejs.org/en) installed on your machine.

Then, fork this template to start your own project, clone it, and use the following commands:

```bash
# Install dependencies.
npm install

# Start the development server.
npm run dev
```

Good, now you have [http://127.0.0.1:3000/](http://127.0.0.1:3000/) ready. Have fun!

## No classes?

I found a couple of Babylon.js with TypeScript projects written in a class-based style. It's indeed expected that a object-oriented style will be common in the game development market, since it's usual with other engines which use languages like C# and C++.

However, since this starter template project would be focused on web developers jumping into the game development world, and also the fact that [Babylon.js Playground](https://playground.babylonjs.com/) uses a functional style instead, that's what we use here, following a composition approach.

If not convinced yet, take a read on more thoughts regarding inheritance versus composition [here](https://jordan-eckowitz.medium.com/javascript-composition-vs-inheritance-4b99234593a9) and [here](https://ui.dev/javascript-inheritance-vs-composition). In short, composition is more flexible, easier to maintain, and enforces less coupling of entities.

## Scenes

This starter template comes with two scenes.

The default one is a simple scene to get you started, directly based on the [Babylon.js Playground](https://playground.babylonjs.com/) default scene. It's located in the `src/scenes/PlaygroundDefault.ts` file and uses nothing external to it.

To show a more complex usage, there's also a scene in the `src/scenes/Space.ts` file. It uses files from other folders, creating a sky dome with a procedural texture using a GLSL shader, plus some stars fog created with a particles system using a local PNG asset. To see it live, use a query param: [http://127.0.0.1:3000/?space](http://127.0.0.1:3000/?space).

You can add more scenes in the `src/scenes` folder and import them in the `src/Game.ts` file. You can also remove the default files and folders if you don't need it, then creating your own preferred folders structure.

## Inspector

This starter project is pre-configured with the `@babylonjs/inspector` package, which is a great tool to inspect your scenes and meshes. To make things easier, there's a keyboard shortcut bound to <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>I</kbd>.

You need to be pointer locked inside the game for it to work, then just press the hotkey and you'll see the inspector panel. Press again to hide it.
