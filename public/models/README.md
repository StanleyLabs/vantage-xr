# 3D Models

Place your `.glb` files and their textures here (all in the same folder):

- `apple-vision-pro.glb`
- `apple-macbook-pro.glb`
- `apple-mac-mini.glb`

Keep each model’s `.bin` and texture files in this folder so paths resolve correctly. Then compress with DRACO + WebP:

```bash
npm run compress:models
```

This applies DRACO mesh compression and WebP texture compression. Overwrites originals—back up first if needed.
