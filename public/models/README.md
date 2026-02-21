# 3D Models

Each model lives in its own folder with its textures:

- `apple-vision-pro/apple-vision-pro.glb` (+ textures)
- `apple-macbook-pro/apple-macbook-pro.glb` (+ textures)
- `apple-mac-mini/apple-mac-mini.glb` (+ textures)

## Compressing

1. Place **original uncompressed** `.glb` files in this folder (flat).
2. Run: `npm run compress:models`
3. The script creates subfolders and outputs each model with its textures.

**If textures are broken:** Restore original models from backup first, then run the script.
