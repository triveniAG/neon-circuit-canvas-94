# Camera & AR Scanner - Circuit Simulator

A robust camera + AR system for scanning and analyzing circuit boards.

## Features

- **Camera Device Picker**: Automatically detects and lists available cameras
- **Error Handling**: User-friendly messages for all common camera errors
- **AR Overlays**: Animated scanning frames and detection highlights
- **Board Detection**: Mock circuit board detection (ready for OpenCV.js integration)
- **Gyroscope Parallax**: Mobile motion effects with mouse fallback
- **Capture & Crop**: Full frame or region capture for analysis

## Running Locally

### Development Server (Recommended)

```bash
# Install dependencies
npm install

# Start Vite dev server (localhost works for camera)
npm run dev
```

Camera access works on:
- `http://localhost:*` (any port)
- `https://*` (any HTTPS URL)

### HTTPS for Remote Testing

Option 1: **ngrok** (simplest)
```bash
# Install ngrok: https://ngrok.com/download
ngrok http 5173
# Use the https:// URL provided
```

Option 2: **Vite HTTPS plugin**
```bash
npm install -D @vitejs/plugin-basic-ssl
```

Add to `vite.config.ts`:
```ts
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [basicSsl()],
})
```

## Camera Permissions

### Troubleshooting Permission Issues

| Error | Cause | Solution |
|-------|-------|----------|
| NotAllowedError | User denied permission | Click camera icon in URL bar, allow access |
| NotFoundError | No camera detected | Connect a camera, check device manager |
| NotReadableError | Camera in use | Close other apps using camera |
| SecurityError | Not HTTPS | Use localhost or HTTPS URL |

### Browser-Specific Notes

**Chrome**: 
- Camera permissions can be reset in `chrome://settings/content/camera`
- Incognito mode asks for permission each time

**Firefox**:
- Permissions stored per-origin in `about:preferences#privacy`

**Safari (iOS)**:
- Requires user gesture to start camera
- iOS 14.3+ requires HTTPS even for getUserMedia

## Manual Test Steps

### Test 1: Camera Permission Flow
1. Open the app in a new incognito window
2. Navigate to Scanner page
3. Click "Use Camera"
4. Verify permission prompt appears
5. Allow → camera should start
6. Deny → error UI should appear with suggestions

### Test 2: Multiple Cameras
1. Connect multiple cameras (or use virtual camera)
2. Start camera
3. Click "Switch" button
4. Verify device picker shows all cameras
5. Select different camera → video should switch

### Test 3: Error Recovery
1. Start camera
2. Disconnect camera mid-stream
3. Verify error handling activates
4. Reconnect camera
5. Click "Try Again" → should recover

### Test 4: Capture Flow
1. Start camera
2. Click "Capture" → full frame captured
3. Click "Detect Board" → region detected
4. Click "Capture Region" → cropped capture
5. Verify image appears in analysis view

## Architecture

```
src/
├── hooks/
│   ├── useCamera.ts          # Camera lifecycle & capture
│   └── useDeviceMotion.ts    # Gyroscope/mouse parallax
├── components/
│   ├── CameraScanner.tsx     # Main scanner component
│   ├── AROverlay.tsx         # Scanning effects & detection UI
│   └── CameraDevicePicker.tsx # Device selection modal
└── pages/
    └── ScanPage.tsx          # Integration point
```

## Production Considerations

1. **HTTPS Required**: Camera APIs require secure context in production
2. **Permissions UX**: Request camera on user action, not page load
3. **Memory**: Call `stopCamera()` when component unmounts
4. **iOS Safari**: Requires `playsinline` attribute on video element
5. **Privacy**: Never store camera streams; only capture on user action

## Browser Support

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ✅ 53+ | ✅ 53+ |
| Firefox | ✅ 36+ | ✅ 36+ |
| Safari | ✅ 11+ | ✅ 11+ |
| Edge | ✅ 12+ | ✅ 12+ |

## Future Enhancements

- [ ] OpenCV.js integration for real board detection
- [ ] WebXR depth sensing for AR anchoring
- [ ] Torch/flashlight control
- [ ] Video recording for documentation
- [ ] QR code scanning for component lookup
